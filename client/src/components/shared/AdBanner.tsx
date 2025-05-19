import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface AdBannerProps {
  className?: string;
  adSlot?: string;
  adFormat?: string;
  adPosition?: string; // For analytics tracking (e.g., 'top', 'bottom', 'sidebar')
}

export const AdBanner: React.FC<AdBannerProps> = ({
  className = 'w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg',
  adSlot = 'auto',
  adFormat = 'auto',
  adPosition = 'unknown'
}) => {
  useEffect(() => {
    try {
      // Track ad impression
      trackEvent('ad_impression', 'monetization', adPosition);
      
      // Check if AdSense is loaded
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Push the ad to AdSense for rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
    }
  }, [adPosition]);

  // Generate a publisher ID from environment or use a fallback
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-placeholder';

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%' }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
      {/* Fallback content when ads are not loaded */}
      <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
        Advertisement
      </div>
    </div>
  );
};

// Declare the global adsbygoogle array
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default AdBanner;
