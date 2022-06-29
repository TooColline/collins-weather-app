<template>
  <div class="my-weather-loader" :class="{ 'my-weather': !initialLoad }">
    <div :class="{ 'weather-info-body': !initialLoad }">
      <div class="location-weather-overview-wrapper">
        <div class="location-weather-overview">
          <div class="location">
            <div class="current-temp">
              <PlaceholderShimmer height="40px" width="60px" animate />
            </div>
            <div class="title">
              <PlaceholderShimmer height="30px" width="150px" animate />
            </div>
          </div>
          <div class="weather-overview">
            <div class="weather-icon">
              <PlaceholderShimmer height="60px" width="60px" animate />
            </div>
            <div>
              <PlaceholderShimmer height="25px" width="200px" animate />
            </div>
            <div class="high-low-temp">
              <PlaceholderShimmer height="25px" width="150px" animate />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="next-days-wrapper">
      <div class="title">
        <PlaceholderShimmer height="25px" width="200px" animate />
      </div>
      <div class="my-[20px]">
        <PlaceholderShimmer height="75px" width="100%" animate />
      </div>
      <div>
        <PlaceholderShimmer height="75px" width="100%" animate />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import PlaceholderShimmer from '@/components/PlaceholderShimmer.vue'

  defineProps({
    initialLoad: {
      type: Boolean,
      default: true,
    },
  })
</script>

<style lang="postcss">
  .my-weather-loader {
    .location-weather-overview {
      @apply w-full;
    }
  }
</style>
