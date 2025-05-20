import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiKeys } from '@/lib/local-storage';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

export const CartoonModule: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cartoonImage, setCartoonImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      setOriginalImage(reader.result as string);
      setCartoonImage(null); // Clear any previous cartoon
      // Track this event in analytics
      trackEvent('image_uploaded', 'creativity', 'cartoon_generator');
    };
    
    reader.readAsDataURL(file);
  };

  const generateCartoon = async () => {
    if (!originalImage) {
      toast({
        title: "Missing image",
        description: "Please upload a photo first",
        variant: "destructive"
      });
      return;
    }
    
    // Get DeepAI API key from localStorage
    const keys = getApiKeys();
    const apiKey = keys.deepai;
    
    if (!apiKey) {
      toast({
        title: "Missing API Key",
        description: "Please set your DeepAI API key in settings",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Track this event in analytics
    trackEvent('generate_cartoon', 'creativity', 'cartoon_generator');
    
    try {
      // Create form data with the image
      const formData = new FormData();
      
      // Convert base64 image to blob
      const base64Data = originalImage.split(',')[1];
      const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
      
      formData.append('image', blob);
      
      // Make API request to DeepAI
      const response = await fetch("https://api.deepai.org/api/cartoon-gan", {
        method: "POST",
        headers: {
          "api-key": apiKey,
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (data.output_url) {
        setCartoonImage(data.output_url);
        // Track successful generation
        trackEvent('cartoon_generated_success', 'creativity', 'cartoon_generator');
        toast({
          title: "Success!",
          description: "Your cartoon image was created"
        });
      } else {
        throw new Error(data.status || "Unknown error");
      }
    } catch (error) {
      // Track failure
      trackEvent('cartoon_generated_error', 'creativity', error instanceof Error ? error.message : 'unknown_error');
      toast({
        title: "Error generating cartoon",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold">Cartoon Generator</CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        <div className="text-center">
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Your Photo</p>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {originalImage ? (
                    <img 
                      src={originalImage} 
                      alt="Original" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Cartoon Version</p>
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {cartoonImage ? (
                    <img 
                      src={cartoonImage} 
                      alt="Cartoon" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-xs text-gray-400">
                      {loading ? "Generating..." : "Cartoon will appear here"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-sm mb-3">Upload your photo to convert it into a cartoon:</p>
            <label className="block">
              <span className="sr-only">Choose photo</span>
              <input 
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-medium
                      file:bg-primary/10 file:text-primary
                      hover:file:bg-primary/20 transition-colors
                      cursor-pointer"
              />
            </label>
            <Button 
              className="mt-4 w-full px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              onClick={generateCartoon}
              disabled={!originalImage || loading}
            >
              {loading ? "Generating..." : "Generate Cartoon"}
            </Button>
            <p className="mt-2 text-xs text-gray-500">Powered by DeepAI Cartoonizer</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartoonModule;
