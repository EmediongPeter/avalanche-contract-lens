
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useReportsStore } from "@/state/store";
import { AnimatedContent } from "@/components/ui/animated-content";
import { AnalysisResult } from "@/services/analysis";
import { formatDistanceToNow } from "date-fns";
import { fetchReports } from "@/services/reports";
import { Loader2 } from "lucide-react";

export default function Reports() {
  const [activeTab, setActiveTab] = useState("all");
  const { reports, filter, setFilter, setReports } = useReportsStore();
  const { toast } = useToast();
  const [filteredReports, setFilteredReports] = useState<AnalysisResult[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reports from API when component mounts
  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Using a larger limit for faster fetching - we'll handle pagination client-side
        const data = await fetchReports(0, 100);
        // Map backend data to frontend format if necessary
        const formattedReports = data.map(report => ({
          id: report.id,
          contract_id: report.id, // Adding contract_id (using report.id as fallback)
          contract_address: '',  // You may need to adjust this based on your data structure
          contract_name: `Report #${report.id}`,
          network: 'Avalanche',  // Default network
          status: 'completed',
          issues: {
            critical: { count: 0, items: [] },
            high: { count: 0, items: [] },
            medium: { count: 0, items: [] },
            low: { count: 0, items: [] },
            info: { count: 0, items: [] }
          },
          created_at: report.generated_at,
          updated_at: report.generated_at // Adding updated_at (using generated_at as fallback)
        }));
        setReports(formattedReports);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setError('Failed to load reports. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, [setReports]);

  useEffect(() => {
    // Apply filters based on the active tab
    let filtered = [...reports];
    
    if (activeTab === "critical") {
      filtered = filtered.filter(report => report.issues.critical.count > 0);
    } else if (activeTab === "high") {
      filtered = filtered.filter(report => report.issues.high.count > 0);
    } else if (activeTab === "medium-low") {
      filtered = filtered.filter(
        report => report.issues.medium.count > 0 || report.issues.low.count > 0
      );
    }
    
    setFilteredReports(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [reports, activeTab, filter]);

  const handleViewReport = (report: AnalysisResult) => {
    // In a real app, this would navigate to a detailed report view
    toast({
      title: "Report Details",
      description: `Viewing details for contract ${report.contract_address || report.contract_name}`,
    });
  };

  // Calculate pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Function to render severity indicators
  const renderSeverityIndicators = (report: AnalysisResult) => {
    const indicators = [];
    
    if (report.issues.critical.count > 0) {
      indicators.push(
        <span key="critical" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white font-medium text-xs mr-1">
          {report.issues.critical.count}
        </span>
      );
    }
    
    if (report.issues.high.count > 0) {
      indicators.push(
        <span key="high" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-500 text-white font-medium text-xs mr-1">
          {report.issues.high.count}
        </span>
      );
    }
    
    if (report.issues.medium.count > 0) {
      indicators.push(
        <span key="medium" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white font-medium text-xs mr-1">
          {report.issues.medium.count}
        </span>
      );
    }
    
    if (report.issues.low.count > 0) {
      indicators.push(
        <span key="low" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white font-medium text-xs mr-1">
          {report.issues.low.count}
        </span>
      );
    }
    
    if (report.issues.info.count > 0) {
      indicators.push(
        <span key="info" className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-medium text-xs mr-1">
          {report.issues.info.count}
        </span>
      );
    }
    
    return indicators;
  };

  // Format the date for display
  const formatDate = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  return (
    <AnimatedContent>
      <div className="container mx-auto py-8 px-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="all" className="text-base py-3">All Reports</TabsTrigger>
                <TabsTrigger value="critical" className="text-base py-3">Critical Issues</TabsTrigger>
                <TabsTrigger value="high" className="text-base py-3">High Issues</TabsTrigger>
                <TabsTrigger value="medium-low" className="text-base py-3">Medium/Low Issues</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="mt-0">
                <div className="rounded-md overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-800">
                      <TableRow>
                        <TableHead className="text-white w-1/6">Contract</TableHead>
                        <TableHead className="text-white w-1/6">Network</TableHead>
                        <TableHead className="text-white w-1/6">Status</TableHead>
                        <TableHead className="text-white w-1/6">Issues</TableHead>
                        <TableHead className="text-white w-1/6">Date</TableHead>
                        <TableHead className="text-white w-1/6">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin mr-2" />
                              <span>Loading reports...</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : error ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-red-400">
                            {error}
                            <div className="mt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => window.location.reload()}
                              >
                                Retry
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : currentReports.length > 0 ? (
                        currentReports.map((report) => (
                          <TableRow key={report.id} className="hover:bg-gray-800/50">
                            <TableCell className="font-mono text-gray-300">
                              {report.contract_address 
                                ? `${report.contract_address.slice(0, 8)}...${report.contract_address.slice(-4)}`
                                : report.contract_name
                              }
                            </TableCell>
                            <TableCell>{report.network}</TableCell>
                            <TableCell>
                              <span className={report.status === "completed" ? "text-green-500" : "text-yellow-500"}>
                                {report.status === "completed" ? "Completed" : report.status === "in_progress" ? "In Progress" : "Failed"}
                              </span>
                            </TableCell>
                            <TableCell>{renderSeverityIndicators(report)}</TableCell>
                            <TableCell>{formatDate(report.created_at)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewReport(report)}
                              >
                                Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                            No reports found matching current filters
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredReports.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-400">
                      Showing {indexOfFirstReport + 1}-{Math.min(indexOfLastReport, filteredReports.length)} of {filteredReports.length} reports
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AnimatedContent>
  );
}
