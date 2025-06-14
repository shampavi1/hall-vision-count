
import { CheckCircle, XCircle, AlertTriangle, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CountResult } from "../pages/Index";
import { SignatureResult } from "./SignatureScanner";

interface AttendanceComparisonProps {
  headCountResult: CountResult | null;
  signatureResult: SignatureResult | null;
}

const AttendanceComparison = ({ headCountResult, signatureResult }: AttendanceComparisonProps) => {
  if (!headCountResult || !signatureResult) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Missing Data</h3>
        <p className="text-gray-500">
          Please scan both the lecture hall and signature sheet to compare attendance
        </p>
      </div>
    );
  }

  const headCount = headCountResult.headCount;
  const signatureCount = signatureResult.signatureCount;
  const difference = Math.abs(headCount - signatureCount);
  const isMatched = difference <= 2; // Allow small margin of error
  const matchPercentage = Math.min(headCount, signatureCount) / Math.max(headCount, signatureCount) * 100;

  const getStatusColor = () => {
    if (isMatched) return "text-green-600";
    if (difference <= 5) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (isMatched) return <CheckCircle className="h-8 w-8 text-green-600" />;
    if (difference <= 5) return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    return <XCircle className="h-8 w-8 text-red-600" />;
  };

  const getStatusText = () => {
    if (isMatched) return "Attendance Verified";
    if (difference <= 5) return "Minor Discrepancy";
    return "Major Discrepancy Detected";
  };

  const getStatusBadge = () => {
    if (isMatched) return <Badge className="bg-green-500 text-white">Verified</Badge>;
    if (difference <= 5) return <Badge className="bg-yellow-500 text-white">Warning</Badge>;
    return <Badge className="bg-red-500 text-white">Alert</Badge>;
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          {getStatusIcon()}
          Attendance Verification
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Status Card */}
        <Card className={`border-2 ${isMatched ? 'border-green-200 bg-green-50' : difference <= 5 ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className={`text-2xl font-bold ${getStatusColor()}`}>
                {getStatusText()}
              </div>
              <div className="flex justify-center">
                {getStatusBadge()}
              </div>
              <div className="text-sm text-gray-600">
                Match Accuracy: {matchPercentage.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Head Count</p>
                  <p className="text-2xl font-bold text-blue-600">{headCount}</p>
                  <p className="text-xs text-gray-500">
                    {(headCountResult.confidence * 100).toFixed(1)}% confidence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Signature Count</p>
                  <p className="text-2xl font-bold text-green-600">{signatureCount}</p>
                  <p className="text-xs text-gray-500">
                    {(signatureResult.confidence * 100).toFixed(1)}% confidence
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Difference:</span>
                <span className={`font-semibold ${getStatusColor()}`}>
                  {difference} {difference === 1 ? 'person' : 'people'}
                </span>
              </div>
              
              {!isMatched && (
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-700">
                    {headCount > signatureCount ? 
                      `${difference} people may have attended without signing, or signatures may be unclear.` :
                      `${difference} signatures may be duplicates or from people who left early.`
                    }
                  </p>
                </div>
              )}

              {isMatched && (
                <div className="p-3 rounded-lg bg-green-50">
                  <p className="text-sm text-green-700">
                    ✓ Attendance records match! No signs of fake signatures detected.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </div>
  );
};

export default AttendanceComparison;

