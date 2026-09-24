"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Blog,
  BLOG_API_URL,
} from "@/lib/blogs";

import BlogContent from "@/components/BlogContent";

// ========================================
// TYPES
// ========================================

type Form = Pick<
  Blog,
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "image"
  | "content"
  | "status"
>;

// ========================================
// EMPTY FORM
// ========================================

const empty: Form = {
  title: "",
  slug: "",
  excerpt: "",
  category: "Property insights",
  image: "",
  content: "",
  status: "draft",
};

// ========================================
// STYLES
// ========================================

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

// ========================================
// PAGE
// ========================================

export default function AdminBlogsPage() {
  const router = useRouter();

  const [blogs, setBlogs] =
    useState<Blog[]>([]);

  const [form, setForm] =
    useState<Form>({
      ...empty,
    });

  const [
    editing,
    setEditing,
  ] =
    useState<string | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    ready,
    setReady,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    savingAction,
    setSavingAction,
  ] =
    useState<
      "draft" |
      "published" |
      null
    >(null);

  const [
    deletingId,
    setDeletingId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    preview,
    setPreview,
  ] =
    useState(false);

  // ========================================
  // REQUEST HELPER
  // ========================================

  const request =
    useCallback(
      async (
        path: string,
        options: RequestInit = {},
      ) => {
        const token =
          localStorage.getItem(
            "subhashree_admin_token",
          );

        if (!token) {
          router.replace(
            "/admin/login",
          );

          throw new Error(
            "Please sign in to continue.",
          );
        }

        const response =
          await fetch(
            `${BLOG_API_URL}${path}`,
            {
              ...options,

              cache:
                "no-store",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,

                ...options.headers,
              },
            },
          );

        if (
          response.status ===
          401
        ) {
          localStorage.removeItem(
            "subhashree_admin_token",
          );

          localStorage.removeItem(
            "subhashree_admin",
          );

          router.replace(
            "/admin/login",
          );

          throw new Error(
            "Your login has expired. Please sign in again.",
          );
        }

        let data;

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to complete the request.",
          );
        }

        return data;
      },
      [router],
    );

  // ========================================
  // LOAD BLOGS
  // ========================================

  const load =
    useCallback(
      async () => {
        setLoading(true);

        setError("");

        try {
          await request(
            "/auth/me",
          );

          const data =
            await request(
              "/blogs/admin",
            );

          setBlogs(
            Array.isArray(
              data.blogs,
            )
              ? data.blogs
              : [],
          );

          setReady(true);
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof
              Error
              ? loadError.message
              : "Unable to load blogs.",
          );
        } finally {
          setLoading(false);
        }
      },
      [request],
    );

  useEffect(() => {
    void load();
  }, [load]);

  // ========================================
  // CREATE NEW BLOG
  // ========================================

  const openCreate =
    () => {
      setEditing(null);

      setForm({
        ...empty,
      });

      setPreview(false);

      setError("");

      setMessage("");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

  // ========================================
  // EDIT BLOG
  // ========================================

  const openEdit = (
    blog: Blog,
  ) => {
    setEditing(
      blog._id,
    );

    setForm({
      title:
        blog.title || "",

      slug:
        blog.slug || "",

      excerpt:
        blog.excerpt || "",

      category:
        blog.category ||
        "",

      image:
        blog.image || "",

      content:
        blog.content || "",

      status:
        blog.status,
    });

    setPreview(false);

    setError("");

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ========================================
  // SAVE BLOG
  // ========================================

  const save =
    async (
      event: FormEvent<
        HTMLFormElement
      >,
    ) => {
      event.preventDefault();

      const nativeEvent =
        event.nativeEvent as SubmitEvent;

      const submitter =
        nativeEvent.submitter as
          | HTMLButtonElement
          | null;

      const requestedStatus =
        submitter?.dataset
          .status ===
        "published"
          ? "published"
          : "draft";

      setSaving(true);

      setSavingAction(
        requestedStatus,
      );

      setError("");

      setMessage("");

      try {
        const payload: Form = {
          ...form,

          status:
            requestedStatus,
        };

        const data =
          await request(
            editing
              ? `/blogs/${editing}`
              : "/blogs",
            {
              method:
                editing
                  ? "PUT"
                  : "POST",

              body:
                JSON.stringify(
                  payload,
                ),
            },
          );

        const savedBlog =
          data.blog as Blog;

        setEditing(
          savedBlog._id,
        );

        setForm({
          title:
            savedBlog.title,

          slug:
            savedBlog.slug,

          excerpt:
            savedBlog.excerpt,

          category:
            savedBlog.category,

          image:
            savedBlog.image,

          content:
            savedBlog.content,

          status:
            savedBlog.status,
        });

        setBlogs(
          (
            current,
          ) => {
            const exists =
              current.some(
                (
                  blog,
                ) =>
                  blog._id ===
                  savedBlog._id,
              );

            if (exists) {
              return current.map(
                (
                  blog,
                ) =>
                  blog._id ===
                  savedBlog._id
                    ? savedBlog
                    : blog,
              );
            }

            return [
              savedBlog,
              ...current,
            ];
          },
        );

        if (
          savedBlog.status ===
          "published"
        ) {
          setMessage(
            editing
              ? "Blog updated and published successfully."
              : "Blog published successfully.",
          );
        } else {
          setMessage(
            editing
              ? "Blog saved as draft successfully."
              : "Draft saved successfully.",
          );
        }
      } catch (
        saveError
      ) {
        setError(
          saveError instanceof
            Error
            ? saveError.message
            : "Unable to save blog.",
        );
      } finally {
        setSaving(false);

        setSavingAction(
          null,
        );
      }
    };

  // ========================================
  // DELETE BLOG
  // ========================================

  const deleteBlog =
    async (
      blog: Blog,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${blog.title}"?\n\nThis action cannot be undone.`,
        );

      if (!confirmed) {
        return;
      }

      setDeletingId(
        blog._id,
      );

      setError("");

      setMessage("");

      try {
        await request(
          `/blogs/${blog._id}`,
          {
            method:
              "DELETE",
          },
        );

        setBlogs(
          (
            current,
          ) =>
            current.filter(
              (
                item,
              ) =>
                item._id !==
                blog._id,
            ),
        );

        if (
          editing ===
          blog._id
        ) {
          setEditing(
            null,
          );

          setForm({
            ...empty,
          });

          setPreview(
            false,
          );
        }

        setMessage(
          "Blog deleted successfully.",
        );
      } catch (
        deleteError
      ) {
        setError(
          deleteError instanceof
            Error
            ? deleteError.message
            : "Unable to delete blog.",
        );
      } finally {
        setDeletingId(
          null,
        );
      }
    };

  // ========================================
  // TITLE CHANGE
  // ========================================

  const handleTitleChange =
    (
      value: string,
    ) => {
      const generatedSlug =
        value
          .toLowerCase()
          .trim()
          .replace(
            /[^a-z0-9]+/g,
            "-",
          )
          .replace(
            /^-|-$/g,
            "",
          );

      if (!editing) {
        setForm(
          (
            current,
          ) => ({
            ...current,

            title:
              value,

            slug:
              generatedSlug,
          }),
        );

        return;
      }

      setForm(
        (
          current,
        ) => ({
          ...current,

          title:
            value,
        }),
      );
    };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-12 text-center text-slate-600">
        Loading blogs…
      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-slate-50 p-5 text-slate-900 md:p-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}

        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              ← Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold">
              Manage blogs
            </h1>

            <p className="mt-2 text-slate-500">
              Create, edit,
              publish and
              delete website
              articles.
            </p>
          </div>

          <Link
            href="/blog"
            target="_blank"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium shadow-sm transition hover:bg-slate-50"
          >
            View blog ↗
          </Link>
        </header>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}

            {!ready && (
              <button
                type="button"
                onClick={() =>
                  void load()
                }
                className="ml-4 font-semibold underline"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
          >
            {message}
          </div>
        )}

        {ready && (
          <div className="grid items-start gap-8 lg:grid-cols-[360px_1fr]">
            {/* BLOG LIST */}

            <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="button"
                disabled={
                  saving ||
                  Boolean(
                    deletingId,
                  )
                }
                onClick={
                  openCreate
                }
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                + New blog
              </button>

              <div className="mt-5 space-y-4">
                {blogs.length ===
                  0 && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
                    <p className="font-medium">
                      No articles
                      yet
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Create your
                      first blog.
                    </p>
                  </div>
                )}

                {blogs.map(
                  (
                    blog,
                  ) => (
                    <div
                      key={
                        blog._id
                      }
                      className={`rounded-xl border p-4 transition ${
                        editing ===
                        blog._id
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          blog.status ===
                          "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {
                          blog.status
                        }
                      </span>

                      <h3 className="mt-3 break-words font-semibold text-slate-900">
                        {
                          blog.title
                        }
                      </h3>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        /blog/
                        {
                          blog.slug
                        }
                      </p>

                      <div className="mt-4 flex gap-2">
                        <button
                          type="button"
                          disabled={
                            saving ||
                            Boolean(
                              deletingId,
                            )
                          }
                          onClick={() =>
                            openEdit(
                              blog,
                            )
                          }
                          className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          disabled={
                            saving ||
                            deletingId ===
                              blog._id
                          }
                          onClick={() =>
                            void deleteBlog(
                              blog,
                            )
                          }
                          className="flex-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:opacity-50"
                        >
                          {deletingId ===
                          blog._id
                            ? "Deleting…"
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </aside>

            {/* EDITOR */}

            <form
              onSubmit={
                save
              }
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold">
                    {editing
                      ? "Edit article"
                      : "New article"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Write the
                    article, then
                    save it as a
                    draft or
                    publish it
                    directly.
                  </p>
                </div>

                {editing && (
                  <button
                    type="button"
                    onClick={
                      openCreate
                    }
                    disabled={
                      saving
                    }
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              <fieldset
                disabled={
                  saving
                }
                className="space-y-5 disabled:opacity-60"
              >
                {/* TITLE */}

                <label className="block font-medium">
                  Title

                  <input
                    required
                    maxLength={
                      200
                    }
                    className={
                      inputClass
                    }
                    value={
                      form.title
                    }
                    onChange={(
                      event,
                    ) =>
                      handleTitleChange(
                        event
                          .target
                          .value,
                      )
                    }
                  />
                </label>

                {/* SLUG */}

                <label className="block font-medium">
                  URL slug

                  <input
                    required
                    maxLength={
                      200
                    }
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    className={
                      inputClass
                    }
                    value={
                      form.slug
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          slug:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />

                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    /blog/
                    {form.slug ||
                      "your-article"}
                  </span>
                </label>

                {/* SUMMARY */}

                <label className="block font-medium">
                  Summary

                  <textarea
                    required
                    rows={
                      3
                    }
                    maxLength={
                      600
                    }
                    className={
                      inputClass
                    }
                    value={
                      form.excerpt
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          excerpt:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />
                </label>

                {/* CATEGORY */}

                <label className="block font-medium">
                  Category

                  <input
                    required
                    maxLength={
                      80
                    }
                    className={
                      inputClass
                    }
                    value={
                      form.category
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          category:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />
                </label>

                {/* IMAGE */}

                <label className="block font-medium">
                  Cover image URL{" "}

                  <span className="font-normal text-slate-500">
                    (optional)
                  </span>

                  <input
                    maxLength={
                      2000
                    }
                    placeholder="https://... or /buildingA.png"
                    className={
                      inputClass
                    }
                    value={
                      form.image
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          image:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />
                </label>

                {/* CONTENT */}

                <label className="block font-medium">
                  Article content

                  <textarea
                    required
                    rows={
                      18
                    }
                    maxLength={
                      100000
                    }
                    className={`${inputClass} font-mono text-sm`}
                    value={
                      form.content
                    }
                    onChange={(
                      event,
                    ) =>
                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          content:
                            event
                              .target
                              .value,
                        }),
                      )
                    }
                  />

                  <span className="mt-2 block text-sm font-normal text-slate-500">
                    Use{" "}
                    <strong>
                      ## Heading
                    </strong>{" "}
                    for headings
                    and{" "}
                    <strong>
                      - Item
                    </strong>{" "}
                    for bullet
                    points.
                  </span>
                </label>

                {/* PREVIEW */}

                <button
                  type="button"
                  onClick={() =>
                    setPreview(
                      (
                        current,
                      ) =>
                        !current,
                    )
                  }
                  className="text-sm font-semibold underline"
                >
                  {preview
                    ? "Hide preview"
                    : "Preview content"}
                </button>

                {preview && (
                  <div className="rounded-xl border border-slate-200 bg-[#FAF6EA] p-6">
                    <h3 className="mb-6 text-3xl font-bold">
                      {form.title ||
                        "Article preview"}
                    </h3>

                    <BlogContent
                      content={
                        form.content
                      }
                    />
                  </div>
                )}

                {/* CURRENT STATUS */}

                {editing && (
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">
                      Current
                      status
                    </p>

                    <p className="mt-1 font-semibold capitalize">
                      {
                        form.status
                      }
                    </p>
                  </div>
                )}

                {/* ACTION BUTTONS */}

                <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
                  {/* SAVE DRAFT */}

                  <button
                    type="submit"
                    data-status="draft"
                    disabled={
                      saving
                    }
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving &&
                    savingAction ===
                      "draft"
                      ? "Saving…"
                      : editing
                        ? "Save as Draft"
                        : "Save Draft"}
                  </button>

                  {/* PUBLISH */}

                  <button
                    type="submit"
                    data-status="published"
                    disabled={
                      saving
                    }
                    className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving &&
                    savingAction ===
                      "published"
                      ? "Publishing…"
                      : editing
                        ? "Update & Publish"
                        : "Publish Blog"}
                  </button>

                  {/* VIEW PUBLISHED */}

                  {editing &&
                    form.status ===
                      "published" && (
                      <Link
                        href={`/blog/${form.slug}`}
                        target="_blank"
                        className="font-semibold text-slate-700 hover:text-slate-950"
                      >
                        View article
                        ↗
                      </Link>
                    )}
                </div>
              </fieldset>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}