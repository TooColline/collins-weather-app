<template>
  <div class="data-card">
    <div class="icon-title">
      <div class="icon">
        <slot name="icon" />
      </div>
      <h6 class="title">{{ title }}</h6>
    </div>
    <h4 class="value">{{ value }}</h4>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    title: string
    value: number | string
  }>()
</script>

<style lang="postcss" scoped>
  .data-card {
    @apply flex flex-col space-y-[10px] border rounded-lg p-[5px];
    .icon-title {
      @apply flex items-center space-x-[7px];
      .title {
        @apply uppercase opacity-60;
      }
    }
    .value {
      @appply font-semibold;
    }
  }
</style>
