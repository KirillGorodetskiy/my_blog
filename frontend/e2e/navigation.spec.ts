import { expect, test } from '@playwright/test';
import {
  firstDetailHref,
  measureShell,
} from './helpers';

test.describe('room navigation', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('home, articles, and projects keep one live page', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.locator('.scene-hero').waitFor();

    const home = await measureShell(page);
    expect(home.mainCount).toBe(1);
    expect(home.ghostHosts).toBe(0);
    expect(home.headerY).toBe(0);

    await page.getByRole('link', { name: 'Articles' }).first().click();
    await page.locator('.scene-hero-title', { hasText: 'Articles' })
      .waitFor();

    const articles = await measureShell(page);
    expect(articles.mainCount).toBe(1);
    expect(articles.ghostHosts).toBe(0);
    expect(articles.scrollY).toBe(0);
    expect(articles.headerY).toBe(0);
    expect(articles.scrollWidth).toBeLessThanOrEqual(
      articles.clientWidth,
    );
    expect(Math.abs(articles.heroWidth - home.heroWidth)).toBeLessThan(2);
    expect(
      Math.abs(articles.heroHeight - home.heroHeight),
    ).toBeLessThan(2);

    const articleHref = await firstDetailHref(page, '/articles');
    if (articleHref) {
      await page.goto(articleHref, {
        waitUntil: 'domcontentloaded',
      });
      const detail = await measureShell(page);
      expect(detail.mainCount).toBe(1);
      expect(detail.ghostHosts).toBe(0);
      expect(detail.scrollY).toBe(0);
      expect(detail.headerY).toBe(0);
      expect(detail.scrollWidth).toBeLessThanOrEqual(
        detail.clientWidth,
      );

      await page.getByRole('link', { name: 'Articles' }).first()
        .click();
      await page.locator('.scene-hero-title', { hasText: 'Articles' })
        .waitFor();
    }

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('link', { name: 'Projects' }).first().click();
    await page.locator('.scene-hero-title', { hasText: 'Projects' })
      .waitFor();

    const projects = await measureShell(page);
    expect(projects.mainCount).toBe(1);
    expect(projects.ghostHosts).toBe(0);
    expect(
      Math.abs(projects.heroHeight - articles.heroHeight),
    ).toBeLessThan(2);
    expect(
      Math.abs(projects.heroWidth - articles.heroWidth),
    ).toBeLessThan(2);

    const projectHref = await firstDetailHref(page, '/projects');
    if (projectHref) {
      await page.goto(projectHref, {
        waitUntil: 'domcontentloaded',
      });
      const detail = await measureShell(page);
      expect(detail.mainCount).toBe(1);
      expect(detail.scrollY).toBe(0);
      await page.getByRole('link', { name: 'Projects' }).first()
        .click();
      await page.locator('.scene-hero-title', { hasText: 'Projects' })
        .waitFor();
    }

    await page.getByRole('link', { name: 'Articles' }).first().click();
    await page.locator('.scene-hero-title', { hasText: 'Articles' })
      .waitFor();
    const back = await measureShell(page);
    expect(
      Math.abs(back.heroHeight - projects.heroHeight),
    ).toBeLessThan(2);
  });
});
