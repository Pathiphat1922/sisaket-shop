'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
    // ตรวจสอบว่ากรอกข้อมูลครบ
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    // ตรวจสอบว่ารหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    // ตรวจสอบความยาวรหัสผ่าน
    if (password.length < 6) {
      setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'สมัครสมาชิกล้มเหลว');
        return;
      }

      if (data.success) {
        // เก็บข้อมูลการสมัครสำเร็จไว้ใน sessionStorage
        const userRegistrationData = {
          fullName,
          email,
          phone,
          registeredAt: new Date().toISOString(),
        };
        
        try {
          sessionStorage.setItem('lastRegistration', JSON.stringify(userRegistrationData));
        } catch (e) {
          console.log('ไม่สามารถเก็บข้อมูลใน sessionStorage');
        }

        // เก็บข้อมูลใน object เพื่อส่งไปหน้าล็อคอิน
        window.userRegistrationData = userRegistrationData;

        setSuccess('สมัครสมาชิกสำเร็จ! กำลังเปลี่ยนหน้า...');
        
        // เด้งไปหน้าล็อคอินหลังจาก 1.5 วินาที
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

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
          สมัครสมาชิก
        </h1>
        <p className="text-center text-gray-600 text-sm mb-8">
          มีบัญชีแล้ว?{' '}
          <a href="/login" className="text-blue-600 hover:underline font-medium">
            เข้าสู่ระบบ
          </a>
        </p>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              placeholder="กรอกชื่อ-นามสกุล"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:bg-gray-100"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              อีเมล
            </label>
            <input
              type="email"
              placeholder="กรอกอีเมล"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:bg-gray-100"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              placeholder="กรอกเบอร์โทรศัพท์"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition disabled:bg-gray-100"
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
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12 disabled:bg-gray-100"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              ยืนยันรหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition pr-12 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
          </button>
        </div>
      </div>
    </div>
  );
}