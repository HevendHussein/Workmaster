import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Navigator from "./routes/loginStack";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  return <Navigator />;
}
