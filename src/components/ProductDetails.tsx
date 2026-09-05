import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  ChevronRight,
  Heart,
  Share2,
  ThumbsUp,
  ThumbsDown,
  User,
  ArrowLeft,
  CreditCard,
  Check,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { getProductById, getRelatedProducts } from '../data/productData';
import type { Product } from '../types/Product';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';

/* ──────────────────── Mock Review Data ──────────────────── */
interface Review {
  id: string;
  name: string;
  date: string;
  rating: number;
  title: string;
  text: string;
  helpful: number;
  notHelpful: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: 'r1',
    name: 'Fatima Rahman',
    date: 'August 28, 2026',
    rating: 5,
    title: 'Absolutely stunning quality!',
    text: 'The fabric quality exceeded my expectations. The colour is even more beautiful in person than in the photos. The stitching is flawless and it fits comfortably. Will definitely order again!',
    helpful: 24,
    notHelpful: 1,
    verified: true,
  },
  {
    id: 'r2',
    name: 'Ayesha Begum',
    date: 'August 15, 2026',
    rating: 4,
    title: 'Beautiful design, great value',
    text: 'Really lovely piece with fine detailing. Soft and comfortable for all-day wear. The delivery packaging was clean and prompt.',
    helpful: 18,
    notHelpful: 2,
    verified: true,
  },
  {
    id: 'r3',
    name: 'Nusrat Jahan',
    date: 'July 30, 2026',
    rating: 5,
    title: 'Perfect for special occasions',
    text: 'I wore this for an event and got so many compliments! The material feels premium and the drape is wonderful. Highly recommended.',
    helpful: 31,
    notHelpful: 0,
    verified: true,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 42 },
  { stars: 4, count: 18 },
  { stars: 3, count: 5 },
  { stars: 2, count: 2 },
  { stars: 1, count: 1 },
];

const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0);
const averageRating =
  ratingBreakdown.reduce((s, r) => s + r.stars * r.count, 0) / totalReviews;

/* ──────────────────── Star Renderer ──────────────────── */
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={
            i <= Math.round(rating)
              ? 'fill-[#FFD700] text-[#FFD700]'
              : 'fill-gray-200 text-gray-200'
          }
        />
      ))}
    </div>
  );
}

/* ──────────────────── Main Component ──────────────────── */
export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'description' | 'info' | 'shipping'
  >('description');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>(mockReviews);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setImageLoaded(false);
    setAddedAnimation(false);
    setIsProcessing(false);

    if (id) {
      const found = getProductById(id);
      if (found) {
        setProduct(found);
        setRelatedProducts(getRelatedProducts(found, 5));
      }
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-gray-50 py-16">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Loading product…</p>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100,
      )
    : 0;

  const handleAddToCart = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setCountdown(3);

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);

    setTimeout(() => {
      clearInterval(timer);
      addToCart(product, quantity, false); // Adds to cart without auto-opening drawer
      setIsProcessing(false);
      setAddedAnimation(true);
      setTimeout(() => setAddedAnimation(false), 2000);

      toast.success(
        <div className="flex items-center gap-3 w-full min-w-0 overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-10 h-13 object-cover object-top rounded border border-gray-200 shrink-0"
          />
          <div className="flex-1 min-w-0 overflow-hidden pr-1">
            <p
              className="font-bold text-xs text-gray-900 truncate block w-full"
              title={product.name}
            >
              {product.name}
            </p>
            <p className="text-[11px] text-gray-600 mt-0.5 truncate">
              {quantity} × {product.price.toLocaleString()}৳ added to bag!
            </p>
            <span className="text-[10px] text-amber-600 font-semibold block mt-0.5 truncate">
              Click navbar bag icon to view cart
            </span>
          </div>
        </div>,
        {
          position: 'top-right',
          autoClose: 3500,
        },
      );
    }, 3000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    openCart();
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewRating === 0 || !reviewTitle.trim() || !reviewText.trim()) return;
    const newReview: Review = {
      id: `r-${Date.now()}`,
      name: 'You',
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      rating: reviewRating,
      title: reviewTitle,
      text: reviewText,
      helpful: 0,
      notHelpful: 0,
      verified: true,
    };
    setReviews([newReview, ...reviews]);
    setReviewRating(0);
    setReviewTitle('');
    setReviewText('');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-800">
      {/* ─── Breadcrumb ─── */}
      <div className="bg-white border-b border-gray-100 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-[inter] overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Collection
            </Link>
            <ChevronRight size={12} className="text-gray-400" />
            {product.category && (
              <>
                <span className="text-gray-500">{product.category}</span>
                <ChevronRight size={12} className="text-gray-400" />
              </>
            )}
            <span className="text-gray-900 font-medium truncate max-w-55">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ─── Mobile Back Button ─── */}
      <div className="sm:hidden bg-white px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={14} /> Back
        </button>
        <span className="text-[11px] text-gray-400">SKU: {product.id}</span>
      </div>

      {/* ═══════════ COMPACT PRODUCT HERO ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ── Left Column: Product Image (Carefully Sized & Height Capped) ── */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start">
              <div
                className="relative bg-[#fafafa] rounded-xl overflow-hidden border border-gray-200/70 w-full max-w-105 aspect-4/5 max-h-105 cursor-crosshair group flex items-center justify-center mx-auto md:mx-0"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  onLoad={() => setImageLoaded(true)}
                  className={`w-full h-full object-cover object-top transition-transform duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={
                    isZooming
                      ? {
                          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                          transform: 'scale(1.7)',
                        }
                      : undefined
                  }
                />

                {/* Discount Badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs z-10">
                    -{discount}%
                  </div>
                )}

                {/* Save Badge */}
                {product.saveAmount && (
                  <div className="absolute top-3 right-3 bg-[#FFD700] text-black text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs z-10">
                    Save {product.saveAmount}৳
                  </div>
                )}

                {/* Zoom Hint */}
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Hover to zoom
                </div>
              </div>

              {/* Thumbnails Strip */}
              <div className="flex gap-2.5 mt-3 justify-center md:justify-start w-full max-w-105">
                {[product.imageUrl, product.imageUrl, product.imageUrl].map(
                  (thumb, idx) => (
                    <div
                      key={idx}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                        idx === 0
                          ? 'border-[#FFD700] shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={thumb}
                        alt="Thumbnail"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* ── Right Column: Info & Action Controls ── */}
            <div className="md:col-span-7 flex flex-col">
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {product.category || 'Exclusive Collection'}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 size={13} /> In Stock
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-snug font-[montserrat] mb-2.5">
                {product.name}
              </h1>

              {/* Rating & Reviews overview */}
              <div className="flex items-center gap-2.5 mb-3.5">
                <Stars rating={averageRating} size={15} />
                <span className="text-xs font-bold text-gray-800">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  • {totalReviews} reviews
                </span>
              </div>

              {/* Price & Savings */}
              <div className="bg-gray-50/80 rounded-xl p-3 mb-4 border border-gray-100 flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-[montserrat]">
                  {product.price.toLocaleString()}৳
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through decoration-gray-400">
                    {product.originalPrice.toLocaleString()}৳
                  </span>
                )}
                {discount > 0 && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Product Brief Description */}
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed mb-4">
                {product.description ||
                  'Crafted with premium grade fabrics, offering an elegant silhouette and graceful drape. Perfect balance of traditional sophistication and modern modest fashion.'}
              </p>

              {/* Options (Size / Color) */}
              <div className="mb-4 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">Size:</span>
                  <span className="text-amber-700 font-medium">
                    Free Size / Standard
                  </span>
                </div>
                <div className="flex gap-2">
                  {['Free Size', 'Custom Fit'].map((size, index) => (
                    <button
                      key={size}
                      className={`text-xs px-3.5 py-1.5 rounded-md font-medium transition-all ${
                        index === 0
                          ? 'bg-gray-900 text-white shadow-xs'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 font-[inter]">
                  Select Quantity
                </label>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-40"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-1.5 text-center text-xs font-bold min-w-10 text-gray-900 font-[montserrat]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    Total:{' '}
                    <strong className="text-gray-800">
                      {(product.price * quantity).toLocaleString()}৳
                    </strong>
                  </span>
                </div>
              </div>

              {/* Primary Call to Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isProcessing}
                  className={`bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] text-xs sm:text-sm font-[montserrat] cursor-pointer relative overflow-hidden ${
                    isProcessing ? 'cursor-wait opacity-90' : ''
                  } ${
                    addedAnimation
                      ? 'ring-2 ring-emerald-500 bg-emerald-400 text-black'
                      : ''
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin text-gray-900"
                      />
                      <span>Adding to Cart ({countdown}s)...</span>
                      <div className="absolute bottom-0 left-0 h-1 bg-black/25 w-full animate-pulse" />
                    </>
                  ) : addedAnimation ? (
                    <>
                      <Check
                        size={16}
                        strokeWidth={3}
                        className="text-emerald-900"
                      />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} strokeWidth={2.5} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] text-xs sm:text-sm font-[montserrat] cursor-pointer"
                >
                  <CreditCard size={16} strokeWidth={2.5} />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Wishlist and Share */}
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-5">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'text-red-500 font-semibold'
                      : 'hover:text-red-500'
                  }`}
                >
                  <Heart
                    size={15}
                    className={isWishlisted ? 'fill-red-500' : ''}
                  />
                  {isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                </button>
                <span className="text-gray-300">|</span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    alert('Product link copied to clipboard!');
                  }}
                  className="flex items-center gap-1.5 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <Share2 size={15} />
                  Share
                </button>
              </div>

              {/* Compact Trust Features */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-gray-100">
                {[
                  { icon: Truck, label: 'Free Delivery', sub: 'Over 2000৳' },
                  {
                    icon: ShieldCheck,
                    label: '100% Authentic',
                    sub: 'Guaranteed',
                  },
                  {
                    icon: RefreshCw,
                    label: '7-Day Return',
                    sub: 'Easy exchange',
                  },
                  { icon: Clock, label: 'Fast Dispatch', sub: '24-48 Hours' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100/70"
                  >
                    <Icon
                      size={16}
                      className="text-amber-600 shrink-0"
                      strokeWidth={2}
                    />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-gray-800 truncate leading-tight">
                        {label}
                      </p>
                      <p className="text-[9px] text-gray-400 truncate leading-tight">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPACT TABS SECTION ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
          {/* Tab buttons */}
          <div className="flex border-b border-gray-100 bg-gray-50/50 px-4">
            {(
              [
                { key: 'description', label: 'Description' },
                { key: 'info', label: 'Specifications' },
                { key: 'shipping', label: 'Delivery & Returns' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-3 px-4 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px cursor-pointer ${
                  activeTab === key
                    ? 'border-[#FFD700] text-gray-900 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p>
                  {product.description ||
                    'Experience unmatched elegance and timeless modest style. Carefully woven with fine threads to bring you high quality comfort for any festive or casual occasion.'}
                </p>
                <h4 className="font-bold text-gray-900 text-xs sm:text-sm pt-1">
                  Product Highlights:
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-600 list-disc pl-4">
                  <li>Premium breathable, durable textile composition</li>
                  <li>Intricate artisan finish on seams and borders</li>
                  <li>Comfortable fit designed for all-day elegance</li>
                  <li>Color-fast dyes ensuring lasting vibrancy</li>
                </ul>
              </div>
            )}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-xs">
                {[
                  ['SKU Identifier', product.id],
                  ['Fabric Type', 'Premium Half-Silk / Georgette'],
                  ['Care Instructions', 'Dry Clean or Gentle Cold Hand Wash'],
                  ['Origin', 'Authentic Bangladeshi Craftsmanship'],
                  ['Included Items', '1 x Finished Apparel Piece'],
                  ['Warranty', 'Guaranteed Against Weaving Defects'],
                ].map(([lbl, val]) => (
                  <div
                    key={lbl}
                    className="flex justify-between py-1 border-b border-gray-50"
                  >
                    <span className="text-gray-400 font-medium">{lbl}:</span>
                    <span className="text-gray-800 font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-2 text-xs">
                <p>
                  <strong>Inside Dhaka:</strong> Delivery within 24–48 hours
                  (Charge: 60৳).
                </p>
                <p>
                  <strong>Outside Dhaka:</strong> Delivery within 2–4 business
                  days via courier (Charge: 120৳).
                </p>
                <p className="text-amber-700 font-semibold pt-1">
                  * Free shipping applied automatically on all orders over
                  2,000৳!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ REFINED REVIEWS SECTION ═══════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xs border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-[montserrat]">
              Customer Reviews
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {totalReviews} Verified Ratings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Rating Overview */}
            <div className="md:col-span-4 bg-gray-50/80 rounded-xl p-4 border border-gray-100">
              <div className="text-center mb-3">
                <div className="text-4xl font-extrabold text-gray-900 font-[montserrat]">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center my-1.5">
                  <Stars rating={averageRating} size={16} />
                </div>
                <p className="text-[11px] text-gray-400">
                  Overall rating from {totalReviews} customers
                </p>
              </div>

              {/* Progress bars */}
              <div className="space-y-1.5 text-xs">
                {ratingBreakdown.map(({ stars, count }) => {
                  const pct = Math.round((count / totalReviews) * 100);
                  return (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-500 w-5 text-right font-medium">
                        {stars}★
                      </span>
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FFD700] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 w-6 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Reviews List & Form */}
            <div className="md:col-span-8 space-y-4">
              {/* Existing Reviews */}
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-[11px]">
                          {review.name === 'You' ? (
                            <User size={13} />
                          ) : (
                            review.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900">
                            {review.name}
                          </span>
                          {review.verified && (
                            <span className="ml-1.5 text-[9px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <Stars rating={review.rating} size={12} />
                    </div>

                    <h5 className="font-semibold text-gray-800 mb-1">
                      {review.title}
                    </h5>
                    <p className="text-gray-600 leading-relaxed mb-2">
                      {review.text}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 border-t border-gray-100 pt-1.5">
                      <span>{review.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px]">Helpful?</span>
                        <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                          <ThumbsUp size={11} /> {review.helpful}
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                          <ThumbsDown size={11} /> {review.notHelpful}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Review Form */}
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 font-[montserrat]">
                  Write a Review
                </h3>
                <form onSubmit={handleSubmitReview} className="space-y-3">
                  {/* Rating Stars */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Your Rating
                    </label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          onMouseEnter={() => setReviewHover(star)}
                          onMouseLeave={() => setReviewHover(0)}
                          className="cursor-pointer"
                        >
                          <Star
                            size={18}
                            className={
                              star <= (reviewHover || reviewRating)
                                ? 'fill-[#FFD700] text-[#FFD700]'
                                : 'fill-gray-200 text-gray-200'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Title of your review"
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#FFD700]"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Tell us what you liked or disliked about this product..."
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#FFD700] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold py-2 px-4 rounded-lg text-xs font-[montserrat] cursor-pointer transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ RELATED PRODUCTS ═══════════ */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 font-[montserrat]">
                You May Also Like
              </h2>
              <Link
                to="/"
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
