
import { NetworkType } from "@/state/store";

export interface AnalysisOptions {
  slither: boolean;
  mythril: boolean;
  avalanche: boolean;
  gas: boolean;
}

export interface AnalysisResult {
  id: string;
  contract: string;
  network: NetworkType;
  timestamp: string;
  status: "Running" | "Completed" | "Failed";
  issues: {
    critical: { count: number; items: Issue[] };
    high: { count: number; items: Issue[] };
    medium: { count: number; items: Issue[] };
    low: { count: number; items: Issue[] };
    info: { count: number; items: Issue[] };
  };
}

export interface Issue {
  id: string;
  name: string;
  description: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  code?: {
    file: string;
    line: number;
    code: string;
  };
  references?: string[];
}

// Mock function to simulate analysis
export const analyzeContract = async (
  source: string | File, 
  options: AnalysisOptions,
  network: NetworkType,
  onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
  // Simulate progress updates
  if (onProgress) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      onProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 300);
  }
  
  // Wait to simulate analysis time
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Generate random issues based on selected options
  const generateRandomIssues = (count: number, severity: Issue["severity"]): Issue[] => {
    const issues: Issue[] = [];
    const issueTypes = {
      Critical: ["Reentrancy", "Overflow", "Unauthorized Access"],
      High: ["Unchecked Return Value", "Timestamp Dependence", "Improper Access Control"],
      Medium: ["DOS with Block Gas Limit", "Weak RNG", "Improper Array Handling"],
      Low: ["Uninitialized Storage", "Unlocked Pragma", "Style Guide Violation"],
      Info: ["Code Complexity", "Gas Optimization", "Documentation"]
    };
    
    for (let i = 0; i < count; i++) {
      const issueTypeList = issueTypes[severity];
      const name = issueTypeList[Math.floor(Math.random() * issueTypeList.length)];
      
      issues.push({
        id: `issue-${Math.random().toString(36).substr(2, 9)}`,
        name,
        description: `This is a mock description for ${name}`,
        severity,
        code: {
          file: "Contract.sol",
          line: Math.floor(Math.random() * 100) + 1,
          code: 'function transfer(address to, uint256 amount) public {'
        },
        references: [
          "https://consensys.github.io/smart-contract-best-practices/",
          "https://swcregistry.io/"
        ]
      });
    }
    
    return issues;
  };
  
  // Generate random counts based on selected options
  const criticalCount = options.slither || options.mythril ? Math.floor(Math.random() * 3) : 0;
  const highCount = options.slither || options.avalanche ? Math.floor(Math.random() * 4) : 0;
  const mediumCount = Math.floor(Math.random() * 5);
  const lowCount = options.gas ? Math.floor(Math.random() * 6) : 0;
  const infoCount = options.gas ? Math.floor(Math.random() * 4) : 0;
  
  return {
    id: `analysis-${Math.random().toString(36).substr(2, 9)}`,
    contract: typeof source === 'string' ? source : 'Uploaded Contract',
    network,
    timestamp: new Date().toISOString(),
    status: "Completed",
    issues: {
      critical: {
        count: criticalCount,
        items: generateRandomIssues(criticalCount, "Critical")
      },
      high: {
        count: highCount,
        items: generateRandomIssues(highCount, "High")
      },
      medium: {
        count: mediumCount,
        items: generateRandomIssues(mediumCount, "Medium")
      },
      low: {
        count: lowCount,
        items: generateRandomIssues(lowCount, "Low")
      },
      info: {
        count: infoCount,
        items: generateRandomIssues(infoCount, "Info")
      }
    }
  };
};
