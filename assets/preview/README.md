# assets/preview

PNGs de preview de cada página (`home.png`, `transformer.png`, `http.png`,
`tcp.png`, `git.png`, `hashmap.png`), usados pelas meta tags **Open Graph** e
(opcionalmente) embutidos no README.

Não edite à mão: são gerados pelo Playwright. Rode o workflow **Screenshots**
(`.github/workflows/screenshots.yml`, botão *Run workflow*) — ele gera e commita os
PNGs aqui automaticamente. Localmente:

```bash
npx playwright install chromium
npm run screenshots
```
