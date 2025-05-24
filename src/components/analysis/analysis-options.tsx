
import { Checkbox } from "@/components/ui/checkbox";
import { useAnalysisStore } from "@/state/store";

export function AnalysisOptions() {
  const { analysisOptions, setAnalysisOption } = useAnalysisStore();
  
  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Analysis Options</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="slither" 
            checked={analysisOptions.slither}
            onCheckedChange={(checked) => setAnalysisOption('slither', checked as boolean)}
          />
          <label htmlFor="slither" className="text-sm font-medium cursor-pointer">
            Slither Analysis
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="mythril" 
            checked={analysisOptions.mythril}
            onCheckedChange={(checked) => setAnalysisOption('mythril', checked as boolean)}
          />
          <label htmlFor="mythril" className="text-sm font-medium cursor-pointer">
            Mythril Analysis
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="avalanche" 
            checked={analysisOptions.avalanche}
            onCheckedChange={(checked) => setAnalysisOption('avalanche', checked as boolean)}
          />
          <label htmlFor="avalanche" className="text-sm font-medium cursor-pointer">
            Avalanche-Specific Rules
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="gas" 
            checked={analysisOptions.gas}
            onCheckedChange={(checked) => setAnalysisOption('gas', checked as boolean)}
          />
          <label htmlFor="gas" className="text-sm font-medium cursor-pointer">
            Gas Analysis
          </label>
        </div>
      </div>
    </div>
  );
}
