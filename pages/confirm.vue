<template>
  <div class="min-h-screen bg-[#060912] flex items-center justify-center">
    <div class="text-center">
      <div class="w-12 h-12 rounded-full bg-indigo-600 flex items-center 
                  justify-center mx-auto mb-4">
        <UIcon name="i-heroicons-check" class="w-6 h-6 text-white" />
      </div>
      <h1 class="text-white text-xl font-bold mb-2">Confirming your account...</h1>
      <p class="text-gray-500">You'll be redirected to the dashboard shortly.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>