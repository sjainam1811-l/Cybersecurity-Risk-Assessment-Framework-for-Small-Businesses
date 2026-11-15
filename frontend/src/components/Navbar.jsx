import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Navbar({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/sme-research", label: "SME Risk Research" },
    { path: "/nist-framework", label: "NIST Framework" },
    { path: "/case-studies", label: "Case Studies" },
    { path: "/best-practices", label: "Best Practices" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50 h-16">
      <div className="max-w-[1200px] mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <Link to="/dashboard" className="flex items-center space-x-3 group">
              <div>
                <span className="font-semibold text-base text-primary tracking-tight block">
                  SME Risk Framework
                </span>
                <span className="text-[12px] text-muted block -mt-0.5 font-normal">
                  Cybersecurity Risk Assessment
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center h-full space-x-1">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`h-16 px-5 flex items-center text-sm font-medium whitespace-nowrap transition-colors duration-150 border-b-2 ${
                    active
                      ? "border-accent text-primary bg-transparent"
                      : "border-transparent text-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section: Logout Button Only */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleLogoutClick}
              className="w-10 h-10 flex items-center justify-center rounded-btn border border-border bg-raised text-secondary hover:text-sev-critical hover:border-sev-critical/50 hover:bg-sev-critical-bg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 space-x-4 border-t border-border bg-surface text-xs scrollbar-none">
        {navLinks.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap py-1.5 font-medium transition-colors duration-150 border-b-2 ${
                active
                  ? "border-accent text-primary bg-transparent"
                  : "border-transparent text-secondary hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
