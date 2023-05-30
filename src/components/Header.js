import React from 'react';
import {View, Image, StatusBar, useWindowDimensions} from 'react-native';

const Header = () => {
  const {height, width} = useWindowDimensions();
  return (
    <View>
      <StatusBar backgroundColor={'#f7f6fd'} barStyle="dark-content" />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Image
          source={require('../../assets/images/flight.png')}
          style={{width: width - 10, height: width - 10, borderRadius: 25}}
        />
      </View>
    </View>
  );
};

export default Header;
