// composables/useTasks.ts
import type { Task } from '~/types'

export const useTasks = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchTasks() {
    if (!user.value) return

    loading.value = true
    error.value = null

    const { data, error: err } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name, color)
      `)
      .order('created_at', { ascending: false })

    loading.value = false

    if (err) {
      error.value = err.message
      return
    }

    tasks.value = (data as Task[]) || []
  }

  async function fetchRecentTasks(limit = 5) {
    if (!user.value) return

    loading.value = true

    const { data, error: err } = await supabase
      .from('tasks')
      .select(`
        *,
        project:projects(name, color)
      `)
      .neq('status', 'done')
      .order('created_at', { ascending: false })
      .limit(limit)

    loading.value = false

    if (!err) {
      tasks.value = (data as Task[]) || []
    }
  }

  const openTasks = computed(() =>
    tasks.value.filter(t => t.status !== 'done')
  )

  const completedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'done')
  )

  const highPriorityTasks = computed(() =>
    tasks.value.filter(t => t.priority === 'high' && t.status !== 'done')
  )

  return {
    tasks,
    loading,
    error,
    openTasks,
    completedTasks,
    highPriorityTasks,
    fetchTasks,
    fetchRecentTasks,
  }
}