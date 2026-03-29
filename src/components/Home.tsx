"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Stethoscope,
  Coffee,
  ShieldCheck,
  Utensils,
  Film,
  Laptop,
  Phone,
  Mail,
  MapPin,
  Star,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { queuePendingSectionScroll } from "@/lib/section-scroll";

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

export default function Home() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);
  const [openMenu, setOpenMenu] = useState<"a" | "b" | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);

  const playHeroVideo = async () => {
    const v = heroVideoRef.current;
    if (!v) return;
    try {
      v.currentTime = 1;
      await v.play();
    } catch {}
  };

  const pauseHeroVideo = () => {
    const v = heroVideoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 2;
  };

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const a = target?.closest("a");
      const href = a?.getAttribute("href") || "";

      if (
        href.startsWith("#") ||
        href.startsWith("/building-a") ||
        href.startsWith("/building-b")
      ) {
        setMenuOpen(false);
        setOpenMenu(null);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
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

  const floor3Images = useMemo(
    () => [
      {
        src: "/available/3rd-1.png",
        alt: "3rd floor office view",
        label: "Building A • 3rd Floor",
      },
      {
        src: "/available/3.png",
        alt: "3rd floor hallway / open space",
        label: "Building A • 3rd Floor",
      },
    ],
    [],
  );

  const allAvailableImages = useMemo(() => [...floor3Images], [floor3Images]);

  const navigateToFloor = (pathname: "/building-a" | "/building-b", id: string) => {
    queuePendingSectionScroll(pathname, id);
    setMenuOpen(false);
    setOpenMenu(null);
    router.push(pathname);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EA] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />
        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px] animate-float-slow" />
        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px] animate-float-slow-2" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      <nav
        className={[
          "fixed top-0 left-0 right-0 z-40",
          "bg-[#FFF7DE]/70 backdrop-blur-xl",
          "border-b border-black/5",
          navShadow ? "shadow-[0_14px_60px_rgba(15,23,42,0.10)]" : "",
        ].join(" ")}
      >
        <Container>
          <div className="flex items-center justify-between">
            <a href="#hero" className="inline-flex items-center gap-3 group">
              <img
                src="/subhashree.png"
                alt="Subha Shree Bhawan Logo"
                className="h-20 w-20 overflow-hidden pb-2"
              />
              <span className="text-[15px] md:text-base font-semibold tracking-tight">
                Subha Shree Bhawan
              </span>
            </a>

            <div
              ref={dropdownRef}
              className="hidden md:flex items-center gap-1"
            >
              <div className="relative">
                <DropdownPill
                  label="Building A"
                  active={openMenu === "a"}
                  onClick={() => setOpenMenu(openMenu === "a" ? null : "a")}
                />
                {openMenu === "a" && (
                  <DropdownMenu
                    items={buildingAFloors}
                    onSelect={(id) => navigateToFloor("/building-a", id)}
                  />
                )}
              </div>

              <div className="relative">
                <DropdownPill
                  label="Building B"
                  active={openMenu === "b"}
                  onClick={() => setOpenMenu(openMenu === "b" ? null : "b")}
                />
                {openMenu === "b" && (
                  <DropdownMenu
                    items={buildingBFloors}
                    onSelect={(id) => navigateToFloor("/building-b", id)}
                  />
                )}
              </div>

              <a
                href="#available-spaces"
                className="px-3 py-2 text-[12px] tracking-[0.18em] font-semibold text-slate-700 hover:text-slate-900 rounded-2xl hover:bg-black/[0.04] transition"
              >
                AVAILABLE SPACES
              </a>

              <a href="#available-spaces" className="ml-2 btn-primary">
                Book a Viewing <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/55 ring-1 ring-black/10 hover:bg-white/70 transition"
              aria-label="Open menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {menuOpen && (
            <div className="md:hidden mt-4 mb-3 rounded-3xl bg-[#FFF7DE]/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.14)] overflow-hidden animate-pop-in">
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
                        onClick={() => navigateToFloor("/building-a", floor.id)}
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
                        onClick={() => navigateToFloor("/building-b", floor.id)}
                        className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-black/[0.03] transition border-b border-black/5 last:border-0"
                      >
                        {floor.label}
                      </button>
                    ))}
                  </div>
                </div>

                <a
                  href="#available-spaces"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl bg-black/[0.03] ring-1 ring-black/10 px-4 py-3 text-sm font-semibold"
                >
                  Available Spaces
                </a>

                <a
                  href="#available-spaces"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary w-full justify-center"
                >
                  Book a Viewing <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </Container>
      </nav>

      <section id="hero" className="relative pt-28 md:pt-32 pb-14 md:pb-20">
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-7">
              <div
                data-reveal
                className="inline-flex items-center gap-2 rounded-full bg-white/55 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <Star className="h-4 w-4 text-slate-900" />
                Premium commercial complex
              </div>

              <h1
                data-reveal
                className="mt-6 text-[42px] leading-[1.06] md:text-[64px] md:leading-[1.02] font-extrabold tracking-tight"
              >
                Built for modern brands.
                <span className="block text-slate-600 font-extrabold">
                  Designed to feel premium.
                </span>
              </h1>

              <p
                data-reveal
                className="mt-5 md:mt-6 text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl"
              >
                Subha Shree Bhawan in Baluwatar offers a refined, professional
                environment for offices, premium services, and growth-ready
                businesses.
              </p>

              <div data-reveal className="mt-9 md:mt-10 flex flex-wrap gap-3">
                <a href="#available-spaces" className="btn-primary">
                  View Available Spaces <ArrowRight className="h-4 w-4" />
                </a>

                <a href="#building-a-ground" className="btn-secondary">
                  Explore Floors <ChevronDown className="h-4 w-4" />
                </a>
              </div>

              <div
                data-reveal
                className="mt-11 md:mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl"
              >
                <InfoTile
                  title="Buildings"
                  value="2 connected"
                  icon={<Building2 className="h-4 w-4" />}
                />
                <InfoTile
                  title="Location"
                  value="Baluwatar"
                  icon={<MapPin className="h-4 w-4" />}
                />
                <InfoTile
                  title="Positioning"
                  value="Premium"
                  icon={<Star className="h-4 w-4" />}
                />
              </div>
            </div>

            <div className="lg:col-span-5" data-reveal>
              <MediaCard>
                <div
                  className="relative h-[410px] md:h-[440px]"
                  onMouseEnter={playHeroVideo}
                  onMouseLeave={pauseHeroVideo}
                  onClick={() => {
                    const v = heroVideoRef.current;
                    if (!v) return;
                    if (v.paused) playHeroVideo();
                    else pauseHeroVideo();
                  }}
                >
                  <video
                    ref={heroVideoRef}
                    src="/videos/subha-shree-bhawan.mp4"
                    poster="/buildingA.png"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7DE] via-[#FFF7DE]/20 to-transparent" />

                  <div className="absolute top-5 left-5">
                    <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/10 px-3 py-2">
                      <p className="text-[11px] tracking-[0.18em] text-slate-600 font-semibold">
                        HOVER TO PLAY
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-5 right-5 bottom-5">
                    <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/10 p-4">
                      <p className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold">
                        CONTACT
                      </p>
                      <div className="mt-2 grid gap-1 text-sm text-slate-700">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" /> +977
                          980-8100067
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />{" "}
                          buddhalifestyle.np@gmail.com
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-black/5">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <MiniStat
                      title="Café"
                      value="Himalayan Java"
                      icon={<Coffee className="h-4 w-4" />}
                    />
                    <MiniStat
                      title="Clinic"
                      value="Tesla Clinic"
                      icon={<Stethoscope className="h-4 w-4" />}
                    />
                    <MiniStat
                      title="Floors"
                      value="Office-ready"
                      icon={<Laptop className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </MediaCard>
            </div>
          </div>

          <div className="mt-14 md:mt-16 flex justify-center" data-reveal>
            <div className="h-12 w-[2px] bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </Container>
      </section>

      <SectionHeader
        title="Building A"
        subtitle="Seven floors of excellence"
        href="/building-a"
      />

      <Section id="building-a-ground">
        <TwoCol
          left={
            <>
              <Kicker text="GROUND FLOOR • BUILDING A" />
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Himalayan Java & Tesla Clinic
              </h3>

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
              alt="Tesla Clinic & Himalayan Java"
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
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Vairav Tech
              </h3>
              <div data-reveal>
                <FeatureRow
                  icon={<ShieldCheck className="h-5 w-5" />}
                  title="The Leading Security Operation Center Service Provider"
                  desc="Vairav Technology is a powerhouse of cybersecurity."
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
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Family Health International 360
              </h3>

              <div data-reveal className="space-y-4">
                <FeatureRow
                  icon={<Building2 className="h-5 w-5" />}
                  title="Occupied Space"
                  desc="The 2nd floor is now occupied by Family Health International 360."
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
              ctaHref="#available-spaces"
              ctaText="Go to Available Floors"
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
          <h3
            data-reveal
            className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight"
          >
            Premium Fitness Center
            <span className="block text-slate-600">Coming soon</span>
          </h3>
          <p data-reveal className="mt-3 text-slate-700">
            Three floors of wellness.
          </p>
        </div>
      </Section>

      <SectionHeader
        title="Building B"
        subtitle="Connected excellence"
        href="/building-b"
      />

      <Section id="building-b-ground">
        <TwoCol
          left={
            <>
              <Kicker text="GROUND FLOOR • BUILDING B" />
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Elements Restaurant
              </h3>
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
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Swopna Chitra
              </h3>
              <div data-reveal>
                <FeatureRow
                  icon={<Film className="h-5 w-5" />}
                  title="Production House"
                  desc="Dreams into Frames"
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
              <h3
                data-reveal
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
              >
                Moon Technology
              </h3>
              <div data-reveal>
                <FeatureRow
                  icon={<Laptop className="h-5 w-5" />}
                  title="IT Solutions"
                  desc="Software, cloud and technology services for modern organizations."
                />
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
            Premium commercial floors ready for immediate occupancy.
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
              images={allAvailableImages}
              intervalMs={5000}
              fit="contain"
            />
          </div>
        </div>

        <div className="mt-9 md:mt-10 max-w-6xl mx-auto" data-reveal>
          <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-xl md:text-2xl font-extrabold tracking-tight">
                Request a viewing
              </h4>
              <p className="mt-2 text-slate-700">
                Get floor plans and leasing terms. We&apos;ll respond quickly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+9779808100067"
                className="btn-secondary justify-center"
              >
                Call <Phone className="h-4 w-4" />
              </a>
              <a
                href="mailto:buddhalifestyle.np@gmail.com"
                className="btn-primary justify-center"
              >
                Email <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      <footer className="py-12 md:py-14">
        <Container>
          <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7 md:p-8">
            <div className="grid md:grid-cols-3 gap-10">
              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Subha Shree Bhawan
                </h3>
                <p className="mt-3 text-slate-700 leading-relaxed">
                  A premium commercial destination offering world-class business
                  spaces and amenities.
                </p>
                <img
                  src="/subhashree.png"
                  alt="Subha Shree Bhawan Logo"
                  className="h-24 w-24 overflow-hidden"
                />
              </div>

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  CONTACT
                </h4>
                <div className="mt-4 space-y-3 text-slate-700">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>Kathmandu, Nepal</span>
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
                  FEATURES
                </h4>
                <ul className="mt-4 space-y-3 text-slate-700">
                  {[
                    "Prime location",
                    "Modern infrastructure",
                    "24/7 security",
                    "Underground parking",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-slate-400" /> {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 text-center text-slate-500 text-sm">
              &copy; 2026 Subha Shree Bhawan. All rights reserved.
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
    <section id={id} className="relative py-14 md:py-20">
      {tone === "soft" && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF2C7]/28 to-transparent" />
        </div>
      )}
      <Container>{children}</Container>
    </section>
  );
}

function MediaCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden">
      {children}
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle: string;
  href?: string;
}) {
  return (
    <div className="py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <div className="text-center">
          <h2
            data-reveal
            className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900"
          >
            {title}
          </h2>
          <p
            data-reveal
            className="mt-3 text-xs md:text-sm tracking-[0.22em] text-slate-500"
          >
            {subtitle.toUpperCase()}
          </p>

          {href && (
            <div data-reveal className="mt-6">
              <a href={href} className="btn-secondary">
                View Dedicated Page <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          )}

          <div className="mx-auto mt-7 h-[2px] w-16 rounded-full bg-black/10" />
        </div>
      </div>
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
      <div
        className={[
          "lg:col-span-6",
          reverse ? "lg:order-2" : "lg:order-1",
        ].join(" ")}
      >
        <div className="space-y-6">{left}</div>
      </div>
      <div
        className={[
          "lg:col-span-6",
          reverse ? "lg:order-1" : "lg:order-2",
        ].join(" ")}
      >
        {right}
      </div>
    </div>
  );
}

function InfoTile({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/55 ring-1 ring-black/10 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] hover:-translate-y-[2px] hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
      <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-slate-500 font-semibold">
        <span className="text-slate-500">{icon}</span> {title.toUpperCase()}
      </div>
      <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function MiniStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 hover:-translate-y-[1px] transition">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">
          {title.toUpperCase()}
        </p>
        <span className="text-slate-500">{icon}</span>
      </div>
      <p className="mt-2 font-semibold text-slate-900">{value}</p>
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
    <div className="flex gap-4 rounded-3xl bg-white/55 ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] hover:-translate-y-[2px] hover:shadow-[0_26px_85px_rgba(15,23,42,0.10)] transition">
      <div className="shrink-0 rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 text-slate-700">
        {icon}
      </div>
      <div className="min-w-0">
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
      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-[0_18px_50px_rgba(2,6,23,0.16)]">
        {badge}
      </div>
      <h3
        data-reveal
        className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight"
      >
        {title}
      </h3>
      <div className="mt-7 rounded-3xl bg-white/55 ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
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
        <div className="mt-6" data-reveal>
          <a href={ctaHref} className="btn-primary">
            {ctaText || "Go to Available Floors"}{" "}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
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
        <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-[#FFD27A]/30 blur-3xl" />
        <div className="absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-[#FFB35A]/20 blur-3xl" />
        <div className="relative z-10 text-center px-6">
          <div className="inline-flex items-center rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-[0_18px_50px_rgba(2,6,23,0.16)]">
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
  const startX = React.useRef<number | null>(null);
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

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    go(dx < 0 ? i + 1 : i - 1);
  };

  if (!images?.length) return null;

  return (
    <div
      className="rounded-[28px] bg-white/55 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-black/5">
        <div className="min-w-0">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 ring-1 ring-black/10 hover:bg-white/80 transition"
            aria-label="Previous"
          >
            <span className="text-slate-900 text-lg leading-none">‹</span>
          </button>
          <button
            type="button"
            onClick={() => go(i + 1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 ring-1 ring-black/10 hover:bg-white/80 transition"
            aria-label="Next"
          >
            <span className="text-slate-900 text-lg leading-none">›</span>
          </button>
        </div>
      </div>

      <div className="relative h-[320px] md:h-[520px]">
        {images.map((img, idx) => {
          const active = idx === i;
          return (
            <div
              key={img.src + idx}
              className={[
                "absolute inset-0 transition-opacity duration-[900ms] ease-[cubic-bezier(.2,.9,.2,1)]",
                active ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden={!active}
            >
              <img
                src={img.src}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-[#FFF2C7]/18 to-white/20" />
              <img
                src={img.src}
                alt={img.alt}
                className={[
                  "absolute inset-0 h-full w-full",
                  fit === "contain" ? "object-contain" : "object-cover",
                ].join(" ")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7DE]/35 via-transparent to-transparent" />
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
          );
        })}

        <div className="absolute bottom-4 right-5 flex items-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => go(idx)}
              className={[
                "h-2.5 rounded-full transition-all",
                idx === i
                  ? "w-8 bg-slate-900/80"
                  : "w-2.5 bg-white/70 ring-1 ring-black/10 hover:bg-white/90",
              ].join(" ")}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 md:px-6 py-4 border-t border-black/5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
            SLIDE
          </span>
          <span className="font-semibold text-slate-900">
            {i + 1} / {count}
          </span>
        </div>
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
        "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold tracking-[0.12em] transition-all duration-200",
        active
          ? "bg-[#E8DFC8] text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
          : "text-slate-700 hover:bg-black/[0.04] hover:text-slate-900",
      ].join(" ")}
    >
      <span>{label}</span>
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-200 ${
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
    <div className="absolute left-0 top-[42px] z-50 w-[200px] overflow-hidden rounded-2xl border border-black/10 bg-[#F7F7F7]/95 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="py-1">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={[
              "flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-black/[0.04] hover:text-slate-900",
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
