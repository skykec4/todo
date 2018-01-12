import React from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage
} from "react-native";
import { AppLoading } from "expo";
import Todo from "./Todo";
import uuidv1 from "uuid/v1";

const { width, height } = Dimensions.get("window");

export default class App extends React.Component {
  state = {
    newTodo: "",
    loadedToDos: false,
    toDos: {}
  };

  componentDidMount = () => {
    this._loadTodos();
  };

  render() {
    const { newTodo, loadedToDos, toDos } = this.state;
    if (!loadedToDos) {
      return <AppLoading />;
    }
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.title}>해야 할 일</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="할 일"
            value={newTodo}
            onChangeText={this._controlNewTodo}
            placeholderTextColor={"#999"}
            returnKeyType={"done"}
            autoCorrect={false}
            onSubmitEditing={this._addToDo}
            blurOnSubmit={true}
            underlineColorAndroid={"transparent"}
          />
          <ScrollView contentContainerStyle={styles.ToDos}>
            {Object.values(toDos)
              .reverse()
              .map(todo =>
                <Todo
                  key={todo.id}
                  {...todo}
                  deleteToDo={this._deleteTodo}
                  uncompleteToDO={this._uncompleteToDO}
                  completeToDO={this._completeToDO}
                  updateToDO={this._updateToDO}
                />
              )}
          </ScrollView>
        </View>
      </View>
    );
  }
  _controlNewTodo = text => {
    this.setState({
      newTodo: text
    });
  };
  _loadTodos = async () => {
    try {
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos: true,
        toDos: parsedToDos || {}
      });
    } catch (err) {
      console.log(err);
    }
  };
  _addToDo = () => {
    const { newTodo, toDos } = this.state;
    if (newTodo !== "") {
      this.setState({
        newTodo: ""
      });
      this.setState(prevState => {
        const ID = uuidv1();
        const newToDoObject = {
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newTodo,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          newTodo: "",
          toDos: {
            ...prevState.toDos,
            ...newToDoObject
          }
        };

        this._saveToDos(newState.toDos);
        return { ...newState };
      });
    }
  };
  _deleteTodo = id => {
    this.setState(prevState => {
      const toDos = prevState.toDos;
      delete toDos[id];
      const newState = {
        ...prevState,
        ...toDos
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _uncompleteToDO = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: false
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };
  _completeToDO = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            isCompleted: true
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _updateToDO = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id]: {
            ...prevState.toDos[id],
            text: text
          }
        }
      };
      this._saveToDos(newState.toDos);
      return { ...newState };
    });
  };

  _saveToDos = newToDos => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#008000",
    alignItems: "center"
  },
  title: {
    marginTop: 50,
    marginBottom: 30,
    fontSize: 30,
    color: "white",
    fontWeight: "200"
  },
  card: {
    flex: 1,
    backgroundColor: "white",
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgb(50, 50, 50)",
        shadowOffset: {
          height: -1,
          width: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5
      },
      android: {
        elevation: 5
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  ToDos: {
    alignItems: "center"
  }
});
