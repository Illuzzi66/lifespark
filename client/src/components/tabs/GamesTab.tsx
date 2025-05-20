import { MiniGame } from '@/components/modules/MiniGame';
import { MemoryGame } from '@/components/modules/MemoryGame';
import { MediaDownloader } from '@/components/modules/MediaDownloader';
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
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Games & Media Center
        </h2>
        <p className="text-gray-600 mb-6">
          Take a break and have some fun! These games and tools can help refresh your
          mind and provide a moment of enjoyment during your busy day.
        </p>
        
        {/* Memory Match Game - Added beautiful new game */}
        <div className="mb-8">
          <MemoryGame />
        </div>
        
        {/* In-feed Advertisement */}
        <div className="my-8">
          <AdBanner 
            adSlot="in_feed" 
            adFormat="responsive" 
            adPosition="games_in_feed"
            className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
          />
        </div>
        
        {/* Media Downloader - With ad display before download */}
        <div className="mb-8">
          <MediaDownloader />
        </div>
        
        {/* Original Word/Trivia Games */}
        <div className="mb-8">
          <MiniGame />
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <div className="mt-6">
        <AdBanner 
          adSlot="games_bottom" 
          adFormat="responsive" 
          adPosition="games_bottom"
          className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>
    </div>
  );
};

export default GamesTab;
