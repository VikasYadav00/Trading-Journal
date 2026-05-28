import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// @desc    Register user & send OTP email
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { fullName, username, email, phoneNumber, country, password } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email or username already in use.' });
    }

    const otp = generateOTP();
    const otpExpire = new Date(Date.now() + 15 * 60 * 1000);

    const user = await User.create({
      fullName, username, email, phoneNumber, country, password,
      otp, otpExpire, isVerified: false,
    });

    // Try to send email — don't block account creation if it fails
    let emailSent = false;
    let emailError = null;

    try {
      await sendEmail({
        to: email,
        subject: 'TradeJournal – Verify Your Email',
        html: `
          <div style="font-family:'Inter',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0f1629;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">TradeJournal</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">The Ultimate Trading Analytics Platform</p>
            </div>
            <div style="padding:40px 32px;">
              <h2 style="color:#e2e8f0;margin:0 0 8px;">Verify Your Email 📧</h2>
              <p style="color:#94a3b8;margin:0 0 32px;">Hi ${fullName}, use the OTP below to verify your email. It expires in <strong style="color:#e2e8f0;">15 minutes</strong>.</p>
              <div style="background:#1e293b;border:1px solid rgba(59,130,246,0.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="color:#94a3b8;font-size:13px;margin:0 0 12px;letter-spacing:1px;text-transform:uppercase;">Your Verification Code</p>
                <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#3b82f6;">${otp}</div>
              </div>
              <p style="color:#64748b;font-size:13px;">If you didn't create an account, ignore this email.</p>
            </div>
            <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.08);text-align:center;">
              <p style="color:#475569;font-size:12px;margin:0;">© 2024 TradeJournal. All rights reserved.</p>
            </div>
          </div>
        `,
      });
      emailSent = true;
    } catch (err) {
      emailError = err.message;
      console.warn('⚠️  Email send failed:', err.message);
    }

    // In development, include the OTP in the response so you can test without real email
    const devPayload = process.env.NODE_ENV !== 'production' ? { devOTP: otp } : {};

    if (!emailSent) {
      return res.status(201).json({
        success: true,
        email,
        emailSent: false,
        message: `Account created! However, we could not send the verification email (${emailError}). ${process.env.NODE_ENV !== 'production' ? 'For development, your OTP is included in this response.' : 'Please configure EMAIL_USER and EMAIL_PASS in .env with a Gmail App Password.'}`,
        ...devPayload,
      });
    }

    res.status(201).json({
      success: true,
      email,
      emailSent: true,
      message: `A 6-digit verification code has been sent to ${email}. Please check your inbox (and spam folder).`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP. Please try again.' });
    }

    // Mark as verified, clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, isVerified: false });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found or already verified.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: email,
      subject: 'TradeJournal – New Verification Code',
      html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#0f1629;border-radius:12px;border:1px solid rgba(255,255,255,0.1)">
        <h2 style="color:#e2e8f0">New Verification Code</h2>
        <p style="color:#94a3b8">Your new OTP code is:</p>
        <div style="background:#1e293b;border:1px solid rgba(59,130,246,0.4);border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#3b82f6">${otp}</div>
        </div>
        <p style="color:#64748b;font-size:13px">Expires in 15 minutes.</p>
      </div>`,
    });

    res.status(200).json({ success: true, message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ $or: [{ email }, { username: email }] }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email before logging in.', needsVerification: true, email: user.email });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile (name & password)
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Update Full Name
    if (req.body.fullName) {
      user.fullName = req.body.fullName;
    }

    // Update Password
    if (req.body.password) {
      // If current password check is needed we could add it, but for simplicity:
      if (req.body.currentPassword) {
        const isMatch = await user.matchPassword(req.body.currentPassword);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
      user.password = req.body.password;
    }

    await user.save();
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/v1/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpire = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        to: email,
        subject: 'TradeJournal – Password Reset Code',
        html: `<div style="font-family:'Inter',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0f1629;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#1e40af,#3b82f6);padding:32px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">TradeJournal</h1>
              <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;">Password Reset Request</p>
            </div>
            <div style="padding:40px 32px;">
              <p style="color:#94a3b8;margin:0 0 32px;">Hi ${user.fullName}, use the OTP below to reset your password. It expires in <strong style="color:#e2e8f0;">15 minutes</strong>.</p>
              <div style="background:#1e293b;border:1px solid rgba(59,130,246,0.4);border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <div style="font-size:40px;font-weight:800;letter-spacing:12px;color:#3b82f6;">${otp}</div>
              </div>
              <p style="color:#64748b;font-size:13px;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
          </div>`,
      });
      res.status(200).json({ success: true, message: 'OTP sent to email.' });
    } catch (err) {
      user.otp = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      res.status(500).json({ success: false, message: 'Email could not be sent.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password via OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email, otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password has been updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      plan: user.plan,
    },
  });
};
