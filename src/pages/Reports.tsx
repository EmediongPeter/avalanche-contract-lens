
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useReportsStore } from "@/state/store";
import { truncateAddress, formatDate } from "@/lib/utils";

const MOCK_REPORTS = [
  {
    id: "1",
    contract: "0x849...34dD",
    network: "Mainnet",
    status: "Completed",
    issues: {
      critical: 2,
      high: 3,
      medium: 1,
      low: 0,
      info: 0
    },
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2",
    contract: "0x3F1...C28B",
    network: "Fuji",
    status: "Completed",
    issues: {
      critical: 1,
      high: 4,
      medium: 0,
      low: 0,
      info: 0
    },
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    contract: "0x72A...9F5E",
    network: "Mainnet",
    status: "Completed",
    issues: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 3,
      info: 0
    },
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    contract: "0xB21...F48A",
    network: "Fuji",
    status: "Completed",
    issues: {
      critical: 0,
      high: 2,
      medium: 3,
      low: 0,
      info: 0
    },
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState("all");
  const { reports, setReports } = useReportsStore();
  
  useEffect(() => {
    // In a real app, this would be an API call
    setReports(MOCK_REPORTS);
  }, [setReports]);
  
  const getIssueIndicator = (count: number, type: string) => {
    if (count === 0) return null;
    
    const colors: Record<string, string> = {
      critical: "bg-red-500",
      high: "bg-orange-500",
      medium: "bg-yellow-500",
      low: "bg-green-500",
      info: "bg-blue-500"
    };
    
    return (
      <div className={`w-6 h-6 rounded-full ${colors[type]} flex items-center justify-center text-xs font-medium`}>
        {count}
      </div>
    );
  };

  const filteredReports = reports.filter(report => {
    if (activeTab === "all") return true;
    if (activeTab === "critical") return report.issues.critical > 0;
    if (activeTab === "high") return report.issues.high > 0;
    if (activeTab === "medium") return report.issues.medium > 0 || report.issues.low > 0;
    return true;
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-2 md:grid-cols-none gap-2 bg-transparent">
              <TabsTrigger value="all" className="text-sm md:text-base py-2">All Reports</TabsTrigger>
              <TabsTrigger value="critical" className="text-sm md:text-base py-2">Critical Issues</TabsTrigger>
              <TabsTrigger value="high" className="text-sm md:text-base py-2">High Issues</TabsTrigger>
              <TabsTrigger value="medium" className="text-sm md:text-base py-2">Medium/Low Issues</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Contract</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Network</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Issues</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map(report => (
                        <tr key={report.id} className="border-b border-gray-800">
                          <td className="py-4 px-4 text-white">{report.contract}</td>
                          <td className="py-4 px-4 text-white">{report.network}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              report.status === "Completed" ? "bg-green-900 text-green-400" : 
                              report.status === "Running" ? "bg-blue-900 text-blue-400" : 
                              "bg-red-900 text-red-400"
                            }`}>
                              {report.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-1">
                              {getIssueIndicator(report.issues.critical, "critical")}
                              {getIssueIndicator(report.issues.high, "high")}
                              {getIssueIndicator(report.issues.medium, "medium")}
                              {getIssueIndicator(report.issues.low, "low")}
                              {getIssueIndicator(report.issues.info, "info")}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white">{formatDate(report.date)}</td>
                          <td className="py-4 px-4">
                            <Button variant="ghost" size="icon">
                              <Info className="h-5 w-5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          No reports found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing 1-{filteredReports.length} of {filteredReports.length} reports
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>1</Button>
                  <Button variant="ghost" size="sm">2</Button>
                  <Button variant="ghost" size="sm">→</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => window.location.href = "/"}
            >
              New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
