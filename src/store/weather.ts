import type { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { createToaster } from '@meforma/vue-toaster'
import WeatherApi from '@/services/api/WeatherApi'
import { DateTime } from 'luxon'
import type {
  AbstractDayWeather,
  CurrentWeatherData,
  Location,
  WeatherDescription,
} from '@/services/interfaces/Weather'

const toaster = createToaster({
  position: 'top',
  duration: 3000,
})

export interface State {
  weatherData: {
    weather: CurrentWeatherData
    weatherDescription: WeatherDescription
    location: Location
    nextDaysWeather: AbstractDayWeather[]
  }
  loadingWeatherData: boolean
  reLoadingWeatherData: boolean
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
    loadingWeatherData: false,
    reLoadingWeatherData: false,
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
    SET_LOADING_WEATHER_DATA(state, value) {
      state.loadingWeatherData = value
    },
    SET_RE_LOADING_WEATHER_DATA(state, value) {
      state.reLoadingWeatherData = value
    },
  },
  actions: {
    setWeatherData({ commit, dispatch }, location: string) {
      commit('SET_LOADING_WEATHER_DATA', true)
      return WeatherApi.getWeatherDetails(location)
        .then((resp: any) => {
          commit('SET_WEATHER', {
            currentTemperature: resp.main.temp,
            feelsLike: resp.main.feels_like,
            highTemperature: resp.main.temp_max,
            lowTemperature: resp.main.temp_min,
            windSpeed: resp.wind.speed,
            humidity: resp.main.humidity,
            pressure: resp.main.pressure,
            sunrise: resp.sys.sunrise,
            sunset: resp.sys.sunset,
          })
          commit('SET_WEATHER_LOCATION', {
            name: resp.name,
            country: resp.sys.country,
            lon: resp.coord.lon,
            lat: resp.coord.lat,
            timezone: resp.timezone,
            date: resp.dt,
          })
          commit('SET_WEATHER_DESCRIPTION', {
            id: resp.weather[0].id,
            main: resp.weather[0].main,
            description: resp.weather[0].description,
            icon: resp.weather[0].icon,
          })
          dispatch('setNextDaysWeather', { lat: resp.coord.lat, lon: resp.coord.lon })
        })
        .catch((err: any) => {
          if (err.response.status === 404) {
            toaster.show('Location not found, try another location', {
              type: 'error',
            })
            commit('SET_LOADING_WEATHER_DATA', false)
            commit('SET_RE_LOADING_WEATHER_DATA', false)
          }
          if (err.response.status === 429) {
            commit('SET_LOADING_WEATHER_DATA', false)
            commit('SET_RE_LOADING_WEATHER_DATA', false)
            toaster.show('Too many requests, try again after a while', {
              type: 'info',
            })
          }
        })
    },

    setNextDaysWeather({ commit }, payload: { lat: string; lon: string }) {
      return WeatherApi.getWeatherForecast(payload.lat, payload.lon)
        .then((resp: any) => {
          const nextDaysWeather: AbstractDayWeather[] = []
          resp.daily.slice(1, 8).forEach((day: any) => {
            nextDaysWeather.push({
              day: DateTime.fromSeconds(day.dt).toFormat('dd'),
              temp: `${Math.round(day.temp.max)}\u00B0`,
              icon: day.weather[0].icon,
            })
          })
          commit('SET_NEXT_DAYS_WEATHER', nextDaysWeather)
          commit('SET_LOADING_WEATHER_DATA', false)
          commit('SET_RE_LOADING_WEATHER_DATA', false)
        })
        .catch((err: { response: any }) => {
          if (err.response.status === 429) {
            toaster.show('Too many requests, try again after a while', {
              type: 'info',
            })
          }
          commit('SET_LOADING_WEATHER_DATA', false)
          commit('SET_RE_LOADING_WEATHER_DATA', false)
        })
    },
  },
})
