import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {SalesByCountryReport} from "./components/SalesByCountryReport/SalesByCountryReport";

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

