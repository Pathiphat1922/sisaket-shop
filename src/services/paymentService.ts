import { PaymentMethod, PaymentMethodOption } from '../types/payment';

export class PaymentService {
  static getPaymentMethods(): PaymentMethodOption[] {
    return [
      {
        id: 'bank_transfer',
        name: 'โอนบัญชีธนาคาร',
        description: 'โอนเงินตรงเข้าบัญชีธนาคารของเรา',
        icon: '🏦',
      },
      {
        id: 'promptpay',
        name: 'PromptPay',
        description: 'ชำระผ่าน PromptPay QR Code',
        icon: '📱',
      },
      {
        id: 'cash_on_delivery',
        name: 'เก็บเงินปลายทาง',
        description: 'ชำระเงินเมื่อรับสินค้า',
        icon: '🚚',
      },
    ];
  }

  static validatePaymentMethod(method: PaymentMethod): boolean {
    const validMethods: PaymentMethod[] = ['bank_transfer', 'promptpay', 'cash_on_delivery'];
    return validMethods.includes(method);
  }
}
