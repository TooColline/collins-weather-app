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

  static async getPastDetails(): Promise<any> {
    return axios
      .get('/forecast', {
        params: {
          lat: 51.5085,
          lon: -0.1257,
          // dt: DateTime.now().minus({ days: 3 }).toJSDate().getTime(),
          units: 'metric',
          cnt: 5,
          // exclude: 'minutely,hourly,alerts',
        },
      })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err))
  }
}
