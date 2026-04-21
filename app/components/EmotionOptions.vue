<script setup lang="ts">
import type { Prediction } from "~/composables/prediction";
import {defineEmits, defineProps, computed} from "vue";

const props = defineProps<{
  prediction: Prediction
}>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()

function handleClick(key: string) {
  emit('select', key)
}

function getEmotionLabel(key: string) {
  return t(`emotions.${key}`)
}

const maxProb = computed(() => {
  const probs = Object.entries(props.prediction)
    .filter(([key]) => key !== 'Gender')
    .map(([, value]) => Number(value));
  return Math.max(...probs, 0.001);
})
</script>

<template>
  <div class="flex items-end justify-center gap-6 h-[350px] w-full mt-8">
    <template v-for="(value, key) in props.prediction" :key="key">
      <div v-if="key !== 'Gender'" 
           class="flex flex-col items-center justify-end w-20 rounded-2xl bg-gradient-to-t from-[#EADCF8] to-[#F5EEFB] border-[3px] border-white shadow-[0_4px_15px_rgba(200,180,240,0.5),inset_0_0_10px_rgba(255,255,255,1)] cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-[0_8px_20px_rgba(180,150,220,0.6),inset_0_0_10px_rgba(255,255,255,1)] relative group"
           :style="{ height: `${Math.max((Number(value) / maxProb) * 300, 80)}px` }"
           @click="handleClick(getEmotionLabel(key))">
        <span class="absolute top-4 w-full text-center text-[#4B6B8A] font-medium text-xl">{{ getEmotionLabel(key) }}</span>
      </div>
    </template>
  </div>
</template>
