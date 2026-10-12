import { useState, useMemo } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import {
  ArrowLeft,
  Save,
  Play,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  Lock,
  Radio,
  FileText,
  UserCheck,
  Send,
  Sparkles,
  Check,
  Plus,
  HelpCircle,
  AlertCircle,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Stepper, StepItem } from '@/components/common/Stepper'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { AgentPurpose, AgentStatus } from '@/types/domain'

const CONFIG_STEPS: StepItem[] = [
  { id: 1, title: 'Perfil e objetivo', subtitle: 'Identificação' },
  { id: 2, title: 'Instruções', subtitle: 'Comportamento' },
  { id: 3, title: 'Conhecimento', subtitle: 'Bases vinculadas' },
  { id: 4, title: 'Ferramentas', subtitle: 'APIs e ações' },
  { id: 5, title: 'Canais e transbordo', subtitle: 'Atendimento' },
  { id: 6, title: 'Testar e publicar', subtitle: 'Validação' },
]

export default function ConfigAgente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { getAgentById, updateAgent, knowledgeBases, addKnowledgeBaseDemo } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const currentAgent = getAgentById(id || 'ag-1') || {
    id: 'ag-1',
    name: 'Assistente Comercial',
    purpose: 'Vendas' as AgentPurpose,
    description: 'Qualificação de leads B2B e catálogo comercial.',
    channel: 'WhatsApp',
    channelType: 'whatsapp' as const,
    status: 'ativo' as AgentStatus,
    lastActivity: 'há 2 min',
    instructions:
      'Responda sempre em tom cordial, consultivo e profissional em português do Brasil.',
    temperature: 0.3,
    model: 'gpt-4o-mini',
    knowledgeBaseIds: ['kb-1', 'kb-2'],
    humanHandoffEnabled: true,
  }

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([1])

  // Form local state
  const [name, setName] = useState(currentAgent.name)
  const [purpose, setPurpose] = useState<AgentPurpose>(currentAgent.purpose)
  const [description, setDescription] = useState(currentAgent.description)
  const [instructions, setInstructions] = useState(
    currentAgent.instructions ||
      'Responda de forma cordial, objetiva e em português do Brasil. Ajude os visitantes a entenderem os produtos e tire dúvidas com clareza.',
  )
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [temperature, setTemperature] = useState(currentAgent.temperature ?? 0.3)
  const [model, setModel] = useState(currentAgent.model || 'gpt-4o-mini')
  const [linkedKnowledge, setLinkedKnowledge] = useState<string[]>(
    currentAgent.knowledgeBaseIds || ['kb-1'],
  )
  const [humanHandoff, setHumanHandoff] = useState(currentAgent.humanHandoffEnabled ?? true)
  const [status, setStatus] = useState<AgentStatus>(currentAgent.status)

  // Interactive mock chat state
  const [testMessages, setTestMessages] = useState<
    { id: string; sender: 'user' | 'agent'; text: string; time: string }[]
  >([
    {
      id: 'tm-1',
      sender: 'agent',
      text: `Olá! Sou o ${name}. Como posso ajudar você hoje?`,
      time: '14:00',
    },
  ])
  const [testInput, setTestInput] = useState('')

  const handleNextStep = () => {
    if (currentStep < 6) {
      setCompletedSteps((prev) => Array.from(new Set([...prev, currentStep])))
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSaveDraft = () => {
    setStatus('rascunho')
    updateAgent({
      id: currentAgent.id,
      name,
      purpose,
      description,
      instructions,
      temperature,
      model,
      knowledgeBaseIds: linkedKnowledge,
      humanHandoffEnabled: humanHandoff,
      status: 'rascunho',
    })
    toast({
      title: 'Rascunho salvo',
      description: 'As alterações foram gravadas localmente como rascunho.',
    })
  }

  const handlePublish = () => {
    setStatus('ativo')
    updateAgent({
      id: currentAgent.id,
      name,
      purpose,
      description,
      instructions,
      temperature,
      model,
      knowledgeBaseIds: linkedKnowledge,
      humanHandoffEnabled: humanHandoff,
      status: 'ativo',
    })
    toast({
      title: 'Agente atualizado com sucesso!',
      description: 'Configurações validadas e publicadas em estado local.',
    })
  }

  const handleSendTestMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!testInput.trim()) return

    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
      2,
      '0',
    )}`

    const userMsg = {
      id: `tm-${Date.now()}`,
      sender: 'user' as const,
      text: testInput,
      time,
    }

    setTestMessages((prev) => [...prev, userMsg])
    setTestInput('')

    // Resposta simulada instantânea / canned
    setTimeout(() => {
      const cannedReply = {
        id: `reply-${Date.now()}`,
        sender: 'agent' as const,
        text: `Pedido recebido! Este é um protótipo de demonstração. Nenhuma IA está conectada. Configurado para: "${purpose}" com tom cordial.`,
        time,
      }
      setTestMessages((prev) => [...prev, cannedReply])
    }, 700)
  }

  const toggleKnowledgeLink = (kbId: string) => {
    setLinkedKnowledge((prev) =>
      prev.includes(kbId) ? prev.filter((id) => id !== kbId) : [...prev, kbId],
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-16">
      {/* Header com ações principais */}
      <Header
        title={name}
        breadcrumbs={[
          { label: 'Início', href: '/' },
          { label: 'Agentes', href: '/agentes' },
          { label: name },
        ]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/30">
              <Sparkles className="w-3 h-3 text-[#7C5CFC]" />
              <span>Demonstração</span>
            </span>

            <StatusPill status={status} size="sm" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveDraft}
              className="rounded-xl border-[#E5E5EC] text-[#1A1A24] text-xs h-9 hidden sm:flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-[#5F5F6B]" />
              <span>Salvar rascunho</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep(6)}
              className="rounded-xl border-[#7C5CFC]/40 text-[#7C5CFC] hover:bg-[#F1EEFE] text-xs h-9 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Testar agente</span>
            </Button>

            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl shadow-sm text-xs font-semibold h-9 px-3.5"
            >
              <UploadCloud className="w-4 h-4 mr-1.5" />
              Publicar
            </Button>
          </div>
        }
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Back Link and Metadata Banner */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/agentes')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5F5F6B] hover:text-[#7C5CFC] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Agentes</span>
          </button>

          {currentAgent.apiIntegration?.enabled && (
            <div className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1.5">
              <span className="font-semibold uppercase text-[9px] bg-emerald-200 px-1 py-0.2 rounded">
                {currentAgent.apiIntegration.method}
              </span>
              <span>API Vinculada: {currentAgent.apiIntegration.name}</span>
            </div>
          )}
        </div>

        {/* Stepper Progress */}
        <Stepper
          steps={CONFIG_STEPS}
          currentStep={currentStep}
          onSelectStep={setCurrentStep}
          completedSteps={completedSteps}
        />

        {/* Step Container Card */}
        <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm">
          {/* STEP 1: Perfil e objetivo */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <h3 className="text-lg font-bold text-[#1A1A24]">
                  Etapa 1: Perfil e Objetivo do Agente
                </h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Defina o nome de exibição, a categoria de atuação e a principal meta de negócio.
                </p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Nome do agente <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Assistente Comercial"
                    className="rounded-xl border-[#E5E5EC] text-sm focus-visible:ring-[#7C5CFC]"
                  />
                  <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                    Nome visível para a equipe interna e no cabeçalho dos atendimentos.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Finalidade principal <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as AgentPurpose)}
                    className="w-full bg-white border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-sm px-3.5 py-2.5 focus:ring-[#7C5CFC] focus:outline-none"
                  >
                    <option value="Atendimento">Atendimento (FAQ e triagem)</option>
                    <option value="Suporte">Suporte Técnico (Triagem e resoluções)</option>
                    <option value="SDR">SDR (Pré-vendas e qualificação)</option>
                    <option value="BDR">BDR (Prospecção ativa)</option>
                    <option value="Vendas">Vendas (Qualificação e conversão)</option>
                    <option value="Personalizado">Personalizado (Fluxo sob medida)</option>
                    <option value="Outros">Outros fluxos operacionais</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Objetivo principal / Breve descrição
                  </label>
                  <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Ajudar clientes a escolher produtos, qualificar leads e responder dúvidas comerciais com base no catálogo oficial."
                    className="rounded-xl border-[#E5E5EC] text-sm focus-visible:ring-[#7C5CFC]"
                  />
                  <span className="text-[11px] text-[#9B9BAD] mt-1 block">
                    Exemplo curto e realista para contextualizar o propósito deste agente.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Instruções de comportamento */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <h3 className="text-lg font-bold text-[#1A1A24]">
                  Etapa 2: Instruções de Comportamento
                </h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Guie o tom de voz, regras de atendimento e como o agente deve conduzir as
                  conversas.
                </p>
              </div>

              <div className="space-y-5 max-w-2xl">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-[#1A1A24]">
                      Como o agente deve se comportar (Prompt do Sistema)
                    </label>
                    <span className="text-[11px] text-[#7C5CFC] font-medium">pt-BR</span>
                  </div>
                  <Textarea
                    rows={6}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Ex: Responda de forma cordial, objetiva e em português do Brasil. Nunca prometa descontos não autorizados. Se o cliente solicitar atendimento humano, acione a ferramenta correspondente."
                    className="rounded-xl border-[#E5E5EC] text-sm font-mono text-xs leading-relaxed focus-visible:ring-[#7C5CFC]"
                  />
                  <div className="mt-2 p-3 rounded-xl bg-[#F7F7FB] border border-[#E5E5EC] text-xs text-[#5F5F6B] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
                    <span>
                      Dica: inclua regras claras de escopo, tom da conversa e instruções de quando
                      sugerir transbordo para operadores humanos.
                    </span>
                  </div>
                </div>

                {/* Opções Técnicas Avançadas (COLAPSADAS / SECUNDÁRIAS) */}
                <div className="border border-[#E5E5EC] rounded-2xl p-4 bg-slate-50/50">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[#5F5F6B] hover:text-[#1A1A24]"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#9B9BAD]" />
                      Opções Técnicas Avançadas (Modelo e Temperatura)
                    </span>
                    {showAdvanced ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {showAdvanced && (
                    <div className="mt-4 pt-4 border-t border-[#E5E5EC] space-y-4 text-xs">
                      <p className="text-[11px] text-[#9B9BAD]">
                        Configurações técnicas mantidas em segundo plano para priorizar usabilidade
                        operacional no dia a dia.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#5F5F6B] mb-1">
                            Modelo Base
                          </label>
                          <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full bg-white border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3 py-2"
                          >
                            <option value="gpt-4o-mini">gpt-4o-mini (Recomendado para B2B)</option>
                            <option value="gpt-4o">gpt-4o (Alta complexidade)</option>
                            <option value="claude-3-haiku">claude-3-haiku</option>
                          </select>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-[11px] font-semibold text-[#5F5F6B]">
                              Temperatura: {temperature}
                            </label>
                            <span className="text-[10px] text-[#9B9BAD]">
                              {temperature < 0.3 ? 'Muito Preciso' : 'Criativo'}
                            </span>
                          </div>
                          <Slider
                            value={[temperature]}
                            min={0}
                            max={1}
                            step={0.1}
                            onValueChange={(val) => setTemperature(val[0])}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Conhecimento */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-start justify-between flex-wrap gap-3 border-b border-[#E5E5EC] pb-4">
                <div>
                  <h3 className="text-lg font-bold text-[#1A1A24]">
                    Etapa 3: Bases de Conhecimento
                  </h3>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Selecione quais documentos, FAQs ou páginas sincronizadas o agente pode
                    consultar.
                  </p>
                </div>
                <Button
                  onClick={addKnowledgeBaseDemo}
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-[#E5E5EC] text-xs h-8 gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  <span>Adicionar fonte</span>
                </Button>
              </div>

              {knowledgeBases.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-[#E5E5EC]">
                  <FileText className="w-8 h-8 text-[#9B9BAD] mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1A1A24]">
                    Nenhuma base vinculada ainda
                  </p>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Vincule uma base existente ou acesse a biblioteca de conhecimento.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-w-3xl">
                  {knowledgeBases.map((kb) => {
                    const isLinked = linkedKnowledge.includes(kb.id)
                    return (
                      <div
                        key={kb.id}
                        onClick={() => toggleKnowledgeLink(kb.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isLinked
                            ? 'bg-[#F1EEFE]/40 border-[#7C5CFC]/40 shadow-sm'
                            : 'bg-white border-[#E5E5EC] hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isLinked ? 'bg-[#7C5CFC] text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-[#1A1A24] truncate">
                                {kb.name}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                                {kb.type}
                              </span>
                              <StatusPill status={kb.status} size="sm" />
                            </div>
                            <p className="text-xs text-[#5F5F6B] mt-0.5 truncate">
                              {kb.description || 'Fonte para resolução de dúvidas'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`text-xs font-semibold ${
                              isLinked ? 'text-[#7C5CFC]' : 'text-[#9B9BAD]'
                            }`}
                          >
                            {isLinked ? 'Vinculada' : 'Não vinculada'}
                          </span>
                          <Switch
                            checked={isLinked}
                            onCheckedChange={() => toggleKnowledgeLink(kb.id)}
                            className="data-[state=checked]:bg-[#7C5CFC]"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Ferramentas (marcadas como não conectadas) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <h3 className="text-lg font-bold text-[#1A1A24]">Etapa 4: Ferramentas do Agente</h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Capacidades estendidas como consultas a APIs e transbordo para suporte humano.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5 max-w-3xl">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Aviso de Protótipo:</strong> Todas as ferramentas abaixo estão claramente
                  marcadas como <em>Não Conectadas</em>. A ativação e autenticação por chaves
                  ocorrerá nas próximas etapas da plataforma.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {/* Tool 1 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#1A1A24]">Consultar API</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        <Lock className="w-3 h-3 text-slate-500" /> Não conectada
                      </span>
                    </div>
                    <p className="text-xs text-[#5F5F6B]">
                      Permite que o agente consulte rotas REST externas para obter dados em tempo
                      real (ex: status de pedidos).
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-[#9B9BAD]">
                    Disponível após homologação do endpoint
                  </div>
                </div>

                {/* Tool 2 */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#1A1A24]">
                        Solicitar Atendimento Humano
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        <Lock className="w-3 h-3 text-slate-500" /> Não conectada
                      </span>
                    </div>
                    <p className="text-xs text-[#5F5F6B]">
                      Identifica frustração ou pedidos explícitos de falar com uma pessoa e
                      transfere a conversa para a caixa de entrada.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-amber-700 font-medium">
                    Requer canal configurado com suporte a transbordo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Canais e atendimento humano */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <h3 className="text-lg font-bold text-[#1A1A24]">
                  Etapa 5: Canais e Transbordo Humano
                </h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Selecione onde o agente irá responder e configure as regras de encaminhamento para
                  a equipe.
                </p>
              </div>

              {/* Handoff Toggle */}
              <div className="p-4 rounded-2xl bg-[#F7F7FB] border border-[#E5E5EC] flex items-center justify-between gap-4 max-w-3xl">
                <div>
                  <h4 className="text-sm font-semibold text-[#1A1A24] flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#7C5CFC]" />
                    Transferência para atendimento humano
                  </h4>
                  <p className="text-xs text-[#5F5F6B] mt-0.5">
                    Permite mover conversas automaticamente para a fila de &quot;Aguardando
                    atendimento humano&quot; em caso de dúvida complexa.
                  </p>
                </div>
                <Switch
                  checked={humanHandoff}
                  onCheckedChange={setHumanHandoff}
                  className="data-[state=checked]:bg-[#7C5CFC]"
                />
              </div>

              {/* Channel Cards (Disabled style with toast) */}
              <div className="space-y-3 max-w-3xl">
                <label className="text-xs font-semibold text-[#1A1A24] block">
                  Canais de Comunicação
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* WhatsApp */}
                  <div className="p-4 rounded-2xl border border-[#E5E5EC] bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#1A1A24] flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-[#7C5CFC]" /> WhatsApp Business
                        </span>
                        <StatusPill status="nao_conectado" size="sm" />
                      </div>
                      <p className="text-xs text-[#5F5F6B]">
                        Integração oficial via Meta Cloud API para atendimento automático no número
                        da empresa.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Canal WhatsApp',
                          description:
                            'Disponível em breve: conexão assistida com a Cloud API oficial da Meta.',
                        })
                      }
                      className="mt-4 rounded-xl border-[#E5E5EC] text-xs h-8 text-[#5F5F6B] hover:text-[#1A1A24]"
                    >
                      Conectar canal
                    </Button>
                  </div>

                  {/* Webchat */}
                  <div className="p-4 rounded-2xl border border-[#E5E5EC] bg-white flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#1A1A24] flex items-center gap-1.5">
                          <Radio className="w-4 h-4 text-[#7C5CFC]" /> Chat do Site
                        </span>
                        <StatusPill status="nao_conectado" size="sm" />
                      </div>
                      <p className="text-xs text-[#5F5F6B]">
                        Widget flutuante JavaScript para incorporar nas páginas do seu produto ou
                        portal.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast({
                          title: 'Chat do Site',
                          description: 'Disponível em breve: código de incorporação e snippet JS.',
                        })
                      }
                      className="mt-4 rounded-xl border-[#E5E5EC] text-xs h-8 text-[#5F5F6B] hover:text-[#1A1A24]"
                    >
                      Conectar canal
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Testar e publicar */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-[#E5E5EC] pb-4">
                <h3 className="text-lg font-bold text-[#1A1A24]">
                  Etapa 6: Testar e Publicar Agente
                </h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Valide a simulação do fluxo de mensagens antes de disponibilizar o agente para os
                  clientes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Chat Mock Preview (7 cols) */}
                <div className="lg:col-span-7 flex flex-col border border-[#E5E5EC] rounded-2xl overflow-hidden bg-slate-50/50 h-[480px]">
                  {/* Chat Preview Header */}
                  <div className="p-3.5 bg-white border-b border-[#E5E5EC] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#7C5CFC] text-white flex items-center justify-center text-xs font-bold">
                        AI
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-[#1A1A24]">{name}</div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Simulador Ativo (Sem IA externa)
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-[#5F5F6B]">
                      Canal: {currentAgent.channel}
                    </span>
                  </div>

                  {/* Messages Feed */}
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

                  {/* Test Input */}
                  <form
                    onSubmit={handleSendTestMessage}
                    className="p-3 bg-white border-t border-[#E5E5EC] flex items-center gap-2"
                  >
                    <Input
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Digite uma mensagem para testar o agente..."
                      className="text-xs rounded-xl border-[#E5E5EC] focus-visible:ring-[#7C5CFC] h-9"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl h-9 px-3"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </Button>
                  </form>
                </div>

                {/* Summary Card (5 cols) */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                  <div className="bg-[#FAF9FD] border border-[#E5E5EC] rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider">
                      Resumo da Configuração
                    </h4>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-[#5F5F6B]">Agente:</span>
                        <span className="font-semibold text-[#1A1A24]">{name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-[#5F5F6B]">Finalidade:</span>
                        <span className="font-medium text-[#1A1A24]">{purpose}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-[#5F5F6B]">Bases vinculadas:</span>
                        <span className="font-medium text-[#7C5CFC]">
                          {linkedKnowledge.length} base(s)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-200/60">
                        <span className="text-[#5F5F6B]">Transbordo humano:</span>
                        <span className="font-medium text-[#1A1A24]">
                          {humanHandoff ? 'Habilitado' : 'Desabilitado'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-[#5F5F6B]">Status final:</span>
                        <StatusPill status={status} size="sm" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-violet-50/70 border border-[#7C5CFC]/20 text-[11px] text-[#5232CD]">
                      Ao publicar, a versão mais recente deste agente substitui o rascunho anterior
                      localmente.
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Button
                      onClick={handlePublish}
                      className="w-full bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-10 shadow-sm"
                    >
                      <Check className="w-4 h-4 mr-1.5" />
                      Publicar Agente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleSaveDraft}
                      className="w-full border-[#E5E5EC] text-[#1A1A24] hover:bg-slate-50 rounded-xl text-xs h-10"
                    >
                      Salvar como Rascunho
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons (Bottom) */}
          <div className="mt-8 pt-5 border-t border-[#E5E5EC] flex items-center justify-between">
            <Button
              variant="outline"
              disabled={currentStep === 1}
              onClick={handlePrevStep}
              className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 disabled:opacity-40"
            >
              Voltar
            </Button>

            {currentStep < 6 ? (
              <Button
                onClick={handleNextStep}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 shadow-sm"
              >
                Avançar
              </Button>
            ) : (
              <Button
                onClick={() => {
                  handlePublish()
                  navigate('/agentes')
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold h-9 px-5 shadow-sm"
              >
                Concluir e Voltar
              </Button>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}
