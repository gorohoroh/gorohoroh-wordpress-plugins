import './index.scss';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {Card, Chart, ReportFilters, SummaryList, SummaryNumber, TableCard} from "@woocommerce/components";
import {chartData, tableData} from './mockData'
import {getCurrentDates, getDateParamsFromQuery} from "@woocommerce/date";
import {getResourceIdentifier} from "../../woocommerce-admin/client/wc-api/utils";
import {NAMESPACE} from "../../woocommerce-admin/client/wc-api/constants";
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

/*
        const endPoints = {
            "countries": "/wc/v3/data/countries?_fields=code,name",
            "orders": "/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales",
            "customers": "/wc-analytics/reports/customers?_fields=id,country"
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

        const orders = this.getRestData(endPoints.orders + defaultQueryParameters);
        const customers = this.getRestData(endPoints.customers + defaultQueryParameters);

        // TODO cache this
        // TODO fetch only countries represented in the current date range's set of orders - see discussion at https://a8c.slack.com/archives/GTNUWF8MT/p1585756629003400
        const countries = this.getRestData(endPoints.countries + defaultQueryParameters);

        const ordersWithCountries = orders.map(order => {
            order.country_code = customers.find(item => item.id === order.customer_id).country;

            const country = countries.find(item => item.code === order.country_code);
            order.country = country ? country.name : "Unknown country";

            return order;
        });

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
        const perCountryData = ordersWithCountries.reduce((accumulator, currentObject) => {
            const countryCode = currentObject['country_code'];

            if (!accumulator.find(item => item.country_code === countryCode)) {
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
                accumulator.push(countryObjectTemplate)
            }

            const countryIndexInAccumulator = accumulator.findIndex(item => item.country_code === countryCode);
            accumulator[countryIndexInAccumulator].stats.sales += currentObject.total_sales;
            accumulator[countryIndexInAccumulator].stats.orders++;

            return accumulator;
        }, []);
*/

        this.state = {
            dateQuery: dateQuery,
            path: path,
            // countries: countries,
            // perCountryData: perCountryData
        }
    }

    getRestData(query) {
        // https://github.com/WordPress/gutenberg/tree/master/packages/api-fetch
        return apiFetch({path: query})
            .then(response => {
                response.json();
                console.log(response);
                console.log(query);
            })
            .catch(error => console.log(error));

    }

    addQueryParameter(dateQuery, parameterName) {
        const parameterInDateQuery = dateQuery[parameterName];
        return parameterInDateQuery ? `&${parameterName}=${parameterInDateQuery}`: '';
    }

    render() {

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
                { () => {
                    return [
                        <SummaryNumber
                            key="sales"
                            value={ '$33829.40' }
                            label="Total Sales"
                            // delta={ 29 }
                            // href="/analytics/report"
                        />,
                        <SummaryNumber
                            key="countries"
                            value={ '8' }
                            label="Countries"
                            // delta={ -10 }
                            // href="/analytics/report"
                            // selected
                        />,
                        <SummaryNumber
                            key="orders"
                            value={ '8' }
                            label="Orders"
                            // delta={ -10 }
                            // href="/analytics/report"
                            // selected
                        />,
                    ];
                } }
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
