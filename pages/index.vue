<script setup lang="ts">
import { navigateTo } from "nuxt/app";
import { onMounted } from "vue";

onMounted(() => {
  navigateTo("/dashboard");
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="text-2xl font-bold mb-4">Welcome to FlowDesk</h1>
      <p class="text-gray-600">Redirecting to dashboard...</p>
    </div>
  </div>
</template>
