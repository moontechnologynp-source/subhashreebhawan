export const BLOG_API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://subhashreebhawan-api.vercel.app/api";

export interface Blog {
  _id: string;

  title: string;

  slug: string;

  excerpt: string;

  category: string;

  image: string;

  content: string;

  // Manual reading time.
  // null supports older blogs created
  // before this field existed.
  readingTime:
    | number
    | null;

  status:
    | "draft"
    | "published";

  publishedAt:
    | string
    | null;

  createdAt?: string;

  updatedAt?: string;
}

export async function getBlogs():
  Promise<Blog[]> {
  const response =
    await fetch(
      `${BLOG_API_URL}/blogs`,
      {
        cache:
          "no-store",
      },
    );

  if (
    !response.ok
  ) {
    throw new Error(
      "Unable to load articles. Please try again later.",
    );
  }

  const data =
    await response.json();

  return data.blogs;
}

export async function getBlog(
  slug:
    string,
):
  Promise<
    Blog |
    null
  > {
  const response =
    await fetch(
      `${BLOG_API_URL}/blogs/slug/${encodeURIComponent(
        slug,
      )}`,
      {
        cache:
          "no-store",
      },
    );

  if (
    response.status ===
    404
  ) {
    return null;
  }

  if (
    !response.ok
  ) {
    throw new Error(
      "Unable to load this article. Please try again later.",
    );
  }

  const data =
    await response.json();

  return data.blog;
}

export function blogDate(
  date:
    string |
    null,
) {
  return date
    ? new Date(
        date,
      ).toLocaleDateString(
        "en-US",
        {
          year:
            "numeric",

          month:
            "long",

          day:
            "numeric",

          timeZone:
            "UTC",
        },
      )
    : "";
}

// ========================================
// READING TIME
// ========================================
//
// New blogs use the manual readingTime.
//
// Older blogs without the field still
// work using the previous calculation.
// ========================================

export function blogReadingTime(
  blog:
    Blog,
) {
  if (
    blog.readingTime !==
      null &&
    blog.readingTime !==
      undefined &&
    Number.isFinite(
      Number(
        blog.readingTime,
      ),
    ) &&
    Number(
      blog.readingTime,
    ) >
      0
  ) {
    return Number(
      blog.readingTime,
    );
  }

  const words =
    blog.content
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
}