import { useState, useMemo, useRef, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Search,
  CheckCircle2,
  UserCheck,
  RotateCcw,
  Send,
  Radio,
  Clock,
  User,
  Bot,
  Tag,
  Phone,
  Mail,
  Building2,
  MapPin,
  Calendar,
  History,
  Info,
  ChevronLeft,
  Plus,
  X,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  ExternalLink,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useApp } from '@/context/AppContext'
import { ConversationStatus, ChannelType } from '@/types/domain'

const QUICK_TAG_SUGGESTIONS = [
  'Urgente',
  'Orçamento',
  'Retorno',
  'Lead B2B',
  'Suporte',
  'Dúvida Técnica',
  'Reunião Agendada',
  'Prioridade Alta',
]

export default function Conversas() {
  const {
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
    agents,
    users,
  } = useApp()

  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  // Filtros e busca
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [filterChannel, setFilterChannel] = useState<string>('todos')

  // Mobile navigation views: 'list' | 'chat' | 'contact'
  const [mobileView, setMobileView] = useState<'list' | 'chat' | 'contact'>('list')

  // Aba selecionada no painel lateral direito: 'contato' | 'lead'
  const [rightPanelTab, setRightPanelTab] = useState<'lead' | 'contato'>('lead')

  const navigate = useNavigate()
  const { leads, leadStages, updateLeadStage, assignLeadOwner, getLeadByConversationId } = useApp()

  // Input de mensagem
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Dialog de adicionar etiqueta
  const [isAddTagOpen, setIsAddTagOpen] = useState(false)
  const [newTagInput, setNewTagInput] = useState('')

  // Conversa ativa selecionada
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || conversations[0] || null
  }, [conversations, selectedConversationId])

  // Sincroniza se a conversa ativa não coincidir
  useEffect(() => {
    if (activeConversation && selectedConversationId !== activeConversation.id) {
      setSelectedConversationId(activeConversation.id)
    }
  }, [activeConversation, selectedConversationId, setSelectedConversationId])

  // Conversas filtradas
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      // Busca por nome do contato, última mensagem, tags ou conteúdo interno das mensagens
      const query = search.toLowerCase().trim()
      const matchSearch =
        !query ||
        c.contactName.toLowerCase().includes(query) ||
        c.lastMessage.toLowerCase().includes(query) ||
        c.tags.some((t) => t.toLowerCase().includes(query)) ||
        c.messages.some((m) => m.text.toLowerCase().includes(query))

      // Filtro de status: Todos, Abertas ('aberta'), Pendentes ('aguardando'), Resolvidas ('resolvida')
      const matchStatus =
        filterStatus === 'todos' || c.status === (filterStatus as ConversationStatus)

      // Filtro de canal: Todos, WhatsApp, Chat do site
      let matchChannel = true
      if (filterChannel === 'whatsapp') {
        matchChannel = c.channelType === 'whatsapp'
      } else if (filterChannel === 'webchat') {
        matchChannel = c.channelType === 'webchat'
      }

      return matchSearch && matchStatus && matchChannel
    })
  }, [conversations, search, filterStatus, filterChannel])

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages?.length])

  // Submissão de nova mensagem demonstrativa
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim() || !activeConversation) return

    addMessageToConversation(activeConversation.id, inputText)
    setInputText('')
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setMobileView('chat')
  }

  const handleAddCustomTag = (tagToAdd?: string) => {
    const tag = tagToAdd || newTagInput
    if (!tag.trim() || !activeConversation) return

    addConversationTag(activeConversation.id, tag.trim())
    setNewTagInput('')
    setIsAddTagOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Caixa de entrada"
        subtitle="Supervisão em tempo real e atendimento híbrido (IA + Humano)"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Conversas' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/20">
              <Sparkles className="w-3.5 h-3.5" />
              Demonstração Interativa
            </span>
          </div>
        }
      />

      {/* Faixa global discreta informativa sobre ambiente demonstrativo */}
      <div className="bg-[#FAF9FD] border-b border-[#E5E5EC] px-4 py-1.5 flex items-center justify-between text-xs text-[#5F5F6B] shrink-0">
        <div className="flex items-center gap-2 truncate">
          <Info className="w-3.5 h-3.5 text-[#7C5CFC] shrink-0" />
          <span className="truncate">
            <strong>Ambiente de Demonstração:</strong> Todas as conversas, agentes e respostas
            operam no navegador. Nenhuma mensagem é disparada a clientes reais.
          </span>
        </div>
        <Badge
          variant="outline"
          className="border-[#7C5CFC]/30 text-[#7C5CFC] bg-white text-[10px] shrink-0 font-medium"
        >
          Demonstração
        </Badge>
      </div>

      {/* Layout Principal 3 Colunas com suporte Responsivo */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white relative">
        {/* ========================================================= */}
        {/* COLUNA 1: Lista de conversas (340px - 380px)              */}
        {/* ========================================================= */}
        <div
          className={`w-full lg:w-[360px] xl:w-[380px] border-r border-[#E5E5EC] flex flex-col h-full shrink-0 bg-[#FAF9FD] ${
            mobileView === 'list' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top Search & Filter Bar */}
          <div className="p-3.5 border-b border-[#E5E5EC] space-y-2.5 bg-white shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BAD]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por contato, mensagem ou tag..."
                className="pl-9 text-xs rounded-xl border-[#E5E5EC] bg-[#F7F7FB] h-9 focus-visible:ring-[#7C5CFC]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9B9BAD] hover:text-[#1A1A24]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filtros por Status */}
            <div>
              <div className="text-[10px] font-semibold text-[#9B9BAD] uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Filtrar por Status</span>
                <span className="text-[10px] text-[#5F5F6B] font-normal">
                  {filteredConversations.length}{' '}
                  {filteredConversations.length === 1 ? 'conversa' : 'conversas'}
                </span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'todos', label: 'Todas' },
                  { id: 'aberta', label: 'Abertas' },
                  { id: 'aguardando', label: 'Pendentes' },
                  { id: 'resolvida', label: 'Resolvidas' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilterStatus(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      filterStatus === f.id
                        ? 'bg-[#7C5CFC] text-white shadow-xs font-semibold'
                        : 'bg-[#F7F7FB] text-[#5F5F6B] hover:bg-slate-200/70 border border-[#E5E5EC]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro por Canal */}
            <div>
              <div className="text-[10px] font-semibold text-[#9B9BAD] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Canal</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'whatsapp', label: 'WhatsApp' },
                  { id: 'webchat', label: 'Chat do site' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFilterChannel(c.id)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium text-center truncate transition-all ${
                      filterChannel === c.id
                        ? 'bg-[#1A1A24] text-white font-semibold'
                        : 'bg-[#F7F7FB] text-[#5F5F6B] hover:bg-slate-200/70 border border-[#E5E5EC]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Lista de Itens de Conversa */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5EC]/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-[#9B9BAD] mx-auto stroke-1" />
                <p className="text-xs font-medium text-[#1A1A24]">Nenhuma conversa encontrada</p>
                <p className="text-[11px] text-[#9B9BAD] max-w-[200px] mx-auto">
                  Ajuste o termo de busca ou altere os filtros de status e canal.
                </p>
                {(search || filterStatus !== 'todos' || filterChannel !== 'todos') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setFilterStatus('todos')
                      setFilterChannel('todos')
                    }}
                    className="text-xs mt-2 rounded-xl border-[#E5E5EC]"
                  >
                    Limpar filtros
                  </Button>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`p-3.5 transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#7C5CFC] shadow-xs'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    {/* Top row: Nome + Horário */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-6 h-6 rounded-full bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center font-bold text-[10px] shrink-0">
                          {conv.contactName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="font-semibold text-xs text-[#1A1A24] truncate">
                          {conv.contactName}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9B9BAD] shrink-0 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {conv.updatedAt}
                      </span>
                    </div>

                    {/* Preview da última mensagem */}
                    <p className="text-xs text-[#5F5F6B] line-clamp-2 leading-relaxed">
                      {conv.lastMessage}
                    </p>

                    {/* Tags preview */}
                    {conv.tags && conv.tags.length > 0 && (
                      <div className="flex items-center gap-1 overflow-hidden mt-0.5">
                        {conv.tags.slice(0, 2).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[#F1EEFE] text-[#7C5CFC] font-medium truncate max-w-[100px]"
                          >
                            {t}
                          </span>
                        ))}
                        {conv.tags.length > 2 && (
                          <span className="text-[9px] text-[#9B9BAD]">+{conv.tags.length - 2}</span>
                        )}
                      </div>
                    )}

                    {/* Rodapé do card: Canal + Atribuição + Status */}
                    <div className="flex items-center justify-between gap-1.5 mt-1 pt-1.5 border-t border-[#E5E5EC]/50 text-[10px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white border border-[#E5E5EC] text-[#5F5F6B] font-medium shrink-0">
                          <Radio className="w-2.5 h-2.5 text-[#7C5CFC]" />
                          {conv.channel}
                        </span>

                        {/* Atendente ou Agente */}
                        <span className="text-[#5F5F6B] truncate">
                          {conv.assignedHumanName ? (
                            <span className="text-emerald-700 font-medium inline-flex items-center gap-0.5">
                              <UserCheck className="w-2.5 h-2.5" />
                              {conv.assignedHumanName.split(' ')[0]}
                            </span>
                          ) : (
                            <span className="text-[#7C5CFC] inline-flex items-center gap-0.5">
                              <Bot className="w-2.5 h-2.5" />
                              {conv.assignedAgentName.split(' ')[0]}
                            </span>
                          )}
                        </span>
                      </div>

                      <StatusPill
                        status={conv.status}
                        size="sm"
                        label={
                          conv.status === 'aberta'
                            ? 'Aberta'
                            : conv.status === 'aguardando'
                              ? 'Pendente'
                              : 'Resolvida'
                        }
                      />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* COLUNA 2: Histórico e Resposta (Painel Central)            */}
        {/* ========================================================= */}
        {activeConversation ? (
          <div
            className={`flex-1 flex flex-col h-full bg-[#F7F7FB] border-r border-[#E5E5EC] overflow-hidden ${
              mobileView === 'chat' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Header da Conversa */}
            <div className="p-3 sm:p-3.5 bg-white border-b border-[#E5E5EC] flex flex-wrap items-center justify-between gap-2.5 shadow-xs shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Botão voltar para a lista em mobile */}
                <button
                  type="button"
                  onClick={() => setMobileView('list')}
                  className="lg:hidden p-1.5 rounded-lg border border-[#E5E5EC] text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100"
                  aria-label="Voltar para a lista de conversas"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="w-9 h-9 rounded-full bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center font-bold text-xs shrink-0">
                  {activeConversation.contactName.substring(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1A1A24] truncate">
                      {activeConversation.contactName}
                    </h3>
                    <StatusPill
                      status={activeConversation.status}
                      size="sm"
                      label={
                        activeConversation.status === 'aberta'
                          ? 'Aberta'
                          : activeConversation.status === 'aguardando'
                            ? 'Pendente'
                            : 'Resolvida'
                      }
                    />
                  </div>

                  {/* Detalhes de canal e atribuição ativa */}
                  <div className="text-[11px] text-[#5F5F6B] flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 font-medium text-[#1A1A24]">
                      <Radio className="w-3 h-3 text-[#7C5CFC]" />
                      {activeConversation.channel}
                    </span>
                    <span>•</span>
                    <span className="truncate">
                      Agente IA:{' '}
                      <strong className="text-[#1A1A24] font-medium">
                        {activeConversation.assignedAgentName}
                      </strong>
                    </span>
                    {activeConversation.assignedHumanName && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-700 font-semibold truncate inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                          {activeConversation.assignedHumanName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações do cabeçalho da conversa */}
              <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                {/* Botão para ver painel do contato no mobile */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMobileView('contact')}
                  className="lg:hidden rounded-xl border-[#E5E5EC] text-xs h-8 px-2.5"
                >
                  <User className="w-3.5 h-3.5 text-[#5F5F6B]" />
                  <span>Contato</span>
                </Button>

                {/* Ação Demonstrativa "Assumir atendimento" */}
                {!activeConversation.assignedHumanName ? (
                  <Button
                    size="sm"
                    onClick={() => takeOverConversation(activeConversation.id)}
                    className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs h-8 px-3 font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assumir atendimento</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => returnToAgent(activeConversation.id)}
                    className="rounded-xl border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-[#F1EEFE] text-xs h-8 px-2.5 flex items-center gap-1"
                    title="Devolve as respostas automáticas ao agente de IA"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Devolver à IA</span>
                  </Button>
                )}

                {/* Dropdown Atribuição */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-[#E5E5EC] text-xs h-8 px-2.5 flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5 text-[#5F5F6B]" />
                      <span className="hidden sm:inline">Atribuir</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 bg-white border border-[#E5E5EC] rounded-xl shadow-lg p-1.5"
                  >
                    <DropdownMenuLabel className="text-[11px] font-semibold text-[#9B9BAD] uppercase tracking-wider px-2 py-1">
                      Agente de IA Responsável
                    </DropdownMenuLabel>
                    {agents.map((ag) => (
                      <DropdownMenuItem
                        key={ag.id}
                        onClick={() => assignConversationAgent(activeConversation.id, ag.id)}
                        className={`text-xs cursor-pointer flex items-center justify-between rounded-lg px-2 py-1.5 ${
                          activeConversation.assignedAgentId === ag.id
                            ? 'bg-[#F1EEFE] text-[#7C5CFC] font-semibold'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Bot className="w-3.5 h-3.5 text-[#7C5CFC]" />
                          <span>{ag.name}</span>
                        </div>
                        <span className="text-[10px] text-[#9B9BAD]">{ag.purpose}</span>
                      </DropdownMenuItem>
                    ))}

                    <DropdownMenuSeparator className="my-1.5 bg-[#E5E5EC]" />

                    <DropdownMenuLabel className="text-[11px] font-semibold text-[#9B9BAD] uppercase tracking-wider px-2 py-1">
                      Atendente Humano
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => assignConversationHuman(activeConversation.id, null)}
                      className="text-xs cursor-pointer rounded-lg px-2 py-1.5 text-[#5F5F6B]"
                    >
                      <span>Nenhum (somente IA autônoma)</span>
                    </DropdownMenuItem>
                    {users.map((u) => (
                      <DropdownMenuItem
                        key={u.id}
                        onClick={() => assignConversationHuman(activeConversation.id, u.id)}
                        className={`text-xs cursor-pointer flex items-center justify-between rounded-lg px-2 py-1.5 ${
                          activeConversation.assignedHumanId === u.id
                            ? 'bg-emerald-50 text-emerald-800 font-semibold'
                            : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{u.name}</span>
                        </div>
                        <span className="text-[10px] text-[#9B9BAD]">{u.role}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Dropdown Alterar Status */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-[#E5E5EC] text-xs h-8 px-2.5 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5F5F6B]" />
                      <span className="hidden sm:inline">Status</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white border border-[#E5E5EC] rounded-xl shadow-lg p-1.5"
                  >
                    <DropdownMenuLabel className="text-[11px] font-semibold text-[#9B9BAD] uppercase tracking-wider px-2 py-1">
                      Mudar Status
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-[#E5E5EC]" />
                    <DropdownMenuItem
                      onClick={() => updateConversationStatus(activeConversation.id, 'aberta')}
                      className={`text-xs cursor-pointer rounded-lg px-2 py-1.5 ${
                        activeConversation.status === 'aberta'
                          ? 'bg-violet-50 text-violet-700 font-semibold'
                          : ''
                      }`}
                    >
                      Aberta (Em andamento)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateConversationStatus(activeConversation.id, 'aguardando')}
                      className={`text-xs cursor-pointer rounded-lg px-2 py-1.5 ${
                        activeConversation.status === 'aguardando'
                          ? 'bg-amber-50 text-amber-800 font-semibold'
                          : ''
                      }`}
                    >
                      Pendente (Aguardando)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => updateConversationStatus(activeConversation.id, 'resolvida')}
                      className={`text-xs cursor-pointer rounded-lg px-2 py-1.5 ${
                        activeConversation.status === 'resolvida'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : ''
                      }`}
                    >
                      Resolvida (Concluída)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Aviso demonstrativo em destaque sutil acima da conversa */}
            <div className="bg-amber-50/70 border-b border-amber-200/50 px-4 py-2 flex items-center justify-between text-[11px] text-amber-900 shrink-0">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>
                  <strong>Aviso demonstrativo:</strong> As mensagens enviadas abaixo ficam salvas
                  localmente e não são entregues a clientes reais.
                </span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-200/60 text-amber-900">
                Mock Local
              </span>
            </div>

            {/* Fluxo de Mensagens */}
            <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
              <div className="text-center my-1">
                <span className="text-[10px] text-[#9B9BAD] bg-white border border-[#E5E5EC] px-3 py-1 rounded-full shadow-xs">
                  Atendimento iniciado via {activeConversation.channel} • Histórico demonstrativo
                </span>
              </div>

              {activeConversation.messages.map((m) => {
                const isUser = m.sender === 'user'
                const isHuman = m.sender === 'human'
                const isAgent = m.sender === 'agent'

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    {/* Cabeçalho da bolha de mensagem */}
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#9B9BAD]">
                      {isUser ? (
                        <>
                          <div className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[9px]">
                            {m.senderName.charAt(0)}
                          </div>
                          <span className="font-semibold text-[#1A1A24]">{m.senderName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            Cliente
                          </span>
                        </>
                      ) : isHuman ? (
                        <>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                            Atendente Humano
                          </span>
                          <span className="font-semibold text-emerald-800">{m.senderName}</span>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F1EEFE] text-[#7C5CFC] font-semibold border border-[#7C5CFC]/30">
                            Agente de IA
                          </span>
                          <span className="font-semibold text-[#7C5CFC]">{m.senderName}</span>
                          <Bot className="w-3.5 h-3.5 text-[#7C5CFC]" />
                        </>
                      )}
                      <span>• {m.timestamp}</span>
                    </div>

                    {/* Conteúdo da bolha com estilo diferenciado por remetente */}
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-white text-[#1A1A24] border border-[#E5E5EC] rounded-tl-none'
                          : isHuman
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-[#7C5CFC] text-white rounded-tr-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Caixa de Entrada e Envio */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 sm:p-3.5 bg-white border-t border-[#E5E5EC] flex flex-col gap-2 shrink-0"
            >
              <div className="flex items-center gap-2">
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva uma resposta humana demonstrativa..."
                  className="text-xs rounded-xl border-[#E5E5EC] bg-[#F7F7FB] focus-visible:ring-[#7C5CFC] h-10 flex-1"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim()}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl h-10 px-4 shrink-0 font-semibold text-xs gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <span>Enviar</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#9B9BAD] px-1">
                <span>Pressione Enter para enviar para o histórico local</span>
                <span className="text-[#7C5CFC] font-medium hidden sm:inline">
                  Atuando como:{' '}
                  {activeConversation.assignedHumanName || 'Marcelo Figueiroa (Atendente)'}
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div
            className={`flex-1 flex items-center justify-center p-8 bg-[#F7F7FB] ${
              mobileView === 'chat' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <EmptyState
              icon={MessageSquare}
              title="Selecione uma conversa"
              description="Escolha uma conversa na lista para acompanhar o histórico, intervir com atendimento humano ou alterar atribuições."
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* COLUNA 3: Painel Lateral Direito (Abas: Lead CRM / Contato) */}
        {/* ========================================================= */}
        {activeConversation &&
          (() => {
            const associatedLead = getLeadByConversationId(activeConversation.id)

            return (
              <div
                className={`w-full lg:w-[320px] xl:w-[340px] border-l border-[#E5E5EC] bg-white p-4 sm:p-5 flex flex-col space-y-4 shrink-0 overflow-y-auto ${
                  mobileView === 'contact' ? 'flex' : 'hidden lg:flex'
                }`}
              >
                {/* Botão voltar para o chat no mobile */}
                <div className="lg:hidden flex items-center justify-between pb-2 border-b border-[#E5E5EC]">
                  <button
                    type="button"
                    onClick={() => setMobileView('chat')}
                    className="flex items-center gap-1 text-xs font-semibold text-[#7C5CFC]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Voltar à conversa
                  </button>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-[#7C5CFC]/30 text-[#7C5CFC]"
                  >
                    Demonstração
                  </Badge>
                </div>

                {/* Seletor de Abas no Painel Direito: Lead Comercial vs Contato Geral */}
                <div className="flex items-center p-1 bg-[#FAF9FD] rounded-xl border border-[#E5E5EC] shrink-0">
                  <button
                    type="button"
                    onClick={() => setRightPanelTab('lead')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      rightPanelTab === 'lead'
                        ? 'bg-white text-[#7C5CFC] shadow-xs'
                        : 'text-[#5F5F6B] hover:text-[#1A1A24]'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Lead Comercial</span>
                    {associatedLead && <span className="w-2 h-2 rounded-full bg-[#7C5CFC]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRightPanelTab('contato')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      rightPanelTab === 'contato'
                        ? 'bg-white text-[#7C5CFC] shadow-xs'
                        : 'text-[#5F5F6B] hover:text-[#1A1A24]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Dados Contato</span>
                  </button>
                </div>

                {/* ======================================================== */}
                {/* ABA 1: LEAD ASSOCIADO (CRM LEVE)                          */}
                {/* ======================================================== */}
                {rightPanelTab === 'lead' && (
                  <div className="space-y-4">
                    {/* Distinção Clara: Status da Conversa vs Etapa do Lead */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E5EC] text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#5F5F6B]">
                        <span>Status Atendimento (Chat):</span>
                        <StatusPill
                          status={activeConversation.status}
                          size="sm"
                          label={
                            activeConversation.status === 'aberta'
                              ? 'Aberta (Em andamento)'
                              : activeConversation.status === 'aguardando'
                                ? 'Pendente (Aguardando)'
                                : 'Resolvida'
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#5F5F6B] pt-1.5 border-t border-slate-200">
                        <span>Etapa Comercial (CRM):</span>
                        {associatedLead ? (
                          <StatusPill
                            status={associatedLead.stage}
                            size="sm"
                            label={
                              leadStages.find((s) => s.id === associatedLead.stage)?.label ||
                              associatedLead.stage
                            }
                          />
                        ) : (
                          <span className="text-[10px] text-[#9B9BAD]">Sem lead vinculado</span>
                        )}
                      </div>
                    </div>

                    {associatedLead ? (
                      <>
                        {/* Card do Lead Comercial */}
                        <div className="p-3.5 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC] space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C5CFC]">
                                Oportunidade CRM
                              </span>
                              <h4 className="font-bold text-sm text-[#1A1A24] mt-0.5">
                                {associatedLead.company}
                              </h4>
                            </div>

                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              R$ {associatedLead.estimatedValue.toLocaleString('pt-BR')}
                            </span>
                          </div>

                          {/* Seletor Demonstrativo de Etapa Comercial */}
                          <div>
                            <label className="text-[11px] font-semibold text-[#5F5F6B] mb-1 block">
                              Alterar Etapa do Lead (Demonstração):
                            </label>
                            <select
                              value={associatedLead.stage}
                              onChange={(e) =>
                                updateLeadStage(associatedLead.id, e.target.value as any)
                              }
                              className="w-full bg-white border border-[#E5E5EC] rounded-xl text-xs py-1.5 px-2.5 text-[#1A1A24] font-medium focus:ring-[#7C5CFC] focus:outline-none"
                            >
                              {leadStages.map((st) => (
                                <option key={st.id} value={st.id}>
                                  {st.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Responsável Comercial */}
                          <div className="space-y-1 pt-1 border-t border-[#E5E5EC]/60 text-xs">
                            <div className="flex items-center justify-between text-[#5F5F6B]">
                              <span>Vendedor responsável:</span>
                              <strong className="text-[#1A1A24]">
                                {associatedLead.assignedUserName || 'Não atribuído'}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between text-[#5F5F6B]">
                              <span>Equipe de vendas:</span>
                              <span className="text-[#7C5CFC] font-medium">
                                {associatedLead.assignedTeam || 'Fila sem responsável'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[#5F5F6B]">
                              <span>Origem do lead:</span>
                              <span className="font-medium text-[#1A1A24]">
                                {associatedLead.origin}
                              </span>
                            </div>
                          </div>

                          {/* Link Direto para a Área de Leads */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/leads?leadId=${associatedLead.id}`)}
                            className="w-full rounded-xl border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-violet-50 text-xs font-semibold gap-1.5 h-8 mt-1"
                          >
                            <span>Abrir Lead na Área Leads</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>

                        {/* Resumo Gerado pela IA (Fictício) */}
                        {associatedLead.aiSummary && (
                          <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 space-y-1.5">
                            <div className="flex items-center justify-between text-[#7C5CFC]">
                              <div className="flex items-center gap-1.5 font-semibold text-xs">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Resumo da IA (Fictício)</span>
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[9px] border-[#7C5CFC]/30 bg-white text-[#7C5CFC]"
                              >
                                Demonstração
                              </Badge>
                            </div>
                            <p className="text-[11px] text-violet-950 leading-relaxed">
                              {associatedLead.aiSummary}
                            </p>
                          </div>
                        )}

                        {/* Campos de Qualificação Comercial */}
                        {associatedLead.qualification && (
                          <div className="p-3 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD] space-y-2 text-xs">
                            <div className="flex items-center justify-between font-semibold text-[#1A1A24]">
                              <span>Qualificação Comercial</span>
                              {associatedLead.qualification.score && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                  Score: {associatedLead.qualification.score}/100
                                </span>
                              )}
                            </div>
                            <div className="space-y-1.5 text-[11px] text-[#5F5F6B]">
                              {associatedLead.qualification.segment && (
                                <div className="flex justify-between">
                                  <span className="text-[#9B9BAD]">Segmento:</span>
                                  <strong className="text-[#1A1A24]">
                                    {associatedLead.qualification.segment}
                                  </strong>
                                </div>
                              )}
                              {associatedLead.qualification.headcount && (
                                <div className="flex justify-between">
                                  <span className="text-[#9B9BAD]">Porte:</span>
                                  <strong className="text-[#1A1A24]">
                                    {associatedLead.qualification.headcount}
                                  </strong>
                                </div>
                              )}
                              {associatedLead.qualification.budget && (
                                <div className="flex justify-between">
                                  <span className="text-[#9B9BAD]">Orçamento:</span>
                                  <strong className="text-[#1A1A24]">
                                    {associatedLead.qualification.budget}
                                  </strong>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Próxima Atividade */}
                        {associatedLead.nextActivity && (
                          <div className="p-3 rounded-xl border border-[#E5E5EC] bg-white space-y-1.5 text-xs">
                            <div className="flex items-center justify-between font-semibold text-[#1A1A24]">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#7C5CFC]" />
                                Próxima Atividade
                              </span>
                              <span className="text-[10px] text-[#7C5CFC] font-medium">
                                {associatedLead.nextActivity.dueDate}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#5F5F6B] leading-snug">
                              {associatedLead.nextActivity.title}
                            </p>
                            <div className="text-[10px] text-[#9B9BAD] pt-1 border-t border-slate-100 flex items-center justify-between">
                              <span>Responsável:</span>
                              <span className="font-medium text-[#1A1A24]">
                                {associatedLead.nextActivity.assigneeName || 'Equipe'}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-5 text-center bg-[#FAF9FD] border border-dashed border-[#E5E5EC] rounded-2xl space-y-2">
                        <TrendingUp className="w-7 h-7 text-[#9B9BAD] mx-auto stroke-1" />
                        <p className="text-xs font-medium text-[#1A1A24]">
                          Nenhum lead vinculado a esta conversa
                        </p>
                        <p className="text-[11px] text-[#9B9BAD] leading-relaxed">
                          Você pode criar ou vincular oportunidades acessando a área de Leads no
                          menu lateral.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/leads')}
                          className="rounded-xl border-[#7C5CFC]/30 text-[#7C5CFC] text-xs h-8 mt-1"
                        >
                          Ir para Leads
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* ======================================================== */}
                {/* ABA 2: DADOS DO CONTATO (ORIGINAL)                        */}
                {/* ======================================================== */}
                {rightPanelTab === 'contato' && (
                  <div className="space-y-4">
                    {/* Card com dados do contato fictício */}
                    <div className="p-3.5 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC] space-y-2.5 text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#7C5CFC] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {activeConversation.contactName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-[#1A1A24] truncate">
                            {activeConversation.contactName}
                          </div>
                          <div className="text-[11px] text-[#5F5F6B] truncate">
                            {activeConversation.contactDetails?.company ||
                              'Empresa Cliente Fictícia'}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#E5E5EC]/60 space-y-2">
                        <div className="flex items-center gap-2 text-[#5F5F6B]">
                          <Phone className="w-3.5 h-3.5 text-[#9B9BAD] shrink-0" />
                          <span className="truncate">
                            {activeConversation.contactDetails?.phone ||
                              activeConversation.contactPhoneOrEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5F5F6B]">
                          <Mail className="w-3.5 h-3.5 text-[#9B9BAD] shrink-0" />
                          <span className="truncate">
                            {activeConversation.contactDetails?.email ||
                              activeConversation.contactPhoneOrEmail}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5F5F6B]">
                          <Radio className="w-3.5 h-3.5 text-[#7C5CFC] shrink-0" />
                          <span>
                            Canal: <strong>{activeConversation.channel}</strong>
                          </span>
                        </div>
                        {activeConversation.contactDetails?.location && (
                          <div className="flex items-center gap-2 text-[#5F5F6B]">
                            <MapPin className="w-3.5 h-3.5 text-[#9B9BAD] shrink-0" />
                            <span className="truncate">
                              {activeConversation.contactDetails.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Seção de Etiquetas (Tags) com Adicionar/Remover */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#7C5CFC]" />
                          <span>Etiquetas</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsAddTagOpen(true)}
                          className="text-[11px] text-[#7C5CFC] hover:underline font-semibold flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" />
                          Adicionar
                        </button>
                      </div>

                      {activeConversation.tags.length === 0 ? (
                        <p className="text-xs text-[#9B9BAD] italic bg-slate-50 p-2.5 rounded-lg border border-[#E5E5EC]">
                          Nenhuma etiqueta atribuída.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {activeConversation.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/20 group transition-all"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeConversationTag(activeConversation.id, tag)}
                                className="hover:text-rose-600 rounded p-0.2"
                                title={`Remover etiqueta "${tag}"`}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Atribuição Vigente */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-2">
                        Atribuição Atual
                      </h4>
                      <div className="space-y-2">
                        {/* Agente de IA */}
                        <div className="p-2.5 rounded-xl border border-[#E5E5EC] flex items-center justify-between bg-white text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#1A1A24] truncate">
                                {activeConversation.assignedAgentName}
                              </div>
                              <div className="text-[10px] text-[#9B9BAD]">Agente de IA</div>
                            </div>
                          </div>
                        </div>

                        {/* Atendente Humano */}
                        <div className="p-2.5 rounded-xl border border-[#E5E5EC] flex items-center justify-between bg-white text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-[#1A1A24] truncate">
                                {activeConversation.assignedHumanName || 'Nenhum atendente'}
                              </div>
                              <div className="text-[10px] text-[#9B9BAD]">
                                {activeConversation.assignedHumanName
                                  ? 'Operador Ativo'
                                  : 'Atuação 100% IA'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Histórico Resumido do Contato */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-[#5F5F6B]" />
                        <span>Histórico do Contato</span>
                      </h4>
                      <div className="p-3 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[#5F5F6B]">
                          <span>Total de atendimentos:</span>
                          <span className="font-semibold text-[#1A1A24]">
                            {activeConversation.contactDetails?.totalPreviousConversations || 1}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#5F5F6B]">
                          <span>Primeira interação:</span>
                          <span className="font-semibold text-[#1A1A24]">
                            {activeConversation.contactDetails?.firstInteractionDate || 'Hoje'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#5F5F6B]">
                          <span>Canal preferencial:</span>
                          <span className="font-semibold text-[#7C5CFC]">
                            {activeConversation.channel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Resumo da Demanda / Notas */}
                    <div>
                      <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-1.5">
                        Resumo da Demanda
                      </h4>
                      <p className="text-xs text-[#5F5F6B] leading-relaxed p-3 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC]">
                        {activeConversation.summaryNotes ||
                          'Sem anotações adicionais registradas para este atendimento.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })()}
      </div>

      {/* Dialog Modal: Adicionar Etiqueta */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent className="max-w-md bg-white border border-[#E5E5EC] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1A1A24] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#7C5CFC]" />
              Adicionar Etiqueta à Conversa
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5F5F6B]">
              Selecione uma etiqueta rápida ou digite uma etiqueta personalizada para classificar o
              atendimento de <strong>{activeConversation?.contactName}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#1A1A24] mb-1.5 block">
                Nome da etiqueta
              </label>
              <Input
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="Ex: Orçamento, Urgente, Retorno..."
                className="text-xs rounded-xl border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustomTag()
                  }
                }}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#9B9BAD] uppercase tracking-wider mb-2 block">
                Sugestões Rápidas
              </label>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAG_SUGGESTIONS.map((sug) => {
                  const isAlreadyAdded = activeConversation?.tags.includes(sug)
                  return (
                    <button
                      key={sug}
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => handleAddCustomTag(sug)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        isAlreadyAdded
                          ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                          : 'bg-[#F1EEFE] border-[#7C5CFC]/20 text-[#7C5CFC] hover:bg-[#7C5CFC] hover:text-white'
                      }`}
                    >
                      + {sug}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddTagOpen(false)}
              className="rounded-xl border-[#E5E5EC] text-xs"
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              disabled={!newTagInput.trim()}
              onClick={() => handleAddCustomTag()}
              className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold"
            >
              Salvar Etiqueta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
