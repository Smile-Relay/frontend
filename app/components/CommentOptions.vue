<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

interface Props {
  initialLike?: number
  initialHug?: number
  initialFlower?: number
}

const props = defineProps<Props>()
const { t } = useI18n()
const emit = defineEmits<{
  (e: 'action', type: 'like' | 'hug' | 'flower', newCount: number): void
}>()

const likeCount = ref(props.initialLike || 0)
const hugCount = ref(props.initialHug || 0)
const flowerCount = ref(props.initialFlower || 0)

// Watch props to update counts when parent changes
watch(() => props.initialLike, (val) => {
  if (val !== undefined) likeCount.value = val
})
watch(() => props.initialHug, (val) => {
  if (val !== undefined) hugCount.value = val
})
watch(() => props.initialFlower, (val) => {
  if (val !== undefined) flowerCount.value = val
})

function handleAction(action: 'like' | 'hug' | 'flower') {
  let newCount = 0
  switch(action) {
    case 'like':
      likeCount.value++
      newCount = likeCount.value
      break
    case 'hug':
      hugCount.value++
      newCount = hugCount.value
      break
    case 'flower':
      flowerCount.value++
      newCount = flowerCount.value
      break
  }
  emit('action', action, newCount)
}
</script>

<template>
  <UCard class="w-[700px]">
    <div class="flex justify-between">
      <UButton
          class="text-4xl bg-pink-400 hover:bg-pink-300 active:bg-pink-300 flex flex-col items-center"
          @click="handleAction('like')"
      >
        {{ t('comment.like') }}
        <span class="mt-1">{{ likeCount }}</span>
      </UButton>
      <UButton
          class="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-300 text-4xl flex flex-col items-center"
          @click="handleAction('hug')"
      >
        {{ t('comment.hug') }}
        <span class="mt-1">{{ hugCount }}</span>
      </UButton>
      <UButton
          class="bg-red-400 hover:bg-red-300 active:bg-red-300 text-4xl flex flex-col items-center"
          @click="handleAction('flower')"
      >
        {{ t('comment.flower') }}
        <span class="mt-1">{{ flowerCount }}</span>
      </UButton>
    </div>
  </UCard>
</template>

<style scoped>
</style>
