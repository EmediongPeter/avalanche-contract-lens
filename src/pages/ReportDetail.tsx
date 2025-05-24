
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { AnimatedContent } from "@/components/ui/animated-content";
import { useReportsStore } from "@/state/store";
import { AnalysisResult } from "@/services/analysis";
import { formatDistanceToNow } from "date-fns";

export default function ReportDetail() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const { reports } = useReportsStore();
  const [report, setReport] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (reportId) {
      const foundReport = reports.find(r => r.id === parseInt(reportId));
      setReport(foundReport || null);
    }
  }, [reportId, reports]);

  if (!report) {
    return (
      <AnimatedContent>
        <div className="container mx-auto py-8 px-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-4">Report Not Found</h2>
              <p className="text-gray-400 mb-6">The requested report could not be found.</p>
              <Button onClick={() => navigate("/reports")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </AnimatedContent>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high': 
        return <XCircle className="w-4 h-4" />;
      case 'medium':
        return <AlertTriangle className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  const totalIssues = report.issues.critical.count + report.issues.high.count + 
                     report.issues.medium.count + report.issues.low.count + report.issues.info.count;

  return (
    <AnimatedContent>
      <div className="container mx-auto py-8 px-4 max-w-6xl">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/reports")} 
            variant="ghost" 
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
        </div>

        {/* Header Card */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Contract Analysis Report
                </CardTitle>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    <span className="font-medium">Contract:</span>{" "}
                    <span className="font-mono">
                      {report.contract_address 
                        ? `${report.contract_address.slice(0, 16)}...${report.contract_address.slice(-8)}`
                        : report.contract_name
                      }
                    </span>
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium">Network:</span> {report.network}
                  </p>
                  <p className="text-gray-400">
                    <span className="font-medium">Analyzed:</span> {formatDate(report.created_at)}
                  </p>
                </div>
              </div>
              <Badge 
                variant={report.status === "completed" ? "default" : "destructive"}
                className={report.status === "completed" ? "bg-green-600" : ""}
              >
                {report.status === "completed" ? "Completed" : 
                 report.status === "in_progress" ? "In Progress" : "Failed"}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Summary Card */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Analysis Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{report.issues.critical.count}</div>
                <div className="text-sm text-gray-400">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{report.issues.high.count}</div>
                <div className="text-sm text-gray-400">High</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">{report.issues.medium.count}</div>
                <div className="text-sm text-gray-400">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{report.issues.low.count}</div>
                <div className="text-sm text-gray-400">Low</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{report.issues.info.count}</div>
                <div className="text-sm text-gray-400">Info</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Details */}
        {totalIssues > 0 ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Detailed Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Critical Issues */}
              {report.issues.critical.count > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    Critical Issues ({report.issues.critical.count})
                  </h3>
                  <div className="space-y-3">
                    {report.issues.critical.items?.map((issue, index) => (
                      <div key={index} className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{issue.title || `Critical Issue ${index + 1}`}</h4>
                        <p className="text-gray-300 text-sm">{issue.description || "No description available"}</p>
                        {issue.location && (
                          <p className="text-red-400 text-xs mt-2">Location: {issue.location}</p>
                        )}
                      </div>
                    )) || (
                      <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{report.issues.critical.count} critical issues found. Details pending analysis completion.</p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                </div>
              )}

              {/* High Issues */}
              {report.issues.high.count > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-500 mb-3 flex items-center">
                    <XCircle className="w-5 h-5 mr-2" />
                    High Issues ({report.issues.high.count})
                  </h3>
                  <div className="space-y-3">
                    {report.issues.high.items?.map((issue, index) => (
                      <div key={index} className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{issue.title || `High Issue ${index + 1}`}</h4>
                        <p className="text-gray-300 text-sm">{issue.description || "No description available"}</p>
                        {issue.location && (
                          <p className="text-orange-400 text-xs mt-2">Location: {issue.location}</p>
                        )}
                      </div>
                    )) || (
                      <div className="bg-orange-950/30 border border-orange-800/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{report.issues.high.count} high issues found. Details pending analysis completion.</p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                </div>
              )}

              {/* Medium Issues */}
              {report.issues.medium.count > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-yellow-500 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Medium Issues ({report.issues.medium.count})
                  </h3>
                  <div className="space-y-3">
                    {report.issues.medium.items?.map((issue, index) => (
                      <div key={index} className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{issue.title || `Medium Issue ${index + 1}`}</h4>
                        <p className="text-gray-300 text-sm">{issue.description || "No description available"}</p>
                        {issue.location && (
                          <p className="text-yellow-400 text-xs mt-2">Location: {issue.location}</p>
                        )}
                      </div>
                    )) || (
                      <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{report.issues.medium.count} medium issues found. Details pending analysis completion.</p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                </div>
              )}

              {/* Low Issues */}
              {report.issues.low.count > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-500 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Low Issues ({report.issues.low.count})
                  </h3>
                  <div className="space-y-3">
                    {report.issues.low.items?.map((issue, index) => (
                      <div key={index} className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{issue.title || `Low Issue ${index + 1}`}</h4>
                        <p className="text-gray-300 text-sm">{issue.description || "No description available"}</p>
                        {issue.location && (
                          <p className="text-green-400 text-xs mt-2">Location: {issue.location}</p>
                        )}
                      </div>
                    )) || (
                      <div className="bg-green-950/30 border border-green-800/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{report.issues.low.count} low issues found. Details pending analysis completion.</p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-4 bg-gray-700" />
                </div>
              )}

              {/* Info Issues */}
              {report.issues.info.count > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-blue-500 mb-3 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Informational ({report.issues.info.count})
                  </h3>
                  <div className="space-y-3">
                    {report.issues.info.items?.map((issue, index) => (
                      <div key={index} className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-2">{issue.title || `Info ${index + 1}`}</h4>
                        <p className="text-gray-300 text-sm">{issue.description || "No description available"}</p>
                        {issue.location && (
                          <p className="text-blue-400 text-xs mt-2">Location: {issue.location}</p>
                        )}
                      </div>
                    )) || (
                      <div className="bg-blue-950/30 border border-blue-800/50 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">{report.issues.info.count} informational items found. Details pending analysis completion.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Issues Found</h3>
              <p className="text-gray-400">
                Great news! No security issues were detected in this smart contract.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedContent>
  );
}
