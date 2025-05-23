import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun, User, MessageSquare, Briefcase, BarChart2, GraduationCap, ChevronDown, LogOut, Settings, Shield, FileCheck, Users } from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if user is logged in (this would be replaced with actual auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if dark mode preference is stored
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);
  
  // Update isLoggedIn whenever localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const storedRole = localStorage.getItem("userRole");
      setIsLoggedIn(!!storedRole);
      if (storedRole) {
        setUserRole(storedRole);
      }
    };
    
    // Check initially
    checkLoginStatus();
    
    // Listen for storage events (in case another tab changes localStorage)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);
  
  // Check if current page is dashboard
  const isDashboard = location.pathname === "/dashboard" || 
                      location.pathname === "/student-dashboard" || 
                      location.pathname === "/alumni-dashboard";

  // Get current user role
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem("userRole") || "student";
  });

  // Update the goToDashboard function to handle admin routes properly
  const goToDashboard = () => {
    const currentRole = localStorage.getItem("userRole");
    setUserMenuOpen(false);
    
    if (!currentRole) {
      // If no role is set, go to the landing page directly
      window.location.href = "/";
    } else if (currentRole === "student") {
      navigate("/student-dashboard");
    } else if (currentRole === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/alumni-dashboard");
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    // Disable any auto-redirect temporarily
    setUserMenuOpen(false);
    
    // Clear ALL auth-related items from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    
    // First show the confirmation message
    toast.success("You have been signed out successfully");
    
    // Use window.location directly for a clean redirect to landing page
    window.location.href = "/";
  };
  
  // Toggle settings modal
  const toggleSettingsModal = () => {
    setShowSettingsModal(!showSettingsModal);
    setUserMenuOpen(false);
  };
  
  // Switch between student and alumni role (for demo purposes)
  const switchUserRole = () => {
    const newRole = userRole === "student" ? "alumni" : "student";
    localStorage.setItem("userRole", newRole);
    setUserRole(newRole);
    setShowSettingsModal(false);
    
    // Navigate to the appropriate dashboard
    navigate(newRole === "student" ? "/student-dashboard" : "/alumni-dashboard");
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
      localStorage.setItem("darkMode", "false");
    } else {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
      localStorage.setItem("darkMode", "true");
    }
  };

  // Update the isActive function to include custom routes based on role
  const isActive = (path) => {
    if (path === '/jobs') {
      if (userRole === 'alumni' && location.pathname === '/alumni-job-board') {
        return true;
      } else if (userRole === 'student' && location.pathname === '/student-job-board') {
        return true;
      }
    }
    
    if (path === '/dashboard' || path === '/student-dashboard' || path === '/alumni-dashboard') {
      // Check if we're on any dashboard page
      return location.pathname === '/dashboard' || 
             location.pathname === '/student-dashboard' || 
             location.pathname === '/alumni-dashboard';
    }
    return location.pathname === path;
  };

  // Add a function to handle job route navigation based on role
  const goToJobsPage = () => {
    if (userRole === 'alumni') {
      navigate('/alumni-job-board');
    } else if (userRole === 'student') {
      navigate('/student-job-board');
    } else {
      navigate('/jobs');
    }
  };

  // On dashboard, we show logged in navigation options only if the user is actually logged in
  const showLoggedInNav = !!localStorage.getItem("userRole") || (isDashboard && location.pathname !== "/dashboard");

  // Handle click outside to close user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
      if (showSettingsModal && !event.target.closest('.settings-modal')) {
        setShowSettingsModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, showSettingsModal]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-800/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={goToDashboard}
            className="text-xl font-semibold flex items-center space-x-2 text-primary"
          >
            <span className="text-xl md:text-2xl font-bold text-primary">
              <span className="text-2xl md:text-3xl">AluNet</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {showLoggedInNav ? (
              <>
                {/* Home link for logged-in users */}
                <button 
                  onClick={() => goToDashboard()}
                  className={`nav-link ${
                    isActive("/dashboard") 
                      ? "text-primary" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Home
                </button>
                <Link 
                  to="/profile" 
                  className={`nav-link ${isActive("/profile") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Profile
                </Link>
                <Link 
                  to="/messages" 
                  className={`nav-link ${isActive("/messages") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Messages
                </Link>
                <button 
                  onClick={goToJobsPage}
                  className={`nav-link ${isActive("/jobs") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Jobs
                </button>

                {/* User role selector */}
                <div className="relative user-menu-container">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="capitalize">{userRole}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 animate-fade-in">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium">Account</p>
                      </div>
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm">
                          <p className="font-medium">Logged in as:</p>
                          <div className="flex items-center space-x-2 mt-1 text-primary">
                            {userRole === "student" ? (
                              <>
                                <User className="h-4 w-4" />
                                <span>Student</span>
                              </>
                            ) : userRole === "admin" ? (
                              <>
                                <Shield className="h-4 w-4" />
                                <span>Admin</span>
                              </>
                            ) : (
                              <>
                                <GraduationCap className="h-4 w-4" />
                                <span>Alumni</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                        <button 
                          onClick={goToDashboard}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <BarChart2 className="h-4 w-4" />
                          <span>Home</span>
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-red-500"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                      {userRole === "admin" && (
                        <>
                          <button 
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/admin/verifications");
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <FileCheck className="h-4 w-4" />
                            <span>Verifications</span>
                          </button>
                          <button 
                            onClick={() => {
                              setUserMenuOpen(false);
                              navigate("/admin/users");
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          >
                            <Users className="h-4 w-4" />
                            <span>Manage Users</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Home link for non-logged-in users */}
                <Link 
                  to="/" 
                  className={`nav-link ${isActive("/") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Home
                </Link>
                {/* Change Link to navigation to Homepage with state parameter instead of /login */}
                <Link 
                  to="/" 
                  state={{ showLogin: true }}
                  className={`nav-link text-gray-700 dark:text-gray-300`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="button-primary animate-fade-in"
                >
                  Register
                </Link>
              </>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className="p-2 mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="container-custom py-4 space-y-2">
            {showLoggedInNav ? (
              <>
                <button 
                  onClick={() => {
                    goToDashboard();
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${
                    isActive("/dashboard") 
                      ? "text-primary" 
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  Home
                </button>
                <Link 
                  to="/profile" 
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 ${isActive("/profile") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Profile
                </Link>
                <Link 
                  to="/messages" 
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 ${isActive("/messages") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Messages
                </Link>
                <button 
                  onClick={() => {
                    goToJobsPage();
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left py-2 ${isActive("/jobs") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Jobs
                </button>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                  <div className="py-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Signed in as:</p>
                    <p className="font-medium capitalize">{userRole}</p>
                  </div>
                  <button 
                    onClick={() => {
                      toggleSettingsModal();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 py-2 text-gray-700 dark:text-gray-300"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 py-2 text-red-500"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 ${isActive("/") ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                >
                  Home
                </Link>
                {/* Change Link to navigation to Homepage with state parameter instead of /login */}
                <Link 
                  to="/" 
                  state={{ showLogin: true }}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-gray-700 dark:text-gray-300`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="block button-primary mt-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="settings-modal bg-white dark:bg-gray-900 w-full max-w-md p-6 rounded-xl animate-fade-in">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Appearance</h4>
                <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <span>Dark Mode</span>
                  <button 
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-amber-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-indigo-500" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Account</h4>
                <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span>User Type</span>
                    <span className="font-medium capitalize">{userRole}</span>
                  </div>
                  <button 
                    onClick={switchUserRole}
                    className="w-full py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Switch to {userRole === "student" ? "Alumni" : "Student"} Account
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;