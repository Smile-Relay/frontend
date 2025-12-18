<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>
<template>
  <div class="max-w-3xl mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <p class="text-xl text-base leading-relaxed text-gray-700">
      {{ text }}
    </p>
    <slot />
  </div>
</template>

<style scoped>

</style>