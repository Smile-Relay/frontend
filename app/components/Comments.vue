<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

interface Props {
  initialLike?: number
  initialHug?: number
  initialFlower?: number
}

const props = defineProps<Props>()
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
  <div class="w-[400px] mx-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="buttons flex justify-around">
      <button class="btn-like px-4 py-2 bg-pink-400 text-white rounded flex flex-col items-center"
              @click="handleAction('like')">
        喜欢 💖
        <span class="text-sm mt-1">{{ likeCount }}</span>
      </button>
      <button class="btn-hug px-4 py-2 bg-yellow-400 text-white rounded flex flex-col items-center"
              @click="handleAction('hug')">
        拥抱 🤗
        <span class="text-sm mt-1">{{ hugCount }}</span>
      </button>
      <button class="btn-flower px-4 py-2 bg-red-400 text-white rounded flex flex-col items-center"
              @click="handleAction('flower')">
        送花 🌹
        <span class="text-sm mt-1">{{ flowerCount }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
