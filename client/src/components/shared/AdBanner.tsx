import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import { getAdUnit } from '@/lib/adsense-config';

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
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [adAttempted, setAdAttempted] = useState(false);

  useEffect(() => {
    try {
      // Track ad impression
      trackEvent('ad_impression', 'monetization', adPosition);
      
      // Get the ad unit configuration
      const adUnit = getAdUnit(adSlot);
      
      // Mark that we've attempted to load the ad
      setAdAttempted(true);
      
      // Check if AdSense is loaded
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Push the ad to AdSense for rendering
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Consider ad loaded after a brief delay (AdSense doesn't provide direct load callbacks)
        setTimeout(() => {
          setIsAdLoaded(true);
        }, 2000);
      }
    } catch (error) {
      console.error('Error initializing AdSense ad:', error);
      setIsAdLoaded(false);
    }
  }, [adPosition, adSlot]);

  // Generate a publisher ID from environment or use a fallback
  const publisherId = import.meta.env.VITE_ADSENSE_PUBLISHER_ID || 'ca-pub-0000000000000000';
  
  // Get the configured ad unit info
  const adUnit = getAdUnit(adSlot);

  return (
    <div className={`${className} relative overflow-hidden`}>
      {/* AdSense Ad Code */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', height: '100%', position: 'relative', zIndex: 1 }}
        data-ad-client={publisherId}
        data-ad-slot={adUnit.adUnitId}
        data-ad-format={adFormat || adUnit.adSize}
        data-full-width-responsive="true"
      />
      
      {/* Fallback content when ads are not loaded or being loaded */}
      {(!isAdLoaded || !adAttempted) && (
        <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
          <div className="text-center">
            <p>Advertisement</p>
            <p className="text-xs mt-1 text-gray-400">{adUnit.description}</p>
          </div>
        </div>
      )}
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
