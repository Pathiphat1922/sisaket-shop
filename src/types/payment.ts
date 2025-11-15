export type PaymentMethod = 'bank_transfer' | 'promptpay' | 'cash_on_delivery';

export interface PaymentMethodOption {
  id: PaymentMethod;
  name: string;
  description: string;
  icon: string;
}

export interface DonationSummary {
  amount: number;
  description: string;
  selectedPaymentMethod: PaymentMethod | null;
}
