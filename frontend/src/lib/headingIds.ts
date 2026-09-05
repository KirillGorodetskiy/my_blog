import GithubSlugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { stripLeadingDecorative } from '@/lib/decorativeIcons';

const HEADING_TAGS = new Set([
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
]);

function textContent(node: {
  type?: string;
  value?: string;
  children?: unknown[];
}): string {
  if (node.type === 'text' && typeof node.value === 'string') {
    return node.value;
  }

  if (!Array.isArray(node.children)) {
    return '';
  }

  return node.children
    .map((child) =>
      textContent(child as { type?: string; value?: string }),
    )
    .join('');
}

export function headingId(text: string, slugger: GithubSlugger) {
  return slugger.slug(stripLeadingDecorative(text));
}

export function rehypeHeadingIds() {
  return (tree: { type: string }) => {
    const slugger = new GithubSlugger();

    visit(tree, 'element', (node: {
      tagName?: string;
      properties?: Record<string, unknown>;
      children?: unknown[];
    }) => {
      if (!node.tagName || !HEADING_TAGS.has(node.tagName)) {
        return;
      }

      if (node.properties?.id) {
        return;
      }

      node.properties = node.properties ?? {};
      node.properties.id = headingId(
        textContent(node),
        slugger,
      );
    });
  };
}
