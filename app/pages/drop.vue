<script setup lang="ts">
import { Motion } from "@oku-ui/motion";
import { useBackHome } from "~/composables/useBackHome";

const animate = ref({ y: [-500, -200], x: [-20]})
const transition = ref({ duration: 3, repeat: 1, repeatType: 'mirror', ease: 'backIn' })
const frontWaveAnimate = ref({ y: [900, 100], x: [-40]})
const backWaveAnimate = ref({ y: [900, 200], x: [20]})
const displayEnd = ref(false)

const router = useRouter()
const route = useRoute()
const { refresh_timer } = useBackHome(router, 60000)
const phrase = ref(route.query.phrase)
onMounted(() => {
  setTimeout(() => {
    frontWaveAnimate.value = { y: [100, 25, 100], x: [-40, 0, 40]}
    backWaveAnimate.value = { y: [200, 250, 200], x: [20, 0, -20]}
    animate.value = { y: [-200, -150, -200], x: [-20, 0, 20] }
    transition.value = { duration: 3, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }
    displayEnd.value = true
  }, 3000)
})
const handleLeaveSelection = async (selection: string)=>{
  refresh_timer()
  if (selection === "离开"){
    await router.push("/")
    return
  }
  await router.push("/view")
}
</script>

<template>
  <div>
    <Motion
        :animate="{ y: [0, -306] }"
        :transition="{ duration: 3, ease: 'easeInOut' }"
    >
      <img class="w-full" alt="N/A" src="/sky.jpeg">
    </Motion>
    <div class=" top-[350px] absolute z-999999999 flex justify-center w-screen">
      <div
          v-show="displayEnd"
          >
        <div
            class="mb-3 mt-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <p class="text-4xl">记住你的瓶子id: </p>
          <p class="w-full text-center text-8xl"><strong>{{phrase}}</strong></p>
        </div>
        <EmotionOptions class="text-4xl" :options="[ '看看别人的', '离开' ]" @select="handleLeaveSelection" />
      </div>
    </div>
    <div class="flex justify-center w-screen h-screen">
      <Motion
          class="absolute w-[200%] bottom-0"
          :animate="frontWaveAnimate"
          :transition="transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-full" preserveAspectRatio="xMidYMid meet"><path d="m0,253l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l6,-4.57l6,-4.22l6,-3.77l6,-3.26l6,-2.69l6,-2.09l6,-1.47l6,-0.87l6,-0.28l6,0.29l6,0.81l6,1.28l6,1.71l6,2.07l6,2.38l6,2.64l6,2.83l6,2.99l6,3.09l6,3.13l6,3.13l6,3.09l6,2.99l6,2.83l6,2.64l6,2.38l6,2.07l6,1.71l6,1.28l6,0.81l6,0.29l6,-0.28l6,-0.87l6,-1.47l6,-2.09l6,-2.69l6,-3.26l6,-3.77l6,-4.22l6,-4.57l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l6,-4.57l6,-4.22l6,-3.77l6,-3.26l6,-2.69l6,-2.09l6,-1.47l6,-0.87l6,-0.28l6,0.29l6,0.81l6,1.28l6,1.71l6,2.07l6,2.38l6,2.64l6,2.83l6,2.99l6,3.09l6,3.13l6,3.13l6,3.09l6,2.99l6,2.83l6,2.64l6,2.38l6,2.07l6,1.71l6,1.28l6,0.81l6,0.29l6,-0.28l6,-0.87l6,-1.47l6,-2.09l6,-2.69l6,-3.26l6,-3.77l6,-4.22l6,-4.57l6,-4.82l6,-4.93l6,-4.93l6,-4.77l6,-4.47l6,-4.02l6,-3.45l6,-2.73l6,-1.93l6,-1.02l6,-0.07l6,0.91l6,1.9l6,2.85l6,3.73l6,4.53l6,5.19l6,5.71l6,6.07l6,6.25l6,6.25l6,6.07l6,5.71l6,5.19l6,4.53l6,3.73l6,2.85l6,1.9l6,0.91l6,-0.07l6,-1.02l6,-1.93l6,-2.73l6,-3.45l6,-4.02l6,-4.47l6,-4.77l6,-4.93l6,-4.93l6,-4.82l0,346l-1200,0l0,-346z" fill="#3B82F6" fill-opacity="0.8" filter="blur(0px)"/></svg>
      </Motion>
      <Motion
          class="absolute bottom-[75px] x-[0]"
          :animate="animate"
          :transition="transition"
      >
        <img alt="📜" class="h-[200px] text-[200px]" src="/scroll.png">
      </Motion>
      <Motion
          class="absolute bottom-0 x-[0]"
          :animate="animate"
          :transition="transition"
      >
        <img alt="🫙" class="h-[400px] text-[400px]" src="/jar.png">
      </Motion>
      <Motion
          class="absolute w-[200%] bottom-0"
          :animate="backWaveAnimate"
          :transition="transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" class="w-full" preserveAspectRatio="xMidYMid meet"><path d="m0,187l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l6,-5.25l6,-4.97l6,-4.58l6,-4.09l6,-3.53l6,-2.88l6,-2.2l6,-1.48l6,-0.75l6,-0.03l6,0.68l6,1.36l6,1.98l6,2.56l6,3.06l6,3.49l6,3.84l6,4.11l6,4.3l6,4.38l6,4.38l6,4.3l6,4.11l6,3.84l6,3.49l6,3.06l6,2.56l6,1.98l6,1.36l6,0.68l6,-0.03l6,-0.75l6,-1.48l6,-2.2l6,-2.88l6,-3.53l6,-4.09l6,-4.58l6,-4.97l6,-5.25l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l6,-5.25l6,-4.97l6,-4.58l6,-4.09l6,-3.53l6,-2.88l6,-2.2l6,-1.48l6,-0.75l6,-0.03l6,0.68l6,1.36l6,1.98l6,2.56l6,3.06l6,3.49l6,3.84l6,4.11l6,4.3l6,4.38l6,4.38l6,4.3l6,4.11l6,3.84l6,3.49l6,3.06l6,2.56l6,1.98l6,1.36l6,0.68l6,-0.03l6,-0.75l6,-1.48l6,-2.2l6,-2.88l6,-3.53l6,-4.09l6,-4.58l6,-4.97l6,-5.25l6,-5.39l6,-5.41l6,-5.27l6,-5l6,-4.6l6,-4.04l6,-3.38l6,-2.6l6,-1.74l6,-0.81l6,0.15l6,1.14l6,2.1l6,3.02l6,3.87l6,4.62l6,5.26l6,5.74l6,6.09l6,6.25l6,6.25l6,6.09l6,5.74l6,5.26l6,4.62l6,3.87l6,3.02l6,2.1l6,1.14l6,0.15l6,-0.81l6,-1.74l6,-2.6l6,-3.38l6,-4.04l6,-4.6l6,-5l6,-5.27l6,-5.41l6,-5.39l0,286l-1200,0l0,-286z" fill="#6366F1" fill-opacity="0.8" filter="blur(0px)"/></svg>
      </Motion>
    </div>
  </div>
</template>


<style scoped>

</style>