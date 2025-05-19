import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key } from 'lucide-react';
import { getApiKeys, saveApiKeys } from '@/lib/local-storage';
import { useToast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [deepaiKey, setDeepaiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const { toast } = useToast();

  // Load existing API keys when modal opens
  useEffect(() => {
    if (isOpen) {
      const keys = getApiKeys();
      setDeepaiKey(keys.deepai);
      setOpenaiKey(keys.openai);
    }
  }, [isOpen]);

  const handleSave = () => {
    saveApiKeys(deepaiKey, openaiKey);
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved locally",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            API Key Setup
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            To use all features of LifeSpark, you'll need to configure your API keys. 
            These are stored locally on your device and never sent to any server.
          </p>
        </div>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deepai-key">DeepAI API Key</Label>
            <Input
              id="deepai-key"
              type="text"
              value={deepaiKey}
              onChange={(e) => setDeepaiKey(e.target.value)}
              placeholder="Enter your DeepAI API key"
            />
            <p className="text-xs text-gray-500">
              Used for the Cartoon Generator feature. Get a key at <a href="https://deepai.org" target="_blank" rel="noopener noreferrer" className="text-primary underline">deepai.org</a>
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="openai-key">OpenAI API Key</Label>
            <Input
              id="openai-key"
              type="text"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
            />
            <p className="text-xs text-gray-500">
              Used for the Bio Generator feature. Get a key at <a href="https://openai.com/api" target="_blank" rel="noopener noreferrer" className="text-primary underline">openai.com/api</a>
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
