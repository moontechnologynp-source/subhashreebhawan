"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Building2,
  ChevronDown,
  Coffee,
  Film,
  Laptop,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  Star,
  Stethoscope,
  Utensils,
  X,
} from "lucide-react";

import {
  queuePendingSectionScroll,
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
// INQUIRY URLS
// ========================================

const GENERAL_INQUIRY_URL =
  "/inquiry";

const BUILDING_A_INQUIRY_URL =
  "/inquiry?building=building-a";

const BUILDING_B_INQUIRY_URL =
  "/inquiry?building=building-b";

// ========================================
// FALLBACK DATA
// ========================================

const fallbackBuildingA: BuildingData = {
  id: -1,
  name: "Building A",
  slug: "building-a",

  short_description:
    "Seven floors of excellence",

  description:
    "Explore the complete Building A experience including premium ground-floor amenities, office spaces, occupied floors, and future-ready spaces.",

  address:
    "Baluwatar, Kathmandu",

  total_floors: 7,

  status: "active",

  featured_image: null,

  is_featured: 1,

  sort_order: 1,
};

const fallbackBuildingB: BuildingData = {
  id: -2,
  name: "Building B",
  slug: "building-b",

  short_description:
    "Connected excellence",

  description:
    "Building B brings together premium dining, creative production, and innovative technology under one refined commercial address.",

  address:
    "Baluwatar, Kathmandu",

  total_floors: 3,

  status: "active",

  featured_image: null,

  is_featured: 1,

  sort_order: 2,
};

const fallbackFloorsA: FloorData[] = [
  {
    id: -101,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "Ground Floor",

    floor_number: 0,

    slug:
      "ground-floor",

    description: null,

    area_sqft: null,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 0,
  },

  {
    id: -102,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "1st Floor",

    floor_number: 1,

    slug:
      "1st-floor",

    description: null,

    area_sqft: 3500,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 1,
  },

  {
    id: -103,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "2nd Floor",

    floor_number: 2,

    slug:
      "2nd-floor",

    description: null,

    area_sqft: 3500,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 2,
  },

  {
    id: -104,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "3rd Floor",

    floor_number: 3,

    slug:
      "3rd-floor",

    description: null,

    area_sqft: 3500,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 3,
  },

  {
    id: -105,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "4th Floor",

    floor_number: 4,

    slug:
      "4th-floor",

    description: null,

    area_sqft: null,

    status:
      "coming_soon",

    tenant_name: null,

    featured_image: null,

    sort_order: 4,
  },

  {
    id: -106,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "5th Floor",

    floor_number: 5,

    slug:
      "5th-floor",

    description: null,

    area_sqft: null,

    status:
      "coming_soon",

    tenant_name: null,

    featured_image: null,

    sort_order: 5,
  },

  {
    id: -107,

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",

    name:
      "6th Floor",

    floor_number: 6,

    slug:
      "6th-floor",

    description: null,

    area_sqft: null,

    status:
      "coming_soon",

    tenant_name: null,

    featured_image: null,

    sort_order: 6,
  },
];

const fallbackFloorsB: FloorData[] = [
  {
    id: -201,

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",

    name:
      "Ground Floor",

    floor_number: 0,

    slug:
      "ground-floor",

    description: null,

    area_sqft: null,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 0,
  },

  {
    id: -202,

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",

    name:
      "1st Floor",

    floor_number: 1,

    slug:
      "1st-floor",

    description: null,

    area_sqft: null,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 1,
  },

  {
    id: -203,

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",

    name:
      "2nd Floor",

    floor_number: 2,

    slug:
      "2nd-floor",

    description: null,

    area_sqft: null,

    status:
      "occupied",

    tenant_name: null,

    featured_image: null,

    sort_order: 2,
  },
];

const fallbackTenants: TenantData[] = [
  {
    id: -301,

    floor_id: -101,

    name:
      "Himalayan Java",

    slug:
      "himalayan-java",

    short_description:
      "Premium coffee experience with warm Nepali hospitality.",

    description: null,

    logo: null,

    website_url: null,

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "Ground Floor",

    floor_number: 0,

    floor_slug:
      "ground-floor",

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",
  },

  {
    id: -302,

    floor_id: -101,

    name:
      "Tesla Clinic",

    slug:
      "tesla-clinic",

    short_description:
      "Professional healthcare services with modern facilities and experienced practitioners.",

    description: null,

    logo: null,

    website_url: null,

    phone: null,

    email: null,

    status: "active",

    sort_order: 2,

    floor_name:
      "Ground Floor",

    floor_number: 0,

    floor_slug:
      "ground-floor",

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",
  },

  {
    id: -303,

    floor_id: -102,

    name:
      "Vairav Tech",

    slug:
      "vairav-tech",

    short_description:
      "Vairav Technology is a powerhouse of cybersecurity.",

    description: null,

    logo: null,

    website_url: null,

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "1st Floor",

    floor_number: 1,

    floor_slug:
      "1st-floor",

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",
  },

  {
    id: -304,

    floor_id: -103,

    name:
      "Family Health International 360",

    slug:
      "family-health-international-360",

    short_description:
      "The 2nd floor is currently occupied by Family Health International 360.",

    description: null,

    logo: null,

    website_url: null,

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "2nd Floor",

    floor_number: 2,

    floor_slug:
      "2nd-floor",

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",
  },

  {
    id: -305,

    floor_id: -104,

    name:
      "Sigma Capital",

    slug:
      "sigma-capital",

    short_description:
      "This floor is currently occupied by Sigma Capital.",

    description: null,

    logo: null,

    website_url: null,

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "3rd Floor",

    floor_number: 3,

    floor_slug:
      "3rd-floor",

    building_id: -1,

    building_name:
      "Building A",

    building_slug:
      "building-a",
  },

  {
    id: -306,

    floor_id: -201,

    name:
      "The Bengal Restaurant",

    slug:
      "the-bengal-restaurant",

    short_description:
      "Contemporary Nepali and international cuisine crafted with premium service.",

    description: null,

    logo: null,

    website_url:
      "https://thebengalrestaurantandbar.com/",

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "Ground Floor",

    floor_number: 0,

    floor_slug:
      "ground-floor",

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",
  },

  {
    id: -307,

    floor_id: -202,

    name:
      "Swopna Chitra",

    slug:
      "swopna-chitra",

    short_description:
      "Dreams into Frames.",

    description: null,

    logo: null,

    website_url:
      "https://swopnachitra.com/",

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "1st Floor",

    floor_number: 1,

    floor_slug:
      "1st-floor",

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",
  },

  {
    id: -308,

    floor_id: -203,

    name:
      "Moon Technology",

    slug:
      "moon-technology",

    short_description:
      "Software, cloud and technology services for modern organizations.",

    description: null,

    logo: null,

    website_url:
      "https://www.moontechnology.com.np/",

    phone: null,

    email: null,

    status: "active",

    sort_order: 1,

    floor_name:
      "2nd Floor",

    floor_number: 2,

    floor_slug:
      "2nd-floor",

    building_id: -2,

    building_name:
      "Building B",

    building_slug:
      "building-b",
  },
];

// ========================================
// HOME
// ========================================

export default function Home() {
  const router = useRouter();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    navShadow,
    setNavShadow,
  ] = useState(false);

  const [
    openMenu,
    setOpenMenu,
  ] =
    useState<
      "a" | "b" | null
    >(null);

  const dropdownRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const heroVideoRef =
    useRef<HTMLVideoElement | null>(
      null
    );

  // ========================================
  // BACKEND STATE
  // ========================================

  const [
    buildingA,
    setBuildingA,
  ] =
    useState<BuildingData>(
      fallbackBuildingA
    );

  const [
    buildingB,
    setBuildingB,
  ] =
    useState<BuildingData>(
      fallbackBuildingB
    );

  const [
    floorsA,
    setFloorsA,
  ] =
    useState<FloorData[]>(
      fallbackFloorsA
    );

  const [
    floorsB,
    setFloorsB,
  ] =
    useState<FloorData[]>(
      fallbackFloorsB
    );

  const [
    tenants,
    setTenants,
  ] =
    useState<TenantData[]>(
      fallbackTenants
    );

  const [
    galleryA,
    setGalleryA,
  ] =
    useState<GalleryItem[]>(
      []
    );

  const [
    galleryB,
    setGalleryB,
  ] =
    useState<GalleryItem[]>(
      []
    );

  // ========================================
  // LOAD BACKEND DATA
  // ========================================

  useEffect(() => {
    let cancelled = false;

    const loadData =
      async () => {
        try {
          const [
            buildingAData,
            buildingBData,
            tenantData,
          ] =
            await Promise.all([
              getBuildingBySlug(
                "building-a"
              ),

              getBuildingBySlug(
                "building-b"
              ),

              getTenants(),
            ]);

          const [
            floorsAData,
            floorsBData,
            galleryAData,
            galleryBData,
          ] =
            await Promise.all([
              getFloorsByBuilding(
                buildingAData.id
              ),

              getFloorsByBuilding(
                buildingBData.id
              ),

              getGalleryByBuilding(
                buildingAData.id
              ),

              getGalleryByBuilding(
                buildingBData.id
              ),
            ]);

          if (cancelled) {
            return;
          }

          setBuildingA(
            buildingAData
          );

          setBuildingB(
            buildingBData
          );

          setFloorsA(
            sortFloors(
              floorsAData
            )
          );

          setFloorsB(
            sortFloors(
              floorsBData
            )
          );

          setTenants(
            tenantData
          );

          setGalleryA(
            galleryAData.filter(
              (
                item: GalleryItem
              ) =>
                Boolean(
                  item.is_active
                )
            )
          );

          setGalleryB(
            galleryBData.filter(
              (
                item: GalleryItem
              ) =>
                Boolean(
                  item.is_active
                )
            )
          );
        } catch (error) {
          console.error(
            "Homepage backend load error:",
            error
          );

          // Keep fallback content
          // if API is temporarily
          // unavailable.
        }
      };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // ========================================
  // BUILDING TENANTS
  // ========================================

  const tenantsA =
    useMemo(
      () =>
        tenants
          .filter(
            (tenant) =>
              tenant.building_slug ===
              "building-a" ||
              Number(
                tenant.building_id
              ) ===
              Number(
                buildingA.id
              )
          )
          .sort(
            (a, b) =>
              a.sort_order -
              b.sort_order ||
              a.id - b.id
          ),

      [
        tenants,
        buildingA.id,
      ]
    );

  const tenantsB =
    useMemo(
      () =>
        tenants
          .filter(
            (tenant) =>
              tenant.building_slug ===
              "building-b" ||
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
          ),

      [
        tenants,
        buildingB.id,
      ]
    );

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
          const current =
            map.get(
              tenant.floor_id
            ) || [];

          current.push(
            tenant
          );

          map.set(
            tenant.floor_id,
            current
          );
        }
      );

      return map;
    }, [tenants]);

  // ========================================
  // BUILDING A FLOOR GROUPS
  // ========================================

  const primaryFloorsA =
    useMemo(
      () =>
        floorsA.filter(
          (floor) =>
            floor.floor_number <=
            3
        ),

      [floorsA]
    );

  const futureFloorsA =
    useMemo(
      () =>
        floorsA.filter(
          (floor) =>
            floor.floor_number >=
            4
        ),

      [floorsA]
    );

  // ========================================
  // NAVIGATION
  // ========================================

  const buildingAFloors =
    useMemo(() => {
      const items =
        primaryFloorsA.map(
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
        futureFloorsA.length >
        0
      ) {
        items.push({
          label:
            getFutureFloorMenuLabel(
              futureFloorsA
            ),

          id:
            "building-a-gym",
        });
      }

      return items;
    }, [
      primaryFloorsA,
      futureFloorsA,
    ]);

  const buildingBFloors =
    useMemo(
      () =>
        floorsB.map(
          (floor) => ({
            label:
              floor.name,

            id:
              getBuildingBSectionId(
                floor
              ),
          })
        ),

      [floorsB]
    );

  // ========================================
  // AVAILABLE FLOORS
  // ========================================

  const availableFloors =
    useMemo(
      () =>
        [
          ...floorsA,
          ...floorsB,
        ].filter(
          (floor) =>
            floor.status ===
            "available"
        ),

      [
        floorsA,
        floorsB,
      ]
    );

  // ========================================
  // HERO TENANTS
  // ========================================

  const coffeeTenant =
    useMemo(
      () =>
        tenants.find(
          (tenant) =>
            tenant.name
              .toLowerCase()
              .includes(
                "java"
              ) ||
            tenant.name
              .toLowerCase()
              .includes(
                "coffee"
              )
        ),

      [tenants]
    );

  const clinicTenant =
    useMemo(
      () =>
        tenants.find(
          (tenant) =>
            tenant.name
              .toLowerCase()
              .includes(
                "clinic"
              )
        ),

      [tenants]
    );

  // ========================================
  // HERO VIDEO
  // ========================================

  const playHeroVideo =
    async () => {
      const video =
        heroVideoRef.current;

      if (!video) {
        return;
      }

      try {
        video.currentTime = 1;

        await video.play();
      } catch {
        // Ignore autoplay restrictions.
      }
    };

  const pauseHeroVideo =
    () => {
      const video =
        heroVideoRef.current;

      if (!video) {
        return;
      }

      video.pause();

      video.currentTime = 2;
    };

  // ========================================
  // NAV SHADOW
  // ========================================

  useEffect(() => {
    const onScroll =
      () =>
        setNavShadow(
          window.scrollY >
          10
        );

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      {
        passive: true,
      }
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, []);

  // ========================================
  // CLOSE NAV ON LINK
  // ========================================

  useEffect(() => {
    const handler = (
      event: Event
    ) => {
      const target =
        event.target as
        | HTMLElement
        | null;

      const anchor =
        target?.closest("a");

      const href =
        anchor?.getAttribute(
          "href"
        ) || "";

      if (
        href.startsWith("#") ||
        href.startsWith(
          "/building-a"
        ) ||
        href.startsWith(
          "/building-b"
        ) ||
        href.startsWith(
          "/inquiry"
        )
      ) {
        setMenuOpen(false);

        setOpenMenu(null);
      }
    };

    document.addEventListener(
      "click",
      handler
    );

    return () =>
      document.removeEventListener(
        "click",
        handler
      );
  }, []);

  // ========================================
  // OUTSIDE CLICK
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
  // REVEAL ANIMATION
  // ========================================

  useEffect(() => {
    const els =
      Array.from(
        document.querySelectorAll<HTMLElement>(
          "[data-reveal]"
        )
      );

    if (!els.length) {
      return;
    }

    els.forEach(
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

    els.forEach(
      (element) =>
        observer.observe(
          element
        )
    );

    return () =>
      observer.disconnect();
  }, [
    floorsA.length,
    floorsB.length,
    tenants.length,
    galleryA.length,
    galleryB.length,
  ]);

  // ========================================
  // FLOOR NAVIGATION
  // ========================================

  const navigateToFloor = (
    pathname:
      | "/building-a"
      | "/building-b",

    id: string
  ) => {
    queuePendingSectionScroll(
      pathname,
      id
    );

    setMenuOpen(false);

    setOpenMenu(null);

    router.push(
      pathname
    );
  };

  // ========================================
  // HERO POSTER
  // ========================================

  const heroPoster =
    resolveMediaUrl(
      buildingA.featured_image
    ) ||
    "/buildingA.png";

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

        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px] animate-float-slow" />

        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px] animate-float-slow-2" />

        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#0f172a_1px,transparent_1px)] [background-size:54px_54px]" />
      </div>

      {/* ===================================
          NAVIGATION
      =================================== */}

      <nav
        className={[
          "fixed top-0 left-0 right-0 z-40",

          "bg-[#FFF7DE]/70 backdrop-blur-xl",

          "border-b border-black/5",

          navShadow
            ? "shadow-[0_14px_60px_rgba(15,23,42,0.10)]"
            : "",
        ].join(" ")}
      >
        <Container>
          <div className="flex items-center justify-between">
            <a
              href="#hero"
              className="inline-flex items-center gap-3 group"
            >
              <img
                src="/subhashree.png"
                alt="Subha Shree Bhawan Logo"
                className="h-20 w-20 overflow-hidden pb-2"
              />

              <span className="text-[15px] md:text-base font-semibold tracking-tight">
                Subha Shree
                Bhawan
              </span>
            </a>

            {/* DESKTOP */}

            <div
              ref={
                dropdownRef
              }
              className="hidden md:flex items-center gap-1"
            >
              <div className="relative">
                <DropdownPill
                  label={
                    buildingA.name
                  }
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

                {openMenu ===
                  "a" && (
                    <DropdownMenu
                      items={
                        buildingAFloors
                      }
                      onSelect={(
                        id
                      ) =>
                        navigateToFloor(
                          "/building-a",
                          id
                        )
                      }
                    />
                  )}
              </div>

              <div className="relative">
                <DropdownPill
                  label={
                    buildingB.name
                  }
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
                  "b" && (
                    <DropdownMenu
                      items={
                        buildingBFloors
                      }
                      onSelect={(
                        id
                      ) =>
                        navigateToFloor(
                          "/building-b",
                          id
                        )
                      }
                    />
                  )}
              </div>

              {availableFloors.length >
                0 && (
                  <a
                    href="#available-spaces"
                    className="px-3 py-2 text-[12px] tracking-[0.18em] font-semibold text-slate-700 hover:text-slate-900 rounded-2xl hover:bg-black/[0.04] transition"
                  >
                    AVAILABLE SPACES
                  </a>
                )}

              {/* REQUEST VIEWING */}

              <a
                href={
                  GENERAL_INQUIRY_URL
                }
                className="ml-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:-translate-y-[1px]"
              >
                Request Viewing

                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            {/* MOBILE */}

            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  (previous) =>
                    !previous
                )
              }
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

          {/* =================================
              MOBILE MENU
          ================================= */}

          {menuOpen && (
            <div className="md:hidden mt-4 mb-3 rounded-3xl bg-[#FFF7DE]/95 backdrop-blur-xl ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.14)] overflow-hidden animate-pop-in">
              <div className="p-4 space-y-2">
                {/* BUILDING A */}

                <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                  <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                    {buildingA.name.toUpperCase()}
                  </p>

                  <div className="border-t border-black/5">
                    {buildingAFloors.map(
                      (floor) => (
                        <button
                          key={
                            floor.id
                          }
                          type="button"
                          onClick={() =>
                            navigateToFloor(
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

                  <a
                    href={
                      BUILDING_A_INQUIRY_URL
                    }
                    className="flex items-center justify-between border-t border-black/5 px-4 py-3 text-sm font-bold text-slate-900"
                  >
                    Request Viewing

                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {/* BUILDING B */}

                <div className="rounded-2xl bg-white/70 ring-1 ring-black/10 overflow-hidden">
                  <p className="px-4 pt-3 pb-1 text-[10px] tracking-[0.2em] font-bold text-slate-400">
                    {buildingB.name.toUpperCase()}
                  </p>

                  <div className="border-t border-black/5">
                    {buildingBFloors.map(
                      (floor) => (
                        <button
                          key={
                            floor.id
                          }
                          type="button"
                          onClick={() =>
                            navigateToFloor(
                              "/building-b",
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

                  <a
                    href={
                      BUILDING_B_INQUIRY_URL
                    }
                    className="flex items-center justify-between border-t border-black/5 px-4 py-3 text-sm font-bold text-slate-900"
                  >
                    Request Viewing

                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {availableFloors.length >
                  0 && (
                    <a
                      href="#available-spaces"
                      onClick={() =>
                        setMenuOpen(
                          false
                        )
                      }
                      className="block rounded-2xl bg-black/[0.03] ring-1 ring-black/10 px-4 py-3 text-sm font-semibold"
                    >
                      Available
                      Spaces
                    </a>
                  )}

                <a
                  href={
                    GENERAL_INQUIRY_URL
                  }
                  className="btn-primary w-full justify-center"
                >
                  Request a Viewing

                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </Container>
      </nav>

      {/* ===================================
          HERO
      =================================== */}

      <section
        id="hero"
        className="relative pt-28 md:pt-32 pb-14 md:pb-20"
      >
        <Container>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* HERO COPY */}

            <div className="lg:col-span-7">
              <div
                data-reveal
                className="inline-flex items-center gap-2 rounded-full bg-white/55 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700"
              >
                <Star className="h-4 w-4 text-slate-900" />

                Premium
                commercial
                complex
              </div>

              <h1
                data-reveal
                className="mt-6 text-[42px] leading-[1.06] md:text-[64px] md:leading-[1.02] font-extrabold tracking-tight"
              >
                Built for modern
                brands.

                <span className="block text-slate-600 font-extrabold">
                  Designed to feel
                  premium.
                </span>
              </h1>

              <p
                data-reveal
                className="mt-5 md:mt-6 text-lg md:text-xl text-slate-700 leading-relaxed max-w-2xl"
              >
                Subha Shree
                Bhawan in
                Baluwatar offers
                a refined,
                professional
                environment for
                offices, premium
                services, and
                growth-ready
                businesses.
              </p>

              {/* HERO ACTIONS */}

              <div
                data-reveal
                className="mt-9 md:mt-10 flex flex-wrap gap-3"
              >
                <button
                  type="button"
                  onClick={() => {
                    const first =
                      buildingAFloors[0];

                    if (
                      first
                    ) {
                      navigateToFloor(
                        "/building-a",
                        first.id
                      );
                    }
                  }}
                  className="btn-secondary"
                >
                  Explore Floors

                  <ChevronDown className="h-4 w-4" />
                </button>

                {availableFloors.length >
                  0 && (
                    <a
                      href="#available-spaces"
                      className="btn-secondary"
                    >
                      View Available
                      Spaces

                      <ArrowRight className="h-4 w-4" />
                    </a>
                  )}

                <a
                  href={
                    GENERAL_INQUIRY_URL
                  }
                  className="btn-primary"
                >
                  Request a Viewing

                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* HERO TILES */}

              <div
                data-reveal
                className="mt-11 md:mt-12 grid sm:grid-cols-3 gap-3 max-w-2xl"
              >
                <InfoTile
                  title="Buildings"
                  value="2 connected"
                  icon={
                    <Building2 className="h-4 w-4" />
                  }
                />

                <InfoTile
                  title="Location"
                  value="Baluwatar"
                  icon={
                    <MapPin className="h-4 w-4" />
                  }
                />

                <InfoTile
                  title="Positioning"
                  value="Premium"
                  icon={
                    <Star className="h-4 w-4" />
                  }
                />
              </div>
            </div>

            {/* HERO MEDIA */}

            <div
              className="lg:col-span-5"
              data-reveal
            >
              <MediaCard>
                <div
                  className="relative h-[410px] md:h-[440px]"
                  onMouseEnter={
                    playHeroVideo
                  }
                  onMouseLeave={
                    pauseHeroVideo
                  }
                  onClick={() => {
                    const video =
                      heroVideoRef.current;

                    if (!video) {
                      return;
                    }

                    if (
                      video.paused
                    ) {
                      playHeroVideo();
                    } else {
                      pauseHeroVideo();
                    }
                  }}
                >
                  <video
                    ref={
                      heroVideoRef
                    }
                    src="/videos/subha-shree-bhawan.mp4"
                    poster={
                      heroPoster
                    }
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
                        HOVER TO
                        PLAY
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
                          <Phone className="h-4 w-4 text-slate-400" />

                          +977
                          980-8100067
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />

                          buddhalifestyle.np@gmail.com
                        </div>
                      </div>

                      <a
                        href={
                          GENERAL_INQUIRY_URL
                        }
                        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900"
                      >
                        Request Viewing

                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* HERO MINI STATS */}

                <div className="p-5 border-t border-black/5">
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <MiniStat
                      title="Café"
                      value={
                        coffeeTenant?.name ||
                        "Himalayan Java"
                      }
                      icon={
                        <Coffee className="h-4 w-4" />
                      }
                    />

                    <MiniStat
                      title="Clinic"
                      value={
                        clinicTenant?.name ||
                        "Tesla Clinic"
                      }
                      icon={
                        <Stethoscope className="h-4 w-4" />
                      }
                    />

                    <MiniStat
                      title="Floors"
                      value={`${floorsA.length + floorsB.length} Total`}
                      icon={
                        <Laptop className="h-4 w-4" />
                      }
                    />
                  </div>
                </div>
              </MediaCard>
            </div>
          </div>

          <div
            className="mt-14 md:mt-16 flex justify-center"
            data-reveal
          >
            <div className="h-12 w-[2px] bg-gradient-to-b from-black/20 to-transparent" />
          </div>
        </Container>
      </section>

      {/* ===================================
          BUILDING A
      =================================== */}

      <SectionHeader
        title={
          buildingA.name
        }
        subtitle={`${floorsA.length} floors of excellence`}
        href="/building-a"
        inquiryHref={
          BUILDING_A_INQUIRY_URL
        }
      />

      {primaryFloorsA.map(
        (floor) => {
          const floorTenants =
            tenantsByFloor.get(
              floor.id
            ) || [];

          const visual =
            getFloorVisual(
              floor,
              floorTenants,
              galleryA,
              "a"
            );

          return (
            <Section
              key={
                floor.id
              }
              id={getBuildingASectionId(
                floor
              )}
              tone={
                floor.floor_number ===
                  1
                  ? "soft"
                  : "base"
              }
            >
              <TwoCol
                left={
                  <>
                    <Kicker
                      text={`${floor.name.toUpperCase()} • ${buildingA.name.toUpperCase()}`}
                    />

                    <h3
                      data-reveal
                      className="text-3xl md:text-4xl font-extrabold tracking-tight"
                    >
                      {getFloorTitle(
                        floor,
                        floorTenants
                      )}
                    </h3>

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
                                `${tenant.name} operates from ${floor.name} of ${buildingA.name}.`
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

                    {/* AVAILABLE FLOOR INQUIRY */}

                    {floor.status ===
                      "available" && (
                        <div
                          data-reveal
                          className="pt-3"
                        >
                          <a
                            href={getFloorInquiryUrl(
                              floor
                            )}
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_45px_rgba(252,211,77,0.22)] transition hover:-translate-y-[1px]"
                          >
                            Request Viewing
                            for{" "}
                            {
                              floor.name
                            }

                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                  </>
                }

                right={
                  <ImageCard
                    src={
                      visual.src
                    }
                    alt={
                      visual.alt
                    }
                    footerLeft={
                      floor.floor_number ===
                        0
                        ? "FACILITIES"
                        : "FLOOR AREA"
                    }
                    footerRight={getFloorFooterValue(
                      floor,
                      floorTenants
                    )}
                    heightClass={
                      floor.floor_number ===
                        0
                        ? "h-[28rem] md:h-[34rem]"
                        : "h-[31.25rem]"
                    }
                    crop="object-center"
                    zoom={
                      visual.isBackendImage
                        ? "scale-100"
                        : getStaticImageScale(
                          floor
                        )
                    }
                    fit={
                      visual.isBackendImage
                        ? "cover"
                        : "contain"
                    }
                  />
                }
              />
            </Section>
          );
        }
      )}

      {/* ===================================
          BUILDING A FUTURE FLOORS
      =================================== */}

      {futureFloorsA.length >
        0 && (
          <Section id="building-a-gym">
            <div className="text-center">
              <Kicker
                text={`${getFutureFloorRangeLabel(
                  futureFloorsA
                ).toUpperCase()} • ${buildingA.name.toUpperCase()}`}
              />

              <h3
                data-reveal
                className="mt-6 text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                Premium Fitness
                Center

                <span className="block text-slate-600">
                  {getCombinedFutureStatus(
                    futureFloorsA
                  )}
                </span>
              </h3>

              <p
                data-reveal
                className="mt-3 text-slate-700"
              >
                {getFutureFloorDescription(
                  futureFloorsA
                )}
              </p>

              {/* AVAILABLE FUTURE FLOORS */}

              <div
                data-reveal
                className="mt-7 flex flex-wrap justify-center gap-3"
              >
                {futureFloorsA
                  .filter(
                    (floor) =>
                      floor.status ===
                      "available"
                  )
                  .map(
                    (floor) => (
                      <a
                        key={
                          floor.id
                        }
                        href={getFloorInquiryUrl(
                          floor
                        )}
                        className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_45px_rgba(15,23,42,0.18)] transition hover:-translate-y-[1px]"
                      >
                        Request{" "}
                        {
                          floor.name
                        }

                        <ArrowRight className="h-4 w-4" />
                      </a>
                    )
                  )}
              </div>
            </div>
          </Section>
        )}

      {/* ===================================
          BUILDING B
      =================================== */}

      <SectionHeader
        title={
          buildingB.name
        }
        subtitle={
          buildingB.short_description ||
          "Connected excellence"
        }
        href="/building-b"
        inquiryHref={
          BUILDING_B_INQUIRY_URL
        }
      />

      {floorsB.map(
        (floor) => {
          const floorTenants =
            tenantsByFloor.get(
              floor.id
            ) || [];

          const visual =
            getFloorVisual(
              floor,
              floorTenants,
              galleryB,
              "b"
            );

          return (
            <Section
              key={
                floor.id
              }
              id={getBuildingBSectionId(
                floor
              )}
              tone={
                floor.floor_number ===
                  1
                  ? "soft"
                  : "base"
              }
            >
              <TwoCol
                left={
                  <>
                    <Kicker
                      text={`${floor.name.toUpperCase()} • ${buildingB.name.toUpperCase()}`}
                    />

                    <h3
                      data-reveal
                      className="text-3xl md:text-4xl font-extrabold tracking-tight"
                    >
                      {getFloorTitle(
                        floor,
                        floorTenants
                      )}
                    </h3>

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
                                `${tenant.name} operates from ${floor.name} of ${buildingB.name}.`
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

                    {/* AVAILABLE FLOOR INQUIRY */}

                    {floor.status ===
                      "available" && (
                        <div
                          data-reveal
                          className="pt-3"
                        >
                          <a
                            href={getFloorInquiryUrl(
                              floor
                            )}
                            className="inline-flex items-center gap-2 rounded-2xl bg-amber-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_18px_45px_rgba(252,211,77,0.22)] transition hover:-translate-y-[1px]"
                          >
                            Request Viewing
                            for{" "}
                            {
                              floor.name
                            }

                            <ArrowRight className="h-4 w-4" />
                          </a>
                        </div>
                      )}
                  </>
                }

                right={
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
                }
              />
            </Section>
          );
        }
      )}

      {/* ===================================
          AVAILABLE SPACES
      =================================== */}

      {availableFloors.length >
        0 && (
          <Section
            id="available-spaces"
            tone="soft"
          >
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/60 ring-1 ring-black/10 px-4 py-2 text-xs font-semibold text-slate-700">
                Leasing
              </div>

              <h2
                data-reveal
                className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                Available
                Spaces
              </h2>

              <p
                data-reveal
                className="mt-3 text-lg text-slate-700"
              >
                Premium
                commercial floors
                currently ready
                for occupancy.
              </p>
            </div>

            <div
              data-reveal
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 max-w-6xl mx-auto"
            >
              {availableFloors.map(
                (floor) => (
                  <AvailableFloorCard
                    key={
                      floor.id
                    }
                    floor={
                      floor
                    }
                    inquiryHref={getFloorInquiryUrl(
                      floor
                    )}
                    onView={() =>
                      navigateToFloor(
                        floor.building_slug ===
                          "building-b"
                          ? "/building-b"
                          : "/building-a",

                        floor.building_slug ===
                          "building-b"
                          ? getBuildingBSectionId(
                            floor
                          )
                          : getBuildingASectionId(
                            floor
                          )
                      )
                    }
                  />
                )
              )}
            </div>
          </Section>
        )}

      {/* ===================================
          GENERAL VIEWING CTA
      =================================== */}

      <Section tone="base">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-slate-900 px-7 py-10 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:px-12 md:py-14">
          <div
            data-reveal
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold tracking-[0.18em]"
          >
            COMMERCIAL SPACE
          </div>

          <h2
            data-reveal
            className="mt-5 text-3xl font-extrabold tracking-tight md:text-5xl"
          >
            Looking for the
            right space?
          </h2>

          <p
            data-reveal
            className="mx-auto mt-4 max-w-2xl leading-relaxed text-slate-300"
          >
            Send us your
            requirements and our
            team can help you
            choose the most
            suitable building
            and floor.
          </p>

          <div
            data-reveal
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <a
              href={
                GENERAL_INQUIRY_URL
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-slate-900 transition hover:-translate-y-[1px]"
            >
              Request a Viewing

              <ArrowRight className="h-5 w-5" />
            </a>

            <a
              href="tel:+9779808100067"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-6 py-4 font-bold text-white transition hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />

              Call Now
            </a>
          </div>
        </div>
      </Section>

      {/* ===================================
          FAQ
      =================================== */}

      <Section
        id="faq"
        tone="soft"
      >
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <Kicker text="FREQUENTLY ASKED QUESTIONS" />

            <h2
              data-reveal
              className="mt-6 text-4xl font-extrabold tracking-tight md:text-5xl"
            >
              Commercial rental
              questions,

              <span className="block text-slate-600">
                answered clearly.
              </span>
            </h2>

            <p
              data-reveal
              className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-600"
            >
              Helpful guidance
              for choosing a
              commercial
              building in
              Kathmandu.
            </p>
          </div>

          <div
            data-reveal
            className="mt-10 space-y-3"
          >
            {[
              {
                question:
                  "What should I consider when renting a commercial building in Kathmandu?",

                answer:
                  "Important factors include location, accessibility, parking, building quality, facilities, maintenance, rental cost, lease terms, and whether the property suits your business requirements.",
              },

              {
                question:
                  "Is location important when choosing commercial property?",

                answer:
                  "Yes. Location can affect customer accessibility, employee commuting, business visibility, transportation, and overall convenience.",
              },

              {
                question:
                  "Should I consider parking when renting a commercial building?",

                answer:
                  "Yes. Parking can be especially important for businesses that receive regular customers, employees, suppliers, and visitors.",
              },

              {
                question:
                  "What facilities should a commercial building have?",

                answer:
                  "Depending on your business, useful facilities can include electricity, water, internet connectivity, parking, lift access, security, ventilation, natural lighting, and proper maintenance.",
              },

              {
                question:
                  "Should I choose a commercial building based only on rent?",

                answer:
                  "No. Monthly rent is only one part of the total value. Accessibility, facilities, parking, building quality, maintenance, and location should also be considered.",
              },
            ].map(
              (item) => (
                <details
                  key={
                    item.question
                  }
                  className="group rounded-[22px] bg-white/70 ring-1 ring-black/[0.08] shadow-[0_12px_40px_rgba(15,23,42,0.05)] open:bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 px-5 py-5 font-bold text-slate-900 md:px-6 [&::-webkit-details-marker]:hidden">
                    <span>
                      {
                        item.question
                      }
                    </span>

                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF0BF] text-amber-900 transition group-open:rotate-180">
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </summary>

                  <div className="border-t border-black/5 px-5 pb-6 pt-4 leading-relaxed text-slate-600 md:px-6">
                    {
                      item.answer
                    }
                  </div>
                </details>
              )
            )}
          </div>
        </div>
      </Section>

      {/* ===================================
          FOOTER
      =================================== */}

      <footer className="py-12 md:py-14">
        <Container>
          <div className="rounded-[28px] bg-white/55 ring-1 ring-black/10 p-7 md:p-8">
            <div className="grid md:grid-cols-4 gap-10">
              {/* ABOUT */}

              <div>
                <h3 className="text-xl font-extrabold tracking-tight">
                  Subha Shree
                  Bhawan
                </h3>

                <p className="mt-3 text-slate-700 leading-relaxed">
                  A premium
                  commercial
                  destination
                  offering
                  world-class
                  business spaces
                  and amenities.
                </p>

                <img
                  src="/subhashree.png"
                  alt="Subha Shree Bhawan Logo"
                  className="h-24 w-24 overflow-hidden"
                />
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
                      Kathmandu,
                      Nepal
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

                <a
                  href={
                    GENERAL_INQUIRY_URL
                  }
                  className="mt-5 inline-flex items-center gap-2 font-bold text-slate-900"
                >
                  Request a Viewing

                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>

              {/* FEATURES */}

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
                  ].map(
                    (text) => (
                      <li
                        key={
                          text
                        }
                        className="flex items-center gap-2"
                      >
                        <ArrowRight className="h-4 w-4 text-slate-400" />

                        {text}
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* EXPLORE */}

              <div>
                <h4 className="text-xs font-semibold tracking-[0.18em] text-slate-500">
                  EXPLORE
                </h4>

                <a
                  href="/blog"
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-slate-950"
                >
                  Our Blog

                  <ArrowRight className="h-4 w-4" />
                </a>



                <div className="mt-5 space-y-2 text-sm">
                  <a
                    href={
                      BUILDING_A_INQUIRY_URL
                    }
                    className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-950"
                  >
                    Building A Inquiry

                    <ArrowRight className="h-4 w-4" />
                  </a>

                  <a
                    href={
                      BUILDING_B_INQUIRY_URL
                    }
                    className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-950"
                  >
                    Building B Inquiry

                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-black/5 text-center text-slate-500 text-sm">
              &copy; 2026
              Subha Shree
              Bhawan. All
              rights reserved.
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

function sortFloors(
  floors: FloorData[]
) {
  return [...floors].sort(
    (a, b) =>
      a.sort_order -
      b.sort_order ||
      a.floor_number -
      b.floor_number
  );
}

// ========================================
// INQUIRY HELPER
// ========================================

function getFloorInquiryUrl(
  floor: FloorData
) {
  const buildingSlug =
    floor.building_slug ===
      "building-b"
      ? "building-b"
      : "building-a";

  // Negative IDs are fallback/demo
  // data. Do not send fake floor IDs
  // to the backend inquiry form.

  if (
    Number(
      floor.id
    ) <= 0
  ) {
    return `/inquiry?building=${encodeURIComponent(
      buildingSlug
    )}`;
  }

  return `/inquiry?building=${encodeURIComponent(
    buildingSlug
  )}&floor=${encodeURIComponent(
    String(
      floor.id
    )
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
    return "Prime Office Space";
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
      return `${floor.name} is currently being prepared and will be available soon.`;

    case "inactive":
      return `${floor.name} is currently inactive.`;

    default:
      return (
        floor.description ||
        ""
      );
  }
}

function getFloorFooterValue(
  floor: FloorData,
  floorTenants: TenantData[]
) {
  if (
    floor.area_sqft !==
    null &&
    floor.area_sqft !==
    undefined &&
    Number(
      floor.area_sqft
    ) > 0
  ) {
    return `${Number(
      floor.area_sqft
    ).toLocaleString()} sq. ft.`;
  }

  if (
    floorTenants.length >
    0
  ) {
    return `${floorTenants.length} ${floorTenants.length ===
        1
        ? "Tenant"
        : "Tenants"
      }`;
  }

  return formatStatus(
    floor.status
  );
}

function getTenantIcon(
  tenant: TenantData
) {
  const value =
    `${tenant.name} ${tenant.slug}`.toLowerCase();

  if (
    value.includes(
      "java"
    ) ||
    value.includes(
      "coffee"
    )
  ) {
    return (
      <Coffee className="h-5 w-5" />
    );
  }

  if (
    value.includes(
      "clinic"
    ) ||
    value.includes(
      "health"
    )
  ) {
    return (
      <Stethoscope className="h-5 w-5" />
    );
  }

  if (
    value.includes(
      "vairav"
    ) ||
    value.includes(
      "security"
    )
  ) {
    return (
      <ShieldCheck className="h-5 w-5" />
    );
  }

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
// IMAGES
// ========================================

function resolveMediaUrl(
  imageUrl:
    | string
    | null
    | undefined
) {
  if (!imageUrl) {
    return "";
  }

  if (
    imageUrl.startsWith(
      "http://"
    ) ||
    imageUrl.startsWith(
      "https://"
    )
  ) {
    return imageUrl;
  }

  if (
    imageUrl.startsWith(
      "/uploads/"
    )
  ) {
    return getBackendImageUrl(
      imageUrl
    );
  }

  return imageUrl;
}

function getFloorVisual(
  floor: FloorData,
  floorTenants: TenantData[],
  gallery: GalleryItem[],
  building:
    | "a"
    | "b"
) {
  // ======================================
  // 1. FLOOR GALLERY IMAGE
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
        resolveMediaUrl(
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
  // 2. TENANT GALLERY IMAGE
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
        resolveMediaUrl(
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
  // 3. TENANT LOGO
  // ======================================

  const tenantWithLogo =
    floorTenants.find(
      (tenant) =>
        Boolean(
          tenant.logo
        )
    );

  if (
    tenantWithLogo?.logo
  ) {
    return {
      src:
        resolveMediaUrl(
          tenantWithLogo.logo
        ),

      alt:
        tenantWithLogo.name,

      isBackendImage:
        true,
    };
  }

  // ======================================
  // 4. ORIGINAL WEBSITE FALLBACK
  // ======================================

  return building === "a"
    ? getStaticBuildingAImage(
      floor.floor_number
    )
    : getStaticBuildingBImage(
      floor.floor_number
    );
}

function getStaticBuildingAImage(
  floorNumber: number
) {
  switch (floorNumber) {
    case 0:
      return {
        src:
          "/javatesla.png",

        alt:
          "Tesla Clinic and Himalayan Java",

        isBackendImage:
          false,
      };

    case 1:
      return {
        src:
          "/vairav.png",

        alt:
          "Vairav Tech",

        isBackendImage:
          false,
      };

    case 2:
      return {
        src:
          "/fhi.png",

        alt:
          "Family Health International 360",

        isBackendImage:
          false,
      };

    case 3:
      return {
        src:
          "/sigma.png",

        alt:
          "Sigma Capital",

        isBackendImage:
          false,
      };

    default:
      return {
        src:
          "/subhashree.png",

        alt:
          "Subha Shree Bhawan",

        isBackendImage:
          false,
      };
  }
}

function getStaticBuildingBImage(
  floorNumber: number
) {
  switch (floorNumber) {
    case 0:
      return {
        src:
          "/bengal.jpg",

        alt:
          "The Bengal Restaurant",

        isBackendImage:
          false,
      };

    case 1:
      return {
        src:
          "/Swopna.png",

        alt:
          "Swopna Chitra",

        isBackendImage:
          false,
      };

    case 2:
      return {
        src:
          "/moon.jpeg",

        alt:
          "Moon Technology",

        isBackendImage:
          false,
      };

    default:
      return {
        src:
          "/subhashree.png",

        alt:
          "Subha Shree Bhawan",

        isBackendImage:
          false,
      };
  }
}

function getStaticImageScale(
  floor: FloorData
) {
  if (
    floor.floor_number ===
    0
  ) {
    return "scale-100";
  }

  return "scale-[0.55]";
}

// ========================================
// BUILDING A FUTURE FLOORS
// ========================================

function getFutureFloorMenuLabel(
  floors: FloorData[]
) {
  if (!floors.length) {
    return "Future Floors";
  }

  if (
    floors.length ===
    1
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

function getFutureFloorRangeLabel(
  floors: FloorData[]
) {
  if (!floors.length) {
    return "";
  }

  if (
    floors.length ===
    1
  ) {
    return floors[0].name;
  }

  return `${floors[0].name.replace(
    " Floor",
    ""
  )} – ${floors[
      floors.length - 1
    ].name
    }`;
}

function getCombinedFutureStatus(
  floors: FloorData[]
) {
  if (
    floors.every(
      (floor) =>
        floor.status ===
        "coming_soon"
    )
  ) {
    return "Coming Soon";
  }

  if (
    floors.some(
      (floor) =>
        floor.status ===
        "available"
    )
  ) {
    return "Available";
  }

  if (
    floors.every(
      (floor) =>
        floor.status ===
        "occupied"
    )
  ) {
    return "Occupied";
  }

  return "In Development";
}

function getFutureFloorDescription(
  floors: FloorData[]
) {
  const descriptions =
    floors
      .map(
        (floor) =>
          floor.description
      )
      .filter(
        (
          description
        ): description is string =>
          Boolean(
            description &&
            description.trim()
          )
      );

  const useful =
    descriptions.find(
      (description) =>
        !description
          .toLowerCase()
          .includes(
            "floor of building a"
          )
    );

  return (
    useful ||
    "Three floors of wellness and future-ready fitness amenities."
  );
}

// ========================================
// COMPONENTS
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
// SECTION HEADER
// ========================================

function SectionHeader({
  title,
  subtitle,
  href,
  inquiryHref,
}: {
  title: string;

  subtitle: string;

  href?: string;

  inquiryHref?: string;
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

          <div
            data-reveal
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            {href && (
              <a
                href={
                  href
                }
                className="btn-secondary"
              >
                View Dedicated
                Page

                <ArrowRight className="h-4 w-4" />
              </a>
            )}

            {inquiryHref && (
              <a
                href={
                  inquiryHref
                }
                className="btn-primary"
              >
                Request a Viewing

                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="mx-auto mt-7 h-[2px] w-16 rounded-full bg-black/10" />
        </div>
      </div>
    </div>
  );
}

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

function InfoTile({
  title,
  value,
  icon,
}: {
  title: string;

  value: string;

  icon:
  React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white/55 ring-1 ring-black/10 px-4 py-4 shadow-[0_14px_40px_rgba(15,23,42,0.06)] hover:-translate-y-[2px] hover:shadow-[0_22px_70px_rgba(15,23,42,0.10)] transition">
      <div className="flex items-center gap-2 text-xs tracking-[0.18em] text-slate-500 font-semibold">
        <span className="text-slate-500">
          {icon}
        </span>

        {title.toUpperCase()}
      </div>

      <div className="mt-2 text-base font-semibold text-slate-900">
        {value}
      </div>
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

  icon:
  React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-black/[0.03] ring-1 ring-black/10 p-3 hover:-translate-y-[1px] transition">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">
          {title.toUpperCase()}
        </p>

        <span className="text-slate-500">
          {icon}
        </span>
      </div>

      <p className="mt-2 font-semibold text-slate-900">
        {value}
      </p>
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

  fit?:
  | "cover"
  | "contain";
}) {
  const lowerSrc =
    src.toLowerCase();

  const backdropClass =
    lowerSrc.includes(
      "fhi"
    )
      ? "bg-[#293b4b]"
      : lowerSrc.includes(
        "bengal"
      ) ||
        lowerSrc.includes(
          "swopna"
        )
        ? "bg-[#050505]"
        : lowerSrc.includes(
          "vairav"
        )
          ? "bg-[#edf4f6]"
          : lowerSrc.includes(
            "sigma"
          )
            ? "bg-[#edf8f7]"
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

        <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      {(footerLeft ||
        footerRight) && (
          <div className="p-5 border-t border-black/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 tracking-[0.14em] text-xs font-semibold">
                {
                  footerLeft
                }
              </span>

              <span className="font-semibold text-slate-900">
                {
                  footerRight
                }
              </span>
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

      <div className="min-w-0">
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
// AVAILABLE FLOOR CARD
// ========================================

function AvailableFloorCard({
  floor,
  onView,
  inquiryHref,
}: {
  floor: FloorData;

  onView: () => void;

  inquiryHref: string;
}) {
  return (
    <div className="relative rounded-[28px] bg-white/60 ring-1 ring-black/10 p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_30px_95px_rgba(15,23,42,0.12)]">
      <div className="absolute top-4 right-4 rounded-full bg-slate-900 text-white px-4 py-2 text-[10px] font-bold tracking-[0.18em]">
        AVAILABLE
      </div>

      <p className="text-xs tracking-[0.18em] text-slate-500 font-semibold">
        {floor.building_name.toUpperCase()}
      </p>

      <h3 className="mt-4 text-2xl font-extrabold tracking-tight">
        {floor.name}
      </h3>

      <p className="mt-2 text-slate-700">
        {floor.description ||
          "Premium commercial space currently available for occupancy."}
      </p>

      <div className="mt-6 border-t border-black/5 pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-xs font-semibold tracking-[0.14em] text-slate-500">
            FLOOR AREA
          </span>

          <span className="font-semibold">
            {floor.area_sqft
              ? `${Number(
                floor.area_sqft
              ).toLocaleString()} sq. ft.`
              : "Contact us"}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <a
          href={
            inquiryHref
          }
          className="btn-primary w-full justify-center"
        >
          Request Viewing

          <ArrowRight className="h-4 w-4" />
        </a>

        <button
          type="button"
          onClick={
            onView
          }
          className="btn-secondary w-full justify-center"
        >
          View Floor

          <ArrowRight className="h-4 w-4" />
        </button>
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
      onClick={
        onClick
      }
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold tracking-[0.12em] transition-all duration-200",

        active
          ? "bg-[#E8DFC8] text-slate-900 shadow-[0_4px_14px_rgba(15,23,42,0.08)]"
          : "text-slate-700 hover:bg-black/[0.04] hover:text-slate-900",
      ].join(" ")}
    >
      <span>
        {label}
      </span>

      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-200 ${active
            ? "rotate-180"
            : ""
          }`}
      />
    </button>
  );
}

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
    <div className="absolute left-0 top-[42px] z-50 w-[200px] overflow-hidden rounded-2xl border border-black/10 bg-[#F7F7F7]/95 shadow-[0_12px_40px_rgba(15,23,42,0.14)] backdrop-blur-xl">
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
                "flex w-full items-center px-4 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-black/[0.04] hover:text-slate-900",

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