import './index.scss';
import {Component as ReactComponent} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import { } from '@woocommerce/components';


addFilter('woocommerce_admin_reports_list', 'gorohoroh-sales-by-country', (reports) => {
    return [
        ...reports,
        {
            report: 'gorohoroh-sales-by-country',
            title: __('Sales by Country', 'gorohoroh-sales-by-country'),
            component: CustomComponent
        },
    ];
});

class CustomComponent extends ReactComponent {

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
            }
        ]

    }
}