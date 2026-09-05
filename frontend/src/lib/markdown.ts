import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import type { Heading } from 'mdast';
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

const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/i;

export function isSafeHref(href: string): boolean {
  return SAFE_HREF.test(href);
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
