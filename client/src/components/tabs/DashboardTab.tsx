import { QuoteDisplay } from '@/components/modules/QuoteDisplay';
import { TodoModule } from '@/components/modules/TodoModule';
import { HabitTracker } from '@/components/modules/HabitTracker';
import { JournalModule } from '@/components/modules/JournalModule';
import { ZodiacModule } from '@/components/modules/ZodiacModule';
import { CartoonModule } from '@/components/modules/CartoonModule';
import { BioGenerator } from '@/components/modules/BioGenerator';
import { AdBanner } from '@/components/shared/AdBanner';

export const DashboardTab: React.FC = () => {
  return (
    <div>
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdBanner 
          adSlot="dashboard_top" 
          adFormat="horizontal" 
          adPosition="dashboard_top"
          className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>

      {/* Motivational Quote */}
      <QuoteDisplay />

      {/* Dashboard Grid - Main Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <TodoModule />
        <HabitTracker />
        <JournalModule />
        <ZodiacModule />
        <CartoonModule />
        <BioGenerator />
      </div>

      {/* Bottom Banner Ad */}
      <div className="mt-6">
        <AdBanner 
          adSlot="dashboard_bottom" 
          adFormat="responsive" 
          adPosition="dashboard_bottom"
          className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>
    </div>
  );
};

export default DashboardTab;
