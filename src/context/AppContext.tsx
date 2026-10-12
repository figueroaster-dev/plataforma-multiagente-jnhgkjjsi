import React, { createContext, useContext, useState } from 'react'
import {
  Workspace,
  WorkspaceId,
  Agent,
  KnowledgeBase,
  Conversation,
  ConversationStatus,
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
  createAgent: (
    agentData: Omit<Agent, 'id' | 'lastActivity' | 'conversationsCount'> & { id?: string },
  ) => Agent

  knowledgeBases: KnowledgeBase[]
  addKnowledgeBaseDemo: () => void
  createKnowledgeBase: (
    data: Omit<KnowledgeBase, 'id' | 'updatedAt' | 'linkedAgentIds'> & {
      id?: string
      linkedAgentIds?: string[]
    },
  ) => KnowledgeBase
  updateKnowledgeBase: (data: Partial<KnowledgeBase> & { id: string }) => void
  deleteKnowledgeBase: (id: string) => void
  unlinkKnowledgeBaseFromAgent: (knowledgeId: string, agentId: string) => void

  conversations: Conversation[]
  selectedConversationId: string | null
  setSelectedConversationId: (id: string | null) => void
  addMessageToConversation: (convId: string, text: string, senderName?: string) => void
  assignConversationAgent: (convId: string, agentId: string) => void
  assignConversationHuman: (convId: string, humanUserId: string | null) => void
  takeOverConversation: (convId: string) => void
  updateConversationStatus: (convId: string, status: ConversationStatus) => void
  addConversationTag: (convId: string, tag: string) => void
  removeConversationTag: (convId: string, tag: string) => void
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

  const createAgent = (
    agentData: Omit<Agent, 'id' | 'lastActivity' | 'conversationsCount'> & { id?: string },
  ): Agent => {
    const newId = agentData.id || `ag-${Date.now().toString(36)}`
    const newAgent: Agent = {
      id: newId,
      name: agentData.name,
      purpose: agentData.purpose,
      description: agentData.description,
      channel: agentData.channel,
      channelType: agentData.channelType,
      status: agentData.status || 'rascunho',
      lastActivity: 'criado agora',
      instructions: agentData.instructions,
      initialMessage: agentData.initialMessage,
      fallbackMessage: agentData.fallbackMessage,
      temperature: agentData.temperature ?? 0.3,
      model: agentData.model ?? 'gpt-4o-mini',
      knowledgeBaseIds: agentData.knowledgeBaseIds ?? [],
      humanHandoffEnabled: agentData.humanHandoffEnabled ?? true,
      conversationsCount: 0,
      apiIntegration: agentData.apiIntegration,
      isDemoCreated: true,
    }

    setAgents((prev) => [newAgent, ...prev])
    return newAgent
  }

  const addKnowledgeBaseDemo = () => {
    toast({
      title: 'Adicionar fonte de conhecimento',
      description:
        'Interação apenas demonstrativa; nenhum upload real é realizado neste protótipo.',
    })
  }

  const createKnowledgeBase = (
    data: Omit<KnowledgeBase, 'id' | 'updatedAt' | 'linkedAgentIds'> & {
      id?: string
      linkedAgentIds?: string[]
    },
  ): KnowledgeBase => {
    const newId = data.id || `kb-${Date.now().toString(36)}`
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const updatedAt = `Hoje às ${hours}:${minutes}`

    const newKb: KnowledgeBase = {
      id: newId,
      name: data.name.trim(),
      type: data.type,
      status: data.status || 'pronto',
      updatedAt,
      linkedAgentIds: data.linkedAgentIds || [],
      size: data.size,
      description: data.description,
      sourcesCount: data.sourcesCount ?? 1,
      errorMessage: data.errorMessage,
    }

    setKnowledgeBases((prev) => [newKb, ...prev])

    toast({
      title: 'Fonte adicionada com sucesso!',
      description: `A base "${newKb.name}" foi cadastrada na biblioteca de Conhecimento. (Demonstração)`,
    })

    return newKb
  }

  const updateKnowledgeBase = (data: Partial<KnowledgeBase> & { id: string }) => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const updatedAt = `Hoje às ${hours}:${minutes}`

    setKnowledgeBases((prev) =>
      prev.map((kb) => (kb.id === data.id ? { ...kb, ...data, updatedAt } : kb)),
    )

    toast({
      title: 'Fonte atualizada com sucesso!',
      description: `As alterações na base de conhecimento foram salvas. (Demonstração)`,
    })
  }

  const deleteKnowledgeBase = (id: string) => {
    const target = knowledgeBases.find((kb) => kb.id === id)
    const targetName = target?.name || 'Fonte de conhecimento'

    // Remove a fonte da lista de bases
    setKnowledgeBases((prev) => prev.filter((kb) => kb.id !== id))

    // Remove o vínculo de todos os agentes que a utilizavam
    setAgents((prev) =>
      prev.map((agent) =>
        agent.knowledgeBaseIds?.includes(id)
          ? {
              ...agent,
              knowledgeBaseIds: agent.knowledgeBaseIds.filter((kbId) => kbId !== id),
            }
          : agent,
      ),
    )

    toast({
      title: 'Fonte excluída',
      description: `A base "${targetName}" foi removida do catálogo e seus vínculos foram desfeitos.`,
    })
  }

  const unlinkKnowledgeBaseFromAgent = (knowledgeId: string, agentId: string) => {
    const targetKb = knowledgeBases.find((k) => k.id === knowledgeId)
    const targetAgent = agents.find((a) => a.id === agentId)

    // Remove do linkedAgentIds da fonte
    setKnowledgeBases((prev) =>
      prev.map((kb) =>
        kb.id === knowledgeId
          ? {
              ...kb,
              linkedAgentIds: kb.linkedAgentIds.filter((agId) => agId !== agentId),
            }
          : kb,
      ),
    )

    // Remove do knowledgeBaseIds do agente
    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === agentId
          ? {
              ...ag,
              knowledgeBaseIds: (ag.knowledgeBaseIds || []).filter((kbId) => kbId !== knowledgeId),
            }
          : ag,
      ),
    )

    toast({
      title: 'Vínculo removido',
      description: `O vínculo entre a base "${targetKb?.name || 'Fonte'}" e o agente "${targetAgent?.name || 'Agente'}" foi desfeito.`,
    })
  }

  const addMessageToConversation = (
    convId: string,
    text: string,
    senderName = 'Marcelo Figueiroa',
  ) => {
    const trimmed = text.trim()
    if (!trimmed) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'human' as const,
      senderName,
      text: trimmed,
      timestamp: timeStr,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            lastMessage: trimmed,
            updatedAt: 'agora',
            assignedHumanName: c.assignedHumanName || senderName,
            messages: [...c.messages, newMsg],
          }
        }
        return c
      }),
    )

    toast({
      title: 'Mensagem demonstrativa adicionada',
      description: 'Adicionada ao histórico local. Nenhuma mensagem real foi enviada.',
    })
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
      title: 'Agente de IA atribuído',
      description: `Conversa atribuída a "${ag?.name || 'Agente'}" com sucesso. (Demonstração)`,
    })
  }

  const assignConversationHuman = (convId: string, humanUserId: string | null) => {
    const userTarget = humanUserId ? users.find((u) => u.id === humanUserId) : null
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            assignedHumanId: userTarget ? userTarget.id : undefined,
            assignedHumanName: userTarget ? userTarget.name : undefined,
          }
        }
        return c
      }),
    )

    if (userTarget) {
      toast({
        title: 'Atendente humano atribuído',
        description: `Responsabilidade transferida para "${userTarget.name}". (Demonstração)`,
      })
    } else {
      toast({
        title: 'Atendente removido',
        description: 'A conversa ficou sob responsabilidade autônoma do agente de IA.',
      })
    }
  }

  const takeOverConversation = (convId: string) => {
    // Transfere a responsabilidade para o atendente humano logado (Marcelo Figueiroa / u-1)
    const currentUser = users[0] || { id: 'u-1', name: 'Marcelo Figueiroa' }
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            assignedHumanId: currentUser.id,
            assignedHumanName: currentUser.name,
            status: c.status === 'resolvida' ? 'aberta' : c.status,
          }
        }
        return c
      }),
    )
    toast({
      title: 'Atendimento assumido!',
      description: `${currentUser.name} assumiu a responsabilidade desta conversa. (Demonstração)`,
    })
  }

  const updateConversationStatus = (convId: string, status: ConversationStatus) => {
    setConversations((prev) => prev.map((c) => (c.id === convId ? { ...c, status } : c)))
    const statusLabels: Record<ConversationStatus, string> = {
      aberta: 'Aberta (Em andamento)',
      aguardando: 'Pendente (Aguardando)',
      resolvida: 'Resolvida',
    }
    toast({
      title: 'Status atualizado',
      description: `Status alterado para "${statusLabels[status]}". (Demonstração)`,
    })
  }

  const addConversationTag = (convId: string, tag: string) => {
    const cleanTag = tag.trim()
    if (!cleanTag) return

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          if (c.tags.includes(cleanTag)) return c
          return {
            ...c,
            tags: [...c.tags, cleanTag],
          }
        }
        return c
      }),
    )
    toast({
      title: 'Etiqueta adicionada',
      description: `Etiqueta "${cleanTag}" vinculada à conversa.`,
    })
  }

  const removeConversationTag = (convId: string, tagToRemove: string) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === convId) {
          return {
            ...c,
            tags: c.tags.filter((t) => t !== tagToRemove),
          }
        }
        return c
      }),
    )
    toast({
      title: 'Etiqueta removida',
      description: `Etiqueta "${tagToRemove}" desvinculada.`,
    })
  }

  const resolveConversation = (convId: string) => {
    updateConversationStatus(convId, 'resolvida')
  }

  const returnToAgent = (convId: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, status: 'aberta', assignedHumanName: undefined, assignedHumanId: undefined }
          : c,
      ),
    )
    toast({
      title: 'Devolvido ao agente autônomo',
      description: 'O agente de IA reassumiu a condução automática desta conversa.',
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
        createAgent,
        knowledgeBases,
        addKnowledgeBaseDemo,
        createKnowledgeBase,
        updateKnowledgeBase,
        deleteKnowledgeBase,
        unlinkKnowledgeBaseFromAgent,
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        addMessageToConversation,
        assignConversationAgent,
        assignConversationHuman,
        takeOverConversation,
        updateConversationStatus,
        addConversationTag,
        removeConversationTag,
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
