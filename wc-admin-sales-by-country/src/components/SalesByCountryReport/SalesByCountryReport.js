import {Component as ReactComponent, Fragment} from "@wordpress/element";
import {__} from "@wordpress/i18n";
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from "@woocommerce/date";
import apiFetch from "@wordpress/api-fetch";
import {ChartPlaceholder, ReportFilters, SummaryList, SummaryListPlaceholder, SummaryNumber, TablePlaceholder} from "@woocommerce/components";
import {default as Currency} from "@woocommerce/currency";
import {CURRENCY as storeCurrencySetting} from "@woocommerce/settings";
import {CountryChart} from "../CountryChart/CountryChart";
import {CountryTable} from "../CountryTable/CountryTable"

export class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        const dateQuery = this.createDateQuery(this.props.query);
        const storeCurrency = new Currency(storeCurrencySetting);

        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            allCountries: [],
            data: { loading: true }
        };

        this.handleDateChange = this.handleDateChange.bind(this);

        this.fetchData(this.state.dateQuery);
    }

    /**
     * Parses a query and returns an object representing a date query that is used to handle date range changes.
     */
    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    /**
     * Given a date query, returns a set of URL-encoded concatenated query parameters, including start and end dates with timestamps.
     */
    getQueryParameters(dateQuery) {
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, "start"));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, "end"));
        return `&after=${afterDate}&before=${beforeDate}&interval=day&order=asc&per_page=100&_locale=user`;
    }

    /**
     * Sends data requests to WooCommerce REST API endpoints, initiates processing of the data returned from the endpoints, then updates component state with the resulting data.
     */
    fetchData(dateQuery) {

        if(!this.state.data.loading) this.setState({data: {loading: true}});

        const endPoints = {
            "countries": "/wc/v3/data/countries?_fields=code,name",
            "orders": "/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales",
            "customers": "/wc-analytics/reports/customers?_fields=id,country"
        };

        const queryParameters = this.getQueryParameters(dateQuery);
        const countriesPath = endPoints.countries;
        const ordersPath = endPoints.orders + queryParameters;
        const customersPath = endPoints.customers + queryParameters;

        Promise.all([
            this.state.allCountries.length === 0 ? apiFetch({path: countriesPath}) : Promise.resolve(this.state.allCountries),
            apiFetch({path: ordersPath}),
            apiFetch({path: customersPath})
        ])
            .then(([countries, orders, customers]) => {
                const data = this.prepareData(countries, orders, customers);
                this.setState({data: data, allCountries: countries})
            })
            .catch(err => console.log(err));
    }

    /**
     * Transforms data received from REST API endpoints to a format suitable for saving into component state.
     */
    prepareData(countries, orders, customers) {
        let data;

        if (orders.length > 0) {
            const ordersWithCountries = this.getOrdersWithCountries(orders, customers, countries);
            data = this.getPerCountryData(ordersWithCountries);

            data.totals = {
                total_sales: this.getTotalNumber(data.countries, "sales"),
                orders: this.getTotalNumber(data.countries, "orders"),
                countries: data.countries.length,
            };

            data.countries = data.countries.map(country => {
                country.sales_percentage = Math.round(country.sales / data.totals.total_sales * 10000) / 100;
                country.average_order_value = country.sales / country.orders;
                return country;
            });
        } else {
            data = {
                countries: [],
                totals: {
                    total_sales: 0,
                    orders: 0,
                    countries: 0
                }
            }
        }

        data.loading = false;

        return data;
    }

    /**
     * Takes an array of orders with information on which countries they were made from, and transforms it into an array of countries. For each country, calculates totals for sales and orders.
     */
    getPerCountryData(ordersWithCountries) {
        return ordersWithCountries.reduce((accumulator, currentObject) => {
            const countryCode = currentObject['country_code'];

            if (!accumulator.countries) accumulator.countries = [];

            if (!accumulator.countries.find(item => item.country_code === countryCode)) {
                const countryObjectTemplate = {
                    "country": currentObject['country'],
                    "country_code": countryCode,
                    "sales": 0,
                    "sales_percentage": 0,
                    "orders": 0,
                    "average_order_value": 0
                };
                accumulator.countries.push(countryObjectTemplate)
            }

            const countryIndexInAccumulator = accumulator.countries.findIndex(item => item.country_code === countryCode);
            accumulator.countries[countryIndexInAccumulator].sales += currentObject.total_sales;
            accumulator.countries[countryIndexInAccumulator].orders++;

            return accumulator;
        }, {});
    }

    /**
     * Given an array of orders, looks up the full country name for each order and saves it to a new field.
     */
    getOrdersWithCountries(orders, customers, countries) {
        return orders.map(order => {
            order.country_code = customers.find(item => item.id === order.customer_id).country;

            const country = countries.find(item => item.code === order.country_code);
            order.country = country ? country.name : __("Unknown country", "wc-admin-sales-by-country");

            return order;
        });
    }

    /**
     * Calculates the total for a given numerical property (such as sales or orders), and returns it after rounding.
     */
    getTotalNumber(data, property) {
        const propertyTotal = data.reduce((accumulator, currentObject) => accumulator + currentObject[property], 0);
        return Math.round(propertyTotal * 100) / 100;
    }

    /**
     * When a new date range is selected in the ReportFilters component, initiates a new set of REST API data requests to get data for the new date range.
     */
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
            currency={this.state.currency}
            isoDateFormat={isoDateFormat}
            onDateSelect={this.handleDateChange}/>;

        const tableHeaders = [
            {key: 'country', label: __("Country", "wc-admin-sales-by-country"), isLeftAligned: true, isSortable: true, required: true},
            {key: "sales", label: __("Sales", "wc-admin-sales-by-country"), isSortable: true, isNumeric: true},
            {key: "sales_percentage", label: __("Sales (percentage)", "wc-admin-sales-by-country"), isSortable: true, isNumeric: true},
            {key: "orders", label: __("Number of Orders", "wc-admin-sales-by-country"), isSortable: true, isNumeric: true},
            {key: "average_order_value", label: __("Average Order Value", "wc-admin-sales-by-country"), isSortable: true, isNumeric: true},
        ];

        if (this.state.data.loading) {
            return <Fragment>
                {reportFilters}
                <SummaryListPlaceholder numberOfItems={3}/>
                <ChartPlaceholder height={300}/>
                <TablePlaceholder caption={__("Top Countries", "wc-admin-sales-by-country")}
                                  headers={tableHeaders}/>
            </Fragment>
        } else {
            const {data, currency, dateQuery} = this.state;

            return <Fragment>
                {reportFilters}
                <SummaryList>
                    {() => [
                        <SummaryNumber key="sales"
                                       value={currency.render(data.totals.total_sales)}
                                       label={__("Total Sales", "wc-admin-sales-by-country")}/>,
                        <SummaryNumber key="countries"
                                       value={data.totals.countries}
                                       label={__("Countries", "wc-admin-sales-by-country")}/>,
                        <SummaryNumber key="orders"
                                       value={data.totals.orders}
                                       label={__("Orders", "wc-admin-sales-by-country")}/>
                    ]}
                </SummaryList>
                <CountryChart chartData={data.countries}
                              dateRange={dateQuery.primaryDate.range}
                              currency={currency}/>
                <CountryTable countryData={data.countries}
                              totals={data.totals}
                              currency={currency}
                              headers={tableHeaders}/>
            </Fragment>
        }
    }
}