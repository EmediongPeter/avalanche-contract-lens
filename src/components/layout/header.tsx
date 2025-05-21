
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WalletConnectButton } from "@/components/wallet/WalletConnectButton";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-gray-800 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 p-4 md:p-0">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-gradient font-extrabold">Avax</span>
                <span className="bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] bg-clip-text text-transparent">Audit</span>
              </Link>
            </h1>
            <div className="hidden md:flex">
              <WalletConnectButton />
            </div>
          </div>
          
          <nav className="flex overflow-x-auto md:overflow-visible scrollbar-none">
            <ul className="flex space-x-1 md:space-x-4 mb-0 w-full">
              <li className="flex-shrink-0">
                <Link
                  to="/"
                  className={cn(
                    "px-3 md:px-4 py-3 md:py-4 inline-block transition-colors rounded-md",
                    isActive("/") 
                      ? "text-white bg-gray-800/50 border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  )}
                >
                  Analyze Contract
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  to="/reports"
                  className={cn(
                    "px-3 md:px-4 py-3 md:py-4 inline-block transition-colors rounded-md",
                    isActive("/reports") 
                      ? "text-white bg-gray-800/50 border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  )}
                >
                  My Reports
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link
                  to="/statistics"
                  className={cn(
                    "px-3 md:px-4 py-3 md:py-4 inline-block transition-colors rounded-md",
                    isActive("/statistics") 
                      ? "text-white bg-gray-800/50 border-b-2 border-red-500 font-medium" 
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  )}
                >
                  Statistics
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
