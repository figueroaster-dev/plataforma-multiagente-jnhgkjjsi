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

export interface KnowledgeBaseFaqItem {
  id: string
  pergunta: string
  resposta: string
}

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
  // Referências demonstrativas ricas para edição
  fileName?: string
  fileSize?: string
  siteUrl?: string
  faqItems?: KnowledgeBaseFaqItem[]
}

export type ConversationStatus = 'aberta' | 'aguardando' | 'resolvida'

export interface Message {
  id: string
  sender: 'user' | 'agent' | 'human'
  senderName: string
  text: string
  timestamp: string
}

export interface ContactDetails {
  firstInteractionDate?: string
  totalPreviousConversations?: number
  email?: string
  phone?: string
  company?: string
  location?: string
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
  assignedHumanId?: string
  messages: Message[]
  tags: string[]
  summaryNotes?: string
  contactDetails?: ContactDetails
}

export type WhatsAppProviderType = 'meta_cloud_api' | 'bsp_partner' | 'evolution_api' | 'uazapi'

export type WhatsAppConnectionState = 'nao_conectado' | 'conectado_demonstracao' | 'atencao_conexao'

export interface WhatsAppConnectionConfig {
  id: string
  workspaceId: WorkspaceId
  providerType: WhatsAppProviderType
  subType?:
    | 'evolution_cloud_api'
    | 'evolution_baileys'
    | 'bsp_360dialog'
    | 'bsp_twilio'
    | 'bsp_zenvia'
  displayName: string
  phoneNumber?: string
  status: WhatsAppConnectionState
  connectedAt?: string
  lastCheckedAt?: string
  notes?: string
}

export type AIProviderId = 'openai' | 'anthropic' | 'google'

export interface AIModelOption {
  id: string
  name: string
  description: string
  contextWindow: string
  isRecommended?: boolean
}

export interface CompanyAISettings {
  provider: AIProviderId
  model: string
  byokEnabled: boolean
  maskedKeyExample: string
  temperatureDefault: number
  status: 'nao_configurado' | 'conexao_demonstrativa'
  lastTestedAt?: string
}

export interface ChannelItem {
  id: string
  name: string
  type: ChannelType
  status: 'nao_conectado' | 'configuracao_futura' | 'conectado_demonstracao' | 'atencao_conexao'
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
