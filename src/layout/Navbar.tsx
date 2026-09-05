import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  UserRound,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { searchProducts, allProducts } from '../data/productData';
import type { Product } from '../types/Product';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Deals & Offers', href: '/deals' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Borka', href: '/borka' },
  { label: 'Hijab', href: '/hijab' },
];

const POPULAR_SEARCHES = ['Borka', 'Saree', 'Abaya', 'Kameez', 'Shrug'];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, openCart } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the input as soon as the desktop search box expands
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Update search results on typing
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchProducts(searchQuery);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Handle click outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopSearchRef.current &&
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId: string) => {
    setIsSearchFocused(false);
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  const handleQuickSearch = (term: string) => {
    setSearchQuery(term);
    searchInputRef.current?.focus();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <>
      <header className="w-full border-b border-gray-100 bg-white py-2 sticky top-0 z-30 shadow-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="hidden h-auto items-center justify-between lg:flex">
            {/* Logo */}
            <div className="w-55 shrink-0">
              <Link
                to="/"
                className="inline-block font-serif text-2xl italic tracking-tight text-gray-900 hover:opacity-90 transition-opacity"
              >
                Style Bangla
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-1 items-center justify-center gap-7 text-[14px] font-medium font-[inter]">
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={`flex items-center whitespace-nowrap transition-all duration-200 py-1 border-b-2 ${
                      isActive
                        ? 'border-[#FED90B] text-gray-900 font-bold'
                        : 'border-transparent text-gray-700 hover:text-amber-600'
                    }`}
                  >
                    {link.label}
                    {link.label === 'Deals & Offers' && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                        HOT
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Icons: Search, Account, Cart */}
            <div className="flex shrink-0 items-center justify-end gap-3">
              {/* Desktop Search Bar */}
              <div ref={desktopSearchRef} className="relative">
                <div
                  className={`flex items-center transition-all duration-300 ease-in-out ${
                    isSearchOpen ? 'w-72' : 'w-9'
                  }`}
                >
                  {isSearchOpen ? (
                    <div className="flex w-full items-center gap-2 rounded-xl border border-amber-300/80 bg-gray-50 px-3 py-1.5 shadow-xs focus-within:ring-2 focus-within:ring-amber-300 focus-within:bg-white transition-all">
                      <Search className="h-4 w-4 shrink-0 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchFocused(true)}
                        placeholder="Search saree, abaya, borka..."
                        className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setIsSearchFocused(false);
                            setIsSearchOpen(false);
                          }
                        }}
                      />
                      {searchQuery ? (
                        <button
                          onClick={clearSearch}
                          className="text-gray-400 hover:text-gray-700 p-0.5"
                          title="Clear query"
                        >
                          <X size={13} />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsSearchOpen(false);
                            setIsSearchFocused(false);
                          }}
                          className="text-gray-400 hover:text-gray-700 p-0.5"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Open search"
                      onClick={() => {
                        setIsSearchOpen(true);
                        setIsSearchFocused(true);
                      }}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  )}
                </div>

                {/* Desktop Search Results Dropdown */}
                {isSearchOpen && isSearchFocused && (
                  <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    {searchQuery.trim() ? (
                      <div>
                        <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                          <span>
                            Results for &ldquo;
                            <strong className="text-gray-900">
                              {searchQuery}
                            </strong>
                            &rdquo;
                          </span>
                          <span className="font-bold text-gray-800">
                            {searchResults.length} found
                          </span>
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-gray-50 p-2">
                          {searchResults.length === 0 ? (
                            <div className="py-6 text-center text-xs text-gray-500">
                              <p className="font-semibold text-gray-700 mb-1">
                                No matching products found
                              </p>
                              <p className="text-[11px] text-gray-400 mb-3">
                                Try searching for popular categories:
                              </p>
                              <div className="flex flex-wrap gap-1.5 justify-center">
                                {POPULAR_SEARCHES.map((term) => (
                                  <button
                                    key={term}
                                    onClick={() => handleQuickSearch(term)}
                                    className="px-2.5 py-1 bg-gray-100 hover:bg-amber-100 text-gray-800 rounded-md text-[11px] font-medium transition-colors"
                                  >
                                    {term}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            searchResults.map((product) => (
                              <div
                                key={product.id}
                                onClick={() => handleSelectProduct(product.id)}
                                className="flex items-center gap-3 p-2 hover:bg-amber-50/60 rounded-xl cursor-pointer transition-colors group"
                              >
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-11 h-13 object-cover object-top rounded-lg border border-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-bold text-gray-900 truncate group-hover:text-amber-700">
                                    {product.name}
                                  </p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                      {product.category || 'Fashion'}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900 font-[montserrat]">
                                      {product.price.toLocaleString()}৳
                                    </span>
                                    {product.originalPrice && (
                                      <span className="text-[10px] text-gray-400 line-through">
                                        {product.originalPrice.toLocaleString()}
                                        ৳
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <ArrowRight
                                  size={14}
                                  className="text-gray-300 group-hover:text-amber-600 transition-colors shrink-0"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-2.5">
                          <TrendingUp size={14} className="text-amber-600" />
                          Popular Searches
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {POPULAR_SEARCHES.map((term) => (
                            <button
                              key={term}
                              onClick={() => handleQuickSearch(term)}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-amber-400 hover:text-black text-gray-700 rounded-full text-xs font-medium transition-colors cursor-pointer"
                            >
                              {term}
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                          <span className="text-[11px] font-bold text-gray-400 block mb-2">
                            TRENDING COLLECTION
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            {allProducts.slice(0, 3).map((p) => (
                              <div
                                key={p.id}
                                onClick={() => handleSelectProduct(p.id)}
                                className="cursor-pointer group text-center"
                              >
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-full aspect-3/4 object-cover object-top rounded-lg border border-gray-100 group-hover:opacity-90 transition-opacity"
                                />
                                <span className="text-[10px] font-semibold text-gray-800 truncate block mt-1">
                                  {p.price.toLocaleString()}৳
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Account Profile Button */}
              <button
                type="button"
                aria-label="Account"
                onClick={() => navigate('/account')}
                className="flex h-9 w-9 items-center justify-center text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="My Account"
              >
                <UserRound className="h-5 w-5" />
              </button>

              {/* Cart Drawer Button */}
              <button
                type="button"
                aria-label="Cart"
                onClick={openCart}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                title="View Shopping Bag"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-gray-900 shadow-sm animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Header Bar */}
          <div className="grid h-12 grid-cols-[auto_1fr_auto] items-center gap-3 sm:h-14 lg:hidden">
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center text-gray-800 cursor-pointer"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <Link
              to="/"
              className="justify-self-center font-serif text-xl italic tracking-tight text-gray-900 sm:text-2xl"
            >
              Style Bangla
            </Link>

            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                aria-label="Account"
                onClick={() => navigate('/account')}
                className="flex h-9 w-9 items-center justify-center text-gray-800 hover:text-gray-500 cursor-pointer"
              >
                <UserRound className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Cart"
                onClick={openCart}
                className="relative flex h-9 w-9 shrink-0 items-center justify-center text-gray-800 hover:text-gray-500 cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-bold text-gray-900 shadow-sm">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div ref={mobileSearchRef} className="pb-3 lg:hidden relative">
            <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 focus-within:ring-2 focus-within:ring-amber-300 focus-within:bg-white transition-all">
              <Search className="h-4 w-4 shrink-0 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search products, sarees, borkas..."
                className="w-full bg-transparent text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={clearSearch} className="text-gray-400 p-1">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Mobile Search Results Floating Dropdown */}
            {isSearchFocused && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto divide-y divide-gray-50 p-2">
                {searchResults.length === 0 ? (
                  <div className="py-4 text-center text-xs text-gray-500">
                    No products found for &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="flex items-center gap-3 p-2 hover:bg-amber-50/60 rounded-xl cursor-pointer"
                    >
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-10 h-12 object-cover object-top rounded-lg border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {product.category || 'Fashion'}
                          </span>
                          <span className="text-xs font-bold text-gray-900">
                            {product.price.toLocaleString()}৳
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer Menu */}
        <nav
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 border-t border-gray-100 px-4 py-3 bg-white">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href);

              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-xl px-3 py-2.5 text-xs font-semibold flex items-center justify-between transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.label === 'Deals & Offers' && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full">
                      SALE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}
