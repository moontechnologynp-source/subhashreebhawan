"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import InquiryForm from "@/components/InquiryForm";

// ========================================
// PAGE WRAPPER
// ========================================

export default function InquiryPage() {
  return (
    <Suspense fallback={<InquiryPageLoading />}>
      <InquiryPageContent />
    </Suspense>
  );
}

// ========================================
// PAGE CONTENT
// ========================================

function InquiryPageContent() {
  const searchParams = useSearchParams();

  // Example:
  // /inquiry?building=building-a

  const buildingSlug =
    searchParams.get("building") || undefined;

  // Example:
  // /inquiry?building=building-a&floor=5

  const floorParam =
    searchParams.get("floor");

  const floorId =
    floorParam &&
    !Number.isNaN(Number(floorParam))
      ? Number(floorParam)
      : undefined;

  return (
    <main className="min-h-screen bg-[#FAF6EA] text-slate-900">
      {/* ========================================
          BACKGROUND
      ======================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />

        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px]" />

        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px]" />

        <div className="absolute inset-0 opacity-[0.05] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      {/* ========================================
          NAVIGATION
      ======================================== */}

      <nav className="sticky top-0 z-40 border-b border-black/5 bg-[#FFF7DE]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
          >
            <img
              src="/subhashree.png"
              alt="Subha Shree Bhawan"
              className="h-12 w-12"
            />

            <div>
              <p className="font-bold text-slate-900">
                Subha Shree Bhawan
              </p>

              <p className="text-xs text-slate-500">
                Request a Viewing
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 ring-1 ring-black/10 transition hover:-translate-y-[1px] hover:bg-white/90"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Back Home
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>
        </div>
      </nav>

      {/* ========================================
          CONTENT
      ======================================== */}

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
            {/* =================================
                LEFT INFORMATION
            ================================= */}

            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-bold text-slate-700 ring-1 ring-black/10">
                  <Building2 className="h-4 w-4" />

                  COMMERCIAL SPACE
                </div>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl">
                  Find the right

                  <span className="block text-slate-600">
                    space for your business.
                  </span>
                </h1>

                <p className="mt-5 leading-7 text-slate-600">
                  Select the building and floor you are
                  interested in and send us your
                  requirements. Your inquiry will go
                  directly to our management team.
                </p>

                {/* PRESELECTED INFORMATION */}

                {buildingSlug && (
                  <div className="mt-6 rounded-2xl bg-[#FFF2C7]/70 p-5 ring-1 ring-black/5">
                    <p className="text-[10px] font-bold tracking-[0.18em] text-slate-400">
                      INQUIRY FOR
                    </p>

                    <p className="mt-2 font-bold text-slate-900">
                      {formatBuildingName(buildingSlug)}
                    </p>

                    {floorId && (
                      <p className="mt-1 text-sm text-slate-600">
                        Selected floor will be loaded
                        automatically.
                      </p>
                    )}
                  </div>
                )}

                {/* CONTACT INFORMATION */}

                <div className="mt-8 space-y-4">
                  <ContactRow
                    icon={
                      <MapPin className="h-5 w-5" />
                    }
                    title="Location"
                    value="Baluwatar, Kathmandu"
                  />

                  <ContactRow
                    icon={
                      <Phone className="h-5 w-5" />
                    }
                    title="Phone"
                    value="+977 980-8100067"
                    href="tel:+9779808100067"
                  />

                  <ContactRow
                    icon={
                      <Mail className="h-5 w-5" />
                    }
                    title="Email"
                    value="buddhalifestyle.np@gmail.com"
                    href="mailto:buddhalifestyle.np@gmail.com"
                  />
                </div>

                {/* HELP */}

                <div className="mt-8 rounded-[24px] bg-white/55 p-5 ring-1 ring-black/10">
                  <p className="font-bold text-slate-900">
                    Not sure which floor?
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    You can leave the building or floor
                    selection empty and send us a general
                    inquiry. Our team can help you choose
                    the right space.
                  </p>
                </div>
              </div>
            </div>

            {/* =================================
                FORM
            ================================= */}

            <div className="lg:col-span-8">
              <InquiryForm
                defaultBuildingSlug={buildingSlug}
                defaultFloorId={floorId}
                source={
                  buildingSlug
                    ? `website-${buildingSlug}`
                    : "inquiry-page"
                }
                title="Request a Viewing"
                subtitle="Fill in the details below. You can choose a specific building and floor or send us a general inquiry."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          FOOTER
      ======================================== */}

      <footer className="pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="border-t border-black/5 pt-8 text-center text-sm text-slate-500">
            © 2026 Subha Shree Bhawan. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

// ========================================
// LOADING
// ========================================

function InquiryPageLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6EA]">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DFC8] border-t-slate-900" />

        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading inquiry form...
        </p>
      </div>
    </main>
  );
}

// ========================================
// CONTACT ROW
// ========================================

function ContactRow({
  icon,
  title,
  value,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 ring-1 ring-black/10">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          {title}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-4 rounded-2xl bg-white/55 p-4 ring-1 ring-black/10 transition hover:-translate-y-[1px] hover:bg-white/80"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white/55 p-4 ring-1 ring-black/10">
      {content}
    </div>
  );
}

// ========================================
// BUILDING NAME
// ========================================

function formatBuildingName(slug: string) {
  if (slug === "building-a") {
    return "Building A";
  }

  if (slug === "building-b") {
    return "Building B";
  }

  return slug
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}