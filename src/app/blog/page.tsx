import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Subha Shree Bhawan",
  description:
    "News, insights, and updates from Subha Shree Bhawan in Baluwatar, Kathmandu.",
};

const posts = [
  {
    category: "Commercial Property",
    date: "August 14, 2026",
    title: "What to Look for Before Choosing a Commercial Building for Rent in Kathmandu",
    excerpt:
      "Learn the key factors to consider, including location, accessibility, parking, building quality, facilities, and long-term value.",
    image: "/commercial-building-rent-kathmandu-clean.png",
    href: "/blog/commercial-building-for-rent-in-kathmandu",
    readTime: "9 min read",
  },
  {
    category: "Workspace",
    date: "August 12, 2026",
    title: "Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu",
    excerpt:
      "Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.",
    image: "/blo.png",
    href: "/blog/why-location-and-building-quality-matter-in-kathmandu",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FAF6EA] text-slate-900 antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />
        <div className="absolute -top-64 right-[-180px] h-[680px] w-[680px] rounded-full bg-[#FFD27A]/25 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      <header className="relative z-10 border-b border-black/5 bg-[#FFF7DE]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/subhashree.png" alt="Subha Shree Bhawan logo" width={80} height={80} className="h-20 w-20 pb-2" priority />
            <span className="font-semibold tracking-tight">Subha Shree Bhawan</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-white/60 px-4 py-2 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-white/80">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24">
        <div className="grid items-end gap-10 border-b border-black/10 pb-14 lg:grid-cols-[1fr_320px]">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-xs font-bold tracking-[0.2em] text-amber-800 ring-1 ring-black/10">
              <BookOpen className="h-4 w-4" /> OUR JOURNAL
            </div>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              Property insight,
              <span className="block text-slate-500">made useful.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
              Practical guidance for choosing better workspaces and commercial property in Kathmandu.
            </p>
          </div>
          <div className="hidden rounded-[28px] bg-slate-950 p-7 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] lg:block">
            <p className="text-xs font-bold tracking-[0.18em] text-amber-300">SUBHA SHREE BHAWAN</p>
            <p className="mt-4 text-2xl font-extrabold tracking-tight">Local knowledge for better property decisions.</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">Thoughtful articles from Baluwatar, Kathmandu.</p>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight">Latest stories</h2>
          <span className="text-sm font-semibold text-slate-500">{posts.length} articles</span>
        </div>

        <div className="mt-6 grid gap-8">
          {posts.map((post, index) => {
            return (
              <article key={post.title} className="group overflow-hidden rounded-[32px] bg-white/70 ring-1 ring-black/[0.08] shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_32px_100px_rgba(15,23,42,0.14)] md:grid md:grid-cols-[1.08fr_0.92fr]">
                <Link href={post.href} className={`relative block min-h-[340px] overflow-hidden md:min-h-[470px] ${index % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image src={post.image} alt={post.title} fill className="object-cover transition duration-700 group-hover:scale-[1.035]" sizes="(max-width: 768px) 100vw, 55vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  {index === 0 && <span className="absolute left-5 top-5 rounded-full bg-slate-950/85 px-4 py-2 text-[11px] font-bold tracking-[0.15em] text-white backdrop-blur-md">FEATURED</span>}
                </Link>
                <div className={`flex min-h-[390px] flex-col justify-center p-7 md:p-12 ${index % 2 === 1 ? "md:order-1" : ""}`}>
                  <span className="w-fit rounded-full bg-[#FFF2C7] px-3 py-1.5 text-xs font-bold text-amber-800">{post.category}</span>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span>{post.date}</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" /> {post.readTime}</span>
                  </div>
                  <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{post.title}</h2>
                  <p className="mt-5 leading-relaxed text-slate-600">{post.excerpt}</p>
                  <Link href={post.href} className="mt-8 inline-flex w-fit items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_40px_rgba(15,23,42,0.16)] transition hover:bg-slate-800">
                    Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <footer className="relative z-10 px-5 pb-10 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-black/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Subha Shree Bhawan. All rights reserved.</span>
          <Link href="/" className="font-semibold text-slate-700 hover:text-slate-950">Return to homepage</Link>
        </div>
      </footer>
    </main>
  );
}
