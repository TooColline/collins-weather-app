<template>
  <div v-if="loadingPreviousDatesWeather">
    <PlaceholderShimmer height="75px" width="100%" animate />
  </div>
  <div v-else class="last-days-wrapper">
    <h6 class="title">Last 5 days forecast</h6>
    <div class="last-days" :class="{ 'no-data': !previousDatesWeather.length }">
      <div class="day-weather" v-if="previousDatesWeather.length" v-for="item in sortedPreviousDatesWeather">
        <h6 class="day">{{ item.day }}</h6>
        <img v-if="item.icon" class="icon" :src="weatherIconUrl(item.icon)" alt="Weather icon" />
        <h4 class="temp">{{ item.temp }}</h4>
      </div>
      <div v-else class="no-data">No data to display</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import PlaceholderShimmer from '@/components/PlaceholderShimmer.vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { useWeather } from '@/composables/useWeather'
  import { DateTime } from 'luxon'
  import type { AbstractDayWeather } from '@/services/interfaces/Weather'

  const { weatherIconUrl, mathRound } = useWeather()
  const loadingPreviousDatesWeather = ref(true)
  const previousDatesWeather = ref([] as AbstractDayWeather[])

  const sortedPreviousDatesWeather = computed(() => {
    return previousDatesWeather.value.sort((a, b) => b.day - a.day)
  })

  const monthToday = DateTime.now().month
  const yearToday = DateTime.now().year

  const dates: number[] = []

  for (let i = 0; i < 5; i++) {
    const date = DateTime.now().minus({ days: i }).day
    const fullDate = `${yearToday}-${monthToday}-${date}`
    dates.push(DateTime.fromFormat(fullDate, 'yyyy-M-dd').toSeconds())
  }

  dates.forEach(async (date, index, array) => {
    await WeatherApi.getPreviousDaysForecast(date)
      .then((resp: any) => {
        previousDatesWeather.value.push({
          day: DateTime.fromSeconds(resp.current.dt).toFormat('dd'),
          temp: `${mathRound.value(resp.current.temp)}\u00B0`,
          icon: resp.current.weather[0].icon,
        })
      })
      .catch((err: { response: any }) => {
        if (err.response.status === 429) {
          loadingPreviousDatesWeather.value = false
        }
      })
    if (index === array.length - 1) {
      loadingPreviousDatesWeather.value = false
    }
  })
</script>

<style lang="postcss"></style>
