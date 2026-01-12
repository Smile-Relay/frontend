<script setup lang="ts">
import {computed, defineExpose} from "vue";

const props = defineProps<{
  passage: string,
  emotion: string,
  feeling: string,
  img_url: string | null
}>()

const passageRef = computed(() => props.passage)
const emotionRef = computed(() => props.emotion)
const feelingRef = computed(() => props.feeling)
const img_urlRef = computed(() => props.img_url)

defineExpose<{
  passage: typeof passageRef,
  emotion: typeof emotionRef,
  feeling: typeof feelingRef,
  img_url: typeof img_urlRef
}>({
  passage: passageRef,
  emotion: emotionRef,
  feeling: feelingRef,
  img_url: img_urlRef
})
</script>

<template>
  <div :class="props.img_url ? 'max-w-[700px]' : ''" class="mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <img alt="N/A" v-if="props.img_url" :src="props.img_url"
         class="w-[700px] h-[700px] mb-6 rounded-2xl"
    />
    <span
        class="px-4 py-2 rounded-lg border mr-6
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
    <p class="mt-6 text-xl leading-relaxed text-gray-700">
      {{ props.passage }}
    </p>
  </div>
</template>

<style scoped>

</style>