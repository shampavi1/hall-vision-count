
import { useState, useRef } from "react";
import { FileSignature, Upload, Loader2, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner";

interface SignatureScannerProps {
  onSignatureScanned: (result: { count: number; imageUrl: string }) => void;
}

const SignatureScanner = ({ onSignatureScanned }: SignatureScannerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image size should be less than 10MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateSignatureProcessing = async () => {
    setIsProcessing(true);
    
    // Simulate API call to signature recognition service
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Mock result - in real implementation, this would come from OCR/signature detection service
    const mockSignatureCount = Math.floor(Math.random() * 50) + 10; // Random count between 10-60
    
    const result = {
      count: mockSignatureCount,
      imageUrl: selectedImage!
    };

    setIsProcessing(false);
    onSignatureScanned(result);
    
    toast.success(`Detected ${mockSignatureCount} signatures`);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileSignature className="h-5 w-5" />
          Scan Signature Sheet
        </CardTitle>
        <CardDescription>
          Upload an image of the signature sheet to count signatures
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Image Upload Area */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors">
            {selectedImage ? (
              <div className="space-y-4">
                <img
                  src={selectedImage}
                  alt="Selected signature sheet"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <p className="text-sm text-gray-600">Signature sheet ready for processing</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700">Upload Signature Sheet</p>
                  <p className="text-sm text-gray-500">
                    Drag and drop or click to select (max 10MB)
                  </p>
                </div>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
              disabled={isProcessing}
            >
              {selectedImage ? "Change Image" : "Select Image"}
            </Button>
          </div>
        </div>

        {/* Processing Info */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This demo uses simulated results. In production, 
            your image will be processed using OCR and signature detection algorithms.
          </AlertDescription>
        </Alert>

        {/* Process Button */}
        <Button
          onClick={simulateSignatureProcessing}
          disabled={!selectedImage || isProcessing}
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
              Scan Signatures
            </>
          )}
        </Button>
      </CardContent>
    </div>
  );
};

export default SignatureScanner;
