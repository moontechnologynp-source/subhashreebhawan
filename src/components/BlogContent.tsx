// Render text through React so article content cannot execute HTML or scripts.
export default function BlogContent({ content }: { content: string }) {
  return <div className="space-y-6 text-lg leading-8 text-slate-700">{content.split(/\n\s*\n/).map((block, index) => {
    if (block.startsWith('## ')) return <h2 key={index} className="pt-5 text-3xl font-bold text-slate-950">{block.slice(3)}</h2>;
    if (block.split('\n').every(line => line.startsWith('- '))) return <ul key={index} className="list-disc space-y-2 pl-6">{block.split('\n').map((line, i) => <li key={i}>{line.slice(2)}</li>)}</ul>;
    return <p key={index} className="whitespace-pre-wrap">{block}</p>;
  })}</div>;
}
