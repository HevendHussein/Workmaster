import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Egg from "../images/items/egg.png";
import BuffPotion from "../images/buffpotion.png"; // Replace with the path to your image
import DebuffPotion from "../images/debuffpotion.png"; // Replace with the path to your image
import axios from "axios";

const DailyPotion = ({ userId }) => {
  const config = require("./config");
  const [modalVisible, setModalVisible] = useState(false);
  const [potionImage, setPotionImage] = useState(null);
  const [lastPotionDB, setLastPotionDB] = useState(0);

  const parseBigInt = (key, value) => {
    return typeof value === "string" && /^[0-9]+$/.test(value)
      ? BigInt(value)
      : value;
  };

  const parseResponse = (data) => {
    return JSON.parse(data, parseBigInt);
  };

  const updateStepsInDb = (id) => {
    axios
      .post(`${config.ipAddress}/updateStepAfterPotion`, { id })
      .then((response) => {
        // Verwende die parseResponse-Funktion, um die Antwort zu deserialisieren
        const parsedResponse = parseResponse(response.data);

        // Debugging: Überprüfen der deserialisierten Antwort
        console.log("Parsed response:", parsedResponse);

        // Weiteres Handling der Antwort, falls erforderlich
        if (parsedResponse.success) {
          console.log("Steps successfully updated");
        } else {
          console.warn("Failed to update steps:", parsedResponse.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to update steps in database:", error);
      });
  };

  const updateNumberOfDebuff = (id) => {
    axios
      .post(`${config.ipAddress}/updateNumberOfDebuff`, { id })
      .then((response) => {
        // Handle response here if needed
      })
      .catch((error) => {
        console.warn("Failed to update number of debuffs:", error);
      });
  };

  const updateLastPotionInDB = (id) => {
    axios
      .post(`${config.ipAddress}/updateLastPotionClick`, { id, potionClick: 1 })
      .then((response) => {
        if (response.data.success) {
          //   console.log("Successfully updated last click");
        } else {
          console.warn("Failed to update last click:", response.data.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to update last click:", error);
      });
  };

  const handlePress = () => {
    fetchLastPotion(userId);
    if (lastPotionDB !== 1) {
      //   console.log("hier if", lastPotionDB);
      const random = Math.random();
      const selectedPotion = random < 0.9 ? BuffPotion : DebuffPotion;
      setPotionImage(selectedPotion);
      setModalVisible(true);
      if (selectedPotion === DebuffPotion) {
        updateNumberOfDebuff(userId);
      }
      if (selectedPotion === BuffPotion) {
        updateStepsInDb(userId);
      }
      updateLastPotionInDB(userId);
      setLastPotionDB(1);
    } else {
      alert("Du hast bereits deine tägliche Belohnung erhalten.");
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const fetchLastPotion = (id) => {
    axios
      .get(`${config.ipAddress}/getLastPotionClick`, { params: { id } })
      .then((response) => {
        if (response.data.success) {
          setLastPotionDB(response.data.potionClick); // Update the value of the lastClickDB state variable
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch last click:", error);
      });
  };

  useEffect(() => {
    fetchLastPotion(userId);
  }, [userId, lastPotionDB]);

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Image style={{ width: 70, height: 60 }} source={Egg} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleClose}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          activeOpacity={1}
          onPressOut={handleClose}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                marginTop: 22,
                backgroundColor: "white",
                padding: 20,
                width: "80%",
                height: "50%",
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {potionImage && (
                <Image
                  source={potionImage}
                  style={{
                    marginBottom: 20,
                    width: "90%",
                    height: "70%",
                    resizeMode: "contain",
                  }}
                />
              )}
              <Text style={{ textAlign: "center" }}>
                {potionImage === BuffPotion
                  ? "Buff-Trank erhalten!\n\n+750 Steps!"
                  : "Debuff-Trank erhalten!\nVerfluche andere Spieler bei Attack!"}
              </Text>
              <Icon
                name="close-circle"
                size={30}
                onPress={handleClose}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DailyPotion;
