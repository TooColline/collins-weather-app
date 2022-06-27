<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="font-bold">{{ city }} weather</h1>
  </div>
</template>

<script setup>
  import { computed, onMounted } from 'vue'
  import WeatherApi from '@/services/api/WeatherApi'
  import { key } from '@/store/weather'
  import { useStore } from 'vuex'

  const store = useStore(key)

  const city = computed(() => store.state.weatherData.city)

  onMounted(() => {
    // 33.44, -94.05
    WeatherApi.getWeatherDetails('nairobi')
      .then((resp) => {
        console.log(resp, 'response')
      })
      .catch((err) => {
        console.log(err, 'error')
      })
  })
</script>

<style lang="postcss"></style>
