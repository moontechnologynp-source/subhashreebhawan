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

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

// ========================================
// HELPERS
// ========================================

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

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
  ] = useState<Tenant | null>(null);

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

  const [
    logoUploading,
    setLogoUploading,
  ] = useState(false);

  const [
    logoUploadMessage,
    setLogoUploadMessage,
  ] = useState("");

  // ========================================
  // TOKEN
  // ========================================

  const getToken = () =>
    localStorage.getItem(
      "subhashree_admin_token",
    );

  const clearAuthAndRedirect = () => {
    localStorage.removeItem(
      "subhashree_admin_token",
    );
    localStorage.removeItem(
      "subhashree_admin",
    );
    router.replace("/admin/login");
  };

  // ========================================
  // LOAD DATA
  // ========================================

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          router.replace("/admin/login");
          return;
        }

        const authResponse =
          await fetch(
            `${API_URL}/auth/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

        if (!authResponse.ok) {
          clearAuthAndRedirect();
          return;
        }

        const [
          buildingsResponse,
          floorsResponse,
          tenantsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/buildings`),
          fetch(`${API_URL}/floors`),
          fetch(`${API_URL}/tenants`),
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
              "Unable to load buildings",
          );
        }

        if (
          !floorsResponse.ok ||
          !floorsData.success
        ) {
          throw new Error(
            floorsData.message ||
              "Unable to load floors",
          );
        }

        if (
          !tenantsResponse.ok ||
          !tenantsData.success
        ) {
          throw new Error(
            tenantsData.message ||
              "Unable to load tenants",
          );
        }

        setBuildings(
          buildingsData.buildings || [],
        );
        setFloors(floorsData.floors || []);
        setTenants(
          tenantsData.tenants || [],
        );
      } catch (loadError) {
        console.error(
          "Load tenants error:",
          loadError,
        );

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load tenant information.",
        );
      } finally {
        setLoading(false);
      }
    },
    [API_URL, router],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  // ========================================
  // FILTERED FLOORS
  // ========================================

  const floorsForForm = useMemo(
    () => floors,
    [floors],
  );

  const floorsForFilter = useMemo(() => {
    if (buildingFilter === "all") {
      return floors;
    }

    return floors.filter(
      (floor) =>
        Number(floor.building_id) ===
        Number(buildingFilter),
    );
  }, [floors, buildingFilter]);

  const filteredTenants = useMemo(() => {
    return tenants.filter((tenant) => {
      const buildingMatches =
        buildingFilter === "all" ||
        Number(tenant.building_id) ===
          Number(buildingFilter);

      const floorMatches =
        floorFilter === "all" ||
        Number(tenant.floor_id) ===
          Number(floorFilter);

      return (
        buildingMatches &&
        floorMatches
      );
    });
  }, [
    tenants,
    buildingFilter,
    floorFilter,
  ]);

  // ========================================
  // FIELD UPDATES
  // ========================================

  const updateField = (
    field: keyof TenantForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleNameChange = (
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug:
        editingId === null
          ? slugify(value)
          : current.slug,
    }));
  };

  // ========================================
  // LOGO UPLOAD
  // ========================================

  const handleLogoUpload = async (
    file: File,
  ) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Please select a valid image file.",
      );
      return;
    }

    try {
      setLogoUploading(true);
      setLogoUploadMessage("");
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const prepareResponse = await fetch(
        `${API_URL}/uploads/image-url`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            purpose: "tenant",
            contentType:
              file.type ||
              "application/octet-stream",
            fileSize: file.size,
            fileName: file.name,
          }),
        },
      );

      const prepareData =
        await prepareResponse.json();

      if (prepareResponse.status === 401) {
        clearAuthAndRedirect();
        return;
      }

      if (
        !prepareResponse.ok ||
        !prepareData.success ||
        !prepareData.uploadUrl
      ) {
        throw new Error(
          prepareData.message ||
            "Unable to prepare logo upload.",
        );
      }

      const uploadResponse = await fetch(
        prepareData.uploadUrl,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              file.type ||
              "application/octet-stream",
          },
          body: file,
        },
      );

      let uploadData: any = {};

      try {
        uploadData =
          await uploadResponse.json();
      } catch {
        uploadData = {};
      }

      if (!uploadResponse.ok) {
        throw new Error(
          uploadData.message ||
            "Logo upload failed.",
        );
      }

      const finalUrl =
        uploadData.url ||
        uploadData.downloadUrl ||
        prepareData.url ||
        prepareData.publicUrl ||
        "";

      if (!finalUrl) {
        throw new Error(
          "Upload completed, but image URL was not returned.",
        );
      }

      setForm((current) => ({
        ...current,
        logo: finalUrl,
      }));

      setLogoUploadMessage(
        "Logo uploaded successfully.",
      );
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload logo.",
      );
    } finally {
      setLogoUploading(false);
    }
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
          ? String(floors[0].id)
          : "",
    });

    setError("");
    setMessage("");
    setLogoUploadMessage("");
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
    tenant: Tenant,
  ) => {
    setEditingId(tenant.id);

    setForm({
      floor_id: String(tenant.floor_id),
      name: tenant.name,
      slug: tenant.slug,
      short_description:
        tenant.short_description || "",
      description:
        tenant.description || "",
      logo: tenant.logo || "",
      website_url:
        tenant.website_url || "",
      phone: tenant.phone || "",
      email: tenant.email || "",
      status: tenant.status,
      sort_order: String(
        tenant.sort_order ?? 0,
      ),
    });

    setError("");
    setMessage("");
    setLogoUploadMessage("");
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
    setLogoUploadMessage("");
  };

  // ========================================
  // SAVE TENANT
  // ========================================

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.floor_id) {
      setError(
        "Please select a floor.",
      );
      return;
    }

    if (!form.name.trim()) {
      setError(
        "Tenant name is required.",
      );
      return;
    }

    const finalSlug =
      form.slug.trim() ||
      slugify(form.name);

    if (!finalSlug) {
      setError(
        "Tenant slug is required.",
      );
      return;
    }

    try {
      setSaving(true);

      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
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

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type":
            "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          floor_id: Number(form.floor_id),
          name: form.name.trim(),
          slug: finalSlug,
          short_description:
            form.short_description.trim(),
          description:
            form.description.trim(),
          logo: form.logo.trim(),
          website_url:
            form.website_url.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          status: form.status,
          sort_order:
            Number(form.sort_order) || 0,
        }),
      });

      const data =
        await response.json();

      if (response.status === 401) {
        clearAuthAndRedirect();
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to save tenant.",
        );
        return;
      }

      setMessage(
        editingId !== null
          ? "Tenant updated successfully."
          : "Tenant created successfully.",
      );

      setEditingId(null);
      setForm(emptyForm);
      setShowForm(false);
      setLogoUploadMessage("");

      await loadData();
    } catch (saveError) {
      console.error(
        "Save tenant error:",
        saveError,
      );

      setError(
        "Unable to connect to the backend.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // MOVE OUT
  // ========================================

  const openMoveOutModal = (
    tenant: Tenant,
  ) => {
    setError("");
    setMessage("");
    setMoveOutTarget(tenant);
  };

  const closeMoveOutModal = () => {
    if (movingOut) {
      return;
    }

    setMoveOutTarget(null);
  };

  const handleMoveOut = async () => {
    if (!moveOutTarget) {
      return;
    }

    const tenantName =
      moveOutTarget.name;

    try {
      setMovingOut(true);
      setError("");
      setMessage("");

      const token = getToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/tenants/${moveOutTarget.id}/move-out`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data =
        await response.json();

      if (response.status === 401) {
        clearAuthAndRedirect();
        return;
      }

      if (
        !response.ok ||
        !data.success
      ) {
        setError(
          data.message ||
            "Unable to move tenant out.",
        );
        return;
      }

      setMoveOutTarget(null);

      setMessage(
        data.message ||
          `${tenantName} moved out successfully.`,
      );

      await loadData();
    } catch (moveOutError) {
      console.error(
        "Move out tenant error:",
        moveOutError,
      );

      setError(
        "Unable to connect to the backend.",
      );
    } finally {
      setMovingOut(false);
    }
  };

  // ========================================
  // STATUS STYLES
  // ========================================

  const getStatusClasses = (
    status: Tenant["status"],
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
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-12 text-center text-slate-600">
        Loading tenants...
      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              type="button"
              onClick={() =>
                router.push("/admin")
              }
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Dashboard
            </button>

            <h1 className="mt-3 text-3xl font-bold">
              Manage tenants
            </h1>

            <p className="mt-2 text-slate-500">
              Add tenants, update their
              information, upload logos
              and move them out when
              they leave.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            + New tenant
          </button>
        </header>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            {message}
          </div>
        )}

        {logoUploadMessage && (
          <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800">
            {logoUploadMessage}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingId !== null
                    ? "Edit tenant"
                    : "Create tenant"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Fill the tenant
                  details below and save
                  them to the website.
                </p>
              </div>

              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>

            <fieldset
              disabled={
                saving || logoUploading
              }
              className="space-y-5 disabled:opacity-60"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block font-medium">
                  Floor
                  <select
                    required
                    className={inputClass}
                    value={form.floor_id}
                    onChange={(event) =>
                      updateField(
                        "floor_id",
                        event.target.value,
                      )
                    }
                  >
                    <option value="">
                      Select a floor
                    </option>
                    {floorsForForm.map(
                      (floor) => (
                        <option
                          key={floor.id}
                          value={floor.id}
                        >
                          {
                            floor.building_name
                          }{" "}
                          · {floor.name}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label className="block font-medium">
                  Status
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(event) =>
                      updateField(
                        "status",
                        event.target.value as TenantForm["status"],
                      )
                    }
                  >
                    <option value="active">
                      Active
                    </option>
                    <option value="coming_soon">
                      Coming Soon
                    </option>
                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block font-medium">
                  Tenant name
                  <input
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(event) =>
                      handleNameChange(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="block font-medium">
                  URL slug
                  <input
                    required
                    className={inputClass}
                    value={form.slug}
                    onChange={(event) =>
                      updateField(
                        "slug",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <label className="block font-medium">
                Short description
                <textarea
                  rows={3}
                  className={inputClass}
                  value={form.short_description}
                  onChange={(event) =>
                    updateField(
                      "short_description",
                      event.target.value,
                    )
                  }
                />
              </label>

              <label className="block font-medium">
                Full description
                <textarea
                  rows={5}
                  className={inputClass}
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value,
                    )
                  }
                />
              </label>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Tenant logo
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload a logo from
                      your laptop or
                      paste a URL
                      manually.
                    </p>
                  </div>

                  <label className="inline-flex cursor-pointer items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                    {logoUploading
                      ? "Uploading..."
                      : "Upload logo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={
                        logoUploading
                      }
                      onChange={async (
                        event,
                      ) => {
                        const file =
                          event.target
                            .files?.[0];
                        if (file) {
                          await handleLogoUpload(
                            file,
                          );
                        }
                        event.target.value =
                          "";
                      }}
                    />
                  </label>
                </div>

                <label className="mt-4 block font-medium">
                  Logo URL
                  <input
                    className={inputClass}
                    value={form.logo}
                    onChange={(event) =>
                      updateField(
                        "logo",
                        event.target.value,
                      )
                    }
                    placeholder="Uploaded logo URL will appear here"
                  />
                </label>

                {form.logo && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <img
                      src={form.logo}
                      alt="Tenant logo preview"
                      className="h-24 w-24 rounded-xl object-contain"
                    />

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateField(
                            "logo",
                            "",
                          )
                        }
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                      >
                        Remove logo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block font-medium">
                  Website URL
                  <input
                    className={inputClass}
                    value={form.website_url}
                    onChange={(event) =>
                      updateField(
                        "website_url",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="block font-medium">
                  Sort order
                  <input
                    type="number"
                    className={inputClass}
                    value={form.sort_order}
                    onChange={(event) =>
                      updateField(
                        "sort_order",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="block font-medium">
                  Phone
                  <input
                    className={inputClass}
                    value={form.phone}
                    onChange={(event) =>
                      updateField(
                        "phone",
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="block font-medium">
                  Email
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
                <button
                  type="submit"
                  disabled={
                    saving || logoUploading
                  }
                  className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Update tenant"
                      : "Create tenant"}
                </button>

                <button
                  type="button"
                  onClick={cancelForm}
                  className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </fieldset>
          </form>
        )}

        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block font-medium">
              Filter by building
              <select
                className={inputClass}
                value={buildingFilter}
                onChange={(event) => {
                  setBuildingFilter(
                    event.target.value,
                  );
                  setFloorFilter("all");
                }}
              >
                <option value="all">
                  All buildings
                </option>
                {buildings.map((building) => (
                  <option
                    key={building.id}
                    value={building.id}
                  >
                    {building.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block font-medium">
              Filter by floor
              <select
                className={inputClass}
                value={floorFilter}
                onChange={(event) =>
                  setFloorFilter(
                    event.target.value,
                  )
                }
              >
                <option value="all">
                  All floors
                </option>
                {floorsForFilter.map(
                  (floor) => (
                    <option
                      key={floor.id}
                      value={floor.id}
                    >
                      {
                        floor.building_name
                      }{" "}
                      · {floor.name}
                    </option>
                  ),
                )}
              </select>
            </label>
          </div>
        </section>

        <div className="space-y-5">
          {filteredTenants.length ===
          0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                No tenants found
              </h3>
              <p className="mt-2 text-slate-500">
                Try changing the
                filters or create a new
                tenant.
              </p>
            </div>
          ) : (
            filteredTenants.map(
              (tenant) => (
                <div
                  key={tenant.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                      {tenant.logo ? (
                        <img
                          src={tenant.logo}
                          alt={`${tenant.name} logo`}
                          className="h-20 w-20 shrink-0 rounded-xl border border-slate-200 object-contain p-2"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          No Logo
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-xl font-semibold text-slate-900">
                            {tenant.name}
                          </h2>

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold uppercase ${getStatusClasses(
                              tenant.status,
                            )}`}
                          >
                            {tenant.status.replace(
                              "_",
                              " ",
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          /tenants/
                          {tenant.slug}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {tenant.building_name} ·{" "}
                          {tenant.floor_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(
                            tenant,
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
                            tenant,
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

                  {tenant.description && (
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {tenant.description}
                    </p>
                  )}

                  <div className="mt-5 space-y-2 border-t border-slate-100 pt-5 text-sm">
                    {tenant.phone && (
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">
                          Phone:
                        </span>{" "}
                        {tenant.phone}
                      </p>
                    )}

                    {tenant.email && (
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">
                          Email:
                        </span>{" "}
                        {tenant.email}
                      </p>
                    )}

                    {tenant.website_url && (
                      <p className="truncate text-slate-600">
                        <span className="font-medium text-slate-800">
                          Website:
                        </span>{" "}
                        {tenant.website_url}
                      </p>
                    )}
                  </div>
                </div>
              ),
            )
          )}
        </div>
      </div>

      {moveOutTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
          onMouseDown={(event) => {
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
                  {moveOutTarget.name}?
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeMoveOutModal
                }
                disabled={movingOut}
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
                {moveOutTarget.name} from
                the tenant list and the
                public website.
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                If this is the last
                tenant on{" "}
                {
                  moveOutTarget.floor_name
                }
                , that floor will
                automatically become
                available for rent. If
                another tenant remains
                on the floor, it will
                stay occupied.
              </p>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={
                  closeMoveOutModal
                }
                disabled={movingOut}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleMoveOut
                }
                disabled={movingOut}
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