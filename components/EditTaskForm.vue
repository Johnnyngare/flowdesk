<template>
  <div class="p-6">
    <h2 class="text-white text-lg font-bold mb-1">Edit Task</h2>
    <p class="text-gray-500 text-sm mb-6">Update task details</p>

    <div class="space-y-4">
      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Task Title</label>
        <UInput v-model="form.title" size="lg" class="w-full" />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Description</label>
        <UTextarea v-model="form.description" :rows="3" class="w-full" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-gray-400 text-sm block mb-1.5">Priority</label>
          <USelect v-model="form.priority" :options="priorityOptions" size="lg" class="w-full" />
        </div>
        <div>
          <label class="text-gray-400 text-sm block mb-1.5">Status</label>
          <USelect v-model="form.status" :options="statusOptions" size="lg" class="w-full" />
        </div>
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Due Date</label>
        <UInput v-model="form.due_date" type="date" size="lg" class="w-full" />
      </div>
    </div>

    <p v-if="error" class="text-red-400 text-sm mt-4">{{ error }}</p>

    <div class="flex gap-3 justify-end mt-6">
      <UButton label="Cancel" color="neutral" variant="ghost" @click="$emit('cancel')" />
      <UButton label="Save Changes" color="primary" :loading="loading" @click="handleUpdate" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/types'

const props = defineProps<{ task: Task }>()
const emit = defineEmits(['updated', 'cancel'])

const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')

const priorityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
]

const statusOptions = [
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Done', value: 'done' },
]

const form = reactive({
  title: props.task.title,
  description: props.task.description || '',
  priority: props.task.priority || 'medium',
  status: props.task.status || 'todo',
  due_date: props.task.due_date || '',
})

async function handleUpdate() {
  error.value = ''

  if (!form.title.trim()) {
    error.value = 'Task title is required.'
    return
  }

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    error.value = 'You are not logged in. Please refresh and try again.'
    return
  }

  loading.value = true

  const { error: err } = await supabase
    .from('tasks')
    .update({
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: form.status,
      due_date: form.due_date || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', props.task.id)
    .eq('user_id', session.user.id) 

  loading.value = false

  if (err) {
    console.error('Task update error:', err)
    error.value = err.message
    return
  }

  emit('updated')
}
</script>