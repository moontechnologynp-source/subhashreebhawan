"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  Link2,
  Plus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";

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

type BlogForm = Pick<
  Blog,
  | "title"
  | "slug"
  | "excerpt"
  | "category"
  | "image"
  | "content"
  | "status"
>;

interface ArticleSection {
  id: string;

  heading: string;

  body: string;

  linkText: string;

  linkUrl: string;
}

// ========================================
// EMPTY VALUES
// ========================================

const emptyForm:
  BlogForm = {
  title: "",

  slug: "",

  excerpt: "",

  category:
    "Property insights",

  image: "",

  content: "",

  status:
    "draft",
};

function emptySection(
  index:
    number,
): ArticleSection {
  return {
    id:
      `section-${index}`,

    heading: "",

    body: "",

    linkText: "",

    linkUrl: "",
  };
}

// ========================================
// STYLES
// ========================================

const inputClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const textareaClass =
  "mt-2 w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

// ========================================
// HELPERS
// ========================================

function slugify(
  value:
    string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function safeLinkUrl(
  value:
    string,
) {
  const url =
    value.trim();

  if (
    !url
  ) {
    return true;
  }

  return (
    url.startsWith("/") ||
    url.startsWith("#") ||
    /^https?:\/\//i.test(
      url,
    ) ||
    /^mailto:/i.test(
      url,
    ) ||
    /^tel:/i.test(
      url,
    )
  );
}

function safeLinkText(
  value:
    string,
) {
  return value
    .replace(
      /\[/g,
      "(",
    )
    .replace(
      /\]/g,
      ")",
    )
    .trim();
}

// ========================================
// BUILD BLOG CONTENT
// ========================================

function buildContent(
  introduction:
    string,

  sections:
    ArticleSection[],
) {
  const blocks:
    string[] =
    [];

  if (
    introduction.trim()
  ) {
    blocks.push(
      introduction.trim(),
    );
  }

  sections.forEach(
    (
      section,
    ) => {
      if (
        section.heading.trim()
      ) {
        blocks.push(
          `## ${section.heading.trim()}`,
        );
      }

      if (
        section.body.trim()
      ) {
        blocks.push(
          section.body.trim(),
        );
      }

      if (
        section.linkText.trim() &&
        section.linkUrl.trim()
      ) {
        blocks.push(
          `[${safeLinkText(
            section.linkText,
          )}](${section.linkUrl.trim()})`,
        );
      }
    },
  );

  return blocks.join(
    "\n\n",
  );
}

// ========================================
// READ EXISTING BLOG CONTENT
// ========================================

function parseContent(
  content:
    string,
) {
  if (
    !content.trim()
  ) {
    return {
      introduction:
        "",

      sections: [
        emptySection(
          1,
        ),
      ],
    };
  }

  const blocks =
    content
      .split(
        /\n\s*\n/,
      )
      .filter(
        (
          block,
        ) =>
          block.trim(),
      );

  const introductionBlocks:
    string[] =
    [];

  const parsedSections:
    ArticleSection[] =
    [];

  let current:
    ArticleSection |
    null =
    null;

  const pushCurrent =
    () => {
      if (
        current
      ) {
        parsedSections.push(
          current,
        );
      }
    };

  blocks.forEach(
    (
      block,
    ) => {
      // HEADING

      if (
        block.startsWith(
          "## ",
        )
      ) {
        pushCurrent();

        current = {
          id:
            `section-${
              parsedSections.length +
              1
            }`,

          heading:
            block
              .slice(
                3,
              )
              .trim(),

          body: "",

          linkText: "",

          linkUrl: "",
        };

        return;
      }

      // STANDALONE LINK

      const linkMatch =
        block.match(
          /^\[([^\]]+)\]\(([^)]+)\)$/,
        );

      if (
        current &&
        linkMatch
      ) {
        current.linkText =
          linkMatch[1];

        current.linkUrl =
          linkMatch[2];

        return;
      }

      // SECTION BODY

      if (
        current
      ) {
        current.body =
          current.body
            ? `${current.body}\n\n${block}`
            : block;

        return;
      }

      // INTRODUCTION

      introductionBlocks.push(
        block,
      );
    },
  );

  pushCurrent();

  if (
    parsedSections.length ===
    0
  ) {
    parsedSections.push(
      emptySection(
        1,
      ),
    );
  }

  return {
    introduction:
      introductionBlocks.join(
        "\n\n",
      ),

    sections:
      parsedSections,
  };
}

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
    useState<
      Blog[]
    >([]);

  const [
    form,
    setForm,
  ] =
    useState<
      BlogForm
    >({
      ...emptyForm,
    });

  const [
    introduction,
    setIntroduction,
  ] =
    useState("");

  const [
    sections,
    setSections,
  ] =
    useState<
      ArticleSection[]
    >([
      emptySection(
        1,
      ),
    ]);

  const [
    editing,
    setEditing,
  ] =
    useState<
      string |
      null
    >(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

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
    deleting,
    setDeleting,
  ] =
    useState(false);

  const [
    preview,
    setPreview,
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

  // ========================================
  // IMAGE
  // ========================================

  const [
    selectedImage,
    setSelectedImage,
  ] =
    useState<
      File |
      null
    >(null);

  const [
    selectedPreview,
    setSelectedPreview,
  ] =
    useState("");

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  // ========================================
  // AUTH REQUEST
  // ========================================

  const request =
    useCallback(
      async (
        path:
          string,

        options:
          RequestInit = {},
      ) => {
        const token =
          localStorage.getItem(
            "subhashree_admin_token",
          );

        if (
          !token
        ) {
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

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          throw new Error(
            data.message ||
            "Unable to complete this request.",
          );
        }

        return data;
      },
      [
        router,
      ],
    );

  // ========================================
  // LOAD BLOGS
  // ========================================

  const loadBlogs =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        setError(
          "",
        );

        try {
          await request(
            "/auth/me",
          );

          const data =
            await request(
              "/blogs/admin",
            );

          setBlogs(
            data.blogs ||
            [],
          );
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
          setLoading(
            false,
          );
        }
      },
      [
        request,
      ],
    );

  useEffect(
    () => {
      void loadBlogs();
    },
    [
      loadBlogs,
    ],
  );

  // ========================================
  // IMAGE PREVIEW CLEANUP
  // ========================================

  useEffect(
    () => {
      if (
        !selectedImage
      ) {
        setSelectedPreview(
          "",
        );

        return;
      }

      const url =
        URL.createObjectURL(
          selectedImage,
        );

      setSelectedPreview(
        url,
      );

      return () => {
        URL.revokeObjectURL(
          url,
        );
      };
    },
    [
      selectedImage,
    ],
  );

  // ========================================
  // CURRENT CONTENT
  // ========================================

  const generatedContent =
    useMemo(
      () =>
        buildContent(
          introduction,
          sections,
        ),
      [
        introduction,
        sections,
      ],
    );

  const readingTime =
    useMemo(
      () => {
        const words =
          generatedContent
            .trim()
            .split(
              /\s+/,
            )
            .filter(
              Boolean,
            ).length;

        return Math.max(
          1,
          Math.ceil(
            words /
            200,
          ),
        );
      },
      [
        generatedContent,
      ],
    );

  // ========================================
  // RESET
  // ========================================

  const resetEditor =
    () => {
      setEditing(
        null,
      );

      setForm({
        ...emptyForm,
      });

      setIntroduction(
        "",
      );

      setSections([
        emptySection(
          1,
        ),
      ]);

      setSelectedImage(
        null,
      );

      setPreview(
        false,
      );

      setError(
        "",
      );

      setMessage(
        "",
      );
    };

  // ========================================
  // OPEN BLOG
  // ========================================

  const openBlog =
    (
      blog:
        Blog,
    ) => {
      if (
        !window.confirm(
          "Open this article? Any unsaved changes in the editor will be lost.",
        )
      ) {
        return;
      }

      const parsed =
        parseContent(
          blog.content,
        );

      setEditing(
        blog._id,
      );

      setForm({
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
      });

      setIntroduction(
        parsed.introduction,
      );

      setSections(
        parsed.sections,
      );

      setSelectedImage(
        null,
      );

      setPreview(
        false,
      );

      setError(
        "",
      );

      setMessage(
        "",
      );

      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };

  // ========================================
  // NEW BLOG
  // ========================================

  const newBlog =
    () => {
      if (
        !window.confirm(
          "Create a new article? Any unsaved changes will be lost.",
        )
      ) {
        return;
      }

      resetEditor();

      window.scrollTo({
        top: 0,

        behavior:
          "smooth",
      });
    };

  // ========================================
  // CHANGE TITLE
  // ========================================

  const changeTitle =
    (
      title:
        string,
    ) => {
      setForm(
        (
          current,
        ) => ({
          ...current,

          title,

          slug:
            editing
              ? current.slug
              : slugify(
                  title,
                ),
        }),
      );
    };

  // ========================================
  // SECTIONS
  // ========================================

  const updateSection =
    (
      id:
        string,

      field:
        keyof Omit<
          ArticleSection,
          "id"
        >,

      value:
        string,
    ) => {
      setSections(
        (
          current,
        ) =>
          current.map(
            (
              section,
            ) =>
              section.id ===
              id
                ? {
                    ...section,

                    [field]:
                      value,
                  }
                : section,
          ),
      );
    };

  const addSection =
    () => {
      setSections(
        (
          current,
        ) => [
          ...current,

          {
            id:
              `section-${Date.now()}`,

            heading: "",

            body: "",

            linkText: "",

            linkUrl: "",
          },
        ],
      );
    };

  const removeSection =
    (
      id:
        string,
    ) => {
      if (
        sections.length ===
        1
      ) {
        setSections([
          emptySection(
            1,
          ),
        ]);

        return;
      }

      setSections(
        (
          current,
        ) =>
          current.filter(
            (
              section,
            ) =>
              section.id !==
              id,
          ),
      );
    };

  // ========================================
  // ADD BULLET
  // ========================================

  const addBullet =
    (
      id:
        string,
    ) => {
      setSections(
        (
          current,
        ) =>
          current.map(
            (
              section,
            ) => {
              if (
                section.id !==
                id
              ) {
                return section;
              }

              const body =
                section.body;

              return {
                ...section,

                body:
                  body.trim()
                    ? `${body}\n- `
                    : "- ",
              };
            },
          ),
      );
    };

  // ========================================
  // IMAGE SELECTION
  // ========================================

  const chooseImage =
    (
      file:
        File |
        null,
    ) => {
      if (
        !file
      ) {
        return;
      }

      const allowed =
        new Set([
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/avif",
        ]);

      if (
        !allowed.has(
          file.type,
        )
      ) {
        setError(
          "Please select a JPG, PNG, WebP or AVIF image.",
        );

        return;
      }

      if (
        file.size >
        10 *
          1024 *
          1024
      ) {
        setError(
          "Cover image must be 10 MB or smaller.",
        );

        return;
      }

      setSelectedImage(
        file,
      );

      setError(
        "",
      );
    };

  // ========================================
  // BLOB UPLOAD
  // ========================================

  const uploadCoverImage =
    async (
      file:
        File,
    ) => {
      const token =
        localStorage.getItem(
          "subhashree_admin_token",
        );

      if (
        !token
      ) {
        throw new Error(
          "Please sign in again.",
        );
      }

      setUploading(
        true,
      );

      try {
        // Ask backend for signed Vercel Blob URL.

        const prepareResponse =
          await fetch(
            `${BLOG_API_URL}/uploads/image-url`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  purpose:
                    "blog",

                  contentType:
                    file.type,

                  fileSize:
                    file.size,

                  fileName:
                    file.name,
                }),
            },
          );

        const prepareData =
          await prepareResponse.json();

        if (
          !prepareResponse.ok ||
          !prepareData.uploadUrl
        ) {
          throw new Error(
            prepareData.message ||
            "Unable to prepare image upload.",
          );
        }

        // Upload directly to Vercel Blob.

        const uploadResponse =
          await fetch(
            prepareData.uploadUrl,
            {
              method:
                "PUT",

              headers: {
                "Content-Type":
                  file.type,
              },

              body:
                file,
            },
          );

        let uploadData:
          Record<
            string,
            string
          > =
          {};

        try {
          uploadData =
            await uploadResponse.json();
        } catch {
          uploadData =
            {};
        }

        if (
          !uploadResponse.ok
        ) {
          throw new Error(
            "Image upload failed.",
          );
        }

        const finalUrl =
          uploadData.url ||
          uploadData.downloadUrl ||
          prepareData.url ||
          prepareData.publicUrl ||
          "";

        if (
          !finalUrl
        ) {
          throw new Error(
            "The image uploaded, but its public URL was not returned.",
          );
        }

        return finalUrl;
      } finally {
        setUploading(
          false,
        );
      }
    };

  // ========================================
  // VALIDATION
  // ========================================

  const validate =
    () => {
      if (
        !form.title.trim()
      ) {
        throw new Error(
          "Blog title is required.",
        );
      }

      if (
        !form.slug.trim()
      ) {
        throw new Error(
          "Blog URL could not be generated.",
        );
      }

      if (
        !form.excerpt.trim()
      ) {
        throw new Error(
          "Short summary is required.",
        );
      }

      if (
        !form.category.trim()
      ) {
        throw new Error(
          "Category is required.",
        );
      }

      if (
        !generatedContent.trim()
      ) {
        throw new Error(
          "Please add some article content.",
        );
      }

      sections.forEach(
        (
          section,
          index,
        ) => {
          const hasText =
            Boolean(
              section.linkText.trim(),
            );

          const hasUrl =
            Boolean(
              section.linkUrl.trim(),
            );

          if (
            hasText !==
            hasUrl
          ) {
            throw new Error(
              `Section ${
                index +
                1
              }: provide both Link Text and Link URL, or leave both empty.`,
            );
          }

          if (
            hasUrl &&
            !safeLinkUrl(
              section.linkUrl,
            )
          ) {
            throw new Error(
              `Section ${
                index +
                1
              }: link must begin with https://, http://, /, #, mailto: or tel:.`,
            );
          }
        },
      );
    };

  // ========================================
  // SAVE
  // ========================================

  const save =
    async (
      event:
        FormEvent<HTMLFormElement>,
    ) => {
      event.preventDefault();

      const submitter =
        (
          event.nativeEvent as SubmitEvent
        ).submitter as
          | HTMLButtonElement
          | null;

      const requestedStatus =
        submitter?.dataset.status ===
        "published"
          ? "published"
          : "draft";

      setSaving(
        true,
      );

      setSavingAction(
        requestedStatus,
      );

      setError(
        "",
      );

      setMessage(
        "",
      );

      try {
        validate();

        let imageUrl =
          form.image;

        if (
          selectedImage
        ) {
          imageUrl =
            await uploadCoverImage(
              selectedImage,
            );
        }

        const payload:
          BlogForm = {
          ...form,

          image:
            imageUrl,

          content:
            generatedContent,

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

        const savedBlog:
          Blog =
          data.blog;

        setBlogs(
          (
            current,
          ) => [
            savedBlog,

            ...current.filter(
              (
                blog,
              ) =>
                blog._id !==
                savedBlog._id,
            ),
          ],
        );

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

        setSelectedImage(
          null,
        );

        setMessage(
          requestedStatus ===
          "published"
            ? "Article saved and published."
            : "Draft saved.",
        );
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
        setSaving(
          false,
        );

        setSavingAction(
          null,
        );
      }
    };

  // ========================================
  // DELETE
  // ========================================

  const deleteBlog =
    async () => {
      if (
        !editing
      ) {
        return;
      }

      if (
        !window.confirm(
          "Delete this blog permanently?",
        )
      ) {
        return;
      }

      setDeleting(
        true,
      );

      setError(
        "",
      );

      try {
        await request(
          `/blogs/${editing}`,
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
                blog,
              ) =>
                blog._id !==
                editing,
            ),
        );

        resetEditor();

        setMessage(
          "Blog deleted.",
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
        setDeleting(
          false,
        );
      }
    };

  // ========================================
  // LOADING
  // ========================================

  if (
    loading
  ) {
    return (
      <main className="min-h-screen bg-slate-50 p-10">

        <div className="mx-auto max-w-7xl">

          <p className="text-center text-slate-500">
            Loading blogs...
          </p>
        </div>
      </main>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <main className="min-h-screen bg-[#f7f7f5] p-5 text-slate-900 md:p-8">

      <div className="mx-auto max-w-[1500px]">

        {/* =================================
            HEADER
        ================================= */}

        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div>

            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />

              Admin Dashboard
            </Link>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              Blog Manager
            </h1>

            <p className="mt-2 text-slate-500">
              Create, edit and publish articles for Subha Shree Bhawan.
            </p>
          </div>

          <button
            type="button"
            onClick={
              newBlog
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />

            New Blog
          </button>
        </header>

        {/* =================================
            ALERTS
        ================================= */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {
              error
            }
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {
              message
            }
          </div>
        )}

        {/* =================================
            LAYOUT
        ================================= */}

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">

          {/* =================================
              BLOG LIST
          ================================= */}

          <aside className="self-start rounded-[28px] border border-slate-200 bg-white p-4 lg:sticky lg:top-5">

            <div className="mb-4 flex items-center justify-between">

              <div>

                <h2 className="font-bold">
                  Articles
                </h2>

                <p className="text-xs text-slate-400">
                  {
                    blogs.length
                  }{" "}
                  total
                </p>
              </div>

              <button
                type="button"
                onClick={
                  newBlog
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white"
                aria-label="New blog"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-2 overflow-y-auto pr-1">

              {blogs.length ===
                0 && (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
                  No articles yet.
                </div>
              )}

              {blogs.map(
                (
                  blog,
                ) => (
                  <button
                    key={
                      blog._id
                    }
                    type="button"
                    onClick={() =>
                      openBlog(
                        blog,
                      )
                    }
                    className={[
                      "w-full rounded-2xl border p-4 text-left transition",

                      editing ===
                      blog._id
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    ].join(
                      " ",
                    )}
                  >

                    <p className="line-clamp-2 font-semibold">
                      {
                        blog.title
                      }
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2 text-xs">

                      <span
                        className={
                          editing ===
                          blog._id
                            ? "text-white/60"
                            : "text-slate-400"
                        }
                      >
                        {
                          blog.category
                        }
                      </span>

                      <span
                        className={[
                          "rounded-full px-2 py-1 font-semibold",

                          blog.status ===
                          "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700",
                        ].join(
                          " ",
                        )}
                      >
                        {
                          blog.status
                        }
                      </span>
                    </div>
                  </button>
                ),
              )}
            </div>
          </aside>

          {/* =================================
              EDITOR
          ================================= */}

          <form
            onSubmit={
              save
            }
            className="space-y-6"
          >

            {/* =================================
                1 BASIC INFORMATION
            ================================= */}

            <EditorCard
              number="1"
              title="Basic blog information"
              description="These details appear on the blog listing page and article header."
            >

              <div className="grid gap-5 md:grid-cols-2">

                <label className="md:col-span-2 block font-medium">

                  Blog title *

                  <p className="mt-1 text-sm font-normal text-slate-500">
                    Use a clear title that tells readers what the article is about.
                  </p>

                  <input
                    required
                    maxLength={
                      200
                    }
                    value={
                      form.title
                    }
                    onChange={(
                      event,
                    ) =>
                      changeTitle(
                        event.target.value,
                      )
                    }
                    placeholder="Example: Choosing the Right Commercial Space in Kathmandu"
                    className={
                      inputClass
                    }
                  />
                </label>

                {/* URL */}

                <div className="md:col-span-2 rounded-2xl border border-cyan-900/15 bg-cyan-950/[0.04] p-5">

                  <p className="text-xs font-bold tracking-[0.18em] text-cyan-900/60">
                    BLOG ADDRESS GENERATED AUTOMATICALLY
                  </p>

                  <p className="mt-3 break-all text-lg font-semibold text-cyan-950">
                    /blog/
                    {form.slug ||
                      "your-blog-title"}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    {editing
                      ? "The URL is preserved while editing so existing links do not break."
                      : "The URL is generated automatically from the title."}
                  </p>
                </div>

                {/* SUMMARY */}

                <label className="md:col-span-2 block font-medium">

                  Short summary *

                  <p className="mt-1 text-sm font-normal text-slate-500">
                    Write one or two sentences. This appears on blog cards.
                  </p>

                  <textarea
                    required
                    rows={
                      4
                    }
                    maxLength={
                      600
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
                            event.target.value,
                        }),
                      )
                    }
                    placeholder="Briefly explain what readers will learn from this article."
                    className={
                      textareaClass
                    }
                  />
                </label>

                {/* CATEGORY */}

                <label className="block font-medium">

                  Category *

                  <input
                    required
                    maxLength={
                      80
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
                            event.target.value,
                        }),
                      )
                    }
                    placeholder="Property insights"
                    className={
                      inputClass
                    }
                  />
                </label>

                {/* READING TIME */}

                <div>

                  <p className="font-medium">
                    Reading time
                  </p>

                  <div className={`${inputClass} bg-slate-50`}>
                    {
                      readingTime
                    }{" "}
                    min read
                  </div>
                </div>
              </div>
            </EditorCard>

            {/* =================================
                2 COVER IMAGE
            ================================= */}

            <EditorCard
              number="2"
              title="Cover image"
              description="Upload the main image shown on the blog card and article page."
            >

              <label className="block font-medium">

                Blog cover image

                <p className="mt-1 text-sm font-normal text-slate-500">
                  JPG, PNG, WebP or AVIF. Maximum 10 MB.
                </p>
              </label>

              {(selectedPreview ||
                form.image) && (
                <div className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">

                  <img
                    src={
                      selectedPreview ||
                      form.image
                    }
                    alt="Blog cover preview"
                    className="max-h-[420px] w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800">

                  <Upload className="h-4 w-4" />

                  {selectedPreview ||
                  form.image
                    ? "Replace Image"
                    : "Upload Image"}

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.avif,image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    onChange={(
                      event,
                    ) =>
                      chooseImage(
                        event.target.files?.[0] ||
                        null,
                      )
                    }
                  />
                </label>

                {(selectedImage ||
                  form.image) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(
                        null,
                      );

                      setForm(
                        (
                          current,
                        ) => ({
                          ...current,

                          image:
                            "",
                        }),
                      );
                    }}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-600"
                  >
                    <X className="h-4 w-4" />

                    Remove
                  </button>
                )}
              </div>
            </EditorCard>

            {/* =================================
                3 INTRODUCTION
            ================================= */}

            <EditorCard
              number="3"
              title="Article introduction"
              description="This is the opening paragraph readers see before the article sections."
            >

              <label className="block font-medium">

                Introduction

                <p className="mt-1 text-sm font-normal text-slate-500">
                  Explain the topic, why it matters, and what the reader will learn.
                </p>

                <textarea
                  rows={
                    8
                  }
                  value={
                    introduction
                  }
                  onChange={(
                    event,
                  ) =>
                    setIntroduction(
                      event.target.value,
                    )
                  }
                  placeholder="Start your article with a clear and engaging introduction..."
                  className={
                    textareaClass
                  }
                />
              </label>
            </EditorCard>

            {/* =================================
                4 ARTICLE CONTENT
            ================================= */}

            <EditorCard
              number="4"
              title="Article content"
              description="Break your article into sections. Every section can contain a heading, paragraphs, bullet points and an optional hyperlink."
            >

              <div className="space-y-5">

                {sections.map(
                  (
                    section,
                    index,
                  ) => (
                    <div
                      key={
                        section.id
                      }
                      className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5 md:p-6"
                    >

                      {/* SECTION HEADER */}

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="font-bold">
                            Section{" "}
                            {
                              index +
                              1
                            }
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            Add one topic or idea in this section.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeSection(
                              section.id,
                            )
                          }
                          className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                          aria-label="Delete section"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* HEADING */}

                      <label className="mt-6 block font-medium">

                        Section heading

                        <input
                          value={
                            section.heading
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSection(
                              section.id,
                              "heading",
                              event.target.value,
                            )
                          }
                          placeholder="Example: Why location matters"
                          className={
                            inputClass
                          }
                        />
                      </label>

                      {/* BODY */}

                      <label className="mt-5 block font-medium">

                        Section paragraphs

                        <p className="mt-1 text-sm font-normal text-slate-500">
                          Write paragraphs here. Use Add point to insert a bullet.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            addBullet(
                              section.id,
                            )
                          }
                          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold transition hover:bg-slate-50"
                        >
                          <Plus className="h-4 w-4" />

                          Add point
                        </button>

                        <textarea
                          rows={
                            10
                          }
                          value={
                            section.body
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSection(
                              section.id,
                              "body",
                              event.target.value,
                            )
                          }
                          placeholder={`Write your paragraph here...

- First useful point
- Second useful point`}
                          className={`${textareaClass} font-normal`}
                        />
                      </label>

                      {/* =================================
                          SECTION LINK
                      ================================= */}

                      <div className="mt-6 rounded-2xl border border-cyan-900/15 bg-cyan-950/[0.04] p-5">

                        <div className="flex items-center gap-2 text-cyan-950">

                          <Link2 className="h-4 w-4" />

                          <h4 className="font-semibold">
                            Section link
                          </h4>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                          Optional. Add a useful internal page or external source.
                        </p>

                        <div className="mt-5 grid gap-4 md:grid-cols-2">

                          <label className="block font-medium">

                            Link text

                            <p className="mt-1 text-xs font-normal text-slate-500">
                              The clickable words readers see.
                            </p>

                            <input
                              value={
                                section.linkText
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSection(
                                  section.id,
                                  "linkText",
                                  event.target.value,
                                )
                              }
                              placeholder="Example: View our Gallery"
                              className={
                                inputClass
                              }
                            />
                          </label>

                          <label className="block font-medium">

                            Link URL

                            <p className="mt-1 text-xs font-normal text-slate-500">
                              Use / for this website or https:// for another website.
                            </p>

                            <input
                              value={
                                section.linkUrl
                              }
                              onChange={(
                                event,
                              ) =>
                                updateSection(
                                  section.id,
                                  "linkUrl",
                                  event.target.value,
                                )
                              }
                              placeholder="/gallery or https://example.com"
                              className={
                                inputClass
                              }
                            />
                          </label>
                        </div>

                        {section.linkText &&
                          section.linkUrl &&
                          safeLinkUrl(
                            section.linkUrl,
                          ) && (
                            <p className="mt-4 text-sm text-slate-500">
                              Preview:{" "}

                              <a
                                href={
                                  section.linkUrl
                                }
                                target={
                                  /^https?:\/\//i.test(
                                    section.linkUrl,
                                  )
                                    ? "_blank"
                                    : undefined
                                }
                                rel="noopener noreferrer"
                                className="font-semibold text-amber-800 underline"
                              >
                                {
                                  section.linkText
                                }
                              </a>
                            </p>
                          )}
                      </div>
                    </div>
                  ),
                )}

                <button
                  type="button"
                  onClick={
                    addSection
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold transition hover:bg-slate-50"
                >
                  <Plus className="h-4 w-4" />

                  Add Another Section
                </button>
              </div>
            </EditorCard>

            {/* =================================
                5 PREVIEW + SAVE
            ================================= */}

            <EditorCard
              number="5"
              title="Preview and publish"
              description="Review your article before publishing it."
            >

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
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold transition hover:bg-slate-50"
              >
                <Eye className="h-4 w-4" />

                {preview
                  ? "Hide Preview"
                  : "Preview Article"}
              </button>

              {preview && (
                <div className="mt-6 rounded-[28px] border border-slate-200 bg-[#FAF6EA] p-6 md:p-10">

                  <p className="text-sm font-semibold text-amber-800">
                    {
                      form.category
                    }
                  </p>

                  <h2 className="mt-3 text-3xl font-extrabold md:text-5xl">
                    {form.title ||
                      "Untitled Blog"}
                  </h2>

                  {form.excerpt && (
                    <p className="mt-5 text-xl text-slate-600">
                      {
                        form.excerpt
                      }
                    </p>
                  )}

                  {(selectedPreview ||
                    form.image) && (
                    <img
                      src={
                        selectedPreview ||
                        form.image
                      }
                      alt=""
                      className="my-8 max-h-[500px] w-full rounded-3xl object-cover"
                    />
                  )}

                  <BlogContent
                    content={
                      generatedContent
                    }
                  />
                </div>
              )}

              <div className="mt-7 rounded-2xl border border-emerald-900/15 bg-emerald-950/[0.04] p-5">

                <h3 className="font-semibold text-emerald-950">
                  Final step: save the blog
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Save it as a draft while working, or publish it when it is ready for the website.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">

                <button
                  type="submit"
                  data-status="draft"
                  disabled={
                    saving ||
                    uploading
                  }
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />

                  {savingAction ===
                  "draft"
                    ? "Saving..."
                    : "Save Draft"}
                </button>

                <button
                  type="submit"
                  data-status="published"
                  disabled={
                    saving ||
                    uploading
                  }
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />

                  {savingAction ===
                  "published"
                    ? "Publishing..."
                    : editing
                      ? "Update & Publish"
                      : "Publish"}
                </button>

                {editing &&
                  form.status ===
                    "published" && (
                    <Link
                      href={`/blog/${form.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-100 px-5 py-3 font-semibold text-amber-900"
                    >
                      View Article ↗
                    </Link>
                  )}
              </div>

              {editing && (
                <div className="mt-8 border-t border-slate-200 pt-6">

                  <button
                    type="button"
                    onClick={
                      deleteBlog
                    }
                    disabled={
                      deleting
                    }
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-white px-5 py-3 font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />

                    {deleting
                      ? "Deleting..."
                      : "Delete This Blog"}
                  </button>
                </div>
              )}
            </EditorCard>
          </form>
        </div>
      </div>
    </main>
  );
}

// ========================================
// EDITOR CARD
// ========================================

function EditorCard({
  number,
  title,
  description,
  children,
}: {
  number:
    string;

  title:
    string;

  description:
    string;

  children:
    React.ReactNode;
}) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm md:p-7">

      <div className="mb-7 flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
          {
            number
          }
        </div>

        <div>

          <h2 className="text-2xl font-bold tracking-tight">
            {
              title
            }
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {
              description
            }
          </p>
        </div>
      </div>

      {
        children
      }
    </section>
  );
}