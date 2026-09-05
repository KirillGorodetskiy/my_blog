export const SITE_NAME = 'Kirill';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gkablog.com';

export const SITE_DESCRIPTION =
  'Notes, projects and ideas from a curious mind.';

export const CONTACT_EMAIL = 'hello@gkablog.com';

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return new URL(normalized, `${SITE_URL}/`).toString();
}
