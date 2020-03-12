// Import SCSS entry file so that webpack picks up changes
import './index.scss';

import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

const addCurrencyFilters = ( filters ) => {
    return [
        {
            label: __( 'Currency', 'dev-blog-example' ),
            staticParams: [],
            param: 'currency',
            showFilters: () => true,
            defaultValue: 'USD',
            filters: [ ...( wcSettings.multiCurrency || [] ) ],
        },
        ...filters,
    ];
};

addFilter(
    'woocommerce_admin_orders_report_filters',
    'dev-blog-example',
    addCurrencyFilters
);

const addTableColumn = reportTableData => {
    if ( 'orders' !== reportTableData.endpoint ) {
        return reportTableData;
    }

    const newHeaders = [
        {
            label: 'Currency',
            key: 'currency',
        },
        ...reportTableData.headers,
    ];
    const newRows = reportTableData.rows.map( ( row, index ) => {
        const item = reportTableData.items.data[ index ];
        const newRow = [
            {
                display: item.currency,
                value: item.currency,
            },
            ...row,
        ];
        return newRow;
    } );

    reportTableData.headers = newHeaders;
    reportTableData.rows = newRows;

    return reportTableData;
};

addFilter( 'woocommerce_admin_report_table', 'dev-blog-example', addTableColumn );

