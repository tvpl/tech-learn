/**
 * A v1 não tem `category`/`tags`/`level` — só a organização visual do
 * `index.html` (9 categorias). Mapa manual, preenchido uma vez; o conversor
 * falha explicitamente se um slug pedido não estiver aqui.
 */
export interface Meta {
  category: string;
  tags: string[];
  level: "intro" | "medio" | "avancado";
}

export const META: Record<string, Meta> = {
  // IA & Agentes
  transformer: { category: "IA & Agentes", tags: ["llm", "transformer", "atenção"], level: "avancado" },
  rag: { category: "IA & Agentes", tags: ["rag", "llm", "embeddings"], level: "medio" },
  mcp: { category: "IA & Agentes", tags: ["mcp", "agentes", "protocolo"], level: "medio" },
  subagents: { category: "IA & Agentes", tags: ["agentes", "orquestração"], level: "medio" },
  "context-eng": { category: "IA & Agentes", tags: ["contexto", "llm", "prompt"], level: "medio" },
  "prompt-eng": { category: "IA & Agentes", tags: ["prompt", "llm"], level: "intro" },
  guardrails: { category: "IA & Agentes", tags: ["segurança", "llm", "agentes"], level: "medio" },
  skills: { category: "IA & Agentes", tags: ["agentes", "ferramentas"], level: "medio" },
  sdd: { category: "IA & Agentes", tags: ["spec-driven", "agentes"], level: "medio" },
  specs: { category: "IA & Agentes", tags: ["especificação", "agentes"], level: "medio" },

  // Web & Protocolos
  http: { category: "Web & Protocolos", tags: ["http", "web"], level: "intro" },
  tcp: { category: "Web & Protocolos", tags: ["tcp", "rede"], level: "intro" },
  iso8583: { category: "Web & Protocolos", tags: ["iso8583", "pagamentos"], level: "avancado" },
  websocket: { category: "Web & Protocolos", tags: ["websocket", "tempo-real"], level: "medio" },
  grpc: { category: "Web & Protocolos", tags: ["grpc", "rpc"], level: "medio" },
  tls: { category: "Web & Protocolos", tags: ["tls", "criptografia", "https"], level: "avancado" },

  // Segurança & Autenticação
  oauth: { category: "Segurança & Autenticação", tags: ["oauth", "auth"], level: "avancado" },
  jwt: { category: "Segurança & Autenticação", tags: ["jwt", "auth", "token"], level: "medio" },
  sso: { category: "Segurança & Autenticação", tags: ["sso", "auth"], level: "avancado" },
  sessions: { category: "Segurança & Autenticação", tags: ["sessions", "cookies", "auth"], level: "intro" },
  "api-keys": { category: "Segurança & Autenticação", tags: ["api-keys", "auth"], level: "intro" },
  mfa: { category: "Segurança & Autenticação", tags: ["mfa", "2fa", "auth"], level: "medio" },
  crypto: { category: "Segurança & Autenticação", tags: ["criptografia"], level: "avancado" },

  // Sistemas Distribuídos
  "consistent-hashing": { category: "Sistemas Distribuídos", tags: ["hashing", "distribuído"], level: "avancado" },
  blockchain: { category: "Sistemas Distribuídos", tags: ["blockchain", "distribuído"], level: "avancado" },

  // Infraestrutura & Cloud
  kubernetes: { category: "Infraestrutura & Cloud", tags: ["kubernetes", "cloud"], level: "avancado" },
  eks: { category: "Infraestrutura & Cloud", tags: ["eks", "kubernetes", "aws"], level: "avancado" },
  rds: { category: "Infraestrutura & Cloud", tags: ["rds", "banco de dados", "aws"], level: "medio" },
  ingress: { category: "Infraestrutura & Cloud", tags: ["ingress", "kubernetes"], level: "medio" },
  "circuit-breaker": { category: "Infraestrutura & Cloud", tags: ["resiliência", "microsserviços"], level: "medio" },
  "rate-limit": { category: "Infraestrutura & Cloud", tags: ["rate limiting", "resiliência"], level: "medio" },
  "load-balancer": { category: "Infraestrutura & Cloud", tags: ["load balancer", "infra"], level: "intro" },

  // Mensageria & Processamento Async
  "async-redis-kafka": { category: "Mensageria & Processamento Async", tags: ["redis", "kafka", "async"], level: "medio" },
  "kafka-schema": { category: "Mensageria & Processamento Async", tags: ["kafka", "schema registry"], level: "avancado" },

  // Runtime & Linguagens
  "virtual-threads": { category: "Runtime & Linguagens", tags: ["java", "concorrência"], level: "avancado" },

  // Algoritmos & Estruturas de Dados
  hashmap: { category: "Algoritmos & Estruturas de Dados", tags: ["hash map", "estrutura de dados"], level: "intro" },
  "busca-binaria": { category: "Algoritmos & Estruturas de Dados", tags: ["busca binária", "algoritmo"], level: "intro" },
  recursao: { category: "Algoritmos & Estruturas de Dados", tags: ["recursão", "algoritmo"], level: "intro" },

  // Ferramentas
  git: { category: "Ferramentas", tags: ["git", "versionamento"], level: "intro" },
};

export function metaFor(slug: string): Meta {
  const meta = META[slug];
  if (!meta) throw new Error(`meta.ts: falta entrada de categoria/tags/level para o slug "${slug}"`);
  return meta;
}
