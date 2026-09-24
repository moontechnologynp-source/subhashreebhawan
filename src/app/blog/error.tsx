'use client';
export default function BlogError({ reset }: { reset: () => void }) {
  return <main className="min-h-screen bg-[#FAF6EA] p-12 text-center"><h1 className="text-3xl font-bold">Articles are temporarily unavailable</h1><p className="my-6">Please try again in a moment.</p><button className="rounded-xl bg-slate-900 px-5 py-3 text-white" onClick={reset}>Try again</button><a className="ml-6" href="/">Back home</a></main>;
}
