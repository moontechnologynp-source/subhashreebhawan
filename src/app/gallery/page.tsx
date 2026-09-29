"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Images,
  X,
} from "lucide-react";

// ========================================
// API
// ========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://subhashreebhawan-api.vercel.app/api";

const BACKEND_URL =
  API_URL.replace(
    /\/api\/?$/,
    "",
  );

// ========================================
// TYPES
// ========================================

interface GalleryItem {
  id: number;

  building_id:
    | number
    | null;

  floor_id:
    | number
    | null;

  tenant_id:
    | number
    | null;

  title:
    | string
    | null;

  description:
    | string
    | null;

  image_url: string;

  alt_text:
    | string
    | null;

  category:
    | "general"
    | "building"
    | "floor"
    | "tenant";

  is_featured: number;

  is_active: number;

  sort_order: number;

  building_name:
    | string
    | null;

  floor_name:
    | string
    | null;

  tenant_name:
    | string
    | null;
}

type FilterValue =
  | "all"
  | "building-a"
  | "building-b"
  | "general";

// ========================================
// PAGE
// ========================================

export default function GalleryPage() {
  const [
    gallery,
    setGallery,
  ] =
    useState<
      GalleryItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    filter,
    setFilter,
  ] =
    useState<FilterValue>(
      "all",
    );

  const [
    selectedIndex,
    setSelectedIndex,
  ] =
    useState<
      number | null
    >(null);

  // ========================================
  // LOAD GALLERY
  // ========================================

  useEffect(() => {
    let cancelled =
      false;

    const loadGallery =
      async () => {
        try {
          setLoading(
            true,
          );

          setError("");

          const response =
            await fetch(
              `${API_URL}/gallery`,
              {
                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data.message ||
                "Unable to load gallery.",
            );
          }

          if (
            cancelled
          ) {
            return;
          }

          const items =
            (
              data.gallery ||
              []
            ) as GalleryItem[];

          const activeItems =
            items
              .filter(
                (
                  item,
                ) =>
                  Boolean(
                    item.is_active,
                  ),
              )
              .sort(
                (
                  a,
                  b,
                ) => {
                  // Featured images first.
                  if (
                    Number(
                      b.is_featured,
                    ) !==
                    Number(
                      a.is_featured,
                    )
                  ) {
                    return (
                      Number(
                        b.is_featured,
                      ) -
                      Number(
                        a.is_featured,
                      )
                    );
                  }

                  // Then admin sort order.
                  if (
                    Number(
                      a.sort_order,
                    ) !==
                    Number(
                      b.sort_order,
                    )
                  ) {
                    return (
                      Number(
                        a.sort_order,
                      ) -
                      Number(
                        b.sort_order,
                      )
                    );
                  }

                  return (
                    Number(
                      b.id,
                    ) -
                    Number(
                      a.id,
                    )
                  );
                },
              );

          setGallery(
            activeItems,
          );
        } catch (
          loadError
        ) {
          console.error(
            "Public gallery load error:",
            loadError,
          );

          if (
            !cancelled
          ) {
            setError(
              loadError instanceof
                Error
                ? loadError.message
                : "Unable to load gallery.",
            );
          }
        } finally {
          if (
            !cancelled
          ) {
            setLoading(
              false,
            );
          }
        }
      };

    loadGallery();

    return () => {
      cancelled =
        true;
    };
  }, []);

  // ========================================
  // FILTER
  // ========================================

  const filteredGallery =
    useMemo(() => {
      if (
        filter ===
        "all"
      ) {
        return gallery;
      }

      if (
        filter ===
        "general"
      ) {
        return gallery.filter(
          (
            item,
          ) =>
            item.category ===
              "general" ||
            (
              item.building_id ===
                null &&
              item.floor_id ===
                null &&
              item.tenant_id ===
                null
            ),
        );
      }

      if (
        filter ===
        "building-a"
      ) {
        return gallery.filter(
          (
            item,
          ) =>
            item.building_name
              ?.toLowerCase()
              .trim() ===
            "building a",
        );
      }

      if (
        filter ===
        "building-b"
      ) {
        return gallery.filter(
          (
            item,
          ) =>
            item.building_name
              ?.toLowerCase()
              .trim() ===
            "building b",
        );
      }

      return gallery;
    }, [
      gallery,
      filter,
    ]);

  // ========================================
  // LIGHTBOX ITEM
  // ========================================

  const selectedItem =
    selectedIndex !==
      null
      ? filteredGallery[
          selectedIndex
        ]
      : null;

  // ========================================
  // CLOSE LIGHTBOX WITH ESC
  // ========================================

  useEffect(() => {
    if (
      selectedIndex ===
      null
    ) {
      return;
    }

    const handleKeyDown =
      (
        event:
          KeyboardEvent,
      ) => {
        if (
          event.key ===
          "Escape"
        ) {
          setSelectedIndex(
            null,
          );
        }

        if (
          event.key ===
          "ArrowRight"
        ) {
          setSelectedIndex(
            (
              current,
            ) => {
              if (
                current ===
                null
              ) {
                return null;
              }

              return (
                current +
                1
              ) %
                filteredGallery.length;
            },
          );
        }

        if (
          event.key ===
          "ArrowLeft"
        ) {
          setSelectedIndex(
            (
              current,
            ) => {
              if (
                current ===
                null
              ) {
                return null;
              }

              return (
                current -
                  1 +
                filteredGallery.length
              ) %
                filteredGallery.length;
            },
          );
        }
      };

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      document.body.style.overflow =
        "";
    };
  }, [
    selectedIndex,
    filteredGallery.length,
  ]);

  // ========================================
  // FILTER CHANGE
  // ========================================

  const changeFilter =
    (
      value:
        FilterValue,
    ) => {
      setFilter(
        value,
      );

      setSelectedIndex(
        null,
      );
    };

  // ========================================
  // NEXT / PREVIOUS
  // ========================================

  const showNext =
    () => {
      if (
        selectedIndex ===
          null ||
        filteredGallery.length ===
          0
      ) {
        return;
      }

      setSelectedIndex(
        (
          selectedIndex +
          1
        ) %
          filteredGallery.length,
      );
    };

  const showPrevious =
    () => {
      if (
        selectedIndex ===
          null ||
        filteredGallery.length ===
          0
      ) {
        return;
      }

      setSelectedIndex(
        (
          selectedIndex -
            1 +
          filteredGallery.length
        ) %
          filteredGallery.length,
      );
    };

  return (
    <main className="min-h-screen bg-[#FAF6EA] text-slate-900">

      {/* =====================================
          BACKGROUND
      ===================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF7DE] via-[#FAF6EA] to-[#FAF6EA]" />

        <div className="absolute -top-56 left-1/2 h-[760px] w-[760px] -translate-x-1/2 rounded-full bg-[#FFD27A]/25 blur-[90px]" />

        <div className="absolute -bottom-64 right-[-220px] h-[720px] w-[720px] rounded-full bg-[#FFB35A]/18 blur-[110px]" />
      </div>

      {/* =====================================
          NAV
      ===================================== */}

      <nav className="sticky top-0 z-40 border-b border-black/5 bg-[#F2EBD7]/90 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6">

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
              <p className="text-sm font-semibold">
                Subha Shree Bhawan
              </p>

              <p className="text-xs text-slate-500">
                Gallery
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-2 md:flex">

            <Link
              href="/"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.04]"
            >
              Home
            </Link>

            <Link
              href="/building-a"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.04]"
            >
              Building A
            </Link>

            <Link
              href="/building-b"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-black/[0.04]"
            >
              Building B
            </Link>

            <Link
              href="/gallery"
              className="rounded-xl bg-[#E8DFC8] px-4 py-2 text-sm font-bold text-slate-900"
            >
              Gallery
            </Link>

            <Link
              href="/inquiry"
              className="ml-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white"
            >
              Request Viewing

              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold ring-1 ring-black/10 md:hidden"
          >
            Home
          </Link>
        </div>
      </nav>

      {/* =====================================
          HERO
      ===================================== */}

      <section className="px-5 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-20">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-3xl text-center">

            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 ring-1 ring-black/10">

              <Images className="h-4 w-4" />

              SUBHA SHREE BHAWAN
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight md:text-6xl">
              Gallery
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
              Explore spaces, interiors, businesses and moments from
              Subha Shree Bhawan.
            </p>
          </div>

          {/* =================================
              FILTERS
          ================================= */}

          <div className="mt-10 flex flex-wrap justify-center gap-2">

            <FilterButton
              label="All"
              active={
                filter ===
                "all"
              }
              onClick={() =>
                changeFilter(
                  "all",
                )
              }
            />

            <FilterButton
              label="Building A"
              active={
                filter ===
                "building-a"
              }
              onClick={() =>
                changeFilter(
                  "building-a",
                )
              }
            />

            <FilterButton
              label="Building B"
              active={
                filter ===
                "building-b"
              }
              onClick={() =>
                changeFilter(
                  "building-b",
                )
              }
            />

            <FilterButton
              label="General"
              active={
                filter ===
                "general"
              }
              onClick={() =>
                changeFilter(
                  "general",
                )
              }
            />
          </div>
        </div>
      </section>

      {/* =====================================
          CONTENT
      ===================================== */}

      <section className="px-5 pb-20 sm:px-6">

        <div className="mx-auto max-w-7xl">

          {/* LOADING */}

          {loading && (
            <div className="flex min-h-[360px] items-center justify-center">

              <div className="text-center">

                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E8DFC8] border-t-slate-900" />

                <p className="mt-4 text-sm font-medium text-slate-500">
                  Loading gallery...
                </p>
              </div>
            </div>
          )}

          {/* ERROR */}

          {!loading &&
            error && (
              <div className="mx-auto max-w-xl rounded-[28px] bg-white/70 p-8 text-center shadow-sm ring-1 ring-black/10">

                <Images className="mx-auto h-9 w-9 text-slate-400" />

                <h2 className="mt-4 text-xl font-bold">
                  Gallery unavailable
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {
                    error
                  }
                </p>

                <button
                  type="button"
                  onClick={() =>
                    window.location.reload()
                  }
                  className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
                >
                  Try Again
                </button>
              </div>
            )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            filteredGallery.length ===
              0 && (
              <div className="mx-auto max-w-xl rounded-[28px] bg-white/60 p-10 text-center ring-1 ring-black/10">

                <Images className="mx-auto h-10 w-10 text-slate-400" />

                <h2 className="mt-5 text-2xl font-extrabold">
                  No images yet
                </h2>

                <p className="mt-3 text-slate-500">
                  Gallery images added from the admin panel will appear
                  here automatically.
                </p>
              </div>
            )}

          {/* =================================
              GALLERY GRID
          ================================= */}

          {!loading &&
            !error &&
            filteredGallery.length >
              0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                {filteredGallery.map(
                  (
                    item,
                    index,
                  ) => (
                    <button
                      key={
                        item.id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedIndex(
                          index,
                        )
                      }
                      className="group overflow-hidden rounded-[28px] bg-white/70 text-left shadow-[0_20px_70px_rgba(15,23,42,0.08)] ring-1 ring-black/[0.08] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)]"
                    >

                      {/* IMAGE */}

                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">

                        <img
                          src={resolveGalleryImage(
                            item.image_url,
                          )}
                          alt={
                            item.alt_text ||
                            item.title ||
                            "Subha Shree Bhawan gallery"
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />

                        {Boolean(
                          item.is_featured,
                        ) && (
                          <div className="absolute left-4 top-4 rounded-full bg-slate-900/90 px-3 py-1.5 text-[10px] font-bold tracking-[0.16em] text-white backdrop-blur">
                            FEATURED
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-70" />

                        <div className="absolute bottom-4 left-4 right-4">

                          <p className="text-xs font-semibold tracking-[0.14em] text-white/70">
                            {getGalleryLocation(
                              item,
                            )}
                          </p>

                          <h2 className="mt-1 text-lg font-bold text-white">
                            {item.title ||
                              item.tenant_name ||
                              item.floor_name ||
                              item.building_name ||
                              "Subha Shree Bhawan"}
                          </h2>
                        </div>
                      </div>

                      {/* DESCRIPTION */}

                      {item.description && (
                        <div className="p-5">

                          <p className="line-clamp-2 text-sm leading-6 text-slate-600">
                            {
                              item.description
                            }
                          </p>
                        </div>
                      )}
                    </button>
                  ),
                )}
              </div>
            )}
        </div>
      </section>

      {/* =====================================
          CTA
      ===================================== */}

      <section className="px-5 pb-20 sm:px-6">

        <div className="mx-auto max-w-5xl rounded-[32px] bg-slate-900 px-7 py-10 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:px-12 md:py-14">

          <Building2 className="mx-auto h-9 w-9 text-white/70" />

          <h2 className="mt-5 text-3xl font-extrabold md:text-4xl">
            Interested in seeing the space yourself?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-300">
            Request a viewing and explore Subha Shree Bhawan in person.
          </p>

          <Link
            href="/inquiry"
            className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-slate-900"
          >
            Request a Viewing

            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="px-5 pb-10 sm:px-6">

        <div className="mx-auto flex max-w-7xl flex-col gap-4 border-t border-black/10 pt-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">

          <span>
            © 2026 Subha Shree Bhawan. All rights reserved.
          </span>

          <div className="flex flex-wrap gap-4">

            <Link
              href="/"
              className="font-semibold text-slate-700 hover:text-slate-950"
            >
              Home
            </Link>

            <Link
              href="/building-a"
              className="font-semibold text-slate-700 hover:text-slate-950"
            >
              Building A
            </Link>

            <Link
              href="/building-b"
              className="font-semibold text-slate-700 hover:text-slate-950"
            >
              Building B
            </Link>
          </div>
        </div>
      </footer>

      {/* =====================================
          LIGHTBOX
      ===================================== */}

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 md:p-8"
          onClick={() =>
            setSelectedIndex(
              null,
            )
          }
        >

          {/* CLOSE */}

          <button
            type="button"
            onClick={() =>
              setSelectedIndex(
                null,
              )
            }
            className="absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
            aria-label="Close gallery image"
          >
            <X className="h-5 w-5" />
          </button>

          {/* PREVIOUS */}

          {filteredGallery.length >
            1 && (
              <button
                type="button"
                onClick={(
                  event,
                ) => {
                  event.stopPropagation();

                  showPrevious();
                }}
                className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:left-7"
                aria-label="Previous image"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}

          {/* NEXT */}

          {filteredGallery.length >
            1 && (
              <button
                type="button"
                onClick={(
                  event,
                ) => {
                  event.stopPropagation();

                  showNext();
                }}
                className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:right-7"
                aria-label="Next image"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            )}

          {/* CONTENT */}

          <div
            className="relative flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-[28px] bg-black shadow-2xl"
            onClick={(
              event,
            ) =>
              event.stopPropagation()
            }
          >

            <div className="flex min-h-0 flex-1 items-center justify-center bg-black">

              <img
                src={resolveGalleryImage(
                  selectedItem.image_url,
                )}
                alt={
                  selectedItem.alt_text ||
                  selectedItem.title ||
                  "Subha Shree Bhawan gallery"
                }
                className="max-h-[72vh] w-full object-contain"
              />
            </div>

            <div className="bg-white p-5 md:p-6">

              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">

                <div>

                  <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                    {getGalleryLocation(
                      selectedItem,
                    )}
                  </p>

                  <h2 className="mt-2 text-xl font-extrabold text-slate-900 md:text-2xl">
                    {selectedItem.title ||
                      selectedItem.tenant_name ||
                      selectedItem.floor_name ||
                      selectedItem.building_name ||
                      "Subha Shree Bhawan"}
                  </h2>

                  {selectedItem.description && (
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                      {
                        selectedItem.description
                      }
                    </p>
                  )}
                </div>

                <p className="shrink-0 text-sm font-medium text-slate-400">
                  {selectedIndex !==
                    null
                    ? selectedIndex +
                      1
                    : 1}{" "}
                  /{" "}
                  {
                    filteredGallery.length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ========================================
// FILTER BUTTON
// ========================================

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick:
    () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={[
        "rounded-full px-5 py-2.5 text-sm font-semibold transition",

        active
          ? "bg-slate-900 text-white shadow-[0_12px_35px_rgba(15,23,42,0.16)]"
          : "bg-white/65 text-slate-700 ring-1 ring-black/10 hover:bg-white",
      ].join(
        " ",
      )}
    >
      {
        label
      }
    </button>
  );
}

// ========================================
// IMAGE URL
// ========================================

function resolveGalleryImage(
  imageUrl:
    string,
) {
  if (
    imageUrl.startsWith(
      "http://",
    ) ||
    imageUrl.startsWith(
      "https://",
    )
  ) {
    return imageUrl;
  }

  if (
    imageUrl.startsWith(
      "/",
    )
  ) {
    return `${BACKEND_URL}${imageUrl}`;
  }

  return `${BACKEND_URL}/${imageUrl}`;
}

// ========================================
// LOCATION LABEL
// ========================================

function getGalleryLocation(
  item:
    GalleryItem,
) {
  if (
    item.tenant_name
  ) {
    return [
      item.tenant_name,
      item.floor_name,
      item.building_name,
    ]
      .filter(
        Boolean,
      )
      .join(
        " • ",
      )
      .toUpperCase();
  }

  if (
    item.floor_name
  ) {
    return [
      item.floor_name,
      item.building_name,
    ]
      .filter(
        Boolean,
      )
      .join(
        " • ",
      )
      .toUpperCase();
  }

  if (
    item.building_name
  ) {
    return item.building_name.toUpperCase();
  }

  return "SUBHA SHREE BHAWAN";
}