<template>
  <div class="p-6">
    <h2 class="text-white text-lg font-bold mb-1">Edit Project</h2>
    <p class="text-gray-500 text-sm mb-6">Update your project details</p>

    <div class="space-y-4">
      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Project Name</label>
        <UInput v-model="form.name" size="lg" class="w-full" />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Description</label>
        <UTextarea v-model="form.description" :rows="3" class="w-full" />
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-2">Color Label</label>
        <div class="flex gap-2">
          <button
            v-for="color in colors"
            :key="color"
            type="button"
            class="w-7 h-7 rounded-full transition-all ring-offset-2 ring-offset-[#0b0f1a]"
            :class="[`bg-${color}-500`, form.color === color ? `ring-2 ring-${color}-500` : '']"
            @click="form.color = color"
          />
        </div>
      </div>

      <div>
        <label class="text-gray-400 text-sm block mb-1.5">Status</label>
        <USelect v-model="form.status" :options="statusOptions" size="lg" class="w-full" />
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
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()
const emit = defineEmits(['updated', 'cancel'])

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
  name: props.project.name,
  description: props.project.description || '',
  color: props.project.color || 'indigo',
  status: props.project.status || 'active',
})

async function handleUpdate() {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Project name is required.'
    return
  }

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    error.value = 'You are not logged in. Please refresh and try again.'
    return
  }

  loading.value = true

  const { error: err } = await supabase
    .from('projects')
    .update({
      name: form.name.trim(),
      description: form.description.trim() || null,
      color: form.color,
      status: form.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', props.project.id)
    .eq('user_id', session.user.id) 

  loading.value = false

  if (err) {
    console.error('Update error:', err)
    error.value = err.message
    return
  }

  emit('updated')
}
</script>