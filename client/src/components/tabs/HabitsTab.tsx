import { HabitTracker } from '@/components/modules/HabitTracker';
import { AdBanner } from '@/components/shared/AdBanner';

export const HabitsTab: React.FC = () => {
  return (
    <div>
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdBanner 
          adSlot="xxx" 
          adFormat="horizontal" 
          className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Build Better Habits</h2>
        <p className="text-gray-600 mb-6">
          Consistency is key to personal growth. Track your daily habits and
          watch as small, consistent actions lead to big results over time.
        </p>
        
        <HabitTracker />
      </div>
    </div>
  );
};

export default HabitsTab;
