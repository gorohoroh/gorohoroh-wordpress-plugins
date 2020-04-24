import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {mockData} from '../../mockData';
import {ChartPlaceholder, ReportFilters, SummaryList, SummaryListPlaceholder, SummaryNumber, TablePlaceholder} from '@woocommerce/components';
import {__} from '@wordpress/i18n';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings';

export class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        const dateQuery = this.createDateQuery(this.props.query);
        const storeCurrency = new Currency(storeCurrencySetting);

        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            data: mockData
        }
    }

    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    render() {
        const reportFilters =
            <ReportFilters
                dateQuery={this.state.dateQuery}
                query={this.props.query}
                path={this.props.path}
                currency={this.state.currency}
                isoDateFormat={isoDateFormat}/>;

        const {data, currency} = this.state;

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
        </Fragment>
    }
}
