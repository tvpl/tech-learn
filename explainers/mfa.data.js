(function () {
  const W = 1280, H = 720;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, text, color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, text, color: color || 'var(--muted)', fontSize: 12 };
  }
  function arr(id, x1, y1, x2, y2, text, color) {
    return [
      { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: (x1 + x2) / 2, y: (y1 + y2) / 2 - 12, text, color: color || 'var(--accent)', fontSize: 11 },
    ];
  }

  /* ── 3 factor columns at the top ── */
  const FC = [
    { id: 'f_know', x: 60,  label: '🧠 O que você\nSABE',  sub: 'Senha, PIN, pergunta\nsecreta', color: 'var(--accent)' },
    { id: 'f_have', x: 450, label: '📱 O que você\nTEM',   sub: 'TOTP, FIDO2,\nSMS OTP', color: 'var(--accent-2)' },
    { id: 'f_is',   x: 840, label: '👤 O que você\nÉ',     sub: 'Biometria (face,\nimpressão digital)', color: 'var(--good)' },
  ];
  const FW = 320, FH = 70;

  /* TOTP internals */
  const TX = 420, TY = 180;
  /* WebAuthn flow */
  const WAX = 700, WAY = 170;
  /* Login flow */
  const LFX = 60, LFY = 420;

  const elements = [
    /* factor columns */
    ...FC.map(f => box(f.id, f.x, 30, FW, FH, f.label, f.color)),
    ...FC.map(f => lbl(f.id + '_sub', f.x + FW / 2, 30 + FH + 16, f.sub, 'var(--muted)')),

    /* TOTP panel */
    box('totp_bg', TX, TY, 250, 210, '', 'var(--panel)'),
    lbl('totp_title', TX + 125, TY + 18, '⏱ TOTP (RFC 6238)', 'var(--accent-2)'),
    lbl('t1', TX + 10, TY + 44, 'Fórmula:', 'var(--muted)'),
    box('totp_form', TX + 10, TY + 58, 230, 26, 'HMAC-SHA1(secret, ⌊time/30⌋)', 'var(--panel-2)'),
    lbl('t2', TX + 10, TY + 98, '→ últimos 6 dígitos = OTP', 'var(--ink-soft)'),
    lbl('t3', TX + 10, TY + 118, 'Janela: ±1 passo (clock drift)', 'var(--ink-soft)'),
    lbl('t4', TX + 10, TY + 140, 'Secret: base32 no QR code', 'var(--ink-soft)'),
    box('totp_qr', TX + 10, TY + 158, 230, 28, 'otpauth://totp/App?secret=BASE32...', 'var(--panel-2)'),
    lbl('t5', TX + 10, TY + 198, 'Apps: Google Auth, Authy', 'var(--muted)'),

    /* WebAuthn panel */
    box('wa_bg', WAX, WAY, 290, 220, '', 'var(--panel)'),
    lbl('wa_title', WAX + 145, WAY + 18, '🔐 FIDO2 / WebAuthn', 'var(--good)'),
    lbl('w1', WAX + 10, WAY + 44, 'Registro:', 'var(--muted)'),
    lbl('w2', WAX + 10, WAY + 64, 'credentials.create() → attestation', 'var(--ink-soft)'),
    lbl('w3', WAX + 10, WAY + 84, 'Servidor guarda public key + credential_id', 'var(--ink-soft)'),
    lbl('w4', WAX + 10, WAY + 108, 'Autenticação:', 'var(--muted)'),
    lbl('w5', WAX + 10, WAY + 128, 'credentials.get() → assertion assinada', 'var(--ink-soft)'),
    lbl('w6', WAX + 10, WAY + 148, 'Servidor verifica com public key stored', 'var(--ink-soft)'),
    lbl('w7', WAX + 10, WAY + 172, 'Phishing-resistant:', 'var(--good)'),
    lbl('w8', WAX + 10, WAY + 192, 'challenge vinculado ao domínio → sites falsos falham', 'var(--good)'),
    lbl('w9', WAX + 10, WAY + 212, 'Private key NUNCA sai do device', 'var(--good)'),

    /* SMS OTP warning */
    box('sms_bg', WAX, WAY + 240, 290, 80, '', 'var(--panel)'),
    lbl('sms_title', WAX + 145, WAY + 258, '📵 SMS OTP — Inseguro', 'var(--hot)'),
    lbl('sms1', WAX + 10, WAY + 278, 'SIM swap: atacante redireciona seu número', 'var(--hot)'),
    lbl('sms2', WAX + 10, WAY + 298, 'SS7 attack: intercepta SMS na rede telecom', 'var(--hot)'),
    lbl('sms3', WAX + 10, WAY + 316, 'Usar apenas como fallback, não único 2FA', 'var(--warn)'),

    /* Login flow sequence */
    box('lf_user', LFX, LFY, 130, 50, '👤 Usuário', 'var(--accent)'),
    box('lf_app', LFX + 200, LFY, 130, 50, '🌐 App', 'var(--accent-2)'),
    box('lf_srv', LFX + 400, LFY, 130, 50, '⚙️ Servidor', 'var(--good)'),
    ...arr('lfa1', LFX + 130, LFY + 25, LFX + 200, LFY + 25, '① Usuário + Senha', 'var(--accent)'),
    ...arr('lfa2', LFX + 330, LFY + 25, LFX + 400, LFY + 25, '② Verifica senha', 'var(--accent-2)'),
    ...arr('lfa3', LFX + 400, LFY + 35, LFX + 200, LFY + 35, '③ Pede 2º fator', 'var(--warn)'),
    ...arr('lfa4', LFX + 200, LFY + 40, LFX + 130, LFY + 40, '③ Exibe TOTP prompt', 'var(--warn)'),
    ...arr('lfa5', LFX + 130, LFY + 50, LFX + 200, LFY + 50, '④ Código TOTP: 847291', 'var(--accent-2)'),
    ...arr('lfa6', LFX + 330, LFY + 50, LFX + 400, LFY + 50, '⑤ Valida TOTP', 'var(--accent-2)'),
    ...arr('lfa7', LFX + 400, LFY + 60, LFX + 200, LFY + 60, '⑥ Sessão criada', 'var(--good)'),

    /* Backup codes panel */
    box('bk_bg', LFX, LFY + 130, 560, 100, '', 'var(--panel)'),
    lbl('bk_title', LFX + 280, LFY + 148, '🔑 Backup Codes & Recovery', 'var(--warn)'),
    lbl('bk1', LFX + 10, LFY + 170, 'Gerados no setup → imprimir/guardar em lugar seguro', 'var(--ink-soft)'),
    lbl('bk2', LFX + 10, LFY + 190, 'Uso único ("break glass" — perdi o device)', 'var(--ink-soft)'),
    lbl('bk3', LFX + 10, LFY + 210, '8-10 códigos de 8 dígitos → guardar hash no servidor', 'var(--muted)'),

    /* Phishing resistant panel */
    box('phi_bg', LFX + 580, LFY, 360, 160, '', 'var(--panel)'),
    lbl('phi_title', LFX + 760, LFY + 18, '🛡️ Phishing-Resistance', 'var(--good)'),
    lbl('phi1', LFX + 590, LFY + 44, 'TOTP: NÃO é phishing-resistant', 'var(--hot)'),
    lbl('phi2', LFX + 590, LFY + 64, '→ user pode digitar código em site falso', 'var(--hot)'),
    lbl('phi3', LFX + 590, LFY + 88, 'FIDO2: SIM, é phishing-resistant', 'var(--good)'),
    lbl('phi4', LFX + 590, LFY + 108, '→ challenge inclui origin (domínio real)', 'var(--good)'),
    lbl('phi5', LFX + 590, LFY + 128, '→ falha silenciosamente em site falso', 'var(--good)'),
    lbl('phi6', LFX + 590, LFY + 148, '→ recomendado para alta segurança', 'var(--good)'),

    /* comparison: why MFA matters */
    box('why_bg', 60, 170, 340, 200, '', 'var(--panel)'),
    lbl('why_title', 230, 188, '⚠️ Por que 1 fator não basta', 'var(--hot)'),
    lbl('why1', 70, 212, 'Phishing: roubo de senha em site falso', 'var(--hot)'),
    lbl('why2', 70, 232, 'Credential stuffing: 8B+ credenciais vazadas', 'var(--hot)'),
    lbl('why3', 70, 252, 'Keyloggers: captura de digitação', 'var(--hot)'),
    lbl('why4', 70, 274, 'Com MFA: atacante precisa de senha + device', 'var(--good)'),
    lbl('why5', 70, 296, '→ reduz 99.9% dos ataques de conta', 'var(--good)'),
    lbl('why6', 70, 318, '   (Google internal study, 2019)', 'var(--muted)'),
    lbl('why7', 70, 340, 'TOTP bom | FIDO2 melhor | SMS aceitável', 'var(--ink-soft)'),
    lbl('why8', 70, 360, '(mas SMS melhor que sem nada!)', 'var(--muted)'),
  ];

  const steps = [
    {
      title: 'Por que 1 fator não é suficiente',
      show: ['f_know', 'f_know_sub', 'why_bg', 'why_title', 'why1', 'why2', 'why3', 'why4', 'why5', 'why6', 'why7', 'why8'],
      balloon: {
        anchor: 'f_know', placement: 'right',
        text: 'Credenciais são roubadas constantemente: phishing, credential stuffing, keyloggers. Apenas senha = 1 ponto de falha. MFA adiciona um segundo fator independente.',
      },
    },
    {
      title: 'Os 3 fatores de autenticação',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub'],
      balloon: {
        anchor: 'f_have', placement: 'bottom',
        text: '**Saber** (senha, PIN): fácil de phishing. **Ter** (device com TOTP/FIDO2): precisa roubar o aparelho. **Ser** (biometria): não pode ser compartilhado. MFA combina ≥2 fatores **diferentes**.',
        why: '2FA com duas senhas diferentes não é MFA real — ambas pertencem ao mesmo fator "saber".',
      },
    },
    {
      title: 'TOTP: senha que muda a cada 30s',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub',
             'totp_bg', 'totp_title', 't1', 'totp_form', 't2', 't3', 't4', 'totp_qr', 't5'],
      highlight: ['f_have', 'totp_bg'],
      balloon: {
        anchor: 'totp_bg', placement: 'right',
        text: '`HMAC-SHA1(secret, ⌊time/30⌋)` — ambos o app e servidor calculam o mesmo código com base no **tempo atual** e no segredo compartilhado. Código muda a cada 30s.',
        why: 'O segredo está no QR code do setup. Sem acesso ao device (app authenticator), o código não pode ser gerado.',
      },
    },
    {
      title: 'Setup TOTP: QR code e otpauth URI',
      show: ['f_have', 'f_have_sub',
             'totp_bg', 'totp_title', 't1', 'totp_form', 't2', 't3', 't4', 'totp_qr', 't5'],
      highlight: ['totp_qr'],
      balloon: {
        anchor: 'totp_bg', placement: 'right',
        text: 'O QR code contém: `otpauth://totp/App?secret=BASE32ENCODED&issuer=MinhaApp`. O app authenticator escaneia, armazena o secret e começa a gerar OTPs — sem precisar de internet.',
      },
    },
    {
      title: 'FIDO2 / WebAuthn: chave pública no servidor',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub',
             'wa_bg', 'wa_title', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'],
      highlight: ['f_have', 'f_is', 'wa_bg'],
      balloon: {
        anchor: 'wa_bg', placement: 'left',
        text: 'O authenticator (YubiKey, biometria do phone) gera um par de chaves. O servidor guarda apenas a **chave pública**. A chave privada nunca sai do device.',
        why: 'Mesmo que o servidor seja comprometido, o atacante não pode impersonar o usuário — a private key é inviolável no hardware.',
      },
    },
    {
      title: 'WebAuthn: registro e autenticação',
      show: ['f_have', 'f_have_sub',
             'wa_bg', 'wa_title', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9'],
      balloon: {
        anchor: 'wa_bg', placement: 'right',
        text: '**Registro**: `credentials.create()` → gera chave pública + attestation → servidor armazena.\n**Auth**: `credentials.get()` → assina challenge com private key → servidor verifica com public key. O challenge inclui o domínio → phishing falha.',
      },
    },
    {
      title: 'SMS OTP: conveniente mas inseguro',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub',
             'sms_bg', 'sms_title', 'sms1', 'sms2', 'sms3'],
      highlight: ['sms_bg'],
      balloon: {
        anchor: 'sms_bg', placement: 'left',
        text: '**SIM swap**: atacante convence a operadora a transferir seu número. **SS7 attack**: falha na rede de telecomunicações permite interceptar SMS. SMS OTP é melhor que nada, mas não use como único 2FA.',
      },
    },
    {
      title: 'Fluxo de login com MFA (TOTP)',
      show: ['lf_user', 'lf_app', 'lf_srv',
             'lfa1', 'lfa1_l', 'lfa2', 'lfa2_l', 'lfa3', 'lfa3_l',
             'lfa4', 'lfa4_l', 'lfa5', 'lfa5_l', 'lfa6', 'lfa6_l', 'lfa7', 'lfa7_l'],
      balloon: {
        anchor: 'lf_srv', placement: 'top',
        text: '① Usuário envia senha → ② servidor valida 1º fator → ③ pede código TOTP → ④ usuário abre app e digita código → ⑤ servidor valida TOTP → ⑥ sessão criada. Cada fator é verificado independentemente.',
      },
    },
    {
      title: 'Backup Codes: break glass quando perde o device',
      show: ['lf_user', 'lf_app', 'lf_srv',
             'bk_bg', 'bk_title', 'bk1', 'bk2', 'bk3'],
      balloon: {
        anchor: 'bk_bg', placement: 'right',
        text: 'No momento do setup, o servidor gera 8-10 códigos de uso único. O usuário deve imprimí-los ou guardá-los seguramente. Servidor armazena apenas o hash. Cada código é marcado como "usado" após consumo.',
      },
    },
    {
      title: 'Phishing-Resistance: TOTP vs FIDO2',
      show: ['f_have', 'f_have_sub',
             'totp_bg', 'totp_title', 't1', 'totp_form',
             'wa_bg', 'wa_title', 'w7', 'w8', 'w9',
             'phi_bg', 'phi_title', 'phi1', 'phi2', 'phi3', 'phi4', 'phi5', 'phi6'],
      highlight: ['phi_bg'],
      balloon: {
        anchor: 'phi_bg', placement: 'left',
        text: 'TOTP pode ser phished: o usuário é enganado a digitar o código em um site falso que o repassa em tempo real ao site real. FIDO2 vincula a assinatura ao **domínio de origem** — em site.com.br falso, o challenge falha silenciosamente.',
      },
    },
    {
      title: 'Quiz',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub'],
      quiz: {
        question: 'Por que FIDO2/WebAuthn é considerado "phishing-resistant" enquanto TOTP não é?',
        options: [
          'FIDO2 usa um código mais longo (8 dígitos vs 6 do TOTP)',
          'TOTP expira em 30s, mas FIDO2 não expira nunca',
          'FIDO2 vincula a assinatura ao domínio real — um site falso não consegue o challenge válido',
          'FIDO2 requer conexão com internet enquanto TOTP funciona offline',
        ],
        answer: 2,
        explain: 'No WebAuthn, o servidor inclui no challenge o domínio de origem (`rpId`). O authenticator assina o challenge junto com o domínio. Se o usuário está em `banco-falso.com`, a assinatura incluirá esse domínio — o servidor do banco real rejeitará porque o `rpId` não bate. Com TOTP, o código é válido em qualquer lugar.',
      },
    },
    {
      title: 'Resumo: MFA / 2FA',
      show: ['f_know', 'f_know_sub', 'f_have', 'f_have_sub', 'f_is', 'f_is_sub',
             'totp_bg', 'totp_title', 't1', 'totp_form', 't2', 't3', 'totp_qr',
             'wa_bg', 'wa_title', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8',
             'phi_bg', 'phi_title', 'phi3', 'phi4', 'phi5',
             'bk_bg', 'bk_title', 'bk1', 'bk2'],
      balloon: {
        anchor: 'f_have', placement: 'bottom',
        text: '3 fatores: saber, ter, ser. TOTP (HMAC+tempo) = prático mas phishable. FIDO2 = phishing-resistant, private key no device. SMS = evitar. Backup codes = break glass. MFA reduz 99.9% dos ataques de conta.',
      },
    },
  ];

  window.MFA_DIAGRAM = { title: 'MFA / 2FA — Autenticação Multifator', W, H, elements, steps };
})();
