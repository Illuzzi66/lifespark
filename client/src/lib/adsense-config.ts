// AdSense Configuration
// Replace these fake ad unit IDs with real ones after Google AdSense approval

interface AdUnitConfig {
  [key: string]: {
    adUnitId: string;
    adSize: string;
    description: string;
  };
}

export const adUnits: AdUnitConfig = {
  // Main ad slots
  top_leaderboard: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Top leaderboard banner on all pages'
  },
  side_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Side banner for desktop views'
  },
  in_feed: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'In-feed ad between content items'
  },
  bottom_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Bottom leaderboard on all pages'
  },
  
  // Tab-specific ads
  dashboard_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Banner ad for dashboard tab'
  },
  tasks_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Banner ad for tasks tab'
  },
  habits_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Banner ad for habits tab'
  },
  journal_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Banner ad for journal tab'
  },
  creativity_banner: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Banner ad for creativity tab'
  },
  games_bottom: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Bottom banner ad for games tab'
  },
  
  // Modal and interstitial ads
  download_interstitial: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'medium_rectangle',
    description: 'Interstitial ad displayed before downloads'
  },
  game_completion: {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'medium_rectangle',
    description: 'Ad shown after game completion'
  }
};

// Helper function to get ad unit details
export const getAdUnit = (slotId: string) => {
  if (adUnits[slotId]) {
    return adUnits[slotId];
  }
  
  // Return a default ad unit if the requested one doesn't exist
  return {
    adUnitId: 'ca-pub-0000000000000000',
    adSize: 'responsive',
    description: 'Default ad unit'
  };
};

// Initialize AdSense
export const initializeAdSense = () => {
  // Add Google AdSense script to the page
  const adScript = document.createElement('script');
  adScript.async = true;
  adScript.crossOrigin = 'anonymous';
  adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0000000000000000';
  document.head.appendChild(adScript);
  
  // Initialize adsbygoogle
  window.adsbygoogle = window.adsbygoogle || [];
};