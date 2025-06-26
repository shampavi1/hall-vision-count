
import { useState, useRef } from "react";
import { FileSignature, Upload, Loader2, AlertCircle, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";

interface SignatureScannerProps {
  onSignatureScanned: (result: { count: number; imageUrl: string }) => void;
  sessionName: string;
  onSessionNameChange: (name: string) => void;
}

const SignatureScanner = ({ onSignatureScanned, sessionName, onSessionNameChange }: SignatureScannerProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      
      // Check file sizes
      for (const file of fileArray) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error("Each image should be less than 10MB");
          return;
        }
      }
      
      // Convert files to data URLs
      const promises = fileArray.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      });
      
      Promise.all(promises).then(dataUrls => {
        setSelectedImages(prev => [...prev, ...dataUrls]);
      });
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const simulateSignatureProcessing = async () => {
    setIsProcessing(true);
    
    // Simulate API call to signature recognition service
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock result - simulate counting signatures across all images
    const mockSignatureCount = Math.floor(Math.random() * 50) + (selectedImages.length * 10); // More images = higher count
    
    const result = {
      count: mockSignatureCount,
      imageUrl: selectedImages[0] // Use first image as representative
    };

    setIsProcessing(false);
    onSignatureScanned(result);
    
    toast.success(`Detected ${mockSignatureCount} signatures across ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}`);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileSignature className="h-5 w-5" />
          Scan Signature Sheets
        </CardTitle>
        <CardDescription>
          Upload multiple images of signature sheets to count signatures
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session Name Input */}
        <div className="space-y-2">
          <Label htmlFor="session-name-signature">Session Name (Optional)</Label>
          <Input
            id="session-name-signature"
            placeholder="e.g., Computer Science 101 - Morning Lecture"
            value={sessionName}
            onChange={(e) => onSessionNameChange(e.target.value)}
          />
        </div>

        {/* Image Upload Area */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
            {selectedImages.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Signature sheet ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  {selectedImages.length} signature sheet{selectedImages.length > 1 ? 's' : ''} ready for processing
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700">Upload Signature Sheets</p>
                  <p className="text-sm text-gray-500">
                    Select multiple images (max 10MB each)
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              disabled={isProcessing}
            >
              {selectedImages.length > 0 ? "Add More Images" : "Select Images"}
            </Button>
          </div>
        </div>

        {/* Processing Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This demo uses simulated results. In production, 
            your images will be processed using OCR and signature detection algorithms.
          </AlertDescription>
        </Alert>

        {/* Process Button */}
        <Button
          onClick={simulateSignatureProcessing}
          disabled={selectedImages.length === 0 || isProcessing}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scanning Signatures...
            </>
          ) : (
            <>
              <FileSignature className="h-4 w-4 mr-2" />
              Scan {selectedImages.length} Signature Sheet{selectedImages.length !== 1 ? 's' : ''}
            </>
          )}
        </Button>
      </CardContent>
    </div>
  );
};

export default SignatureScanner;
