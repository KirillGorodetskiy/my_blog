import { describe, expect, it } from 'vitest';
import {
  extractHeadings,
  parseMarkdown,
} from '@/lib/markdown';

const SAMPLE = [
  '## Setup',
  '',
  'A quiet first paragraph with `inline` and a',
  '[link](https://example.com).',
  '',
  '### Notes',
  '',
  '- one',
  '- two',
  '',
  '1. alpha',
  '2. beta',
  '',
  '> stay calm',
  '',
  '```ts',
  'const room = 0;',
  '```',
  '',
  '![Desk](/images/articles/personal-rag-vps.webp)',
].join('\n');

describe('parseMarkdown', () => {
  it('reads headings, copy, lists, quotes, code, and images', () => {
    const blocks = parseMarkdown(SAMPLE);

    expect(blocks.map((block) => block.type)).toEqual([
      'heading',
      'paragraph',
      'heading',
      'list',
      'list',
      'quote',
      'code',
      'image',
    ]);
  });

  it('assigns stable heading ids', () => {
    const blocks = parseMarkdown(SAMPLE);
    const headings = blocks.filter(
      (block) => block.type === 'heading',
    );

    expect(headings[0]).toMatchObject({
      level: 2,
      id: 'setup',
      text: 'Setup',
    });
    expect(headings[1]).toMatchObject({
      level: 3,
      id: 'notes',
    });
  });

  it('keeps list kinds distinct', () => {
    const blocks = parseMarkdown(SAMPLE);
    const lists = blocks.filter(
      (block) => block.type === 'list',
    );

    expect(lists[0]).toMatchObject({ ordered: false });
    expect(lists[1]).toMatchObject({ ordered: true });
  });

  it('stores fenced code with a language', () => {
    const code = parseMarkdown(SAMPLE).find(
      (block) => block.type === 'code',
    );

    expect(code).toMatchObject({
      language: 'ts',
      value: 'const room = 0;',
    });
  });

  it('rejects unsafe image and link targets', () => {
    const blocks = parseMarkdown(
      [
        '[bad](javascript:alert(1))',
        '',
        '![x](javascript:alert(1))',
      ].join('\n'),
    );

    const paragraph = blocks[0];
    const image = blocks[1];

    expect(paragraph?.type).toBe('paragraph');
    if (paragraph?.type === 'paragraph') {
      expect(paragraph.children.some(
        (node) => node.type === 'link',
      )).toBe(false);
    }
    expect(image?.type).toBe('paragraph');
  });
});

describe('extractHeadings', () => {
  it('returns h2 and h3 entries for a table of contents', () => {
    const headings = extractHeadings(parseMarkdown(SAMPLE));

    expect(headings).toEqual([
      { id: 'setup', text: 'Setup', level: 2 },
      { id: 'notes', text: 'Notes', level: 3 },
    ]);
  });
});
