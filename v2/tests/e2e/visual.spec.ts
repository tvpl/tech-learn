import { test, expect } from "@playwright/test";
import { SLUGS } from "../../src/content/index";

/**
 * Regressão visual: sistema é determinístico (mesmo `t` → mesmo estado, sem
 * autoplay nem CSS animation infinita — ver stage.css), então o threshold de
 * diff pode ser apertado sem risco de flakiness por timing.
 */
for (const slug of SLUGS) {
  test.describe(`visual: ${slug}`, () => {
    test("cena de introdução", async ({ page }) => {
      await page.goto(`/e/${slug}/`);
      await expect(page.locator("text=Preparando…")).toHaveCount(0, { timeout: 15_000 });

      await expect(page.locator(".tl-stage")).toHaveScreenshot(`${slug}-intro.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });

    test("última cena antes do quiz", async ({ page }) => {
      await page.goto(`/e/${slug}/`);
      await expect(page.locator("text=Preparando…")).toHaveCount(0, { timeout: 15_000 });

      const sceneButtons = page.locator('nav[aria-label="Cenas"] button');
      const total = await sceneButtons.count();
      expect(total).toBeGreaterThan(0);

      // acha a cena do quiz clicando pelo índice lateral (mesma técnica do
      // explainers.spec.ts) — não assume que é a última, já que conteúdo
      // migrado às vezes põe "Resumo" depois do quiz.
      let target = total - 1;
      for (let i = 0; i < total; i++) {
        await sceneButtons.nth(i).click();
        if (await page.locator(".tl-quiz-opt").first().isVisible({ timeout: 800 }).catch(() => false)) {
          target = Math.max(0, i - 1);
          break;
        }
      }
      await sceneButtons.nth(target).click();

      await expect(page.locator(".tl-stage")).toHaveScreenshot(`${slug}-final.png`, {
        maxDiffPixelRatio: 0.01,
      });
    });
  });
}
