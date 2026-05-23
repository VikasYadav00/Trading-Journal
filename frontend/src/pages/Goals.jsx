import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, CheckCircle, Circle, Trophy, TrendingUp, Calendar, X, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { getGoals, addGoal, updateGoal, deleteGoal } from '../features/goals/goalSlice';

const iconMap = { Target, Trophy, TrendingUp, Calendar };

export default function Goals() {
  const dispatch = useDispatch();
  const { goals, isLoading } = useSelector((state) => state.goals);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', target: '', unit: '', iconName: 'Target' });
  const [editingProgressId, setEditingProgressId] = useState(null);
  const [newProgress, setNewProgress] = useState('');

  useEffect(() => {
    dispatch(getGoals());
  }, [dispatch]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    dispatch(addGoal({ ...formData, target: Number(formData.target) }));
    setIsModalOpen(false);
    setFormData({ title: '', target: '', unit: '', iconName: 'Target' });
  };

  const handleProgressUpdate = (id, e) => {
    e.preventDefault();
    dispatch(updateGoal({ id, data: { progress: Number(newProgress) } }));
    setEditingProgressId(null);
    setNewProgress('');
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      dispatch(deleteGoal(id));
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trading Goals</h1>
          <p className="text-muted-foreground mt-1">Set targets and track your progress.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {isLoading && goals.length === 0 ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal, i) => {
            const IconComponent = iconMap[goal.iconName] || Target;
            const pct = Math.min((goal.progress / goal.target) * 100, 100);
            
            return (
              <motion.div key={goal._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 space-y-4 relative group">
                <button onClick={() => handleDelete(goal._id)} className="absolute top-4 right-4 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start justify-between gap-3 pr-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${goal.done ? 'bg-success/20' : 'bg-primary/20'}`}>
                      <IconComponent className={`w-5 h-5 ${goal.done ? 'text-success' : 'text-primary'}`} />
                    </div>
                    <h3 className="font-semibold leading-snug">{goal.title}</h3>
                  </div>
                  {goal.done ? <CheckCircle className="w-5 h-5 text-success flex-shrink-0" /> : <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-muted-foreground">Progress</span>
                    {editingProgressId === goal._id ? (
                      <form onSubmit={(e) => handleProgressUpdate(goal._id, e)} className="flex items-center gap-2">
                        <input type="number" autoFocus value={newProgress} onChange={(e) => setNewProgress(e.target.value)} className="w-20 px-2 py-0.5 text-sm bg-foreground/10 border border-foreground/10 rounded outline-none" />
                        <button type="submit" className="text-primary text-xs font-semibold">Save</button>
                        <button type="button" onClick={() => setEditingProgressId(null)} className="text-muted-foreground text-xs">Cancel</button>
                      </form>
                    ) : (
                      <button onClick={() => { setEditingProgressId(goal._id); setNewProgress(goal.progress); }} className="font-medium hover:text-primary transition-colors cursor-pointer text-left">
                        {goal.unit === '$' ? `$${goal.progress.toLocaleString()} / $${goal.target.toLocaleString()}` : `${goal.progress} / ${goal.target} ${goal.unit}`}
                      </button>
                    )}
                  </div>
                  <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 + 0.2 }} className={`h-full rounded-full ${goal.done ? 'bg-success' : 'bg-primary'}`} />
                  </div>
                  <div className="text-right text-xs text-muted-foreground">{pct.toFixed(0)}% complete</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md border border-foreground/10 shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"><X className="w-5 h-5" /></button>
              <h2 className="text-xl font-bold mb-6">Create New Goal</h2>
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div><label className="text-sm font-medium text-muted-foreground block mb-1">Goal Title</label><input required type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="e.g. Log 100 Trades" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium text-muted-foreground block mb-1">Target Value</label><input required type="number" name="target" value={formData.target} onChange={(e) => setFormData({ ...formData, target: e.target.value })} className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="100" /></div>
                  <div><label className="text-sm font-medium text-muted-foreground block mb-1">Unit</label><input required type="text" name="unit" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none" placeholder="trades, $, %" /></div>
                </div>
                <div><label className="text-sm font-medium text-muted-foreground block mb-1">Icon</label><select value={formData.iconName} onChange={(e) => setFormData({ ...formData, iconName: e.target.value })} className="w-full bg-foreground/5 border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary outline-none appearance-none"><option value="Target">Target</option><option value="Trophy">Trophy</option><option value="TrendingUp">Trending Up</option><option value="Calendar">Calendar</option></select></div>
                <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg shadow-primary/25 mt-4 disabled:opacity-50">{isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Create Goal'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
