<script setup lang="ts">
import type { Prediction } from "~/composables/prediction";
import {defineEmits, defineProps} from "vue";

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
</script>

<template>
  <div class="mt-3 flex flex-col gap-3">
    <template v-for="(value, key) in props.prediction" :key="key">

      <UButton
          v-if="key !== 'Gender'"
          variant="outline"
          color="neutral"
          class="flex flex-col items-start gap-2 p-4 w-full text-2xl"
          @click="handleClick(getEmotionLabel(key))"
      >
        <div class="flex justify-between w-full">
          <span>{{ getEmotionLabel(key) }}</span>
          <span class="text-sm opacity-70">{{ (Number(value) * 100).toFixed(0) }}%</span>
        </div>
        <UProgress :model-value="Number(value)" :max="1" color="primary" />
      </UButton>

    </template>
  </div>
</template>
