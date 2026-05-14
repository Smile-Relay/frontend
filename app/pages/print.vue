<script setup lang="ts">
import { usePhrase } from "~/composables/usePhrase";

const route = useRoute()
const id = ref(route.query.id as string)
const passage = ref("")
const emotion = ref("")
const feeling = ref("")
const img_url = ref("")
const phrase = ref("")
const toPhrase = usePhrase()

onMounted( async ()=>{
  if (!id.value) {
    done()
    return
  }
  try {
    const bottle_response = await fetch(`http://localhost:5001/get_bottle/${id.value}`)
    if (bottle_response.status != 200) {
      done()
      return
    }
    const bottle = await bottle_response.json()
    phrase.value = toPhrase(bottle.id)
    passage.value = bottle.passage
    emotion.value = bottle.emotion
    feeling.value = bottle.feeling
    img_url.value = bottle.img_url
    done()
  } catch (e) {
    console.error(e)
    done()
  }
})

const done = () => {
  const el = document.getElementById('render-complete')
  if (el) el.setAttribute('data-ready', 'true')
}
</script>

<template>
  <div class="w-full min-h-screen bg-white flex items-center justify-center p-8 font-sans">
    <UCard id="bottle" class="max-w-175 w-full">
      <h1 class="text-gray-900 text-5xl mb-6"><strong>{{ phrase }}</strong></h1>
      <img
          v-if="img_url"
          alt="N/A"
          :src="img_url"
          class="w-175 h-175 mb-6 rounded-lg object-cover"
      >
      <UBadge class="text-xl" color="neutral" variant="outline">
        {{ emotion }}
      </UBadge>
      <UBadge class="ml-3 text-xl" color="neutral" variant="outline">
        {{ feeling }}
      </UBadge>
      <p class="mt-6 text-2xl leading-relaxed text-gray-700 whitespace-pre-wrap">
        {{ passage }}
      </p>
    </UCard>
    <span id="render-complete" style="display:none"></span>
  </div>
</template>

<style scoped>
</style>