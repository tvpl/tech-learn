(function () {
  const W = 1280, H = 720;

  /* ── Layout ── */
  const MSG_X = 40, MSG_Y = 60, MSG_W = 560, MSG_H = 580; // message structure (left)
  const FLOW_X = 660, FLOW_Y = 60;                        // transaction flow (right)

  /* Message field rows */
  function fieldRow(id, y, label, value, color) {
    return [
      { id: id + "_box", type: "box", x: MSG_X + 10, y: MSG_Y + y, w: MSG_W - 20, h: 38, rx: 5, style: `fill:${color};opacity:0.75` },
      { id: id + "_lbl", type: "label", x: MSG_X + 100, y: MSG_Y + y + 19, label: label, style: "font-size:11px;font-weight:600;fill:#fff;text-anchor:start" },
      { id: id + "_val", type: "label", x: MSG_X + 350, y: MSG_Y + y + 19, label: value, style: "font-size:10px;font-family:monospace;fill:#eee;text-anchor:start" },
    ];
  }

  /* Flow actors */
  const FLOW_ACTORS = [
    { id: "fa_pos",  x: FLOW_X + 10,  label: "POS Terminal",  color: "var(--accent-2)" },
    { id: "fa_acq",  x: FLOW_X + 170, label: "Adquirente",    color: "var(--accent)"   },
    { id: "fa_net",  x: FLOW_X + 340, label: "Bandeira",      color: "var(--warn)"     },
    { id: "fa_iss",  x: FLOW_X + 510, label: "Emissor",       color: "var(--good)"     },
  ];
  const FA_W = 130, FA_H = 44, FA_Y = FLOW_Y;
  const LF_TOP = FA_Y + FA_H;
  const LF_BOT = 600;

  function fax(a) { return a.x + FA_W / 2; }

  function flowMsg(id, fromId, toId, row, label, color = "var(--ink-soft)", dashed = false) {
    const from = FLOW_ACTORS.find(a => a.id === fromId);
    const to = FLOW_ACTORS.find(a => a.id === toId);
    const y = LF_TOP + 30 + row * 52;
    return [
      { id: id + "_arr", type: "arrow", x1: fax(from), y1: y, x2: fax(to), y2: y, style: `stroke:${color};stroke-width:2${dashed ? ";stroke-dasharray:5,4" : ""}` },
      { id: id + "_lbl", type: "label", x: (fax(from) + fax(to)) / 2, y: y - 8, label: label, style: `font-size:10px;fill:${color};font-weight:600` },
    ];
  }

  const elements = [
    // ── Title ──
    { id: "title_main", type: "label", x: W / 2, y: 32, label: "ISO 8583 — Pagamentos com Cartão", style: "font-size:22px;font-weight:700;fill:var(--ink)" },

    // ── Message structure border ──
    { id: "msg_border", type: "box", x: MSG_X, y: MSG_Y, w: MSG_W, h: MSG_H, rx: 10, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "msg_title", type: "label", x: MSG_X + MSG_W / 2, y: MSG_Y + 20, label: "Estrutura da Mensagem ISO 8583", style: "font-size:13px;font-weight:700;fill:var(--ink)" },

    // ── MTI row ──
    ...fieldRow("mti", 36, "MTI  (4 dígitos)", "0100 = Auth Request", "var(--accent)"),
    // ── Bitmap primary ──
    ...fieldRow("bmp1", 82, "Bitmap Primário  (64 bits)", "F2 3A C4 81 E0 28 40 C0", "var(--accent-2)"),
    // ── Bitmap secondary ──
    ...fieldRow("bmp2", 128, "Bitmap Secundário  (64 bits)", "02 00 00 00 04 00 00 00", "var(--accent-2)"),

    // ── Data Elements ──
    { id: "de_title", type: "label", x: MSG_X + MSG_W / 2, y: MSG_Y + 186, label: "Data Elements (indicados pelo Bitmap)", style: "font-size:12px;font-weight:700;fill:var(--ink-soft)" },
    ...fieldRow("de2",  202, "DE2  PAN",                "4111 1111 1111 1111", "var(--hot)"),
    ...fieldRow("de3",  248, "DE3  Processing Code",    "000000 (Purchase)",   "var(--warn)"),
    ...fieldRow("de4",  294, "DE4  Amount",             "000000015000 (R$150,00)", "var(--good)"),
    ...fieldRow("de11", 340, "DE11 STAN",               "123456",              "var(--accent)"),
    ...fieldRow("de22", 386, "DE22 POS Entry Mode",     "051 (chip + PIN)",    "var(--accent-2)"),
    ...fieldRow("de37", 432, "DE37 RRN",                "240626123456",        "var(--accent)"),
    ...fieldRow("de39", 478, "DE39 Response Code",      "00 = Approved",       "var(--good)"),
    ...fieldRow("de41", 524, "DE41 Terminal ID",        "TID00001",            "var(--warn)"),

    // ── Flow: Actors (right side) ──
    ...FLOW_ACTORS.map(a => ({ id: a.id + "_box", type: "box", x: a.x, y: FA_Y, w: FA_W, h: FA_H, rx: 8, style: `fill:${a.color};opacity:0.85` })),
    ...FLOW_ACTORS.map(a => ({ id: a.id + "_lbl", type: "label", x: fax(a), y: FA_Y + FA_H / 2 + 5, label: a.label, style: "font-size:11px;font-weight:700;fill:#fff" })),
    // Lifelines
    ...FLOW_ACTORS.map(a => ({ id: a.id + "_lf", type: "arrow", x1: fax(a), y1: LF_TOP, x2: fax(a), y2: LF_BOT, style: "stroke:var(--line);stroke-width:1;stroke-dasharray:4,4" })),

    // ── Authorization flow messages (0100/0110) ──
    ...flowMsg("auth_req", "fa_pos", "fa_acq", 0, "0100 Auth Request",    "var(--accent-2)"),
    ...flowMsg("auth_fwd", "fa_acq", "fa_net", 1, "0100 Forward",         "var(--accent)"),
    ...flowMsg("auth_net", "fa_net", "fa_iss", 2, "0100 To Issuer",       "var(--warn)"),
    ...flowMsg("auth_rsp_iss","fa_iss","fa_net",3, "0110 Response (DE39=00)","var(--good)",true),
    ...flowMsg("auth_rsp_net","fa_net","fa_acq",4, "0110 Forward",         "var(--good)",true),
    ...flowMsg("auth_rsp_pos","fa_acq","fa_pos",5, "0110 Approved",        "var(--good)",true),

    // ── Detail panels (overlays) ──

    // Ecosystem intro
    { id: "eco_panel", type: "box", x: 80, y: 70, w: 1120, h: 560, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "eco_title", type: "label", x: 640, y: 98, label: "O Ecossistema de Pagamentos com Cartão", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    ...["Portador (você)","POS Terminal","Adquirente","Bandeira (Visa/MC)","Emissor (banco)"].map((n, i) => ({
      id: `eco_node_${i}`, type: "box", x: 110 + i * 220, y: 140, w: 180, h: 60, rx: 8,
      style: `fill:${["var(--muted)","var(--accent-2)","var(--accent)","var(--warn)","var(--good)"][i]};opacity:0.75`
    })),
    ...["Portador (você)","POS Terminal","Adquirente","Bandeira (Visa/MC)","Emissor (banco)"].map((n, i) => ({
      id: `eco_node_${i}_lbl`, type: "label", x: 200 + i * 220, y: 170, label: n,
      style: "font-size:11px;font-weight:700;fill:#fff"
    })),
    ...[0,1,2,3].map(i => ({
      id: `eco_arr_${i}`, type: "arrow", x1: 290 + i * 220, y1: 170, x2: 110 + (i+1) * 220, y2: 170,
      style: "stroke:var(--ink-soft);stroke-width:1.5"
    })),
    { id: "eco_d1", type: "label", x: 640, y: 240, label: "O ISO 8583 é o protocolo de mensagens que conecta todos esses participantes", style: "font-size:13px;fill:var(--ink-soft)" },
    { id: "eco_d2", type: "label", x: 640, y: 268, label: "Define a estrutura binária das mensagens de autorização, captura, reversão e settlement", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "eco_roles", type: "box", x: 120, y: 300, w: 1040, h: 280, rx: 8, style: "fill:var(--muted);opacity:0.15" },
    { id: "eco_r_t", type: "label", x: 640, y: 322, label: "Papéis dos Participantes", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "eco_r1", type: "label", x: 300, y: 350, label: "POS Terminal:", style: "font-size:12px;font-weight:600;fill:var(--accent-2)" },
    { id: "eco_r1d", type: "label", x: 300, y: 370, label: "captura dados do cartão (chip, NFC, tarja)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_r2", type: "label", x: 300, y: 400, label: "Adquirente:", style: "font-size:12px;font-weight:600;fill:var(--accent)" },
    { id: "eco_r2d", type: "label", x: 300, y: 420, label: "banco do lojista, roteia transações ao network", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_r3", type: "label", x: 300, y: 450, label: "Bandeira:", style: "font-size:12px;font-weight:600;fill:var(--warn)" },
    { id: "eco_r3d", type: "label", x: 300, y: 470, label: "Visa, Mastercard — rede de roteamento global", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_r4", type: "label", x: 750, y: 350, label: "Emissor:", style: "font-size:12px;font-weight:600;fill:var(--good)" },
    { id: "eco_r4d", type: "label", x: 750, y: 370, label: "banco do portador, aprova ou recusa", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_r5", type: "label", x: 750, y: 400, label: "ISO 8583:", style: "font-size:12px;font-weight:600;fill:var(--accent-2)" },
    { id: "eco_r5d", type: "label", x: 750, y: 420, label: "protocolo padrão entre adquirente ↔ bandeira ↔ emissor", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_r6", type: "label", x: 750, y: 450, label: "Variantes:", style: "font-size:12px;font-weight:600;fill:var(--ink-soft)" },
    { id: "eco_r6d", type: "label", x: 750, y: 470, label: "ISO 8583:1987, 1993, 2003 — Visa Base II, MC IPM", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "eco_note", type: "label", x: 640, y: 540, label: "PIX usa API REST, mas nos pagamentos com cartão o ISO 8583 ainda domina globalmente", style: "font-size:12px;font-weight:600;fill:var(--accent)" },

    // MTI detail panel
    { id: "mti_detail", type: "box", x: 80, y: 70, w: 1120, h: 520, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "mti_title", type: "label", x: 640, y: 98, label: "MTI — Message Type Indicator (4 dígitos)", style: "font-size:16px;font-weight:700;fill:var(--accent)" },
    { id: "mti_d1", type: "label", x: 640, y: 130, label: "Cada dígito tem um significado diferente", style: "font-size:12px;fill:var(--ink-soft)" },
    ...[
      ["Dígito 1 — Versão",   "0=ISO 8583:1987  1=ISO 8583:2003"],
      ["Dígito 2 — Classe",   "0=Financeira  2=Info/Manutenção  4=Reversal"],
      ["Dígito 3 — Função",   "0=Request  1=Response  2=Advice  3=Advice Resp"],
      ["Dígito 4 — Origem",   "0=Acquirer  2=Issuer  4=Other  6=Other Auth"],
    ].map(([label, val], i) => [
      { id: `mti_row_${i}`, type: "box", x: 160, y: 160 + i * 80, w: W - 320, h: 62, rx: 8, style: "fill:var(--accent);opacity:0.1" },
      { id: `mti_row_${i}_t`, type: "label", x: W / 2, y: 178 + i * 80, label: label, style: "font-size:12px;font-weight:700;fill:var(--accent)" },
      { id: `mti_row_${i}_d`, type: "label", x: W / 2, y: 198 + i * 80, label: val,   style: "font-size:11px;fill:var(--ink-soft)" },
    ]).flat(),
    { id: "mti_ex", type: "box", x: 160, y: 492, w: W - 320, h: 70, rx: 8, style: "fill:var(--good);opacity:0.15" },
    { id: "mti_ex_t", type: "label", x: W / 2, y: 512, label: "Exemplos comuns", style: "font-size:12px;font-weight:700;fill:var(--good)" },
    { id: "mti_e1", type: "label", x: 640, y: 534, label: "0100=Auth Request  0110=Auth Response  0200=Financial  0400=Reversal  0800=Network Mgmt", style: "font-size:11px;fill:var(--ink-soft)" },

    // Bitmap detail
    { id: "bmp_detail", type: "box", x: 80, y: 70, w: 1120, h: 540, rx: 12, style: "fill:var(--surface);stroke:var(--accent-2);stroke-width:2" },
    { id: "bmp_title", type: "label", x: 640, y: 98, label: "Bitmap — Quais campos estão presentes", style: "font-size:16px;font-weight:700;fill:var(--accent-2)" },
    { id: "bmp_d1", type: "label", x: 640, y: 130, label: "O bitmap é uma máscara de bits: bit N=1 significa que o DE N está presente na mensagem", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "bmp_d2", type: "label", x: 640, y: 154, label: "Bitmap primário: DEs 1-64. Bit 1 do bitmap primário=1 → bitmap secundário presente (DEs 65-128)", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "bmp_visual", type: "box", x: 160, y: 178, w: W - 320, h: 160, rx: 8, style: "fill:var(--muted);opacity:0.2" },
    { id: "bmp_bytes", type: "label", x: W / 2, y: 200, label: "Bitmap (hex): F2 3A C4 81 E0 28 40 C0", style: "font-size:13px;font-family:monospace;fill:var(--accent-2)" },
    { id: "bmp_bits", type: "label", x: W / 2, y: 230, label: "F2 = 1111 0010 → DEs 1,2,3,4,7 presentes (DE1=bitmap secundário)", style: "font-size:11px;font-family:monospace;fill:var(--ink)" },
    { id: "bmp_bits2", type: "label", x: W / 2, y: 254, label: "3A = 0011 1010 → DEs 10,11,12,14 presentes", style: "font-size:11px;font-family:monospace;fill:var(--ink)" },
    { id: "bmp_bits3", type: "label", x: W / 2, y: 278, label: "C4 = 1100 0100 → DEs 17,18,23 presentes", style: "font-size:11px;font-family:monospace;fill:var(--ink)" },
    { id: "bmp_note", type: "label", x: W / 2, y: 314, label: "Eficiência: mensagem contém apenas os campos necessários para cada tipo de transação", style: "font-size:12px;fill:var(--accent-2)" },
    // DE reference
    { id: "bmp_de_title", type: "label", x: W / 2, y: 370, label: "Data Elements mais importantes", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    ...[
      ["DE 2", "PAN", "Primary Account Number (número do cartão)"],
      ["DE 3", "Proc Code", "000000=Compra, 010000=Saque, 200000=Crédito"],
      ["DE 4", "Amount", "Valor em centavos, sem vírgula (150,00 = 000000015000)"],
      ["DE 11", "STAN", "System Trace Audit Number — identificador único por transação"],
      ["DE 37", "RRN", "Retrieval Reference Number — referência do adquirente"],
      ["DE 39", "Response", "00=Approved, 05=Do not honor, 14=Invalid card, 51=Insufficient funds"],
    ].map(([de, name, desc], i) => [
      { id: `de_ref_${i}`, type: "label", x: 200, y: 400 + i * 22, label: `${de} (${name}):`, style: "font-size:10px;font-weight:700;font-family:monospace;fill:var(--accent-2);text-anchor:start" },
      { id: `de_ref_${i}_d`, type: "label", x: 420, y: 400 + i * 22, label: desc, style: "font-size:10px;fill:var(--ink-soft);text-anchor:start" },
    ]).flat(),

    // Reversal / Settlement panel
    { id: "rev_panel", type: "box", x: 80, y: 70, w: 1120, h: 400, rx: 12, style: "fill:var(--surface);stroke:var(--hot);stroke-width:1.5" },
    { id: "rev_title", type: "label", x: 640, y: 98, label: "Reversão e Cancelamento", style: "font-size:16px;font-weight:700;fill:var(--hot)" },
    { id: "rev_d1", type: "label", x: 640, y: 130, label: "Reversão (MTI 0400): cancela uma autorização — timeout, falha de comunicação", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "rev_d2", type: "label", x: 640, y: 154, label: "Cancelamento (MTI 0200 + Processing Code 020000): devolução pós-captura", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "rev_flow1", type: "label", x: 640, y: 200, label: "Fluxo de Reversão:", style: "font-size:13px;font-weight:700;fill:var(--hot)" },
    { id: "rev_f1", type: "label", x: 640, y: 224, label: "POS timeout → envia 0400 com mesmo STAN do 0100 → Emissor libera bloqueio", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "rev_sett", type: "box", x: 160, y: 260, w: W - 320, h: 140, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "rev_sett_t", type: "label", x: 640, y: 282, label: "Settlement (Liquidação — MTI 0500/0510)", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "rev_s1", type: "label", x: 640, y: 306, label: "Ao final do dia, Adquirente envia batch de todas as transações capturadas para a Bandeira", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "rev_s2", type: "label", x: 640, y: 326, label: "Bandeira faz clearing e debita Emissor, credita Adquirente (menos interchange fee)", style: "font-size:12px;fill:var(--ink-soft)" },
    { id: "rev_s3", type: "label", x: 640, y: 348, label: "Authorização ≠ Captura: autorizar reserva, capturar efetiva a cobrança (MTI 0200)", style: "font-size:12px;fill:var(--good);font-weight:600" },
    { id: "rev_s4", type: "label", x: 640, y: 370, label: "D+1 ou D+2: prazo para liquidação financeira para o lojista", style: "font-size:12px;fill:var(--ink-soft)" },

    // Response codes panel
    { id: "rc_panel", type: "box", x: 80, y: 70, w: 1120, h: 500, rx: 12, style: "fill:var(--surface);stroke:var(--good);stroke-width:1.5" },
    { id: "rc_title", type: "label", x: 640, y: 98, label: "Códigos de Resposta (DE39)", style: "font-size:16px;font-weight:700;fill:var(--good)" },
    { id: "rc_d1", type: "label", x: 640, y: 130, label: "O DE39 na resposta (0110) indica o resultado da autorização", style: "font-size:12px;fill:var(--ink-soft)" },
    ...[
      ["00", "Approved", "var(--good)"],
      ["05", "Do not honor", "var(--hot)"],
      ["14", "Invalid card number", "var(--hot)"],
      ["51", "Insufficient funds", "var(--warn)"],
      ["54", "Expired card", "var(--warn)"],
      ["55", "Incorrect PIN", "var(--hot)"],
      ["57", "Transaction not permitted", "var(--hot)"],
      ["61", "Exceeds withdrawal limit", "var(--warn)"],
      ["91", "Issuer unavailable", "var(--accent-2)"],
      ["96", "System malfunction", "var(--accent-2)"],
    ].map(([code, desc, color], i) => [
      { id: `rc_${i}`, type: "box", x: i < 5 ? 130 : 640, y: 160 + (i % 5) * 56, w: 460, h: 44, rx: 6, style: `fill:${color};opacity:0.1;stroke:${color};stroke-width:1` },
      { id: `rc_${i}_code`, type: "label", x: (i < 5 ? 130 : 640) + 40, y: 160 + (i % 5) * 56 + 22, label: code, style: `font-size:14px;font-weight:700;font-family:monospace;fill:${color}` },
      { id: `rc_${i}_desc`, type: "label", x: (i < 5 ? 130 : 640) + 100, y: 160 + (i % 5) * 56 + 22, label: desc, style: "font-size:12px;fill:var(--ink-soft);text-anchor:start" },
    ]).flat(),
    { id: "rc_note", type: "label", x: 640, y: 465, label: "Cada bandeira pode ter códigos proprietários além do padrão ISO — documentação específica necessária", style: "font-size:11px;fill:var(--ink-soft)" },

    // Quiz
    { id: "quiz_panel", type: "box", x: 80, y: 50, w: 1120, h: 620, rx: 12, style: "fill:var(--surface);stroke:var(--accent);stroke-width:2" },
    { id: "quiz_title", type: "label", x: 640, y: 80, label: "Quiz — ISO 8583", style: "font-size:18px;font-weight:700;fill:var(--ink)" },
    { id: "q1", type: "label", x: 640, y: 136, label: "Q: O que é o MTI no ISO 8583?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q1a", type: "label", x: 640, y: 162, label: "A: Message Type Indicator — 4 dígitos que identificam versão, classe, função e origem da mensagem", style: "font-size:12px;fill:var(--good)" },
    { id: "q2", type: "label", x: 640, y: 212, label: "Q: O que faz o Bitmap na mensagem?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q2a", type: "label", x: 640, y: 238, label: "A: Indica quais Data Elements estão presentes. Bit N=1 → DE N está na mensagem.", style: "font-size:12px;fill:var(--good)" },
    { id: "q3", type: "label", x: 640, y: 288, label: "Q: O que é o STAN (DE11)?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q3a", type: "label", x: 640, y: 314, label: "A: System Trace Audit Number — número único que identifica a transação no sistema do adquirente", style: "font-size:12px;fill:var(--good)" },
    { id: "q4", type: "label", x: 640, y: 364, label: "Q: Qual a diferença entre Autorização e Captura?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q4a", type: "label", x: 640, y: 390, label: "A: Autorização (0100) reserva o limite. Captura (0200) efetiva a cobrança para settlement.", style: "font-size:12px;fill:var(--good)" },
    { id: "q5", type: "label", x: 640, y: 440, label: "Q: O que significa DE39=51?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q5a", type: "label", x: 640, y: 466, label: "A: Insufficient funds — saldo insuficiente. O Emissor recusou a transação por falta de limite.", style: "font-size:12px;fill:var(--good)" },
    { id: "q6", type: "label", x: 640, y: 516, label: "Q: O que é o MTI 0400?", style: "font-size:13px;fill:var(--ink)" },
    { id: "q6a", type: "label", x: 640, y: 542, label: "A: Reversal Request — cancela uma autorização anterior. Enviado em caso de timeout ou falha.", style: "font-size:12px;fill:var(--good)" },

    // Summary
    { id: "sum_panel", type: "box", x: 60, y: 40, w: 1160, h: 640, rx: 12, style: "fill:var(--surface);stroke:var(--line);stroke-width:1.5" },
    { id: "sum_title", type: "label", x: 640, y: 68, label: "ISO 8583 — Resumo", style: "font-size:20px;font-weight:700;fill:var(--ink)" },
    { id: "sum_str", type: "box", x: 100, y: 96, w: 460, h: 200, rx: 8, style: "fill:var(--accent);opacity:0.1" },
    { id: "sum_str_t", type: "label", x: 330, y: 116, label: "Estrutura da Mensagem", style: "font-size:13px;font-weight:700;fill:var(--accent)" },
    { id: "sum_s1", type: "label", x: 330, y: 140, label: "MTI (4 dígitos): tipo, versão, origem", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_s2", type: "label", x: 330, y: 160, label: "Bitmap (64/128 bits): campos presentes", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_s3", type: "label", x: 330, y: 180, label: "Data Elements: dados variáveis da transação", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_s4", type: "label", x: 330, y: 200, label: "DE2=PAN, DE4=Amount, DE11=STAN, DE37=RRN", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_s5", type: "label", x: 330, y: 220, label: "DE39=Response Code (00=OK, 05=Recusa...)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_s6", type: "label", x: 330, y: 248, label: "Mensagem binária compacta — eficiência máxima", style: "font-size:11px;fill:var(--accent)" },
    { id: "sum_flow2", type: "box", x: 680, y: 96, w: 440, h: 200, rx: 8, style: "fill:var(--good);opacity:0.1" },
    { id: "sum_flow2_t", type: "label", x: 900, y: 116, label: "Fluxo de Autorização", style: "font-size:13px;font-weight:700;fill:var(--good)" },
    { id: "sum_f1", type: "label", x: 900, y: 140, label: "1. POS → Adquirente: 0100 Auth Req", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_f2", type: "label", x: 900, y: 160, label: "2. Adquirente → Bandeira → Emissor", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_f3", type: "label", x: 900, y: 180, label: "3. Emissor decide: 0110 Response", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_f4", type: "label", x: 900, y: 200, label: "4. Resposta volta: DE39=00 Aprovado", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_f5", type: "label", x: 900, y: 220, label: "5. POS exibe 'APROVADO'", style: "font-size:11px;fill:var(--good)" },
    { id: "sum_f6", type: "label", x: 900, y: 248, label: "Total < 2 segundos (OTP: < 300ms)", style: "font-size:11px;fill:var(--accent)" },
    { id: "sum_kp", type: "box", x: 100, y: 318, w: 1020, h: 240, rx: 8, style: "fill:var(--surface);stroke:var(--line);stroke-width:1" },
    { id: "sum_kp_t", type: "label", x: 610, y: 338, label: "Pontos-chave", style: "font-size:13px;font-weight:700;fill:var(--ink)" },
    { id: "sum_k1", type: "label", x: 330, y: 364, label: "Protocolo binário compacto (não JSON/XML)", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k2", type: "label", x: 330, y: 384, label: "Idempotência via STAN + RRN", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k3", type: "label", x: 330, y: 404, label: "Reversão obrigatória em timeout", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k4", type: "label", x: 330, y: 424, label: "Settlement: captura ≠ liquidação financeira", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k5", type: "label", x: 330, y: 444, label: "Cada bandeira tem extensões proprietárias", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k6", type: "label", x: 890, y: 364, label: "PCI-DSS: protege PAN em trânsito e repouso", style: "font-size:11px;fill:var(--hot)" },
    { id: "sum_k7", type: "label", x: 890, y: 384, label: "Tokenização: PAN real → token na rede", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k8", type: "label", x: 890, y: 404, label: "3DS: autenticação adicional em e-commerce", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k9", type: "label", x: 890, y: 424, label: "EMV chip: criptograma gerado no cartão", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_k10", type: "label", x: 890, y: 444, label: "NFC/Contactless: mesmo fluxo ISO 8583", style: "font-size:11px;fill:var(--ink-soft)" },
    { id: "sum_motto", type: "label", x: 610, y: 520, label: "ISO 8583 processa bilhões de transações diárias — padrão global há 30+ anos", style: "font-size:13px;font-weight:600;fill:var(--accent)" },
  ];

  const ALL_IDS = elements.map(e => e.id);
  const ACTOR_IDS = FLOW_ACTORS.flatMap(a => [a.id + "_box", a.id + "_lbl", a.id + "_lf"]);
  const AUTH_MSG_IDS = ["auth_req","auth_fwd","auth_net","auth_rsp_iss","auth_rsp_net","auth_rsp_pos"].flatMap(id => [id + "_arr", id + "_lbl"]);
  const MSG_FIELD_IDS = ["mti","bmp1","bmp2","de2","de3","de4","de11","de22","de37","de39","de41"].flatMap(id => [id + "_box", id + "_lbl", id + "_val"]);
  const DE_TITLE_IDS = ["de_title"];

  function showBase(ctx) {
    ALL_IDS.forEach(id => ctx.hide(id));
    ctx.show("title_main");
    ctx.show("msg_border"); ctx.show("msg_title");
    MSG_FIELD_IDS.forEach(id => ctx.show(id));
    DE_TITLE_IDS.forEach(id => ctx.show(id));
    ACTOR_IDS.forEach(id => ctx.show(id));
  }

  const steps = [
    {
      title: "O Ecossistema de Pagamentos com Cartão",
      balloon: { anchor: { x: 640, y: 660 }, placement: "top",
        text: "Quando você paga com cartão, uma cadeia de participantes processa a transação: POS Terminal → Adquirente → Bandeira → Emissor → resposta de volta em < 2 segundos.",
        why: "ISO 8583 é o protocolo que padroniza essas mensagens globalmente desde 1987. Visa Base II e Mastercard IPM são derivações.",
        deep: `<p>Cada participante dessa cadeia tem um papel financeiro distinto, não só técnico: o Adquirente é o banco que atende o lojista (recebe o dinheiro da venda), o Emissor é o banco do portador do cartão (quem efetivamente paga), e a Bandeira roteia e arbitra entre os dois lados sem ser dona do dinheiro em nenhum momento.</p>
<div class="xp-example"><strong>Quem participa da taxa numa venda de R$150,00</strong>Lojista recebe: R$150,00 − taxa de desconto
Adquirente:     parte da taxa (processamento)
Bandeira:       parte da taxa (rede/marca)
Emissor:        parte da taxa (interchange fee)</div>
<p>O PIX, por comparação, dispensa boa parte dessa cadeia — por isso costuma ser mais barato para o lojista, mas ainda não substitui cartão de crédito parcelado nem a aceitação internacional que o ISO 8583 já resolveu há décadas.</p>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("eco_panel"); ctx.show("eco_title");
        [0,1,2,3,4].forEach(i => { ctx.show(`eco_node_${i}`); ctx.show(`eco_node_${i}_lbl`); });
        [0,1,2,3].forEach(i => ctx.show(`eco_arr_${i}`));
        ctx.show("eco_d1"); ctx.show("eco_d2");
        ctx.show("eco_roles"); ctx.show("eco_r_t");
        ["eco_r1","eco_r1d","eco_r2","eco_r2d","eco_r3","eco_r3d","eco_r4","eco_r4d","eco_r5","eco_r5d","eco_r6","eco_r6d","eco_note"].forEach(id => ctx.show(id));
      }
    },
    {
      title: "O que é ISO 8583?",
      balloon: { anchor: "msg_title", placement: "right",
        text: "ISO 8583 define o formato binário das mensagens financeiras entre sistemas de pagamento. Uma mensagem consiste em: MTI + Bitmap + Data Elements.",
        why: "Formato binário compacto (não JSON) para minimizar latência em links de baixa largura de banda.",
        deep: `<p>Diferente de um payload JSON auto-descritivo (onde cada valor vem com o nome do campo do lado), o ISO 8583 depende do bitmap e de um dicionário de Data Elements conhecido por ambos os lados para saber o que cada bloco de bytes significa — é mais compacto, mas exige que emissor e adquirente concordem exatamente com a especificação de campos.</p>
<div class="xp-example"><strong>Estrutura de uma mensagem 0100</strong>MTI:              0100
Bitmap primário:   F2 3A C4 81 E0 28 40 C0
DE2  (PAN):        4111111111111111
DE3  (Proc Code):  000000
DE4  (Amount):     000000015000
DE11 (STAN):       123456
...</div>
<p>Não existem vírgulas, chaves ou aspas — cada Data Element tem um formato fixo ou um comprimento variável precedido por um indicador (LLVAR/LLLVAR), tudo definido pela especificação, não pela mensagem em si.</p>` },
      enter(ctx) { showBase(ctx); }
    },
    {
      title: "MTI: Message Type Indicator",
      balloon: {
        anchor: "mti_box", placement: "right",
        text: "O MTI é um número de 4 dígitos que define a versão, classe, função e origem da mensagem. 0100 = Auth Request, 0110 = Auth Response.",
        why: "O MTI é o primeiro campo de toda mensagem ISO 8583 — determina como o restante deve ser interpretado.",
        deep: `<p>Pense no MTI como o "envelope" da mensagem: antes mesmo de ler qualquer dado da transação, o sistema já sabe, só pelos 4 dígitos, se está lidando com um pedido de autorização, uma resposta, um estorno ou uma mensagem de rede.</p>
<div class="xp-example"><strong>Decodificando 0100</strong>Dígito 1 (0): versão ISO 8583:1987
Dígito 2 (1): classe Financeira
Dígito 3 (0): função Request
Dígito 4 (0): origem Acquirer</div>
<p>Por isso o par 0100/0110 é tão comum na prática: mesma classe (Financeira), mesma origem, só muda o dígito de função (0=Request, 1=Response) — um padrão que se repete em quase toda troca de mensagens do protocolo.</p>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("mti_detail"); ctx.show("mti_title"); ctx.show("mti_d1");
        [0,1,2,3].forEach(i => { ctx.show(`mti_row_${i}`); ctx.show(`mti_row_${i}_t`); ctx.show(`mti_row_${i}_d`); });
        ctx.show("mti_ex"); ctx.show("mti_ex_t"); ctx.show("mti_e1");
      }
    },
    {
      title: "Bitmap: Quais Campos Estão Presentes",
      balloon: {
        anchor: "bmp1_box", placement: "right",
        text: "O Bitmap é uma máscara binária de 64 bits (ou 128 com secundário). Cada bit indica se o DE correspondente está presente. 64 bits = 8 bytes de overhead.",
        why: "Eficiência: uma mensagem de autorização usa ~20 DEs de 128 possíveis. O bitmap evita transmitir campos vazios.",
        deep: `<p>O bitmap é o que torna o ISO 8583 eficiente sem precisar de um formato auto-descritivo como JSON — em vez de mandar 128 campos, a maioria vazios, a mensagem manda só os bits indicando quais estão presentes, seguidos apenas dos DEs realmente usados.</p>
<div class="xp-example"><strong>Lendo um byte do bitmap</strong>Byte 1 do bitmap: F2 (hex) = 1111 0010 (binário)
Bit 1 = 1 → DE1 presente (indica bitmap secundário)
Bit 2 = 1 → DE2 presente (PAN)
Bit 3 = 1 → DE3 presente (Processing Code)
Bit 6 = 0 → DE6 ausente nesta mensagem</div>
<p>É por isso que a mesma mensagem 0100 pode ter tamanhos diferentes dependendo da transação — uma compra simples usa menos DEs que uma transação parcelada com múltiplos dados adicionais.</p>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("bmp_detail"); ctx.show("bmp_title"); ctx.show("bmp_d1"); ctx.show("bmp_d2");
        ctx.show("bmp_visual"); ctx.show("bmp_bytes"); ctx.show("bmp_bits"); ctx.show("bmp_bits2"); ctx.show("bmp_bits3"); ctx.show("bmp_note");
        ctx.show("bmp_de_title");
        [0,1,2,3,4,5].forEach(i => { ctx.show(`de_ref_${i}`); ctx.show(`de_ref_${i}_d`); });
      }
    },
    {
      title: "Data Elements: Os Campos da Transação",
      balloon: {
        anchor: "de_title", placement: "right",
        text: "Cada DE tem número, formato e tamanho definidos. DE2=PAN, DE4=Amount (centavos, sem ponto), DE11=STAN, DE37=RRN, DE39=Response Code.",
        why: "Conhecer os DEs principais é essencial para debugar transações e integrar com sistemas de pagamento.",
        deep: `<p>Cada Data Element tem uma "ficha técnica" fixa na especificação ISO 8583: tamanho fixo ou variável, tipo (numérico, alfanumérico, binário) e formato — sem essa ficha compartilhada entre os dois lados, seria impossível interpretar os bytes crus.</p>
<div class="xp-good"><strong>Formato fixo vs variável</strong>DE4 (Amount): sempre 12 dígitos fixos, preenchido com zeros à esquerda (000000015000 = R$150,00)
DE43 (Nome do lojista): campo LLVAR — 2 dígitos indicam o tamanho, seguido do conteúdo de tamanho variável</div>
<p>Debugar uma transação problemática normalmente significa decodificar o bitmap, achar quais DEs estão presentes, e comparar valor a valor com o que era esperado — sem ferramenta de parsing, é trabalho manual tedioso.</p>` },
      enter(ctx) { showBase(ctx); }
    },
    {
      title: "Fluxo: POS → Adquirente → Bandeira → Emissor",
      balloon: {
        anchor: { x: FLOW_X + 280, y: 560 }, placement: "top",
        text: "O POS envia o 0100 Auth Request ao Adquirente, que roteia para a Bandeira, que encaminha ao Emissor. O Emissor verifica saldo/limite e responde com 0110.",
        why: "Toda essa cadeia ocorre em < 2 segundos. Sistemas com SLA apertado (ex: 300ms) usam rotas diretas.",
        deep: `<p>Cada salto da cadeia adiciona latência de rede real — por isso processadoras investem pesado em conexões dedicadas de baixa latência entre adquirentes, bandeiras e emissores, em vez de depender da internet pública.</p>
<div class="xp-example"><strong>Onde o tempo é gasto (ordem de grandeza)</strong>POS → Adquirente: ~50-100ms
Adquirente → Bandeira: ~50-100ms
Bandeira → Emissor: ~50-100ms
Processamento no Emissor (validação, fraude, saldo): variável
Volta: mesmo caminho, em sentido inverso</div>
<p>Se qualquer salto falhar ou expirar, o fluxo de reversão (MTI 0400) entra em ação para garantir que o valor não fique "preso" — veja a cena de Reversão e Settlement à frente.</p>` },
      enter(ctx) {
        showBase(ctx);
        AUTH_MSG_IDS.forEach(id => ctx.show(id));
      }
    },
    {
      title: "Autorização (0100 → 0110)",
      balloon: {
        anchor: { x: FLOW_X + 280, y: 560 }, placement: "top",
        text: "0100: Auth Request — contém PAN, amount, terminal ID, STAN. 0110: Auth Response — adiciona DE39 (response code) e DE38 (approval code se aprovado).",
        why: "Autorização apenas reserva o limite no emissor. A cobrança efetiva acontece na Captura (0200).",
        deep: `<p>É crucial entender que uma autorização aprovada NÃO é uma cobrança efetivada — é uma reserva temporária de limite, análoga a segurar uma mesa num restaurante sem ainda ter pago a conta.</p>
<div class="xp-bad"><strong>Erro comum de quem está aprendendo</strong>Achar que DE39=00 (aprovado) significa que o dinheiro já saiu da conta do portador — na verdade, o valor fica "bloqueado" até a Captura confirmar a cobrança.</div>
<div class="xp-good"><strong>Ciclo completo</strong>Autorização (0100/0110) → reserva o limite → Captura (0200) → efetiva a cobrança → Settlement (0500) → liquidação financeira entre os bancos</div>` },
      enter(ctx) {
        showBase(ctx);
        AUTH_MSG_IDS.forEach(id => ctx.show(id));
      }
    },
    {
      title: "Códigos de Resposta (DE39)",
      balloon: {
        anchor: { x: 640, y: 530 }, placement: "top",
        text: "DE39 é o mais importante da resposta: 00=Aprovado, 05=Do not honor, 51=Saldo insuficiente, 14=Cartão inválido, 91=Emissor indisponível.",
        why: "Tratar corretamente cada código de resposta é obrigatório para boa UX e conformidade com as bandeiras.",
        deep: `<p>Tratar cada código de resposta de forma específica é o que separa uma boa experiência de checkout de uma ruim — mostrar "Cartão recusado" genérico para um DE39=51 (saldo insuficiente) confunde o cliente, que poderia simplesmente tentar outro cartão.</p>
<div class="xp-example"><strong>Como cada código deveria orientar a UX</strong>05 (Do not honor) → "Cartão recusado pelo banco emissor, tente outro cartão"
51 (Saldo insuficiente) → "Saldo/limite insuficiente"
54 (Cartão expirado) → "Cartão vencido, verifique a validade"
91 (Emissor indisponível) → "Tente novamente em instantes" (é temporário, vale retry)</div>
<p>Alguns códigos (como 91 e 96) indicam problemas temporários do lado do emissor — sistemas bem desenhados fazem retry automático nesses casos, diferente dos códigos de recusa definitiva.</p>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("rc_panel"); ctx.show("rc_title"); ctx.show("rc_d1");
        [0,1,2,3,4,5,6,7,8,9].forEach(i => { ctx.show(`rc_${i}`); ctx.show(`rc_${i}_code`); ctx.show(`rc_${i}_desc`); });
        ctx.show("rc_note");
      }
    },
    {
      title: "Reversão e Settlement",
      balloon: {
        anchor: { x: 640, y: 500 }, placement: "top",
        text: "0400 Reversal cancela autorização após timeout. Settlement (0500) é o batch end-of-day: Adquirente envia todas as capturas para liquidação financeira.",
        why: "Sem reversão em timeout, o Emissor mantém o saldo bloqueado por horas. Settlement fecha o ciclo financeiro.",
        deep: `<p>Reversão e Settlement resolvem dois problemas completamente diferentes: reversão é sobre corrigir uma falha de comunicação (o "e se a resposta se perder?"); settlement é sobre o ciclo financeiro normal de todo dia.</p>
<div class="xp-example"><strong>Por que a reversão usa o mesmo STAN</strong>0100 original: STAN=123456
0400 Reversal:  STAN=123456 (mesmo valor!)
→ O Emissor usa o STAN para encontrar exatamente qual autorização cancelar</div>
<p>Sem esse mecanismo, um timeout de rede deixaria o limite do cliente bloqueado até o expirar automático da autorização (que pode levar horas) — a reversão libera isso de forma imediata e deliberada.</p>` },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("title_main");
        ctx.show("rev_panel"); ctx.show("rev_title"); ctx.show("rev_d1"); ctx.show("rev_d2"); ctx.show("rev_flow1"); ctx.show("rev_f1");
        ctx.show("rev_sett"); ctx.show("rev_sett_t"); ctx.show("rev_s1"); ctx.show("rev_s2"); ctx.show("rev_s3"); ctx.show("rev_s4");
      }
    },
    {
      title: "Quiz",
      balloon: { anchor: { x: 640, y: 360 }, placement: "bottom", text: "Teste seu conhecimento sobre ISO 8583:" },
      quiz: {
        question: "O que o Bitmap de uma mensagem ISO 8583 indica?",
        options: [
          "O tipo de transação: compra, saque ou estorno",
          "Quais Data Elements estão presentes na mensagem (bit 1 = campo presente)",
          "A chave criptográfica usada para assinar a mensagem",
          "O código de resposta retornado pelo emissor"
        ],
        answer: 1,
        explain: "O Bitmap é uma máscara de 64 bits (ou 128 com bitmap secundário). Cada bit 1 indica que o Data Element correspondente está presente: bit 2 = DE2 (PAN), bit 4 = DE4 (Valor), bit 11 = DE11 (STAN), etc."
      }
    },
    {
      title: "Resumo",
      balloon: {
        anchor: { x: 640, y: 680 }, placement: "top",
        text: "ISO 8583 = MTI + Bitmap + Data Elements. Autorização 0100/0110 em < 2s. Captura + Settlement fecham o ciclo financeiro.",
      },
      enter(ctx) {
        ALL_IDS.forEach(id => ctx.hide(id));
        ctx.show("sum_panel"); ctx.show("sum_title");
        ["sum_str","sum_str_t","sum_s1","sum_s2","sum_s3","sum_s4","sum_s5","sum_s6",
         "sum_flow2","sum_flow2_t","sum_f1","sum_f2","sum_f3","sum_f4","sum_f5","sum_f6",
         "sum_kp","sum_kp_t","sum_k1","sum_k2","sum_k3","sum_k4","sum_k5",
         "sum_k6","sum_k7","sum_k8","sum_k9","sum_k10","sum_motto"].forEach(id => ctx.show(id));
      }
    }
  ];

  window.ISO8583_DIAGRAM = { title: "ISO 8583", subtitle: "MTI · Bitmap · Data Elements · Auth Flow · Settlement", width: W, height: H, autoplayMs: 8000, elements, steps };
})();
