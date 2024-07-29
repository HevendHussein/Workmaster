import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import axios from 'axios';
const config = require('./config');

export default function LeaderBoard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(`${config.ipAddress}/everynameandstepsandlevel`)
      .then(response => {
        if (response) {
          const sortedUsers = response.data.sort((a, b) => b.steps - a.steps);
          setUsers(sortedUsers);
        } else {
          console.error('Response is undefined');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

return (
  <SafeAreaView>
    <View>
  <FlatList
    data={users}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, index }) => (
      <View style={[styles.userContainer, 
                    index === 0 ? {backgroundColor: 'gold'} : 
                    index === 1 ? {backgroundColor: 'silver'} : 
                    index === 2 ? {backgroundColor: '#cd7f32'} : 
                    {backgroundColor: '#d3d3d3'}]}>
                      <View><Text style={{ fontWeight: 'bold' , fontSize: 16, marginBottom: 10}}>{item.name} (LvL. {item.level})</Text></View>
                      <View style={{ alignItems: 'center' }}><Text>{item.steps} Steps</Text></View>
      </View>
    )}
  />
</View>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    padding: 20,
    marginVertical: 5,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 5,
    alignSelf: 'center',
    width: '80%',
  },
});