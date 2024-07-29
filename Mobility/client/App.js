// import React, { useState, useEffect } from "react";
// import {
//   SafeAreaView,
//   FlatList,
//   Text,
//   StyleSheet,
//   Button,
//   TextInput,
//   View,
// } from "react-native";
// import axios from "axios";

// const App = () => {
//   const [users, setUsers] = useState([]);
//   const [newUser, setNewUser] = useState("");

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = () => {
//     console.log("Daten werden abgerufen");
//     axios
//       .get("http://192.168.178.24:3000/users")
//       .then((response) => {
//         setUsers(response.data);
//         console.log("Daten werden abgerufen2");
//       })
//       .catch((error) => {
//         console.error("Fehler bei der Datenabfrage: ", error);
//       });
//   };

//   const addUser = () => {
//     console.log("Adding user");
//     axios
//       .post("http://192.168.178.24:3000/addUser", { name: newUser })
//       .then((response) => {
//         console.log("User added successfully");
//         fetchUsers(); // Aktualisiere die Benutzerliste nach dem Hinzufügen eines Benutzers
//       })
//       .catch((error) => {
//         console.error("Fehler beim Hinzufügen des Benutzers: ", error);
//       });
//   };

//   const renderItem = ({ item }) => (
//     <Text style={styles.item}>
//       {item.name} - {item.id}
//     </Text>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text>Benutzerliste</Text>
//       <FlatList
//         data={users}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={renderItem}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Neuer Benutzername"
//           value={newUser}
//           onChangeText={setNewUser}
//         />
//         <Button title="Benutzer hinzufügen" onPress={addUser} />
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   item: {
//     padding: 10,
//     fontSize: 18,
//     height: 44,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     marginTop: 20,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 10,
//     marginRight: 10,
//   },
// });

// export default App;

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Navigator from "./routes/loginStack";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  return <Navigator />;
}
