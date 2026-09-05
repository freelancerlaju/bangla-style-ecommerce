import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  ArrowRight,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import type { FormEvent } from 'react';

const PERKS = [
  'Exclusive early access to new drops',
  'Members-only offers & 10% off',
  'Personal styling tips',
];

type PopupState =
  | { open: false }
  | {
      open: true;
      status: 'success' | 'error';
      email: string;
      message: string;
    };

function NewsletterPopup({
  popup,
  onClose,
}: {
  popup: PopupState;
  onClose: () => void;
}) {
  if (!popup.open) return null;

  const isSuccess = popup.status === 'success';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-popup-title"
    >
      <button
        type="button"
        aria-label="Close popup"
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl animate-[popIn_320ms_cubic-bezier(0.16,1,0.3,1)]">
        <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />

        <div
          className={`h-1 w-full ${
            isSuccess
              ? 'bg-gradient-to-r from-amber-300 via-[#FED90B] to-amber-300'
              : 'bg-gradient-to-r from-red-400 via-rose-500 to-red-400'
          }`}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative px-7 pt-9 pb-7 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center">
            <div
              className={`relative flex h-20 w-20 items-center justify-center rounded-full ring-1 ${
                isSuccess
                  ? 'bg-gradient-to-br from-[#FED90B] to-amber-500 text-gray-900 ring-amber-300/60 shadow-lg shadow-amber-500/30'
                  : 'bg-gradient-to-br from-red-500 to-rose-600 text-white ring-red-300/30 shadow-lg shadow-red-500/30'
              }`}
            >
              <span
                className={`absolute inset-0 rounded-full ${
                  isSuccess
                    ? 'bg-amber-400/30 animate-[ping_1.6s_ease-out_infinite]'
                    : 'bg-red-400/20 animate-[ping_1.6s_ease-out_infinite]'
                }`}
              />
              {isSuccess ? (
                <Check className="relative h-10 w-10" strokeWidth={3} />
              ) : (
                <X className="relative h-9 w-9" strokeWidth={3} />
              )}
            </div>
          </div>

          <div
            className={`mt-5 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${
              isSuccess
                ? 'border-amber-400/40 bg-amber-50 text-amber-700'
                : 'border-red-400/30 bg-red-50 text-red-700'
            }`}
          >
            {isSuccess ? (
              <>
                <Sparkles className="h-3 w-3" />
                Subscription confirmed
              </>
            ) : (
              <>Almost there</>
            )}
          </div>

          <h3
            id="newsletter-popup-title"
            className="mt-3 font-serif text-2xl italic leading-tight text-gray-900 sm:text-3xl"
          >
            {isSuccess ? "You're on the list!" : 'Email required'}
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-gray-600">
            {popup.message}
          </p>

          {isSuccess && (
            <div className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs text-gray-700">
              <Mail className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span className="truncate font-medium">{popup.email}</span>
              <span className="h-3 w-px bg-gray-200" />
              <span className="text-amber-700">Verified</span>
            </div>
          )}

          {isSuccess && (
            <ul className="mt-5 flex flex-col gap-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-3 text-left">
              {PERKS.slice(0, 3).map((perk) => (
                <li
                  key={perk}
                  className="flex items-center gap-2.5 text-xs text-gray-700"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50"
            >
              {isSuccess ? 'Keep browsing' : 'Try again'}
            </button>
            {isSuccess ? (
              <Link
                to="/shop"
                onClick={onClose}
                className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FED90B] px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400 hover:shadow-amber-500/40"
              >
                Shop the collection
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#FED90B] px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-400"
              >
                Got it
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [popup, setPopup] = useState<PopupState>({ open: false });

  useEffect(() => {
    if (!popup.open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopup({ open: false });
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = window.setTimeout(() => {
      setPopup({ open: false });
    }, 6000);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
    };
  }, [popup.open]);

  const closePopup = () => setPopup({ open: false });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setPopup({
        open: true,
        status: 'error',
        email: '',
        message: 'Please enter your email address before subscribing.',
      });
      return;
    }
    setEmail('');
    setPopup({
      open: true,
      status: 'success',
      email: trimmed,
      message: `Welcome aboard! A confirmation email is on its way to ${trimmed}.`,
    });
  };

  return (
    <section className="relative w-full bg-[#f2f4f8] overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative my-10 overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:my-14 sm:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <h2 className="mt-4 font-serif text-3xl italic leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Get <span className="text-amber-600">10% off</span> your first
                order.
              </h2>
              <p className="mt-3 max-w-md text-sm text-gray-600 sm:text-base">
                Be the first to know about new collections, exclusive launches
                and members-only offers.
              </p>

              <ul className="mt-5 flex flex-col gap-2 text-sm text-gray-700">
                {PERKS.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <label
                  htmlFor="newsletter-email"
                  className="mb-2 block px-2 text-xs font-medium text-gray-600"
                >
                  Email address
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail className="absolute top-1/2 -translate-y-1/2 left-3.5 h-4 w-4 text-gray-400" />
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 focus:outline-none transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FED90B] px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-all duration-200 hover:bg-amber-400 active:scale-[0.98] hover:cursor-pointer"
                  >
                    Subscribe
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
                <p className="mt-3 px-2 text-[11px] text-gray-500">
                  By subscribing you agree to our{' '}
                  <Link
                    to="#"
                    className="underline underline-offset-2 hover:text-amber-700"
                  >
                    Privacy Policy
                  </Link>
                  . Unsubscribe anytime.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <NewsletterPopup popup={popup} onClose={closePopup} />
    </section>
  );
}
