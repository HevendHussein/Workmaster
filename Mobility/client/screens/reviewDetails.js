import { StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';

export default function ReviewDetails({ navigation }) {
    const pressHandler = () => {
        navigation.navigate('Home');
    }

    return (
        <View>
            <Text>ReviewDetails Screen</Text>
            <Button
                title='Back to Home Screen'
                onPress={pressHandler}
            />
        </View>
    );
}

const styles = StyleSheet.create({

});
