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
  status: 'active' | 'completed' | 'archived' | null  // ← added null
  color: string | null
  created_at: string
  updated_at: string
  task_count?: number
}

export interface Task {
  id: string
  project_id: string
  user_id: string
  title: string
  description: string | null
  priority: 'low' | 'medium' | 'high' | null          // ← added null
  status: 'todo' | 'in_progress' | 'done' | null      // ← added null
  due_date: string | null
  created_at: string
  updated_at: string
  project?: {
    name: string
    color: string | null
  }
}