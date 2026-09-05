import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  CreditCard,
  Banknote,
  Smartphone,
  Lock,
  ArrowLeft,
  Sparkles,
  Tag,
  Copy,
  Check,
  AlertCircle,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  Printer,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import BkashLogo from '../img/bkash-logo.png';
import NagadLogo from '../img/nagad-logo.png';
import CardLogo from '../img/credit-card.png';

const FREE_SHIPPING_THRESHOLD = 2000;

interface OrderSuccessData {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  division: string;
  paymentMethod: string;
  deliveryZone: 'inside' | 'outside';
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  orderDate: string;
  estimatedDelivery: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, updateQuantity, removeFromCart, clearCart } =
    useCart();

  // Shipping & Contact Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState('');
  const [division, setDivision] = useState('Dhaka');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryZone, setDeliveryZone] = useState<'inside' | 'outside'>(
    'inside',
  );

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'bkash' | 'nagad' | 'card'
  >('cod');
  const [bkashNumber, setBkashNumber] = useState('');
  const [bkashTrxId, setBkashTrxId] = useState('');
  const [nagadNumber, setNagadNumber] = useState('');
  const [nagadTrxId, setNagadTrxId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'fixed' | 'shipping';
    value: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Checkout submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<OrderSuccessData | null>(
    null,
  );
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sync delivery zone based on division selection
  useEffect(() => {
    if (division === 'Dhaka') {
      setDeliveryZone('inside');
    } else {
      setDeliveryZone('outside');
    }
  }, [division]);

  // Shipping calculations
  const isFreeShippingByThreshold = totalPrice >= FREE_SHIPPING_THRESHOLD;
  const baseShippingFee = deliveryZone === 'inside' ? 60 : 120;

  let shippingFee = isFreeShippingByThreshold ? 0 : baseShippingFee;
  if (appliedCoupon?.discountType === 'shipping') {
    shippingFee = 0;
  }

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((totalPrice * appliedCoupon.value) / 100);
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = Math.min(appliedCoupon.value, totalPrice);
    } else if (appliedCoupon.discountType === 'shipping') {
      discountAmount = isFreeShippingByThreshold ? 0 : baseShippingFee;
    }
  }

  const grandTotal = Math.max(
    0,
    totalPrice +
      shippingFee -
      (appliedCoupon?.discountType === 'shipping' ? 0 : discountAmount),
  );

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (cleanCode === 'BANGLA10') {
      setAppliedCoupon({
        code: 'BANGLA10',
        discountType: 'percentage',
        value: 10,
      });
      setCouponCode('');
      toast.success('Coupon BANGLA10 applied! 10% off your items.');
    } else if (cleanCode === 'FREESHIP') {
      setAppliedCoupon({
        code: 'FREESHIP',
        discountType: 'shipping',
        value: 0,
      });
      setCouponCode('');
      toast.success('Coupon FREESHIP applied! Free delivery unlocked.');
    } else if (cleanCode === 'EID2026') {
      setAppliedCoupon({ code: 'EID2026', discountType: 'fixed', value: 200 });
      setCouponCode('');
      toast.success('Coupon EID2026 applied! Flat 200৳ off.');
    } else {
      setCouponError(
        'Invalid coupon code. Try BANGLA10, FREESHIP, or EID2026.',
      );
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    toast.info('Coupon removed.');
  };

  // Form validation
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = 'Please enter your full name';
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      errors.phone = 'Mobile number is required';
    } else if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      errors.phone = 'Enter valid 11-digit BD number (e.g. 017XXXXXXXX)';
    }

    if (!address.trim()) {
      errors.address = 'Detailed street delivery address is required';
    } else if (address.trim().length < 8) {
      errors.address = 'Please provide house, road, and area details';
    }

    // Payment validation
    if (paymentMethod === 'bkash' && !bkashNumber.trim()) {
      errors.bkashNumber = 'bKash wallet phone number is required';
    }
    if (paymentMethod === 'nagad' && !nagadNumber.trim()) {
      errors.nagadNumber = 'Nagad wallet phone number is required';
    }
    if (paymentMethod === 'card') {
      if (!cardNumber.trim()) errors.cardNumber = 'Card number is required';
      if (!cardExpiry.trim()) errors.cardExpiry = 'Expiry required';
      if (!cardCvv.trim()) errors.cardCvv = 'CVV required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Order submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors before placing your order.');
      // Scroll to first error
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomIdNum = Math.floor(10000 + Math.random() * 90000);
      const generatedOrderId = `SB-${randomIdNum}`;

      const deliveryDays = deliveryZone === 'inside' ? 1 : 3;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
      const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      const successData: OrderSuccessData = {
        orderId: generatedOrderId,
        customerName: fullName,
        phone,
        address,
        division,
        paymentMethod:
          paymentMethod === 'cod'
            ? 'Cash on Delivery'
            : paymentMethod === 'bkash'
              ? 'bKash Online'
              : paymentMethod === 'nagad'
                ? 'Nagad Online'
                : 'Debit/Credit Card',
        deliveryZone,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl,
        })),
        subtotal: totalPrice,
        shippingFee,
        discount: discountAmount,
        total: grandTotal,
        orderDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        estimatedDelivery: `${formattedDelivery} by 6:00 PM`,
      };

      setOrderSuccess(successData);
      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('🎉 Order placed successfully!');
    }, 1200);
  };

  const copyOrderId = () => {
    if (!orderSuccess) return;
    navigator.clipboard.writeText(orderSuccess.orderId);
    setCopiedOrderId(true);
    setTimeout(() => setCopiedOrderId(false), 2000);
    toast.success('Order ID copied to clipboard!');
  };

  // SUCCESS CONFIRMATION VIEW
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#f4f5f8] py-8 sm:py-14 font-sans">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100/80 overflow-hidden">
            {/* Top Celebration Header */}
            <div className="bg-linear-to-b from-emerald-50 via-amber-50/40 to-white p-8 sm:p-12 text-center border-b border-gray-100 relative">
              <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                <Check size={42} strokeWidth={3} />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-3">
                <Sparkles size={14} /> ORDER CONFIRMED
              </span>

              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 font-[montserrat] mb-2">
                Thank You, {orderSuccess.customerName}!
              </h1>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Your order has been received and is now being prepared with
                utmost care by our Dhaka boutique artisans.
              </p>

              {/* Order ID Pill */}
              <div className="mt-6 inline-flex items-center gap-3 bg-white border border-gray-200 px-5 py-2.5 rounded-2xl shadow-xs">
                <span className="text-xs text-gray-500 font-medium">
                  Order Reference:
                </span>
                <span className="text-base font-extrabold text-gray-900 font-[montserrat] tracking-wider">
                  {orderSuccess.orderId}
                </span>
                <button
                  onClick={copyOrderId}
                  className="text-gray-400 hover:text-gray-800 transition-colors cursor-pointer p-1"
                  title="Copy Order ID"
                >
                  {copiedOrderId ? (
                    <Check size={16} className="text-emerald-600" />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* Delivery & Timeline Notice */}
            <div className="p-6 sm:p-8 bg-amber-50/50 border-b border-amber-100/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-800 flex items-center justify-center shrink-0">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Estimated Delivery
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    {orderSuccess.estimatedDelivery}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    navigate(`/track-order?orderId=${orderSuccess.orderId}`)
                  }
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer font-[montserrat]"
                >
                  <span>Track This Order</span>
                  <ExternalLink size={14} />
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors cursor-pointer"
                  title="Print invoice receipt"
                >
                  <Printer size={18} />
                </button>
              </div>
            </div>

            {/* Summary Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100 text-xs">
                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 font-[montserrat]">
                    Shipping Address
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {orderSuccess.customerName}
                  </p>
                  <p className="text-gray-600 mt-0.5">{orderSuccess.address}</p>
                  <p className="text-gray-600">
                    {orderSuccess.division}, Bangladesh
                  </p>
                  <p className="text-gray-800 font-medium mt-1">
                    Phone: {orderSuccess.phone}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2 font-[montserrat]">
                    Payment Details
                  </h4>
                  <p className="text-gray-800 font-semibold">
                    {orderSuccess.paymentMethod}
                  </p>
                  <p className="text-gray-500 mt-0.5">
                    {orderSuccess.paymentMethod === 'Cash on Delivery'
                      ? 'Please pay exact cash upon receiving delivery parcel.'
                      : 'Payment transaction authorized.'}
                  </p>
                  <p className="text-gray-400 mt-2 font-mono text-[11px]">
                    Date: {orderSuccess.orderDate}
                  </p>
                </div>
              </div>

              {/* Items Ordered List */}
              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs mb-3 font-[montserrat]">
                  Items in Package (
                  {orderSuccess.items.reduce((acc, i) => acc + i.quantity, 0)})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                  {orderSuccess.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-12 h-14 object-cover object-top rounded-lg border border-gray-100 shrink-0"
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 font-[montserrat]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            Qty:{' '}
                            <strong className="text-gray-800">
                              {item.quantity}
                            </strong>{' '}
                            × {item.price.toLocaleString()}৳
                          </p>
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                        {(item.price * item.quantity).toLocaleString()}৳
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Calculation Receipt */}
              <div className="bg-gray-50/80 rounded-2xl p-4 sm:p-5 space-y-2 text-xs border border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {orderSuccess.subtotal.toLocaleString()}৳
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>
                    Delivery (
                    {orderSuccess.deliveryZone === 'inside'
                      ? 'Inside Dhaka'
                      : 'Outside Dhaka'}
                    )
                  </span>
                  <span className="font-semibold text-gray-900">
                    {orderSuccess.shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `${orderSuccess.shippingFee}৳`
                    )}
                  </span>
                </div>
                {orderSuccess.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount Applied</span>
                    <span>-{orderSuccess.discount.toLocaleString()}৳</span>
                  </div>
                )}
                <div className="border-t border-gray-200/80 pt-2 flex justify-between text-sm sm:text-base font-extrabold text-gray-900 font-[montserrat]">
                  <span>Total Amount</span>
                  <span className="text-amber-600">
                    {orderSuccess.total.toLocaleString()}৳
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer font-[montserrat]"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() =>
                    navigate(`/track-order?orderId=${orderSuccess.orderId}`)
                  }
                  className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Track Order Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY CART FALLBACK
  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#f4f5f8] px-4 py-12 text-center">
        <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 mb-6">
          <ShoppingBag size={44} strokeWidth={1.5} />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-[montserrat] mb-2">
          Your Checkout Bag is Empty
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-sm mb-8">
          You haven't added any products to your bag yet. Discover our exclusive
          collection of sarees, borkas, and modest fashion!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/shop"
            className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 font-[montserrat]"
          >
            Explore Shop Collection
          </Link>
          <Link
            to="/deals"
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-xl text-xs sm:text-sm border border-gray-200 transition-colors"
          >
            View Hot Deals
          </Link>
        </div>
      </div>
    );
  }

  // MAIN CHECKOUT WORKSPACE
  return (
    <div className="min-h-screen bg-[#f4f5f8] py-6 sm:py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Stepper */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-[inter] mb-1.5">
              <Link to="/" className="hover:text-amber-600 transition-colors">
                Home
              </Link>
              <ChevronRight size={12} className="text-gray-400" />
              <Link
                to="/shop"
                className="hover:text-amber-600 transition-colors"
              >
                Shop
              </Link>
              <ChevronRight size={12} className="text-gray-400" />
              <span className="text-gray-900 font-semibold">Checkout</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-[montserrat] flex items-center gap-2">
              Express Checkout
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-yellow-100 text-yellow-900 rounded-full">
                Secure 256-Bit
              </span>
            </h1>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                ✓
              </span>
              <span>Bag</span>
            </div>
            <div className="w-8 h-0.5 bg-emerald-300" />
            <div className="flex items-center gap-1.5 text-gray-900 font-bold">
              <span className="w-6 h-6 rounded-full bg-[#FFD700] text-gray-900 flex items-center justify-center text-xs font-extrabold">
                2
              </span>
              <span>Shipping & Pay</span>
            </div>
            <div className="w-8 h-0.5 bg-gray-200" />
            <div className="flex items-center gap-1.5 text-gray-400">
              <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Free Shipping Notification Banner */}
        {totalPrice < FREE_SHIPPING_THRESHOLD ? (
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 mb-6 flex items-center justify-between text-xs text-amber-900">
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-amber-600 shrink-0" />
              <span>
                Add{' '}
                <strong className="font-bold">
                  {(FREE_SHIPPING_THRESHOLD - totalPrice).toLocaleString()}৳
                </strong>{' '}
                more to unlock{' '}
                <strong className="text-amber-700">
                  Free Delivery across Bangladesh!
                </strong>
              </span>
            </span>
            <Link
              to="/shop"
              className="text-amber-700 font-bold hover:underline shrink-0 ml-2"
            >
              Add Items +
            </Link>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3.5 mb-6 flex items-center gap-2 text-xs text-emerald-900">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>
              Congratulations! Your order qualifies for{' '}
              <strong>Free Delivery</strong> anywhere in Bangladesh! 🎉
            </span>
          </div>
        )}

        {/* Main Grid: Form (Left) & Sticky Summary (Right) */}
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Shipping and Payment Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* SECTION 1: Customer Contact Info */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 font-[montserrat] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      1
                    </span>
                    Customer & Contact Info
                  </h2>
                  <span className="text-[11px] text-gray-400">
                    * Required fields
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (formErrors.fullName)
                          setFormErrors({ ...formErrors, fullName: '' });
                      }}
                      placeholder="e.g. Freelancer Laju"
                      className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.fullName
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#FFD700] focus:ring-[#FFD700]/30'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Mobile Number (11 digits) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 select-none">
                        +880
                      </span>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (formErrors.phone)
                            setFormErrors({ ...formErrors, phone: '' });
                        }}
                        placeholder="017XXXXXXXX"
                        maxLength={11}
                        className={`w-full bg-gray-50 border rounded-xl pl-11 pr-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                          formErrors.phone
                            ? 'border-red-400 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#FFD700] focus:ring-[#FFD700]/30'
                        }`}
                      />
                    </div>
                    {formErrors.phone ? (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.phone}
                      </p>
                    ) : (
                      <p className="text-[10px] text-gray-400 mt-1">
                        For delivery OTP & courier SMS updates
                      </p>
                    )}
                  </div>

                  {/* Alternative Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Alternative Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="018XXXXXXXX"
                      maxLength={11}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Email Address (Optional for Invoice receipt)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: Shipping & Delivery Zone */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 font-[montserrat] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      2
                    </span>
                    Delivery Address & Zone
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Division / City */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Division / Region *
                    </label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all"
                    >
                      <option value="Dhaka">Dhaka Division</option>
                      <option value="Chittagong">Chittagong Division</option>
                      <option value="Sylhet">Sylhet Division</option>
                      <option value="Rajshahi">Rajshahi Division</option>
                      <option value="Khulna">Khulna Division</option>
                      <option value="Barisal">Barisal Division</option>
                      <option value="Rangpur">Rangpur Division</option>
                      <option value="Mymensingh">Mymensingh Division</option>
                    </select>
                  </div>

                  {/* Street Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Full Delivery Address *
                    </label>
                    <textarea
                      rows={3}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formErrors.address)
                          setFormErrors({ ...formErrors, address: '' });
                      }}
                      placeholder="House / Holding number, Road / Flat no., Area or Thana (e.g. House 14, Road 5, Dhanmondi, Dhaka)"
                      className={`w-full bg-gray-50 border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${
                        formErrors.address
                          ? 'border-red-400 focus:ring-red-200'
                          : 'border-gray-200 focus:border-[#FFD700] focus:ring-[#FFD700]/30'
                      }`}
                    />
                    {formErrors.address && (
                      <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.address}
                      </p>
                    )}
                  </div>

                  {/* Delivery Zone Cards */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">
                      Select Delivery Area Option:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Inside Dhaka */}
                      <div
                        onClick={() => setDeliveryZone('inside')}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          deliveryZone === 'inside'
                            ? 'border-[#FFD700] bg-amber-50/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                              Inside Dhaka
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              SteadFast Express (24 - 48 Hours)
                            </p>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                            {isFreeShippingByThreshold ||
                            appliedCoupon?.discountType === 'shipping' ? (
                              <span className="text-emerald-600">FREE</span>
                            ) : (
                              '60৳'
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Outside Dhaka */}
                      <div
                        onClick={() => setDeliveryZone('outside')}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          deliveryZone === 'outside'
                            ? 'border-[#FFD700] bg-amber-50/40 shadow-xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                              Outside Dhaka
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              Courier Partner (48 - 72 Hours)
                            </p>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-gray-900 font-[montserrat]">
                            {isFreeShippingByThreshold ||
                            appliedCoupon?.discountType === 'shipping' ? (
                              <span className="text-emerald-600">FREE</span>
                            ) : (
                              '120৳'
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Courier Instructions / Delivery Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Call before arriving, or deliver after 2 PM"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#FFD700] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/30 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Payment Method */}
              <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-gray-100">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900 font-[montserrat] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                      3
                    </span>
                    Payment Method
                  </h2>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck size={14} /> 100% Safe & Secure
                  </span>
                </div>

                {/* Method Options Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-gray-900 bg-gray-50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5">
                      <Banknote size={16} />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Pay at doorstep
                    </span>
                  </div>

                  {/* bKash */}
                  <div
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-[#E2136E] bg-pink-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="">
                      <img src={BkashLogo} alt="bKash Logo" className="" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      bKash
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Instant Mobile Pay
                    </span>
                  </div>

                  {/* Nagad */}
                  <div
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      paymentMethod === 'nagad'
                        ? 'border-[#F7941D] bg-orange-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="">
                      <img src={NagadLogo} alt="Nagad Logo" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      Nagad
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Instant Mobile Pay
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-blue-700 bg-blue-50/50 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-full flex items-center justify-center mb-1.5">
                      <img src={CardLogo} alt="Card Logo" />
                    </div>
                    <span className="text-xs font-bold text-gray-900">
                      Card
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Visa / Master
                    </span>
                  </div>
                </div>

                {/* Conditional Sub-panels for selected payment method */}
                {paymentMethod === 'cod' && (
                  <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-4 text-xs text-gray-600 flex items-start gap-3 animate-fadeIn">
                    <div className="p-2 rounded-xl bg-white text-emerald-600 shadow-xs shrink-0">
                      <Banknote size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        Cash on Delivery Selected
                      </p>
                      <p className="mt-0.5 leading-relaxed">
                        Pay cash to the delivery rider after inspecting your
                        parcel. No advance payment required. Please keep exact
                        change ready for smooth handover.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bkash' && (
                  <div className="bg-pink-50/40 border border-pink-200/80 rounded-2xl p-4 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Smartphone size={15} className="text-[#E2136E]" />{' '}
                        bKash Payment Details
                      </span>
                      <span className="text-[10px] font-bold bg-[#E2136E] text-white px-2 py-0.5 rounded-md">
                        Merchant: Style Bangla
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Your bKash Account Number *
                      </label>
                      <input
                        type="tel"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E2136E]/30"
                      />
                      {formErrors.bkashNumber && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {formErrors.bkashNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        value={bkashTrxId}
                        onChange={(e) => setBkashTrxId(e.target.value)}
                        placeholder="e.g. 9J82KL09"
                        className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-xs uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#E2136E]/30"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Send <strong>{grandTotal.toLocaleString()}৳</strong> to
                      Merchant bKash Wallet: <strong>01700-112233</strong>.
                    </p>
                  </div>
                )}

                {paymentMethod === 'nagad' && (
                  <div className="bg-orange-50/40 border border-orange-200/80 rounded-2xl p-4 text-xs space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 flex items-center gap-1.5">
                        <Smartphone size={15} className="text-[#F7941D]" />{' '}
                        Nagad Payment Details
                      </span>
                      <span className="text-[10px] font-bold bg-[#F7941D] text-white px-2 py-0.5 rounded-md">
                        Merchant: Style Bangla
                      </span>
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Your Nagad Account Number *
                      </label>
                      <input
                        type="tel"
                        value={nagadNumber}
                        onChange={(e) => setNagadNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        maxLength={11}
                        className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30"
                      />
                      {formErrors.nagadNumber && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {formErrors.nagadNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Transaction ID (TrxID)
                      </label>
                      <input
                        type="text"
                        value={nagadTrxId}
                        onChange={(e) => setNagadTrxId(e.target.value)}
                        placeholder="e.g. 7K32PL98"
                        className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs uppercase text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7941D]/30"
                      />
                    </div>
                    <p className="text-[11px] text-gray-500">
                      Standard Nagad gateway will process payment for{' '}
                      <strong>{grandTotal.toLocaleString()}৳</strong>.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-4 text-xs space-y-3 animate-fadeIn">
                    <p className="font-bold text-gray-900 flex items-center gap-1.5">
                      <CreditCard size={15} className="text-blue-700" /> Credit
                      / Debit Card Details
                    </p>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Full Name as on card"
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4123 4567 8901 2345"
                        maxLength={19}
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                      {formErrors.cardNumber && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          Expiry (MM/YY) *
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                          CVV / CVC *
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="123"
                          maxLength={4}
                          className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary & Placer (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-lg shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <h3 className="text-base font-bold text-gray-900 font-[montserrat] flex items-center gap-2">
                    Order Summary
                    <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full">
                      {items.reduce((acc, i) => acc + i.quantity, 0)} items
                    </span>
                  </h3>
                  <Link
                    to="/shop"
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
                  >
                    Modify
                  </Link>
                </div>

                {/* Items Mini List */}
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 py-3 pr-1">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="py-2.5 flex items-center gap-3"
                    >
                      <div className="w-13 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="text-xs font-bold text-gray-900 truncate hover:text-amber-600 cursor-pointer font-[montserrat]"
                          title={item.product.name}
                          onClick={() =>
                            navigate(`/product/${item.product.id}`)
                          }
                        >
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {item.product.category || 'Fashion'}
                        </p>

                        <div className="flex items-center justify-between mt-1.5">
                          {/* Mini Qty Controls */}
                          <div className="flex items-center border border-gray-200 rounded-md bg-gray-50 text-xs">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-200 rounded-l cursor-pointer"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="px-2 font-bold text-gray-800 text-[11px]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="px-1.5 py-0.5 text-gray-600 hover:bg-gray-200 rounded-r cursor-pointer"
                            >
                              <Plus size={10} />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900 font-[montserrat]">
                              {(
                                item.product.price * item.quantity
                              ).toLocaleString()}
                              ৳
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.product.id)}
                              className="text-gray-300 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input Box */}
                <div className="pt-4 border-t border-gray-100">
                  {appliedCoupon ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <Tag size={14} className="text-emerald-600" />
                        <span>{appliedCoupon.code}</span>
                        <span className="font-normal text-[11px] text-emerald-600">
                          {appliedCoupon.discountType === 'percentage'
                            ? `(${appliedCoupon.value}% OFF)`
                            : appliedCoupon.discountType === 'shipping'
                              ? '(Free Shipping)'
                              : `(${appliedCoupon.value}৳ OFF)`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Promo Code (BANGLA10)"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs uppercase text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#FFD700]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-500 mt-1">
                          {couponError}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-gray-400">
                        <span>Try coupons:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponCode('BANGLA10');
                            setCouponError('');
                          }}
                          className="underline hover:text-amber-600 cursor-pointer"
                        >
                          BANGLA10
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => {
                            setCouponCode('FREESHIP');
                            setCouponError('');
                          }}
                          className="underline hover:text-amber-600 cursor-pointer"
                        >
                          FREESHIP
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Ledger Calculations */}
                <div className="pt-4 border-t border-gray-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-gray-900 font-[montserrat]">
                      {totalPrice.toLocaleString()}৳
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>
                      Delivery Charge (
                      {deliveryZone === 'inside' ? 'Dhaka' : 'Outside Dhaka'})
                    </span>
                    <span className="font-semibold text-gray-900 font-[montserrat]">
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">FREE</span>
                      ) : (
                        `${shippingFee}৳`
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span className="font-[montserrat]">
                        -{discountAmount.toLocaleString()}৳
                      </span>
                    </div>
                  )}

                  <div className="border-t border-gray-200/80 pt-3 flex justify-between items-baseline">
                    <div>
                      <span className="text-sm font-bold text-gray-900 font-[montserrat] block">
                        Total Payable
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Includes all applicable taxes & VAT
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-black text-gray-900 font-[montserrat]">
                        {grandTotal.toLocaleString()}৳
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order CTA Button */}
                <div className="pt-5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-extrabold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2.5 text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-[0.99] font-[montserrat] cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                        <span>Placing Your Order...</span>
                      </div>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>
                          Confirm & Place Order • {grandTotal.toLocaleString()}৳
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Back to Cart link */}
                <div className="pt-3 text-center">
                  <Link
                    to="/shop"
                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={12} />
                    <span>Back to shopping catalog</span>
                  </Link>
                </div>

                {/* Guarantees & Trust Badges */}
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-[10px] text-gray-500">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={16} className="text-emerald-600" />
                    <span>100% Genuine</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={16} className="text-amber-600" />
                    <span>SteadFast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw size={16} className="text-blue-600" />
                    <span>7 Days Return</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
