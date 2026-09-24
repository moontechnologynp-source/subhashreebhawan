"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";

// ========================================
// CONFIG
// ========================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://subhashreebhawan-api.vercel.app/api";

// ========================================
// TYPES
// ========================================

type InquiryStatus =
  | "new"
  | "read"
  | "contacted"
  | "closed";

interface Inquiry {
  id: number;

  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;

  subject: string | null;
  message: string;

  building_id: number | null;
  floor_id: number | null;

  building_name: string | null;
  building_slug: string | null;

  floor_name: string | null;
  floor_number: number | null;
  floor_slug: string | null;

  source: string;

  status: InquiryStatus;

  admin_note: string | null;

  created_at: string;
  updated_at: string;
}

// ========================================
// PAGE
// ========================================

export default function AdminInquiriesPage() {
  const router = useRouter();

  const [inquiries, setInquiries] =
    useState<Inquiry[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "all" | InquiryStatus
    >("all");

  const [
    selectedInquiry,
    setSelectedInquiry,
  ] =
    useState<Inquiry | null>(
      null
    );

  const [
    selectedStatus,
    setSelectedStatus,
  ] =
    useState<InquiryStatus>(
      "new"
    );

  const [
    adminNote,
    setAdminNote,
  ] =
    useState("");

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState(false);

  // ========================================
  // TOKEN
  // ========================================

  const getToken = () => {
    if (
      typeof window ===
      "undefined"
    ) {
      return null;
    }

    return localStorage.getItem(
      "subhashree_admin_token"
    );
  };

  // ========================================
  // VERIFY ADMIN
  // ========================================

  useEffect(() => {
    const verifyAdmin =
      async () => {
        const token =
          getToken();

        if (!token) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        try {
          const response =
            await fetch(
              `${API_URL}/auth/me`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (
            !response.ok
          ) {
            localStorage.removeItem(
              "subhashree_admin_token"
            );

            localStorage.removeItem(
              "subhashree_admin"
            );

            router.replace(
              "/admin/login"
            );
          }
        } catch (
        error
        ) {
          console.error(
            "Admin verification error:",
            error
          );
        }
      };

    verifyAdmin();
  }, [router]);

  // ========================================
  // LOAD INQUIRIES
  // ========================================

  const loadInquiries =
    async () => {
      const token =
        getToken();

      if (!token) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `${API_URL}/inquiries`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              cache:
                "no-store",
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
            "Unable to load inquiries"
          );
        }

        setInquiries(
          data.inquiries ||
          []
        );
      } catch (
      error
      ) {
        console.error(
          "Load inquiries error:",
          error
        );

        setError(
          error instanceof
            Error
            ? error.message
            : "Unable to load inquiries"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadInquiries();
  }, []);

  // ========================================
  // COUNTS
  // ========================================

  const stats =
    useMemo(() => {
      return {
        total:
          inquiries.length,

        new:
          inquiries.filter(
            (item) =>
              item.status ===
              "new"
          ).length,

        read:
          inquiries.filter(
            (item) =>
              item.status ===
              "read"
          ).length,

        contacted:
          inquiries.filter(
            (item) =>
              item.status ===
              "contacted"
          ).length,

        closed:
          inquiries.filter(
            (item) =>
              item.status ===
              "closed"
          ).length,
      };
    }, [inquiries]);

  // ========================================
  // FILTER
  // ========================================

  const filteredInquiries =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return inquiries.filter(
        (inquiry) => {
          const matchesStatus =
            statusFilter ===
            "all" ||
            inquiry.status ===
            statusFilter;

          if (
            !matchesStatus
          ) {
            return false;
          }

          if (
            !normalizedSearch
          ) {
            return true;
          }

          const searchable =
            [
              inquiry.name,
              inquiry.email,
              inquiry.phone,
              inquiry.company,
              inquiry.subject,
              inquiry.message,
              inquiry.building_name,
              inquiry.floor_name,
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

          return searchable.includes(
            normalizedSearch
          );
        }
      );
    }, [
      inquiries,
      search,
      statusFilter,
    ]);

  // ========================================
  // OPEN INQUIRY
  // ========================================

  const openInquiry = (
    inquiry: Inquiry
  ) => {
    setSelectedInquiry(
      inquiry
    );

    setSelectedStatus(
      inquiry.status
    );

    setAdminNote(
      inquiry.admin_note ||
      ""
    );
  };

  // ========================================
  // CLOSE MODAL
  // ========================================

  const closeInquiry =
    () => {
      setSelectedInquiry(
        null
      );

      setAdminNote("");

      setSaving(false);

      setDeleting(false);
    };

  // ========================================
  // SAVE STATUS / NOTE
  // ========================================

  const saveInquiry =
    async () => {
      if (
        !selectedInquiry
      ) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        setSaving(true);

        const response =
          await fetch(
            `${API_URL}/inquiries/${selectedInquiry.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  status:
                    selectedStatus,

                  admin_note:
                    adminNote,
                }),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
            "Unable to update inquiry"
          );
        }

        setInquiries(
          (previous) =>
            previous.map(
              (item) =>
                item.id ===
                  selectedInquiry.id
                  ? data.inquiry
                  : item
            )
        );

        setSelectedInquiry(
          data.inquiry
        );

        setSelectedStatus(
          data.inquiry.status
        );

        setAdminNote(
          data.inquiry.admin_note ||
          ""
        );
      } catch (
      error
      ) {
        alert(
          error instanceof
            Error
            ? error.message
            : "Unable to update inquiry"
        );
      } finally {
        setSaving(false);
      }
    };

  // ========================================
  // DELETE
  // ========================================

  const deleteInquiry =
    async () => {
      if (
        !selectedInquiry
      ) {
        return;
      }

      const confirmed =
        window.confirm(
          `Delete inquiry from ${selectedInquiry.name}?`
        );

      if (!confirmed) {
        return;
      }

      const token =
        getToken();

      if (!token) {
        return;
      }

      try {
        setDeleting(true);

        const response =
          await fetch(
            `${API_URL}/inquiries/${selectedInquiry.id}`,
            {
              method:
                "DELETE",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
            "Unable to delete inquiry"
          );
        }

        setInquiries(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                selectedInquiry.id
            )
        );

        closeInquiry();
      } catch (
      error
      ) {
        alert(
          error instanceof
            Error
            ? error.message
            : "Unable to delete inquiry"
        );
      } finally {
        setDeleting(false);
      }
    };

  // ========================================
  // PAGE
  // ========================================

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* HEADER */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin"
                )
              }
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Administration
              </p>

              <h1 className="mt-1 text-2xl font-extrabold tracking-tight">
                Inquiries
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={
              loadInquiries
            }
            disabled={
              loading
            }
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading
                  ? "animate-spin"
                  : ""
                }`}
            />

            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            label="Total"
            value={
              stats.total
            }
            icon={
              <MessageSquare className="h-5 w-5" />
            }
          />

          <StatCard
            label="New"
            value={
              stats.new
            }
            icon={
              <Clock3 className="h-5 w-5" />
            }
          />

          <StatCard
            label="Read"
            value={
              stats.read
            }
            icon={
              <Mail className="h-5 w-5" />
            }
          />

          <StatCard
            label="Contacted"
            value={
              stats.contacted
            }
            icon={
              <Phone className="h-5 w-5" />
            }
          />

          <StatCard
            label="Closed"
            value={
              stats.closed
            }
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
          />
        </div>

        {/* FILTER */}

        <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={
                  search
                }
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search name, email, phone, building..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <select
              value={
                statusFilter
              }
              onChange={(
                event
              ) =>
                setStatusFilter(
                  event.target
                    .value as
                  | "all"
                  | InquiryStatus
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium outline-none"
            >
              <option value="all">
                All statuses
              </option>

              <option value="new">
                New
              </option>

              <option value="read">
                Read
              </option>

              <option value="contacted">
                Contacted
              </option>

              <option value="closed">
                Closed
              </option>
            </select>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

            <p className="mt-4 text-sm text-slate-500">
              Loading
              inquiries...
            </p>
          </div>
        ) : filteredInquiries.length ===
          0 ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-slate-300" />

            <h2 className="mt-4 text-lg font-bold">
              No inquiries
              found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Website
              inquiries will
              appear here.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredInquiries.map(
              (inquiry) => (
                <button
                  key={
                    inquiry.id
                  }
                  type="button"
                  onClick={() =>
                    openInquiry(
                      inquiry
                    )
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-[1px] hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-lg font-extrabold tracking-tight">
                          {
                            inquiry.name
                          }
                        </h2>

                        <StatusBadge
                          status={
                            inquiry.status
                          }
                        />
                      </div>

                      <p className="mt-2 text-sm font-medium text-slate-700">
                        {inquiry.subject ||
                          "General Inquiry"}
                      </p>

                      <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
                        {
                          inquiry.message
                        }
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                        {inquiry.email && (
                          <span className="inline-flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />

                            {
                              inquiry.email
                            }
                          </span>
                        )}

                        {inquiry.phone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5" />

                            {
                              inquiry.phone
                            }
                          </span>
                        )}

                        {inquiry.building_name && (
                          <span className="inline-flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5" />

                            {
                              inquiry.building_name
                            }

                            {inquiry.floor_name
                              ? ` • ${inquiry.floor_name}`
                              : ""}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-xs font-medium text-slate-400">
                      {formatDate(
                        inquiry.created_at
                      )}
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        )}
      </main>

      {/* ===================================
          DETAIL MODAL
      =================================== */}

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Inquiry #
                  {
                    selectedInquiry.id
                  }
                </p>

                <h2 className="mt-1 text-xl font-extrabold">
                  {
                    selectedInquiry.name
                  }
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeInquiry
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition hover:bg-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {/* STATUS */}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <StatusBadge
                  status={
                    selectedInquiry.status
                  }
                />

                <span className="text-xs text-slate-400">
                  Received{" "}
                  {formatDateTime(
                    selectedInquiry.created_at
                  )}
                </span>
              </div>

              {/* CONTACT */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <DetailCard
                  icon={
                    <User className="h-5 w-5" />
                  }
                  label="Name"
                  value={
                    selectedInquiry.name
                  }
                />

                <DetailCard
                  icon={
                    <Building2 className="h-5 w-5" />
                  }
                  label="Company"
                  value={
                    selectedInquiry.company ||
                    "Not provided"
                  }
                />

                <DetailCard
                  icon={
                    <Mail className="h-5 w-5" />
                  }
                  label="Email"
                  value={
                    selectedInquiry.email ||
                    "Not provided"
                  }
                  href={
                    selectedInquiry.email
                      ? `mailto:${selectedInquiry.email}`
                      : undefined
                  }
                />

                <DetailCard
                  icon={
                    <Phone className="h-5 w-5" />
                  }
                  label="Phone"
                  value={
                    selectedInquiry.phone ||
                    "Not provided"
                  }
                  href={
                    selectedInquiry.phone
                      ? `tel:${selectedInquiry.phone}`
                      : undefined
                  }
                />
              </div>

              {/* BUILDING */}

              {(selectedInquiry.building_name ||
                selectedInquiry.floor_name) && (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                      Property
                      Interest
                    </p>

                    <p className="mt-2 font-bold">
                      {selectedInquiry.building_name ||
                        "Building not specified"}

                      {selectedInquiry.floor_name
                        ? ` • ${selectedInquiry.floor_name}`
                        : ""}
                    </p>
                  </div>
                )}

              {/* SUBJECT */}

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Subject
                </p>

                <p className="mt-2 font-bold text-slate-900">
                  {selectedInquiry.subject ||
                    "General Inquiry"}
                </p>
              </div>

              {/* MESSAGE */}

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  Message
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                  {
                    selectedInquiry.message
                  }
                </div>
              </div>

              {/* ADMIN STATUS */}

              <div className="mt-8 border-t border-slate-200 pt-7">
                <h3 className="text-lg font-extrabold">
                  Admin Management
                </h3>

                <div className="mt-5">
                  <label className="text-sm font-bold text-slate-700">
                    Status
                  </label>

                  <select
                    value={
                      selectedStatus
                    }
                    onChange={(
                      event
                    ) =>
                      setSelectedStatus(
                        event.target
                          .value as InquiryStatus
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
                  >
                    <option value="new">
                      New
                    </option>

                    <option value="read">
                      Read
                    </option>

                    <option value="contacted">
                      Contacted
                    </option>

                    <option value="closed">
                      Closed
                    </option>
                  </select>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-bold text-slate-700">
                    Internal
                    Admin Note
                  </label>

                  <textarea
                    value={
                      adminNote
                    }
                    onChange={(
                      event
                    ) =>
                      setAdminNote(
                        event.target
                          .value
                      )
                    }
                    rows={5}
                    placeholder="Example: Called customer on 11 Sep. Asked to send floor plan."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-slate-400"
                  />
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={
                      deleteInquiry
                    }
                    disabled={
                      deleting ||
                      saving
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />

                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      saveInquiry
                    }
                    disabled={
                      saving ||
                      deleting
                    }
                    className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================
// STAT CARD
// ========================================

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">
          {label}
        </p>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-3xl font-extrabold tracking-tight">
        {value}
      </p>
    </div>
  );
}

// ========================================
// STATUS BADGE
// ========================================

function StatusBadge({
  status,
}: {
  status: InquiryStatus;
}) {
  const classes = {
    new:
      "bg-blue-50 text-blue-700 ring-blue-200",

    read:
      "bg-slate-100 text-slate-700 ring-slate-200",

    contacted:
      "bg-amber-50 text-amber-700 ring-amber-200",

    closed:
      "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.16em] ring-1 ${classes[status]}`}
    >
      {status}
    </span>
  );
}

// ========================================
// DETAIL CARD
// ========================================

function DetailCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-bold text-slate-800">
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4 transition hover:bg-slate-50"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
      {content}
    </div>
  );
}

// ========================================
// DATE HELPERS
// ========================================

function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function formatDateTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );
}