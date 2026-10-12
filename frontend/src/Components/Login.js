import React, { useState } from 'react';
import { Lock, User, Loader2, ShieldAlert, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { api } from '../api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  masterLoginShell,
  masterLoginCard,
  masterLoginHeaderWrap,
  masterLoginIconBox,
  masterLoginTitle,
  masterLoginSubtitle,
  masterLoginErrorBox,
  masterLoginForm,
  masterLoginInputWrap,
  masterLoginInputIcon,
  masterLoginInput,
  masterLoginPasswordInput,
  masterLoginEyeBtn,
  masterInputLabel,
  masterCaptchaRow,
  masterCaptchaBox,
  masterCaptchaRefreshBtn,
  masterSubmitButton
} from "../GlobalComponent/masterPageStyles";// Update path as per your directory structure

const createCaptcha = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(createCaptcha);
  const [captchaInput, setCaptchaInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshCaptcha = () => {
    setCaptcha(createCaptcha());
    setCaptchaInput('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (captchaInput.trim() !== captcha) {
      setError('Invalid captcha. Please enter the shown code.');
      refreshCaptcha();
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });

      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('currentUser', JSON.stringify(response.data.user));
        }

        toast.success("Login Successful!");
        navigate('/dashboard', { replace: true });
      } else {
        setError(response.data.message || 'Login failed.');
        refreshCaptcha();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || 'Failed to connect to server.');
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={masterLoginShell}>
      <div className={masterLoginCard}>
        
        <div className={masterLoginHeaderWrap}>
          <div className={masterLoginIconBox}>
            <Lock size={24} />
          </div>
          <h1 className={masterLoginTitle}>Kalyani Nursing Home</h1>
          <p className={masterLoginSubtitle}>Please sign in to continue</p>
        </div>

        {error && (
          <div className={masterLoginErrorBox}>
            <ShieldAlert size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className={masterLoginForm}>
       {/* Username Field */}
          <div className={masterLoginInputWrap}>
            <span className={masterLoginInputIcon}>
              <User size={18} />
            </span>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
              autoComplete="new-password"
              placeholder="User ID"
              className={masterLoginInput}
            />
          </div>

          {/* Password Field with Eye Icon */}
          <div className={masterLoginInputWrap}>
            <span className={masterLoginInputIcon}>
              <Lock size={18} />
            </span>
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
              autoComplete="new-password"
              placeholder="Password"
              className={masterLoginPasswordInput}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={masterLoginEyeBtn}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

        <div>
          <label className={masterInputLabel}>CAPTCHA *</label>
          <div className={masterCaptchaRow}>
            {/* Input field takes full width on mobile, flexible on desktop */}
            <input
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
              required
              maxLength={6}
              placeholder="Enter code"
              className={`${masterLoginInput} w-full sm:flex-1`}
            />
            
            {/* Captcha box and icon grouped together in a single row */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className={masterCaptchaBox}>
                {captcha}
              </div>
              <button
                type="button"
                onClick={refreshCaptcha}
                className={masterCaptchaRefreshBtn}
                aria-label="Refresh captcha"
              >
                <RotateCcw size={18} />
              </button>
            </div>
          </div>
        </div>

          <button 
            type="submit" 
            disabled={loading}
            className={masterSubmitButton}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;