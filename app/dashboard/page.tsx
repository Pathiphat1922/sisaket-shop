'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { DollarSign, Package, Clock, ShoppingBag, Lock, CreditCard } from 'lucide-react';

// 1. กำหนดรายชื่อ Admin
const ADMIN_EMAILS = [
  "test@example.com", 
  "your.email@gmail.com" // <--- แก้ตรงนี้เป็นอีเมลของคุณ
];

// เพิ่ม paymentMethod ใน Type
type OrderType = {
  id: string;
  product: string;
  date: string;
  status: string;
  amount: number;
  customer: string;
  email: string;
  paymentMethod?: string; // 🟡 เพิ่ม Type นี้ (ใส่ ? กัน error ข้อมูลเก่า)
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

  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(
    (order) => order.status.includes('รอ') || order.status.includes('กำลัง')
  ).length;

  if (status === 'loading' || loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">กำลังโหลดข้อมูล Admin...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-gray-800 p-2 rounded-lg">
                <Lock className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard (Admin)</h1>
                <p className="text-sm text-gray-500">ผู้ดูแลระบบ: {session?.user?.name}</p>
              </div>
           </div>
           
          <button 
            onClick={() => {
              if(confirm('⚠️ ยืนยันล้างประวัติการสั่งซื้อทั้งหมด?')) {
                localStorage.removeItem("all_orders_history");
                setOrders([]);
              }
            }}
            className="text-red-500 text-sm hover:text-red-700 underline"
          >
            ล้างข้อมูลทั้งหมด
          </button>
        </div>

        {/* Cards สรุปยอด */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border-l-4 border-green-500">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ยอดขายรวม</p>
              <p className="text-2xl font-bold text-gray-900">฿{totalRevenue.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border-l-4 border-blue-500">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ออเดอร์ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders} รายการ</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4 border-l-4 border-yellow-500">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders} รายการ</p>
            </div>
          </div>
        </div>

        {/* ตาราง */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 p-6 border-b flex items-center gap-2">
            <ShoppingBag size={20} /> รายการคำสั่งซื้อล่าสุด
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สินค้า</th>
                  {/* 🟡 เพิ่มหัวตาราง */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">การชำระเงิน</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                </tr>
              </thead>
              
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                         <div className="flex flex-col">
                          <span className="font-medium">{order.customer}</span>
                          <span className="text-xs text-gray-500">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={order.product}>
                        {order.product}
                      </td>

                      {/* 🟡 แสดงวิธีการชำระเงิน */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.paymentMethod === 'cod' ? (
                          <span className="flex items-center gap-1 text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded-full text-xs">
                            🚚 เก็บปลายทาง
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full text-xs">
                            🏦 โอนจ่าย
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status.includes('จัดส่ง') ? 'bg-green-100 text-green-800' : 
                          order.status.includes('รอ') ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ฿{Number(order.amount).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-500">
                      ยังไม่มีคำสั่งซื้อเข้ามา
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