(function () {
  const W = 1280, H = 720;

  /* ── layout: 3-column sequence diagram ── */
  const CX = 130;   // Client
  const NX = 560;   // Network / Attacker (middle)
  const SX = 1000;  // Server
  const COL_W = 130, COL_H = 60;
  const LY1 = 80, LY2 = H - 30;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, label: text, stroke: color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, label: text, style: `fill:${color || 'var(--muted)'}`, size: 12 };
  }
  function lifeline(id, x, color) {
    return { id, type: 'arrow', x1: x, y1: LY1 + COL_H, x2: x, y2: LY2, noHead: true, dashed: true, color: color || 'var(--line)' };
  }
  function seq(id, x1, x2, y, text, color) {
    const mid = (x1 + x2) / 2;
    return [
      { id, type: 'arrow', x1, y1: y, x2, y2: y, color: color || 'var(--accent)' },
      { id: id + '_l', type: 'label', x: mid, y: y - 12, label: text, style: `fill:${color || 'var(--accent)'}`, size: 11 },
    ];
  }

  const actors = [
    box('col_c', CX - COL_W / 2, LY1, COL_W, COL_H, '🌐 Cliente\n(Browser)', 'var(--accent)'),
    box('col_n', NX - COL_W / 2, LY1, COL_W, COL_H, '🕵️ Network\n(Eve/MITM)', 'var(--hot)'),
    box('col_s', SX - COL_W / 2, LY1, COL_W, COL_H, '🖥️ Servidor\n(TLS)', 'var(--good)'),
  ];

  /* Y positions for messages */
  const Y = {
    http_req:   180, http_intercept: 210,
    client_hello: 270,
    server_hello: 320,
    cert:         360,
    key_ex:       410,
    client_fin:   450,
    server_fin:   480,
    app_data:     530,
    mtls_req:     570,
    mtls_cert:    610,
    mtls_ok:      650,
  };

  /* ── Right panels ── */
  const PX = 720, PW = 530;

  const elements = [
    ...actors,
    lifeline('ll_c', CX, 'var(--accent)'),
    lifeline('ll_n', NX, 'var(--hot)'),
    lifeline('ll_s', SX, 'var(--good)'),

    /* HTTP plaintext (problem) */
    ...seq('http_c2s', CX, NX, Y.http_req,       'GET /api/token  (texto claro!)', 'var(--hot)'),
    ...seq('http_n2s', NX, SX, Y.http_intercept, 'interceptado → lê + modifica', 'var(--hot)'),

    /* TLS Handshake */
    ...seq('client_hello', CX, SX, Y.client_hello,
      'ClientHello: TLS 1.3, cipher_suites, random_C', 'var(--accent)'),
    ...seq('server_hello', SX, CX, Y.server_hello,
      'ServerHello: cipher escolhido, random_S', 'var(--good)'),
    ...seq('cert_send', SX, CX, Y.cert,
      'Certificate: X.509 (Subject, SAN, Issuer, PubKey)', 'var(--good)'),
    ...seq('key_ex', CX, SX, Y.key_ex,
      'ClientKeyShare: ephemeral EC pubkey_C', 'var(--accent)'),
    ...seq('client_fin', CX, SX, Y.client_fin,
      'Finished (HMAC de todo o handshake)', 'var(--accent)'),
    ...seq('server_fin', SX, CX, Y.server_fin,
      'Finished (HMAC de todo o handshake)', 'var(--good)'),
    ...seq('app_data', CX, SX, Y.app_data,
      '🔒 Application Data (AES-256-GCM + AEAD)', 'var(--good)'),

    /* mTLS extension */
    ...seq('mtls_req', SX, CX, Y.mtls_req,
      'CertificateRequest (mTLS)', 'var(--accent-2)'),
    ...seq('mtls_cert', CX, SX, Y.mtls_cert,
      'ClientCertificate: cert do cliente X.509', 'var(--accent-2)'),
    ...seq('mtls_ok', SX, CX, Y.mtls_ok,
      'OK — cliente autenticado (mTLS)', 'var(--good)'),

    /* ── X.509 Certificate Anatomy panel ── */
    box('cert_bg', PX, 20, PW, 220, '', 'var(--panel)'),
    lbl('cert_title', PX + PW / 2, 38, '📄 Anatomia do Certificado X.509', 'var(--ink)'),
    lbl('cx1', PX + 10, 62,  'Subject   → CN=api.empresa.com, O=ACME Corp', 'var(--ink-soft)'),
    lbl('cx2', PX + 10, 82,  'SAN       → DNS:api.empresa.com, DNS:*.empresa.com', 'var(--good)'),
    lbl('cx3', PX + 10, 102, 'Issuer    → CN=Let\'s Encrypt R3', 'var(--ink-soft)'),
    lbl('cx4', PX + 10, 122, 'Validity  → notBefore: 2024-01-01 / notAfter: 2024-04-01', 'var(--warn)'),
    lbl('cx5', PX + 10, 142, 'PublicKey → EC secp256r1 (ou RSA 2048)', 'var(--ink-soft)'),
    lbl('cx6', PX + 10, 162, 'Signature → assinada pela CA com sua private key', 'var(--accent-2)'),
    lbl('cx7', PX + 10, 182, 'Extensions→ KeyUsage, BasicConstraints, CRLDistributionPoints', 'var(--muted)'),
    lbl('cx8', PX + 10, 202, 'SHA-256 fingerprint → identificador único do cert', 'var(--muted)'),
    lbl('cx9', PX + 10, 218, 'Serial Number → único por CA (para revogação CRL/OCSP)', 'var(--muted)'),

    /* ── Chain of Trust panel ── */
    box('chain_bg', PX, 260, PW, 150, '', 'var(--panel)'),
    lbl('chain_title', PX + PW / 2, 278, '🔗 Chain of Trust', 'var(--accent)'),
    box('ca_root', PX + 10, 296, PW - 20, 30, '🏛️ Root CA  (auto-assinada, confiada pelo OS/browser)', 'var(--good)'),
    { id: 'ch_arr1', type: 'arrow', x1: PX + PW / 2, y1: 326, x2: PX + PW / 2, y2: 340, color: 'var(--accent)' },
    box('ca_int', PX + 10, 340, PW - 20, 30, '🏢 Intermediate CA  (assinada pela Root CA)', 'var(--accent-2)'),
    { id: 'ch_arr2', type: 'arrow', x1: PX + PW / 2, y1: 370, x2: PX + PW / 2, y2: 384, color: 'var(--accent)' },
    box('ca_leaf', PX + 10, 384, PW - 20, 30, '🌿 Leaf Cert  api.empresa.com  (assinada pela Intermediate)', 'var(--accent)'),

    /* ── ECDHE Key Exchange panel ── */
    box('ecdhe_bg', PX, 430, PW, 140, '', 'var(--panel)'),
    lbl('ecdhe_title', PX + PW / 2, 448, '🔀 ECDHE — Ephemeral Key Exchange', 'var(--accent-2)'),
    lbl('ec1', PX + 10, 470, 'Cliente: gera (priv_C, pub_C) efêmero', 'var(--ink-soft)'),
    lbl('ec2', PX + 10, 490, 'Servidor: gera (priv_S, pub_S) efêmero', 'var(--ink-soft)'),
    lbl('ec3', PX + 10, 510, 'pre_master = ECDH(priv_C, pub_S) = ECDH(priv_S, pub_C)', 'var(--ink)'),
    lbl('ec4', PX + 10, 530, 'master_secret = PRF(pre_master, random_C + random_S)', 'var(--ink-soft)'),
    lbl('ec5', PX + 10, 548, 'Ephemeral → Perfect Forward Secrecy (PFS)', 'var(--good)'),
    lbl('ec6', PX + 10, 564, '→ comprometer private key hoje não decifra tráfego passado', 'var(--good)'),

    /* ── Session Keys panel ── */
    box('keys_bg', PX, 590, PW, 90, '', 'var(--panel)'),
    lbl('keys_title', PX + PW / 2, 608, '🗝️ Session Keys derivadas', 'var(--good)'),
    lbl('k1', PX + 10, 630, 'HKDF-Expand(master_secret) →', 'var(--muted)'),
    lbl('k2', PX + 10, 648, '  client_write_key   server_write_key  (AES-256)', 'var(--ink-soft)'),
    lbl('k3', PX + 10, 666, '  client_write_IV    server_write_IV   (12 bytes)', 'var(--ink-soft)'),

    /* ── mTLS panel ── */
    box('mtls_bg', PX, 690, PW, 28, '', 'var(--panel)'),
    lbl('mtls_lbl', PX + PW / 2, 708, 'mTLS = TLS + CertificateRequest ao cliente → autenticação mútua', 'var(--accent-2)'),

    /* flow labels */
    lbl('lbl_prob',  10, Y.http_req - 10,  'Problema', 'var(--hot)'),
    lbl('lbl_shake', 10, Y.client_hello - 10, 'Handshake', 'var(--accent)'),
    lbl('lbl_data',  10, Y.app_data - 10,    'Dados', 'var(--good)'),
    lbl('lbl_mtls',  10, Y.mtls_req - 10,    'mTLS', 'var(--accent-2)'),
  ];

  const steps = [
    {
      title: 'O Problema: HTTP texto claro',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s', 'lbl_prob',
             'http_c2s', 'http_c2s_l', 'http_n2s', 'http_n2s_l'],
      highlight: ['col_n'],
      balloon: {
        anchor: 'col_n', placement: 'bottom',
        text: 'HTTP sem TLS: qualquer intermediário (roteador, ISP, attacker) pode **ler e modificar** o tráfego. Senha, tokens e dados sensíveis viajam em texto claro.',
        why: 'HTTPS = HTTP sobre TLS — o protocolo de aplicação não muda, só o transporte é cifrado.',
      },
    },
    {
      title: 'TLS: camada de segurança sobre TCP',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s',
             'ecdhe_bg', 'ecdhe_title', 'ec5', 'ec6',
             'keys_bg', 'keys_title', 'k1', 'k2', 'k3'],
      balloon: {
        anchor: 'col_s', placement: 'top',
        text: 'TLS (Transport Layer Security) opera entre TCP e a camada de aplicação. Oferece: **confidencialidade** (cifração), **integridade** (AEAD), **autenticação** (certificados X.509) e **Perfect Forward Secrecy**.',
      },
    },
    {
      title: 'ClientHello: o cliente anuncia suas capacidades',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s', 'lbl_shake',
             'client_hello', 'client_hello_l'],
      highlight: ['col_c'],
      balloon: {
        anchor: 'client_hello_l', placement: 'bottom',
        text: '`ClientHello` contém: versão máxima suportada (TLS 1.3), lista de **cipher suites** aceitas (`TLS_AES_256_GCM_SHA384`, etc.), `random_C` (32 bytes aleatórios) e extensões como SNI (Server Name Indication).',
        why: 'SNI permite ao servidor escolher o certificado correto em hosts com múltiplos domínios.',
      },
    },
    {
      title: 'ServerHello + Certificate',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s', 'lbl_shake',
             'client_hello', 'client_hello_l',
             'server_hello', 'server_hello_l', 'cert_send', 'cert_send_l'],
      highlight: ['col_s'],
      balloon: {
        anchor: 'cert_send_l', placement: 'bottom',
        text: '`ServerHello` responde com a cipher suite escolhida, `random_S` e sua chave pública efêmera. Em seguida envia o **Certificate X.509** com informações de identidade e a chave pública para verificação.',
      },
    },
    {
      title: 'Anatomia do Certificado X.509',
      show: ['col_c', 'col_s', 'll_c', 'll_s',
             'cert_bg', 'cert_title', 'cx1', 'cx2', 'cx3', 'cx4', 'cx5', 'cx6', 'cx7', 'cx8', 'cx9'],
      highlight: ['cert_bg'],
      balloon: {
        anchor: 'cert_bg', placement: 'left',
        text: 'O campo mais crítico para validação é o **SAN** (Subject Alternative Names) — lista de domínios válidos para o cert. O `CN` está obsoleto; browsers modernos só aceitam SANs.',
        why: 'Validity period curto (90 dias, como Let\'s Encrypt) reduz janela de comprometimento.',
      },
    },
    {
      title: 'Chain of Trust: Root CA → Intermediate → Leaf',
      show: ['col_c', 'col_s', 'll_c', 'll_s',
             'chain_bg', 'chain_title', 'ca_root', 'ch_arr1', 'ca_int', 'ch_arr2', 'ca_leaf'],
      highlight: ['ca_root'],
      balloon: {
        anchor: 'chain_bg', placement: 'left',
        text: 'O OS/browser tem uma lista de **Root CAs confiáveis** pré-instalada. A Root CA assina a Intermediate CA, que assina o Leaf Certificate do servidor. Cliente verifica cada assinatura na cadeia.',
        why: 'Root CAs raramente assinam diretamente — Intermediate CAs ficam online para operação diária, protegendo a Root (offline em air-gapped HSMs).',
      },
    },
    {
      title: 'Validação do Certificado pelo cliente',
      show: ['col_c', 'col_s', 'll_c', 'll_s',
             'chain_bg', 'chain_title', 'ca_root', 'ch_arr1', 'ca_int', 'ch_arr2', 'ca_leaf',
             'cert_bg', 'cert_title', 'cx2', 'cx4', 'cx6'],
      highlight: ['ca_leaf', 'cert_bg'],
      balloon: {
        anchor: 'chain_bg', placement: 'left',
        text: 'Validação: 1) Verificar assinatura da CA. 2) Checar `notAfter` (não expirado). 3) Confirmar que o hostname bate com um SAN do cert. 4) Verificar revogação via CRL ou OCSP.',
        why: 'Certificate Transparency (CT Logs) permite auditoria pública de todos os certs emitidos — detecta certs mal-emitidos.',
      },
    },
    {
      title: 'ECDHE: troca de chaves com Perfect Forward Secrecy',
      show: ['col_c', 'col_s', 'll_c', 'll_s', 'lbl_shake',
             'server_hello', 'server_hello_l', 'key_ex', 'key_ex_l',
             'ecdhe_bg', 'ecdhe_title', 'ec1', 'ec2', 'ec3', 'ec4', 'ec5', 'ec6'],
      highlight: ['ecdhe_bg', 'key_ex'],
      balloon: {
        anchor: 'ecdhe_bg', placement: 'left',
        text: 'ECDHE: cliente e servidor geram pares de chaves **efêmeros** (descartados após o handshake). O segredo compartilhado é derivado via curva elíptica — sem nunca transmitir a chave secreta.',
        why: 'Ephemeral = PFS: se a private key de longo-prazo for comprometida no futuro, o tráfego passado permanece protegido.',
      },
    },
    {
      title: 'Derivação das session keys',
      show: ['col_c', 'col_s', 'll_c', 'll_s', 'lbl_shake',
             'key_ex', 'key_ex_l', 'client_fin', 'client_fin_l', 'server_fin', 'server_fin_l',
             'keys_bg', 'keys_title', 'k1', 'k2', 'k3'],
      highlight: ['keys_bg'],
      balloon: {
        anchor: 'keys_bg', placement: 'left',
        text: '`HKDF-Expand(master_secret)` deriva chaves simétricas **separadas por direção**: `client_write_key` (cliente cifra) e `server_write_key` (servidor cifra). Cada direção também tem seu próprio IV (nonce).',
        why: '`Finished` é um HMAC de todo o handshake — detecta qualquer adulteração nos passos anteriores.',
      },
    },
    {
      title: 'Application Data: Record Layer cifrado',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s', 'lbl_data',
             'app_data', 'app_data_l'],
      highlight: ['app_data'],
      balloon: {
        anchor: 'app_data_l', placement: 'top',
        text: 'Dados são fragmentados em **TLS Records** (≤16 KB), cifrados com AES-256-GCM (AEAD). O AEAD garante confidencialidade + integridade num único passo. O MITM vê apenas bytes cifrados.',
      },
    },
    {
      title: 'mTLS: o servidor também valida o cliente',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s', 'lbl_mtls',
             'mtls_req', 'mtls_req_l', 'mtls_cert', 'mtls_cert_l', 'mtls_ok', 'mtls_ok_l',
             'mtls_bg', 'mtls_lbl'],
      highlight: ['col_c', 'mtls_req'],
      balloon: {
        anchor: 'mtls_req_l', placement: 'top',
        text: 'Em mTLS, o servidor envia `CertificateRequest`. O cliente responde com seu próprio certificado X.509. O servidor valida a cadeia do cliente — **autenticação mútua** (ambos se provam).',
        why: 'Diferente do TLS padrão onde apenas o servidor se identifica. mTLS elimina a necessidade de API keys ou tokens em comunicação serviço-a-serviço.',
      },
    },
    {
      title: 'mTLS: casos de uso — service mesh e zero-trust',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_s', 'lbl_mtls',
             'mtls_req', 'mtls_req_l', 'mtls_cert', 'mtls_cert_l', 'mtls_ok', 'mtls_ok_l'],
      balloon: {
        anchor: 'col_s', placement: 'top',
        text: '**Istio / Envoy** (Kubernetes): injeta sidecar proxy que estabelece mTLS transparente entre pods. **Zero-trust networking**: sem VPN — cada serviço prova identidade com cert. **APIs B2B**: clientes recebem cert para autenticar além de HTTPS.',
      },
    },
    {
      title: 'Quiz',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s',
             'ecdhe_bg', 'ecdhe_title', 'ec5', 'ec6'],
      quiz: {
        question: 'Por que ECDHE (Ephemeral Diffie-Hellman) garante Perfect Forward Secrecy (PFS)?',
        options: [
          'Porque usa curvas elípticas que são mais difíceis de quebrar que RSA',
          'Porque as chaves efêmeras são descartadas após o handshake, então comprometer a chave de longo-prazo no futuro não decifra tráfego passado',
          'Porque o servidor gera uma chave diferente para cada cliente conectado',
          'Porque AES-GCM criptografa as chaves efêmeras antes de transmiti-las',
        ],
        answer: 1,
        explain: 'PFS é garantido pelo caráter **efêmero** das chaves ECDHE: cada sessão usa um par de chaves novo, descartado imediatamente após a derivação do master_secret. Mesmo que um atacante grave o tráfego cifrado hoje e obtenha a private key do servidor no futuro, ele não conseguirá decifrar — pois as chaves efêmeras (que seriam necessárias) já foram destruídas.',
      },
    },
    {
      title: 'Resumo: TLS / mTLS',
      show: ['col_c', 'col_n', 'col_s', 'll_c', 'll_n', 'll_s',
             'lbl_shake', 'lbl_data', 'lbl_mtls',
             'client_hello', 'client_hello_l', 'server_hello', 'server_hello_l',
             'cert_send', 'cert_send_l', 'key_ex', 'key_ex_l',
             'client_fin', 'client_fin_l', 'server_fin', 'server_fin_l',
             'app_data', 'app_data_l',
             'mtls_req', 'mtls_req_l', 'mtls_cert', 'mtls_cert_l',
             'chain_bg', 'chain_title', 'ca_root', 'ch_arr1', 'ca_int', 'ch_arr2', 'ca_leaf',
             'ecdhe_bg', 'ecdhe_title', 'ec3', 'ec5', 'ec6',
             'keys_bg', 'keys_title', 'k2'],
      balloon: {
        anchor: 'col_n', placement: 'bottom',
        text: 'TLS = handshake (ClientHello → cert X.509 → ECDHE → session keys) + dados cifrados com AES-GCM. Chain of trust: Root CA → Intermediate → Leaf. PFS via ECDHE efêmero. mTLS = TLS + autenticação do cliente por certificado.',
      },
    },
  ];

  window.TLS_DIAGRAM = { title: 'TLS / mTLS — Handshake e Autenticação Mútua', W, H, elements, steps };
})();
