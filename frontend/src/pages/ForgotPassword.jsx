import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, KeyRound, Lock, AlertCircle, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword, reset } from '../features/auth/authSlice';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => dispatch(reset());
  }, [dispatch]);

  const handleRequestOTP = (e) => {
    e.preventDefault();
    dispatch(forgotPassword({ email })).then((res) => {
      if (!res.error) setStep(2);
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ email, otp, newPassword })).then((res) => {
      if (!res.error) setStep(3);
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 z-10"
      >
        <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
        </Link>

        {isError && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/20 mx-auto mb-4 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/10">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
                <p className="text-sm text-muted-foreground mt-2">Enter your email to receive a password reset code</p>
              </div>

              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="email" 
                      placeholder="trader@example.com"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isLoading ? 'Sending...' : 'Send Reset Code'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
               <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/20 mx-auto mb-4 flex items-center justify-center text-primary font-bold shadow-lg shadow-primary/10">
                  <Lock className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
                <p className="text-sm text-muted-foreground mt-2">We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span></p>
              </div>

              {isSuccess && step === 2 && (
                <div className="mb-6 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2 text-success text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Code sent successfully!
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">6-Digit Code</label>
                  <input 
                    type="text" 
                    placeholder="123456"
                    className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-3 px-4 text-center text-xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    required
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input 
                      type="password" 
                      placeholder="Enter new password"
                      className="w-full bg-foreground/5 border border-foreground/10 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all mt-6 shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-success/20 mx-auto mb-6 flex items-center justify-center text-success">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">Password Updated!</h2>
              <p className="text-muted-foreground mb-8">Your password has been successfully reset. You can now log in with your new credentials.</p>
              
              <button 
                onClick={() => navigate('/login')}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-lg shadow-primary/25 transition-all"
              >
                Go to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
