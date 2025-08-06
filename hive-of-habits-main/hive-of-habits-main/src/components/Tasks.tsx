import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, Calendar, Tag, CheckCircle, Circle, Filter, Search } from 'lucide-react';
import { Task, Hive } from '@/types';
import { cn } from '@/lib/utils';

interface TasksProps {
  tasks: Task[];
  hives: Hive[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTask: (id: string) => void;
}

const Tasks = ({ tasks, hives, onAddTask, onUpdateTask, onDeleteTask, onToggleTask }: TasksProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterHive, setFilterHive] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
    recurrence: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    hiveId: '',
    completed: false,
  });

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesHive = filterHive === 'all' || task.hiveId === filterHive;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && task.completed) ||
                           (filterStatus === 'pending' && !task.completed);
      
      return matchesSearch && matchesHive && matchesStatus;
    });
  }, [tasks, searchTerm, filterHive, filterStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.hiveId) return;

    if (editingTask) {
      onUpdateTask(editingTask.id, formData);
      setEditingTask(null);
    } else {
      onAddTask(formData);
    }

    setFormData({
      title: '',
      description: '',
      category: '',
      dueDate: '',
      recurrence: 'none',
      hiveId: '',
      completed: false,
    });
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description,
      category: task.category,
      dueDate: task.dueDate,
      recurrence: task.recurrence,
      hiveId: task.hiveId,
      completed: task.completed,
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      dueDate: '',
      recurrence: 'none',
      hiveId: '',
      completed: false,
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins">Tasks</h2>
          <p className="text-muted-foreground">Manage your to-dos and projects</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-gradient flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tasks..."
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
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task Form */}
      {showForm && (
        <div className="card-elegant p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingTask ? 'Edit Task' : 'Create New Task'}
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
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                  placeholder="e.g., Work, Personal, Study"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                rows={3}
                placeholder="Describe your task..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Recurrence</label>
                <select
                  value={formData.recurrence}
                  onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-input focus:border-ring focus:outline-none"
                >
                  <option value="none">One-time</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
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
                {editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => {
            const hive = hives.find(h => h.id === task.hiveId);
            return (
              <div key={task.id} className="card-elegant p-4">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground hover:text-success transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={cn(
                          "font-semibold text-lg",
                          task.completed ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className={cn(
                            "text-sm mt-1",
                            task.completed ? "line-through text-muted-foreground" : "text-muted-foreground"
                          )}>
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {hive && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium hive-${hive.color} text-foreground`}>
                              {hive.name}
                            </span>
                          )}
                          
                          {task.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              <Tag className="w-3 h-3 mr-1" />
                              {task.category}
                            </span>
                          )}
                          
                          {task.dueDate && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          
                          {task.recurrence !== 'none' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                              {task.recurrence}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTask(task.id)}
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
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {tasks.length === 0 
                ? "Create your first task to get started!" 
                : "Try adjusting your search or filters."
              }
            </p>
            {tasks.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-gradient"
              >
                Create Your First Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;