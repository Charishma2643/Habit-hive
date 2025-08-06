export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'monthly';
  hiveId: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  hiveId: string;
  streak: number;
  lastCompleted?: string;
  createdAt: string;
  completions: string[]; // Array of completion dates
}

export interface Hive {
  id: string;
  name: string;
  color: 'work' | 'personal' | 'fitness' | 'learning' | 'creative' | 'health';
  description?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  activeHabits: number;
  totalStreaks: number;
  completionRate: number;
}