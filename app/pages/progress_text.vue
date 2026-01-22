<script setup lang="ts">
const prediction = {
  Angry: 0.1,
  Disgust: 0.0,
  Fear: 0.2,
  Happy: 0.4,
  Neutral: 0.2,
  Sad: 0.05,
  Surprise: 0.05,
  Gender: 1
}

const handleSelect = (emotion: string) => {
  console.log('Selected emotion:', emotion)
}
</script>

<template>
  <div class="p-10 max-w-md">
    <EmotionOptions
        :prediction="prediction"
        @select="handleSelect"
    />
  </div>
</template>