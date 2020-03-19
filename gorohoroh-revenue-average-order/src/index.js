import {addFilter} from '@wordpress/hooks'
import {default as Currency} from "@woocommerce/currency";
import { CURRENCY as storeCurrencySetting } from "@woocommerce/settings";

const NAMESPACE = "gorohoroh-revenue-average-order";

const averageOrderValueFilter = {
    key: 'average_order_value',
    label: 'Average order value',
    order: 'desc',
    orderby: 'average_order_value',
    type: 'currency',
};

const storeCurrency = new Currency(storeCurrencySetting);

// Trying to hook to this filter defined in report's config.js. No luck.
addFilter('woocommerce_admin_revenue_report_advanced_filters', NAMESPACE, (filters) => {
    return {
        ...filters, averageOrderValueFilter
    }
});

// Looks like it's better to try hooking into the `report-table` component's `'woocommerce_admin_report_table'` hook,
// as the `table-column` example does. OK, let's see
addFilter(
    'woocommerce_admin_report_table',
    NAMESPACE,
    ( reportTableData ) => {
        if ( reportTableData.endpoint !== 'revenue' || ! reportTableData.items ) return reportTableData;

        const newHeaders = [
            ...reportTableData.headers,
            {
                label: 'Avg Sale Value',
                key: 'average_order_value',
                required: false,
                isSortable: true,
                isNumeric: true
            },
        ];

        const newRows = reportTableData.rows.map( ( row, index ) => {
            const revenueReportRow = reportTableData.items.data[ index ].subtotals;
            const averageSaleValue = revenueReportRow.orders_count <= 0 ? 0 : revenueReportRow.total_sales / revenueReportRow.orders_count;
            return [
                ...row,
                {
                    display: storeCurrency.render(averageSaleValue),
                    value: storeCurrency.formatDecimal(averageSaleValue),
                }
            ];
        } );

        reportTableData.headers = newHeaders;
        reportTableData.rows = newRows;

        return reportTableData;
    }
);