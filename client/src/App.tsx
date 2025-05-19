import { useState, useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import { ApiKeyModal } from "@/components/modals/ApiKeyModal";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";

function Router() {
  // Track page views when routes change
  useAnalytics();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  // Check if API keys are needed on initial load
  useEffect(() => {
    const deepaiKey = localStorage.getItem('deepai_api_key');
    const openaiKey = localStorage.getItem('openai_api_key');
    
    // Show modal if either key is missing or empty
    if (!deepaiKey || !openaiKey || deepaiKey === '' || openaiKey === '') {
      setShowApiKeyModal(true);
    }
  }, []);

  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Verify required environment variable is present
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ApiKeyModal
          isOpen={showApiKeyModal}
          onClose={() => setShowApiKeyModal(false)}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
