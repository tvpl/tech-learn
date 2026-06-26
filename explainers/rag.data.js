/* ============================================================================
 * rag.data.js — Explicador: RAG (Retrieval-Augmented Generation)
 * Pipeline completo: chunking → embedding → busca vetorial → augment → LLM
 * ==========================================================================*/
(function () {
  const W = 1280, H = 720;

  // Pipeline vertical à esquerda (x≈160)
  const PX = 160, PW = 260, PH = 48;
  const py = (i) => 60 + i * 80;

  // Zona de detalhe à direita (x≈520+)
  const DX = 520;

  // Scores de similaridade para animação de busca vetorial
  const SIM_SCORES = [0.92, 0.78, 0.61, 0.45, 0.31, 0.18];
  const CHUNK_COLORS = ["var(--good)", "var(--accent)", "var(--warn)", "var(--muted)", "var(--muted)", "var(--muted)"];

  const elements = [
    /* ── PIPELINE (esquerda) ──────────────────────────── */
    { id: "pi_query",  type: "box", x: PX-PW/2, y: py(0), w: PW, h: PH, fill: "#22315d", label: "1 · Query do usuário" },
    { id: "a_q_e",    type: "arrow", x1: PX, y1: py(0)+PH, x2: PX, y2: py(1) },
    { id: "pi_embed",  type: "box", x: PX-PW/2, y: py(1), w: PW, h: PH, fill: "#1b2747", label: "2 · Embedding da query" },
    { id: "a_e_v",    type: "arrow", x1: PX, y1: py(1)+PH, x2: PX, y2: py(2) },
    { id: "pi_vdb",   type: "box", x: PX-PW/2, y: py(2), w: PW, h: PH, fill: "#1b2747", label: "3 · Vector DB (busca)" },
    { id: "a_v_r",    type: "arrow", x1: PX, y1: py(2)+PH, x2: PX, y2: py(3) },
    { id: "pi_ret",   type: "box", x: PX-PW/2, y: py(3), w: PW, h: PH, fill: "#1b2747", label: "4 · Chunks recuperados" },
    { id: "a_r_a",    type: "arrow", x1: PX, y1: py(3)+PH, x2: PX, y2: py(4) },
    { id: "pi_aug",   type: "box", x: PX-PW/2, y: py(4), w: PW, h: PH, fill: "#22315d", label: "5 · Prompt aumentado" },
    { id: "a_a_l",    type: "arrow", x1: PX, y1: py(4)+PH, x2: PX, y2: py(5) },
    { id: "pi_llm",   type: "box", x: PX-PW/2, y: py(5), w: PW, h: PH, fill: "#2a1d3d", stroke: "var(--accent)", label: "6 · LLM gera resposta" },
    { id: "a_l_o",    type: "arrow", x1: PX, y1: py(5)+PH, x2: PX, y2: py(6) },
    { id: "pi_out",   type: "box", x: PX-PW/2, y: py(6), w: PW, h: PH, fill: "#11351f", stroke: "var(--good)", label: "✓ Resposta fundamentada" },

    /* ── ZONA DE DETALHE (direita) ────────────────────── */

    // Cena 1: problema
    { id: "d_llm_alone", type: "box", x: DX, y: 120, w: 300, h: 80, fill: "#22315d", stroke: "var(--accent)", label: ["LLM (sem contexto externo)", "Treinado até data X"] },
    { id: "d_question",  type: "token", x: DX+20, y: 240, w: 260, h: 44, label: "\"Qual o preço atual do produto Y?\"" },
    { id: "d_halluc",    type: "token", x: DX+20, y: 320, w: 260, h: 44, fill: "#3a1320", stroke: "var(--hot)", label: "⚠️ Resposta inventada (alucinação)" },
    { id: "a_q_h",      type: "arrow", x1: DX+150, y1: 286, x2: DX+150, y2: 318, color: "var(--hot)" },

    // Cena 3: chunking de documentos
    { id: "d_doc",       type: "box", x: DX, y: 80, w: 340, h: 80, fill: "#1b2747", label: ["📄 Documento original", "(artigo, manual, base de conhecimento)"] },
    { id: "d_ch1",       type: "token", x: DX,     y: 210, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 1" },
    { id: "d_ch2",       type: "token", x: DX+115, y: 210, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 2" },
    { id: "d_ch3",       type: "token", x: DX+230, y: 210, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 3" },
    { id: "d_ch4",       type: "token", x: DX,     y: 290, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 4" },
    { id: "d_ch5",       type: "token", x: DX+115, y: 290, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 5" },
    { id: "d_ch6",       type: "token", x: DX+230, y: 290, w: 100, h: 54, fill: "#11351f", stroke: "var(--good)", label: "Chunk 6" },
    { id: "d_chunk_lbl", type: "label", x: DX+170, y: 390, anchor: "middle", sub: true, label: "Cada chunk → vetor no banco vetorial" },

    // Cena 4: embedding da query (vetor)
    { id: "d_qvec_lbl",  type: "label", x: DX+170, y: 80, anchor: "middle", label: "Query → vetor de embedding" },
    { id: "d_qvec",      type: "vector", x: DX+10,  y: 100, w: 28, h: 120, values: [0.7, 0.3, 0.9, 0.5, 0.8, 0.4, 0.6], color: "var(--accent)" },
    { id: "d_qvec2",     type: "vector", x: DX+45,  y: 100, w: 28, h: 120, values: [0.4, 0.8, 0.2, 0.9, 0.3, 0.7, 0.5], color: "var(--accent)" },
    { id: "d_qvec3",     type: "vector", x: DX+80,  y: 100, w: 28, h: 120, values: [0.6, 0.5, 0.7, 0.3, 0.9, 0.2, 0.8], color: "var(--accent)" },
    { id: "d_dim_lbl",   type: "label", x: DX+55, y: 235, anchor: "middle", sub: true, mono: true, label: "1536 dimensões" },

    // Cena 5: scores de similaridade (vector bars para cada chunk)
    { id: "d_sim_lbl",   type: "label", x: DX+170, y: 56, anchor: "middle", label: "Scores de similaridade (cosine)" },
    { id: "d_s1", type: "vector", x: DX+10,  y: 80, w: 32, h: 130, values: [SIM_SCORES[0]], color: "var(--good)" },
    { id: "d_s2", type: "vector", x: DX+60,  y: 80, w: 32, h: 130, values: [SIM_SCORES[1]], color: "var(--good)" },
    { id: "d_s3", type: "vector", x: DX+110, y: 80, w: 32, h: 130, values: [SIM_SCORES[2]], color: "var(--accent)" },
    { id: "d_s4", type: "vector", x: DX+160, y: 80, w: 32, h: 130, values: [SIM_SCORES[3]], color: "var(--muted)" },
    { id: "d_s5", type: "vector", x: DX+210, y: 80, w: 32, h: 130, values: [SIM_SCORES[4]], color: "var(--muted)" },
    { id: "d_s6", type: "vector", x: DX+260, y: 80, w: 32, h: 130, values: [SIM_SCORES[5]], color: "var(--muted)" },
    { id: "d_sl1", type: "label", x: DX+26,  y: 226, anchor: "middle", sub: true, mono: true, label: "0.92" },
    { id: "d_sl2", type: "label", x: DX+76,  y: 226, anchor: "middle", sub: true, mono: true, label: "0.78" },
    { id: "d_sl3", type: "label", x: DX+126, y: 226, anchor: "middle", sub: true, mono: true, label: "0.61" },
    { id: "d_sl4", type: "label", x: DX+176, y: 226, anchor: "middle", sub: true, mono: true, label: "0.45" },
    { id: "d_sl5", type: "label", x: DX+226, y: 226, anchor: "middle", sub: true, mono: true, label: "0.31" },
    { id: "d_sl6", type: "label", x: DX+276, y: 226, anchor: "middle", sub: true, mono: true, label: "0.18" },
    { id: "d_topk_lbl", type: "label", x: DX+170, y: 260, anchor: "middle", sub: true, label: "Top-K = 2 chunks selecionados" },

    // Cena 6: chunks recuperados exibidos
    { id: "d_ret1", type: "box", x: DX, y: 80, w: 340, h: 70, fill: "#11351f", stroke: "var(--good)", label: ["✓ Chunk 1 (0.92)", "\"O produto Y custa R$ 199 em junho 2025…\""] },
    { id: "d_ret2", type: "box", x: DX, y: 170, w: 340, h: 70, fill: "#11351f", stroke: "var(--good)", label: ["✓ Chunk 2 (0.78)", "\"Promoção de 10% válida até julho…\""] },
    { id: "d_ret_lbl", type: "label", x: DX+170, y: 260, anchor: "middle", sub: true, label: "Top-2 chunks mais relevantes" },

    // Cena 7: prompt aumentado
    { id: "d_aug_box", type: "box", x: DX, y: 60, w: 340, h: 340, fill: "#0e1730" },
    { id: "d_aug_sys", type: "token", x: DX+10, y: 76,  w: 320, h: 38, fill: "#22315d", label: "System: Você é um assistente preciso." },
    { id: "d_aug_ctx", type: "token", x: DX+10, y: 124, w: 320, h: 90, fill: "#11351f", stroke: "var(--good)", label: ["[Contexto recuperado]", "Chunk 1: R$ 199…", "Chunk 2: promo 10%…"] },
    { id: "d_aug_usr", type: "token", x: DX+10, y: 224, w: 320, h: 38, fill: "#1b2747", label: "User: Qual o preço atual do produto Y?" },
    { id: "d_aug_lbl", type: "label", x: DX+170, y: 278, anchor: "middle", sub: true, label: "Contexto embutido no prompt" },

    // Cena 8: resposta fundamentada
    { id: "d_resp_box", type: "box", x: DX, y: 80, w: 340, h: 130, fill: "#11351f", stroke: "var(--good)", label: ["✓ \"O produto Y custa R$ 199.", "Com a promoção de 10%, fica R$ 179,10.", "Oferta válida até julho de 2025.\""] },
    { id: "d_resp_src", type: "token", x: DX+10, y: 224, w: 320, h: 36, fill: "#0e1730", stroke: "var(--good)", label: "Fonte: base de conhecimento (fundamentado)" },

    // Cena 9: comparativo sem vs com RAG
    { id: "d_cmp_lbl", type: "label", x: DX+170, y: 52, anchor: "middle", label: "Sem RAG vs Com RAG" },
    { id: "d_no_rag",  type: "box", x: DX,     y: 70, w: 155, h: 300, fill: "#1b1224", stroke: "var(--hot)", label: ["❌ Sem RAG", "", "Conhecimento", "congelado no", "treinamento.", "", "Alucina datas,", "preços e fatos", "recentes."] },
    { id: "d_yes_rag", type: "box", x: DX+185, y: 70, w: 155, h: 300, fill: "#112318", stroke: "var(--good)", label: ["✓ Com RAG", "", "Busca docs", "em tempo real.", "", "Resposta", "atualizada e", "com fonte", "verificável."] },
  ];

  const steps = [
    {
      title: "O problema: LLMs sem contexto externo",
      show: ["d_llm_alone", "d_question", "a_q_h", "d_halluc"],
      highlight: ["d_halluc"],
      balloon: { anchor: "d_halluc", placement: "bottom",
        text: "Um LLM treinado até uma data fixa não sabe de eventos recentes. Quando perguntado sobre dados que não estão no seu treinamento, ele tende a <strong>alucinar</strong>: inventar informações plausíveis mas incorretas.",
        why: "O RAG resolve isso conectando o LLM a uma base de conhecimento atualizada em tempo de consulta — sem precisar retreinar o modelo." },
    },
    {
      title: "RAG: a arquitetura de solução",
      show: ["pi_query", "a_q_e", "pi_embed", "a_e_v", "pi_vdb", "a_v_r", "pi_ret", "a_r_a", "pi_aug", "a_a_l", "pi_llm", "a_l_o", "pi_out"],
      highlight: ["pi_query", "pi_out"],
      balloon: { anchor: { x: 160, y: 400 }, placement: "right",
        text: "O <strong>RAG (Retrieval-Augmented Generation)</strong> tem dois estágios: <strong>Retrieval</strong> (buscar os documentos certos) e <strong>Generation</strong> (o LLM gera com esse contexto). O resultado é uma resposta fundamentada em dados reais.",
        why: "RAG é preferível ao fine-tuning para conhecimento que muda frequentemente: você atualiza o banco de dados, não o modelo." },
    },
    {
      title: "Pré-processamento: chunking de documentos",
      show: ["d_doc", "d_ch1", "d_ch2", "d_ch3", "d_ch4", "d_ch5", "d_ch6", "d_chunk_lbl"],
      highlight: ["d_doc"],
      balloon: { anchor: "d_doc", placement: "bottom",
        text: "Antes de qualquer consulta, os documentos são <strong>divididos em chunks</strong> (pedaços de texto com tamanho fixo ou semântico). Cada chunk é convertido num vetor e armazenado no <span class=\"xp-term\" tabindex=\"0\" data-tip=\"Banco de dados especializado em armazenar e buscar vetores de alta dimensão por similaridade.\">Vector DB</span>.",
        why: "Chunks menores permitem recuperar só o trecho relevante, sem passar o documento inteiro ao LLM. O tamanho ideal depende do modelo e do tipo de conteúdo." },
      enter: (ctx) => {
        const ids = ["d_ch1","d_ch2","d_ch3","d_ch4","d_ch5","d_ch6"];
        ids.forEach((id, i) => setTimeout(() => ctx.show(id), i * 80));
      },
    },
    {
      title: "Embedding da query do usuário",
      show: ["d_qvec_lbl", "d_qvec", "d_qvec2", "d_qvec3", "d_dim_lbl"],
      highlight: ["pi_embed"],
      balloon: { anchor: "pi_embed", placement: "right",
        text: "Quando o usuário faz uma pergunta, ela passa pelo <strong>mesmo modelo de embedding</strong> usado nos documentos. O resultado é um <strong>vetor de alta dimensão</strong> (ex.: 1536 dimensões) que representa o <em>significado</em> semântico da query.",
        why: "Usar o mesmo espaço vetorial é crucial: documentos e query precisam ser comparáveis. Modelos como ada-002 ou text-embedding-3 são populares para isso." },
      enter: (ctx) => {
        setTimeout(() => ctx.show("d_qvec"), 0);
        setTimeout(() => ctx.show("d_qvec2"), 120);
        setTimeout(() => ctx.show("d_qvec3"), 240);
      },
    },
    {
      title: "Busca vetorial por similaridade",
      show: ["d_sim_lbl", "d_s1","d_s2","d_s3","d_s4","d_s5","d_s6", "d_sl1","d_sl2","d_sl3","d_sl4","d_sl5","d_sl6", "d_topk_lbl"],
      highlight: ["pi_vdb", "d_s1", "d_s2"],
      balloon: { anchor: "pi_vdb", placement: "right",
        text: "O Vector DB compara o vetor da query com todos os vetores dos chunks usando <strong>similaridade de cosseno</strong> (ou produto escalar). Os chunks com maior score são os mais semanticamente próximos da pergunta.",
        why: "A busca vetorial encontra resultados relevantes mesmo sem correspondência exata de palavras — ela entende o significado. Bancos como Pinecone, Weaviate, pgvector ou Qdrant fazem isso eficientemente." },
      enter: (ctx) => {
        const bars = ["d_s1","d_s2","d_s3","d_s4","d_s5","d_s6"];
        bars.forEach((id, i) => setTimeout(() => {
          ctx.show(id);
          ctx.setBars(id, [SIM_SCORES[i]]);
        }, i * 100));
      },
    },
    {
      title: "Top-K chunks recuperados",
      show: ["d_ret1", "d_ret2", "d_ret_lbl"],
      highlight: ["pi_ret", "d_ret1", "d_ret2"],
      balloon: { anchor: "d_ret1", placement: "right",
        text: "Os <strong>K chunks</strong> com maior similaridade (aqui K=2) são recuperados. Eles contêm o contexto específico para responder a pergunta: preço atual, condições de promoção e prazo.",
        why: "O valor de K é um trade-off: mais chunks = mais contexto mas também mais tokens e risco de diluir a relevância. Reranking (um modelo auxiliar que reordena os resultados) pode melhorar a qualidade." },
      enter: (ctx) => {
        ctx.show("d_ret1");
        setTimeout(() => ctx.show("d_ret2"), 150);
      },
    },
    {
      title: "Montagem do prompt aumentado",
      show: ["d_aug_box", "d_aug_sys", "d_aug_ctx", "d_aug_usr", "d_aug_lbl"],
      highlight: ["pi_aug", "d_aug_ctx"],
      balloon: { anchor: "pi_aug", placement: "right",
        text: "Os chunks recuperados são <strong>embutidos no prompt</strong> como contexto adicional, junto ao system prompt e à pergunta original. O LLM agora enxerga os fatos relevantes antes de gerar a resposta.",
        why: "A ordem importa: colocar o contexto antes da pergunta ajuda a maioria dos modelos. O prompt precisa instruir o LLM a citar a fonte e admitir quando o contexto não é suficiente." },
      enter: (ctx) => {
        ctx.show("d_aug_box");
        setTimeout(() => ctx.show("d_aug_sys"), 80);
        setTimeout(() => ctx.show("d_aug_ctx"), 200);
        setTimeout(() => ctx.show("d_aug_usr"), 350);
      },
    },
    {
      title: "LLM gera a resposta fundamentada",
      show: ["d_resp_box", "d_resp_src"],
      highlight: ["pi_llm", "pi_out", "d_resp_box"],
      balloon: { anchor: "pi_out", placement: "right",
        text: "Com o contexto embutido, o LLM gera uma resposta <strong>precisa e verificável</strong>: cita o preço real, a promoção e o prazo — tudo extraído dos chunks, não inventado.",
        why: "O LLM atua como um sintetizador inteligente, não como uma memória. Ele organiza e articula o que os chunks trouxeram, reduzindo drasticamente as alucinações." },
      enter: (ctx) => {
        ctx.show("d_resp_box");
        setTimeout(() => ctx.show("d_resp_src"), 200);
      },
    },
    {
      title: "Sem RAG vs Com RAG",
      show: ["d_cmp_lbl", "d_no_rag", "d_yes_rag"],
      highlight: ["d_yes_rag"],
      balloon: { anchor: "d_yes_rag", placement: "right",
        text: "O comparativo é claro: sem RAG, o LLM usa só o que aprendeu no treino (limitado e possivelmente desatualizado). Com RAG, ele acessa dados atuais da empresa, docs, wikis e muito mais — em tempo real.",
        why: "RAG não substitui fine-tuning para adaptar o estilo ou comportamento do modelo, mas é muito mais eficiente para <strong>conhecimento factual e dinâmico</strong>." },
    },
    {
      title: "Onde o RAG pode falhar",
      highlight: ["pi_vdb", "pi_embed"],
      balloon: { anchor: { x: 160, y: 360 }, placement: "right",
        text: "O RAG falha quando: (1) o chunk certo não foi indexado; (2) a query e o documento usam vocabulário diferente; (3) K é pequeno demais; (4) os chunks são grandes demais. <strong>Chunking, embedding e K são parâmetros críticos.</strong>",
        why: "Avaliar um sistema RAG exige métricas como recall@K (o chunk certo está nos K recuperados?) e faithfulness (a resposta cita o contexto fielmente?)." },
    },
    {
      title: "Quiz rápido",
      balloon: { anchor: { x: 160, y: 400 }, placement: "right",
        text: "Teste seu entendimento do RAG 👇" },
      quiz: {
        question: "Por que o RAG usa o mesmo modelo de embedding para documentos e para a query do usuário?",
        options: [
          "Para economizar custo de API chamando o modelo uma vez só",
          "Para que documentos e query existam no mesmo espaço vetorial e sejam comparáveis por similaridade",
          "Porque modelos diferentes não conseguem processar texto em português",
          "Para garantir que o LLM não precise ser retreinado",
        ],
        answer: 1,
        explain: "Documentos e query precisam estar no mesmo espaço vetorial para que a distância entre eles tenha significado. Se usassem modelos diferentes, os vetores seriam incomparáveis.",
      },
    },
    {
      title: "Resumo do RAG",
      highlight: ["pi_query", "pi_embed", "pi_vdb", "pi_ret", "pi_aug", "pi_llm", "pi_out"],
      balloon: { anchor: { x: 160, y: 400 }, placement: "right",
        text: "O fluxo RAG em 6 passos: <strong>query → embedding → busca vetorial → top-K chunks → prompt aumentado → LLM → resposta fundamentada</strong>. O LLM fica estático; o conhecimento atualiza via o banco vetorial.",
        why: "RAG é hoje a arquitetura padrão para sistemas de Q&A sobre documentos, chatbots de suporte, assistentes de código e qualquer cenário onde o conhecimento muda com o tempo." },
      enter: (ctx) => {
        const pis = ["pi_query","pi_embed","pi_vdb","pi_ret","pi_aug","pi_llm","pi_out"];
        pis.forEach((id, k) => setTimeout(() => ctx.pulse(id, true), k * 100));
      },
    },
  ];

  window.RAG_DIAGRAM = {
    title: "RAG — Retrieval-Augmented Generation",
    subtitle: "Como fundamentar respostas de LLMs em dados reais",
    width: W, height: H, autoplayMs: 9000, elements, steps,
  };
})();
