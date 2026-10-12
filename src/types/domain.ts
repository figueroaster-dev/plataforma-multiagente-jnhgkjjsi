export type WorkspaceId = 'cerebro-digital' | 'cliente-demo' | 'nova-empresa'

export interface Workspace {
  id: WorkspaceId
  name: string
  plan: 'Enterprise' | 'Pro' | 'Starter'
  initials: string
  color: string
}

export type AgentStatus = 'ativo' | 'rascunho' | 'pausado'
export type AgentPurpose =
  | 'Vendas'
  | 'Suporte'
  | 'Atendimento'
  | 'SDR'
  | 'BDR'
  | 'Personalizado'
  | 'Outros'
export type ChannelType = 'whatsapp' | 'webchat' | 'instagram' | 'messenger' | 'nenhum'

export interface AgentApiIntegrationDemo {
  enabled: boolean
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  url: string
  description: string
}

export interface Agent {
  id: string
  name: string
  purpose: AgentPurpose
  description: string
  channel: string
  channelType: ChannelType
  status: AgentStatus
  lastActivity: string
  instructions?: string
  initialMessage?: string
  fallbackMessage?: string
  temperature?: number
  model?: string
  knowledgeBaseIds?: string[]
  humanHandoffEnabled?: boolean
  conversationsCount?: number
  apiIntegration?: AgentApiIntegrationDemo
  isDemoCreated?: boolean
}

export type KnowledgeStatus = 'pronto' | 'processando' | 'erro'
export type KnowledgeType = 'PDF' | 'FAQ' | 'Site'

export interface KnowledgeBase {
  id: string
  name: string
  type: KnowledgeType
  status: KnowledgeStatus
  updatedAt: string
  linkedAgentIds: string[]
  size?: string
  description?: string
  sourcesCount?: number
  errorMessage?: string
}

export type ConversationStatus = 'aberta' | 'aguardando' | 'resolvida'

export interface Message {
  id: string
  sender: 'user' | 'agent' | 'human'
  senderName: string
  text: string
  timestamp: string
}

export interface Conversation {
  id: string
  contactName: string
  contactPhoneOrEmail: string
  channel: string
  channelType: ChannelType
  status: ConversationStatus
  lastMessage: string
  updatedAt: string
  assignedAgentId: string
  assignedAgentName: string
  assignedHumanName?: string
  messages: Message[]
  tags: string[]
  summaryNotes?: string
}

export interface ChannelItem {
  id: string
  name: string
  type: ChannelType
  status: 'nao_conectado' | 'configuracao_futura'
  description: string
  badgeText: string
  icon: string
}

export interface IntegrationItem {
  id: string
  name: string
  category: 'api' | 'ferramenta' | 'crm'
  status: 'nao_conectada'
  description: string
  icon: string
  requiresChannel?: boolean
}

export interface WorkspaceUser {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Editor' | 'Operador'
  initials: string
  addedAt: string
}
