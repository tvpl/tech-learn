# CLAUDE.md

O contexto de engenharia deste projeto fica em **[`AGENTS.md`](AGENTS.md)** —
leia-o antes de editar. Ele cobre a arquitetura (motor genérico vs. arquivos de
dados), o modelo de visibilidade das cenas, os helpers de animação, como adicionar
um explicador, os comandos de teste e um checklist.

Resumo de bolso (detalhes no `AGENTS.md`):

- **Stack:** HTML/CSS/JS vanilla, sem build. Abre no navegador ou via `npm run serve`.
- **Regra de ouro:** um motor genérico (`engine/`) + um arquivo de dados por diagrama
  (`explainers/<tema>.data.js`). Para criar/alterar um diagrama, mexa **só** no
  arquivo de dados; **não** edite o motor para conteúdo específico.
- **Antes de commitar:** rode `npm test` (smoke test em jsdom; precisa estar verde).
- **PRs/deploy:** só quando o usuário pedir.

Documentação para humanos (uso e contrato de dados): **[`README.md`](README.md)**.
