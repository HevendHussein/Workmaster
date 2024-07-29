//create template
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Strider from "../images/items/Strider.png";
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

export default function Avatar({ level }) {
  const [boots, setBoots] = useState(Sandals);
  const [sword, setSword] = useState(Stick);
  const [armor, setArmor] = useState(Shirt);

  useEffect(() => {
    if (level >= 5) setSword(Dolch);
    if (level >= 10) setArmor(Lederwarms);
    if (level >= 12) setBoots(Lederschuhe);
    if (level >= 15) setArmor(Kettenhemd);
    if (level >= 20) setSword(Langschwert);
    if (level >= 25) setArmor(Armor);
    if (level >= 30) setArmor(Verziertearmor);
    if (level >= 35) setArmor(Magicarmor);
    if (level >= 40) setBoots(Magicboots);
    if (level >= 45) setSword(Runessword);
    if (level >= 50) setSword(Mastersword);
    if (level >= 55) setArmor(Mythicalarmor);
    if (level >= 60) setBoots(Lightboots);
    if (level >= 65) setSword(Lightsword);
  }, [level]);

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Image style={{ width: 200, height: 250 }} source={Strider} />
      <View>
        <Image
          /*Rüstungs-Item*/
          style={{ width: 100, height: 150, marginBottom: 10 }}
          source={armor}
          resizeMode="contain"
        />
        <Image
          /*Schuh-Item*/
          style={{ width: 100, height: 100 }}
          source={boots}
          resizeMode="contain"
        />
      </View>
      <Image
        /*Waffen-Item*/
        style={{ width: 70, height: 250 }}
        source={sword}
        resizeMode="contain"
      />
    </View>
  );
}
