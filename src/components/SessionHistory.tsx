
import { useState } from "react";
import { Calendar, Users, Clock, Search, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { CountResult } from "../pages/Index";

interface SessionHistoryProps {
  results: CountResult[];
  onSelectResult: (result: CountResult) => void;
}

const SessionHistory = ({ results, onSelectResult }: SessionHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedResults = results
    .filter(result => 
      !searchTerm || 
      result.sessionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.id.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return b.timestamp.getTime() - a.timestamp.getTime();
        case "oldest":
          return a.timestamp.getTime() - b.timestamp.getTime();
        case "highest":
          return b.headCount - a.headCount;
        case "lowest":
          return a.headCount - b.headCount;
        default:
          return 0;
      }
    });

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">No History Yet</h3>
        <p className="text-gray-500">Your counting sessions will appear here</p>
      </div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "bg-green-100 text-green-800";
    if (confidence >= 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="space-y-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Session History ({results.length})
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sessions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Count</SelectItem>
              <SelectItem value="lowest">Lowest Count</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results List */}
        <div className="space-y-3">
          {filteredAndSortedResults.map((result) => (
            <Card 
              key={result.id} 
              className="cursor-pointer hover:shadow-md transition-shadow bg-white/50 hover:bg-white/80"
              onClick={() => onSelectResult(result)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-lg text-blue-600">
                          {result.headCount}
                        </span>
                      </div>
                      <Badge className={getConfidenceColor(result.confidence)}>
                        {(result.confidence * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    
                    {result.sessionName && (
                      <p className="font-medium text-gray-900 truncate mb-1">
                        {result.sessionName}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      {result.timestamp.toLocaleDateString()} at {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    {result.imageUrl && (
                      <img
                        src={result.imageUrl}
                        alt="Session thumbnail"
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedResults.length === 0 && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">No sessions found matching "{searchTerm}"</p>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default SessionHistory;
