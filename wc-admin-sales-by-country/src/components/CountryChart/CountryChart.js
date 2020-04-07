import "./CountryChart.scss"
import {Component as ReactComponent} from "@wordpress/element";
import {Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

export class CountryChart extends ReactComponent {
    render() {
        const chartData = this.props.chartData
            .map(country => ({name: country.country, value: country.stats.sales}))
            .sort((a, b) => {
                if (a.value > b.value) return -1;
                if (a.value < b.value) return 1;
                return 0;
            });

        return <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                <Bar dataKey="value" fill="#8884d8"/>
                <XAxis dataKey="name"/>
                <YAxis/>
                <Tooltip/>
            </BarChart>
        </ResponsiveContainer>;
    }
}