import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import type { Heading, Root } from 'mdast';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { stripLeadingDecorative } from '@/lib/decorativeIcons';
import { headingId } from '@/lib/headingIds';

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

// Markdown images should use uploaded /media/ files.
// Other http/https URLs render as a plain <img>.
// javascript:, data:, and vbscript: are rejected.
const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/i;

export function isSafeHref(href: string): boolean {
  return SAFE_HREF.test(href);
}

export function isSafeMarkdownImage(href: string): boolean {
  const value = href.trim();

  if (!value) {
    return false;
  }

  if (/^(javascript|data|vbscript):/i.test(value)) {
    return false;
  }

  if (value.startsWith('/media/')) {
    return true;
  }

  return isSafeHref(value);
}

export function projectCardSummary(source: string): string {
  return extractProjectOverview(source);
}

export function extractProjectOverview(source: string): string {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(source) as Root;
  let afterOverview = false;
  let fallback = '';

  for (const node of tree.children) {
    if (node.type === 'heading') {
      const label = toString(node).trim().toLowerCase();

      if (node.depth === 2 && label === 'overview') {
        afterOverview = true;
        continue;
      }

      if (afterOverview) {
        break;
      }
    }

    if (node.type !== 'paragraph') {
      continue;
    }

    const text = toString(node).replace(/\s+/g, ' ').trim();

    if (!text) {
      continue;
    }

    if (afterOverview) {
      return text;
    }

    if (!fallback) {
      fallback = text;
    }
  }

  return fallback;
}

export function extractHeadings(source: string): TocHeading[] {
  const tree = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .parse(source);
  const slugger = new GithubSlugger();
  const headings: TocHeading[] = [];

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth !== 2 && node.depth !== 3) {
      return;
    }

    const raw = toString(node);

    headings.push({
      id: headingId(raw, slugger),
      text: stripLeadingDecorative(raw),
      level: node.depth,
    });
  });

  return headings;
}
