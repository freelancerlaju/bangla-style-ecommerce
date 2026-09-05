import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const FREE_SHIPPING_THRESHOLD = 2000;

export default function CartDrawer() {
  const {
    items,
    totalItems,
    totalPrice,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [shouldRender, setShouldRender] = useState(isCartOpen);
  const [animateOpen, setAnimateOpen] = useState(false);

  // Smooth open and close animation handler
  useEffect(() => {
    if (isCartOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
      // Small timeout ensures the browser paints initial translate-x-full before animating
      const timer = setTimeout(() => {
        setAnimateOpen(true);
      }, 25);
      return () => clearTimeout(timer);
    } else {
      setAnimateOpen(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 350); // Match duration-350 transition
      return () => clearTimeout(timer);
    }
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isCartOpen, closeCart]);

  if (!shouldRender) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round((totalPrice / FREE_SHIPPING_THRESHOLD) * 100),
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - totalPrice,
  );
  const shippingFee =
    totalPrice >= FREE_SHIPPING_THRESHOLD || totalItems === 0 ? 0 : 100;
  const grandTotal = totalPrice + shippingFee;

  const handleProductClick = (productId: string) => {
    closeCart();
    navigate(`/product/${productId}`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop overlay with smooth fade */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-350 ease-in-out ${
          animateOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
      />

      {/* Slide-out drawer with smooth slide in/out */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
        <div
          className={`w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-350 ease-in-out ${
            animateOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-gray-900">
                <ShoppingBag size={18} className="text-gray-900" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 font-[montserrat] flex items-center gap-2">
                  Shopping Cart
                  <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-100 text-yellow-900 rounded-full">
                    {totalItems} {totalItems === 1 ? 'item' : 'items'}
                  </span>
                </h2>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-amber-50/70 border-b border-amber-100/80 px-5 py-3 text-xs">
            <div className="flex items-center justify-between mb-1.5 font-medium text-gray-700">
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Truck size={14} /> Congratulations! You unlocked Free
                  Shipping! 🎉
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-700">
                  <Truck size={14} className="text-amber-600" /> Add{' '}
                  <span className="font-bold text-gray-900">
                    {remainingForFreeShipping.toLocaleString()}৳
                  </span>{' '}
                  more for{' '}
                  <strong className="text-amber-700">Free Shipping</strong>
                </span>
              )}
              <span className="font-bold text-gray-600">
                {freeShippingProgress}%
              </span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  remainingForFreeShipping === 0
                    ? 'bg-emerald-500'
                    : 'bg-[#FFD700]'
                }`}
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                  <ShoppingBag size={36} strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-gray-800 font-[montserrat] mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6">
                  Looks like you haven't added anything to your cart yet.
                  Explore our collection of premium fashion!
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/');
                  }}
                  className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 text-xs font-bold px-6 py-2.5 rounded-full transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="py-3.5 flex gap-3.5 items-center group"
                >
                  {/* Thumbnail */}
                  <div
                    onClick={() => handleProductClick(item.product.id)}
                    className="w-16 h-20 sm:w-18 sm:h-22 bg-gray-50 rounded-lg overflow-hidden shrink-0 border border-gray-100 cursor-pointer relative"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4
                        onClick={() => handleProductClick(item.product.id)}
                        className="text-xs sm:text-sm font-semibold text-gray-900 truncate hover:text-amber-600 cursor-pointer font-[montserrat]"
                        title={item.product.name}
                      >
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.product.category && (
                      <span className="text-[11px] text-gray-400 block mb-1">
                        Category: {item.product.category}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-gray-200 rounded-md bg-gray-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-l cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2.5 text-xs font-semibold text-gray-800 font-[montserrat]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-r cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Item Total Price */}
                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                          ৳
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-gray-400 block">
                            {item.product.price.toLocaleString()}৳ each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/70 p-5 space-y-3 z-10">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {totalPrice.toLocaleString()}৳
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `${shippingFee}৳`
                    )}
                  </span>
                </div>
                <div className="border-t border-gray-200/80 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 font-[montserrat]">
                      {grandTotal.toLocaleString()}৳
                    </span>
                    <span className="text-[10px] text-gray-400 block">
                      VAT included
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm transition-all shadow-sm hover:shadow-md active:scale-[0.99] font-[montserrat] cursor-pointer"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={closeCart}
                    className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200/60 text-[10px] text-gray-500 text-center">
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>Secure Pay</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Truck size={13} className="text-amber-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RotateCcw size={13} className="text-blue-600" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
