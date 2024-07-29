//create template
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
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
import Bag from "../images/bag.png";
import Icon from "react-native-vector-icons/Ionicons";

export default function InventoryModal({ level }) {
  const [userLevel, setUserLevel] = useState(level);

  const [modalVisible, setModalVisible] = useState(false);
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
  // Sortieren Sie das Array basierend auf den Leveln
  images.sort((a, b) => a.level - b.level);

  const boots = images.filter((image) => image.category === "boots");
  const armors = images.filter((image) => image.category === "armor");
  const swords = images.filter((image) => image.category === "sword");

  const maxLength = Math.max(boots.length, armors.length, swords.length);
  const allItems = Array.from({ length: maxLength }).map((_, i) => ({
    boot: boots[i] || null,
    armor: armors[i] || null,
    sword: swords[i] || null,
  }));

  function getColorBasedOnLevel(itemLevel, userLevel) {
    if (itemLevel > userLevel && itemLevel <= userLevel + 10) {
      return "orange";
    } else if (itemLevel > userLevel && itemLevel > userLevel + 10) {
      return "red";
    } else {
      return "black";
    }
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          // marginRight: 20,
        }}
      >
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            /*Schuh-Item*/
            style={{ width: 60, height: 65 }}
            source={Bag} // Use one of your images here
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

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
                marginTop: 22,
                backgroundColor: "white",
                padding: 20,
                width: "80%",
                height: "60%",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <FlatList
                  data={allItems}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={item.boot ? item.boot.image : null}
                          style={{
                            width: 75,
                            height: 100,
                            margin: 5,
                            tintColor:
                              item.boot && item.boot.level > userLevel
                                ? "black"
                                : null,
                          }}
                          resizeMode="contain"
                        />
                        {item.boot && (
                          <Text
                            style={{
                              color: getColorBasedOnLevel(
                                item.boot.level,
                                userLevel
                              ),
                            }}
                          >
                            LvL: {item.boot.level}
                          </Text>
                        )}
                      </View>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={item.armor ? item.armor.image : null}
                          style={{
                            width: 75,
                            height: 100,
                            margin: 5,
                            tintColor:
                              item.armor && item.armor.level > userLevel
                                ? "black"
                                : null,
                          }}
                          resizeMode="contain"
                        />
                        {item.armor && (
                          <Text
                            style={{
                              color: getColorBasedOnLevel(
                                item.armor.level,
                                userLevel
                              ),
                            }}
                          >
                            LvL: {item.armor.level}
                          </Text>
                        )}
                      </View>
                      <View style={{ alignItems: "center" }}>
                        <Image
                          source={item.sword ? item.sword.image : null}
                          style={{
                            width: 75,
                            height: 100,
                            margin: 5,
                            tintColor:
                              item.sword && item.sword.level > userLevel
                                ? "black"
                                : null,
                          }}
                          resizeMode="contain"
                        />
                        {item.sword && (
                          <Text
                            style={{
                              color: getColorBasedOnLevel(
                                item.sword.level,
                                userLevel
                              ),
                            }}
                          >
                            LvL: {item.sword.level}
                          </Text>
                        )}
                      </View>
                    </View>
                  )}
                />
              </View>

              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Icon name="close" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
