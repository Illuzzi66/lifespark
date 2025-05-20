import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, Image, Video, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { trackEvent } from '@/lib/analytics';
import { AdBanner } from '../shared/AdBanner';

export const MediaDownloader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [adTimerCount, setAdTimerCount] = useState(5);
  const [adCompleted, setAdCompleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(fileUrl);
    
    // Determine file type
    if (file.type.startsWith('image/')) {
      setFileType('image');
      trackEvent('image_uploaded', 'media', file.type);
    } else if (file.type.startsWith('video/')) {
      setFileType('video');
      trackEvent('video_uploaded', 'media', file.type);
    }
  };

  // Clear the selected file
  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileType(null);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Show ad dialog before download
  const initiateDownload = () => {
    setShowAdDialog(true);
    setAdTimerCount(5);
    setAdCompleted(false);
    
    // Track start of ad display
    trackEvent('pre_download_ad_shown', 'monetization', fileType || 'unknown');
    
    // Start countdown timer
    const timerInterval = setInterval(() => {
      setAdTimerCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timerInterval);
          setAdCompleted(true);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);
  };

  // Handle actual download after ad is shown
  const completeDownload = () => {
    if (!selectedFile || !previewUrl) return;
    
    // Create a download link and click it
    const downloadLink = downloadLinkRef.current;
    if (downloadLink) {
      downloadLink.href = previewUrl;
      downloadLink.download = selectedFile.name;
      downloadLink.click();
      
      // Track download event
      trackEvent('media_downloaded', 'engagement', fileType || 'unknown');
    }
    
    // Close the ad dialog
    setShowAdDialog(false);
  };

  return (
    <Card className="widget-card">
      <CardHeader className="widget-card-header">
        <CardTitle className="text-lg font-semibold">Media Transformer</CardTitle>
      </CardHeader>
      
      <CardContent className="widget-card-body">
        {!selectedFile ? (
          // Upload interface
          <div className="text-center">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-base font-medium">Upload your media</p>
              <p className="text-sm text-gray-500 mb-2">
                Drag and drop your image or video here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: JPG, PNG, GIF, MP4, WebM
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                <Image className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium">Import Images</p>
                <p className="text-xs text-gray-500">Transform and enhance</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                <Video className="h-8 w-8 text-primary mb-2" />
                <p className="text-sm font-medium">Import Videos</p>
                <p className="text-xs text-gray-500">Optimize and edit</p>
              </div>
            </div>
          </div>
        ) : (
          // Preview and download interface
          <div>
            <div className="relative mb-4">
              <button 
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                onClick={clearSelection}
              >
                <X className="h-4 w-4" />
              </button>
              
              {fileType === 'image' && (
                <img 
                  src={previewUrl || ''} 
                  alt="Preview" 
                  className="w-full rounded-lg object-contain max-h-64 mx-auto"
                />
              )}
              
              {fileType === 'video' && (
                <video 
                  src={previewUrl || ''} 
                  controls
                  className="w-full rounded-lg max-h-64 mx-auto"
                />
              )}
            </div>
            
            <div className="space-y-3">
              <div className="text-sm">
                <p>
                  <span className="font-medium">File name:</span> {selectedFile.name}
                </p>
                <p>
                  <span className="font-medium">Size:</span> {Math.round(selectedFile.size / 1024)} KB
                </p>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600 text-white"
                onClick={initiateDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
              
              <p className="text-xs text-center text-gray-500">
                A brief ad will be shown before your download starts
              </p>
            </div>
          </div>
        )}
        
        {/* Hidden download link */}
        <a ref={downloadLinkRef} className="hidden" />
        
        {/* Ad Dialog */}
        <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your download is preparing...</DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              {/* Ad container */}
              <div className="mb-4 rounded-lg overflow-hidden">
                <AdBanner 
                  adSlot="download_interstitial" 
                  adFormat="medium_rectangle"
                  adPosition="download_popup"
                  className="w-full h-60 bg-gray-100 flex items-center justify-center"
                />
              </div>
              
              {/* Timer display */}
              {!adCompleted ? (
                <p className="text-center text-sm">
                  Your download will be ready in <span className="font-bold">{adTimerCount}</span> seconds...
                </p>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 mb-3">Your download is ready!</p>
                  <Button
                    className="bg-primary text-white"
                    onClick={completeDownload}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </Button>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAdDialog(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default MediaDownloader;