import './SalesByCountryReport.scss';
import {Component as ReactComponent, Fragment} from "@wordpress/element";
import {getCurrentDates, getDateParamsFromQuery} from "@woocommerce/date";
import apiFetch from "@wordpress/api-fetch";
import {Chart, ReportFilters, SummaryList, SummaryNumber, TableCard} from "@woocommerce/components";
import {chartData} from "./mockData";
import {default as Currency} from "@woocommerce/currency";
import {CURRENCY as storeCurrencySetting} from "@woocommerce/settings";

export class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        const {path, query} = this.props;
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        const dateQuery = {period, compare, before, after, primaryDate, secondaryDate};

        const storeCurrency = new Currency(storeCurrencySetting);

        this.state = {
            dateQuery: dateQuery,
            path: path,
            currency: storeCurrency
        };

        const defaultQueryParameters =
            // this.addQueryParameter(dateQuery, "after") +
            "&after=2020-03-01T00%3A00%3A00" +
            // this.addQueryParameter(dateQuery,"before") +
            "&before=2020-03-31T23%3A59%3A59" +
            "&interval=day" +
            "&order=asc" +
            "&per_page=100" +
            "&_locale=user";

        const endPoints = {
            "countries": "/wc/v3/data/countries?_fields=code,name" + defaultQueryParameters,
            "orders": "/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales" + defaultQueryParameters,
            "customers": "/wc-analytics/reports/customers?_fields=id,country" + defaultQueryParameters
        };

        Promise.all([
            apiFetch({path: endPoints.countries}),
            apiFetch({path: endPoints.orders}),
            apiFetch({path: endPoints.customers})
        ])
            .then(([countries, orders, customers]) => {
                const data = this.prepareData(countries, orders, customers);
                this.setState({data: data})
            })
            .catch(err => console.log(err));

        // TODO fetch only countries represented in the current date range's set of orders - see discussion at https://a8c.slack.com/archives/GTNUWF8MT/p1585756629003400
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

    addQueryParameter(dateQuery, parameterName) {
        const parameterInDateQuery = dateQuery[parameterName];
        return parameterInDateQuery ? `&${parameterName}=${parameterInDateQuery}` : '';
    }

    render() {
        if (!this.state.data) {
            return <p>Waiting for data...</p>
        } else {

            const {data, currency} = this.state;
            const {total_sales, orders, countries} = data.totals;

            const tableData = {
                headers: [],
                rows: [],
                summary: []
            };

            tableData.headers = [
                {key: 'country', label: 'Country'},
                {key: 'sales-absolute', label: 'Sales'},
                {key: 'sales-percent', label: 'Sales (percentage)'},
                {key: 'orders', label: 'Number of Orders'},
                {key: 'avg-order', label: 'Average Order Value'},
            ];

            data.countries.map(item => {
                const row = [
                    {
                        display: item.country,
                        value: item.country
                    },
                    {
                        display: currency.render(item.stats.sales),
                        value: item.stats.sales
                    },
                    {
                        display: `${item.stats.sales_percentage}%`,
                        value: item.stats.sales_percentage
                    },
                    {
                        display: item.stats.orders,
                        value: item.stats.orders
                    },
                    {
                        display: currency.render(item.stats.average_order_value),
                        value: item.stats.average_order_value
                    },
                ];
                tableData.rows.push(row);
            });

            tableData.summary = [
                {key: "sales", label: 'Sales in this period', value: currency.render(total_sales)},
                {key: "orders", label: 'Orders in this period', value: orders},
                {key: "countries", label: 'Countries in this period', value: countries},
            ];

            return <Fragment>
                <ReportFilters
                    dateQuery={this.state.dateQuery}
                    query={this.props.query}
                    path={this.props.path}
                    // report="revenue"
                    // filters={filters}
                    // advancedFilters={advancedFilters}
                />
                <SummaryList>
                    {() => [
                        <SummaryNumber key="sales" value={currency.render(total_sales)} label="Total Sales"/>,
                        <SummaryNumber key="countries" value={countries} label="Countries"/>,
                        <SummaryNumber key="orders" value={orders} label="Orders"/>
                    ]}
                </SummaryList>
                <Chart chartType="bar" data={chartData} title="Sales by Country" layout="item-comparison"/>
                <TableCard
                    className="table_top_countries"
                    title="Top Countries"
                    rows={tableData.rows}
                    headers={tableData.headers}
                    query={{page: 2}}
                    rowsPerPage={7}
                    totalRows={10}
                    summary={tableData.summary}
                />
            </Fragment>
        }
    }
}