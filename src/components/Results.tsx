
import { useState } from "react";
import { Users, Clock, Target, Download, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CountResult } from "../pages/Index";
import { toast } from "sonner";

interface ResultsProps {
  result: CountResult | null;
}

const Results = ({ result }: ResultsProps) => {
  const [showImage, setShowImage] = useState(true);

  if (!result) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Results Yet</h3>
        <p className="text-gray-500">Capture an image to see head count results here</p>
      </div>
    );
  }

  const confidenceColor = result.confidence >= 0.9 ? "bg-green-500" : 
                         result.confidence >= 0.7 ? "bg-yellow-500" : "bg-red-500";

  const handleDownload = () => {
    // In a real app, this would download the processed image with detection boxes
    toast.success("Download feature will be available in production version");
  };

  const handleShare = () => {
    const shareData = {
      title: 'Hall Vision Count Result',
      text: `Detected ${result.headCount} people in lecture hall with ${(result.confidence * 100).toFixed(1)}% confidence`,
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.text);
      toast.success("Result copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          <Target className="h-5 w-5" />
          Detection Results
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Result Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-5xl font-bold text-blue-600">
                {result.headCount}
              </div>
              <div className="text-lg text-gray-700">
                People Detected
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge className={`${confidenceColor} text-white`}>
                  {(result.confidence * 100).toFixed(1)}% Confidence
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Display */}
        {showImage && result.imageUrl && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Processed Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <img
                  src={result.imageUrl}
                  alt="Processed lecture hall"
                  className="w-full rounded-lg shadow-md"
                />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {result.headCount} detected
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                * In production, this image would show detection boxes around each detected person
              </p>
            </CardContent>
          </Card>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Timestamp</p>
                  <p className="text-xs text-gray-600">
                    {result.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.sessionName && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Session</p>
                    <p className="text-xs text-gray-600">
                      {result.sessionName}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowImage(!showImage)}
          >
            {showImage ? "Hide" : "Show"} Image
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export default Results;
