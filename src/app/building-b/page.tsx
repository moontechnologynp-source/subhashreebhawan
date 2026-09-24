"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

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

import {
  getBuildingBySlug,
  getFloorsByBuilding,
  getTenants,
  getGalleryByBuilding,
  getBackendImageUrl,
} from "@/lib/api";

// ========================================
// TYPES
// ========================================

type FloorStatus =
  | "available"
  | "occupied"
  | "coming_soon"
  | "inactive";

interface BuildingData {
  id: number;
  name: string;
  slug: string;

  short_description: string | null;
  description: string | null;

  address: string | null;

  total_floors: number;

  status: string;

  featured_image: string | null;

  is_featured: number;

  sort_order: number;
}

interface FloorData {
  id: number;

  building_id: number;

  building_name: string;
  building_slug: string;

  name: string;

  floor_number: number;

  slug: string;

  description: string | null;

  area_sqft:
    | number
    | string
    | null;

  status: FloorStatus;

  tenant_name: string | null;

  featured_image: string | null;

  sort_order: number;
}

interface TenantData {
  id: number;

  floor_id: number;

  name: string;

  slug: string;

  short_description: string | null;

  description: string | null;

  logo: string | null;

  website_url: string | null;

  phone: string | null;

  email: string | null;

  status:
    | "active"
    | "inactive"
    | "coming_soon";

  sort_order: number;

  floor_name: string;

  floor_number: number;

  floor_slug: string;

  building_id: number;

  building_name: string;

  building_slug: string;
}

interface GalleryItem {
  id: number;

  building_id: number | null;

  floor_id: number | null;

  tenant_id: number | null;

  title: string | null;

  description: string | null;

  image_url: string;

  alt_text: string | null;

  category:
    | "general"
    | "building"
    | "floor"
    | "tenant";

  is_featured: number;

  sort_order: number;

  is_active: number;

  building_name: string | null;

  floor_name: string | null;

  tenant_name: string | null;
}

// ========================================
// PAGE
// ========================================

export default function BuildingBPage() {
  const router = useRouter();

  const [openMenu, setOpenMenu] =
    useState<"a" | "b" | null>(null);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // ========================================
  // BACKEND DATA
  // ========================================

  const [building, setBuilding] =
    useState<BuildingData | null>(
      null
    );

  const [floors, setFloors] =
    useState<FloorData[]>([]);

  const [tenants, setTenants] =
    useState<TenantData[]>([]);

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [
    buildingAFloors,
    setBuildingAFloors,
  ] =
    useState<FloorData[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ========================================
  // LOAD BUILDING B
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const loadBuildingData =
      async () => {
        try {
          setLoading(true);
          setError("");

          // ==================================
          // BUILDING B
          // ==================================

          const buildingB =
            (await getBuildingBySlug(
              "building-b"
            )) as BuildingData;

          const [
            floorData,
            allTenantData,
            galleryData,
          ] = await Promise.all([
            getFloorsByBuilding(
              buildingB.id
            ),

            getTenants(),

            getGalleryByBuilding(
              buildingB.id
            ),
          ]);

          if (cancelled) {
            return;
          }

          const sortedFloors = (
            floorData as FloorData[]
          ).sort(
            (a, b) =>
              a.sort_order -
                b.sort_order ||
              a.floor_number -
                b.floor_number
          );

          const buildingBTenants = (
            allTenantData as TenantData[]
          )
            .filter(
              (tenant) =>
                Number(
                  tenant.building_id
                ) ===
                Number(
                  buildingB.id
                )
            )
            .sort(
              (a, b) =>
                a.sort_order -
                  b.sort_order ||
                a.id - b.id
            );

          const activeGallery = (
            galleryData as GalleryItem[]
          ).filter((item) =>
            Boolean(
              item.is_active
            )
          );

          setBuilding(
            buildingB
          );

          setFloors(
            sortedFloors
          );

          setTenants(
            buildingBTenants
          );

          setGallery(
            activeGallery
          );

          // ==================================
          // BUILDING A NAVIGATION
          // ==================================

          try {
            const buildingA =
              (await getBuildingBySlug(
                "building-a"
              )) as BuildingData;

            const aFloors =
              (await getFloorsByBuilding(
                buildingA.id
              )) as FloorData[];

            if (!cancelled) {
              setBuildingAFloors(
                aFloors.sort(
                  (a, b) =>
                    a.sort_order -
                      b.sort_order ||
                    a.floor_number -
                      b.floor_number
                )
              );
            }
          } catch (
            navigationError
          ) {
            console.warn(
              "Unable to load Building A navigation:",
              navigationError
            );
          }
        } catch (
          loadError
        ) {
          console.error(
            "Building B load error:",
            loadError
          );

          if (!cancelled) {
            setError(
              "Unable to load Building B information. Please make sure the backend is running."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    loadBuildingData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ========================================
  // TENANTS BY FLOOR
  // ========================================

  const tenantsByFloor =
    useMemo(() => {
      const map =
        new Map<
          number,
          TenantData[]
        >();

      tenants.forEach(
        (tenant) => {
          const existing =
            map.get(
              tenant.floor_id
            ) || [];

          existing.push(
            tenant
          );

          map.set(
            tenant.floor_id,
            existing
          );
        }
      );

      return map;
    }, [tenants]);

  // ========================================
  // AVAILABLE FLOORS
  // ========================================

  const availableFloors =
    useMemo(
      () =>
        floors.filter(
          (floor) =>
            floor.status ===
            "available"
        ),
      [floors]
    );

  // ========================================
  // BUILDING B NAVIGATION
  // ========================================

  const buildingBMenuFloors =
    useMemo(() => {
      return floors.map(
        (floor) => ({
          label:
            floor.name,

          id:
            getBuildingBSectionId(
              floor
            ),
        })
      );
    }, [floors]);

  // ========================================
  // BUILDING A NAVIGATION
  // ========================================

  const buildingAMenuFloors =
    useMemo(() => {
      if (
        buildingAFloors.length ===
        0
      ) {
        return [
          {
            label:
              "Ground Floor",

            id:
              "building-a-ground",
          },

          {
            label:
              "1st Floor",

            id:
              "building-a-1st",
          },

          {
            label:
              "2nd Floor",

            id:
              "building-a-2nd",
          },

          {
            label:
              "3rd Floor",

            id:
              "building-a-3rd",
          },

          {
            label:
              "Gym (4th–6th)",

            id:
              "building-a-gym",
          },
        ];
      }

      const regularFloors =
        buildingAFloors.filter(
          (floor) =>
            floor.floor_number <=
            3
        );

      const futureFloors =
        buildingAFloors.filter(
          (floor) =>
            floor.floor_number >=
            4
        );

      const items =
        regularFloors.map(
          (floor) => ({
            label:
              floor.name,

            id:
              getBuildingASectionId(
                floor
              ),
          })
        );

      if (
        futureFloors.length >
        0
      ) {
        items.push({
          label:
            getBuildingAFutureMenuLabel(
              futureFloors
            ),

          id:
            "building-a-gym",
        });
      }

      return items;
    }, [
      buildingAFloors,
    ]);

  // ========================================
  // INQUIRY URLS
  // ========================================

  // During the first render, building is null.
  // Use the known Building B slug as fallback.

  const inquiryBuildingSlug =
    building?.slug ||
    "building-b";

  const buildingInquiryUrl =
    `/inquiry?building=${encodeURIComponent(
      inquiryBuildingSlug
    )}`;

  const getFloorInquiryUrl = (
    floorId: number
  ) =>
    `/inquiry?building=${encodeURIComponent(
      inquiryBuildingSlug
    )}&floor=${floorId}`;

  // ========================================
  // REVEAL ANIMATION
  // ========================================

  useEffect(() => {
    if (loading) {
      return;
    }

    const elements =
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-reveal]"
        )
      );

    if (!elements.length) {
      return;
    }

    elements.forEach(
      (element) =>
        element.classList.add(
          "reveal"
        )
    );

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                entry.isIntersecting
              ) {
                (
                  entry.target as HTMLElement
                ).classList.add(
                  "reveal-in"
                );

                observer.unobserve(
                  entry.target
                );
              }
            }
          );
        },

        {
          threshold: 0.12,
        }
      );

    elements.forEach(
      (element) =>
        observer.observe(
          element
        )
    );

    return () =>
      observer.disconnect();
  }, [
    loading,
    floors.length,
    tenants.length,
    gallery.length,
  ]);

  // ========================================
  // OUTSIDE DROPDOWN
  // ========================================

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ========================================
  // HASH SCROLL
  // ========================================

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    ) {
      return;
    }

    const scrollToHash =
      () => {
        const id =
          resolvePendingSectionScroll(
            window.location
              .pathname
          );

        if (!id) {
          return;
        }

        const attemptScroll = (
          attemptsLeft = 12
        ) => {
          const target =
            document.getElementById(
              id
            );

          if (target) {
            const navHeight =
              document
                .querySelector(
                  "nav"
                )
                ?.getBoundingClientRect()
                .height ?? 72;

            const top =
              target.getBoundingClientRect()
                .top +
              window.scrollY -
              navHeight -
              8;

            if (
              window.location
                .hash !==
              `#${id}`
            ) {
              window.history.replaceState(
                null,
                "",
                `${window.location.pathname}#${id}`
              );
            }

            window.scrollTo({
              top,
              behavior:
                "smooth",
            });

            clearPendingSectionScroll(
              window.location
                .pathname,
              id
            );

            return;
          }

          if (
            attemptsLeft > 0
          ) {
            window.setTimeout(
              () =>
                attemptScroll(
                  attemptsLeft -
                    1
                ),
              100
            );
          }
        };

        window.setTimeout(
          () =>
            attemptScroll(),
          120
        );
      };

    scrollToHash();

    window.addEventListener(
      "hashchange",
      scrollToHash
    );

    return () =>
      window.removeEventListener(
        "hashchange",
        scrollToHash
      );
  }, [floors.length]);

  // ========================================
  // SCROLL
  // ========================================

  const scrollToSection = (
    id: string
  ) => {
    const target =
      document.getElementById(
        id
      );

    if (target) {
      const navHeight =
        document
          .querySelector("nav")
          ?.getBoundingClientRect()
          .height ?? 72;

      const top =
        target.getBoundingClientRect()
          .top +
        window.scrollY -
        navHeight -
        8;

      window.history.replaceState(
        null,
        "",
        `#${id}`
      );

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      setOpenMenu(null);

      setMobileOpen(false);
    }
  };

  // ========================================
  // CROSS-PAGE NAVIGATION
  // ========================================

  const navigateToPageSection = (
    pathname:
      | "/building-a"
      | "/building-b",

    id: string
  ) => {
    queuePendingSectionScroll(
      pathname,
      id
    );

    setOpenMenu(null);

    setMobileOpen(false);

    router.push(pathname);
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF6EA] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DFC8] border-t-slate-900" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Loading Building B...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (
    error ||
    !building
  ) {
    return (
      <div className="min-h-screen bg-[#FAF6EA] flex items-center justify-center px-5">
        <div className="max-w-lg rounded-[30px] bg-white/70 p-8 text-center ring-1 ring-black/10 shadow-xl">
          <Building2 className="mx-auto h-10 w-10 text-slate-500" />

          <h1 className="mt-5 text-2xl font-extrabold">
            Building B could
            not be loaded
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {error ||
              "Building information is currently unavailable."}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ========================================
  // HERO
  // ========================================

  const heroDescription =
    building.description ||
    building.short_description ||
    "Building B brings together premium dining, creative production, and innovative technology under one refined commercial address.";

  const totalFloors =
    Number(
      building.total_floors
    ) || floors.length;

  // ========================================
  // UI
  // ========================================

  return (
    <div className="min-h-screen bg-[#FAF6EA] text-slate-900 antialiased">
      {/* ===================================
          BACKGROUND
      =================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />

        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px]" />

        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px]" />
      </div>

      {/* ===================================
          NAVIGATION
      =================================== */}

      <nav className="sticky top-0 z-40 border-b border-black/5 bg-[#F2EBD7]/80 backdrop-blur-xl">
        <Container>
          <div className="flex items-center justify-between py-3">
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <img
                src="/subhashree.png"
                alt="Subha Shree Bhawan Logo"
                className="h-12 w-12"
              />

              <div>
                <p className="text-sm font-semibold">
                  Subha Shree
                  Bhawan
                </p>

                <p className="text-xs text-slate-500">
                  {
                    building.name
                  }
                </p>
              </div>
            </Link>

            {/* DESKTOP MENU */}

            <div
              ref={
                dropdownRef
              }
              className="hidden xl:flex items-center gap-2"
            >
              <div className="relative flex items-center gap-2">
                <DropdownPill
                  label="Building A"
                  active={
                    openMenu ===
                    "a"
                  }
                  onClick={() =>
                    setOpenMenu(
                      openMenu ===
                        "a"
                        ? null
                        : "a"
                    )
                  }
                />

                <DropdownPill
                  label="Building B"
                  active={
                    openMenu ===
                    "b"
                  }
                  onClick={() =>
                    setOpenMenu(
                      openMenu ===
                        "b"
                        ? null
                        : "b"
                    )
                  }
                />

                {openMenu ===
                  "a" && (
                  <DropdownMenu
                    items={
                      buildingAMenuFloors
                    }
                    onSelect={(
                      id
                    ) =>
                      navigateToPageSection(
                        "/building-a",
                        id
                      )
                    }
                  />
                )}

                {openMenu ===
                  "b" && (
                  <DropdownMenu
                    items={
                      buildingBMenuFloors
                    }
                    onSelect={(
                      id
                    ) =>
                      scrollToSection(
                        id
                      )
                    }
                  />
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push("/")
                }
                className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-black/10 transition hover:translate-y-[-1px]"
              >
                Back Home
              </button>

              <Link
                href={
                  buildingInquiryUrl
                }
                className="btn-primary"
              >
                Request a Viewing

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* MOBILE BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMobileOpen(
                  (previous) =>
                    !previous
                )
              }
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

          {/* =================================
              MOBILE MENU
          ================================= */}

          {mobileOpen && (
            <div className="xl:hidden pb-4">
              <div className="mt-2 rounded-3xl bg-[#FFF7DE]/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.14)] overflow-hidden">
                <div className="p-4 space-y-2">
                  {/* BUILDING A */}

                  <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                    <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                      BUILDING A
                    </p>

                    <div className="border-t border-black/5">
                      {buildingAMenuFloors.map(
                        (
                          floor
                        ) => (
                          <button
                            key={
                              floor.id
                            }
                            type="button"
                            onClick={() =>
                              navigateToPageSection(
                                "/building-a",
                                floor.id
                              )
                            }
                            className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-black/[0.03] transition border-b border-black/5 last:border-0"
                          >
                            {
                              floor.label
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* BUILDING B */}

                  <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                    <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                      BUILDING B
                    </p>

                    <div className="border-t border-black/5">
                      {buildingBMenuFloors.map(
                        (
                          floor
                        ) => (
                          <button
                            key={
                              floor.id
                            }
                            type="button"
                            onClick={() =>
                              scrollToSection(
                                floor.id
                              )
                            }
                            className="flex w-full items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-black/[0.03] transition border-b border-black/5 last:border-0"
                          >
                            {
                              floor.label
                            }
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      router.push(
                        "/"
                      );

                      setMobileOpen(
                        false
                      );
                    }}
                    className="w-full rounded-2xl bg-white/70 ring-1 ring-black/10 px-4 py-3 text-sm font-semibold text-left"
                  >
                    Back Home
                  </button>

                  <Link
                    href={
                      buildingInquiryUrl
                    }
                    onClick={() =>
                      setMobileOpen(
                        false
                      )
                    }
                    className="btn-primary w-full justify-center"
                  >
                    Request a Viewing

                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Container>
      </nav>

      {/* ===================================
          HERO
      =================================== */}

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
              {
                building.name
              }

              <span className="block text-slate-600">
                Modern business,
                dining and
                creativity
              </span>
            </h1>

            <p
              data-reveal
              className="mt-5 max-w-2xl text-lg text-slate-700 leading-relaxed"
            >
              {
                heroDescription
              }
            </p>

            <div
              data-reveal
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <div className="inline-flex rounded-full bg-white/55 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-black/10">
                {totalFloors}{" "}
                {totalFloors === 1
                  ? "Floor"
                  : "Floors"}
              </div>

              <Link
                href={
                  buildingInquiryUrl
                }
                className="btn-primary"
              >
                Request a Viewing

                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ===================================
          FLOOR DIRECTORY
      =================================== */}

      <Section
        id="floor-labels"
        tone="soft"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
            {building.name} Floor
            Labels
          </div>

          <h2
            data-reveal
            className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            Floor Directory
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {floors.map(
            (floor) => {
              const floorTenants =
                tenantsByFloor.get(
                  floor.id
                ) || [];

              return (
                <FloorLabelCard
                  key={
                    floor.id
                  }
                  floor={
                    floor.name
                  }
                  title={getFloorTitle(
                    floor,
                    floorTenants
                  )}
                  status={formatStatus(
                    floor.status
                  )}
                  highlight={
                    floor.status ===
                    "available"
                  }
                />
              );
            }
          )}
        </div>
      </Section>

      {/* ===================================
          FLOOR SECTIONS
      =================================== */}

      {floors.map(
        (
          floor,
          index
        ) => {
          const floorTenants =
            tenantsByFloor.get(
              floor.id
            ) || [];

          const visual =
            getFloorVisual(
              floor,
              floorTenants,
              gallery
            );

          const mainTenant =
            floorTenants[0];

          const website =
            mainTenant
              ? getTenantWebsite(
                  mainTenant
                )
              : null;

          return (
            <Section
              key={
                floor.id
              }
              id={getBuildingBSectionId(
                floor
              )}
              tone={
                index % 2 === 1
                  ? "soft"
                  : "base"
              }
            >
              <TwoCol
                left={
                  <>
                    <Kicker
                      text={`${floor.name.toUpperCase()} • ${building.name.toUpperCase()}`}
                    />

                    <h2
                      data-reveal
                      className="text-3xl md:text-4xl font-extrabold tracking-tight"
                    >
                      {getFloorTitle(
                        floor,
                        floorTenants
                      )}
                    </h2>

                    <div
                      data-reveal
                      className="space-y-1"
                    >
                      {floorTenants.length >
                      0 ? (
                        floorTenants.map(
                          (
                            tenant
                          ) => (
                            <FeatureRow
                              key={
                                tenant.id
                              }
                              icon={getTenantIcon(
                                tenant
                              )}
                              title={
                                tenant.name
                              }
                              desc={
                                tenant.short_description ||
                                tenant.description ||
                                `${tenant.name} operates from ${floor.name} of ${building.name}.`
                              }
                            />
                          )
                        )
                      ) : (
                        <FeatureRow
                          icon={
                            <Building2 className="h-5 w-5" />
                          }
                          title={formatStatus(
                            floor.status
                          )}
                          desc={
                            floor.description ||
                            getFloorStatusDescription(
                              floor
                            )
                          }
                        />
                      )}
                    </div>

                    {/* =================================
                        FLOOR ACTIONS
                    ================================= */}

                    {(website ||
                      floor.status ===
                        "available") && (
                      <div
                        data-reveal
                        className="pt-3 flex flex-wrap gap-3"
                      >
                        {floor.status ===
                          "available" && (
                          <Link
                            href={getFloorInquiryUrl(
                              floor.id
                            )}
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_45px_rgba(252,211,77,0.22)] transition hover:-translate-y-[1px]"
                          >
                            Request Viewing
                            for{" "}
                            {
                              floor.name
                            }

                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        )}

                        {website && (
                          <a
                            href={
                              website
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] transition hover:translate-y-[-1px]"
                          >
                            Visit Website

                            <ArrowRight className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )}
                  </>
                }
                right={
                  website ? (
                    <a
                      href={
                        website
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${mainTenant?.name || "tenant"} website`}
                      className="block cursor-pointer transition duration-300 hover:brightness-105"
                    >
                      <ImageCard
                        src={
                          visual.src
                        }
                        alt={
                          visual.alt
                        }
                        fit={
                          visual.isBackendImage
                            ? "cover"
                            : "contain"
                        }
                        zoom="scale-100"
                      />
                    </a>
                  ) : (
                    <ImageCard
                      src={
                        visual.src
                      }
                      alt={
                        visual.alt
                      }
                      fit={
                        visual.isBackendImage
                          ? "cover"
                          : "contain"
                      }
                      zoom="scale-100"
                    />
                  )
                }
              />
            </Section>
          );
        }
      )}

      {/* ===================================
          CONTACT
      =================================== */}

      <Section
        id="contact-actions"
        tone="soft"
      >
        <div className="max-w-5xl mx-auto rounded-[32px] bg-white/60 ring-1 ring-black/10 p-8 md:p-10 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-xs font-bold tracking-[0.18em]">
              REQUEST A VIEWING
            </div>

            <h2
              data-reveal
              className="mt-5 text-3xl md:text-4xl font-extrabold tracking-tight"
            >
              Interested in{" "}
              {building.name}?
            </h2>

            <p
              data-reveal
              className="mt-3 text-slate-700 max-w-2xl mx-auto"
            >
              Submit a viewing
              request online, call
              us directly, or send
              us an email.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {/* ONLINE INQUIRY */}

            <Link
              href={
                buildingInquiryUrl
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 text-white font-semibold shadow-[0_20px_60px_rgba(15,23,42,0.18)] hover:translate-y-[-1px] transition"
            >
              Request a Viewing

              <ArrowRight className="h-5 w-5" />
            </Link>

            {/* PHONE */}

            <a
              href="tel:+9779808100067"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-slate-900 font-semibold ring-1 ring-black/10 hover:translate-y-[-1px] transition"
            >
              <Phone className="h-5 w-5" />

              Call Now
            </a>

            {/* EMAIL */}

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

      {/* ===================================
          FOOTER
      =================================== */}

      <footer className="py-12">
        <Container>
          <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7">
            <div className="grid md:grid-cols-3 gap-10">
              {/* BUILDING */}

              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  {
                    building.name
                  }
                </h3>

                <p className="mt-3 text-slate-700 leading-relaxed">
                  {building.short_description ||
                    "A connected destination for dining, production, and technology-focused businesses."}
                </p>

                <a
                  href="/blog"
                  className="mt-4 inline-flex font-semibold text-slate-700 hover:text-slate-950 transition"
                >
                  Visit our blog →
                </a>
              </div>

              {/* CONTACT */}

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  CONTACT
                </h4>

                <div className="mt-4 space-y-3 text-slate-700">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />

                    <span>
                      {building.address ||
                        "Baluwatar, Kathmandu"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />

                    <span>
                      +977
                      980-8100067
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />

                    <span>
                      buddhalifestyle.np@gmail.com
                    </span>
                  </div>
                </div>

                <Link
                  href={
                    buildingInquiryUrl
                  }
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-slate-900"
                >
                  Request a Viewing

                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* TENANTS */}

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  TENANTS
                </h4>

                {tenants.length >
                0 ? (
                  <ul className="mt-4 space-y-3 text-slate-700">
                    {tenants.map(
                      (tenant) => (
                        <li
                          key={
                            tenant.id
                          }
                        >
                          {
                            tenant.name
                          }
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-4 text-slate-500">
                    Tenant
                    information
                    coming soon.
                  </p>
                )}

                <p className="mt-5 text-sm font-semibold text-slate-700">
                  {availableFloors.length >
                  0
                    ? `${availableFloors.length} ${
                        availableFloors.length ===
                        1
                          ? "floor is"
                          : "floors are"
                      } currently available.`
                    : "Floor availability is updated from the admin panel."}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

// ========================================
// DATA HELPERS
// ========================================

function getBuildingBSectionId(
  floor: FloorData
) {
  if (
    floor.floor_number ===
    0
  ) {
    return "building-b-ground";
  }

  return `building-b-${floor.slug.replace(
    /-floor$/,
    ""
  )}`;
}

function getBuildingASectionId(
  floor: FloorData
) {
  if (
    floor.floor_number ===
    0
  ) {
    return "building-a-ground";
  }

  return `building-a-${floor.slug.replace(
    /-floor$/,
    ""
  )}`;
}

function getBuildingAFutureMenuLabel(
  floors: FloorData[]
) {
  if (
    floors.length === 0
  ) {
    return "Future Floors";
  }

  if (
    floors.length === 1
  ) {
    return floors[0].name;
  }

  const first =
    floors[0].name.replace(
      " Floor",
      ""
    );

  const last =
    floors[
      floors.length - 1
    ].name.replace(
      " Floor",
      ""
    );

  return `Gym (${first}–${last})`;
}

function formatStatus(
  status: FloorStatus
) {
  switch (status) {
    case "available":
      return "Available";

    case "occupied":
      return "Occupied";

    case "coming_soon":
      return "Coming Soon";

    case "inactive":
      return "Inactive";

    default:
      return status;
  }
}

function getFloorTitle(
  floor: FloorData,
  floorTenants: TenantData[]
) {
  if (
    floorTenants.length >
    0
  ) {
    return floorTenants
      .map(
        (tenant) =>
          tenant.name
      )
      .join(" & ");
  }

  if (
    floor.status ===
    "available"
  ) {
    return "Available Space";
  }

  if (
    floor.status ===
    "coming_soon"
  ) {
    return "Coming Soon";
  }

  return floor.name;
}

function getFloorStatusDescription(
  floor: FloorData
) {
  switch (floor.status) {
    case "available":
      return `${floor.name} is currently available for occupancy.`;

    case "occupied":
      return `${floor.name} is currently occupied.`;

    case "coming_soon":
      return `${floor.name} is being prepared and will be available soon.`;

    case "inactive":
      return `${floor.name} is currently inactive.`;

    default:
      return (
        floor.description ||
        ""
      );
  }
}

// ========================================
// TENANT WEBSITE
// ========================================

function getTenantWebsite(
  tenant: TenantData
) {
  if (
    tenant.website_url &&
    tenant.website_url.trim()
  ) {
    return tenant.website_url.trim();
  }

  switch (tenant.slug) {
    case "the-bengal-restaurant":
      return "https://thebengalrestaurantandbar.com/";

    case "swopna-chitra":
      return "https://swopnachitra.com/";

    case "moon-technology":
      return "https://www.moontechnology.com.np/";

    default:
      return null;
  }
}

// ========================================
// TENANT ICON
// ========================================

function getTenantIcon(
  tenant: TenantData
) {
  const value =
    `${tenant.name} ${tenant.slug}`.toLowerCase();

  if (
    value.includes(
      "restaurant"
    ) ||
    value.includes(
      "bengal"
    )
  ) {
    return (
      <Utensils className="h-5 w-5" />
    );
  }

  if (
    value.includes(
      "swopna"
    ) ||
    value.includes(
      "film"
    ) ||
    value.includes(
      "production"
    )
  ) {
    return (
      <Film className="h-5 w-5" />
    );
  }

  if (
    value.includes(
      "moon"
    ) ||
    value.includes(
      "technology"
    ) ||
    value.includes(
      "software"
    )
  ) {
    return (
      <Laptop className="h-5 w-5" />
    );
  }

  return (
    <Building2 className="h-5 w-5" />
  );
}

// ========================================
// FLOOR IMAGE
// ========================================

function getFloorVisual(
  floor: FloorData,
  floorTenants: TenantData[],
  gallery: GalleryItem[]
) {
  // ======================================
  // FIRST:
  // image directly assigned to this floor
  // ======================================

  const floorImage =
    gallery.find(
      (item) =>
        Number(
          item.floor_id
        ) ===
          Number(
            floor.id
          ) &&
        Boolean(
          item.is_active
        )
    );

  if (floorImage) {
    return {
      src:
        getBackendImageUrl(
          floorImage.image_url
        ),

      alt:
        floorImage.alt_text ||
        floorImage.title ||
        floor.name,

      isBackendImage:
        true,
    };
  }

  // ======================================
  // SECOND:
  // tenant image
  // ======================================

  const tenantIds =
    floorTenants.map(
      (tenant) =>
        tenant.id
    );

  const tenantImage =
    gallery.find(
      (item) =>
        item.tenant_id !==
          null &&
        tenantIds.includes(
          Number(
            item.tenant_id
          )
        ) &&
        Boolean(
          item.is_active
        )
    );

  if (tenantImage) {
    return {
      src:
        getBackendImageUrl(
          tenantImage.image_url
        ),

      alt:
        tenantImage.alt_text ||
        tenantImage.title ||
        floor.name,

      isBackendImage:
        true,
    };
  }

  // ======================================
  // THIRD:
  // existing tenant logo URL
  // ======================================

  const tenantLogo =
    floorTenants.find(
      (tenant) =>
        Boolean(
          tenant.logo
        )
    );

  if (
    tenantLogo?.logo
  ) {
    return {
      src:
        getBackendImageUrl(
          tenantLogo.logo
        ),

      alt:
        tenantLogo.name,

      isBackendImage:
        true,
    };
  }

  // ======================================
  // FALLBACK:
  // original public images
  // ======================================

  const fallback =
    getStaticFloorImage(
      floor.floor_number
    );

  return {
    src:
      fallback.src,

    alt:
      fallback.alt,

    isBackendImage:
      false,
  };
}

function getStaticFloorImage(
  floorNumber: number
) {
  switch (
    floorNumber
  ) {
    case 0:
      return {
        src:
          "/bengal.jpg",

        alt:
          "The Bengal Restaurant",
      };

    case 1:
      return {
        src:
          "/Swopna.png",

        alt:
          "Swopna Chitra",
      };

    case 2:
      return {
        src:
          "/moon.jpeg",

        alt:
          "Moon Technology",
      };

    default:
      return {
        src:
          "/subhashree.png",

        alt:
          "Subha Shree Bhawan",
      };
  }
}

// ========================================
// CONTAINER
// ========================================

function Container({
  children,
  className = "",
}: {
  children:
    React.ReactNode;

  className?: string;
}) {
  return (
    <div
      className={`max-w-7xl mx-auto px-5 sm:px-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ========================================
// SECTION
// ========================================

function Section({
  id,
  tone = "base",
  children,
}: {
  id?: string;

  tone?:
    | "base"
    | "soft";

  children:
    React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative py-14 md:py-20 scroll-mt-24"
    >
      {tone ===
        "soft" && (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFF2C7]/28 to-transparent" />
        </div>
      )}

      <Container>
        {children}
      </Container>
    </section>
  );
}

// ========================================
// TWO COLUMN
// ========================================

function TwoCol({
  left,
  right,
}: {
  left:
    React.ReactNode;

  right:
    React.ReactNode;

  reverse?: boolean;
}) {
  return (
    <div className="group relative mx-auto max-w-5xl rounded-[36px] bg-white/65 p-2 shadow-[0_32px_100px_rgba(15,23,42,0.14)] ring-1 ring-black/[0.08] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:shadow-[0_38px_120px_rgba(15,23,42,0.19)]">
      <div className="building-visual">
        {right}
      </div>

      <div className="pointer-events-none absolute inset-2 rounded-[28px] bg-gradient-to-b from-slate-950/35 via-transparent to-transparent" />

      <div className="building-copy absolute left-2 top-2 z-10 p-5 md:p-8">
        <div>
          {left}
        </div>
      </div>
    </div>
  );
}

// ========================================
// MEDIA CARD
// ========================================

function MediaCard({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] overflow-hidden">
      {children}
    </div>
  );
}

// ========================================
// KICKER
// ========================================

function Kicker({
  text,
}: {
  text: string;
}) {
  return (
    <div className="inline-flex items-center rounded-2xl border border-white/40 bg-white/90 px-4 py-2.5 text-[11px] font-bold tracking-[0.16em] text-slate-950 shadow-[0_12px_35px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      {text}
    </div>
  );
}

// ========================================
// FLOOR LABEL
// ========================================

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
            highlight
              ? "text-white/80"
              : "text-slate-500"
          }`}
        >
          {floor.toUpperCase()}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.18em] ${
            highlight
              ? "bg-white text-slate-900"
              : "bg-slate-900 text-white"
          }`}
        >
          {status.toUpperCase()}
        </span>
      </div>

      <h3 className="mt-4 text-lg font-extrabold tracking-tight">
        {title}
      </h3>
    </div>
  );
}

// ========================================
// IMAGE CARD
// ========================================

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

  fit?:
    | "cover"
    | "contain";
}) {
  const lowerSrc =
    src.toLowerCase();

  const backdropClass =
    lowerSrc.includes(
      "bengal"
    ) ||
    lowerSrc.includes(
      "swopna"
    )
      ? "bg-[#050505]"
      : lowerSrc.includes(
            "moon"
          )
        ? "bg-[#f1f3f5]"
        : "bg-[#fffdfa]";

  return (
    <MediaCard>
      <div
        className={`relative ${heightClass} overflow-hidden ${backdropClass}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.16),transparent_58%)]" />

        <img
          src={src}
          alt={alt}
          className={[
            "absolute inset-0 h-full w-full",

            fit === "contain"
              ? "object-contain p-4"
              : "object-cover",

            crop,

            zoom,
          ].join(" ")}
        />
      </div>
    </MediaCard>
  );
}

// ========================================
// FEATURE ROW
// ========================================

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon:
    React.ReactNode;

  title: string;

  desc: string;
}) {
  return (
    <div className="flex gap-4 border-t border-white/10 py-5 first:border-t-0">
      <div className="shrink-0 self-start rounded-xl bg-amber-300 p-2.5 text-slate-950 shadow-[0_10px_30px_rgba(252,211,77,0.18)]">
        {icon}
      </div>

      <div>
        <h4 className="font-bold tracking-tight text-white">
          {title}
        </h4>

        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
          {desc}
        </p>
      </div>
    </div>
  );
}

// ========================================
// DROPDOWN PILL
// ========================================

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
      onClick={
        onClick
      }
      className={[
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",

        active
          ? "bg-[#E8DFC8] text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
          : "bg-transparent text-slate-700 hover:bg-[#EDE4CF]",
      ].join(" ")}
    >
      <span>
        {label}
      </span>

      <ChevronDown
        className={`h-4 w-4 transition-transform duration-200 ${
          active
            ? "rotate-180"
            : ""
        }`}
      />
    </button>
  );
}

// ========================================
// DROPDOWN MENU
// ========================================

function DropdownMenu({
  items,
  onSelect,
}: {
  items: {
    label: string;
    id: string;
  }[];

  onSelect: (
    id: string
  ) => void;
}) {
  return (
    <div className="absolute left-0 top-[48px] z-50 w-[200px] overflow-hidden rounded-2xl border border-black/10 bg-[#F7F7F7]/95 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="py-1">
        {items.map(
          (
            item,
            index
          ) => (
            <button
              key={
                item.id
              }
              type="button"
              onClick={() =>
                onSelect(
                  item.id
                )
              }
              className={[
                "flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-800 transition hover:bg-black/[0.04]",

                index !==
                items.length -
                  1
                  ? "border-b border-black/5"
                  : "",
              ].join(" ")}
            >
              {
                item.label
              }
            </button>
          )
        )}
      </div>
    </div>
  );
}