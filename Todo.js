import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  TextInput
} from "react-native";
import PropTypes from "prop-types";

const { width, height } = Dimensions.get("window");
export default class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      toDoValue: props.text
    };
  }

  static propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    uncompleteToDO: PropTypes.func.isRequired,
    completeToDO: PropTypes.func.isRequired,
    updateToDO: PropTypes.func.isRequired
  };
  state = {
    isEditing: false,
    toDoValue: ""
  };
  render() {
    const { isEditing, toDoValue } = this.state;
    const { text, id, deleteToDo, isCompleted } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.column}>
          <TouchableOpacity onPress={this._toglleComplete}>
            <View
              style={[
                styles.circle,
                isCompleted ? styles.completedCircle : styles.uncompletedCircle
              ]}
            />
          </TouchableOpacity>
          {isEditing
            ? <TextInput
                style={[
                  styles.text,
                  styles.input,
                  isCompleted ? styles.completedText : styles.uncompletedText
                ]}
                value={toDoValue}
                multiline={true}
                onChangeText={this._controlInput}
                returnKeyType={"done"}
                onBlur={this._finishEditing}
              />
            : <Text
                style={[
                  styles.text,
                  isCompleted ? styles.completedText : styles.uncompletedText
                ]}
              >
                {text}
              </Text>}
        </View>
        {isEditing
          ? <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._finishEditing}>
                <View style={styles.actionContainer}>
                  {/*<Text style={styles.actionText}></Text>*/}
                  <Image
                    source={require("./assets/ok.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          : <View style={styles.actions}>
              <TouchableOpacity onPressOut={this._startEditing}>
                <View style={styles.actionContainer}>
                  {/*<Text style={styles.actionText}>수정</Text>*/}
                  <Image
                    source={require("./assets/edit3.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPressOut={event => {
                  event.stopPropagation;
                  deleteToDo(id);
                }}
              >
                <View style={styles.actionContainer}>
                  {/*<Text style={styles.actionText}>X</Text>*/}
                  <Image
                    source={require("./assets/delete2.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
              </TouchableOpacity>
            </View>}
      </View>
    );
  }
  _toglleComplete = event => {
    event.stopPropagation();
    const { isCompleted, uncompleteToDO, completeToDO, id } = this.props;
    if (isCompleted) {
      uncompleteToDO(id);
    } else {
      completeToDO(id);
    }
  };
  _startEditing = event => {
    event.stopPropagation();
    this.setState({
      isEditing: true
    });
  };
  _finishEditing = event => {
    event.stopPropagation();
    const { toDoValue } = this.state;
    const { id, updateToDO } = this.props;
    updateToDO(id, toDoValue);
    this.setState({
      isEditing: false
    });
  };
  _controlInput = text => {
    this.setState({
      toDoValue: text
    });
  };
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: "#bbb",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: "#008000",
    borderWidth: 3,
    marginRight: 20
  },
  text: {
    fontWeight: "600",
    fontSize: 20,
    marginVertical: 20
  },
  completedCircle: {
    borderColor: "#bbb"
  },
  uncompletedCircle: {
    borderColor: "#008000"
  },
  completedText: {
    color: "#bbb",
    textDecorationLine: "line-through"
  },
  uncompletedText: {
    color: "#353839"
  },
  column: {
    flexDirection: "row",
    alignItems: "center",
    width: width / 2
  },
  actions: {
    flexDirection: "row"
  },
  actionContainer: {
    /*margin: 10*/
    marginVertical: 10,
    marginHorizontal: 10
  },
  input: {
    marginVertical: 10,
    width: width / 2,
    paddingVertical: 9
  }
});
