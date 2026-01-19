<script setup lang="ts">
import { Motion, MotionPresence } from "@oku-ui/motion";
import {onMounted, onUnmounted, ref} from 'vue'
import { useRouter } from "#vue-router";
import { useLLM, Message } from '~/composables/useLLM'
import { useBackHome } from "~/composables/useBackHome";
import { useT2I } from "~/composables/useT2I";
import {useGenderImage} from "~/composables/useGenderImage";

const tipText = ref<null|HTMLParagraphElement>(null);
const text = ref<string>("")
const isActive = ref(true);
const repeat = ref(Infinity)
const options = ref<string[]>([])
const feelingOptions = ref(["想放假✈️", "好饿啊🍔", "想家🏠", "🍀求锦鲤", "😆元气满满", "求灵感💡", "🏫上岸!"])
const displayOptions = ref(false)
const displayText = ref(false)
const displayFeelings = ref(false)
const displayThrow = ref(false)
const handleSelection = ref(async (value: string)=>{console.log(value)})
const llm = useLLM()
const t2i = useT2I()
const img_url = ref<null|string>(null)
const gender = ref(0);
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
  Surprise: number,
  Gender?: number
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
  refresh_timer()
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
    refresh_timer()
    tipText.value.textContent = "好的, 让我想想🤔";
    gender.value = probabilities.Gender || 0;
    delete probabilities.Gender;
    const response = await llm.completions(
        [ new Message("user", `用户目前的表情根据模型生成的概率为${JSON.stringify(probabilities)}, 用户自己认为自己现在的状态为${selection}, 生成一段20-30字的没有人称的话来承接用户的情绪, 不要太文艺, 用最简单的语言描述用户的心理状态, 只需要这段话就好,不要有多余的文字或符号`) ],
        true
    )
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    if (!reader) return
    if (!tipText.value)return;
    tipText.value.textContent = "我觉得这是你现在的感受";
    setTimeout(()=>{displayText.value = true;}, 1500)
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
    displayFeelings.value = true;
  }
}

const handleFeelingSelection = async (selection: string)=>{
  if (!tipText.value) return;
  refresh_timer()
  displayText.value = false
  displayFeelings.value = false
  console.log(selection)
  feeling.value = selection
  isActive.value = true
  repeat.value = Infinity;
  tipText.value.textContent = "正在生成专属于你的情绪漂流瓶🫙"
  img_url.value = await t2i.generate(`将人物的表情和动作和背景改为符合以下描述: ${text.value}, 结合想法: ${feeling.value}`, useGenderImage(gender.value) || "")
  refresh_timer()
  isActive.value = false
  repeat.value = 0;
  tipText.value.textContent = "这是你的情绪漂流瓶🫙"
  setTimeout(() => {
    displayThrow.value = true
  }, 1500)

}

const handleThrowSelection = async (selection: string)=>{
  refresh_timer()
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
      img_url: img_url.value,
      id: vocabulary.id
    })
  })
  await response.text()
  displayThrow.value = false
  await router.push(`/drop?phrase=${phrase.value}`)
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
  <div>
    <p ref="tipText" class="fixed w-full text-center text-5xl mt-10 text-gray-50">看着我, 几秒就好</p>
    <div class="w-full h-screen center flex items-center justify-center">
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
            <EmotionOptions class="text-2xl" :options="feelingOptions" @select="handleFeelingSelection" />
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
          <EmotionOptions class="text-4xl" :options="options" @select="handleSelection" />
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
        <bottle :preview="true" :img_url="img_url" :passage="text" :emotion="emotion" :feeling="feeling" />
        <p class="text-2xl text-amber-50">你要扔出它吗</p>
        <EmotionOptions class="text-4xl" :options="['扔出', '不扔出']" @select="handleThrowSelection" />
      </Motion>
    </div>
  </div>
</template>

<style scoped>
</style>
