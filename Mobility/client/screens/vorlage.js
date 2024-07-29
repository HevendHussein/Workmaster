import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  Image,
  Animated,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import * as Location from "expo-location";
import MapViewDirections from "react-native-maps-directions";
import flagImage from "../images/flag.png";
import walkImage from "../images/walking.png";
import Constants from "expo-constants";
const GOOGLE_MAPS_APIKEY = "AIzaSyAU0Au_YVLnx6hb5P5Vl9b6wxi29X6K284";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function DailyMission() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [destination, setDestination] = useState(null);
  const [destinationAddress, setDestinationAddress] = useState(null);
  const [directionsKey, setDirectionsKey] = useState(0);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const locationSubscription = useRef(null);
  const moveAnim = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const initialLocation = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });

      let result = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setAddress(
        result[0].street +
          " " +
          result[0].name +
          ", " +
          result[0].postalCode +
          " " +
          result[0].city +
          ", " +
          result[0].region +
          ", " +
          result[0].country
      );

      // Keep generating a random point within a radius of 1 km until we get a valid address
      result = [];
      let destination = null;
      while (result.length === 0) {
        const radiusInDegrees = 1 / 111;
        const randomLatitude =
          location.coords.latitude +
          (Math.random() - 0.5) * (radiusInDegrees * 2);
        const randomLongitude =
          location.coords.longitude +
          (Math.random() - 0.5) * (radiusInDegrees * 2);
        destination = {
          latitude: randomLatitude,
          longitude: randomLongitude,
        };

        result = await Location.reverseGeocodeAsync(destination);
      }

      setDestination(destination);

      if (status === "granted") {
        locationSubscription.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 1000, // Update every second
            distanceInterval: 1, // Update every meter
          },
          (newLocation) => {
            setLocation({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            });
            // Increment the directionsKey to force a re-render of the MapViewDirections component
            setDirectionsKey((prevKey) => prevKey + 1);
          }
        );
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (destination) {
        let result = await Location.reverseGeocodeAsync({
          latitude: destination.latitude,
          longitude: destination.longitude,
        });

        setDestinationAddress(
          result[0].street +
            " " +
            result[0].name +
            ", " +
            result[0].postalCode +
            " " +
            result[0].city +
            ", " +
            result[0].region +
            ", " +
            result[0].country
        );
      }
    })();
  }, [destination]);

  useEffect(() => {
    return () => {
      // Stop watching location when the component is unmounted
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (location && destination) {
      const distanceToDestination = Math.sqrt(
        Math.pow(location.latitude - destination.latitude, 2) +
          Math.pow(location.longitude - destination.longitude, 2)
      );

      const distanceInKm = distanceToDestination * 111; // Convert degrees to kilometers

      if (distanceInKm < 0.01) {
        // 10 meters
        console.log("Ziel erreicht");
      }
    }
  }, [location, destination]);

  useEffect(() => {
    if (location) {
      if (initialLocation.current === null) {
        initialLocation.current = location;
      }

      const movementData = {
        x: (location.latitude - initialLocation.current.latitude) * 10000, // Multiply by a factor to get a noticeable movement
        y: (location.longitude - initialLocation.current.longitude) * 10000, // Multiply by a factor to get a noticeable movement
      };

      Animated.timing(moveAnim, {
        toValue: movementData,
        duration: 5000, // Duration of the animation
        useNativeDriver: false,
      }).start();
    }
  }, [location]);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={location}
        >
          <Marker
            coordinate={location}
            title="Current Location"
            description={address}
          >
            <Animated.View style={moveAnim.getLayout()}>
              <Image
                source={walkImage}
                style={{ width: 40, height: 40 }} // Set the size of the image
              />
            </Animated.View>
          </Marker>
          {destination && (
            <>
              <MapViewDirections
                key={`${directionsKey}_${location.latitude}_${location.longitude}`}
                origin={location}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={3}
                strokeColor="hotpink"
                mode="WALKING"
                onError={(errorMessage) => {
                  console.log("GMAPS error:", errorMessage);

                  if (errorMessage === "NOT_FOUND") {
                    // Generate a new random point within a radius of 1 km for the destination
                    const radiusInDegrees = 1 / 111;
                    const randomLatitude =
                      location.latitude +
                      (Math.random() - 0.5) * (radiusInDegrees * 2);
                    const randomLongitude =
                      location.longitude +
                      (Math.random() - 0.5) * (radiusInDegrees * 2);
                    setDestination({
                      latitude: randomLatitude,
                      longitude: randomLongitude,
                    });

                    // Update the key to force a re-render of the MapViewDirections component
                    setDirectionsKey(directionsKey + 1);
                  }
                }}
                onReady={(result) => {
                  setDistance(result.distance);
                  setDuration(result.duration);
                }}
              />
              <Marker
                coordinate={destination}
                title="Destination"
                description={destinationAddress}
              >
                <Image
                  source={flagImage}
                  style={{ width: 40, height: 40 }} // Set the size of the image
                />
              </Marker>
            </>
          )}
        </MapView>
      )}

      <View style={styles.addressContainer}>
        <View style={styles.startContainer}>
          <Text>{address ? `${address}` : "Loading..."}</Text>
        </View>
        <View style={styles.destinationContainer}>
          <Text>
            {destinationAddress ? `${destinationAddress}` : "Loading..."}
          </Text>
        </View>
      </View>
      <View style={styles.DistAndDuration}>
        <Text
          style={{
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          Distance: {distance.toFixed(2)} km Duration: {Math.ceil(duration)} min
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    position: "absolute",
    top: 0,
    alignItems: "center",
  },
  startContainer: {
    width: "100%", // Set the width
    height: "40%", // Set the height
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
    marginTop: 20,
  },
  destinationContainer: {
    width: "100%", // Set the width
    height: "40%", // Set the height
    marginTop: 10,
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    borderRadius: 8,
  },
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
