<template>
  <div class="space-y-6">

    <div>
      <h1 class="text-2xl font-bold text-white">Analytics</h1>
      <p class="text-gray-500 text-sm mt-1">
        Your productivity insights based on real data
      </p>
    </div>

    <div v-if="loading" class="space-y-6">
      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div
          v-for="i in 4" :key="i"
          class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6 animate-pulse"
        >
          <div class="h-3 bg-[#1a2035] rounded w-24 mb-3"></div>
          <div class="h-8 bg-[#1a2035] rounded w-16 mb-2"></div>
          <div class="h-2 bg-[#1a2035] rounded w-32"></div>
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div
          v-for="i in 4" :key="i"
          class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6
                 animate-pulse h-72"
        ></div>
      </div>
    </div>

    <div
      v-else-if="error"
      class="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
    >
      <p class="text-red-400 text-sm">Failed to load analytics: {{ error }}</p>
      <UButton
        label="Try again"
        size="sm"
        color="error"
        variant="ghost"
        class="mt-2"
        @click="fetchAnalyticsData"
      />
    </div>

    <template v-else>

      <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">

        <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Projects</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ totalProjects }}
              </p>
              <p class="text-indigo-400 text-xs mt-2">
                {{ activeProjects }} active
              </p>
            </div>
            <div class="p-2 rounded-lg bg-indigo-500/10">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </div>

        <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Total Tasks</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ totalTasks }}
              </p>
              <p class="text-amber-400 text-xs mt-2">
                {{ pendingTasks }} pending
              </p>
            </div>
            <div class="p-2 rounded-lg bg-amber-500/10">
              <UIcon name="i-heroicons-clipboard-document-list"
                     class="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>

        <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Completed</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ completedTasks }}
              </p>
              <p class="text-emerald-400 text-xs mt-2">
                tasks finished
              </p>
            </div>
            <div class="p-2 rounded-lg bg-emerald-500/10">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Completion Rate</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ completionRate }}%
              </p>
              <div class="w-full bg-[#1a2035] rounded-full h-1.5 mt-3">
                <div
                  class="h-1.5 rounded-full bg-indigo-500 transition-all duration-700"
                  :style="{ width: completionRate + '%' }"
                />
              </div>
            </div>
            <div class="p-2 rounded-lg bg-blue-500/10">
              <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

      </div>

      <div
        v-if="totalTasks === 0"
        class="text-center py-20 bg-[#0b0f1a] border border-[#1a2035]
               border-dashed rounded-xl"
      >
        <UIcon
          name="i-heroicons-chart-bar"
          class="w-12 h-12 text-gray-700 mx-auto mb-4"
        />
        <h3 class="text-white font-semibold mb-2">No data yet</h3>
        <p class="text-gray-500 text-sm mb-4">
          Create some projects and tasks to see your analytics
        </p>
        <NuxtLink to="/dashboard/projects">
          <UButton label="Go to Projects" color="primary" />
        </NuxtLink>
      </div>

      <template v-else>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
            <h3 class="text-white font-semibold mb-1">Task Status</h3>
            <p class="text-gray-500 text-xs mb-6">
              Breakdown of completed, in progress and todo tasks
            </p>
            <div class="h-56">
              <ClientOnly>
                <Pie :data="pieChartData" :options="pieOptions" />
              </ClientOnly>
            </div>
          </div>

          <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
            <h3 class="text-white font-semibold mb-1">Tasks Over Time</h3>
            <p class="text-gray-500 text-xs mb-6">
              Number of tasks created per day
            </p>
            <div class="h-56">
              <ClientOnly>
                <Line :data="lineChartData" :options="lineOptions" />
              </ClientOnly>
            </div>
          </div>

        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">

          <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
            <h3 class="text-white font-semibold mb-1">Tasks by Priority</h3>
            <p class="text-gray-500 text-xs mb-6">
              How many tasks are high, medium or low priority
            </p>
            <div class="h-56">
              <ClientOnly>
                <Bar :data="priorityChartData" :options="barOptions" />
              </ClientOnly>
            </div>
          </div>

          <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6">
            <h3 class="text-white font-semibold mb-1">Tasks per Project</h3>
            <p class="text-gray-500 text-xs mb-6">
              Total number of tasks in each project
            </p>
            <div class="h-56">
              <ClientOnly>
                <Bar :data="projectTasksChartData" :options="barOptions" />
              </ClientOnly>
            </div>
          </div>

        </div>

        <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl overflow-hidden">
          <div class="p-6 border-b border-[#1a2035]">
            <h3 class="text-white font-semibold">Project Summary</h3>
            <p class="text-gray-500 text-xs mt-1">
              Task completion breakdown per project
            </p>
          </div>
          <div class="divide-y divide-[#1a2035]">
            <div
              v-for="project in projectSummary"
              :key="project.id"
              class="flex items-center gap-4 px-6 py-4 hover:bg-white/5
                     transition-colors"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div
                  class="w-2.5 h-2.5 rounded-full shrink-0"
                  :class="`bg-${project.color || 'indigo'}-500`"
                ></div>
                <span class="text-white text-sm font-medium truncate">
                  {{ project.name }}
                </span>
              </div>
              <div class="flex items-center gap-6 shrink-0">
                <div class="text-center">
                  <p class="text-white font-semibold text-sm">{{ project.total }}</p>
                  <p class="text-gray-600 text-xs">Total</p>
                </div>
                <div class="text-center">
                  <p class="text-emerald-400 font-semibold text-sm">
                    {{ project.completed }}
                  </p>
                  <p class="text-gray-600 text-xs">Done</p>
                </div>
                <div class="text-center">
                  <p class="text-amber-400 font-semibold text-sm">
                    {{ project.pending }}
                  </p>
                  <p class="text-gray-600 text-xs">Open</p>
                </div>
                <div class="w-24">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-gray-500">Progress</span>
                    <span class="text-gray-400">{{ project.percent }}%</span>
                  </div>
                  <div class="w-full bg-[#1a2035] rounded-full h-1.5">
                    <div
                      class="h-1.5 rounded-full bg-indigo-500 transition-all"
                      :style="{ width: project.percent + '%' }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="projectSummary.length === 0"
              class="px-6 py-8 text-center text-gray-500 text-sm"
            >
              No projects found
            </div>
          </div>
        </div>

      </template>
    </template>

  </div>
</template>

<script setup lang="ts">
import { Pie, Line, Bar } from 'vue-chartjs'
import { pieOptions, lineOptions, barOptions } from '~/utils/chartOptions'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const {
  loading,
  error,
  fetchAnalyticsData,
  totalProjects,
  activeProjects,
  totalTasks,
  completedTasks,
  pendingTasks,
  completionRate,
  pieChartData,
  priorityChartData,
  lineChartData,
  projectTasksChartData,
} = useAnalytics()

const supabase = useSupabaseClient()
const projects = ref<any[]>([])
const tasks = ref<any[]>([])

const projectSummary = computed(() =>
  projects.value.map(p => {
    const projectTasks = tasks.value.filter(t => t.project_id === p.id)
    const completed = projectTasks.filter(t => t.status === 'done').length
    const total = projectTasks.length
    return {
      ...p,
      total,
      completed,
      pending: total - completed,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    }
  })
)

onMounted(async () => {
  await fetchAnalyticsData()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const [pRes, tRes] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', session.user.id),
    supabase.from('tasks').select('*').eq('user_id', session.user.id),
  ])

  projects.value = pRes.data || []
  tasks.value = tRes.data || []
})
</script>