<script setup lang="ts">
import {Motion, MotionPresence} from "@oku-ui/motion";
import {onMounted, onUnmounted, ref} from 'vue'

const tipText = ref<null|HTMLParagraphElement>(null);
const text = ref<string>("")
const isActive = ref(true);
const repeat = ref(Infinity)
const options = ref<any[]>([])
const feelingOptions = ref<any[]>([])
const displayOptions = ref(false)
const displayText = ref(false)
const displayFeelings = ref(false)
const displayThrow = ref(false)
const handleSelection = ref(async (value: string)=>{console.log(value)})

type Prediction = {
  Angry: number,
  Disgust: number,
  Fear: number,
  Happy: number,
  Neutral: number,
  Sad: number,
  Surprise: number
}

const detect = async ()=>{
  if (!isActive.value) return;
  if (!tipText.value) return;
  const request = await fetch("http://localhost:5001/detect")
  const text = await request.text()
  if (request.status != 200) {
    tipText.value.textContent = "你在看吗";
    await detect()
    return
  }
  tipText.value.textContent = "好, 非常棒";
  const probabilities = JSON.parse(text) as Prediction;
  console.log(probabilities)
  handleSelection.value = getHandleSection(probabilities);
  await generateEmotionOption(probabilities)
}

const generateEmotionOption = async (probabilities: Prediction)=>{
  const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer API_KEY_REMOVED`
    },
    body: JSON.stringify({
      model: "deepseek-ai/DeepSeek-V3",
      messages: [
          { role: "user", content: `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用生成两个以上的纯中文的用户可能的情绪选项选项(如愤怒, 伤心, 疲惫, 想回家等)。 请注意,将每一个选项包裹于{{{}}}中，若不按照此格式输出不计分` }
      ]
    })
  })
  isActive.value = false
  repeat.value = 0;
  const message = JSON.parse(await response.text());
  console.log(message)
  const content = message.choices[0].message.content
  console.log(content)
  setTimeout(()=>{
    options.value = [...content.matchAll(/\{\{\{(.*?)}}}/g)]
        .map(m => m[1]);
    console.log(options.value)
    displayOptions.value = true
  }, 1500)
}

const getHandleSection = (probabilities: Prediction) => {
  return async (selection: string) => {
    console.log(selection)
    displayOptions.value = false
    if (!tipText.value) return;
    tipText.value.textContent = "好的, 让我想想🤔";
    const [response1, response2] = await Promise.all([
      fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer API_KEY_REMOVED`
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3",
          messages: [
            {
              role: "user",
              content: `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用户自己认为自己现在的状态为${selection}, 生成一段20-30字的话来承接用户的情绪, 不要太文艺, 用最简单的语言描述用户的心理状态, 只需要这段话就好,不要有多余的东西`
            }
          ],
          stream: true
        })
      }),
      fetch("https://api.siliconflow.cn/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer API_KEY_REMOVED`
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3",
          messages: [
            {
              role: "user",
              content: `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用户自己认为自己的情绪为${selection}, 用生成三个纯中文的用户可能的感受选项选项(如累, 想逃离, 还可以), 尽量短, 太长扣分。 请注意,将每一个选项包裹于{{{}}}中，若不按照此格式输出不计分`
            }
          ]
        })
      })
    ])
    const reader = response1.body?.getReader()
    const decoder = new TextDecoder()

    const opt = async ()=>{
      const message = JSON.parse(await response2.text());
      console.log(message)
      const content = message.choices[0].message.content
      console.log(content)
      feelingOptions.value = [...content.matchAll(/\{\{\{(.*?)}}}/g)]
          .map(m => m[1]);
    }
    const txt = async ()=>{
      if (!reader) return
      if (!tipText.value)return;
      tipText.value.textContent = "我为你写了段话";
      displayText.value = true;

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
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
          } catch {}
        })
      }
      displayFeelings.value = true;
    }
    await Promise.all([txt(), opt()])
  }
}

const handleFeelingSelection = async (selection: string)=>{
    displayFeelings.value = false
    console.log(selection)
}

onMounted(()=>{
  setTimeout(detect, 500)
})

onUnmounted(() => {
  isActive.value = false;
})

</script>

<template>
  <p ref="tipText" class="fixed w-full text-center text-5xl mt-10 text-gray-50">看着我, 几秒就好</p>
  <div class="w-full h-[100vh] center flex items-center justify-center">
    <MotionPresence>
      <Motion
      v-show="isActive"
      class="rounded-full origin-center w-[200px] h-[200px] bg-blue-500"
      :animate="{
        scale: [1, 1.5, 1],
        boxShadow: ['none', '0 0 15px 15px #78c9ff inset', 'none']
      }"
      :transition="{
        duration: 1.5,
        ease: 'easeInOut',
        repeat: repeat,
        repeatDelay: 1,
      }"
      :exit="{
        opacity: 0,
        scale: 0
      }"
      />
    </MotionPresence>
    <MotionPresence>
      <Motion
          v-show="displayText"
          :animate="{
            opacity: 1
          }"
          :initial="{
            opacity: 0
          }"
          :transition="{
            duration: 1.5,
            ease: 'easeInOut'
          }"
          class="content-center"
      >
        <TextBlock :text="text" />
        <div
            v-show="displayFeelings">
          <p class="text-2xl text-amber-50">你认为以下的哪一个选项更适合你目前的感受?</p>
          <EmotionOptions @select="handleFeelingSelection" :options="feelingOptions" />
        </div>
      </Motion>
    </MotionPresence>
    <MotionPresence>
      <Motion
          v-show="displayOptions"
          :animate="{
            opacity: 1
          }"
          :initial="{
            opacity: 0
          }"
          :transition="{
            duration: 1.5,
            ease: 'easeInOut'
          }"
          :exit="{
            opacity: 0
          }"
      >
        <p class="text-2xl text-amber-50">你认为以下的哪一个选项更适合你目前的情绪?</p>
        <EmotionOptions @select="handleSelection" :options="options" />
      </Motion>
    </MotionPresence>
  </div>
</template>

<style scoped>
</style>
