
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet/WalletButton";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-gray-800 md:hidden">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] bg-clip-text text-transparent">
            AvaxAudit
          </h1>
          
          <div className="flex items-center space-x-2">
            <WalletButton />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {isOpen && (
          <nav className="border-t border-gray-800 animate-fade-in">
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "px-4 py-3 block transition-colors duration-150",
                    isActive("/") 
                      ? "text-white bg-gray-800 border-l-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Analyze Contract
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className={cn(
                    "px-4 py-3 block transition-colors duration-150",
                    isActive("/reports") 
                      ? "text-white bg-gray-800 border-l-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  My Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className={cn(
                    "px-4 py-3 block transition-colors duration-150",
                    isActive("/statistics") 
                      ? "text-white bg-gray-800 border-l-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Statistics
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
