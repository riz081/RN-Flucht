import React, {useState, useEffect} from 'react';

import {View, Text, TouchableOpacity, TextInput, Image, TouchableHighlight} from 'react-native';
import { SignInHeader } from '../components';
import { Icon } from 'react-native-elements';
import Lottie from 'lottie-react-native'
import Toast from 'react-native-toast-message'
import FlashMessage, {showMessage} from 'react-native-flash-message';

import {useNavigation} from '@react-navigation/native';

const Register = () => {
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, loadingBar] = useState(false);
  const [eye, setEye] = useState({secure:true,icon:'eye-outline'});

  const showhide = () => {
    if(eye.icon == 'eye-outline'){
      setEye({secure:false,icon:'eye-off-outline'});
    }else{
      setEye({secure:true,icon:'eye-outline'});
    }
  }

  const regSubmit = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; // validasi email

    if( name == ""){

      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Name is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }

    if( username == ""){

      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Username is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }


    if (email == "") {
      
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Email is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }

    if(reg.test(email) === false){
      
      Toast.show({
        type : 'error',
        text1 : 'ERROR',
        text2 : 'Invalid email',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }
    
    if( pin == ""){
      
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'PIN is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }

    if( phone == ""){ 
      
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Phone is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })
      return;
    }


    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/registerRequest",{
      method:'POST',
      headers : {
        Accept: "application/json",
        'Content-Type':'application/json', 
        'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
      },
      body: JSON.stringify({
        name:name,
        phone:phone, 
        email:email,
        pin:pin,
        username:username,
      }),
    })
    .then(response =>response.json()) 
    .then((json)=>{
      loadingBar(false);
      if(json.results.code == 405){ 
        showMessage({
          message: "INFO",
          description: json.results.description[0],
          type: "info",
          duration: 3000,
        });          
      }else if(json.results.code == 400){        
        showMessage({
          message: "INFO",
          description: json.results.description,
          type: "info",
          duration: 3000,
        });          
      }else{ 
        navigation.navigate("SignIn")               
        Toast.show({
          type : 'success',
          text1 : 'SUCCESS',
          text2 : json.results.description,
          autoHide : true,
          visibilityTime : 3000,
          position : 'top',
          bottomOffset : 50,
        }) 
      }
    })
  }

  useEffect(() => {
    setEmail('')
  }, []);

  const navigation = useNavigation();
  return (
    <View style={{flex: 1, backgroundColor: '#f7f6fd'}}>
      <Toast />
      {isLoading && (      
        <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
          <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
        </View>
      )} 
      <FlashMessage position='top' />
      {isLoading && (      
        <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
          <Lottie style={{width: 100}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
        </View>
      )}
      <SignInHeader
        title="Registrasi"
        description="Silakan Masukkan Data Diri Anda"
      />

      <View style={{paddingTop : 10}}>
        <TextInput 
          style={{
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            marginTop: 10,
            borderRadius: 9,
            elevation: 2,
            paddingLeft: 10,
            color : '#000'
          }}
          value={name}
          onChangeText={ setName} 
          secureTextEntry={false}
          activeLineWidth={0}
          lineWidth={0}
          maxLength={100}
          labelFontSize={16} 
          placeholder="Name"
          placeholderTextColor={'grey'}
        />
      </View>

      <View style={{paddingTop : 10}}>
        <TextInput 
          style={{
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            marginTop: 10,
            borderRadius: 9,
            elevation: 2,
            paddingLeft: 10,
            color : '#000'
          }}
          value={username}
          onChangeText={ text => setUsername(text.replace(/ /g,""))} 
          secureTextEntry={false}
          activeLineWidth={0}
          lineWidth={0}
          maxLength={100}
          labelFontSize={16} 
          placeholder="Username"
          placeholderTextColor={'grey'}
        />
      </View>

      <View style={{paddingTop : 10}}>
        <TextInput 
            style={{
              marginHorizontal: 20,
              backgroundColor: '#FFFFFF',
              marginTop: 10,
              borderRadius: 9,
              elevation: 2,
              paddingLeft: 10,
              color : '#000'
            }}
            value={email}
            onChangeText={ text => setEmail(text.replace(/ /g,""))} 
            secureTextEntry={false}
            activeLineWidth={0}
            lineWidth={0}
            maxLength={100}
            labelFontSize={16} 
            placeholder="Email"
            placeholderTextColor={'grey'}
          />
      </View>

      <View style={{paddingTop : 10}}>
        <TextInput 
            style={{
              marginHorizontal: 20,
              backgroundColor: '#FFFFFF',
              marginTop: 10,
              borderRadius: 9,
              elevation: 2,
              paddingLeft: 10,
              color : '#000'
            }}
            value={pin}
            onChangeText={ text => setPin(text.replace(/ /g,""))} 
            secureTextEntry={eye.secure}
            activeLineWidth={0}
            lineWidth={0}
            labelFontSize={16} 
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter PIN"
            placeholderTextColor={'grey'}
          />
          <TouchableHighlight underlayColor="" onPress={()=> showhide()} style={{position:'absolute',top:30,right:20,height:40,width:35,padding:2}}>
            <Icon name={eye.icon} type='ionicon' size={28} color="grey" />
          </TouchableHighlight>
      </View>

      <View style={{paddingTop : 10}}>
        <TextInput 
          style={{
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            marginTop: 10,
            borderRadius: 9,
            elevation: 2,
            paddingLeft: 10,
            color : '#000'
          }}
          value={phone}
          onChangeText={ text => setPhone(text.replace(/ /g,""))} 
          secureTextEntry={false}
          activeLineWidth={0}
          lineWidth={0}
          maxLength={100}
          labelFontSize={16} 
          placeholder="Phone Number / Whatsapp"
          placeholderTextColor={'grey'}
          keyboardType="number-pad"
        /> 
      </View>

      <TouchableOpacity
        style={{marginTop: 20, marginRight: 20}}
        onPress={() => navigation.navigate('LupaPassword')}>
        <Text style={{textAlign: 'right', fontWeight: 'bold'}}>
          Lupa Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={()=> regSubmit()}
        style={{
          marginTop: 40,
          backgroundColor: '#FB7200',
          paddingVertical: 15,
          marginHorizontal: 20,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 9,
          elevation: 2,
        }}>
        <Text style={{color: '#FFFFFF', fontSize: 18, fontWeight: 'bold'}}>
          Registrasi
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginTop: 20, marginRight: 20}}
        onPress={() => navigation.navigate('SignIn')}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
          Sudah Member? <Text style={{color: '#FB7200'}}>Login Disini</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
