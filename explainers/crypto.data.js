(function () {
  const W = 1280, H = 720;

  function box(id, x, y, w, h, text, color) {
    return { id, type: 'box', x, y, w, h, label: text, stroke: color };
  }
  function lbl(id, x, y, text, color) {
    return { id, type: 'label', x, y, label: text, style: `fill:${color || 'var(--muted)'}`, size: 12 };
  }
  function arr(id, x1, y1, x2, y2, color) {
    return { id, type: 'arrow', x1, y1, x2, y2, color: color || 'var(--accent)' };
  }

  /* ── Layout: left = Symmetric (x<620), right = Asymmetric (x≥640) ── */
  /* Bottom row = Hybrid + Signatures + Hashes + KDFs                    */

  const SX = 20;   // Symmetric zone X
  const AX = 650;  // Asymmetric zone X
  const ZW = 580;  // zone width
  const ZH = 340;  // zone height (top half)
  const BY = 380;  // bottom panels Y

  const elements = [
    /* ── Symmetric zone ── */
    box('sym_bg', SX, 20, ZW, ZH, '', 'var(--panel)'),
    lbl('sym_title', SX + ZW / 2, 38, '🔑 Criptografia Simétrica', 'var(--accent)'),

    lbl('sym_def', SX + 10, 60, '1 chave secreta compartilhada → cifra E decifra', 'var(--ink-soft)'),
    lbl('sym_pro', SX + 10, 80, '✓ Muito rápida (AES-NI em hardware)', 'var(--good)'),
    lbl('sym_con', SX + 10, 98, '✗ Problema: como distribuir a chave secreta?', 'var(--hot)'),

    /* AES box */
    box('aes_bg', SX + 10, 116, ZW - 20, 100, '', 'var(--panel-2)'),
    lbl('aes_title', SX + ZW / 2, 134, 'AES — Advanced Encryption Standard', 'var(--accent)'),
    lbl('aes1', SX + 20, 152, 'Block cipher: blocos de 128 bits, chaves de 128/192/256 bits', 'var(--ink-soft)'),
    lbl('aes2', SX + 20, 170, 'ECB: cada bloco cifrado independente → padrões visíveis (inseguro!)', 'var(--hot)'),
    lbl('aes3', SX + 20, 188, 'CBC: XOR com bloco anterior → esconde padrões (IV necessário)', 'var(--warn)'),
    lbl('aes4', SX + 20, 206, 'GCM: stream + GHASH → confidencialidade + autenticidade (AEAD) ✓', 'var(--good)'),

    /* ChaCha20 box */
    box('cha_bg', SX + 10, 228, ZW - 20, 70, '', 'var(--panel-2)'),
    lbl('cha_title', SX + ZW / 2, 246, 'ChaCha20-Poly1305', 'var(--accent-2)'),
    lbl('cha1', SX + 20, 264, 'Stream cipher: keystream XOR plaintext (sem bloco)', 'var(--ink-soft)'),
    lbl('cha2', SX + 20, 282, 'Sem hardware AES-NI → mais rápido em mobile/IoT', 'var(--ink-soft)'),
    lbl('cha3', SX + 20, 298, 'Poly1305 MAC integrado (AEAD) · usado no TLS 1.3 e WireGuard', 'var(--muted)'),

    lbl('sym_key_prob', SX + 10, 316, '⚠️ Key Distribution Problem: Eve intercepta a troca de chave?', 'var(--hot)'),
    lbl('sym_sol', SX + 10, 336, '→ Solução: usar criptografia assimétrica para trocar a chave', 'var(--good)'),
    lbl('sym_ex', SX + 10, 354, 'Usada em: AES-GCM (TLS), ChaCha20 (WireGuard), AES-CBC (disk)', 'var(--muted)'),

    /* ── Asymmetric zone ── */
    box('asym_bg', AX, 20, ZW, ZH, '', 'var(--panel)'),
    lbl('asym_title', AX + ZW / 2, 38, '🔐 Criptografia Assimétrica', 'var(--good)'),

    lbl('asym_def', AX + 10, 60, 'Par de chaves: pública (cifra) + privada (decifra)', 'var(--ink-soft)'),
    lbl('asym_pro', AX + 10, 80, '✓ Troca de chaves sem canal seguro prévio', 'var(--good)'),
    lbl('asym_con', AX + 10, 98, '✗ 100-1000× mais lenta que simétrica', 'var(--hot)'),

    /* RSA box */
    box('rsa_bg', AX + 10, 116, ZW - 20, 100, '', 'var(--panel-2)'),
    lbl('rsa_title', AX + ZW / 2, 134, 'RSA — Rivest-Shamir-Adleman', 'var(--good)'),
    lbl('rsa1', AX + 20, 152, 'Segurança baseada em fatoração de números primos grandes', 'var(--ink-soft)'),
    lbl('rsa2', AX + 20, 170, 'Gerar: escolher p,q primos → n=p×q, calcular e,d', 'var(--ink-soft)'),
    lbl('rsa3', AX + 20, 188, 'Cifragem: c = m^e mod n   Decifragem: m = c^d mod n', 'var(--ink-soft)'),
    lbl('rsa4', AX + 20, 206, 'Tamanhos: 2048 bits (mínimo), 4096 bits (recomendado)', 'var(--muted)'),

    /* ECC box */
    box('ecc_bg', AX + 10, 228, ZW - 20, 80, '', 'var(--panel-2)'),
    lbl('ecc_title', AX + ZW / 2, 246, 'ECC — Elliptic Curve Cryptography', 'var(--accent-2)'),
    lbl('ecc1', AX + 20, 264, 'Segurança baseada no problema do logaritmo discreto em curvas', 'var(--ink-soft)'),
    lbl('ecc2', AX + 20, 282, 'Chave ECC 256 bits ≈ segurança de RSA 3072 bits (chaves 10× menores)', 'var(--good)'),
    lbl('ecc3', AX + 20, 300, 'ECDH: troca de chave · ECDSA: assinatura digital · Ed25519: assinar', 'var(--ink-soft)'),

    lbl('asym_use', AX + 10, 316, 'Curvas: secp256r1 (NIST P-256), Curve25519 (X25519/Ed25519)', 'var(--muted)'),
    lbl('asym_ex',  AX + 10, 336, 'Usada em: TLS (ECDHE), SSH, JWT (RS256/ES256), Bitcoin (secp256k1)', 'var(--muted)'),
    lbl('asym_note', AX + 10, 354, '⚠️ Post-quantum: RSA/ECC vulneráveis ao algoritmo de Shor (quantum)', 'var(--warn)'),

    /* ── Bottom: Hybrid Encryption ── */
    box('hyb_bg', SX, BY, ZW, 140, '', 'var(--panel)'),
    lbl('hyb_title', SX + ZW / 2, BY + 18, '🔀 Hybrid Encryption', 'var(--accent)'),
    lbl('hyb1', SX + 10, BY + 42, '1. Gerar AES key aleatória (DEK — Data Encryption Key)', 'var(--ink-soft)'),
    lbl('hyb2', SX + 10, BY + 62, '2. RSA/ECDH cifra o DEK com public key (KEK — Key Encryption Key)', 'var(--ink-soft)'),
    lbl('hyb3', SX + 10, BY + 82, '3. AES-GCM cifra o payload com o DEK', 'var(--ink-soft)'),
    lbl('hyb4', SX + 10, BY + 102, '→ Receptor decifra KEK(DEK) com private key → decifra payload', 'var(--ink-soft)'),
    lbl('hyb5', SX + 10, BY + 122, 'Usado em: TLS, PGP/GPG, Signal Protocol, AWS KMS, JWT JWE', 'var(--muted)'),
    arr('hyb_arr', SX + ZW / 2 - 10, BY + 85, AX + 10, BY + 85, 'var(--accent)'),

    /* ── Bottom: Digital Signatures ── */
    box('sig_bg', AX, BY, ZW, 140, '', 'var(--panel)'),
    lbl('sig_title', AX + ZW / 2, BY + 18, '✍️ Assinaturas Digitais', 'var(--accent-2)'),
    lbl('sig1', AX + 10, BY + 42, 'Alice assina: signature = Sign(hash(msg), priv_key_Alice)', 'var(--ink-soft)'),
    lbl('sig2', AX + 10, BY + 62, 'Bob verifica: Verify(signature, hash(msg), pub_key_Alice) → true/false', 'var(--ink-soft)'),
    lbl('sig3', AX + 10, BY + 82, '→ Autenticidade: só Alice tem a private key', 'var(--good)'),
    lbl('sig4', AX + 10, BY + 100, '→ Integridade: hash garante que msg não foi alterada', 'var(--good)'),
    lbl('sig5', AX + 10, BY + 118, 'Algoritmos: RSA-PSS, ECDSA (secp256r1), EdDSA (Ed25519)', 'var(--muted)'),
    lbl('sig6', AX + 10, BY + 136, 'Usado em: certificados X.509, JWT (RS256/ES256), Git commits', 'var(--muted)'),

    /* ── Bottom: Hashes ── */
    box('hash_bg', SX, BY + 158, ZW, 140, '', 'var(--panel)'),
    lbl('hash_title', SX + ZW / 2, BY + 176, '#️⃣ Hash Functions (one-way)', 'var(--warn)'),
    lbl('h1', SX + 10, BY + 200, 'Determinístico: mesmo input → mesmo hash sempre', 'var(--ink-soft)'),
    lbl('h2', SX + 10, BY + 220, 'One-way: impossível reconstruir input a partir do hash', 'var(--ink-soft)'),
    lbl('h3', SX + 10, BY + 240, 'Collision-resistant: difícil encontrar 2 inputs com mesmo hash', 'var(--ink-soft)'),
    lbl('h4', SX + 10, BY + 260, 'SHA-256: 256 bits · SHA-3 (Keccak) · BLAKE3 (rápido)', 'var(--good)'),
    lbl('h5', SX + 10, BY + 280, 'MD5 e SHA-1: QUEBRADOS — colisões encontradas, não usar para segurança', 'var(--hot)'),
    lbl('h6', SX + 10, BY + 300, 'HMAC: hash com chave secreta → integridade autenticada', 'var(--ink-soft)'),

    /* ── Bottom: KDFs ── */
    box('kdf_bg', AX, BY + 158, ZW, 140, '', 'var(--panel)'),
    lbl('kdf_title', AX + ZW / 2, BY + 176, '🔑 Key Derivation Functions (KDF)', 'var(--hot)'),
    lbl('kdf1', AX + 10, BY + 200, 'Propósito: converter senha fraca em chave criptográfica forte', 'var(--ink-soft)'),
    lbl('kdf2', AX + 10, BY + 220, 'Salt: valor aleatório por usuário → evita rainbow table', 'var(--good)'),
    lbl('kdf3', AX + 10, BY + 240, 'Iterations: custo computacional intencional → slows brute-force', 'var(--good)'),
    lbl('kdf4', AX + 10, BY + 260, 'PBKDF2: HMAC-SHA256 × N iterations — simples', 'var(--ink-soft)'),
    lbl('kdf5', AX + 10, BY + 280, 'bcrypt: memory-hard, fator de custo ajustável — padrão web', 'var(--accent)'),
    lbl('kdf6', AX + 10, BY + 300, 'Argon2id: winner PHC, memory+CPU hard → melhor contra ASICs', 'var(--good)'),
  ];

  const steps = [
    {
      title: 'O Problema: comunicação secreta sem se encontrar',
      show: ['sym_bg', 'sym_title', 'sym_def', 'sym_pro', 'sym_con',
             'asym_bg', 'asym_title', 'asym_def'],
      balloon: {
        anchor: 'sym_bg', placement: 'right',
        text: 'Alice quer mandar mensagem secreta para Bob pela internet. O problema: como combinam a chave secreta sem que Eve (no meio) intercepte? Criptografia simétrica é rápida mas exige chave pré-compartilhada.',
        deep: `<p>Esse é literalmente o problema que toda a criptografia moderna resolve, dividido em duas abordagens complementares: uma rápida mas que exige combinar um segredo antes (simétrica), outra mais lenta mas que não exige nenhum segredo prévio (assimétrica).</p>
<div class="xp-example"><strong>O paradoxo de Alice e Bob</strong>Se Alice e Bob já tivessem um canal 100% seguro para combinar a chave secreta, eles não precisariam de criptografia — já poderiam trocar a mensagem direto por esse canal.</div>
<p>É exatamente esse paradoxo que a criptografia assimétrica resolve (cenas seguintes): permite negociar um segredo compartilhado através de um canal público, mesmo com Eve escutando tudo.</p>` },
    },
    {
      title: 'Criptografia Simétrica: 1 chave, 2 operações',
      show: ['sym_bg', 'sym_title', 'sym_def', 'sym_pro', 'sym_con',
             'aes_bg', 'aes_title', 'aes1', 'aes2', 'aes3', 'aes4'],
      highlight: ['sym_bg'],
      balloon: {
        anchor: 'sym_bg', placement: 'right',
        text: 'A mesma chave cifra e decifra. AES é o padrão atual: 128-256 bits, acelerado por hardware (AES-NI). O modo importa muito: <strong>GCM</strong> é o correto para dados (AEAD = cifra + autentica em 1 passo).',
        why: 'ECB é inseguro porque blocos idênticos produzem ciphertext idêntico — padrões ficam visíveis (a "imagem do pinguim" do Linux).',
        deep: `<p>O "modo de operação" de um block cipher como o AES importa tanto quanto a própria chave — o mesmo AES-256 pode ser seguro ou trivialmente quebrável dependendo do modo.</p>
<div class="xp-bad"><strong>AES-ECB (não use)</strong>Cada bloco de 128 bits é cifrado de forma independente e idêntica — dois blocos de texto plano iguais viram dois blocos cifrados iguais. Dá pra ver a estrutura da imagem original numa foto cifrada em ECB.</div>
<div class="xp-good"><strong>AES-GCM (use este)</strong>Combina um contador (nunca repete o mesmo padrão) com autenticação integrada — além de esconder padrões, detecta se alguém alterou o ciphertext.</div>` },
    },
    {
      title: 'AES-GCM: o modo correto para dados',
      show: ['sym_bg', 'sym_title',
             'aes_bg', 'aes_title', 'aes1', 'aes2', 'aes3', 'aes4'],
      highlight: ['aes4'],
      balloon: {
        anchor: 'aes_bg', placement: 'right',
        text: '<strong>GCM (Galois/Counter Mode)</strong>: combina Counter Mode (stream cipher) com GHASH (MAC). AEAD = "Authenticated Encryption with Associated Data". Resultado: ciphertext autenticado — adulteração detectada imediatamente.',
        deep: `<p>AEAD resolve dois problemas de uma vez: confidencialidade (ninguém lê sem a chave) e integridade (ninguém altera sem ser detectado) — sem AEAD, seria preciso implementar essas duas garantias separadamente, e é fácil errar nessa combinação.</p>
<div class="xp-example"><strong>Saída do AES-GCM</strong>ciphertext = AES-GCM-Encrypt(plaintext, key, nonce)
→ retorna: {ciphertext, auth_tag}
Decifrar sem validar o auth_tag primeiro = vulnerabilidade grave</div>
<p>Um erro comum e perigoso: reusar o mesmo nonce (número usado uma vez) duas vezes com a mesma chave — isso quebra completamente a segurança do GCM, permitindo recuperar o plaintext.</p>` },
    },
    {
      title: 'ChaCha20-Poly1305: quando não há AES-NI',
      show: ['sym_bg', 'sym_title', 'sym_con', 'sym_key_prob', 'sym_sol',
             'cha_bg', 'cha_title', 'cha1', 'cha2', 'cha3'],
      highlight: ['cha_bg'],
      balloon: {
        anchor: 'cha_bg', placement: 'right',
        text: 'Em dispositivos sem aceleração de hardware AES (ARM antigos, IoT), <strong>ChaCha20</strong> é mais rápido e igualmente seguro. Poly1305 é o MAC integrado. É o cipher suite padrão no <strong>TLS 1.3 mobile</strong> e no <strong>WireGuard VPN</strong>.',
        deep: `<p>Antes de existir aceleração de hardware para AES (instrução AES-NI, presente em CPUs Intel/AMD desde ~2010), rodar AES em software puro era lento — especialmente em celulares antigos e microcontroladores. ChaCha20 foi desenhado para ser rápido em software puro, sem depender de hardware especializado.</p>
<div class="xp-example"><strong>Onde aparece na prática</strong>TLS 1.3: cipher suite TLS_CHACHA20_POLY1305_SHA256
WireGuard VPN: usa ChaCha20-Poly1305 como único cipher (por design, sem escolha)</div>
<p>Hoje, com AES-NI onipresente em servidores e celulares modernos, a escolha entre AES-GCM e ChaCha20-Poly1305 é mais sobre política/compatibilidade do que performance — ambos são considerados igualmente seguros.</p>` },
    },
    {
      title: 'O Key Distribution Problem',
      show: ['sym_bg', 'sym_title', 'sym_def', 'sym_pro', 'sym_con', 'sym_key_prob', 'sym_sol',
             'asym_bg', 'asym_title', 'asym_def', 'asym_pro'],
      highlight: ['sym_con', 'sym_key_prob'],
      balloon: {
        anchor: 'sym_con', placement: 'right',
        text: 'Alice e Bob precisam combinar a chave secreta <strong>antecipadamente</strong> por um canal já seguro. Mas se já têm um canal seguro, para que precisam de criptografia? A solução é usar <strong>criptografia assimétrica</strong> apenas para trocar a chave simétrica.',
        deep: `<p>Esse problema foi considerado praticamente insolúvel até 1976, quando Diffie e Hellman publicaram um método para dois lados combinarem um segredo compartilhado trocando apenas informação pública — sem nunca transmitir a chave em si.</p>
<div class="xp-example"><strong>Ideia (simplificada) do Diffie-Hellman</strong>Alice e Bob combinam publicamente uma "cor base"
Cada um mistura sua "cor secreta" própria e manda o resultado pro outro
Cada um mistura de novo com sua cor secreta → chegam à MESMA cor final
Eve, vendo só as misturas trocadas, não consegue "desmisturar" a cor final</div>
<p>Esse é o princípio por trás do ECDHE usado no handshake do TLS moderno — cada conexão HTTPS negocia uma chave de sessão nova sem nunca transmiti-la.</p>` },
    },
    {
      title: 'RSA: chaves públicas e privadas',
      show: ['asym_bg', 'asym_title', 'asym_def', 'asym_pro', 'asym_con',
             'rsa_bg', 'rsa_title', 'rsa1', 'rsa2', 'rsa3', 'rsa4'],
      highlight: ['asym_bg', 'rsa_bg'],
      balloon: {
        anchor: 'asym_bg', placement: 'left',
        text: 'Bob publica sua <strong>chave pública</strong>. Alice cifra com ela. Só Bob (com a <strong>chave privada</strong>) consegue decifrar. A segurança do RSA depende da dificuldade de fatorar `n = p × q` sendo `p` e `q` primos muito grandes.',
        why: '2048 bits é o mínimo seguro; 4096 bits recomendado para chaves de longa duração.',
        deep: `<p>A segurança do RSA se apoia numa assimetria computacional: multiplicar dois primos grandes é rápido, mas fatorar o resultado de volta nos dois primos originais é, na prática, inviável para números grandes o suficiente.</p>
<div class="xp-example"><strong>RSA em números pequenos (didático, nunca use em produção)</strong>p=61, q=53 → n = p×q = 3233
Chave pública: (e=17, n=3233)
Chave privada: (d=2753, n=3233)
Cifrar m=65: c = 65^17 mod 3233 = 2790
Decifrar: m = 2790^2753 mod 3233 = 65 ✓</div>
<p>Na prática, p e q têm centenas de dígitos — fatorar n de volta em p×q levaria mais tempo do que o esperado de vida do universo com os computadores clássicos atuais.</p>` },
    },
    {
      title: 'ECC: mesma segurança, chaves muito menores',
      show: ['asym_bg', 'asym_title', 'asym_def', 'asym_pro',
             'ecc_bg', 'ecc_title', 'ecc1', 'ecc2', 'ecc3', 'asym_use', 'asym_ex', 'asym_note'],
      highlight: ['ecc_bg'],
      balloon: {
        anchor: 'ecc_bg', placement: 'left',
        text: '<strong>Curva elíptica</strong>: equação `y² = x³ + ax + b`. A chave é um ponto na curva. ECDH permite troca de chave segura. ECDSA assina. <strong>Chave ECC de 256 bits = RSA de 3072 bits</strong> — muito menor para mesma segurança. Padrão no TLS 1.3.',
        why: 'Post-quantum: RSA e ECC são vulneráveis ao algoritmo de Shor em computadores quânticos. NIST padronizou algoritmos PQC (Kyber, Dilithium) em 2024.',
        deep: `<p>Chaves menores não são só uma questão de economia de espaço — elas significam handshakes TLS mais rápidos, menos dados trafegando e menos processamento, o que importa muito em escala (milhões de conexões HTTPS por segundo).</p>
<div class="xp-good"><strong>Comparação de tamanho para segurança equivalente</strong>RSA 3072 bits ≈ ECC 256 bits ≈ AES 128 bits (nível de segurança)
RSA 15360 bits ≈ ECC 521 bits ≈ AES 256 bits</div>
<p>Curve25519 (usada em X25519 para troca de chave e Ed25519 para assinatura) é hoje a escolha padrão em protocolos modernos como Signal, SSH e TLS 1.3 — desenhada especificamente para evitar classes inteiras de erros de implementação que afetavam curvas mais antigas.</p>` },
    },
    {
      title: 'Hybrid Encryption: o melhor dos dois mundos',
      show: ['sym_bg', 'sym_title', 'sym_pro',
             'asym_bg', 'asym_title', 'asym_pro',
             'hyb_bg', 'hyb_title', 'hyb1', 'hyb2', 'hyb3', 'hyb4', 'hyb5', 'hyb_arr'],
      highlight: ['hyb_bg'],
      balloon: {
        anchor: 'hyb_bg', placement: 'top',
        text: 'Ninguém cifra dados grandes com RSA — é lento demais. A solução padrão: <strong>gerar uma AES key aleatória (DEK)</strong>, cifrar o payload com AES-GCM, e cifrar a DEK com a chave pública do destinatário. Isso é o que TLS, PGP e AWS KMS fazem.',
        deep: `<p>É o padrão que praticamente toda comunicação segura na internet usa — a criptografia assimétrica nunca cifra o conteúdo real, só a chave que vai cifrar o conteúdo.</p>
<div class="xp-example"><strong>Fluxo completo (simplificado do TLS)</strong>1. Cliente e servidor negociam uma AES key (DEK) via ECDHE
2. (ou: remetente cifra a DEK com a chave pública do destinatário — caso PGP/JWE)
3. Payload inteiro é cifrado com AES-GCM usando a DEK
4. Destinatário recupera a DEK e decifra o payload</div>
<p>O ganho de performance é enorme: cifrar 1 MB com AES-GCM leva microssegundos; com RSA puro, seria centenas de vezes mais lento — inviável para tráfego real.</p>` },
    },
    {
      title: 'Assinaturas Digitais: autenticidade + integridade',
      show: ['asym_bg', 'asym_title',
             'sig_bg', 'sig_title', 'sig1', 'sig2', 'sig3', 'sig4', 'sig5', 'sig6'],
      highlight: ['sig_bg'],
      balloon: {
        anchor: 'sig_bg', placement: 'left',
        text: 'Alice assina com <strong>chave privada</strong> — qualquer um pode verificar com sua <strong>chave pública</strong>. O `hash(msg)` garante que a mensagem não foi alterada. Usado em X.509 (TLS certs), JWT (RS256), Git commits assinados.',
        why: 'Ao contrário da cifração, na assinatura a privada ASSINA e a pública VERIFICA — o inverso do padrão de cifração.',
        deep: `<p>Assinatura digital resolve um problema diferente de cifração: não é sobre esconder o conteúdo, é sobre provar quem escreveu algo e que ninguém alterou depois.</p>
<div class="xp-bad"><strong>Erro conceitual comum</strong>Achar que cifrar uma mensagem com a chave privada "assina" ela — na prática, algoritmos de assinatura (RSA-PSS, ECDSA, EdDSA) são matematicamente distintos de cifração, mesmo usando o mesmo par de chaves em RSA clássico.</div>
<div class="xp-good"><strong>Uso típico</strong>Um certificado TLS (X.509) é assinado pela CA (Autoridade Certificadora) — seu navegador verifica essa assinatura com a chave pública da CA, já embutida no sistema operacional.</div>` },
    },
    {
      title: 'Hash Functions: impressão digital one-way',
      show: ['hash_bg', 'hash_title', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      highlight: ['hash_bg'],
      balloon: {
        anchor: 'hash_bg', placement: 'right',
        text: '<strong>SHA-256</strong>: 256 bits, base do Bitcoin, X.509, TLS. <strong>BLAKE3</strong>: mais rápido, ideal para checksums. <strong>HMAC</strong>: hash com chave secreta (ex: JWT HS256). <strong>MD5 e SHA-1 estão quebrados</strong> — não usar para segurança, apenas para checksums não-críticos.',
        deep: `<p>Uma boa função hash criptográfica precisa de três propriedades ao mesmo tempo — determinismo, unidirecionalidade e resistência a colisão — perder qualquer uma delas compromete todo sistema que depende dela.</p>
<div class="xp-bad"><strong>Por que MD5/SHA-1 foram aposentados</strong>Pesquisadores encontraram formas de gerar dois inputs diferentes com o mesmo hash MD5/SHA-1 (colisão) — o que quebra qualquer sistema que confie no hash como "impressão digital única" do conteúdo (ex.: verificação de certificados, assinaturas de commit).</div>
<div class="xp-example"><strong>HMAC vs hash simples</strong>hash(msg) — qualquer um pode recalcular, não prova quem mandou
HMAC(secret, msg) — só quem tem o secret consegue gerar/verificar → prova autoria e integridade juntas</div>` },
    },
    {
      title: 'Key Derivation Functions: senhas → chaves fortes',
      show: ['kdf_bg', 'kdf_title', 'kdf1', 'kdf2', 'kdf3', 'kdf4', 'kdf5', 'kdf6'],
      highlight: ['kdf_bg'],
      balloon: {
        anchor: 'kdf_bg', placement: 'left',
        text: 'Senhas são fracas e previsíveis. KDFs as transformam em chaves criptograficamente fortes: <strong>salt</strong> (único por usuário, evita rainbow tables) + <strong>iterations</strong> (custo alto dificulta brute-force). <strong>Argon2id</strong> é o padrão moderno (OWASP recomendado).',
        why: 'bcrypt e Argon2 são memory-hard: mesmo com GPUs/ASICs, o ataque de força bruta fica caro porque requer muita RAM.',
        deep: `<p>KDFs existem porque humanos escolhem senhas previsíveis (padrões, palavras do dicionário, datas) — usar a senha direto como chave criptográfica herdaria essa fraqueza; um KDF injeta trabalho computacional deliberado para tornar a força bruta cara mesmo contra senhas fracas.</p>
<div class="xp-bad"><strong>Nunca faça isso</strong>Guardar senha em texto puro, ou aplicar um hash rápido único como SHA-256(senha) — GPUs modernas calculam bilhões de SHA-256 por segundo, tornando brute-force viável.</div>
<div class="xp-good"><strong>Faça isso</strong>Argon2id(senha, salt_único, custo_de_memória_e_cpu) — cada tentativa de brute-force custa memória e tempo real, tornando ataques em massa economicamente inviáveis.</div>
<p>O "salt" único por usuário existe para impedir rainbow tables (tabelas pré-computadas de hash→senha): sem salt, quebrar UMA senha comum quebra todas as contas que a usam.</p>` },
    },
    {
      title: 'Quiz',
      show: ['sym_bg', 'sym_title', 'asym_bg', 'asym_title', 'hyb_bg', 'hyb_title'],
      quiz: {
        question: 'Por que sistemas como TLS usam "hybrid encryption" (AES + RSA/ECDH) em vez de cifrar tudo com RSA diretamente?',
        options: [
          'Porque RSA não suporta chaves maiores que 4096 bits, limitando o tamanho dos dados',
          'Porque AES é 100-1000× mais rápido que RSA — RSA cifra apenas a AES key (pequena), AES cifra os dados',
          'Porque o algoritmo RSA não é considerado seguro para dados maiores que 256 bytes',
          'Porque TLS 1.3 removeu suporte a RSA por razões de compliance',
        ],
        answer: 1,
        explain: 'RSA é seguro mas <strong>muito lento</strong> para grandes volumes de dados: cifrar 1 MB com RSA-2048 leva centenas de vezes mais tempo que com AES-256-GCM. O padrão é usar RSA/ECDH apenas para o "key wrapping" — cifrar a chave AES (32 bytes). Então AES cifra o payload inteiro em velocidade de hardware. Esse padrão se chama hybrid encryption e é a base de TLS, PGP, JOSE/JWE e AWS KMS.',
      },
    },
    {
      title: 'Resumo: Criptografia',
      show: ['sym_bg', 'sym_title', 'sym_def', 'sym_pro', 'sym_con',
             'aes_bg', 'aes_title', 'aes4',
             'cha_bg', 'cha_title', 'cha3',
             'asym_bg', 'asym_title', 'asym_def', 'asym_pro',
             'rsa_bg', 'rsa_title', 'rsa1',
             'ecc_bg', 'ecc_title', 'ecc2',
             'hyb_bg', 'hyb_title', 'hyb1', 'hyb3', 'hyb4',
             'sig_bg', 'sig_title', 'sig3', 'sig4',
             'hash_bg', 'hash_title', 'h4', 'h5',
             'kdf_bg', 'kdf_title', 'kdf5', 'kdf6'],
      balloon: {
        anchor: 'hyb_bg', placement: 'top',
        text: 'Simétrica (AES-GCM, ChaCha20): rápida, AEAD. Assimétrica (RSA, ECC): troca de chave sem canal seguro. Hybrid: assimétrica troca a AES key, simétrica cifra os dados (TLS, PGP). Assinatura: privada assina, pública verifica. Hashes: SHA-256 (MD5 quebrado). KDFs: Argon2id para senhas.',
      },
    },
  ];

  window.CRYPTO_DIAGRAM = { title: 'Criptografia — Simétrica, Assimétrica e Hashes', W, H, elements, steps };
})();
