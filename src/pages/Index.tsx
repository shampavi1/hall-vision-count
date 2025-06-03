
import { useState } from "react";
import { Camera, History, BarChart3, Users } from "lucide-react";
import CameraCapture from "../components/CameraCapture";
import Results from "../components/Results";
import SessionHistory from "../components/SessionHistory";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

export interface CountResult {
  id: string;
  imageUrl: string;
  headCount: number;
  confidence: number;
  timestamp: Date;
  sessionName?: string;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");
  const [countResults, setCountResults] = useState<CountResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CountResult | null>(null);

  const handleNewCount = (result: CountResult) => {
    setCountResults(prev => [result, ...prev]);
    setCurrentResult(result);
    setActiveTab("results");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hall Vision Count
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered head counting for lecture halls using advanced computer vision
          </p>
        </div>

        {/* Head Count Display */}
        <div className="flex justify-center mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 text-center">Current Head Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-6xl font-bold text-blue-600 text-center">
                {currentResult?.headCount || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50">
              <TabsTrigger value="capture" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Capture</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">History</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="capture" className="mt-6">
              <CameraCapture onCountComplete={handleNewCount} />
            </TabsContent>

            <TabsContent value="results" className="mt-6">
              <Results result={currentResult} />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <SessionHistory 
                results={countResults} 
                onSelectResult={(result) => {
                  setCurrentResult(result);
                  setActiveTab("results");
                }}
              />
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by YOLO Computer Vision • Built with React & Python</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
