import './index.scss';
import {Component as ReactComponent} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import {Chart} from '@woocommerce/components';

addFilter('woocommerce_admin_reports_list', 'gorohoroh-analytics-page', (reports) => {
    return [
        ...reports,
        {
            report: 'gorohoroh-analytics-page', // Should this be equal to `'path' => '/analytics/gorohoroh-analytics-page'` from .php, minus the /analytics/ part?
            title: __('Gorohoroh Analytics Page Report (title)', 'gorohoroh-analytics-page'),
            component: ValuesByCountSortedForColumns
        },
    ];
});

class ValuesByCountSortedForColumns extends ReactComponent {

    constructor(props) {
        super(props);
        this.state = { data: this.getReportData() }
    }

    render() {
        return <Chart data={this.state.data} title="Example Chart" layout="time-comparison"/>;
    }


    getReportData() {
        return [
            {
                date: '2018-05-30T00:00:00',
                Hoodie: {
                    label: 'Hoodie',
                    value: 21599,
                },
                Sunglasses: {
                    label: 'Sunglasses',
                    value: 38537,
                },
                Cap: {
                    label: 'Cap',
                    value: 106010,
                },
            },
            {
                date: '2018-05-31T00:00:00',
                Hoodie: {
                    label: 'Hoodie',
                    value: 14205,
                },
                Sunglasses: {
                    label: 'Sunglasses',
                    value: 24721,
                },
                Cap: {
                    label: 'Cap',
                    value: 70131,
                },
            },
            {
                date: '2018-06-01T00:00:00',
                Hoodie: {
                    label: 'Hoodie',
                    value: 10581,
                },
                Sunglasses: {
                    label: 'Sunglasses',
                    value: 19991,
                },
                Cap: {
                    label: 'Cap',
                    value: 53552,
                },
            },
            {
                date: '2018-06-02T00:00:00',
                Hoodie: {
                    label: 'Hoodie',
                    value: 9250,
                },
                Sunglasses: {
                    label: 'Sunglasses',
                    value: 16072,
                },
                Cap: {
                    label: 'Cap',
                    value: 47821,
                },
            },
        ]

    }
}