"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  User,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://subhashreebhawan-api.vercel.app/api";

interface Building {
  id: number;
  name: string;
  slug: string;
}

interface Floor {
  id: number;
  building_id: number;
  name: string;
  floor_number: number;
  slug: string;
  status:
  | "available"
  | "occupied"
  | "coming_soon"
  | "inactive";
}

interface InquiryFormProps {
  defaultBuildingSlug?: string;
  defaultFloorId?: number;
  source?: string;
  title?: string;
  subtitle?: string;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  message: string;
  building_id: string;
  floor_id: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  message: "",
  building_id: "",
  floor_id: "",
};

export default function InquiryForm({
  defaultBuildingSlug,
  defaultFloorId,
  source = "website",
  title = "Request a Viewing",
  subtitle = "Tell us what you are looking for and our team will get back to you.",
}: InquiryFormProps) {
  const [buildings, setBuildings] =
    useState<Building[]>([]);

  const [floors, setFloors] =
    useState<Floor[]>([]);

  const [form, setForm] =
    useState<FormState>(
      initialForm
    );

  const [
    loadingBuildings,
    setLoadingBuildings,
  ] = useState(true);

  const [
    loadingFloors,
    setLoadingFloors,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ========================================
  // LOAD BUILDINGS
  // ========================================

  useEffect(() => {
    const loadBuildings =
      async () => {
        try {
          setLoadingBuildings(
            true
          );

          const response =
            await fetch(
              `${API_URL}/buildings`,
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
              "Unable to load buildings"
            );
          }

          const buildingList:
            Building[] =
            data.buildings ||
            [];

          setBuildings(
            buildingList
          );

          if (
            defaultBuildingSlug
          ) {
            const defaultBuilding =
              buildingList.find(
                (building) =>
                  building.slug ===
                  defaultBuildingSlug
              );

            if (
              defaultBuilding
            ) {
              setForm(
                (previous) => ({
                  ...previous,

                  building_id:
                    String(
                      defaultBuilding.id
                    ),
                })
              );
            }
          }
        } catch (error) {
          console.error(
            "Load buildings error:",
            error
          );
        } finally {
          setLoadingBuildings(
            false
          );
        }
      };

    loadBuildings();
  }, [
    defaultBuildingSlug,
  ]);

  // ========================================
  // LOAD FLOORS
  // ========================================

  useEffect(() => {
    const buildingId =
      Number(
        form.building_id
      );

    if (!buildingId) {
      setFloors([]);

      setForm(
        (previous) => ({
          ...previous,
          floor_id: "",
        })
      );

      return;
    }

    const loadFloors =
      async () => {
        try {
          setLoadingFloors(
            true
          );

          const response =
            await fetch(
              `${API_URL}/floors/building/${buildingId}`,
              {
                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
              "Unable to load floors"
            );
          }

          const floorList:
            Floor[] =
            (
              data.floors ||
              []
            ).sort(
              (
                a: Floor,
                b: Floor
              ) =>
                a.floor_number -
                b.floor_number
            );

          setFloors(
            floorList
          );

          if (
            defaultFloorId &&
            floorList.some(
              (floor) =>
                Number(
                  floor.id
                ) ===
                Number(
                  defaultFloorId
                )
            )
          ) {
            setForm(
              (previous) => ({
                ...previous,

                floor_id:
                  String(
                    defaultFloorId
                  ),
              })
            );
          }
        } catch (error) {
          console.error(
            "Load floors error:",
            error
          );

          setFloors([]);
        } finally {
          setLoadingFloors(
            false
          );
        }
      };

    loadFloors();
  }, [
    form.building_id,
    defaultFloorId,
  ]);

  // ========================================
  // SELECTED FLOOR
  // ========================================

  const selectedFloor =
    useMemo(() => {
      return floors.find(
        (floor) =>
          String(
            floor.id
          ) ===
          form.floor_id
      );
    }, [
      floors,
      form.floor_id,
    ]);

  // ========================================
  // CHANGE FIELD
  // ========================================

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value,

        ...(name ===
          "building_id"
          ? {
            floor_id: "",
          }
          : {}),
      })
    );

    setError("");
    setSuccess("");
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit =
    async (
      event: React.FormEvent
    ) => {
      event.preventDefault();

      setError("");
      setSuccess("");

      if (
        !form.name.trim()
      ) {
        setError(
          "Please enter your name."
        );

        return;
      }

      if (
        !form.phone.trim() &&
        !form.email.trim()
      ) {
        setError(
          "Please provide either a phone number or email address."
        );

        return;
      }

      if (
        !form.message.trim()
      ) {
        setError(
          "Please enter your message."
        );

        return;
      }

      try {
        setSubmitting(true);

        const response =
          await fetch(
            `${API_URL}/inquiries`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  name:
                    form.name.trim(),

                  email:
                    form.email.trim() ||
                    null,

                  phone:
                    form.phone.trim() ||
                    null,

                  company:
                    form.company.trim() ||
                    null,

                  subject:
                    form.subject.trim() ||
                    "Request a Viewing",

                  message:
                    form.message.trim(),

                  building_id:
                    form.building_id
                      ? Number(
                        form.building_id
                      )
                      : null,

                  floor_id:
                    form.floor_id
                      ? Number(
                        form.floor_id
                      )
                      : null,

                  source,
                }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Unable to submit inquiry"
          );
        }

        setSuccess(
          "Thank you. Your inquiry has been submitted successfully."
        );

        setForm(
          (previous) => ({
            ...initialForm,

            building_id:
              previous.building_id,

            floor_id: "",
          })
        );
      } catch (error) {
        console.error(
          "Submit inquiry error:",
          error
        );

        setError(
          error instanceof
            Error
            ? error.message
            : "Unable to submit inquiry. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <div className="overflow-hidden rounded-[32px] bg-white/75 ring-1 ring-black/10 shadow-[0_30px_90px_rgba(15,23,42,0.10)] backdrop-blur-xl">
      {/* HEADER */}

      <div className="border-b border-black/5 p-6 md:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-white">
          <MessageSquare className="h-4 w-4" />

          GET IN TOUCH
        </div>

        <h2 className="mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">
          {title}
        </h2>

        <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
          {subtitle}
        </p>
      </div>

      {/* SUCCESS */}

      {success && (
        <div className="mx-6 mt-6 flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 md:mx-8">
          <CheckCircle2 className="h-5 w-5 shrink-0" />

          <span>
            {success}
          </span>
        </div>
      )}

      {/* ERROR */}

      {error && (
        <div className="mx-6 mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:mx-8">
          {error}
        </div>
      )}

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="p-6 md:p-8"
      >
        <div className="grid gap-5 md:grid-cols-2">
          {/* NAME */}

          <Field
            label="Name"
            required
            icon={
              <User className="h-4 w-4" />
            }
          >
            <input
              type="text"
              name="name"
              value={
                form.name
              }
              onChange={
                handleChange
              }
              placeholder="Your full name"
              className="form-input"
            />
          </Field>

          {/* COMPANY */}

          <Field
            label="Company"
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <input
              type="text"
              name="company"
              value={
                form.company
              }
              onChange={
                handleChange
              }
              placeholder="Company name"
              className="form-input"
            />
          </Field>

          {/* PHONE */}

          <Field
            label="Phone"
            icon={
              <Phone className="h-4 w-4" />
            }
          >
            <input
              type="tel"
              name="phone"
              value={
                form.phone
              }
              onChange={
                handleChange
              }
              placeholder="+977 98XXXXXXXX"
              className="form-input"
            />
          </Field>

          {/* EMAIL */}

          <Field
            label="Email"
            icon={
              <Mail className="h-4 w-4" />
            }
          >
            <input
              type="email"
              name="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              placeholder="you@example.com"
              className="form-input"
            />
          </Field>

          {/* BUILDING */}

          <Field
            label="Interested Building"
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <select
              name="building_id"
              value={
                form.building_id
              }
              onChange={
                handleChange
              }
              disabled={
                loadingBuildings
              }
              className="form-input"
            >
              <option value="">
                {loadingBuildings
                  ? "Loading buildings..."
                  : "Select a building"}
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
          </Field>

          {/* FLOOR */}

          <Field
            label="Interested Floor"
            icon={
              <Building2 className="h-4 w-4" />
            }
          >
            <select
              name="floor_id"
              value={
                form.floor_id
              }
              onChange={
                handleChange
              }
              disabled={
                !form.building_id ||
                loadingFloors
              }
              className="form-input"
            >
              <option value="">
                {!form.building_id
                  ? "Select building first"
                  : loadingFloors
                    ? "Loading floors..."
                    : "Select a floor"}
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
                    {floor.name}
                    {" — "}
                    {formatStatus(
                      floor.status
                    )}
                  </option>
                )
              )}
            </select>
          </Field>
        </div>

        {/* FLOOR STATUS */}

        {selectedFloor && (
          <div className="mt-5 rounded-2xl bg-[#FFF7DE] px-5 py-4 ring-1 ring-black/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.16em] text-slate-400">
                  SELECTED FLOOR
                </p>

                <p className="mt-1 font-bold">
                  {
                    selectedFloor.name
                  }
                </p>
              </div>

              <span className="rounded-full bg-slate-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                {formatStatus(
                  selectedFloor.status
                )}
              </span>
            </div>
          </div>
        )}

        {/* SUBJECT */}

        <div className="mt-5">
          <Field
            label="Subject"
            icon={
              <MessageSquare className="h-4 w-4" />
            }
          >
            <input
              type="text"
              name="subject"
              value={
                form.subject
              }
              onChange={
                handleChange
              }
              placeholder="Example: Building A rental inquiry"
              className="form-input"
            />
          </Field>
        </div>

        {/* MESSAGE */}

        <div className="mt-5">
          <Field
            label="Message"
            required
            icon={
              <MessageSquare className="h-4 w-4" />
            }
          >
            <textarea
              name="message"
              value={
                form.message
              }
              onChange={
                handleChange
              }
              rows={6}
              placeholder="Tell us what type of space you are looking for..."
              className="form-input resize-none"
            />
          </Field>
        </div>

        {/* CONTACT NOTE */}

        <p className="mt-4 text-xs leading-5 text-slate-500">
          Please provide at least a phone number or email address so our team can contact you.
        </p>

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={
            submitting
          }
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-4 font-bold text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)] transition hover:-translate-y-[1px] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Submitting..."
            : "Submit Inquiry"}

          {!submitting && (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}

// ========================================
// FIELD
// ========================================

function Field({
  label,
  icon,
  required = false,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <span>
          {label}
        </span>

        {required && (
          <span className="text-red-500">
            *
          </span>
        )}
      </div>

      {children}
    </label>
  );
}

// ========================================
// STATUS
// ========================================

function formatStatus(
  status: Floor["status"]
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