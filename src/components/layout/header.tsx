
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/WalletButton";

export function Header() {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="w-full bg-background border-b border-gray-800 hidden md:block">
      <div className="container mx-auto">
        <div className="flex flex-col space-y-4 p-4 md:p-0">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#FF3E3E] to-[#FF6F61] bg-clip-text text-transparent">
              AvaxAudit
            </h1>
            <WalletButton />
          </div>
          
          <nav className="flex">
            <ul className="flex space-x-4 mb-0">
              <li>
                <Link
                  to="/"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors duration-150",
                    isActive("/") 
                      ? "text-white border-b-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  Analyze Contract
                </Link>
              </li>
              <li>
                <Link
                  to="/reports"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors duration-150",
                    isActive("/reports") 
                      ? "text-white border-b-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  My Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className={cn(
                    "px-4 py-4 inline-block transition-colors duration-150",
                    isActive("/statistics") 
                      ? "text-white border-b-2 border-[#FF3E3E] font-medium" 
                      : "text-gray-400 hover:text-white"
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
