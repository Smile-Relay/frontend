<script setup lang="ts">

const themes = [
  {
    display_name: "苹果Emoji",
    key: "Apple",
  },
  {
    display_name: "谷歌Emoji",
    key: "Google",
  },
];

const set_theme = (new_theme: string) => {
  fetch("http://127.0.0.1:5001/set_theme?theme=" + new_theme)
  theme.value = new_theme;
}

const theme = ref("")
const imgRef = ref<HTMLImageElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted( ()=>{
  fetch("http://127.0.0.1:5001/get_theme")
      .then(async (response)=>
          theme.value = await response.text()
      )
})

const get_image = () => {
  const img = imgRef.value;
  const canvas = canvasRef.value;
  if (!img || !canvas) return;
  img.crossOrigin = "anonymous";
  const width = img.naturalWidth || img.width || 640;
  const height = img.naturalHeight || img.height || 480;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.drawImage(img, 0, 0, width, height);
  const dataUrl = canvas.toDataURL("image/png");


  fetch("http://127.0.0.1:5001/take_photo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image: dataUrl
    }),
  })
  .then(res => res.json())
  .then(data => console.log("Server response:", data))
  .catch(err => console.error(err));
}

</script>

<template>
  <div class="flex h-screen">
    <!-- Left control panel -->
    <div class="w-64 p-4 border-r space-y-2">
      <button
          v-for="t in themes"
          :key="t.key"
          @click="set_theme(t.key)"
          class="w-full px-4 py-2 rounded-xl font-medium transition
               bg-gray-100 hover:bg-gray-200
               active:scale-95"
          :class="{
          'bg-blue-600 text-white hover:bg-blue-700': theme === t.key
        }"
      >
        {{ t.display_name }}
      </button>
      <button
          class="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium
         hover:bg-blue-700 active:scale-95
         transition duration-200 ease-in-out
         focus:outline-none focus:ring-2 focus:ring-blue-400"
          @click="get_image()"
      >
        就这张
      </button>
    </div>

    <div class="flex-1 flex items-center justify-center bg-black">
      <img
          ref="imgRef"
          src="http://127.0.0.1:5001/video_feed"
          class="max-h-screen w-auto"
      />
    </div>
    <canvas
        class="hidden"
        ref="canvasRef"
    />
  </div>
</template>

<style scoped>
</style>
