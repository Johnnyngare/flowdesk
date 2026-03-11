<template>
  <div class="space-y-6">

    <div>
      <NuxtLink to="/dashboard/projects">
        <UButton
          label="All Projects"
          icon="i-heroicons-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          class="mb-4"
        />
      </NuxtLink>

      <div v-if="projectLoading" class="animate-pulse">
        <div class="h-7 bg-[#1a2035] rounded w-48 mb-2"></div>
        <div class="h-4 bg-[#1a2035] rounded w-64"></div>
      </div>

      <div v-else-if="project" class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3">
            <div
              class="w-4 h-4 rounded-full"
              :class="`bg-${project.color || 'indigo'}-500`"
            ></div>
            <h1 class="text-2xl font-bold text-white">{{ project.name }}</h1>
            <UBadge
              :label="project.status || 'active'"
              :color="project.status === 'completed' ? 'success' : 'primary'"
              variant="soft"
            />
          </div>
          <p class="text-gray-500 text-sm mt-1 ml-7">
            {{ project.description || 'No description' }}
          </p>
        </div>

        <UButton
          label="Add Task"
          icon="i-heroicons-plus"
          color="primary"
          @click="showCreateTask = true"
        />
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4" v-if="!tasksLoading">
      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-white">{{ tasks.length }}</p>
        <p class="text-gray-500 text-xs mt-1">Total Tasks</p>
      </div>
      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-amber-400">
          {{ tasks.filter(t => t.status !== 'done').length }}
        </p>
        <p class="text-gray-500 text-xs mt-1">Open</p>
      </div>
      <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4 text-center">
        <p class="text-2xl font-bold text-emerald-400">
          {{ tasks.filter(t => t.status === 'done').length }}
        </p>
        <p class="text-gray-500 text-xs mt-1">Completed</p>
      </div>
    </div>

    <UCard class="bg-[#0b0f1a] border border-[#1a2035]">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-white font-semibold">Tasks</h2>

          <div class="flex gap-1">
            <UButton
              v-for="filter in filters"
              :key="filter.value"
              :label="filter.label"
              size="xs"
              :color="activeFilter === filter.value ? 'primary' : 'neutral'"
              :variant="activeFilter === filter.value ? 'solid' : 'ghost'"
              @click="activeFilter = filter.value"
            />
          </div>
        </div>
      </template>

      <div v-if="tasksLoading" class="space-y-3">
        <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 animate-pulse">
          <div class="w-4 h-4 bg-[#1a2035] rounded"></div>
          <div class="flex-1 h-3 bg-[#1a2035] rounded"></div>
        </div>
      </div>

      <div v-else-if="filteredTasks.length === 0" class="text-center py-10">
        <UIcon name="i-heroicons-clipboard-document" class="w-8 h-8 text-gray-700 mx-auto mb-2" />
        <p class="text-gray-500 text-sm">No tasks here</p>
        <UButton
          label="Add first task"
          variant="ghost"
          size="sm"
          class="mt-2"
          @click="showCreateTask = true"
        />
      </div>

      <div v-else class="space-y-1">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5
                 transition-colors group"
        >
          <input
            type="checkbox"
            :checked="task.status === 'done'"
            class="w-4 h-4 rounded accent-indigo-500 cursor-pointer shrink-0"
            @change="toggleTaskStatus(task)"
          />

          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium"
              :class="task.status === 'done'
                ? 'line-through text-gray-500'
                : 'text-white'"
            >
              {{ task.title }}
            </p>
            <p v-if="task.due_date" class="text-xs text-gray-600 mt-0.5">
              Due {{ formatDate(task.due_date) }}
            </p>
          </div>

          <UBadge
            :label="task.priority || 'medium'"
            :color="task.priority === 'high' ? 'error' :
                    task.priority === 'medium' ? 'warning' : 'neutral'"
            variant="soft"
            size="sm"
          />

          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <UButton
              icon="i-heroicons-pencil"
              size="xs"
              color="neutral"
              variant="ghost"
              @click="openEditTask(task)"
            />
            <UButton
              icon="i-heroicons-trash"
              size="xs"
              color="error"
              variant="ghost"
              @click="openDeleteTask(task)"
            />
          </div>
        </div>
      </div>
    </UCard>

    <UModal v-model:open="showCreateTask">
      <template #content>
        <CreateTaskForm
          :project-id="projectId"
          @created="onTaskCreated"
          @cancel="showCreateTask = false"
        />
      </template>
    </UModal>

    <UModal v-model:open="showEditTask">
      <template #content>
        <EditTaskForm
          v-if="selectedTask"
          :task="selectedTask"
          @updated="onTaskUpdated"
          @cancel="showEditTask = false"
        />
      </template>
    </UModal>

    <UModal v-model:open="showDeleteTask">
      <template #content>
        <div class="p-6">
          <h3 class="text-white font-semibold mb-2">Delete Task</h3>
          <p class="text-gray-400 text-sm mb-6">
            Are you sure you want to delete
            <span class="text-white">"{{ selectedTask?.title }}"</span>?
            This cannot be undone.
          </p>
          <div class="flex gap-3 justify-end">
            <UButton label="Cancel" color="neutral" variant="ghost"
                     @click="showDeleteTask = false" />
            <UButton label="Delete" color="error" :loading="deleteLoading"
                     @click="confirmDeleteTask" />
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const route = useRoute()
const supabase = useSupabaseClient()
const toast = useToast()

const projectId = route.params.id as string

const showCreateTask = ref(false)
const showEditTask = ref(false)
const showDeleteTask = ref(false)
const selectedTask = ref<Task | null>(null)
const deleteLoading = ref(false)

const activeFilter = ref('all')
const filters = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Done', value: 'done' },
]

const project = ref<any>(null)
const projectLoading = ref(true)

async function fetchProject() {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()
  project.value = data
  projectLoading.value = false
}

const tasks = ref<Task[]>([])
const tasksLoading = ref(true)

async function fetchTasks() {
  tasksLoading.value = true
  const { data } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  tasks.value = (data as Task[]) || []
  tasksLoading.value = false
}

const filteredTasks = computed(() => {
  if (activeFilter.value === 'open') return tasks.value.filter(t => t.status !== 'done')
  if (activeFilter.value === 'done') return tasks.value.filter(t => t.status === 'done')
  return tasks.value
})

async function toggleTaskStatus(task: Task) {
  const newStatus = task.status === 'done' ? 'todo' : 'done'
  await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', task.id)
  await fetchTasks()
}

function openEditTask(task: Task) {
  selectedTask.value = task
  showEditTask.value = true
}

function openDeleteTask(task: Task) {
  selectedTask.value = task
  showDeleteTask.value = true
}

async function confirmDeleteTask() {
  if (!selectedTask.value) return
  deleteLoading.value = true

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', selectedTask.value.id)

  deleteLoading.value = false

  if (error) { toast.add({ title: 'Error deleting task', color: 'error' }); return }

  toast.add({ title: 'Task deleted', color: 'success' })
  showDeleteTask.value = false
  selectedTask.value = null
  await fetchTasks()
}

function onTaskCreated() {
  showCreateTask.value = false
  fetchTasks()
  toast.add({ title: 'Task created!', color: 'success' })
}

function onTaskUpdated() {
  showEditTask.value = false
  fetchTasks()
  toast.add({ title: 'Task updated!', color: 'success' })
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  })
}

onMounted(async () => {
  await Promise.all([fetchProject(), fetchTasks()])
})
</script>