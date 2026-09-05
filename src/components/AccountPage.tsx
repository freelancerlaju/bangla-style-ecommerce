import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  User,
  Mail,
  Phone,
  LogIn,
  UserPlus,
  ShieldCheck,
  CreditCard,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Briefcase,
  Plus,
  Trash2,
  Star,
  Truck,
  Pencil,
  Camera,
  Save,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joined: string;
  avatar: string;
  vip: boolean;
}

interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: number;
  thumbnail: string;
}

interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  name: string;
  street: string;
  city: string;
  phone: string;
  isDefault: boolean;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: 'SB-10428',
    date: '2026-09-01',
    status: 'Shipped',
    total: 4280,
    items: 3,
    thumbnail:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80',
  },
  {
    id: 'SB-10391',
    date: '2026-08-22',
    status: 'Processing',
    total: 1850,
    items: 1,
    thumbnail:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80',
  },
  {
    id: 'SB-10277',
    date: '2026-07-18',
    status: 'Delivered',
    total: 6320,
    items: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&q=80',
  },
];

const DEFAULT_WISHLIST: WishlistItem[] = [
  {
    id: 'w1',
    name: 'Premium Embroidered Borka',
    price: 2490,
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80',
    inStock: true,
  },
  {
    id: 'w2',
    name: 'Silk Hijab - Rose Gold',
    price: 890,
    image:
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&q=80',
    inStock: true,
  },
  {
    id: 'w3',
    name: 'Designer Kameez Set',
    price: 3450,
    image:
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&q=80',
    inStock: false,
  },
  {
    id: 'w4',
    name: 'Festive Saree Collection',
    price: 5290,
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&q=80',
    inStock: true,
  },
];

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'a1',
    label: 'Home',
    name: 'Sadia Rahman',
    street: 'House 27, Road 11, Dhanmondi',
    city: 'Dhaka 1205, Bangladesh',
    phone: '+880 1712 345 678',
    isDefault: true,
  },
];

function statusColor(status: Order['status']) {
  switch (status) {
    case 'Processing':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Shipped':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
  }
}

function addressIcon(label: Address['label']) {
  if (label === 'Home') return <Home size={14} />;
  if (label === 'Office') return <Briefcase size={14} />;
  return <MapPin size={14} />;
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, loading, signInWithGoogle, signInWithGithub, signInWithEmail, signUpWithEmail, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isAuthMode, setIsAuthMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    joined: new Date().toISOString().split('T')[0],
    avatar: '',
    vip: false,
  });
  const [orders] = useState<Order[]>(DEFAULT_ORDERS);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(DEFAULT_WISHLIST);
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(profile);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [draftAddress, setDraftAddress] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    name: '',
    street: '',
    city: '',
    phone: '',
    isDefault: false,
  });

  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: true,
  });

  const initials = useMemo(() => {
    const name = user?.displayName || 'U';
    return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
  }, [user?.displayName]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfile((prev) => ({
        ...prev,
        name: user.displayName || prev.name || 'User',
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
        avatar: user.photoURL || prev.avatar,
        joined: prev.joined || new Date().toISOString().split('T')[0],
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-6 pt-8 pb-6 text-center bg-gradient-to-br from-amber-50/60 via-white to-white">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xl flex items-center justify-center shadow-lg mb-4">
                {isAuthMode ? <LogIn size={28} /> : <UserPlus size={28} />}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 font-[montserrat] mb-1">
                {isAuthMode ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAuthMode
                  ? 'Sign in to access your account'
                  : 'Join Style Bangla for a better shopping experience'}
              </p>
            </div>

            <div className="px-6 pb-8 pt-2">
              <div className="space-y-2.5 mb-5">
                <button
                  onClick={async () => {
                    try {
                      setAuthLoading(true);
                      await signInWithGoogle();
                      toast.success('Signed in with Google');
                    } catch {
                      toast.error('Google sign-in failed');
                    } finally {
                      setAuthLoading(false);
                    }
                  }}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={async () => {
                    try {
                      setAuthLoading(true);
                      await signInWithGithub();
                      toast.success('Signed in with GitHub');
                    } catch {
                      toast.error('GitHub sign-in failed');
                    } finally {
                      setAuthLoading(false);
                    }
                  }}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium">or continue with email</span>
                </div>
              </div>

              <form
                className="space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email || !password) {
                    toast.error('Please fill in all fields');
                    return;
                  }
                  if (password.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    return;
                  }
                  try {
                    setAuthLoading(true);
                    if (isAuthMode) {
                      await signInWithEmail(email, password);
                      toast.success('Welcome back!');
                    } else {
                      await signUpWithEmail(email, password);
                      toast.success('Account created successfully!');
                    }
                  } catch {
                    toast.error(isAuthMode ? 'Invalid email or password' : 'Could not create account');
                  } finally {
                    setAuthLoading(false);
                  }
                }}
              >
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {authLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isAuthMode ? (
                    <>
                      <LogIn size={16} /> Sign In
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Sign Up
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    setIsAuthMode(!isAuthMode);
                    setEmail('');
                    setPassword('');
                  }}
                  className="text-sm text-amber-700 hover:text-amber-800 font-semibold"
                >
                  {isAuthMode ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    setProfile(draftProfile);
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setDraftProfile(profile);
    setIsEditingProfile(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((p) => ({ ...p, avatar: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleAddAddress = () => {
    if (!draftAddress.name || !draftAddress.street) return;
    const newAddress: Address = {
      ...draftAddress,
      id: `a${Date.now()}`,
    };
    let updated = [...addresses, newAddress];
    if (newAddress.isDefault) {
      updated = updated.map((a) => ({ ...a, isDefault: a.id === newAddress.id }));
    }
    setAddresses(updated);
    setDraftAddress({
      label: 'Home',
      name: '',
      street: '',
      city: '',
      phone: '',
      isDefault: false,
    });
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id })),
    );
  };

  const handleRemoveWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((w) => w.id !== id));
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={15} /> },
    {
      id: 'orders',
      label: `Orders (${orders.filter((o) => o.status !== 'Cancelled').length})`,
      icon: <Package size={15} />,
    },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: <Heart size={15} /> },
    {
      id: 'addresses',
      label: `Addresses (${addresses.length})`,
      icon: <MapPin size={15} />,
    },
    { id: 'settings', label: 'Settings', icon: <Settings size={15} /> },
  ];

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f2f4f8]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {profile.avatar || user.photoURL ? (
                <img
                  src={profile.avatar || user.photoURL || ''}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  {initials}
                </div>
              )}
              <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <Camera size={12} className="text-gray-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 font-[montserrat] truncate">
                  {profile.name || 'My Account'}
                </h1>
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-sm text-gray-500 truncate">
                {profile.email || user.email}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {profile.vip && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-[#FFD700] to-amber-500 text-black px-2 py-0.5 rounded-full">
                    <Star size={9} fill="currentColor" /> VIP Member
                  </span>
                )}
                <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Member since{' '}
                  {new Date(profile.joined).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-[#FFD700] text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Personal Information
                </h3>
                {!isEditingProfile ? (
                  <button
                    onClick={() => {
                      setDraftProfile(profile);
                      setIsEditingProfile(true);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <XCircle size={12} /> Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-1 text-xs font-bold text-white bg-gray-900 hover:bg-gray-800 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Save size={12} /> Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field
                  icon={<User size={13} />}
                  label="Full Name"
                  value={isEditingProfile ? draftProfile.name : profile.name}
                  editable={isEditingProfile}
                  onChange={(v) => setDraftProfile({ ...draftProfile, name: v })}
                />
                <Field
                  icon={<Mail size={13} />}
                  label="Email"
                  value={isEditingProfile ? draftProfile.email : profile.email}
                  editable={isEditingProfile}
                  onChange={(v) => setDraftProfile({ ...draftProfile, email: v })}
                />
                <Field
                  icon={<Phone size={13} />}
                  label="Phone"
                  value={isEditingProfile ? draftProfile.phone : profile.phone}
                  editable={isEditingProfile}
                  onChange={(v) => setDraftProfile({ ...draftProfile, phone: v })}
                />
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Account Status
                    </p>
                    <p className="text-xs font-semibold text-gray-800">
                      Verified · Premium
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <StatCard label="Active Orders" value={orders.filter((o) => o.status !== 'Cancelled').length} icon={<Truck size={14} />} />
                <StatCard
                  label="Wishlist"
                  value={wishlist.length}
                  icon={<Heart size={14} />}
                />
                <StatCard
                  label="Reward Points"
                  value="1,240"
                  icon={<Star size={14} />}
                />
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-4 flex items-center justify-between mt-4">
                <div>
                  <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                    VIP Reward
                  </p>
                  <p className="text-sm font-bold mt-0.5">
                    Spend ৳760 more for Gold Tier
                  </p>
                  <div className="w-40 bg-white/20 rounded-full h-1.5 mt-2 overflow-hidden">
                    <div className="bg-[#FFD700] h-full rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
                <CreditCard size={32} className="text-amber-300 shrink-0" />
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-2.5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={order.thumbnail}
                      alt=""
                      className="w-12 h-14 object-cover rounded-lg border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-gray-900">#{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}{' '}
                            · {order.items} items
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-lg font-bold text-gray-900 font-[montserrat]">
                          ৳{order.total.toLocaleString()}
                        </p>
                        <button
                          onClick={() => navigate('/track-order')}
                          className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
                        >
                          Track <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
                  <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                    <Heart size={24} />
                  </div>
                  <p className="text-sm font-bold text-gray-800 mb-1">Your wishlist is empty</p>
                  <p className="text-xs text-gray-500 mb-4">Save items you love for later.</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {wishlist.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden group"
                    >
                      <div className="relative aspect-[3/4] bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {!item.inStock && (
                          <span className="absolute top-2 left-2 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded">
                            OUT OF STOCK
                          </span>
                        )}
                        <button
                          onClick={() => handleRemoveWishlist(item.id)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm cursor-pointer"
                          aria-label="Remove"
                        >
                          <Heart size={12} className="text-red-500" fill="currentColor" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                          ৳{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        {addressIcon(addr.label)} {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemoveAddress(addr.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Delete address"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <p className="text-sm font-bold text-gray-900 mt-2">{addr.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{addr.street}</p>
                  <p className="text-xs text-gray-600">{addr.city}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Phone size={11} /> {addr.phone}
                  </p>
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="mt-2 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                    >
                      Set as default
                    </button>
                  )}
                </div>
              ))}

              {isAddingAddress ? (
                <div className="bg-white border-2 border-amber-300 rounded-xl p-4 space-y-2.5">
                  <div className="flex gap-1.5">
                    {(['Home', 'Office', 'Other'] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setDraftAddress({ ...draftAddress, label: l })}
                        className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                          draftAddress.label === l
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                  <input
                    placeholder="Recipient name"
                    value={draftAddress.name}
                    onChange={(e) => setDraftAddress({ ...draftAddress, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <input
                    placeholder="Street address"
                    value={draftAddress.street}
                    onChange={(e) => setDraftAddress({ ...draftAddress, street: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <input
                    placeholder="City, postcode, country"
                    value={draftAddress.city}
                    onChange={(e) => setDraftAddress({ ...draftAddress, city: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <input
                    placeholder="Phone"
                    value={draftAddress.phone}
                    onChange={(e) => setDraftAddress({ ...draftAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftAddress.isDefault}
                      onChange={(e) => setDraftAddress({ ...draftAddress, isDefault: e.target.checked })}
                      className="rounded text-amber-500 focus:ring-amber-300"
                    />
                    Set as default address
                  </label>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddAddress}
                      className="flex-1 text-xs font-bold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-1"
                    >
                      <Save size={12} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full flex items-center justify-center gap-1.5 bg-white border-2 border-dashed border-gray-200 hover:border-amber-300 text-gray-600 hover:text-amber-700 text-sm font-semibold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  <Plus size={16} /> Add New Address
                </button>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-3">
              <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
                {([
                  { key: 'orderUpdates', label: 'Order Updates', desc: 'Status changes via email' },
                  { key: 'promotions', label: 'Promotions & Offers', desc: 'Deals and discounts' },
                  { key: 'newsletter', label: 'Newsletter', desc: 'New arrivals & style tips' },
                  { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Delivery updates via SMS' },
                ] as const).map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between gap-3 p-4 cursor-pointer hover:bg-gray-50/50"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
                      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 cursor-pointer ${
                        prefs[item.key] ? 'bg-amber-400' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                          prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Language</p>
                    <p className="text-xs text-gray-500">English (Bangladesh)</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Currency</p>
                    <p className="text-xs text-gray-500">BDT (৳)</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50">
                  <div>
                    <p className="text-sm font-bold text-gray-900">Privacy & Security</p>
                    <p className="text-xs text-gray-500">Manage your data</p>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 hover:bg-red-50 border border-red-100 py-3 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  editable,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editable: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="p-3 bg-gray-50 rounded-xl">
      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1 flex items-center gap-1">
        {icon} {label}
      </p>
      {editable ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-white px-2 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      ) : (
        <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
      <div className="w-8 h-8 mx-auto rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mb-1.5">
        {icon}
      </div>
      <p className="text-base font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500 font-medium">{label}</p>
    </div>
  );
}
