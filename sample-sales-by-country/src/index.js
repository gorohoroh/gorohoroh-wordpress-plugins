import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {Component as ReactComponent} from '@wordpress/element';

class SalesByCountryReport extends ReactComponent {
    render() { return null }
}

addFilter('woocommerce_admin_reports_list', 'sample-sales-by-country', (reports) => {
    return [
        ...reports,
        {
            report: 'sample-sales-by-country',
            title: __('Sales by Country', 'sample-sales-by-country'),
            component: SalesByCountryReport
        },
    ];
});