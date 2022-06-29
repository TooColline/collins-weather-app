import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export interface AbstractDayWeather {
  temp: string
  icon: string
  day: string
}

export interface State {
  weatherData: {
    weather: {
      currentTemperature: number
      feelsLike: number
      highTemperature: number
      lowTemperature: number
      windSpeed: number
      humidity: number
      pressure: number
      sunrise: string
      sunset: string
    }
    weatherDescription: {
      id: number
      icon: string
      main: string
      description: string
    }
    location: {
      name: string
      country: string
      lon: number
      lat: number
      timezone: number
      date: number // unix time
    }
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
    setWeather(
      { commit },
      payload: {
        currentTemperature: number
        feelsLike: number
        highTemperature: number
        lowTemperature: number
        windSpeed: number
        humidity: number
        pressure: number
        sunrise: string
        sunset: string
      }
    ) {
      commit('SET_WEATHER', payload)
    },
    setWeatherDescription(
      { commit },
      payload: {
        id: number
        icon: string
        main: string
        description: string
      }
    ) {
      commit('SET_WEATHER_DESCRIPTION', payload)
    },
    setWeatherLocation(
      { commit },
      payload: { name: string; country: string; lon: number; lat: number; timezone: number; date: number }
    ) {
      commit('SET_WEATHER_LOCATION', payload)
    },
    setNextDaysWeather(
      { commit },
      payload: {
        data: AbstractDayWeather[]
      }
    ) {
      commit('SET_NEXT_DAYS_WEATHER', payload.data)
    },
  },
})
