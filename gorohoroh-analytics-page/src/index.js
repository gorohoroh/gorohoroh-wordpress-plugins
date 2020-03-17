import './index.scss';
import {Component as ReactComponent} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {Link} from "@woocommerce/components";

class GorohorohSampleComponent extends ReactComponent {
    render() {
        return (
            <div>This is my dummy component</div>
        )
    }
}

const GorohorohReport = () => {
    return (
        <div>
            <GorohorohSampleComponent/>
            <Link
                href="edit.php?post_type=shop_coupon"
                type="wp-admin"
            >
                Coupons
            </Link>
        </div>
    )
};


addFilter('woocommerce_admin_reports_list', 'gorohoroh-analytics-page', (reports) => {
    return [
        ...reports,
        {
            report: 'gorohoroh-analytics-page', // Should this be equal to `'path' => '/analytics/gorohoroh-analytics-page'` from .php, minus the /analytics/ part?
            title: __('Gorohoroh Analytics Page Report (title)', 'gorohoroh-analytics-page'),
            component: GorohorohReport
        },
    ];
});