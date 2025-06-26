
import { useState } from "react";
import { Camera, History, Users, FileSignature, RotateCcw, BarChart3 } from "lucide-react";
import CameraCapture from "../components/CameraCapture";
import SignatureScanner from "../components/SignatureScanner";
import AttendanceComparison from "../components/AttendanceComparison";
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
  signatureCount?: number;
  isMatched?: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");
  const [countResults, setCountResults] = useState<CountResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CountResult | null>(null);
  const [signatureResult, setSignatureResult] = useState<{ count: number; imageUrl: string } | null>(null);
  const [sessionName, setSessionName] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  const handleNewCount = (result: CountResult) => {
    const resultWithSession = { ...result, sessionName: sessionName || undefined };
    setCurrentResult(resultWithSession);
    setShowComparison(false);
  };

  const handleSignatureScanned = (result: { count: number; imageUrl: string }) => {
    setSignatureResult(result);
    setShowComparison(false);
  };

  const handleProcessComparison = () => {
    if (currentResult && signatureResult) {
      const updatedResult = {
        ...currentResult,
        signatureCount: signatureResult.count,
        isMatched: Math.abs(currentResult.headCount - signatureResult.count) <= 1
      };
      setCurrentResult(updatedResult);
      setShowComparison(true);
    }
  };

  const handleStoreRecord = () => {
    if (currentResult) {
      setCountResults(prev => [currentResult, ...prev]);
      setShowComparison(false);
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setSignatureResult(null);
    setSessionName("");
    setShowComparison(false);
    setActiveTab("capture");
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
              Attendance Tracker
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI-powered attendance verification system
          </p>
          
          {/* Reset Button */}
          <div className="mt-4">
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-white/70 backdrop-blur-sm"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Head Count and Signature Count Display */}
        <div className="flex justify-center gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 text-center">Head Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600 text-center">
                {currentResult?.headCount || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 text-center">Signature Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 text-center">
                {signatureResult?.count || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Compare Button */}
        {currentResult && signatureResult && (
          <div className="text-center mb-6">
            <Button 
              onClick={handleProcessComparison}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              size="lg"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare Attendance
            </Button>
          </div>
        )}

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          {showComparison ? (
            <AttendanceComparison 
              result={currentResult} 
              onStoreRecord={handleStoreRecord}
              sessionName={sessionName}
              onSessionNameChange={setSessionName}
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100/50">
                <TabsTrigger value="capture" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Hall Photo</span>
                </TabsTrigger>
                <TabsTrigger value="signature" className="flex items-center gap-2">
                  <FileSignature className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Sheet</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">History</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="capture" className="mt-6">
                <CameraCapture 
                  onCountComplete={handleNewCount}
                  sessionName={sessionName}
                  onSessionNameChange={setSessionName}
                />
              </TabsContent>

              <TabsContent value="signature" className="mt-6">
                <SignatureScanner 
                  onSignatureScanned={handleSignatureScanned}
                  sessionName={sessionName}
                  onSessionNameChange={setSessionName}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <SessionHistory 
                  results={countResults} 
                  onSelectResult={(result) => {
                    setCurrentResult(result);
                    setShowComparison(true);
                  }}
                />
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;
