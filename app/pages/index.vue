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
  <div>
    <UButton
        :to="switchLocalePath(targetLocale)"
        icon="i-heroicons-language"
        color="info"
        class="absolute bottom-1.5 right-1 z-99999999999999 text-4xl"
    >
      {{ buttonLabel }}
    </UButton>
    <UButton
        class="z-99999999999999 text-4xl active:bg-blue-100 hover:bg-blue-100 bg-blue-200 text-cyan-800 absolute bottom-1.5 left-1"
        @click="router.push('/search')"
    >
      {{ t('index.search') }}
    </UButton>
    <div class="flex justify-center w-screen h-screen" @click="goNext">
      <p class="text-7xl absolute left-20 top-60 rotate-330">❤️</p>
      <p class="text-8xl absolute right-10 top-60 rotate-30">😄</p>
      <p class="text-9xl absolute right-40 top-35 rotate-10">😯</p>
      <p class="text-8xl absolute left-55 top-35 rotate-350">😜</p>
      <Motion
          class="absolute"
          :animate="{ x: [-250, -200, -250], y: [500, 550, 500]}"
          :transition="{ duration: 1.5, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }"
      >
        <img class="rotate-45 top-125" alt="N/A" src="/point_right.png">
      </Motion>

      <h1 class="absolute font-bold text-7xl top-[300px] text-cyan-900">{{ t('index.title') }}</h1>
      <p class="absolute font-bold text-6xl top-[400px] text-cyan-800">{{ t('index.start') }}</p>
      <Motion
          class="absolute w-[200%] bottom-0"
          :animate="{ y: [100, 25, 100], x: [-40, 0, 40]}"
          :transition="{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-full" preserveAspectRatio="xMidYMid meet"><path d="m0,253l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l6,-4.57l6,-4.22l6,-3.77l6,-3.26l6,-2.69l6,-2.09l6,-1.47l6,-0.87l6,-0.28l6,0.29l6,0.81l6,1.28l6,1.71l6,2.07l6,2.38l6,2.64l6,2.83l6,2.99l6,3.09l6,3.13l6,3.13l6,3.09l6,2.99l6,2.83l6,2.64l6,2.38l6,2.07l6,1.71l6,1.28l6,0.81l6,0.29l6,-0.28l6,-0.87l6,-1.47l6,-2.09l6,-2.69l6,-3.26l6,-3.77l6,-4.22l6,-4.57l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l6,-4.57l6,-4.22l6,-3.77l6,-3.26l6,-2.69l6,-2.09l6,-1.47l6,-0.87l6,-0.28l6,0.29l6,0.81l6,1.28l6,1.71l6,2.07l6,2.38l6,2.64l6,2.83l6,2.99l6,3.09l6,3.13l6,3.13l6,3.09l6,2.99l6,2.83l6,2.64l6,2.38l6,2.07l6,1.71l6,1.28l6,0.81l6,0.29l6,-0.28l6,-0.87l6,-1.47l6,-2.09l6,-2.69l6,-3.26l6,-3.77l6,-4.22l6,-4.57l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l0,346l-1200,0l0,-346z" fill="#3B82F6" fill-opacity="0.8" filter="blur(0px)"/></svg>
      </Motion>
      <Motion
          class="absolute bottom-[75px]"
          :animate="{ y: [-200, -150, -200], x: [-20, 0, 20] }"
          :transition="{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }"
      >
        <img alt="📜" class="h-[200px] text-[200px]" src="/scroll.png">
      </Motion>
      <Motion
          class="absolute bottom-0"
          :animate="{ y: [-200, -150, -200], x: [-20, 0, 20] }"
          :transition="{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }"
      >
        <img alt="🫙" class="h-[400px] text-[400px]" src="/jar.png">
      </Motion>
      <Motion
          class="absolute w-[200%] bottom-0"
          :animate="{ y: [200, 250, 200], x: [20, 0, -20]}"
          :transition="{ duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-full" preserveAspectRatio="xMidYMid meet"><path d="m0,187l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l6,-5.25l6,-4.97l6,-4.58l6,-4.09l6,-3.53l6,-2.88l6,-2.2l6,-1.48l6,-0.75l6,-0.03l6,0.68l6,1.36l6,1.98l6,2.56l6,3.06l6,3.49l6,3.84l6,4.11l6,4.3l6,4.38l6,4.38l6,4.3l6,4.11l6,3.84l6,3.49l6,3.06l6,2.56l6,1.98l6,1.36l6,0.68l6,-0.03l6,-0.75l6,-1.48l6,-2.2l6,-2.88l6,-3.53l6,-4.09l6,-4.58l6,-4.97l6,-5.25l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l6,-5.25l6,-4.97l6,-4.58l6,-4.09l6,-3.53l6,-2.88l6,-2.2l6,-1.48l6,-0.75l6,-0.03l6,0.68l6,1.36l6,1.98l6,2.56l6,3.06l6,3.49l6,3.84l6,4.11l6,4.3l6,4.38l6,4.38l6,4.3l6,4.11l6,3.84l6,3.49l6,3.06l6,2.56l6,1.98l6,1.36l6,0.68l6,-0.03l6,-0.75l6,-1.48l6,-2.2l6,-2.88l6,-3.53l6,-4.09l6,-4.58l6,-4.97l6,-5.25l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l0,286l-1200,0l0,-286z" fill="#6366F1" fill-opacity="0.8" filter="blur(0px)"/></svg>
      </Motion>
    </div>
  </div>
</template>
<style>
</style>