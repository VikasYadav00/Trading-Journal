import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, PieChart } from 'lucide-react';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddTrade from './pages/AddTrade.jsx';
import Analytics from './pages/Analytics.jsx';
import TradeHistory from './pages/TradeHistory.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Settings from './pages/Settings.jsx';
import Goals from './pages/Goals.jsx';
import VerifyOTP from './pages/VerifyOTP.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

function Hero3D() {
  return (
    <div className="relative w-full max-w-3xl h-[400px] mt-16 flex items-center justify-center" style={{ perspective: 2000 }}>
      <motion.div 
        initial={{ rotateX: 60, rotateZ: -45, y: 50, opacity: 0 }}
        animate={{ rotateX: 60, rotateZ: -45, y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="relative w-[280px] h-[280px] md:w-[350px] md:h-[350px]"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Layer 1: Base Platform */}
        <motion.div 
          animate={{ z: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-sm"
        />

        {/* Layer 2: Main Chart Card */}
        <motion.div 
          animate={{ z: [30, 50, 30] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
          className="absolute inset-4 bg-background/80 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-2xl backdrop-blur-md"
        >
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-2 w-16 bg-white/20 rounded-full" />
              <div className="h-4 w-24 bg-white/40 rounded-full" />
            </div>
            <Activity className="text-primary w-8 h-8" />
          </div>
          
          <div className="flex items-end gap-2 h-24 mt-4">
            {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1, delay: 1 + i * 0.1 }}
                className="flex-1 bg-gradient-to-t from-primary/20 to-primary rounded-t-sm"
              />
            ))}
          </div>
        </motion.div>

        {/* Layer 3: Floating Stats Card 1 */}
        <motion.div 
          animate={{ z: [80, 110, 80], x: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -top-10 -right-10 w-40 bg-background/90 border border-blue-500/30 rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-3"
        >
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Win Rate</div>
            <div className="font-bold text-lg text-white">68.5%</div>
          </div>
        </motion.div>

        {/* Layer 4: Floating Stats Card 2 */}
        <motion.div 
          animate={{ z: [60, 90, 60], x: [0, 10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute -bottom-5 -left-10 w-48 bg-background/90 border border-green-500/30 rounded-xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl flex items-center gap-3"
        >
           <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Net Profit</div>
            <div className="font-bold text-lg text-green-400">+$12,450</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Temporary Landing Page to show the UI/UX direction
function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            T
          </div>
          <span className="text-xl font-bold tracking-tight">TradeJournal</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded-md hover:bg-white/5 transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card text-sm text-muted-foreground mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          The Ultimate Trading Analytics Platform
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight"
        >
          Master your psychology. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
            Dominate the markets.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
        >
          Track every trade, analyze your performance, and discover your edge with our premium, professional-grade journaling SaaS.
        </motion.p>

        <Hero3D />

      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="add-trade" element={<AddTrade />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="trades" element={<TradeHistory />} />
            <Route path="goals" element={<Goals />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
