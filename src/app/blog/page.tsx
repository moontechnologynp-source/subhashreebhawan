import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | Subha Shree Bhawan",
  description:
    "News, insights, and updates from Subha Shree Bhawan in Baluwatar, Kathmandu.",
};

const posts = [
  {
    category: "Workspace",
    date: "August 12, 2026",
    title: "Why Location and Building Quality Matter When Choosing a Rental Building in Kathmandu",
    excerpt:
      "Discover why location, building quality, accessibility, facilities, and maintenance matter when choosing a rental building in Kathmandu.",
    image: "/blo.png",
    href: "/blog/why-location-and-building-quality-matter-in-kathmandu",
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

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-6 md:pb-24 md:pt-28">
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-[0.22em] text-amber-700">OUR JOURNAL</p>
          <h1 className="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl">Ideas, updates, and stories from the Bhawan.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
            Explore practical workplace insights, neighbourhood stories, and the latest news from Subha Shree Bhawan.
          </p>
        </div>

        <div className="mt-14 max-w-4xl">
          {posts.map((post) => {
            return (
              <article key={post.title} className="group overflow-hidden rounded-[28px] bg-white/60 ring-1 ring-black/10 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/75 md:grid md:grid-cols-2">
                <Link href={post.href} className="relative block aspect-[16/10] overflow-hidden md:aspect-auto">
                  <Image src={post.image} alt="Why Location and Building Quality Matter" fill className="object-cover transition duration-500 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 448px" />
                </Link>
                <div className="flex min-h-[360px] flex-col p-7 md:p-9">
                  <span className="w-fit rounded-full bg-[#FFF2C7] px-3 py-1.5 text-xs font-bold text-amber-800">{post.category}</span>
                  <p className="mt-7 text-sm text-slate-500">{post.date}</p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{post.title}</h2>
                  <p className="mt-4 flex-1 leading-relaxed text-slate-600">{post.excerpt}</p>
                  <Link href={post.href} className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
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
