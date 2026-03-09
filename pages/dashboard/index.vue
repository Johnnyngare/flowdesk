<template>
  <div class="space-y-6">

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        class="bg-[#0b0f1a] border border-[#1a2035]"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-gray-500 text-sm">{{ stat.label }}</p>
            <p class="text-white text-3xl font-bold mt-1 tracking-tight">{{ stat.value }}</p>
            <p class="text-xs mt-2" :class="stat.up ? 'text-emerald-400' : 'text-red-400'">
              {{ stat.up ? '↑' : '↓' }} {{ stat.change }} vs last month
            </p>
          </div>
          <div class="p-2 rounded-lg" :style="{ background: stat.iconBg }">
            <UIcon :name="stat.icon" class="w-5 h-5" :style="{ color: stat.iconColor }" />
          </div>
        </div>
      </UCard>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4">

      <UCard class="xl:col-span-2 bg-[#0b0f1a] border border-[#1a2035]">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-white font-semibold">Recent Tasks</h2>
            <NuxtLink to="/dashboard/tasks">
              <UButton label="View all" variant="ghost" size="xs" color="neutral" />
            </NuxtLink>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <input
              type="checkbox"
              :checked="task.status === 'done'"
              class="w-4 h-4 rounded accent-indigo-500"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white truncate"
                 :class="{ 'line-through text-gray-500': task.status === 'done' }">
                {{ task.title }}
              </p>
              <p class="text-xs text-gray-600 mt-0.5">{{ task.project }}</p>
            </div>
            <UBadge
              :label="task.priority"
              :color="task.priority === 'high' ? 'error' :
                      task.priority === 'medium' ? 'warning' : 'neutral'"
              variant="soft"
              size="sm"
            />
          </div>
        </div>
      </UCard>

      <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
        <template #header>
          <h2 class="text-white font-semibold">This Week</h2>
        </template>
        <div class="space-y-4">
          <div v-for="item in weekStats" :key="item.label">
            <div class="flex justify-between text-sm mb-1">
              <span class="text-gray-400">{{ item.label }}</span>
              <span class="text-white font-medium">{{ item.value }}</span>
            </div>
            <div class="w-full bg-[#1a2035] rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                :style="{ width: item.percent + '%' }"
              />
            </div>
          </div>
        </div>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const stats = [
  { label: 'Active Projects', value: '6',    change: '2 new',  up: true,  icon: 'i-heroicons-folder',        iconBg: 'rgba(99,102,241,0.1)',  iconColor: '#6366f1' },
  { label: 'Open Tasks',      value: '24',   change: '5 less', up: true,  icon: 'i-heroicons-check-circle',  iconBg: 'rgba(16,185,129,0.1)',  iconColor: '#10b981' },
  { label: 'Completed',       value: '138',  change: '12 more',up: true,  icon: 'i-heroicons-trophy',        iconBg: 'rgba(251,191,36,0.1)',  iconColor: '#fbbf24' },
  { label: 'Team Members',    value: '4',    change: '1 new',  up: true,  icon: 'i-heroicons-users',         iconBg: 'rgba(59,130,246,0.1)',  iconColor: '#3b82f6' },
]

const recentTasks = [
  { id: 1, title: 'Set up Supabase authentication',  project: 'FlowDesk',  status: 'done',        priority: 'high' },
  { id: 2, title: 'Design dashboard layout',         project: 'FlowDesk',  status: 'done',        priority: 'high' },
  { id: 3, title: 'Build task management system',    project: 'FlowDesk',  status: 'in_progress', priority: 'high' },
  { id: 4, title: 'Add analytics charts',            project: 'FlowDesk',  status: 'todo',        priority: 'medium' },
  { id: 5, title: 'Write project README',            project: 'FlowDesk',  status: 'todo',        priority: 'low' },
]

const weekStats = [
  { label: 'Tasks completed', value: '12 / 20', percent: 60 },
  { label: 'Projects active',  value: '4 / 6',  percent: 67 },
  { label: 'Goals reached',    value: '3 / 5',  percent: 60 },
]
</script>