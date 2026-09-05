import { expect, test } from '@playwright/test';
import {
  STATIC_ROUTES,
  VISUAL_WIDTHS,
  assertHeaderLayout,
} from './helpers';

test.describe('visual shells', () => {
  for (const width of VISUAL_WIDTHS) {
    test(`records ${width}px route shells`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });

      for (const route of STATIC_ROUTES) {
        const response = await page.goto(route, {
          waitUntil: 'domcontentloaded',
        });
        expect(response?.ok() || response?.status() === 304).toBe(
          true,
        );
        await assertHeaderLayout(page, width);
        const name = route === '/' ? 'home' : route.slice(1);
        await page.screenshot({
          path: `e2e/screenshots/${name}-${width}.png`,
          fullPage: false,
        });
      }
    });
  }
});
