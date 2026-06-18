/* ============================================================================
 * tcp.data.js — Explicador: TCP/IP (handshake e transporte confiável)
 * Diagrama de sequência entre Cliente e Servidor. Mesmo motor genérico.
 * ==========================================================================*/
(function () {
  const W = 1180, H = 820;
  const C = 330, S = 880;
  const reveal = (ctx, ids, st = 80) => ids.forEach((id, i) => setTimeout(() => ctx.show(id), i * st));
  const msg = (id, x1, x2, y, label, color) => ([
    { id, type: "arrow", x1, y1: y, x2, y2: y, color },
    { id: id + "_l", type: "label", x: (x1 + x2) / 2, y: y - 12, sub: true, anchor: "middle", mono: true, label },
  ]);

  const elements = [
    { id: "cli", type: "box", x: C - 90, y: 36, w: 180, h: 46, label: "💻 Cliente" },
    { id: "srv", type: "box", x: S - 90, y: 36, w: 180, h: 46, label: "🗄️ Servidor" },
    { id: "ll_c", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${C},84 L${C},790` },
    { id: "ll_s", type: "arrow", noHead: true, dashed: true, color: "var(--muted)", path: `M${S},84 L${S},790` },

    // intro: pilha de camadas (à esquerda)
    { id: "lay_app", type: "box", x: 40, y: 150, w: 180, h: 40, fill: "#22315d", label: "Aplicação (HTTP)" },
    { id: "lay_tcp", type: "box", x: 40, y: 196, w: 180, h: 40, fill: "#24407e", label: "Transporte (TCP)" },
    { id: "lay_ip", type: "box", x: 40, y: 242, w: 180, h: 40, fill: "#1b2747", label: "Rede (IP)" },
    { id: "lay_cap", type: "label", x: 130, y: 305, sub: true, anchor: "middle", label: "TCP fica entre o app e o IP" },

    // handshake
    ...msg("m_syn", C, S, 200, "SYN  seq=x", "var(--accent)"),
    ...msg("m_synack", S, C, 255, "SYN-ACK  seq=y, ack=x+1", "var(--accent)"),
    ...msg("m_ack", C, S, 310, "ACK  ack=y+1", "var(--accent)"),
    { id: "est", type: "token", x: (C + S) / 2 - 110, y: 335, w: 220, h: 36, label: "conexão estabelecida ✓" },

    // dados + ack
    ...msg("m_d1", C, S, 430, "DATA  seq=1 (100 B)", "var(--good)"),
    ...msg("m_a1", S, C, 480, "ACK=101", "var(--good)"),

    // janela
    { id: "win", type: "box", x: C + 20, y: 520, w: 330, h: 56, fill: "#0e1730",
      label: ["Janela deslizante: vários segmentos", "em trânsito sem esperar ACK de cada um"] },

    // perda + retransmissão
    ...msg("m_lost", C, (C + S) / 2 + 40, 630, "seq=201 (100 B)", "var(--hot)"),
    { id: "x_lost", type: "label", x: (C + S) / 2 + 55, y: 630, size: 26, anchor: "middle", label: "✗" },
    { id: "lost_cap", type: "label", x: (C + S) / 2 + 55, y: 656, sub: true, anchor: "middle", label: "pacote perdido — sem ACK" },
    ...msg("m_retx", C, S, 700, "timeout → retransmite seq=201", "var(--warn)"),

    // encerramento
    ...msg("m_fin", C, S, 760, "FIN / ACK  (encerra)", "var(--accent-2)"),
  ];

  const steps = [
    {
      title: "Onde o TCP vive",
      show: ["cli", "srv", "ll_c", "ll_s", "lay_app", "lay_tcp", "lay_ip", "lay_cap"], highlight: ["lay_tcp"],
      balloon: { anchor: "lay_tcp", placement: "right",
        text: "O <strong>IP</strong> entrega pacotes entre máquinas, mas pode perdê-los, duplicá-los ou trocá-los de ordem. O <strong>TCP</strong> roda em cima do IP e cria um canal <strong>confiável e ordenado</strong>.",
        why: "Aplicações (como HTTP) querem um “cano” de bytes confiável; o TCP fornece isso usando números de sequência e confirmações (ACK)." },
    },
    {
      title: "Handshake: SYN",
      show: ["m_syn", "m_syn_l"], highlight: ["m_syn_l"],
      balloon: { anchor: "m_syn_l", placement: "bottom",
        text: "O cliente envia um <strong>SYN</strong> com um número de sequência inicial aleatório (seq=x), pedindo para abrir conexão.",
        why: "Escolher um seq inicial sincroniza a contagem de bytes dos dois lados e dificulta falsificação." },
      enter: (ctx) => ctx.drawArrow("m_syn"),
    },
    {
      title: "Handshake: SYN-ACK",
      show: ["m_synack", "m_synack_l"],
      balloon: { anchor: "m_synack_l", placement: "bottom",
        text: "O servidor responde com <strong>SYN-ACK</strong>: confirma o seq do cliente (ack=x+1) e manda o seu próprio seq=y.",
        why: "Cada lado precisa anunciar e ter confirmado seu número inicial — por isso são <strong>três</strong> mensagens." },
      enter: (ctx) => ctx.drawArrow("m_synack"),
    },
    {
      title: "Handshake: ACK",
      show: ["m_ack", "m_ack_l", "est"], highlight: ["est"],
      balloon: { anchor: "est", placement: "bottom",
        text: "O cliente confirma o seq do servidor (ack=y+1). Pronto: o <strong>three-way handshake</strong> terminou e a conexão está aberta nos dois sentidos.",
        why: "Agora ambos sabem por qual número a contagem de bytes começa — podem trocar dados com segurança de ordem." },
      enter: (ctx) => ctx.drawArrow("m_ack"),
    },
    {
      title: "Envio de dados + ACK",
      show: ["m_d1", "m_d1_l", "m_a1", "m_a1_l"],
      balloon: { anchor: "m_a1_l", placement: "top",
        text: "Os dados vão em <strong>segmentos numerados</strong> pelo byte (seq=1, 100 bytes). O receptor confirma com <strong>ACK=101</strong> = “já recebi até o byte 100, mande o próximo”.",
        why: "Numerar por byte deixa o receptor remontar tudo na ordem certa, mesmo que os pacotes cheguem embaralhados." },
      enter: (ctx) => { ctx.drawArrow("m_d1"); setTimeout(() => ctx.drawArrow("m_a1"), 350); },
    },
    {
      title: "Janela deslizante",
      show: ["win"], highlight: ["win"],
      balloon: { anchor: "win", placement: "top",
        text: "O emissor não espera o ACK de cada segmento: manda vários de uma vez, até o limite da <strong>janela</strong> anunciada pelo receptor.",
        why: "Isso enche o “cano” e dá vazão. A janela também serve de <strong>controle de fluxo</strong>: o receptor freia o emissor se estiver sobrecarregado." },
    },
    {
      title: "Perda e retransmissão",
      show: ["m_lost", "m_lost_l", "x_lost", "lost_cap", "m_retx", "m_retx_l"], highlight: ["m_retx_l"],
      balloon: { anchor: "lost_cap", placement: "right",
        text: "Se um segmento se perde, o ACK esperado não chega. Ao estourar o <strong>timeout</strong> (ou ver ACKs duplicados), o emissor <strong>retransmite</strong> o segmento.",
        why: "É isso que torna o TCP <em>confiável</em> sobre um IP não-confiável: nada é dado como entregue sem ACK." },
      enter: (ctx) => { ctx.drawArrow("m_lost"); setTimeout(() => ctx.drawArrow("m_retx"), 500); },
    },
    {
      title: "Encerramento (FIN)",
      show: ["m_fin", "m_fin_l"],
      balloon: { anchor: "m_fin_l", placement: "top",
        text: "Para fechar, cada lado manda um <strong>FIN</strong> e recebe o <strong>ACK</strong> correspondente — encerrando os dois sentidos de forma ordenada.",
        why: "O fechamento também é negociado para garantir que nenhum dado em trânsito seja perdido na hora de desligar." },
      enter: (ctx) => ctx.drawArrow("m_fin"),
    },
    {
      title: "Resumo",
      highlight: ["m_syn", "m_synack", "m_ack", "est"],
      balloon: { anchor: "est", placement: "top",
        text: "Fluxo do TCP: <strong>handshake (SYN/SYN-ACK/ACK) → dados numerados + ACKs → janela para vazão → retransmissão em caso de perda → FIN para fechar</strong>.",
        why: "Números de sequência + ACKs + retransmissão = entrega confiável e em ordem sobre uma rede que, sozinha, não garante nada disso." },
      enter: (ctx) => ["m_syn", "m_synack", "m_ack"].forEach((a, k) => setTimeout(() => ctx.pulse(a, true), k * 120)),
    },
  ];

  window.TCP_DIAGRAM = {
    title: "TCP/IP: handshake e transporte confiável",
    subtitle: "Como bytes chegam inteiros e em ordem sobre uma rede que perde pacotes",
    width: W, height: H, autoplayMs: 8000, elements, steps,
  };
})();
