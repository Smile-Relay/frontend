<script setup lang="ts">
import {computed, defineExpose} from "vue";

const props = defineProps<{
  passage: string,
  emotion: string,
  feeling: string
}>()

const passageRef = computed(() => props.passage)
const emotionRef = computed(() => props.emotion)
const feelingRef = computed(() => props.feeling)

defineExpose<{
  passage: typeof passageRef,
  emotion: typeof emotionRef,
  feeling: typeof feeling
}>({
  passage: passageRef,
  emotion: emotionRef,
  feeling: feelingRef
})
</script>

<template>
  <div class="max-w-3xl mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <span
        class="px-4 py-2 rounded-lg border mr-[24px]
             bg-white text-gray-700 border-gray-300"
    >
      {{ props.emotion }}
    </span>
    <span
        class="px-4 py-2 rounded-lg border
             bg-white text-gray-700 border-gray-300"
    >
      {{ props.feeling }}
    </span>
    <p class="mt-[24px] text-xl leading-relaxed text-gray-700">
      {{ props.passage }}
    </p>
  </div>
</template>

<style scoped>

</style>