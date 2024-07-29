// RewardModal.js
import Stick from "../images/items/stick.png";
import Shirt from "../images/items/shirt.png";
import Sandals from "../images/items/sandals.png";
import Armor from "../images/items/armor.png";
import Dolch from "../images/items/dolch.png";
import Kettenhemd from "../images/items/kettenhemd.png";
import Langschwert from "../images/items/langschwert.png";
import Lederschuhe from "../images/items/lederschuhe.png";
import Lederwarms from "../images/items/lederwarms.png";
import Lightboots from "../images/items/lightboots.png";
import Lightsword from "../images/items/lightsword.png";
import Magicarmor from "../images/items/magicarmor.png";
import Magicboots from "../images/items/magicboots.png";
import Mastersword from "../images/items/mastersword.png";
import Mythicalarmor from "../images/items/mythicalarmor.png";
import Runessword from "../images/items/runessword.png";
import Verziertearmor from "../images/items/verziertearmor.png";
import Icon from "react-native-vector-icons/Ionicons";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

const RewardModal = ({ showModal, level, onClose }) => {
  const [userLevel, setUserLevel] = useState(level);
  const images = [
    { image: Stick, category: "sword", level: 0 },
    { image: Shirt, category: "armor", level: 0 },
    { image: Sandals, category: "boots", level: 0 },
    { image: Dolch, category: "sword", level: 5 },
    { image: Lederwarms, category: "armor", level: 10 },
    { image: Lederschuhe, category: "boots", level: 12 },
    { image: Kettenhemd, category: "armor", level: 15 },
    { image: Langschwert, category: "sword", level: 20 },
    { image: Armor, category: "armor", level: 25 },
    { image: Verziertearmor, category: "armor", level: 30 },
    { image: Magicarmor, category: "armor", level: 35 },
    { image: Magicboots, category: "boots", level: 40 },
    { image: Runessword, category: "sword", level: 45 },
    { image: Mastersword, category: "sword", level: 50 },
    { image: Mythicalarmor, category: "armor", level: 55 },
    { image: Lightboots, category: "boots", level: 60 },
    { image: Lightsword, category: "sword", level: 65 },
  ];

  useEffect(() => {
    setUserLevel(level);
  }, [level]);

  const reward = images.find((image) => image.level === userLevel);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        activeOpacity={1}
        onPressOut={onClose}
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
            {reward && (
              <Image
                source={reward.image}
                style={{
                  marginBottom: 20,
                  width: "90%",
                  height: "70%",
                  resizeMode: "contain",
                }}
              />
            )}
            <Text>Du hast eine Belohnung erhalten!</Text>
            <Icon
              name="close-circle"
              size={30}
              onPress={onClose}
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
  );
};

export default RewardModal;
