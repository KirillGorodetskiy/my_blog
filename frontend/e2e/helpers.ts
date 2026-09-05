import { expect, type Page } from '@playwright/test';

export const VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1160, height: 800 },
  { width: 1280, height: 800 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

export const STATIC_ROUTES = [
  '/',
  '/articles',
  '/projects',
  '/about',
  '/login',
  '/register',
] as const;

export const VISUAL_WIDTHS = [390, 768, 1024, 1160, 1280, 1440];

export const DESKTOP_HEADER_MIN = 1280;
export const EDGE_CUE_MIN = 1440;

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function boxesOverlap(a: Box, b: Box): boolean {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}

export async function assertNoHorizontalOverflow(page: Page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(
    metrics.scrollWidth,
    'document has horizontal overflow',
  ).toBeLessThanOrEqual(metrics.clientWidth);
}

export async function assertHeaderLayout(page: Page, width: number) {
  const brand = page.locator('header a.brand');
  const primary = page.getByRole('navigation', { name: 'Primary' });
  const search = page.getByRole('button', { name: 'Open search' });
  const menu = page.getByRole('button', { name: 'Open menu' });

  await expect(brand).toBeVisible();
  await expect(search).toBeVisible();

  if (width < DESKTOP_HEADER_MIN) {
    await expect(primary).toBeHidden();
    await expect(menu).toBeVisible();
  } else {
    await expect(primary).toBeVisible();
    await expect(menu).toBeHidden();
  }

  const visible = [brand, search];
  if (width < DESKTOP_HEADER_MIN) {
    visible.push(menu);
  } else {
    visible.push(primary);
  }

  const boxes: Box[] = [];
  for (const locator of visible) {
    const box = await locator.boundingBox();
    expect(box, 'header control has a box').not.toBeNull();
    if (box) {
      boxes.push(box);
    }
  }

  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      expect(
        boxesOverlap(boxes[i], boxes[j]),
        'header controls overlap',
      ).toBe(false);
    }
  }
}

export async function firstDetailHref(
  page: Page,
  prefix: '/articles' | '/projects',
): Promise<string | null> {
  const link = page.locator(`a[href^="${prefix}/"]`).first();
  if ((await link.count()) === 0) {
    return null;
  }

  return link.getAttribute('href');
}

export async function measureShell(page: Page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.scene-hero');
    const header = document.querySelector('header');
    const root = document.documentElement;

    return {
      heroWidth: hero?.getBoundingClientRect().width ?? 0,
      heroHeight: hero?.getBoundingClientRect().height ?? 0,
      headerY: header?.getBoundingClientRect().y ?? -1,
      scrollY: window.scrollY,
      scrollWidth: root.scrollWidth,
      clientWidth: root.clientWidth,
      mainCount: document.querySelectorAll('#main-content').length,
      ghostHosts: document.querySelectorAll(
        '#main-content ~ [aria-hidden="true"]',
      ).length,
    };
  });
}
