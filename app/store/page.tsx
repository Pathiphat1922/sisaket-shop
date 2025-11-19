"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// สร้าง Type (รูปแบบข้อมูล) สำหรับสินค้าในตะกร้า
type CartItem = {
  type: string;
  size: string;
  quantity: number;
};

// เปลี่ยนชื่อเป็น StorePage (หรือจะใช้ ReviewPage ก็ได้ถ้าไฟล์ชื่อ page.tsx)
export default function StorePage() { 
  const router = useRouter();

  // State สำหรับเก็บข้อมูลตะกร้าสินค้า
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // --- (ลบ State 'form' และ 'loading' ออกไป) ---


  // --- (Effect 1) ---
  // โหลดข้อมูล "ตะกร้าสินค้า" เท่านั้น
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
        alert("ไม่พบสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนครับ");
        router.push("/");
      }
    } else {
      alert("ไม่พบสินค้าในตะกร้า กรุณาเลือกสินค้าก่อนครับ");
      router.push("/");
    }

    // --- (ลบส่วนโหลด 'customer_info' ออกไป) ---
  }, [router]); 

  
  // --- (ลบ 'handleChange' ออกไป) ---


  // +++ ฟังก์ชันสำหรับลบสินค้า (ยังเก็บไว้) +++
  const handleDeleteItem = (indexToDelete: number) => {
    if (!confirm("คุณต้องการลบสินค้ารายการนี้ใช่หรือไม่?")) {
      return; 
    }
    const updatedCart = cartItems.filter((_, index) => index !== indexToDelete);
    setCartItems(updatedCart);

    if (typeof window !== "undefined") {
      localStorage.setItem("cart_items", JSON.stringify(updatedCart));
    }

    if (updatedCart.length === 0) {
      alert("ตะกร้าสินค้าว่างเปล่า กลับไปที่หน้าแรก");
      router.push("/");
    }
  };

  // --- (ลบ 'validatePhone' และ 'handleSubmit' ออกไป) ---

  // +++ เพิ่มฟังก์ชันสำหรับปุ่ม Checkout +++
  const goToCheckout = () => {
    // ไปที่หน้า /review ซึ่งมีฟอร์มกรอกข้อมูล
    router.push("/review"); 
  };


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        
        {/* === ส่วนสรุปยอด (ที่ยังเก็บไว้) === */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🛒 สรุปรายการสินค้า
          </h2>
          <div className="space-y-3">
            {cartItems.length > 0 ? (
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

        {/* === (ลบส่วน <form> ข้อมูลผู้สั่งซื้อ ออกทั้งหมด) === */}

        {/* +++ เพิ่มปุ่มสำหรับไปหน้า Checkout +++ */}
        <button
          onClick={goToCheckout}
          disabled={cartItems.length === 0}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          ไปหน้ากรอกข้อมูล (Checkout)
        </button>

      </div>
    </div>
  );
}