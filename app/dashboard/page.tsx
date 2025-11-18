'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
// (เราจะใช้ icon สวยๆ จาก lucide-react)
import { DollarSign, Package, Clock, Users } from 'lucide-react';

// (นี่คือข้อมูลตัวอย่าง (Dummy Data) ที่เราจะใช้แสดงผล)
// (ในอนาคต คุณต้องเปลี่ยนส่วนนี้ให้ไปดึงข้อมูลจาก Database/API ของคุณ)
const dummyOrders = [
  { 
    id: 'ORD-001', 
    product: 'เสื้อเฉลิมฉลอง Edition', 
    date: '15 พ.ย. 2568', 
    status: 'จัดส่งแล้ว', 
    amount: 890,
    customer: 'สมชาย ใจดี'
  },
  { 
    id: 'ORD-002', 
    product: 'เสื้อโปโล Heritage', 
    date: '14 พ.ย. 2568', 
    status: 'กำลังจัดส่ง', 
    amount: 1290,
    customer: 'สมหญิง จริงใจ'
  },
  { 
    id: 'ORD-003', 
    product: 'เสื้อเฉลิมฉลอง Edition', 
    date: '13 พ.ย. 2568', 
    status: 'รอการยืนยัน', 
    amount: 890,
    customer: 'จอห์น โด'
  },
    { 
    id: 'ORD-004', 
    product: 'เสื้อแบบไว้ทุกข์', 
    date: '12 พ.ย. 2568', 
    status: 'จัดส่งแล้ว', 
    amount: 198,
    customer: 'สมชาย ใจดี'
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  // --- (1) ตรวจสอบสิทธิ์ ---
  // (เหมือนในหน้า Home ของคุณ)
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // --- (2) คำนวณสรุปยอด (จากข้อมูลตัวอย่าง) ---
  const totalRevenue = dummyOrders.reduce((sum, order) => {
    // (เฉพาะออเดอร์ที่ "จัดส่งแล้ว" เท่านั้นที่นับเป็นรายได้)
    return order.status === 'จัดส่งแล้ว' ? sum + order.amount : sum;
  }, 0);

  const totalOrders = dummyOrders.length;
  
  const pendingOrders = dummyOrders.filter(
    (order) => order.status === 'รอการยืนยัน' || order.status === 'กำลังจัดส่ง'
  ).length;

  // --- (3) หน้า Loading ขณะรอตรวจสอบสิทธิ์ ---
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // (4) ถ้าไม่ผ่าน ให้แสดงหน้าว่างๆ (กำลังจะ redirect)
  if (!session) {
    return null;
  }

  // --- (5) หน้า Dashboard หลัก ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard (สรุปภาพรวม)
        </h1>

        {/* === สรุปยอดการขาย (Stat Cards) === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Card: ยอดขายรวม */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ยอดขายรวม (ที่จัดส่งแล้ว)</p>
              <p className="text-2xl font-bold text-gray-900">
                ฿{totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Card: ออเดอร์ทั้งหมด */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ออเดอร์ทั้งหมด</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalOrders} รายการ
              </p>
            </div>
          </div>

          {/* Card: ออเดอร์ที่รอ xử lý */}
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-4">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">รอการจัดส่ง</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingOrders} รายการ
              </p>
            </div>
          </div>

        </div>

        {/* === ประวัติการสั่งซื้อ (ตาราง) === */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">
            ประวัติการสั่งซื้อล่าสุด
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">เลขที่คำสั่ง</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ลูกค้า</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ยอดรวม</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'จัดส่งแล้ว' ? 'bg-green-100 text-green-800' :
                        order.status === 'กำลังจัดส่ง' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">฿{order.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}