"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  ChevronDown,
  Coffee,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Stethoscope,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  clearPendingSectionScroll,
  queuePendingSectionScroll,
  resolvePendingSectionScroll,
} from "@/lib/section-scroll";

export default function BuildingAPage() {
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

  // ── FIXED: hash-scroll that works both on initial load and on hashchange ──
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
        // Element not yet in DOM — retry
        if (attemptsLeft > 0) {
          window.setTimeout(() => attemptScroll(attemptsLeft - 1), 100);
        }
      };

      window.setTimeout(() => attemptScroll(), 120);
    };

    // Fire on initial load
    scrollToHash();

    // Fire whenever the hash changes (navigating from home page dropdown)
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

  const floor3Images = [
    {
      src: "/available/3rd-1.png",
      alt: "3rd floor office view",
      label: "Building A • 3rd Floor",
    },
    {
      src: "/available/3.png",
      alt: "3rd floor office hallway",
      label: "Building A • 3rd Floor",
    },
  ];

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
                <p className="text-xs text-slate-500">Building A</p>
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
                    onSelect={(id) => scrollToSection(id)}
                  />
                )}
                {openMenu === "b" && (
                  <DropdownMenu
                    items={buildingBFloors}
                    onSelect={(id) => navigateToPageSection("/building-b", id)}
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
                          onClick={() => scrollToSection(floor.id)}
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
                          onClick={() =>
                            navigateToPageSection("/building-b", floor.id)
                          }
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
              Building A
              <span className="block text-slate-600">
                Seven floors of excellence
              </span>
            </h1>

            <p
              data-reveal
              className="mt-5 max-w-2xl text-lg text-slate-700 leading-relaxed"
            >
              Explore the complete Building A experience including premium
              ground-floor amenities, office spaces, occupied floors, and
              currently available units.
            </p>
          </div>
        </Container>
      </section>

      <Section id="floor-labels" tone="soft">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
            Building A Floor Labels
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
            title="Himalayan Java & Tesla Clinic"
            status="Active"
          />
          <FloorLabelCard
            floor="1st Floor"
            title="Vairav Tech"
            status="Active"
          />
          <FloorLabelCard
            floor="2nd Floor"
            title="Family Health International 360"
            status="Occupied"
          />
          <FloorLabelCard
            floor="3rd Floor"
            title="Prime Office Space"
            status="Available"
            highlight
          />
          <FloorLabelCard
            floor="4th – 6th Floor"
            title="Premium Fitness Center"
            status="Coming Soon"
          />
        </div>
      </Section>

      <Section id="building-a-ground">
        <TwoCol
          left={
            <>
              <Kicker text="GROUND FLOOR • BUILDING A" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Himalayan Java & Tesla Clinic
              </h2>
              <div data-reveal className="space-y-4">
                <FeatureRow
                  icon={<Coffee className="h-5 w-5" />}
                  title="Himalayan Java"
                  desc="Premium coffee experience with warm Nepali hospitality."
                />
                <FeatureRow
                  icon={<Stethoscope className="h-5 w-5" />}
                  title="Tesla Clinic"
                  desc="Professional healthcare services with modern facilities and experienced practitioners."
                />
              </div>
            </>
          }
          right={
            <ImageCard
              src="/javatesla.png"
              alt="Tesla Clinic and Himalayan Java"
              footerLeft="FACILITIES"
              footerRight="Clinic + Café"
              heightClass="h-96"
              crop="object-[50%_30%]"
              fit="cover"
            />
          }
        />
      </Section>

      <Section id="building-a-1st" tone="soft">
        <TwoCol
          reverse
          left={
            <>
              <Kicker text="1ST FLOOR • BUILDING A" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Vairav Tech
              </h2>
              <div data-reveal>
                <FeatureRow
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="Security Operations Excellence"
                  desc="Vairav Technology is a powerhouse of cybersecurity and modern business security solutions."
                />
              </div>
            </>
          }
          right={
            <ImageCard
              src="/vairav.png"
              alt="Vairav Tech"
              footerLeft="FLOOR AREA"
              footerRight="3,500 sq. ft."
              heightClass="h-[31.25rem]"
              crop="object-contain"
              zoom="scale-[0.55]"
              fit="contain"
            />
          }
        />
      </Section>

      <Section id="building-a-2nd">
        <TwoCol
          left={
            <>
              <Kicker text="2ND FLOOR • BUILDING A" />
              <h2
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Family Health International 360
              </h2>
              <div data-reveal>
                <FeatureRow
                  icon={<Building2 className="h-5 w-5" />}
                  title="Occupied Floor"
                  desc="This floor is currently occupied by Family Health International 360."
                />
              </div>
            </>
          }
          right={
            <ComingSoonCard title="2nd Floor Photos" subtitle="Coming soon" />
          }
        />
      </Section>

      <Section id="building-a-3rd" tone="soft">
        <TwoCol
          reverse
          left={
            <VacantFloorInfo
              badge="AVAILABLE"
              floor="3RD FLOOR • BUILDING A"
              title="Prime Office Space"
              area="3,500 sq. ft."
              phone="+977 980-8100067"
              ctaHref="#contact-actions"
              ctaText="Contact for This Floor"
            />
          }
          right={
            <FloorCarousel
              title="3rd Floor Gallery"
              images={floor3Images}
              intervalMs={5000}
              fit="contain"
            />
          }
        />
      </Section>

      <Section id="building-a-gym">
        <div className="text-center">
          <Kicker text="4TH, 5TH AND 6TH FLOORS • BUILDING A" />
          <h2
            data-reveal
            className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Premium Fitness Center
            <span className="block text-slate-600">Coming soon</span>
          </h2>
          <p data-reveal className="mt-3 text-slate-700">
            Three floors of wellness and future-ready fitness amenities.
          </p>
        </div>
      </Section>

      <Section id="available-spaces" tone="soft">
        <div className="text-center mb-10 md:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
            Leasing
          </div>
          <h2
            data-reveal
            className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Available Spaces
          </h2>
          <p data-reveal className="mt-3 text-lg text-slate-700">
            Building A currently has a premium office floor ready for immediate
            occupancy.
          </p>
        </div>

        <div
          className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto"
          data-reveal
        >
          <div className="lg:col-span-5 grid gap-5">
            <SpaceCard
              building="BUILDING A"
              floor="3rd Floor"
              title="Prime Office Space"
              area="3,500 sq. ft."
              phone="+977 9808100067"
              email="buddhalifestyle.np@gmail.com"
              tag="AVAILABLE NOW"
            />
          </div>

          <div className="lg:col-span-7">
            <FloorCarousel
              title="Available Floors Preview"
              images={floor3Images}
              intervalMs={5000}
              fit="contain"
            />
          </div>
        </div>

      </Section>

      <Section id="contact-actions" tone="soft">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white/60 ring-1 ring-black/10 p-8 md:p-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
              REQUEST A VIEWING
            </div>
            <h2
              data-reveal
              className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              Call or Email Instantly
            </h2>
            <p data-reveal className="mt-3 text-slate-700 max-w-2xl mx-auto">
              Tap call to dial, or email to open your mail app.
            </p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+9779808100067"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.18)] hover:translate-y-[-1px] transition"
            >
              <Phone className="h-5 w-5" /> Call Now
            </a>
            <a
              href="mailto:buddhalifestyle.np@gmail.com?subject=Inquiry%20for%20Building%20A"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-slate-900 font-semibold ring-1 ring-black/10 hover:translate-y-[-1px] transition"
            >
              <Mail className="h-5 w-5" /> Email Now
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
                  Building A
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  Premium office, café, clinic, and future wellness spaces in
                  Subha Shree Bhawan.
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
                  HIGHLIGHTS
                </h4>
                <ul className="mt-4 space-y-3 text-slate-700">
                  <li>Ground-floor premium amenities</li>
                  <li>Technology and health tenants</li>
                  <li>Available office floor</li>
                  <li>Future gym and wellness zone</li>
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
      className={`rounded-[24px] p-5 ring-1 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${highlight ? "bg-slate-900 text-white ring-slate-900" : "bg-white/65 text-slate-900 ring-black/10"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className={`text-xs font-bold tracking-[0.18em] ${highlight ? "text-white/80" : "text-slate-500"}`}
        >
          {floor.toUpperCase()}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.18em] ${highlight ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}
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
  footerLeft,
  footerRight,
  crop = "object-center",
  heightClass = "h-80",
  zoom = "scale-110",
  fit = "cover",
}: {
  src: string;
  alt: string;
  footerLeft?: string;
  footerRight?: string;
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7DE]/35 via-transparent to-transparent" />
      </div>
      {(footerLeft || footerRight) && (
        <div className="p-5 border-t border-black/5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
              {footerLeft}
            </span>
            <span className="font-semibold text-slate-900">{footerRight}</span>
          </div>
        </div>
      )}
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

function VacantFloorInfo({
  badge,
  floor,
  title,
  area,
  phone,
  ctaHref,
  ctaText,
}: {
  badge: string;
  floor: string;
  title: string;
  area: string;
  phone: string;
  ctaHref?: string;
  ctaText?: string;
}) {
  return (
    <div>
      <Kicker text={floor} />
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
        {badge}
      </div>
      <h3
        data-reveal
        className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight"
      >
        {title}
      </h3>
      <div className="mt-7 rounded-3xl bg-white/55 ring-1 ring-black/10 p-5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
            FLOOR AREA
          </span>
          <span className="font-semibold">{area}</span>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm border-t border-black/5 pt-4">
          <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
            CONTACT
          </span>
          <span className="font-semibold">{phone}</span>
        </div>
      </div>
      {ctaHref && (
        <div className="mt-6">
          <a href={ctaHref} className="btn-primary">
            {ctaText || "View Leasing Details"}{" "}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}

function ComingSoonCard({
  title,
  subtitle = "Coming soon",
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <MediaCard>
      <div className="relative h-[320px] md:h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7DE] via-[#FFF2C7] to-white" />
        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
            COMING SOON
          </div>
          <h4 className="mt-5 text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h4>
          <p className="mt-3 text-slate-600 text-base md:text-lg">{subtitle}</p>
        </div>
      </div>
    </MediaCard>
  );
}

function SpaceCard({
  building,
  floor,
  title,
  area,
  phone,
  email,
  tag,
}: {
  building: string;
  floor: string;
  title: string;
  area: string;
  phone: string;
  email: string;
  tag?: string;
}) {
  return (
    <div className="relative rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] hover:-translate-y-[2px] hover:shadow-[0_30px_95px_rgba(15,23,42,0.12)] transition">
      {tag && (
        <div className="absolute top-4 right-4 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-[0_18px_50px_rgba(2,6,23,0.16)]">
          {tag}
        </div>
      )}
      <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">
        {building}
      </p>
      <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{floor}</h3>
      <p className="mt-2 text-slate-700">{title}</p>
      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between border-t border-black/5 pt-4">
          <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
            FLOOR AREA
          </span>
          <span className="font-semibold">{area}</span>
        </div>
        <div className="flex flex-col gap-2 pt-3">
          <div className="inline-flex items-center gap-2 text-slate-800">
            <Phone className="h-4 w-4 text-slate-500" /> {phone}
          </div>
          <div className="inline-flex items-center gap-2 text-slate-800">
            <Mail className="h-4 w-4 text-slate-500" /> {email}
          </div>
        </div>
      </div>
    </div>
  );
}

function FloorCarousel({
  images,
  title = "Available Floors",
  intervalMs = 5000,
  fit = "contain",
}: {
  images: { src: string; alt: string; label?: string }[];
  title?: string;
  intervalMs?: number;
  fit?: "contain" | "cover";
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    const t = window.setInterval(
      () => setI((p) => (p + 1) % count),
      intervalMs,
    );
    return () => window.clearInterval(t);
  }, [paused, count, intervalMs]);

  const go = (next: number) => setI((next + count) % count);
  if (!images.length) return null;

  return (
    <div
      className="rounded-[28px] bg-white/55 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-black/5">
        <div>
          <p className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold">
            GALLERY
          </p>
          <h4 className="mt-1 text-lg md:text-xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(i - 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 ring-1 ring-black/10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 ring-1 ring-black/10"
          >
            ›
          </button>
        </div>
      </div>
      <div className="relative h-[320px] md:h-[520px]">
        {images.map((img, idx) => (
          <div
            key={img.src + idx}
            className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? "opacity-100" : "opacity-0"}`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className={`absolute inset-0 h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
            />
            {img.label && (
              <div className="absolute left-5 bottom-5">
                <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/10 px-4 py-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {img.label}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
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
        className={`h-4 w-4 transition-transform duration-200 ${active ? "rotate-180" : ""}`}
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
