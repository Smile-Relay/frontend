<script setup lang="ts">
import { usePhrase } from "~/composables/usePhrase";
import { useBackHome } from "~/composables/useBackHome";

const router = useRouter()
const id = ref<string | null>(null)
const passage = ref("")
const emotion = ref("")
const feeling = ref("")
const img_url = ref("")
const phrase = ref("")
const flowers = ref(0)
const likes = ref(0)
const hugs = ref(0)
const { refresh_timer } = useBackHome(router, 60000)
const { t } = useI18n()
const toPhrase = usePhrase()
const isAnimatingOut = ref(false)

const get_new = async ()=>{
  isAnimatingOut.value = true
  setTimeout(async () => {
    refresh_timer()
    const random_id = await fetch("http://localhost:5001/random_id")
    if (random_id.status !== 200){
      id.value = null
      isAnimatingOut.value = false
      return;
    }
    id.value = await random_id.text()
    const bottle_response = await fetch(`http://localhost:5001/get_bottle/${id.value}`)
    const bottle = await bottle_response.json()
    phrase.value = toPhrase(bottle.id)
    passage.value = bottle.passage
    emotion.value = bottle.emotion
    feeling.value = bottle.feeling
    img_url.value = bottle.img_url
    flowers.value = bottle.flowers
    likes.value = bottle.likes
    hugs.value = bottle.hugs
    isAnimatingOut.value = false
  }, 500) // matches exit animation duration
}

onMounted( async ()=>{
  await get_new()
  done()
})

const done = () => {
  const el = document.getElementById('render-complete')
  if (el) el.setAttribute('data-ready', 'true')
}

const handleAction = async (action: string) => {
  refresh_timer()
  await fetch(`http://localhost:5001/comment/${id.value}?type=${action}`)
}
</script>

<template>
  <div class="fixed inset-0 w-full h-full bg-cover bg-center flex font-sans" style="background-image: url('/bg-new.svg')">
    <!-- Sidebar -->
    <div class="w-[22%] lg:w-[20%] flex flex-col pt-12 items-center relative z-10 shrink-0">
      <h1 class="text-2xl lg:text-3xl text-[#4B6B8A] mb-12 tracking-widest font-medium">{{ t('index.title') }}</h1>
      <div class="flex flex-col w-full relative">
        <!-- active indicator background -->
        <div class="absolute left-0 w-[92%] h-14 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,1)] transition-all duration-500 ease-in-out z-0 top-[20.25rem]"/>
        
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 text-[#4B6B8A] opacity-80 leading-tight">{{ t('detect.steps.face') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 text-[#4B6B8A] opacity-80 leading-tight">{{ t('detect.steps.chooseEmotion') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 text-[#4B6B8A] opacity-80 leading-tight">{{ t('detect.steps.lifeState') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 text-[#4B6B8A] opacity-80 leading-tight">{{ t('detect.steps.imageGen') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-base lg:text-lg transition-all duration-300 relative z-10 text-[#4B6B8A] opacity-80 leading-tight">{{ t('detect.steps.phraseGen') }}</div>
        <div class="h-16 flex items-center pl-6 lg:pl-[20%] pr-2 text-lg lg:text-xl transition-all duration-300 relative z-10 text-[#2A4365] font-bold leading-tight">{{ t('detect.steps.viewOthers') }}</div>
      </div>
    </div>

    <div class="grow h-full relative p-4 pl-0">
      <div class="w-full h-full bg-white rounded-3xl overflow-hidden flex flex-col items-center justify-center relative shadow-2xl">
        <!-- Wavy Bottom -->
        <div class="absolute bottom-0 left-0 w-full h-45 pointer-events-none z-0 overflow-hidden">
          <div class="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave">
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
          </div>
        </div>

        <!-- Exit Button -->
        <button class="absolute top-8 right-8 px-10 py-2 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-[3px] border-white z-20" @click="router.push('/')">
           {{ t('drop.options.leave') }}
        </button>

        <!-- Main Content -->
        <div class="z-10 flex flex-col items-center w-full max-w-4xl relative h-[85%] justify-center">
          
          <div v-if="!id && !isAnimatingOut" class="text-center absolute inset-0 flex flex-col items-center justify-center">
            <p class="text-4xl text-[#2A4365] mb-8">{{ t('view.empty') }}</p>
            <button class="px-12 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-2 border-white" @click="router.push('/')">
              {{ t('view.throwOne') }}
            </button>
          </div>

          <div v-else class="flex flex-col items-center justify-center w-full transition-all duration-500 h-full" :class="isAnimatingOut ? 'opacity-0 scale-95 translate-y-10' : 'opacity-100 scale-100 translate-y-0'">
            
            <p class="text-4xl text-[#2A4365] font-medium tracking-widest mb-6">{{ phrase }}</p>

            <div class="flex flex-row items-center justify-center w-full gap-6 sm:gap-16">
              
              <!-- Left Arrow -->
              <button class="hover:scale-110 transition-transform focus:outline-none" @click="get_new">
                 <svg width="45" height="70" viewBox="0 0 45 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M45 0 L0 35 L45 70 V0Z" fill="url(#arrow-grad)" stroke="white" stroke-width="5" stroke-linejoin="round"/>
                    <defs>
                      <linearGradient id="arrow-grad" x1="0" y1="0" x2="45" y2="70" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#E8D1F8"  offset="0"/>
                        <stop offset="1" stop-color="#F5EEFB" />
                      </linearGradient>
                    </defs>
                 </svg>
              </button>

              <!-- Bottle Card Container -->
              <div class="relative w-75 h-112.5 flex items-center justify-center shrink-0">
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-[0.7] origin-center bg-white p-2 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.05)] pointer-events-none">
                  <BottleView
                      id="bottle"
                      :phrase="null"
                      :preview="false"
                      :feeling="feeling"
                      :img-url="img_url"
                      :passage="passage"
                      :emotion="emotion"
                  />
                </div>
              </div>

              <!-- Right Arrow -->
              <button class="hover:scale-110 transition-transform focus:outline-none" @click="get_new">
                 <svg width="45" height="70" viewBox="0 0 45 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0 L45 35 L0 70 V0Z" fill="url(#arrow-grad)" stroke="white" stroke-width="5" stroke-linejoin="round"/>
                 </svg>
              </button>

            </div>

            <!-- Comment Options at Bottom -->
            <div class="mt-4 z-10 scale-[1.1]">
              <CommentOptions :initial-flower="flowers" :initial-hug="hugs" :initial-like="likes" @action="handleAction" />
            </div>

          </div>

        </div>
      </div>
    </div>
    <span id="render-complete" style="display:none"/>
  </div>
</template>

<style scoped>
@keyframes wave {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-wave {
  animation: wave 20s linear infinite;
}
</style>
