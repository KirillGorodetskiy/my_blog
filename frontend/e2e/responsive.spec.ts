import { expect, test } from '@playwright/test';
import {
  EDGE_CUE_MIN,
  STATIC_ROUTES,
  VIEWPORTS,
  assertHeaderLayout,
  assertNoHorizontalOverflow,
  firstDetailHref,
} from './helpers';

for (const viewport of VIEWPORTS) {
  test.describe(`${viewport.width}x${viewport.height}`, () => {
    test.use({ viewport });

    for (const route of STATIC_ROUTES) {
      test(`${route} stays inside the viewport`, async ({
        page,
      }) => {
        const response = await page.goto(route, {
          waitUntil: 'domcontentloaded',
        });

        expect(response, 'route responded').not.toBeNull();
        expect(response?.ok() || response?.status() === 304).toBe(
          true,
        );

        await assertNoHorizontalOverflow(page);
        await assertHeaderLayout(page, viewport.width);

        const heading = page.locator('h1').first();
        if (await heading.count()) {
          const box = await heading.boundingBox();
          expect(box, 'heading is on screen').not.toBeNull();
          if (box) {
            expect(box.x).toBeGreaterThanOrEqual(0);
            expect(box.x + box.width).toBeLessThanOrEqual(
              viewport.width + 1,
            );
          }
        }

        const cards = page.locator(
          'article, .project-card, .article-card',
        );
        const cardCount = Math.min(await cards.count(), 4);
        for (let index = 0; index < cardCount; index += 1) {
          const box = await cards.nth(index).boundingBox();
          if (!box) {
            continue;
          }

          expect(box.x).toBeGreaterThanOrEqual(-1);
          expect(box.x + box.width).toBeLessThanOrEqual(
            viewport.width + 1,
          );
        }

        const cues = page.locator('.edge-cue');
        const cueCount = await cues.count();
        if (viewport.width < EDGE_CUE_MIN && cueCount > 0) {
          for (let index = 0; index < cueCount; index += 1) {
            await expect(cues.nth(index)).toBeHidden();
          }
        }
      });
    }

    test('article and project detail stay inside the viewport', async ({
      page,
    }) => {
      await page.goto('/articles', {
        waitUntil: 'domcontentloaded',
      });
      const articleHref = await firstDetailHref(page, '/articles');

      await page.goto('/projects', {
        waitUntil: 'domcontentloaded',
      });
      const projectHref = await firstDetailHref(page, '/projects');

      test.skip(
        !articleHref && !projectHref,
        'no published article or project is available',
      );

      for (const href of [articleHref, projectHref]) {
        if (!href) {
          continue;
        }

        await page.goto(href, { waitUntil: 'domcontentloaded' });
        await assertNoHorizontalOverflow(page);
        await assertHeaderLayout(page, viewport.width);

        const toc = page.locator('.toc-desktop');
        const article = page.locator('.article-main').first();
        if (
          viewport.width < 1280 ||
          !(await toc.count()) ||
          !(await article.count())
        ) {
          continue;
        }

        if (!(await toc.isVisible())) {
          continue;
        }

        const tocBox = await toc.boundingBox();
        const articleBox = await article.boundingBox();
        if (!tocBox || !articleBox) {
          continue;
        }

        expect(tocBox.x + tocBox.width).toBeLessThanOrEqual(
          articleBox.x + 1,
        );
      }
    });
  });
}
