import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  LineChart, 
  List, 
  PlusSquare, 
  Target, 
  Settings, 
  LogOut,
  Menu,
  X,
  User,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Terminal,
  BookOpen,
  Trophy,
  Activity,
  Bell,
  Search,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMT5Open, setIsMT5Open] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme, toggleTheme, setTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    setTheme('dark');
    navigate('/login');
  };

  const isLight = theme === 'light';

  // Toggle navigation categories
  const mainNav = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  const analyticsSub = [
    { name: 'Performance', href: '/dashboard/analytics' },
    { name: 'Reports', href: '/dashboard/analytics?view=reports' },
    { name: 'Advanced Reports', href: '/dashboard/analytics?view=advanced' },
    { name: 'Day View', href: '/dashboard/analytics?view=day' },
    { name: 'Strategies', href: '/dashboard/analytics?view=strategies' },
    { name: 'Trade Replay', href: '/dashboard/analytics?view=replay' },
  ];

  const secondaryNav = [
    { name: 'Web Terminal', href: '/dashboard', icon: Terminal },
    { name: 'Trades', href: '/dashboard/trades', icon: List },
    { name: 'Journal', href: '/dashboard/add-trade', icon: BookOpen },
  ];

  const aiNav = [
    { name: 'Tradinjournal AI', href: '/dashboard', icon: Sparkles, isAi: true },
  ];

  const socialNav = [
    { name: 'Progress Tracker', href: '/dashboard/goals', icon: Target },
    { name: 'Leaderboard', href: '/dashboard', icon: Trophy },
  ];

  const renderLink = (item) => {
    const isActive = location.pathname === item.href && !item.isAi;
    return (
      <Link
        key={item.name}
        to={item.href}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all group relative ${
          isActive 
            ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary rounded-l-none' 
            : item.isAi
              ? 'text-[#a78bfa] hover:text-[#c084fc] hover:bg-primary/5 font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon className={`w-4.5 h-4.5 flex-shrink-0 ${
            isActive 
              ? 'text-primary' 
              : item.isAi 
                ? 'text-[#a78bfa] drop-shadow-[0_0_8px_rgba(167,139,250,0.6)]' 
                : 'text-muted-foreground group-hover:text-foreground'
          }`} />
          {!isCollapsed && (
            <span className="truncate">{item.name}</span>
          )}
        </div>
        {isActive && !isCollapsed && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        )}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen flex overflow-hidden ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#080510] text-[#ebeef5]'}`}>
      
      {/* Sidebar - Desktop */}
      <motion.aside 
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`hidden md:flex flex-col border-r border-[#221a44] bg-[#0e091f]/85 backdrop-blur-xl h-screen sticky top-0 z-30 overflow-y-auto select-none`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#221a44]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg shadow-purple-500/25">
              TJ
            </div>
            {!isCollapsed && (
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                TradinJournal
              </span>
            )}
          </div>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded bg-[#1c1437] border border-[#2d2354] hover:bg-[#251b47] transition-all text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Area */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1.5 scrollbar-thin">
          
          {/* Main Links */}
          {mainNav.map(renderLink)}

          {/* Collapsible Analytics Dropdown */}
          <div className="flex flex-col">
            <button
              onClick={() => !isCollapsed && setIsAnalyticsOpen(!isAnalyticsOpen)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all group ${
                location.pathname.includes('/analytics') ? 'text-primary font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <LineChart className={`w-4.5 h-4.5 flex-shrink-0 ${location.pathname.includes('/analytics') ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`} />
                {!isCollapsed && <span>Analytics</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isAnalyticsOpen ? 'rotate-180' : ''}`} />
              )}
            </button>

            {/* Sub-navigation list */}
            {isAnalyticsOpen && !isCollapsed && (
              <div className="pl-9 pr-2 py-1 flex flex-col gap-1 border-l border-[#2d2354] ml-5 mt-1">
                {analyticsSub.map((sub) => {
                  const isSubActive = location.pathname === '/dashboard/analytics' && location.search.includes(sub.href.split('?')[1] || 'no-query');
                  return (
                    <Link
                      key={sub.name}
                      to={sub.href}
                      className={`text-xs py-1.5 rounded transition-colors block ${
                        isSubActive 
                          ? 'text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="h-[1px] bg-[#221a44] my-2" />

          {/* Secondary links */}
          {secondaryNav.map(renderLink)}

          <div className="h-[1px] bg-[#221a44] my-2" />

          {/* AI link */}
          {aiNav.map(renderLink)}

          <div className="h-[1px] bg-[#221a44] my-2" />

          {/* Social / Progress */}
          {socialNav.map(renderLink)}

        </nav>

        {/* Perks Card / Footer */}
        {!isCollapsed && (
          <div className="p-4 mx-3 my-2 rounded-xl border border-[#2d2354] bg-[#120a26]/60 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-purple-500/10 blur-xl rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <Gift className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-foreground">Perks</h4>
                <p className="text-[10px] text-muted-foreground truncate">Unlocked</p>
              </div>
              <button className="text-[10px] font-bold bg-[#fbbf24] hover:bg-[#f59e0b] text-purple-950 px-2.5 py-1 rounded shadow-md transition-all">
                View
              </button>
            </div>
          </div>
        )}

        <div className="p-3 border-t border-[#221a44] flex flex-col gap-1.5">
          <Link
            to="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
          >
            <Settings className="w-4.5 h-4.5 text-muted-foreground" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all text-left w-full"
          >
            {isLight ? <Moon className="w-4.5 h-4.5 text-muted-foreground" /> : <Sun className="w-4.5 h-4.5 text-muted-foreground" />}
            {!isCollapsed && <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-left w-full"
          >
            <LogOut className="w-4.5 h-4.5 text-muted-foreground" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className={`h-16 flex items-center justify-between px-6 border-b border-[#221a44] bg-[#0c081b]/50 backdrop-blur-md z-20 flex-shrink-0`}>
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* MT5 Connection Widget */}
            <div className="relative">
              <button 
                onClick={() => setIsMT5Open(!isMT5Open)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#110e28] border border-[#2d2354] hover:bg-[#1a1438] transition-all text-xs font-semibold text-[#8b5cf6]"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-[#a78bfa]">MT5 #33XXX8</span>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">Connected</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              
              {/* Dropdown for Connection Info */}
              <AnimatePresence>
                {isMT5Open && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsMT5Open(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute left-0 mt-2 w-56 rounded-lg bg-[#110d24] border border-[#2d2354] shadow-xl p-3 z-20 space-y-2 text-xs"
                    >
                      <h4 className="font-bold text-foreground">Broker Connection</h4>
                      <p className="text-muted-foreground">Successfully linked to MetaTrader 5 live account. Real-time executions are syncing automatically.</p>
                      <div className="text-[10px] text-emerald-400 font-mono">Ping: 12ms | Last Sync: Just now</div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search, Notifications, Theme toggle */}
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors">
                <Search className="w-4.5 h-4.5" />
              </button>
              
              {/* Notification icon */}
              <div className="relative">
                <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors">
                  <Bell className="w-4.5 h-4.5" />
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                </button>
              </div>

              {/* Theme toggle mobile */}
              <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors">
                {isLight ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
              </button>
            </div>

            {/* Profile Dropdown Widget */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 px-2.5 rounded-lg bg-[#110d24]/60 hover:bg-[#1a1438] border border-[#2d2354]/60 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {user?.fullName?.substring(0, 2).toUpperCase() || user?.username?.substring(0, 2).toUpperCase() || 'TJ'}
                </div>
                <div className="hidden sm:block text-left">
                  <h4 className="text-xs font-bold leading-none text-foreground">{user?.fullName || user?.username || 'TradinJournal'}</h4>
                  <p className="text-[9px] text-muted-foreground leading-none mt-1">Trader</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-[#110d24] border border-[#2d2354] shadow-xl overflow-hidden z-20"
                    >
                      <div className="p-3 border-b border-[#2d2354] bg-[#0c081b]/40">
                        <p className="text-xs font-bold truncate text-foreground">{user?.fullName || user?.username}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{user?.email || 'trader@journal.app'}</p>
                      </div>
                      <div className="p-1 flex flex-col">
                        <Link to="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-md transition-colors">
                          <User className="w-3.5 h-3.5" /> Profile Settings
                        </Link>
                        <button onClick={() => { setIsProfileOpen(false); handleLogout(); }} className="flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-md transition-colors text-left w-full">
                          <LogOut className="w-3.5 h-3.5" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 bg-[#080510] relative">
          {/* Subtle mesh background glows inside main viewport */}
          <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0e091f] border-r border-[#221a44] z-50 flex flex-col md:hidden p-4"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#221a44]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
                    TJ
                  </div>
                  <span className="text-lg font-black tracking-tight text-white">TradinJournal</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-1 rounded hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-1.5 overflow-y-auto">
                {mainNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      location.pathname === item.href 
                        ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-[#221a44] my-2" />

                <div className="text-xs text-muted-foreground font-semibold px-3 mb-1 uppercase tracking-wider">Analytics</div>
                {analyticsSub.map((sub) => (
                  <Link
                    key={sub.name}
                    to={sub.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm py-2 px-6 rounded text-muted-foreground hover:text-foreground hover:bg-foreground/5 block"
                  >
                    {sub.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-[#221a44] my-2" />

                {secondaryNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-[#221a44] my-2" />

                {aiNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#a78bfa] hover:text-[#c084fc] hover:bg-primary/5 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}

                <div className="h-[1px] bg-[#221a44] my-2" />

                {socialNav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto pt-4 border-t border-[#221a44] flex flex-col gap-2">
                <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground">
                  {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  {isLight ? 'Dark Mode' : 'Light Mode'}
                </button>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive">
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
