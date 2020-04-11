import {Component as ReactComponent} from "@wordpress/element";
import {TableCard} from "@woocommerce/components";

export class CountryTable extends ReactComponent {

    constructor(props) {
        super(props);

        this.handleSort = this.handleSort.bind(this);

        const defaultSortColumn = "sales";

        const flatData = this.props.countryData.map(country => ({
            country: country.country,
            sales: country.stats.sales,
            sales_percentage: country.stats.sales_percentage,
            orders: country.stats.orders,
            average_order_value: country.stats.average_order_value
        }));

        const sortedCountryData = this.sort(flatData, defaultSortColumn).reverse();

        this.state = {
            countryData: sortedCountryData,
            sortColumn: defaultSortColumn
        }
    }

    sort(data, column) {
        return data.sort((a, b) => {
            if (a[column] > b[column]) return 1;
            if (a[column] < b[column]) return -1;
            return 0;
        });
    }

    handleSort(newSortColumn) {
        let {countryData, sortColumn} = this.state;

        if (sortColumn === newSortColumn) countryData.reverse();
        else {
            sortColumn = newSortColumn;
            countryData = this.sort(countryData, sortColumn);
        }

        this.setState({
            countryData: countryData,
            sortColumn: sortColumn
        });
    }

    render() {
        const countryData = this.state.countryData;
        const totals = this.props.totals;
        const currency = this.props.currency;

        const tableData = {
            headers: [],
            rows: [],
            summary: []
        };

        tableData.headers = [
            {key: 'country', label: 'Country', isLeftAligned: true, isSortable: true, required: true},
            {key: 'sales', label: 'Sales', isSortable: true, defaultOrder: 'desc', isNumeric: true},
            {key: 'sales_percentage', label: 'Sales (percentage)', isSortable: true, isNumeric: true},
            {key: 'orders', label: 'Number of Orders', isSortable: true, isNumeric: true},
            {key: 'average_order_value', label: 'Average Order Value', isSortable: true, isNumeric: true},
        ];

        tableData.headers.map(header => {
            if (header.key === this.state.sortColumn) {
                header.defaultSort = true;
            }
        });

        countryData.map(item => {
            const row = [
                {
                    display: item.country,
                    value: item.country
                },
                {
                    display: currency.render(item.sales),
                    value: item.sales
                },
                {
                    display: `${item.sales_percentage}%`,
                    value: item.sales_percentage
                },
                {
                    display: item.orders,
                    value: item.orders
                },
                {
                    display: currency.render(item.average_order_value),
                    value: item.average_order_value
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
            onSort={this.handleSort}
        />
    }
}