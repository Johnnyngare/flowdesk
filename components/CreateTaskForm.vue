<template>
  <div class="p-6">
    <h2 class="text-white text-lg font-bold mb-1">Add Task</h2>
    <p class="text-gray-500 text-sm mb-6">Create a new task in this project</p>

    <div class="space-y-4">
      <div>
        <label class="text-gray-400 text-sm block mb-1.5">
          Task Title <span class="text-red-400">*</span>
        </label>
        <UInput
          v-model="form.title"
          placeholder="e.g. Design the login page"
          size="lg"
          class="w-full"
        />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Description</label>
        <UTextarea
          v-model="form.description"
          placeholder="Optional notes about this task"
          :rows="3"
          class="w-full"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-gray-400 text-sm block mb-1.5">Priority</label>
          <USelect
            v-model="form.priority"
            :options="priorityOptions"
            size="lg"
            class="w-full"
          />
        </div>
        <div>
          <label class="text-gray-400 text-sm block mb-1.5">Status</label>
          <USelect
            v-model="form.status"
            :options="statusOptions"
            size="lg"
            class="w-full"
          />
        </div>
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Due Date (optional)</label>
        <UInput
          v-model="form.due_date"
          type="date"
          size="lg"
          class="w-full"
        />
      </div>
    </div>

    <p v-if="error" class="text-red-400 text-sm mt-4">{{ error }}</p>

    <div class="flex gap-3 justify-end mt-6">
      <UButton label="Cancel" color="neutral" variant="ghost" @click="$emit('cancel')" />
      <UButton label="Create Task" color="primary" :loading="loading" @click="handleCreate" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ projectId: string }>()
const emit = defineEmits(['created', 'cancel'])

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
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  due_date: '',
})

async function handleCreate() {
  error.value = ''

  if (!form.title.trim()) {
    error.value = 'Task title is required.'
    return
  }

  const { data: { session } } = await supabase.auth.getSession()

  console.log('Session at task insert time:', session?.user?.id)

  if (!session) {
    error.value = 'You are not logged in. Please refresh and try again.'
    return
  }

  loading.value = true

  const { error: err } = await supabase
    .from('tasks')
    .insert({
      user_id: session.user.id,      
      project_id: props.projectId,
      title: form.title.trim(),
      description: form.description.trim() || null,
      priority: form.priority,
      status: form.status,
      due_date: form.due_date || null,
    })

  loading.value = false

  if (err) {
    console.error('Task insert error:', err)
    error.value = err.message
    return
  }

  emit('created')
}
</script>