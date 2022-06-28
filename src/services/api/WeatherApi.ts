import axios from './interceptor'

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
}
