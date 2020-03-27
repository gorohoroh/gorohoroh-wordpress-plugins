import * as Components from "@woocommerce/components";
import {Component as ReactComponent} from '@wordpress/element';
import * as Data from './data'

export class ComponentSamples extends ReactComponent {
    render() {
        const { path, query } = this.props;
        return <div>
            <h1>Component samples</h1>
            <div>
                <h2>AnimationSlider</h2>
                <Components.AnimationSlider animationKey="1" animate="right">
                    {(status) => (
                        <span>One (1)</span>
                    )}
                </Components.AnimationSlider>
            </div>

            <div>
                <h2>Calendar</h2>
                <Components.DatePicker
                    date={ null }
                    text={ "Sample text" }
                    error={ "Whatever" }
                    onUpdate={ ( { date, text, error } ) => setState( { date, text, error } ) }
                    dateFormat="MM/DD/YYYY"
                />
                {/*TODO: after, before, beforeText, afterText*/}
                {/*<Components.DateRange*/}
                {/*    after={ after }*/}
                {/*    afterText={ afterText }*/}
                {/*    before={ before }*/}
                {/*    beforeText={ beforeText }*/}
                {/*    onUpdate={ ( update ) => setState( update ) }*/}
                {/*    shortDateFormat="MM/DD/YYYY"*/}
                {/*    focusedInput="startDate"*/}
                {/*    isInvalidDate={ date => (*/}
                {/*        // not a future date*/}
                {/*        moment().isBefore( moment( date ), 'date' )*/}
                {/*    ) }*/}
                {/*/>*/}
            </div>

            <div>
                <h2>Card</h2>
                <div>
                    <Components.Card title="Store Performance" description="Key performance metrics">
                        <p>Your stuff in a Card.</p>
                    </Components.Card>
                    <Components.Card title="Inactive Card" isInactive>
                        <p>This Card is grayed out and has no box-shadow.</p>
                    </Components.Card>
                </div>
            </div>

            <div>
                <h2>Chart</h2>
                <Components.Chart data={Data.chartData} title="Example Chart" layout="item-comparison"/>
            </div>

            <div>
                <h2>Compare Filter</h2>
                <Components.CompareFilter
                    type="products"
                    param="product"
                    path={ '' }
                    getLabels={ Promise.resolve([]) }
                    labels={ {
                        helpText: 'Select at least two products to compare',
                        placeholder: 'Search for products to compare',
                        title: 'Compare Products',
                        update: 'Compare',
                    } }
                />
            </div>

            <div>
                <h2>Count</h2>
                <Components.Count count={ 33 } />
            </div>

            <div>
                <h2>Empty Content</h2>
                <Components.EmptyContent
                    title="Nothing here"
                    message="Some descriptive text"
                    actionLabel="Reload page"
                    actionURL="#"
                />
            </div>

            {/*<div>*/}
            {/*    <h2>Filter Picker</h2>*/}

            {/*    <Components.FilterPicker filters={ Data.filterPickerData } path={ path } query={ query } />;*/}
            {/*</div>*/}

            {/*Proceed from: Filters*/}
            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

            <div>
                <h2>ComponentName</h2>
            </div>

        </div>
    }

}