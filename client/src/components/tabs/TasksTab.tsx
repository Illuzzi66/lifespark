import { TodoModule } from '@/components/modules/TodoModule';
import { AdBanner } from '@/components/shared/AdBanner';

export const TasksTab: React.FC = () => {
  return (
    <div>
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdBanner 
          adSlot="tasks_top" 
          adFormat="horizontal" 
          adPosition="tasks_top"
          className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Manage Your Tasks</h2>
        <p className="text-gray-600 mb-6">
          Stay organized and keep track of everything you need to do.
          Add, complete, and remove tasks as you go through your day.
        </p>
        
        <TodoModule />
      </div>
    </div>
  );
};

export default TasksTab;
