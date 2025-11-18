'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    // ดึง token จาก URL
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');
    setToken(resetToken);
  }, []);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      setError('กรุณากรอกรหัสผ่านให้ครบถ้วน');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    if (newPassword.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        return;
      }

      setSuccess('เปลี่ยนรหัสผ่านสำเร็จ! กำลังเปลี่ยนหน้า...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleReset();
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">ลิงค์ไม่ถูกต้อง</h1>
          <p className="text-gray-600 mb-6">ลิงค์รีเซ็ตรหัสผ่านไม่ถูกต้องหรือหมดอายุแล้ว</p>
          <a href="/forgot-password" className="text-blue-600 hover:underline font-medium">
            ส่งลิงค์ใหม่
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              Y
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
              E
            </div>
          </div>
        </div>

        {/* Header Text */}
        <h1 className="text-center text-2xl font-bold text-blue-600 mb-2">
          เปลี่ยนรหัสผ่าน
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          กรอกรหัสผ่านใหม่ของคุณ
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <div className="space-y-6">
          {/* New Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              รหัสผ่านใหม่
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'กำลังเปลี่ยนรหัสผ่าน...' : 'เปลี่ยนรหัสผ่าน'}
          </button>

          {/* Back to Login */}
          <p className="text-center text-gray-600 text-sm">
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              ยังจำรหัสผ่านได้? เข้าสู่ระบบ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}