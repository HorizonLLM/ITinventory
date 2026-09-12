/*
 * markdown.ts — a small, safe article-subset renderer.
 *
 * The Knowledge register stores articles; this renders a deliberate subset of
 * Markdown (headings, paragraphs, lists, bold, code, links) to HTML. It is
 * intentionally small: the app ships with no data and articles are written by
 * the operator, so the subset is kept to what an IT inventory article needs.
 *
 * No raw HTML injection — only the tags above are emitted.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(s: string): string {
  // Inline code first so its contents are not further processed.
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

export function renderMarkdown(text: string): string {
  const blocks = text.split(/\n{2,}/);
  const html = blocks.map((block) => renderBlock(block)).join('\n');
  return html;
}

function renderBlock(block: string): string {
  const lines = block.split('\n');

  // Headings
  const heading = lines[0]?.match(/^(#{1,3})\s+(.+)$/);
  if (heading) {
    const level = heading[1].length;
    const Tag = `h${Math.min(level, 3)}` as keyof JSX.IntrinsicElements;
    return `<${Tag} class="article__heading">${inline(heading[2])}</${Tag}>`;
  }

  // Unordered list
  if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
    const items = lines.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('');
    return `<ul class="article__list">${items}</ul>`;
  }

  // Fallback: wrap as a paragraph.
  const paragraphs = block.split(/\n/).filter((l) => l.trim().length > 0);
  return paragraphs.map((p) => `<p>${inline(p.trim())}</p>`).join('\n');
}
