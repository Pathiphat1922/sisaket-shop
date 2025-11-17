"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// +++ 1. เพิ่ม Type นี้ เพื่อให้รู้จัก CartItem +++
type CartItem = {
    type: string;
    size: string;
    quantity: number;
};

export default function ProductPage() {
    const router = useRouter();
    const [selectedShirtType, setSelectedShirtType] = useState<'screen' | 'mourning'>('screen');
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({
        SSS: 0, SS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0, '6XL': 0, '7XL': 0,
    });

    const handleQuantityChange = (size: string, delta: number) => {
        setQuantities(prevQuantities => ({
            ...prevQuantities,
            [size]: Math.max(0, prevQuantities[size] + delta),
        }));
    };

    const sizes = ['SSS', 'SS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'];

    const handleSubmit = () => {
        // รวบรวมของที่เลือก *เฉพาะในหน้านี้*
        const selectedItems = Object.entries(quantities)
            .filter(([, quantity]) => quantity > 0)
            .map(([size, quantity]) => ({
                type: selectedShirtType === 'screen' ? 'เสื้อแบบสี' : 'เสื้อไว้ทุกข์',
                size: size,
                quantity: quantity,
            }));

        if (selectedItems.length === 0) {
            alert("กรุณาเลือกสินค้าอย่างน้อย 1 ชิ้นครับ");
            return;
        }

        // +++ 2. ดึงตะกร้าเดิมออกมา +++
        const savedCart = typeof window !== "undefined" ? localStorage.getItem("cart_items") : null;
        const existingCart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

        // +++ 3. รวมตะกร้าเดิม กับ ของใหม่ +++
        const updatedCart = [...existingCart, ...selectedItems];


        if (typeof window !== "undefined") {
            // +++ 4. บันทึกตะกร้าที่ "รวมแล้ว" ลงไป +++
            localStorage.setItem("cart_items", JSON.stringify(updatedCart));
            localStorage.setItem("selected_shirt_type", selectedShirtType);
        }

        alert("เพิ่มสินค้าลงตะกร้าแล้ว! กรุณากรอกข้อมูลจัดส่งครับ");
        router.push("/review");
    };

    return (
        <div className="p-4 sm:p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl my-8">
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

            <button
                onClick={handleSubmit}
                className="mt-10 w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
            >
                ดำเนินการต่อ (ไปหน้ากรอกข้อมูล)
            </button>
        </div>
    );
}