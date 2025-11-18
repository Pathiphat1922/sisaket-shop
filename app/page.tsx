'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; 

// ==================================================
// 🔒 กำหนดรายชื่อ Admin (สำหรับโชว์ปุ่ม Dashboard)
// ==================================================
const ADMIN_EMAILS = [
  "test@example.com",           
  "test@example.com",       // <--- อย่าลืมแก้อีเมลตรงนี้ให้ตรงกับของคุณ
];

// Type สำหรับสินค้าในตะกร้า
type CartItem = {
  type: string;
  size: string;
  quantity: number;
};

// Type สำหรับออเดอร์ (เพิ่มใหม่เพื่อให้ TypeScript รู้จัก)
type OrderType = {
  id: string;
  product: string;
  date: string;
  status: string;
  amount: number;
  customer: string;
  email: string;
};

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession(); 

  // เช็คว่าเป็น Admin หรือไม่?
  const isAdmin = session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  // --- State ทั่วไป ---
  const fontStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  };
  const [scrollY, setScrollY] = useState(0);
  
  // --- State สำหรับ Modal สินค้า ---
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // 🟡 State สำหรับเก็บรายการสั่งซื้อจริง (เพิ่มใหม่)
  const [myOrders, setMyOrders] = useState<OrderType[]>([]);

  // --- useEffect ---
  
  // 1. ตรวจสอบ Login
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // 2. Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 

  // 🟡 3. ดึงข้อมูลออเดอร์จริงจาก LocalStorage (เพิ่มใหม่)
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // ดึงข้อมูลทั้งหมดมา
      const allHistory = JSON.parse(localStorage.getItem("all_orders_history") || "[]");
      
      // กรองเอาเฉพาะของ "ฉัน" (เช็คจากอีเมล)
      const userOrders = allHistory.filter((order: OrderType) => order.email === session.user?.email);
      
      setMyOrders(userOrders);
    }
  }, [status, session]);


  // --- Helper Functions ---
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

  const handleAddToCart = () => {
    if (selectedProduct === null) {
      alert("เกิดข้อผิดพลาด: ไม่ได้เลือกสินค้า");
      return;
    }
    const product = products.find(p => p.id === selectedProduct);
    if (!product) {
      alert("เกิดข้อผิดพลาด: ไม่พบสินค้า");
      return;
    }
    const newItem: CartItem = {
      type: `${product.name} (สี: ${selectedColor})`, 
      size: selectedSize,
      quantity: 1 
    };
    const savedCart = localStorage.getItem("cart_items");
    const existingCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];
    const updatedCart = [...existingCart, newItem];
    
    if (typeof window !== "undefined") {
        localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    }
    alert("เพิ่มสินค้าลงตะกร้าแล้ว!");
    router.push("/review");
  };

  // --- Data Arrays ---
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

  // (ลบ const orders แบบ dummy ทิ้งไปแล้ว เพราะเราใช้ state myOrders แทน)

  // --- Loading Check ---
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

  if (!session) {
    return null; 
  }

  // --- JSX ---
  return (
    <div className="min-h-screen bg-white" style={fontStyle}>
      <style jsx global>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        /* ... styles เดิม ... */
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-fadeOut { animation: fadeOut 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-scaleOut { animation: scaleOut 0.3s ease-out; }
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
            <a href="#orders" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'orders')}>คำสั่งซื้อของฉัน</a>
            
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/order')}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              ซื้อเลย
            </button>

            {isAdmin && (
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition flex items-center gap-2 shadow-md"
              >
                {/* Icon กุญแจ */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Admin
              </button>
            )}

            <button 
              onClick={() => signOut()} 
              className="bg-red-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section (เหมือนเดิม) */}
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
              onClick={(e) => smoothScroll(e, 'products')}
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition transform hover:scale-105 shadow-lg"
            >
              สำรวจคอลเลคชัน
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Products Section (เหมือนเดิม) */}
      {/* Products Section */}
      {/* เพิ่ม min-h-screen flex items-center justify-center เพื่อจัดกึ่งกลางแนวตั้ง */}
      <section id="products" className="min-h-screen flex items-center justify-center py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6 w-full">
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
                onClick={() => {
                  setSelectedProduct(product.id);
                  setSelectedImage(0);
                }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative bg-white aspect-square flex items-center justify-center p-6">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
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

      {/* Product Detail Modal (เหมือนเดิม) */}
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

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
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
                 
                  
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Section (แก้ไขให้แสดงรายการจริง) */}
      <section id="orders" className="py-20 bg-gray-50">
         <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4"></h2>
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* 🟡 ใช้ myOrders.map แทนของปลอม */}
                  {myOrders.length > 0 ? (
                    myOrders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">{order.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.product}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status.includes('จัดส่ง') ? 'bg-green-100 text-green-800' :
                            order.status.includes('กำลัง') ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">฿{Number(order.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        ยังไม่มีรายการสั่งซื้อ
                      </td>
                    </tr>
                  )}
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
         
         
          {/* Contact Form */}
        
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