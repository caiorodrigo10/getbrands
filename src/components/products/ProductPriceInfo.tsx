import React from 'react';

interface ProductPriceInfoProps {
  costPrice: number;
  suggestedPrice: number;
}

export const ProductPriceInfo = ({ costPrice, suggestedPrice }: ProductPriceInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="text-sm">
        <span className="text-gray-600">Cost Price:</span>
        <p className="font-medium">${costPrice.toFixed(2)}</p>
      </div>
      <div className="text-sm">
        <span className="text-gray-600">Suggested Price:</span>
        <p className="font-medium">${suggestedPrice.toFixed(2)}</p>
      </div>
    </div>
  );
};