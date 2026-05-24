import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpRight, ArrowDownRight, Trash2, Loader2, PlusCircle, X, Image as ImageIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getTrades, deleteTrade, updateTrade } from '../features/trades/tradeSlice';
import { Link } from 'react-router-dom';

export default function TradeHistory() {
  const dispatch = useDispatch();
  const { trades, isLoading } = useSelector((state) => state.trades);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Close Trade Modal state
  const [closeModalTrade, setCloseModalTrade] = useState(null);
  const [closeData, setCloseData] = useState({ exitPrice: '', pnl: '' });

  useEffect(() => {
    dispatch(getTrades());
  }, [dispatch]);

  const filtered = trades.filter((t) => {
    const matchSearch = t.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.tradeTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColor = (status) => {
    switch (status) {
      case 'Win': return 'bg-success/20 text-success';
      case 'Loss': return 'bg-destructive/20 text-destructive';
      case 'Open': return 'bg-primary/20 text-primary';
      case 'Closed': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleCloseSubmit = (e) => {
    e.preventDefault();
    if (!closeModalTrade) return;

    // Auto calculate PnL if not explicitly set
    let finalPnl = Number(closeData.pnl);
    if (!finalPnl && closeData.exitPrice && closeModalTrade.entryPrice && closeModalTrade.quantity) {
      finalPnl = closeModalTrade.direction === 'Long' 
        ? (Number(closeData.exitPrice) - closeModalTrade.entryPrice) * closeModalTrade.quantity
        : (closeModalTrade.entryPrice - Number(closeData.exitPrice)) * closeModalTrade.quantity;
    }

    const updatedStatus = finalPnl > 0 ? 'Win' : finalPnl < 0 ? 'Loss' : 'Breakeven';

    dispatch(updateTrade({
      id: closeModalTrade._id,
      tradeData: {
        exitPrice: Number(closeData.exitPrice),
        pnl: finalPnl,
        status: updatedStatus,
      }
    }));
    
    setCloseModalTrade(null);
    setCloseData({ exitPrice: '', pnl: '' });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trade History</h1>
          <p className="text-muted-foreground mt-1">{trades.length} trades logged</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input type="text" placeholder="Search trades..."
              className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-foreground/5 border border-foreground/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all">
            <option>All</option><option>Win</option><option>Loss</option><option>Open</option><option>Closed</option>
          </select>
          <Link to="/dashboard/add-trade"
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 whitespace-nowrap">
            <PlusCircle className="w-4 h-4" /> Add Trade
          </Link>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl overflow-hidden shadow-2xl border border-foreground/5">
        {isLoading && trades.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
            <p className="text-lg">No trades found</p>
            <Link to="/dashboard/add-trade" className="text-primary hover:underline text-sm font-medium">
              + Log your first trade
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-foreground/5 border-b border-foreground/10">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Asset</th>
                    <th className="px-6 py-4">Direction</th>
                    <th className="px-6 py-4">Entry / Exit</th>
                    <th className="px-6 py-4">PnL</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Screenshot</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((trade) => (
                    <tr key={trade._id} className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">
                          {new Date(trade.entryDate || trade.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-foreground">{trade.asset}</div>
                        <div className="text-xs text-muted-foreground">{trade.marketCategory}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${trade.direction === 'Long' ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">E: {trade.entryPrice}</div>
                        <div className="text-muted-foreground text-xs">X: {trade.exitPrice || '--'}</div>
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {trade.pnl == null ? (
                          <span className="text-muted-foreground">--</span>
                        ) : trade.pnl > 0 ? (
                          <span className="text-success flex items-center gap-1"><ArrowUpRight className="w-3 h-3" />+${trade.pnl.toFixed(2)}</span>
                        ) : trade.pnl < 0 ? (
                          <span className="text-destructive flex items-center gap-1"><ArrowDownRight className="w-3 h-3" />-${Math.abs(trade.pnl).toFixed(2)}</span>
                        ) : (
                          <span className="text-muted-foreground">$0.00</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${statusColor(trade.status)}`}>{trade.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        {trade.screenshot ? (
                          <a href={trade.screenshot} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline text-xs font-medium">
                            <ImageIcon className="w-4 h-4" /> View
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-3">
                          {trade.status === 'Open' && (
                            <button onClick={() => setCloseModalTrade(trade)} className="text-xs font-semibold bg-foreground/10 hover:bg-foreground/20 text-foreground px-3 py-1.5 rounded-md transition-colors">
                              Close Trade
                            </button>
                          )}
                          <button onClick={() => { if(window.confirm('Delete trade?')) dispatch(deleteTrade(trade._id)); }}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1 opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-foreground/10 flex justify-between items-center text-sm text-muted-foreground">
              <span>Showing {filtered.length} of {trades.length} trades</span>
            </div>
          </>
        )}
      </motion.div>

      {/* Close Trade Modal */}
      <AnimatePresence>
        {closeModalTrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md border border-foreground/10 shadow-2xl relative">
              <button onClick={() => setCloseModalTrade(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-2">Close Trade</h2>
              <p className="text-sm text-muted-foreground mb-6">Closing <span className="font-bold text-foreground">{closeModalTrade.asset}</span> ({closeModalTrade.direction} @ {closeModalTrade.entryPrice})</p>
              
              <form onSubmit={handleCloseSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Exit Price</label>
                  <input required type="number" step="any" value={closeData.exitPrice} onChange={(e) => setCloseData({ ...closeData, exitPrice: e.target.value })} 
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="e.g. 1.0543" />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground block mb-1">Custom PnL (Optional)</label>
                  <input type="number" step="any" value={closeData.pnl} onChange={(e) => setCloseData({ ...closeData, pnl: e.target.value })} 
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="Auto-calculated if left blank" />
                </div>
                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg shadow-primary/25 mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
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
