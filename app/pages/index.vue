<script setup lang="ts">
import { Motion } from "@oku-ui/motion";
import { useRouter } from "vue-router";
const { locale, t } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const targetLocale = computed(() => locale.value === 'zh' ? 'en' : 'zh')
const buttonLabel = computed(() => locale.value === 'zh' ? 'EN' : '中')

useHead({
  bodyAttrs: {
      class: 'bg-sky'
    }
  }
)

const router = useRouter();

const goNext = async () => {
  await router.push("/detect")
};
</script>

<template>
  <div class="fixed inset-0 w-full h-full flex flex-col items-center justify-center font-sans overflow-hidden bg-linear-to-b from-[#A2DFF7] to-[#F5E1FD] cursor-pointer" @click="goNext">
    
    <!-- Wavy Bottom Animation -->
    <div class="absolute bottom-0 left-0 w-full h-[300px] pointer-events-none z-10 overflow-hidden">
      <!-- Back Wave -->
      <Motion
        class="absolute bottom-0 left-0 w-[200%] h-full opacity-60 flex"
        :animate="{ x: ['-50%', '0%'] }"
        :transition="{ duration: 25, repeat: Infinity, ease: 'linear' }"
      >
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#C5DDF9" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#C5DDF9" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
      </Motion>

      <!-- Middle Wave -->
      <Motion
        class="absolute bottom-0 left-0 w-[200%] h-[85%] flex"
        :animate="{ x: ['0%', '-50%'] }"
        :transition="{ duration: 18, repeat: Infinity, ease: 'linear' }"
      >
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#B2E4FC" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#B2E4FC" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
      </Motion>

      <!-- Front Wave -->
      <Motion
        class="absolute bottom-0 left-0 w-[200%] h-[70%] flex"
        :animate="{ x: ['0%', '-50%'] }"
        :transition="{ duration: 12, repeat: Infinity, ease: 'linear' }"
      >
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#84DFFF" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
        <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
          <path fill="#84DFFF" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
        </svg>
      </Motion>
    </div>



    <!-- Floating Bottle (Left) -->
    <Motion
      class="absolute left-[10%] bottom-[5%] z-0 pointer-events-none"
      :animate="{ 
        y: [0, -30, 0],
        rotate: [15, 25, 15]
      }"
      :transition="{ 
        duration: 4, 
        repeat: Infinity, 
        ease: 'easeInOut' 
      }"
    >
      <img src="/jar.png" class="w-16 sm:w-24 h-auto opacity-90 drop-shadow-2xl" alt="Bottle" >
    </Motion>

    <!-- Language Switch (Top Right) -->
    <div class="absolute top-8 right-8 z-30" @click.stop>
      <NuxtLink
          :to="switchLocalePath(targetLocale)"
          class="block px-6 py-2 rounded-full border-2 border-white/50 bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-all"
      >
        {{ buttonLabel }}
      </NuxtLink>
    </div>

    <!-- Center Content -->
    <div class="flex flex-col items-center gap-8 z-30 mb-12">
      
      <!-- Title -->
      <h1 class="text-white text-6xl md:text-7xl font-bold tracking-[0.15em] drop-shadow-lg text-center mb-8">
        {{ t('index.title') }}
      </h1>

      <!-- Text Prompt instead of Start Button -->
      <p class="text-white text-3xl md:text-4xl font-medium tracking-[0.2em] drop-shadow-md animate-pulse mb-8">
        {{ t('index.start') }}
      </p>

      <button 
        class="w-[320px] py-5 rounded-full border-[3px] border-white/80 bg-white/10 backdrop-blur-md text-white text-3xl font-medium tracking-[0.2em] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-white/20 hover:scale-105 transition-all duration-300"
        @click.stop="router.push('/search')"
      >
        {{ t('index.search') }}
      </button>
    </div>

  </div>
</template>

<style scoped>
</style>