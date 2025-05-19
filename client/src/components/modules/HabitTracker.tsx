import { useState, useEffect } from 'react';
import { Plus, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { getHabits, addHabit, toggleHabitDay, deleteHabit } from '@/lib/local-storage';
import { Habit } from '@/types';

export const HabitTracker: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  
  // Day names for display
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  useEffect(() => {
    setHabits(getHabits());
  }, []);

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;
    
    const updatedHabits = addHabit(newHabitName.trim());
    setHabits(updatedHabits);
    setNewHabitName('');
    setShowAddDialog(false);
  };

  const handleToggleDay = (habitId: string, dayIndex: number) => {
    const updatedHabits = toggleHabitDay(habitId, dayIndex);
    setHabits(updatedHabits);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = deleteHabit(habitId);
    setHabits(updatedHabits);
  };

  // Calculate progress percentage for each habit
  const getProgress = (days: boolean[]): { completed: number, percentage: number } => {
    const completed = days.filter(day => day).length;
    const percentage = (completed / 7) * 100;
    return { completed, percentage };
  };

  return (
    <>
      <Card className="widget-card">
        <CardHeader className="widget-card-header">
          <CardTitle className="text-lg font-semibold">Habit Tracker</CardTitle>
          <Button 
            size="sm" 
            variant="ghost" 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </Button>
        </CardHeader>
        
        <CardContent className="widget-card-body">
          <div className="space-y-4">
            {habits.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No habits yet. Add one to get started!</p>
            ) : (
              habits.map(habit => {
                const progress = getProgress(habit.days);
                
                return (
                  <div key={habit.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{habit.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">{`${progress.completed}/7 days`}</span>
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full" 
                            style={{ width: `${progress.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex justify-between">
                      {dayNames.map((day, index) => (
                        <button 
                          key={index}
                          onClick={() => handleToggleDay(habit.id, index)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            habit.days[index] 
                              ? 'bg-green-100 text-green-500' 
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {habit.days[index] ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            day
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="mt-2 flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Habit Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="habitName" className="text-sm font-medium">
                Habit Name
              </label>
              <Input 
                id="habitName"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="e.g., Morning meditation"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHabit}>
              Add Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HabitTracker;
