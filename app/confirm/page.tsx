"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

// --- Type Definitions ---
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

// --- Prices ---
const T_SHIRT_PRICE = 198; 
const SHIPPING_FEE = 50; 

export default function ConfirmPage() {
  const router = useRouter(); 
  const { data: session } = useSession();
  const [order, setOrder] = useState<FinalOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [isUploading, setIsUploading] = useState(false); 

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileImg = e.target.files ? e.target.files[0] : null;
    
    if (!fileImg) {
      setPreviewUrl(null);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(fileImg); 

    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      if (ev.target && typeof ev.target.result === 'string') {
        setPreviewUrl(ev.target.result);
      }
    };
    reader.readAsDataURL(fileImg);
  };

  // --- ฟังก์ชัน submitPayment (แก้ไขจุดนี้) ---
  const submitPayment = async () => { 
    if (!order) {
      alert("ไม่พบข้อมูลคำสั่งซื้อ");
      return;
    }
    if (paymentMethod === "transfer" && !selectedFile) {
      alert("❌ กรุณาอัปโหลดสลิปการโอนเงินก่อนครับ");
      return;
    }

    setIsUploading(true); 

    try {
      console.log("กำลังบันทึกข้อมูล...");
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      // ======================================================
      // 🟡 สร้างออเดอร์ใหม่ (เพิ่ม paymentMethod เข้าไป)
      // ======================================================
      
      const newOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        product: order.items.map(item => `${item.type} (${item.size}) x${item.quantity}`).join(', '),
        date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        
        // สถานะ (ถ้า COD ให้ขึ้นว่ารอจัดส่งเลย ถ้าโอนให้ขึ้นรอตรวจสอบ)
        status: paymentMethod === 'cod' ? 'รอจัดส่ง (COD)' : 'รอตรวจสอบยอด',
        
        amount: total,
        customer: `${order.customer.firstName} ${order.customer.lastName}`,
        email: session?.user?.email || "guest",
        
        // ✅ บันทึกวิธีการชำระเงินลงไปด้วย!
        paymentMethod: paymentMethod, 
      };

      // 1. ดึงประวัติเก่าออกมา
      const currentHistory = JSON.parse(localStorage.getItem("all_orders_history") || "[]");
      
      // 2. เอาของใหม่ใส่ไปข้างหน้า
      const updatedHistory = [newOrder, ...currentHistory];

      // 3. บันทึกกลับลงไป
      localStorage.setItem("all_orders_history", JSON.stringify(updatedHistory));

      // ======================================================

      alert("สั่งซื้อสำเร็จ! ข้อมูลถูกบันทึกเรียบร้อย");
      
      // เคลียร์ตะกร้า
      localStorage.removeItem("final_order");
      localStorage.removeItem("cart_items");
      localStorage.removeItem("selected_shirt_type");
      
      // ย้ายไปหน้า Dashboard
      router.push("/dashboard"); 

    } catch (error) {
      console.error("Submit Payment Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล");
    } finally {
      setIsUploading(false); 
    }
  };

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
            disabled={isUploading}
            className="w-full p-2 border rounded-lg"
          >
            <option value="transfer">โอนผ่านธนาคาร / QR</option>
            <option value="cod">เก็บเงินปลายทาง (COD)</option>
          </select>

          {paymentMethod === "transfer" && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold">บัญชีธนาคาร</p>
              <p>🏦 ธ.กสิกรไทย</p>
              <p>เลขบัญชี 3113-607-884 (ชื่อ นาย ปฏิพัทธ์ ศรีบุรินทร์)</p>
              <p className="font-semibold mt-2">หรือสแกน QR</p>
              <img src="/images/qr.png" alt="QR Payment" className="w-40 h-40 mt-2" />
            </div>
          )}

          {paymentMethod === "transfer" && (
            <div>
              <p className="font-semibold">📄 อัปโหลดสลิปการโอนเงิน</p>
              <input 
                id="file-upload"
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={isUploading}
                className="hidden"
              />
              <label 
                htmlFor="file-upload"
                className={`mt-2 inline-block px-5 py-2 rounded-lg font-semibold cursor-pointer ${isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
              >
                คลิกเพื่อเลือกไฟล์สลิป
              </label>
              {selectedFile && <span className="ml-3 text-sm text-gray-700 align-middle">{selectedFile.name}</span>}
              {previewUrl && <img src={previewUrl} alt="Slip preview" className="mt-3 w-60 border rounded-lg shadow" />}
            </div>
          )}
        </div>

        {/* ปุ่มยืนยัน */}
        <button
          onClick={submitPayment}
          disabled={isUploading} 
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
        >
          {isUploading ? "กำลังส่งข้อมูล..." : (paymentMethod === 'cod' ? 'ยืนยันคำสั่งซื้อ (เก็บปลายทาง)' : 'ยืนยันการชำระเงิน')}
        </button>
      </div>
    </div>
  );
}