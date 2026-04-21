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
  <div class="mt-8 flex flex-wrap justify-center gap-8 w-full max-w-4xl mx-auto">
    <button
        v-for="item in props.options"
        :key="item"
        class="w-[280px] h-[72px] rounded-full bg-gradient-to-r from-[#EADCF8] to-[#F5EEFB] border-4 border-white shadow-[0_4px_15px_rgba(200,180,240,0.5),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-3xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.6),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 flex items-center justify-center tracking-wide"
        @click="handleClick(item)"
    >
      {{ item }}
    </button>
  </div>
</template>

<style scoped>
</style>
