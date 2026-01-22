<script setup lang="ts">
import { Motion, MotionPresence } from "@oku-ui/motion";
import {onMounted, onUnmounted, ref} from 'vue'
import { useRouter } from "#vue-router";
import { useLLM, Message } from '~/composables/useLLM'
import { useBackHome } from "~/composables/useBackHome";
import { useT2I } from "~/composables/useT2I";
import {useGenderImage} from "~/composables/useGenderImage";
import OptionsList from "~/components/OptionsList.vue";
import type {Prediction} from "~/composables/prediction";
import type {StepperItem} from "@nuxt/ui/components/Stepper.vue";

const items = ref<StepperItem[]>([
  {
    title: '表情识别',
    icon: 'ic:baseline-camera-enhance'
  },
  {
    title: '选择情绪',
    icon: 'ic:baseline-done-all'
  },
  {
    title: '生成感受',
    icon: 'ic:outline-add-reaction'
  },
  {
    title: '选择想法',
    icon: 'ic:baseline-done-all'
  },
  {
    title: '图片生成',
    icon: 'ic:baseline-image'
  },
  {
    title: '扔出瓶子',
    icon: 'ic:baseline-water'
  }
])

const tipText = ref<null|HTMLParagraphElement>(null);
const stepper = useTemplateRef('stepper')
const text = ref<string>("")
const isActive = ref(true);
const repeat = ref(Infinity)
const feelingOptions = ref(["想放假✈️", "好饿啊🍔", "想家🏠", "🍀求锦鲤", "😆元气满满", "求灵感💡", "🏫上岸!"])
const displayOptions = ref(false)
const displayText = ref(false)
const displayFeelings = ref(false)
const displayThrow = ref(false)
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
const phrase = ref("")
const router = useRouter();

const detect = async ()=>{
  if (!isActive.value) return;
  if (!tipText.value) return;
  if (!stepper.value) return;
  const request = await fetch("http://localhost:5001/detect")
  const text = await request.text()
  if (request.status != 200) {
    tipText.value.textContent = "你在看吗";
    await detect()
    return
  }
  refresh_timer()
  tipText.value.textContent = "好, 非常棒";
  stepper.value.next()
  const probabilities = JSON.parse(text) as Prediction;
  console.log(probabilities)
  prediction.value = probabilities
  isActive.value = false
  repeat.value = 0;
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
  tipText.value.textContent = "好的, 让我想想🤔";
  gender.value = prediction.value.Gender || 0;
  delete prediction.value.Gender;
  const response = await llm.completions(
      [ new Message("user", `用户目前的表情根据模型生成的概率为${JSON.stringify(prediction.value)}, 用户自己认为自己现在的状态为${selection}, 生成一段20-30字的没有人称的话来承接用户的情绪, 不要太文艺, 用最简单的语言描述用户的心理状态, 只需要这段话就好,不要有多余的文字或符号`) ],
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
  stepper.value.next()
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
  tipText.value.textContent = "情绪图片生成中🫙"
  try {
    img_url.value = await t2i.generate(`将人物的表情和动作和背景改为符合以下描述: ${text.value}, 结合想法: ${feeling.value}`, useGenderImage(gender.value) || "")

  }
  catch (error) {
    console.error(error)
    await router.push("/")
  }
  refresh_timer()
  stepper.value.next()
  isActive.value = false
  repeat.value = 0;
  tipText.value.textContent = "这是你的情绪漂流瓶🫙"
  setTimeout(() => {
    displayThrow.value = true
  }, 1500)
}

const handleThrowSelection = async (selection: string)=>{
  refresh_timer()
  if (!stepper.value) return;
  stepper.value.next()
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
    <UStepper ref="stepper" class="my-3" size="xl" color="info" :items="items" />
    <UButton
        v-if="!displayThrow"
        color="neutral"
        variant="outline"
        class="text-4xl ml-3"
        @click="router.push('/')"
    >
      退出
    </UButton>
    <p ref="tipText" class="fixed w-full text-center text-5xl text-gray-50">看着我, 几秒就好</p>
    <div class="w-full h-[1087px] center flex flex-col items-center justify-center">
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
            <p class="text-3xl text-amber-50">你认为以下的哪一个选项更适合你目前的感受?</p>
            <OptionsList :options="feelingOptions" @select="handleFeelingSelection" />
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
          <p class="text-3xl text-amber-50">你认为以下的哪一个选项更适合你目前的情绪?</p>
          <EmotionOptions :prediction="prediction" @select="handleSelection" />
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
        <BottleView class="mt-26" :phrase="null" :preview="true" :img-url="img_url" :passage="text" :emotion="emotion" :feeling="feeling" />
        <p class="text-3xl text-amber-50">你要扔出它吗</p>
        <OptionsList :options="['扔出', '不扔出']" @select="handleThrowSelection" />
      </Motion>
    </div>
  </div>
</template>

<style scoped>
</style>
