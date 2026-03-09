// types/index.ts
export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  plan: 'free' | 'pro' | 'enterprise'
}

export interface Project {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  created_at: string
  task_count?: number
}

export interface Task {
  id: string
  project_id: string
  user_id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  created_at: string
}