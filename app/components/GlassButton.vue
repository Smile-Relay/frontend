<template>
  <button
    class="rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 flex items-center justify-center tracking-wide"
    :class="[
      variant === 'secondary' ? 'bg-gradient-to-r from-[#F5F0FA] to-[#FAF5FC]' : 'bg-gradient-to-r from-[#EADCF8] to-[#F5EEFB]',
      size === 'large' ? 'w-[280px] h-[72px] border-4 border-white text-3xl' : 'px-12 py-3 border-2 border-white text-xl'
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  variant?: 'primary' | 'secondary',
  size?: 'normal' | 'large'
}>(), {
  variant: 'primary',
  size: 'normal'
})
</script>
