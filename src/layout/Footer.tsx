import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
} from 'lucide-react';
import type { SVGProps } from 'react';
import bkashIcon from '../img/bkash-logo.png';
import nagadIcon from '../img/nagad-logo.png';

type SocialIconProps = SVGProps<SVGSVGElement>;

const FacebookIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
  </svg>
);

const InstagramIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.336 3.608 1.311.975.975 1.249 2.242 1.311 3.608.058 1.266.069 1.646.069 4.85s-.011 3.584-.069 4.85c-.062 1.366-.336 2.633-1.311 3.608-.975.975-2.242 1.249-3.608 1.311-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.062-2.633-.336-3.608-1.311-.975-.975-1.249-2.242-1.311-3.608C2.175 15.747 2.163 15.367 2.163 12s.012-3.584.07-4.85c.062-1.366.336-2.633 1.311-3.608C4.519 2.567 5.786 2.293 7.152 2.231 8.418 2.173 8.798 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.902.333 4.14.63a5.876 5.876 0 0 0-2.126 1.384A5.882 5.882 0 0 0 .63 4.14C.333 4.902.131 5.775.072 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.058 1.277.261 2.15.558 2.913a5.89 5.89 0 0 0 1.384 2.126A5.882 5.882 0 0 0 4.14 23.37c.762.297 1.635.499 2.912.558C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c1.277-.058 2.15-.261 2.913-.558a5.898 5.898 0 0 0 2.126-1.384 5.88 5.88 0 0 0 1.384-2.126c.296-.762.499-1.635.558-2.913.058-1.28.071-1.689.071-4.948s-.013-3.668-.071-4.948c-.059-1.277-.262-2.15-.558-2.913a5.89 5.89 0 0 0-1.384-2.126A5.845 5.845 0 0 0 19.86.63c-.762-.297-1.635-.499-2.913-.558C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const TwitterIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
  </svg>
);

const YoutubeIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const TiktokIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.84a8.16 8.16 0 0 0 4.77 1.52V6.93a4.85 4.85 0 0 1-1.84-.24z" />
  </svg>
);

const PaypalIcon = (props: SocialIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="7.056000232696533 3 37.35095977783203 45"
    {...props}
  >
    <g xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#002991"
        d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z"
      />
      <path
        fill="#60CDFF"
        d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z"
      />
      <path
        fill="#008CFF"
        d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z"
      />
    </g>
  </svg>
);

const VisaIcon = (props: SocialIconProps) => (
  <svg
    fill="#1A1F71"
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Visa</title>
    <path d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z" />
  </svg>
);

const MastercardIcon = (props: SocialIconProps) => (
  <svg viewBox="0 0 24 24" aria-hidden {...props}>
    <circle cx="9" cy="12" r="6" fill="#EB001B" />
    <circle cx="15" cy="12" r="6" fill="#F79E1B" />
    <path d="M12 7.2a6 6 0 0 0 0 9.6 6 6 0 0 0 0-9.6z" fill="#FF5F00" />
  </svg>
);

const BkashIcon = ({ className }: { className?: string }) => (
  <img src={bkashIcon} alt="bKash" className={className} />
);

const NagadIcon = ({ className }: { className?: string }) => (
  <img src={nagadIcon} alt="Nagad" className={className} />
);

type FooterLink = { label: string; href: string; tag?: string };

const SHOP_LINKS: FooterLink[] = [
  { label: 'New Arrivals', href: '/shop', tag: 'NEW' },
  { label: 'Borka Collection', href: '/borka' },
  { label: 'Hijab Collection', href: '/hijab' },
  { label: 'Sarees', href: '/shop' },
  { label: 'Abaya', href: '/shop' },
  { label: 'Kurtas', href: '/shop' },
  { label: 'Shrugs', href: '/shop' },
];

const HELP_LINKS: FooterLink[] = [
  { label: 'Track Order', href: '/track-order' },
  { label: 'Shipping Policy', href: '#' },
  { label: 'Returns & Exchanges', href: '#' },
  { label: 'Size Guide', href: '#' },
  { label: 'Care Instructions', href: '#' },
  { label: 'FAQs', href: '#' },
];

const COMPANY_LINKS: FooterLink[] = [
  { label: 'About Us', href: '#' },
  { label: 'Our Story', href: '#' },
  { label: 'Sustainability', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Press', href: '#' },
  { label: 'Contact', href: '#' },
];

const SOCIAL_LINKS = [
  {
    icon: InstagramIcon,
    href: 'https://www.instagram.com/freelancerlaju',
    label: 'Instagram',
  },
  {
    icon: FacebookIcon,
    href: 'https://www.facebook.com/freelancerlaju',
    label: 'Facebook',
  },
  {
    icon: TiktokIcon,
    href: 'https://www.tiktok.com/@freelancerlaju',
    label: 'TikTok',
  },
  {
    icon: TwitterIcon,
    href: 'https://www.twitter.com/freelancerlaju',
    label: 'X',
  },
  {
    icon: YoutubeIcon,
    href: 'https://www.youtube.com/@freelancerlaju',
    label: 'YouTube',
  },
];

const PAYMENT_METHODS = [
  { icon: VisaIcon, label: 'Visa' },
  { icon: MastercardIcon, label: 'Mastercard' },
  { icon: PaypalIcon, label: 'PayPal' },
  { icon: BkashIcon, label: 'bKash' },
  { icon: NagadIcon, label: 'Nagad' },
];

const COLUMNS = [
  { title: 'Shop', links: SHOP_LINKS },
  { title: 'Customer Care', links: HELP_LINKS },
  { title: 'Company', links: COMPANY_LINKS },
];

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-[#0b0b0c] text-gray-300">
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />

      <div className="relative h-1 w-full rounded-top bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-8 lg:gap-8 py-10 sm:py-12 lg:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-serif text-2xl italic tracking-tight text-white hover:opacity-90 transition-opacity"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-gray-900 font-bold not-italic text-lg">
                S
              </span>
              Style Bangla
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Curated ethnic wear for the modern woman. From traditional
              handloom to contemporary silhouettes, we celebrate culture with
              style.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 text-sm">
              <a
                href="#"
                className="group flex items-start gap-2.5 text-gray-400 transition-colors hover:text-amber-300"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  House 12, Road 7, Dhanmondi
                  <br />
                  Dhaka 1205, Bangladesh
                </span>
              </a>
              <a
                href="tel:+88029123456"
                className="group flex items-center gap-2.5 text-gray-400 transition-colors hover:text-amber-300"
              >
                <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                <span>+880 017 123 4567</span>
              </a>
              <a
                href="mailto:support@stylebangla.com"
                className="group flex items-center gap-2.5 text-gray-400 transition-colors hover:text-amber-300"
              >
                <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                <span>support@stylebangla.com</span>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] text-gray-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid wrapper */}
          <div className="sm:col-span-2 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {COLUMNS.map((col) => (
                <div key={col.title}>
                  <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                    {col.title}
                  </h3>
                  <ul className="mt-5 flex flex-col gap-3 text-sm">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.href}
                          className="group inline-flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
                        >
                          <span className="h-px w-0 bg-amber-400 transition-all duration-300 group-hover:w-3" />
                          <span className="transition-transform group-hover:translate-x-0.5">
                            {link.label}
                          </span>
                          {link.tag && (
                            <span className="rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-300">
                              {link.tag}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
              Get in touch
            </h3>
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-white">
                Need styling help?
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Our stylists are online 9am – 9pm BST.
              </p>
              <a
                href="mailto:hello@stylebangla.com"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-300 hover:text-amber-200"
              >
                <Send className="h-3.5 w-3.5" />
                Chat with us
              </a>
            </div>

            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
                Customer hotline
              </p>
              <p className="mt-1 font-serif text-xl italic text-white">16789</p>
              <p className="text-[11px] text-gray-500">
                Toll-free, 7 days/week
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} Style Bangla. All rights
              reserved.
            </p>

            <div className="text-xs text-gray-500">
              Desing and develop by{' '}
              <span className="text-yellow-500">freelancerLaju</span>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
                  We accept
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {PAYMENT_METHODS.map((m) => (
                    <div
                      key={m.label}
                      title={m.label}
                      className="flex h-7 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.04] p-1 text-white/80 transition-colors hover:border-white/20"
                    >
                      <m.icon className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <Link to="#" className="hover:text-amber-300">
                  Privacy
                </Link>
                <span className="h-3 w-px bg-white/10" />
                <Link to="#" className="hover:text-amber-300">
                  Terms
                </Link>
                <span className="h-3 w-px bg-white/10" />
                <Link to="#" className="hover:text-amber-300">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
