export const useAnalytics = () => {
  const supabase = useSupabaseClient()

  const projects = ref<any[]>([])
  const tasks = ref<any[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchAnalyticsData() {
    loading.value = true
    error.value = null

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { loading.value = false; return }

    const [projectsRes, tasksRes] = await Promise.all([
      supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id),
      supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: true }),
    ])

    if (projectsRes.error) error.value = projectsRes.error.message
    if (tasksRes.error) error.value = tasksRes.error.message

    projects.value = projectsRes.data || []
    tasks.value = tasksRes.data || []
    loading.value = false
  }

  const totalProjects = computed(() => projects.value.length)
  const activeProjects = computed(() =>
    projects.value.filter(p => p.status === 'active').length
  )
  const totalTasks = computed(() => tasks.value.length)
  const completedTasks = computed(() =>
    tasks.value.filter(t => t.status === 'done').length
  )
  const pendingTasks = computed(() =>
    tasks.value.filter(t => t.status !== 'done').length
  )
  const completionRate = computed(() => {
    if (totalTasks.value === 0) return 0
    return Math.round((completedTasks.value / totalTasks.value) * 100)
  })

  const pieChartData = computed(() => ({
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [{
      data: [
        tasks.value.filter(t => t.status === 'done').length,
        tasks.value.filter(t => t.status === 'in_progress').length,
        tasks.value.filter(t => t.status === 'todo').length,
      ],
      backgroundColor: ['#10b981', '#6366f1', '#f59e0b'],
      borderColor: ['#059669', '#4f46e5', '#d97706'],
      borderWidth: 2,
      hoverOffset: 6,
    }],
  }))

  const priorityChartData = computed(() => ({
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      label: 'Tasks',
      data: [
        tasks.value.filter(t => t.priority === 'high').length,
        tasks.value.filter(t => t.priority === 'medium').length,
        tasks.value.filter(t => t.priority === 'low').length,
      ],
      backgroundColor: [
        'rgba(239,68,68,0.8)',
        'rgba(245,158,11,0.8)',
        'rgba(99,102,241,0.8)',
      ],
      borderColor: ['#ef4444', '#f59e0b', '#6366f1'],
      borderWidth: 2,
      borderRadius: 6,
    }],
  }))

  const lineChartData = computed(() => {
    const counts: Record<string, number> = {}

    tasks.value.forEach(task => {
      const date = new Date(task.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
      counts[date] = (counts[date] || 0) + 1
    })

    const labels = Object.keys(counts)
    const data = Object.values(counts)

    return {
      labels,
      datasets: [{
        label: 'Tasks Created',
        data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointRadius: 4,
        fill: true,
        tension: 0.4,
      }],
    }
  })

  const projectTasksChartData = computed(() => {
    const labels = projects.value.map(p => p.name)
    const data = projects.value.map(p =>
      tasks.value.filter(t => t.project_id === p.id).length
    )

    return {
      labels,
      datasets: [{
        label: 'Tasks',
        data,
        backgroundColor: 'rgba(99,102,241,0.7)',
        borderColor: '#6366f1',
        borderWidth: 2,
        borderRadius: 6,
      }],
    }
  })

  return {
    loading,
    error,
    fetchAnalyticsData,
    totalProjects,
    activeProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    completionRate,
    pieChartData,
    priorityChartData,
    lineChartData,
    projectTasksChartData,
  }
}