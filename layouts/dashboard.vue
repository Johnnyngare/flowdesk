<!-- layouts/dashboard.vue -->

<template>
  <div class="flex h-screen overflow-hidden bg-[#060912]">

    <AppSidebar />

    <div class="flex flex-col flex-1 overflow-hidden">

      <AppTopbar />

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
</script>