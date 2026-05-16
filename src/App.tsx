// npm install framer-motion lenis @studio-freight/lenis
import {
  AnimatePresence,
  MotionConfig,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform
} from "framer-motion";
import Lenis from "lenis";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cookie,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  Music,
  Plus,
  ShoppingBag,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function InstagramIcon({ size = 18, strokeWidth = 1.8 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ASSETS = {
  logo: "https://i.ibb.co.com/kVD1LN40/logo.png",
  qris: "https://i.ibb.co.com/0RdL6gnH/qris.png",
  shopeepay: "https://i.ibb.co.com/PvHJn1bq/shopeepay.png",
  gopay: "https://i.ibb.co.com/B29tNDR0/gopay.png",
  ovo: "https://i.ibb.co.com/qMr53Z0V/ovo.png",
  original: "https://i.ibb.co.com/fdC6M18T/original.jpg",
  smores: "https://i.ibb.co.com/bg7Mv0BN/snores.jpg",
  redVelvet: "https://i.ibb.co.com/fjrhY4Q/red-velvet.jpg",
  heroVideo: "https://player.mux.com/ny4Zo4BC9HsGSu6ktQh1Jla01rPdNB80000VFYXSXgiwWI"
};

const HERO_POSTER =
  "https://image.mux.com/ny4Zo4BC9HsGSu6ktQh1Jla01rPdNB80000VFYXSXgiwWI/thumbnail.jpg?time=1&width=1800";

const PRODUCTS = [
  {
    id: 1,
    name: "Original",
    price: 15000,
    image: ASSETS.original,
    description: "GOMU's Signature Original Cookie: classic, warm, addictive."
  },
  {
    id: 2,
    name: "Smores",
    price: 18000,
    image: ASSETS.smores,
    description: "Campfire-inspired layers of chocolate, marshmallow, and graham."
  },
  {
    id: 3,
    name: "Red Velvet",
    price: 20000,
    image: ASSETS.redVelvet,
    description: "Velvety richness with a whisper of cocoa and cream cheese."
  }
];

const formatPrice = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
const WHATSAPP_NUMBER = "6281370380333";

type CartItem = { productId: number; quantity: number };
type Page = "home" | "checkout";
type PaymentMethod = "QRIS" | "ShopeePay" | "GoPay" | "OVO";
type Product = (typeof PRODUCTS)[number];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const DRAWER_EASE = [0.32, 0.72, 0, 1] as const;

const paymentMethods: Array<{ id: PaymentMethod; label: string; image: string }> = [
  { id: "QRIS", label: "QRIS", image: ASSETS.qris },
  { id: "ShopeePay", label: "ShopeePay", image: ASSETS.shopeepay },
  { id: "GoPay", label: "GoPay", image: ASSETS.gopay },
  { id: "OVO", label: "OVO", image: ASSETS.ovo }
];

const navItems = [
  { label: "Home", id: "home" },
  { label: "Menu", id: "menu" },
  { label: "Our Story", id: "story" },
  { label: "FAQ", id: "faq" }
];

const faqs = [
  {
    question: "Bagaimana cara menyimpan cookies?",
    answer:
      "Simpan dalam wadah kedap udara di suhu ruangan. Tahan hingga 5 hari, tapi biasanya habis lebih dulu."
  },
  {
    question: "Area pengiriman?",
    answer: "Kami melayani seluruh Jabodetabek: Jakarta, Bogor, Depok, Tangerang, dan Bekasi."
  },
  {
    question: "Bisa untuk hampers atau event?",
    answer: "Bisa. Kami menerima pesanan custom dan bulk order. Chat kami via WhatsApp untuk info lebih lanjut."
  },
  {
    question: "Minimum order?",
    answer: "Tidak ada minimum order. Order 1 box pun kami layani dengan sepenuh hati."
  },
  {
    question: "Apakah ada varian baru?",
    answer: "Kami rutin mengeluarkan limited editions. Follow Instagram kami untuk info terbaru."
  }
];

function productFromCartItem(item: CartItem) {
  return PRODUCTS.find((product) => product.id === item.productId)!;
}

function MagneticButton({
  children,
  className,
  onClick,
  disabled,
  type = "button",
  ariaLabel
}: {
  children: React.ReactNode;
  className: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.35 });
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.35 });

  const handleMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || !window.matchMedia("(pointer: fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    rawX.set((event.clientX - rect.left - rect.width / 2) * 0.16);
    rawY.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  };

  const reset = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const counter = useMotionValue(0);
  const rounded = useTransform(counter, (latest) => `${Math.round(latest).toLocaleString("id-ID")}${suffix}`);

  useEffect(() => {
    if (!isInView) return undefined;
    const controls = animate(counter, value, { duration: 1.4, ease: EASE_OUT });
    return () => controls.stop();
  }, [counter, isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

function LoadingScreen({ isLoading }: { isLoading: boolean }) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#202A36]"
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
        >
          <motion.img
            src={ASSETS.logo}
            alt="GOMU Cookies logo"
            className="h-24 w-24 rounded-full object-contain shadow-[0_24px_80px_rgba(253,235,208,0.18)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          />
          <motion.h1
            className="font-display mt-7 text-4xl font-semibold text-white"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE_OUT }}
          >
            GOMU Cookies
          </motion.h1>
          <motion.p
            className="mt-3 text-sm font-medium uppercase tracking-[0.25em] text-white/60"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: EASE_OUT }}
          >
            Goodies &amp; Munchies
          </motion.p>
          <div className="absolute bottom-0 left-0 right-0 h-px origin-left bg-white/20">
            <motion.div
              className="h-full origin-left bg-white"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Navbar({
  scrolled,
  currentPage,
  cartCount,
  mobileMenuOpen,
  setMobileMenuOpen,
  setIsCartOpen,
  goToSection
}: {
  scrolled: boolean;
  currentPage: Page;
  cartCount: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  goToSection: (id: string) => void;
}) {
  const solid = scrolled || currentPage === "checkout" || mobileMenuOpen;
  const textColor = solid ? "text-[#202A36]" : "text-white";
  const navClass = solid
    ? "border-black/5 bg-white/85 shadow-sm shadow-[#202A36]/5 backdrop-blur-xl"
    : "border-transparent bg-transparent";

  return (
    <header className={`fixed left-0 right-0 top-0 z-50 border-b transition-all duration-500 ${navClass}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
        <button
          type="button"
          onClick={() => goToSection("home")}
          className={`group flex items-center gap-3 ${textColor}`}
          aria-label="Go to home"
        >
          <img src={ASSETS.logo} alt="GOMU Cookies logo" className="h-9 w-9 rounded-full object-contain" />
          <span className="text-lg font-semibold tracking-[-0.01em]">GOMU Cookies</span>
        </button>

        <div className={`hidden items-center gap-8 md:flex ${textColor}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSection(item.id)}
              className="group relative text-sm font-medium tracking-wide transition-opacity hover:opacity-75"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
            </button>
          ))}
        </div>

        <div className={`flex items-center gap-2 ${textColor}`}>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative rounded-full p-2 transition-transform duration-200 active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && (
              <span
                className={`absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold ${
                  solid ? "bg-[#202A36] text-white" : "bg-white text-[#202A36]"
                }`}
              >
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-full p-2 transition-transform duration-200 active:scale-95 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} strokeWidth={1.8} /> : <Menu size={22} strokeWidth={1.8} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mx-4 mb-4 overflow-hidden rounded-2xl border border-black/5 bg-white/95 shadow-2xl shadow-[#202A36]/10 backdrop-blur-lg md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
          >
            <div className="flex flex-col gap-2 p-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => goToSection(item.id)}
                  className="rounded-xl px-1 py-2 text-left text-base font-semibold text-[#202A36]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.24, ease: EASE_OUT }}
                >
                  {item.label}
                </motion.button>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-[#202A36] px-5 py-3 text-sm font-semibold text-white transition-transform duration-200 active:scale-95"
              >
                <MessageCircle size={17} strokeWidth={1.8} />
                Order via WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ goToSection, videoFailed, setVideoFailed }: { goToSection: (id: string) => void; videoFailed: boolean; setVideoFailed: React.Dispatch<React.SetStateAction<boolean>> }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 90]);
  const scale = useTransform(scrollY, [0, 800], [1.05, 1.12]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.12 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE_OUT } }
  };

  return (
    <section id="home" className="relative min-h-[92dvh] overflow-hidden md:min-h-[94dvh]">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <div className="absolute inset-0 bg-[#202A36]">
          <img src={HERO_POSTER} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
          <img src={ASSETS.original} alt="" className="absolute left-0 top-0 hidden h-full w-1/2 object-cover opacity-20 blur-sm sm:block" />
          <img src={ASSETS.redVelvet} alt="" className="absolute right-0 top-0 hidden h-full w-1/2 object-cover opacity-15 blur-sm sm:block" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#202A36]/72 via-[#3A2010]/40 to-[#1A0A00]/72" />
        </div>
        {!videoFailed && (
          <video
            src="https://stream.mux.com/ny4Zo4BC9HsGSu6ktQh1Jla01rPdNB80000VFYXSXgiwWI.m3u8"
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 hidden h-full w-full object-cover md:block"
          />
        )}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
      <div className="grain-overlay absolute inset-0 opacity-[0.03]" />

      <motion.div
        className="relative z-10 flex min-h-[92dvh] flex-col items-center justify-center px-6 pb-12 pt-24 text-center text-white md:min-h-[94dvh]"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={item}
          className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm"
        >
          Goodies &amp; Munchies
        </motion.p>
        <motion.h1 variants={item} className="font-display mt-8 text-[clamp(4.4rem,13vw,10.5rem)] font-light leading-[0.82] tracking-[-0.04em] text-white/60">
          Pure Joy.
        </motion.h1>
        <motion.h2 variants={item} className="font-display -mt-3 text-[clamp(4rem,12vw,10rem)] font-semibold leading-[0.86] tracking-[-0.04em] text-white md:-mt-7">
          Freshly Baked.
        </motion.h2>
        <motion.p variants={item} className="mt-7 max-w-sm text-base leading-relaxed text-white/72 md:text-lg">
          Your daily dose of happiness, delivered fresh.
        </motion.p>
        <motion.div variants={item} className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <MagneticButton
            onClick={() => goToSection("menu")}
            className="rounded-full border border-white/40 bg-white/10 px-7 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-sm transition-colors duration-300 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            Explore Menu
          </MagneticButton>
          <MagneticButton
            onClick={() => goToSection("menu")}
            className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#202A36] shadow-lg shadow-black/10 transition-colors duration-300 hover:bg-[#FFF8F3] focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Order Now
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        aria-label="Scroll to menu"
        onClick={() => goToSection("menu")}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-white/50"
        animate={{ y: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </motion.button>
    </section>
  );
}

function MarqueeStrip() {
  const copy = "GOODIES & MUNCHIES  /  FRESHLY BAKED  /  DELIVERED FRESH  /  HANDCRAFTED WITH LOVE  /  ";

  return (
    <div className="overflow-hidden bg-[#202A36] py-3">
      <div className="marquee-track whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] text-white">
        <span>{copy}</span>
        <span>{copy}</span>
        <span>{copy}</span>
        <span>{copy}</span>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A8A8A]">{children}</p>;
}

function ProductGallery({ addToCart }: { addToCart: (productId: number) => void }) {
  return (
    <section id="menu" className="mx-auto max-w-6xl px-6 py-24">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.65, ease: EASE_OUT }}
      >
        <SectionLabel>Our Menu</SectionLabel>
        <h2 className="font-display mt-3 text-4xl font-light leading-tight text-[#202A36] md:text-6xl">Crafted for the Moment.</h2>
        <p className="mt-3 text-base text-[#8A8A8A]">Three signatures. One obsession.</p>
      </motion.div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
        {PRODUCTS.map((product, index) => (
          <motion.article
            key={product.id}
            className="group overflow-hidden rounded-3xl bg-white shadow-sm shadow-[#202A36]/5 transition-shadow duration-500 hover:shadow-xl hover:shadow-[#202A36]/10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.62, delay: index * 0.1, ease: EASE_OUT }}
            whileHover={{ scale: 1.012 }}
          >
            <div className="overflow-hidden">
              <img
                src={product.image}
                alt={`${product.name} cookie by GOMU Cookies`}
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-2xl font-semibold text-[#202A36]">{product.name}</h3>
              <p className="mt-1 min-h-[3.25rem] text-sm leading-relaxed text-[#8A8A8A]">{product.description}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-lg font-bold text-[#202A36]">{formatPrice(product.price)}</p>
                <MagneticButton
                  onClick={() => addToCart(product.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#202A36] px-5 py-2 text-sm font-medium text-white transition-colors duration-300 hover:bg-[#1A2229] focus:outline-none focus:ring-2 focus:ring-[#202A36]/20"
                >
                  <Plus size={14} strokeWidth={2} />
                  Add to Cart
                </MagneticButton>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section id="story" className="overflow-hidden py-24">
      <div className="grid gap-12 md:grid-cols-2">
        <motion.div
          className="flex flex-col justify-center px-8 md:px-16 lg:pl-[10vw]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <SectionLabel>Our Story</SectionLabel>
          <h2 className="font-display mt-3 max-w-lg text-4xl font-light leading-tight text-[#202A36] md:text-5xl">
            Born from a love of perfect moments.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-[1.9] text-[#686868]">
            GOMU Cookies was born from a simple belief: that the best moments in life are often the sweetest ones. We source only premium ingredients and bake every batch with intention, warmth, and a whole lot of love.
          </p>
          <p className="mt-4 max-w-xl text-base leading-[1.9] text-[#686868]">
            Available across Jabodetabek, we bring that joy directly to your door, one perfect cookie at a time.
          </p>
          <blockquote className="font-display mt-8 border-l-2 border-[#FDEBD0] pl-5 text-2xl italic leading-snug text-[#202A36]">
            Every bite is a little celebration.
          </blockquote>
        </motion.div>

        <div className="relative flex min-h-[480px] items-center justify-center px-8 md:min-h-[620px]">
          <motion.div
            className="absolute h-80 w-80 translate-x-8 translate-y-8 rounded-full bg-[#FDEBD0]/45 md:h-[26rem] md:w-[26rem]"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          />
          <motion.img
            src={ASSETS.logo}
            alt="GOMU Cookies emblem"
            className="relative z-10 h-56 w-56 rounded-full bg-[#FDEBD0] object-contain p-8 shadow-[0_28px_80px_rgba(32,42,54,0.12)] md:h-72 md:w-72"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-8 top-8 z-20 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-[#202A36] shadow-lg shadow-[#202A36]/10 md:right-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Check size={15} strokeWidth={2} />
            100% Halal
          </motion.div>
          <motion.div
            className="absolute bottom-8 left-8 z-20 flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-semibold text-[#202A36] shadow-lg shadow-[#202A36]/10 md:left-20"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cookie size={15} strokeWidth={1.8} />
            Made Fresh Daily
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SocialProofStrip() {
  const stats = [
    { value: <><CountUp value={500} suffix="+" /></>, label: "Happy Customers" },
    { value: "Jabodetabek", label: "Free Delivery" },
    { value: <><CountUp value={100} suffix="%" /></>, label: "Certified" }
  ];

  return (
    <section className="bg-[#202A36] px-6 py-16">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 text-center md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center md:gap-8">
        {stats.map((stat, index) => (
          <div key={stat.label} className="contents">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08, ease: EASE_OUT }}
            >
              <p className="font-display text-5xl font-light text-white">{stat.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-widest text-white/50">{stat.label}</p>
            </motion.div>
            {index < stats.length - 1 && <div className="hidden text-3xl text-white/20 md:block">/</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection({
  openFaq,
  setOpenFaq
}: {
  openFaq: number | null;
  setOpenFaq: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <motion.h2
        className="font-display text-center text-4xl font-light leading-tight text-[#202A36] md:text-5xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: EASE_OUT }}
      >
        Questions? We've got answers.
      </motion.h2>

      <div className="mt-12">
        {faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div key={faq.question} className="border-b border-[#202A36]/10 py-5">
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="flex w-full cursor-pointer items-center justify-between gap-5 text-left text-base font-semibold text-[#202A36]"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22, ease: EASE_OUT }}>
                  {isOpen ? <Minus size={18} strokeWidth={1.8} /> : <Plus size={18} strokeWidth={1.8} />}
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE_OUT }}
                    className="overflow-hidden"
                  >
                    <p className="max-w-2xl pt-4 text-sm leading-relaxed text-[#686868]">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="bg-[#FFF8F3] px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.62, ease: EASE_OUT }}
      >
        <h2 className="font-display text-4xl font-light text-[#202A36] md:text-5xl">Find Us Here</h2>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-[#8A8A8A]">
          Stay updated on new flavors, limited drops, and behind-the-scenes baking.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <InstagramIcon size={18} strokeWidth={1.8} />
            Instagram
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#202A36] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <Music size={18} strokeWidth={1.8} />
            TikTok
          </motion.a>
          <motion.a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-shadow duration-300 hover:shadow-md"
          >
            <MessageCircle size={18} strokeWidth={1.8} />
            WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}

function FloatingWhatsApp({ currentPage }: { currentPage: Page }) {
  if (currentPage === "checkout") return null;

  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/25"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
      aria-label="Order via WhatsApp"
    >
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-[#202A36] px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-2">
        Order via WhatsApp
      </span>
      <MessageCircle size={24} strokeWidth={1.8} />
    </motion.a>
  );
}

function CartDrawer({
  cart,
  isCartOpen,
  setIsCartOpen,
  updateQty,
  removeFromCart,
  cartTotal,
  setCurrentPage,
  goToSection
}: {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateQty: (productId: number, delta: number) => void;
  removeFromCart: (productId: number) => void;
  cartTotal: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
  goToSection: (id: string) => void;
}) {
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            onClick={() => setIsCartOpen(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl shadow-[#202A36]/20"
            initial={{ transform: "translateX(100%)" }}
            animate={{ transform: "translateX(0%)" }}
            exit={{ transform: "translateX(100%)" }}
            transition={{ duration: 0.42, ease: DRAWER_EASE }}
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-6">
              <h2 className="font-display text-2xl font-semibold text-[#202A36]">Your Cart</h2>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="rounded-full p-2 text-[#202A36] transition-transform duration-200 active:scale-95"
                aria-label="Close cart"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <ShoppingBag size={42} strokeWidth={1.5} className="text-gray-200" />
                <p className="font-display mt-5 text-2xl font-light text-[#202A36]">Nothing here yet.</p>
                <p className="mt-2 text-sm leading-relaxed text-[#8A8A8A]">Choose a signature cookie and we will keep your order ready here.</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    goToSection("menu");
                  }}
                  className="mt-6 rounded-full bg-[#202A36] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-200 active:scale-95"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto p-6">
                  {cart.map((item) => {
                    const product = productFromCartItem(item);
                    return (
                      <div key={item.productId} className="grid grid-cols-[56px_1fr] gap-4">
                        <img src={product.image} alt={product.name} className="h-14 w-14 rounded-xl object-cover shadow-sm" />
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="text-sm font-semibold text-[#202A36]">{product.name}</h3>
                              <p className="mt-0.5 line-clamp-1 text-xs text-[#8A8A8A]">{product.description}</p>
                            </div>
                            <p className="whitespace-nowrap text-sm font-semibold text-[#202A36]">{formatPrice(product.price)}</p>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-sm font-medium transition-colors hover:border-[#202A36]"
                                aria-label={`Decrease ${product.name} quantity`}
                              >
                                <Minus size={13} strokeWidth={1.8} />
                              </button>
                              <span className="w-5 text-center text-sm font-semibold text-[#202A36]">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(product.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-sm font-medium transition-colors hover:border-[#202A36]"
                                aria-label={`Increase ${product.name} quantity`}
                              >
                                <Plus size={13} strokeWidth={1.8} />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product.id)}
                              className="rounded-full p-1.5 text-gray-300 transition-colors hover:text-red-400"
                              aria-label={`Remove ${product.name}`}
                            >
                              <Trash2 size={16} strokeWidth={1.8} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 bg-[#FFF8F3]/80 p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <p className="text-sm font-medium text-[#8A8A8A]">Total</p>
                    <p className="font-display text-2xl font-bold text-[#202A36]">{formatPrice(cartTotal)}</p>
                  </div>
                  <p className="mb-4 text-xs text-[#8A8A8A]">Pengiriman area Jabodetabek</p>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage("checkout");
                      setIsCartOpen(false);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="w-full rounded-2xl bg-[#202A36] py-4 text-sm font-semibold text-white transition-transform duration-200 active:scale-[0.98]"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutPage({
  cart,
  cartTotal,
  name,
  setName,
  address,
  setAddress,
  phone,
  setPhone,
  paymentMethod,
  setPaymentMethod,
  setCurrentPage,
  setIsCartOpen
}: {
  cart: CartItem[];
  cartTotal: number;
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const canSubmit = cart.length > 0 && name.trim().length > 1 && address.trim().length > 8 && phone.trim().length > 6;

  const buildWhatsAppMessage = () => {
    const lines = cart
      .map((item) => {
        const product = productFromCartItem(item);
        return `- ${product.name} x${item.quantity} = ${formatPrice(product.price * item.quantity)}`;
      })
      .join("\n");

    return encodeURIComponent(
      `Halo GOMU Cookies! Saya ingin memesan:\n\n${lines}\n\nTotal: ${formatPrice(cartTotal)}\n\nData Pengiriman:\nNama: ${name}\nAlamat: ${address}\nNo. HP: ${phone}\nMetode Pembayaran: ${paymentMethod}`
    );
  };

  const inputClass =
    "w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition-all focus:border-[#202A36] focus:ring-2 focus:ring-[#202A36]/10";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-wider text-[#686868]";

  return (
    <motion.main
      key="checkout"
      className="min-h-screen bg-[#FFF8F3] px-6 pb-20 pt-28"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <div className="mx-auto max-w-5xl">
        <button
          type="button"
          onClick={() => {
            setCurrentPage("home");
            setIsCartOpen(true);
          }}
          className="mb-10 flex items-center gap-2 text-sm font-medium text-[#686868] transition-colors hover:text-[#202A36]"
        >
          <ArrowLeft size={17} strokeWidth={1.8} />
          Back to cart
        </button>

        <div>
          <h1 className="font-display text-4xl font-light leading-tight text-[#202A36] md:text-5xl">Complete Your Order</h1>
          <p className="mt-2 text-sm text-[#8A8A8A]">Fill in your details and we'll take it from here.</p>
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          <section aria-label="Customer details">
            <div className="space-y-5">
              <div>
                <label htmlFor="full-name" className={labelClass}>
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  value={name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
                  placeholder="Your full name"
                  className={inputClass}
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="full-address" className={labelClass}>
                  Full Address
                </label>
                <textarea
                  id="full-address"
                  rows={3}
                  value={address}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setAddress(event.target.value)}
                  placeholder="Street, area, city, postal code"
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label htmlFor="phone-number" className={labelClass}>
                  Phone Number
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  value={phone}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPhone(event.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="mt-8">
              <p className={labelClass}>Payment Method</p>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((method) => {
                  const selected = paymentMethod === method.id;
                  return (
                    <label
                      key={method.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-all ${
                        selected ? "border-[#202A36] bg-[#202A36]/5 shadow-sm" : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.id}
                        checked={selected}
                        onChange={() => setPaymentMethod(method.id)}
                        className="sr-only"
                      />
                      <img src={method.image} alt={method.label} className="h-6 w-10 object-contain" />
                      <span className="text-sm font-medium text-[#202A36]">{method.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <a
              href={canSubmit ? `https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}` : undefined}
              aria-disabled={!canSubmit}
              onClick={(event) => {
                if (!canSubmit) event.preventDefault();
              }}
              target="_blank"
              rel="noreferrer"
              className={`mt-8 flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-base font-bold text-white shadow-md transition-all ${
                canSubmit ? "bg-[#25D366] hover:bg-[#1EBE5D]" : "pointer-events-auto bg-[#25D366]/45"
              }`}
            >
              <MessageCircle size={20} strokeWidth={1.8} />
              Send Order via WhatsApp
            </a>
          </section>

          <aside>
            <h2 className="font-display mb-6 text-2xl font-semibold text-[#202A36]">Order Summary</h2>
            <div className="rounded-3xl bg-white p-6 shadow-sm shadow-[#202A36]/5">
              {cart.length === 0 ? (
                <p className="text-sm text-[#8A8A8A]">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => {
                    const product = productFromCartItem(item);
                    return (
                      <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-[#202A36]">{product.name}</p>
                          <p className="mt-1 text-xs text-[#8A8A8A]">
                            {item.quantity} x {formatPrice(product.price)}
                          </p>
                        </div>
                        <p className="font-semibold text-[#202A36]">{formatPrice(product.price * item.quantity)}</p>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="my-4 border-t border-gray-100" />
              <div className="flex items-center justify-between font-bold text-[#202A36]">
                <p>Total</p>
                <p className="text-xl">{formatPrice(cartTotal)}</p>
              </div>
              <p className="mt-3 flex items-center gap-1 text-xs text-[#8A8A8A]">
                <MapPin size={13} strokeWidth={1.8} />
                Pengiriman tersedia untuk Jabodetabek
              </p>
            </div>
          </aside>
        </div>
      </div>
    </motion.main>
  );
}

function Footer() {
  return (
    <footer className="bg-[#202A36] px-6 py-12 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <img src={ASSETS.logo} alt="GOMU Cookies logo" className="h-8 w-8 rounded-full object-contain" />
            <div>
              <p className="text-lg font-semibold">GOMU Cookies</p>
              <p className="mt-0.5 text-xs text-white/40">Goodies &amp; Munchies</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: InstagramIcon, label: "Instagram", href: "#" },
              { icon: Music, label: "TikTok", href: "#" },
              { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}` }
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target={href === "#" ? undefined : "_blank"}
                rel={href === "#" ? undefined : "noreferrer"}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition-colors hover:border-white/60"
              >
                <Icon size={17} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/30">
          &copy; 2025 GOMU Cookies. Handcrafted with love in Jakarta
        </div>
      </div>
    </footer>
  );
}

function HomePage({
  addToCart,
  goToSection,
  openFaq,
  setOpenFaq,
  videoFailed,
  setVideoFailed
}: {
  addToCart: (productId: number) => void;
  goToSection: (id: string) => void;
  openFaq: number | null;
  setOpenFaq: React.Dispatch<React.SetStateAction<number | null>>;
  videoFailed: boolean;
  setVideoFailed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <motion.main
      key="home"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: EASE_OUT }}
    >
      <Hero goToSection={goToSection} videoFailed={videoFailed} setVideoFailed={setVideoFailed} />
      <MarqueeStrip />
      <ProductGallery addToCart={addToCart} />
      <AboutSection />
      <SocialProofStrip />
      <FAQSection openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <ContactSection />
      <Footer />
    </motion.main>
  );
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 2200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 60);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return undefined;
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      wheelMultiplier: 0.9
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);
    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  const addToCart = (productId: number) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.productId === productId);
      return exists
        ? prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item))
        : [...prev, { productId, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => setCart((prev) => prev.filter((item) => item.productId !== productId));

  const updateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => {
        const product = PRODUCTS.find((candidate) => candidate.id === item.productId)!;
        return sum + product.price * item.quantity;
      }, 0),
    [cart]
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const goToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (currentPage !== "home") {
      setCurrentPage("home");
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? "always" : "user"}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');

        :root {
          --font-display: 'Cormorant Garamond', serif;
          --font-body: 'DM Sans', sans-serif;
          --color-dark: #202A36;
          --color-warm: #FFF8F3;
          --color-peach: #FDEBD0;
          --color-muted: #8A8A8A;
          --color-white: #FFFFFF;
          --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
        }

        html {
          background: var(--color-warm);
          color: var(--color-dark);
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          min-width: 320px;
          overflow-x: hidden;
          background: var(--color-warm);
          font-family: var(--font-body);
          text-rendering: geometricPrecision;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        button, a, input, textarea {
          font-family: var(--font-body);
        }

        button, a, label {
          -webkit-tap-highlight-color: transparent;
        }

        .font-display {
          font-family: var(--font-display);
        }

        .grain-overlay {
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        .marquee-track {
          display: inline-flex;
          min-width: 200%;
          animation: marquee 25s linear infinite;
        }

        .marquee-track span {
          padding-right: 2rem;
        }

        @keyframes marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#FFF8F3] text-[#202A36]">
        <LoadingScreen isLoading={isLoading} />
        <Navbar
          scrolled={scrolled}
          currentPage={currentPage}
          cartCount={cartCount}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setIsCartOpen={setIsCartOpen}
          goToSection={goToSection}
        />

        <AnimatePresence mode="wait">
          {currentPage === "home" ? (
            <HomePage
              addToCart={addToCart}
              goToSection={goToSection}
              openFaq={openFaq}
              setOpenFaq={setOpenFaq}
              videoFailed={videoFailed}
              setVideoFailed={setVideoFailed}
            />
          ) : (
            <CheckoutPage
              cart={cart}
              cartTotal={cartTotal}
              name={name}
              setName={setName}
              address={address}
              setAddress={setAddress}
              phone={phone}
              setPhone={setPhone}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              setCurrentPage={setCurrentPage}
              setIsCartOpen={setIsCartOpen}
            />
          )}
        </AnimatePresence>

        <FloatingWhatsApp currentPage={currentPage} />
        <CartDrawer
          cart={cart}
          isCartOpen={isCartOpen}
          setIsCartOpen={setIsCartOpen}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          cartTotal={cartTotal}
          setCurrentPage={setCurrentPage}
          goToSection={goToSection}
        />
      </div>
    </MotionConfig>
  );
}
