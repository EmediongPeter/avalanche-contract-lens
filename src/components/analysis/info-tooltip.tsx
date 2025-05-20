
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InfoTooltipProps {
  title: string;
  description: string;
}

export function InfoTooltip({ title, description }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-1 inline-block cursor-help">
            <Info className="h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors" />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-gray-900 border border-gray-700">
          <div className="space-y-1">
            <p className="font-medium text-white">{title}</p>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
