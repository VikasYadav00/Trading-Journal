import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Globe, UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', username: '', email: '',
    phoneNumber: '', country: '', password: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${BASE_URL}/api/v1/auth/register`, userData);
      // Redirect to OTP verification — user will enter code from their email
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden dark py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl glass-card rounded-2xl p-8 z-10 shadow-2xl shadow-black/50"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">T</div>
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-sm text-muted-foreground mt-2">Join the ultimate trading analytics platform</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="John Doe"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="trader_john"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="email" placeholder="john@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="+1 234 567 890"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.phoneNumber} onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="United States"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.country} onChange={(e) => setFormData({...formData, country: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="password" placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <input type="password" placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} required />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-8 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UserPlus className="w-5 h-5" />}
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
