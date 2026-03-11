<template>
  <div class="space-y-6">

    <div class="grid grid-cols-2 xl:grid-cols-4 gap-4">

      <template v-if="loadingStats">
        <div v-for="i in 4" :key="i"
             class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6 animate-pulse">
          <div class="h-3 bg-[#1a2035] rounded w-24 mb-3"></div>
          <div class="h-8 bg-[#1a2035] rounded w-16 mb-2"></div>
          <div class="h-2 bg-[#1a2035] rounded w-32"></div>
        </div>
      </template>

      <template v-else>
        <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Active Projects</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ activeProjects.length }}
              </p>
              <p class="text-xs text-emerald-400 mt-2">
                {{ projects.length }} total projects
              </p>
            </div>
            <div class="p-2 rounded-lg bg-indigo-500/10">
              <UIcon name="i-heroicons-folder" class="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </UCard>

        <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Open Tasks</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ openTasks.length }}
              </p>
              <p class="text-xs text-emerald-400 mt-2">
                {{ highPriorityTasks.length }} high priority
              </p>
            </div>
            <div class="p-2 rounded-lg bg-emerald-500/10">
              <UIcon name="i-heroicons-check-circle" class="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </UCard>

        <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">Completed</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ completedTasks.length }}
              </p>
              <p class="text-xs text-emerald-400 mt-2">
                tasks finished
              </p>
            </div>
            <div class="p-2 rounded-lg bg-amber-500/10">
              <UIcon name="i-heroicons-trophy" class="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </UCard>

        <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-gray-500 text-sm">In Progress</p>
              <p class="text-white text-3xl font-bold mt-1 tracking-tight">
                {{ inProgressTasks.length }}
              </p>
              <p class="text-xs text-amber-400 mt-2">
                actively being worked on
              </p>
            </div>
            <div class="p-2 rounded-lg bg-blue-500/10">
              <UIcon name="i-heroicons-arrow-path" class="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </UCard>
      </template>
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

        <div v-if="tasksLoading" class="space-y-3">
          <div v-for="i in 4" :key="i"
               class="flex items-center gap-3 p-3 animate-pulse">
            <div class="w-4 h-4 bg-[#1a2035] rounded"></div>
            <div class="flex-1">
              <div class="h-3 bg-[#1a2035] rounded w-3/4 mb-1"></div>
              <div class="h-2 bg-[#1a2035] rounded w-1/4"></div>
            </div>
          </div>
        </div>

        <div v-else-if="recentTasks.length === 0"
             class="text-center py-8">
          <UIcon name="i-heroicons-clipboard-document-list"
                 class="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p class="text-gray-500 text-sm">No tasks yet</p>
          <NuxtLink to="/dashboard/tasks">
            <UButton label="Create your first task" variant="ghost"
                     size="sm" class="mt-2" />
          </NuxtLink>
        </div>

        <div v-else class="space-y-1">
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center gap-3 p-3 rounded-lg
                   hover:bg-white/5 transition-colors"
          >
            <input
              type="checkbox"
              :checked="task.status === 'done'"
              class="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
              @change="toggleTask(task)"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-white truncate"
                 :class="{ 'line-through text-gray-500': task.status === 'done' }">
                {{ task.title }}
              </p>
              <p class="text-xs text-gray-600 mt-0.5">
                {{ task.project?.name || 'No project' }}
              </p>
            </div>
            <UBadge
              :label="task.priority || 'none'"
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
          <h2 class="text-white font-semibold">Overview</h2>
        </template>
        <div class="space-y-5">
          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-400">Tasks completed</span>
              <span class="text-white font-medium">
                {{ completedTasks.length }} / {{ tasks.length }}
              </span>
            </div>
            <div class="w-full bg-[#1a2035] rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full bg-indigo-500 transition-all duration-700"
                :style="{ width: completionPercent + '%' }"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-400">Active projects</span>
              <span class="text-white font-medium">
                {{ activeProjects.length }} / {{ projects.length }}
              </span>
            </div>
            <div class="w-full bg-[#1a2035] rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full bg-emerald-500 transition-all duration-700"
                :style="{ width: projectPercent + '%' }"
              />
            </div>
          </div>

          <div>
            <div class="flex justify-between text-sm mb-1.5">
              <span class="text-gray-400">High priority</span>
              <span class="text-white font-medium">
                {{ highPriorityTasks.length }} open
              </span>
            </div>
            <div class="w-full bg-[#1a2035] rounded-full h-1.5">
              <div
                class="h-1.5 rounded-full bg-rose-500 transition-all duration-700"
                :style="{ width: highPriorityPercent + '%' }"
              />
            </div>
          </div>
        </div>
      </UCard>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'
definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { projects, activeProjects, fetchProjects, loading: loadingStats } = useProjects()
const {
  tasks,
  openTasks,
  completedTasks,
  highPriorityTasks,
  fetchRecentTasks,
  loading: tasksLoading
} = useTasks()

const supabase = useSupabaseClient()

const recentTasks = computed(() => tasks.value.slice(0, 5))

const inProgressTasks = computed(() =>
  tasks.value.filter((t: Task) => t.status === 'in_progress')
)

const completionPercent = computed(() => {
  if (tasks.value.length === 0) return 0
  return Math.round((completedTasks.value.length / tasks.value.length) * 100)
})

const projectPercent = computed(() => {
  if (projects.value.length === 0) return 0
  return Math.round((activeProjects.value.length / projects.value.length) * 100)
})

const highPriorityPercent = computed(() => {
  if (tasks.value.length === 0) return 0
  return Math.round((highPriorityTasks.value.length / tasks.value.length) * 100)
})



async function toggleTask(task: Task) {
  const newStatus = task.status === 'done' ? 'todo' : 'done'

  await supabase
    .from('tasks')
    .update({ status: newStatus } as any)
    .eq('id', task.id)

  await fetchRecentTasks()
}

onMounted(async () => {
  await Promise.all([
    fetchProjects(),
    fetchRecentTasks(),
  ])
})
</script>