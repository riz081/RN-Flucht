import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, TouchableHighlight} from 'react-native';
import { SignInHeader } from '../components';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message'
import FlashMessage, {showMessage} from 'react-native-flash-message';
import { Icon } from 'react-native-elements';
import Lottie from 'lottie-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = () => {
  const [email, setEmail] = useState('rik@gmail.com');
  const [pin, setPin] = useState('123456');
  const [isLoading, loadingBar] = useState(false);
  const [eye, setEye] = useState({secure:true,icon:'eye-outline'});

  const navigation = useNavigation();

  const checkUserSignedIn = async() =>{
    try {
       loadingBar(true);
       let value = await AsyncStorage.getItem('tokenKu');
       if (value != null){ 
        loadingBar(false); 
        navigation.navigate('MainApps');
       }else {
        loadingBar(false);
        navigation.navigate('Login');
      }
    } catch (error) { 
    }
  }

  function submit(){
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/; // validasi email

    if (email == "") {
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Email is still empty',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      });      
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
    
    if(pin == ""){
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

    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/loginApps",{
      method:'POST',
      headers : {
        //Accept: "application/json",
        'Content-Type':'application/json', 
        'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
      },
      body: JSON.stringify({
        idTokenDevice:'e4IJdOlSTD-Pk3dsCZk_ho:APA91bGa1MJ8IWrlz_7bxLVhIDsHwOO9kORamQDviksOOEhJAibIlETx9FOqb656jzkDP9TUca_2b1sdOr1VwLuCk6X_7BgGNKHyS3h9-Zi30Lwtn-EpfqTBDc5vMGhXcr8Zw1-GmvjC',
        email:email,
        pin:pin,
      }), 
    })
    .then(response =>response.json()) 
    .then((json)=>{
      loadingBar(false);
      if(json.results.code == 405){       
        Toast.show({
          type : 'info',
          text1 : 'INFO',
          text2 : json.results.description[0],
          autoHide : true,
          visibilityTime : 3000,
          position : 'top',
          bottomOffset : 50,
        });       
      }else if(json.results.code == 400){      
        Toast.show({
          type : 'error',
          text1 : 'ERROR',
          text2 : json.results.description,
          autoHide : true,
          visibilityTime : 3000,
          position : 'top',
          bottomOffset : 50,
        });      
      }else if(json.results.code == 200){       
        AsyncStorage.setItem('tokenKu',json.results.token);
        navigation.navigate("MainApps");
        console.log(json)
      }
    })
  }

  const showhide = () => {
      if(eye.icon == 'eye-outline'){
        setEye({secure:false,icon:'eye-off-outline'});
      }else{
        setEye({secure:true,icon:'eye-outline'});
      }
  }

  // useEffect(() => {
  //   const screenfocus = navigation.addListener('focus', () => {
  //     checkUserSignedIn();
  //   })
  // })
  
  return (
    <View style={{flex: 1, backgroundColor: '#f7f6fd'}}>
      <Toast />
      {isLoading && (      
        <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
          <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
        </View>
      )}
      <SignInHeader title="Login" description="Login ke aplikasi flucht" />

      <TextInput
        value={email}
        keyboardType="email-address"
        onChangeText={ text => setEmail(text.replace(/ /g,""))} 
        placeholderTextColor={'grey'}
        style={{
          marginHorizontal: 20,
          backgroundColor: '#FFFFFF',
          marginTop: 20,
          borderRadius: 9,
          elevation: 2,
          paddingLeft: 10,
          color : '#000'
        }}
        placeholder="Masukkan Email Anda"
      />

      <View>
        <TextInput
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
          style={{
            marginHorizontal: 20,
            backgroundColor: '#FFFFFF',
            marginTop: 10,
            borderRadius: 9,
            elevation: 2,
            paddingLeft: 10,
            color : '#000'
          }}
        />
        <TouchableHighlight underlayColor="" onPress={()=> showhide()} style={{position:'absolute',top:20,right:20,height:40,width:35,padding:2}}>
          <Icon name={eye.icon} type='ionicon' size={28} color="grey" />
        </TouchableHighlight>
      </View>

      <TouchableOpacity
        style={{marginTop: 20, marginRight: 20}}
        onPress={() => navigation.navigate('LupaPassword')}>
        <Text style={{textAlign: 'right', fontWeight: 'bold'}}>
          Lupa Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => submit()}
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
          Sign In
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{marginTop: 20, marginRight: 20}}
        onPress={() => navigation.navigate('Register')}>
        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
          Bukan Member?{' '}
          <Text style={{color: '#FB7200'}}>Registrasi Disini</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignIn;
