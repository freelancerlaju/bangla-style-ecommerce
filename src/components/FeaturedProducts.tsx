import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
  Check,
  ShoppingCart,
  Loader2,
} from 'lucide-react';
import { toast } from 'react-toastify';
import type { Product } from '../types/Product';
import { allProducts } from '../data/productData';
import { useCart } from '../context/CartContext';

interface FeaturedProductProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
}

function pickFeatured(pool: Product[]): Product[] {
  // Prefer items with discounts, otherwise just take the first ones
  const discounted = pool.filter(
    (p) => p.originalPrice && p.originalPrice > p.price,
  );
  const source = discounted.length >= 6 ? discounted : pool;
  return source.slice(0, 8);
}

function ratingFor(id: string): number {
  // Deterministic pseudo-rating between 4.4 and 4.9
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  const norm = Math.abs(hash % 50) / 100;
  return Math.round((4.4 + norm) * 10) / 10;
}

function reviewCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 17 + id.charCodeAt(i)) | 0;
  return 28 + (Math.abs(hash) % 240);
}

function discountPercent(p: Product): number {
  if (!p.originalPrice || p.originalPrice <= p.price) return 0;
  return Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
}

export default function FeaturedProducts({
  products,
  title = 'Featured Collection',
  subtitle = 'Hand-picked signature pieces, curated by our style editors',
}: FeaturedProductProps) {
  const featured = useMemo(
    () => pickFeatured(products ?? allProducts),
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hero = featured[activeIndex] ?? featured[0];
  const { addToCart } = useCart();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (adding || !hero) return;
    setAdding(true);
    setTimeout(() => {
      addToCart(hero, 1, false);
      setAdding(false);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
      toast.success(`${hero.name} added to bag`);
    }, 700);
  };

  const heroRating = ratingFor(hero.id);
  const heroReviews = reviewCount(hero.id);
  const heroDiscount = discountPercent(hero);

  const next = () => setActiveIndex((i) => (i + 1) % featured.length);
  const prev = () =>
    setActiveIndex((i) => (i - 1 + featured.length) % featured.length);

  return (
    <section className="bg-[#f4f5f8] font-[montserrat] antialiased text-gray-900 my-4 md:my-6 lg:my-8">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h2 className="mt-2 text-2xl md:text-3xl font-[montserrat] tracking-tight text-gray-900">
              <span className="font-bold">{title.split(' ')[0]}</span>
              <span className="font-serif italic font-normal text-gray-700 ml-1">
                {title.split(' ').slice(1).join(' ') || 'Collection'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-md">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/shop"
              className="rounded-lg bg-white border border-gray-200 hover:border-[#FFD700] hover:bg-[#FFD700] hover:text-gray-900 text-gray-800 px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-300 font-[montserrat] flex items-center gap-1.5"
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Main Layout: Hero + Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Hero Feature Card */}
          {hero && (
            <div className="lg:col-span-2 relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white shadow-lg group">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 20% 20%, #FFD700 0%, transparent 40%), radial-gradient(circle at 80% 80%, #FFD700 0%, transparent 40%)',
                }}
              />

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 p-5 sm:p-7">
                {/* Image side */}
                <div className="relative order-1 md:order-1">
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-1 bg-[#FFD700] text-black text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shadow">
                      <Crown size={10} fill="currentColor" /> Featured
                    </span>
                    {heroDiscount > 0 && (
                      <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                        <Zap size={10} fill="currentColor" /> -{heroDiscount}%
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${hero.id}`}
                    className="block aspect-[4/5] sm:aspect-[4/5] rounded-xl overflow-hidden bg-white/5 border border-white/10"
                  >
                    <img
                      src={hero.imageUrl}
                      alt={hero.name}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>

                  {/* Slider dots */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    {featured.map((_, idx) => (
                      <button
                        key={idx}
                        aria-label={`Show featured ${idx + 1}`}
                        onClick={() => setActiveIndex(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeIndex
                            ? 'w-6 bg-[#FFD700]'
                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-between order-2 md:order-2">
                  <div>
                    {hero.category && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#FFD700] mb-2">
                        {hero.category}
                      </span>
                    )}
                    <Link to={`/product/${hero.id}`}>
                      <h3 className="text-lg sm:text-xl font-bold font-[montserrat] leading-snug hover:text-[#FFD700] transition-colors">
                        {hero.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < Math.round(heroRating)
                                ? 'text-[#FFD700] fill-[#FFD700]'
                                : 'text-white/20'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-white/70 font-medium">
                        {heroRating} · {heroReviews} reviews
                      </span>
                    </div>

                    <p className="text-xs text-white/70 mt-3 line-clamp-3 leading-relaxed">
                      {hero.description ||
                        'A signature piece from our editor-selected collection.'}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2.5 mt-4 font-[montserrat] flex-wrap">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {hero.price.toLocaleString()}৳
                      </span>
                      {hero.originalPrice && (
                        <>
                          <span className="text-sm text-white/40 line-through">
                            {hero.originalPrice.toLocaleString()}৳
                          </span>
                          <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                            Save {hero.originalPrice - hero.price}৳
                          </span>
                        </>
                      )}
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <Badge
                        icon={<ShieldCheck size={11} />}
                        label="Authentic"
                      />
                      <Badge icon={<Truck size={11} />} label="Free Ship" />
                      <Badge
                        icon={<RotateCcw size={11} />}
                        label="7-Day Return"
                      />
                    </div>
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center gap-2 mt-5">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className={`flex-1 font-[montserrat] font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        adding
                          ? 'bg-amber-400/80 text-black cursor-wait'
                          : added
                            ? 'bg-emerald-500 text-white'
                            : 'bg-[#FFD700] text-black hover:bg-amber-400'
                      }`}
                    >
                      {adding ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Adding…
                        </>
                      ) : added ? (
                        <>
                          <Check size={14} strokeWidth={2.5} />
                          Added
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} strokeWidth={2.5} />
                          Add to cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={prev}
                      aria-label="Previous featured product"
                      className="w-10 h-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={next}
                      aria-label="Next featured product"
                      className="w-10 h-10 shrink-0 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Side Stack */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 sm:gap-4">
            {featured.slice(0, 4).map((p, idx) => (
              <FeaturedSideCard
                key={p.id}
                product={p}
                index={idx}
                isActive={idx === activeIndex % featured.length}
                onSelect={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Badge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-md px-1.5 py-1 text-[10px] font-semibold text-white/80">
      {icon}
      {label}
    </div>
  );
}

function FeaturedSideCard({
  product,
  index,
  isActive,
  onSelect,
}: {
  product: Product;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}) {
  const rating = ratingFor(product.id);
  const discount = discountPercent(product);

  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={onSelect}
      className={`group flex bg-white rounded-xl border overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 ${
        isActive
          ? 'border-[#FFD700] ring-2 ring-[#FFD700]/30'
          : 'border-gray-100'
      }`}
    >
      <div className="relative w-24 sm:w-28 shrink-0 bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0 p-2.5 flex flex-col justify-between">
        <div>
          {product.category && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-600">
              {product.category}
            </span>
          )}
          <p
            className="text-[11px] sm:text-xs font-semibold text-gray-900 line-clamp-2 mt-0.5 group-hover:text-amber-700 transition-colors font-[montserrat]"
            title={product.name}
          >
            {product.name}
          </p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="text-[#FFD700] fill-[#FFD700]" />
            <span className="text-[10px] font-semibold text-gray-700">
              {rating}
            </span>
            <span className="text-[10px] text-gray-400">· #{index + 2}</span>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 mt-1 font-[montserrat]">
          <span className="text-xs sm:text-sm font-bold text-gray-900">
            {product.price.toLocaleString()}৳
          </span>
          {product.originalPrice && (
            <span className="text-[10px] text-gray-400 line-through">
              {product.originalPrice.toLocaleString()}৳
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
