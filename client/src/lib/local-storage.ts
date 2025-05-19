import { 
  Todo, 
  Habit, 
  JournalEntries, 
  JournalEntry,
  ZodiacInfo
} from '@/types';

// Todo Functions
export const saveTodos = (todos: Todo[]): void => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

export const getTodos = (): Todo[] => {
  const todos = localStorage.getItem('todos');
  return todos ? JSON.parse(todos) : [];
};

export const addTodo = (text: string): Todo[] => {
  const todos = getTodos();
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now()
  };
  
  const updatedTodos = [...todos, newTodo];
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const toggleTodo = (id: string): Todo[] => {
  const todos = getTodos();
  const updatedTodos = todos.map(todo => 
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const deleteTodo = (id: string): Todo[] => {
  const todos = getTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  
  saveTodos(updatedTodos);
  return updatedTodos;
};

// Habit Functions
export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem('habits', JSON.stringify(habits));
};

export const getHabits = (): Habit[] => {
  const habits = localStorage.getItem('habits');
  return habits ? JSON.parse(habits) : [];
};

export const addHabit = (name: string): Habit[] => {
  const habits = getHabits();
  const newHabit: Habit = {
    id: Date.now().toString(),
    name,
    days: [false, false, false, false, false, false, false],
    createdAt: Date.now()
  };
  
  const updatedHabits = [...habits, newHabit];
  saveHabits(updatedHabits);
  return updatedHabits;
};

export const toggleHabitDay = (id: string, dayIndex: number): Habit[] => {
  const habits = getHabits();
  const updatedHabits = habits.map(habit => {
    if (habit.id === id) {
      const updatedDays = [...habit.days];
      updatedDays[dayIndex] = !updatedDays[dayIndex];
      return { ...habit, days: updatedDays };
    }
    return habit;
  });
  
  saveHabits(updatedHabits);
  return updatedHabits;
};

export const deleteHabit = (id: string): Habit[] => {
  const habits = getHabits();
  const updatedHabits = habits.filter(habit => habit.id !== id);
  
  saveHabits(updatedHabits);
  return updatedHabits;
};

// Journal Functions
export const getJournalEntries = (): JournalEntries => {
  const entries = localStorage.getItem('journals');
  return entries ? JSON.parse(entries) : {};
};

export const saveJournalEntry = (date: string, content: string): JournalEntries => {
  const entries = getJournalEntries();
  
  const entry: JournalEntry = {
    date,
    content,
    lastEdited: Date.now()
  };
  
  const updatedEntries = { ...entries, [date]: entry };
  localStorage.setItem('journals', JSON.stringify(updatedEntries));
  return updatedEntries;
};

export const getJournalEntryForDate = (date: string): JournalEntry | null => {
  const entries = getJournalEntries();
  return entries[date] || null;
};

// Zodiac Functions
export const saveZodiacInfo = (info: ZodiacInfo): void => {
  localStorage.setItem('zodiacInfo', JSON.stringify(info));
};

export const getZodiacInfo = (): ZodiacInfo => {
  const info = localStorage.getItem('zodiacInfo');
  return info ? JSON.parse(info) : { month: '', day: '', sign: '' };
};

// API Keys Functions
export const saveApiKeys = (deepai: string, openai: string): void => {
  localStorage.setItem('deepai_api_key', deepai);
  localStorage.setItem('openai_api_key', openai);
};

export const getApiKeys = (): {deepai: string, openai: string} => {
  return {
    deepai: localStorage.getItem('deepai_api_key') || '',
    openai: localStorage.getItem('openai_api_key') || ''
  };
};

// User Name Functions
export const getUserName = (): string => {
  return localStorage.getItem('userName') || 'Guest';
};

export const saveUserName = (name: string): void => {
  localStorage.setItem('userName', name);
};
