"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Car, Phone, Search, User, LogOut, Settings } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { getUserProfile } from "@/lib/userService";
import type { UserRole } from "@/lib/userService";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserRole(profile?.role || null);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const smoothScrollTo = (targetElement: HTMLElement, duration: number = 1000) => {
    const targetPosition = targetElement.offsetTop - 80; // Account for navbar height
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    };

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutCubic(progress);
      
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      
      // Check if we're on the search page or any page other than home
      if (window.location.pathname !== '/') {
        // Navigate to home page with the hash
        window.location.href = `/${href}`;
        return;
      }
      
      // If we're already on the home page, scroll to the section with custom animation
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        smoothScrollTo(targetElement, 1200); // 1.2 second smooth scroll
      }
      setIsOpen(false);
    }
  };
  
  const navLinks = [
    { href: "/", label: "Home", icon: Car },
    { href: "/search", label: "Find a Car", icon: Search },
    { href: "#platform-features", label: "Platform Features" },
    { href: "#automated-rentals", label: "Automated Rentals" },
    { href: "#business-model", label: "Business Model" },
    { href: "#why-vietnam", label: "Why Vietnam?" },
    { href: "#contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="group flex items-center space-x-3 text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Car className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <span className="hidden sm:block">AutoRent Connect</span>
              <span className="sm:hidden">ARC</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="group relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-all duration-300 rounded-lg hover:bg-blue-50/50"
                >
                  <div className="flex items-center space-x-2">
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </div>
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
                </Link>
              );
            })}
          </div>

          {/* Authentication - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/search">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Book Now
                    <Search className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.displayName || 'User'}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => router.push('/account')}
                      className="cursor-pointer"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </DropdownMenuItem>
                    {userRole !== 'customer' && (
                      <>
                        <DropdownMenuItem onClick={() => router.push('/admin/orders')}>
                          <Settings className="mr-2 h-4 w-4" />
                          Order Management
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/admin/users')}>
                          <User className="mr-2 h-4 w-4" />
                          User Management
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative w-10 h-10 rounded-xl hover:bg-blue-50 transition-colors duration-200"
                >
                  <Menu className="h-5 w-5 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-full sm:w-[400px] bg-white/95 backdrop-blur-md border-l border-gray-200/50"
              >
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="flex items-center justify-between pb-6 border-b border-gray-200/50">
                    <Link 
                      href="/" 
                      className="flex items-center space-x-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Car className="w-4 h-4 text-white" />
                      </div>
                      AutoRent Connect
                    </Link>
                  </div>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2 py-6 flex-grow">
                    {navLinks.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleSmoothScroll(e, link.href)}
                          className="group flex items-center space-x-4 px-4 py-4 text-lg font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all duration-300 transform hover:translate-x-2"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          {Icon ? (
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                              <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                              <div className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-white transition-colors duration-300"></div>
                            </div>
                          )}
                          <span className="flex-1">{link.label}</span>
                          <div className="w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-8 transition-all duration-300 rounded-full"></div>
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile Authentication */}
                  <div className="pt-6 border-t border-gray-200/50">
                    {user ? (
                      <>
                        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                          <p className="text-sm text-gray-600">Welcome back,</p>
                          <p className="text-lg font-bold text-blue-600">{user.displayName || 'User'}</p>
                          <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link href="/search" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mb-3">
                            <Search className="w-5 h-5 mr-3" />
                            Start Your Journey
                          </Button>
                        </Link>
                        <Button 
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          variant="outline" 
                          className="w-full py-4 rounded-xl font-semibold border-gray-200 hover:bg-gray-50"
                        >
                          <LogOut className="w-5 h-5 mr-3" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mb-3">
                            Get Started
                          </Button>
                        </Link>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full py-4 rounded-xl font-semibold border-gray-200 hover:bg-gray-50">
                            Sign In
                          </Button>
                        </Link>
                      </>
                    )}
                    
                    {/* Contact Info */}
                    <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                      <p className="text-sm text-gray-600 text-center">
                        Need help? Call us at
                      </p>
                      <p className="text-lg font-bold text-blue-600 text-center mt-1">
                        +84 123 456 789
                      </p>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
