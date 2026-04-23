<script setup lang="ts">
import {computed, defineExpose} from "vue";

const props = defineProps<{
  passage: string,
  emotion: string,
  feeling: string,
  imgUrl: string | null,
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
  <div class="w-[450px] bg-[#E1EDF8] rounded-xl flex flex-col items-center justify-center p-4">
    <h1 v-if="!preview" class="text-gray-900 text-5xl mb-6" ><strong>{{ props.phrase }}</strong></h1>
    <img
        v-if="props.imgUrl"
        alt="N/A"
        :src="props.imgUrl"
        :class="!preview ? 'w-[400px] h-[400px]' : 'w-[400px] h-[400px]'" class="mb-6 rounded-xl object-cover border border-[#C5D7E8]"
    >
    <div class="w-full flex items-center justify-start gap-4 px-2">
      <div class="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#F0E6FA] to-[#F5EEFB] border border-white rounded-lg shadow-sm text-xl text-[#2A4365]">
        {{ props.emotion }}
      </div>
      <div class="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#EADCF8] to-[#F2EBF9] border border-white rounded-lg shadow-sm text-xl text-[#2A4365]">
        {{ props.feeling }}
      </div>
    </div>
    <p class="mt-4 text-xl leading-relaxed text-gray-700 px-2 pb-4 text-left w-full break-words whitespace-pre-wrap">
      {{ props.passage }}
    </p>
  </div>
</template>

<style scoped>

</style>