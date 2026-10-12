import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Check,
  Bot,
  Sparkles,
  Radio,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Code2,
  Lock,
  Send,
  RotateCcw,
  Pencil,
  Info,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react'
import { NovaFonteModal } from '@/components/knowledge/NovaFonteModal'
import { Header } from '@/components/layout/Header'
import { Stepper, StepItem } from '@/components/common/Stepper'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { AgentPurpose, ChannelType } from '@/types/domain'

const WIZARD_STEPS: StepItem[] = [
  { id: 1, title: 'Perfil do agente', subtitle: 'Identificação' },
  { id: 2, title: 'Instruções', subtitle: 'Regras e mensagens' },
  { id: 3, title: 'Conhecimento', subtitle: 'Bases sincronizadas' },
  { id: 4, title: 'Ferramentas', subtitle: 'APIs e integrações' },
  { id: 5, title: 'Revisão e teste', subtitle: 'Validação e simulador' },
]

export default function NovoAgente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { createAgent, updateAgent, getAgentById, syncKnowledgeBasesForAgent, knowledgeBases } =
    useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  // Existing agent if in edit mode
  const existingAgent = id ? getAgentById(id) : undefined
  const isEditMode = Boolean(id && existingAgent)

  // Step state
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // Determine initial channelChoice from existing agent or default
  const getInitialChannelChoice = (
    channelType?: ChannelType,
  ): 'whatsapp' | 'webchat' | 'nenhum' => {
    if (channelType === 'whatsapp') return 'whatsapp'
    if (channelType === 'webchat') return 'webchat'
    return 'nenhum'
  }

  // ETAPA 1: Perfil
  const [name, setName] = useState(existingAgent?.name || '')
  const [description, setDescription] = useState(existingAgent?.description || '')
  const [purpose, setPurpose] = useState<AgentPurpose>(existingAgent?.purpose || 'Atendimento')
  const [channelChoice, setChannelChoice] = useState<'whatsapp' | 'webchat' | 'nenhum'>(
    getInitialChannelChoice(existingAgent?.channelType),
  )

  // ETAPA 2: Instruções
  const [instructions, setInstructions] = useState(
    existingAgent?.instructions ||
      'Você é um assistente virtual atencioso e profissional. Responda em português do Brasil com clareza, empatia e brevidade. Caso não tenha certeza sobre um detalhe técnico ou contratual, ofereça transferir o contato para um atendente humano.',
  )
  const [initialMessage, setInitialMessage] = useState(
    existingAgent?.initialMessage ||
      'Olá! Eu sou o assistente virtual da equipe. Como posso ajudar você hoje?',
  )
  const [fallbackMessage, setFallbackMessage] = useState(
    existingAgent?.fallbackMessage ||
      'Desculpe, ainda estou aprendendo sobre esse assunto específico. Posso verificar com nossa equipe ou transferir para um atendente.',
  )
  const [humanHandoffEnabled, setHumanHandoffEnabled] = useState(
    existingAgent?.humanHandoffEnabled ?? true,
  )

  // ETAPA 3: Conhecimento
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>(
    existingAgent?.knowledgeBaseIds || [],
  )
  const [isNovaFonteModalOpen, setIsNovaFonteModalOpen] = useState(false)

  // ETAPA 4: Ferramentas e Integração API (Demonstração)
  const [apiIntegrationEnabled, setApiIntegrationEnabled] = useState(
    existingAgent?.apiIntegration?.enabled ?? false,
  )
  const [apiName, setApiName] = useState(
    existingAgent?.apiIntegration?.name || 'Consulta de Pedido / Status',
  )
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(
    existingAgent?.apiIntegration?.method || 'GET',
  )
  const [apiUrl, setApiUrl] = useState(
    existingAgent?.apiIntegration?.url || 'https://api.empresa.com.br/v1/pedidos/:id',
  )
  const [apiDescription, setApiDescription] = useState(
    existingAgent?.apiIntegration?.description ||
      'Retorna o status do pedido, código de rastreio e data prevista de entrega.',
  )

  // Keep track of original values for dirty checking in edit mode
  const [originalValues, setOriginalValues] = useState(() => ({
    name: existingAgent?.name || '',
    description: existingAgent?.description || '',
    purpose: existingAgent?.purpose || 'Atendimento',
    channelChoice: getInitialChannelChoice(existingAgent?.channelType),
    instructions: existingAgent?.instructions || '',
    initialMessage: existingAgent?.initialMessage || '',
    fallbackMessage: existingAgent?.fallbackMessage || '',
    humanHandoffEnabled: existingAgent?.humanHandoffEnabled ?? true,
    knowledgeBaseIds: existingAgent?.knowledgeBaseIds
      ? [...existingAgent.knowledgeBaseIds].sort().join(',')
      : '',
    apiIntegrationEnabled: existingAgent?.apiIntegration?.enabled ?? false,
    apiName: existingAgent?.apiIntegration?.name || 'Consulta de Pedido / Status',
    apiMethod: existingAgent?.apiIntegration?.method || 'GET',
    apiUrl: existingAgent?.apiIntegration?.url || 'https://api.empresa.com.br/v1/pedidos/:id',
    apiDescription: existingAgent?.apiIntegration?.description || '',
  }))

  // Re-sync if existingAgent changes or loads
  useEffect(() => {
    if (existingAgent) {
      setName(existingAgent.name)
      setDescription(existingAgent.description || '')
      setPurpose(existingAgent.purpose)
      setChannelChoice(getInitialChannelChoice(existingAgent.channelType))
      setInstructions(
        existingAgent.instructions ||
          'Você é um assistente virtual atencioso e profissional. Responda em português do Brasil com clareza, empatia e brevidade. Caso não tenha certeza sobre um detalhe técnico ou contratual, ofereça transferir o contato para um atendente humano.',
      )
      setInitialMessage(
        existingAgent.initialMessage ||
          'Olá! Eu sou o assistente virtual da equipe. Como posso ajudar você hoje?',
      )
      setFallbackMessage(
        existingAgent.fallbackMessage ||
          'Desculpe, ainda estou aprendendo sobre esse assunto específico. Posso verificar com nossa equipe ou transferir para um atendente.',
      )
      setHumanHandoffEnabled(existingAgent.humanHandoffEnabled ?? true)
      setSelectedKnowledgeIds(existingAgent.knowledgeBaseIds || [])
      setApiIntegrationEnabled(existingAgent.apiIntegration?.enabled ?? false)
      setApiName(existingAgent.apiIntegration?.name || 'Consulta de Pedido / Status')
      setApiMethod(existingAgent.apiIntegration?.method || 'GET')
      setApiUrl(existingAgent.apiIntegration?.url || 'https://api.empresa.com.br/v1/pedidos/:id')
      setApiDescription(existingAgent.apiIntegration?.description || '')

      setOriginalValues({
        name: existingAgent.name,
        description: existingAgent.description || '',
        purpose: existingAgent.purpose,
        channelChoice: getInitialChannelChoice(existingAgent.channelType),
        instructions: existingAgent.instructions || '',
        initialMessage: existingAgent.initialMessage || '',
        fallbackMessage: existingAgent.fallbackMessage || '',
        humanHandoffEnabled: existingAgent.humanHandoffEnabled ?? true,
        knowledgeBaseIds: existingAgent.knowledgeBaseIds
          ? [...existingAgent.knowledgeBaseIds].sort().join(',')
          : '',
        apiIntegrationEnabled: existingAgent.apiIntegration?.enabled ?? false,
        apiName: existingAgent.apiIntegration?.name || 'Consulta de Pedido / Status',
        apiMethod: existingAgent.apiIntegration?.method || 'GET',
        apiUrl: existingAgent.apiIntegration?.url || 'https://api.empresa.com.br/v1/pedidos/:id',
        apiDescription: existingAgent.apiIntegration?.description || '',
      })
    }
  }, [id])

  // ETAPA 5: Teste e Chat Simulado
  const [testMessages, setTestMessages] = useState<
    { id: string; sender: 'user' | 'agent'; text: string; time: string }[]
  >([])
  const [testInput, setTestInput] = useState('')

  // Validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Cancel dialog
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Track if user has modified anything
  const isDirty = useMemo(() => {
    if (isEditMode) {
      const currentKb = [...selectedKnowledgeIds].sort().join(',')
      return (
        name !== originalValues.name ||
        description !== originalValues.description ||
        purpose !== originalValues.purpose ||
        channelChoice !== originalValues.channelChoice ||
        instructions !== originalValues.instructions ||
        initialMessage !== originalValues.initialMessage ||
        fallbackMessage !== originalValues.fallbackMessage ||
        humanHandoffEnabled !== originalValues.humanHandoffEnabled ||
        currentKb !== originalValues.knowledgeBaseIds ||
        apiIntegrationEnabled !== originalValues.apiIntegrationEnabled ||
        apiName !== originalValues.apiName ||
        apiMethod !== originalValues.apiMethod ||
        apiUrl !== originalValues.apiUrl ||
        apiDescription !== originalValues.apiDescription ||
        currentStep > 1
      )
    }

    return (
      name.trim().length > 0 ||
      description.trim().length > 0 ||
      selectedKnowledgeIds.length > 0 ||
      apiIntegrationEnabled ||
      currentStep > 1
    )
  }, [
    isEditMode,
    originalValues,
    name,
    description,
    purpose,
    channelChoice,
    instructions,
    initialMessage,
    fallbackMessage,
    humanHandoffEnabled,
    selectedKnowledgeIds,
    apiIntegrationEnabled,
    apiName,
    apiMethod,
    apiUrl,
    apiDescription,
    currentStep,
  ])

  // Reset or initialize test chat when entering step 5
  const initTestChatIfNeeded = () => {
    if (testMessages.length === 0) {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0',
      )}`
      setTestMessages([
        {
          id: 'init-msg',
          sender: 'agent',
          text:
            initialMessage.trim() || `Olá! Sou o ${name || 'Agente'}. Como posso ajudar você hoje?`,
          time,
        },
      ])
    }
  }

  // Se o agente existente for carregado ou alternado, inicializar chat de teste com sua mensagem
  useEffect(() => {
    if (existingAgent && testMessages.length === 0) {
      const now = new Date()
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
        2,
        '0',
      )}`
      setTestMessages([
        {
          id: 'init-msg',
          sender: 'agent',
          text:
            existingAgent.initialMessage?.trim() ||
            `Olá! Sou o ${existingAgent.name}. Como posso ajudar você hoje?`,
          time,
        },
      ])
    }
  }, [existingAgent])

  // Channel helper labels
  const getChannelDisplay = (
    ch: 'whatsapp' | 'webchat' | 'nenhum',
  ): { label: string; type: ChannelType } => {
    switch (ch) {
      case 'whatsapp':
        return { label: 'WhatsApp', type: 'whatsapp' }
      case 'webchat':
        return { label: 'Chat do site', type: 'webchat' }
      case 'nenhum':
      default:
        return { label: 'Nenhum canal vinculado', type: 'nenhum' }
    }
  }

  // Validate step
  const validateCurrentStep = (stepToValidate = currentStep): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (stepToValidate === 1) {
      if (!name.trim()) {
        newErrors.name = 'O nome do agente é obrigatório para identificação.'
      } else if (name.trim().length < 3) {
        newErrors.name = 'O nome deve ter pelo menos 3 caracteres.'
      }
    }

    if (stepToValidate === 2) {
      if (!instructions.trim()) {
        newErrors.instructions = 'As instruções do agente são obrigatórias.'
      }
      if (!initialMessage.trim()) {
        newErrors.initialMessage = 'A mensagem inicial é obrigatória.'
      }
      if (!fallbackMessage.trim()) {
        newErrors.fallbackMessage = 'A orientação para dúvidas não resolvidas é obrigatória.'
      }
    }

    if (stepToValidate === 4 && apiIntegrationEnabled) {
      if (!apiName.trim()) {
        newErrors.apiName = 'Informe um nome descritivo para a integração de API.'
      }
      if (!apiUrl.trim()) {
        newErrors.apiUrl = 'Informe a URL do endpoint demonstrativo.'
      } else if (!apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
        newErrors.apiUrl = 'A URL demonstrativa deve começar com http:// ou https://'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (!validateCurrentStep(currentStep)) {
      toast({
        title: 'Preencha os campos obrigatórios',
        description: 'Verifique os avisos em vermelho antes de prosseguir.',
        variant: 'destructive',
      })
      return
    }

    setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])))

    if (currentStep < 5) {
      const next = currentStep + 1
      setCurrentStep(next)
      if (next === 5) {
        initTestChatIfNeeded()
      }
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
      setErrors({})
    }
  }

  const handleGoToStep = (targetStep: number) => {
    // If going forward past completed, validate
    if (targetStep > currentStep) {
      if (!validateCurrentStep(currentStep)) return
    }
    setCurrentStep(targetStep)
    setErrors({})
    if (targetStep === 5) {
      initTestChatIfNeeded()
    }
  }

  const toggleKnowledge = (kbId: string) => {
    setSelectedKnowledgeIds((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId],
    )
  }

  // Save Agent (as draft or final, in create or edit mode)
  const handleSave = (finalPublish = false) => {
    if (!validateCurrentStep(1)) {
      setCurrentStep(1)
      toast({
        title: 'Nome obrigatório',
        description: 'Por favor, informe o nome do agente na Etapa 1.',
        variant: 'destructive',
      })
      return
    }

    const channelInfo = getChannelDisplay(channelChoice)

    if (isEditMode && existingAgent) {
      // Modo edição: atualiza o agente existente preservando seu status atual
      updateAgent({
        id: existingAgent.id,
        name: name.trim(),
        purpose,
        description:
          description.trim() ||
          `Agente de ${purpose} configurado para atuação via ${channelInfo.label}.`,
        channel: channelInfo.label,
        channelType: channelInfo.type,
        status: existingAgent.status, // Preserva exatamente o status original (ativo, rascunho ou pausado)
        instructions: instructions.trim(),
        initialMessage: initialMessage.trim(),
        fallbackMessage: fallbackMessage.trim(),
        temperature: existingAgent.temperature ?? 0.3,
        model: existingAgent.model ?? 'gpt-4o-mini',
        knowledgeBaseIds: selectedKnowledgeIds,
        humanHandoffEnabled,
        apiIntegration: apiIntegrationEnabled
          ? {
              enabled: true,
              name: apiName.trim(),
              method: apiMethod,
              url: apiUrl.trim(),
              description: apiDescription.trim(),
            }
          : undefined,
      })

      // Sincronização bidirecional: reflete os vínculos nos objetos das bases de conhecimento
      syncKnowledgeBasesForAgent(existingAgent.id, selectedKnowledgeIds)

      toast({
        title: 'Alterações salvas com sucesso!',
        description: `O agente "${name.trim()}" foi atualizado mantendo seu status (${existingAgent.status}). (Demonstração)`,
      })

      navigate('/agentes')
      return
    }

    // Modo criação: cria novo agente como rascunho
    const created = createAgent({
      name: name.trim(),
      purpose,
      description:
        description.trim() ||
        `Agente de ${purpose} configurado para atuação via ${channelInfo.label}.`,
      channel: channelInfo.label,
      channelType: channelInfo.type,
      status: 'rascunho', // Conforme especificação: "Ao salvar ('Salvar rascunho' ou concluir), criar o agente como 'Rascunho'"
      instructions: instructions.trim(),
      initialMessage: initialMessage.trim(),
      fallbackMessage: fallbackMessage.trim(),
      temperature: 0.3,
      model: 'gpt-4o-mini',
      knowledgeBaseIds: selectedKnowledgeIds,
      humanHandoffEnabled,
      apiIntegration: apiIntegrationEnabled
        ? {
            enabled: true,
            name: apiName.trim(),
            method: apiMethod,
            url: apiUrl.trim(),
            description: apiDescription.trim(),
          }
        : undefined,
    })

    // Sincronização bidirecional: reflete os vínculos na lista de bases de conhecimento
    if (selectedKnowledgeIds.length > 0) {
      syncKnowledgeBasesForAgent(created.id, selectedKnowledgeIds)
    }

    toast({
      title: finalPublish ? 'Agente criado como Rascunho!' : 'Rascunho salvo com sucesso!',
      description: `O agente "${created.name}" agora está disponível na listagem geral. (Demonstração)`,
    })

    navigate('/agentes')
  }

  // Interactive mock chat submit
  const handleSendTestMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!testInput.trim()) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`

    const userText = testInput.trim()
    const userMsg = {
      id: `tm-${Date.now()}`,
      sender: 'user' as const,
      text: userText,
      time,
    }

    setTestMessages((prev) => [...prev, userMsg])
    setTestInput('')

    // Simulated contextual reply based on user input, fallback, instructions and knowledge
    setTimeout(() => {
      let reply = ''
      const lower = userText.toLowerCase()

      if (
        lower.includes('humano') ||
        lower.includes('atendente') ||
        lower.includes('pessoa') ||
        lower.includes('falar com alguem')
      ) {
        reply = humanHandoffEnabled
          ? 'Compreendido! Estou transferindo seu atendimento para um operador humano na fila de espera. Aguarde um instante.'
          : 'No momento o transbordo para atendimento humano está desativado para este agente de demonstração.'
      } else if (
        lower.includes('preço') ||
        lower.includes('quanto custa') ||
        lower.includes('valor') ||
        lower.includes('plano')
      ) {
        reply = `Com base nas informações do agente (${purpose}): oferecemos planos flexíveis com teste demonstrativo gratuito. Quer que eu detalhe as funcionalidades?`
      } else if (
        lower.includes('erro') ||
        lower.includes('não sei') ||
        lower.includes('ajuda') ||
        lower.includes('duvida')
      ) {
        reply = fallbackMessage
      } else if (
        apiIntegrationEnabled &&
        (lower.includes('pedido') || lower.includes('status') || lower.includes('rastreio'))
      ) {
        reply = `[Simulação API ${apiMethod}]: Consulta demonstrativa executada para "${apiName}". Pedido #98234 em transporte com entrega prevista para amanhã.`
      } else {
        reply = `Obrigado pelo contato! Sou o ${name || 'Agente'} configurado para ${purpose}. Esta é uma resposta de demonstração pré-programada baseada no seu prompt de instruções.`
      }

      setTestMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: 'agent' as const,
          text: reply,
          time,
        },
      ])
    }, 600)
  }

  const handleCancel = () => {
    if (isDirty) {
      setShowCancelDialog(true)
    } else {
      navigate('/agentes')
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-16">
      {/* Header com ações e badge discreto de demonstração */}
      <Header
        title={isEditMode ? `Configurar: ${existingAgent?.name || name}` : 'Criar Novo Agente'}
        subtitle={
          isEditMode
            ? 'Edite as configurações do agente em 5 etapas mantendo seu status atual'
            : 'Assistente guiado em 5 etapas com dados demonstrativos'
        }
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Agentes', href: '/agentes' },
          { label: isEditMode ? existingAgent?.name || 'Configurar' : 'Novo Agente' },
        ]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/30">
              <Sparkles className="w-3 h-3 text-[#7C5CFC]" />
              <span>Demonstração</span>
            </span>

            {isEditMode && existingAgent && <StatusPill status={existingAgent.status} size="sm" />}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave(false)}
              className="rounded-xl border-[#E5E5EC] text-[#1A1A24] text-xs h-9 hidden sm:flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#5F5F6B]" />
              <span>{isEditMode ? 'Salvar alterações' : 'Salvar rascunho'}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="rounded-xl text-xs h-9 text-[#5F5F6B] hover:text-rose-600 hover:bg-rose-50"
            >
              Cancelar
            </Button>
          </div>
        }
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F5F6B] hover:text-[#7C5CFC] transition-colors py-1 px-2 -ml-2 rounded-lg hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Agentes</span>
          </button>

          <span className="text-xs text-[#9B9BAD]">
            Etapa <strong>{currentStep}</strong> de <strong>5</strong>
          </span>
        </div>

        {/* Stepper Progress */}
        <Stepper
          steps={WIZARD_STEPS}
          currentStep={currentStep}
          onSelectStep={handleGoToStep}
          completedSteps={completedSteps}
        />

        {/* Main Wizard Card */}
        <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm">
          {/* ========================================================= */}
          {/* ETAPA 1: Perfil do agente */}
          {/* ========================================================= */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1A1A24]">
                      {isEditMode ? 'Etapa 1: Perfil e Identificação' : 'Etapa 1: Perfil do Agente'}
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                    >
                      Demonstração
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    {isEditMode
                      ? 'Revise e edite o nome de exibição, a finalidade comercial ou de suporte e o canal do agente.'
                      : 'Defina o nome de exibição, a finalidade comercial ou de suporte e o canal demonstrativo.'}
                  </p>
                </div>
              </div>

              <div className="space-y-5 max-w-2xl">
                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Nome do agente <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
                    }}
                    placeholder="Ex: Assistente Comercial, Sofia SDR, Suporte Técnico..."
                    className={`rounded-xl text-sm focus-visible:ring-[#7C5CFC] ${
                      errors.name
                        ? 'border-rose-400 focus-visible:ring-rose-400 bg-rose-50/20'
                        : 'border-[#E5E5EC]'
                    }`}
                  />
                  {errors.name ? (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.name}</span>
                    </p>
                  ) : (
                    <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                      Nome identificador visível para clientes e equipe interna.
                    </span>
                  )}
                </div>

                {/* Objetivo / Descrição */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Objetivo ou descrição principal
                  </label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Qualificação de leads recebidos pelo WhatsApp, agendamento de reuniões e tira-dúvidas de catálogo comercial."
                    className="rounded-xl border-[#E5E5EC] text-sm focus-visible:ring-[#7C5CFC]"
                  />
                  <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                    Resuma em poucas palavras qual o papel deste agente no dia a dia da empresa.
                  </span>
                </div>

                {/* Tipo / Finalidade */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Tipo do agente <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {(
                      [
                        { id: 'Atendimento', desc: 'FAQ e triagem geral' },
                        { id: 'Suporte', desc: 'Resolução técnica' },
                        { id: 'SDR', desc: 'Pré-vendas e qualificação' },
                        { id: 'BDR', desc: 'Prospecção ativa' },
                        { id: 'Personalizado', desc: 'Fluxo customizado' },
                      ] as const
                    ).map((item) => {
                      const isSelected = purpose === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setPurpose(item.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-[#F1EEFE] border-[#7C5CFC] text-[#7C5CFC] shadow-sm font-semibold'
                              : 'bg-white border-[#E5E5EC] text-[#5F5F6B] hover:border-slate-300'
                          }`}
                        >
                          <div className="text-xs font-bold text-[#1A1A24]">{item.id}</div>
                          <div className="text-[10px] text-[#9B9BAD] mt-0.5 line-clamp-1">
                            {item.desc}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Canal Demonstrativo */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Canal demonstrativo
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'whatsapp' as const,
                        title: 'WhatsApp',
                        desc: 'Simulação do canal WhatsApp Business oficial',
                        icon: Radio,
                      },
                      {
                        id: 'webchat' as const,
                        title: 'Chat do site',
                        desc: 'Simulação do widget flutuante no portal da empresa',
                        icon: Bot,
                      },
                      {
                        id: 'nenhum' as const,
                        title: 'Nenhum',
                        desc: 'Agente sem canal conectado (configurável mais tarde)',
                        icon: Lock,
                      },
                    ].map((ch) => {
                      const isSelected = channelChoice === ch.id
                      const Icon = ch.icon
                      return (
                        <button
                          key={ch.id}
                          type="button"
                          onClick={() => setChannelChoice(ch.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#F1EEFE]/60 border-[#7C5CFC] shadow-sm'
                              : 'bg-white border-[#E5E5EC] hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-[#1A1A24] flex items-center gap-1.5">
                              <Icon className="w-4 h-4 text-[#7C5CFC]" />
                              {ch.title}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#7C5CFC]" />}
                          </div>
                          <p className="text-[11px] text-[#5F5F6B]">{ch.desc}</p>
                          <span className="text-[9px] text-[#9B9BAD] mt-2 block uppercase tracking-wider font-semibold">
                            Demonstração
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 2: Instruções */}
          {/* ========================================================= */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#1A1A24]">
                    Etapa 2: Instruções e Comportamento
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                  >
                    Demonstração
                  </Badge>
                </div>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Defina o prompt do agente, mensagem de boas-vindas e regras para dúvidas não
                  resolvidas.
                </p>
              </div>

              <div className="space-y-5 max-w-2xl">
                {/* Prompt / Instruções */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1A1A24]">
                      Prompt / Instruções do agente <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[11px] text-[#7C5CFC] font-medium">
                      Português (pt-BR)
                    </span>
                  </div>
                  <Textarea
                    rows={6}
                    value={instructions}
                    onChange={(e) => {
                      setInstructions(e.target.value)
                      if (errors.instructions) setErrors((prev) => ({ ...prev, instructions: '' }))
                    }}
                    placeholder="Instrua o tom de voz, regras de atendimento, o que pode e não pode responder..."
                    className={`rounded-xl text-xs font-mono leading-relaxed focus-visible:ring-[#7C5CFC] ${
                      errors.instructions ? 'border-rose-400 bg-rose-50/20' : 'border-[#E5E5EC]'
                    }`}
                  />
                  {errors.instructions && (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.instructions}</span>
                    </p>
                  )}
                  <div className="mt-2 p-3 rounded-xl bg-[#F7F7FB] border border-[#E5E5EC] text-xs text-[#5F5F6B] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
                    <span>
                      Dica: especifique o tom (ex: cordial, formal, consultivo) e limites de atuação
                      do agente para garantir consistência.
                    </span>
                  </div>
                </div>

                {/* Mensagem Inicial */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Mensagem inicial (Boas-vindas) <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={initialMessage}
                    onChange={(e) => {
                      setInitialMessage(e.target.value)
                      if (errors.initialMessage)
                        setErrors((prev) => ({ ...prev, initialMessage: '' }))
                    }}
                    placeholder="Ex: Olá! Sou o assistente virtual da empresa. Como posso ajudar?"
                    className={`rounded-xl text-sm focus-visible:ring-[#7C5CFC] ${
                      errors.initialMessage ? 'border-rose-400 bg-rose-50/20' : 'border-[#E5E5EC]'
                    }`}
                  />
                  {errors.initialMessage ? (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.initialMessage}</span>
                    </p>
                  ) : (
                    <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                      Enviada automaticamente quando um novo contato inicia uma conversa.
                    </span>
                  )}
                </div>

                {/* Orientação quando não souber responder */}
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Orientação para quando o agente não souber responder{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <Textarea
                    rows={3}
                    value={fallbackMessage}
                    onChange={(e) => {
                      setFallbackMessage(e.target.value)
                      if (errors.fallbackMessage)
                        setErrors((prev) => ({ ...prev, fallbackMessage: '' }))
                    }}
                    placeholder="Ex: Desculpe, ainda estou aprendendo sobre esse assunto. Posso transferir para nossa equipe?"
                    className={`rounded-xl text-sm focus-visible:ring-[#7C5CFC] ${
                      errors.fallbackMessage ? 'border-rose-400 bg-rose-50/20' : 'border-[#E5E5EC]'
                    }`}
                  />
                  {errors.fallbackMessage ? (
                    <p className="text-xs text-rose-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.fallbackMessage}</span>
                    </p>
                  ) : (
                    <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                      Resposta padrão para mitigar alucinações quando a resposta não constar nas
                      bases.
                    </span>
                  )}
                </div>

                {/* Opção demonstrativa de encaminhamento para atendimento humano */}
                <div className="p-4 rounded-2xl bg-[#F7F7FB] border border-[#E5E5EC] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#7C5CFC]" />
                      <h4 className="text-xs font-semibold text-[#1A1A24]">
                        Encaminhamento para atendimento humano (Transbordo)
                      </h4>
                      <Badge
                        variant="outline"
                        className="text-[9px] text-[#7C5CFC] border-[#7C5CFC]/30"
                      >
                        Demonstração
                      </Badge>
                    </div>
                    <p className="text-xs text-[#5F5F6B]">
                      Transfere automaticamente para a fila de operadores humanos quando o cliente
                      solicitar ajuda ou demonstrar insatisfação.
                    </p>
                  </div>
                  <Switch
                    checked={humanHandoffEnabled}
                    onCheckedChange={setHumanHandoffEnabled}
                    className="data-[state=checked]:bg-[#7C5CFC]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 3: Conhecimento */}
          {/* ========================================================= */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1A1A24]">
                      Etapa 3: Fontes de Conhecimento
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                    >
                      Demonstração
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Selecione uma ou mais bases já existentes ou crie uma nova fonte diretamente por
                    aqui.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <Button
                    type="button"
                    onClick={() => setIsNovaFonteModalOpen(true)}
                    className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl shadow-xs text-xs font-semibold gap-1.5 h-9"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova fonte</span>
                  </Button>
                  <div className="text-xs font-medium text-[#7C5CFC] bg-[#F1EEFE] px-3 py-1.5 rounded-xl border border-[#7C5CFC]/20">
                    {selectedKnowledgeIds.length} selecionada(s)
                  </div>
                </div>
              </div>

              {/* Informative banner */}
              <div className="p-3.5 rounded-xl bg-violet-50/60 border border-[#7C5CFC]/20 text-xs text-[#5232CD] flex items-start gap-2.5 max-w-3xl">
                <Info className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
                <div>
                  <strong>Seleção opcional:</strong> Você pode continuar sem selecionar nenhuma
                  fonte se preferir um agente puramente baseado em prompts gerais. Nenhum upload
                  real é feito neste protótipo.
                </div>
              </div>

              <div className="space-y-3 max-w-3xl">
                {knowledgeBases.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-dashed border-[#E5E5EC] rounded-2xl">
                    <p className="text-xs font-medium text-[#5F5F6B]">
                      Nenhuma fonte de conhecimento cadastrada no catálogo.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setIsNovaFonteModalOpen(true)}
                      className="mt-3 bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-8 px-3 gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar primeira fonte</span>
                    </Button>
                  </div>
                ) : (
                  knowledgeBases.map((kb) => {
                    const isSelected = selectedKnowledgeIds.includes(kb.id)
                    return (
                      <div
                        key={kb.id}
                        onClick={() => toggleKnowledge(kb.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'bg-[#F1EEFE]/40 border-[#7C5CFC]/50 shadow-sm'
                            : 'bg-white border-[#E5E5EC] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-[#7C5CFC] text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-[#1A1A24] truncate">
                                {kb.name}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                Tipo: {kb.type}
                              </span>
                              <StatusPill status={kb.status} size="sm" />
                            </div>
                            <p className="text-xs text-[#5F5F6B] mt-0.5 line-clamp-1">
                              {kb.description ||
                                'Fonte para consulta de dúvidas da base de conhecimento.'}
                            </p>
                            <span className="text-[10px] text-[#9B9BAD] mt-1 block">
                              Tamanho: {kb.size || '1 documento'} • Atualizado: {kb.updatedAt}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-xs font-semibold hidden sm:inline ${
                              isSelected ? 'text-[#7C5CFC]' : 'text-[#9B9BAD]'
                            }`}
                          >
                            {isSelected ? 'Selecionada' : 'Não selecionada'}
                          </span>
                          <Switch
                            checked={isSelected}
                            onCheckedChange={() => toggleKnowledge(kb.id)}
                            className="data-[state=checked]:bg-[#7C5CFC]"
                          />
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 4: Ferramentas e integrações */}
          {/* ========================================================= */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[#1A1A24]">
                    Etapa 4: Ferramentas e Integrações
                  </h3>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                  >
                    Demonstração
                  </Badge>
                </div>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Configure uma integração demonstrativa via API HTTP para permitir que o agente
                  consulte ou envie dados para seus sistemas.
                </p>
              </div>

              {/* Demo Notice Warning */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 max-w-3xl">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Configuração exclusivamente demonstrativa:</strong> Nenhuma requisição
                  HTTP real é disparada e nenhuma credencial ou segredo é armazenado neste
                  protótipo.
                </div>
              </div>

              {/* Toggle to enable API Tool */}
              <div className="p-4 rounded-2xl bg-white border border-[#E5E5EC] flex items-center justify-between gap-4 max-w-3xl">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#7C5CFC]" />
                    <h4 className="text-xs font-semibold text-[#1A1A24]">
                      Habilitar integração com API REST (Demonstração)
                    </h4>
                  </div>
                  <p className="text-xs text-[#5F5F6B]">
                    Permite definir um endpoint simulado para consulta externa (ex: status de
                    pedidos, saldo ou agendamentos).
                  </p>
                </div>
                <Switch
                  checked={apiIntegrationEnabled}
                  onCheckedChange={setApiIntegrationEnabled}
                  className="data-[state=checked]:bg-[#7C5CFC]"
                />
              </div>

              {/* API Form if enabled */}
              {apiIntegrationEnabled ? (
                <div className="p-5 rounded-2xl bg-[#F7F7FB] border border-[#E5E5EC] space-y-4 max-w-3xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#E5E5EC] pb-2">
                    <span className="text-xs font-bold text-[#1A1A24] uppercase tracking-wide">
                      Parâmetros da Ação / Endpoint Simulado
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded font-medium">
                      Mock API (Sem chamada real)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                        Nome da ação <span className="text-rose-500">*</span>
                      </label>
                      <Input
                        value={apiName}
                        onChange={(e) => {
                          setApiName(e.target.value)
                          if (errors.apiName) setErrors((prev) => ({ ...prev, apiName: '' }))
                        }}
                        placeholder="Ex: Consulta de Pedido, Checar Estoque..."
                        className={`rounded-xl text-xs bg-white ${errors.apiName ? 'border-rose-400' : 'border-[#E5E5EC]'}`}
                      />
                      {errors.apiName && (
                        <p className="text-[11px] text-rose-600 mt-1">{errors.apiName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                        Método HTTP <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={apiMethod}
                        onChange={(e) =>
                          setApiMethod(e.target.value as 'GET' | 'POST' | 'PUT' | 'DELETE')
                        }
                        className="w-full bg-white border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3 py-2 h-9 focus:ring-[#7C5CFC] focus:outline-none"
                      >
                        <option value="GET">GET (Consulta)</option>
                        <option value="POST">POST (Criação)</option>
                        <option value="PUT">PUT (Atualização)</option>
                        <option value="DELETE">DELETE (Remoção)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                      URL do Endpoint demonstrativo <span className="text-rose-500">*</span>
                    </label>
                    <Input
                      value={apiUrl}
                      onChange={(e) => {
                        setApiUrl(e.target.value)
                        if (errors.apiUrl) setErrors((prev) => ({ ...prev, apiUrl: '' }))
                      }}
                      placeholder="https://api.suaempresa.com.br/v1/pedidos/:id"
                      className={`rounded-xl text-xs font-mono bg-white ${errors.apiUrl ? 'border-rose-400' : 'border-[#E5E5EC]'}`}
                    />
                    {errors.apiUrl && (
                      <p className="text-[11px] text-rose-600 mt-1">{errors.apiUrl}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                      Descrição da ação para o modelo de IA
                    </label>
                    <Textarea
                      rows={2}
                      value={apiDescription}
                      onChange={(e) => setApiDescription(e.target.value)}
                      placeholder="Ex: Quando o cliente perguntar sobre entrega ou código de rastreio, busque o status do pedido nesta rota."
                      className="rounded-xl text-xs bg-white border-[#E5E5EC]"
                    />
                    <span className="text-[10px] text-[#9B9BAD] mt-1 block">
                      Instrui quando o agente deve acionar esta integração.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50/70 border border-dashed border-[#E5E5EC] rounded-2xl max-w-3xl">
                  <Code2 className="w-8 h-8 text-[#9B9BAD] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1A1A24]">
                    Nenhuma integração de API configurada
                  </p>
                  <p className="text-xs text-[#5F5F6B] mt-1 max-w-md mx-auto">
                    Você pode avançar sem conectar APIs externas. Caso queira testar a chamada
                    simulada, ative o botão acima.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* ETAPA 5: Revisão e teste */}
          {/* ========================================================= */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4 flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-[#1A1A24]">
                      Etapa 5: Revisão e Teste Visual
                    </h3>
                    <Badge
                      variant="outline"
                      className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                    >
                      Demonstração
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Confira o resumo das escolhas feitas em cada etapa e valide o comportamento no
                    simulador interativo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Visual Mock Chat (7 cols) */}
                <div className="lg:col-span-7 flex flex-col border border-[#E5E5EC] rounded-2xl overflow-hidden bg-slate-50/50 h-[520px]">
                  {/* Chat Header */}
                  <div className="p-3.5 bg-white border-b border-[#E5E5EC] flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#7C5CFC] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1A1A24]">
                          {name || 'Agente Demonstrativo'}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Simulador Ativo • Sem IA externa
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const now = new Date()
                          const time = `${String(now.getHours()).padStart(2, '0')}:${String(
                            now.getMinutes(),
                          ).padStart(2, '0')}`
                          setTestMessages([
                            {
                              id: `reset-${Date.now()}`,
                              sender: 'agent',
                              text:
                                initialMessage.trim() ||
                                `Olá! Sou o ${name || 'Agente'}. Como posso ajudar você hoje?`,
                              time,
                            },
                          ])
                          toast({
                            title: 'Simulador reiniciado',
                            description: 'Histórico de mensagens de teste limpo com sucesso.',
                          })
                        }}
                        className="text-[11px] h-7 px-2 text-[#5F5F6B] hover:text-[#1A1A24] gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reiniciar</span>
                      </Button>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#5F5F6B]">
                        {getChannelDisplay(channelChoice).label}
                      </span>
                    </div>
                  </div>

                  {/* Messages list */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-3">
                    {testMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-[#7C5CFC] text-white rounded-br-none shadow-sm'
                              : 'bg-white text-[#1A1A24] border border-[#E5E5EC] rounded-bl-none shadow-sm'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[10px] text-[#9B9BAD] mt-1 px-1">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick test prompt chips */}
                  <div className="px-3 py-1.5 bg-slate-100/60 border-t border-slate-200/70 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
                    <span className="text-[#9B9BAD] shrink-0 font-medium">Testar com:</span>
                    {[
                      'Olá, qual é o valor dos planos?',
                      'Preciso falar com um atendente humano',
                      'Onde vejo o status do meu pedido?',
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          setTestInput(chip)
                        }}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#5F5F6B] hover:text-[#7C5CFC] hover:border-[#7C5CFC]/40 shrink-0 transition-colors"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* Input form */}
                  <form
                    onSubmit={handleSendTestMessage}
                    className="p-3 bg-white border-t border-[#E5E5EC] flex items-center gap-2"
                  >
                    <Input
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Digite uma mensagem para simular o diálogo..."
                      className="text-xs rounded-xl border-[#E5E5EC] focus-visible:ring-[#7C5CFC] h-9"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl h-9 px-3 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>

                {/* Resumo com links para voltar e editar (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="bg-[#FAF9FD] border border-[#E5E5EC] rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                      <h4 className="text-xs font-bold text-[#1A1A24] uppercase tracking-wider">
                        Resumo do Agente
                      </h4>
                      {isEditMode && existingAgent ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-[#5F5F6B] font-medium">Status:</span>
                          <StatusPill status={existingAgent.status} size="sm" />
                        </div>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 text-[10px] hover:bg-slate-100 font-semibold">
                          Status: Rascunho
                        </Badge>
                      )}
                    </div>

                    {/* Resumo Seção 1 */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A24]">1. Perfil</span>
                        <button
                          type="button"
                          onClick={() => handleGoToStep(1)}
                          className="text-[#7C5CFC] hover:underline text-[11px] font-medium flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[#5F5F6B]">Nome:</span>
                          <span className="font-medium text-[#1A1A24]">
                            {name || 'Não informado'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F5F6B]">Tipo:</span>
                          <span className="font-medium text-[#1A1A24]">{purpose}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#5F5F6B]">Canal:</span>
                          <span className="font-medium text-[#7C5CFC]">
                            {getChannelDisplay(channelChoice).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resumo Seção 2 */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A24]">2. Instruções</span>
                        <button
                          type="button"
                          onClick={() => handleGoToStep(2)}
                          className="text-[#7C5CFC] hover:underline text-[11px] font-medium flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 space-y-1 text-[11px]">
                        <div className="text-[#5F5F6B] line-clamp-2 italic">
                          &ldquo;{instructions}&rdquo;
                        </div>
                        <div className="pt-1 border-t border-slate-100 flex justify-between text-[#5F5F6B]">
                          <span>Transbordo humano:</span>
                          <strong
                            className={humanHandoffEnabled ? 'text-emerald-600' : 'text-slate-500'}
                          >
                            {humanHandoffEnabled ? 'Ativo' : 'Desativado'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Resumo Seção 3 */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A24]">3. Conhecimento</span>
                        <button
                          type="button"
                          onClick={() => handleGoToStep(3)}
                          className="text-[#7C5CFC] hover:underline text-[11px] font-medium flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-[11px]">
                        {selectedKnowledgeIds.length === 0 ? (
                          <span className="text-[#9B9BAD]">Nenhuma base vinculada</span>
                        ) : (
                          <div className="space-y-1">
                            {selectedKnowledgeIds.map((id) => {
                              const kb = knowledgeBases.find((k) => k.id === id)
                              return (
                                <div
                                  key={id}
                                  className="flex justify-between items-center text-[#1A1A24]"
                                >
                                  <span className="truncate">{kb?.name || id}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                    {kb?.type || 'Doc'}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Resumo Seção 4 */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#1A1A24]">4. Integrações</span>
                        <button
                          type="button"
                          onClick={() => handleGoToStep(4)}
                          className="text-[#7C5CFC] hover:underline text-[11px] font-medium flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3" /> Editar
                        </button>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200/70 text-[11px]">
                        {apiIntegrationEnabled ? (
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 font-medium text-[#1A1A24]">
                              <span className="px-1 py-0.2 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                                {apiMethod}
                              </span>
                              <span className="truncate">{apiName}</span>
                            </div>
                            <div className="text-[10px] text-[#9B9BAD] truncate font-mono">
                              {apiUrl}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[#9B9BAD]">
                            Nenhuma API demonstrativa configurada
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="space-y-2.5">
                    <Button
                      onClick={() => handleSave(true)}
                      className="w-full bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-10 shadow-sm gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {isEditMode
                          ? 'Salvar e Concluir Alterações'
                          : 'Concluir e Salvar como Rascunho'}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleSave(false)}
                      className="w-full border-[#E5E5EC] text-[#1A1A24] hover:bg-slate-50 rounded-xl text-xs h-10 gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-[#5F5F6B]" />
                      <span>{isEditMode ? 'Salvar Alterações' : 'Salvar Rascunho'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Bottom bar present in all steps) */}
          <div className="mt-8 pt-5 border-t border-[#E5E5EC] flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                disabled={currentStep === 1}
                onClick={handlePrevStep}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 disabled:opacity-40"
              >
                Voltar
              </Button>

              <Button
                variant="ghost"
                onClick={() => handleSave(false)}
                className="rounded-xl text-xs h-9 px-3 text-[#5F5F6B] hover:text-[#1A1A24] inline-flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isEditMode ? 'Salvar alterações' : 'Salvar rascunho'}</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {currentStep < 5 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 shadow-sm"
                >
                  Continuar
                </Button>
              ) : (
                <Button
                  onClick={() => handleSave(true)}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 shadow-sm gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{isEditMode ? 'Salvar Alterações' : 'Concluir Agente'}</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      </main>

      {/* Modal de criação de nova fonte de conhecimento (Etapa 3) */}
      <NovaFonteModal
        open={isNovaFonteModalOpen}
        onOpenChange={setIsNovaFonteModalOpen}
        currentAgentId={existingAgent?.id}
        onCreated={(newKb) => {
          // Seleciona automaticamente para o agente em edição ou criação
          setSelectedKnowledgeIds((prev) => (prev.includes(newKb.id) ? prev : [...prev, newKb.id]))
        }}
      />

      {/* Confirmation Dialog before discarding unsaved changes */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="rounded-2xl bg-white border border-[#E5E5EC] p-6 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-[#1A1A24]">
              Descartar alterações?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-[#5F5F6B]">
              Você possui dados modificados no assistente que ainda não foram salvos. Deseja
              realmente sair e descartar essas informações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel className="rounded-xl text-xs h-9 border-[#E5E5EC]">
              Continuar editando
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowCancelDialog(false)
                navigate('/agentes')
              }}
              className="rounded-xl text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white"
            >
              Sim, descartar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
