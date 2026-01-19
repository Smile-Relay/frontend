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
  <div class="flex gap-3">
    <button
        v-for="item in props.options"
        :key="item"
        class="px-4 py-2 rounded-lg border font-medium
             bg-white text-gray-700 border-gray-300
             hover:bg-blue-50 hover:border-blue-400
             active:scale-95 transition-all"
        @click="handleClick(item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<style scoped>
</style>
