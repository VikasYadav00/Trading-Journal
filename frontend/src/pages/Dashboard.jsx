import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Activity, 
  DollarSign, 
  Target, 
  TrendingUp, 
  PlusCircle, 
  X, 
  Loader2, 
  Trophy, 
  Sparkles, 
  Wallet, 
  Flame, 
  TrendingDown, 
  RefreshCw,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, updateTrade, syncTrades } from '../features/trades/tradeSlice';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Custom SVG Radar Chart Component
const RadarChart = ({ score }) => {
  const metrics = [
    { label: 'WIN RATE', value: 78 },
    { label: 'RISK MGMT', value: 85 },
    { label: 'STRATEGY', value: 72 },
    { label: 'CONSISTENCY', value: score }, // Bind consistency to score
    { label: 'PROFIT FACTOR', value: 80 },
  ];

  const width = 280;
  const height = 240;
  const cx = width / 2;
  const cy = height / 2 - 10;
  const r = 70; // Max radius

  const getCoordinates = (index, value) => {
    const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2;
    const factor = value / 100;
    const x = cx + r * factor * Math.cos(angle);
    const y = cy + r * factor * Math.sin(angle);
    return { x, y };
  };

  // Concentric pentagon grids
  const grids = [20, 40, 60, 80, 100];
  const gridPaths = grids.map(g => {
    const points = Array.from({ length: 5 }, (_, i) => getCoordinates(i, g));
    return `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;
  });

  // Axis lines
  const axes = Array.from({ length: 5 }, (_, i) => {
    const end = getCoordinates(i, 100);
    return { x1: cx, y1: cy, x2: end.x, y2: end.y };
  });

  // Metric polygon path
  const dataPoints = metrics.map((m, i) => getCoordinates(i, m.value));
  const dataPath = `M ${dataPoints.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  return (
    <div className="w-full flex justify-center items-center py-4">
      <svg width={width} height={height} className="overflow-visible select-none">
        {/* Draw grids */}
        {gridPaths.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="#2a204e"
            strokeWidth="1"
            strokeDasharray={i === 4 ? "none" : "2,3"}
          />
        ))}
        
        {/* Draw axis lines */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={axis.x1}
            y1={axis.y1}
            x2={axis.x2}
            y2={axis.y2}
            stroke="#2a204e"
            strokeWidth="1"
          />
        ))}

        {/* Draw data area */}
        <path
          d={dataPath}
          fill="rgba(154, 123, 243, 0.2)"
          stroke="#9a7bf3"
          strokeWidth="2"
          className="drop-shadow-[0_0_8px_rgba(154,123,243,0.4)]"
        />

        {/* Draw data points */}
        {dataPoints.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#a78bfa"
            stroke="#110d24"
            strokeWidth="1.5"
            className="hover:r-5 transition-all cursor-pointer"
          />
        ))}

        {/* Draw labels */}
        {metrics.map((m, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const labelDist = r + 18;
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle);
          
          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.1) textAnchor = 'start';
          if (Math.cos(angle) < -0.1) textAnchor = 'end';

          return (
            <text
              key={i}
              x={lx}
              y={ly + 4}
              fill="#a6adbb"
              fontSize="9"
              fontWeight="800"
              textAnchor={textAnchor}
              className="font-sans tracking-widest uppercase"
            >
              {m.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

// Custom Interactive Activity dots heatmap grid
const ActivityCalendar = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  // Custom seed grid outcomes for aesthetic representation
  // 0: Gray (no trade), 1: Light Green, 2: Deep Green, 3: Light Red, 4: Deep Red
  const monthData = {
    Jan: [2, 0, 1, 4, 2, 2, 0, 1, 1, 3, 2, 0, 2, 1, 4, 1, 0, 2, 2, 1],
    Feb: [0, 1, 3, 2, 2, 0, 4, 1, 2, 1, 0, 3, 2, 2, 0, 1, 4, 2, 1, 2],
    Mar: [2, 2, 0, 1, 3, 1, 2, 0, 2, 4, 2, 1, 0, 1, 1, 2, 3, 2, 2, 0],
    Apr: [1, 0, 2, 2, 4, 0, 1, 3, 2, 1, 2, 0, 2, 2, 0, 1, 4, 1, 2, 2],
    May: [2, 3, 1, 0, 2, 2, 1, 4, 0, 1, 3, 2, 2, 0, 2, 1, 1, 4, 2, 1],
    Jun: [1, 2, 0, 4, 2, 1, 3, 2, 0, 1, 2, 4, 0, 2, 2, 1, 3, 2, 1, 0]
  };

  const getDotStyle = (val) => {
    switch (val) {
      case 1:
        return 'bg-emerald-500/50 hover:bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.2)]';
      case 2:
        return 'bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 3:
        return 'bg-rose-500/50 hover:bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.2)]';
      case 4:
        return 'bg-rose-500 hover:bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      default:
        return 'bg-[#22183d] hover:bg-[#34275a]';
    }
  };

  const getTooltip = (val, index, monthName) => {
    const day = index * 2 + 1;
    switch (val) {
      case 1:
      case 2:
        return `${monthName} ${day}: Win (+$${val === 2 ? '420.00' : '150.00'})`;
      case 3:
      case 4:
        return `${monthName} ${day}: Loss (-$${val === 4 ? '350.00' : '120.00'})`;
      default:
        return `${monthName} ${day}: No trades logged`;
    }
  };

  return (
    <div className="w-full bg-[#110d24]/40 border border-[#221a44] p-5 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Trading Activity</h4>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">Loss <span className="w-2.5 h-2.5 rounded-full bg-rose-500/50" /><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /></span>
          <span className="flex items-center gap-1">Profit <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" /><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /></span>
        </div>
      </div>

      {/* Grid of months */}
      <div className="grid grid-cols-6 gap-4 select-none">
        {months.map(month => (
          <div key={month} className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-muted-foreground mb-2">{month}</span>
            <div className="grid grid-cols-4 gap-1.5">
              {monthData[month].map((val, idx) => (
                <div 
                  key={idx} 
                  className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-all duration-150 ${getDotStyle(val)}`}
                  title={getTooltip(val, idx, month)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-6 pt-4 border-t border-[#221a44] text-center">
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Win Trades</p>
          <p className="text-emerald-400 text-sm font-black mt-0.5">51</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Break Even</p>
          <p className="text-[#a6adbb] text-sm font-black mt-0.5">1</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Losing Trades</p>
          <p className="text-rose-400 text-sm font-black mt-0.5">7</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">Total P&L</p>
          <p className="text-emerald-400 text-sm font-black mt-0.5">+$9,398</p>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { trades, isLoading } = useSelector((state) => state.trades);
  const { user } = useSelector((state) => state.auth);
  const { theme } = useTheme();

  const [closeModalTrade, setCloseModalTrade] = useState(null);
  const [closeData, setCloseData] = useState({ exitPrice: '', pnl: '' });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => { dispatch(getTrades()); }, [dispatch]);

  const handleCloseSubmit = (e) => {
    e.preventDefault();
    if (!closeModalTrade) return;

    let finalPnl = Number(closeData.pnl);
    if (!finalPnl && closeData.exitPrice && closeModalTrade.entryPrice && closeModalTrade.quantity) {
      finalPnl = closeModalTrade.direction === 'Long' 
        ? (Number(closeData.exitPrice) - closeModalTrade.entryPrice) * closeModalTrade.quantity
        : (closeModalTrade.entryPrice - Number(closeData.exitPrice)) * closeModalTrade.quantity;
    }

    const updatedStatus = finalPnl > 0 ? 'Win' : finalPnl < 0 ? 'Loss' : 'Breakeven';

    dispatch(updateTrade({
      id: closeModalTrade._id,
      tradeData: { exitPrice: Number(closeData.exitPrice), pnl: finalPnl, status: updatedStatus }
    }));
    
    setCloseModalTrade(null);
    setCloseData({ exitPrice: '', pnl: '' });
  };

  const handleSyncTrades = () => {
    setIsSyncing(true);
    dispatch(syncTrades())
      .unwrap()
      .then(() => {
        setIsSyncing(false);
      })
      .catch((err) => {
        setIsSyncing(false);
        alert(err || 'Sync failed. Please check your Delta Exchange API keys in Settings.');
      });
  };

  // Compute stats from real trades database
  const closedTrades = trades.filter(t => t.status !== 'Open');
  const wins = closedTrades.filter(t => t.status === 'Win').length;
  const losses = closedTrades.filter(t => t.status === 'Loss').length;
  
  // Dynamic metrics computations
  const realTradesCount = trades.length;
  const realOpenCount = trades.filter(t => t.status === 'Open').length;
  const realWinRate = closedTrades.length > 0 ? ((wins / closedTrades.length) * 100).toFixed(1) : null;
  const realNetPnL = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  
  // Streak calculations
  let realStreak = 0;
  for (let i = closedTrades.length - 1; i >= 0; i--) {
    if (closedTrades[i].status === 'Win') realStreak++;
    else break;
  }

  // Profit Factor calculations
  const grossWins = closedTrades.filter(t => t.pnl > 0).reduce((acc, t) => acc + t.pnl, 0);
  const grossLosses = Math.abs(closedTrades.filter(t => t.pnl < 0).reduce((acc, t) => acc + t.pnl, 0));
  const realProfitFactor = grossLosses > 0 ? (grossWins / grossLosses).toFixed(2) : null;

  // Best trade / win calculations
  const winsSorted = [...closedTrades].filter(t => (t.pnl || 0) > 0).sort((a,b) => b.pnl - a.pnl);
  const realBiggestWin = winsSorted.length > 0 ? winsSorted[0].pnl : null;

  // --- STATS MERGING (Database values if present, else fall back to mockup parameters) ---
  const todayValue = realNetPnL !== 0 ? realNetPnL : 4142.00;
  const balanceValue = realNetPnL !== 0 ? (15000 + realNetPnL) : 19398.24;
  const totalPnLValue = realNetPnL !== 0 ? realNetPnL : 9398.24;
  const winRateValue = realWinRate !== null ? `${realWinRate}%` : '48%';
  const tradesCountValue = realTradesCount > 0 ? realTradesCount : 193;
  const openCountValue = realOpenCount > 0 ? realOpenCount : 3;
  const streakValue = realStreak > 0 ? realStreak : 5;
  const profitFactorValue = realProfitFactor !== null ? realProfitFactor : '1.90';
  const biggestWinValue = realBiggestWin !== null ? realBiggestWin : 2353.20;
  const bestDayValue = realBiggestWin !== null ? realBiggestWin * 1.15 : 4634.00;
  
  const isTodayPositive = todayValue >= 0;
  const formattedToday = `${isTodayPositive ? '+' : ''}$${Math.abs(todayValue).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const isLight = theme === 'light';

  return (
    <div className="space-y-7">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Good morning, <span className="text-[#a78bfa]">{user?.fullName || user?.username || 'Tradinjournal'}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Here's your trading performance overview</p>
        </div>
        <button 
          onClick={handleSyncTrades}
          disabled={isSyncing}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 active:scale-95 transition-all select-none disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          Sync Trades
        </button>
      </div>

      {/* Stats Cards Grid - 7 Items exactly matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Today's profit */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Today</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-black ${isTodayPositive ? 'text-emerald-400' : 'text-rose-400'} tracking-tight`}>
              {formattedToday}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1.5">Friday, Mar 20</p>
          </div>
        </motion.div>

        {/* Card 2: Current Balance */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Current Balance</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#a78bfa]">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">
              ${balanceValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1.5">Broker account</p>
          </div>
        </motion.div>

        {/* Card 3: Total P&L */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between sm:col-span-2"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Total P&L</span>
              <span className="text-[9px] text-emerald-400 bg-emerald-500/10 font-bold px-1.5 rounded">Gross P&L</span>
            </div>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h3 className={`text-2xl font-black ${totalPnLValue >= 0 ? 'text-emerald-400' : 'text-rose-400'} tracking-tight`}>
                {totalPnLValue >= 0 ? '+' : ''}${totalPnLValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground">
              <span className="text-white font-bold">{tradesCountValue}</span> trades | <span className="text-amber-400 font-bold">{openCountValue} open</span> | <span className="text-emerald-400 font-bold">{winRateValue} win rate</span>
            </p>
          </div>
        </motion.div>

        {/* Card 4: Streak */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Streak</span>
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-400 animate-pulse">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
              {streakValue} <span className="text-xs text-muted-foreground font-semibold">wins</span>
            </h3>
            <p className="text-[10px] text-orange-400 font-bold mt-1.5 flex items-center gap-1">🔥 You're on fire!</p>
          </div>
        </motion.div>

        {/* Card 5: Profit Factor */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Profit Factor</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#a78bfa]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-white tracking-tight">
              {profitFactorValue}
            </h3>
            <p className="text-[10px] text-amber-400 font-bold mt-1.5">✨ Excellent</p>
          </div>
        </motion.div>

        {/* Card 6: Biggest Win */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Biggest Win</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-emerald-400 tracking-tight">
              +${biggestWinValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1.5">Single trade best</p>
          </div>
        </motion.div>

        {/* Card 7: Best Day */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#110d24] border border-[#221a44] p-5 rounded-2xl flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase">Best Day</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-black text-amber-400 tracking-tight">
              +${bestDayValue.toLocaleString('en-US', { minimumFractionDigits: 0 })}.00
            </h3>
            <p className="text-[10px] text-muted-foreground mt-1.5">Feb 11</p>
          </div>
        </motion.div>

      </div>

      {/* Visualizations - Trade Score & Activity Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Trade Score Card (Radar Chart) */}
        <div className="lg:col-span-5 bg-[#110d24]/50 border border-[#221a44] rounded-3xl p-6 flex flex-col">
          <div className="flex justify-between items-start pb-4 border-b border-[#221a44]/60">
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Trade Score</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">Your overall trading performance</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-amber-400 block leading-none">66</span>
              <span className="text-[9px] font-extrabold text-amber-400 tracking-wider uppercase mt-1 inline-block">Improving</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <RadarChart score={66} />
          </div>
        </div>

        {/* Trading Activity Heatmap Card */}
        <div className="lg:col-span-7 flex flex-col">
          <ActivityCalendar />
        </div>

      </div>

      {/* Recent Trades Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }} 
        className="bg-[#110d24]/40 border border-[#221a44] rounded-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-5 border-b border-[#221a44]">
          <h3 className="text-sm font-bold text-white tracking-wide uppercase">Recent Trades</h3>
          <Link to="/dashboard/trades" className="text-xs text-primary hover:underline font-bold">View all →</Link>
        </div>
        {trades.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-25 text-primary" />
            <p className="text-xs">No trades logged yet. <Link to="/dashboard/add-trade" className="text-primary hover:underline">Add your first trade</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-xs">
              <thead className="text-muted-foreground uppercase bg-[#181432]/45 font-extrabold tracking-widest text-[9px] border-b border-[#221a44]">
                <tr>
                  <th className="px-6 py-4.5 text-left">Asset</th>
                  <th className="px-6 py-4.5 text-left">Direction</th>
                  <th className="px-6 py-4.5 text-left">Entry</th>
                  <th className="px-6 py-4.5 text-left">PnL</th>
                  <th className="px-6 py-4.5 text-left">Status</th>
                  <th className="px-6 py-4.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 5).map((trade) => (
                  <tr key={trade._id} className="border-t border-[#221a44]/60 hover:bg-[#181335]/30 transition-colors">
                    <td className="px-6 py-4 font-extrabold text-white text-sm">{trade.asset}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase ${trade.direction === 'Long' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>{trade.direction}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono font-medium">{trade.entryPrice}</td>
                    <td className="px-6 py-4 font-bold font-mono">
                      {trade.pnl == null ? <span className="text-muted-foreground">--</span>
                        : trade.pnl >= 0
                          ? <span className="text-emerald-400">+${trade.pnl.toFixed(2)}</span>
                          : <span className="text-rose-400">-${Math.abs(trade.pnl).toFixed(2)}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-extrabold tracking-wider uppercase ${trade.status === 'Win' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : trade.status === 'Loss' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : trade.status === 'Open' ? 'bg-[#9a7bf3]/10 text-[#a78bfa] border border-[#9a7bf3]/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trade.status === 'Open' && (
                        <button 
                          onClick={() => setCloseModalTrade(trade)} 
                          className="text-[10px] font-bold bg-[#22183f] border border-[#2d2354] hover:bg-[#2c2052] text-foreground px-3 py-1.5 rounded transition-colors"
                        >
                          Close Trade
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Close Trade Modal */}
      <AnimatePresence>
        {closeModalTrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-[#110d24] rounded-2xl p-6 w-full max-w-md border border-[#221a44] shadow-2xl relative"
            >
              <button 
                onClick={() => setCloseModalTrade(null)} 
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-black text-white mb-1">Close Trade</h2>
              <p className="text-xs text-muted-foreground mb-6">Closing <span className="font-extrabold text-white">{closeModalTrade.asset}</span> ({closeModalTrade.direction} @ {closeModalTrade.entryPrice})</p>
              
              <form onSubmit={handleCloseSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Exit Price</label>
                  <input 
                    required 
                    type="number" 
                    step="any" 
                    value={closeData.exitPrice} 
                    onChange={(e) => setCloseData({ ...closeData, exitPrice: e.target.value })} 
                    onWheel={(e) => e.target.blur()}
                    className="w-full bg-[#1b1535] border border-[#2d2354] rounded-lg px-4 py-2.5 text-xs text-white focus:border-primary outline-none" 
                    placeholder="e.g. 1.0543" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground block mb-1">Custom PnL (Optional)</label>
                  <input 
                    type="number" 
                    step="any" 
                    value={closeData.pnl} 
                    onChange={(e) => setCloseData({ ...closeData, pnl: e.target.value })} 
                    onWheel={(e) => e.target.blur()}
                    className="w-full bg-[#1b1535] border border-[#2d2354] rounded-lg px-4 py-2.5 text-xs text-white focus:border-primary outline-none" 
                    placeholder="Auto-calculated if left blank" 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading} 
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-purple-500/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2 text-xs"
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} 
                  Close Trade
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
