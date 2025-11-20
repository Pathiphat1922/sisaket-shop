'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react'; 

// ==================================================
// 🔒 กำหนดรายชื่อ Admin (สำหรับโชว์ปุ่ม Dashboard)
// ==================================================
const ADMIN_EMAILS = [
  "test@example.com",          
  "test@example.com" // <--- 🟡 แก้เป็นอีเมลของคุณที่ใช้ Login
];

// Type สำหรับสินค้าในตะกร้า
type CartItem = {
  type: string;
  size: string;
  quantity: number;
};

// Type สำหรับออเดอร์
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

  const fontStyle = {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
  };

  // --- State ---
  const [scrollY, setScrollY] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState('white');
  const [selectedSize, setSelectedSize] = useState('M');
  const [isClosing, setIsClosing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [myOrders, setMyOrders] = useState<OrderType[]>([]); // เก็บประวัติการสั่งซื้อ

  // --- useEffect ---

  // 1. ตรวจสอบสถานะ Login (ถ้ายังไม่ล็อกอิน ให้เด้งไปหน้า Login)
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

  // 3. ดึงข้อมูลออเดอร์จริงจาก LocalStorage
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const allHistory = JSON.parse(localStorage.getItem("all_orders_history") || "[]");
      // กรองเฉพาะออเดอร์ของ user ที่ login อยู่
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
    
    // ไปหน้าสั่งซื้อ (ProductPage) แทนการ Add ลงตะกร้าตรงนี้ เพื่อให้ Flow เหมือนกัน
    router.push("/order");
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
      image: '/images/goal.PNG', // ตรวจสอบ path รูปภาพให้ถูกต้อง (images หรือ image)
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

  // --- Loading Screen ---
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">กำลังโหลด...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-white" style={fontStyle}>
      <style jsx global>{`
        * {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-fadeOut { animation: fadeOut 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        .animate-scaleOut { animation: scaleOut 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes scaleOut { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
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
            <a href="#orders" className="hover:text-gray-900 transition cursor-pointer" onClick={(e) => smoothScroll(e, 'orders')}>คำสั่งซื้อของฉัน</a>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/order')}
              className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition"
            >
              สั่งซื้อเลย
            </button>

            {/* 🟢 ปุ่ม Admin/Dashboard (โชว์เฉพาะ Admin) */}
            {isAdmin && (
              <button 
                onClick={() => router.push('/dashboard')}
                className="bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-black transition flex items-center gap-2 shadow-md border border-gray-700"
              >
                {/* Dashboard Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                ระบบหลังบ้าน
              </button>
            )}

            <button 
              onClick={() => signOut()} 
              className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-blue-50 to-purple-50">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-orange-100/50 via-blue-100/50 to-purple-100/50"
          style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
        />
        <div className="relative z-10 text-center px-6 max-w-5xl">
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

            <div className="p-6 overflow-y-auto">
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
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-blue-600 text-white py-3 rounded-full text-sm font-bold hover:bg-blue-700 transition transform hover:scale-[1.02] shadow-lg mt-auto"
                  >
                    ไปหน้าสั่งซื้อสินค้า
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
              <table className="w-full min-w-[600px]">
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
                  {myOrders.length > 0 ? (
                    myOrders.map((order, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">
                            {order.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                            {order.product || "สินค้าคละรายการ"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            order.status.includes('จัดส่ง') ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status.includes('กำลัง') || order.status.includes('เตรียม') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            order.status.includes('ยกเลิก') ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">฿{Number(order.amount).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">ติดต่อเรา</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">โทรศัพท์</h3>
              <p className="text-gray-600 text-lg">0XX-XXX-XXXX</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">อีเมล</h3>
              <p className="text-gray-600 text-lg">info@city243.com</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">สถานที่</h3>
              <p className="text-gray-600 text-lg">ศาลากลางจังหวัด</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 เมือง 243 ปี. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}