<script setup lang="ts">
import { ref, computed } from 'vue'
import { vocabularies } from "~/composables/useVocabularies";
import { useRouter } from "vue-router";
import { useBackHome } from "~/composables/useBackHome";

useHead({
      bodyAttrs: {
        class: 'bg-sky'
      }
    }
)

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
  <div>
    <div class="flex h-screen w-screen pb-28">
      <div class="w-1/2 p-2 grid grid-cols-2 gap-2">
        <h1 class="text-4xl w-full">形容词</h1>
        <div />
        <UButton
            v-for="(adj, index) in adjectives"
            :key="index"
            color="neutral" variant="outline"
            :class="[
            'text-2xl flex items-center justify-center text-center',
            selectedAdjectiveIndex === index ? 'bg-blue-300 font-semibold' : ''
          ]"
            @click="selectedAdjectiveIndex = index;refresh_timer()"
        >
          {{ adj }}
        </UButton>
      </div>

      <div class="w-1/2 p-2 grid grid-cols-2 gap-2">
        <h1 class="text-4xl w-full">名词</h1>
        <div/>
        <UButton
            v-for="(noun, index) in nouns"
            :key="index"
            color="neutral" variant="outline"
            :class="[
            'text-2xl flex items-center justify-center text-center',
            selectedNounIndex === index ? 'bg-green-300 font-semibold' : ''
          ]"
            @click="selectedNounIndex = index;refresh_timer()"
        >
          {{ noun }}
        </UButton>
      </div>
    </div>
    <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2">
      <UButton
          color="neutral"
          class="text-2xl"
          variant="outline"
          @click="router.push('/')"
      >
        返回
      </UButton>
      <UButton
          color="info"
          class="text-2xl ml-3"
          :disabled="!canNext"
          @click="nextStep"
      >
        下一步
      </UButton>
    </div>
  </div>
</template>

<style scoped>
</style>
