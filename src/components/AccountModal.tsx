import { useEffect, useMemo, useState } from 'react';
import {
  X,
  Package,
  Heart,
  MapPin,
  LogOut,
  LogIn,
  CheckCircle,
  User,
  Settings,
  Pencil,
  Camera,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
  Plus,
  Trash2,
  Star,
  Truck,
  Edit3,
  Home,
  Briefcase,
  ChevronRight,
  Save,
  XCircle,
} from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const STORAGE_KEY = 'sb_account_state_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Sadia Rahman',
  email: 'sadia.rahman@example.com',
  phone: '+880 1712 345 678',
  joined: '2024-03-12',
  avatar: '',
  vip: true,
};

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

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

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

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
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

  const [showSignIn, setShowSignIn] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });

  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: true,
  });

  // Hydrate persisted state
  useEffect(() => {
    const data = loadState();
    if (data) {
      if (data.profile) setProfile(data.profile);
      if (typeof data.isAuthenticated === 'boolean')
        setIsAuthenticated(data.isAuthenticated);
      if (data.addresses) setAddresses(data.addresses);
      if (data.wishlist) setWishlist(data.wishlist);
      if (data.prefs) setPrefs(data.prefs);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profile,
          isAuthenticated,
          addresses,
          wishlist,
          prefs,
        }),
      );
    } catch {
      // ignore
    }
  }, [profile, isAuthenticated, addresses, wishlist, prefs]);

  // Escape + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const initials = useMemo(() => {
    return profile.name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [profile.name]);

  if (!isOpen) return null;

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

  const handleSignIn = () => {
    if (!signInData.email) return;
    setIsAuthenticated(true);
    setShowSignIn(false);
    setSignInData({ email: '', password: '' });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setActiveTab('profile');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] z-10 flex flex-col overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 bg-gradient-to-br from-amber-50/60 via-white to-white">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                  {initials}
                </div>
              )}
              {isAuthenticated && (
                <label className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <Camera size={12} className="text-gray-700" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 font-[montserrat] truncate">
                  {isAuthenticated ? profile.name : 'Welcome, Guest'}
                </h3>
                {isAuthenticated && (
                  <CheckCircle size={14} className="text-emerald-600 shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {isAuthenticated ? profile.email : 'Sign in to access your account'}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {isAuthenticated && profile.vip && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gradient-to-r from-[#FFD700] to-amber-500 text-black px-2 py-0.5 rounded-full">
                    <Star size={9} fill="currentColor" /> VIP Member
                  </span>
                )}
                {isAuthenticated && (
                  <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    Member since{' '}
                    {new Date(profile.joined).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-100 bg-white px-2 sm:px-4 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 bg-gray-50/40">
          {!isAuthenticated ? (
            <SignInPanel
              showSignIn={showSignIn}
              setShowSignIn={setShowSignIn}
              data={signInData}
              setData={setSignInData}
              onSignIn={handleSignIn}
              onUseGuest={() => setIsAuthenticated(true)}
            />
          ) : (
            <>
              {activeTab === 'profile' && (
                <ProfilePanel
                  profile={profile}
                  isEditing={isEditingProfile}
                  draft={draftProfile}
                  setDraft={setDraftProfile}
                  onEdit={() => {
                    setDraftProfile(profile);
                    setIsEditingProfile(true);
                  }}
                  onSave={handleSaveProfile}
                  onCancel={handleCancelEdit}
                  orders={orders.filter((o) => o.status !== 'Cancelled').length}
                  wishlistCount={wishlist.length}
                />
              )}
              {activeTab === 'orders' && (
                <OrdersPanel orders={orders} onClose={onClose} />
              )}
              {activeTab === 'wishlist' && (
                <WishlistPanel
                  items={wishlist}
                  onRemove={handleRemoveWishlist}
                  onClose={onClose}
                />
              )}
              {activeTab === 'addresses' && (
                <AddressesPanel
                  addresses={addresses}
                  isAdding={isAddingAddress}
                  draft={draftAddress}
                  setDraft={setDraftAddress}
                  onStartAdd={() => setIsAddingAddress(true)}
                  onCancelAdd={() => setIsAddingAddress(false)}
                  onSave={handleAddAddress}
                  onRemove={handleRemoveAddress}
                  onSetDefault={handleSetDefaultAddress}
                />
              )}
              {activeTab === 'settings' && (
                <SettingsPanel
                  prefs={prefs}
                  setPrefs={setPrefs}
                  onSignOut={handleSignOut}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Sub Panels ---------- */

function SignInPanel({
  showSignIn,
  setShowSignIn,
  data,
  setData,
  onSignIn,
  onUseGuest,
}: {
  showSignIn: boolean;
  setShowSignIn: (v: boolean) => void;
  data: { email: string; password: string };
  setData: (d: { email: string; password: string }) => void;
  onSignIn: () => void;
  onUseGuest: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mb-4">
        <User size={28} />
      </div>
      <h3 className="text-base font-bold text-gray-900 font-[montserrat] mb-1">
        {showSignIn ? 'Welcome Back' : 'Sign in to continue'}
      </h3>
      <p className="text-xs text-gray-500 max-w-xs mb-5">
        {showSignIn
          ? 'Access your orders, wishlist, and saved addresses.'
          : 'Manage your profile, track orders, and save favorites.'}
      </p>

      {showSignIn ? (
        <div className="w-full max-w-xs space-y-2.5">
          <input
            type="email"
            placeholder="Email address"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full px-3.5 py-2.5 text-xs border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
          />
          <button
            onClick={onSignIn}
            className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            onClick={() => setShowSignIn(false)}
            className="text-[11px] text-gray-500 hover:text-gray-800 underline"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <button
            onClick={() => setShowSignIn(true)}
            className="bg-[#FFD700] hover:bg-[#e6c200] text-gray-900 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            onClick={onUseGuest}
            className="border border-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-xs hover:bg-gray-50 transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      )}
    </div>
  );
}

function ProfilePanel({
  profile,
  isEditing,
  draft,
  setDraft,
  onEdit,
  onSave,
  onCancel,
  orders,
  wishlistCount,
}: {
  profile: UserProfile;
  isEditing: boolean;
  draft: UserProfile;
  setDraft: (p: UserProfile) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  orders: number;
  wishlistCount: number;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Personal Information
          </h4>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
            >
              <Pencil size={12} /> Edit
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onCancel}
                className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-800 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <XCircle size={12} /> Cancel
              </button>
              <button
                onClick={onSave}
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
            value={isEditing ? draft.name : profile.name}
            editable={isEditing}
            onChange={(v) => setDraft({ ...draft, name: v })}
          />
          <Field
            icon={<Mail size={13} />}
            label="Email"
            value={isEditing ? draft.email : profile.email}
            editable={isEditing}
            onChange={(v) => setDraft({ ...draft, email: v })}
          />
          <Field
            icon={<Phone size={13} />}
            label="Phone"
            value={isEditing ? draft.phone : profile.phone}
            editable={isEditing}
            onChange={(v) => setDraft({ ...draft, phone: v })}
          />
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <ShieldCheck size={14} className="text-emerald-600" />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                Account Status
              </p>
              <p className="text-xs font-semibold text-gray-800">
                Verified · VIP Tier
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <StatCard label="Active Orders" value={orders} icon={<Truck size={14} />} />
        <StatCard
          label="Wishlist"
          value={wishlistCount}
          icon={<Heart size={14} />}
        />
        <StatCard
          label="Reward Points"
          value="1,240"
          icon={<Star size={14} />}
        />
      </div>

      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-4 flex items-center justify-between">
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
          className="w-full bg-white px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
      ) : (
        <p className="text-xs font-semibold text-gray-800 truncate">{value}</p>
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

function OrdersPanel({
  orders,
  onClose,
}: {
  orders: Order[];
  onClose: () => void;
}) {
  return (
    <div className="space-y-2.5">
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white border border-gray-100 rounded-xl p-3 hover:border-amber-200 transition-colors"
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
                  <p className="text-xs font-bold text-gray-900">#{order.id}</p>
                  <p className="text-[11px] text-gray-500">
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
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-gray-900 font-[montserrat]">
                  ৳{order.total.toLocaleString()}
                </p>
                <button
                  onClick={() => {
                    onClose();
                    window.location.href = '/track-order';
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                >
                  Track <ChevronRight size={11} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistPanel({
  items,
  onRemove,
  onClose,
}: {
  items: WishlistItem[];
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
          <Heart size={24} />
        </div>
        <p className="text-sm font-bold text-gray-800 mb-1">
          Your wishlist is empty
        </p>
        <p className="text-xs text-gray-500 mb-3">
          Save items you love for later.
        </p>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline"
        >
          Browse products
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {items.map((item) => (
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
              onClick={() => onRemove(item.id)}
              className="absolute top-2 right-2 p-1 bg-white/90 hover:bg-white rounded-full shadow-sm cursor-pointer"
              aria-label="Remove"
            >
              <Heart size={12} className="text-red-500" fill="currentColor" />
            </button>
          </div>
          <div className="p-2.5">
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
  );
}

function AddressesPanel({
  addresses,
  isAdding,
  draft,
  setDraft,
  onStartAdd,
  onCancelAdd,
  onSave,
  onRemove,
  onSetDefault,
}: {
  addresses: Address[];
  isAdding: boolean;
  draft: Omit<Address, 'id'>;
  setDraft: (a: Omit<Address, 'id'>) => void;
  onStartAdd: () => void;
  onCancelAdd: () => void;
  onSave: () => void;
  onRemove: (id: string) => void;
  onSetDefault: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <div
          key={addr.id}
          className="bg-white border border-gray-100 rounded-xl p-3.5"
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
              onClick={() => onRemove(addr.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              aria-label="Delete address"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <p className="text-xs font-bold text-gray-900 mt-2">{addr.name}</p>
          <p className="text-xs text-gray-600 mt-0.5">{addr.street}</p>
          <p className="text-xs text-gray-600">{addr.city}</p>
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <Phone size={11} /> {addr.phone}
          </p>
          {!addr.isDefault && (
            <button
              onClick={() => onSetDefault(addr.id)}
              className="mt-2 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
            >
              Set as default
            </button>
          )}
        </div>
      ))}

      {isAdding ? (
        <div className="bg-white border-2 border-amber-300 rounded-xl p-3.5 space-y-2">
          <div className="flex gap-1.5">
            {(['Home', 'Office', 'Other'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setDraft({ ...draft, label: l })}
                className={`flex-1 text-xs font-semibold py-1.5 rounded-lg border transition-colors ${
                  draft.label === l
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
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            placeholder="Street address"
            value={draft.street}
            onChange={(e) => setDraft({ ...draft, street: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            placeholder="City, postcode, country"
            value={draft.city}
            onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <input
            placeholder="Phone"
            value={draft.phone}
            onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
            className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.isDefault}
              onChange={(e) => setDraft({ ...draft, isDefault: e.target.checked })}
              className="rounded text-amber-500 focus:ring-amber-300"
            />
            Set as default address
          </label>
          <div className="flex gap-2 pt-1">
            <button
              onClick={onCancelAdd}
              className="flex-1 text-xs font-semibold py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 text-xs font-bold py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-1"
            >
              <Save size={12} /> Save
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={onStartAdd}
          className="w-full flex items-center justify-center gap-1.5 bg-white border-2 border-dashed border-gray-200 hover:border-amber-300 text-gray-600 hover:text-amber-700 text-xs font-semibold py-3 rounded-xl transition-colors cursor-pointer"
        >
          <Plus size={14} /> Add New Address
        </button>
      )}
    </div>
  );
}

function SettingsPanel({
  prefs,
  setPrefs,
  onSignOut,
}: {
  prefs: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
    smsAlerts: boolean;
  };
  setPrefs: (
    p: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
      smsAlerts: boolean;
    },
  ) => void;
  onSignOut: () => void;
}) {
  const items = [
    { key: 'orderUpdates', label: 'Order Updates', desc: 'Status changes via email' },
    { key: 'promotions', label: 'Promotions & Offers', desc: 'Deals and discounts' },
    { key: 'newsletter', label: 'Newsletter', desc: 'New arrivals & style tips' },
    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Delivery updates via SMS' },
  ] as const;

  return (
    <div className="space-y-3">
      <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
        {items.map((item) => (
          <label
            key={item.key}
            className="flex items-center justify-between gap-3 p-3.5 cursor-pointer hover:bg-gray-50/50"
          >
            <div>
              <p className="text-xs font-bold text-gray-900">{item.label}</p>
              <p className="text-[11px] text-gray-500">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => setPrefs({ ...prefs, [item.key]: !prefs[item.key] })}
              className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 cursor-pointer ${
                prefs[item.key] ? 'bg-amber-400' : 'bg-gray-300'
              }`}
              style={{ width: '2.5rem', height: '1.4rem' }}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  prefs[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </label>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-100">
        <button className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50/50">
          <div>
            <p className="text-xs font-bold text-gray-900">Language</p>
            <p className="text-[11px] text-gray-500">English (Bangladesh)</p>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50/50">
          <div>
            <p className="text-xs font-bold text-gray-900">Currency</p>
            <p className="text-[11px] text-gray-500">BDT (৳)</p>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
        <button className="w-full flex items-center justify-between p-3.5 text-left hover:bg-gray-50/50">
          <div>
            <p className="text-xs font-bold text-gray-900">Privacy & Security</p>
            <p className="text-[11px] text-gray-500">Manage your data</p>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>
      </div>

      <button
        onClick={onSignOut}
        className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-100 py-2.5 rounded-xl transition-colors cursor-pointer"
      >
        <LogOut size={13} /> Log out
      </button>
    </div>
  );
}

// Suppress unused icon warnings
void Edit3;
