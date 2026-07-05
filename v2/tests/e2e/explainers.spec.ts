import { test, expect, type Page } from "@playwright/test";
import { SLUGS } from "../../src/content/index";

/**
 * Smoke e2e por explainer — espírito do `tools/smoke.mjs` da v1: percorre
 * todas as cenas ida e volta, responde o quiz, exige zero erro de console.
 */
for (const slug of SLUGS) {
  test.describe(slug, () => {
    test("percorre todas as cenas ida e volta sem erros de console", async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(String(e)));
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });

      await page.goto(`/e/${slug}/`);
      await expect(page.locator("text=Preparando…")).toHaveCount(0, { timeout: 15_000 });

      const sceneLabel = page.locator("text=/^Cena \\d+ de \\d+$/");
      const totalText = await sceneLabel.textContent();
      const total = Number(totalText?.match(/de (\d+)/)?.[1]);
      expect(total).toBeGreaterThan(0);

      const next = page.getByRole("button", { name: "Próxima →" });
      const prev = page.getByRole("button", { name: "← Anterior" });

      for (let i = 1; i < total; i++) {
        await next.click();
        await expect(sceneLabel).toContainText(`Cena ${i + 1} de ${total}`);
      }
      for (let i = total - 1; i > 0; i--) {
        await prev.click();
        await expect(sceneLabel).toContainText(`Cena ${i} de ${total}`);
      }

      expect(errors, `console/erros: ${errors.join("\n")}`).toEqual([]);
    });

    test("quiz final revela a resposta e explica", async ({ page }) => {
      await page.goto(`/e/${slug}/`);
      await expect(page.locator("text=Preparando…")).toHaveCount(0, { timeout: 15_000 });
      await goToLastScene(page);

      const options = page.locator(".tl-quiz-opt");
      await expect(options.first()).toBeVisible({ timeout: 5_000 });
      await options.first().click();

      await expect(page.locator(".tl-quiz-explain")).toBeVisible();
      await expect(page.locator(".tl-quiz-correct")).toBeVisible();
    });
  });
}

async function goToLastScene(page: Page) {
  const next = page.getByRole("button", { name: "Próxima →" });
  for (let i = 0; i < 20; i++) {
    const disabled = await next.isDisabled().catch(() => false);
    if (disabled) break;
    const before = await page.locator("text=/^Cena \\d+ de \\d+$/").textContent();
    await next.click();
    const after = await page.locator("text=/^Cena \\d+ de \\d+$/").textContent();
    if (before === after) break; // já estava na última cena
  }
}
