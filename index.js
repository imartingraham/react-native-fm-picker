'use strict';

import { React } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  PickerIOS,
  Dimensions
} from 'react-native';

const PickerItemIOS = PickerIOS.Item;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Component = React.createClass({
  show: function(){
    this.setState({modalVisible: true});
  },

  getInitialState: function(){
    return {
      options: this.props.options,
      labels: this.props.labels || this.props.options,
      color: this.props.color || '#007AFF',
      pickerBackgroundColor: this.props.pickerBackgroundColor || '#F5FCFF',
      modalVisible: false,
      selectedOption: this.props.selectedValue || this.props.options[0],
      pickerHeight: 0,
      buttonColor: this.props.buttonColor || '#007AFF',
    };
  },

  componentDidUpdate() {
    this.measurePickerHeight();
  },

  componentWillReceiveProps(nextProps) {
    this.setState({
      options: nextProps.options,
      labels: nextProps.labels || nextProps.options,
    })
  },

  measurePickerHeight() {
    if (this.refs && this.refs.pickerView && this.state.pickerHeight == 0) {
      this.refs.pickerView.measure((a, b, width, height, px,py ) => {
        this.setState({pickerHeight: height});
      });
    }
  },

  renderBackground() {
    if (this.props.renderBackground) {
      return (
        <View style={[styles.modalBackground, {height: this.state.pickerHeight}]}>
          {React.cloneElement(this.props.renderBackground(), {})}
        </View>
      )
    } else {
      return null;
    }
  },

  render: function() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        >
        <View style={styles.basicContainer}>
          <View
            ref="pickerView"
            style={[styles.modalContainer, {backgroundColor: this.state.pickerBackgroundColor}]}
            >
            {this.renderBackground()}

            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={() => {
                  if (this.props.onCancel) {
                    this.props.onCancel();
                  }

                  this.setState({modalVisible: false});
                }}
                >
                <Text style={{color:this.state.buttonColor}}>{this.props.labelCancel ? this.props.labelCancel : 'Cancel'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (this.props.onSubmit) {
                    this.props.onSubmit(this.state.selectedOption);
                  }

                  this.setState({modalVisible: false});
                }}
                >
                <Text style={{color:this.state.buttonColor}}>{this.props.labelSubmit ? this.props.labelSubmit : 'Confirm'}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mainBox}>
              <PickerIOS
                ref={'picker'}
                style={styles.bottomPicker}
                itemStyle={this.props.itemStyle}
                selectedValue={this.state.selectedOption}
                onValueChange={(option) => this.setState({selectedOption: option})}>
                {
                  this.state.options.map((option, i) => {
                    let label = this.state.labels[i] || option;

                    return (
                      <PickerItemIOS
                        key={option}
                        value={option}
                        label={label}
                        />
                    )
                  })
                }
              </PickerIOS>
            </View>

          </View>
        </View>
      </Modal>
    );
  }
});

let styles = StyleSheet.create({
  basicContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBackground: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SCREEN_WIDTH,
  },

  modalContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },

  buttonView: {
    width: SCREEN_WIDTH,
    padding: 8,
    borderTopWidth: 0.5,
    borderTopColor:'#CCCCCC',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },

  bottomPicker : {
    width: SCREEN_WIDTH,
  },
});

module.exports = Component;
