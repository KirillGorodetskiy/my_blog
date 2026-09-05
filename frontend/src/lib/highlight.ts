const KEYWORDS: Record<string, string[]> = {
  ts: [
    'const',
    'let',
    'var',
    'function',
    'return',
    'await',
    'async',
    'import',
    'from',
    'export',
    'if',
    'else',
    'for',
    'of',
    'in',
    'new',
    'class',
    'type',
    'interface',
  ],
  js: [
    'const',
    'let',
    'var',
    'function',
    'return',
    'await',
    'async',
    'import',
    'from',
    'export',
    'if',
    'else',
    'for',
    'of',
    'in',
    'new',
    'class',
  ],
  py: [
    'def',
    'return',
    'import',
    'from',
    'if',
    'else',
    'elif',
    'for',
    'in',
    'class',
    'async',
    'await',
    'with',
    'as',
    'None',
    'True',
    'False',
  ],
  bash: [
    'npm',
    'npx',
    'cd',
    'export',
    'echo',
    'sudo',
    'apt',
    'docker',
    'curl',
  ],
};

const ALIASES: Record<string, string> = {
  typescript: 'ts',
  javascript: 'js',
  python: 'py',
  sh: 'bash',
  shell: 'bash',
  json: 'js',
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function languageKey(language: string): string {
  const lower = language.toLowerCase();

  return ALIASES[lower] ?? lower;
}

export function highlightCode(
  code: string,
  language: string,
): string {
  const key = languageKey(language);
  const words = KEYWORDS[key];

  if (!words) {
    return escapeHtml(code);
  }

  const keyword = words.join('|');
  const pattern = new RegExp(
    '(\\/\\/.*$|#.*$|`(?:\\\\.|[^`])*`|' +
      '"(?:\\\\.|[^"])*"|\'(?:\\\\.|[^\'])*\'|' +
      `\\b(?:${keyword})\\b|\\b\\d+(?:\\.\\d+)?\\b)`,
    'gm',
  );

  let result = '';
  let last = 0;
  let match = pattern.exec(code);

  while (match) {
    result += escapeHtml(code.slice(last, match.index));
    const token = match[0];
    let kind = 'tok-num';

    if (
      token.startsWith('//') ||
      (key !== 'bash' && token.startsWith('#'))
    ) {
      kind = 'tok-cm';
    } else if (
      token.startsWith('"') ||
      token.startsWith("'") ||
      token.startsWith('`')
    ) {
      kind = 'tok-str';
    } else if (words.includes(token)) {
      kind = 'tok-kw';
    }

    result += `<span class="${kind}">${escapeHtml(token)}</span>`;
    last = match.index + token.length;
    match = pattern.exec(code);
  }

  return result + escapeHtml(code.slice(last));
}
