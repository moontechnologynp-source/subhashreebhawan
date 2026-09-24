import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { blogDate, getBlog } from '@/lib/blogs';
import BlogContent from '@/components/BlogContent';
const loadBlog = cache(getBlog);
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await loadBlog((await params).slug);
  if (!blog) return { title: 'Article not found' };
  return { title: blog.title, description: blog.excerpt, openGraph: { title: blog.title, description: blog.excerpt, type: 'article', ...(blog.publishedAt ? { publishedTime: blog.publishedAt } : {}), images: blog.image ? [blog.image] : [] } };
}
export default async function ArticlePage({ params }: Props) {
  const blog = await loadBlog((await params).slug);
  if (!blog) notFound();
  return <main className="min-h-screen bg-[#FAF6EA] px-5 py-10 text-slate-900">
    <header className="mx-auto flex max-w-5xl justify-between border-b border-black/10 pb-6"><Link href="/" className="font-bold">Subha Shree Bhawan</Link><Link href="/blog">← All articles</Link></header>
    <article className="mx-auto max-w-3xl py-12">
      <p className="font-semibold text-amber-800">{blog.category}</p>
      <h1 className="mt-4 text-4xl font-extrabold leading-tight md:text-6xl">{blog.title}</h1>
      <p className="mt-6 text-xl text-slate-600">{blog.excerpt}</p>
      <p className="my-6 text-sm text-slate-500">{blogDate(blog.publishedAt)} · {Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))} min read</p>
      {blog.image && <img src={blog.image} alt={blog.title} className="mb-12 max-h-[650px] w-full rounded-3xl object-cover" />}
      <BlogContent content={blog.content} />
      <Link href="/blog" className="mt-12 inline-block font-bold">← Back to all articles</Link>
    </article>
  </main>;
}
