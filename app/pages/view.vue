<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const id = ref(route.query.id)
const passage = ref("")
const emotion = ref("")
const feeling = ref("")
const img_url = ref("")
const flowers = ref(0)
const likes = ref(0)
const hugs = ref(0)
const { refresh_timer } = useBackHome(router, 60000)

const get_new = async ()=>{
  refresh_timer()
  const random_id = await fetch("http://localhost:5001/random_id")
  if (random_id.status !== 200){
    id.value = null
    return;
  }
  id.value = await random_id.text()
  const bottle_response = await fetch(`http://localhost:5001/get_bottle/${id.value}`)
  const bottle = await bottle_response.json()
  passage.value = bottle.passage
  emotion.value = bottle.emotion
  feeling.value = bottle.feeling
  img_url.value = bottle.img_url
  flowers.value = bottle.flowers
  likes.value = bottle.likes
  hugs.value = bottle.hugs
}

onMounted( async ()=>{
  if (!id.value) {
    const random_id = await fetch("http://localhost:5001/random_id")
    if (random_id.status !== 200){
      id.value = null;
      return;
    }
    id.value = await random_id.text()
  }
  const bottle_response = await fetch(`http://localhost:5001/get_bottle/${id.value}`)
  if (bottle_response.status != 200) {
    await router.push("/search")
    return
  }
  const bottle = await bottle_response.json()
  passage.value = bottle.passage
  emotion.value = bottle.emotion
  feeling.value = bottle.feeling
  img_url.value = bottle.img_url
  flowers.value = bottle.flowers
  likes.value = bottle.likes
  hugs.value = bottle.hugs
})

const handleAction = async (action: string) => {
  refresh_timer()
  await fetch(`http://localhost:5001/comment/${id.value}?type=${action}`)
}
</script>

<template>
  <div class="w-full h-screen flex flex-col justify-center items-center">
    <Bottle
        v-if="id"
        :feeling="feeling"
        :img_url="img_url"
        :passage="passage"
        :emotion="emotion"
    />

    <div v-show="id" class="mt-6 flex gap-4">
      <Comments :initial-flower="flowers" :initial-hug="hugs" :initial-like="likes" @action="handleAction" />
    </div>

    <div v-show="id" class="mt-6 flex gap-4">
      <button @click="router.push('/')" class="px-6 py-2 bg-gray-500 text-white rounded-lg text-2xl">离开</button>
      <button @click="get_new" class="px-4 py-2 bg-blue-500 text-white rounded-lg text-2xl">换一个</button>
    </div>
    <div v-show="!id">
      <p class="text-3xl text-amber-50">暂时没有已扔出的漂流瓶</p>
      <button @click="router.push('/')" class="px-4 py-2 bg-blue-500 text-white rounded-lg">去扔一个</button>
    </div>
  </div>

</template>

<style scoped>

</style>