import { JournalModule } from '@/components/modules/JournalModule';
import { AdBanner } from '@/components/shared/AdBanner';

export const JournalTab: React.FC = () => {
  return (
    <div>
      {/* Top Banner Ad */}
      <div className="mb-6">
        <AdBanner 
          adSlot="journal_top" 
          adFormat="horizontal" 
          adPosition="journal_top"
          className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg" 
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Daily Journal</h2>
        <p className="text-gray-600 mb-6">
          Capture your thoughts, experiences, and reflections. Journaling helps
          with mindfulness, gratitude, and processing your thoughts and emotions.
        </p>
        
        <JournalModule />
      </div>
    </div>
  );
};

export default JournalTab;
