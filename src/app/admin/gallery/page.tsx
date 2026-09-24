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
  slug: string;
}

interface Tenant {
  id: number;
  floor_id: number;
  building_id: number;
  building_name: string;
  floor_name: string;
  name: string;
  slug: string;
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
  building_slug: string | null;

  floor_name: string | null;
  floor_slug: string | null;

  tenant_name: string | null;
  tenant_slug: string | null;

  created_at: string;
  updated_at: string;
}

interface GalleryForm {
  category:
  | "general"
  | "building"
  | "floor"
  | "tenant";

  building_id: string;
  floor_id: string;
  tenant_id: string;

  title: string;
  description: string;
  alt_text: string;

  is_featured: boolean;
  is_active: boolean;

  sort_order: string;
}

const emptyForm: GalleryForm = {
  category: "general",

  building_id: "",
  floor_id: "",
  tenant_id: "",

  title: "",
  description: "",
  alt_text: "",

  is_featured: false,
  is_active: true,

  sort_order: "0",
};

// ========================================
// PAGE
// ========================================

export default function AdminGalleryPage() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://subhashreebhawan-api.vercel.app/api";

  const BACKEND_URL =
    API_URL.replace(/\/api\/?$/, "");

  const [buildings, setBuildings] =
    useState<Building[]>([]);

  const [floors, setFloors] =
    useState<Floor[]>([]);

  const [tenants, setTenants] =
    useState<Tenant[]>([]);

  const [gallery, setGallery] =
    useState<GalleryItem[]>([]);

  const [form, setForm] =
    useState<GalleryForm>(emptyForm);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingImage, setEditingImage] =
    useState<string>("");

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

  const [categoryFilter, setCategoryFilter] =
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
  // IMAGE URL
  // ========================================

  const getImageUrl = (
    imageUrl: string
  ) => {
    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://")
    ) {
      return imageUrl;
    }

    return `${BACKEND_URL}${imageUrl}`;
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

      // VERIFY ADMIN

      const authResponse = await fetch(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

      // LOAD EVERYTHING

      const [
        buildingsResponse,
        floorsResponse,
        tenantsResponse,
        galleryResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/buildings`),
        fetch(`${API_URL}/floors`),
        fetch(`${API_URL}/tenants`),
        fetch(`${API_URL}/gallery`),
      ]);

      const buildingsData =
        await buildingsResponse.json();

      const floorsData =
        await floorsResponse.json();

      const tenantsData =
        await tenantsResponse.json();

      const galleryData =
        await galleryResponse.json();

      if (
        !buildingsResponse.ok ||
        !buildingsData.success
      ) {
        throw new Error(
          "Unable to load buildings"
        );
      }

      if (
        !floorsResponse.ok ||
        !floorsData.success
      ) {
        throw new Error(
          "Unable to load floors"
        );
      }

      if (
        !tenantsResponse.ok ||
        !tenantsData.success
      ) {
        throw new Error(
          "Unable to load tenants"
        );
      }

      if (
        !galleryResponse.ok ||
        !galleryData.success
      ) {
        throw new Error(
          "Unable to load gallery"
        );
      }

      setBuildings(
        buildingsData.buildings || []
      );

      setFloors(
        floorsData.floors || []
      );

      setTenants(
        tenantsData.tenants || []
      );

      setGallery(
        galleryData.gallery || []
      );
    } catch (error) {
      console.error(
        "Load gallery error:",
        error
      );

      setError(
        "Unable to load gallery information."
      );
    } finally {
      setLoading(false);
    }
  }, [API_URL, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ========================================
  // FILTERS
  // ========================================

  const filteredGallery =
    useMemo(() => {
      if (
        categoryFilter === "all"
      ) {
        return gallery;
      }

      return gallery.filter(
        (item) =>
          item.category ===
          categoryFilter
      );
    }, [
      gallery,
      categoryFilter,
    ]);

  // ========================================
  // FORM FIELD
  // ========================================

  const updateField = (
    field: keyof GalleryForm,
    value: string | boolean
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // ========================================
  // CATEGORY CHANGE
  // ========================================

  const changeCategory = (
    value: GalleryForm["category"]
  ) => {
    setForm((current) => ({
      ...current,

      category: value,

      building_id: "",
      floor_id: "",
      tenant_id: "",
    }));
  };

  // ========================================
  // CREATE FORM
  // ========================================

  const openCreateForm = () => {
    setEditingId(null);

    setEditingImage("");

    setSelectedFile(null);

    setForm(emptyForm);

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
    item: GalleryItem
  ) => {
    setEditingId(item.id);

    setEditingImage(
      item.image_url
    );

    setSelectedFile(null);

    setForm({
      category:
        item.category,

      building_id:
        item.building_id
          ? String(
            item.building_id
          )
          : "",

      floor_id:
        item.floor_id
          ? String(
            item.floor_id
          )
          : "",

      tenant_id:
        item.tenant_id
          ? String(
            item.tenant_id
          )
          : "",

      title:
        item.title || "",

      description:
        item.description || "",

      alt_text:
        item.alt_text || "",

      is_featured:
        Boolean(
          item.is_featured
        ),

      is_active:
        Boolean(
          item.is_active
        ),

      sort_order:
        String(
          item.sort_order ?? 0
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

    setEditingImage("");

    setSelectedFile(null);

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

    if (
      editingId === null &&
      !selectedFile
    ) {
      setError(
        "Please select an image."
      );

      return;
    }

    if (
      form.category ===
      "building" &&
      !form.building_id
    ) {
      setError(
        "Please select a building."
      );

      return;
    }

    if (
      form.category ===
      "floor" &&
      !form.floor_id
    ) {
      setError(
        "Please select a floor."
      );

      return;
    }

    if (
      form.category ===
      "tenant" &&
      !form.tenant_id
    ) {
      setError(
        "Please select a tenant."
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

      const formData =
        new FormData();

      if (selectedFile) {
        formData.append(
          "image",
          selectedFile
        );
      }

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "title",
        form.title
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "alt_text",
        form.alt_text
      );

      formData.append(
        "is_featured",
        String(
          form.is_featured
        )
      );

      formData.append(
        "is_active",
        String(
          form.is_active
        )
      );

      formData.append(
        "sort_order",
        form.sort_order || "0"
      );

      // CATEGORY RELATIONSHIP

      if (
        form.category ===
        "building"
      ) {
        formData.append(
          "building_id",
          form.building_id
        );
      }

      if (
        form.category ===
        "floor"
      ) {
        formData.append(
          "floor_id",
          form.floor_id
        );
      }

      if (
        form.category ===
        "tenant"
      ) {
        formData.append(
          "tenant_id",
          form.tenant_id
        );
      }

      const url =
        editingId !== null
          ? `${API_URL}/gallery/${editingId}`
          : `${API_URL}/gallery`;

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
              Authorization:
                `Bearer ${token}`,
            },

            body:
              formData,
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
          "Unable to save gallery image."
        );

        return;
      }

      setMessage(
        editingId !== null
          ? "Gallery item updated successfully."
          : "Image uploaded successfully."
      );

      setEditingId(null);

      setEditingImage("");

      setSelectedFile(null);

      setForm(emptyForm);

      setShowForm(false);

      await loadData();
    } catch (error) {
      console.error(
        "Save gallery error:",
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
  // DELETE
  // ========================================

  const handleDelete = async (
    item: GalleryItem
  ) => {
    const confirmed =
      window.confirm(
        `Delete "${item.title || "this image"}"?`
      );

    if (!confirmed) {
      return;
    }

    try {
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
          `${API_URL}/gallery/${item.id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
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
          "Unable to delete image."
        );

        return;
      }

      setMessage(
        "Gallery image deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Delete gallery error:",
        error
      );

      setError(
        "Unable to delete gallery image."
      );
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
              Gallery
            </h1>
          </div>

          <button
            type="button"
            onClick={
              openCreateForm
            }
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            + Upload Image
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
                  {editingId !== null
                    ? "Edit Gallery Item"
                    : "Upload Image"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Upload images and
                  connect them to a
                  building, floor or
                  tenant.
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
              {/* IMAGE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Image{" "}
                  {editingId === null
                    ? "*"
                    : ""}
                </label>

                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(
                    event
                  ) => {
                    const file =
                      event.target
                        .files?.[0] ||
                      null;

                    setSelectedFile(
                      file
                    );
                  }}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700"
                />

                {selectedFile && (
                  <p className="mt-2 text-sm text-slate-500">
                    Selected:{" "}
                    {
                      selectedFile.name
                    }
                  </p>
                )}

                {editingId !== null &&
                  editingImage &&
                  !selectedFile && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                        Current Image
                      </p>

                      <img
                        src={getImageUrl(
                          editingImage
                        )}
                        alt=""
                        className="h-32 w-48 rounded-xl border border-slate-200 object-cover"
                      />
                    </div>
                  )}
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category
                </label>

                <select
                  value={
                    form.category
                  }
                  onChange={(
                    event
                  ) =>
                    changeCategory(
                      event.target
                        .value as GalleryForm["category"]
                    )
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                >
                  <option value="general">
                    General
                  </option>

                  <option value="building">
                    Building
                  </option>

                  <option value="floor">
                    Floor
                  </option>

                  <option value="tenant">
                    Tenant
                  </option>
                </select>
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
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              {/* BUILDING */}

              {form.category ===
                "building" && (
                  <div className="md:col-span-2">
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                    >
                      <option value="">
                        Select Building
                      </option>

                      {buildings.map(
                        (
                          building
                        ) => (
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
                )}

              {/* FLOOR */}

              {form.category ===
                "floor" && (
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
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                    >
                      <option value="">
                        Select Floor
                      </option>

                      {floors.map(
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
                )}

              {/* TENANT */}

              {form.category ===
                "tenant" && (
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Tenant *
                    </label>

                    <select
                      value={
                        form.tenant_id
                      }
                      onChange={(
                        event
                      ) =>
                        updateField(
                          "tenant_id",
                          event.target
                            .value
                        )
                      }
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm"
                    >
                      <option value="">
                        Select Tenant
                      </option>

                      {tenants.map(
                        (tenant) => (
                          <option
                            key={
                              tenant.id
                            }
                            value={
                              tenant.id
                            }
                          >
                            {
                              tenant.name
                            }{" "}
                            —{" "}
                            {
                              tenant.building_name
                            }{" "}
                            /{" "}
                            {
                              tenant.floor_name
                            }
                          </option>
                        )
                      )}
                    </select>
                  </div>
                )}

              {/* TITLE */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Title
                </label>

                <input
                  value={
                    form.title
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "title",
                      event.target
                        .value
                    )
                  }
                  placeholder="Building A Exterior"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              {/* ALT TEXT */}

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Alt Text
                </label>

                <input
                  value={
                    form.alt_text
                  }
                  onChange={(
                    event
                  ) =>
                    updateField(
                      "alt_text",
                      event.target
                        .value
                    )
                  }
                  placeholder="Exterior view of Subhashree Bhawan Building A"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <p className="mt-1 text-xs text-slate-400">
                  Alt text helps
                  accessibility and SEO.
                </p>
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
                  className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />
              </div>

              {/* FEATURED */}

              <div>
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
                    Featured Image
                  </span>
                </label>
              </div>

              {/* ACTIVE */}

              <div>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      form.is_active
                    }
                    onChange={(
                      event
                    ) =>
                      updateField(
                        "is_active",
                        event.target
                          .checked
                      )
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-slate-700">
                    Active
                  </span>
                </label>
              </div>
            </div>

            {/* BUTTONS */}

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
                    ? "Update Image"
                    : "Upload Image"}
              </button>
            </div>
          </form>
        )}

        {/* TOP */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Website Images
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {gallery.length} images
              currently in the gallery.
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
              Category
            </label>

            <select
              value={
                categoryFilter
              }
              onChange={(
                event
              ) =>
                setCategoryFilter(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
            >
              <option value="all">
                All Images
              </option>

              <option value="general">
                General
              </option>

              <option value="building">
                Building
              </option>

              <option value="floor">
                Floor
              </option>

              <option value="tenant">
                Tenant
              </option>
            </select>
          </div>
        </div>

        {/* GALLERY */}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            Loading gallery...
          </div>
        ) : filteredGallery.length ===
          0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-medium text-slate-800">
              No gallery images yet.
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Upload your first image
              from the admin panel.
            </p>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map(
              (item) => (
                <div
                  key={
                    item.id
                  }
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                  {/* IMAGE */}

                  <div className="aspect-[4/3] bg-slate-100">
                    <img
                      src={getImageUrl(
                        item.image_url
                      )}
                      alt={
                        item.alt_text ||
                        item.title ||
                        "Gallery image"
                      }
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {item.title ||
                            "Untitled Image"}
                        </h3>

                        <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">
                          {
                            item.category
                          }
                        </p>
                      </div>

                      {Boolean(
                        item.is_featured
                      ) && (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Featured
                          </span>
                        )}
                    </div>

                    {/* RELATION */}

                    <div className="mt-4 text-sm text-slate-500">
                      {item.tenant_name && (
                        <p>
                          Tenant:{" "}
                          <span className="font-medium text-slate-700">
                            {
                              item.tenant_name
                            }
                          </span>
                        </p>
                      )}

                      {!item.tenant_name &&
                        item.floor_name && (
                          <p>
                            Floor:{" "}
                            <span className="font-medium text-slate-700">
                              {
                                item.building_name
                              }{" "}
                              —{" "}
                              {
                                item.floor_name
                              }
                            </span>
                          </p>
                        )}

                      {!item.tenant_name &&
                        !item.floor_name &&
                        item.building_name && (
                          <p>
                            Building:{" "}
                            <span className="font-medium text-slate-700">
                              {
                                item.building_name
                              }
                            </span>
                          </p>
                        )}

                      {!item.building_name &&
                        !item.floor_name &&
                        !item.tenant_name && (
                          <p>
                            General gallery
                          </p>
                        )}
                    </div>

                    {/* STATUS */}

                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                          }`}
                      >
                        {item.is_active
                          ? "ACTIVE"
                          : "INACTIVE"}
                      </span>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openEditForm(
                              item
                            )
                          }
                          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              item
                            )
                          }
                          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
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