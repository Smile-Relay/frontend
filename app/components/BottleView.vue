<script setup lang="ts">
import {computed, defineExpose} from "vue";

const props = defineProps<{
  passage: string,
  emotion: string,
  feeling: string,
  imgUrl: string,
  phrase: string | null
  preview: boolean
}>()

const passageRef = computed(() => props.passage)
const emotionRef = computed(() => props.emotion)
const feelingRef = computed(() => props.feeling)
const img_urlRef = computed(() => props.imgUrl)
const phraseRef = computed(() => props.phrase)
const previewRef = computed(() => props.preview)

defineExpose<{
  passage: typeof passageRef,
  emotion: typeof emotionRef,
  feeling: typeof feelingRef,
  img_url: typeof img_urlRef,
  phrase: typeof phraseRef,
  preview: typeof previewRef,
}>({
  passage: passageRef,
  emotion: emotionRef,
  feeling: feelingRef,
  img_url: img_urlRef,
  phrase: phraseRef,
  preview: previewRef
})
</script>

<template>
  <div :class="!preview ? 'max-w-[700px]' : ''" class="mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <h1 v-if="!preview" class="text-5xl mb-6" ><strong>{{ props.phrase }}</strong></h1>
    <img
        v-if="props.imgUrl"
        alt="N/A"
        :src="props.imgUrl"
        :class="!preview ? 'w-[700px] h-[700px] ' : ''" class="mb-6 rounded-2xl"
    >
    <span
        class="px-4 py-2 rounded-lg border mr-6 text-xl
             bg-white text-gray-700 border-gray-300"
    >
      {{ props.emotion }}
    </span>
    <span
        class="px-4 py-2 rounded-lg border text-xl
             bg-white text-gray-700 border-gray-300"
    >
      {{ props.feeling }}
    </span>
    <p class="mt-6 text-2xl leading-relaxed text-gray-700">
      {{ props.passage }}
    </p>
  </div>
</template>

<style scoped>

</style>