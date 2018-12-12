import React,{Component} from "react";
import PropTypes from "prop-types";
import {
    StyleSheet,
    View,
    Dimensions
} from "react-native";

import { Picker } from 'react-native-wheel-datepicker';

const SCREEN_WIDTH = Dimensions.get('window').width;
export default class PickerAndroid extends Component {
    constructor(props) {
        super(props);
        this.state.items = this.props.items
    }

    state = {
        selectedValue: null
    }

    static propTypes = {
        mode: PropTypes.string,
        style: PropTypes.any,
        onValueChange: PropTypes.func
    };

    static defaultProps = {
        mode: 'slide',
        style: {width: SCREEN_WIDTH}
    };

    _onItemChange = (value) => {
        let key = this.props.items.filter((op)=> op.value === value)[0].key;
        this.props.onValueChange(key);
    }

    render() {

        let option = this.props.items.filter((op)=> op.key.toString() === this.props.selectedValue.toString())[0];

        return <Picker
                style={this.props.style}
                textColor={'#000'}
                textSize={22}
                selectedValue={option.value}
                pickerData={pluck(this.props.children,'label')}
                onValueChange={this._onItemChange}
                accessible={true}
            />
    }
}

export class PickerItemAndroid extends Component {
    static propTypes = {
        value: PropTypes.any,
        label: PropTypes.string
    };

    render() {
        return <View accessible={true} accessibilityLabel={this.props.value} />;
    }
}

function pluck(collection, field) {
    let array = [];
    if (collection && collection.length > 0) {
        collection.forEach(item=> {
            array.push(item.props[field]);
        })
    }
    return array;
}
