<script setup lang="ts">
import {computed, defineExpose} from "vue";

const props = defineProps<{
  passage: string
}>()

const passageRef = computed(() => props.passage)

defineExpose<{
  passage: typeof passageRef
}>({
  passage: passageRef
})
</script>

<template>
  <div class="max-w-3xl mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <span
        class="px-4 py-2 rounded-lg border
             bg-white text-gray-700 border-gray-300"
    >
      aaa
    </span>
    <span
        class="px-4 py-2 rounded-lg border
             bg-white text-gray-700 border-gray-300"
    >
      aaa
    </span>
    <p class="text-xl leading-relaxed text-gray-700">
      {{ props.passage }}
    </p>
  </div>
</template>

<style scoped>

</style>