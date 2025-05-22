
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InfoTooltip } from "@/components/analysis/info-tooltip";

interface AnalysisOptionsProps {
  options: {
    slither: boolean;
    mythril: boolean;
    avalanche: boolean;
    gas: boolean;
  };
  onChange: (key: string, value: boolean) => void;
}

export function AnalysisOptions({ options, onChange }: AnalysisOptionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">Analysis Options</h3>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <Checkbox 
            id="slither-analysis"
            checked={options.slither}
            onCheckedChange={(checked) => onChange('slither', !!checked)}
            className="border-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          <div className="flex items-center ml-2">
            <Label htmlFor="slither-analysis" className="text-base cursor-pointer">Slither Analysis</Label>
            <InfoTooltip 
              title="Slither Analysis"
              description="Static analysis framework that detects common vulnerabilities like reentrancy, unused variables, and more."
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="mythril-analysis"
            checked={options.mythril}
            onCheckedChange={(checked) => onChange('mythril', !!checked)}
            className="border-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          <div className="flex items-center ml-2">
            <Label htmlFor="mythril-analysis" className="text-base cursor-pointer">Mythril Analysis</Label>
            <InfoTooltip 
              title="Mythril Analysis"
              description="Security analysis tool for EVM bytecode that uses symbolic execution to detect vulnerabilities in smart contracts."
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="avalanche-analysis"
            checked={options.avalanche}
            onCheckedChange={(checked) => onChange('avalanche', !!checked)}
            className="border-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          <div className="flex items-center ml-2">
            <Label htmlFor="avalanche-analysis" className="text-base cursor-pointer">Avalanche-Specific Rules</Label>
            <InfoTooltip 
              title="Avalanche-Specific Rules"
              description="Custom rules to check for Avalanche blockchain-specific vulnerabilities and best practices."
            />
          </div>
        </div>
        
        <div className="flex items-center">
          <Checkbox 
            id="gas-analysis"
            checked={options.gas}
            onCheckedChange={(checked) => onChange('gas', !!checked)}
            className="border-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          <div className="flex items-center ml-2">
            <Label htmlFor="gas-analysis" className="text-base cursor-pointer">Gas Analysis</Label>
            <InfoTooltip 
              title="Gas Analysis"
              description="Analyzes contract for gas optimization opportunities to reduce transaction costs."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
