"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  Blog,
  BLOG_API_URL,
} from "@/lib/blogs";

import BlogContent from "@/components/BlogContent";

// ========================================
// TYPES
// ========================================

type Form =
  Pick<
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
  category:
    "Property insights",
  image: "",
  content: "",
  status: "draft",
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900";

// ========================================
// PAGE
// ========================================

export default function AdminBlogsPage() {
  const router =
    useRouter();

  const [
    blogs,
    setBlogs,
  ] =
    useState<Blog[]>([]);

  const [
    form,
    setForm,
  ] =
    useState<Form>(
      empty
    );

  const [
    editing,
    setEditing,
  ] =
    useState<
      string | null
    >(null);

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
    deleting,
    setDeleting,
  ] =
    useState(false);

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
  // API REQUEST
  // ========================================

  const request =
    useCallback(
      async (
        path: string,
        options:
          RequestInit = {}
      ) => {
        const token =
          localStorage.getItem(
            "subhashree_admin_token"
          );

        if (!token) {
          router.replace(
            "/admin/login"
          );

          throw new Error(
            "Please sign in to continue."
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
            }
          );

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

          throw new Error(
            "Your login has expired. Please sign in again."
          );
        }

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
            "Unable to save changes."
          );
        }

        return data;
      },
      [
        router,
      ]
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
            "/auth/me"
          );

          const data =
            await request(
              "/blogs/admin"
            );

          setBlogs(
            data.blogs ||
            []
          );

          setReady(true);
        } catch (
          error
        ) {
          setError(
            error instanceof
              Error
              ? error.message
              : "Unable to load blogs."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        request,
      ]
    );

  useEffect(
    () => {
      void load();
    },
    [
      load,
    ]
  );

  // ========================================
  // SELECT / NEW
  // ========================================

  function select(
    blog?: Blog
  ) {
    if (
      (
        form.title ||
        form.content
      ) &&
      !window.confirm(
        "Open another article? Any unsaved changes in the editor will be lost."
      )
    ) {
      return;
    }

    setEditing(
      blog?._id ||
      null
    );

    setForm(
      blog
        ? {
            title:
              blog.title,

            slug:
              blog.slug,

            excerpt:
              blog.excerpt,

            category:
              blog.category,

            image:
              blog.image,

            content:
              blog.content,

            status:
              blog.status,
          }
        : {
            ...empty,
          }
    );

    setMessage("");
    setError("");
    setPreview(false);
  }

  // ========================================
  // SAVE
  // ========================================

  async function save(
    event: FormEvent
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
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
                form
              ),
          }
        );

      setEditing(
        data.blog._id
      );

      setBlogs(
        (
          current
        ) => [
          data.blog,

          ...current.filter(
            (
              blog
            ) =>
              blog._id !==
              data.blog._id
          ),
        ]
      );

      setMessage(
        form.status ===
          "published"
          ? "Article saved and published on the website."
          : "Draft saved. This article is hidden from the website."
      );
    } catch (
      error
    ) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Unable to save blog."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // DELETE
  // ========================================

  async function deleteBlog() {
    if (!editing) {
      return;
    }

    const selected =
      blogs.find(
        (
          blog
        ) =>
          blog._id ===
          editing
      );

    if (
      !window.confirm(
        `Delete "${
          selected?.title ||
          "this article"
        }"?\n\nThis cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setMessage("");

      await request(
        `/blogs/${editing}`,
        {
          method:
            "DELETE",
        }
      );

      setBlogs(
        (
          current
        ) =>
          current.filter(
            (
              blog
            ) =>
              blog._id !==
              editing
          )
      );

      setEditing(null);

      setForm({
        ...empty,
      });

      setPreview(false);

      setMessage(
        "Blog deleted successfully."
      );
    } catch (
      error
    ) {
      setError(
        error instanceof
          Error
          ? error.message
          : "Unable to delete blog."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <main className="p-12 text-center">
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
              className="text-sm text-slate-600"
            >
              ← Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold">
              Manage blogs
            </h1>

            <p className="mt-2 text-slate-500">
              Write stories,
              save drafts and
              publish updates.
            </p>
          </div>

          <Link
            href="/blog"
            target="_blank"
            className="rounded-xl border border-slate-300 bg-white px-4 py-3"
          >
            View blog ↗
          </Link>
        </header>

        {/* ERROR */}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl bg-red-50 p-4 text-red-700"
          >
            {error}

            {!ready && (
              <button
                type="button"
                onClick={() =>
                  void load()
                }
                className="ml-4 underline"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* SUCCESS */}

        {message && (
          <p
            role="status"
            className="mb-5 rounded-xl bg-green-50 p-4 text-green-800"
          >
            {message}
          </p>
        )}

        {ready && (
          <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr]">
            {/* LEFT LIST */}

            <aside className="rounded-2xl bg-white p-5 shadow-sm">
              <button
                type="button"
                disabled={
                  saving ||
                  deleting
                }
                onClick={() =>
                  select()
                }
                className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-50"
              >
                + New blog
              </button>

              <div className="mt-5 space-y-3">
                {blogs.length ===
                  0 && (
                  <p className="text-sm text-slate-500">
                    No articles yet.
                    Create your first
                    blog.
                  </p>
                )}

                {blogs.map(
                  (
                    blog
                  ) => (
                    <button
                      type="button"
                      disabled={
                        saving ||
                        deleting
                      }
                      key={
                        blog._id
                      }
                      onClick={() =>
                        select(
                          blog
                        )
                      }
                      className={`w-full rounded-xl border p-4 text-left transition ${
                        editing ===
                        blog._id
                          ? "border-amber-500 bg-amber-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase text-slate-500">
                        {
                          blog.status
                        }
                      </span>

                      <span className="mt-2 block font-semibold">
                        {
                          blog.title
                        }
                      </span>
                    </button>
                  )
                )}
              </div>
            </aside>

            {/* EDITOR */}

            <form
              onSubmit={
                save
              }
              className="rounded-2xl bg-white p-6 shadow-sm md:p-8"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">
                  {editing
                    ? "Edit article"
                    : "New article"}
                </h2>

                {editing && (
                  <button
                    type="button"
                    disabled={
                      deleting ||
                      saving
                    }
                    onClick={
                      deleteBlog
                    }
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                  >
                    {deleting
                      ? "Deleting…"
                      : "Delete blog"}
                  </button>
                )}
              </div>

              <fieldset
                disabled={
                  saving ||
                  deleting
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
                      e
                    ) => {
                      const newTitle =
                        e
                          .target
                          .value;

                      setForm(
                        (
                          current
                        ) => ({
                          ...current,

                          title:
                            newTitle,

                          ...(
                            !editing
                              ? {
                                  slug:
                                    newTitle
                                      .toLowerCase()
                                      .replace(
                                        /[^a-z0-9]+/g,
                                        "-"
                                      )
                                      .replace(
                                        /^-|-$/g,
                                        ""
                                      ),
                                }
                              : {}
                          ),
                        })
                      );
                    }}
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
                      e
                    ) =>
                      setForm({
                        ...form,

                        slug:
                          e
                            .target
                            .value,
                      })
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
                    rows={3}
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
                      e
                    ) =>
                      setForm({
                        ...form,

                        excerpt:
                          e
                            .target
                            .value,
                      })
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
                      e
                    ) =>
                      setForm({
                        ...form,

                        category:
                          e
                            .target
                            .value,
                      })
                    }
                  />
                </label>

                {/* COVER IMAGE */}

                <label className="block font-medium">
                  Cover image URL{" "}

                  <span className="font-normal text-slate-500">
                    (optional)
                  </span>

                  <input
                    maxLength={
                      2000
                    }
                    placeholder="https://… or /buildingA.png"
                    className={
                      inputClass
                    }
                    value={
                      form.image
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,

                        image:
                          e
                            .target
                            .value,
                      })
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
                      e
                    ) =>
                      setForm({
                        ...form,

                        content:
                          e
                            .target
                            .value,
                      })
                    }
                  />

                  <span className="mt-2 block text-sm font-normal text-slate-500">
                    Separate paragraphs
                    with a blank line.
                    Use &quot;##
                    Heading&quot; for
                    headings and
                    &quot;- Item&quot;
                    for bullets.
                  </span>
                </label>

                {/* PREVIEW */}

                <button
                  type="button"
                  onClick={() =>
                    setPreview(
                      !preview
                    )
                  }
                  className="text-sm font-semibold underline"
                >
                  {preview
                    ? "Hide preview"
                    : "Preview content"}
                </button>

                {preview && (
                  <div className="rounded-xl bg-[#FAF6EA] p-6">
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

                {/* STATUS */}

                <label className="block font-medium">
                  Status

                  <select
                    className={
                      inputClass
                    }
                    value={
                      form.status
                    }
                    onChange={(
                      e
                    ) =>
                      setForm({
                        ...form,

                        status:
                          e
                            .target
                            .value as Form["status"],
                      })
                    }
                  >
                    <option value="draft">
                      Draft — hidden
                      from website
                    </option>

                    <option value="published">
                      Published —
                      visible on website
                    </option>
                  </select>
                </label>

                {/* ACTIONS */}

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white"
                  >
                    {saving
                      ? "Saving…"
                      : form.status ===
                        "published"
                      ? "Save and publish"
                      : "Save draft"}
                  </button>

                  {editing &&
                    blogs.find(
                      (
                        blog
                      ) =>
                        blog._id ===
                        editing
                    )
                      ?.status ===
                      "published" && (
                      <Link
                        href={`/blog/${
                          blogs.find(
                            (
                              blog
                            ) =>
                              blog._id ===
                              editing
                          )
                            ?.slug
                        }`}
                        target="_blank"
                        className="font-semibold"
                      >
                        View published
                        article ↗
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