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
const T_SHIRT_PRICE = 198; 
const SHIPPING_FEE = 50; 

export default function ConfirmPage() {
  const router = useRouter(); 
  const [order, setOrder] = useState<FinalOrder | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); 
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 
  const [isUploading, setIsUploading] = useState(false); 

  // --- (useEffect... เหมือนเดิม) ---
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

  // --- (handleFileChange... เหมือนเดิม) ---
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

  // --- (submitPayment... เหมือนเดิม) ---
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

    const formData = new FormData();
    formData.append("order", JSON.stringify(order)); 
    formData.append("paymentMethod", paymentMethod); 
    formData.append("totalAmount", total.toString()); 

    if (paymentMethod === "transfer" && selectedFile) {
      formData.append("slipImage", selectedFile, selectedFile.name); 
    }

    try {
      //
      // ⬇️ (คุณต้องใส่โค้ด fetch / API ของคุณตรงนี้) ⬇️
      //
      console.log("กำลังส่งข้อมูล FormData:", ...formData.entries());
      await new Promise(resolve => setTimeout(resolve, 2000)); // (จำลองการส่ง 2 วิ)
      //
      // ⬆️ (สิ้นสุดส่วน API) ⬆️
      //

      alert("ส่งข้อมูลการชำระเงินสำเร็จ! 🎉 ขอบคุณครับ");
      
      localStorage.removeItem("final_order");
      localStorage.removeItem("cart_items");
      localStorage.removeItem("selected_shirt_type");
      
      router.push("/"); 

    } catch (error) {
      console.error("Submit Payment Error:", error);
      alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsUploading(false); 
    }
  };


  // --- (return (...) ... ส่วน UI) ---
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
            disabled={isUploading}
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
              <p>เลขบัญชี 3113-607-884 (ชื่อ นาย ปฏิพัทธ์ ศรีบุรินทร์)</p>
              <p className="font-semibold mt-2">หรือสแกน QR</p>
              <img
                src="/images/qr.png" // (ผมลบตัวอักษร '_' ที่หลงมาในโค้ดก่อนหน้าให้แล้วครับ)
                alt="QR Payment"
                className="w-40 h-40 mt-2"
              />
            </div>
          )}

          {/* +++ VVVV นี่คือส่วนที่แก้ไขให้สวยงามครับ VVVV +++ */}
          {/* Upload slip */}
          {paymentMethod === "transfer" && (
            <div>
              <p className="font-semibold">📄 อัปโหลดสลิปการโอนเงิน</p>

              {/* ซ่อน input จริง */}
              <input 
                id="file-upload" // เพิ่ม ID
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={isUploading}
                className="hidden" // ซ่อน input นี้
              />

              {/* สร้าง Label ที่หน้าตาเหมือนปุ่ม */}
              <label 
                htmlFor="file-upload" // เชื่อม Label นี้กับ input
                className={`mt-2 inline-block px-5 py-2 rounded-lg font-semibold cursor-pointer
                            ${isUploading 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-500 text-white hover:bg-blue-600 transition-colors'
                            }`}
              >
                คลิกเพื่อเลือกไฟล์สลิป
              </label>

              {/* แสดงชื่อไฟล์ที่เลือก */}
              {selectedFile && (
                <span className="ml-3 text-sm text-gray-700 align-middle">
                  {selectedFile.name}
                </span>
              )}
              
              {/* แสดงภาพตัวอย่าง */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Slip preview"
                  className="mt-3 w-60 border rounded-lg shadow"
                />
              )}
            </div>
          )}
          {/* +++ ^^^^ สิ้นสุดส่วนที่แก้ไข ^^^^ +++ */}
        </div>

        {/* ปุ่ม */}
        <button
          onClick={submitPayment}
          disabled={isUploading} 
          className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700
                     disabled:bg-gray-400 disabled:cursor-wait"
        >
          {isUploading 
            ? "กำลังส่งข้อมูล..." 
            : (paymentMethod === 'cod' ? 'ยืนยันคำสั่งซื้อ (เก็บปลายทาง)' : 'ยืนยันการชำระเงิน')}
        </button>
      </div>
    </div>
  );
}