import { useState } from 'react';
import { authService } from '../services/authService';
import { setCredentials, logout } from '../presentation/components/store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState, type AppDispatch } from '../presentation/components/store/store';

export default function useAuthViewModel() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // ---------------------------
  // Step 1: Signup → send OTP
  // ---------------------------
  const signup = async (
    fullName: string,
    email: string,
    password: string,
    role: 'student' | 'teacher' | 'admin',
  ) => {
    setLoading(true);
    setError('');
    try {
      await authService.signup({ fullName, email, password, role });
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  
  const verifyOtp = async (email: string, otp: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.verifyOtp({ email, otp });
      dispatch(setCredentials(res)); 
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('OTP verification failed');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // Login
  // ---------------------------
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await authService.login({ email, password });
      dispatch(setCredentials(res));
      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => dispatch(logout());

  return {
    isAuthenticated,
    token,
    loading,
    error,
    signup,
    verifyOtp,
    login,
    logout: handleLogout,
  };
}
