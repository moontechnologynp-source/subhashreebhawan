export const BLOG_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://subhashreebhawan-api.vercel.app/api';
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image: string;
  content: string;
  status: 'draft' | 'published';
  publishedAt: string | null;
}
export async function getBlogs(): Promise<Blog[]> {
  const response = await fetch(`${BLOG_API_URL}/blogs`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Unable to load articles. Please try again later.');
  return (await response.json()).blogs;
}
export async function getBlog(slug: string): Promise<Blog | null> {
  const response = await fetch(`${BLOG_API_URL}/blogs/slug/${encodeURIComponent(slug)}`, { cache: 'no-store' });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Unable to load this article. Please try again later.');
  return (await response.json()).blog;
}
export function blogDate(date: string | null) {
  return date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }) : '';
}
