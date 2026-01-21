<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

const props = defineProps<{
  options: string[]
}>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

function handleClick(value: string) {
  emit('select', value)
}
</script>

<template>
  <div class="flex gap-3 flex-col text-4xl">
    <UButton
        v-for="item in props.options"
        :key="item"
        variant="outline"
        color="neutral"
        class="text-4xl text-gray-700 justify-center"
        @click="handleClick(item)"
    >
      {{ item }}
    </UButton>
  </div>
</template>

<style scoped>
</style>
