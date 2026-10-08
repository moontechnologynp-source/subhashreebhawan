import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  cache,
} from "react";

import {
  blogDate,
  blogReadingTime,
  getBlog,
} from "@/lib/blogs";

import BlogContent from "@/components/BlogContent";

// ========================================
// LOAD BLOG
// ========================================

const loadBlog =
  cache(
    getBlog,
  );

type Props = {
  params:
    Promise<{
      slug:
        string;
    }>;
};

// ========================================
// METADATA
// ========================================

export async function generateMetadata({
  params,
}: Props):
  Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const blog =
    await loadBlog(
      slug,
    );

  if (
    !blog
  ) {
    return {
      title:
        "Article not found",
    };
  }

  return {
    title:
      blog.title,

    description:
      blog.excerpt,

    openGraph: {
      title:
        blog.title,

      description:
        blog.excerpt,

      type:
        "article",

      ...(blog.publishedAt
        ? {
            publishedTime:
              blog.publishedAt,
          }
        : {}),

      images:
        blog.image
          ? [
              blog.image,
            ]
          : [],
    },
  };
}

// ========================================
// PAGE
// ========================================

export default async function ArticlePage({
  params,
}: Props) {
  const {
    slug,
  } =
    await params;

  const blog =
    await loadBlog(
      slug,
    );

  if (
    !blog
  ) {
    notFound();
  }

  const readingTime =
    blogReadingTime(
      blog,
    );

  return (
    <main className="min-h-screen bg-[#FAF6EA] px-5 py-10 text-slate-900">

      {/* HEADER */}

      <header className="mx-auto flex max-w-5xl items-center justify-between border-b border-black/10 pb-6">

        <Link
          href="/"
          className="font-bold"
        >
          Subha Shree Bhawan
        </Link>

        <Link
          href="/blog"
          className="font-semibold text-slate-600 transition hover:text-slate-950"
        >
          ← All articles
        </Link>
      </header>

      {/* ARTICLE */}

      <article className="mx-auto max-w-3xl py-12">

        <p className="font-semibold text-amber-800">
          {
            blog.category
          }
        </p>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">
          {
            blog.title
          }
        </h1>

        <p className="mt-6 text-xl leading-relaxed text-slate-600">
          {
            blog.excerpt
          }
        </p>

        {/* DATE + MANUAL READING TIME */}

        <div className="my-6 flex flex-wrap items-center gap-2 text-sm text-slate-500">

          {blog.publishedAt && (
            <>
              <span>
                {blogDate(
                  blog.publishedAt,
                )}
              </span>

              <span>
                •
              </span>
            </>
          )}

          <span>
            {readingTime}{" "}
            {readingTime ===
            1
              ? "min"
              : "mins"}{" "}
            read
          </span>
        </div>

        {/* COVER IMAGE */}

        {blog.image && (
          <img
            src={
              blog.image
            }
            alt={
              blog.title
            }
            className="mb-12 max-h-[650px] w-full rounded-3xl object-cover"
          />
        )}

        {/* ARTICLE BODY */}

        <BlogContent
          content={
            blog.content
          }
        />

        <Link
          href="/blog"
          className="mt-12 inline-block font-bold"
        >
          ← Back to all articles
        </Link>
      </article>
    </main>
  );
}