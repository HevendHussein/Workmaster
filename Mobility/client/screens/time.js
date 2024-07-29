import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export default function Time() {
  const [time, setTime] = useState(getTimeTillMidnight());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeTillMidnight());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function getTimeTillMidnight() {
    const now = new Date();
    const then = new Date(now);
    then.setHours(24, 0, 0, 0);
    const diff = then - now;
    const hours = Math.floor(diff / 3.6e6);
    const mins = Math.floor((diff % 3.6e6) / 6e4);
    const secs = Math.floor((diff % 6e4) / 1000);
    return `${hours}h ${mins}m ${secs}s`;
  }

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Text>
        <MaterialIcons name="hourglass-full" size={20} color="#000" />
        {time}
        <MaterialIcons name="hourglass-full" size={20} color="#000" />
      </Text>
    </View>
  );
}
