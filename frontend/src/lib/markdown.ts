export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'link'; href: string; children: InlineNode[] };

export type ContentBlock =
  | {
      type: 'heading';
      level: 2 | 3;
      id: string;
      text: string;
      children: InlineNode[];
    }
  | { type: 'paragraph'; children: InlineNode[] }
  | {
      type: 'list';
      ordered: boolean;
      items: InlineNode[][];
    }
  | { type: 'quote'; children: InlineNode[] }
  | { type: 'code'; language: string; value: string }
  | { type: 'image'; src: string; alt: string };

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const SAFE_HREF = /^(https?:\/\/|\/|#|mailto:)/i;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function isSafeHref(href: string): boolean {
  return SAFE_HREF.test(href);
}

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const pattern =
    /(`[^`]+`)|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match = pattern.exec(text);

  while (match) {
    if (match.index > last) {
      nodes.push({
        type: 'text',
        value: text.slice(last, match.index),
      });
    }

    if (match[1]) {
      nodes.push({
        type: 'code',
        value: match[1].slice(1, -1),
      });
    } else if (match[2] && match[3] && isSafeHref(match[3])) {
      nodes.push({
        type: 'link',
        href: match[3],
        children: [{ type: 'text', value: match[2] }],
      });
    } else if (match[2]) {
      nodes.push({ type: 'text', value: match[2] });
    }

    last = match.index + match[0].length;
    match = pattern.exec(text);
  }

  if (last < text.length) {
    nodes.push({ type: 'text', value: text.slice(last) });
  }

  return nodes;
}

function headingLevel(line: string): 2 | 3 | null {
  if (line.startsWith('### ')) {
    return 3;
  }

  if (line.startsWith('## ')) {
    return 2;
  }

  return null;
}

export function parseMarkdown(source: string): ContentBlock[] {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const blocks: ContentBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index] ?? '';

    if (line.trim() === '') {
      index += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const body: string[] = [];
      index += 1;

      while (
        index < lines.length &&
        !(lines[index] ?? '').startsWith('```')
      ) {
        body.push(lines[index] ?? '');
        index += 1;
      }

      blocks.push({
        type: 'code',
        language: language || 'text',
        value: body.join('\n'),
      });
      index += 1;
      continue;
    }

    const level = headingLevel(line);

    if (level) {
      const text = line.slice(level + 1).trim();
      blocks.push({
        type: 'heading',
        level,
        id: slugify(text),
        text,
        children: parseInline(text),
      });
      index += 1;
      continue;
    }

    if (line.startsWith('> ')) {
      blocks.push({
        type: 'quote',
        children: parseInline(line.slice(2)),
      });
      index += 1;
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

    if (image && image[2] && isSafeHref(image[2])) {
      blocks.push({
        type: 'image',
        alt: image[1] ?? '',
        src: image[2],
      });
      index += 1;
      continue;
    }

    if (line.startsWith('![')) {
      blocks.push({
        type: 'paragraph',
        children: parseInline(line),
      });
      index += 1;
      continue;
    }

    const unordered = /^[-*] /.test(line);
    const ordered = /^\d+\. /.test(line);

    if (unordered || ordered) {
      const items: InlineNode[][] = [];

      while (index < lines.length) {
        const current = lines[index] ?? '';
        const nextUnordered = /^[-*] /.test(current);
        const nextOrdered = /^\d+\. /.test(current);

        if (unordered && nextUnordered) {
          items.push(parseInline(current.slice(2)));
          index += 1;
          continue;
        }

        if (ordered && nextOrdered) {
          items.push(
            parseInline(current.replace(/^\d+\.\s/, '')),
          );
          index += 1;
          continue;
        }

        break;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraph: string[] = [];

    while (index < lines.length) {
      const current = lines[index] ?? '';

      if (
        current.trim() === '' ||
        current.startsWith('```') ||
        headingLevel(current) ||
        current.startsWith('> ') ||
        /^[-*] /.test(current) ||
        /^\d+\. /.test(current) ||
        /^!\[/.test(current)
      ) {
        break;
      }

      paragraph.push(current);
      index += 1;
    }

    if (paragraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        children: parseInline(paragraph.join(' ')),
      });
    } else {
      index += 1;
    }
  }

  return blocks;
}

export function extractHeadings(
  blocks: ContentBlock[],
): TocHeading[] {
  return blocks
    .filter((block) => block.type === 'heading')
    .map((block) => ({
      id: block.id,
      text: block.text,
      level: block.level,
    }));
}
