"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

interface Building {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  address: string | null;
  total_floors: number;
  status: "active" | "inactive" | "coming_soon";
  featured_image: string | null;
  is_featured: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BuildingForm {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  address: string;
  total_floors: string;
  status: "active" | "inactive" | "coming_soon";
  featured_image: string;
  is_featured: boolean;
  sort_order: string;
}

const emptyForm: BuildingForm = {
  name: "",
  slug: "",
  short_description: "",
  description: "",
  address: "",
  total_floors: "",
  status: "active",
  featured_image: "",
  is_featured: false,
  sort_order: "0",
};

export default function AdminBuildingsPage() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  const [buildings, setBuildings] =
    useState<Building[]>([]);

  const [form, setForm] =
    useState<BuildingForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  // ========================================
  // GET TOKEN
  // ========================================

  const getToken = () => {
    return localStorage.getItem(
      "subhashree_admin_token"
    );
  };

  // ========================================
  // LOAD BUILDINGS
  // ========================================

  const loadBuildings = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          router.replace(
            "/admin/login"
          );

          return;
        }

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

        const response =
          await fetch(
            `${API_URL}/buildings`
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
            "Unable to load buildings"
          );
        }

        setBuildings(
          data.buildings || []
        );
      } catch (error) {
        console.error(
          "Load buildings error:",
          error
        );

        setError(
          "Unable to load buildings."
        );
      } finally {
        setLoading(false);
      }
    },
    [API_URL, router]
  );

  useEffect(() => {
    loadBuildings();
  }, [loadBuildings]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const updateField = (
    field: keyof BuildingForm,
    value: string | boolean
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
    setForm(emptyForm);
    setError("");
    setMessage("");
    setShowForm(true);
  };

  // ========================================
  // EDIT
  // ========================================

  const openEditForm = (
    building: Building
  ) => {
    setEditingId(building.id);

    setForm({
      name: building.name,
      slug: building.slug,
      short_description:
        building.short_description ||
        "",
      description:
        building.description || "",
      address:
        building.address || "",
      total_floors: String(
        building.total_floors ?? 0
      ),
      status: building.status,
      featured_image:
        building.featured_image ||
        "",
      is_featured:
        Boolean(
          building.is_featured
        ),
      sort_order: String(
        building.sort_order ?? 0
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
  // CANCEL
  // ========================================

  const cancelForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
    setError("");
    setMessage("");
  };

  // ========================================
  // SAVE
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError(
        "Building name is required."
      );

      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        router.replace(
          "/admin/login"
        );

        return;
      }

      const url = editingId
        ? `${API_URL}/buildings/${editingId}`
        : `${API_URL}/buildings`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response =
        await fetch(url, {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name:
              form.name.trim(),

            slug:
              form.slug.trim(),

            short_description:
              form.short_description,

            description:
              form.description,

            address:
              form.address,

            total_floors:
              Number(
                form.total_floors
              ) || 0,

            status:
              form.status,

            featured_image:
              form.featured_image,

            is_featured:
              form.is_featured,

            sort_order:
              Number(
                form.sort_order
              ) || 0,
          }),
        });

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
          "Unable to save building."
        );

        return;
      }

      setMessage(
        editingId
          ? "Building updated successfully."
          : "Building created successfully."
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await loadBuildings();
    } catch (error) {
      console.error(
        "Save building error:",
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
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}

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
              Buildings
            </h1>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Add Building
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* MESSAGES */}

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

        {/* FORM */}

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
                  {editingId
                    ? "Edit Building"
                    : "Add Building"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage the main
                  information displayed
                  on the website.
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
              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Building Name *
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
                  placeholder="Building A"
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
                  placeholder="building-a"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Leave blank when
                  creating and the
                  backend can generate it
                  from the name.
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* DESCRIPTION */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Full Description
                </label>

                <textarea
                  rows={5}
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
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* ADDRESS */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Address
                </label>

                <input
                  value={
                    form.address
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "address",
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
                />
              </div>

              {/* FLOORS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Total Floors
                </label>

                <input
                  type="number"
                  min="0"
                  value={
                    form.total_floors
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "total_floors",
                      event.target
                        .value
                    )
                  }
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
                  We will later connect
                  this directly to the
                  Gallery uploader.
                </p>
              </div>

              {/* SORT ORDER */}

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

              {/* FEATURED */}

              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      form.is_featured
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "is_featured",
                        event.target
                          .checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Featured Building
                  </span>
                </label>
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
                  : editingId
                    ? "Update Building"
                    : "Create Building"}
              </button>
            </div>
          </form>
        )}

        {/* BUILDINGS */}

        <div>
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your Buildings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {buildings.length} building
              {buildings.length === 1
                ? ""
                : "s"}{" "}
              currently in the database.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              Loading buildings...
            </div>
          ) : buildings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="font-medium text-slate-800">
                No buildings found.
              </p>

              <button
                type="button"
                onClick={
                  openCreateForm
                }
                className="mt-4 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Add Building
              </button>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {buildings.map(
                (building) => (
                  <div
                    key={
                      building.id
                    }
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-semibold text-slate-900">
                            {
                              building.name
                            }
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${building.status ===
                                "active"
                                ? "bg-green-50 text-green-700"
                                : building.status ===
                                  "coming_soon"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {building.status
                              .replace(
                                "_",
                                " "
                              )
                              .toUpperCase()}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          /
                          {
                            building.slug
                          }
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            building
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </button>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">
                      {building.short_description ||
                        "No short description added yet."}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Floors
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {
                            building.total_floors
                          }
                        </p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Sort Order
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {
                            building.sort_order
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}