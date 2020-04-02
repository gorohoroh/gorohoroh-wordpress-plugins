import './index.scss';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {Chart, ReportFilters, SummaryList, SummaryNumber, TableCard} from "@woocommerce/components";
import {chartData, tableData} from './mockData'
import {getCurrentDates, getDateParamsFromQuery} from "@woocommerce/date";
import apiFetch from '@wordpress/api-fetch';

addFilter('woocommerce_admin_reports_list', 'wc-admin-sales-by-country', (reports) => {
    return [
        ...reports,
        {
            report: 'sales-by-country',
            title: __('Sales by Country', 'wc-admin-sales-by-country'),
            component: SalesByCountryReport
        },
    ];
});

class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        const {path, query} = this.props;
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        const dateQuery = {period, compare, before, after, primaryDate, secondaryDate};

        this.state = {
            dateQuery: dateQuery,
            path: path,
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
        const data = this.getPerCountryData(ordersWithCountries);
        data.totals = {
            total_sales: this.getTotalSales(data.countries),
            orders: this.getTotalOrders(data.countries),
            countries: data.countries.length
        };
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

    getTotalSales(data) {
        return data.reduce((accumulator, currentObject) => accumulator + currentObject.stats.sales, 0);
    }

    getTotalOrders(data) {
        return data.reduce((accumulator, currentObject) => accumulator + currentObject.stats.orders, 0);
    }

    addQueryParameter(dateQuery, parameterName) {
        const parameterInDateQuery = dateQuery[parameterName];
        return parameterInDateQuery ? `&${parameterName}=${parameterInDateQuery}`: '';
    }

    render() {
        if (!this.state.data) {return <p>Waiting for data...</p>} else {

            const data = this.state.data;
            const { total_sales, orders, countries } = data.totals;

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
                        <SummaryNumber key="sales" value={total_sales} label="Total Sales"/>,
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
