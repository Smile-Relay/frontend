<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button class="btn-neon" @click="(e) => emit('click', e)">
    <slot>{{ props.text }}</slot>
  </button>
</template>

<style scoped>
.btn-neon {
    width: 320px;
    height: 70px;
    border-radius: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-weight: 500;
    font-size: 18px;
    letter-spacing: 2px;
    border: none;
    outline: none;
    cursor: pointer;
    background: #ba8cdb;
    box-shadow: 0 10px 30px -5px rgba(186, 140, 219, 0.7);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: 20px;
}

.btn-neon:hover {
    background: #c59de3;
    box-shadow: 0 20px 40px -2px rgba(186, 140, 219, 0.9);
    transform: translateY(-5px) scale(1.03);
}

.btn-neon:active {
    transform: translateY(2px) scale(0.97);
    box-shadow: 0 5px 15px rgba(186, 140, 219, 0.5);
    background: #ae79d6;
}
</style>
