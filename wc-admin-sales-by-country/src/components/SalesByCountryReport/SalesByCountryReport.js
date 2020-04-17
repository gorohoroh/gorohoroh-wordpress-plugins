import {Component as ReactComponent, Fragment} from "@wordpress/element";
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery} from "@woocommerce/date";
import apiFetch from "@wordpress/api-fetch";
import {ChartPlaceholder, ReportFilters, SummaryList, SummaryListPlaceholder, SummaryNumber, TablePlaceholder} from "@woocommerce/components";
import {default as Currency} from "@woocommerce/currency";
import {CURRENCY as storeCurrencySetting} from "@woocommerce/settings";
import {CountryChart} from "../CountryChart/CountryChart";
import {CountryTable} from "../CountryTable/CountryTable"

export class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        const {path, query} = this.props;
        const dateQuery = this.createDateQuery(query);
        const storeCurrency = new Currency(storeCurrencySetting);

        this.state = {
            dateQuery: dateQuery,
            path: path,
            currency: storeCurrency,
            data: { loading: true }
        };

        this.handleDateChange = this.handleDateChange.bind(this);

        this.fetchData(this.state.dateQuery);
    }

    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    getQueryParameters(dateQuery) {
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, "start"));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, "end"));
        return `&after=${afterDate}&before=${beforeDate}&interval=day&order=asc&per_page=100&_locale=user`;
    }

    fetchData(dateQuery) {

        if(!this.state.data.loading) this.setState({data: {loading: true}});

        const endPoints = {
            "countries": "/wc/v3/data/countries?_fields=code,name",
            "orders": "/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales",
            "customers": "/wc-analytics/reports/customers?_fields=id,country"
        };

        const queryParameters = this.getQueryParameters(dateQuery);
        const countriesPath = endPoints.countries + queryParameters;
        const ordersPath = endPoints.orders + queryParameters;
        const customersPath = endPoints.customers + queryParameters;

        Promise.all([
            apiFetch({path: countriesPath}),
            apiFetch({path: ordersPath}),
            apiFetch({path: customersPath})
        ])
            .then(([countries, orders, customers]) => {
                const data = this.prepareData(countries, orders, customers);
                this.setState({data: data})
            })
            .catch(err => console.log(err));
    }

    prepareData(countries, orders, customers) {
        const ordersWithCountries = this.getOrdersWithCountries(orders, customers, countries);
        let data = this.getPerCountryData(ordersWithCountries);

        data.totals = {
            total_sales: this.getTotalNumber(data.countries, "sales"),
            orders: this.getTotalNumber(data.countries, "orders"),
            countries: data.countries.length,
        };

        data.countries = data.countries.map(country => {
            country.stats.sales_percentage = Math.round(country.stats.sales / data.totals.total_sales * 10000) / 100;
            country.stats.average_order_value = country.stats.sales / country.stats.orders;
            return country;
        });

        data.loading = false;

        return data;
    }

    getPerCountryData(ordersWithCountries) {
        return ordersWithCountries.reduce((accumulator, currentObject) => {
            const countryCode = currentObject['country_code'];

            if (!accumulator.countries) accumulator.countries = [];

            if (!accumulator.countries.find(item => item.country_code === countryCode)) {
                const countryObjectTemplate = {
                    "country": currentObject['country'],
                    "country_code": countryCode,
                    "stats": {
                        "sales": 0,
                        "sales_percentage": 0,
                        "orders": 0,
                        "average_order_value": 0
                    }
                };
                accumulator.countries.push(countryObjectTemplate)
            }

            const countryIndexInAccumulator = accumulator.countries.findIndex(item => item.country_code === countryCode);
            accumulator.countries[countryIndexInAccumulator].stats.sales += currentObject.total_sales;
            accumulator.countries[countryIndexInAccumulator].stats.orders++;

            return accumulator;
        }, {});
    }

    getOrdersWithCountries(orders, customers, countries) {
        return orders.map(order => {
            order.country_code = customers.find(item => item.id === order.customer_id).country;

            const country = countries.find(item => item.code === order.country_code);
            order.country = country ? country.name : "Unknown country";

            return order;
        });
    }

    getTotalNumber(data, property) {
        const propertyTotal = data.reduce((accumulator, currentObject) => accumulator + currentObject.stats[property], 0);
        return Math.round(propertyTotal * 100) / 100;
    }

    handleDateChange(newQuery) {
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
        this.fetchData(newDateQuery);
    }

    render() {

        const reportFilters =
            <ReportFilters
            dateQuery={this.state.dateQuery}
            query={this.props.query}
            path={this.props.path}
            onDateSelect={this.handleDateChange}/>;

        if (this.state.data.loading) {
            return <Fragment>
                {reportFilters}
                <SummaryListPlaceholder numberOfItems={3}/>
                <ChartPlaceholder height={300}/>
                <TablePlaceholder caption="Top Countries" headers={[
                    {key: "country", label: "Country"},
                    {key: "sales", label: "Sales"},
                    {key: "sales_percentage", label: "Sales (percentage)"},
                    {key: "orders", label: "Number of Orders"},
                    {key: "average_order_value", label: "Average Order Value"},
                ]}/>
            </Fragment>
            }
        else
            {
                const {data, currency, dateQuery} = this.state;

                return <Fragment>
                    {reportFilters}
                    <SummaryList>
                        {() => [
                            <SummaryNumber key="sales" value={currency.render(data.totals.total_sales)} label="Total Sales"/>,
                            <SummaryNumber key="countries" value={data.totals.countries} label="Countries"/>,
                            <SummaryNumber key="orders" value={data.totals.orders} label="Orders"/>
                        ]}
                    </SummaryList>
                    <CountryChart chartData={data.countries} dateRange={dateQuery.primaryDate.range} currency={currency}/>
                    <CountryTable countryData={data.countries} totals={data.totals} currency={currency}/>
                </Fragment>
        }
    }
}