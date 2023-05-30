import React, { Component, useState, createRef, useEffect, useRef } from 'react';
import { 
  Animated,
  ScrollView,
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  TouchableHighlight,
  Image, 
  ImageBackground,
  Alert, 
  Linking,
  ActivityIndicator,
  FlatList,
  Dimensions,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'
import BackgroundCurve from '../components/BackgroundCurve';
import Carousel from 'react-native-snap-carousel';
import Pinchable from 'react-native-pinchable';
import Modal from 'react-native-modal';
import Lottie from 'lottie-react-native'

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RBSheet from "react-native-raw-bottom-sheet";

import mocks from './mocks.json';

const W = Dimensions.get('window').width;
export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={{
      backgroundColor: 'floralwhite',
      borderRadius: 5,
      height : 250,
      width : '100%',
      right : 10,
      borderRadius : 15
    }} key={index}>
      
      <ImageBackground
        source={{ uri: item.images }}
        style={{
          flex : 1, 
          justifyContent : 'flex-end', 
          paddingBottom : 10,
          paddingLeft : 20
        }}
        imageStyle={{borderRadius : 15, resizeMode : 'contain'}}
      >
        <Text style = {{fontSize : 30, color : '#fff', fontWeight : '600'}}>{item.name}</Text>
        <Text style={{color : '#fff', fontWeight : 'bold'}}>{item.date_added}</Text>
      </ImageBackground>
    </View>
  )
}


export const Home = ({navigation}) => {
    const [hasil, setHasil] = useState([]);
    const [partner, setPartner] = useState([]);
    const [isLoading, loadingBar] = useState(false);
    const [userToken, setToken] = useState("");
    const [accNum, setAccNum] = useState("");
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [nik, setNik] = useState("");
    const [imagex, setImage] = useState("");
    const [profil, setPP] = useState(false);
    const isCarousel = React.useRef(null)

    const removeToken = async() => {
      try{
        await AsyncStorage.removeItem('tokenKu');
        navigation.navigate('Home'); 
      }catch(error){
        //console.log(error);
      }
    };

    const styles = StyleSheet.create({      
      svg: {
        position: 'absolute',
        width: Dimensions.get('window').width,
      }
    });

    const getAirLines = async () => {
      loadingBar(true);
      fetch("http://192.168.1.2:5000/index.php/api/airlines",{
        method:'GET',
        headers : {
          'Content-Type':'application/json', 
          'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
        },
      })
      .then(response =>response.json()) 
      .then((json)=>{
        loadingBar(false);
          var hasilx = json.results.data;
          // console.log(hasilx)
          setHasil(hasilx);
      })
    }

    const getAccount = async () => {
      try {
        loadingBar(true); 
        let userToken = await AsyncStorage.getItem('tokenKu');
        setToken(userToken);
        if (userToken != null){  
          fetch("http://192.168.1.2:5000/index.php/api/getAccount?token="+userToken,{
            method:'GET',
            headers : {
              Accept: 'application/json',
              'Content-type': 'application/json',
              'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
            },
            // body: JSON.stringify({
            //   token:userToken
            // }),  
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
              })
            }else if(json.results.code == 400){        
              Toast.show({
                type : 'info',
                text1 : 'INFO',
                text2 : json.results.description,
                autoHide : true,
                visibilityTime : 3000,
                position : 'top',
                bottomOffset : 50,
              })       
              removeToken();
            }else{     
                setAccNum(json.results.data[0].acc);
                setName(json.results.data[0].nama);
                setUsername(json.results.data[0].username);
                setEmail(json.results.data[0].email);
                setCountry(json.results.data[0].country);
                setAddress(json.results.data[0].address);
                setPhone(json.results.data[0].phone);
                setNik(json.results.data[0].nik);
                setImage(json.results.data[0].image);
            }
          })
        }else {
          loadingBar(false);
          navigation.navigate('Account', {
            screen: 'SignIn',
          });
        }
      } catch (error) {
        console.log(error);
      }
    }

    const getPartner = async () => {
      loadingBar(true);
      fetch("http://192.168.1.2:5000/index.php/api/partner",{
        method:'GET',
        headers : {
          'Content-Type':'application/json', 
          'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
        },
      })
      .then(response =>response.json()) 
      .then((json)=>{
        loadingBar(false);
          var hasilx = json.results.data;
          // console.log(hasilx)
          setPartner(hasilx);
      })
    }


    useEffect(() => {
      const screenfocus = navigation.addListener('focus', () => {
        getAirLines();
        getAccount();
        getPartner();
      });
    }, []);

    return (
      <>
        <View style={{flex : 1, position : 'relative', backgroundColor : '#fff'}}>
          <Toast />
          {isLoading && (      
            <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
              <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
            </View>
          )} 
          <BackgroundCurve style={styles.svg} />
          <ScrollView>
            <StatusBar backgroundColor={'#ededec'} barStyle='dark-content' />
            
            <View style={{marginTop : 30, paddingHorizontal : 20, flexDirection : 'row'}}>
              <TouchableOpacity underlayColor="" onPress={() => setPP(true)} style = {{
                flex : 1, 
                justifyContent : 'flex-start', 
                alignItems : 'flex-start',
                flexDirection : 'row'
              }}>
                <Image
                  style={{width : 40, height : 40, borderWidth : 1, borderRadius : 50, borderColor : '#ededec'}}
                  source={{uri : imagex}}
                />
                <Text numberOfLines={1} style = {{
                  marginLeft : 10, 
                  marginVertical : 10, 
                  textTransform : 'uppercase', 
                  color : '#fff', 
                  fontWeight : '600'
                  }}>
                  {username}
                </Text>
              </TouchableOpacity>
              <View 
                style={{
                  marginVertical : 10, 
                  flex : 1,
                  justifyContent : 'flex-end', 
                  alignItems : 'flex-end',
                  flexDirection : 'row'}}>
                    <TouchableOpacity style={{marginHorizontal : 5}} onPress={() => navigation.navigate('Cart')}>
                      <Ionicons
                          name='cart'
                          size={25}
                          color={'#fff'}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={{marginHorizontal : 5}} onPress={() => navigation.navigate('Notification')}>
                      <Entypo
                          name='bell'
                          size={25}
                          color={'#fff'}
                      />
                    </TouchableOpacity>
              </View>
              <Modal isVisible={profil}> 
                <Pinchable>                                                                                     
                  <TouchableOpacity
                    style={{alignItems: 'center', justifyContent : 'center', flexDirection : 'column', padding : 20}}
                    onPress={() => setPP(false)}>
                    <Image
                        resizeMode='contain'
                        source={{uri : imagex}}
                        style={{width: '100%', height: '100%'}}
                    />    
                    <Text style={{color : '#fff', fontSize : 12, textTransform : 'capitalize', bottom : 20}}>tap anywhere to close (x)</Text> 
                  </TouchableOpacity>   
                </Pinchable>                       
              </Modal>
            </View>
            
            <View style={{marginHorizontal : 20, marginTop : 20, flex : 1}}>
              <Text style={{fontSize : 28, textTransform : 'capitalize', color : '#fff'}}>welcome to flucht,</Text>
              <Text style={{
                fontSize : 28, 
                textTransform : 'capitalize', 
                fontWeight : '900', 
                color : '#ffdf00'
                }}>
                  {name}
              </Text>
              <Text style={{fontWeight : 'bold', marginTop : 30, textTransform : 'capitalize', marginBottom : 5, fontSize : 20}}>
                airlines
              </Text>
              <Carousel
                layout={'default'}
                ref={isCarousel}
                data={hasil}
                sliderWidth={330}
                itemWidth={330}
                renderItem={CarouselCardItem}
                inactiveSlideShift={0}
                useScrollView={true}
              />

              <View style={{flex : 1,justifyContent : 'center', alignItems : 'center',flexDirection : 'column', marginTop : 30}}>
                  <Text style={{fontWeight : 'bold', textTransform : 'capitalize', marginBottom : 10, fontSize : 16}}>
                    our partners
                  </Text>
                  <View style={{flex : 1,flexDirection : 'row'}}>
                     
                      <FlatList
                        style = {{flex : 1}}
                        data={partner}
                        horizontal = {true}
                        renderItem={({item, index}) => (
                          <View style = {{flexDirection : 'column',justifyContent : 'center',alignItems : 'center',}}>
                            <TouchableOpacity
                              style={{
                                backgroundColor : '#fff',
                                marginHorizontal : 10,
                                marginBottom : 5,
                                width : 70,
                                height : 70,
                                justifyContent : 'center',
                                alignItems : 'center',
                                borderRadius : 6,
                                elevation : 3,
                                borderRadius : 50, 
                            }}>
                              <Image
                                style={{
                                  width : 70, 
                                  height : 70, 
                                  borderWidth : 1, 
                                  borderRadius : 50, 
                                  borderColor : '#ededec', 
                                  marginHorizontal : 10, 
                                  resizeMode : 'contain'}}
                                source={{uri : item.images}}
                              />
                            </TouchableOpacity>
                            <Text style={{fontSize : 12, fontWeight : '400', textTransform : 'capitalize'}}>
                              {item.name}
                            </Text>
                          </View>
                        )}
                      />
                  </View>
              </View>

            </View>

          </ScrollView>
        </View>
      </>
    )
}

export const Account = ({navigation}) => {
  const [hasil, setHasil] = useState([]);
  const [isLoading, loadingBar] = useState(false);
  const [userToken, setToken] = useState("");
  const [accNum, setAccNum] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nik, setNik] = useState("");
  const [imagex, setImage] = useState("");
  const [profil, setPP] = useState(false);
  const [pin, setPin] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const actionUbahPin = useRef();

  const getAccount = async () => {
    try {
      loadingBar(true); 
      let userToken = await AsyncStorage.getItem('tokenKu');
      setToken(userToken);
      if (userToken != null){  
        fetch("http://192.168.1.2:5000/index.php/api/getAccount?token="+userToken,{
          method:'GET',
          headers : {
            Accept: 'application/json',
            'Content-type': 'application/json',
            'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
          },
          // body: JSON.stringify({
          //   token:userToken
          // }),  
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
            })
          }else if(json.results.code == 400){        
            Toast.show({
              type : 'info',
              text1 : 'INFO',
              text2 : json.results.description,
              autoHide : true,
              visibilityTime : 3000,
              position : 'top',
              bottomOffset : 50,
            })       
            removeToken();
          }else{     
              setAccNum(json.results.data[0].acc);
              setName(json.results.data[0].nama);
              setUsername(json.results.data[0].username);
              setEmail(json.results.data[0].email);
              setCountry(json.results.data[0].country);
              setAddress(json.results.data[0].address);
              setPhone(json.results.data[0].phone);
              setNik(json.results.data[0].nik);
              setImage(json.results.data[0].image);
          }
        })
      }else {
        loadingBar(false);
        navigation.navigate('Account', {
          screen: 'SignIn',
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  const ubahPin = () => {
    setPin("");
    setPinConfirm("");
    actionUbahPin.current.open();
  }

  const cancelPin = () => {
    actionUbahPin.current.close();
  }

  const changePin = () => {
    actionUbahPin.current?.close();
    if(pin != pinConfirm){
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : "PIN is not the same as PIN confirmation",
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      })        
    }else{      
      loadingBar(true);
      console.log("pin : "+pin+"pin Confirm : "+pinConfirm)
      fetch("http://192.168.1.2:5000/index.php/api/changePin?token="+userToken+"&pin="+pin,{
        method:'GET',
        headers : {
          Accept: "application/json",
          'Content-Type':'application/json', 
          'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
        },
        // body: JSON.stringify({
        //   token:userToken,
        //   pin:pin
        // }),  
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
          AsyncStorage.removeItem('tokenKu');
          navigation.navigate('SignIn');     
          Toast.show({
            type : 'info',
            text1 : 'INFO',
            text2 : json.results.description,
            autoHide : true,
            visibilityTime : 3000,
            position : 'top',
            bottomOffset : 50,
          })            
        }else{     
            navigation.navigate('SignIn');    
            Alert.alert("INFO", json.results.data);
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
  }

  const removeToken = async() => {
    try{
      await AsyncStorage.removeItem('tokenKu');
      navigation.navigate('Home'); 
    }catch(error){
      //console.log(error);
    }
  };

  const signOut = async () => { // hapus device, token pada akun ini agar tidak nyantol ke akun lain
    try {
      loadingBar(true);
      let userToken = await AsyncStorage.getItem('tokenKu');
      console.log(userToken)
      // return;
      if (userToken != null){  
        fetch("http://192.168.1.2:5000/index.php/api/logoutApps",{
          method:'POST',
          headers : {
            Accept: "application/json",
            'Content-Type':'application/json', 
            'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
          },
          body: JSON.stringify({
            token:userToken
          }),  
        })
        .then(response =>response.json()) 
        .then((json)=>{
          console.log(json)
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
            })             
          }else if(json.results.code == 400){        
            Toast.show({
              type : 'info',
              text1 : 'INFO',
              text2 : json.results.description,
              autoHide : true,
              visibilityTime : 3000,
              position : 'top',
              bottomOffset : 50,
            })
          }else{     
            removeToken();
            Alert.alert('INFO', 'Are you sure want to logout ?', [
              {
                text: 'No',
                onPress: () => console.log('Cancel logout'),
                style: 'cancel',
              },
              {
                text: 'Yes', 
                onPress: () => navigation.navigate('SignIn'),
              },
            ]);              
          }
        })
      }else {
        loadingBar(false);
        navigation.navigate('SignIn');
        Toast.show({
          type : 'info',
          text1 : 'INFO',
          text2 : 'Token is empty',
          autoHide : true,
          visibilityTime : 3000,
          position : 'top',
          bottomOffset : 50,
        })
      }
    } catch (error) {
      console.log(error);
    }
  }   

  useEffect(() => {
    const screenfocus = navigation.addListener('focus', () => {
      getAccount();
    });
  }, []);

  return (
    
    <View style={{
      flex : 1, 
      justifyContent : 'center', 
      alignItems : 'center', 
      padding : 10,
      borderRadius : 10,
      backgroundColor : '#fff'
    }}>
      <Toast />
      {isLoading && (      
        <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
          <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
        </View>
      )}
      <View style={{width : '90%', height : '30%', borderWidth : 1, borderColor : '#fb7200', top : 20, position : 'absolute', borderRadius : 10}}>
        <Image
          style={{width : '100%', height : '100%', borderRadius : 10}}
          source={{uri : imagex}}
        />
      </View>
      <TouchableOpacity onPress={() => setPP(true)} style={{width : '30%', height : '15%', borderWidth : 1, borderRadius : 50, borderColor : '#FB7200'}}>
        <Image
          style={{width : '100%', height : '100%', borderWidth : 2, borderRadius : 50, borderColor : '#FB7200', top : 0}}
          source={{uri : imagex}}
        />
      </TouchableOpacity>
      <Modal isVisible={profil}> 
        <Pinchable>                                                                                     
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent : 'center', flexDirection : 'column', padding : 20}}
            onPress={() => setPP(false)}>
            <Image
                resizeMode='contain'
                source={{uri : imagex}}
                style={{width: '100%', height: '100%'}}
            />    
            <Text style={{color : '#fff', fontSize : 12, textTransform : 'capitalize', bottom : 20}}>tap anywhere to close (x)</Text> 
          </TouchableOpacity>   
        </Pinchable>                       
      </Modal>
      <Text style = {{fontSize : 20, fontWeight : 'bold', top : 5, textTransform : 'capitalize'}}>{name}</Text>

      <View style={{top : 120, left : 5, marginVertical : 5}}>
        <View style={{flexDirection : 'row', top : -90, left : 25, marginVertical : 5}}>
          <Entypo
              style={{marginHorizontal : 5}}
              name='user'
              size={20}
              color={'#000'}
          />
          <View style={{width : '27%'}}>
            <Text style={{color : 'black', fontSize : 16, textTransform : 'capitalize'}}>username</Text>
          </View>
          <View style={{width : '3%'}}>
            <Text style={{color : 'black', fontSize : 16}}>:</Text>
          </View>
          <View style={{flexDirection : 'column', width : '70%'}}>
            <Text style={{color : 'black', fontSize : 16}}>{username}</Text>
          </View>
        </View>

        <View style={{flexDirection : 'row', top : -90, left : 25, marginVertical : 5}}>
          <MaterialCommunityIcons
              style={{marginHorizontal : 5}}
              name='email-edit-outline'
              size={20}
              color={'#000'}
          />
          <View style={{width : '27%'}}>
            <Text style={{color : 'black', fontSize : 16, textTransform : 'capitalize'}}>email</Text>
          </View>
          <View style={{width : '3%'}}>
            <Text style={{color : 'black', fontSize : 16}}>:</Text>
          </View>
          <View style={{flexDirection : 'column', width : '70%'}}>
            <Text style={{color : 'black', fontSize : 16}}>{email}</Text>
          </View>
        </View>

        <View style={{flexDirection : 'row', top : -90, left : 25, marginVertical : 5}}>
          <Ionicons
              style={{marginHorizontal : 5}}
              name='phone-portrait'
              size={20}
              color={'#000'}
          />
          <View style={{width : '27%'}}>
            <Text style={{color : 'black', fontSize : 16, textTransform : 'capitalize'}}>phone</Text>
          </View>
          <View style={{width : '3%'}}>
            <Text style={{color : 'black', fontSize : 16}}>:</Text>
          </View>
          <View style={{flexDirection : 'column', width : '70%'}}>
            <Text style={{color : 'black', fontSize : 16}}>{phone}</Text>
          </View>
        </View>

        <View style={{flexDirection : 'row', top : -90, left : 25, marginVertical : 5}}>
          <Entypo
              style={{marginHorizontal : 5}}
              name='home'
              size={20}
              color={'#000'}
          />
          <View style={{width : '27%'}}>
            <Text style={{color : 'black', fontSize : 16, textTransform : 'capitalize'}}>address</Text>
          </View>
          <View style={{width : '3%'}}>
            <Text style={{color : 'black', fontSize : 16}}>:</Text>
          </View>
          <View style={{flexDirection : 'column', width : '70%'}}>
            <Text style={{color : 'black', fontSize : 16}}>{address}, {country}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={{
        marginHorizontal : 10, 
        borderWidth : 1, 
        borderColor : '#000', 
        width : '60%', 
        height : '5%', 
        left : -45,
        borderRadius : 10,
        alignItems : 'center',
        justifyContent : 'center',
        top : 50,
        flexDirection : 'row',
        backgroundColor : '#efefef'
        }}>
          <MaterialCommunityIcons
              style={{marginHorizontal : 5}}
              name='account-edit-outline'
              size={20}
              color={'#000'}
          />
        <Text>edit profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => ubahPin()} style={{
        marginHorizontal : 10, 
        borderWidth : 1, 
        borderColor : '#000', 
        width : '25%', 
        height : '5%', 
        top : 17, 
        left : 110,
        borderRadius : 10,
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#efefef'
      }}>
        <Text>change pin</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signOut()} style={{
        marginHorizontal : 10, 
        borderWidth : 1, 
        borderColor : '#fb7200', 
        width : '90%', 
        height : '5%', 
        left : 5,
        top : 30,
        borderRadius : 10,
        alignItems : 'center',
        justifyContent : 'center',
        flexDirection : 'row',
        backgroundColor : '#fb7200'
        }}>
          <FontAwesome5
              style={{marginHorizontal : 5}}
              name='power-off'
              size={20}
              color={'#fff'}
          />
        <Text style={{fontWeight : 'bold', color : '#fff'}}>Sign Out</Text>
      </TouchableOpacity>

      <RBSheet ref={actionUbahPin}> 
        <View style={{borderTopLeftRadius:40,borderTopRightRadius:40,paddingTop:20,paddingLeft:20,paddingRight:20}}>
          <TextInput 
            style={{borderColor:'#B2BABB',borderWidth:1,padding:10,borderRadius:10,color:'black',marginBottom:10}}
            value={pin}
            onChangeText={text => setPin(text)}  
            secureTextEntry={true}
            activeLineWidth={0}
            lineWidth={0}
            labelFontSize={16} 
            returnKeyType="next"
            maxLength={6}
            keyboardType="number-pad"
            id="filled-basic"
            placeholder="New PIN"  
            placeholderTextColor={"grey"}
            variant="filled" /> 
          <TextInput 
            style={{borderColor:'#B2BABB',borderWidth:1,padding:10,borderRadius:10,color:'black'}}
            value={pinConfirm}
            onChangeText={text => setPinConfirm(text)} 
            secureTextEntry={true}
            activeLineWidth={0}
            lineWidth={0}
            labelFontSize={16} 
            returnKeyType="next"
            maxLength={6}
            keyboardType="number-pad"
            id="filled-basic"
            placeholder="Confirm New PIN"  
            placeholderTextColor={"grey"}
            variant="filled" /> 
          <View style={{justifyContent:'center',alignItems:'center',width:'100%',marginTop:15}}>
            <TouchableHighlight onPress={()=> changePin()} underlayColor="" style={{paddingTop:10,paddingBottom:10,paddingLeft:25,paddingRight:25,backgroundColor:'#fb7200',fontWeight:'bold',borderRadius:20}}>
              <Text style={{color:'white'}}>Change PIN</Text>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => cancelPin()} style={{marginTop:20}} underlayColor="">
              <Text>Cancel</Text>
            </TouchableHighlight>
          </View>
        </View>
    </RBSheet>
          
    </View>
  )
}

export const Notification = ({navigation, route}) => {
  return (
    <View>
      <Text>Notification</Text>
    </View>
  )
}