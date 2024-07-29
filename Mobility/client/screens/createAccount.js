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

    console.log(`IP Address: ${config.ipAddress}, Status: 1`);
    axios
      .post(
        `${config.ipAddress}/register`,
        { name, password },
        { timeout: 5000 }
      )
      .then((response) => {
        if (response.data.passwordExists) {
          alert(
            "Das Passwort existiert bereits. Bitte wählen Sie ein anderes Passwort."
          );
        } else {
          console.log("User registered successfully");
          navigation.navigate("LoginScreen"); // Navigiere zur Login-Seite nach erfolgreicher Registrierung
        }
      })
      .catch((error) => {
        if (error.response) {
          // Server hat mit einem anderen Status als 2xx geantwortet
          console.error(
            "Server responded with an error:",
            error.response.status
          );
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // Anfrage wurde gemacht, aber keine Antwort erhalten
          console.error("No response received:", error.request);
        } else {
          // Ein anderes Problem trat während des Anforderungsaufbaus auf
          console.error("Error setting up request:", error.message);
        }
        console.error("Error stack trace:", error.stack);
        console.error("Request URL:", `${config.ipAddress}/register`);
        console.error("Request data:", { name, password });
        console.error("Full error object:", error);
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
