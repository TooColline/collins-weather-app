import axios from './interceptor'

export default class WeatherApi {
  // latitude: number, longitude: number
  static async getWeatherDetails(location: string): Promise<any> {
    return axios
      .get('/weather', {
        params: {
          // lat: latitude,
          // lon: longitude,
          q: location,
          units: 'metric',
        },
      })
      .then((resp) => resp.data)
      .catch((err) => Promise.reject(err))
  }
}
