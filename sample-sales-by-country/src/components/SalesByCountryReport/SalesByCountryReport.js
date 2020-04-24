import {Component as ReactComponent} from '@wordpress/element';
import {mockData} from '../../mockData';

export class SalesByCountryReport extends ReactComponent {

    constructor(props) {
        super(props);

        this.state = {
            data: { mockData }
        }
    }

    render() { return null }
}
