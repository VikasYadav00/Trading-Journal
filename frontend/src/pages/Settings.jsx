import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, reset } from '../features/auth/authSlice';

const sections = [
  { icon: Bell, title: 'Notifications', desc: 'Manage email and in-app notifications' },
  { icon: Shield, title: 'Security', desc: 'Two-factor authentication' },
  { icon: CreditCard, title: 'Billing', desc: 'Manage your subscription and payment methods' },
];

export default function Settings() {
  const { user, isLoading, isSuccess, isError, message } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    currentPassword: '',
    newPassword: '',
  });
  const [localSuccess, setLocalSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (isSuccess && isEditing) {
      setLocalSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
      setTimeout(() => setLocalSuccess(''), 3000);
      dispatch(reset());
    }
    if (isError && isEditing) {
      setLocalError(message || 'Failed to update profile');
      setTimeout(() => setLocalError(''), 4000);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setLocalError('');
    setLocalSuccess('');
    
    const updateData = {};
    if (formData.fullName && formData.fullName !== user?.fullName) {
      updateData.fullName = formData.fullName;
    }
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setLocalError('Please enter current password to change password');
        return;
      }
      updateData.currentPassword = formData.currentPassword;
      updateData.password = formData.newPassword;
    }

    if (Object.keys(updateData).length === 0) {
      setIsEditing(false);
      return;
    }

    dispatch(updateProfile(updateData));
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </div>

      {localSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-success/10 border border-success/30 flex items-center gap-3 text-success">
          <CheckCircle className="w-5 h-5" />
          {localSuccess}
        </motion.div>
      )}

      {localError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-3 text-destructive">
          <AlertCircle className="w-5 h-5" />
          {localError}
        </motion.div>
      )}

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl overflow-hidden">
        
        <div className="p-6 flex items-center gap-5 border-b border-foreground/5">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
            {user?.fullName?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'T'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{user?.fullName || user?.username}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">{user?.plan || 'Free'} Plan</span>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-lg border border-foreground/10 hover:bg-foreground/5 transition-colors text-sm font-medium">
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-foreground/5"
            >
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 border-t border-foreground/5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Leave blank to keep same"
                      className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className="w-full bg-background border border-foreground/10 rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isLoading}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec, i) => (
          <motion.button key={sec.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-5 flex items-start gap-4 text-left hover:bg-foreground/5 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
              <sec.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{sec.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{sec.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mt-8">
        <h3 className="font-medium text-destructive mb-1">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-3">Permanently delete your account and all data.</p>
        <button className="px-4 py-2 rounded-lg border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors text-sm">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
