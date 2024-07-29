import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { getDistance } from "geolib"; // Import getDistance function
import Box from "../images/HealPotion.png";
import UserIcon from "../images/walking.png";
import MapViewDirections from "react-native-maps-directions";
import { useNavigation } from "@react-navigation/native";
const config = require("./config");
const GOOGLE_MAPS_APIKEY = "AIzaSyAU0Au_YVLnx6hb5P5Vl9b6wxi29X6K284";

/*
TODO: Kann sein, dass die Adressen nicht richtig geändert werden
TODO: Muss sowieso in Datenbank geupdatet werden, hierfür muss die ID der Adresse bekannt sein
TODO: ID des Users in Coponent healMap übergeben
*/

const HealMap = ({ route, navigate }) => {
  const [addresses, setAddresses] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedCoordinate, setSelectedCoordinate] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const { userId } = route.params;
  const [poisenedUser, setPoisenedUser] = useState(null);
  const [hasReachedDestination, setHasReachedDestination] = useState(false);
  const navigation = useNavigation();

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

    console.log("addresses[index].id", addresses[index].id);

    axios
      .post(`${config.ipAddress}/updateAddress`, {
        adr: newAddress,
        id: addresses[index].id,
      })
      .then((response) => {
        if (response.data.success) {
          console.log("Successfully updated address in the database");
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
          if (poisenedUser === 1) {
            console.log("User is poisened, can't heal");
          }
          console.log(
            `User is within 50 meters of address with ID: ${addresses[index].id}`
          );
          (async () => {
            await updateAddress(index);
          })();

          // Navigate back to Home
          //   navigation.navigate("Home");
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
      .get(`${config.ipAddress}/getPoisened`, { params: { userId: userId } })
      .then((response) => {
        if (response.data.success) {
          // Set poisenedUser to the poisened value, not the entire user object
          setPoisenedUser(response.data.user.poisened);
        } else {
          console.log("Failed to fetch poisened user");
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch poisened user:", error);
      });
  };

  useEffect(() => {
    fetchPoisenedUser(userId);
  }, []);

  return (
    <View style={{ flex: 1 }}>
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
                {addresses[index].adr.split(",")[0]}
                {addresses[index].adr.split(",")[1]
                  ? addresses[index].adr.split(",")[1]
                  : ""}
              </Text>
            </Callout>
          </Marker>
        ))}
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
      </MapView>
      {distance && duration && (
        <View style={styles.DistAndDuration}>
          <Text
            style={{
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            Distance: {distance.toFixed(2)} km Duration: {Math.ceil(duration)}{" "}
            min
          </Text>
        </View>
      )}
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
