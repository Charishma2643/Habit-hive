import { useState } from 'react';
import { Calendar, CheckSquare, Target, Home, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  currentView: 'dashboard' | 'tasks' | 'habits';
  onViewChange: (view: 'dashboard' | 'tasks' | 'habits') => void;
}

const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'habits', label: 'Habits', icon: Target },
  ] as const;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-6 bg-card border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-quicksand text-foreground">
            Habit Hive
          </h1>
        </div>
        
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 font-medium",
                currentView === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden lg:block">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-quicksand text-foreground">
              Habit Hive
            </h1>
          </div>
          
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-muted/50">
            <div className="flex flex-col space-y-1 p-4">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    onViewChange(id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium",
                    currentView === id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;