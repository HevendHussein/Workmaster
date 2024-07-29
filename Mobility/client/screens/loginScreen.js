//login screen with name, passwort and login button
//if user does not have an account, he can create one
//clicking on create account button change the screen to create account screen

import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Keyboard } from "react-native";
import UserContext from "./UserContext";
import { KeyboardAvoidingView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const config = require("./config"); //hier ist die richtige IP in der config.js Datei im gleichen Ordner aus config.js
  const { setUsername } = useContext(UserContext);

  let userId; // Variable zum Speichern der Benutzer-ID

  useEffect(() => {
    const checkForLogin = async () => {
      const storedName = await AsyncStorage.getItem("name");
      const storedPassword = await AsyncStorage.getItem("password");
      if (storedName && storedPassword) {
        setName(storedName);
        setPassword(storedPassword);
        handleLogin();
      }
    };
    checkForLogin();
  }, []);

  const handleLogin = async () => {
    if (name.trim() === "" || password.trim() === "") {
      //alert("Name and password cannot be empty.");
      return;
    }

    try {
      const response = await axios.post(`${config.ipAddress}/login`, {
        name: name,
        password: password,
      });

      if (response.data.success) {
        setUsername(name);
        userId = response.data.id;
        // Save user data to AsyncStorage
        await AsyncStorage.setItem("name", name);
        await AsyncStorage.setItem("password", password);
        navigation.navigate("Home", { userId: userId });
      } else {
        alert("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again later.");
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containers}
      >
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
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 30,
            marginVertical: 10,
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Don't have an account?
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("CreateAccount")}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    marginVertical: 10,
    height: 40,
    padding: 10,
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
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
});
