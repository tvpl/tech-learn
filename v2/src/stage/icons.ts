/**
 * Registro explícito de ícones (lucide) — mantém o tree-shaking.
 * Para usar um ícone novo num explainer, adicione-o aqui.
 */
import {
  ArrowRight, BookOpen, Bot, Brain, Cpu, Database, FileText, Fingerprint, GitBranch,
  Globe, Key, Layers, Lock, LockOpen, MessageSquare, Network, Package, Search, Server,
  Shield, ShieldCheck, Shuffle, Sparkles, User, Zap,
  type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  "arrow-right": ArrowRight,
  book: BookOpen,
  bot: Bot,
  brain: Brain,
  cpu: Cpu,
  database: Database,
  file: FileText,
  fingerprint: Fingerprint,
  git: GitBranch,
  globe: Globe,
  key: Key,
  layers: Layers,
  lock: Lock,
  "lock-open": LockOpen,
  message: MessageSquare,
  network: Network,
  package: Package,
  search: Search,
  server: Server,
  shield: Shield,
  "shield-check": ShieldCheck,
  shuffle: Shuffle,
  sparkles: Sparkles,
  user: User,
  zap: Zap,
};
