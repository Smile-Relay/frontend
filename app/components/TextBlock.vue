<script setup lang="ts">
import { computed, defineExpose } from 'vue'

const props = defineProps<{
  text: string
}>()

const textRef = computed(() => props.text)

defineExpose<{
  text: typeof textRef
}>({
  text: textRef
})
</script>
<template>
  <div class="max-w-3xl mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <p class="text-xl leading-relaxed text-gray-700">
      {{ props.text }}
    </p>
  </div>
</template>

<style scoped>

</style>