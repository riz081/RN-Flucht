import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  StatusBar,
  ScrollView,
} from 'react-native';

import { Header, Title } from '../components';


import LoginRegisterButton from '../components/LoginRegisterButton';
const LoginLanding = () => {
  return (
    <ScrollView>
      <View style={{flex: 1, backgroundColor: '#f7f6fd'}}>
        <Header />
        <Title />
        <LoginRegisterButton />
      </View>
    </ScrollView>
  );
};

export default LoginLanding;
