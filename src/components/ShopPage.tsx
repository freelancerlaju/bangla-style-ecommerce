import { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, ArrowUpDown, Sparkles, Tag, ChevronRight } from 'lucide-react';
import { allProducts } from '../data/productData';
import ProductCard from './ProductCard';
import type { Product } from '../types/Product';

interface ShopPageProps {
  initialCategory?: string;
  isDealsOnly?: boolean;
}

const CATEGORIES = ['All', 'Saree', 'Abaya', 'Borka', 'Kameez', 'Shrug'];

export default function ShopPage({
  initialCategory,
  isDealsOnly,
}: ShopPageProps) {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'All',
  );
  const [sortBy, setSortBy] = useState<
    'featured' | 'low-to-high' | 'high-to-low'
  >('featured');
  const [dealsOnly, setDealsOnly] = useState<boolean>(isDealsOnly || false);

  // Sync state if navigation changes between /shop, /deals, /borka, etc.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    } else {
      setSelectedCategory('All');
    }
    setDealsOnly(isDealsOnly || false);
  }, [location.pathname, initialCategory, isDealsOnly]);

  const filteredProducts = useMemo(() => {
    let list: Product[] = [...allProducts];

    // Filter by Deals
    if (dealsOnly) {
      list = list.filter((p) => p.originalPrice || p.saveAmount);
    }

    // Filter by Category
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Hijab') {
        list = list.filter(
          (p) => p.category === 'Borka' || p.category === 'Abaya',
        );
      } else {
        list = list.filter(
          (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase(),
        );
      }
    }

    // Sorting
    if (sortBy === 'low-to-high') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high-to-low') {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [selectedCategory, sortBy, dealsOnly]);

  return (
    <div className="min-h-screen bg-[#f4f5f8] py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-[inter] mb-5">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 font-semibold">
            {dealsOnly
              ? 'Deals & Special Offers'
              : selectedCategory === 'All'
                ? 'Shop All Products'
                : `${selectedCategory} Collection`}
          </span>
        </nav>

        {/* Header Banner */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-xs border border-gray-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-wider mb-2">
              <Sparkles size={13} />
              {dealsOnly ? 'Exclusive Discounts' : 'Premium Ethnic Wear'}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-[montserrat]">
              {dealsOnly
                ? 'Special Deals & Offers'
                : selectedCategory === 'All'
                  ? 'All Products'
                  : `${selectedCategory} Collection`}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Showing{' '}
              <strong className="text-gray-900">
                {filteredProducts.length}
              </strong>{' '}
              handcrafted pieces available
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200/80 text-xs">
              <ArrowUpDown size={14} className="text-gray-500" />
              <span className="text-gray-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <span className="text-xs font-semibold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
            <Filter size={13} /> Filter:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
          <button
            onClick={() => setDealsOnly(!dealsOnly)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              dealsOnly
                ? 'bg-amber-400 text-black shadow-xs font-bold'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200/70'
            }`}
          >
            <Tag size={12} />
            On Sale Only
          </button>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-xs my-8">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <Tag size={28} />
            </div>
            <h3 className="text-base font-bold text-gray-800 font-[montserrat] mb-1">
              No products found
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
              We couldn't find any products matching the current filter
              criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setDealsOnly(false);
              }}
              className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
