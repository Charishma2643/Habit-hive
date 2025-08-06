import { useMemo } from 'react';
import { Calendar, CheckCircle, Target, TrendingUp, Award, Clock } from 'lucide-react';
import { Task, Habit, Hive, DashboardStats } from '@/types';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  hives: Hive[];
}

const motivationalQuotes = [
  "Small progress is still progress.",
  "Your only limit is your mind.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
];

const Dashboard = ({ tasks, habits, hives }: DashboardProps) => {
  const stats: DashboardStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const activeHabits = habits.length;
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      activeHabits,
      totalStreaks,
      completionRate,
    };
  }, [tasks, habits]);

  const todayQuote = useMemo(() => {
    const today = new Date().toDateString();
    const quoteIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % motivationalQuotes.length;
    return motivationalQuotes[quoteIndex];
  }, []);

  const todayTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate === today || 
      (task.recurrence === 'daily') ||
      (!task.completed && new Date(task.dueDate) < new Date())
    ).slice(0, 5);
  }, [tasks]);

  const activeStreaks = useMemo(() => {
    return habits
      .filter(habit => habit.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);
  }, [habits]);

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-center text-primary-foreground">
        <h2 className="text-3xl font-bold font-poppins mb-4">
          Welcome to Your Hive! 🐝
        </h2>
        <p className="text-lg font-nunito opacity-90 max-w-2xl mx-auto">
          "{todayQuote}"
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
            <span className="text-2xl font-bold text-success">
              {stats.completedTasks}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">Tasks Completed</h3>
          <p className="text-sm text-muted-foreground">
            Out of {stats.totalTasks} total tasks
          </p>
        </div>

        <div className="card-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {stats.activeHabits}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">Active Habits</h3>
          <p className="text-sm text-muted-foreground">
            Building consistency
          </p>
        </div>

        <div className="card-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <Award className="w-8 h-8 text-warning" />
            <span className="text-2xl font-bold text-warning">
              {stats.totalStreaks}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">Total Streaks</h3>
          <p className="text-sm text-muted-foreground">
            Days of consistency
          </p>
        </div>

        <div className="card-elegant p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold text-accent">
              {Math.round(stats.completionRate)}%
            </span>
          </div>
          <h3 className="font-semibold text-foreground">Completion Rate</h3>
          <p className="text-sm text-muted-foreground">
            Overall progress
          </p>
        </div>
      </div>

      {/* Today's Focus & Active Streaks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Tasks */}
        <div className="card-elegant p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold font-poppins">Today's Focus</h3>
          </div>
          
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`w-3 h-3 rounded-full hive-${hives.find(h => h.id === task.hiveId)?.color || 'personal'}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {task.category}
                    </p>
                  </div>
                  {task.completed && <CheckCircle className="w-4 h-4 text-success" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks for today. Great job staying on top of things! 🎉</p>
            </div>
          )}
        </div>

        {/* Active Streaks */}
        <div className="card-elegant p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-warning" />
            <h3 className="text-xl font-semibold font-poppins">Top Streaks</h3>
          </div>
          
          {activeStreaks.length > 0 ? (
            <div className="space-y-3">
              {activeStreaks.map(habit => (
                <div key={habit.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className={`w-3 h-3 rounded-full hive-${hives.find(h => h.id === habit.hiveId)?.color || 'personal'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{habit.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {habit.frequency} • {habit.streak} day streak
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-warning">🔥</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start building habits to see your streaks here! 💪</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;