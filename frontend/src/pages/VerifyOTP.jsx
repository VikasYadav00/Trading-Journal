import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Mail, ShieldCheck, RefreshCw, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login as setAuthState } from '../features/auth/authSlice';

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const email = location.state?.email || '';

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer === 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // Redirect if no email in state
  useEffect(() => {
    if (!email) navigate('/register');
  }, [email, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${BASE_URL}/api/v1/auth/verify-otp`, { email, otp: code });
      // Save token & user to localStorage and Redux
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      dispatch({ type: 'auth/login/fulfilled', payload: res.data });
      setSuccess('Email verified! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError('');
    try {
      const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${BASE_URL}/api/v1/auth/resend-otp`, { email });
      setSuccess('A new code has been sent to your email!');
      setResendTimer(60);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 relative overflow-hidden dark">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-success/5 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md glass-card rounded-2xl p-8 z-10"
      >
        {/* Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mx-auto mb-5 flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Check Your Email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-medium text-primary mt-1 flex items-center justify-center gap-1.5">
            <Mail className="w-4 h-4" />{email}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Check your inbox and spam folder.</p>
        </div>

        {/* Alerts */}
        {error && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
          </motion.div>
        )}
        {success && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2 text-success text-sm">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />{success}
          </motion.div>
        )}

        {/* OTP Input */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium block mb-3 text-center text-muted-foreground">
              Enter your verification code
            </label>
            <div className="flex gap-3 justify-center" onPaste={handlePaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 bg-foreground/5 focus:outline-none transition-all
                    ${digit ? 'border-primary text-primary' : 'border-foreground/10'}
                    focus:border-primary focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]`}
                />
              ))}
            </div>
          </div>

          <button type="submit" disabled={isLoading || otp.join('').length < 6}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Didn't receive the code?{' '}
            {resendTimer > 0 ? (
              <span className="text-muted-foreground">Resend in <span className="text-foreground font-medium">{resendTimer}s</span></span>
            ) : (
              <button onClick={handleResend} disabled={isResending}
                className="text-primary font-medium hover:underline flex items-center gap-1 inline-flex disabled:opacity-60">
                {isResending ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Use a different email
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
