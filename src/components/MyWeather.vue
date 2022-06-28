<template>
  <MyWeatherLoader :initialLoad="false" v-if="loadingWeatherData" />
  <div v-else class="my-weather">
    <div class="location-input">
      <h4>Find weather</h4>
      <input
        @keyup.enter="fetchWeather"
        type="search"
        v-model="location"
        placeholder="Enter a location and press enter"
      />
    </div>
    <div class="weather-info-body">
      <MyWeatherLoader v-if="reLoadingWeatherData" />
      <template v-else>
        <div @click="showMore = !showMore" class="location-weather-overview">
          <div class="location">
            <h1 class="current-temp">{{ currTemp }}</h1>
            <h3 class="title">{{ weatherLocation.name }}, {{ weatherLocation.country }}</h3>
          </div>
          <div class="weather-overview">
            <img v-if="weatherIconUrl" class="weather-icon" :src="weatherIconUrl" alt="Weather icon" />
            <h3>{{ capitalize(weatherDescription.description) }}</h3>
            <h4 class="high-low-temp">{{ highLowTemperature }}</h4>
          </div>
        </div>
        <Transition>
          <AdditionalWeatherData v-if="showMore" :dataInfo="dataInfo" />
        </Transition>
        <div class="next-days">
          <h5>Next 7 days data here</h5>
        </div>
        <div class="last-days">
          <h5>Last 5 days data here</h5>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import MyWeatherLoader from '@/components/loaders/MyWeatherLoader.vue'
  import AdditionalWeatherData from '@/components/AdditionalWeatherData.vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { key } from '@/store/weather'
  import { createToaster } from '@meforma/vue-toaster'
  import { DateTime } from 'luxon'
  import { useStore } from 'vuex'

  const store = useStore(key)
  const toaster = createToaster({
    position: 'top',
    duration: 3000,
  })

  const loadingWeatherData = ref(true)
  const reLoadingWeatherData = ref(false)
  const location = ref('')
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

  const formatDateFromSeconds = computed(() => (seconds: number) => {
    const date = DateTime.fromSeconds(seconds)
    return date.toFormat('HH:mm')
  })

  const dataInfo = computed(() => {
    return [
      {
        title: 'Wind',
        value: `${weather.value.windSpeed} km/h`,
        icon: 'WeatherWindy',
      },
      {
        title: 'Humidity',
        value: `${weather.value.humidity}%`,
        icon: 'Waves',
      },
      {
        title: 'Feels like',
        value: `${mathRound.value(weather.value.feelsLike)}\u00B0`,
        icon: 'Thermometer',
      },
      {
        title: 'Pressure',
        value: `${weather.value.pressure} hPa`,
        icon: 'CarBrakeRetarder',
      },
      {
        title: 'Sunrise',
        value: formatDateFromSeconds.value(weather.value.sunrise),
        icon: 'WeatherSunsetUp',
      },
      {
        title: 'Sunset',
        value: formatDateFromSeconds.value(weather.value.sunset),
        icon: 'WeatherSunsetUp',
      },
    ]
  })

  const weatherIconUrl = computed(() => `http://openweathermap.org/img/wn/${weatherDescription.value.icon}@2x.png`)

  const fetchWeather = () => {
    if (location.value) {
      reLoadingWeatherData.value = true
      getWeather(location.value)
    }
  }

  const getWeather = async (location: string) => {
    await WeatherApi.getWeatherDetails(location)
      .then((resp: any) => {
        // console.log(resp, 'response')
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
      .catch((err: any) => {
        if (err.response.status === 404) {
          toaster.show('Location not found, try another location', {
            type: 'error',
          })
        }
      })
      .finally(() => {
        loadingWeatherData.value = false
        reLoadingWeatherData.value = false
      })
  }

  onMounted(() => {
    getWeather('Nairobi')
    // testing weather forecast for x days
    WeatherApi.getPastDetails()
      .then((resp: any) => {
        // console.log(resp, 'response')
      })
      .catch((err: { response: any }) => {
        // console.log(err.response, 'error')
      })
  })
</script>

<style lang="postcss">
  .my-weather {
    @apply flex flex-col space-y-[20px] px-[20px] py-[15px] w-full bg-white;
    @apply md:w-[500px] md:rounded-lg md:shadow-lg;
    .location-input {
      @apply flex flex-col space-y-[10px];
      input {
        @apply w-full px-[10px] py-[5px] rounded-lg border focus:border-blue-500 outline-none;
      }
    }
    .weather-info-body {
      @apply flex flex-col space-y-[20px];
      > * {
        @apply border-b pb-[20px];
      }
      > :last-child {
        @apply border-b-0;
      }
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
  }
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>
