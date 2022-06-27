<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="font-bold">{{ weatherLocation.name }}, {{ weatherLocation.country }}</h1>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { key } from '@/store/weather'
  import { useStore } from 'vuex'

  const store = useStore(key)

  const weatherLocation = computed(() => store.state.weatherData.location)

  const getWeather = async () => {
    await WeatherApi.getWeatherDetails('nairobi')
      .then((resp) => {
        console.log(resp, 'response')
        store.dispatch('setWeather', {
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
        store.dispatch('setWeatherLocation', {
          name: resp.name,
          country: resp.sys.country,
          lon: resp.coord.lon,
          lat: resp.coord.lat,
          timezone: resp.timezone,
          date: resp.dt,
        })
        store.dispatch('setWeatherDescription', resp.weather)
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  onMounted(() => {
    getWeather()
  })
</script>

<style lang="postcss"></style>
