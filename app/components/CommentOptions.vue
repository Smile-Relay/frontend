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

function formatLabel(label: string, count: number) {
  const chars = Array.from(label.trim())
  const lastChar = chars[chars.length - 1]
  
  // simple check: if the last character is an emoji (not ascii printable, not chinese, not space)
  if (lastChar == null) return null;
  if (/[^\x20-\x7E\u4e00-\u9fa5\s]/.test(lastChar)) {
    const textPart = chars.slice(0, -1).join('').trim()
    return `${textPart}X${count}${lastChar}`
  }
  
  return `${label.trim()}X${count}`
}
</script>

<template>
  <div class="flex justify-center gap-6">
    <button
        class="px-8 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#F5F0FA] to-[#FAF5FC] border-[3px] border-white flex items-center justify-center tracking-widest whitespace-nowrap"
        @click="handleAction('flower')"
    >
      {{ formatLabel(t('comment.flower'), flowerCount) }}
    </button>
    <button
        class="px-8 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#F5F0FA] to-[#FAF5FC] border-[3px] border-white flex items-center justify-center tracking-widest whitespace-nowrap"
        @click="handleAction('hug')"
    >
      {{ formatLabel(t('comment.hug'), hugCount) }}
    </button>
    <button
        class="px-8 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#F5F0FA] to-[#FAF5FC] border-[3px] border-white flex items-center justify-center tracking-widest whitespace-nowrap"
        @click="handleAction('like')"
    >
      {{ formatLabel(t('comment.like'), likeCount) }}
    </button>
  </div>
</template>

<style scoped>
</style>
