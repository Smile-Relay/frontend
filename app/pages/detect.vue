<script setup lang="ts">
import { Motion, MotionPresence } from "@oku-ui/motion";
import {computed, onMounted, onUnmounted, ref} from 'vue'
import { useRouter } from "#vue-router";
import { useLLM, Message } from '~/composables/useLLM'
import { useBackHome } from "~/composables/useBackHome";
import { useT2I } from "~/composables/useT2I";
import { useGenderImage } from "~/composables/useGenderImage";
import OptionsList from "~/components/OptionsList.vue";
import type { Prediction } from "~/composables/prediction";
import type { StepperItem } from "@nuxt/ui/components/Stepper.vue";

const { t, tm, rt, locale } = useI18n()
const items = computed<StepperItem[]>(() => [
  {
    title: t('detect.steps.face'),
    icon: 'ic:baseline-camera-enhance'
  },
  {
    title: t('detect.steps.chooseEmotion'),
    icon: 'ic:baseline-done-all'
  },
  {
    title: t('detect.steps.generateFeeling'),
    icon: 'ic:outline-add-reaction'
  },
  {
    title: t('detect.steps.chooseThought'),
    icon: 'ic:baseline-done-all'
  },
  {
    title: t('detect.steps.imageGen'),
    icon: 'ic:baseline-image'
  },
  {
    title: t('detect.steps.throwBottle'),
    icon: 'ic:baseline-water'
  }
])

const tipText = ref<null|HTMLParagraphElement>(null);
const stepper = useTemplateRef('stepper')
const text = ref<string>("")
const isActive = ref(true);
const repeat = ref(Infinity)
const stepIndex = ref(0)
const displayOptions = ref(false)
const displayThinking = ref(false)
const displayText = ref(false)
const displayFeelings = ref(false)
const displayThrow = ref(false)
const displayPrinting = ref(false)
const displayResult = ref(false)
const bottleId = ref("")
const bottlePhrase = ref("")
const feelingOptions = computed<string[]>(() => {
  const list = tm("detect.feelingOptions") as unknown[];
  return Array.isArray(list)
      ? list.map((item) => rt(item as any))
      : [];
});

const prediction = ref<Prediction>({
  Angry: 0,
  Disgust: 0,
  Fear: 0,
  Happy: 0,
  Neutral: 0,
  Sad: 0,
  Surprise: 0
});
const llm = useLLM()
const t2i = useT2I()
const img_url = ref<null|string>(null)
const gender = ref(0);
const emotion = ref("")
const feeling = ref("")
const router = useRouter();
const toPhrase = usePhrase();

const detect = async ()=>{
  if (!isActive.value) return;
  if (!tipText.value) return;
  if (!stepper.value) return;
  const request = await fetch("http://localhost:5001/detect")
  const text = await request.text()
  if (request.status != 200) {
    tipText.value.textContent = t('detect.tip.areYouThere');
    await detect()
    return
  }
  refresh_timer()
  tipText.value.textContent = t('detect.tip.great');
  stepper.value.next()
  const probabilities = JSON.parse(text) as Prediction;
  console.log(probabilities)
  prediction.value = probabilities
  isActive.value = false
  repeat.value = 0;
  stepIndex.value = 1;
  setTimeout(()=>{
    displayOptions.value = true
  }, 1500)
}

const handleSelection = async (selection: string) => {
  console.log(selection)
  emotion.value = selection
  displayOptions.value = false
  if (!tipText.value) return;
  if (!prediction.value) return;
  if (!stepper.value) return;
  stepper.value.next()
  refresh_timer()
  tipText.value.textContent = t('detect.tip.thinking');
  displayThinking.value = true
  gender.value = prediction.value.Gender || 0;
  delete prediction.value.Gender;
  const response = await llm.completions(
      [ new Message("user", t('detect.llmPrompt', { prediction: JSON.stringify(prediction.value), selection })) ],
      true
  )
  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) return
  if (!tipText.value)return;
  tipText.value.textContent = t('detect.tip.thisIsYourFeeling');
  displayThinking.value = false
  
  await new Promise(resolve => setTimeout(resolve, 1500))
  displayText.value = true;

  while (true) {
    const { value, done } = await reader.read()
    if (done) break
    refresh_timer()
    const chunk = decoder.decode(value)
    chunk.split('\n').forEach(line => {
      if (!line.startsWith('data: ')) return
      const jsonStr = line.replace(/^data: /, '').trim()
      if (jsonStr === '[DONE]') return
      try {
        const data = JSON.parse(jsonStr)
        const content = data.choices?.[0]?.delta?.content
        if (content) text.value += content
        console.log(content)
      } catch {
        router.push("/")
      }
    })
  }
  
  await new Promise(resolve => setTimeout(resolve, 3000))
  
  stepper.value.next()
  stepIndex.value = 2;
  displayFeelings.value = true;
}

const handleFeelingSelection = async (selection: string)=>{
  if (!tipText.value) return;
  if (!stepper.value) return;
  stepper.value.next()
  refresh_timer()
  displayText.value = false
  displayFeelings.value = false
  console.log(selection)
  feeling.value = selection
  isActive.value = true
  repeat.value = Infinity;
  stepIndex.value = 3;
  tipText.value.textContent = t('detect.tip.imageGenerating')
  try {
    img_url.value = await t2i.generate(
      t('detect.t2iPrompt', { text: text.value, feeling: feeling.value }),
      useGenderImage(gender.value) || ""
    )

  }
  catch (error) {
    console.error(error)
    await router.push("/")
  }
  refresh_timer()
  stepper.value.next()
  isActive.value = false
  repeat.value = 0;
  tipText.value.textContent = t('detect.tip.thisIsYourBottle')
  setTimeout(() => {
    displayThrow.value = true
  }, 1500)
}

const handleThrowSelection = async (selection: string)=>{
  refresh_timer()
  if (!stepper.value) return;
  stepper.value.next()
  if (selection === t('detect.throw.options.notThrow')){
    await router.push("/")
    return
  }
  const get_vocabulary = await fetch("http://localhost:5001/random_vocabulary")
  const vocabulary = await get_vocabulary.json()
  console.log(vocabulary)
  bottleId.value = vocabulary.id
  bottlePhrase.value = toPhrase(vocabulary.id)

  const response = await fetch("http://localhost:5001/throw", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emotion: emotion.value,
      feeling: feeling.value,
      passage: text.value,
      img_url: img_url.value,
      id: vocabulary.id,
      lang: locale.value,
    })
  })
  await response.text()
  displayThrow.value = false
  displayPrinting.value = true
  stepIndex.value = 6 // Printing step

  // Poll for print status
  const pollPrintStatus = async () => {
    refresh_timer()
    try {
      const res = await fetch(`http://localhost:5001/print_status?id=${bottleId.value}`)
      const status = await res.json()
      if (status.status === "done") {
         displayPrinting.value = false
         stepIndex.value = 7 // Move past print step (or keep at 6 if we want to show it's done)
         displayResult.value = true
      } else {
         setTimeout(pollPrintStatus, 1000)
      }
    } catch (e) {
      console.error(e)
      setTimeout(pollPrintStatus, 1000)
    }
  }
  
  setTimeout(pollPrintStatus, 1000)
}

const { refresh_timer } = useBackHome(router, 60000);

onMounted(()=>{
  setTimeout(detect, 500)
})

onUnmounted(() => {
  isActive.value = false;
})

</script>

<template>
  <div class="fixed inset-0 w-full h-full bg-cover bg-center flex font-sans" style="background-image: url('/bg-new.svg')">
    <UStepper ref="stepper" class="hidden" size="xl" color="info" :items="items" />
    
    <!-- Sidebar -->
    <div class="w-[22%] lg:w-[20%] flex flex-col pt-12 items-center relative z-10 shrink-0">
      <h1 class="text-2xl lg:text-3xl text-[#4B6B8A] mb-12 tracking-widest font-medium">{{ t('index.title') }}</h1>
      <div class="flex flex-col w-full relative">
        <!-- active indicator background -->
        <div class="absolute left-0 w-[92%] h-14 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-500 ease-in-out z-0"
             :style="{ top: `${stepIndex * 4 + 0.25}rem` }">
        </div>
        
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 0 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.face') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 1 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.chooseEmotion') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 2 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.lifeState') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 3 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.imageGen') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 4 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.phraseGen') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 5 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.throwBottle') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 leading-tight" :class="stepIndex === 6 ? 'text-[#2A4365] font-bold text-lg lg:text-xl' : 'text-[#4B6B8A] opacity-80'">{{ t('detect.steps.print') }}</div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="grow h-full relative p-4 pl-0">
      <div class="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center relative shadow-2xl">
        <!-- Wavy Bottom -->
        <div class="absolute bottom-0 left-0 w-full h-[180px] pointer-events-none z-0 overflow-hidden">
          <Motion
            class="absolute bottom-0 left-0 w-[200%] h-full flex"
            :animate="{ x: ['0%', '-50%'] }"
            :transition="{ duration: 20, repeat: Infinity, ease: 'linear' }"
          >
            <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
              <path fill="url(#bg-gradient)" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
              <defs>
                <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stop-color="#E8D1F8" />
                  <stop offset="100%" stop-color="#D6BFF2" />
                </linearGradient>
              </defs>
            </svg>
            <svg viewBox="0 0 1440 320" class="w-1/2 h-full" preserveAspectRatio="none">
              <path fill="url(#bg-gradient)" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 V320 H0 Z" />
            </svg>
          </Motion>
        </div>

        <p ref="tipText" class="absolute top-20 w-full text-center text-4xl text-[#E8C2E8] tracking-widest z-20 font-light" v-show="stepIndex === 0">{{ t('detect.tip.lookAtMe') }}</p>

        <!-- Exit Button -->
        <button v-if="!displayThrow && !displayResult" @click="router.push('/')" class="absolute top-8 right-8 text-[#4B6B8A] hover:text-[#2A4365] transition-colors z-20 font-medium text-lg">
           {{ t('detect.exit') || '退出' }}
        </button>

        <!-- Container for steps -->
        <div class="w-full max-w-4xl px-8 flex flex-col items-center justify-center z-10 relative h-[70%]">
          
          <!-- Step 1: Face Detection (Orb) -->
          <MotionPresence>
            <Motion
              v-show="isActive"
              class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
              :exit="{ opacity: 0, scale: 0 }"
            >
               <Motion class="w-80 h-80 bg-linear-to-tr from-[#E6C9FB] to-[#F1E5FD] rounded-full blur-[2px] opacity-90 shadow-[inset_0_0_20px_rgba(255,255,255,1)]"
                 :animate="{ scale: [1, 1.2, 1], boxShadow: ['none', '0 0 80px 60px rgba(230,200,255,0.6)', 'none'] }"
                 :transition="{ duration: 2, ease: 'easeInOut', repeat: repeat, repeatDelay: 1 }" />
            </Motion>
          </MotionPresence>

          <!-- Step 2: Choose Emotion -->
          <MotionPresence>
             <Motion
                v-show="displayOptions"
                class="absolute inset-0 flex flex-col items-center justify-center w-full"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <p class="text-3xl text-[#2A4365] mb-16">{{ t('detect.questions.chooseEmotion') }}</p>
                <div class="w-full">
                  <EmotionOptions :prediction="prediction" @select="handleSelection" />
                </div>
             </Motion>
          </MotionPresence>

          <!-- Step 1.5: Thinking Animation -->
          <MotionPresence>
             <Motion
                v-show="displayThinking"
                class="absolute inset-0 flex flex-col items-center justify-center w-full gap-6"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <div class="flex gap-3">
                   <div class="w-4 h-4 bg-[#D2B4F5] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                   <div class="w-4 h-4 bg-[#B4C6F5] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                   <div class="w-4 h-4 bg-[#F5B4E2] rounded-full animate-bounce"></div>
                </div>
                <p class="text-2xl text-[#4B6B8A] font-medium tracking-widest animate-pulse">AI 正在感悟你的情绪...</p>
             </Motion>
          </MotionPresence>

          <!-- Feeling generation -->
          <MotionPresence>
             <Motion
                v-show="displayText && !displayFeelings"
                class="absolute inset-0 flex flex-col items-center justify-center w-full"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <p class="text-3xl text-[#2A4365] mb-12">你的心情是......</p>
                <div class="text-3xl text-[#2A4365] w-full text-center leading-relaxed max-w-3xl px-8 border-b-2 border-[#2A4365] pb-4">
                  {{ text }}
                </div>
             </Motion>
          </MotionPresence>

          <!-- Choose Thought -->
          <MotionPresence>
             <Motion
                v-if="displayFeelings"
                class="absolute inset-0 flex flex-col items-center justify-center w-full"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <p class="text-3xl text-[#2A4365] mb-16">{{ t('detect.questions.chooseFeeling') || '选择你的状态' }}</p>
                <div class="w-full">
                   <OptionsList :options="feelingOptions" @select="handleFeelingSelection" />
                </div>
             </Motion>
          </MotionPresence>

          <!-- Step 3: Bottle View / Throw -->
          <MotionPresence>
             <Motion
                v-show="displayThrow"
                class="absolute inset-0 flex flex-row items-center justify-center w-full gap-6 sm:gap-12"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <!-- Not Throw Button (Left) -->
                <button class="px-8 sm:px-10 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#F5F0FA] to-[#FAF5FC] border-2 border-white z-10 whitespace-nowrap" @click="handleThrowSelection(t('detect.throw.options.notThrow'))">
                   {{ t('detect.throw.options.notThrow') }}
                </button>

                <!-- Bottle View Container -->
                <div class="shrink-0 relative flex items-center justify-center">
                  <div class="scale-[0.8] sm:scale-[0.95] origin-center bg-white p-4 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] pointer-events-none">
                    <BottleView :phrase="null" :preview="true" :img-url="img_url" :passage="text" :emotion="emotion" :feeling="feeling" />
                  </div>
                </div>
                
                <!-- Throw Button (Right) -->
                <button class="px-8 sm:px-10 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-2 border-white z-10 whitespace-nowrap" @click="handleThrowSelection(t('detect.throw.options.throw'))">
                   {{ t('detect.throw.options.throw') }}
                </button>
             </Motion>
          </MotionPresence>

          <!-- Step 3.5: Printing -->
          <MotionPresence>
             <Motion
                v-show="displayPrinting"
                class="absolute inset-0 flex flex-col items-center justify-center w-full gap-8"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <!-- Printer icon or loading animation -->
                <div class="relative w-32 h-32 flex items-center justify-center">
                   <div class="absolute inset-0 border-4 border-[#2A4365] border-t-transparent rounded-full animate-spin opacity-20"></div>
                   <div class="absolute inset-2 border-4 border-[#2A4365] border-b-transparent rounded-full animate-spin-slow opacity-40"></div>
                   <svg class="w-12 h-12 text-[#2A4365] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
                   </svg>
                </div>
                
                <p class="text-3xl text-[#2A4365] font-medium tracking-widest animate-pulse">{{ t('detect.steps.print') }}...</p>
                <p class="text-[#4B6B8A] text-lg mt-2 opacity-80">{{ t('detect.steps.printTip') }}</p>
             </Motion>
          </MotionPresence>

          <!-- Step 4: Result -->
          <MotionPresence>
             <Motion
                v-show="displayResult"
                class="absolute inset-0 flex flex-col items-center justify-center w-full"
                :animate="{ opacity: 1 }" :initial="{ opacity: 0 }" :exit="{ opacity: 0 }"
             >
                <p class="text-4xl text-[#2A4365] mb-12 font-medium">瓶子ID:</p>
                <div class="bg-[#F8F4FD] rounded-2xl px-16 py-8 shadow-[inset_0_0_20px_rgba(230,200,255,0.6)] mb-16 relative w-3/4 max-w-lg border border-white">
                   <div class="absolute -left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-3/4 bg-[#D2B4F5] rounded-l-lg shadow-[inset_2px_0_5px_rgba(0,0,0,0.1)]"></div>
                   <div class="text-center text-4xl text-[#2A4365] tracking-[0.2em] font-medium">{{ bottlePhrase }}</div>
                </div>
                
                <div class="flex gap-16 mt-8 z-10">
                   <button class="px-12 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#F5F0FA] to-[#FAF5FC] border-[3px] border-white" @click="router.push('/explore')">
                      {{ t('drop.options.viewOthers') }}
                   </button>
                   <button class="px-12 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 hover:shadow-[0_8px_20px_rgba(180,150,220,0.5),inset_0_0_10px_rgba(255,255,255,1)] transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-[3px] border-white" @click="router.push('/')">
                      {{ t('drop.options.leave') }}
                   </button>
                </div>
             </Motion>
          </MotionPresence>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
