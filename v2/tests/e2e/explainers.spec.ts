import { test, expect } from "@playwright/test";
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

    test("cena de quiz (se houver) revela a resposta e explica", async ({ page }) => {
      // acha a cena do quiz clicando pelo índice lateral — não assume que é a
      // última (conteúdo migrado da v1 às vezes põe "Resumo" depois do quiz).
      await page.goto(`/e/${slug}/`);
      await expect(page.locator("text=Preparando…")).toHaveCount(0, { timeout: 15_000 });

      const sceneButtons = page.locator('nav[aria-label="Cenas"] button');
      const total = await sceneButtons.count();
      expect(total).toBeGreaterThan(0);

      let found = false;
      for (let i = 0; i < total; i++) {
        await sceneButtons.nth(i).click();
        if (await page.locator(".tl-quiz-opt").first().isVisible({ timeout: 800 }).catch(() => false)) {
          found = true;
          break;
        }
      }
      test.skip(!found, `"${slug}" não tem cena de quiz`);

      const options = page.locator(".tl-quiz-opt");
      await options.first().click();

      await expect(page.locator(".tl-quiz-explain")).toBeVisible();
      await expect(page.locator(".tl-quiz-correct")).toBeVisible();
    });
  });
}
