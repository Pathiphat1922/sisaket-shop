'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();


// +++ 1. เพิ่ม Type นี้เพื่อให้ตรงกับหน้า Review +++
type CartItem = {
  type: string;
  size: string;
  quantity: number;
};

export default function Home() {
  const router = useRouter();

  const fontStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  };
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // ตรวจสอบ Authentication ด้วย NextAuth
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
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
      setSelectedImage(0);
    }, 300);
  };

  // +++ 2. เพิ่มฟังก์ชันสำหรับกดปุ่ม "เพิ่มลงตะกร้า" +++
  const handleAddToCart = () => {
    if (selectedProduct === null) {
      alert("เกิดข้อผิดพลาด: ไม่ได้เลือกสินค้า");
      return;
    }

    // 1. หาสินค้าที่เลือก
    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      alert("เกิดข้อผิดพลาด: ไม่พบสินค้า");
      return;
    }

    // 2. สร้าง Item ชิ้นใหม่ (กำหนดจำนวนเป็น 1 ชิ้น)
    const newItem: CartItem = {
      type: `${product.name} (สี: ${selectedColor})`, // เราสร้าง type ให้สื่อความหมายมากขึ้น
      size: selectedSize,
      quantity: 1 
    };

    // 3. ดึงตะกร้าเดิมจาก localStorage
    const savedCart = localStorage.getItem("cart_items");
    const existingCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

    // 4. เพิ่มของใหม่ลงในตะกร้า
    const updatedCart = [...existingCart, newItem];
    
    // 5. บันทึกตะกร้าใหม่ลง localStorage
    if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    }

    // 6. แจ้งเตือน และไปหน้า review
    alert("เพิ่มสินค้าลงตะกร้าแล้ว!");
    router.push("/review");
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
      name: 'เสื้อแบบสี',
      price: '198',
      badge: 'ใหม่',
      image: '/images/goal.PNG',
      images: ['/images/goal.PNG', '/images/goal1.PNG'],
      colors: ['ขาว', 'ดำ', 'กรมท่า'],
      description: 'ออกแบบพิเศษเฉพาะวาระครบรอบ 243 ปี ด้วยผ้าคอตตอนคุณภาพพรีเมียม ระบายอากาศได้ดี สวมใส่สบาย',
      features: ['ผ้าคอตตอน 100%', 'พิมพ์ลายคุณภาพสูง', 'ทนทานต่อการซัก']
    },
    {
      id: 2,
      name: 'แบบไว้ทุกข์',
      price: '198',
      badge: 'สุดยอดความนิยม',
      image: '/images/black.PNG',
      images: ['/images/black.PNG', '/images/black1.PNG'],
      colors: ['ขาว', 'ดำ', 'กรมท่า', 'แดง'],
      description: 'สไตล์คลาสสิกผ้าคุณภาพพรีเมียม เหมาะสำหรับทุกโอกาส ดีไซน์หรูหรา มีระดับ',
      features: ['ผ้าโปโลพรีเมียม', 'คอปกคุณภาพ', 'ทรงสวยใส่สบาย']
    },
  ];

  const orders = [
    { id: 'ORD-001', product: 'เสื้อเฉลิมฉลอง Edition', date: '15 พ.ย. 2568', status: 'จัดส่งแล้ว', amount: '890' },
    { id: 'ORD-002', product: 'เสื้อโปโล Heritage', date: '14 พ.ย. 2568', status: 'กำลังจัดส่ง', amount: '1,290' },
    { id: 'ORD-003', product: 'เสื้อเฉลิมฉลอง Edition', date: '13 พ.ย. 2568', status: 'รอการยืนยัน', amount: '890' },
  ];

  // แสดงหน้า Loading ขณะตรวจสอบ Authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ได้ login
  if (!session) {
    return null;
  }

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
          
            <span className="text-xl font-semibold text-gray-900">เสื้อเฉลิมฉลองเมือง 243 ปี</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#hero" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'hero')}>หน้าแรก</a>
            <a href="#products" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'products')}>สินค้า</a>
           <a href="/store" className="hover:text-gray-900 transition cursor-pointer">รายการสั่งซื้อ</a>
            
          </div>
          <button 
            onClick={() => router.push('/order')}
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
          >
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
              onClick={(e) => smoothScroll(e as React.MouseEvent<HTMLElement>, 'products')}
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
                    เลือกสรรดีไซน์พิเศษเฉพาะวาระ
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
                      src={product.image} 
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

            {/* Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Product Image */}
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-gray-200 rounded-2xl w-64 h-64 flex items-center justify-center p-6 mb-3">
                    <img 
                      src={products.find(p => p.id === selectedProduct)?.images?.[selectedImage]} 
                      alt={products.find(p => p.id === selectedProduct)?.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2 w-64">
                    {products.find(p => p.id === selectedProduct)?.images?.map((img, index) => (
                      <div 
                        key={index} 
                        onClick={() => setSelectedImage(index)}
                        className={`bg-white border-2 rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:border-blue-500 transition ${
                          selectedImage === index ? 'border-blue-600' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`${products.find(p => p.id === selectedProduct)?.name} ${index + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
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
                  
                  {/* +++ 3. เปลี่ยน onClick ให้เรียกใช้ฟังก์ชันใหม่ +++ */}
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg mt-auto"
                  >
                    เพิ่มลงตะกร้า - ฿{products.find(p => p.id === selectedProduct)?.price}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Section */}
      <section id="orders" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">รายการสั่งซื้อของฉัน</h2>
            <p className="text-xl text-gray-600">ติดตามสถานะการสั่งซื้อของคุณ</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">เลขที่คำสั่ง</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">สินค้า</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">วันที่</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">สถานะ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.product}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'จัดส่งแล้ว' ? 'bg-green-100 text-green-800' :
                          order.status === 'กำลังจัดส่ง' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">฿{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

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

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">ติดต่อเรา</h2>
            <p className="text-xl text-gray-600">มีคำถามหรือต้องการความช่วยเหลือ?</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Phone */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">โทรศัพท์</h3>
              <p className="text-gray-600 text-lg">+66 (0) XX-XXX-XXXX</p>
              <p className="text-sm text-gray-500 mt-2">วันจันทร์ - วันศุกร์ 09:00 - 18:00</p>
            </div>

            {/* Email */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">อีเมล</h3>
              <p className="text-gray-600 text-lg">info@city243.com</p>
              <p className="text-sm text-gray-500 mt-2">ตอบกลับภายใน 24 ชั่วโมง</p>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">สถานที่</h3>
              <p className="text-gray-600 text-lg">เมืองเรา</p>
              <p className="text-sm text-gray-500 mt-2">เมืองหลัก</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">ส่งข้อความให้เรา</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">ชื่อ</label>
                <input type="text" placeholder="ชื่อของคุณ" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">อีเมล</label>
                <input type="email" placeholder="อีเมลของคุณ" className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">ข้อความ</label>
                <textarea placeholder="ข้อความของคุณ" rows={5} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg">
                ส่งข้อความ
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4 text-lg">ช้อปปิ้ง</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#products" className="hover:text-white transition">สินค้าทั้งหมด</a></li>
                <li><a href="#products" className="hover:text-white transition">สินค้าใหม่</a></li>
                <li><a href="#products" className="hover:text-white transition">สินค้าขายดี</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">บริการ</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#contact" className="hover:text-white transition">ติดตามสินค้า</a></li>
                <li><a href="#contact" className="hover:text-white transition">นโยบายการคืนสินค้า</a></li>
                <li><a href="#contact" className="hover:text-white transition">การจัดส่ง</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition">เรื่องราวของเรา</a></li>
                <li><a href="#contact" className="hover:text-white transition">ติดต่อเรา</a></li>
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
            <p>&copy; 2024 เสื้อเฉลิมฉลองเมือง 243 ปี สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}