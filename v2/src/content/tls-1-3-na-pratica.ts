import { r, validateExplainer, type ExplainerInput } from "@/schema/explainer";

const CLI = { x: 170, y: 150 };
const SRV = { x: 1430, y: 150 };

const data: ExplainerInput = {
  slug: "tls-1-3-na-pratica",
  title: "TLS 1.3 na prática",
  subtitle: "O aperto de mão que protege toda conexão HTTPS",
  category: "Segurança & Autenticação",
  tags: ["tls", "https", "criptografia", "handshake"],
  level: "avancado",
  glossary: {
    handshake: "A negociação inicial entre cliente e servidor antes de trocar dados de aplicação.",
    "efêmera": "Gerada só para esta conexão e descartada depois — nunca reutilizada.",
    certificado: "Documento assinado que prova a identidade do servidor (emitido por uma autoridade confiável).",
    RTT: "Round-Trip Time: uma ida-e-volta completa de mensagens entre cliente e servidor.",
  },
  elements: [
    { id: "hero_icon", kind: "icon", name: "lock", tone: "good", at: r(700, 260, 200, 200) },
    { id: "hero_title", kind: "label", text: "TLS 1.3 na prática", size: 40, at: r(400, 490, 800, 60) },
    { id: "hero_sub", kind: "label", text: "O aperto de mão que protege toda conexão HTTPS", size: 18, muted: true, at: r(350, 560, 900, 40) },

    { id: "cli_box", kind: "box", label: "Cliente", sub: "navegador / app", icon: "user", tone: "accent", at: r(60, 110, 220, 90) },
    { id: "srv_box", kind: "box", label: "Servidor", sub: "exemplo.com", icon: "server", tone: "accent2", at: r(1320, 110, 220, 90) },
    { id: "life_cli", kind: "connector", from: { x: 170, y: 200 }, to: { x: 170, y: 850 }, dashed: true, arrow: false, tone: "neutral", thickness: 1.5 },
    { id: "life_srv", kind: "connector", from: { x: 1430, y: 200 }, to: { x: 1430, y: 850 }, dashed: true, arrow: false, tone: "neutral", thickness: 1.5 },

    { id: "msg1_lbl", kind: "label", text: "ClientHello — versões, cifras, key_share", size: 15, at: r(260, 208, 940, 30) },
    { id: "conn_msg1", kind: "connector", from: CLI, to: { ...SRV, y: 230 }, route: "line", tone: "accent" },

    { id: "msg2_lbl", kind: "label", text: "ServerHello + certificado + key_share do servidor", size: 15, at: r(260, 288, 940, 30) },
    { id: "conn_msg2", kind: "connector", from: { ...SRV, y: 310 }, to: { ...CLI, y: 310 }, route: "line", tone: "accent2" },

    { id: "chave_secreta", kind: "box", label: "Segredo compartilhado", sub: "derivado via ECDHE — nunca trafega", icon: "key", tone: "good", at: r(700, 380, 220, 100) },
    { id: "conn_cli_chave", kind: "connector", from: "cli_box", to: "chave_secreta", route: "curve", tone: "good" },
    { id: "conn_srv_chave", kind: "connector", from: "srv_box", to: "chave_secreta", route: "curve", tone: "good" },
    { id: "hkdf_txt", kind: "text", md: "`chave = HKDF(segredo, salt, info)`", at: r(600, 490, 420, 34), align: "center" },

    { id: "msg3_lbl", kind: "label", text: "Finished — prova de que ambos derivaram as chaves certas", size: 15, at: r(260, 528, 940, 30) },
    { id: "conn_msg3", kind: "connector", from: { ...CLI, y: 550 }, to: { ...SRV, y: 550 }, route: "line", tone: "accent" },

    { id: "msg4_lbl", kind: "label", text: "Dados de aplicação — já totalmente criptografados", size: 15, at: r(260, 608, 940, 30) },
    { id: "conn_msg4", kind: "connector", from: { ...CLI, y: 630 }, to: { ...SRV, y: 630 }, route: "line", tone: "hot" },
    {
      id: "code_http",
      kind: "code",
      lang: "http",
      title: "conteúdo real da requisição (protegido)",
      source: "GET /painel HTTP/1.1\nHost: exemplo.com\nAuthorization: Bearer ***",
      at: r(500, 660, 600, 140),
    },

    {
      id: "bars_latency",
      kind: "bars",
      values: [0.35, 0.7],
      labels: ["TLS 1.3 (1 RTT)", "TLS 1.2 (2 RTT)"],
      tone: "hot",
      at: r(600, 130, 400, 260),
    },
  ],
  scenes: [
    {
      id: "intro",
      title: "Introdução",
      role: "cover",
      duration: 5000,
      add: ["hero_icon", { id: "hero_title", enter: { type: "slide", dir: "up" } }, "hero_sub"],
      camera: { fit: ["hero_icon", "hero_title", "hero_sub"], pad: 0.2 },
      caption: {
        anchor: "hero_icon",
        placement: "right",
        text: "Antes de qualquer dado trafegar, cliente e servidor fazem um {{handshake}} para combinar como vão se proteger.",
        why: "É esse aperto de mão de milissegundos que transforma HTTP em HTTPS.",
      },
    },
    {
      id: "hello",
      title: "1. ClientHello",
      duration: 8000,
      remove: ["hero_icon", "hero_title", "hero_sub"],
      add: [
        "cli_box",
        "srv_box",
        { id: "life_cli", enter: { type: "fade" } },
        { id: "life_srv", enter: { type: "fade" } },
        { id: "msg1_lbl", enter: { type: "fade" } },
        { id: "conn_msg1", enter: { type: "draw", duration: 500 } },
      ],
      camera: { fit: ["cli_box", "srv_box", "conn_msg1"], pad: 0.25 },
      caption: {
        anchor: "conn_msg1",
        placement: "top",
        text: "O cliente propõe versões de TLS, cifras suportadas e já envia uma chave {{efêmera}} (key_share) — sem esperar resposta.",
        why: "O TLS 1.3 economiza uma rodada inteira adivinhando os parâmetros mais comuns de antemão.",
      },
    },
    {
      id: "server-hello",
      title: "2. ServerHello",
      duration: 8000,
      add: ["msg2_lbl", { id: "conn_msg2", enter: { type: "draw", duration: 500 } }],
      camera: { fit: ["conn_msg1", "conn_msg2"], pad: 0.2 },
      caption: {
        anchor: "conn_msg2",
        placement: "bottom",
        text: "O servidor escolhe os parâmetros, envia seu {{certificado}} e sua própria chave efêmera.",
        why: "A partir daqui, os dois lados têm tudo que precisam para calcular o mesmo segredo, cada um do seu lado.",
      },
    },
    {
      id: "segredo",
      title: "3. O segredo compartilhado",
      duration: 8500,
      add: [
        { id: "chave_secreta", enter: { type: "pop" } },
        { id: "conn_cli_chave", enter: { type: "draw" } },
        { id: "conn_srv_chave", enter: { type: "draw" } },
        { id: "hkdf_txt", enter: { type: "fade", delay: 500 } },
      ],
      cues: [{ at: 700, duration: 900, target: "chave_secreta", do: "pulse", times: 2 }],
      camera: { fit: ["cli_box", "srv_box", "chave_secreta"], pad: 0.15 },
      caption: {
        anchor: "chave_secreta",
        placement: "bottom",
        text: "Usando Diffie-Hellman efêmero (ECDHE), os dois lados calculam o MESMO segredo — sem nunca transmiti-lo.",
        why: "Mesmo que alguém grave toda a conversa, não consegue reconstruir esse segredo sem uma das chaves privadas efêmeras.",
      },
    },
    {
      id: "finished",
      title: "4. Finished",
      duration: 7000,
      add: ["msg3_lbl", { id: "conn_msg3", enter: { type: "draw", duration: 500 } }],
      camera: { fit: ["chave_secreta", "conn_msg3"], pad: 0.15 },
      caption: {
        anchor: "conn_msg3",
        placement: "bottom",
        text: "Cada lado envia um \"Finished\": um MAC sobre tudo que foi trocado até aqui, já usando a nova chave.",
        why: "Se alguém adulterou uma mensagem no meio do caminho, o MAC não bate e a conexão é derrubada na hora.",
      },
    },
    {
      id: "app-data",
      title: "5. Dados de aplicação",
      duration: 9000,
      add: ["msg4_lbl", { id: "conn_msg4", enter: { type: "draw", duration: 500 } }, { id: "code_http", enter: { type: "fade", delay: 500 } }],
      camera: { fit: ["conn_msg3", "conn_msg4", "code_http"], pad: 0.1 },
      caption: {
        anchor: "code_http",
        placement: "top",
        text: "A partir de agora, até a própria requisição HTTP viaja criptografada dentro do túnel TLS.",
        why: "Um observador na rede só vê bytes opacos — nem a URL, nem os cabeçalhos, nem o token de autenticação.",
      },
    },
    {
      id: "comparacao",
      title: "6. Por que é mais rápido",
      duration: 7500,
      add: [{ id: "bars_latency", enter: { type: "slide", dir: "down" } }],
      camera: { fit: ["bars_latency"], pad: 0.3 },
      caption: {
        anchor: "bars_latency",
        placement: "bottom",
        text: "O TLS 1.3 fecha o handshake em 1 {{RTT}}; o TLS 1.2 clássico levava 2.",
        why: "Menos idas-e-voltas = página carregando mais rápido, especialmente em conexões de alta latência (móvel).",
      },
    },
    {
      id: "resumo",
      title: "Resumo: o handshake completo",
      duration: 8000,
      camera: { fit: "all", pad: 0.05 },
      cues: [
        { at: 200, target: "conn_msg1", do: "pulse" },
        { at: 900, target: "conn_msg2", do: "pulse" },
        { at: 1600, target: "chave_secreta", do: "pulse" },
        { at: 2300, target: "conn_msg3", do: "pulse" },
        { at: 3000, target: "conn_msg4", do: "pulse" },
      ],
      caption: {
        anchor: { x: 800, y: 60 },
        placement: "bottom",
        text: "ClientHello → ServerHello+certificado → segredo compartilhado → Finished → dados criptografados — tudo em 1 RTT.",
        why: "Essa sequência roda em milissegundos antes de qualquer página carregar, em toda conexão HTTPS do mundo.",
      },
    },
    {
      id: "quiz",
      title: "Teste seu entendimento",
      role: "cta",
      duration: 9000,
      camera: { fit: "all", pad: 0.05 },
      quiz: {
        question: "Por que o segredo compartilhado do TLS nunca é interceptável, mesmo que alguém grave toda a conexão?",
        options: [
          "Porque ele é enviado comprimido e ninguém consegue descomprimir",
          "Porque ele nunca é transmitido — cada lado o calcula localmente com Diffie-Hellman efêmero",
          "Porque o certificado do servidor já contém o segredo",
          "Porque o TLS usa um servidor central que guarda todas as chaves",
        ],
        answer: 1,
        explain: "Com ECDHE, cliente e servidor trocam apenas chaves públicas efêmeras e cada um combina a sua chave privada com a chave pública recebida para chegar ao MESMO número — sem que o segredo em si jamais trafegue pela rede.",
      },
    },
  ],
};

export const tls13NaPratica = validateExplainer(data);
