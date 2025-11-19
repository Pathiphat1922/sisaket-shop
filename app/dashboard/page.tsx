'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DollarSign, Package, Clock, ShoppingBag, Lock, Trash2, CheckCircle } from 'lucide-react';

// 1. กำหนดรายชื่อ Admin
const ADMIN_EMAILS = [
  "test@example.com", 
  "your.email@gmail.com" 
];

type OrderType = {
  id: string;
  product: string;
  date: string;
  status: string;
  amount: number;
  customer: string;
  email: string;
  paymentMethod?: string;
  isHidden?: boolean; // 🟡 เพิ่มตัวแปรนี้ เพื่อเช็คว่าถูกเคลียร์ออกจากหน้าจอหรือยัง
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    if (status === 'authenticated') {
      const userEmail = session?.user?.email || "";
      if (!ADMIN_EMAILS.includes(userEmail)) {
        alert("⛔️ คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (Admin Only)");
        router.push('/');
        return;
      }
      setIsAuthorized(true);

      const savedOrders = localStorage.getItem("all_orders_history");
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
      setLoading(false);
    }
  }, [status, router, session]);

  // 🔄 ฟังก์ชันเปลี่ยนสถานะ
  const handleStatusChange = (id: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("all_orders_history", JSON.stringify(updatedOrders));
  };

  // 🧹 ฟังก์ชันเคลียร์รายการ (แค่ซ่อน ไม่ลบจริง)
  const handleClearCompleted = () => {
    // นับเฉพาะรายการที่จัดส่งแล้ว และยังไม่ถูกซ่อน
    const completedCount = orders.filter(o => o.status === 'จัดส่งแล้ว' && !o.isHidden).length;
    
    if (completedCount === 0) {
      alert("ไม่มีรายการที่ 'จัดส่งแล้ว' ให้เคลียร์");
      return;
    }

    if(confirm(`ยืนยันเคลียร์รายการที่ "จัดส่งแล้ว" ออกจากตาราง? (${completedCount} รายการ)\n(ยอดขายรวมจะยังคงอยู่)`)) {
      // เปลี่ยนสถานะ isHidden เป็น true แทนการลบ array
      const updatedOrders = orders.map(order => 
        order.status === 'จัดส่งแล้ว' ? { ...order, isHidden: true } : order
      );
      setOrders(updatedOrders);
      localStorage.setItem("all_orders_history", JSON.stringify(updatedOrders));
    }
  };

  // 📊 ส่วนคำนวณ (คำนวณจาก orders ทั้งหมด รวมถึงที่ถูกซ่อนด้วย)
  
  // 1. ยอดขายรวมทั้งหมด (นับทุกอันที่ไม่ใช่ 'ยกเลิก')
  const validOrders = orders.filter(order => order.status !== 'ยกเลิก');
  const totalRevenue = validOrders.reduce((sum, order) => sum + Number(order.amount), 0);
  const totalSoldItems = validOrders.length;

  // 2. รายการที่รอจัดการ (นับเฉพาะที่ยังไม่ซ่อน และยังไม่เสร็จ)
  const pendingOrders = orders.filter(
    (order) => !order.isHidden && order.status !== 'จัดส่งแล้ว' && order.status !== 'ยกเลิก'
  ).length;

  // 3. รายการที่จะแสดงในตาราง (เฉพาะที่ไม่ถูกซ่อน isHidden != true)
  const visibleOrders = orders.filter(order => !order.isHidden);

  if (status === 'loading' || loading || !isAuthorized) {
    return <div className="p-10 text-center">กำลังโหลด...</div>;
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 bg-white p-6 rounded-xl shadow-sm gap-4">
           <div className="flex items-center gap-4">
              <div className="bg-gray-800 p-3 rounded-xl shadow-lg">
                <Lock className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard (Admin)</h1>
                <p className="text-sm text-gray-500">จัดการโดย: <span className="font-medium text-gray-900">{session?.user?.name}</span></p>
              </div>
           </div>
           
           <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleClearCompleted}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition-all text-sm"
              >
                <CheckCircle size={16} />
                เคลียร์ที่ส่งแล้ว (ออกจากตาราง)
              </button>

              <button 
                onClick={() => {
                  if(confirm('⚠️ ลบประวัติและยอดขาย "ทั้งหมด" จริงหรือไม่? (เริ่มนับศูนย์ใหม่)')) {
                    localStorage.removeItem("all_orders_history");
                    setOrders([]);
                  }
                }}
                className="flex items-center gap-2 border border-red-200 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-all text-sm"
              >
                <Trash2 size={16} />
                รีเซ็ตระบบใหม่
              </button>
           </div>
        </div>

        {/* Cards สรุปยอด (แสดงยอดรวมสะสมทั้งหมด แม้จะเคลียร์ตารางไปแล้ว) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1: ยอดขายสะสม */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500">ยอดขายรวมทั้งหมด</p>
                <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">฿{totalRevenue.toLocaleString()}</p>
       
          </div>

          {/* Card 2: จำนวนออเดอร์สะสม */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500">ออเดอร์ทั้งหมด</p>
                <Package className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalSoldItems} <span className="text-sm font-normal text-gray-400">รายการ</span></p>
            
          </div>

          {/* Card 3: งานคงค้าง */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-gray-500">รอดำเนินการ</p>
                <Clock className="text-yellow-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{pendingOrders} <span className="text-sm font-normal text-gray-400">รายการ</span></p>
          </div>
        </div>

        {/* ตาราง (แสดงเฉพาะรายการที่ยังไม่ถูกเคลียร์ isHidden != true) */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100">
             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <ShoppingBag className="text-blue-600" size={20} /> 
                รายการคำสั่งซื้อที่ยังไม่เคลียร์ ({visibleOrders.length})
             </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID / ลูกค้า</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">สินค้า</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ชำระเงิน</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">วันที่</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">เปลี่ยนสถานะ</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">ยอดรวม</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-100">
                {visibleOrders.length > 0 ? (
                  visibleOrders.map((order, index) => (
                    <tr key={index} className={`hover:bg-gray-50 transition-colors ${order.status === 'ยกเลิก' ? 'opacity-50 bg-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-blue-600">{order.id}</div>
                        <div className="text-sm font-medium text-gray-900 mt-1">{order.customer}</div>
                        <div className="text-xs text-gray-400">{order.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {order.product}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.paymentMethod === 'cod' ? (
                          <span className="text-orange-600 font-medium text-xs bg-orange-50 px-2 py-1 rounded border border-orange-100">
                            🚚 ปลายทาง
                          </span>
                        ) : (
                          <span className="text-indigo-600 font-medium text-xs bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                            🏦 โอนจ่าย
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-sm border rounded-md px-2 py-1 outline-none focus:ring-2 focus:ring-blue-200 font-medium cursor-pointer ${
                            order.status === 'จัดส่งแล้ว' ? 'bg-green-50 text-green-700 border-green-200' :
                            order.status === 'ยกเลิก' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-white text-gray-700 border-gray-300'
                          }`}
                        >
                          <option value="รอชำระเงิน">⏳ รอชำระเงิน</option>
                          <option value="เตรียมจัดส่ง">📦 เตรียมจัดส่ง</option>
                          <option value="จัดส่งแล้ว">✅ จัดส่งแล้ว</option>
                          <option value="ยกเลิก">❌ ยกเลิก</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-right whitespace-nowrap text-sm font-bold text-gray-900">
                        {order.status === 'ยกเลิก' ? (
                            <span className="line-through text-gray-400">฿{Number(order.amount).toLocaleString()}</span>
                        ) : (
                            <span>฿{Number(order.amount).toLocaleString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      ยังไม่มีคำสั่งซื้อที่รอจัดการ
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}