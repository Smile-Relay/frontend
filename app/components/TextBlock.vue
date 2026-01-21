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
  <UCard>
    <p class="text-4xl leading-relaxed text-gray-700">
      {{ props.text }}
    </p>
  </UCard>
</template>

<style scoped>

</style>