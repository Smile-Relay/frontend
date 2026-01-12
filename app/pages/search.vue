<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVocabularies } from "~/composables/useVocabularies";
import { useRouter } from "vue-router";
import { useBackHome } from "~/composables/useBackHome";

const vocabularies = await useVocabularies()
const adjectives = vocabularies.adjectives
const nouns = vocabularies.nouns
const router = useRouter()
const { refresh_timer } = useBackHome(router, 60000)

const selectedAdjectiveIndex = ref<number | null>(null)
const selectedNounIndex = ref<number | null>(null)

const canNext = computed(() => selectedAdjectiveIndex.value !== null && selectedNounIndex.value !== null)

const nextStep = async () => {
  if (!canNext.value) return
  if (!selectedAdjectiveIndex.value) return;
  if (!selectedNounIndex.value) return;
  const id = selectedAdjectiveIndex.value.toString(16).toUpperCase() + selectedNounIndex.value.toString(16).toUpperCase()
  console.log(id)
  await router.push(`/view?id=${id}`)
}
</script>

<template>
  <div class="flex h-screen w-screen pb-28">
    <div class="w-1/2 p-2 grid grid-cols-2 gap-2">
      <h1 class="w-full">形容词</h1>
      <div />
      <div
          v-for="(adj, index) in adjectives"
          :key="index"
          :class="[
          'text-2xl border rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors duration-200 h-16',
          selectedAdjectiveIndex === index ? 'bg-blue-500 text-white font-semibold' : 'bg-gray-100 hover:bg-blue-200'
        ]"
          @click="selectedAdjectiveIndex = index;refresh_timer()"
      >
        {{ adj }}
      </div>
    </div>

    <div class="w-1/2 p-2 grid grid-cols-2 gap-2">
      <h1 class="w-full">名词</h1>
      <div/>
      <div
          v-for="(noun, index) in nouns"
          :key="index"
          :class="[
          'text-2xl border rounded-lg cursor-pointer flex items-center justify-center text-center transition-colors duration-200 h-16',
          selectedNounIndex === index ? 'bg-green-500 text-white font-semibold' : 'bg-gray-100 hover:bg-green-200'
        ]"
          @click="selectedNounIndex = index;refresh_timer()"
      >
        {{ noun }}
      </div>
    </div>
  </div>

  <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2">
    <button
        :class="[
        'px-6 py-2 rounded-lg font-medium transition-colors duration-200',
        'bg-blue-500 text-white cursor-pointer'
      ]"
        @click="router.push('/')"
    >
      返回
    </button>
    <button
        :class="[
        'px-6 py-2 rounded-lg font-medium transition-colors duration-200',
        canNext ? 'bg-purple-500 text-white hover:bg-purple-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
        :disabled="!canNext"
        @click="nextStep"
    >
      下一步
    </button>
  </div>
</template>

<style scoped>
</style>
