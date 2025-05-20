import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import { getApiKeys } from '@/lib/local-storage';
import { AdBanner } from '../shared/AdBanner';

// Angel number database with common interpretations
const angelNumberMeanings: Record<string, string> = {
  "111": "Angel number 111 represents manifestation, new beginnings, and alignment with your true purpose. This number is a sign that your thoughts are manifesting quickly, so focus on positive thinking.",
  "222": "Angel number 222 symbolizes balance, harmony, and partnership. It suggests that you're on the right path and encourages you to maintain faith and trust in the journey.",
  "333": "Angel number 333 indicates that ascended masters are nearby, offering their support and guidance. This number brings creative energy and encourages self-expression.",
  "444": "Angel number 444 signifies protection and stability. Your angels are surrounding you, offering their guidance and encouragement. This number reminds you that you are never alone.",
  "555": "Angel number 555 represents significant life changes and transformation. While change can be challenging, this number reassures you that these changes are necessary for your growth.",
  "666": "Contrary to popular belief, angel number 666 is not negative. It reminds you to balance your material and spiritual life, suggesting you may be focusing too much on worldly concerns.",
  "777": "Angel number 777 is a highly spiritual number symbolizing divine guidance and spiritual awakening. It indicates you're on the right path in your spiritual journey.",
  "888": "Angel number 888 represents abundance, financial prosperity, and success. It suggests that material rewards for your efforts are coming your way.",
  "999": "Angel number 999 signifies completion and the end of a cycle in your life. It encourages you to let go of what no longer serves you to make room for new beginnings.",
  "1010": "Angel number 1010 encourages you to pay attention to your thoughts and intuition. It suggests that you're aligned with your soul's mission and reminds you of your infinite potential.",
  "1111": "Angel number 1111 is a powerful manifestation number. It signifies a wake-up call from the universe, encouraging you to focus on your desires as they're manifesting rapidly.",
  "1212": "Angel number 1212 symbolizes balance and harmony in your life journey. It encourages you to maintain positive thoughts and stay focused on your personal truths and spiritual growth.",
  "1234": "Angel number 1234 represents progression and forward movement. It suggests that you're on the right path and encourages you to continue moving forward with determination."
};

export const AngelNumberInterpreter: React.FC = () => {
  const [angelNumber, setAngelNumber] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const { toast } = useToast();

  // Check if the input is a valid angel number (numeric)
  const isValidAngelNumber = (num: string) => /^\d+$/.test(num);

  const interpretAngelNumber = async () => {
    if (!angelNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter an angel number to interpret",
        variant: "destructive"
      });
      return;
    }

    if (!isValidAngelNumber(angelNumber)) {
      toast({
        title: "Invalid input",
        description: "Angel numbers should contain only digits",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Track this event in analytics
    trackEvent('interpret_angel_number', 'spiritual', angelNumber);

    try {
      // First check our database for common angel numbers
      if (angelNumberMeanings[angelNumber]) {
        // Short delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 800));
        setInterpretation(angelNumberMeanings[angelNumber]);
        setShowAd(true);
      } else {
        // For numbers not in our database, use OpenAI
        // Get API key
        const keys = getApiKeys();
        const apiKey = keys.openai;
        
        if (!apiKey) {
          toast({
            title: "Missing API Key",
            description: "Please set your OpenAI API key in settings",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        // Create the prompt for interpretation
        const prompt = `Provide a spiritual interpretation for angel number ${angelNumber}. Explain what this number might signify in a person's life, including its spiritual meaning and potential guidance. Keep the interpretation positive, inspiring, and under 150 words.`;
        
        // Make API request to OpenAI
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
            messages: [
              {
                role: "system", 
                content: "You are a spiritual guide specializing in numerology and angel numbers."
              },
              {
                role: "user", 
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 200,
            response_format: { type: "text" }
          })
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0].message.content) {
          setInterpretation(data.choices[0].message.content);
          setShowAd(true);
          
          // Track successful interpretation
          trackEvent('angel_number_interpreted_success', 'spiritual', angelNumber);
        } else {
          throw new Error(data.error?.message || "Failed to generate interpretation");
        }
      }
    } catch (error) {
      // Track error
      trackEvent('angel_number_interpreted_error', 'spiritual', error instanceof Error ? error.message : 'unknown');
      
      toast({
        title: "Error interpreting angel number",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // Fallback interpretation for when API fails
      setInterpretation(`We couldn't generate a custom interpretation for ${angelNumber} at this time. Angel numbers are repeating number sequences believed to carry divine guidance by suggesting synchronicity. Try again later for a detailed interpretation.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-primary" />
          Angel Number Interpreter
        </CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body space-y-4">
        <div>
          <p className="text-gray-600 mb-4">
            Angel numbers are sequences of numbers that carry divine guidance. Enter a number to discover its spiritual meaning.
          </p>
          
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={angelNumber}
              onChange={(e) => setAngelNumber(e.target.value.replace(/[^0-9]/g, ''))}
              className="flex-grow"
              placeholder="Enter an angel number (e.g. 1111)"
              maxLength={5}
            />
            <Button 
              onClick={interpretAngelNumber}
              disabled={loading}
              className="btn-gradient px-4 py-2"
            >
              {loading ? "Interpreting..." : "Interpret"}
            </Button>
          </div>
        </div>
        
        {interpretation && (
          <div className="animate-fade-up">
            {/* Show ad before interpretation on some interpretations */}
            {showAd && (
              <div className="mb-4">
                <AdBanner 
                  adSlot="spiritual_ad" 
                  adPosition="angel_number"
                  className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg"
                />
              </div>
            )}
            
            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2 text-primary">
                Angel Number {angelNumber}
              </h3>
              <p className="text-gray-700">{interpretation}</p>
              
              <div className="mt-4 text-xs text-gray-500 flex items-center">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Trust in the guidance this number brings to your life.</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Popular angel numbers */}
        <div className="pt-4">
          <h3 className="text-sm font-medium mb-2">Popular Angel Numbers:</h3>
          <div className="flex flex-wrap gap-2">
            {['111', '222', '333', '444', '555', '777', '888', '1111', '1212'].map((num) => (
              <Button 
                key={num}
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => {
                  setAngelNumber(num);
                  interpretAngelNumber();
                }}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AngelNumberInterpreter;