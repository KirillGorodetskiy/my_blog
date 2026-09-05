export const DECORATIVE_MARKERS = [
  '✅',
  '💡',
  '⚠️',
  '⚠',
  '🚀',
  '⚙️',
  '⚙',
  '🔧',
  '🔒',
  '🔍',
  '🤖',
  '🌐',
  '📌',
  '📚',
  '🛠️',
  '🛠',
  '🧠',
  '💰',
  '🪙',
] as const;

export type DecorativeMarker =
  (typeof DECORATIVE_MARKERS)[number];

export const DECORATIVE_ICON_KEYS: Record<
  DecorativeMarker,
  string
> = {
  '✅': 'check',
  '💡': 'idea',
  '⚠️': 'warning',
  '⚠': 'warning',
  '🚀': 'launch',
  '⚙️': 'settings',
  '⚙': 'settings',
  '🔧': 'wrench',
  '🔒': 'lock',
  '🔍': 'search',
  '🤖': 'bot',
  '🌐': 'globe',
  '📌': 'pin',
  '📚': 'book',
  '🛠️': 'tools',
  '🛠': 'tools',
  '🧠': 'education',
  '💰': 'money',
  '🪙': 'coin',
};

const MARKERS = [...DECORATIVE_MARKERS].sort(
  (left, right) => right.length - left.length,
);

export function splitLeadingDecorative(text: string): {
  marker: DecorativeMarker | null;
  rest: string;
} {
  for (const marker of MARKERS) {
    if (!text.startsWith(marker)) {
      continue;
    }

    const after = text.slice(marker.length);

    if (
      after === '' ||
      /^\s/.test(after) ||
      /^[*_~`]/.test(after)
    ) {
      return {
        marker,
        rest: after.replace(/^\s+/, ''),
      };
    }
  }

  return { marker: null, rest: text };
}

export function stripLeadingDecorative(text: string): string {
  return splitLeadingDecorative(text.trimStart()).rest;
}
