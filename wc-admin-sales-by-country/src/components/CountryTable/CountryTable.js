import {Component as ReactComponent} from "@wordpress/element";
import {TableCard} from "@woocommerce/components";

export class CountryTable extends ReactComponent {
    render() {

        const countryData = this.props.countryData;
        const totals = this.props.totals;
        const currency = this.props.currency;

        const tableData = {
            headers: [],
            rows: [],
            summary: []
        };

        tableData.headers = [
            {key: 'country', label: 'Country', isLeftAligned: true, isSortable: true, required: true},
            {key: 'sales-absolute', label: 'Sales', isSortable: true, defaultSort: true, defaultOrder: 'desc', isNumeric: true},
            {key: 'sales-percent', label: 'Sales (percentage)', isSortable: true, isNumeric: true},
            {key: 'orders', label: 'Number of Orders', isSortable: true, isNumeric: true},
            {key: 'avg-order', label: 'Average Order Value', isSortable: true, isNumeric: true},
        ];

        countryData.map(item => {
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
            {key: "sales", label: 'Sales in this period', value: currency.render(totals.total_sales)},
            {key: "orders", label: 'Orders in this period', value: totals.orders},
            {key: "countries", label: 'Countries in this period', value: totals.countries},
        ];

        return <TableCard
            className="table_top_countries"
            title="Top Countries"
            rows={tableData.rows}
            headers={tableData.headers}
            query={{page: 2}}
            rowsPerPage={7}
            totalRows={10}
            summary={tableData.summary}
        />
    }
}