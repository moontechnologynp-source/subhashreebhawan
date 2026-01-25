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
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
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
            { threshold: 0.14 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-[#f7f7f8] text-slate-900 antialiased">
            {/* Minimal, Apple-like ambient */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
                <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:44px_44px]" />
            </div>

            {/* NAV */}
            <nav
                className={[
                    "fixed top-0 left-0 right-0 z-40",
                    "bg-white/80 backdrop-blur-xl",
                    "border-b border-black/5",
                    navShadow ? "shadow-[0_12px_40px_rgba(15,23,42,0.08)]" : "",
                ].join(" ")}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <a href="#hero" className="inline-flex items-center gap-3">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-black/[0.04] ring-1 ring-black/10">
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
                                className="px-3 py-2 text-[12px] tracking-[0.18em] font-medium text-slate-600 hover:text-slate-900 rounded-2xl hover:bg-black/[0.04] transition"
                            >
                                AVAILABLE SPACES
                            </a>

                            <a
                                href="#available-spaces"
                                className="ml-2 inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-2 text-sm font-semibold shadow-[0_18px_50px_rgba(2,6,23,0.18)] hover:opacity-95 transition"
                            >
                                Book a Viewing <ArrowRight className="h-4 w-4" />
                            </a>
                        </div>

                        {/* Mobile */}
                        <button
                            onClick={() => setMenuOpen((p) => !p)}
                            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/[0.04] ring-1 ring-black/10 hover:bg-black/[0.06] transition"
                            aria-label="Open menu"
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>

                    {/* Mobile panel */}
                    {menuOpen && (
                        <div className="md:hidden mt-4 rounded-3xl bg-white ring-1 ring-black/10 shadow-[0_26px_80px_rgba(15,23,42,0.12)] overflow-hidden">
                            <div className="p-4 space-y-3">
                                <MobileGroup title="Building A" items={buildingALinks} />
                                <MobileGroup title="Building B" items={buildingBLinks} />

                                <a
                                    href="#available-spaces"
                                    className="block rounded-2xl bg-black/[0.04] ring-1 ring-black/10 px-4 py-3 text-sm font-semibold"
                                >
                                    Available Spaces
                                </a>

                                <a
                                    href="#available-spaces"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(2,6,23,0.18)]"
                                >
                                    Book a Viewing <ArrowRight className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <section id="hero" className="relative pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-12 gap-10 items-start">
                        {/* Copy */}
                        <div className="lg:col-span-7">
                            <div
                                data-reveal
                                className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700"
                            >
                                <Star className="h-4 w-4 text-slate-900" />
                                Premium commercial complex
                            </div>

                            <h1
                                data-reveal
                                className="mt-6 text-[44px] leading-[1.06] md:text-[64px] md:leading-[1.03] font-extrabold tracking-tight"
                            >
                                Built for modern brands.
                                <span className="block text-slate-500 font-extrabold">
                                    Designed to feel premium.
                                </span>
                            </h1>

                            <p
                                data-reveal
                                className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl"
                            >
                                Subha Shree Bhawan in Baluwatar offers a refined, professional environment for offices,
                                premium services, and growth-ready businesses.
                            </p>

                            <div data-reveal className="mt-10 flex flex-wrap gap-3">
                                <a
                                    href="#available-spaces"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-6 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(2,6,23,0.18)] hover:opacity-95 transition"
                                >
                                    View Available Spaces <ArrowRight className="h-4 w-4" />
                                </a>

                                <a
                                    href="#building-a-ground"
                                    className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-black/[0.02] transition"
                                >
                                    Explore Floors <ChevronDown className="h-4 w-4" />
                                </a>
                            </div>

                            <div data-reveal className="mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl">
                                <InfoTile title="Buildings" value="2 connected" icon={<Building2 className="h-4 w-4" />} />
                                <InfoTile title="Location" value="Baluwatar" icon={<MapPin className="h-4 w-4" />} />
                                <InfoTile title="Positioning" value="Premium" icon={<Star className="h-4 w-4" />} />
                            </div>
                        </div>

                        {/* Hero visual */}
                        <div className="lg:col-span-5" data-reveal>
                            <div className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.12)] overflow-hidden">
                                <div className="relative h-[420px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=2400"
                                        alt="Subha Shree Bhawan"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

                                    <div className="absolute left-5 right-5 bottom-5">
                                        <div className="rounded-2xl bg-white/80 backdrop-blur-xl ring-1 ring-black/10 p-4">
                                            <p className="text-xs tracking-[0.18em] text-slate-500">CONTACT</p>
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
                            </div>
                        </div>
                    </div>

                    <div className="mt-14 flex justify-center" data-reveal>
                        <div className="h-10 w-[2px] bg-gradient-to-b from-black/20 to-transparent" />
                    </div>
                </div>
            </section>

            {/* BUILDING A */}
            <SectionHeader title="Building A" subtitle="Seven floors of excellence" />

            <section id="building-a-ground" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <TwoCol
                        left={
                            <>
                                <Kicker text="GROUND FLOOR • BUILDING A" />
                                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Tesla Clinic & Himalayan Java
                                </h3>

                                <div data-reveal className="mt-8 space-y-4">
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
                </div>
            </section>

            <section id="building-a-1st" className="py-16 border-y border-black/5 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <TwoCol
                        left={<ImageCard src="/vairav.png" alt="Vairav Tech" footerLeft="FLOOR AREA" footerRight="3,500 sq. ft." />}
                        right={
                            <>
                                <Kicker text="1ST FLOOR • BUILDING A" />
                                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Vairav Tech
                                </h3>
                                <div data-reveal className="mt-8">
                                    <FeatureRow
                                        icon={<ShieldCheck className="h-5 w-5" />}
                                        title="Security Operations Center"
                                        desc="Modern monitoring and security services for organizations and enterprises."
                                    />
                                </div>
                            </>
                        }
                    />
                </div>
            </section>

            <section id="building-a-2nd" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <VacantFloorCard
                        badge="AVAILABLE"
                        floor="2ND FLOOR • BUILDING A"
                        title="Prime Office Space"
                        image="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1800"
                        area="3,500 sq. ft."
                        phone="+977 980-8100067"
                    />
                </div>
            </section>

            <section id="building-a-3rd" className="py-16 border-y border-black/5 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <VacantFloorCard
                        badge="AVAILABLE"
                        floor="3RD FLOOR • BUILDING A"
                        title="Prime Office Space"
                        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1800"
                        area="3,500 sq. ft."
                        phone="+977 980-8100067"
                    />
                </div>
            </section>

            <section id="building-a-gym" className="py-16">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <Kicker text="4TH, 5TH AND 6TH FLOORS • BUILDING A" />
                    <h3 data-reveal className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight">
                        Premium Fitness Center
                        <span className="block text-slate-500">Coming soon</span>
                    </h3>
                    <p data-reveal className="mt-4 text-slate-600">
                        Three floors of wellness.
                    </p>
                </div>
            </section>

            {/* AVAILABLE SPACES */}
            <section id="available-spaces" className="py-16 bg-white border-y border-black/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
                            Leasing
                        </div>
                        <h2 data-reveal className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight">
                            Available Spaces
                        </h2>
                        <p data-reveal className="mt-3 text-lg text-slate-600">
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

                    {/* Apple-like CTA strip */}
                    <div className="mt-10 max-w-6xl mx-auto" data-reveal>
                        <div className="rounded-[28px] bg-[#f7f7f8] ring-1 ring-black/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div>
                                <h4 className="text-xl md:text-2xl font-extrabold tracking-tight">Request a viewing</h4>
                                <p className="mt-2 text-slate-600">
                                    Get floor plans and leasing terms. We’ll respond quickly.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href="#available-spaces"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-5 py-3 text-sm font-semibold hover:bg-black/[0.02] transition"
                                >
                                    Call <Phone className="h-4 w-4" />
                                </a>
                                <a
                                    href="#available-spaces"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 text-white px-5 py-3 text-sm font-semibold shadow-[0_18px_50px_rgba(2,6,23,0.18)] hover:opacity-95 transition"
                                >
                                    Email <Mail className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BUILDING B */}
            <SectionHeader title="Building B" subtitle="Connected excellence" />

            <section id="building-b-ground" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <TwoCol
                        left={
                            <>
                                <Kicker text="GROUND FLOOR • BUILDING B" />
                                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Elements Restaurant
                                </h3>
                                <div data-reveal className="mt-8">
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
                </div>
            </section>

            <section id="building-b-1st" className="py-16 bg-white border-y border-black/5">
                <div className="max-w-7xl mx-auto px-6">
                    <TwoCol
                        left={<ImageCard src="/alogo.png" alt="Swopna Chitra" />}
                        right={
                            <>
                                <Kicker text="1ST FLOOR • BUILDING B" />
                                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Swopna Chitra
                                </h3>
                                <div data-reveal className="mt-8">
                                    <FeatureRow
                                        icon={<Film className="h-5 w-5" />}
                                        title="Production House"
                                        desc="Creative media production supporting high-quality storytelling."
                                    />
                                </div>
                            </>
                        }
                    />
                </div>
            </section>

            <section id="building-b-2nd" className="py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <TwoCol
                        left={
                            <>
                                <Kicker text="2ND FLOOR • BUILDING B" />
                                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                                    Moon Technology
                                </h3>
                                <div data-reveal className="mt-8">
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
                            />
                        }
                    />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-14">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="rounded-[28px] bg-white ring-1 ring-black/10 p-8">
                        <div className="grid md:grid-cols-3 gap-10">
                            <div>
                                <h3 className="text-xl font-extrabold tracking-tight">Subha Shree Bhawan</h3>
                                <p className="mt-3 text-slate-600 leading-relaxed">
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
                </div>
            </footer>

            <style>{`
        html { scroll-behavior: smooth; }
        .reveal { opacity: 0; transform: translateY(14px); transition: opacity 650ms ease, transform 650ms ease; }
        .reveal-in { opacity: 1; transform: translateY(0); }
      `}</style>
        </div>
    );
}

/* ================= Components ================= */

function NavDropdown({ label, items }: { label: string; items: LinkItem[] }) {
    return (
        <div className="relative group">
            <button className="px-3 py-2 text-[12px] tracking-[0.18em] font-medium text-slate-600 hover:text-slate-900 rounded-2xl hover:bg-black/[0.04] transition inline-flex items-center gap-2">
                {label} <ChevronDown className="h-4 w-4 opacity-70" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-64 rounded-3xl bg-white ring-1 ring-black/10 shadow-[0_26px_80px_rgba(15,23,42,0.12)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                {items.map((it, i) => (
                    <a
                        key={it.href}
                        href={it.href}
                        className={`block px-5 py-3 text-sm text-slate-700 hover:bg-black/[0.03] transition ${i !== items.length - 1 ? "border-b border-black/5" : ""
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
        <div className="rounded-2xl ring-1 ring-black/10 overflow-hidden bg-white">
            <div className="px-4 py-3 bg-black/[0.03] text-[12px] tracking-[0.18em] text-slate-600 font-semibold">
                {title}
            </div>
            <div>
                {items.map((it, idx) => (
                    <a
                        key={it.href}
                        href={it.href}
                        className={`block px-4 py-3 text-sm text-slate-700 hover:bg-black/[0.03] transition ${idx !== items.length - 1 ? "border-b border-black/5" : ""
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
        <div className="py-14">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 data-reveal className="text-4xl md:text-5xl font-extrabold tracking-tight">
                    {title}
                </h2>
                <p data-reveal className="mt-2 text-sm tracking-[0.18em] text-slate-500">
                    {subtitle.toUpperCase()}
                </p>
            </div>
        </div>
    );
}

function Kicker({ text }: { text: string }) {
    return (
        <div className="inline-flex items-center rounded-full bg-black/[0.04] ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
            {text}
        </div>
    );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return <div className="grid md:grid-cols-2 gap-10 items-center">{left}{right}</div>;
}

function InfoTile({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-3xl bg-white ring-1 ring-black/10 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-slate-500 font-semibold">
                <span className="text-slate-400">{icon}</span> {title.toUpperCase()}
            </div>
            <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
        </div>
    );
}

function MiniStat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3">
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
        <div className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden">
            <div className="relative">
                <img src={src} alt={alt} className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
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
        </div>
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
        <div className="flex gap-4 rounded-3xl bg-white ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)] hover:shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition">
            <div className="shrink-0 rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 text-slate-700">
                {icon}
            </div>
            <div>
                <h4 className="font-semibold text-slate-900">{title}</h4>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">{desc}</p>
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

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
                    {badge}
                </div>

                <h3 data-reveal className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight">
                    {title}
                </h3>

                <div className="mt-6 rounded-3xl bg-white ring-1 ring-black/10 p-5 shadow-[0_16px_50px_rgba(15,23,42,0.06)]">
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
        <div className="relative rounded-[28px] bg-white ring-1 ring-black/10 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] hover:shadow-[0_28px_90px_rgba(15,23,42,0.10)] transition">
            {tag && (
                <div className="absolute top-4 right-4 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
                    {tag}
                </div>
            )}

            <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">{building}</p>
            <h3 className="mt-3 text-2xl font-extrabold tracking-tight">{floor}</h3>
            <p className="mt-2 text-slate-600">{title}</p>

            <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between border-t border-black/5 pt-4">
                    <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">FLOOR AREA</span>
                    <span className="font-semibold">{area}</span>
                </div>

                <div className="flex flex-col gap-2 pt-3">
                    <div className="inline-flex items-center gap-2 text-slate-700">
                        <Phone className="h-4 w-4 text-slate-400" /> {phone}
                    </div>
                    <div className="inline-flex items-center gap-2 text-slate-700">
                        <Mail className="h-4 w-4 text-slate-400" /> {email}
                    </div>
                </div>
            </div>
        </div>
    );
}
