import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Image as ImageIcon, Calculator, CheckCircle, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addTrade, resetTrades } from '../features/trades/tradeSlice';
import { useNavigate } from 'react-router-dom';

export default function AddTrade() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.trades);
  const submitted = useRef(false); // only redirect if THIS form submitted

  const [formData, setFormData] = useState({
    tradeTitle: '', asset: '', marketCategory: 'Forex', direction: 'Long',
    entryPrice: '', exitPrice: '', stopLoss: '', takeProfit: '',
    quantity: '', setupType: '', timeframe: '15m', status: 'Open',
    entryDate: new Date().toISOString().split('T')[0],
    entryTime: '', confidenceLevel: 5, notes: ''
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Only navigate if WE triggered the submission
    if (isSuccess && submitted.current) {
      setTimeout(() => { navigate('/dashboard/trades'); }, 1200);
    }
    return () => { dispatch(resetTrades()); };
  }, [isSuccess, navigate, dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitted.current = true; // mark that this component initiated the dispatch
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) submitData.append(key, formData[key]);
    });
    if (file) {
      submitData.append('screenshot', file);
    }
    
    dispatch(addTrade(submitData));
  };

  // Auto-calculate Risk:Reward
  const riskReward = () => {
    const entry = parseFloat(formData.entryPrice);
    const sl = parseFloat(formData.stopLoss);
    const tp = parseFloat(formData.takeProfit);
    if (!entry || !sl || !tp) return null;
    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return risk > 0 ? (reward / risk).toFixed(2) : null;
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Log a New Trade</h1>
        <p className="text-muted-foreground">Record the details, setup, and psychology of your trade.</p>
      </div>

      {isSuccess && (
        <div className="p-4 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2 text-success">
          <CheckCircle className="w-5 h-5" /> Trade logged successfully! Redirecting...
        </div>
      )}
      {isError && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">1</span>
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Trade Title</label>
              <input name="tradeTitle" value={formData.tradeTitle} onChange={handleChange}
                placeholder="e.g. Breakout on EURUSD"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Asset / Ticker</label>
              <input name="asset" value={formData.asset} onChange={handleChange}
                placeholder="EURUSD, AAPL, BTC"
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Market Category</label>
              <select name="marketCategory" value={formData.marketCategory} onChange={handleChange}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <option>Forex</option><option>Crypto</option><option>Stocks</option><option>Indices</option><option>Commodities</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <div className="flex gap-4">
                {['Long', 'Short'].map((dir) => (
                  <label key={dir} className="flex-1 cursor-pointer">
                    <input type="radio" name="direction" value={dir} checked={formData.direction === dir} onChange={handleChange} className="peer sr-only" />
                    <div className={`p-3 text-center rounded-lg border transition-all peer-checked:font-medium ${dir === 'Long' ? 'border-foreground/10 peer-checked:bg-success/20 peer-checked:border-success peer-checked:text-success' : 'border-foreground/10 peer-checked:bg-destructive/20 peer-checked:border-destructive peer-checked:text-destructive'}`}>
                      {dir === 'Long' ? 'Long / Buy' : 'Short / Sell'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entry Date</label>
              <input type="date" name="entryDate" value={formData.entryDate} onChange={handleChange}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all">
                <option>Open</option><option>Closed</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Execution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">2</span>
              Execution Details
            </h2>
            {riskReward() && (
              <div className="flex items-center gap-2 text-sm bg-primary/10 border border-primary/30 rounded-lg px-3 py-1.5">
                <Calculator className="w-4 h-4 text-primary" />
                <span className="text-primary font-medium">R:R = 1:{riskReward()}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[['entryPrice','Entry Price'],['stopLoss','Stop Loss'],['takeProfit','Take Profit'],['quantity','Quantity / Lot Size']].map(([name, label]) => (
              <div key={name} className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{label}</label>
                <input type="number" step="any" name={name} value={formData[name]} onChange={handleChange}
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required={name === 'entryPrice' || name === 'quantity'} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Psychology */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">3</span>
            Psychology & Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex justify-between">
                  Confidence Level <span className="text-primary font-bold">{formData.confidenceLevel}/10</span>
                </label>
                <input type="range" min="1" max="10" name="confidenceLevel"
                  value={formData.confidenceLevel} onChange={handleChange} className="w-full accent-primary" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span><span>Medium</span><span>High</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Trade Notes / Lessons</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange}
                  rows="4" placeholder="What was your thesis? What went well? What could be improved?"
                  className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"></textarea>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Screenshots</label>
              <div className="relative border-2 border-dashed border-foreground/20 rounded-xl h-44 flex flex-col items-center justify-center text-muted-foreground hover:bg-foreground/5 hover:border-primary/40 transition-colors cursor-pointer overflow-hidden">
                {file ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    <p className="font-medium text-foreground truncate max-w-[200px] mb-2">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm">Drag & drop or click to upload</p>
                    <p className="text-xs mt-1 opacity-60">PNG, JPG, WEBP</p>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  onChange={(e) => setFile(e.target.files[0])} 
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/dashboard/trades')}
            className="px-6 py-3 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-primary/25 disabled:opacity-70">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isLoading ? 'Saving...' : 'Log Trade'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
