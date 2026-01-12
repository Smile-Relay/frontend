<script setup lang="ts">
import { useT2I } from "~/composables/useT2I";
const T2I = useT2I()

const prompt = ref("")

const generate = async () => {
  const url = await T2I.generate(prompt.value)
  console.log(url)
}

</script>

<template>
<input v-model="prompt" >
<button @click="generate">Generate</button>
</template>

<style scoped>

</style>