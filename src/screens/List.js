import React, { Component, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Alert,
  Linking,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  TextInput
} from 'react-native';
import BackgroundCurve from '../components/BackgroundCurve';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import IconKu from 'react-native-vector-icons/dist/FontAwesome5';
import mocks2 from "./mocks2.json";
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import { Input, Icon, Button } from 'react-native-elements';
import Toast from 'react-native-toast-message'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Lottie from 'lottie-react-native';

const styles = StyleSheet.create({   
    svg: {
      position: 'absolute',
      width: Dimensions.get('window').width,
      top: -170,
    },
});

class List extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            dataActive : [],
            getData : [],
            loadingBar : false,
            refresh : false,
        };
        this.pickerRef = React.createRef();
        this.url = "http://192.168.1.2:5000/index.php/api/schedule"
    }

    componentDidMount(){
        const screenfocus = this.props.navigation.addListener('focus', () => {
            this.ambilListData();
        });
    }

    async ambilListData(){
        this.setState({
            loadingBar:true,
        });  
        await fetch(this.url,{
            method:'GET',
            headers : new Headers({
              'Content-Type':'application/json', 
              'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
            }),
        })
        .then((response)=> response.json())
        .then((json)=>{
        //console.log(json);
        this.setState({
            loadingBar:false,
        });
          this.setState({getData:json.results.data});
        }) 
        .catch((error)=>{
          console.log(error);
        }) 
    }

    async _basedOnCategory({keyword, choose}){
        // sinkron realtime form input to setState  
        await this.setState({ 
            // 'keyword': keyword,
            'choose' : choose
        });
        // loadingBar(true);
        if(this.state.choose == undefined){
            var picker = "";
        }else{
            var picker = this.state.choose; 
        }
        await fetch("http://192.168.1.2:5000/index.php/api/filterschedule?dropdown="+picker,{
            method:'GET',
            headers : new Headers({
            'Content-Type':'application/json', 
            'Authorization':'Bearer 10rxZ2SoGitKcSmmu2YKxdQOdcmT05OYNz53YEPPrjRmwnXac2P7Zaq',
            })
        })
        .then(response =>response.json()) 
        .then((json)=>{
            // loadingBar(false);
            
            if(json.results.code == 400){
                Toast.show({
                    type : 'info',
                    text1 : 'INFO',
                    text2 : json.results.description,
                    autoHide : true,
                    visibilityTime : 3000,
                    position : 'top',
                    bottomOffset : 50,
                });
            }else{       
            var hasil = json.results.data;   
            this.setState({getData:hasil});        
            }
        })
    }

    render(){
        const { navigation } = this.props;

        const ItemView = () => {
            return (
                this.state.getData === null ?
                <Text>No Data Found</Text>
                :
                this.state.getData.map((val, index) => (
                    <TouchableOpacity onPress={() => navigation.navigate('DetailList', {data : val})} >
                        <View style={{
                            borderWidth: 1.5,
                            borderColor: '#EFEFF0',
                            margin: 15,
                            padding: 20,
                            borderRadius: 12,
                        }}>  
                            <Text style={{
                                fontSize: 23,
                                fontWeight: 'bold',
                                color: '#0D1820',
                                marginBottom: 10,
                            }}>
                                Rp. {val.price}{' '}
                                <Text style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#828595',
                                    textDecorationLine: 'line-through',
                                }}>Rp. ({val.price_ori})</Text>
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
                                <Ionicons name="ios-calendar" style={{marginRight : 15}} />
                                {'  '}
                                {val.time}
                                </Text>
                                <Text style={{
                                    color: '#24333A',
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                }}>
                                <Ionicons name="ios-airplane" style={{marginRight : 15}} />
                                {'  '}
                                {val.airline}
                                </Text>
                        
                                <Text style={{
                                    color: '#24333A',
                                    fontSize: 14,
                                    fontWeight: 'bold',
                                    right : 0,
                                    top : -2,
                                    position:  'absolute',
                                }}>Rating : {' '}
                                <Ionicons size={18} name="ios-star" style={{color : '#ffd700', borderWidth : 1, borderColor : '#ffd000'}} />
                                {val.rating}
                                </Text>
                            </View>
                            <Text style={{
                                position: 'absolute',
                                backgroundColor: '#FFF0E8',
                                color: '#FF702A',
                                fontWeight: 'bold',
                                padding: 6,
                                borderRadius: 10,
                                paddingHorizontal: 10,
                                left: -10,
                                top: -10,
                            }}>{val.sale_off}</Text>

                            <Image 
                                style={{
                                    width : 200,
                                    height : 200,
                                    position : 'absolute',
                                    right: -32,
                                    top: -105,
                                }}
                                source={require('../../assets/images/plane-tiket.png')}/>
                        </View>
                    </TouchableOpacity>
                ))
            );
        };


        return(
            <View style={{
                flex: 1,
                position: 'relative',
                backgroundColor: 'white',
            }}>
                <BackgroundCurve style={styles.svg}/>
                {this.state.loadingBar == false ? (      
                
                <ScrollView style={{marginTop : 20, flex : 1}}
                    refreshControl ={
                        <RefreshControl refreshing={this.state.loadingBar} onRefresh={this.ambilListData} />
                    }
                >
                    
                    <View style={{
                        borderRadius: 10,
                        marginTop:10, 
                        overflow: 'hidden', 
                        borderColor : '#fff', 
                        borderWidth : 1,
                        backgroundColor: '#fff',
                        margin: 10,
                    }}>
                        <Picker
                            backgroundColor='#E5E8E8'
                            style={{ height: 50 }}
                            selectedValue={this.state.choose}
                            onValueChange={(text) => {this._basedOnCategory({'choose':(text) }) }}
                            itemStyle={{ backgroundColor: "#000", fontFamily:"Ebrima", fontSize:17 }}
                        >
                            <Picker.Item color="#A4A4A5" label="-- Choose Airline --" value="" />
                            <Picker.Item color="#A4A4A5" label="Lion Air" value="2" />
                            <Picker.Item color="#A4A4A5" label="Sriwijaya" value="1" />
                        </Picker> 
                    </View>

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
                            }}>list results</Text>
                        </View>
                        <View style={{marginTop : 15}}>
                            <ItemView />
                        </View>
                    </View>
                </ScrollView>
                ) : (
                <View style={{margin : 15}}>
                    <SkeletonPlaceholder>
                        <View style={{backgroundColor:'white',marginBottom:10, flexDirection: 'row'}}>
                            <View style={{ width: '100%', height: 50, borderRadius: 4, margin : 10, justifyContent : 'center', alignItems : 'center', borderRadius : 10 }} />                      
                        </View>
                        </SkeletonPlaceholder>            

                        <SkeletonPlaceholder>
                        <View>
                            <Text style={{width: '100%', height: 150, borderRadius: 4, margin : 5}}></Text>
                            <Text style={{width: '100%', height: 150, borderRadius: 4, margin : 5}}></Text>
                            <Text style={{width: '100%', height: 150, borderRadius: 4, margin : 5}}></Text>
                            <Text style={{width: '100%', height: 150, borderRadius: 4, margin : 5}}></Text>
                        </View>
                    </SkeletonPlaceholder>
                </View> 
                )}
            </View>
        )
    }
}

export default List;

export const DetailList = ({navigation, route}) => {
    const [isLoading, loadingBar] = useState(false);
    const d = route.params.data;
    // console.log(d);

    var height = Dimensions.get('window').height;

    const add_to_cart = () => {
        loadingBar(true);
        fetch("http://192.168.1.2:5000/index.php/api/add_to_cart?id_data="+d.id_data+"&se_company_code="+d.comp_code+"&departure="+d.departure+"&arival="+d.arival+"&time="+d.time+"&price="+d.price+"&rating="+d.rating,{
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
          navigation.navigate('Cart')        
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

    return(
        <View style={{flex : 1, height : height, backgroundColor : '#fff'}}>
            <Toast/>
            {isLoading && (      
            <View style={{opacity : 0.8,backgroundColor: '#fff', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',zIndex:9999}}>
                <Lottie style={{width: 350}} source={require('../../assets/animations/loading.json')} autoPlay={true} loop={true} />
            </View>
            )} 
          <View style={{
              backgroundColor : '#fff',
              flex : 1,
              zIndex : -999,
              padding : 20
            }}>
            
            <Lottie
              style={{width : 400, margin : 10, right : 25}} 
              source={require('../../assets/animations/flucht.json')} autoPlay loop />

              
            <View style={{flexDirection : 'row', marginTop : 20}}>                                 
                <TouchableOpacity style={{
                    marginVertical : 10,
                    borderWidth : 1,
                    borderColor : '#fff',
                    backgroundColor : '#FB7200',
                    width : '50 %',
                    height : 30,
                    flexDirection : 'row',
                    justifyContent : 'center',
                    alignItems : 'center',
                    borderRadius : 20,
                    paddingHorizontal : 10,
                    display : 'flex'
                    }}
                    // onPress={handleClick}
                    >
                    <IconKu
                        name='globe'
                        size={15}
                        color={'#fff'}
                    />
                    <Text style={{
                        fontSize : 10, 
                        textTransform : 'uppercase', 
                        marginLeft : 6, 
                        color : '#fff',
                        fontWeight : '400'
                        }}>
                        visit us : {d.airline}
                    </Text>
                </TouchableOpacity>                         
            </View>
                  
          </View>     
        
          <View style = {{
              width : '100%',
              height : '100%',
              backgroundColor : '#fff',
              flex : 1,
              borderTopLeftRadius : 60,
              borderTopRightRadius : 60,
              elevation : 10,                     
              padding : 20
            }}>
                <View style={{zIndex : 9999, padding : 20, flex : 1}}>
                    <Text style={{fontSize : 22, fontWeight : 'bold', color : 'black', textTransform : 'uppercase'}}>
                        {d.comp_code} - {d.id_data}
                    </Text>

                    <View style={{flexDirection : 'row', marginTop : 5}}>
                        <View style={{width : '30%'}}>
                            <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>Airline</Text>
                        </View>
                        <View style={{width : '3%'}}>
                            <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                        </View>
                        <View style={{flexDirection : 'column', width : '100%'}}>
                            <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                                {d.airline}
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
                                {d.departure}
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
                                {d.arival}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection : 'row', marginTop : 5}}>
                        <View style={{width : '30%'}}>
                            <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>price</Text>
                        </View>
                        <View style={{width : '3%'}}>
                            <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                        </View>
                        <View style={{flexDirection : 'column', width : '100%'}}>
                            <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                                Rp. {d.price}
                            </Text>
                        </View>
                    </View>

                    <View style={{flexDirection : 'row', marginTop : 5}}>
                        <View style={{width : '30%'}}>
                            <Text style={{color : '#646464', fontSize : 16, textTransform : 'capitalize', fontWeight : '600'}}>time</Text>
                        </View>
                        <View style={{width : '3%'}}>
                            <Text style={{color : '#646464', fontSize : 16}}>:</Text>
                        </View>
                        <View style={{flexDirection : 'column', width : '100%'}}>
                            <Text style={{color : '#646464', fontSize : 16, fontWeight : '600'}}>
                                {d.time}
                            </Text>
                        </View>
                    </View>

                    <Text style={{fontSize : 16, fontWeight : 'bold', color : 'black', marginTop : 20}}>
                        {d.departure} - {d.arival}
                    </Text>
                
                </View>  
              <View style={{flex :1,alignItems : 'flex-end', margin : 10, bottom : 35}}>
                <View style={{
                    padding : 10, 
                    bottom : -126, 
                    borderWidth : 1, 
                    borderColor : '#fff',
                    borderRadius : 10,
                    width : '40%',
                    backgroundColor : '#FB7200'
                }}>
                  <TouchableOpacity style={{flexDirection : 'row'}} onPress={() => add_to_cart()}>
                    <IconKu
                        name='cart-plus'
                        size={15}
                        color={'#fff'}
                    />
                    <Text style={{marginLeft : 5, textTransform : 'capitalize', fontWeight : '900', color : '#fff'}}>Add To Cart</Text>
                  </TouchableOpacity>
                </View>      

              </View> 

          </View>   
        </View>
    )
}



