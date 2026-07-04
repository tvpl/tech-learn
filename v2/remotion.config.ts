import { existsSync } from "node:fs";
import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
// O palco usa CSS puro (stage.css) — o bundler do Remotion já resolve.
// O alias "@/*" (usado em todo o código) só existe no tsconfig por padrão —
// o webpack do Remotion não lê tsconfig paths sozinho, então replicamos aqui.
Config.overrideWebpackConfig((cfg) => ({
  ...cfg,
  resolve: {
    ...cfg.resolve,
    // process.cwd(), não __dirname: o CLI do Remotion avalia este arquivo de
    // configuração num contexto onde __dirname aponta para dentro do próprio
    // pacote @remotion/cli, não para a raiz do projeto.
    alias: { ...cfg.resolve?.alias, "@": path.resolve(process.cwd(), "src") },
  },
}));

// Reaproveita o Chrome Headless Shell já baixado neste ambiente (evita um
// segundo download do mesmo binário que o Playwright já trouxe).
const PRE_INSTALLED_SHELL = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
if (existsSync(PRE_INSTALLED_SHELL)) {
  Config.setBrowserExecutable(PRE_INSTALLED_SHELL);
}
