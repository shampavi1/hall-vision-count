
import { useState } from "react";
import { Camera, History, BarChart3, Users, FileSignature, RotateCcw } from "lucide-react";
import CameraCapture from "../components/CameraCapture";
import SignatureScanner from "../components/SignatureScanner";
import AttendanceComparison from "../components/AttendanceComparison";
import SessionHistory from "../components/SessionHistory";
import LoginForm from "../components/LoginForm";
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [sessionName, setSessionName] = useState("");

  const handleNewCount = (result: CountResult) => {
    const resultWithSession = { ...result, sessionName: sessionName || undefined };
    setCountResults(prev => [resultWithSession, ...prev]);
    setCurrentResult(resultWithSession);
  };

  const handleSignatureScanned = (result: { count: number; imageUrl: string }) => {
    setSignatureResult(result);
  };

  const handleProcessComparison = () => {
    if (currentResult && signatureResult) {
      const updatedResult = {
        ...currentResult,
        signatureCount: signatureResult.count,
        isMatched: Math.abs(currentResult.headCount - signatureResult.count) <= 1
      };
      setCurrentResult(updatedResult);
      setActiveTab("comparison");
    }
  };

  const handleReset = () => {
    setCurrentResult(null);
    setSignatureResult(null);
    setSessionName("");
    setActiveTab("capture");
  };

  const handleStoreRecord = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      // Store the record logic here
      if (currentResult) {
        setCountResults(prev => {
          const updated = prev.map(result => 
            result.id === currentResult.id ? currentResult : result
          );
          return updated;
        });
      }
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
      setShowLogin(false);
      // Auto-store record after successful login
      if (currentResult) {
        setCountResults(prev => {
          const updated = prev.map(result => 
            result.id === currentResult.id ? currentResult : result
          );
          return updated;
        });
      }
    }
  };

  if (showLogin) {
    return <LoginForm onLogin={handleLogin} onCancel={() => setShowLogin(false)} />;
  }

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
              Attendance
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI Powered Smart Attendance system
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
        <div className="flex justify-center gap-4 mb-8">
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

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100/50">
              <TabsTrigger value="capture" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Capture</span>
              </TabsTrigger>
              <TabsTrigger value="signature" className="flex items-center gap-2">
                <FileSignature className="h-4 w-4" />
                <span className="hidden sm:inline">Signature</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2"
                disabled={!isLoggedIn}
              >
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
              {currentResult && signatureResult && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleProcessComparison}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    size="lg"
                  >
                    Process Comparison
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <AttendanceComparison 
                result={currentResult} 
                onStoreRecord={handleStoreRecord}
                isLoggedIn={isLoggedIn}
                sessionName={sessionName}
                onSessionNameChange={setSessionName}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              {isLoggedIn ? (
                <SessionHistory 
                  results={countResults} 
                  onSelectResult={(result) => {
                    setCurrentResult(result);
                    setActiveTab("comparison");
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">Login Required</h3>
                  <p className="text-gray-500 mb-4">Please login to access attendance history</p>
                  <Button onClick={() => setShowLogin(true)}>Login</Button>
                </div>
              )}
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
