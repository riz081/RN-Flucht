import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import IconKu from 'react-native-vector-icons/MaterialCommunityIcons';

import { 
  LoginLanding, 
  SignIn, 
  Register, 
  LupaPassword, 
  Home,
  List,
  Cart,
  DetailList,
  Transaction,
  DetailTransaction,
  Account,
  Notification } 
from './src/screens';

import { View } from 'react-native';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import Toast from 'react-native-toast-message'

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Blank = () => {
  return <View />
}

const MainApps = () => {
  return(
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon : ({focused, color, size}) => {
          let iconName;
      
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'List') {
            iconName = 'ticket-confirmation';
          } else if (route.name === 'Transaction') {
            iconName = 'qrcode-scan';
          } else if (route.name === 'Account') {
            iconName = 'account';
          }
      
          return <IconKu name={iconName} size={size} color={color}/>
        },
        tabBarActiveTintColor: '#FB7200',
        tabBarInactiveTintColor: '#464962',
      })}
    >
      <Tab.Screen options={{headerShown : false}} name='Home' component={Home}/>
      <Tab.Screen options={{headerShown : false}} name='List' component={List}/>
      {/* <Tab.Screen options={{headerShown : false}} name='Cart' component={Cart}/> */}
      <Tab.Screen options={{headerShown : false}} name='Transaction' component={Transaction}/>
      <Tab.Screen options={{headerShown : false}} name='Account' component={Account}/>
    </Tab.Navigator>
  )
}

const App = () => {

  return (
    <View style={{flex : 1}}>
      <FlashMessage position='top' />
      <Toast/>
      <NavigationContainer>   
        <Stack.Navigator
          initialRouteName="MainApps"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="LoginLanding" component={LoginLanding} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="LupaPassword" component={LupaPassword} />
          <Stack.Screen name="MainApps" component={MainApps} />
          <Stack.Screen name="DetailList" component={DetailList} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="DetailTransaction" component={DetailTransaction} />
          <Stack.Screen name="Notification" component={Notification} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
