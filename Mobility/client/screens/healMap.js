import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { getDistance } from "geolib"; // Import getDistance function
import Box from "../images/HealPotion.png";
import UserIcon from "../images/walking.png";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
import BuffPotion from "../images/buffpotion.png";
import HealPotion from "../images/HealPotion.png";
import Icon from "react-native-vector-icons/Ionicons";
const config = require("./config");
const GOOGLE_MAPS_APIKEY = "AIzaSyAU0Au_YVLnx6hb5P5Vl9b6wxi29X6K284";

const HealMap = ({ route }) => {
  const [addresses, setAddresses] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const { userId } = route.params;
  const [poisenedUser, setPoisenedUser] = useState(null);
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [modalPoisen, setModalPoisen] = useState(false);
  const [gotReward, setGotReward] = useState(false);

  useEffect(() => {
    let watcher = null;

    async function watchPosition() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Permission to access location was denied");
        return;
      }

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
        }
      );
    }

    watchPosition();

    return () => {
      if (watcher) {
        watcher.remove();
      }
    };
  }, []);

  const generateRandomCoordinates = () => {
    const minLatitude = 52.3341;
    const maxLatitude = 52.4206;
    const minLongitude = 9.664;
    const maxLongitude = 9.8471;

    const latitude = Math.random() * (maxLatitude - minLatitude) + minLatitude;
    const longitude =
      Math.random() * (maxLongitude - minLongitude) + minLongitude;

    return { latitude, longitude };
  };

  // Create an async function to handle the await keyword
  const updateAddress = async (index) => {
    // Generate a new random address
    const newCoords = generateRandomCoordinates();
    const newAddressResult = await Location.reverseGeocodeAsync(newCoords);
    const newAddress = `${newAddressResult[0].street} ${newAddressResult[0].houseNumber}, ${newAddressResult[0].postalCode}, ${newAddressResult[0].city}, ${newAddressResult[0].region}, ${newAddressResult[0].country}`;
    // Update the address in the state
    setAddresses((prevAddresses) => {
      const updatedAddresses = [...prevAddresses];
      updatedAddresses[index].adr = newAddress;
      return updatedAddresses;
    });

    // console.log("addresses[index].id", addresses[index].id);

    axios
      .post(`${config.ipAddress}/updateAddress`, {
        adr: newAddress,
        id: addresses[index].id,
      })
      .then((response) => {
        if (response.data.success) {
          //   console.log("Successfully updated address in the database");
        } else {
          console.warn(
            "Failed to update address in the database:",
            response.data.message
          );
        }
      })
      .catch((error) => {
        console.warn("Failed to update address in the database:", error);
      });
  };

  const gotBooster = (id) => {
    axios
      .post(`${config.ipAddress}/updateStepAfterBuff`, { id })
      .then((response) => {
        // Handle response here if needed
      })
      .catch((error) => {
        console.warn("Failed to update steps in database:", error);
      });
  };

  const updatePoisendedUser = (id) => {
    axios
      .post(`${config.ipAddress}/updatePoisendAfterHeal`, { id })
      .then((response) => {
        // Handle response here if needed
      })
      .catch((error) => {
        console.warn("Failed to update steps in database:", error);
      });
  };

  useEffect(() => {
    if (location && coordinates.length > 0) {
      coordinates.forEach((coordinate, index) => {
        const distance = getDistance(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          { latitude: coordinate.latitude, longitude: coordinate.longitude }
        );
        // console.log(`Distance to coordinate ${index}: ${distance} meters`);
        if (distance <= 50) {
          (async () => {
            await updateAddress(index);
          })();
          if (!gotReward) {
            if (poisenedUser === 1) {
              setModalPoisen(true);
              updatePoisendedUser(userId);
            } else {
              gotBooster(userId);
            }
            setModalVisible(true);
            setGotReward(true);
          }
        }
      });
    }
  }, [location, coordinates, addresses]);

  useEffect(() => {
    axios
      .get(`${config.ipAddress}/addresses`)
      .then((response) => {
        if (response.data.success) {
          //   console.log("Successfully fetched addresses");
          //   console.log(response.data.addresses); // Log addresses to console
          setAddresses(
            response.data.addresses.map((address) => ({
              ...address,
              place: address.place === null ? 0 : address.place,
            }))
          );
        } else {
          console.warn("Failed to fetch addresses:", response.data.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch addresses:", error);
      });
  }, []);

  async function getCoordinates(addresses) {
    const coordinates = await Promise.all(
      addresses.map(async (address) => {
        const result = await Location.geocodeAsync(address.adr);
        if (result.length > 0) {
          return {
            latitude: result[0].latitude,
            longitude: result[0].longitude,
          };
        } else {
          console.warn(`Failed to geocode address: ${address.adr}`);
          return null;
        }
      })
    );

    return coordinates.filter(Boolean); // Remove null values
  }

  useEffect(() => {
    if (addresses.length > 0) {
      getCoordinates(addresses)
        .then((coordinates) => {
          //   console.log("Coordinates:", coordinates);
          setCoordinates(coordinates);
        })
        .catch((error) => {
          console.warn("Failed to get coordinates:", error);
        });
    }
  }, [addresses]);

  const fetchPoisenedUser = (userId) => {
    axios
      .get(`${config.ipAddress}/getPoisened`, { params: { userId } })
      .then((response) => {
        if (response.data.success) {
          let poisenedUser = response.data.user.poisened;
          setPoisenedUser(poisenedUser);
        } else {
          console.warn("Failed to get poisened user:", response.data.message);
        }
      })
      .catch((error) => {
        console.warn("Failed to get poisened user:", error);
      });
  };

  useEffect(() => {
    fetchPoisenedUser(userId);
  }, [poisenedUser]);

  function cleanAddress(addressParts) {
    if (!Array.isArray(addressParts)) {
      if (typeof addressParts === "string") {
        addressParts = [addressParts]; // Macht ein Array aus einem String
      } else {
        console.error("addressParts is not an array or is undefined");
        return []; // Frühe Rückkehr mit leerem Array, um Fehler zu vermeiden
      }
    }

    const cleanedAddressParts = addressParts.map((part) => {
      if (part) {
        // Teilt das Teil in Wörter
        const words = part.split(" ");
        // Findet den Index des ersten Worts, das mit einem Komma endet
        const indexToRemove = words.findIndex((word) => word.endsWith(","));
        // Entfernt das Wort, wenn gefunden
        if (indexToRemove !== -1) {
          words.splice(indexToRemove, 1);
        }
        return words.join(" "); // Verbindet die verbleibenden Wörter wieder zu einem String
      }
      return part; // Gibt das unveränderte Teil zurück, falls es leer ist
    });

    return cleanedAddressParts; // Gibt das modifizierte Array von addressParts zurück
  }

  return (
    <View style={{ flex: 1 }}>
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
          onPressOut={() => {
            setModalVisible(false);
            navigation.navigate("Home", { userId: userId });
          }}
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
              <Image
                source={modalPoisen ? HealPotion : BuffPotion}
                style={{
                  marginBottom: 20,
                  width: "90%",
                  height: "70%",
                  resizeMode: "contain",
                }}
              />
              {modalPoisen ? (
                <Text>Du hast das Gegenmittel gefunden!</Text>
              ) : (
                <Text>Du hast einen EX-Booster erhalten!</Text>
              )}
              <Icon
                name="close-circle"
                size={30}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Home", { userId: userId });
                }}
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
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location ? location.coords.latitude : 52.3759,
          longitude: location ? location.coords.longitude : 9.732,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {coordinates.map((coordinate, index) => (
          <Marker
            key={index}
            coordinate={coordinate}
            onPress={() => setSelectedCoordinate(coordinate)}
          >
            <Image source={Box} style={{ height: 30, width: 30 }} />
            <Callout style={{ width: 150, height: 50 }}>
              <Text style={{ fontSize: 16 }}>
                {cleanAddress(addresses[index].adr)}
              </Text>
            </Callout>
          </Marker>
        ))}

        {location && (
          <Marker
            key="userLocation"
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <Image source={UserIcon} style={{ height: 30, width: 30 }} />
          </Marker>
        )}

        {location && selectedCoordinate && !hasReachedDestination && (
          <MapViewDirections
            origin={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            destination={selectedCoordinate}
            apikey={GOOGLE_MAPS_APIKEY} // replace with your Google Maps API key
            strokeWidth={3}
            strokeColor="hotpink"
            mode="WALKING"
            onError={(errorMessage) => {
              console.log("GMAPS error:", errorMessage);
            }}
            onReady={(result) => {
              setDistance(result.distance);
              setDuration(result.duration);
            }}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  DistAndDuration: {
    position: "absolute",
    bottom: 10,
    left: 10,
    backgroundColor: "green",
    width: "50%", // Set the width
    height: "10%", // Set the height
    marginTop: 20,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
  },
});

export default HealMap;
