import React, { createContext, useContext, useState } from 'react'
import {
  Workspace,
  WorkspaceId,
  Agent,
  KnowledgeBase,
  Conversation,
  WorkspaceUser,
} from '@/types/domain'
import {
  INITIAL_WORKSPACES,
  INITIAL_AGENTS,
  INITIAL_KNOWLEDGE,
  INITIAL_CONVERSATIONS,
  WORKSPACE_USERS,
} from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'

interface AppContextType {
  workspaces: Workspace[]
  currentWorkspace: Workspace
  switchWorkspace: (id: WorkspaceId) => void

  agents: Agent[]
  getAgentById: (id: string) => Agent | undefined
  updateAgent: (agent: Partial<Agent> & { id: string }) => void

  knowledgeBases: KnowledgeBase[]
  addKnowledgeBaseDemo: () => void

  conversations: Conversation[]
  selectedConversationId: string | null
  setSelectedConversationId: (id: string | null) => void
  addMessageToConversation: (convId: string, text: string) => void
  assignConversationAgent: (convId: string, agentId: string) => void
  resolveConversation: (convId: string) => void
  returnToAgent: (convId: string) => void

  users: WorkspaceUser[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast()
  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES)
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<WorkspaceId>('cerebro-digital')
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS)
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>(INITIAL_KNOWLEDGE)
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS)
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>('conv-1')
  const [users] = useState<WorkspaceUser[]>(WORKSPACE_USERS)

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId) || workspaces[0]

  const switchWorkspace = (id: WorkspaceId) => {
    setCurrentWorkspaceId(id)
    const target = workspaces.find((w) => w.id === id)
    toast({
      title: 'Espaço de trabalho alterado',
      description: `Ambiente ativo alternado para "${target?.name}". (Demonstração local)`,
    })
  }

  const getAgentById = (id: string) => agents.find((a) => a.id === id)

  const updateAgent = (updated: Partial<Agent> & { id: string }) => {
    setAgents((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)),
    )
  }

  const addKnowledgeBaseDemo = () => {
    toast({
      title: 'Adicionar fonte de conhecimento',
      description:
        'Interação apenas demonstrativa; nenhum upload real é realizado neste protótipo.',
    })
  }

  const addMessageToConversation = (convId: string, text: string) => {
    if (!text.trim()) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'human' as const,
      senderName: 'Marcelo (Atendente)',
      text,
      timestamp: timeStr,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: text,
            updatedAt: 'agora',
            status: c.status === 'resolvida' ? 'aberta' : c.status,
            messages: [...c.messages, newMsg],
          }
        }
        return c
      }),
    )

    // Resposta automática simulada do cliente ou mock
    setTimeout(() => {
      const replyMsg = {
        id: `reply-${Date.now()}`,
        sender: 'user' as const,
        senderName: conversations.find((c) => c.id === convId)?.contactName || 'Cliente',
        text: 'Obrigado pelo retorno! Este é um retorno simulado para demonstração da interface.',
        timestamp: timeStr,
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === convId) {
            return {
              ...c,
              lastMessage: replyMsg.text,
              updatedAt: 'agora',
              messages: [...c.messages, replyMsg],
            }
          }
          return c
        }),
      )
    }, 1200)
  }

  const assignConversationAgent = (convId: string, agentId: string) => {
    const ag = agents.find((a) => a.id === agentId)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              assignedAgentId: agentId,
              assignedAgentName: ag ? ag.name : c.assignedAgentName,
            }
          : c,
      ),
    )
    toast({
      title: 'Agente atribuído',
      description: `Conversa atribuída a "${ag?.name || 'Agente'}" com sucesso.`,
    })
  }

  const resolveConversation = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, status: 'resolvida' } : c)),
    )
    toast({
      title: 'Conversa resolvida',
      description: 'O status do atendimento foi alterado para Resolvida.',
    })
  }

  const returnToAgent = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId ? { ...c, status: 'aberta', assignedHumanName: undefined } : c,
      ),
    )
    toast({
      title: 'Devolvido ao agente autônomo',
      description: 'O agente de IA reassumiu as respostas desta conversa.',
    })
  }

  return (
    <AppContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        switchWorkspace,
        agents,
        getAgentById,
        updateAgent,
        knowledgeBases,
        addKnowledgeBaseDemo,
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        addMessageToConversation,
        assignConversationAgent,
        resolveConversation,
        returnToAgent,
        users,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
