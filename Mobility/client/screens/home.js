import React, { useState, useEffect, useContext } from "react";
import { Pedometer } from "expo-sensors";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Progress from "react-native-progress";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Time from "./time";
import { Alert, Image } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import Treasur from "../lottify/treasur";
import Avatar from "./avatar";
import InventoryModal from "./inventorymodal";
import RewardModal from "./rewardmodal";
import DailyPotion from "./dailypotion";
import HealMap from "./healMap";
import HealMapImage from "../images/MapForHeal.jpg";
import Grind from "../images/grind.png";
import PoisonSpit from "../images/poisonspit.png";
const CALORIES_PER_STEP = 0.05;

/*
TODO: Überprüfe, ob bei Lvl 12 es auch die richtige Belohnung gibt, diese nur
einmal angezeigt wird und nicht das ganze Level
TODO: Wenn es eine Belohnung gibt, dann wird diese angezeigt über Bildschirm,
diese wird hierzu schwarz
TODO: Inventar wird hinzugefügt

*/

export default function Home({ route, navigation }) {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const config = require("./config"); // Import your config file
  const { userId } = route.params; // Abrufen der userId aus den Routenparametern
  const [username, setUsername] = useState("");
  const [level, setLevel] = useState(1); // Definieren Sie die level Zustandsvariable mit einem Anfangswert von 1
  const [stepsDB, setStepsDB] = useState(0);
  const [nextLevelSteps, setNextLevelSteps] = useState(0); // Definieren Sie die nextLevelSteps Zustandsvariable mit einem Anfangswert von 1000
  const [stepsInThisLevel, setStepsInThisLevel] = useState(0); // Definieren Sie die stepsInThisLevel Zustandsvariable mit einem Anfangswert von 0
  const [levelUp, setLevelUp] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastClickDB, setLastClickDB] = useState(0);
  const [singedDB, setSingedDB] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const rewards = {
    5: "Ein Dolch",
    10: "Ein Lederwams",
    12: "Lederschuhe",
    15: "Ein Kettenhemd",
    20: "Ein Langschwert",
    25: "Eine vollständige Rüstung",
    30: "Verzierte Rüstung",
    35: "Magische Rüstung mit Glüheffekten",
    40: "Legendäre Stiefel mit Runen",
    45: "Ein legendäres Schwert mit Runen",
    50: "Ein Meisterschwert mit komplexen Verzierungen",
    55: "Mythische Rüstung mit leuchtenden Symbolen",
    60: "Epische Stiefel, die von Licht umgeben sind",
    65: "Ein episches Schwert, das von Licht umgeben ist",
  };
  //in userId ist die ID des Benutzers gespeichert
  //console.log(userId);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${config.ipAddress}/user/${userId}`);
        if (response.data.success) {
          setUsername(response.data.user.name);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [userId]);

  useEffect(() => {
    let subscription;

    const checkAndRequestPedometerPermission = async () => {
      const { granted } = await Pedometer.getPermissionsAsync();
      if (!granted) {
        const { status } = await Pedometer.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access pedometer was denied");
          return;
        }
      }

      if (isTracking) {
        Pedometer.isAvailableAsync().then((result) => {
          if (result) {
            subscription = Pedometer.watchStepCount((data) => {
              setSteps(data.steps);
            });
          } else {
            console.log("Pedometer is not available");
          }
        });
      }
    };

    checkAndRequestPedometerPermission();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [isTracking]);

  const updateStepsInDb = (newSteps, id) => {
    axios
      .post(`${config.ipAddress}/updateSteps`, { steps: newSteps, id })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        // Handle parsed response if needed
        console.log(parsedResponse);
      })
      .catch((error) => {
        console.warn("Failed to update steps in database:", error);
      });
  };

  const updateStepsLastDayInDb = (newSteps, id) => {
    // Use axios to send the steps and the id to your database
    axios
      .post(`${config.ipAddress}/updateStepsLastDay`, { steps: newSteps, id })
      .then((response) => {
        //console.log(response.data);
      })
      .catch((error) => {
        console.warn("Failed to update steps in database:", error);
      });
  };

  const toggleTracking = () => {
    if (isTracking) {
      updateStepsInDb(steps, userId);
      updateStepsLastDayInDb(steps, userId);
      setSteps(0);
    }
    setIsTracking(!isTracking);
  };

  //lvl aus der Datenbank holen
  const fetchUserLevel = (id) => {
    axios
      .get(`${config.ipAddress}/getUserLevel`, { params: { id } })
      .then((response) => {
        if (response.data.success) {
          setLevel(response.data.level); // Aktualisieren Sie den Wert der level Zustandsvariable
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

  const fetchUserSteps = (id) => {
    axios
      .get(`${config.ipAddress}/getUserSteps`, { params: { id } })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          setStepsDB(parsedResponse.steps); // Aktualisieren Sie den Wert der stepsDB Zustandsvariable
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch user steps:", error);
      });
  };

  // Rufe fetchUserSteps auf, wenn sich die userId ändert
  useEffect(() => {
    fetchUserSteps(userId);
  }, [userId, isTracking]);

  useEffect(() => {
    fetchUserSteps(userId);
  });

  // Funktion zur Berechnung der Gesamtzahl der Schritte, die benötigt werden, um das nächste Level zu erreichen
  const calculateNextLevelSteps = (currentLevel) => {
    let totalSteps = 1000;
    for (let i = 2; i <= currentLevel; i++) {
      totalSteps += 1000 + 250 * (i - 1);
    }
    return totalSteps;
  };

  // Funktion zur Berechnung des aktuellen Levels basierend auf der Gesamtzahl der Schritte
  const calculateCurrentLevel = (totalSteps) => {
    let level = 1;
    let nextLevelSteps = 1000;

    while (totalSteps >= nextLevelSteps) {
      level++;
      nextLevelSteps = calculateNextLevelSteps(level);
    }

    return level;
  };

  // Funktion zum Aktualisieren des Levels in der Datenbank
  const updateLevelInDb = (newLevel, id) => {
    // Verwenden Sie axios, um das Level und die ID an Ihre Datenbank zu senden
    axios
      .post(`${config.ipAddress}/updateLevel`, { level: newLevel, id })
      .then((response) => {
        //console.log(response.data);
      })
      .catch((error) => {
        console.warn("Failed to update level in database:", error);
      });
  };

  const getStepsFromDb = (id) => {
    return axios
      .get(`${config.ipAddress}/getUserSteps`, { params: { id } })
      .then((response) => {
        const parsedResponse = parseResponse(JSON.stringify(response.data));
        if (parsedResponse.success) {
          return parsedResponse.steps;
        } else {
          throw new Error("Failed to fetch user steps");
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch user steps:", error);
        throw error;
      });
  };

  // Überprüfen Sie, ob der Benutzer das nächste Level erreicht hat, wenn sich stepsDB oder steps ändern
  useEffect(() => {
    const totalSteps = stepsDB + steps;
    const currentLevel = calculateCurrentLevel(totalSteps);

    if (currentLevel !== level) {
      setLevel(currentLevel);
      updateLevelInDb(currentLevel, userId); // Aktualisieren Sie das Level in der Datenbank
    }
  }, [stepsDB, steps, level, userId]);

  // Funktion zur Berechnung der Schritte, die in diesem Level gemacht wurden
  const calculateCurrentLevelSteps = (totalSteps, currentLevel) => {
    let previousLevelSteps = 0;
    for (let i = 1; i < currentLevel; i++) {
      previousLevelSteps += 1000 + 250 * (i - 1);
    }
    return totalSteps - previousLevelSteps;
  };

  // Funktion zur Berechnung der Schritte, die für dieses Level benötigt werden
  const calculateLevelSteps = (currentLevel) => {
    return 1000 + 250 * (currentLevel - 1);
  };

  // Funktion zur Berechnung des Fortschritts zum nächsten Level
  const calculateProgress = (totalSteps, currentLevel) => {
    const currentLevelSteps = calculateCurrentLevelSteps(
      totalSteps,
      currentLevel
    );
    const levelSteps = calculateLevelSteps(currentLevel);
    if (currentLevelSteps === levelSteps && !levelUp) {
      setLevelUp(true);
    }
    return currentLevelSteps / levelSteps;
  };

  useEffect(() => {
    getStepsFromDb(userId)
      .then((newSteps) => {
        setStepsDB(newSteps);
      })
      .catch((error) => {
        console.warn("Failed to get steps from database:", error);
      });
  }, [userId, stepsDB]); // Dependency array includes both userId and stepsDB

  useEffect(() => {
    const reward = rewards[level];
    if (reward && levelUp) {
      console.log("Level Up! Reward the user. in UseEffect");
      console.log(`The user has earned: ${reward}`);
      //erhohe steps und stepsDB um 1
      setSteps(steps + 1);
      setStepsDB(stepsDB + 1);
      setShowModal(true); // Modal öffnen, wenn der Benutzer eine Belohnung erhält
    }
    setLevelUp(false);
  }, [level]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Logout", "Are you sure you want to logout?", [
          {
            text: "Cancel",
            onPress: () => navigation.navigate("Home", { userId: userId }),
            style: "cancel",
          },
          { text: "YES", onPress: () => navigation.navigate("LoginScreen") },
        ]);
        return true;
      };

      navigation.addListener("beforeRemove", onBackPress);

      return () => navigation.removeListener("beforeRemove", onBackPress);
    }, [navigation])
  );

  const fetchLastClick = (id) => {
    axios
      .get(`${config.ipAddress}/getLastClick`, { params: { id } })
      .then((response) => {
        if (response.data.success) {
          setLastClickDB(response.data.lastClick); // Update the value of the lastClickDB state variable
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch last click:", error);
      });
  };

  // Call fetchLastClick when the userId changes
  useEffect(() => {
    fetchLastClick(userId);
  }, [userId, lastClickDB]);

  const updateLastClickInDb = (id) => {
    axios
      .post(`${config.ipAddress}/updateLastClick`, { id, lastClick: 1 })
      .then((response) => {
        if (response.data.success) {
          console.log("Successfully updated last click");
        } else {
          console.warn("Failed to update last click:", response.data.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to update last click:", error);
      });
  };

  const fetchSinged = (id) => {
    axios
      .get(`${config.ipAddress}/getSinged`, { params: { id } })
      .then((response) => {
        if (response.data.success) {
          const singedName = response.data.singedName;
          setSingedDB(singedName); // Update the value of the singedDB state variable
        } else {
          setSingedDB("");
          // console.warn("Failed to fetch singed data:", response.data.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch singed data:", error);
      });
  };

  useEffect(() => {
    fetchSinged(userId);
  });

  return (
    <SafeAreaView style={styles.containers}>
      <RewardModal
        showModal={showModal}
        level={level}
        onClose={() => setShowModal(false)}
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ ...styles.lead, marginLeft: 10 }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Attack", {
                userId,
                checkAndRequestPedometerPermission:
                  this.checkAndRequestPedometerPermission,
              })
            }
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Attack <MaterialIcon name="sword" size={20} color="#000" />
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.lead}>
          <TouchableOpacity
            onPress={() => navigation.navigate("LeaderBoard", { userId })}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Leaderboard {"\u2192"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.name}>
        <Text style={styles.title}>Name: {username}</Text>
        <Text style={styles.title}>LvL: {level}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 5,
          marginRight: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("HealMap", { userId })}
        >
          <Image source={HealMapImage} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>

        <View style={{ flex: 3 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            {singedDB !== "" ? (
              <Image source={PoisonSpit} style={{ width: 35, height: 35 }} />
            ) : (
              <Image source={Grind} style={{ width: 35, height: 35 }} />
            )}
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
              activeOpacity={1}
              onPressOut={() => setModalVisible(false)}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    width: "80%",
                    borderRadius: 10, // Runde Ecken hinzufügen
                    shadowColor: "#000", // Schatten hinzufügen
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{ alignSelf: "flex-end" }}
                  >
                    <Icon name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Text>
                    {singedDB !== "" ? (
                      <>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                          {singedDB}
                        </Text>
                        <Text>
                          {" "}
                          hat dich vergiftet! Finde einen Heiltrank, ansonsten
                          werden deine Steps reduziert!
                        </Text>
                      </>
                    ) : (
                      "Sammle EX-Booster und werde stärker."
                    )}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
        </View>

        <InventoryModal level={level} />
      </View>

      <View>
        <Avatar level={level} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            marginRight: 10,
            fontSize: 25,
            fontWeight: "bold",
            color: "#3498db",
          }}
        >
          Drücke{" "}
        </Text>
        <View style={styles.TrackingButtonPos}>
          <TouchableOpacity
            style={styles.TrackingButton}
            onPress={toggleTracking}
          >
            {isTracking ? (
              <Icon name="pause" size={30} color="#fff" />
            ) : (
              <Icon name="play" size={30} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.progressBar}>
        <Progress.Bar
          progress={calculateProgress(stepsDB + steps, level)}
          width={200}
        />
        <View>
          <Text>
            {calculateCurrentLevelSteps(stepsDB + steps, level)}/
            {calculateLevelSteps(level)}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.lead}>
          <TouchableOpacity
            onPress={() => {
              fetchLastClick(userId);
              if (lastClickDB !== 1) {
                updateLastClickInDb(userId);
                setLastClickDB(1);
                navigation.navigate("DailyMission", { userId });
              }
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: lastClickDB !== 1 ? 25 : 20,
                color: lastClickDB !== 1 ? "red" : "black",
                textDecorationLine: lastClickDB === 1 ? "line-through" : "none",
              }}
            >
              DailyMission
            </Text>
          </TouchableOpacity>
        </View>

        <DailyPotion userId={userId} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    marginTop: 24,
  },
  lead: {
    alignItems: "flex-end",
    marginRight: 10,
    marginTop: 10,
  },
  name: {
    alignItems: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  TrackingButtonPos: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  TrackingButton: {
    backgroundColor: "#2c3e50",
    marginVertical: 10,
    padding: 15,
    alignItems: "center",
    width: "auto",
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  infoContainer: {
    alignItems: "center",
    // backgroundColor: "green",
  },
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "blue",
  },
  stepsText: {
    fontSize: 33,
    fontWeight: "bold",
    marginRight: 8,
    color: "#3498db",
  },
  stepsLabel: {
    fontSize: 16,
    color: "#555",
  },
  caloriesText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  progressBar: {
    margin: 10,
    alignItems: "center",
  },
});
