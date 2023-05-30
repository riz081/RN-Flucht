import React, {useState, useEffect} from 'react';

import {View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import { SignInHeader } from '../components';

import {useNavigation} from '@react-navigation/native';

const LupaPassword = () => {
  const [email, setEmail] = useState('');

  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: '#f7f6fd'}}>
      <SignInHeader
        title="Lupa Password"
        description={
          'masukkan email anda untuk mendapatkan \n tutorial cara reset password'
        }
      />

      <TextInput
        value={email}
        keyboardType="email-address"
        onChangeText={text => setEmail(text)}
        style={{
          marginHorizontal: 20,
          backgroundColor: '#FFFFFF',
          marginTop: 10,
          borderRadius: 9,
          elevation: 2,
          paddingLeft: 10,
        }}
        placeholder="Masukkan Email Anda"
      />

      <TouchableOpacity
        style={{
          marginTop: 40,
          backgroundColor: '#03a9f4',
          paddingVertical: 15,
          marginHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 9,
          elevation: 2,
        }}>
        <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>
          Lupa Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 20, marginRight: 20}}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
          Sudah Member? <Text style={{color: '#03a9f4'}}>Login Disini</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LupaPassword;
