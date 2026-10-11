import React, { useState } from 'react';
import { Menu, X, User, Shield, BookOpen, LogOut, CreditCard, ChevronRight } from 'lucide-react';
import { Logo } from './Logo.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { useSettings } from '../context/SettingsContext.tsx';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout, canAccessClasses } = useAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isCurrent = (path: string) => currentPath === path;

  return (
    <header className="sticky top-0 z-40 bg-[#060a14]/90 backdrop-blur-md border-b border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div onClick={() => handleNav('/')} className="cursor-pointer">
            <Logo size="md" />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleNav('/')}
              className={`transition-colors ${isCurrent('/') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`transition-colors ${isCurrent('/about') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              About
            </button>
            <button
              onClick={() => handleNav('/fees')}
              className={`transition-colors ${isCurrent('/fees') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Course Fees
            </button>
            <button
              onClick={() => handleNav('/payment-instructions')}
              className={`transition-colors ${isCurrent('/payment-instructions') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Payment Guide
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`transition-colors ${isCurrent('/contact') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              Contact
            </button>

            {/* Authenticated Links */}
            {user && user.role === 'student' && (
              <>
                <button
                  onClick={() => handleNav('/student-dashboard')}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCurrent('/student-dashboard') ? 'text-amber-400 font-bold' : 'text-amber-300/80 hover:text-amber-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>My Portal</span>
                </button>
                <button
                  onClick={() => handleNav('/status')}
                  className={`flex items-center gap-1.5 transition-colors ${
                    isCurrent('/status') ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Status</span>
                </button>
              </>
            )}

            {user && user.role === 'admin' && (
              <button
                onClick={() => handleNav('/admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                  isCurrent('/admin')
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            )}
          </nav>

          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNav(user.role === 'admin' ? '/admin' : '/profile')}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNav('/login')}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 transition-all"
                >
                  Student Login
                </button>
                <button
                  onClick={() => handleNav('/register')}
                  className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 rounded-xl shadow-lg shadow-amber-500/15 transition-all transform active:scale-95"
                >
                  Register Now
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {!user && (
              <button
                onClick={() => handleNav('/register')}
                className="px-3 py-1.5 text-xs font-bold text-black bg-amber-500 rounded-lg shadow-md"
              >
                Register
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070b16] border-b border-amber-500/20 px-4 pt-3 pb-6 space-y-2">
          <div className="space-y-1">
            <button
              onClick={() => handleNav('/')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isCurrent('/') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>Home</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => handleNav('/about')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isCurrent('/about') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>About the Academy</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => handleNav('/fees')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isCurrent('/fees') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>Course Fees (PKR {settings.discountedPrice.toLocaleString()})</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => handleNav('/payment-instructions')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isCurrent('/payment-instructions') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>Easypaisa & JazzCash Guide</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={() => handleNav('/contact')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                isCurrent('/contact') ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <span>Contact Support</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          {/* Authenticated user section in mobile drawer */}
          {user ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="px-3 py-2 bg-slate-900/80 rounded-xl">
                <p className="text-xs text-slate-400">Signed in as:</p>
                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                <span className="text-[10px] font-mono uppercase text-amber-400">{user.role} • {user.status}</span>
              </div>

              {user.role === 'student' && (
                <>
                  <button
                    onClick={() => handleNav('/student-dashboard')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-amber-500/10 text-amber-300 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Student Dashboard & Classes</span>
                  </button>
                  <button
                    onClick={() => handleNav('/status')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Registration & Payment Status</span>
                  </button>
                  <button
                    onClick={() => handleNav('/payment-submission')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                  >
                    <span>Submit Payment Receipt</span>
                  </button>
                  <button
                    onClick={() => handleNav('/profile')}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900 flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                </>
              )}

              {user.role === 'admin' && (
                <button
                  onClick={() => handleNav('/admin')}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold bg-amber-500 text-black flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>
              )}

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleNav('/login')}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Student Login
              </button>
              <button
                onClick={() => handleNav('/register')}
                className="w-full py-2.5 text-center text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl"
              >
                Register Now
              </button>
              <button
                onClick={() => handleNav('/admin-login')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-400 py-1"
              >
                Admin Portal Login
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
