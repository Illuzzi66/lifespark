import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { getRandomQuote } from '@/lib/quotes';
import { Quote } from '@/types';
import { trackEvent } from '@/lib/analytics';

export const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  
  useEffect(() => {
    // Get a random quote on initial load
    const randomQuote = getRandomQuote();
    setQuote(randomQuote);
    
    // Track quote impression
    if (randomQuote) {
      trackEvent('view_quote', 'engagement', randomQuote.author);
    }
  }, []);
  
  if (!quote) return null;

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl mb-6">
      <div className="flex items-start space-x-4">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <p className="text-lg font-medium italic">"{quote.text}"</p>
          <p className="text-gray-600 mt-2">- {quote.author}</p>
        </div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
