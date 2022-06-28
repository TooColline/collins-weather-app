<template>
  <div class="placeholder-shimmer">
    <div
      class="shimmer-wrapper"
      :class="{ animate: animationStatus, 'shimmer-bg': renderingStatus }"
      :style="{ height: isLoadingResource ? height : 'auto', width: width }"
    >
      <slot :isLoadingResource="isLoadingResource" :onResourceLoaded="onResourceLoaded" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, defineComponent, ref } from 'vue'
  const props = defineProps({
    animate: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: '100%',
    },
    width: {
      type: String,
      default: '100%',
    },
    slotStatus: {
      type: Boolean,
      default: undefined,
    },
  })

  const isLoadingResource = ref(true)

  const animationStatus = computed(() => {
    if (isLoadingResource.value) return props.animate
    return isLoadingResource.value
  })

  const renderingStatus = computed(() => {
    if (typeof props.slotStatus === 'boolean') return props.slotStatus
    return isLoadingResource.value
  })

  const onResourceLoaded = () => {
    isLoadingResource.value = false
  }
</script>

<style lang="postcss" scoped>
  .placeholder-shimmer {
    @apply contents;
    .shimmer-wrapper:not(.shimmer-bg) {
      @apply contents sm:inline md:block;
    }
    .shimmer-bg {
      @apply block bg-black bg-opacity-5 w-full mb-[5px] rounded-2xl;
    }
    .animate {
      @apply bg-black bg-opacity-5 rounded-md animate-shimmer bg-[length:200%] bg-shimmer-start;
      background: linear-gradient(to right, #d0d0d0 8%, #e0dede 58%, #d0d0d0 92%);
    }
    .shimmer-asset {
      @apply opacity-0;
    }
  }
  @keyframes placeHolderShimmer {
    0% {
      @apply bg-shimmer-end;
    }
    50% {
      @apply opacity-50;
    }
    to {
      @apply bg-shimmer-start;
    }
  }
</style>
