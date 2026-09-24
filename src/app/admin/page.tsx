"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active?: number;
}

interface Inquiry {
  id: number;
  status: "new" | "read" | "contacted" | "closed";
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [newInquiryCount, setNewInquiryCount] =
    useState(0);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  // ========================================
  // VERIFY ADMIN LOGIN
  // ========================================

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem(
          "subhashree_admin_token"
        );

        if (!token) {
          router.replace("/admin/login");
          return;
        }

        // ========================================
        // VERIFY TOKEN
        // ========================================

        const response = await fetch(
          `${API_URL}/auth/me`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          localStorage.removeItem(
            "subhashree_admin_token"
          );

          localStorage.removeItem(
            "subhashree_admin"
          );

          router.replace("/admin/login");
          return;
        }

        setAdmin(data.admin);

        // ========================================
        // LOAD INQUIRY COUNT
        // ========================================

        try {
          const inquiryResponse = await fetch(
            `${API_URL}/inquiries`,
            {
              method: "GET",

              headers: {
                Authorization: `Bearer ${token}`,
              },

              cache: "no-store",
            }
          );

          const inquiryData =
            await inquiryResponse.json();

          if (
            inquiryResponse.ok &&
            inquiryData.success
          ) {
            const inquiries: Inquiry[] =
              inquiryData.inquiries || [];

            const newCount =
              inquiries.filter(
                (inquiry) =>
                  inquiry.status === "new"
              ).length;

            setNewInquiryCount(
              newCount
            );
          }
        } catch (inquiryError) {
          console.error(
            "Unable to load inquiry count:",
            inquiryError
          );

          // We do NOT block the whole
          // dashboard if inquiry count
          // fails to load.
          setNewInquiryCount(0);
        }
      } catch (error) {
        console.error(
          "Admin verification error:",
          error
        );

        setError(
          "Unable to verify your login. Please make sure the backend is running."
        );
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, [API_URL, router]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem(
      "subhashree_admin_token"
    );

    localStorage.removeItem(
      "subhashree_admin"
    );

    router.replace("/admin/login");
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

          <p className="mt-4 text-sm text-slate-500">
            Checking admin login...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Connection Error
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
            className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ========================================
          HEADER
      ======================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Subhashree Bhawan
            </h1>

            <p className="text-xs text-slate-500">
              Administration Portal
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-800">
                {admin.name}
              </p>

              <p className="text-xs text-slate-500">
                {admin.email}
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ========================================
          CONTENT
      ======================================== */}

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Dashboard
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Welcome, {admin.name}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage Subhashree Bhawan website content
            from here.
          </p>
        </div>

        {/* ========================================
            MANAGEMENT CARDS
        ======================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {/* BUILDINGS */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/buildings")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">
              🏢
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Buildings
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Manage Building A and Building B.
            </p>
          </button>

          {/* FLOORS */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/floors")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">
              🏬
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Floors
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Manage floor availability and details.
            </p>
          </button>

          {/* TENANTS */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/tenants")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">
              🏪
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Tenants
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Manage companies and businesses.
            </p>
          </button>

          {/* GALLERY */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/gallery")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="text-2xl">
              🖼️
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Gallery
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Upload and manage website images.
            </p>
          </button>

          {/* INQUIRIES */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/inquiries")
            }
            className="relative rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* NEW COUNT BADGE */}

            {newInquiryCount > 0 && (
              <div className="absolute right-4 top-4 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
                {newInquiryCount} New
              </div>
            )}

            <div className="text-2xl">
              💬
            </div>

            <h3 className="mt-4 font-semibold text-slate-900">
              Inquiries
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              View and manage customer inquiries.
            </p>

            {newInquiryCount > 0 ? (
              <p className="mt-3 text-sm font-semibold text-red-600">
                {newInquiryCount} new{" "}
                {newInquiryCount === 1
                  ? "inquiry"
                  : "inquiries"}
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-emerald-600">
                No new inquiries
              </p>
            )}
          </button>
        </div>

        {/* ========================================
            QUICK STATUS
        ======================================== */}

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {/* INQUIRY STATUS */}

          <button
            type="button"
            onClick={() =>
              router.push("/admin/inquiries")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Customer Inquiries
                </p>

                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  {newInquiryCount > 0
                    ? `${newInquiryCount} new ${newInquiryCount === 1
                      ? "message"
                      : "messages"
                    }`
                    : "You're all caught up"}
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                💬
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Open the inquiry center to review customer
              messages, change their status, and add
              internal notes.
            </p>

            <p className="mt-5 text-sm font-semibold text-slate-900">
              View Inquiries →
            </p>
          </button>

          {/* WEBSITE */}

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  Public Website
                </p>

                <h3 className="mt-2 text-xl font-semibold text-slate-900">
                  View Website
                </h3>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🌐
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              Preview the public website and check your
              latest building, floor, tenant, and gallery
              updates.
            </p>

            <p className="mt-5 text-sm font-semibold text-slate-900">
              Open Website →
            </p>
          </button>
        </div>

        {/* ========================================
            ACCOUNT INFORMATION
        ======================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900">
            Logged-in Administrator
          </h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Name
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {admin.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Email
              </p>

              <p className="mt-1 text-sm font-medium text-slate-800">
                {admin.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Role
              </p>

              <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                {admin.role.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}