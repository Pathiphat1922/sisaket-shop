'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'เกิดข้อผิดพลาด');
        return;
      }

      setSuccess('ส่งลิงค์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว');
      setSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
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

        {!submitted ? (
          <>
            {/* Header Text */}
            <h1 className="text-center text-2xl font-bold text-blue-600 mb-2">
              ลืมรหัสผ่าน?
            </h1>
            <p className="text-center text-gray-600 text-sm mb-8">
              กรอกอีเมลของคุณ เราจะส่งลิงค์รีเซ็ตรหัสผ่านให้
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="กรอกอีเมลของคุณ"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'กำลังส่ง...' : 'ส่งลิงค์รีเซ็ต'}
              </button>

              {/* Back to Login */}
              <div className="flex items-center justify-center">
                <a href="/login" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                  <ArrowLeft size={18} />
                  กลับไปหน้าเข้าสู่ระบบ
                </a>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <div className="text-center">
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-3" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ส่งสำเร็จ!
              </h2>
              <p className="text-gray-600 mb-6">
                ลิงค์รีเซ็ตรหัสผ่านได้ถูกส่งไปยังอีเมลของคุณแล้ว
                กรุณาตรวจสอบอีเมลของคุณและคลิกลิงค์เพื่อเปลี่ยนรหัสผ่าน
              </p>
              <p className="text-sm text-gray-500 mb-6">
                (ลิงค์จะหมดอายุใน 1 ชั่วโมง)
              </p>

              <button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                ไปหน้าเข้าสู่ระบบ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}