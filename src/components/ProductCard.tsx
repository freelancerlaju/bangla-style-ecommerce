import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Loader2, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;

    setIsProcessing(true);

    setTimeout(() => {
      addToCart(product, 1, false);
      setIsProcessing(false);
      setIsAdded(true);

      setTimeout(() => setIsAdded(false), 2000);

      toast.success(
        <div className="flex items-center gap-2.5 w-full min-w-0 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-9 h-11 object-cover object-top rounded border border-gray-200 shrink-0"
          />
          <div className="flex-1 min-w-0 overflow-hidden pr-1">
            <p
              className="font-bold text-xs text-gray-900 truncate block w-full"
              title={product.name}
            >
              {product.name}
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5 truncate">
              {product.price.toLocaleString()}৳ added to bag
            </p>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 3000,
        },
      );
    }, 1500);
  };

  return (
    <div
      className="bg-white rounded-md flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 relative group cursor-pointer border border-gray-100/80"
      onClick={handleCardClick}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
        {product.saveAmount && (
          <div className="absolute top-0 left-0 bg-[#FFD700] text-black text-[11px] font-semibold px-2 py-0.5 z-10 rounded-br-md shadow-xs">
            Save: {product.saveAmount}৳
          </div>
        )}
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-top mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-3.5 flex flex-col grow justify-between gap-3">
        <div>
          <h3 className="text-gray-800 font-medium text-xs sm:text-[13px] leading-snug line-clamp-2 hover:text-amber-600 transition-colors font-[montserrat]">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2 font-[montserrat]">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              {product.price.toLocaleString()}৳
            </span>
            {product.originalPrice && (
              <span className="text-gray-400 text-xs line-through decoration-gray-400">
                {product.originalPrice.toLocaleString()}৳
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          className={`font-[montserrat] w-full py-2 rounded-sm flex items-center justify-center gap-1.5 font-medium text-xs sm:text-sm transition-all duration-200 active:scale-98 cursor-pointer ${
            isProcessing
              ? 'bg-amber-100 text-amber-900 cursor-wait'
              : isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#FFD700] text-black hover:bg-gray-900 hover:text-yellow-400'
          }`}
          onClick={handleAddToCart}
          disabled={isProcessing}
          title="Add to shopping cart"
        >
          {isProcessing ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Adding...</span>
            </>
          ) : isAdded ? (
            <>
              <Check size={14} strokeWidth={2.5} />
              <span>Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} strokeWidth={2.5} />
              <span>Add to cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
