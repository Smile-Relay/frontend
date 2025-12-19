<script setup lang="ts">
import {Motion, MotionPresence} from "@oku-ui/motion";
import {onMounted, onUnmounted, ref} from 'vue'
import { useLLM, Message } from '~/composables/useLLM'
import {useRouter} from "#vue-router";

const tipText = ref<null|HTMLParagraphElement>(null);
const text = ref<string>("")
const isActive = ref(true);
const repeat = ref(Infinity)
const options = ref<any[]>([])
const feelingOptions = ref(["想放假✈️", "好饿啊🍔", "想家🏠", "🍀求锦鲤", "求灵感💡", "🏫上岸!"])
const displayOptions = ref(false)
const displayText = ref(false)
const displayFeelings = ref(false)
const displayThrow = ref(false)
const displayEnd = ref(false)
const handleSelection = ref(async (value: string)=>{console.log(value)})
const llm = useLLM()
const emotion = ref("")
const feeling = ref("")
const phrase = ref("")
const router = useRouter();

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
  const response = await llm.completions(
      [ new Message("user", `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用生成两个以上的一个emoji+简体中文的用户可能的情绪选项选项(如💢愤怒, 😣伤心, 😫疲惫, 🏠想回家等)。 请注意,将每一个选项包裹于{{{}}}中，若不按照此格式输出不计分`) ]
  )
  isActive.value = false
  repeat.value = 0;
  const message = JSON.parse(await response.text());
  console.log(message)
  const content = message.choices[0].message.content
  console.log(content)
  setTimeout(()=>{
    options.value = [...content.matchAll(/\{\{\{(.*?)}}}/g)]
        .map(m => m[1])
        .filter(Boolean);
    console.log(options.value)
    displayOptions.value = true
  }, 1500)
}

const getHandleSection = (probabilities: Prediction) => {
  return async (selection: string) => {
    console.log(selection)
    emotion.value = selection
    displayOptions.value = false
    if (!tipText.value) return;
    tipText.value.textContent = "好的, 让我想想🤔";
    const response = await llm.completions(
        [ new Message("user", `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用户自己认为自己现在的状态为${selection}, 生成一段20-30字的没有人称的话来承接用户的情绪, 不要太文艺, 用最简单的语言描述用户的心理状态, 只需要这段话就好,不要有多余的文字或符号`) ],
        true
    )
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) return
    if (!tipText.value)return;
    tipText.value.textContent = "我觉得这是你现在的感受";
    setTimeout(()=>{displayText.value = true;}, 500)
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
}

const handleFeelingSelection = async (selection: string)=>{
  if (!tipText.value) return;
  displayText.value = false
  displayFeelings.value = false
  console.log(selection)
  feeling.value = selection
  displayThrow.value = true
  tipText.value.textContent = "这是你的情绪漂流瓶🫙"
}

const handleThrowSelection = async (selection: string)=>{
  if (selection === "不扔出"){
    await router.push("/")
    return
  }
  const get_vocabulary = await fetch("http://localhost:5001/random_vocabulary")
  const vocabulary = await get_vocabulary.json()
  console.log(vocabulary)
  phrase.value = vocabulary.vocabulary[0] + vocabulary.vocabulary[1]
  const response = await fetch("http://localhost:5001/throw", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emotion: emotion.value,
      feeling: feeling.value,
      passage: text.value,
      id: vocabulary.id
    })
  })
  await response.text()
  displayThrow.value = false
  displayEnd.value = true
}

const handleLeaveSelection = async (selection: string)=>{
  if (selection === "离开"){
    await router.push("/")
    return
  }
  await router.push("/view")
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
        <TextBlock v-show="displayText" :text="text" />
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
    <Motion
        v-show="displayThrow"
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
    >
      <bottle :passage="text" :emotion="emotion" :feeling="feeling"></bottle>
      <p class="text-2xl text-amber-50">你要扔出它吗</p>
      <EmotionOptions @select="handleThrowSelection" :options="['扔出', '不扔出']"></EmotionOptions>
    </Motion>
    <MotionPresence>
      <Motion
          v-show="displayEnd"
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
        <bottle :passage="text" :emotion="emotion" :feeling="feeling"></bottle>
        <p class="text-3xl text-amber-50">你的情绪漂流瓶已扔出, 记住你的瓶子id: </p>
        <p class="w-full text-center text-8xl text-amber-50"><strong>{{phrase}}</strong></p>
        <EmotionOptions @select="handleLeaveSelection" :options="[ '看看别人的', '离开' ]" />
      </Motion>
    </MotionPresence>
  </div>
</template>

<style scoped>
</style>
