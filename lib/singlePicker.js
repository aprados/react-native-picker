import React,{Component} from "react";
import PropTypes from "prop-types";
import {
    PickerIOS,
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    Dimensions
} from "react-native";

import PickerAndroid,{PickerItemAndroid} from './androidPicker';
import langs from '../lang';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

let _Picker = Platform.OS === 'ios' ? PickerIOS : PickerAndroid;
let _PickerItem = Platform.OS === 'ios' ? _Picker.Item : PickerItemAndroid;

export default class SinglePicker extends Component {
    constructor(props) {
        super(props);
        this.lang = this.props.langs ? this.props.langs : langs[this.props.lang];
        this.state = {
            options: this.props.options,
            modalVisible: false,
            selectedOption: this.props.options.filter((op)=> op.key.toString() === this.props.defaultSelectedValue.toString())[0] || {}
        }
    }

    static propTypes = {
        options: PropTypes.array.isRequired,
        defaultSelectedValue: PropTypes.any,
        onConfirm: PropTypes.func,
        onSelect: PropTypes.func,
        onCancel: PropTypes.func,
        lang: PropTypes.string,
        style: PropTypes.any,
        buttonCancelStyle: PropTypes.any,
        buttonAcceptStyle: PropTypes.any,
        headerStyle: PropTypes.any,
    }

    static defaultProps = {
        lang: "zh-CN",
        style: {backgroundColor: "white"},
        onConfirm: ()=> {
        },
        onSelect: ()=> {
        },
        onCancel: ()=> {
        },
        setOption: ()=> {
        },
    }

    show() {
        this.setState(Object.assign({}, this.state, {modalVisible: true}));
    }

    hide() {
        this.setState({modalVisible: false});
    }

    setOption(options, defaultSelectedValue) {
        let option = options[0]
        if(defaultSelectedValue){
            option = options.filter((op)=> op.key.toString() === defaultSelectedValue.toString())[0]
        }

        this.setState(Object.assign({}, this.state, {
            options: options,
            selectedOption: option
        }))
    }

    changePrev = () =>{
        let current = this.state.options.findIndex(p => p.key == this.state.selectedOption.key)
        if(current > 0 ){
            let option = this.props.options[current - 1]
            this.setState(Object.assign({}, this.state, {
                selectedOption: option
            }))
        }
    }

    changeNext = () =>{
        let current = this.state.options.findIndex(p => p.key == this.state.selectedOption.key)
        if(current <  this.props.options.length - 1){
            let option =  this.props.options[current + 1]
            this.setState(Object.assign({}, this.state, {
                selectedOption: option
            }))
        }
    }

    componentWillReceiveProps(nextProps){
        let option = nextProps.options.filter((op)=> op.key.toString() === nextProps.defaultSelectedValue.toString())[0];
        this.setState({
            selectedOption: option
        })
    }

    render() {
        return (
            <Modal
                accessible={false} 
                animationType={'none'}
                transparent
                style={styles.modal}
                onRequestClose={()=>{}}
                visible={this.state.modalVisible}>
                <View accessible={false} style={styles.absolute}>
                <View accessible={false} style={[styles.absolute, styles.transparent]}/>

                <View accessible={false} style={styles.basicContainer}>
                    <View accessible={false} style={[styles.modalContainer,this.props.style]}>
                        

                        <View accessible={false} style={styles.mainBox}>
                            <_Picker
                                ref={'picker'}
                                items={this.state.options}
                                style={styles.bottomPicker}
                                selectedValue={this.state.selectedOption.key}
                                //index={this.state.options.findIndex(p => p.key == this.state.selectedOption.key)}
                                onValueChange={val => {
                                    let curOption = this.state.options.filter((op)=> op.key === val)[0];
                                    this.props.onSelect(curOption);
                                    this.setState(
                                        Object.assign({},this.state,{selectedOption:curOption}));
                                }}>
                                {this.state.options.map((option, i) => {
                                    return (
                                        <_PickerItem
                                            key={i}
                                            value={option.key}
                                            label={option.value}
                                        />
                                    )
                                })}
                            </_Picker>
                        </View>


                        <View accessible={false} style={[styles.buttonView, this.props.headerStyle]}>
                            {this.props.leftItem && <TouchableOpacity onPress={this.changePrev} style={{ justifyContent: 'center', paddingHorizontal: 5, marginLeft: 15, marginRight: 15, height: 75, }}>
                              {this.props.leftItem}
                            </TouchableOpacity>}
                            {this.props.rightItem && <TouchableOpacity onPress={this.changeNext} style={{ justifyContent: 'center', paddingHorizontal: 5, height: 75 }} >
                              {this.props.rightItem}
                            </TouchableOpacity>}
                            <TouchableOpacity accessibilityRole='button' accessible={true} accessibilityLabel={this.lang.BTN_CANCEL} style={[styles.button,styles.buttonLeft]} onPress={() => {
                                this.props.onCancel && this.props.onCancel();
                                    this.setState({modalVisible: false});
                                }}>
                                <Text style={[this.props.headerButtonStyle, this.props.buttonCancelStyle]}>{this.lang.BTN_CANCEL}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity accessibilityRole='button' accessible={true} accessibilityLabel={this.lang.BTN_CONFIRM} style={[styles.button,styles.buttonRight]} onPress={() => {
                                if (this.props.onConfirm) {
                                    if (!this.state.selectedOption.key && this.state.selectedOption.key !== 0) {
                                        let submitData = this.state.options[0] || {};
                                        if (!submitData && this.props.defaultSelectedValue) {
                                            submitData = this.state.options.filter((op)=> op.key.toString() === this.props.defaultSelectedValue.toString())[0];
                                        }
                                        this.props.onConfirm(submitData);
                                    } else {
                                        this.props.onConfirm(this.state.selectedOption);
                                    }
                                }
                                this.setState({modalVisible: false});
                            }}>
                                <Text style={[this.props.headerButtonStyle, this.props.buttonAcceptStyle]}>{this.lang.BTN_CONFIRM}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

              </View>
      </View>
            </Modal>
        )
    }
}

var styles = StyleSheet.create({
    basicContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    modalContainer: {
        width: SCREEN_WIDTH,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 0
    },
    buttonView: {
        position: 'absolute',
        top: 0,
        height: 40,
        width: SCREEN_WIDTH,
        alignItems: 'center',
        flexDirection: 'row'
    },
    bottomPicker: {
        borderTopColor: '#000',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        backgroundColor: 'transparent',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 3 * 1,
    },
    mainBox: {
        height: SCREEN_HEIGHT / 5,
        marginBottom: 80,
        alignItems: 'flex-start',
        flexDirection: 'column'
    },
    button: {
        flex: 0.5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonLeft: {
        justifyContent: 'flex-start'
    },
    buttonRight: {
        justifyContent: 'flex-end'
    },
    modal: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        padding: 0,
        margin: 0,
        flexDirection: 'column',
        backgroundColor: 'transparent',
        position: 'absolute',
        zIndex: 99991,
    },
    transparent: {
        backgroundColor: '#000',
        opacity: 0.5
    },
    absolute: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
})
