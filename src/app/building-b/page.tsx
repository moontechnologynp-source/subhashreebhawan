"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Film,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Phone,
  Utensils,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  clearPendingSectionScroll,
  queuePendingSectionScroll,
  resolvePendingSectionScroll,
} from "@/lib/section-scroll";

export default function BuildingBPage() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<"a" | "b" | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const buildingAFloors = [
    { label: "Ground Floor", id: "building-a-ground" },
    { label: "1st Floor", id: "building-a-1st" },
    { label: "2nd Floor", id: "building-a-2nd" },
    { label: "3rd Floor", id: "building-a-3rd" },
    { label: "Gym (4th–6th)", id: "building-a-gym" },
    { label: "Available Spaces", id: "available-spaces" },
  ];

  const buildingBFloors = [
    { label: "Ground Floor", id: "building-b-ground" },
    { label: "1st Floor", id: "building-b-1st" },
    { label: "2nd Floor", id: "building-b-2nd" },
  ];

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!els.length) return;

    els.forEach((el) => el.classList.add("reveal"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add("reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHash = () => {
      const id = resolvePendingSectionScroll(window.location.pathname);
      if (!id) return;

      const attemptScroll = (attemptsLeft = 8) => {
        const target = document.getElementById(id);
        if (target) {
          const navHeight =
            document.querySelector("nav")?.getBoundingClientRect().height ?? 72;
          const top =
            target.getBoundingClientRect().top + window.scrollY - navHeight - 8;

          if (window.location.hash !== `#${id}`) {
            window.history.replaceState(
              null,
              "",
              `${window.location.pathname}#${id}`,
            );
          }
          window.scrollTo({ top, behavior: "smooth" });
          clearPendingSectionScroll(window.location.pathname, id);
          return;
        }

        if (attemptsLeft > 0) {
          window.setTimeout(() => attemptScroll(attemptsLeft - 1), 100);
        }
      };

      window.setTimeout(() => attemptScroll(), 120);
    };

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      const navHeight =
        document.querySelector("nav")?.getBoundingClientRect().height ?? 72;
      const top =
        target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.history.replaceState(null, "", `#${id}`);
      window.scrollTo({ top, behavior: "smooth" });
      setOpenMenu(null);
      setMobileOpen(false);
    }
  };

  const navigateToPageSection = (
    pathname: "/building-a" | "/building-b",
    id: string,
  ) => {
    queuePendingSectionScroll(pathname, id);
    setOpenMenu(null);
    setMobileOpen(false);
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EA] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />
        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px]" />
        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px]" />
      </div>

      <nav className="sticky top-0 z-40 border-b border-black/5 bg-[#F2EBD7]/80 backdrop-blur-xl">
        <Container>
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="inline-flex items-center gap-3">
              <img
                src="/subhashree.png"
                alt="Subha Shree Bhawan Logo"
                className="h-12 w-12"
              />
              <div>
                <p className="text-sm font-semibold">Subha Shree Bhawan</p>
                <p className="text-xs text-slate-500">Building B</p>
              </div>
            </Link>

            <div
              ref={dropdownRef}
              className="hidden xl:flex items-center gap-2"
            >
              <div className="relative flex items-center gap-2">
                <DropdownPill
                  label="Building A"
                  active={openMenu === "a"}
                  onClick={() => setOpenMenu(openMenu === "a" ? null : "a")}
                />
                <DropdownPill
                  label="Building B"
                  active={openMenu === "b"}
                  onClick={() => setOpenMenu(openMenu === "b" ? null : "b")}
                />
                {openMenu === "a" && (
                  <DropdownMenu
                    items={buildingAFloors}
                    onSelect={(id) => navigateToPageSection("/building-a", id)}
                  />
                )}
                {openMenu === "b" && (
                  <DropdownMenu
                    items={buildingBFloors}
                    onSelect={(id) => scrollToSection(id)}
                  />
                )}
              </div>

              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 transition hover:translate-y-[-1px]"
              >
                Back Home
              </button>
              <a href="#contact-actions" className="btn-primary">
                Contact Now <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/55 ring-1 ring-black/10 hover:bg-white/70 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {mobileOpen && (
            <div className="xl:hidden pb-4">
              <div className="mt-2 rounded-3xl bg-[#FFF7DE]/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.14)] overflow-hidden">
                <div className="p-4 space-y-2">
                  <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                    <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                      BUILDING A
                    </p>
                    <div className="border-t border-black/5">
                      {buildingAFloors.map((floor) => (
                        <button
                          key={floor.id}
                          type="button"
                          onClick={() =>
                            navigateToPageSection("/building-a", floor.id)
                          }
                          className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-black/[0.03] transition border-b border-black/5 last:border-0"
                        >
                          {floor.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                    <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                      BUILDING B
                    </p>
                    <div className="border-t border-black/5">
                      {buildingBFloors.map((floor) => (
                        <button
                          key={floor.id}
                          type="button"
                          onClick={() => scrollToSection(floor.id)}
                          className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-black/[0.03] transition border-b border-black/5 last:border-0"
                        >
                          {floor.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      router.push("/");
                      setMobileOpen(false);
                    }}
                    className="w-full rounded-2xl bg-white/70 ring-1 ring-black/10 px-4 py-3 text-sm font-semibold text-left"
                  >
                    Back Home
                  </button>
                  <a
                    href="#contact-actions"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full justify-center"
                  >
                    Contact Now <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </Container>
      </nav>

      <section className="pt-16 pb-12 md:pt-20 md:pb-16">
        <Container>
          <div className="max-w-4xl">
            <div
              data-reveal
              className="inline-flex items-center gap-2 rounded-full bg-white/55 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              <Building2 className="h-4 w-4" />
              Dedicated page
            </div>

            <h1
              data-reveal
              className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight"
            >
              Building B
              <span className="block text-slate-600">
                Modern business, dining and creativity
              </span>
            </h1>

            <p
              data-reveal
              className="mt-5 max-w-2xl text-lg text-slate-700 leading-relaxed"
            >
              Building B brings together premium dining, creative production,
              and innovative technology under one refined commercial address.
            </p>
          </div>
        </Container>
      </section>

      <Section id="floor-labels" tone="soft">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
            Building B Floor Labels
          </div>
          <h2
            data-reveal
            className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            Floor Directory
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FloorLabelCard
            floor="Ground Floor"
            title="Elements Restaurant"
            status="Active"
          />
          <FloorLabelCard
            floor="1st Floor"
            title="Swopna Chitra"
            status="Active"
          />
          <FloorLabelCard
            floor="2nd Floor"
            title="Moon Technology"
            status="Active"
          />
        </div>
      </Section>

      <Section id="building-b-ground">
        <TwoCol
          left={
            <>
              <Kicker text="GROUND FLOOR • BUILDING B" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Elements Restaurant
              </h2>
              <div data-reveal>
                <FeatureRow
                  icon={<Utensils className="h-5 w-5" />}
                  title="Fine Dining"
                  desc="Contemporary Nepali and international cuisine crafted with premium service."
                />
              </div>
            </>
          }
          right={
            <ImageCard
              src="/elements.jpg"
              alt="Elements Restaurant"
              fit="contain"
              zoom="scale-100"
            />
          }
        />
      </Section>

      <Section id="building-b-1st" tone="soft">
        <TwoCol
          reverse
          left={
            <>
              <Kicker text="1ST FLOOR • BUILDING B" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Swopna Chitra
              </h2>
              <div data-reveal>
                <FeatureRow
                  icon={<Film className="h-5 w-5" />}
                  title="Production House"
                  desc="Dreams into Frames."
                />
              </div>
            </>
          }
          right={
            <ImageCard
              src="/alogo.png"
              alt="Swopna Chitra"
              fit="contain"
              zoom="scale-100"
            />
          }
        />
      </Section>

      <Section id="building-b-2nd">
        <TwoCol
          left={
            <>
              <Kicker text="2ND FLOOR • BUILDING B" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Moon Technology
              </h2>
              <div data-reveal>
                <FeatureRow
                  icon={<Laptop className="h-5 w-5" />}
                  title="IT Solutions"
                  desc="Software, cloud and technology services for modern organizations."
                />
              </div>

              <div data-reveal className="pt-2">
                <a
                  href="https://www.moontechnology.com.np/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition hover:translate-y-[-1px]"
                >
                  Visit Website <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </>
          }
          right={
            <ImageCard
              src="/moon.jpeg"
              alt="Moon Technology"
              fit="contain"
              zoom="scale-100"
            />
          }
        />
      </Section>

      <Section id="contact-actions" tone="soft">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white/60 ring-1 ring-black/10 p-8 md:p-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
              CONTACT BUILDING B
            </div>
            <h2
              data-reveal
              className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              Call or Email Instantly
            </h2>
            <p data-reveal className="mt-3 text-slate-700 max-w-2xl mx-auto">
              Tap call to dial, or email to open
              your mail app.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+9779808100067"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.18)] hover:translate-y-[-1px] transition"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>

            <a
              href="mailto:buddhalifestyle.np@gmail.com?subject=Inquiry%20for%20Building%20B"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-slate-900 font-semibold ring-1 ring-black/10 hover:translate-y-[-1px] transition"
            >
              <Mail className="h-5 w-5" />
              Email Now
            </a>
          </div>
        </div>
      </Section>

      <footer className="py-12">
        <Container>
          <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7">
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Building B
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  A connected destination for dining, production, and
                  technology-focused businesses.
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  CONTACT
                </h4>
                <div className="mt-4 space-y-3 text-slate-700">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>Baluwatar, Kathmandu</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span>+977 980-8100067</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <span>buddhalifestyle.np@gmail.com</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  TENANTS
                </h4>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>Elements Restaurant</li>
                  <li>Swopna Chitra</li>
                  <li>Moon Technology</li>
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-5 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

function Section({
  id,
  tone = "base",
  children,
}: {
  id?: string;
  tone?: "base" | "soft";
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative py-14 md:py-20 scroll-mt-24">
      {tone === "soft" && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF2C7]/28 to-transparent" />
        </div>
      )}
      <Container>{children}</Container>
    </section>
  );
}

function TwoCol({
  left,
  right,
  reverse = false,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-12">
      <div className={`lg:col-span-6 ${reverse ? "lg:order-2" : "lg:order-1"}`}>
        <div className="space-y-6">{left}</div>
      </div>
      <div className={`lg:col-span-6 ${reverse ? "lg:order-1" : "lg:order-2"}`}>
        {right}
      </div>
    </div>
  );
}

function MediaCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden">
      {children}
    </div>
  );
}

function Kicker({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center rounded-full bg-white/55 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
      {text}
    </div>
  );
}

function FloorLabelCard({
  floor,
  title,
  status,
  highlight = false,
}: {
  floor: string;
  title: string;
  status: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-[24px] p-5 ring-1 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
        highlight
          ? "bg-slate-900 text-white ring-slate-900"
          : "bg-white/65 text-slate-900 ring-black/10"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs font-bold tracking-[0.18em] ${
            highlight ? "text-white/80" : "text-slate-500"
          }`}
        >
          {floor.toUpperCase()}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.18em] ${
            highlight ? "bg-white text-slate-900" : "bg-slate-900 text-white"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-extrabold tracking-tight">{title}</h3>
    </div>
  );
}

function ImageCard({
  src,
  alt,
  crop = "object-center",
  heightClass = "h-[420px]",
  zoom = "scale-110",
  fit = "cover",
}: {
  src: string;
  alt: string;
  crop?: string;
  heightClass?: string;
  zoom?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <MediaCard>
      <div className={`relative ${heightClass} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-[#FFF2C7]/30 to-white/30" />
        <img
          src={src}
          alt={alt}
          className={[
            "absolute inset-0 h-full w-full",
            fit === "contain" ? "object-contain p-4" : "object-cover",
            crop,
            zoom,
          ].join(" ")}
        />
      </div>
    </MediaCard>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl bg-white/55 ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
      <div className="shrink-0 rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 text-slate-700">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-slate-900">{title}</h4>
        <p className="mt-1 text-sm text-slate-700 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function DropdownPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-[#E8DFC8] text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
          : "bg-transparent text-slate-700 hover:bg-[#EDE4CF]",
      ].join(" ")}
    >
      <span>{label}</span>
      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200 ${
          active ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function DropdownMenu({
  items,
  onSelect,
}: {
  items: { label: string; id: string }[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="absolute left-0 top-[48px] z-50 w-[200px] overflow-hidden rounded-2xl border border-black/10 bg-[#F7F7F7]/95 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              "flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-800 transition hover:bg-black/[0.04]",
              index !== items.length - 1 ? "border-b border-black/5" : "",
            ].join(" ")}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
