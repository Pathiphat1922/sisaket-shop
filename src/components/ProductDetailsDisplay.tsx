import React from 'react';
import { ProductDetail } from '../types/product';

interface Props {
  product: ProductDetail;
}

export const ProductDetailsDisplay: React.FC<Props> = ({ product }) => {
  return (
    <div className="product-details">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="description">{product.description}</p>
      </div>
    </div>
  );
};
