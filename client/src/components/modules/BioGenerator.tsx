import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { getApiKeys } from '@/lib/local-storage';
import { BioType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

export const BioGenerator: React.FC = () => {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [bioType, setBioType] = useState<BioType>('instagram');
  const [generatedBio, setGeneratedBio] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateBio = async () => {
    if (!name.trim() || !interests.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name and interests",
        variant: "destructive"
      });
      return;
    }
    
    // Since we need to properly access the OpenAI API key in this environment
    const keys = getApiKeys();
    const apiKey = keys.openai;
    
    setLoading(true);
    
    // Track this event in Google Analytics
    trackEvent('generate_bio', 'creativity', bioType);
    
    try {
      // Create the prompt based on the selected bio type
      let prompt = '';
      
      switch (bioType) {
        case 'instagram':
          prompt = `Generate a short and engaging Instagram bio for ${name} who is interested in ${interests}. Include relevant emojis and make it catchy.`;
          break;
        case 'linkedin':
          prompt = `Write a professional LinkedIn bio for ${name} who is interested in ${interests}. Keep it concise, professional, and highlight expertise.`;
          break;
        case 'twitter':
          prompt = `Create a witty Twitter bio for ${name} who is into ${interests}. Make it short, punchy, and include relevant hashtags.`;
          break;
        case 'facebook':
          prompt = `Create a friendly and personal Facebook bio for ${name} who loves ${interests}. Make it relatable, warm, and include some personal touches.`;
          break;
        case 'tiktok':
          prompt = `Generate a trendy TikTok bio for ${name} who creates content about ${interests}. Make it ultra-short, catchy, with emojis and trending hashtags.`;
          break;
      }
      
      // Make API request to OpenAI
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: "system", 
              content: "You are a social media expert who creates engaging bios for different platforms."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          response_format: { type: "text" }
        })
      });
      
      const data = await response.json();
      
      if (data.choices && data.choices[0].message.content) {
        setGeneratedBio(data.choices[0].message.content);
        // Track successful generation
        trackEvent('bio_generated_success', 'creativity', bioType);
      } else {
        throw new Error(data.error?.message || "Failed to generate bio");
      }
    } catch (error) {
      // Track failure
      trackEvent('bio_generated_error', 'creativity', error instanceof Error ? error.message : 'unknown_error');
      
      toast({
        title: "Error generating bio",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedBio);
    // Track this copy event in analytics
    trackEvent('copy_bio', 'engagement', bioType);
    toast({
      title: "Copied!",
      description: "Bio copied to clipboard"
    });
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold">Bio Generator</CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
          <Input 
            type="text" 
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200" 
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="interests" className="block text-sm font-medium mb-1">Your Interests (separated by commas)</label>
          <Input
            type="text"
            id="interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200"
          />
        </div>
        
        <div className="mb-4">
          <span className="block text-sm font-medium mb-1">Generate For</span>
          <RadioGroup value={bioType} onValueChange={(value) => setBioType(value as BioType)}>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label htmlFor="instagram">Instagram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linkedin" id="linkedin" />
                <Label htmlFor="linkedin">LinkedIn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="twitter" id="twitter" />
                <Label htmlFor="twitter">Twitter</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facebook" id="facebook" />
                <Label htmlFor="facebook">Facebook</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="tiktok" id="tiktok" />
                <Label htmlFor="tiktok">TikTok</Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Button 
          className="w-full px-4 py-2 bg-primary text-white"
          onClick={generateBio}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Bio"}
        </Button>
        
        {generatedBio && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm italic">{generatedBio}</p>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-500">Generated using OpenAI</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-primary hover:underline"
                onClick={copyToClipboard}
              >
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BioGenerator;
