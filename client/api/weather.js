import axios from 'axios';
import { apikey } from '../components/index';

const forcastEndPoint = params=> `http://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const locationEndPoint = params=> `http://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.cityName}`

const apiCall = async (endPoint)=>{
    const option={
        method : 'GET',
        url : endPoint
    }

    try {
        const response = await axios.request(option);
        return response.data;
    } catch (error) {
        console.log('Error : ',error);
        return null;
    }
}

export const fachtWatherForcast = params=>{
    return apiCall(forcastEndPoint(params));
}

export const fatchLocation = params=>{
    return apiCall(locationEndPoint(params));
}