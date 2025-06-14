
import { useState, useEffect } from "react";
import { Camera, History, BarChart3, Users, FileText, LogOut, Shield } from "lucide-react";
import CameraCapture from "../components/CameraCapture";
import SignatureScanner, { SignatureResult } from "../components/SignatureScanner";
import AttendanceComparison from "../components/AttendanceComparison";
import Results from "../components/Results";
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
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("capture");
  const [countResults, setCountResults] = useState<CountResult[]>([]);
  const [signatureResults, setSignatureResults] = useState<SignatureResult[]>([]);
  const [currentResult, setCurrentResult] = useState<CountResult | null>(null);
  const [currentSignatureResult, setCurrentSignatureResult] = useState<SignatureResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("attendanceUser");
    if (savedUser) {
      setIsLoggedIn(true);
      setCurrentUser(savedUser);
    }
  }, []);

  const handleNewCount = (result: CountResult) => {
    setCountResults(prev => [result, ...prev]);
    setCurrentResult(result);
    setActiveTab("results");
  };

  const handleNewSignature = (result: SignatureResult) => {
    setSignatureResults(prev => [result, ...prev]);
    setCurrentSignatureResult(result);
    setActiveTab("comparison");
  };

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("attendanceUser");
    setIsLoggedIn(false);
    setCurrentUser("");
    setActiveTab("capture");
  };

  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header with User Info */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
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
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Welcome, {currentUser}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Head Count Display */}
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
              <CardTitle className="text-sm font-medium text-gray-600 text-center">Signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600 text-center">
                {currentSignatureResult?.signatureCount || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100/50">
              <TabsTrigger value="capture" className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Capture</span>
              </TabsTrigger>
              <TabsTrigger value="signature" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Signatures</span>
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Compare</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
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

            <TabsContent value="signature" className="mt-6">
              <SignatureScanner onScanComplete={handleNewSignature} />
            </TabsContent>

            <TabsContent value="comparison" className="mt-6">
              <AttendanceComparison 
                headCountResult={currentResult} 
                signatureResult={currentSignatureResult} 
              />
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
          <p>Powered by AI Computer Vision • Secure Attendance Management</p>
        </div>
      </div>
    </div>
  );
};

export default Index;

