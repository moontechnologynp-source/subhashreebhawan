import React from "react";

// ========================================
// SAFE LINK CHECK
// ========================================

function isSafeHref(href: string) {
  const value = href.trim();

  return (
    value.startsWith("/") ||
    value.startsWith("#") ||
    /^https?:\/\//i.test(value) ||
    /^mailto:/i.test(value) ||
    /^tel:/i.test(value)
  );
}

// ========================================
// INLINE CONTENT
// ========================================
//
// Supported:
//
// [Gallery](/gallery)
//
// [Request Viewing](/inquiry)
//
// [External Website](https://example.com)
//
// [Email](mailto:test@example.com)
//
// ========================================

function renderInline(
  text: string,
): React.ReactNode[] {
  const nodes: React.ReactNode[] =
    [];

  const linkRegex =
    /\[([^\]]+)\]\(([^)]+)\)/g;

  let lastIndex = 0;

  let match:
    RegExpExecArray | null;

  while (
    (match =
      linkRegex.exec(text)) !==
    null
  ) {
    if (
      match.index >
      lastIndex
    ) {
      nodes.push(
        text.slice(
          lastIndex,
          match.index,
        ),
      );
    }

    const label =
      match[1];

    const href =
      match[2].trim();

    if (
      !isSafeHref(href)
    ) {
      nodes.push(
        match[0],
      );
    } else {
      const external =
        /^https?:\/\//i.test(
          href,
        );

      nodes.push(
        <a
          key={`${href}-${match.index}`}
          href={href}
          target={
            external
              ? "_blank"
              : undefined
          }
          rel={
            external
              ? "noopener noreferrer"
              : undefined
          }
          className="font-semibold text-amber-800 underline decoration-amber-500/40 underline-offset-4 transition hover:text-amber-950 hover:decoration-amber-700"
        >
          {label}
        </a>,
      );
    }

    lastIndex =
      linkRegex.lastIndex;
  }

  if (
    lastIndex <
    text.length
  ) {
    nodes.push(
      text.slice(
        lastIndex,
      ),
    );
  }

  return nodes;
}

// ========================================
// BLOG CONTENT
// ========================================

export default function BlogContent({
  content,
}: {
  content: string;
}) {
  const blocks =
    content
      .split(/\n\s*\n/)
      .filter(
        (block) =>
          block.trim(),
      );

  return (
    <div className="space-y-6 text-lg leading-8 text-slate-700">
      {blocks.map(
        (
          block,
          index,
        ) => {
          // ==================================
          // HEADING
          // ==================================

          if (
            block.startsWith(
              "## ",
            )
          ) {
            return (
              <h2
                key={index}
                className="pt-6 text-3xl font-bold tracking-tight text-slate-950"
              >
                {renderInline(
                  block.slice(
                    3,
                  ),
                )}
              </h2>
            );
          }

          // ==================================
          // BULLETS
          // ==================================

          const lines =
            block.split("\n");

          const isBulletList =
            lines.every(
              (line) =>
                line.startsWith(
                  "- ",
                ),
            );

          if (
            isBulletList
          ) {
            return (
              <ul
                key={index}
                className="list-disc space-y-2 pl-6"
              >
                {lines.map(
                  (
                    line,
                    lineIndex,
                  ) => (
                    <li
                      key={
                        lineIndex
                      }
                    >
                      {renderInline(
                        line.slice(
                          2,
                        ),
                      )}
                    </li>
                  ),
                )}
              </ul>
            );
          }

          // ==================================
          // NORMAL PARAGRAPH
          // ==================================

          return (
            <p
              key={index}
              className="whitespace-pre-wrap"
            >
              {renderInline(
                block,
              )}
            </p>
          );
        },
      )}
    </div>
  );
}