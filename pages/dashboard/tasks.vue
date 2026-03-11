<template>
  <div class="space-y-6">

    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Tasks</h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ filteredTasks.length }} task{{ filteredTasks.length === 1 ? '' : 's' }}
          {{ activeFiltersLabel }}
        </p>
      </div>
    </div>

    <div class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4 space-y-3">

      <UInput
        v-model="search"
        placeholder="Search tasks..."
        icon="i-heroicons-magnifying-glass"
        color="neutral"
        variant="outline"
        class="w-full"
      />

      <div class="flex flex-wrap gap-2">

        <div class="flex gap-1">
          <UButton
            v-for="s in statusFilters"
            :key="s.value"
            :label="s.label"
            size="xs"
            :color="statusFilter === s.value ? 'primary' : 'neutral'"
            :variant="statusFilter === s.value ? 'solid' : 'ghost'"
            @click="statusFilter = s.value"
          />
        </div>

        <div class="w-px bg-[#1a2035] mx-1"></div>

        <div class="flex gap-1">
          <UButton
            v-for="p in priorityFilters"
            :key="p.value"
            :label="p.label"
            size="xs"
            :color="priorityFilter === p.value ? 'primary' : 'neutral'"
            :variant="priorityFilter === p.value ? 'solid' : 'ghost'"
            @click="priorityFilter = p.value"
          />
        </div>

        <div class="w-px bg-[#1a2035] mx-1"></div>

        <USelect
          v-model="projectFilter"
          :items="projectOptions"
          size="xs"
          color="neutral"
          variant="outline"
          class="min-w-32"
        />

        <UButton
          v-if="hasActiveFilters"
          label="Clear"
          icon="i-heroicons-x-mark"
          size="xs"
          color="neutral"
          variant="ghost"
          @click="clearFilters"
        />
      </div>
    </div>

    <div v-if="loading" class="space-y-2">
      <div
        v-for="i in 5" :key="i"
        class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4
               flex items-center gap-3 animate-pulse"
      >
        <div class="w-4 h-4 bg-[#1a2035] rounded"></div>
        <div class="flex-1 h-3 bg-[#1a2035] rounded"></div>
        <div class="w-16 h-3 bg-[#1a2035] rounded"></div>
        <div class="w-20 h-3 bg-[#1a2035] rounded"></div>
      </div>
    </div>

    <div
      v-else-if="filteredTasks.length === 0"
      class="text-center py-20 bg-[#0b0f1a] border border-[#1a2035]
             border-dashed rounded-xl"
    >
      <UIcon
        name="i-heroicons-clipboard-document"
        class="w-12 h-12 text-gray-700 mx-auto mb-4"
      />
      <h3 class="text-white font-semibold mb-2">
        {{ hasActiveFilters ? 'No tasks match your filters' : 'No tasks yet' }}
      </h3>
      <p class="text-gray-500 text-sm mb-4">
        {{
          hasActiveFilters
            ? 'Try adjusting your search or filters'
            : 'Create a project and add your first task'
        }}
      </p>
      <UButton
        v-if="hasActiveFilters"
        label="Clear filters"
        color="neutral"
        variant="ghost"
        @click="clearFilters"
      />
      <NuxtLink v-else to="/dashboard/projects">
        <UButton label="Go to Projects" color="primary" />
      </NuxtLink>
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="task in filteredTasks"
        :key="task.id"
        class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-4
               flex items-center gap-3 group hover:border-indigo-500/30
               transition-all duration-200"
        :class="task.status === 'done' ? 'opacity-60' : ''"
      >
        <input
          type="checkbox"
          :checked="task.status === 'done'"
          class="w-4 h-4 rounded accent-indigo-500 cursor-pointer shrink-0"
          @change="toggleStatus(task)"
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
          <div class="flex items-center gap-2 mt-1 flex-wrap">
            <NuxtLink
              v-if="task.project"
              :to="`/dashboard/projects/${task.project_id}`"
              class="flex items-center gap-1.5 text-xs text-gray-500
                     hover:text-indigo-400 transition-colors"
            >
              <div
                class="w-2 h-2 rounded-full shrink-0"
                :class="`bg-${task.project.color || 'indigo'}-500`"
              ></div>
              {{ task.project.name }}
            </NuxtLink>

            <span
              v-if="task.due_date"
              class="text-xs"
              :class="isOverdue(task) ? 'text-red-400' : 'text-gray-600'"
            >
              {{ isOverdue(task) ? '⚠ Overdue · ' : '' }}{{ formatDate(task.due_date) }}
            </span>
          </div>
        </div>

        <UBadge
          :label="task.priority || 'medium'"
          :color="task.priority === 'high' ? 'error' :
                  task.priority === 'medium' ? 'warning' : 'neutral'"
          variant="soft"
          size="sm"
          class="shrink-0"
        />

        <UBadge
          :label="task.status === 'in_progress' ? 'In Progress' :
                  task.status === 'done' ? 'Done' : 'To Do'"
          :color="task.status === 'done' ? 'success' :
                  task.status === 'in_progress' ? 'primary' : 'neutral'"
          variant="soft"
          size="sm"
          class="shrink-0 hidden sm:flex"
        />

        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <UButton
            icon="i-heroicons-pencil"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="openEdit(task)"
          />
          <UButton
            icon="i-heroicons-trash"
            size="xs"
            color="error"
            variant="ghost"
            @click="openDelete(task)"
          />
        </div>
      </div>
    </div>

    <UModal v-model:open="showEdit" title="Edit Task">
      <template #content>
        <EditTaskForm
          v-if="selectedTask"
          :task="selectedTask"
          @updated="onUpdated"
          @cancel="showEdit = false"
        />
      </template>
    </UModal>

    <UModal v-model:open="showDelete" title="Delete Task">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-500/10 flex
                        items-center justify-center shrink-0">
              <UIcon
                name="i-heroicons-exclamation-triangle"
                class="w-5 h-5 text-red-400"
              />
            </div>
            <div>
              <h3 class="text-white font-semibold">Delete Task</h3>
              <p class="text-gray-500 text-sm">This cannot be undone</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-6">
            Are you sure you want to delete
            <span class="text-white font-medium">
              "{{ selectedTask?.title }}"
            </span>?
          </p>
          <div class="flex gap-3 justify-end">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="showDelete = false"
            />
            <UButton
              label="Delete Task"
              color="error"
              :loading="deleteLoading"
              @click="confirmDelete"
            />
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const supabase = useSupabaseClient()
const toast = useToast()

const allTasks = ref<Task[]>([])
const loading = ref(true)

const search = ref('')
const statusFilter = ref('all')
const priorityFilter = ref('all')
const projectFilter = ref('all')

const statusFilters = [
  { label: 'All', value: 'all' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const priorityFilters = [
  { label: 'All', value: 'all' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const projectOptions = computed(() => {
  const seen = new Set()
  const options = [{ label: 'All Projects', value: 'all' }]

  allTasks.value.forEach(task => {
    if (task.project && !seen.has(task.project_id)) {
      seen.add(task.project_id)
      options.push({ label: task.project.name, value: task.project_id })
    }
  })

  return options
})

const filteredTasks = computed(() => {
  let result = allTasks.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    result = result.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    )
  }

  if (statusFilter.value !== 'all')
    result = result.filter(t => t.status === statusFilter.value)

  if (priorityFilter.value !== 'all')
    result = result.filter(t => t.priority === priorityFilter.value)

  if (projectFilter.value !== 'all')
    result = result.filter(t => t.project_id === projectFilter.value)

  return result
})

const hasActiveFilters = computed(() =>
  search.value !== '' ||
  statusFilter.value !== 'all' ||
  priorityFilter.value !== 'all' ||
  projectFilter.value !== 'all'
)

const activeFiltersLabel = computed(() => {
  if (!hasActiveFilters.value) return ''
  return '· filtered'
})

function clearFilters() {
  search.value = ''
  statusFilter.value = 'all'
  priorityFilter.value = 'all'
  projectFilter.value = 'all'
}

async function fetchTasks() {
  loading.value = true
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) { loading.value = false; return }

  const { data, error } = await supabase
    .from('tasks')
    .select('*, project:projects(name, color)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    toast.add({ title: 'Failed to load tasks', color: 'error' })
  }

  allTasks.value = (data as Task[]) || []
  loading.value = false
}

async function toggleStatus(task: Task) {
  const newStatus = task.status === 'done' ? 'todo' : 'done'

  const { error } = await supabase
    .from('tasks')
    .update({ status: newStatus })
    .eq('id', task.id)

  if (error) {
    toast.add({ title: 'Failed to update task', color: 'error' })
    return
  }

  await fetchTasks()
}

const showEdit = ref(false)
const selectedTask = ref<Task | null>(null)

function openEdit(task: Task) {
  selectedTask.value = task
  showEdit.value = true
}

function onUpdated() {
  showEdit.value = false
  fetchTasks()
  toast.add({ title: 'Task updated', color: 'success' })
}

const showDelete = ref(false)
const deleteLoading = ref(false)

function openDelete(task: Task) {
  selectedTask.value = task
  showDelete.value = true
}

async function confirmDelete() {
  if (!selectedTask.value) return
  deleteLoading.value = true

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', selectedTask.value.id)

  deleteLoading.value = false

  if (error) {
    toast.add({ title: 'Failed to delete task', color: 'error' })
    return
  }

  toast.add({ title: 'Task deleted', color: 'success' })
  showDelete.value = false
  selectedTask.value = null
  await fetchTasks()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

function isOverdue(task: Task) {
  if (!task.due_date || task.status === 'done') return false
  return new Date(task.due_date) < new Date()
}

onMounted(fetchTasks)
</script>