"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Type สำหรับตะกร้าสินค้า
type CartItem = {
    type: string;
    size: string;
    quantity: number;
    price: number; // เพิ่ม field price
};

export default function ProductPage() {
    const router = useRouter();
    const [selectedShirtType, setSelectedShirtType] = useState<'screen' | 'mourning'>('screen');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({
        SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0, '6XL': 0, '7XL': 0,
    });

    // 🟢 1. ตั้งค่าราคาและค่าส่ง (แก้ไขราคาตรงนี้)
    const PRICE_PER_ITEM = 198;  // ราคาเสื้อต่อตัว
    const SHIPPING_FEE = 50;     // ค่าส่งเหมาจ่าย

    // คำนวณยอดเงิน
    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    const productCost = totalItems * PRICE_PER_ITEM; // ค่าเสื้ออย่างเดียว
    const grandTotal = productCost + SHIPPING_FEE;   // ยอดสุทธิ (รวมค่าส่ง)

    const handleQuantityChange = (size: string, delta: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [size]: Math.max(0, prevQuantities[size] + delta),
        }));
    };

    const sizes = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];

    const handleSubmit = () => {
        const selectedItems = Object.entries(quantities)
            .filter(([, quantity]) => quantity > 0)
            .map(([size, quantity]) => ({
                type: selectedShirtType === 'screen' ? 'เสื้อแบบสี' : 'เสื้อไว้ทุกข์',
                size: size,
                quantity: quantity,
                price: PRICE_PER_ITEM, // บันทึกราคาไปด้วย
            }));

        if (selectedItems.length === 0) {
            alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นครับ");
            return;
        }

        const savedCart = typeof window !== "undefined" ? localStorage.getItem("cart_items") : null;
        const existingCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        // รวมตะกร้า
        const updatedCart = [...existingCart, ...selectedItems];

        if (typeof window !== "undefined") {
            localStorage.setItem("cart_items", JSON.stringify(updatedCart));
            localStorage.setItem("selected_shirt_type", selectedShirtType);
            // 🟢 บันทึกค่าส่งแยกไว้ด้วย เผื่อหน้าสรุปยอดใช้
            localStorage.setItem("shipping_fee", SHIPPING_FEE.toString());
        }

        router.push("/review");
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl my-8 relative">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
                เลือกสินค้าที่ต้องการ
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {/* เสื้อแบบสี */}
                <div
                    className={`border-2 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 
            ${selectedShirtType === 'screen' ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-blue-300'}`}
                    onClick={() => setSelectedShirtType('screen')}
                >
                    <img src="/images/goal.PNG" alt="เสื้อแบบสี" className="w-full h-48 object-contain mb-2 rounded-md" />
                    <h2 className="font-semibold text-lg text-gray-800">เสื้อแบบสี</h2>
                    <p className="text-sm text-gray-600">แบบเสื้อแบบสี</p>
                    {selectedShirtType === 'screen' && <div className="mt-2 text-blue-500 font-bold">✔ เลือกแล้ว</div>}
                </div>

                {/* เสื้อไว้ทุกข์ */}
                <div
                    className={`border-2 p-4 rounded-lg text-center cursor-pointer transition-all duration-200 
            ${selectedShirtType === 'mourning' ? 'border-blue-500 shadow-md' : 'border-gray-300 hover:border-blue-300'}`}
                    onClick={() => setSelectedShirtType('mourning')}
                >
                    <img src="/images/black.PNG" alt="เสื้อไว้ทุกข์" className="w-full h-48 object-contain mb-2 rounded-md" />
                    <h2 className="font-semibold text-lg text-gray-800">เสื้อไว้ทุกข์</h2>
                    <p className="text-sm text-gray-600">แบบไว้ทุกข์ (สีดำลายเทา)</p>
                    {selectedShirtType === 'mourning' && <div className="mt-2 text-blue-500 font-bold">✔ เลือกแล้ว</div>}
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                เลือกขนาดและระบุจำนวน
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {sizes.map((size) => (
                    <div key={size} className="border p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{size}</h3>
                        <div className="flex justify-between items-center w-full max-w-[120px]">
                            <button
                                onClick={() => handleQuantityChange(size, -1)}
                                className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-red-600 active:bg-red-700 transition-colors"
                            >-</button>
                            <span className="text-xl font-bold w-12 text-center">{quantities[size]}</span>
                            <button
                                onClick={() => handleQuantityChange(size, 1)}
                                className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg hover:bg-green-600 active:bg-green-700 transition-colors"
                            >+</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pb-32"></div>

            {/* 🟢 2. แถบสรุปยอดเงิน (รวมค่าส่ง 50) */}
            {totalItems > 0 && (
                <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] p-4 z-50 animate-pulse-once">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        
                        {/* ฝั่งซ้าย: แสดงยอดเงิน */}
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                                    {totalItems} ชิ้น
                                </span>
                                <span className="text-xs text-gray-400">
                                    (ค่าส่ง {SHIPPING_FEE}.-)
                                </span>
                            </div>
                            
                            <div className="flex items-end gap-1">
                                <span className="text-sm text-gray-500 mb-1">สุทธิ</span>
                                <span className="text-3xl font-extrabold text-blue-600 leading-none">
                                    ฿{grandTotal.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* ฝั่งขวา: ปุ่มสั่งซื้อ */}
                        <button 
                            onClick={handleSubmit}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>สั่งซื้อเลย</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}