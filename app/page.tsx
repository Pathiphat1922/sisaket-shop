<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const fontStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  };
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedProduct(null);
      setIsClosing(false);
    }, 300);
  };

  const colors = [
    { name: 'white', label: 'ขาว', hex: '#FFFFFF', border: '#e5e7eb' },
    { name: 'black', label: 'ดำ', hex: '#000000', border: '#000000' },
    { name: 'navy', label: 'กรมท่า', hex: '#1e3a8a', border: '#1e3a8a' },
    { name: 'red', label: 'แดง', hex: '#dc2626', border: '#dc2626' },
  ];

  const sizes = ['S', 'M', 'L', 'XL', '2XL'];

  const products = [
    {
      id: 1,
      name: 'เสื้อเฉลิมฉลอง Edition',
      price: '890',
      badge: 'ใหม่',
      colors: ['ขาว', 'ดำ', 'กรมท่า'],
      description: 'ออกแบบพิเศษเฉพาะวาระครบรอบ 243 ปี ด้วยผ้าคอตตอนคุณภาพพรีเมียม ระบายอากาศได้ดี สวมใส่สบาย',
      features: ['ผ้าคอตตอน 100%', 'พิมพ์ลายคุณภาพสูง', 'ทนทานต่อการซัก']
    },
    {
      id: 2,
      name: 'เสื้อโปโล Heritage',
      price: '1,290',
      badge: 'สุดยอดความนิยม',
      colors: ['ขาว', 'ดำ', 'กรมท่า', 'แดง'],
      description: 'สไตล์คลาสสิกผ้าคุณภาพพรีเมียม เหมาะสำหรับทุกโอกาส ดีไซน์หรูหรา มีระดับ',
      features: ['ผ้าโปโลพรีเมียม', 'คอปกคุณภาพ', 'ทรงสวยใส่สบาย']
    },
  ];

  return (
    <div className="min-h-screen bg-white" style={fontStyle}>
      <style jsx global>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scaleOut {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.95);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-fadeOut {
          animation: fadeOut 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-scaleOut {
          animation: scaleOut 0.3s ease-out;
        }
      `}</style>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 ? 'bg-white/70 backdrop-blur-2xl shadow-sm' : 'bg-white/50 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-semibold text-gray-900">เมือง 243 ปี</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#hero" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'hero')}>หน้าแรก</a>
            <a href="#products" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'products')}>สินค้า</a>
            <a href="#orders" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'orders')}>รายการสั่งซื้อ</a>
            <a href="#about" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'about')}>เกี่ยวกับ</a>
            <a href="#contact" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'contact')}>ติดต่อ</a>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
            ซื้อเลย
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-blue-100/50 to-purple-100/50"
          style={{
            transform: `scale(${1 + scrollY * 0.0005})`,
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <div className="mb-6 inline-block">
            <span className="bg-gradient-to-r from-orange-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
              ฉลองครบรอบ 243 ปี
            </span>
          </div>
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent leading-tight"
            style={{
              opacity: 1 - scrollY * 0.003,
              transform: `translateY(${scrollY * 0.5}px)`,
              letterSpacing: '-0.02em',
            }}
          >
            ภาคภูมิใจ 243 ปี
          </h1>
          <p 
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium"
            style={{
              opacity: 1 - scrollY * 0.004,
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            เสื้อเฉลิมฉลองที่ออกแบบมาเป็นพิเศษ สำหรับวันสำคัญของเมืองเรา
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={(e) => smoothScroll(e as any, 'products')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
            >
              สำรวจคอลเลคชัน
            </button>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">คุณภาพพรีเมียม</h3>
              <p className="text-gray-600 text-lg">ผ้าคุณภาพสูง ทนทาน สวมใส่สบาย</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">ออกแบบพิเศษ</h3>
              <p className="text-gray-600 text-lg">ดีไซน์เฉพาะเจาะจงสำหรับวาระพิเศษ</p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">จำนวนจำกัด</h3>
              <p className="text-gray-600 text-lg">ผลิตจำนวนจำกัดเฉพาะปีนี้เท่านั้น</p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Info Card */}
            <div>
              <div className="rounded-2xl overflow-hidden shadow-sm h-full flex items-center justify-center p-8" style={{
                background: 'linear-gradient(135deg, #7dd3fc 0%, #fbbf24 50%, #fb923c 100%)'
              }}>
                <div className="text-center text-white">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">คอลเลคชันของเรา</h3>
                  <p className="text-sm md:text-base leading-relaxed">
                    เลือกสรรดีไซน์พิเศษเฉพาะวาระ<br/>
                  </p>
                </div>
              </div>
            </div>

            {/* Product Cards */}
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  {/* Product Image Area */}
                  <div className="relative bg-white aspect-square flex items-center justify-center p-6">
                    <img 
                      src="/image/goal.png" 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-5">
                    {product.badge && (
                      <p className="text-orange-600 text-xs font-semibold mb-2">
                        {product.badge}
                      </p>
                    )}
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className="text-gray-500">เริ่มต้นที่ </span>
                      <span className="font-semibold">฿{product.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6 ${
            isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`bg-white rounded-3xl w-full max-w-5xl shadow-2xl flex flex-col ${
              isClosing ? 'animate-scaleOut' : 'animate-scaleIn'
            }`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '90vh' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">
                {products.find(p => p.id === selectedProduct)?.name}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="w-10 h-10 rounded-full bg-gray-600 hover:bg-gray-700 text-white flex items-center justify-center transition shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - No Scroll */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Product Image */}
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl w-64 h-64 flex items-center justify-center p-6 mb-3">
                    <img 
                      src="/image/goal.png" 
                      alt={products.find(p => p.id === selectedProduct)?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 w-64">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="bg-white border-2 border-gray-200 rounded-lg aspect-square flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="flex flex-col">
                  {products.find(p => p.id === selectedProduct)?.badge && (
                    <span className="text-orange-600 text-xs font-semibold mb-2">
                      {products.find(p => p.id === selectedProduct)?.badge}
                    </span>
                  )}
                  
                  <p className="text-2xl font-bold text-gray-900 mb-3">
                    ฿{products.find(p => p.id === selectedProduct)?.price}
                  </p>
                  
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {products.find(p => p.id === selectedProduct)?.description}
                  </p>
                  
                  {/* Features */}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">คุณสมบัติเด่น</h3>
                    <ul className="space-y-1.5">
                      {products.find(p => p.id === selectedProduct)?.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-700 text-xs">
                          <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Color Selection */}
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 text-xs">เลือกสี</h3>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-8 h-8 rounded-full transition ${
                            selectedColor === color.name ? 'ring-4 ring-blue-600 ring-offset-2 scale-110' : 'ring-2 ring-gray-300'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Size Selection */}
                  <div className="mb-5">
                    <h3 className="font-bold text-gray-900 mb-2 text-xs">เลือกไซส์</h3>
                    <div className="grid grid-cols-5 gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-2 rounded-lg font-semibold text-xs transition ${
                            selectedSize === size 
                              ? 'bg-blue-600 text-white shadow-lg' 
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Add to Cart */}
                  <button className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg mt-auto">
                    เพิ่มลงตะกร้า - ฿{products.find(p => p.id === selectedProduct)?.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">243 ปี แห่งประวัติศาสตร์</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            เสื้อเฉลิมฉลองครบรอบ 243 ปี ออกแบบขึ้นเพื่อเฉลิมฉลองความยิ่งใหญ่และประวัติศาสตร์อันยาวนาน
            ของเมืองเรา ด้วยดีไซน์ที่ผสมผสานความทันสมัยเข้ากับมรดกทางวัฒนธรรม
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            ทุกตัวเสื้อถูกผลิตด้วยคุณภาพสูงสุด เพื่อให้คุณสามารถสวมใส่ได้อย่างภาคภูมิใจ
            และเก็บไว้เป็นที่ระลึกตลอดไป
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-lg">ช้อปปิ้ง</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">สินค้าทั้งหมด</a></li>
                <li><a href="#" className="hover:text-white transition">สินค้าใหม่</a></li>
                <li><a href="#" className="hover:text-white transition">สินค้าขายดี</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">บริการ</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">ติดตามสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition">นโยบายการคืนสินค้า</a></li>
                <li><a href="#" className="hover:text-white transition">การจัดส่ง</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">เรื่องราวของเรา</a></li>
                <li><a href="#" className="hover:text-white transition">ติดต่อเรา</a></li>
                <li><a href="#" className="hover:text-white transition">ร่วมงานกับเรา</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">ติดตามเรา</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-sm font-bold">f</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-sm font-bold">ig</span>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition">
                  <span className="text-sm font-bold">tw</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 เมือง 243 ปี. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
=======
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const router = useRouter();
  const [selectedShirtType, setSelectedShirtType] = useState<'screen' | 'mourning'>('screen');
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0, '6XL': 0, '7XL': 0,
  });

  const handleQuantityChange = (size: string, delta: number) => {
    setQuantities(prevQuantities => ({
      ...prevQuantities,
      [size]: Math.max(0, prevQuantities[size] + delta),
    }));
  };

  const sizes = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];

  const handleSubmit = () => {
    const selectedItems = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([size, quantity]) => ({
        type: selectedShirtType === 'screen' ? 'เสื้อสกรีน' : 'เสื้อไว้ทุกข์',
        size: size,
        quantity: quantity,
      }));

    if (selectedItems.length === 0) {
      alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นครับ");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("cart_items", JSON.stringify(selectedItems));
      localStorage.setItem("selected_shirt_type", selectedShirtType);
    }

    alert("เพิ่มสินค้าลงตะกร้าแล้ว! กรุณากรอกข้อมูลจัดส่งครับ");
    router.push("/review");
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl my-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        เลือกสินค้าที่ต้องการ
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        
        {/* เสื้อสกรีน */}
        <div
          className={`border-2 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 
            ${selectedShirtType === 'screen' ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-blue-300'}`}
          onClick={() => setSelectedShirtType('screen')}
        >
          {/* VVVV แก้ไขเป็น .PNG (ตัวพิมพ์ใหญ่) VVVV */}
          <img src="/images/goal.PNG" alt="เสื้อสกรีน" className="w-full h-48 object-contain mb-2 rounded-md" /> 
          <h2 className="font-semibold text-lg text-gray-800">เสื้อสกรีน</h2>
          <p className="text-sm text-gray-600">แบบเสื้อสกรีน</p>
          {selectedShirtType === 'screen' && <div className="mt-2 text-blue-500 font-bold">✔ เลือกแล้ว</div>}
        </div>

        {/* เสื้อไว้ทุกข์ */}
        <div
          className={`border-2 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 
            ${selectedShirtType === 'mourning' ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-blue-300'}`}
          onClick={() => setSelectedShirtType('mourning')}
        >
          {/* VVVV แก้ไขเป็น .PNG (ตัวพิมพ์ใหญ่) VVVV */}
          <img src="/images/black.PNG" alt="เสื้อไว้ทุกข์" className="w-full h-48 object-contain mb-2 rounded-md" />
          <h2 className="font-semibold text-lg text-gray-800">เสื้อไว้ทุกข์</h2>
          <p className="text-sm text-gray-600">แบบไว้ทุกข์ (สีดำลายเทา)</p>
          {selectedShirtType === 'mourning' && <div className="mt-2 text-blue-500 font-bold">✔ เลือกแล้ว</div>}
        </div>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
        เลือกขนาดและระบุจำนวน
      </h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {sizes.map((size) => (
          <div key={size} className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{size}</h3>
            <div className="flex justify-between items-center w-full max-w-[120px]">
              <button 
                onClick={() => handleQuantityChange(size, -1)}
                className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-red-600 active:bg-red-700 transition-colors"
              >-</button>
              <span className="text-xl font-bold w-12 text-center">{quantities[size]}</span>
              <button 
                onClick={() => handleQuantityChange(size, 1)}
                className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-green-600 active:bg-green-700 transition-colors"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-10 w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
      >
        ดำเนินการต่อ (ไปหน้ากรอกข้อมูล)
      </button>
>>>>>>> Future/order
    </div>
  );
}