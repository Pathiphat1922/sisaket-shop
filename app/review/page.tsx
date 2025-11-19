"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// สร้าง Type (รูปแบบข้อมูล) สำหรับสินค้าในตะกร้า
type CartItem = {
  type: string;
  size: string;
  quantity: number;
};

export default function ReviewPage() {
  const router = useRouter();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  // State สำหรับเก็บข้อมูลตะกร้าสินค้า
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [loading, setLoading] = useState(false);

  // --- (Effect 1) ---
  // โหลดข้อมูล "ตะกร้าสินค้า" และ "ข้อมูลลูกค้า" (ถ้ามี) จาก localStorage เมื่อเปิดหน้า
  useEffect(() => {
    // 1. โหลดตะกร้าสินค้า
    const savedCart = typeof window !== "undefined"
      ? localStorage.getItem("cart_items")
      : null;
    
    if (savedCart) {
      const items = JSON.parse(savedCart);
      if (items.length > 0) {
        setCartItems(items);
      } else {
        // ถ้าตะกร้ามีแต่ `[]` (ว่าง) ก็ให้เด้งกลับ
        alert("ไม่พบสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนครับ");
        router.push("/");
      }
    } else {
      // ถ้าไม่มีของในตะกร้า ให้เด้งกลับไปหน้าแรก
      alert("ไม่พบสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนครับ");
      router.push("/");
    }

    // 2. โหลดข้อมูลลูกค้าที่เคยกรอกไว้
    const savedInfo = typeof window !== "undefined"
      ? localStorage.getItem("customer_info")
      : null;
    if (savedInfo) {
      setForm(JSON.parse(savedInfo));
    }
  }, [router]); // ใส่ router เพื่อให้ useEffect รู้จัก

  // อัปเดต input
  const handleChange = (e: any) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);

    // บันทึกข้อมูลที่กรอกลง localStorage ทันที
    if (typeof window !== "undefined") {
      localStorage.setItem("customer_info", JSON.stringify(updated));
    }
  };

  // +++ 1. เพิ่มฟังก์ชันสำหรับลบสินค้า +++
  const handleDeleteItem = (indexToDelete: number) => {
    // ยืนยันก่อนลบ
    if (!confirm("คุณต้องการลบสินค้ารายการนี้ใช่หรือไม่?")) {
      return; // ถ้ากดยกเลิก ก็ไม่ต้องทำอะไรต่อ
    }

    // สร้างตะกร้าใหม่ โดยการกรอง (filter) เอาเฉพาะรายการที่ไม่ตรงกับ index ที่จะลบ
    const updatedCart = cartItems.filter((_, index) => index !== indexToDelete);

    // อัปเดต state (หน้าจอจะเปลี่ยนทันที)
    setCartItems(updatedCart);

    // บันทึกตะกร้าใหม่ลง localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    }

    // (สำคัญ) ถ้าลบจนตะกร้าว่าง ให้เด้งกลับหน้าแรก
    if (updatedCart.length === 0) {
      alert("ตะกร้าสินค้าว่างเปล่า กลับไปที่หน้าแรก");
      router.push("/");
    }
  };


  // ตรวจสอบเบอร์โทร
  const validatePhone = (phone: string) => {
    return /^0[0-9]{8,9}$/.test(phone);
  };

  // --- (Submit) ---
  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!validatePhone(form.phone)) {
      alert("❌ กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0891234567");
      return;
    }

    setLoading(true);

    // รวบรวมข้อมูลทั้งหมด (สินค้า + ลูกค้า)
    const finalOrder = {
      customer: form,
      items: cartItems,
    };

    // (สำคัญ) บันทึกคำสั่งซื้อทั้งหมดลง localStorage เพื่อให้หน้า Confirm ดึงไปใช้
    localStorage.setItem("final_order", JSON.stringify(finalOrder));

    setTimeout(() => {
      alert("✔ บันทึกข้อมูลสำเร็จ! กำลังไปหน้ายืนยันคำสั่งซื้อ");
      router.push("/confirm"); // ไปหน้าถัดไป (หน้า Confirm)
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        
        {/* === ส่วนสรุปยอด (ที่เพิ่มเข้ามา) === */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛒 สรุปรายการสินค้า
          </h2>
          <div className="space-y-3">
            {cartItems.length > 0 ? (
              // +++ 2. แก้ไข .map() ให้มีปุ่มลบ +++
              cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-gray-700">
                  
                  {/* ส่วนข้อมูลสินค้า */}
                  <div className="flex-grow">
                    <span>{item.type} (ไซส์: {item.size})</span>
                    <span className="font-medium ml-2">x {item.quantity}</span>
                  </div>

                  {/* ปุ่มลบ */}
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="ml-4 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition-colors"
                    title="ลบรายการนี้"
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">กำลังโหลดรายการ...</p>
            )}
          </div>
        </div>

        {/* === ส่วนฟอร์ม (โค้ดเดิมของคุณ) === */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-xl p-6 space-y-4"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧾 ข้อมูลผู้สั่งซื้อ
          </h2>

          {/* ชื่อ - นามสกุล */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-gray-700">ชื่อ *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg p-2"
                placeholder="ชื่อจริง"
              />
            </div>

            <div>
              <label className="text-gray-700">นามสกุล *</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
                className="mt-1 w-full border rounded-lg p-2"
                placeholder="นามสกุล"
              />
            </div>
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="text-gray-700">เบอร์โทรศัพท์ *</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-lg p-2"
              placeholder="0891234567"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700">อีเมล</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2"
              placeholder="example@email.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-gray-700">ที่อยู่สำหรับจัดส่ง *</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              className="mt-1 w-full border rounded-lg p-2 h-24"
              placeholder="ที่อยู่และรหัสไปรษณีย์"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-gray-700">หมายเหตุ (ถ้ามี)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="mt-1 w-full border rounded-lg p-2 h-20"
              placeholder="ข้อความเพิ่มเติม"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "กำลังบันทึก..." : "ไปหน้ายืนยันคำสั่งซื้อ"}
          </button>
        </form>
      </div>
    </div>
  );
}