import { MiniGame } from '@/components/modules/MiniGame';
import { AdBanner } from '@/components/shared/AdBanner';

export const GamesTab: React.FC = () => {
  return (
    <div>
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdBanner 
          adSlot="games_top" 
          adFormat="horizontal" 
          adPosition="games_top"
          className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>

      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Mini Games</h2>
        <p className="text-gray-600 mb-6">
          Take a break and have some fun! These quick games can help refresh your
          mind and provide a moment of enjoyment during your busy day.
        </p>
        
        <MiniGame />
      </div>

      {/* Side Banner Ad */}
      <div className="mt-6">
        <AdBanner 
          adSlot="xxx" 
          adFormat="responsive" 
          className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>
    </div>
  );
};

export default GamesTab;
