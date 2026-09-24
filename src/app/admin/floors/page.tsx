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
  status: string;
}

interface Floor {
  id: number;
  building_id: number;

  building_name: string;
  building_slug: string;

  name: string;
  floor_number: number;
  slug: string;

  description: string | null;

  area_sqft: string | number | null;

  status:
  | "available"
  | "occupied"
  | "coming_soon"
  | "inactive";

  tenant_name: string | null;

  featured_image: string | null;

  sort_order: number;

  created_at: string;
  updated_at: string;
}

interface FloorForm {
  building_id: string;

  name: string;

  floor_number: string;

  slug: string;

  description: string;

  area_sqft: string;

  status:
  | "available"
  | "occupied"
  | "coming_soon"
  | "inactive";

  featured_image: string;

  sort_order: string;
}

const emptyForm: FloorForm = {
  building_id: "",
  name: "",
  floor_number: "",
  slug: "",
  description: "",
  area_sqft: "",
  status: "available",
  featured_image: "",
  sort_order: "0",
};

// ========================================
// PAGE
// ========================================

export default function AdminFloorsPage() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  const [buildings, setBuildings] =
    useState<Building[]>([]);

  const [floors, setFloors] =
    useState<Floor[]>([]);

  const [form, setForm] =
    useState<FloorForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [buildingFilter, setBuildingFilter] =
    useState("all");

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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      // ====================================
      // VERIFY ADMIN
      // ====================================

      const authResponse = await fetch(
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

        router.replace("/admin/login");

        return;
      }

      // ====================================
      // LOAD BUILDINGS + FLOORS
      // ====================================

      const [
        buildingsResponse,
        floorsResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/buildings`
        ),

        fetch(
          `${API_URL}/floors`
        ),
      ]);

      const buildingsData =
        await buildingsResponse.json();

      const floorsData =
        await floorsResponse.json();

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

      setBuildings(
        buildingsData.buildings || []
      );

      setFloors(
        floorsData.floors || []
      );
    } catch (error) {
      console.error(
        "Load floors error:",
        error
      );

      setError(
        "Unable to load floors."
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========================================
  // FILTERED FLOORS
  // ========================================

  const filteredFloors =
    useMemo(() => {
      if (
        buildingFilter === "all"
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

  // ========================================
  // UPDATE FORM FIELD
  // ========================================

  const updateField = (
    field: keyof FloorForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ========================================
  // CREATE FORM
  // ========================================

  const openCreateForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,

      building_id:
        buildings.length > 0
          ? String(
            buildings[0].id
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
  // EDIT FORM
  // ========================================

  const openEditForm = (
    floor: Floor
  ) => {
    setEditingId(floor.id);

    setForm({
      building_id: String(
        floor.building_id
      ),

      name: floor.name,

      floor_number: String(
        floor.floor_number
      ),

      slug: floor.slug,

      description:
        floor.description || "",

      area_sqft:
        floor.area_sqft !== null
          ? String(
            floor.area_sqft
          )
          : "",

      status: floor.status,

      featured_image:
        floor.featured_image || "",

      sort_order: String(
        floor.sort_order ?? 0
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

    setForm(emptyForm);

    setShowForm(false);

    setError("");
    setMessage("");
  };

  // ========================================
  // SAVE FLOOR
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.building_id) {
      setError(
        "Please select a building."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Floor name is required."
      );

      return;
    }

    if (
      form.floor_number === ""
    ) {
      setError(
        "Floor number is required."
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
          ? `${API_URL}/floors/${editingId}`
          : `${API_URL}/floors`;

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
                building_id:
                  Number(
                    form.building_id
                  ),

                name:
                  form.name.trim(),

                floor_number:
                  Number(
                    form.floor_number
                  ),

                slug:
                  form.slug.trim(),

                description:
                  form.description,

                area_sqft:
                  form.area_sqft
                    ? Number(
                      form.area_sqft
                    )
                    : null,

                status:
                  form.status,

                featured_image:
                  form.featured_image,

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
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
          "Unable to save floor."
        );

        return;
      }

      setMessage(
        editingId !== null
          ? "Floor updated successfully."
          : "Floor created successfully."
      );

      setEditingId(null);

      setForm(emptyForm);

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error(
        "Save floor error:",
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
  // STATUS STYLE
  // ========================================

  const getStatusClasses = (
    status: Floor["status"]
  ) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700";

      case "occupied":
        return "bg-blue-50 text-blue-700";

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
      {/* ==================================
          HEADER
      ================================== */}

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
              className="mb-1 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              ← Dashboard
            </button>

            <h1 className="text-xl font-semibold text-slate-900">
              Floors
            </h1>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Floor
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* ==================================
            MESSAGES
        ================================== */}

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

        {/* ==================================
            FORM
        ================================== */}

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
                  {editingId !== null
                    ? "Edit Floor"
                    : "Add Floor"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage floor details,
                  availability and
                  building assignment.
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
              {/* BUILDING */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Building *
                </label>

                <select
                  value={
                    form.building_id
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "building_id",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700"
                >
                  <option value="">
                    Select Building
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

              {/* FLOOR NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Floor Name *
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
                  placeholder="3rd Floor"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* FLOOR NUMBER */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Floor Number *
                </label>

                <input
                  type="number"
                  value={
                    form.floor_number
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "floor_number",
                      event.target
                        .value
                    )
                  }
                  placeholder="3"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Use 0 for Ground
                  Floor.
                </p>
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
                  placeholder="3rd-floor"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Leave blank when
                  creating to generate
                  automatically.
                </p>
              </div>

              {/* AREA */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Area (sq. ft.)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={
                    form.area_sqft
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "area_sqft",
                      event.target
                        .value
                    )
                  }
                  placeholder="3500"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
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
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-slate-700"
                >
                  <option value="available">
                    Available
                  </option>

                  <option value="occupied">
                    Occupied
                  </option>

                  <option value="coming_soon">
                    Coming Soon
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
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
                  placeholder="Enter floor details..."
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* IMAGE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Featured Image URL
                </label>

                <input
                  value={
                    form.featured_image
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "featured_image",
                      event.target
                        .value
                    )
                  }
                  placeholder="/uploads/gallery/..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1 text-xs text-slate-400">
                  We will connect this
                  with the Gallery page
                  later.
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
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
                disabled={saving}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId !==
                    null
                    ? "Update Floor"
                    : "Create Floor"}
              </button>
            </div>
          </form>
        )}

        {/* ==================================
            TOP SECTION
        ================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Building Floors
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {floors.length} floors
              currently in the
              database.
            </p>
          </div>

          {/* FILTER */}

          <div className="w-full sm:w-56">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Filter Building
            </label>

            <select
              value={
                buildingFilter
              }
              onChange={(
                event
              ) =>
                setBuildingFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none"
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
        </div>

        {/* ==================================
            FLOOR LIST
        ================================== */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading floors...
          </div>
        ) : filteredFloors.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="font-medium text-slate-800">
              No floors found.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Add Floor
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFloors.map(
              (floor) => (
                <div
                  key={floor.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                    {/* LEFT */}

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-slate-900">
                          {
                            floor.name
                          }
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                            floor.status
                          )}`}
                        >
                          {floor.status
                            .replace(
                              "_",
                              " "
                            )
                            .toUpperCase()}
                        </span>
                      </div>

                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {
                          floor.building_name
                        }
                      </p>

                      <p className="mt-3 text-sm text-slate-600">
                        {floor.description ||
                          "No description added."}
                      </p>
                    </div>

                    {/* DETAILS */}

                    <div className="flex shrink-0 items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Area
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {floor.area_sqft
                            ? `${Number(
                              floor.area_sqft
                            ).toLocaleString()} sq. ft.`
                            : "—"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            floor
                          )
                        }
                        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}