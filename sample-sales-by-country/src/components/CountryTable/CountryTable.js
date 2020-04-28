import {__} from '@wordpress/i18n';
import {Component as ReactComponent} from '@wordpress/element';
import {TableCard} from '@woocommerce/components';

export class CountryTable extends ReactComponent {

    constructor(props) {
        super(props);

        this.handleSort = this.handleSort.bind(this);

        const defaultSortColumn = 'sales';
        const defaultSortOrder = 'desc';

        const countryDataSortedByDefault = this.sort(this.props.countryData, defaultSortColumn, defaultSortOrder);

        this.state = {
            countryData: countryDataSortedByDefault,
            sortColumn: defaultSortColumn,
            sortOrder: defaultSortOrder
        }
    }

    changeSortOrder(order) {
        return order === 'asc' ? 'desc' : 'asc';
    }

    setHeaderSortOptions(header) {
        if (header.key === this.state.sortColumn) {
            header.defaultSort = true;
            header.defaultOrder = this.state.sortOrder;
        } else {
            if (header.defaultSort) delete header.defaultSort;
            if (header.defaultOrder) delete header.defaultOrder;
        }
        return header;
    }

    sort(data, column, sortOrder) {
        const appliedSortOrder = sortOrder === 'asc' ? 1 : -1;
        return data.sort((a, b) => {
            if (a[column] > b[column]) return appliedSortOrder;
            if (a[column] < b[column]) return -1 * appliedSortOrder;
            return 0;
        });
    }

    handleSort(newSortColumn) {
        let {countryData, sortColumn, sortOrder} = this.state;

        if (sortColumn === newSortColumn) {
            countryData.reverse();
            sortOrder = this.changeSortOrder(sortOrder);
        }
        else {
            sortColumn = newSortColumn;
            countryData = this.sort(countryData, sortColumn, sortOrder);
        }

        this.setState({
            countryData: countryData,
            sortColumn: sortColumn,
            sortOrder: sortOrder
        });
    }

    render() {
        const countryData = this.state.countryData;
        const totals = this.props.totals;
        const currency = this.props.currency;

        const tableData = {
            headers: this.props.headers.map(header => this.setHeaderSortOptions(header)),
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
            onSort={this.handleSort}
        />
    }
}