<!-- components/AppTopbar.vue -->
<template>
  <header
    class="h-16 flex-shrink-0 bg-[#0b0f1a] border-b border-[#1a2035] flex items-center justify-between px-6"
  >
    <!-- Page title (changes per page) -->
    <div>
      <h1 class="text-white font-semibold text-lg">{{ pageTitle }}</h1>
      <p class="text-gray-500 text-xs">{{ pageSubtitle }}</p>
    </div>

    <!-- Right side actions -->
    <div class="flex items-center gap-3">
      <!-- Notification bell -->
      <UButton
        icon="i-heroicons-bell"
        color="neutral"
        variant="ghost"
        size="sm"
      />

      <!-- New task quick action -->
      <UButton
        label="New Task"
        icon="i-heroicons-plus"
        color="primary"
        size="sm"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Automatically change the page title based on the current URL
const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": {
    title: "Overview",
    subtitle: "Here's what's happening today",
  },
  "/dashboard/projects": {
    title: "Projects",
    subtitle: "Manage your active projects",
  },
  "/dashboard/tasks": {
    title: "Tasks",
    subtitle: "Track and update your tasks",
  },
  "/dashboard/analytics": {
    title: "Analytics",
    subtitle: "Your productivity at a glance",
  },
  "/dashboard/settings": { title: "Settings", subtitle: "Manage your account" },
};

const current = computed(
  () => pageTitles[route.path] ?? { title: "FlowDesk", subtitle: "" },
);
const pageTitle = computed(() => current.value.title);
const pageSubtitle = computed(() => current.value.subtitle);
</script>
