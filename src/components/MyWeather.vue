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
        <div
          @click="showMoreDetails"
          class="location-weather-overview-wrapper"
          :class="{ 'can-show-more': weather.currentTemperature }"
        >
          <div class="location-weather-overview">
            <div class="location">
              <h1 class="current-temp">{{ currTemp }}</h1>
              <h3 class="title">{{ locationNameOrTimezone }}</h3>
            </div>
            <div class="weather-overview">
              <img
                v-if="weatherDescription.icon"
                class="weather-icon"
                :src="weatherIconUrl(weatherDescription.icon)"
                alt="Weather icon"
              />
              <h3>{{ capitalize(weatherDescription.description) }}</h3>
              <h4 class="high-low-temp">{{ highLowTemperature }}</h4>
            </div>
          </div>
          <div v-if="weather.currentTemperature && !showMore" class="show-more">
            <ArrowDownCircle />
          </div>
        </div>
        <Transition>
          <AdditionalWeatherData v-if="showMore" :dataInfo="dataInfo" />
        </Transition>
        <div class="next-days-wrapper">
          <h6 class="title">Next 7 days forecast</h6>
          <div class="next-days" :class="{ 'no-data': !nextDaysWeatherData.length }">
            <div class="day-weather" v-if="nextDaysWeatherData.length" v-for="item in nextDaysWeatherData">
              <h6 class="day">{{ item.day }}</h6>
              <img v-if="item.icon" class="icon" :src="weatherIconUrl(item.icon)" alt="Weather icon" />
              <h4 class="temp">{{ item.temp }}</h4>
            </div>
            <div class="no-data" v-else>No data to display</div>
          </div>
        </div>
        <PreviousWeatherData />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import MyWeatherLoader from '@/components/loaders/MyWeatherLoader.vue'
  import AdditionalWeatherData from '@/components/AdditionalWeatherData.vue'
  import PreviousWeatherData from '@/components/PreviousWeatherData.vue'
  import ArrowDownCircle from 'vue-material-design-icons/ArrowDownCircle.vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { createToaster } from '@meforma/vue-toaster'
  import { DateTime } from 'luxon'
  import { useStore } from 'vuex'
  import { useWeather } from '@/composables/useWeather'
  import { key } from '@/store/weather'
  import type { AbstractDayWeather } from '@/services/interfaces/Weather'

  const { weatherIconUrl, mathRound } = useWeather()
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

  const weatherDescription = computed(() => store.state.weatherData.weatherDescription)

  const currTemp = computed(() => `${mathRound.value(weather.value.currentTemperature)}\u00B0`)

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

  const nextDaysWeatherData = computed(() => store.state.weatherData.nextDaysWeather)

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

  const locationNameOrTimezone = computed(() => {
    if (weatherLocation.value.name && weatherLocation.value.country)
      return `${weatherLocation.value.name}, ${weatherLocation.value.country}`
    return '-'
  })

  const showMoreDetails = () => {
    // check whether some details are available first
    if (weather.value.currentTemperature) {
      showMore.value = !showMore.value
    }
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const fetchWeather = () => {
    if (location.value) {
      reLoadingWeatherData.value = true
      getCurrentWeather(location.value)
    }
  }

  const getCurrentWeather = async (location: string) => {
    await WeatherApi.getWeatherDetails(location)
      .then((resp: any) => {
        console.log(resp, 'resp')
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
        getFutureWeatherForecastData(resp.coord.lat, resp.coord.lon)
      })
      .catch((err: any) => {
        if (err.response.status === 404) {
          toaster.show('Location not found, try another location', {
            type: 'error',
          })
          loadingWeatherData.value = false
          reLoadingWeatherData.value = false
        }
        if (err.response.status === 429) {
          loadingWeatherData.value = false
          reLoadingWeatherData.value = false
          toaster.show('Too many requests, try again after a while', {
            type: 'info',
          })
        }
      })
  }

  const getFutureWeatherForecastData = (lat: number, lon: number) => {
    WeatherApi.getWeatherForecast(lat, lon)
      .then((resp: any) => {
        console.log(resp, 'resp2')
        const nextDaysWeather: AbstractDayWeather[] = []
        resp.daily.slice(1, 8).forEach((day: any) => {
          nextDaysWeather.push({
            day: DateTime.fromSeconds(day.dt).toFormat('dd'),
            temp: `${mathRound.value(day.temp.max)}\u00B0`,
            icon: day.weather[0].icon,
          })
        })
        store.dispatch('setNextDaysWeather', nextDaysWeather)
      })
      .catch((err: { response: any }) => {
        if (err.response.status === 429) {
          toaster.show('Too many requests, try again after a while', {
            type: 'info',
          })
        }
      })
      .finally(() => {
        loadingWeatherData.value = false
        reLoadingWeatherData.value = false
      })
  }

  getCurrentWeather('Nairobi')
</script>

<style lang="postcss">
  .my-weather {
    @apply flex flex-col space-y-[20px] px-[20px] py-[15px] w-full bg-white;
    @apply md:w-[700px] md:rounded-lg md:shadow-lg;
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
      .location-weather-overview-wrapper {
        @apply flex flex-col;
        &.can-show-more {
          @apply md:cursor-pointer;
        }
        .location-weather-overview {
          @apply flex items-end justify-between;
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
        .show-more {
          > * {
            @apply flex items-center justify-center md:hidden;
          }
        }
      }
      .next-days-wrapper,
      .last-days-wrapper {
        @apply flex flex-col space-y-[15px];
        .title {
          @apply font-bold uppercase opacity-75;
        }
        .next-days,
        .last-days {
          @apply flex items-center justify-between;
          &.no-data {
            @apply justify-center;
          }
          .day-weather {
            @apply flex items-center flex-col space-y-[10px];
            .day {
              @apply opacity-50;
            }
            img.icon {
              @apply w-[40px] h-[40px];
            }
            .temp {
              @apply font-bold;
            }
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
