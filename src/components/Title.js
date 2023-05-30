import React from 'react';
import {View, Text} from 'react-native';
const Title = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: '#373248',
          textAlign: 'center',
        }}>
        Flucht
      </Text>
      <Text style={{textAlign: 'center'}}>
        Be Your Best Self, Strive Your Dream
      </Text>
    </View>
  );
};

export default Title;
