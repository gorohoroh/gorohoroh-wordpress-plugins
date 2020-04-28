import {Component as ReactComponent} from '@wordpress/element';

export class CustomTooltip extends ReactComponent {
    render() {
        return <div className='d3-chart__tooltip'>
            <h4>{this.props.dateRange}</h4>
            <ul>
                <li className='key-row'>
                    <div className='key-container'>
                        <span className='key-color' style={{backgroundColor: '#096484'}}/>
                        <span className='key-key'>{this.props.label}</span>
                    </div>
                    <span className='key-value'>{this.props.currency.render(this.props.payload[0].value)}</span>
                </li>
            </ul>
        </div>
    }
}