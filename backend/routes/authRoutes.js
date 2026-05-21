import express from 'express';
import { register, login, getMe, verifyOTP, resendOTP, updateProfile, forgotPassword, resetPassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

// Dev-only: test email sending
router.get('/test-email', async (req, res) => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'TradeJournal – SMTP Test',
      html: '<h2>✅ Email is working correctly!</h2><p>Your Gmail SMTP configuration is set up properly.</p>',
    });
    res.json({ success: true, message: 'Test email sent! Check your inbox.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

