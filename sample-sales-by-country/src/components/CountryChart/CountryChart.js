import {__} from "@wordpress/i18n";
import {Component as ReactComponent} from "@wordpress/element";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export class CountryChart extends ReactComponent {
    render() {
        const chartData = this.props.chartData
            .map(country => ({name: country.country, value: country.sales}))
            .sort((a, b) => {
                if (a.value > b.value) return -1;
                if (a.value < b.value) return 1;
                return 0;
            });

        return <div className="countrychart-chart">
            <div className="countrychart-chart__header">
                <h2 className="countrychart-chart__title">Sales by Country</h2>
            </div>
            <div className="countrychart-chart__body countrychart-chart__body-column">
                <div className="d3-chart__container">
                    <ResponsiveContainer width="100%" height={300}>
                        {chartData.length > 0
                            ? (<BarChart data={chartData}>
                                <CartesianGrid vertical={false}/>
                                <Bar dataKey="value" fill="#52accc"/>
                                <XAxis dataKey="name"/>
                                <YAxis domain={[0, dataMax => (Math.round(dataMax * 1.05 / 100) * 100)]}/>
                            </BarChart>)
                            : <div className="d3-chart__empty-message">{__("No data for the selected date range", "wc-admin-sales-by-country")}</div>
                        }
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    }
}