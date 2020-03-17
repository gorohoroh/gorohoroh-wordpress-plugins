import './index.scss';
import {Component as ReactComponent} from '@wordpress/element';
import {addFilter} from '@wordpress/hooks';
import {__} from '@wordpress/i18n';
import OrdinalFrame from 'semiotic/lib/OrdinalFrame'
import {VictoryBar, VictoryChart, VictoryLabel} from 'victory';
import { Chart } from '@woocommerce/components';

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
        this.state = {campaignReport: {
                "reportTitle": "Campaign Objective",
                "reportValues": [
                    { "key": "Conversions", "value": 132 },
                    { "key": "Traffic", "value": 37 },
                    { "key": "Post engagement", "value": 8 },
                    { "key": "Reach", "value": 4 },
                    { "key": "Video Views", "value": 2 }
                ]
            }, }
    }

    render() {
        const chartHeight = this.state.campaignReport.reportValues.length * 30;
        return <div className="chart-container">
            <h2>{this.state.campaignReport.reportTitle} by count</h2>
            <Chart data={ this.state.campaignReport.reportValues } title="Example Chart" layout="time-comparison" />
            <OrdinalFrame data={this.state.campaignReport.reportValues}
                          size={[1000, chartHeight]}
                          rAccessor={"value"}
                          oAccessor={"key"}
                          type="bar"
                          projection={"horizontal"}
                          oLabel={d => <text className="chart-bar-label">{d}</text>}
                          pieceClass="chart-bar"
                          axis={{orient: "bottom"}}
            />
            <VictoryChart domainPadding={10}>
                <VictoryBar data={this.state.campaignReport.reportValues}
                            padding={10}
                            x="key"
                            y="value"
                            width={500}
                            height={chartHeight}
                            horizontal={true}
                            labelComponent={<VictoryLabel dy={30}/>}
                />
            </VictoryChart>
        </div>;
    }
}