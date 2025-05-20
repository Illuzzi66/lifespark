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
import { initializeAdSense } from "./lib/adsense-config";
import { useAnalytics } from "./hooks/use-analytics";

// Custom CSS for a more professional look
import "./index.css";

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
  const [isLoading, setIsLoading] = useState(true);

  // Application initialization
  useEffect(() => {
    // Show a loading screen briefly to ensure proper initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Initialize analytics and ads
  useEffect(() => {
    // Initialize Google Analytics
    if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    } else {
      initGA();
    }
    
    // Initialize Google AdSense
    initializeAdSense();
  }, []);

  // Handle OpenAI API key (now using environment variables)
  useEffect(() => {
    // The OpenAI API key is now handled via environment variables
    // We only need to show the modal for DeepAI
    const deepaiKey = localStorage.getItem('deepai_api_key');
    
    if (!deepaiKey || deepaiKey === '') {
      setShowApiKeyModal(true);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LifeSpark
          </h1>
          <p className="text-gray-500 mt-2">Loading your wellness journey...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
          <Toaster />
          <Router />
          <ApiKeyModal
            isOpen={showApiKeyModal}
            onClose={() => setShowApiKeyModal(false)}
          />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
