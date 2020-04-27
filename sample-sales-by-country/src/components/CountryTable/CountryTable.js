import {__} from '@wordpress/i18n';
import {Component as ReactComponent} from '@wordpress/element';
import {TableCard} from '@woocommerce/components';

export class CountryTable extends ReactComponent {

    render() {
        const countryData = this.props.countryData;
        const totals = this.props.totals;
        const currency = this.props.currency;

        const tableData = {
            headers: this.props.headers,
            rows: countryData.map(item =>
                [
                    {display: item.country, value: item.country},
                    {display: currency.render(item.sales), value: item.sales},
                    {display: `${item.sales_percentage}%`, value: item.sales_percentage},
                    {display: item.orders, value: item.orders},
                    {display: currency.render(item.average_order_value), value: item.average_order_value},
                ]),
            summary: [
                {key: 'sales', label: __('Sales in this period', 'wc-admin-sales-by-country'), value: currency.render(totals.total_sales)},
                {key: 'orders', label: __('Orders in this period', 'wc-admin-sales-by-country'), value: totals.orders},
                {key: 'countries', label: __('Countries in this period', 'wc-admin-sales-by-country'), value: totals.countries},
            ]
        };

        return <TableCard
            title={__('Top Countries', 'wc-admin-sales-by-country')}
            rows={tableData.rows}
            headers={tableData.headers}
            rowsPerPage={100}
            totalRows={tableData.rows.length}
            summary={tableData.summary}
        />
    }
}