import React, { useState } from 'react';
import { ProductDetail } from '../types/product';
import { ProductDetailsDisplay } from './ProductDetailsDisplay';
import { SizeSelector } from './SizeSelector';

interface Props {
  product: ProductDetail;
  onSizeSelect: (sizeId: string, price: number) => void;
}

export const StepTwo: React.FC<Props> = ({ product, onSizeSelect }) => {
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const handleSizeChange = (sizeId: string) => {
    setSelectedSizeId(sizeId);
    const selectedSize = product.sizes.find((s) => s.id === sizeId);
    if (selectedSize) {
      onSizeSelect(sizeId, selectedSize.price);
    }
  };

  const selectedSize = product.sizes.find((s) => s.id === selectedSizeId);

  return (
    <div className="step-two">
      <div className="step-header">
        <h1>ขั้นตอนที่ 2: เลือกรูปแบบและราคา</h1>
      </div>

      <div className="step-content">
        <ProductDetailsDisplay product={product} />
        
        <SizeSelector
          sizes={product.sizes}
          selectedSizeId={selectedSizeId}
          onSizeChange={handleSizeChange}
        />

        {selectedSize && (
          <div className="price-summary">
            <div className="summary-item">
              <span className="label">รูปแบบที่เลือก:</span>
              <span className="value">{selectedSize.name}</span>
            </div>
            <div className="summary-item highlight">
              <span className="label">ราคา:</span>
              <span className="value price">{selectedSize.price.toLocaleString('th-TH')} บาท</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
