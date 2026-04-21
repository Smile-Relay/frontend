<script setup lang="ts">
</script>

<template>
  <div class="main-card">
    <slot />
  </div>
</template>

<style scoped>
.main-card {
    width: 85%;
    max-width: 900px;
    padding: 60px;
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 40px;
    box-shadow: 0 30px 60px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;
}
</style>
