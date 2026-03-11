<template>
  <div class="space-y-6">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-white">Projects</h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ projects.length }} total · {{ activeProjects.length }} active
        </p>
      </div>
      <UButton
        label="New Project"
        icon="i-heroicons-plus"
        color="primary"
        @click="showCreateModal = true"
      />
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="i in 6" :key="i"
        class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6 animate-pulse"
      >
        <div class="h-4 bg-[#1a2035] rounded w-3/4 mb-3"></div>
        <div class="h-3 bg-[#1a2035] rounded w-full mb-2"></div>
        <div class="h-3 bg-[#1a2035] rounded w-1/2"></div>
      </div>
    </div>

    <div
      v-else-if="projects.length === 0"
      class="text-center py-20 bg-[#0b0f1a] border border-[#1a2035] 
             border-dashed rounded-xl"
    >
      <UIcon
        name="i-heroicons-folder-plus"
        class="w-12 h-12 text-gray-700 mx-auto mb-4"
      />
      <h3 class="text-white font-semibold mb-2">No projects yet</h3>
      <p class="text-gray-500 text-sm mb-4">
        Create your first project to start tracking tasks
      </p>
      <UButton
        label="Create Project"
        icon="i-heroicons-plus"
        color="primary"
        @click="showCreateModal = true"
      />
    </div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      <div
        v-for="project in projects"
        :key="project.id"
        class="bg-[#0b0f1a] border border-[#1a2035] rounded-xl p-6
               hover:border-indigo-500/30 transition-all duration-200 group"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div
              class="w-3 h-3 rounded-full shrink-0"
              :class="`bg-${project.color || 'indigo'}-500`"
            ></div>
            <h3 class="text-white font-semibold truncate">{{ project.name }}</h3>
          </div>

          <UDropdownMenu
            :items="getProjectActions(project)"
            :popper="{ placement: 'bottom-end' }"
          >
            <UButton
              icon="i-heroicons-ellipsis-horizontal"
              color="neutral"
              variant="ghost"
              size="xs"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </UDropdownMenu>
        </div>

        <p class="text-gray-500 text-sm mb-4 line-clamp-2 min-h-10">
          {{ project.description || 'No description' }}
        </p>

        <div class="flex items-center justify-between">
          <UBadge
            :label="project.status || 'active'"
            :color="project.status === 'completed' ? 'success' :
                    project.status === 'archived' ? 'neutral' : 'primary'"
            variant="soft"
            size="sm"
          />
          <NuxtLink :to="`/dashboard/projects/${project.id}`">
            <UButton
              label="View tasks"
              variant="ghost"
              size="xs"
              color="neutral"
              trailing-icon="i-heroicons-arrow-right"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <UModal v-model:open="showCreateModal" title="Create Project">
      <template #content>
        <CreateProjectForm
          @created="onProjectCreated"
          @cancel="showCreateModal = false"
        />
      </template>
    </UModal>

    <UModal v-model:open="showEditModal" title="Edit Project">
      <template #content>
        <EditProjectForm
          v-if="selectedProject"
          :project="selectedProject"
          @updated="onProjectUpdated"
          @cancel="showEditModal = false"
        />
      </template>
    </UModal>

    <UModal v-model:open="showDeleteModal" title="Delete Project">
      <template #content>
        <div class="p-6">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 class="text-white font-semibold">Delete Project</h3>
              <p class="text-gray-500 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm mb-6">
            Deleting <span class="text-white font-medium">
            "{{ selectedProject?.name }}"</span> will also permanently 
            delete all tasks inside it.
          </p>
          <div class="flex gap-3 justify-end">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              @click="showDeleteModal = false"
            />
            <UButton
              label="Delete Project"
              color="error"
              :loading="deleteLoading"
              @click="confirmDeleteProject"
            />
          </div>
        </div>
      </template>
    </UModal>

  </div>
</template>

<script setup lang="ts">
import type { Project } from '~/types'

definePageMeta({
  layout: 'dashboard',
  middleware: 'auth',
})

const { projects, activeProjects, loading, fetchProjects } = useProjects()
const toast = useToast()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const selectedProject = ref<Project | null>(null)
const deleteLoading = ref(false)

const supabase = useSupabaseClient()

function getProjectActions(project: Project) {
  return [
    [{
      label: 'View tasks',
      icon: 'i-heroicons-eye',
      onSelect: () => navigateTo(`/dashboard/projects/${project.id}`)
    }],
    [{
      label: 'Edit project',
      icon: 'i-heroicons-pencil',
      onSelect: () => {
        selectedProject.value = project
        showEditModal.value = true
      }
    }],
    [{
      label: 'Delete project',
      icon: 'i-heroicons-trash',
      class: 'text-red-400',
      onSelect: () => {
        selectedProject.value = project
        showDeleteModal.value = true
      }
    }]
  ]
}

async function confirmDeleteProject() {
  if (!selectedProject.value) return
  deleteLoading.value = true

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', selectedProject.value.id)

  deleteLoading.value = false

  if (error) {
    toast.add({ title: 'Error deleting project', color: 'error' })
    return
  }

  toast.add({ title: 'Project deleted', color: 'success' })
  showDeleteModal.value = false
  selectedProject.value = null
  await fetchProjects()
}

function onProjectCreated() {
  showCreateModal.value = false
  fetchProjects()
  toast.add({ title: 'Project created!', color: 'success' })
}

function onProjectUpdated() {
  showEditModal.value = false
  fetchProjects()
  toast.add({ title: 'Project updated!', color: 'success' })
}

onMounted(fetchProjects)
</script>