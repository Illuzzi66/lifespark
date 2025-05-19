import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { getTodos, addTodo, toggleTodo, deleteTodo } from '@/lib/local-storage';
import { Todo } from '@/types';

export const TodoModule: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const updatedTodos = addTodo(newTask.trim());
    setTodos(updatedTodos);
    setNewTask('');
  };

  const handleToggleTodo = (id: string) => {
    const updatedTodos = toggleTodo(id);
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id: string) => {
    const updatedTodos = deleteTodo(id);
    setTodos(updatedTodos);
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold">To-Do List</CardTitle>
        <Button size="sm" variant="ghost" className="p-1 rounded-full hover:bg-gray-100">
          <Plus className="h-5 w-5 text-gray-600" />
        </Button>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No tasks yet. Add one below!</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <Checkbox 
                  checked={todo.completed} 
                  onCheckedChange={() => handleToggleTodo(todo.id)}
                  className="h-4 w-4 text-primary rounded focus:ring-primary"
                />
                <span className={`ml-3 text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="ml-auto p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
        
        <form className="mt-4 flex" onSubmit={handleAddTodo}>
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow px-3 py-2 text-sm border border-gray-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Add a new task..."
          />
          <Button 
            type="submit"
            className="px-3 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90"
          >
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TodoModule;
