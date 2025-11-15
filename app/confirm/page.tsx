"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// --- (Type Definitions... เหมือนเดิม) ---
type CustomerInfo = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
};

type CartItem = {
  type: string; 
  size: string; 
  quantity: number;
};

type FinalOrder = {
  customer: CustomerInfo;
  items: CartItem[];
};

// --- (Prices... เหมือนเดิม) ---
const T_SHIRT_PRICE = 250; 
const SHIPPING_FEE = 40; 

export default function ConfirmPage() {
  const router = useRouter(); 
  const [order, setOrder] = useState<FinalOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [file, setFile] = useState<string | null>(null);

  // --- (useEffect, handleFileChange... เหมือนเดิม) ---
  useEffect(() => {
    const saved = localStorage.getItem("final_order");
    if (saved) {
      setOrder(JSON.parse(saved));
    } else {
      alert("ไม่พบข้อมูลคำสั่งซื้อ");
      router.push("/");
    }
  }, [router]);

  const subtotal = order
    ? order.items.reduce((sum, item) => sum + item.quantity * T_SHIRT_PRICE, 0)
    : 0;
  const total = subtotal + SHIPPING_FEE;

  const handleFileChange = (e: any) => {
    const fileImg = e.target.files[0];
    if (!fileImg) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => setFile(ev.target.result as string);
    reader.readAsDataURL(fileImg);
  };

  // === VVVV อัปเดตตรงนี้ VVVV ===
  const submitPayment = () => {
    // *** (โค้ดส่งข้อมูลไป API/LINE... อยู่ตรงนี้) ***
    alert("ส่งข้อมูลการชำระเงินสำเร็จ! 🎉 ขอบคุณครับ");
    
    // (สำคัญ) ล้างตะกร้า แต่ "เก็บ" ข้อมูลลูกค้าไว้
    localStorage.removeItem("final_order");
    localStorage.removeItem("cart_items");
    localStorage.removeItem("selected_shirt_type");
    
    // localStorage.removeItem("customer_info"); // <--- เรา "ไม่ลบ" บรรทัดนี้

    // สั่งให้วาร์ปกลับไปหน้าแรก
    router.push("/"); 
  };
  // === ^^^^ อัปเดตตรงนี้ ^^^^ ===


  // --- (return (...) ... ส่วน UI เหมือนเดิม) ---
  if (!order) {
    return <p className="p-6">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full space-y-6">
        
        <h2 className="text-xl font-semibold text-gray-800">ยืนยันคำสั่งซื้อ</h2>

        {/* ข้อมูลผู้รับ */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">📌 ข้อมูลผู้รับ</h3>
          <p>{order.customer.firstName} {order.customer.lastName}</p>
          <p>📞 {order.customer.phone}</p>
          <p>📧 {order.customer.email || "-"}</p>
          <p>📍 {order.customer.address}</p>
        </div>

        {/* รายการสินค้า */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">รายการสินค้า</h3>
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>{item.type} (ไซส์: {item.size}) x {item.quantity}</span>
              <span>{item.quantity * T_SHIRT_PRICE} ฿</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 mt-2 font-semibold">
            <span>ค่าส่ง</span>
            <span>{SHIPPING_FEE} ฿</span>
          </div>
          <div className="flex justify-between border-t pt-2 mt-2 text-lg font-bold text-blue-600">
            <span>ยอดชำระรวม</span>
            <span>{total} ฿</span>
          </div>
        </div>

        {/* วิธีชำระเงิน */}
        <div className="border rounded-lg p-4 space-y-3">
          <h3 className="font-semibold mb-2">🏦 เลือกวิธีชำระเงิน</h3>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="transfer">โอนผ่านธนาคาร / QR</option>
            <option value="cod">เก็บเงินปลายทาง (COD)</option>
          </select>

          {/* ถ้าเลือกโอน */}
          {paymentMethod === "transfer" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">บัญชีธนาคาร</p>
              <p>🏦 ธ.กสิกรไทย</p>
              <p>เลขบัญชี 123-4-56789-0 (ชื่อบัญชี ตัวอย่าง)</p>
              <p className="font-semibold mt-2">หรือสแกน QR</p>
              <img
                src="/images/qr.png" 
                alt="QR Payment"
                className="w-40 h-40 mt-2"
              />
            </div>
          )}

          {/* Upload slip */}
          {paymentMethod === "transfer" && (
            <div>
              <p className="font-semibold">📄 อัปโหลดสลิปการโอนเงิน</p>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              {file && (
                <img
                  src={file}
                  alt="Slip preview"
                  className="mt-3 w-60 border rounded-lg shadow"
                />
              )}
            </div>
          )}
        </div>

        {/* ปุ่ม */}
        <button
          onClick={submitPayment}
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
        >
          {paymentMethod === 'cod' ? 'ยืนยันคำสั่งซื้อ (เก็บปลายทาง)' : 'ยืนยันการชำระเงิน'}
        </button>
      </div>
    </div>
  );
}