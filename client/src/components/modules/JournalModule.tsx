import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveJournalEntry, getJournalEntryForDate } from '@/lib/local-storage';
import { JournalEntry } from '@/types';
import { trackEvent } from '@/lib/analytics';

export const JournalModule: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [content, setContent] = useState('');
  const [autoSaveIndicator, setAutoSaveIndicator] = useState('');
  
  // Format the current date as ISO string (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Format the current date for display (Month D, YYYY)
  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Load journal entry for the current date
  const loadEntry = useCallback(() => {
    const dateString = formatDate(currentDate);
    const savedEntry = getJournalEntryForDate(dateString);
    
    if (savedEntry) {
      setEntry(savedEntry);
      setContent(savedEntry.content);
    } else {
      setEntry(null);
      setContent('');
    }
  }, [currentDate]);
  
  // Save the journal entry with debounce
  const saveEntry = useCallback(() => {
    if (content.trim() === '') return;
    
    const dateString = formatDate(currentDate);
    saveJournalEntry(dateString, content);
    setAutoSaveIndicator('Auto-saved');
    
    // Track journal entry save
    trackEvent('save_journal_entry', 'productivity', dateString);
    
    // Clear the indicator after 3 seconds
    setTimeout(() => {
      setAutoSaveIndicator('');
    }, 3000);
  }, [currentDate, content]);
  
  // Debounced auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        saveEntry();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [content, saveEntry]);
  
  // Initial load
  useEffect(() => {
    loadEntry();
  }, [loadEntry]);
  
  // Handle date navigation
  const goToPreviousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
    
    // Track navigation to previous day
    trackEvent('journal_navigate', 'navigation', 'previous_day');
  };
  
  const goToNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
    
    // Track navigation to next day
    trackEvent('journal_navigate', 'navigation', 'next_day');
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
    
    // Track navigation to today
    trackEvent('journal_navigate', 'navigation', 'today');
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <div>
          <CardTitle className="text-lg font-semibold">Daily Journal</CardTitle>
          <p className="text-xs text-gray-500 mt-1">Entries auto-save as you type</p>
        </div>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span>{formatDisplayDate(currentDate)}</span>
          </div>
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="p-1.5 text-xs"
              onClick={goToPreviousDay}
            >
              Previous
            </Button>
            <Button 
              size="sm" 
              className="p-1.5 text-xs bg-primary text-white"
              onClick={goToToday}
            >
              Today
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="p-1.5 text-xs"
              onClick={goToNextDay}
            >
              Next
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-44 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none" 
            placeholder="Write your thoughts for today..."
          />
          {autoSaveIndicator && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-500">
              {autoSaveIndicator}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalModule;
