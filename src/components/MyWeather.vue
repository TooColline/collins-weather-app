<template>
  <div class="my-weather">
    <div @click="showMore = !showMore" class="location-weather-overview">
      <div class="location">
        <h1 class="current-temp">{{ currTemp }}</h1>
        <h3 class="title">{{ weatherLocation.name }}, {{ weatherLocation.country }}</h3>
      </div>
      <div class="weather-overview">
        <img class="weather-icon" :src="weatherIconUrl" alt="Weather icon" />
        <h3>{{ capitalize(weatherDescription.description) }}</h3>
        <h4 class="high-low-temp">{{ highLowTemperature }}</h4>
      </div>
    </div>
    <hr v-if="showMore" />
    <div v-if="showMore" class="additional-info">
      <h5>Additional info</h5>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { key } from '@/store/weather'
  import { useStore } from 'vuex'
  const store = useStore(key)

  const showMore = ref(false)

  const weatherLocation = computed(() => store.state.weatherData.location)

  const weather = computed(() => store.state.weatherData.weather)

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const weatherDescription = computed(() => store.state.weatherData.weatherDescription)

  const currTemp = computed(() => `${mathRound.value(weather.value.currentTemperature)}\u00B0`)

  const mathRound = computed(() => (value: number) => Math.round(value))

  const highLowTemperature = computed(
    () =>
      `H:${mathRound.value(weather.value.highTemperature)}\u00B0  L:${mathRound.value(
        weather.value.lowTemperature
      )}\u00B0`
  )

  const weatherIconUrl = computed(() => `http://openweathermap.org/img/wn/${weatherDescription.value.icon}@2x.png`)

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
        store.dispatch('setWeatherDescription', {
          id: resp.weather[0].id,
          main: resp.weather[0].main,
          description: resp.weather[0].description,
          icon: resp.weather[0].icon,
        })
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  }

  onMounted(() => {
    getWeather()
  })
</script>

<style lang="postcss">
  .my-weather {
    @apply flex flex-col space-y-[20px] bg-white px-[20px] py-[15px] rounded-lg shadow-lg;
    @apply md:w-[500px];
    .location-weather-overview {
      @apply flex items-end justify-between md:cursor-pointer;
      .location {
        .current-temp {
          @apply font-bold;
        }
      }
      .weather-overview {
        @apply flex flex-col items-end;
        img.weather-icon {
          @apply w-[60px] h-[60px];
        }
        .high-low-temp {
          @apply opacity-50;
        }
      }
    }
  }
</style>
