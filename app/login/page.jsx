'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // โหลด email ที่บันทึกไว้ (ถ้ามี)
  useEffect(() => {
    try {
      const savedEmail = sessionStorage.getItem('savedEmail');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {
      console.log('ไม่สามารถเข้าถึง sessionStorage');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // บันทึก email ถ้า remember me
        if (rememberMe) {
          try {
            sessionStorage.setItem('savedEmail', email);
          } catch (e) {
            console.log('ไม่สามารถบันทึกอีเมล');
          }
        } else {
          try {
            sessionStorage.removeItem('savedEmail');
          } catch (e) {
            console.log('ไม่สามารถลบอีเมลที่บันทึก');
          }
        }

        setSuccess('เข้าสู่ระบบสำเร็จ! กำลังเปลี่ยนหน้า...');

        // เด้งไปหน้าแรก
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      setError('เข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              เมือง
            </div>
          </div>
        </div>

        {/* Header Text */}
        <h1 className="text-center text-2xl font-bold text-blue-600 mb-2">
          เข้าสู่ระบบ
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          ยังไม่มีบัญชี ?{' '}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            ลงทะเบียน
          </a>
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2 animate-fadeIn">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2 animate-fadeIn">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              เบอร์โทรศัพท์ หรือ อีเมล
            </label>
            <input
              type="text"
              placeholder="กรอกเบอร์โทรศัพท์หรืออีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 rounded border-gray-300 cursor-pointer"
              />
              <span className="text-gray-600">จำไว้ในครั้งถัดไป</span>
            </label>
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              ลืมรหัสผ่าน?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs">
            <p className="font-semibold text-blue-900 mb-1">Demo Credentials:</p>
            <p className="text-blue-800">Email: <code className="bg-white px-1 rounded">test@example.com</code></p>
            <p className="text-blue-800">Password: <code className="bg-white px-1 rounded">password</code></p>
          </div>

          {/* Signup Link */}
          <p className="text-center text-gray-600 text-sm">
            ยังไม่มีบัญชี?{' '}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              สมัครสมาชิก
            </a>
          </p>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}