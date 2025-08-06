import { useState, useEffect } from 'react';
import { Task, Habit, Hive } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import Tasks from '@/components/Tasks';
import Habits from '@/components/Habits';
import { useToast } from '@/hooks/use-toast';

// Default hives
const defaultHives: Hive[] = [
  {
    id: 'work',
    name: 'Work',
    color: 'work',
    description: 'Professional tasks and goals',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'personal',
    name: 'Personal',
    color: 'personal',
    description: 'Personal development and life goals',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fitness',
    name: 'Fitness',
    color: 'fitness',
    description: 'Health and fitness activities',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'learning',
    name: 'Learning',
    color: 'learning',
    description: 'Educational pursuits and skill development',
    createdAt: new Date().toISOString(),
  },
];

const HabitHive = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'habits'>('dashboard');
  const [tasks, setTasks] = useLocalStorage<Task[]>('habit-hive-tasks', []);
  const [habits, setHabits] = useLocalStorage<Habit[]>('habit-hive-habits', []);
  const [hives, setHives] = useLocalStorage<Hive[]>('habit-hive-hives', defaultHives);
  const { toast } = useToast();

  // Task handlers
  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task created! 🎯",
      description: `"${newTask.title}" has been added to your hive.`,
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    toast({
      title: "Task updated! ✏️",
      description: "Your task has been successfully updated.",
    });
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({
      title: "Task deleted! 🗑️",
      description: `"${taskToDelete?.title}" has been removed from your hive.`,
    });
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updated = {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };
        toast({
          title: updated.completed ? "Task completed! 🎉" : "Task reopened! 🔄",
          description: `"${task.title}" has been ${updated.completed ? 'completed' : 'reopened'}.`,
        });
        return updated;
      }
      return task;
    }));
  };

  // Habit handlers
  const handleAddHabit = (habitData: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completions'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      streak: 0,
      completions: [],
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
    toast({
      title: "Habit created! 🌱",
      description: `"${newHabit.title}" has been added to your routine.`,
    });
  };

  const handleUpdateHabit = (id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(habit => 
      habit.id === id ? { ...habit, ...updates } : habit
    ));
    toast({
      title: "Habit updated! ✏️",
      description: "Your habit has been successfully updated.",
    });
  };

  const handleDeleteHabit = (id: string) => {
    const habitToDelete = habits.find(h => h.id === id);
    setHabits(prev => prev.filter(habit => habit.id !== id));
    toast({
      title: "Habit deleted! 🗑️",
      description: `"${habitToDelete?.title}" has been removed from your routine.`,
    });
  };

  const handleCompleteHabit = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === id) {
        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted).toISOString().split('T')[0] : null;
        const isConsecutive = lastCompleted === new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const updatedHabit = {
          ...habit,
          lastCompleted: today,
          completions: [...habit.completions, today],
          streak: isConsecutive || habit.streak === 0 ? habit.streak + 1 : 1,
        };
        
        toast({
          title: `Habit completed! 🔥`,
          description: `"${habit.title}" • ${updatedHabit.streak} day streak!`,
        });
        
        return updatedHabit;
      }
      return habit;
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto max-w-7xl">
        {currentView === 'dashboard' && (
          <Dashboard tasks={tasks} habits={habits} hives={hives} />
        )}
        
        {currentView === 'tasks' && (
          <Tasks
            tasks={tasks}
            hives={hives}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        )}
        
        {currentView === 'habits' && (
          <Habits
            habits={habits}
            hives={hives}
            onAddHabit={handleAddHabit}
            onUpdateHabit={handleUpdateHabit}
            onDeleteHabit={handleDeleteHabit}
            onCompleteHabit={handleCompleteHabit}
          />
        )}
      </main>
    </div>
  );
};

export default HabitHive;
