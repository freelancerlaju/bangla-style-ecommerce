import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Package,
  CheckCircle2,
  Truck,
  MapPin,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function TrackOrder() {
  const [orderInput, setOrderInput] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSearched(true);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f4f5f8] py-8 sm:py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 font-[inter] mb-6">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Home
          </Link>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 font-semibold">Track Order</span>
        </nav>

        {/* Input Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 mb-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Package size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-[montserrat] mb-2">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-6">
            Enter your Order ID (e.g.{' '}
            <strong className="text-gray-800">SB-8921</strong>) or registered
            phone number to check live shipping status.
          </p>

          <form onSubmit={handleTrack} className="max-w-md mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                value={orderInput}
                onChange={(e) => setOrderInput(e.target.value)}
                placeholder="Enter Order ID (e.g. SB-8921)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD700]/50 focus:border-[#FFD700] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-xs cursor-pointer font-[montserrat]"
            >
              {isLoading ? 'Tracking...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Status Stepper when tracked */}
        {isSearched && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-100 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-6">
              <div>
                <span className="text-[11px] text-gray-400 font-medium">
                  Order Number
                </span>
                <p className="text-base font-bold text-gray-900 font-[montserrat]">
                  {orderInput.toUpperCase() || 'SB-8921'}
                </p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-medium">
                  Estimated Delivery
                </span>
                <p className="text-xs sm:text-sm font-bold text-emerald-700 flex items-center gap-1">
                  <Clock size={14} /> Tomorrow by 6:00 PM
                </p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 font-medium">
                  Courier Partner
                </span>
                <p className="text-xs sm:text-sm font-semibold text-gray-800">
                  SteadFast Courier (Tracking #SF-82190)
                </p>
              </div>
            </div>

            {/* Progress Tracker */}
            <div className="py-4">
              <div className="relative">
                <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-gray-100 z-0">
                  <div className="h-full bg-amber-400 w-2/3 transition-all duration-700" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 relative z-10">
                  {[
                    {
                      title: 'Order Placed',
                      time: 'Yesterday, 10:30 AM',
                      done: true,
                      icon: CheckCircle2,
                    },
                    {
                      title: 'Processing & Packed',
                      time: 'Yesterday, 4:15 PM',
                      done: true,
                      icon: Package,
                    },
                    {
                      title: 'Out for Delivery',
                      time: 'Today, 9:00 AM',
                      done: true,
                      current: true,
                      icon: Truck,
                    },
                    {
                      title: 'Delivered',
                      time: 'Expected Tomorrow',
                      done: false,
                      icon: MapPin,
                    },
                  ].map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={idx}
                        className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2"
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            step.current
                              ? 'bg-amber-400 text-black ring-4 ring-amber-100'
                              : step.done
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        <div>
                          <p
                            className={`text-xs font-bold ${step.current ? 'text-amber-800' : 'text-gray-900'}`}
                          >
                            {step.title}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {step.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Delivery address & safety */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-amber-600" /> Destination:
                Dhanmondi, Dhaka, Bangladesh
              </span>
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <ShieldCheck size={14} /> Contactless OTP Verification enabled
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
