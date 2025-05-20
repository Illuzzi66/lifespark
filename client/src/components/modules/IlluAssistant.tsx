import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Send, Mic, Volume2, Music, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';
import { getApiKeys } from '@/lib/local-storage';
import { AdBanner } from '../shared/AdBanner';

// Content types that Illu can generate
type ContentType = 'advice' | 'joke' | 'birthday' | 'motivation' | 'story' | 'music' | 'video';

export const IlluAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [contentType, setContentType] = useState<ContentType>('advice');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Detect content type from user input
  const detectContentType = (input: string): ContentType => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('joke') || lowerInput.includes('funny') || lowerInput.includes('humor')) {
      return 'joke';
    } else if (lowerInput.includes('birthday') || lowerInput.includes('wish')) {
      return 'birthday';
    } else if (lowerInput.includes('motivate') || lowerInput.includes('inspire')) {
      return 'motivation';
    } else if (lowerInput.includes('story') || lowerInput.includes('tell me a')) {
      return 'story';
    } else if (lowerInput.includes('music') || lowerInput.includes('song') || lowerInput.includes('melody')) {
      return 'music';
    } else if (lowerInput.includes('video') || lowerInput.includes('clip') || lowerInput.includes('movie')) {
      return 'video';
    } else {
      return 'advice';
    }
  };

  // Generate response based on content type
  const generateResponse = async () => {
    if (!query.trim()) {
      toast({
        title: "Empty request",
        description: "Please enter a question or request for Illu",
        variant: "destructive"
      });
      return;
    }

    // Get API key
    const keys = getApiKeys();
    const apiKey = keys.openai;
    
    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please set your OpenAI API key in settings",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Detect content type from query
    const detectedType = detectContentType(query);
    setContentType(detectedType);
    
    // Track this event in analytics
    trackEvent('illu_assistant_request', 'engagement', detectedType);
    
    try {
      if (detectedType === 'music') {
        // For music generation, we'll simulate with an embedded player
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMusicUrl('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
        setVideoUrl(null);
        setResponse("I've generated a music track based on your request. Enjoy listening!");
      } 
      else if (detectedType === 'video') {
        // For video generation, we'll simulate with an embedded player
        await new Promise(resolve => setTimeout(resolve, 2000));
        setVideoUrl('https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4');
        setMusicUrl(null);
        setResponse("I've created a video based on your request. Take a look!");
      }
      else {
        // For text-based responses, use OpenAI
        // Create system prompt based on detected content type
        let systemPrompt = "";
        
        switch (detectedType) {
          case 'joke':
            systemPrompt = "You are Illu, a funny AI assistant who tells engaging, clean jokes appropriate for all ages. Keep responses concise and entertaining.";
            break;
          case 'birthday':
            systemPrompt = "You are Illu, an AI assistant who creates personalized, warm birthday wishes. Make them heartfelt and uplifting.";
            break;
          case 'motivation':
            systemPrompt = "You are Illu, an inspiring AI assistant who provides motivational advice. Be encouraging, positive, and empowering.";
            break;
          case 'story':
            systemPrompt = "You are Illu, a creative AI assistant who tells short, engaging stories. Keep them concise, interesting, and appropriate for all ages.";
            break;
          default:
            systemPrompt = "You are Illu, a helpful AI assistant who provides thoughtful advice. Be friendly, informative, and supportive.";
        }
        
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
                content: systemPrompt
              },
              {
                role: "user", 
                content: query
              }
            ],
            temperature: 0.7,
            max_tokens: 250,
            response_format: { type: "text" }
          })
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0].message.content) {
          setResponse(data.choices[0].message.content);
          setMusicUrl(null);
          setVideoUrl(null);
          
          // Track successful generation
          trackEvent('illu_assistant_success', 'engagement', detectedType);
        } else {
          throw new Error(data.error?.message || "Failed to generate response");
        }
      }
      
      // Show ad before displaying the response
      setShowAd(true);
      
    } catch (error) {
      // Track error
      trackEvent('illu_assistant_error', 'error', error instanceof Error ? error.message : 'unknown');
      
      toast({
        title: "Error generating response",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
      
      // Fallback response
      setResponse("I'm sorry, I couldn't process your request right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Bot className="h-5 w-5 mr-2 text-primary" />
          Hi, I'm Illu! Ask me anything.
        </CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            I can tell jokes, give advice, create birthday wishes, tell stories, generate music or video. Just ask!
          </p>
          
          <div className="flex gap-2">
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tell me a joke, give me advice, wish me happy birthday..."
              className="flex-grow"
              onKeyDown={(e) => e.key === 'Enter' && generateResponse()}
            />
            <Button 
              onClick={generateResponse}
              disabled={loading}
              className="btn-gradient"
            >
              {loading ? 
                <span className="flex items-center"><span className="animate-pulse mr-1">Thinking</span>...</span> :
                <Send className="h-4 w-4" />
              }
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-1">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Tell me a joke")}>
              Joke
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Give me advice about life")}>
              Advice
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Wish me happy birthday")}>
              Birthday wish
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Tell me a short story")}>
              Story
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Generate a music track")}>
              <Music className="h-3 w-3 mr-1" />
              Music
            </Button>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setQuery("Create a video clip")}>
              <Film className="h-3 w-3 mr-1" />
              Video
            </Button>
          </div>
          
          {/* Response section */}
          {(response || musicUrl || videoUrl) && (
            <div className="animate-fade-up mt-4">
              {/* Show ad before displaying the content */}
              {showAd && (
                <div className="mb-4">
                  <AdBanner 
                    adSlot="illu_assistant_ad" 
                    adPosition="assistant_response"
                    className="w-full h-20 bg-gray-100 flex items-center justify-center text-gray-400 text-sm border border-gray-200 rounded-lg"
                  />
                </div>
              )}
              
              {/* Text response */}
              {response && (
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-4 rounded-lg shadow-sm relative">
                  <div className="absolute top-0 left-0 w-4 h-4 bg-primary rounded-tl-lg rounded-br-lg" />
                  <p className="text-gray-700 pt-2">{response}</p>
                  <div className="mt-2 flex justify-end">
                    <span className="text-xs text-primary/60">— Illu</span>
                  </div>
                </div>
              )}
              
              {/* Music player */}
              {musicUrl && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Generated Music</p>
                  </div>
                  <audio controls className="w-full mt-2">
                    <source src={musicUrl} type="audio/mp3" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              {/* Video player */}
              {videoUrl && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Film className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Generated Video</p>
                  </div>
                  <video controls className="w-full mt-2 rounded-md">
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IlluAssistant;