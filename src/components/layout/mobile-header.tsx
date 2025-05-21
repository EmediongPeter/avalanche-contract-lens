
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-gray-800 md:hidden sticky top-0 z-20">
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-3">
          <h1 className="text-xl font-bold">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-gradient font-extrabold">Avax</span>
              <span className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] bg-clip-text text-transparent">Audit</span>
            </Link>
          </h1>
          
          <div className="flex items-center space-x-2">
            <div className="mr-2">
              <WalletConnectButton />
            </div>
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
                    "px-4 py-3 block transition-colors",
                    isActive("/") 
                      ? "text-white bg-gray-800 border-l-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
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
                    "px-4 py-3 block transition-colors",
                    isActive("/reports") 
                      ? "text-white bg-gray-800 border-l-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
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
                    "px-4 py-3 block transition-colors",
                    isActive("/statistics") 
                      ? "text-white bg-gray-800 border-l-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
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
