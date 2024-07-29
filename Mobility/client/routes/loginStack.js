import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/loginScreen";
import CreateAccount from "../screens/createAccount";
import Home from "../screens/home";
import LeaderBoard from "../screens/leaderBoard";
import Attack from "../screens/attack";
import DailyMission from "../screens/dailyMission";
import HealMap from "../screens/healMap";

const Stack = createStackNavigator();

function LoginStack() {
  const horizontalAnimation = ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ headerTitle: "Workmaster", headerTitleAlign: "center" }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccount}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="LeaderBoard"
          component={LeaderBoard}
          options={{
            headerTitle: "Leaderboard",
            cardStyleInterpolator: horizontalAnimation,
          }}
        />
        <Stack.Screen
          name="Attack"
          component={Attack}
          options={{ headerTitle: "" }}
        />
        <Stack.Screen
          name="DailyMission"
          component={DailyMission}
          options={{
            headerLeft: null,
          }}
        />
        <Stack.Screen name="HealMap" component={HealMap} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default LoginStack;
