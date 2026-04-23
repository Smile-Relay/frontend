<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVocabularies } from "~/composables/useVocabularies";
import { useRouter } from "vue-router";
import { useBackHome } from "~/composables/useBackHome";

useHead({
      bodyAttrs: {
        class: 'bg-sky'
      }
    }
)

const { t } = useI18n()
const { adjectives, nouns } = useVocabularies()
const router = useRouter()
const { refresh_timer } = useBackHome(router, 60000)

const selectedAdjectiveIndex = ref<number | null>(null)
const selectedNounIndex = ref<number | null>(null)

const canNext = computed(() => selectedAdjectiveIndex.value !== null && selectedNounIndex.value !== null)

const nextStep = async () => {
  if (!canNext.value) return
  if (!selectedAdjectiveIndex.value) return;
  if (!selectedNounIndex.value) return;
  const id = selectedAdjectiveIndex.value.toString(16).toUpperCase() + selectedNounIndex.value.toString(16).toUpperCase()
  console.log(id)
  await router.push(`/view?id=${id}`)
}
</script>

<template>
  <div class="fixed inset-0 w-full h-full bg-cover bg-center flex flex-col items-center justify-center font-sans" style="background-image: url('/bg-new.svg')">
    
    <!-- Wavy Bottom -->
    <div class="absolute bottom-0 left-0 w-full h-45 pointer-events-none z-0 overflow-hidden">
      <div class="absolute bottom-0 left-0 w-[200%] h-full flex animate-wave">
        <svg viewBox="0 0 1440 320" class="w-full h-full" preserveAspectRatio="none">
          <path fill="url(#bg-gradient)" d="M0,160 C320,300 420,100 720,160 C1020,220 1120,40 1440,160 C1760,280 1860,80 2160,140 C2460,200 2560,20 2880,140 V320 H0 Z" />
          <defs>
            <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#E8D1F8" />
              <stop offset="100%" stop-color="#D6BFF2" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>

    <!-- Exit Button -->
    <button class="absolute top-8 right-8 px-10 py-2 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.3),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-2xl font-medium hover:scale-105 transition-all duration-300 bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] border-[3px] border-white z-20" @click="router.push('/')">
       {{ t('search.back') || '返回' }}
    </button>

    <!-- Main Content -->
    <div class="z-10 flex flex-col items-center w-full max-w-6xl relative h-[90%] mt-12 bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-white/80">
      
      <div class="flex w-full h-full gap-4">
        
        <!-- Adjectives Panel -->
        <div class="w-1/2 flex flex-col h-full bg-white/70 rounded-2xl p-4 shadow-inner border border-white">
          <h1 class="text-2xl text-[#4B6B8A] mb-4 font-medium text-center tracking-widest">{{ t('search.adjectivesTitle') }}</h1>
          <div class="grid grid-cols-4 gap-3">
            <button
                v-for="(adj, index) in adjectives"
                :key="index"
                class="py-2 rounded-full text-lg font-medium transition-all duration-300 border-2 whitespace-nowrap"
                :class="[
                  selectedAdjectiveIndex === index 
                    ? 'bg-linear-to-r from-[#D2B4F5] to-[#EADCF8] border-white text-[#2A4365] shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_2px_5px_rgba(200,180,240,0.5)] scale-105'
                    : 'bg-white border-[#EADCF8] text-[#4B6B8A] hover:bg-[#F8F4FD] hover:border-[#D2B4F5]'
                ]"
                @click="selectedAdjectiveIndex = index; refresh_timer()"
            >
              {{ adj }}
            </button>
          </div>
        </div>

        <!-- Nouns Panel -->
        <div class="w-1/2 flex flex-col h-full bg-white/70 rounded-2xl p-4 shadow-inner border border-white">
          <h1 class="text-2xl text-[#4B6B8A] mb-4 font-medium text-center tracking-widest">{{ t('search.nounsTitle') }}</h1>
          <div class="grid grid-cols-4 gap-3">
            <button
                v-for="(noun, index) in nouns"
                :key="index"
                class="py-2 rounded-full text-lg font-medium transition-all duration-300 border-2 whitespace-nowrap"
                :class="[
                  selectedNounIndex === index 
                    ? 'bg-linear-to-r from-[#D2B4F5] to-[#EADCF8] border-white text-[#2A4365] shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_2px_5px_rgba(200,180,240,0.5)] scale-105'
                    : 'bg-white border-[#EADCF8] text-[#4B6B8A] hover:bg-[#F8F4FD] hover:border-[#D2B4F5]'
                ]"
                @click="selectedNounIndex = index; refresh_timer()"
            >
              {{ noun }}
            </button>
          </div>
        </div>

      </div>

      <!-- Find Bottle Action -->
      <div class="mt-4 mb-2">
        <button
            class="px-12 py-3 rounded-full shadow-[0_4px_10px_rgba(200,180,240,0.4),inset_0_0_10px_rgba(255,255,255,1)] text-[#2A4365] text-xl font-medium transition-all duration-300 border-[3px] border-white tracking-widest"
            :class="[
              canNext ? 'bg-linear-to-r from-[#EADCF8] to-[#F5EEFB] hover:scale-105 hover:shadow-[0_8px_15px_rgba(180,150,220,0.6),inset_0_0_10px_rgba(255,255,255,1)] cursor-pointer' : 'bg-gray-200 text-gray-400 border-gray-100 cursor-not-allowed opacity-60'
            ]"
            :disabled="!canNext"
            @click="nextStep"
        >
          {{ t('search.next') || '找瓶子' }}
        </button>
      </div>

    </div>
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

/* Custom scrollbar for panels */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background: #EADCF8; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #D2B4F5; 
}
</style>
