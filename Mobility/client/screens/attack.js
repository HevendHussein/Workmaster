/*
SHIFT + ALT + F
*/

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import axios from "axios";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
const config = require("./config");
import Time from "./time";
import * as Notifications from "expo-notifications";
import DebuffPotion from "../images/debuffpotion.png";
import PoisonSpit from "../images/poisonspit.png";

export default function Attack({ route, navigation }) {
  const config = require("./config"); // Import your config file
  const { userId } = route.params; // Abrufen der userId aus den Routenparametern
  const [level, setLevel] = useState(0); // Zustandsvariable zum Speichern des Benutzerniveaus
  const [users, setUsers] = useState([]);
  const [isAttackClicked, setIsAttackClicked] = useState(false);
  const [isDebuffClicked, setIsDebuffClicked] = useState(false);
  const [dmgPoints, setDmgPoints] = useState(0);
  const [numberOfDebuff, setNumberOfDebuff] = useState(0);

  const parseBigInt = (key, value) => {
    if (typeof value === "string" && /^[0-9]+$/.test(value)) {
      const num = Number(value);
      return num > Number.MAX_SAFE_INTEGER ? BigInt(value) : num;
    }
    return value;
  };

  const parseResponse = (data) => {
    return JSON.parse(data, parseBigInt);
  };

  const fetchNumberOfDebuff = (id) => {
    axios
      .get(`${config.ipAddress}/getNumberOfDebuff`, { params: { id } })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          setNumberOfDebuff(parsedResponse.numberOfDebuff);
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch numberOfDebuff:", error);
      });
  };

  const fetchAttackPoints = (id) => {
    axios
      .get(`${config.ipAddress}/getDmgPoints`, { params: { id } })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          setDmgPoints(parsedResponse.dmgPoints);
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch dmgPoints:", error);
      });
  };

  useEffect(() => {
    fetchAttackPoints(userId);
    fetchNumberOfDebuff(userId);
  }, [userId, numberOfDebuff]);

  const fetchUserLevel = (id) => {
    axios
      .get(`${config.ipAddress}/getUserLevel`, { params: { id } })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          setLevel(parsedResponse.level); // Aktualisieren Sie den Wert der level Zustandsvariable
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch user level:", error);
      });
  };

  //rufe fetchUserLevel auf, wenn sich die userId ändert
  useEffect(() => {
    fetchUserLevel(userId);
  }, [userId]);

  const fetchUsers = () => {
    axios
      .get(`${config.ipAddress}/everynameandstepsandlevelandidandpoisened`)
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse) {
          const sortedUsers = parsedResponse.sort((a, b) => b.steps - a.steps);
          setUsers(sortedUsers);
        } else {
          console.error("Response is undefined");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const attackUser = (user2, dmgPoints, userId) => {
    axios
      .post(`${config.ipAddress}/attackUser`, { user2, dmgPoints, userId })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          setDmgPoints(0);
        }
      })
      .catch((error) => {
        console.warn("Failed to attack user:", error);
      });
  };

  // In the parent component
  const updateUserSteps = (userId, newSteps) => {
    // console.log(userId, newSteps);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, steps: newSteps } : user
      )
    );
  };

  const reduceNumberOfDebuff = (userId) => {
    setNumberOfDebuff(numberOfDebuff - 1);
    axios
      .post(`${config.ipAddress}/reduceNumberOfDebuff`, { userId })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          // console.log("Number of debuff reduced successfully");
        } else {
          console.log("Failed to update numberOfDebuff");
        }
      })
      .catch((error) => {
        console.warn("Failed to update numberOfDebuff:", error);
      });
  };

  const setPoisenedUser = (user2) => {
    axios
      .post(`${config.ipAddress}/raisePoisened`, { userId: user2 })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          // console.log("Updated poisened user successfully");
        } else {
          console.log("Failed to update poisened user");
        }
      })
      .catch((error) => {
        console.warn("Failed to update poisened user:", error);
      });
  };

  const setSinged = (user2, userId) => {
    axios
      .post(`${config.ipAddress}/setSinged`, { user2, userId })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          // console.log("Updated singed user successfully");
        } else {
          console.log("Failed to update singed user");
        }
      })
      .catch((error) => {
        console.warn("Failed to update singed user:", error);
      });
  };

  const updateAfterDebuff = (userId, user2) => {
    // console.log("Hier userId", userId);
    reduceNumberOfDebuff(userId);
    setPoisenedUser(user2);
    setSinged(user2, userId);
    fetchUsers();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: isDebuffClicked
          ? "green"
          : isAttackClicked
          ? "#808080"
          : "#FFF",
      }}
    >
      <View>
        <Time />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsAttackClicked(true);
            setIsDebuffClicked(false);
          }}
        >
          <Text style={{ fontSize: 20 }}>
            Attack
            <MaterialIcon name="sword" size={20} color="#000" />
            <MaterialIcon name="fire" size={20} color="#ff0000" />
            {dmgPoints}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsAttackClicked(false);
            setIsDebuffClicked(false);
          }}
        >
          <Text style={{ fontSize: 20 }}>
            Cancel <MaterialIcon name="cancel" size={20} color="#ff0000" />
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          marginBottom: 20,
          marginHorizontal: 20,
          // alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setIsDebuffClicked(true);
            setIsAttackClicked(false);
          }}
          style={{
            flexDirection: "row",
            width: 100,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>
            {numberOfDebuff}
            {"  "}*
          </Text>
          <Image
            source={DebuffPotion}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          updateUserSteps={updateUserSteps}
          data={users
            .filter(
              (user) => Math.abs(user.level - level) <= 5 && user.id !== userId
            )
            .sort((a, b) => b.level - a.level)} // Sort users by level in descending order
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (isAttackClicked) {
                    newSteps = item.steps - dmgPoints;
                    if (newSteps < 0) {
                      newSteps = 0;
                    }
                    updateUserSteps(item.id, newSteps);
                    attackUser(item.id, dmgPoints, userId);
                    setIsAttackClicked(false); // Reset the state after clicking an item
                  }
                  if (isDebuffClicked) {
                    if (numberOfDebuff === 0) {
                      setIsDebuffClicked(false);
                    } else {
                      updateAfterDebuff(userId, item.id);
                      setIsDebuffClicked(false);
                    }
                  }
                }}
                style={styles.userContainer}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 16,
                        marginBottom: 10,
                      }}
                    >
                      {item.name} (LvL. {item.level})
                    </Text>
                  </View>
                  {item.poisened === 1 && (
                    <Image
                      source={PoisonSpit}
                      style={{ width: 35, height: 35 }}
                    />
                  )}
                </View>
                <View style={{ alignItems: "center" }}>
                  <Text>{item.steps} Steps</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  userContainer: {
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: "center",
    width: "80%",
  },
});
