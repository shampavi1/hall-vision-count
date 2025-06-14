
import { useState, useRef } from "react";
import { FileText, Upload, Loader2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

export interface SignatureResult {
  id: string;
  imageUrl: string;
  signatureCount: number;
  confidence: number;
  timestamp: Date;
  sessionName?: string;
}

interface SignatureScannerProps {
  onScanComplete: (result: SignatureResult) => void;
}

const SignatureScanner = ({ onScanComplete }: SignatureScannerProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
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

  const simulateSignatureScanning = async () => {
    setIsProcessing(true);
    
    // Simulate API call to signature recognition service
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock result - in real implementation, this would come from your signature recognition service
    const mockResult: SignatureResult = {
      id: Date.now().toString(),
      imageUrl: selectedImage!,
      signatureCount: Math.floor(Math.random() * 45) + 15, // Random count between 15-60
      confidence: Math.random() * 0.3 + 0.7, // Confidence between 70-100%
      timestamp: new Date(),
      sessionName: sessionName || undefined
    };

    setIsProcessing(false);
    onScanComplete(mockResult);
    
    // Reset form
    setSelectedImage(null);
    setSessionName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    toast.success(`Detected ${mockResult.signatureCount} signatures with ${(mockResult.confidence * 100).toFixed(1)}% confidence`);
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileText className="h-5 w-5" />
          Scan Signature Sheet
        </CardTitle>
        <CardDescription>
          Upload an image of the signature sheet to count signatures
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session Name Input */}
        <div className="space-y-2">
          <Label htmlFor="signature-session-name">Session Name (Optional)</Label>
          <Input
            id="signature-session-name"
            placeholder="e.g., Computer Science 101 - Morning Lecture"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          />
        </div>

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
                <p className="text-sm text-gray-600">Signature sheet ready for scanning</p>
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
            your image will be processed by AI to detect and count signatures.
          </AlertDescription>
        </Alert>

        {/* Process Button */}
        <Button
          onClick={simulateSignatureScanning}
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
              <FileText className="h-4 w-4 mr-2" />
              Scan Signatures
            </>
          )}
        </Button>
      </CardContent>
    </div>
  );
};

export default SignatureScanner;

