// Shared types
export interface Task {
  id: string
  content: string
  labels: string[]
  assignee: string
  timeSpent: number
  checklist: { text: string; completed: boolean }[]
  comments: { text: string; author: string; timestamp: string }[]
  weeklyTotal: number
  monthlyTotal: number
  weeklyBestRecord: number
  monthlyBestRecord: number
}

export interface Column {
  id: string
  title: string
  taskIds: string[]
}

// TaskCard props
export interface TaskCardProps {
  task: Task
  index: number
  onEditTask: (taskId: string, updatedFields: Partial<Task>) => void
  onOpenTaskModal: (taskId: string) => void
  onStartTimer: (taskId: string) => void
  onStopTimer: () => void
  isActive: boolean
}

// TaskList props
export interface TaskListProps {
  column: Column
  tasks: Task[]
  index: number
  onEditListTitle: (columnId: string, newTitle: string) => void
  onAddTask: (columnId: string) => void
  onEditTask: (taskId: string, updatedFields: Partial<Task>) => void
  onOpenTaskModal: (taskId: string) => void
  onStartTimer: (taskId: string) => void
  onStopTimer: () => void
  activeTaskId: string | null
}

// TaskModal props
export interface TaskModalProps {
  task: Task
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
}

// PersistentHeader props
export interface PersistentHeaderProps {
  activeTask: Task | null
  elapsedTime: number
  onStopTimer: () => void
  onStartTimer: (taskId: string | null, taskContent: string, labels: string[]) => void
  tasks: { [key: string]: Task }
}
