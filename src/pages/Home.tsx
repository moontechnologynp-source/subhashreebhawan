//main page
import React, { useEffect, useMemo, useState } from "react";
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

type LinkItem = { href: string; label: string };

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [navShadow, setNavShadow] = useState(false);

    const buildingALinks: LinkItem[] = useMemo(
        () => [
            { href: "#building-a-ground", label: "Ground Floor" },
            { href: "#building-a-1st", label: "1st Floor" },
            { href: "#building-a-2nd", label: "2nd Floor" },
            { href: "#building-a-3rd", label: "3rd Floor" },
            { href: "#building-a-gym", label: "Gym (4th–6th)" },
        ],
        []
    );

    const buildingBLinks: LinkItem[] = useMemo(
        () => [
            { href: "#building-b-ground", label: "Ground Floor" },
            { href: "#building-b-1st", label: "1st Floor" },
            { href: "#building-b-2nd", label: "2nd Floor" },
        ],
        []
    );

    // subtle nav elevation on scroll
    useEffect(() => {
        const onScroll = () => setNavShadow(window.scrollY > 10);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // close mobile menu on anchor click
    useEffect(() => {
        const handler = (e: Event) => {
            const target = e.target as HTMLElement | null;
            const a = target?.closest("a");
            if (a?.getAttribute("href")?.startsWith("#")) setMenuOpen(false);
        };
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    // scroll reveal (no library)
    useEffect(() => {
        const els = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]")
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
            { threshold: 0.12 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF6EA] text-slate-900 antialiased">
            {/* Apple/Stripe-ish ambient: clean + subtle */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                {/* warm base */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />
                {/* soft golden light */}
                <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px] animate-floatSlow" />
                <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px] animate-floatSlow2" />
                {/* subtle grain */}
                <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:54px_54px]" />
            </div>

            {/* NAV */}
            <nav
                className={[
                    "fixed top-0 left-0 right-0 z-40",
                    "bg-[#FFF7DE]/70 backdrop-blur-xl",
                    "border-b border-black/5",
                    navShadow ? "shadow-[0_14px_60px_rgba(15,23,42,0.10)]" : "",
                ].join(" ")}
            >
                <Container className="py-4">
                    <div className="flex items-center justify-between">
                        <a href="#hero" className="inline-flex items-center gap-3 group">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/55 ring-1 ring-black/10 group-hover:ring-black/20 transition">
                                <Building2 className="h-4 w-4 text-slate-900" />
                            </span>
                            <span className="text-[15px] md:text-base font-semibold tracking-tight">
                                Subha Shree Bhawan
                            </span>
                        </a>

                        {/* Desktop */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavDropdown label="Building A" items={buildingALinks} />
                            <NavDropdown label="Building B" items={buildingBLinks} />

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

                        {/* Mobile */}
                        <button
                            onClick={() => setMenuOpen((p) => !p)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/55 ring-1 ring-black/10 hover:bg-white/70 transition"
                            aria-label="Open menu"
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile panel */}
                    {menuOpen && (
                        <div className="md:hidden mt-4 rounded-3xl bg-[#FFF7DE]/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.14)] overflow-hidden animate-pop">
                            <div className="p-4 space-y-3">
                                <MobileGroup title="Building A" items={buildingALinks} />
                                <MobileGroup title="Building B" items={buildingBLinks} />

                                <a
                                    href="#available-spaces"
                                    className="block rounded-2xl bg-black/[0.03] ring-1 ring-black/10 px-4 py-3 text-sm font-semibold"
                                >
                                    Available Spaces
                                </a>

                                <a href="#available-spaces" className="btn-primary w-full justify-center">
                                    Book a Viewing <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}
                </Container>
            </nav>

            {/* HERO */}
            <section id="hero" className="relative pt-28 md:pt-32 pb-14 md:pb-20">
                <Container>
                    <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        {/* Copy */}
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
                                Subha Shree Bhawan in Baluwatar offers a refined, professional environment for
                                offices, premium services, and growth-ready businesses.
                            </p>

                            <div data-reveal className="mt-9 md:mt-10 flex flex-wrap gap-3">
                                <a href="#available-spaces" className="btn-primary">
                                    View Available Spaces <ArrowRight className="h-4 w-4" />
                                </a>

                                <a href="#building-a-ground" className="btn-secondary">
                                    Explore Floors <ChevronDown className="h-4 w-4" />
                                </a>
                            </div>

                            <div data-reveal className="mt-11 md:mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl">
                                <InfoTile title="Buildings" value="2 connected" icon={<Building2 className="h-4 w-4" />} />
                                <InfoTile title="Location" value="Baluwatar" icon={<MapPin className="h-4 w-4" />} />
                                <InfoTile title="Positioning" value="Premium" icon={<Star className="h-4 w-4" />} />
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="lg:col-span-5" data-reveal>
                            <MediaCard>
                                <div className="relative h-[410px] md:h-[440px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2400"
                                        alt="Subha Shree Bhawan"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7DE] via-[#FFF7DE]/20 to-transparent" />

                                    <div className="absolute left-5 right-5 bottom-5">
                                        <div className="rounded-2xl bg-white/70 backdrop-blur-xl ring-1 ring-black/10 p-4">
                                            <p className="text-[11px] tracking-[0.18em] text-slate-500 font-semibold">CONTACT</p>
                                            <div className="mt-2 grid gap-1 text-sm text-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4 text-slate-400" /> +977 980-8100067
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" /> buddhalife.np@gmail.com
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* micro highlights */}
                                <div className="p-5 border-t border-black/5">
                                    <div className="grid grid-cols-3 gap-3 text-sm">
                                        <MiniStat title="Café" value="Himalayan Java" icon={<Coffee className="h-4 w-4" />} />
                                        <MiniStat title="Clinic" value="Tesla Clinic" icon={<Stethoscope className="h-4 w-4" />} />
                                        <MiniStat title="Floors" value="Office-ready" icon={<Laptop className="h-4 w-4" />} />
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

            {/* BUILDING A */}
            <SectionHeader title="Building A" subtitle="Seven floors of excellence" />

            <Section id="building-a-ground">
                <TwoCol
                    left={
                        <>
                            <Kicker text="GROUND FLOOR • BUILDING A" />
                            <h3 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Tesla Clinic & Himalayan Java
                            </h3>

                            <div data-reveal className="space-y-4">
                                <FeatureRow
                                    icon={<Stethoscope className="h-5 w-5" />}
                                    title="Tesla Clinic"
                                    desc="Professional healthcare services with modern facilities and experienced practitioners."
                                />
                                <FeatureRow
                                    icon={<Coffee className="h-5 w-5" />}
                                    title="Himalayan Java"
                                    desc="Premium coffee experience with warm Nepali hospitality."
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
                            <h3 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Vairav Tech
                            </h3>
                            <div data-reveal>
                                <FeatureRow
                                    icon={<ShieldCheck className="h-5 w-5" />}
                                    title="Security Operations Center"
                                    desc="Modern monitoring and security services for organizations and enterprises."
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
                        />
                    }
                />
            </Section>

            <Section id="building-a-2nd">
                <VacantFloorCard
                    badge="AVAILABLE"
                    floor="2ND FLOOR • BUILDING A"
                    title="Prime Office Space"
                    image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800"
                    area="3,500 sq. ft."
                    phone="+977 980-8100067"
                />
            </Section>

            <Section id="building-a-3rd" tone="soft">
                <VacantFloorCard
                    badge="AVAILABLE"
                    floor="3RD FLOOR • BUILDING A"
                    title="Prime Office Space"
                    image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800"
                    area="3,500 sq. ft."
                    phone="+977 980-8100067"
                />
            </Section>

            <Section id="building-a-gym">
                <div className="text-center">
                    <Kicker text="4TH, 5TH AND 6TH FLOORS • BUILDING A" />
                    <h3 data-reveal className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
                        Premium Fitness Center
                        <span className="block text-slate-600">Coming soon</span>
                    </h3>
                    <p data-reveal className="mt-3 text-slate-700">Three floors of wellness.</p>
                </div>
            </Section>

            {/* AVAILABLE SPACES */}
            <Section id="available-spaces" tone="soft">
                <div className="text-center mb-10 md:mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
                        Leasing
                    </div>
                    <h2 data-reveal className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                        Available Spaces
                    </h2>
                    <p data-reveal className="mt-3 text-lg text-slate-700">
                        Premium commercial floors ready for immediate occupancy.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto" data-reveal>
                    <SpaceCard
                        building="BUILDING A"
                        floor="2nd Floor"
                        title="Prime Office Space"
                        area="3,500 sq. ft."
                        phone="+977 9808100067"
                        email="buddhalife.np@gmail.com"
                        tag="AVAILABLE NOW"
                    />
                    <SpaceCard
                        building="BUILDING A"
                        floor="3rd Floor"
                        title="Prime Office Space"
                        area="3,500 sq. ft."
                        phone="+977 9808100067"
                        email="buddhalife.np@gmail.com"
                    />
                </div>

                <div className="mt-9 md:mt-10 max-w-6xl mx-auto" data-reveal>
                    <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h4 className="text-xl md:text-2xl font-extrabold tracking-tight">Request a viewing</h4>
                            <p className="mt-2 text-slate-700">Get floor plans and leasing terms. We’ll respond quickly.</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <a href="tel:+9779808100067" className="btn-secondary justify-center">
                                Call <Phone className="h-4 w-4" />
                            </a>
                            <a href="mailto:buddhalife.np@gmail.com" className="btn-primary justify-center">
                                Email <Mail className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </Section>

            {/* BUILDING B */}
            <SectionHeader title="Building B" subtitle="Connected excellence" />

            <Section id="building-b-ground">
                <TwoCol
                    left={
                        <>
                            <Kicker text="GROUND FLOOR • BUILDING B" />
                            <h3 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight">
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
                            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1800"
                            alt="Elements Restaurant"
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
                            <h3 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Swopna Chitra
                            </h3>
                            <div data-reveal>
                                <FeatureRow
                                    icon={<Film className="h-5 w-5" />}
                                    title="Production House"
                                    desc="Creative media production supporting high-quality storytelling."
                                />
                            </div>
                        </>
                    }
                    right={<ImageCard src="/alogo.png" alt="Swopna Chitra" />}
                />
            </Section>

            <Section id="building-b-2nd">
                <TwoCol
                    left={
                        <>
                            <Kicker text="2ND FLOOR • BUILDING B" />
                            <h3 data-reveal className="text-3xl md:text-4xl font-extrabold tracking-tight">
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
                    right={<ImageCard src="/moon.jpeg" alt="Moon Technology" />}
                />
            </Section>

            {/* FOOTER */}
            <footer className="py-12 md:py-14">
                <Container>
                    <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7 md:p-8">
                        <div className="grid md:grid-cols-3 gap-10">
                            <div>
                                <h3 className="text-xl font-extrabold tracking-tight">Subha Shree Bhawan</h3>
                                <p className="mt-3 text-slate-700 leading-relaxed">
                                    A premium commercial destination offering world-class business spaces and amenities.
                                </p>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">CONTACT</h4>
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
                                        <span>buddhalife.np@gmail.com</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">FEATURES</h4>
                                <ul className="mt-4 space-y-3 text-slate-700">
                                    {["Prime location", "Modern infrastructure", "24/7 security", "Underground parking"].map((t) => (
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

            {/* Animations + buttons + soft section fade */}
            <style>{`
        html { scroll-behavior: smooth; }

        /* reveal: Stripe-ish */
        .reveal { 
          opacity: 0; 
          transform: translateY(16px); 
          filter: blur(6px);
          transition: opacity 900ms cubic-bezier(.2,.9,.2,1), transform 900ms cubic-bezier(.2,.9,.2,1), filter 900ms cubic-bezier(.2,.9,.2,1);
        }
        .reveal-in { opacity: 1; transform: translateY(0); filter: blur(0); }

        /* float bg */
        @keyframes floatSlow {
          0%, 100% { transform: translate3d(-50%,0,0) scale(1); }
          50% { transform: translate3d(-50%,16px,0) scale(1.02); }
        }
        @keyframes floatSlow2 {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(0,18px,0) scale(1.03); }
        }
        .animate-floatSlow { animation: floatSlow 10s ease-in-out infinite; }
        .animate-floatSlow2 { animation: floatSlow2 11s ease-in-out infinite; }

        /* mobile menu pop */
        @keyframes pop {
          0% { opacity: 0; transform: translateY(-8px) scale(.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop { animation: pop 220ms ease-out; }

        /* buttons: minimal, crisp */
        .btn-primary{
          display:inline-flex; align-items:center; gap:10px;
          border-radius: 18px;
          padding: 12px 20px;
          background: #0f172a;
          color: white;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 18px 50px rgba(2,6,23,.18);
          transition: transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease;
        }
        .btn-primary:hover{ transform: translateY(-1px); opacity: .96; box-shadow: 0 22px 70px rgba(2,6,23,.22); }

        .btn-secondary{
          display:inline-flex; align-items:center; gap:10px;
          border-radius: 18px;
          padding: 12px 20px;
          background: rgba(255,255,255,.55);
          border: 1px solid rgba(15,23,42,.12);
          color: #0f172a;
          font-weight: 800;
          font-size: 14px;
          transition: transform 180ms ease, background 180ms ease;
          backdrop-filter: blur(10px);
        }
        .btn-secondary:hover{ transform: translateY(-1px); background: rgba(255,255,255,.70); }
      `}</style>
        </div>
    );
}

/* ================= Layout Helpers ================= */

function Container({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`max-w-7xl mx-auto px-5 sm:px-6 ${className}`}>{children}</div>;
}

/**
 * SOFT FADE SECTION:
 * - No "dirty pillow" blocks
 * - Just a gentle glow that blends into the page
 */
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

/* ================= Components ================= */

function NavDropdown({ label, items }: { label: string; items: LinkItem[] }) {
    return (
        <div className="relative group">
            <button className="px-3 py-2 text-[12px] tracking-[0.18em] font-semibold text-slate-700 hover:text-slate-900 rounded-2xl hover:bg-black/[0.04] transition inline-flex items-center gap-2">
                {label} <ChevronDown className="h-4 w-4 opacity-70" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-64 rounded-3xl bg-white/85 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_26px_80px_rgba(15,23,42,0.14)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                {items.map((it, i) => (
                    <a
                        key={it.href}
                        href={it.href}
                        className={`block px-5 py-3 text-sm text-slate-800 hover:bg-black/[0.03] transition ${i !== items.length - 1 ? "border-b border-black/5" : ""
                            }`}
                    >
                        {it.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function MobileGroup({ title, items }: { title: string; items: LinkItem[] }) {
    return (
        <div className="rounded-2xl ring-1 ring-black/10 overflow-hidden bg-white/70 backdrop-blur-xl">
            <div className="px-4 py-3 bg-black/[0.03] text-[12px] tracking-[0.18em] text-slate-600 font-semibold">
                {title}
            </div>
            <div>
                {items.map((it, idx) => (
                    <a
                        key={it.href}
                        href={it.href}
                        className={`block px-4 py-3 text-sm text-slate-800 hover:bg-black/[0.03] transition ${idx !== items.length - 1 ? "border-b border-black/5" : ""
                            }`}
                    >
                        {it.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-5 sm:px-6">
                <div className="text-center">
                    <h2 data-reveal className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                        {title}
                    </h2>
                    <p data-reveal className="mt-3 text-xs md:text-sm tracking-[0.22em] text-slate-500">
                        {subtitle.toUpperCase()}
                    </p>
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
            <div className={["lg:col-span-6", reverse ? "lg:order-2" : "lg:order-1"].join(" ")}>
                <div className="space-y-6">{left}</div>
            </div>
            <div className={["lg:col-span-6", reverse ? "lg:order-1" : "lg:order-2"].join(" ")}>
                {right}
            </div>
        </div>
    );
}

function InfoTile({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-3xl bg-white/55 ring-1 ring-black/10 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] hover:-translate-y-[2px] hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
            <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-slate-500 font-semibold">
                <span className="text-slate-500">{icon}</span> {title.toUpperCase()}
            </div>
            <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function MiniStat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 hover:-translate-y-[1px] transition">
            <div className="flex items-center justify-between">
                <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">{title.toUpperCase()}</p>
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
}: {
    src: string;
    alt: string;
    footerLeft?: string;
    footerRight?: string;
}) {
    return (
        <MediaCard>
            <div className="relative">
                <img src={src} alt={alt} className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFF7DE]/35 via-transparent to-transparent" />
            </div>

            {(footerLeft || footerRight) && (
                <div className="p-5 border-t border-black/5">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">{footerLeft}</span>
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

function VacantFloorCard({
    badge,
    floor,
    title,
    image,
    area,
    phone,
}: {
    badge: string;
    floor: string;
    title: string;
    image: string;
    area: string;
    phone: string;
}) {
    return (
        <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
                <Kicker text={floor} />

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em] shadow-[0_18px_50px_rgba(2,6,23,0.16)]">
                    {badge}
                </div>

                <h3 data-reveal className="mt-6 text-3xl md:text-4xl font-extrabold tracking-tight">
                    {title}
                </h3>

                <div className="mt-7 rounded-3xl bg-white/55 ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">FLOOR AREA</span>
                        <span className="font-semibold">{area}</span>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm border-t border-black/5 pt-4">
                        <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">CONTACT</span>
                        <span className="font-semibold">{phone}</span>
                    </div>
                </div>
            </div>

            <ImageCard src={image} alt={title} footerLeft="STATUS" footerRight="Ready for lease" />
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

            <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">{building}</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{floor}</h3>
            <p className="mt-2 text-slate-700">{title}</p>

            <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">FLOOR AREA</span>
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
