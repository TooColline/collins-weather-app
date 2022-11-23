import { computed } from 'vue'
import { key } from '@/store/weather'
import { useStore } from 'vuex'

export function useWeather() {
  const store = useStore(key)
  const weatherIconUrl = computed(() => (icon: string) => `http://openweathermap.org/img/wn/${icon}@2x.png`)

  const mathRound = computed(() => (value: number) => Math.round(value))

  const loadingWeatherData = computed(() => store.state.loadingWeatherData)

  const reLoadingWeatherData = computed(() => store.state.reLoadingWeatherData)

  const weatherLocation = computed(() => store.state.weatherData.location)

  const weather = computed(() => store.state.weatherData.weather)

  const weatherDescription = computed(() => store.state.weatherData.weatherDescription)

  const nextDaysWeatherData = computed(() => store.state.weatherData.nextDaysWeather)

  return {
    weatherIconUrl,
    mathRound,
    loadingWeatherData,
    reLoadingWeatherData,
    weatherLocation,
    weather,
    weatherDescription,
    nextDaysWeatherData,
  }
}
