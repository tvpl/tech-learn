const has = () => typeof window !== "undefined";

export function getItem(key: string): string | null {
  if (!has()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string): void {
  if (!has()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* localStorage indisponível (modo privado etc.) — degrada silenciosamente */
  }
}

export const THEME_KEY = "tl-theme";
export const visitedKey = (slug: string) => `tl-visited:${slug}`;
export const lastSceneKey = (slug: string) => `tl-lastscene:${slug}`;
export const quizKey = (slug: string, sceneId: string) => `tl-quiz:${slug}:${sceneId}`;
