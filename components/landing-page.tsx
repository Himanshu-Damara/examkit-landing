"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleCheck,
  Command,
  Download,
  ExternalLink,
  Globe2,
  Github,
  Layers3,
  Menu,
  MousePointer2,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { downloadConfigured, listingConfigured, siteConfig } from "@/lib/site-config";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Installation", href: "#installation" },
  { label: "FAQ", href: "#faq" },
];

const features = [
  {
    number: "01",
    icon: Layers3,
    title: "A browser-first layer",
    description: "ExamKit is designed for the place you already work: the browser.",
    accent: "violet",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Quietly considered",
    description: "A focused product surface that keeps the experience clear and out of your way.",
    accent: "cyan",
  },
  {
    number: "03",
    icon: Globe2,
    title: "Edge-ready delivery",
    description: "When the listing is live, install ExamKit directly through Microsoft Edge Add-ons.",
    accent: "violet",
  },
  {
    number: "04",
    icon: Zap,
    title: "Made by OMEN",
    description: "A small, intentional extension experience with a sharp visual point of view.",
    accent: "cyan",
  },
];

const installSteps = [
  { step: "01", title: "Open Microsoft Edge", text: "Start in the browser where ExamKit is distributed." },
  { step: "02", title: "Open the official listing", text: "Use the ExamKit Edge Add-ons page when the listing URL is configured." },
  { step: "03", title: "Select “Get”", text: "Choose Get on the official Microsoft listing." },
  { step: "04", title: "Approve the install", text: "Confirm the browser prompt to add ExamKit." },
  { step: "05", title: "Start using ExamKit", text: "Find the extension in your Edge toolbar and get going." },
];

const faqs = [
  {
    question: "What is ExamKit?",
    answer:
      "ExamKit is a browser extension by OMEN. This landing page keeps the product description intentionally focused until the extension's verified listing or README provides more detailed feature information.",
  },
  {
    question: "How do I install ExamKit?",
    answer:
      "Open Microsoft Edge, visit the official ExamKit Edge Add-ons listing, click Get, and approve the installation prompt. The destination is configurable and is not enabled until the real listing URL is supplied.",
  },
  {
    question: "Is ExamKit free?",
    answer:
      "Pricing is not documented in the project currently available, so this page does not make a pricing claim. Add verified pricing copy here once the official listing or product documentation is ready.",
  },
  {
    question: "Which browsers are supported?",
    answer:
      "The requested distribution flow is for Microsoft Edge through Edge Add-ons. Support for other browsers is not documented in the available project materials.",
  },
  {
    question: "How do I update ExamKit?",
    answer:
      "Updates are expected to follow the Microsoft Edge Add-ons distribution flow. Exact update behavior is not documented in the project materials available for this landing page.",
  },
];

function LogoMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`logo-mark ${small ? "logo-mark-small" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

function InstallLink({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (!listingConfigured) {
    return (
      <span
        aria-disabled="true"
        title="Set NEXT_PUBLIC_EXAMKIT_LISTING_URL to enable this link"
        className={`${className} cursor-not-allowed opacity-60`}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }

  return (
    <a className={className} href={siteConfig.listingUrl} target="_blank" rel="noreferrer" onClick={onClick}>
      {children}
    </a>
  );
}

function DownloadLink({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (!downloadConfigured) {
    return (
      <span
        aria-disabled="true"
        title="Set NEXT_PUBLIC_EXAMKIT_DOWNLOAD_URL to enable this link"
        className={`${className} cursor-not-allowed opacity-60`}
        onClick={onClick}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      className={className}
      href={siteConfig.downloadUrl}
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      {children}
    </a>
  );
}

function BrowserPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[690px] [perspective:1400px]">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8, rotateY: -8 }}
        animate={{ opacity: 1, y: 0, rotateX: 3, rotateY: -3 }}
        transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="browser-window glass relative overflow-hidden rounded-[24px] p-2"
      >
        <div className="browser-chrome flex items-center gap-3 rounded-[17px] border border-white/[0.08] bg-white/[0.045] px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="browser-dot bg-[#ff6e77]" />
            <span className="browser-dot bg-[#ffd66e]" />
            <span className="browser-dot bg-[#6ef4a8]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-white/[0.07] bg-black/20 px-3 py-1.5 font-mono text-[10px] text-white/35">
            <ShieldCheck size={11} className="text-cyan" />
            <span className="truncate">examkit.local / workspace</span>
          </div>
          <div className="hidden gap-2 text-white/30 sm:flex" aria-hidden="true">
            <span>—</span>
            <span>□</span>
            <span>×</span>
          </div>
        </div>

        <div className="browser-tabs flex gap-1 border-b border-white/[0.08] px-2 pt-2">
          <div className="tab-active flex min-w-0 items-center gap-2 rounded-t-lg border border-b-0 border-white/[0.1] bg-white/[0.06] px-3 py-2 text-[10px] text-white/65">
            <span className="tab-favicon" />
            <span className="truncate">ExamKit / Overview</span>
            <X size={10} className="text-white/30" />
          </div>
          <div className="hidden items-center gap-2 px-3 py-2 text-[10px] text-white/25 sm:flex">
            <span className="tab-favicon tab-favicon-muted" />
            <span>New tab</span>
          </div>
          <div className="ml-auto px-3 py-2 text-white/25">+</div>
        </div>

        <div className="preview-canvas relative overflow-hidden rounded-b-[18px] bg-[#0e0e14] p-4 sm:p-7">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-violet/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-cyan/10 blur-3xl" />
          <div className="relative grid gap-4 sm:grid-cols-[1fr_180px]">
            <div>
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <LogoMark small />
                  <span className="text-xs font-semibold tracking-[0.22em] text-white/70">OMEN / EXAMKIT</span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] text-white/45">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#79f6b1] shadow-[0_0_10px_#79f6b1]" />
                  Ready
                </div>
              </div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-violet">Extension surface</p>
              <h3 className="max-w-[390px] text-2xl font-medium tracking-[-0.05em] text-white/90 sm:text-4xl">
                Access
              </h3>
              <p className="mt-4 max-w-[340px] text-xs leading-6 text-white/40">
                A visual preview of the ExamKit experience. Product behavior lives in the extension itself.
              </p>
              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  ["Focused", "violet"],
                  ["Browser-native", "cyan"],
                  ["OMEN", "violet"],
                ].map(([label, tone]) => (
                  <span
                    key={label}
                    className={`rounded-full border px-3 py-1.5 text-[10px] ${
                      tone === "cyan" ? "border-cyan/20 bg-cyan/[0.06] text-cyan/75" : "border-violet/20 bg-violet/[0.06] text-violet/80"
                    }`}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative hidden min-h-[270px] overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-3 sm:block">
              <div className="mb-6 flex items-center justify-between text-[9px] text-white/35">
                <span>EXAMKIT</span>
                <Command size={12} />
              </div>
              <div className="space-y-2">
                {["Interface", "Workspace", "Preferences"].map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[10px] ${
                      index === 0 ? "border-violet/25 bg-violet/10 text-white/70" : "border-white/[0.06] text-white/30"
                    }`}
                  >
                    <span>{item}</span>
                    <ArrowUpRight size={11} />
                  </div>
                ))}
              </div>
              <div className="absolute bottom-3 left-3 right-3 rounded-xl border border-cyan/15 bg-cyan/[0.05] p-3">
                <div className="mb-2 flex items-center gap-2 text-[9px] text-cyan/70">
                  <CircleCheck size={12} />
                  Extension ready
                </div>
                <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
                <div className="mt-2 h-1.5 w-1/2 rounded-full bg-white/[0.06]" />
              </div>
            </div>
          </div>
          <div className="relative mt-10 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-4">
            {["A clear surface", "No clutter", "Built for Edge"].map((item, index) => (
              <div key={item} className="flex items-center gap-2 text-[10px] text-white/35">
                <span className={`h-1.5 w-1.5 rounded-full ${index === 1 ? "bg-cyan" : "bg-violet"}`} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="preview-shadow absolute -bottom-8 left-[12%] right-[12%] h-16 rounded-full bg-violet/20 blur-3xl" />
      <div className="absolute -right-4 top-[20%] hidden rounded-xl border border-white/10 bg-[#16151e]/80 p-3 shadow-2xl backdrop-blur-xl sm:block">
        <MousePointer2 size={15} className="text-cyan" />
      </div>
    </div>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22 });
  const springY = useSpring(y, { stiffness: 260, damping: 22 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(35);
  const pointerGlow = useMotionTemplate`radial-gradient(circle 360px at ${pointerX}% ${pointerY}%, rgba(155, 123, 255, 0.085), transparent 72%)`;

  function handlePointerMove(event: MouseEvent<HTMLElement>) {
    if (shouldReduceMotion) return;
    pointerX.set((event.clientX / window.innerWidth) * 100);
    pointerY.set((event.clientY / window.innerHeight) * 100);
  }

  return (
    <main
      id="home"
      className="min-h-screen overflow-hidden bg-ink text-white"
      onMouseMove={handlePointerMove}
    >
      <div className="page-noise fixed inset-0 z-50" />
      <motion.div className="pointer-glow pointer-events-none fixed inset-0 z-0" style={{ background: pointerGlow }} />

      <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5" aria-label="Main navigation">
          <a href="#home" className="focus-ring flex items-center gap-3" onClick={() => setMobileOpen(false)}>
            <LogoMark />
            <span className="hidden text-sm font-semibold tracking-[-0.02em] text-white/90 sm:block">
              OMEN <span className="mx-1 text-white/20">/</span> <span className="text-white/45">ExamKit</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="focus-ring nav-link text-xs text-white/45 hover:text-white/90">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {siteConfig.links.github ? (
              <a href={siteConfig.links.github} className="focus-ring rounded-full p-2 text-white/45 transition hover:bg-white/10 hover:text-white" aria-label="Open GitHub">
                <Github size={16} />
              </a>
            ) : null}
            <InstallLink className="focus-ring button-primary rounded-full px-4 py-2.5 text-xs font-semibold text-black">
              <span className="flex items-center gap-2">Access <ArrowUpRight size={14} /></span>
            </InstallLink>
            <DownloadLink className="focus-ring button-secondary rounded-full px-4 py-2.5 text-xs font-medium text-white/75">
              <span className="flex items-center gap-2">Access <Download size={14} /></span>
            </DownloadLink>
          </div>

          <button
            type="button"
            className="focus-ring rounded-full border border-white/10 p-2.5 text-white/75 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((current) => !current)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>
        {mobileOpen ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-3 lg:hidden">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="focus-ring block rounded-xl px-4 py-3 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white">
                {item.label}
              </a>
            ))}
            <InstallLink className="button-primary mt-2 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-black" onClick={() => setMobileOpen(false)}>
              Access <ArrowUpRight size={16} className="ml-2" />
            </InstallLink>
            <DownloadLink className="button-secondary mt-2 flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white/75" onClick={() => setMobileOpen(false)}>
              Access <Download size={16} className="ml-2" />
            </DownloadLink>
          </motion.div>
        ) : null}
      </header>

      <section className="relative isolate flex min-h-[900px] items-center px-5 pb-24 pt-36 sm:px-8 lg:px-12 lg:pb-36 lg:pt-44">
        <div className="hero-grid absolute inset-x-0 top-0 -z-10 h-[720px]" />
        <div className="hero-orb hero-orb-one absolute -left-32 top-28 -z-10 h-96 w-96 rounded-full bg-violet/20 blur-[110px]" />
        <div className="hero-orb hero-orb-two absolute right-[-10%] top-48 -z-10 h-[32rem] w-[32rem] rounded-full bg-cyan/10 blur-[130px]" />
        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <div className="relative z-10 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet/20 bg-violet/10 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.26em] text-violet/80">
              <span className="h-1.5 w-1.5 rounded-full bg-violet shadow-[0_0_12px_#9b7bff]" />
              Access
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="max-w-3xl text-[clamp(3.8rem,6vw,6.4rem)] font-medium leading-[0.88] tracking-[-0.06em] text-white">
              Access
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.22 }} className="mt-8 max-w-xl text-base leading-7 text-white/50 sm:text-lg">
              <span className="font-medium text-white/80">Access</span> is the page view shown here.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.34 }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <InstallLink className="button-primary focus-ring inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black">
                Access <ArrowUpRight size={17} />
              </InstallLink>
              <a href="#features" className="focus-ring button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white">
                Access <ArrowDown size={15} />
              </a>
              <DownloadLink className="focus-ring button-secondary inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/70 hover:text-white">
                Access <Download size={15} />
              </DownloadLink>
            </motion.div>
            <p className="mt-4 text-[11px] text-white/25">
              {listingConfigured ? "Access opens the official Microsoft Edge Add-ons listing." : "Access link is waiting for NEXT_PUBLIC_EXAMKIT_LISTING_URL."} {downloadConfigured ? "Access is available for download." : "Access download is still disabled."}
            </p>
          </div>
          <div className="relative z-10 lg:pl-3">
            <BrowserPreview />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-white/25 lg:flex">
          <span className="h-px w-12 bg-white/15" />
          Access
          <span className="h-px w-12 bg-white/15" />
        </div>
      </section>

      <section id="features" className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="section-kicker">Access</p>
              <h2 className="mt-4 max-w-lg text-4xl font-medium tracking-[-0.06em] text-white sm:text-6xl">Access</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/45 lg:justify-self-end">
              Access is the only visible state for this page.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <TiltCard key={feature.number}>
                  <motion.article initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: index * 0.06 }} className="feature-card group relative overflow-hidden rounded-[28px] border border-white/[0.09] bg-white/[0.03] p-6 sm:p-7">
                    <div className={`feature-glow ${feature.accent === "cyan" ? "feature-glow-cyan" : "feature-glow-violet"}`} />
                    <div className="relative flex items-start justify-between">
                      <div className={`icon-box ${feature.accent === "cyan" ? "icon-box-cyan" : "icon-box-violet"}`}>
                        <Icon size={20} strokeWidth={1.7} />
                      </div>
                      <span className="font-mono text-xs text-white/20">{feature.number}</span>
                    </div>
                    <div className="relative mt-16 max-w-sm">
                      <h3 className="text-xl font-medium tracking-[-0.04em] text-white/90">{feature.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-white/40">{feature.description}</p>
                    </div>
                    <ArrowUpRight size={18} className="absolute bottom-8 right-8 text-white/20 transition duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white/60" />
                  </motion.article>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      <section id="installation" className="relative border-y border-white/[0.07] bg-[#0b0b10] px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <p className="section-kicker">Access</p>
            <h2 className="mt-4 max-w-xl text-4xl font-medium tracking-[-0.06em] text-white sm:text-6xl">Access</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/45">This is the access state for the page.</p>
            <InstallLink className="button-secondary focus-ring mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/75 hover:text-white">
              Access <ExternalLink size={15} />
            </InstallLink>
            <DownloadLink className="button-secondary focus-ring mt-3 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-white/75 hover:text-white">
              Access <Download size={15} />
            </DownloadLink>
          </div>
          <div className="relative">
            <div className="install-line absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-violet/60 via-white/10 to-cyan/50" />
            <div className="space-y-4">
              {installSteps.map((item, index) => (
                <motion.div key={item.step} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.55, delay: index * 0.07 }} className="relative flex gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 sm:p-5">
                  <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${index === 0 ? "border-violet/40 bg-violet/15 text-violet" : "border-white/10 bg-white/[0.03] text-white/65"}`}>
                    {index === 0 ? <Check size={16} /> : item.step}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-medium text-white/85">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-white/40">{item.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="relative px-5 py-28 sm:px-8 lg:px-12 lg:py-40">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="section-kicker">Access</p>
            <h2 className="mt-4 max-w-lg text-4xl font-medium tracking-[-0.06em] text-white sm:text-6xl">Access</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/45">The page is intentionally limited to the Access view.</p>
          </div>
          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={faq.question}>
                  <button type="button" className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    <span className="text-base font-medium text-white/75 sm:text-lg">{faq.question}</span>
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition ${isOpen ? "rotate-180 border-violet/40 bg-violet/10 text-violet" : "border-white/[0.08] bg-white/[0.02] text-white/35"}`}>
                      <ChevronDown size={16} />
                    </span>
                  </button>
                  <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                    <p className="max-w-2xl pb-6 pr-12 text-sm leading-7 text-white/40">{faq.answer}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative px-5 pb-28 sm:px-8 lg:px-12 lg:pb-40">
        <div className="cta-panel relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-violet/20 bg-gradient-to-br from-violet/[0.18] via-[#15121f] to-cyan/[0.08] px-6 py-16 text-center sm:px-8 lg:px-12">
          <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-[90px]" />
          <div className="relative">
            <p className="section-kicker">Access</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-medium tracking-[-0.07em] text-white sm:text-6xl">Access</h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/45">Access is the only message visible on this page.</p>
            <InstallLink className="button-primary focus-ring mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-black">
              Access <Download size={16} />
            </InstallLink>
            <DownloadLink className="button-secondary focus-ring mt-3 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white/80">
              Access <Download size={16} />
            </DownloadLink>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.08] px-5 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="#home" className="focus-ring flex items-center gap-3">
              <LogoMark />
              <span className="text-sm font-semibold tracking-[-0.02em] text-white/80">Access</span>
            </a>
            <p className="mt-4 max-w-sm text-xs leading-5 text-white/30">Access page only.</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/35">
            {siteConfig.links.privacy ? <a href={siteConfig.links.privacy} className="focus-ring hover:text-white/80">Privacy</a> : <span title="Add a verified privacy policy URL before publishing.">Privacy</span>}
            {siteConfig.links.contact ? <a href={siteConfig.links.contact} className="focus-ring hover:text-white/80">Contact</a> : <span title="Add a verified contact destination before publishing.">Contact</span>}
            {siteConfig.links.github ? <a href={siteConfig.links.github} className="focus-ring inline-flex items-center gap-1.5 hover:text-white/80"><Github size={13} /> GitHub</a> : null}
            <span className="text-white/20">© {new Date().getFullYear()} Access</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
