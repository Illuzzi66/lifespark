import { ZodiacModule } from '@/components/modules/ZodiacModule';
import { CartoonModule } from '@/components/modules/CartoonModule';
import { BioGenerator } from '@/components/modules/BioGenerator';
import { AdBanner } from '@/components/shared/AdBanner';

export const CreativityTab: React.FC = () => {
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

      <h2 className="text-2xl font-bold mb-6">Creative Tools</h2>
      <p className="text-gray-600 mb-6">
        Unleash your creativity with these fun tools. Generate cartoon avatars,
        discover your zodiac traits, and create social media bios effortlessly.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ZodiacModule />
        <CartoonModule />
        <BioGenerator />
      </div>

      {/* Bottom Banner Ad */}
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

export default CreativityTab;
