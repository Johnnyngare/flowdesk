<template>
  <div class="p-6">
    <h2 class="text-white text-lg font-bold mb-1">Create Project</h2>
    <p class="text-gray-500 text-sm mb-6">Add a new project to your workspace</p>

    <div class="space-y-4">
      <div>
        <label class="text-gray-400 text-sm block mb-1.5">
          Project Name <span class="text-red-400">*</span>
        </label>
        <UInput
          v-model="form.name"
          placeholder="e.g. FlowDesk Redesign"
          size="lg"
          class="w-full"
        />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Description</label>
        <UTextarea
          v-model="form.description"
          placeholder="What is this project about?"
          :rows="3"
          class="w-full"
        />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-2">Color Label</label>
        <div class="flex gap-2">
          <button
            v-for="color in colors"
            :key="color"
            type="button"
            class="w-7 h-7 rounded-full transition-all duration-150 ring-offset-2
                   ring-offset-[#0b0f1a]"
            :class="[
              `bg-${color}-500`,
              form.color === color ? `ring-2 ring-${color}-500` : ''
            ]"
            @click="form.color = color"
          />
        </div>
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

    <p v-if="error" class="text-red-400 text-sm mt-4">{{ error }}</p>

    <div class="flex gap-3 justify-end mt-6">
      <UButton
        label="Cancel"
        color="neutral"
        variant="ghost"
        @click="$emit('cancel')"
      />
      <UButton
        label="Create Project"
        color="primary"
        :loading="loading"
        @click="handleCreate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['created', 'cancel'])

const supabase = useSupabaseClient()
const loading = ref(false)
const error = ref('')

const colors = ['indigo', 'emerald', 'amber', 'rose', 'blue', 'purple']
const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
  { label: 'Archived', value: 'archived' },
]

const form = reactive({
  name: '',
  description: '',
  color: 'indigo',
  status: 'active',
})

async function handleCreate() {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Project name is required.'
    return
  }

  const { data: { session } } = await supabase.auth.getSession()

  console.log('Session at insert time:', session?.user?.id)

  if (!session) {
    error.value = 'You are not logged in. Please refresh and try again.'
    return
  }

  loading.value = true

  const { error: err } = await supabase
    .from('projects')
    .insert({
      user_id: session.user.id,  
      name: form.name.trim(),
      description: form.description.trim() || null,
      color: form.color,
      status: form.status,
    })

  loading.value = false

  if (err) {
    console.error('Insert error:', err)
    error.value = err.message
    return
  }

  emit('created')
}
</script>