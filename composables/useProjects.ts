// composables/useProjects.ts
import type { Project } from '~/types'

export const useProjects = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchProjects() {
    if (!user.value) return

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    loading.value = false

    if (err) {
      error.value = err.message
      return
    }

    // Cast to our Project type — we trust our own database schema
    projects.value = (data as Project[]) || []
  }

  const activeProjects = computed(() =>
    projects.value.filter(p => p.status === 'active')
  )

  const completedProjects = computed(() =>
    projects.value.filter(p => p.status === 'completed')
  )

  return {
    projects,
    loading,
    error,
    activeProjects,
    completedProjects,
    fetchProjects,
  }
}