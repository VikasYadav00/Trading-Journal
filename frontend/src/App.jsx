import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { TrendingUp, Activity, PieChart, ChevronRight, ChevronLeft } from 'lucide-react';
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

function MouseTilt({ children, offset = 20, className = "" }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 800, damping: 35 });
  const mouseYSpring = useSpring(y, { stiffness: 800, damping: 35 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [offset, -offset]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-offset, offset]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Hero3D() {
  return (
    <div className="relative w-full max-w-2xl h-[400px] flex items-center justify-center" style={{ perspective: 2000 }}>
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

function Candlestick3D() {
  return (
    <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center mx-auto gap-12" style={{ perspective: 1200 }}>

      {/* RED CANDLE (Bearish) */}
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateZ(10deg)' }}>
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          className="relative w-[70px] h-[200px] mt-16"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Upper Wick */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-60px] w-2 h-[60px] bg-gradient-to-t from-red-400 to-red-300 shadow-[0_0_15px_rgba(248,113,113,0.8)]" style={{ transform: 'translateZ(0px)' }} />

          {/* Body (3D Box) */}
          <div className="absolute top-0 left-0 w-[70px] h-[200px]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-red-500/80 border border-red-400 shadow-[0_0_30px_rgba(239,68,68,0.6)] backdrop-blur-sm" style={{ transform: 'translateZ(35px)' }} />
            <div className="absolute inset-0 bg-red-600/80 border border-red-500" style={{ transform: 'translateZ(-35px)' }} />
            <div className="absolute top-0 left-0 w-[70px] h-[200px] bg-red-500/60 border border-red-400 origin-left" style={{ transform: 'rotateY(-90deg)' }} />
            <div className="absolute top-0 right-0 w-[70px] h-[200px] bg-red-400/70 border border-red-300 origin-right" style={{ transform: 'rotateY(90deg)' }} />
            <div className="absolute top-0 left-0 w-[70px] h-[70px] bg-red-300/80 border border-red-200 origin-top" style={{ transform: 'rotateX(90deg)' }} />
            <div className="absolute bottom-0 left-0 w-[70px] h-[70px] bg-red-700/80 border border-red-600 origin-bottom" style={{ transform: 'rotateX(-90deg)' }} />
          </div>

          {/* Lower Wick */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-80px] w-2 h-[80px] bg-gradient-to-b from-red-400 to-red-300 shadow-[0_0_15px_rgba(248,113,113,0.8)]" style={{ transform: 'translateZ(0px)' }} />
        </motion.div>
      </div>

      {/* GREEN CANDLE (Bullish) */}
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateZ(10deg)' }}>
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="relative w-[70px] h-[200px] mb-12"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Upper Wick */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[-60px] w-2 h-[60px] bg-gradient-to-t from-green-400 to-green-300 shadow-[0_0_15px_rgba(74,222,128,0.8)]" style={{ transform: 'translateZ(0px)' }} />

          {/* Body (3D Box) */}
          <div className="absolute top-0 left-0 w-[70px] h-[200px]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 bg-green-500/80 border border-green-400 shadow-[0_0_30px_rgba(34,197,94,0.6)] backdrop-blur-sm" style={{ transform: 'translateZ(35px)' }} />
            <div className="absolute inset-0 bg-green-600/80 border border-green-500" style={{ transform: 'translateZ(-35px)' }} />
            <div className="absolute top-0 left-0 w-[70px] h-[200px] bg-green-500/60 border border-green-400 origin-left" style={{ transform: 'rotateY(-90deg)' }} />
            <div className="absolute top-0 right-0 w-[70px] h-[200px] bg-green-400/70 border border-green-300 origin-right" style={{ transform: 'rotateY(90deg)' }} />
            <div className="absolute top-0 left-0 w-[70px] h-[70px] bg-green-300/80 border border-green-200 origin-top" style={{ transform: 'rotateX(90deg)' }} />
            <div className="absolute bottom-0 left-0 w-[70px] h-[70px] bg-green-700/80 border border-green-600 origin-bottom" style={{ transform: 'rotateX(-90deg)' }} />
          </div>

          {/* Lower Wick */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-80px] w-2 h-[80px] bg-gradient-to-b from-green-400 to-green-300 shadow-[0_0_15px_rgba(74,222,128,0.8)]" style={{ transform: 'translateZ(0px)' }} />
        </motion.div>
      </div>

    </div>
  );
}

const TRADING_RULES = [
  "DON'T JUMP FROM ONE STRATEGY TO ANOTHER.",
  "NEVER TRY TO TRADE AGAINST THE TREND.",
  "KEEP AWAY YOUR EMOTIONS WHILE TRADING.",
  "BACKTEST YOUR SETUP AND TRADES ONCE A WEEK.",
  "DO NOT RISK MORE THAN 2% IN A DAY."
];

function Coin3D() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center" style={{ perspective: 1000 }}>
      <motion.div
        animate={{ rotateY: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="relative w-48 h-48 rounded-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Coin Edge (Thickness) */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-yellow-600/50 bg-yellow-500/10"
            style={{ transform: `translateZ(${i * 2 - 15}px)` }}
          />
        ))}

        {/* Front Face */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] border-4 border-yellow-200"
          style={{ transform: 'translateZ(15px)', backfaceVisibility: 'hidden' }}
        >
          <div className="w-36 h-36 rounded-full border-[3px] border-yellow-200/60 flex items-center justify-center bg-gradient-to-tr from-yellow-600/20 to-transparent">
            <span className="text-7xl font-black text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">$</span>
          </div>
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-700 via-yellow-500 to-yellow-300 flex items-center justify-center shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] border-4 border-yellow-200"
          style={{ transform: 'translateZ(-15px) rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <div className="w-36 h-36 rounded-full border-[3px] border-yellow-200/60 flex items-center justify-center bg-gradient-to-tr from-yellow-600/20 to-transparent">
            <span className="text-7xl font-black text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">$</span>
          </div>
        </div>
      </motion.div>

      {/* Glowing Shadow */}
      <div className="absolute -bottom-10 w-48 h-8 bg-yellow-500/30 rounded-full blur-2xl" />
    </div>
  );
}

function QuoteSection() {
  return (
    <section className="w-full py-32 relative z-10 overflow-hidden bg-transparent">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
        <div className="flex-1 text-center md:text-left">
          <svg className="w-16 h-16 text-yellow-500/30 mb-8 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-8">
            "The stock market is a device for transferring money from the <span className="text-red-500">impatient</span> to the <span className="text-[#a3e635]">patient</span>."
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <div className="w-12 h-1 bg-yellow-500/50 rounded-full" />
            <p className="text-xl text-white/60 font-bold tracking-widest uppercase">Warren Buffett</p>
          </div>
        </div>

        <div className="flex-1 flex justify-center w-full">
          <MouseTilt offset={45}>
            <Coin3D />
          </MouseTilt>
        </div>
      </div>
    </section>
  );
}


// Temporary Landing Page to show the UI/UX direction
function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col relative overflow-hidden">
      {/* Premium Violet & Cyan Mesh Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[10000ms] delay-700" />
      <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-[120px] pointer-events-none mix-blend-screen" />

      {/* Trading Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

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
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-12 max-w-7xl mx-auto z-10 pt-20 pb-24 gap-16 w-full">

        {/* Left Column: Text & Rules */}
        <div className="flex-1 text-left w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            The Ultimate Trading Analytics Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Master your psychology. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
              Dominate the markets.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 mb-10 max-w-xl"
          >
            Track every trade, analyze your performance, and discover your edge with our premium, professional-grade journaling SaaS.
          </motion.p>

          {/* Vertical Rules List directly in Hero */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-sm font-bold tracking-widest text-white/40 uppercase mb-2">5 Rules of Profitability</h3>
            {TRADING_RULES.map((rule, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.1)' }}
                className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3.5 rounded-xl backdrop-blur-sm transition-all w-fit max-w-full shadow-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-cyan-400 text-xs font-black shadow-[0_0_10px_rgba(139,92,246,0.3)]">{i + 1}</div>
                <p className="text-xs md:text-sm font-bold text-white tracking-wide uppercase leading-tight">{rule}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Floating 3D Chart & Bull/Bear Image */}
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-16 lg:mt-0 gap-12 lg:gap-24">
          <MouseTilt offset={35}>
            <Hero3D />
          </MouseTilt>

          {/* 3D Isometric Image Container for Bull vs Bear */}
          <MouseTilt offset={25} className="w-full flex justify-center">
            <div className="relative w-full max-w-[360px] lg:max-w-md h-[250px] lg:h-[300px] flex items-center justify-center mt-8 lg:mt-16" style={{ perspective: 1500 }}>
              <motion.div
                initial={{ rotateX: 50, rotateZ: -25, y: 50, opacity: 0 }}
                animate={{ rotateX: 50, rotateZ: -25, y: [-10, 10, -10], opacity: 1 }}
                transition={{ 
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                  opacity: { duration: 0.8 },
                  rotateX: { duration: 0.8 },
                  rotateZ: { duration: 0.8 }
                }}
                className="relative w-full rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
                style={{ transformStyle: 'preserve-3d' }}
              >
              {/* 3D Edge Thickness */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/40 to-violet-500/40 translate-y-3 translate-x-3 -z-10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-600/30 to-violet-600/30 translate-y-2 translate-x-2 -z-10" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-700/20 to-violet-700/20 translate-y-1 translate-x-1 -z-10" />

              {/* Main Image Face */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-background group">
                <img
                  src="/bull-bear.png"
                  alt="Bull vs Bear"
                  className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/30 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>
          </div>
          </MouseTilt>
        </div>
      </main>

      {/* Features Section with 3D Element */}
      <section className="w-full py-32 relative z-10 bg-background/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Visualize the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Bull</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-rose-600">Bear</span> Market.
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our cutting-edge analytics engine goes beyond flat 2D charts. Identify patterns, understand market sentiment, and pinpoint your exact edge with deep, multi-dimensional trade visualization.
              </p>
              <ul className="space-y-4">
                {[
                  "Deep-dive performance metrics",
                  "AI-driven psychological analysis",
                  "Real-time edge detection"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/90 font-medium text-lg">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-sm">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
          <div className="flex justify-center w-full">
            <MouseTilt offset={40}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <Candlestick3D />
              </motion.div>
            </MouseTilt>
          </div>
        </div>
      </section>

      {/* Quote Section with 3D Element */}
      <QuoteSection />

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
