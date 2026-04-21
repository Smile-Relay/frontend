<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  glow?: 'blue' | 'purple' | 'none'
  text?: string
}>()

const glowClass = computed(() => {
  if (props.glow === 'blue') return 'text-blue-glow'
  if (props.glow === 'purple') return 'text-purple-glow'
  return ''
})
</script>

<template>
  <div :class="['apple-font-base', glowClass]">
    <slot>{{ props.text }}</slot>
  </div>
</template>

<style scoped>
.apple-font-base {
    font-family: "PingFang SC Light", "Source Han Sans CN Light", "Microsoft YaHei Light", sans-serif;
    font-size: 46px;
    font-weight: 300;
    letter-spacing: 4px;
    line-height: 1.2;
    transition: all 0.4s ease;
}

.text-blue-glow {
    color: #3b5998; 
    text-shadow: 0 0 15px rgba(59, 89, 152, 0.25);
}

.text-purple-glow {
    color: #e6b2f0; 
    text-shadow: 0 0 10px rgba(230, 178, 240, 0.6), 0 0 25px rgba(255, 255, 255, 0.3);
}
</style>
