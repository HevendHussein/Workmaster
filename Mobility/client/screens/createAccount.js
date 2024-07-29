import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import { Keyboard } from "react-native";

export default function CreateAccount({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const config = require("./config"); //hier ist die richtige IP in der config.js Datei im gleichen Ordner aus config.js

  const handleLogin = () => {
    if (name.trim() === "" || password.trim() === "") {
      alert("Name and password cannot be empty.");
      return;
    }

    console.log(config.ipAddress, 1);
    // console.log(request.cookies);
    axios
      .post(`${config.ipAddress}/register`, { name, password })
      .then((response) => {
        if (response.data.passwordExists) {
          alert(
            "Das Passwort existiert bereits. Bitte wählen Sie ein anderes Passwort."
          );
        } else {
          navigation.navigate("LoginScreen");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <TouchableWithoutFeedback
      //klick, um die Tastatur zu schließen
      onPress={() => Keyboard.dismiss()}
    >
      <View style={styles.containers}>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          onChangeText={(text) => setName(text)}
          value={name}
        />
        <TextInput
          style={[styles.input, { marginBottom: 100 }]}
          placeholder="Enter your password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: 200,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  input: {
    marginVertical: 10,
    height: 40,
    padding: 10,
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
  },
});
