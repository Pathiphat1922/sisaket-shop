"use client";

import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-2xl space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 เลือกวิธีชำระเงิน</h2>

        <div className="space-y-3">
          <button
            className="w-full border p-3 rounded-lg hover:bg-gray-200"
            onClick={() => router.push("/upload-slip")}
          >
            โอนธนาคาร / PromptPay
          </button>

          <button className="w-full border p-3 rounded-lg hover:bg-gray-200">
            เก็บเงินปลายทาง (COD)
          </button>
        </div>
      </div>
    </div>
  );
}
