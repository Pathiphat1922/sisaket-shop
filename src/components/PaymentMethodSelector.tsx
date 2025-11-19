import React from 'react';
import { PaymentMethod, PaymentMethodOption } from '../types/payment';

interface Props {
  selectedMethod: PaymentMethod | null;
  onMethodChange: (method: PaymentMethod) => void;
  options: PaymentMethodOption[];
}

export const PaymentMethodSelector: React.FC<Props> = ({
  selectedMethod,
  onMethodChange,
  options,
}) => {
  return (
    <div className="payment-methods">
      <h3>เลือกวิธีชำระเงิน</h3>
      <div className="methods-list">
        {options.map((option) => (
          <label key={option.id} className="method-option">
            <input
              type="radio"
              name="payment-method"
              value={option.id}
              checked={selectedMethod === option.id}
              onChange={() => onMethodChange(option.id)}
            />
            <div className="method-content">
              <span className="icon">{option.icon}</span>
              <div className="method-info">
                <h4>{option.name}</h4>
                <p>{option.description}</p>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
