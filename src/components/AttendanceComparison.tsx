
import { CheckCircle, XCircle, Users, FileSignature, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CountResult } from "../pages/Index";

interface AttendanceComparisonProps {
  result: CountResult | null;
  onStoreRecord: () => void;
  isLoggedIn: boolean;
}

const AttendanceComparison = ({ result, onStoreRecord, isLoggedIn }: AttendanceComparisonProps) => {
  if (!result || result.signatureCount === undefined) {
    return (
      <div className="text-center py-12">
        <FileSignature className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No Comparison Data</h3>
        <p className="text-gray-500">Please scan both lecture hall image and signature sheet first</p>
      </div>
    );
  }

  const isMatched = result.isMatched;
  const difference = Math.abs(result.headCount - result.signatureCount!);

  return (
    <div className="space-y-6">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2">
          {isMatched ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600" />
          )}
          Attendance Comparison
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Comparison Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">{result.headCount}</div>
              <div className="text-sm text-gray-600">Head Count</div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <FileSignature className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">{result.signatureCount}</div>
              <div className="text-sm text-gray-600">Signature Count</div>
            </CardContent>
          </Card>
        </div>

        {/* Match Status */}
        <Card className={`${isMatched ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <CardContent className="pt-6 text-center">
            {isMatched ? (
              <div className="space-y-2">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                <h3 className="text-lg font-semibold text-green-800">Attendance Verified</h3>
                <p className="text-green-700">
                  Head count and signatures match! No fake signatures detected.
                </p>
                <Badge className="bg-green-600 text-white">
                  ✓ Verified
                </Badge>
              </div>
            ) : (
              <div className="space-y-2">
                <XCircle className="h-12 w-12 text-red-600 mx-auto" />
                <h3 className="text-lg font-semibold text-red-800">Attendance Mismatch</h3>
                <p className="text-red-700">
                  {difference} {difference === 1 ? 'person' : 'people'} difference detected. 
                  Please verify attendance manually.
                </p>
                <Badge className="bg-red-600 text-white">
                  ⚠ Mismatch
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Store Record Button */}
        <div className="text-center">
          <Button
            onClick={onStoreRecord}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            size="lg"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isLoggedIn ? 'Store Record' : 'Store Record (Login Required)'}
          </Button>
        </div>

        {/* Details */}
        <div className="text-center text-sm text-gray-500">
          <p>Timestamp: {result.timestamp.toLocaleString()}</p>
          {result.sessionName && <p>Session: {result.sessionName}</p>}
        </div>
      </CardContent>
    </div>
  );
};

export default AttendanceComparison;
