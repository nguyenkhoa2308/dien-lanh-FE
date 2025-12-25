'use client';

import Link from 'next/link';
import { Product } from '@/data/products';

interface PowerSelectorProps {
  currentProduct: Product;
  similarProducts: Product[];
}

export default function PowerSelector({ currentProduct, similarProducts }: PowerSelectorProps) {
  if (similarProducts.length === 0) {
    return null;
  }

  // Combine current product with similar products and sort by power
  const allVariants = [currentProduct, ...similarProducts].sort((a, b) => {
    return parseFloat(a.power) - parseFloat(b.power);
  });

  return (
    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Chọn công suất:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {allVariants.map((variant) => {
          const isActive = variant.id === currentProduct.id;

          return (
            <Link
              key={variant.id}
              href={`/san-pham/${variant.slug}`}
              className={`
                relative px-4 py-3 rounded-lg text-center font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--primary)] to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:border-[var(--primary)] hover:shadow-md border-2 border-gray-200'
                }
              `}
            >
              <div className="text-lg font-bold">{variant.power} HP</div>
              <div className="text-xs opacity-80 mt-0.5">
                {variant.powerBTU.toLocaleString()} BTU
              </div>
              {isActive && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-gray-600 mt-3">
        💡 Chọn công suất phù hợp với diện tích phòng của bạn
      </p>
    </div>
  );
}
