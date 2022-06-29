import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import type {
  AbstractDayWeather,
  CurrentWeatherData,
  Location,
  WeatherDescription,
} from '@/services/interfaces/Weather'

export interface State {
  weatherData: {
    weather: CurrentWeatherData
    weatherDescription: WeatherDescription
    location: Location
    nextDaysWeather: AbstractDayWeather[]
  }
}

// define injection key for vuex store
export const key: InjectionKey<Store<State>> = Symbol()

export const store = createStore<State>({
  state: {
    weatherData: {
      weather: {
        currentTemperature: 0,
        feelsLike: 0,
        highTemperature: 0,
        lowTemperature: 0,
        windSpeed: 0,
        humidity: 0,
        pressure: 0,
        sunrise: '',
        sunset: '',
      },
      location: {
        name: '',
        country: '',
        lon: 0,
        lat: 0,
        timezone: 0,
        date: 0, // unix time
      },
      weatherDescription: {
        id: 0,
        icon: '',
        main: '',
        description: '',
      },
      nextDaysWeather: [],
    },
  },
  getters: {
    weather: (state) => state.weatherData.weather,
    weatherDescription(state) {
      return state.weatherData.weatherDescription
    },
    location(state) {
      return state.weatherData.location
    },
  },
  mutations: {
    SET_WEATHER(state, weather) {
      state.weatherData.weather = weather
    },
    SET_WEATHER_DESCRIPTION(state, weatherDescription) {
      state.weatherData.weatherDescription = weatherDescription
    },
    SET_WEATHER_LOCATION(state, location) {
      state.weatherData.location = location
    },
    SET_NEXT_DAYS_WEATHER(state, weather) {
      state.weatherData.nextDaysWeather = weather
    },
  },
  actions: {
    setWeather({ commit }, payload: CurrentWeatherData) {
      commit('SET_WEATHER', payload)
    },
    setWeatherDescription({ commit }, payload: WeatherDescription) {
      commit('SET_WEATHER_DESCRIPTION', payload)
    },
    setWeatherLocation({ commit }, payload: Location) {
      commit('SET_WEATHER_LOCATION', payload)
    },
    setNextDaysWeather({ commit }, payload: AbstractDayWeather[]) {
      commit('SET_NEXT_DAYS_WEATHER', payload)
    },
  },
})
