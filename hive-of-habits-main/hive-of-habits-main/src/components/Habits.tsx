import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Target, Calendar, CheckCircle, Circle, Search, Flame } from 'lucide-react';
import { Habit, Hive } from '@/types';
import { cn } from '@/lib/utils';

interface HabitsProps {
  habits: Habit[];
  hives: Hive[];
  onAddHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'streak' | 'completions'>) => void;
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onCompleteHabit: (id: string) => void;
}

const Habits = ({ habits, hives, onAddHabit, onUpdateHabit, onDeleteHabit, onCompleteHabit }: HabitsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHive, setFilterHive] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'monthly',
    hiveId: '',
  });

  const filteredHabits = useMemo(() => {
    return habits.filter(habit => {
      const matchesSearch = habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           habit.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHive = filterHive === 'all' || habit.hiveId === filterHive;
      
      return matchesSearch && matchesHive;
    });
  }, [habits, searchTerm, filterHive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.hiveId) return;

    if (editingHabit) {
      onUpdateHabit(editingHabit.id, formData);
      setEditingHabit(null);
    } else {
      onAddHabit(formData);
    }

    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      hiveId: '',
    });
    setShowForm(false);
  };

  const handleEdit = (habit: Habit) => {
    setFormData({
      title: habit.title,
      description: habit.description,
      frequency: habit.frequency,
      hiveId: habit.hiveId,
    });
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingHabit(null);
    setFormData({
      title: '',
      description: '',
      frequency: 'daily',
      hiveId: '',
    });
  };

  const canCompleteToday = (habit: Habit) => {
    if (!habit.lastCompleted) return true;
    
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = new Date(habit.lastCompleted).toISOString().split('T')[0];
    
    return today !== lastCompleted;
  };

  const getNextDue = (habit: Habit) => {
    if (!habit.lastCompleted) return 'Due now';
    
    const lastCompleted = new Date(habit.lastCompleted);
    const today = new Date();
    
    switch (habit.frequency) {
      case 'daily':
        const nextDay = new Date(lastCompleted);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay <= today ? 'Due now' : `Due ${nextDay.toLocaleDateString()}`;
      case 'weekly':
        const nextWeek = new Date(lastCompleted);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek <= today ? 'Due now' : `Due ${nextWeek.toLocaleDateString()}`;
      case 'monthly':
        const nextMonth = new Date(lastCompleted);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth <= today ? 'Due now' : `Due ${nextMonth.toLocaleDateString()}`;
      default:
        return 'Due now';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Habits</h2>
          <p className="text-muted-foreground">Build consistency, one day at a time</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-gradient flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
          />
        </div>
        
        <select
          value={filterHive}
          onChange={(e) => setFilterHive(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
        >
          <option value="all">All Hives</option>
          {hives.map(hive => (
            <option key={hive.id} value={hive.id}>{hive.name}</option>
          ))}
        </select>
      </div>

      {/* Habit Form */}
      {showForm && (
        <div className="card-elegant p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                  required
                  placeholder="e.g., Drink 8 glasses of water"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Frequency *</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                rows={3}
                placeholder="Describe your habit and why it's important to you..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Hive *</label>
              <select
                value={formData.hiveId}
                onChange={(e) => setFormData(prev => ({ ...prev, hiveId: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                required
              >
                <option value="">Select a hive</option>
                {hives.map(hive => (
                  <option key={hive.id} value={hive.id}>{hive.name}</option>
                ))}
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gradient"
              >
                {editingHabit ? 'Update Habit' : 'Create Habit'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habits List */}
      <div className="space-y-4">
        {filteredHabits.length > 0 ? (
          filteredHabits.map(habit => {
            const hive = hives.find(h => h.id === habit.hiveId);
            const canComplete = canCompleteToday(habit);
            const nextDue = getNextDue(habit);
            
            return (
              <div key={habit.id} className="card-elegant p-6">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => canComplete && onCompleteHabit(habit.id)}
                    className={cn(
                      "mt-1 flex-shrink-0",
                      canComplete ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                    )}
                    disabled={!canComplete}
                  >
                    {canComplete ? (
                      <Circle className="w-6 h-6 text-muted-foreground hover:text-success transition-colors" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-success" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">
                          {habit.title}
                        </h3>
                        {habit.description && (
                          <p className="text-sm mt-1 text-muted-foreground">
                            {habit.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          {hive && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium hive-${hive.color} text-foreground`}>
                              {hive.name}
                            </span>
                          )}
                          
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                            <Calendar className="w-3 h-3 mr-1" />
                            {habit.frequency}
                          </span>
                          
                          {habit.streak > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
                              <Flame className="w-3 h-3 mr-1" />
                              {habit.streak} day streak
                            </span>
                          )}
                          
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
                            nextDue === 'Due now' ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                          )}>
                            <Target className="w-3 h-3 mr-1" />
                            {nextDue}
                          </span>
                        </div>
                        
                        {habit.lastCompleted && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Last completed: {new Date(habit.lastCompleted).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(habit)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteHabit(habit.id)}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No habits found</h3>
            <p className="text-muted-foreground mb-4">
              {habits.length === 0 
                ? "Create your first habit to start building consistency!" 
                : "Try adjusting your search or filters."
              }
            </p>
            {habits.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-gradient"
              >
                Create Your First Habit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;