import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades } from '../features/trades/tradeSlice';
import { Loader2 } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Title, Tooltip, Legend, Filler
);

export default function Analytics() {
  const dispatch = useDispatch();
  const { trades, isLoading } = useSelector((state) => state.trades);

  useEffect(() => {
    dispatch(getTrades());
  }, [dispatch]);

  // Aggregate Data
  const { lineChartData, donutData, strategyStats } = useMemo(() => {
    const closed = trades.filter(t => t.status !== 'Open');

    // 1. Equity Curve Data
    const sortedTrades = [...closed].sort((a, b) => new Date(a.entryDate) - new Date(b.entryDate));
    let runningPnL = 0;
    const equityPoints = sortedTrades.map(t => {
      runningPnL += (t.pnl || 0);
      return runningPnL;
    });
    const equityLabels = sortedTrades.map(t => new Date(t.entryDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }));

    const lineData = {
      labels: equityLabels.length ? equityLabels : ['Start'],
      datasets: [{
        label: 'Cumulative PnL',
        data: equityPoints.length ? equityPoints : [0],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6',
      }],
    };

    // 2. Win/Loss Donut
    const wins = closed.filter(t => t.status === 'Win').length;
    const losses = closed.filter(t => t.status === 'Loss').length;
    const breakeven = closed.filter(t => t.status === 'Breakeven' || t.status === 'Closed').length; // Treating 'Closed' with 0 PnL as breakeven

    const dData = {
      labels: ['Wins', 'Losses', 'Breakeven'],
      datasets: [{
        data: [wins, losses, breakeven],
        backgroundColor: ['rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)', 'rgba(156, 163, 175, 0.8)'],
        borderColor: ['rgba(34, 197, 94, 1)', 'rgba(239, 68, 68, 1)', 'rgba(156, 163, 175, 1)'],
        borderWidth: 1,
      }],
    };

    // 3. Performance By Strategy (Using 'setupType' or 'marketCategory' if setupType is empty)
    const statsMap = {};
    closed.forEach(t => {
      const strategy = t.setupType || t.marketCategory || 'Other';
      if (!statsMap[strategy]) {
        statsMap[strategy] = { name: strategy, count: 0, wins: 0, pnl: 0, grossProfit: 0, grossLoss: 0 };
      }
      statsMap[strategy].count++;
      if (t.status === 'Win') statsMap[strategy].wins++;
      
      const pnl = t.pnl || 0;
      statsMap[strategy].pnl += pnl;
      if (pnl > 0) statsMap[strategy].grossProfit += pnl;
      if (pnl < 0) statsMap[strategy].grossLoss += Math.abs(pnl);
    });

    const sStats = Object.values(statsMap).map(s => {
      const winRate = s.count > 0 ? ((s.wins / s.count) * 100).toFixed(1) : '0.0';
      const profitFactor = s.grossLoss > 0 ? (s.grossProfit / s.grossLoss).toFixed(2) : (s.grossProfit > 0 ? '∞' : '0.00');
      return { ...s, winRate, profitFactor };
    }).sort((a, b) => b.pnl - a.pnl);

    return { lineChartData: lineData, donutData: dData, strategyStats: sStats };
  }, [trades]);

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: 'rgba(255,255,255,0.5)', callback: v => `$${v}` } },
      x: { grid: { display: false }, ticks: { color: 'rgba(255,255,255,0.5)' } }
    }
  };

  const donutOptions = {
    plugins: { legend: { position: 'bottom', labels: { color: 'rgba(255,255,255,0.7)', padding: 20 } } }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your trading performance and metrics.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : trades.filter(t => t.status !== 'Open').length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center text-muted-foreground border border-white/5">
          <p className="text-lg">Not enough data to display analytics.</p>
          <p className="text-sm mt-2">Close some trades to see your performance metrics here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Equity Curve */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 glass-card rounded-xl p-6 h-[450px] flex flex-col border border-white/5 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4">Cumulative PnL Curve</h3>
            <div className="flex-1 w-full relative">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </motion.div>

          {/* Win Rate Donut */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6 h-[450px] flex flex-col items-center border border-white/5 shadow-xl"
          >
            <h3 className="text-lg font-semibold mb-4 w-full text-left">Win/Loss Ratio</h3>
            <div className="flex-1 w-full max-w-[250px] flex items-center justify-center">
              <Doughnut data={donutData} options={donutOptions} />
            </div>
          </motion.div>
          
          {/* Performance by Strategy Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-3 glass-card rounded-xl overflow-hidden border border-white/5 shadow-xl"
          >
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold">Performance by Strategy / Market</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4">Strategy / Category</th>
                    <th className="px-6 py-4">Trades</th>
                    <th className="px-6 py-4">Win Rate</th>
                    <th className="px-6 py-4">Profit Factor</th>
                    <th className="px-6 py-4">Net PnL</th>
                  </tr>
                </thead>
                <tbody>
                  {strategyStats.map((stat, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">{stat.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{stat.count}</td>
                      <td className={`px-6 py-4 font-medium ${parseFloat(stat.winRate) >= 50 ? 'text-success' : 'text-destructive'}`}>
                        {stat.winRate}%
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{stat.profitFactor}</td>
                      <td className={`px-6 py-4 font-medium ${stat.pnl >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stat.pnl >= 0 ? '+' : '-'}${Math.abs(stat.pnl).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
