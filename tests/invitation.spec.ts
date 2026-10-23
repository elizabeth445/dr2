import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

async function enter(page: import('@playwright/test').Page) {
  await page.goto('/');
  const skip = page.getByRole('button', { name: 'Пропустити' });
  if (await skip.isVisible()) await skip.click();
  await expect(page.getByRole('dialog', { name: 'Особисте запрошення' })).not.toBeVisible();
  await page.evaluate(() => document.fonts.ready);
}

test('responsive composition at every required width', async ({ page }, info) => {
  test.skip(info.project.name !== 'desktop', 'Полная матрица выполняется один раз');
  await enter(page);
  for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 70));
      }
    });
    await page.waitForTimeout(900);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    expect(
      await page
        .locator('.dress-palette, .color-name, .button, .attendance label, .field-label')
        .evaluateAll((els) =>
          els.filter((el) => el.scrollWidth > el.clientWidth + 2).map((el) => el.textContent),
        ),
    ).toEqual([]);
    const alignment = await page.locator('.dress-content').evaluate((el) => {
      const content = el.getBoundingClientRect();
      const section = el.closest('.dress-code')!.getBoundingClientRect();
      const heading = el.querySelector('h3')!.getBoundingClientRect();
      const firstCard = el.querySelector('.color-card')!.getBoundingClientRect();
      const cards = [...el.querySelectorAll('.color-card')].map((card) =>
        card.getBoundingClientRect(),
      );
      return {
        contentCenter: Math.abs(content.x + content.width / 2 - section.x - section.width / 2),
        headingCenter: Math.abs(heading.x + heading.width / 2 - content.x - content.width / 2),
        firstRow: cards.filter((card) => Math.abs(card.top - firstCard.top) < 2).length,
      };
    });
    expect(alignment.contentCenter).toBeLessThan(2);
    expect(alignment.headingCenter).toBeLessThan(2);
    expect(alignment.firstRow).toBe(width <= 700 ? 3 : 5);
    if (width >= 768) {
      const tops = await page
        .locator('.details-grid > .detail-row:not(.dress-code) h3')
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().top));
      expect(Math.max(...tops) - Math.min(...tops)).toBeLessThan(2);
    }
    expect(
      await page
        .locator('h1,h2,h3,.hero-line,.ticket-title')
        .evaluateAll((els) =>
          els.filter((e) => e.scrollWidth > e.clientWidth + 2).map((e) => e.textContent),
        ),
    ).toEqual([]);
    expect(
      await page
        .locator('img')
        .evaluateAll((els) =>
          els.every((e) => e instanceof HTMLImageElement && e.complete && e.naturalWidth > 0),
        ),
    ).toBe(true);
    await page.screenshot({ path: `output/verified-${width}.png`, fullPage: true });
    await page.locator('.ticket-stub').click();
    await page.waitForTimeout(600);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.locator('.ticket-section').screenshot({ path: `output/ticket-open-${width}.png` });
    await page.locator('.ticket-stub').click();
    await page.waitForTimeout(600);
  }
});

test('opening can be skipped, replayed and closed with Escape', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Повторити початок' }).click();
  const dialog = page.getByRole('dialog', { name: 'Особисте запрошення' });
  await expect(dialog).toBeVisible();
  await expect(dialog).toBeFocused();
  const skip = page.getByRole('button', { name: 'Пропустити' });
  expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('none');
  await page.keyboard.press('Tab');
  await expect(skip).toBeFocused();
  expect(await skip.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe('solid');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog', { name: 'Особисте запрошення' })).not.toBeVisible();
  await expect(page.locator('#hero-title')).toBeFocused();
});

test('envelope waits for a click and respects reduced motion', async ({ page }, info) => {
  await page.goto('/');
  const envelope = page.getByRole('dialog', { name: 'Особисте запрошення' });
  await expect(envelope).toBeVisible();
  await page.waitForTimeout(3500);
  await expect(envelope).toBeVisible();
  if (info.project.name === 'reduced-motion') {
    const audit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(
      audit.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => ({
          target: node.target,
          summary: node.failureSummary,
        })),
      })),
    ).toEqual([]);
  }
  await page.getByRole('button', { name: 'Відкрити запрошення' }).click();
  await expect(envelope).not.toBeVisible({ timeout: 6000 });
  await expect(page.locator('#hero-title')).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('wax seal opens the envelope and motion preference can change mid-opening', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Відкрити конверт' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 4000 });
  await page.getByRole('button', { name: 'Повторити початок' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('dialog', { name: 'Особисте запрошення' })).toBeVisible();
  await page.getByRole('button', { name: 'Відкрити конверт' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#hero-title')).toBeFocused();
});

test('dress colors update the lighting and accessible outfit advice', async ({ page }) => {
  await enter(page);
  const palette = page.getByRole('group', { name: 'Кольори дрес-коду' });
  await expect(palette.getByRole('button')).toHaveCount(5);
  await palette.getByRole('button', { name: 'Вишневий', exact: true }).click();
  await expect(palette.getByRole('button', { name: 'Вишневий', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.locator('.dress-response')).toContainText('подружиться з тортом');
  expect(
    await page
      .locator('.dress-code')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--look-color').trim()),
  ).toBe('#61182d');
  await palette.getByRole('button', { name: 'Сріблястий', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(palette.locator('[aria-pressed="true"]')).toHaveCount(1);
  await expect(page.locator('.dress-response')).toContainText('Лови світло диско-кулі');
  expect(
    await page
      .locator('.dress-code')
      .evaluate((el) => getComputedStyle(el).getPropertyValue('--look-color').trim()),
  ).toBe('#c9c8c2');
});

test('gallery opens, navigates, closes and restores focus', async ({ page }) => {
  await enter(page);
  const trigger = page.getByRole('button', { name: 'Одне бажання' });
  await trigger.click();
  await expect(page.getByRole('dialog', { name: 'Одне бажання' })).toBeVisible();
  await page.getByRole('button', { name: 'Наступне фото' }).click();
  await expect(page.getByRole('dialog', { name: 'За нас', exact: true })).toBeVisible();
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => v.id)).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('personal ticket reveals its secret and resets', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'ВІДІРВИ МЕНЕ' }).click();
  await expect(page.locator('#ticket-secret')).toBeVisible();
  await expect(page.locator('#ticket-secret svg.ticket-secret-star')).toBeVisible();
  await expect(page.getByRole('button', { name: 'ПОВТОРИТИ', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await page.getByRole('button', { name: 'ПОВТОРИТИ', exact: true }).click();
  await expect(page.locator('#ticket-secret')).not.toBeVisible();
});

test('RSVP validates, saves, reloads and edits attendance', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  expect(
    await page.locator('#guest-name').evaluate((el: HTMLInputElement) => el.validity.valueMissing),
  ).toBe(true);
  await page.getByLabel('Твоє ім’я').fill('   ');
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.getByRole('alert')).toContainText('Напиши');
  await page.getByLabel('Твоє ім’я').fill('Марія');
  await page.getByLabel('Пару слів Софії').fill('До зустрічі!');
  const fieldGap = await page.locator('#guest-message').evaluate((el) => {
    const field = el.getBoundingClientRect();
    const label = document.querySelector('label[for="guest-message"]')!.getBoundingClientRect();
    const style = getComputedStyle(el);
    const ring = parseFloat(style.outlineOffset) + parseFloat(style.outlineWidth);
    return field.top - ring - label.bottom;
  });
  expect(fieldGap).toBeGreaterThanOrEqual(6);
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.getByRole('heading', { name: 'До зустрічі, Марія!' })).toBeVisible();
  await expect(page.locator('#rsvp').getByRole('status')).toContainText('Софія ще не отримала');
  await enter(page);
  await expect(page.getByRole('heading', { name: 'До зустрічі, Марія!' })).toBeVisible();
  await page.getByRole('button', { name: 'Змінити відповідь' }).click();
  await expect(page.getByLabel('Пару слів Софії')).toHaveValue('До зустрічі!');
  await page.getByRole('radio', { name: 'Цього разу без мене' }).check();
  await page.getByRole('button', { name: 'Зберегти мою відповідь' }).click();
  await expect(page.getByRole('heading', { name: 'Обіймаю, Марія.' })).toBeVisible();
});

test('calendar is a real ICS with correct Kyiv time and no fake venue', async ({ page }) => {
  await enter(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Додати в календар' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe('sofia-2026-11-14.ics');
  const file = await download.path();
  const raw = await readFile(file!, 'utf8');
  expect(raw.split('\r\n').every((line) => Buffer.byteLength(line, 'utf8') <= 75)).toBe(true);
  const text = raw.replace(/\r\n /g, '');
  expect(text).toContain('DTSTART:20261114T170000Z');
  expect(text).toContain('DTEND:20261114T220000Z');
  expect(text).toContain('SUMMARY:День народження Софії');
  expect(text).toContain('Локацію повідомимо окремо');
  await expect(page.getByRole('link', { name: 'Прокласти маршрут' })).toHaveCount(0);
});

test('accessibility audit and keyboard navigation', async ({ page }) => {
  await enter(page);
  await page.locator('#rsvp').scrollIntoViewIfNeeded();
  const audit = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  expect(audit.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual(
    [],
  );
  await page.getByRole('radio', { name: 'Так, я буду' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Цього разу без мене' })).toBeChecked();
});

test('gallery swipes on touch and motion respects preference', async ({ page }, info) => {
  await enter(page);
  await expect(page.locator('svg.rsvp-flower')).toBeVisible();
  expect(await page.locator('body').innerText()).not.toMatch(/[✳✴⭐✨]/);
  const reduced = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  expect(reduced).toBe(info.project.name === 'reduced-motion');
  if (reduced) {
    expect(await page.locator('.hero-photo').evaluate((el) => getComputedStyle(el).transform)).toBe(
      'none',
    );
    expect(
      await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior),
    ).toBe('auto');
  }
  if (info.project.name === 'mobile') {
    await page.locator('.photo-strip').scrollIntoViewIfNeeded();
    const strip = await page.locator('.photo-strip').boundingBox();
    const touch = await page.context().newCDPSession(page);
    await touch.send('Input.synthesizeScrollGesture', {
      x: strip!.x + strip!.width * 0.8,
      y: strip!.y + strip!.height * 0.4,
      xDistance: -250,
      yDistance: 0,
      speed: 700,
      gestureSourceType: 'touch',
    });
    await touch.detach();
    await expect
      .poll(() => page.locator('.photo-strip').evaluate((el) => el.scrollLeft))
      .toBeGreaterThan(50);
    const box = await page.getByRole('button', { name: 'За нас' }).boundingBox();
    expect(box).toBeTruthy();
    await page.getByRole('button', { name: 'За нас' }).tap();
    await expect(page.getByRole('dialog', { name: 'За нас', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Закрити фото' }).tap();
  }
});
