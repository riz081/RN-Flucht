import { View, Text, ScrollView, StyleSheet, Dimensions, TouchableOpacity, RefreshControl, Alert, Image, FlatList, SafeAreaView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import Lottie from 'lottie-react-native'
import Toast from 'react-native-toast-message'
import BackgroundCurve from '../components/BackgroundCurve';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconKu from 'react-native-vector-icons/dist/FontAwesome5';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import RBSheet from 'react-native-raw-bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Cart = ({navigation}) => {

  const [isLoading, loadingBar] = useState(false);
  const [hasil, setHasil] = useState([]);
  const [bank, setBank] = useState([]);
  const [cart, setCart] = useState([]);
  const actionCart = useRef();
  const paymentAct = useRef();

  const openCart = (id) => {
    actionCart.current.open();
    // alert(id)
    loadingBar(true)
    fetch("http://192.168.1.2:5000/index.php/api/openCart?id="+id,{
      method:'GET',
      headers : {
        Accept: "application/json",
        'Content-Type':'application/json', 
        'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
      },
    })
    .then(response =>response.json()) 
    .then((json)=>{                     
      loadingBar(false);    
      var hasilc = json.results.data;
        console.log('cart : '+json.results.data)
      setCart(hasilc);   
    })
  }

  const readCart = async () => {
    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/readCart",{
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
        // console.log('cart : '+json.results.data)
        setHasil(hasilx);
    })
  }

  const deleteCart = (id) => {
    // alert(id)
    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/delete_cart?id="+id,{
      method:'DELETE',
      headers : {
        Accept: "application/json",
        'Content-Type':'application/json', 
        'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
      },
    })
    .then(response =>response.json()) 
    .then((json)=>{                     
      loadingBar(false); 
      readCart();
      Toast.show({
        type : 'info',
        text1 : 'INFO',
        text2 : 'Deleted !',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      }) 
      
    })
  }

  const paymentMethod = () => {
    actionCart.current.close();
    paymentAct.current.open();
    // alert(id)
    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/bank",{
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
        // console.log('cart : '+json.results.data)
        setBank(hasilx);
    })
  }

  const transaksi = (idBank,idData, compCode, dept, arival, time, price, tpn, name) => {
    loadingBar(true);
    // alert(idData)
    fetch("http://192.168.1.2:5000/index.php/api/transaction?id_bank="+idBank+"&id_data="+idData+"&se_company_code="+compCode+"&departure="+dept+"&arival="+arival+"&time="+time+"&price="+price+"&type_notif="+tpn+"&name="+name,{
      method:'POST',
      headers : {
        Accept: "application/json",
        'Content-Type':'application/json', 
        'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
      },
    })
    .then(response =>response.json()) 
    .then((json)=>{
      loadingBar(false);  
      navigation.navigate('Transaction')        
      console.log(json)
      Toast.show({
        type : 'success',
        text1 : 'SUCCESS',
        text2 : 'Data has been added !',
        autoHide : true,
        visibilityTime : 3000,
        position : 'top',
        bottomOffset : 50,
      }) 
      
    })
  }

  useEffect(() => {
    const screenfocus = navigation.addListener('focus', () => {
      readCart();
    });
  }, []);

  const styles = StyleSheet.create({   
      svg: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        top: -170,
      },
  });

  const ItemView = () => {
    return (
      <View>
        {
          hasil.length == 0 ?
          <View style={{justifyContent : 'center', alignItems :'center', flex : 1}}>
            <Text>No Data Found</Text>
          </View>
          :
          hasil.map((val, index) => (
              <TouchableOpacity onPress={() => openCart(val.id)}>
                  <View style={{
                      borderWidth: 1.5,
                      borderColor: '#EFEFF0',
                      margin: 15,
                      padding: 10,
                      borderRadius: 12,
                  }}>  
                      <Text style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: '#0D1820',
                          marginBottom: 10,
                      }}>
                          {val.se_company_code} - {val.id_data}
                      </Text>
                      <View style={{
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                      }}>
                          
                          <Text style={{
                              color: '#24333A',
                              fontSize: 14,
                              fontWeight: 'bold',
                          }}>
                          <Ionicons name="ios-airplane" style={{marginRight : 15}} />
                          {'  '}
                          {val.departure} - {val.arival}
                          </Text>
                      </View>

                      <View style={{
                        position: 'absolute',
                        right: 30,
                        top: 25
                      }}>
                        <TouchableOpacity onPress={() => deleteCart(val.id)}>
                          <IconKu
                            name='trash'
                            size={24}
                            color={'#DC143C'}
                          />
                        </TouchableOpacity>
                      </View>
                      
                  </View>
              </TouchableOpacity>
          ))
        }
      </View>
    );
  };

  return (
    <View style={{flex : 1}}>
      <Toast/>
      <View style={{
          flex: 1,
          position: 'relative',
          backgroundColor: 'white',
      }}>
          <BackgroundCurve style={styles.svg}/>
          {isLoading == false ? (                    
            <ScrollView
              refreshControl ={
                <RefreshControl refreshing={isLoading} onRefresh={readCart} />
              } 
              style={{marginTop : 20, flex : 1}}>
                <View style={{
                    marginTop: 30,
                    padding: 10,
                    backgroundColor: '#fff',
                }}>
                    <View style={{paddingHorizontal : 15}}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#5F646A',
                            textTransform : 'capitalize'
                        }}>cart results</Text>
                    </View>
                    <ItemView />
                </View>
            </ScrollView>
            ) : (
            <View style={{margin : 15}}>
              <SkeletonPlaceholder>
                  <View style ={{marginTop : 80}}>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                  </View>
              </SkeletonPlaceholder>
            </View> 
          )}
      </View>
      <RBSheet
        ref={actionCart}
        height={240}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius : 40,
            borderTopRightRadius : 50
          }
        }}
      >
        <View style={{
          flex : 1, 
          padding : 20
        }}>
          {
            cart.map((item, index) => (
              <View>
                <View style={{flexDirection : 'row', marginTop : 5}}>
                    <View style={{width : '30%'}}>
                        <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>Nomor</Text>
                    </View>
                    <View style={{width : '3%'}}>
                        <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                    </View>
                    <View style={{flexDirection : 'column', width : '100%'}}>
                        <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                            {item.se_company_code} - {item.id_data}
                        </Text>
                    </View>
                </View>

                <View style={{flexDirection : 'row', marginTop : 5}}>
                  <View style={{width : '30%'}}>
                      <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>departure</Text>
                  </View>
                  <View style={{width : '3%'}}>
                      <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                  </View>
                  <View style={{flexDirection : 'column', width : '100%'}}>
                      <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                          {item.departure}
                      </Text>
                  </View>
                </View>

                <View style={{flexDirection : 'row', marginTop : 5}}>
                  <View style={{width : '30%'}}>
                      <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>arival</Text>
                  </View>
                  <View style={{width : '3%'}}>
                      <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                  </View>
                  <View style={{flexDirection : 'column', width : '100%'}}>
                      <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                          {item.arival}
                      </Text>
                  </View>
                </View>

                <View style={{flexDirection : 'row', marginTop : 5}}>
                  <View style={{width : '30%'}}>
                      <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>route</Text>
                  </View>
                  <View style={{width : '3%'}}>
                      <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                  </View>
                  <View style={{flexDirection : 'column', width : '100%'}}>
                      <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                          {item.departure} - {item.arival}
                      </Text>
                  </View>
                </View>

                <View style = {{flexDirection : 'row'}}>
                  <View style={{
                    flexDirection : 'column', 
                    bottom : 0, 
                    top : 15,
                    left : -20,
                    padding : 10,
                    margin : 10,
                    width : '55%',
                    justifyContent : 'center',
                    }}>
                    <View style={{width : '30%'}}>
                        <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>price :</Text>
                    </View>
                    <View style={{flexDirection : 'column', width : '100%'}}>
                        <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                          Rp. {item.price}
                        </Text>
                    </View>
                  </View>

                  <View style={{
                    flexDirection : 'row', 
                    bottom : 0, 
                    borderWidth : 1,
                    borderColor : '#efefef',
                    borderRadius : 10,
                    top : 25,
                    margin : 10,
                    justifyContent : 'center',
                    alignItems : 'center',
                    flex : 1,
                    backgroundColor : '#FB7200',
                    height : '50%'
                    }}>
                    <TouchableOpacity onPress={() => paymentMethod(item.id)}>
                        <Text style={{color : '#fff', fontSize : 16, textTransform : 'uppercase', fontWeight : 'bold'}}>payment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          }          
        </View>        
      </RBSheet>

      <RBSheet
        ref={paymentAct}
        height={240}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius : 40,
            borderTopRightRadius : 50
          }
        }}
      >
        <View style={{
          flex : 1, 
          padding : 20,
          flexDirection :'row',
          justifyContent : 'center', 
          alignItems : 'center',
        }}>
          {
            cart.map((val, index) => (
              <View style={{flexDirection :'column', flex : 1}}>
                <Text style={{fontSize : 18, fontWeight : 'bold', textTransform : 'capitalize', marginBottom : 15}}>
                  payment method
                </Text>
                <FlatList
                    style = {{flex : 1}}
                    data={bank}
                    horizontal = {true}
                    renderItem={({item, index}) => (
                      <View style = {{flexDirection : 'column',justifyContent : 'center',alignItems : 'center', padding : 10}}>
                        <TouchableOpacity
                          onPress={() => transaksi(
                            item.id, 
                            val.id_data,
                            val.se_company_code,
                            val.departure,
                            val.arival,
                            val.time,
                            val.price,
                            item.type_notif,
                            item.name
                          )}
                          style={{
                            backgroundColor : '#fff',
                            marginHorizontal : 10,
                            marginBottom : 5,
                            width : 85,
                            height : 85,
                            justifyContent : 'center',
                            alignItems : 'center',
                            borderRadius : 6,
                            elevation : 3,
                            borderRadius : 5
                        }}>
                          <Image
                            style={{
                              width : 85, 
                              height : 85, 
                              borderWidth : 1, 
                              borderRadius : 5, 
                              borderColor : '#ededec', 
                              marginHorizontal : 10, 
                              resizeMode : 'contain'}}
                            source={{uri : item.logo}}
                          />
                        </TouchableOpacity>
                        {/* <Text>id cart : {val.id}</Text>
                        <Text>id bank : {item.id}</Text> */}
                        <Text style={{fontSize : 16, fontWeight : '600', textTransform : 'capitalize'}}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                  />
              </View>
            ))
          }   
        </View>        
      </RBSheet>
    </View>
  )
}

export const Transaction = ({navigation}) => {

  const [hasil, setHasil] = useState([]);
  const [isLoading, loadingBar] = useState(false);

  const getTransaction = async () => {
    loadingBar(true);
    fetch("http://192.168.1.2:5000/index.php/api/getTransaction",{
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
        // console.log('cart : '+json.results.data)
        setHasil(hasilx);
    })
  }

  useEffect(() => {
    const screenfocus = navigation.addListener('focus', () => {
      getTransaction();
    });
  }, []);

  const styles = StyleSheet.create({   
      svg: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        top: -170,
      },
  });

  return(
    <View style={{flex : 1}}>
      <Toast />
      <View style={{
          flex: 1,
          position: 'relative',
          backgroundColor: 'white',
      }}>
          <BackgroundCurve style={styles.svg}/>
          {isLoading == false ? (                    
            <ScrollView
              refreshControl ={
                <RefreshControl refreshing={isLoading} onRefresh={getTransaction} />
              } 
              style={{marginTop : 20, flex : 1}}>
                <View style={{
                    marginTop: 30,
                    padding: 10,
                    backgroundColor: '#fff',
                }}>
                    <View style={{paddingHorizontal : 15}}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: '#5F646A',
                            textTransform : 'capitalize'
                        }}>Transaction List results</Text>
                    </View>
                    
                    <View>
                      {
                        hasil.length == 0 ?
                        <View style={{justifyContent : 'center', alignItems :'center', flex : 1}}>
                          <Text>No Data Found</Text>
                        </View>
                        :
                        hasil.map((val, index) => (
                            <TouchableOpacity onPress={() => navigation.navigate('DetailTransaction', {data : val})}>
                                <View style={{
                                    borderWidth: 1.5,
                                    borderColor: '#EFEFF0',
                                    margin: 15,
                                    padding: 10,
                                    borderRadius: 12,
                                }}>  
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: '#0D1820',
                                        marginBottom: 10,
                                    }}>
                                        {val.se_company_code} - {val.id_data}
                                    </Text>
                                    <View style={{
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        
                                        <Text style={{
                                            color: '#24333A',
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                        }}>
                                        <Ionicons name="ios-airplane" style={{marginRight : 15}} />
                                        {'  '}
                                        {val.name} - Rp. {val.price}
                                        </Text>
                                    </View>  
                                </View>
                            </TouchableOpacity>
                        ))
                      }
                    </View>
                </View>
            </ScrollView>
            ) : (
            <View style={{margin : 15}}>
              <SkeletonPlaceholder>
                  <View style ={{marginTop : 80}}>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                      <Text style={{width: '100%', height: 100, borderRadius: 4, margin : 5}}></Text>
                  </View>
              </SkeletonPlaceholder>
            </View> 
          )}
      </View>
    </View>
  )
}

export const DetailTransaction = ({navigation, route}) => {

  const [userToken, setToken] = useState("");
  const [isLoading, loadingBar] = useState(false);
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const d = route.params.data;


  const finishTransaction = async (id) => {
    try {
      // loadingBar(true); 
      let userToken = await AsyncStorage.getItem('tokenKu');
      setToken(userToken);
      // alert(id+" - "+userToken)
      // return
      if (userToken != null){  
        fetch("http://192.168.1.2:5000/index.php/api/finishTransaction?token="+userToken+"&id="+id,{
        method:'GET',
        headers : {
          Accept: "application/json",
          'Content-Type':'application/json', 
          'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
        },
      })
      .then(response =>response.json()) 
      .then((json)=>{
        loadingBar(false);  
        navigation.navigate('Transaction')        
        console.log(json)
        Toast.show({
          type : 'success',
          text1 : 'SUCCESS',
          text2 : 'Data has been added !',
          autoHide : true,
          visibilityTime : 3000,
          position : 'top',
          bottomOffset : 50,
        }) 
        
      })
      }
    } catch (error) {
      console.log(error);
    }
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
              setName(json.results.data[0].nama);
              setCountry(json.results.data[0].country);
              setPhone(json.results.data[0].phone);
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

  useEffect(() => {
    const screenfocus = navigation.addListener('focus', () => {
      getAccount();
    });
  }, []);

  const styles = StyleSheet.create({   
      svg: {
        position: 'absolute',
        width: Dimensions.get('window').width,
        top: -170,
      },
      dot: {
        width: 16,
        height: 16,
        borderWidth: 2,
        borderColor: '#f14d68',
        borderRadius: 10,
      },
      dashed_row: {
        height: 1,
        width: 10,
        marginRight: 10,
        backgroundColor: 'gray',
      }, 
  });

  const Line = () => {
    return (
      <View style={{position: 'relative'}}>
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            left: -8,
            flexDirection: 'row',
          }}>
          <View
            style={[
              styles.dot,
              {
                borderWidth: 0,
                backgroundColor: '#ededed',
                shadowColor: '#000',
                shadowRadius: 3,
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 0.0,
              },
            ]}
          />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />
          <View style={styles.dashed_row} />      
          <View style={styles.dashed_row} />      
          <View
            style={[
              styles.dot,
              {
                borderWidth: 0,
                backgroundColor: '#ededed',
                right : 14,
                shadowColor: '#000',
                shadowRadius: 3,
                shadowOffset: {
                  width: 2,
                  height: 1,
                },
                shadowOpacity: 0.0,
              },
            ]}
          />
        </View>
      </View>
    );
  };


  return(
    <View style={{flex : 1}}>
      <Toast />
      {isLoading && (      
        <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
            <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
        </View>
      )} 
      <ScrollView>
        <SafeAreaView style={{
          backgroundColor: '#ededed',
          flex: 1,
          padding: 8,
        }}>
          <View style={{
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowRadius: 3,
            borderTopRightRadius: 10,
            borderTopLeftRadius : 10,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            zIndex: 9999,
            shadowOpacity: 0.2,
            marginTop: 17,
            marginHorizontal : 10
          }}>
            <View style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
              <View style={{flex: 1, marginRight : 20, }}>
                <Text style={{
                  fontSize: 18,
                  color: '#000', 
                  textTransform : 'uppercase',
                  marginBottom : 7
                  }}>
                    invoice
                </Text>
             
                <View style={{flexDirection : 'row', marginTop : 5}}>
                  <Text style={{fontSize: 14,color: '#000', textTransform : 'uppercase', fontWeight : 'bold'}}>nomor :{' '}</Text>
                  <Text style={{fontSize: 14,color: 'gray', textTransform : 'uppercase'}}>{d.se_company_code} - {d.id_data}</Text>
                </View>
              </View>              
              <Image
                style={{width: 48, height: 48,}}
                source={require('../../assets/images/flight.png')}
              />
            </View>

            <Line />

            <View style={{
              padding: 10,
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent : 'flex-start',
              marginTop: 10,
            }}>
              <Text style={{color : 'black', fontSize : 16, textTransform :'capitalize'}}>transaksi pembayaran tiket : </Text>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>departure</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{d.departure}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>arival</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{d.arival}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>route</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{d.departure} - {d.arival}</Text>
                </View>
              </View>
              
              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>price</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{d.price}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>time</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{d.time}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>name</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{name}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>phone</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{phone}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'row', marginTop : 10}}>
                <View style={{width : '27%'}}>
                  <Text style={{color : 'black', fontSize : 14, textTransform : 'capitalize'}}>country</Text>
                </View>
                <View style={{width : '3%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>:</Text>
                </View>
                <View style={{flexDirection : 'column', width : '70%'}}>
                  <Text style={{color : 'black', fontSize : 14}}>{country}</Text>
                </View>
              </View>

              <View style={{flexDirection : 'column', marginTop : 10}}>
                <Text style={{color : 'black', fontSize : 14}}>*Note : </Text>                  
                <Text style={{color : 'black', fontSize : 14, textDecorationLine : 'underline', fontStyle : 'italic'}}>Invoice akan terhapus jika menekan tombol finish</Text>                  
              </View>
              
            </View>

            <Line />

            <View style={{
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
              <View style={{flex: 1, marginRight : 20, }}>
                <Text style={{
                  fontSize: 15,
                  color: '#000', 
                  textTransform : 'uppercase',
                  marginBottom : 7
                  }}>
                    payment method
                </Text>

                <Text numberOfLines={1} style={{
                  fontSize: 15,
                  fontWeight: 'bold',
                  color : 'black',
                  textTransform : 'uppercase'
                }}>
                  {d.name}
                </Text>         
              </View>   
              
              <View style={{
                    borderWidth : 1, 
                    borderColor : '#fff',
                    borderRadius : 10,
                    width : '30%',
                    height : 40,
                    backgroundColor : '#FB7200',
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                  <TouchableOpacity style={{flexDirection : 'row'}} onPress={() => finishTransaction(d.id)}>
                    <IconKu
                        name='cart-plus'
                        size={15}
                        color={'#fff'}
                    />
                    <Text style={{marginLeft : 5, textTransform : 'capitalize', fontWeight : '900', color : '#fff'}}>finish</Text>
                  </TouchableOpacity>
                </View>   
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>   
    </View>
  )
}
