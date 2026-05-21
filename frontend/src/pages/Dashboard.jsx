import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Target, TrendingUp, PlusCircle, X, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, updateTrade } from '../features/trades/tradeSlice';
import { Link } from 'react-router-dom';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const dispatch = useDispatch();
  const { trades, isLoading } = useSelector((state) => state.trades);
  const { user } = useSelector((state) => state.auth);

  const [closeModalTrade, setCloseModalTrade] = useState(null);
  const [closeData, setCloseData] = useState({ exitPrice: '', pnl: '' });

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

  // Compute live stats from real trades
  const closed = trades.filter(t => t.status !== 'Open');
  const wins = closed.filter(t => t.status === 'Win').length;
  const losses = closed.filter(t => t.status === 'Loss').length;
  const winRate = closed.length > 0 ? ((wins / closed.length) * 100).toFixed(1) : '0.0';
  const netPnL = closed.reduce((acc, t) => acc + (t.pnl || 0), 0);

  // Build equity curve (running sum over last 10 closed trades)
  const last10 = closed.slice(-10);
  let running = 0;
  const equityPoints = last10.map(t => { running += (t.pnl || 0); return running; });
  const equityLabels = last10.map((t, i) => t.asset || `Trade ${i+1}`);

  const lineData = {
    labels: equityLabels.length ? equityLabels : ['Start'],
    datasets: [{
      label: 'Equity',
      data: equityPoints.length ? equityPoints : [0],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
    }],
  };

  const donutData = {
    labels: ['Wins', 'Losses', 'Breakeven'],
    datasets: [{
      data: [
        wins,
        losses,
        closed.filter(t => t.status === 'Breakeven' || t.status === 'Closed').length
      ],
      backgroundColor: ['rgba(34,197,94,0.8)', 'rgba(239,68,68,0.8)', 'rgba(156,163,175,0.8)'],
      borderColor: ['rgba(34,197,94,1)', 'rgba(239,68,68,1)', 'rgba(156,163,175,1)'],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255,255,255,0.07)' }, ticks: { color: 'rgba(255,255,255,0.5)', callback: v => `$${v}` } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } }
    }
  };

  const donutOptions = {
    plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', padding: 16 } } }
  };

  const stats = [
    { name: 'Net PnL', value: `${netPnL >= 0 ? '+' : ''}$${netPnL.toFixed(2)}`, trend: netPnL >= 0 ? 'up' : 'down', icon: DollarSign, sub: `${closed.length} closed trades` },
    { name: 'Win Rate', value: `${winRate}%`, trend: parseFloat(winRate) >= 50 ? 'up' : 'down', icon: Target, sub: `${wins}W / ${losses}L` },
    { name: 'Total Trades', value: trades.length.toString(), trend: 'neutral', icon: Activity, sub: `${trades.filter(t=>t.status==='Open').length} open` },
    { name: 'Best Asset', value: closed.length ? (closed.sort((a,b)=>(b.pnl||0)-(a.pnl||0))[0]?.asset || '--') : '--', trend: 'neutral', icon: TrendingUp, sub: 'By PnL' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, <span className="text-foreground font-medium">{user?.fullName || user?.username || 'Trader'}</span> 👋</p>
        </div>
        <Link to="/dashboard/add-trade"
          className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
          <PlusCircle className="w-4 h-4" /> Log Trade
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <motion.div key={stat.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }} className="glass-card rounded-xl p-5 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              {stat.trend === 'up' && <span className="flex items-center text-xs font-medium text-success bg-success/10 rounded-full px-2 py-0.5"><ArrowUpRight className="w-3 h-3 mr-0.5" />Positive</span>}
              {stat.trend === 'down' && <span className="flex items-center text-xs font-medium text-destructive bg-destructive/10 rounded-full px-2 py-0.5"><ArrowDownRight className="w-3 h-3 mr-0.5" />Negative</span>}
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }} className="lg:col-span-2 glass-card rounded-xl p-6 border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-semibold">Equity Curve</h3>
            <span className="text-xs text-muted-foreground">Last {last10.length} trades</span>
          </div>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }} className="glass-card rounded-xl p-6 flex flex-col border border-white/5">
          <h3 className="text-base font-semibold mb-4">Win / Loss Ratio</h3>
          <div className="flex-1 flex items-center justify-center">
            {closed.length > 0 ? (
              <div className="w-full max-w-[220px]">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No closed trades yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Trades Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }} className="glass-card rounded-xl overflow-hidden border border-white/5">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h3 className="text-base font-semibold">Recent Trades</h3>
          <Link to="/dashboard/trades" className="text-sm text-primary hover:underline font-medium">View all →</Link>
        </div>
        {trades.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No trades logged yet. <Link to="/dashboard/add-trade" className="text-primary hover:underline">Add your first trade</Link></p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left">Asset</th>
                  <th className="px-6 py-4 text-left">Direction</th>
                  <th className="px-6 py-4 text-left">Entry</th>
                  <th className="px-6 py-4 text-left">PnL</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 5).map((trade) => (
                  <tr key={trade._id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{trade.asset}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${trade.direction === 'Long' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>{trade.direction}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{trade.entryPrice}</td>
                    <td className="px-6 py-4 font-medium">
                      {trade.pnl == null ? <span className="text-muted-foreground">--</span>
                        : trade.pnl >= 0
                          ? <span className="text-success">+${trade.pnl.toFixed(2)}</span>
                          : <span className="text-destructive">-${Math.abs(trade.pnl).toFixed(2)}</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${trade.status === 'Win' ? 'bg-success/20 text-success' : trade.status === 'Loss' ? 'bg-destructive/20 text-destructive' : trade.status === 'Open' ? 'bg-primary/20 text-primary' : 'bg-gray-500/20 text-gray-400'}`}>
                        {trade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {trade.status === 'Open' && (
                        <button onClick={() => setCloseModalTrade(trade)} className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl relative">
              <button onClick={() => setCloseModalTrade(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-2">Close Trade</h2>
              <p className="text-sm text-muted-foreground mb-6">Closing <span className="font-bold text-white">{closeModalTrade.asset}</span> ({closeModalTrade.direction} @ {closeModalTrade.entryPrice})</p>
              
              <form onSubmit={handleCloseSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Exit Price</label>
                  <input required type="number" step="any" value={closeData.exitPrice} onChange={(e) => setCloseData({ ...closeData, exitPrice: e.target.value })} 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="e.g. 1.0543" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Custom PnL (Optional)</label>
                  <input type="number" step="any" value={closeData.pnl} onChange={(e) => setCloseData({ ...closeData, pnl: e.target.value })} 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="Auto-calculated if left blank" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg shadow-lg shadow-primary/25 mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />} Close Trade
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
