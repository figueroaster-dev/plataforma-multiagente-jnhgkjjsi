import { useState, useMemo, useRef, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
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
  MoreVertical,
  ChevronRight,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { ConversationStatus } from '@/types/domain'

export default function Conversas() {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    addMessageToConversation,
    assignConversationAgent,
    resolveConversation,
    returnToAgent,
    agents,
  } = useApp()

  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('todos')
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Current active conversation
  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.id === selectedConversationId) || conversations[0] || null
  }, [conversations, selectedConversationId])

  // Filtered list
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchSearch =
        c.contactName.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(search.toLowerCase()) ||
        c.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))

      const matchStatus =
        filterStatus === 'todos' || c.status === (filterStatus as ConversationStatus)

      return matchSearch && matchStatus
    })
  }, [conversations, search, filterStatus])

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages])

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!inputText.trim() || !activeConversation) return

    addMessageToConversation(activeConversation.id, inputText)
    setInputText('')
  }

  const handleFocusReply = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Conversas"
        subtitle="Caixa de entrada para supervisão e atendimento humano"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Conversas' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
      />

      {/* 3-Column Inbox Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-white">
        {/* COLUMN 1: Conversation List (Left Panel, 340px) */}
        <div className="w-full lg:w-[360px] border-r border-[#E5E5EC] flex flex-col h-full shrink-0 bg-[#FAF9FD]">
          {/* Top Search & Filter Bar */}
          <div className="p-3.5 border-b border-[#E5E5EC] space-y-2.5 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BAD]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar conversa ou cliente..."
                className="pl-9 text-xs rounded-xl border-[#E5E5EC] bg-[#F7F7FB] h-8 focus-visible:ring-[#7C5CFC]"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'todos', label: 'Todas' },
                { id: 'aguardando', label: 'Aguardando' },
                { id: 'aberta', label: 'Em andamento' },
                { id: 'resolvida', label: 'Resolvidas' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterStatus(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    filterStatus === f.id
                      ? 'bg-[#7C5CFC] text-white shadow-sm'
                      : 'bg-white text-[#5F5F6B] hover:bg-slate-100 border border-[#E5E5EC]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#E5E5EC]/60">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#9B9BAD]">
                Nenhuma conversa encontrada neste filtro.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConversation?.id === conv.id
                return (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversationId(conv.id)}
                    className={`p-3.5 transition-all cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-white border-l-4 border-l-[#7C5CFC] shadow-sm'
                        : 'hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-[#1A1A24] truncate">
                        {conv.contactName}
                      </span>
                      <span className="text-[10px] text-[#9B9BAD] shrink-0">{conv.updatedAt}</span>
                    </div>

                    <p className="text-xs text-[#5F5F6B] line-clamp-1 leading-snug">
                      {conv.lastMessage}
                    </p>

                    <div className="flex items-center justify-between gap-1 mt-1 pt-1">
                      <div className="flex items-center gap-1 text-[10px] text-[#5F5F6B]">
                        <Radio className="w-3 h-3 text-[#7C5CFC]" />
                        <span>{conv.channel}</span>
                      </div>
                      <StatusPill status={conv.status} size="sm" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Selected Conversation Thread (Center Panel) */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col h-full bg-[#F7F7FB] border-r border-[#E5E5EC] overflow-hidden">
            {/* Thread Header */}
            <div className="p-3.5 bg-white border-b border-[#E5E5EC] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center font-bold text-xs shrink-0">
                  {activeConversation.contactName.substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-[#1A1A24] truncate">
                      {activeConversation.contactName}
                    </h3>
                    <StatusPill status={activeConversation.status} size="sm" />
                  </div>
                  <div className="text-[11px] text-[#5F5F6B] flex items-center gap-1.5 truncate">
                    <span>{activeConversation.channel}</span>
                    <span>•</span>
                    <span>
                      Agente: <strong>{activeConversation.assignedAgentName}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Header */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFocusReply}
                  className="rounded-xl border-[#E5E5EC] text-xs h-8 px-2.5 hidden sm:flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  <span>Responder</span>
                </Button>

                {/* Dropdown Atribuir */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-[#E5E5EC] text-xs h-8 px-2.5 flex items-center gap-1"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#5F5F6B]" />
                      <span className="hidden sm:inline">Atribuir</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-white border border-[#E5E5EC] rounded-xl shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-[#9B9BAD]">
                      Atribuir a outro agente
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {agents.map((ag) => (
                      <DropdownMenuItem
                        key={ag.id}
                        onClick={() => assignConversationAgent(activeConversation.id, ag.id)}
                        className="text-xs cursor-pointer"
                      >
                        {ag.name} ({ag.purpose})
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Devolver ao Agente (se em atendimento humano) */}
                {activeConversation.status === 'aguardando' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => returnToAgent(activeConversation.id)}
                    className="rounded-xl border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-[#F1EEFE] text-xs h-8 px-2.5 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Devolver ao agente</span>
                  </Button>
                )}

                {/* Resolver */}
                {activeConversation.status !== 'resolvida' ? (
                  <Button
                    size="sm"
                    onClick={() => resolveConversation(activeConversation.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs h-8 px-3 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Resolver</span>
                  </Button>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    Encerrada
                  </span>
                )}
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              <div className="text-center my-2">
                <span className="text-[10px] text-[#9B9BAD] bg-white border border-[#E5E5EC] px-2.5 py-0.5 rounded-full">
                  Atendimento iniciado via {activeConversation.channel}
                </span>
              </div>

              {activeConversation.messages.map((m) => {
                const isUser = m.sender === 'user'
                const isHumanOperator = m.sender === 'human'

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] text-[#9B9BAD]">
                      {isUser ? (
                        <>
                          <User className="w-3 h-3" />
                          <span className="font-medium text-[#1A1A24]">{m.senderName}</span>
                        </>
                      ) : isHumanOperator ? (
                        <>
                          <span className="font-semibold text-emerald-700">Operador Humano</span>
                          <UserCheck className="w-3 h-3 text-emerald-600" />
                        </>
                      ) : (
                        <>
                          <span className="font-medium text-[#7C5CFC]">{m.senderName}</span>
                          <Bot className="w-3 h-3 text-[#7C5CFC]" />
                        </>
                      )}
                      <span>• {m.timestamp}</span>
                    </div>

                    <div
                      className={`max-w-[80%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-white text-[#1A1A24] border border-[#E5E5EC] rounded-tl-none'
                          : isHumanOperator
                            ? 'bg-emerald-700 text-white rounded-tr-none'
                            : 'bg-[#7C5CFC] text-white rounded-tr-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Response Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white border-t border-[#E5E5EC] flex items-center gap-2"
            >
              <Input
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escreva uma resposta humana ou nota interna..."
                className="text-xs rounded-xl border-[#E5E5EC] focus-visible:ring-[#7C5CFC] h-9"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl h-9 px-4 shrink-0 font-semibold text-xs gap-1.5"
              >
                <span>Enviar</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 bg-[#F7F7FB]">
            <EmptyState
              icon={MessageSquare}
              title="Selecione uma conversa"
              description="Escolha uma conversa na lista ao lado para inspecionar as mensagens e intervir como operador."
            />
          </div>
        )}

        {/* COLUMN 3: Contact & Agent Side Panel (Right Panel, 280px) */}
        {activeConversation && (
          <div className="w-full lg:w-[280px] border-l border-[#E5E5EC] bg-white p-4 flex flex-col space-y-4 shrink-0 overflow-y-auto">
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-2">
                Dados do Contato
              </h4>
              <div className="p-3 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC] space-y-2 text-xs">
                <div className="font-semibold text-sm text-[#1A1A24]">
                  {activeConversation.contactName}
                </div>
                <div className="flex items-center gap-2 text-[#5F5F6B]">
                  <Phone className="w-3.5 h-3.5 text-[#9B9BAD]" />
                  <span>{activeConversation.contactPhoneOrEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5F5F6B]">
                  <Radio className="w-3.5 h-3.5 text-[#9B9BAD]" />
                  <span>{activeConversation.channel}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#7C5CFC]" /> Tags do Cliente
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeConversation.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsible Agent */}
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-2">
                Agente Responsável
              </h4>
              <div className="p-3 rounded-xl border border-[#E5E5EC] flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0 font-bold text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#1A1A24] truncate">
                    {activeConversation.assignedAgentName}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">Operação autônoma</div>
                </div>
              </div>
            </div>

            {/* Resumo / Notas */}
            <div>
              <h4 className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider mb-1.5">
                Resumo da Demanda
              </h4>
              <p className="text-xs text-[#5F5F6B] leading-relaxed p-3 rounded-xl bg-slate-50 border border-[#E5E5EC]">
                {activeConversation.summaryNotes ||
                  'Sem anotações adicionais para este atendimento.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
