<template>
  <Transition>
    <div class="additional-info">
      <DataCard v-for="data in dataInfo" :title="data.title" :value="data.value">
        <template #icon>
          <WeatherWindy v-if="data.icon === 'WeatherWindy'" />
          <Waves v-else-if="data.icon === 'Waves'" />
          <CarBrakeRetarder v-else-if="data.icon === 'CarBrakeRetarder'" />
          <WeatherSunsetUp v-else-if="data.icon === 'WeatherSunsetUp'" />
          <Thermometer v-else-if="data.icon === 'Thermometer'" />
        </template>
      </DataCard>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import type { PropType } from 'vue'
  import DataCard from '@/components/DataCard.vue'
  import WeatherWindy from 'vue-material-design-icons/WeatherWindy.vue'
  import Waves from 'vue-material-design-icons/Waves.vue'
  import Thermometer from 'vue-material-design-icons/Thermometer.vue'
  import WeatherSunsetUp from 'vue-material-design-icons/WeatherSunsetUp.vue'
  import CarBrakeRetarder from 'vue-material-design-icons/CarBrakeRetarder.vue'

  // @apply grid grid-cols-2 gap-[10px] sm:grid-cols-3 md:grid-cols-4;

  defineProps({
    dataInfo: {
      type: Array as PropType<{ title: string; value: string | number; icon: string }[]>,
      default: () => [],
    },
  })
</script>

<style lang="postcss" scoped>
  .additional-info {
    @apply grid grid-cols-2 gap-[10px] xs:grid-cols-3 md:grid-cols-4;
  }
</style>
