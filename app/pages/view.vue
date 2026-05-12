<script setup lang="ts">
import { usePhrase } from "~/composables/usePhrase";
import { useBackHome } from "~/composables/useBackHome";

const route = useRoute()
const router = useRouter()
const id = ref(route.query.id)
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

onMounted( async ()=>{
  if (!id.value) {
    await router.push("/")
    return
  }
  const bottle_response = await fetch(`http://localhost:5001/get_bottle/${id.value}`)
  if (bottle_response.status != 200) {
    await router.push("/search")
    return
  }
  const bottle = await bottle_response.json()
  phrase.value = toPhrase(bottle.id)
  passage.value = bottle.passage
  emotion.value = bottle.emotion
  feeling.value = bottle.feeling
  img_url.value = bottle.img_url
  flowers.value = bottle.flowers
  likes.value = bottle.likes
  hugs.value = bottle.hugs
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
    <div class="grow h-full relative p-4">
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
        <button class="absolute top-8 right-8 px-10 py-2 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-[3px] border-white z-20" @click="router.push('/search')">
           {{ t('view.leave') || '返回' }}
        </button>

        <!-- Main Content -->
        <div class="z-10 flex flex-col items-center w-full max-w-4xl relative h-[85%] justify-center">
          
          <div v-if="!id" class="text-center absolute inset-0 flex flex-col items-center justify-center">
            <p class="text-4xl text-[#2A4365] mb-8">{{ t('view.empty') }}</p>
            <button class="px-12 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium hover:scale-105 transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-2 border-white" @click="router.push('/')">
              {{ t('view.throwOne') }}
            </button>
          </div>

          <div v-else class="flex flex-col items-center justify-center w-full h-full">
            <p class="text-4xl text-[#2A4365] font-medium tracking-widest mb-6">{{ phrase }}</p>

            <div class="flex flex-row items-center justify-center w-full">
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
