// Google AdSense Configuration Script
// Replace the placeholders with your actual AdSense information when your website is approved

/**
 * This is the main configuration for Google AdSense integration.
 * When your web app is approved, you'll need to:
 * 1. Replace the publisher ID with your actual Google AdSense Publisher ID
 * 2. Update ad units in adsense-config.ts with actual ad unit IDs
 */

// Your AdSense Publisher ID (replace with your actual ID after approval)
export const ADSENSE_PUBLISHER_ID = 'ca-pub-0000000000000000';

// Initialize AdSense on page load
export const initializeAdSense = () => {
  // Skip in development mode
  if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_FORCE_ADS) {
    console.log('AdSense initialization skipped in development mode');
    return;
  }

  try {
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`;
    
    // Append script to head
    document.head.appendChild(script);

    // Initialize adsbygoogle
    window.adsbygoogle = window.adsbygoogle || [];
    
    console.log('Google AdSense initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Google AdSense:', error);
  }
};

// AdSense auto-ad configuration (enable for automatic ad placement)
export const enableAutoAds = () => {
  try {
    // Create meta tag for auto ads
    const meta = document.createElement('meta');
    meta.name = 'google-adsense-account';
    meta.content = ADSENSE_PUBLISHER_ID;
    document.head.appendChild(meta);
    
    console.log('Google AdSense Auto Ads enabled');
  } catch (error) {
    console.error('Failed to enable Auto Ads:', error);
  }
};

// Track ad impressions with analytics
export const trackAdImpression = (adSlot: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_impression', {
      ad_slot: adSlot
    });
  }
};

// Track ad clicks with analytics
export const trackAdClick = (adSlot: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      ad_slot: adSlot
    });
  }
};

// Declare the global adsbygoogle array
declare global {
  interface Window {
    adsbygoogle: any[];
    gtag: (...args: any[]) => void;
  }
}

export default {
  initializeAdSense,
  enableAutoAds,
  trackAdImpression,
  trackAdClick
};