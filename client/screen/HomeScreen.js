import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Icons from "react-native-heroicons/solid";
import { debounce } from 'lodash';
import { fachtWatherForcast, fatchLocation } from '../api/weather';
import * as Progress from 'react-native-progress';

const bgImage = require('../assets/bg.jpg');
const bgImage2 = require('../assets/p3.png');
const wind = require('../assets/wind.png');
const water = require('../assets/water.png');
const sun = require('../assets/sun.png');
const rain = require('../assets/rain.png');

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handelLocation = (loc) => {
  //  console.log('Location : ', loc);
    setLocation([]);
    toggleSearch(false);
    setLoading(true);
    fachtWatherForcast({
      cityName: loc.name,
      days: '7'
    }).then(data => {
      setWeather(data);
      setLoading(false);
    //  console.log('Got forecast : ', data);
    }).catch(() => setLoading(false));
  }

  const handleSearch = value => {
    if (value.length > 2) {
      fatchLocation({ cityName: value }).then(data => {
        setLocation(data);
      })
    } 
  }

  useEffect(()=>{ 
    fetchMyWeatherData();
  },[]);

  const fetchMyWeatherData = async ()=>{
    fachtWatherForcast({
      cityName: 'Dhaka',
      days: '7'
    }).then(data=>{
      setWeather(data);
      setLoading(false)
    })
  }

  const handelTextBounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View className="relative">
      <StatusBar style='light' />
      <ScrollView>
        <Image source={bgImage} className="absolute w-full" ></Image>
    
        {
          loading?(
            <View style={{ }}  className=" justify-center items-center flex-collum" >
             <Progress.CircleSnail color={['red', 'green', 'blue']}style={{ marginTop:320, size:40, marginBottom:400 }} />
           
           
            </View>
           
          ):(
            <SafeAreaView >
              <View style={{ width: '100%', marginTop: 10 }}>
                <View className="flex-row justify-end items-center rounded-full ml-5 mr-5"
                  style={{ backgroundColor: showSearch ? 'gray' : 'transparent' }}>
                  {
                    showSearch ? (
                      <TextInput
                        onChangeText={handelTextBounce}
                        placeholder="Search City"
                        placeholderTextColor="lightgray"
                        className="h-11 pl-6 pb-2 flex-1 text-base text-white"
                      />
                    ) : null
                  }
                  <TouchableOpacity onPress={() => toggleSearch(!showSearch)}
                    style={{ backgroundColor: '#333' }}
                    className="p-3 m-1 rounded-full">
                    <Icons.MagnifyingGlassMinusIcon color="#fff" />
                  </TouchableOpacity>
                </View>
    
                {
                  locations.length > 0 && showSearch ? (
                    <View style={{ width: "90%" }} className=" bg-gray-400 top-1 ml-5 mr-5 rounded-3xl">
                      {
                        locations.map((loc, index) => {
                          let showBorder = index + 1 != locations.length;
                          let borderClass = showBorder ? ' border-b-2 border-b-gray-500' : '';
                          return (
                            <TouchableOpacity
                              onPress={() => handelLocation(loc)}
                              key={index}
                              className={"flex-row items-center z-1 p-3 px-4 border-0 mb-1" + borderClass}
                            >
                              <Icons.MapPinIcon />
                              <Text>{loc?.name}, {loc?.country}</Text>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </View>
                  ) : null
                }
              </View>
    
              {/* forecast design */}
    
              <View style={styles.forcast}>
                {/* location */}
                <Text style={styles.textStyle}>
                    {location?.name+","} <Text style={{ fontSize: 19 }} className="font-semibold text-gray-300">{location?.country}</Text>
                </Text>
    
                <View className="flex-row justify-center">
                  <Image style={{ height: 180, width: 180 }} source={{ uri: 'https:'+current?.condition?.icon }} className="w-52 h-52 mt-5"></Image>
                </View>
    
                {/* degree calculation */}
                <View className="space-y-2 mt-3">
                  <Text className="text-center font-bold text-white text-6xl">
                    {current?.temp_c}&#176;
                  </Text>
    
                  <Text className="text-white text-center text-xl tracking-widest">
                    {current?.condition?.text}
                  </Text>
                </View>
    
                <View className="flex-row justify-between mt-5 w-full pr-8 ml-8">
                  <View className="flex-row text-center space-x-2">
                    <Image source={wind} className="w-6 h-6"></Image>
                    <Text className="text-white font-semibold text-base">{current?.wind_kph}km</Text>
                  </View>
    
                  <View className="flex-row text-center space-x-2">
                    <Image source={water} className="w-6 h-6"></Image>
                    <Text className="text-white font-semibold text-base">{current?.humidity}%</Text>
                  </View>
    
                  <View className="flex-row text-center space-x-2">
                    <Image source={sun} className="w-6 h-6"></Image>
                    <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                  </View>
                </View>
    
                {/* forecast next days */}
    
                <View className="mb-2 w-full mt-6 pr-8 ml-8">
                  <View className="flex-row space-x-2">
                    <Icons.CalendarDaysIcon size="22" color="white" />
                    <Text className="text-white text-left text-base">Daily Forecast</Text>
                  </View>
                </View>
    
                <ScrollView
                  horizontal
                  contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
    
                  {
                    weather?.forecast?.forecastday?.map((item, index)=>{
                    let date = new Date(item.date);
                    let options = {weekday: 'long'};
                    let dayName = date.toLocaleDateString('en-US',options);
                    dayName = dayName.split(',')[0]
                      return(
                    
                        <View style={{ width: 130, height: 120 }}  key={index} className="flex justify-center items-center p-2 rounded-3xl py-3 space-y-1 mr-4 bg-gray-400">
                        
                        <Image source={{ uri: 'https:'+item?.day?.condition?.icon }} className="w-11 h-11"></Image>
                        <Text className="text-white">{dayName}</Text>
                        <Text className="text-white font-semibold text-xl">{item?.day?.avgtemp_c}&#176;</Text>
                      </View>
                      )
                    })
                  }
    
                </ScrollView>
              </View>
            </SafeAreaView>
         
          )
        }
    
   
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  forcast: {
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%"
  },
  textStyle: {
    color: 'white',
    position: 'relative',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15
  }
})

export default HomeScreen;
