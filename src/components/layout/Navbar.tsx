import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/enhanced-button";
import { Heart, Menu, X, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getDashboardLink = () => {
    if (!user) return "/";
    
    // Debugging logs: Check console to see what role is present
    // console.log("Navbar User Object:", user);
    // console.log("Navbar User Role:", user.role);

    // 1. Super Admin Check by Email
    if (user.email === 'kokkiligaddadivyacharan2007@gmail.com') {
      return '/dashboard/super-admin';
    }
    
    // 2. Role Normalization (handle "Donor", "donor ", etc.)
    const role = user.role ? user.role.toLowerCase().trim() : '';
    
    switch (role) {
      case 'donor': return '/dashboard/donor';
      case 'admin': return '/dashboard/admin';
      case 'patient': return '/dashboard/patient';
      case 'superadmin': return '/dashboard/super-admin';
      default:
        return '/';
    }
  };

  // Calculate this once to use in links and active checks
  const dashboardUrl = getDashboardLink();

  // Helper to check if dashboard is active (supports sub-routes if needed, currently exact match)
  const isDashboardActive = location.pathname === dashboardUrl;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              </div>
              <span className="font-bold text-xl text-foreground">
                OrganConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-medical",
                  isActive(item.href)
                    ? "text-primary bg-primary-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  asChild
                  className={cn(isDashboardActive && "text-primary bg-primary-soft hover:bg-primary-soft/80")}
                >
                  <Link to={dashboardUrl}>Dashboard</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/account">
                    <Settings className="h-4 w-4 mr-2" />
                    Account
                  </Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="medical" asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-medical",
                  isActive(item.href)
                    ? "text-primary bg-primary-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user ? (
              <div className="flex flex-col space-y-2 pt-2">
                <Button 
                  variant="ghost" 
                  className={cn("justify-start", isDashboardActive && "text-primary bg-primary-soft")}
                  asChild
                >
                  <Link to={dashboardUrl} onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/account" onClick={() => setIsOpen(false)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 pt-2">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="medical" className="justify-start" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;