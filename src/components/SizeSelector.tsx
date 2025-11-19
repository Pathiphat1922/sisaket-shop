import React from 'react';
import { ProductSize } from '../types/product';

interface Props {
  sizes: ProductSize[];
  selectedSizeId: string | null;
  onSizeChange: (sizeId: string) => void;
}

export const SizeSelector: React.FC<Props> = ({
  sizes,
  selectedSizeId,
  onSizeChange,
}) => {
  return (
    <div className="size-selector">
      <h3>เลือกไซร์</h3>
      <div className="sizes-grid">
        {sizes.map((size) => (
          <button
            key={size.id}
            className={`size-button ${selectedSizeId === size.id ? 'active' : ''}`}
            onClick={() => onSizeChange(size.id)}
          >
            <span className="size-name">{size.name}</span>
            <span className="size-price">{size.price.toLocaleString('th-TH')} บาท</span>
          </button>
        ))}
      </div>
    </div>
  );
};
