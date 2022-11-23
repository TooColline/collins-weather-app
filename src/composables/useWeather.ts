import { computed } from 'vue'

export function useWeather() {
  const weatherIconUrl = computed(() => (icon: string) => `http://openweathermap.org/img/wn/${icon}@2x.png`)

  const mathRound = computed(() => (value: number) => Math.round(value))

  return {
    weatherIconUrl,
    mathRound,
  }
}
