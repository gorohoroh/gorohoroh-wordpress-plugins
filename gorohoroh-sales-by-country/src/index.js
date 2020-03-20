import './index.scss';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import { } from '@woocommerce/components';


addFilter('woocommerce_admin_reports_list', 'gorohoroh-sales-by-country', (reports) => {
    return [
        ...reports,
        {
            report: 'gorohoroh-sales-by-country',
            title: __('Gorohoroh\'s Sales by Country (title)', 'gorohoroh-sales-by-country'),
            component: ValuesByCountSortedForColumns
        },
    ];
});
