import axios from './interceptor'
import { DateTime } from 'luxon'

export default class WeatherApi {
  static async getWeatherDetails(location: string): Promise<any> {
    return axios
      .get('/weather', {
        params: {
          q: location,
          units: 'metric',
        },
      })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err))
  }

  static async getWeatherForecast(lat: number, lon: number): Promise<any> {
    return axios
      .get('/onecall', {
        params: {
          lat,
          lon,
          units: 'metric',
          exclude: 'minutely,hourly',
        },
      })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err))
  }

  // the api accepts dt as a string
  static async getPreviousDaysForecast(dt: number): Promise<any> {
    return axios
      .get('/onecall/timemachine', {
        params: {
          lat: 51.5085,
          lon: -0.1257,
          dt: `${dt}`,
          units: 'metric',
        },
      })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err))
  }
}
