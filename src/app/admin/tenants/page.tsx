"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

// ========================================
// TYPES
// ========================================

interface Building {
  id: number;
  name: string;
  slug: string;
}

interface Floor {
  id: number;
  building_id: number;

  building_name: string;
  building_slug: string;

  name: string;
  floor_number: number;
  slug: string;

  status: string;
}

interface Tenant {
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

  created_at: string;
  updated_at: string;
}

interface TenantForm {
  floor_id: string;

  name: string;
  slug: string;

  short_description: string;
  description: string;

  logo: string;

  website_url: string;

  phone: string;

  email: string;

  status:
    | "active"
    | "inactive"
    | "coming_soon";

  sort_order: string;
}

const emptyForm: TenantForm = {
  floor_id: "",

  name: "",
  slug: "",

  short_description: "",
  description: "",

  logo: "",

  website_url: "",

  phone: "",

  email: "",

  status: "active",

  sort_order: "0",
};

// ========================================
// PAGE
// ========================================

export default function AdminTenantsPage() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  const [buildings, setBuildings] =
    useState<Building[]>([]);

  const [floors, setFloors] =
    useState<Floor[]>([]);

  const [tenants, setTenants] =
    useState<Tenant[]>([]);

  const [form, setForm] =
    useState<TenantForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [
    moveOutTarget,
    setMoveOutTarget,
  ] = useState<Tenant | null>(
    null
  );

  const [
    movingOut,
    setMovingOut,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [
    buildingFilter,
    setBuildingFilter,
  ] = useState("all");

  const [
    floorFilter,
    setFloorFilter,
  ] = useState("all");

  // ========================================
  // TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem(
      "subhashree_admin_token"
    );
  };

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          getToken();

        if (!token) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        // ==================================
        // VERIFY ADMIN
        // ==================================

        const authResponse =
          await fetch(
            `${API_URL}/auth/me`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        if (!authResponse.ok) {
          localStorage.removeItem(
            "subhashree_admin_token"
          );

          localStorage.removeItem(
            "subhashree_admin"
          );

          router.replace(
            "/admin/login"
          );

          return;
        }

        // ==================================
        // LOAD DATA
        // ==================================

        const [
          buildingsResponse,
          floorsResponse,
          tenantsResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/buildings`
          ),

          fetch(
            `${API_URL}/floors`
          ),

          fetch(
            `${API_URL}/tenants`
          ),
        ]);

        const buildingsData =
          await buildingsResponse.json();

        const floorsData =
          await floorsResponse.json();

        const tenantsData =
          await tenantsResponse.json();

        if (
          !buildingsResponse.ok ||
          !buildingsData.success
        ) {
          throw new Error(
            buildingsData.message ||
              "Unable to load buildings"
          );
        }

        if (
          !floorsResponse.ok ||
          !floorsData.success
        ) {
          throw new Error(
            floorsData.message ||
              "Unable to load floors"
          );
        }

        if (
          !tenantsResponse.ok ||
          !tenantsData.success
        ) {
          throw new Error(
            tenantsData.message ||
              "Unable to load tenants"
          );
        }

        setBuildings(
          buildingsData.buildings ||
            []
        );

        setFloors(
          floorsData.floors ||
            []
        );

        setTenants(
          tenantsData.tenants ||
            []
        );
      } catch (error) {
        console.error(
          "Load tenants error:",
          error
        );

        setError(
          "Unable to load tenant information."
        );
      } finally {
        setLoading(false);
      }
    }, [API_URL, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========================================
  // FILTER FLOORS BY BUILDING
  // ========================================

  const floorsForForm =
    useMemo(() => {
      return floors;
    }, [floors]);

  // ========================================
  // FILTER DISPLAY
  // ========================================

  const floorsForFilter =
    useMemo(() => {
      if (
        buildingFilter ===
        "all"
      ) {
        return floors;
      }

      return floors.filter(
        (floor) =>
          Number(
            floor.building_id
          ) ===
          Number(
            buildingFilter
          )
      );
    }, [
      floors,
      buildingFilter,
    ]);

  const filteredTenants =
    useMemo(() => {
      return tenants.filter(
        (tenant) => {
          const buildingMatches =
            buildingFilter ===
              "all" ||
            Number(
              tenant.building_id
            ) ===
              Number(
                buildingFilter
              );

          const floorMatches =
            floorFilter ===
              "all" ||
            Number(
              tenant.floor_id
            ) ===
              Number(
                floorFilter
              );

          return (
            buildingMatches &&
            floorMatches
          );
        }
      );
    }, [
      tenants,
      buildingFilter,
      floorFilter,
    ]);

  // ========================================
  // FORM FIELD
  // ========================================

  const updateField = (
    field: keyof TenantForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,

      [field]: value,
    }));
  };

  // ========================================
  // CREATE
  // ========================================

  const openCreateForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,

      floor_id:
        floors.length > 0
          ? String(
              floors[0].id
            )
          : "",
    });

    setError("");
    setMessage("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // EDIT
  // ========================================

  const openEditForm = (
    tenant: Tenant
  ) => {
    setEditingId(
      tenant.id
    );

    setForm({
      floor_id: String(
        tenant.floor_id
      ),

      name: tenant.name,

      slug: tenant.slug,

      short_description:
        tenant.short_description ||
        "",

      description:
        tenant.description ||
        "",

      logo:
        tenant.logo ||
        "",

      website_url:
        tenant.website_url ||
        "",

      phone:
        tenant.phone ||
        "",

      email:
        tenant.email ||
        "",

      status:
        tenant.status,

      sort_order: String(
        tenant.sort_order ??
          0
      ),
    });

    setError("");
    setMessage("");

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // CANCEL FORM
  // ========================================

  const cancelForm = () => {
    setEditingId(null);

    setForm(
      emptyForm
    );

    setShowForm(false);

    setError("");
    setMessage("");
  };

  // ========================================
  // SAVE TENANT
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.floor_id) {
      setError(
        "Please select a floor."
      );

      return;
    }

    if (
      !form.name.trim()
    ) {
      setError(
        "Tenant name is required."
      );

      return;
    }

    try {
      setSaving(true);

      const token =
        getToken();

      if (!token) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      const url =
        editingId !== null
          ? `${API_URL}/tenants/${editingId}`
          : `${API_URL}/tenants`;

      const method =
        editingId !== null
          ? "PUT"
          : "POST";

      const response =
        await fetch(
          url,
          {
            method,

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                floor_id:
                  Number(
                    form.floor_id
                  ),

                name:
                  form.name.trim(),

                slug:
                  form.slug.trim(),

                short_description:
                  form.short_description,

                description:
                  form.description,

                logo:
                  form.logo,

                website_url:
                  form.website_url,

                phone:
                  form.phone,

                email:
                  form.email,

                status:
                  form.status,

                sort_order:
                  Number(
                    form.sort_order
                  ) || 0,
              }),
          }
        );

      const data =
        await response.json();

      if (
        response.status ===
        401
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

        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to save tenant."
        );

        return;
      }

      setMessage(
        editingId !== null
          ? "Tenant updated successfully."
          : "Tenant created successfully."
      );

      setEditingId(null);

      setForm(
        emptyForm
      );

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error(
        "Save tenant error:",
        error
      );

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // OPEN MOVE OUT
  // ========================================

  const openMoveOutModal = (
    tenant: Tenant
  ) => {
    setError("");
    setMessage("");

    setMoveOutTarget(
      tenant
    );
  };

  // ========================================
  // CLOSE MOVE OUT
  // ========================================

  const closeMoveOutModal =
    () => {
      if (movingOut) {
        return;
      }

      setMoveOutTarget(
        null
      );
    };

  // ========================================
  // MOVE TENANT OUT
  // ========================================

  const handleMoveOut =
    async () => {
      if (!moveOutTarget) {
        return;
      }

      const tenantName =
        moveOutTarget.name;

      try {
        setMovingOut(true);

        setError("");
        setMessage("");

        const token =
          getToken();

        if (!token) {
          router.replace(
            "/admin/login"
          );

          return;
        }

        const response =
          await fetch(
            `${API_URL}/tenants/${moveOutTarget.id}/move-out`,
            {
              method:
                "PATCH",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (
          response.status ===
          401
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

          return;
        }

        if (
          !response.ok ||
          !data.success
        ) {
          setError(
            data.message ||
              "Unable to move tenant out."
          );

          return;
        }

        setMoveOutTarget(
          null
        );

        setMessage(
          data.message ||
            `${tenantName} moved out successfully.`
        );

        await loadData();
      } catch (error) {
        console.error(
          "Move out tenant error:",
          error
        );

        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setMovingOut(
          false
        );
      }
    };

  // ========================================
  // STATUS STYLES
  // ========================================

  const getStatusClasses = (
    status: Tenant["status"]
  ) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700";

      case "coming_soon":
        return "bg-amber-50 text-amber-700";

      case "inactive":
        return "bg-slate-100 text-slate-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ===================================
          HEADER
      =================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin"
                )
              }
              className="mb-1 text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              ← Dashboard
            </button>

            <h1 className="text-xl font-semibold text-slate-900">
              Tenants
            </h1>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Tenant
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ===================================
            MESSAGES
        =================================== */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* ===================================
            FORM
        =================================== */}

        {showForm && (
          <form
            onSubmit={
              handleSubmit
            }
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {editingId !==
                  null
                    ? "Edit Tenant"
                    : "Add Tenant"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage business,
                  contact and floor
                  information.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  cancelForm
                }
                className="text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                Cancel
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {/* FLOOR */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Floor *
                </label>

                <select
                  value={
                    form.floor_id
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "floor_id",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">
                    Select Floor
                  </option>

                  {floorsForForm.map(
                    (floor) => (
                      <option
                        key={
                          floor.id
                        }
                        value={
                          floor.id
                        }
                      >
                        {
                          floor.building_name
                        }{" "}
                        —{" "}
                        {
                          floor.name
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tenant Name *
                </label>

                <input
                  value={
                    form.name
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "name",
                      event.target
                        .value
                    )
                  }
                  placeholder="Moon Technology"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* SLUG */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slug
                </label>

                <input
                  value={
                    form.slug
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "slug",
                      event.target
                        .value
                    )
                  }
                  placeholder="moon-technology"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Leave blank when
                  creating to generate
                  it from the tenant
                  name.
                </p>
              </div>

              {/* SHORT DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Short Description
                </label>

                <input
                  value={
                    form.short_description
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "short_description",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Description
                </label>

                <textarea
                  rows={4}
                  value={
                    form.description
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "description",
                      event.target
                        .value
                    )
                  }
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* WEBSITE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Website
                </label>

                <input
                  value={
                    form.website_url
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "website_url",
                      event.target
                        .value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </label>

                <input
                  value={
                    form.phone
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "phone",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "email",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "status",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>

                  <option value="coming_soon">
                    Coming Soon
                  </option>
                </select>
              </div>

              {/* LOGO */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Logo / Image URL
                </label>

                <input
                  value={
                    form.logo
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "logo",
                      event.target
                        .value
                    )
                  }
                  placeholder="/uploads/gallery/..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Later we will select
                  this directly from
                  the Gallery uploader.
                </p>
              </div>

              {/* SORT */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Sort Order
                </label>

                <input
                  type="number"
                  value={
                    form.sort_order
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "sort_order",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={
                  cancelForm
                }
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId !==
                    null
                    ? "Update Tenant"
                    : "Create Tenant"}
              </button>
            </div>
          </form>
        )}

        {/* ===================================
            HEADER / FILTERS
        =================================== */}

        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Current Tenants
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {tenants.length}{" "}
              tenants currently in
              the database.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {/* BUILDING FILTER */}

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Building
              </label>

              <select
                value={
                  buildingFilter
                }
                onChange={(
                  event
                ) => {
                  setBuildingFilter(
                    event.target
                      .value
                  );

                  setFloorFilter(
                    "all"
                  );
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
              >
                <option value="all">
                  All Buildings
                </option>

                {buildings.map(
                  (building) => (
                    <option
                      key={
                        building.id
                      }
                      value={
                        building.id
                      }
                    >
                      {
                        building.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* FLOOR FILTER */}

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Floor
              </label>

              <select
                value={
                  floorFilter
                }
                onChange={(
                  event
                ) =>
                  setFloorFilter(
                    event.target
                      .value
                  )
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
              >
                <option value="all">
                  All Floors
                </option>

                {floorsForFilter.map(
                  (floor) => (
                    <option
                      key={
                        floor.id
                      }
                      value={
                        floor.id
                      }
                    >
                      {
                        floor.name
                      }
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
        </div>

        {/* ===================================
            TENANT LIST
        =================================== */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading tenants...
          </div>
        ) : filteredTenants.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-800">
              No tenants found.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Add Tenant
            </button>
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredTenants.map(
              (tenant) => (
                <div
                  key={
                    tenant.id
                  }
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {
                            tenant.name
                          }
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            tenant.status
                          )}`}
                        >
                          {tenant.status
                            .replace(
                              "_",
                              " "
                            )
                            .toUpperCase()}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {
                          tenant.building_name
                        }{" "}
                        ·{" "}
                        {
                          tenant.floor_name
                        }
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            tenant
                          )
                        }
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openMoveOutModal(
                            tenant
                          )
                        }
                        className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Move Out
                      </button>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    {tenant.short_description ||
                      "No short description added."}
                  </p>

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm">
                    {tenant.phone && (
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">
                          Phone:
                        </span>{" "}

                        {
                          tenant.phone
                        }
                      </p>
                    )}

                    {tenant.email && (
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">
                          Email:
                        </span>{" "}

                        {
                          tenant.email
                        }
                      </p>
                    )}

                    {tenant.website_url && (
                      <p className="truncate text-slate-600">
                        <span className="font-medium text-slate-800">
                          Website:
                        </span>{" "}

                        {
                          tenant.website_url
                        }
                      </p>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ===================================
          MOVE OUT CONFIRMATION
      =================================== */}

      {moveOutTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeMoveOutModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="move-out-title"
            className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                  Tenant Move Out
                </p>

                <h2
                  id="move-out-title"
                  className="mt-2 text-xl font-semibold text-slate-900"
                >
                  Move out{" "}
                  {
                    moveOutTarget.name
                  }
                  ?
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeMoveOutModal
                }
                disabled={
                  movingOut
                }
                className="rounded-lg px-2 py-1 text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Close move out confirmation"
              >
                ×
              </button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                {
                  moveOutTarget.building_name
                }{" "}
                ·{" "}
                {
                  moveOutTarget.floor_name
                }
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                This will remove{" "}
                {
                  moveOutTarget.name
                }{" "}
                from the tenant list
                and the public
                website.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                If this is the last
                tenant on{" "}
                {
                  moveOutTarget.floor_name
                }
                , that floor will
                automatically become
                available for rent.
                If another tenant
                remains on the floor,
                it will stay
                occupied.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeMoveOutModal
                }
                disabled={
                  movingOut
                }
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleMoveOut
                }
                disabled={
                  movingOut
                }
                className="rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {movingOut
                  ? "Moving Out..."
                  : "Confirm Move Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}