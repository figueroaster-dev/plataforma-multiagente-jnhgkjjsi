import React, { useState, useMemo } from 'react'
import { useOutletContext, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Users,
  LayoutGrid,
  List,
  Search,
  Plus,
  Phone,
  Mail,
  Building2,
  Calendar,
  DollarSign,
  Bot,
  UserCheck,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowRight,
  Clock,
  MessageSquare,
  AlertCircle,
  MoreVertical,
  CheckCircle2,
  Radio,
  ExternalLink,
  Tag,
  Briefcase,
  HelpCircle,
  GripVertical,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useApp } from '@/context/AppContext'
import { Lead, LeadStageId, LeadOrigin } from '@/types/domain'

export default function Leads() {
  const {
    leads,
    leadStages,
    updateLeadStage,
    assignLeadOwner,
    createLead,
    setSelectedConversationId,
    agents,
    users,
  } = useApp()

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  // Visualização: 'kanban' ou 'lista'
  const [viewMode, setViewMode] = useState<'kanban' | 'lista'>('kanban')

  // Filtros
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<string>('todos')
  const [filterOrigin, setFilterOrigin] = useState<string>('todos')
  const [filterOwner, setFilterOwner] = useState<string>('todos')

  // Modal de Detalhes do Lead
  const [detailLead, setDetailLead] = useState<Lead | null>(null)

  // Modal Novo Lead (Demonstrativo)
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false)
  const [newLeadForm, setNewLeadForm] = useState({
    contactName: '',
    company: '',
    phone: '',
    email: '',
    origin: 'WhatsApp' as LeadOrigin,
    estimatedValue: 15000,
    assignedAgentId: 'ag-1',
    assignedUserId: 'u-1',
    assignedTeam: 'Vendas Enterprise',
    stage: 'novo' as LeadStageId,
    lastConversationText: 'Contato inicial registrado pelo time.',
  })

  // Permite abrir um lead via URL query param (?leadId=lead-1)
  React.useEffect(() => {
    const targetLeadId = searchParams.get('leadId')
    if (targetLeadId) {
      const found = leads.find((l) => l.id === targetLeadId)
      if (found) {
        setDetailLead(found)
      }
    }
  }, [searchParams, leads])

  // Mantém detailLead sincronizado caso o lead mude de etapa/responsável
  const currentDetailLead = useMemo(() => {
    if (!detailLead) return null
    return leads.find((l) => l.id === detailLead.id) || detailLead
  }, [detailLead, leads])

  // Lista de origens únicas para o filtro
  const availableOrigins = useMemo(() => {
    const set = new Set<string>()
    leads.forEach((l) => {
      if (l.origin) set.add(l.origin)
    })
    return Array.from(set)
  }, [leads])

  // Filtragem
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        lead.contactName.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        (lead.email && lead.email.toLowerCase().includes(q)) ||
        (lead.assignedUserName && lead.assignedUserName.toLowerCase().includes(q)) ||
        (lead.assignedAgentName && lead.assignedAgentName.toLowerCase().includes(q))

      const matchStage = filterStage === 'todos' || lead.stage === filterStage
      const matchOrigin = filterOrigin === 'todos' || lead.origin === filterOrigin

      let matchOwner = true
      if (filterOwner !== 'todos') {
        if (filterOwner === 'sem_responsavel') {
          matchOwner = !lead.assignedUserId && !lead.assignedUserName
        } else {
          matchOwner = lead.assignedUserId === filterOwner
        }
      }

      return matchSearch && matchStage && matchOrigin && matchOwner
    })
  }, [leads, search, filterStage, filterOrigin, filterOwner])

  // Estatísticas rápidas do topo
  const metrics = useMemo(() => {
    const totalCount = leads.length
    const totalPipelineValue = leads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0)
    const wonLeads = leads.filter((l) => l.stage === 'ganho')
    const wonValue = wonLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0)
    const qualifiedCount = leads.filter((l) => l.stage !== 'novo' && l.stage !== 'perdido').length

    return {
      totalCount,
      totalPipelineValue,
      wonCount: wonLeads.length,
      wonValue,
      qualifiedCount,
    }
  }, [leads])

  // Manipuladores de Drag and Drop demonstrativo para o Kanban
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetStage: LeadStageId) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData('text/plain')
    if (leadId) {
      updateLeadStage(leadId, targetStage)
    }
  }

  const handleGoToConversation = (conversationId?: string) => {
    if (!conversationId) return
    setSelectedConversationId(conversationId)
    navigate('/conversas')
  }

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLeadForm.contactName.trim() || !newLeadForm.company.trim()) return

    const agentObj = agents.find((a) => a.id === newLeadForm.assignedAgentId)
    const userObj = users.find((u) => u.id === newLeadForm.assignedUserId)

    createLead({
      contactName: newLeadForm.contactName.trim(),
      company: newLeadForm.company.trim(),
      phone: newLeadForm.phone.trim() || '+55 (11) 99000-0000',
      email: newLeadForm.email.trim() || undefined,
      origin: newLeadForm.origin,
      estimatedValue: Number(newLeadForm.estimatedValue) || 10000,
      assignedAgentId: agentObj?.id,
      assignedAgentName: agentObj?.name,
      assignedUserId: userObj?.id,
      assignedUserName: userObj?.name,
      assignedTeam: newLeadForm.assignedTeam,
      stage: newLeadForm.stage,
      lastConversationText: newLeadForm.lastConversationText,
      lastConversationDate: 'Agora mesmo',
      aiSummary: 'Lead criado manualmente para acompanhamento comercial.',
      qualification: {
        score: 75,
        budget: `R$ ${newLeadForm.estimatedValue.toLocaleString('pt-BR')}`,
      },
      nextActivity: {
        id: `act-${Date.now()}`,
        type: 'whatsapp',
        title: 'Primeiro contato de apresentação',
        dueDate: 'Hoje às 16:00',
        status: 'pendente',
        assigneeName: userObj?.name || 'Equipe de Vendas',
      },
    })

    setIsNewLeadOpen(false)
    setNewLeadForm({
      contactName: '',
      company: '',
      phone: '',
      email: '',
      origin: 'WhatsApp',
      estimatedValue: 15000,
      assignedAgentId: 'ag-1',
      assignedUserId: 'u-1',
      assignedTeam: 'Vendas Enterprise',
      stage: 'novo',
      lastConversationText: 'Contato inicial registrado pelo time.',
    })
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-16">
      <Header
        title="Leads e Oportunidades"
        subtitle="Pipeline comercial leve com IA e atendimento sincronizado"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Leads' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#7C5CFC]/10 text-[#7C5CFC] border border-[#7C5CFC]/20">
              <Sparkles className="w-3.5 h-3.5" />
              CRM Nativo (Demonstração)
            </span>
            <Button
              onClick={() => setIsNewLeadOpen(true)}
              className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-3.5 gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </Button>
          </div>
        }
      />

      {/* Faixa global de demonstração */}
      <div className="bg-[#FAF9FD] border-b border-[#E5E5EC] px-4 py-2 flex items-center justify-between text-xs text-[#5F5F6B] shrink-0">
        <div className="flex items-center gap-2 truncate">
          <AlertCircle className="w-4 h-4 text-[#7C5CFC] shrink-0" />
          <span className="truncate">
            <strong>CRM Leve Demonstrativo:</strong> Leads, etapas, valores e responsáveis operam em
            estado local. Arraste cards ou troque etapas instantaneamente.
          </span>
        </div>
        <Badge
          variant="outline"
          className="border-[#7C5CFC]/30 text-[#7C5CFC] bg-white text-[10px] shrink-0 font-medium"
        >
          Demonstração
        </Badge>
      </div>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Cards de Métricas do Funil */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-3.5 sm:p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#9B9BAD] mb-1">
              <span className="text-xs font-semibold">Total de Leads</span>
              <Users className="w-4 h-4 text-[#7C5CFC]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1A1A24]">{metrics.totalCount}</div>
            <div className="text-[11px] text-[#5F5F6B] mt-0.5">
              {metrics.qualifiedCount} ativos no pipeline
            </div>
          </Card>

          <Card className="p-3.5 sm:p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#9B9BAD] mb-1">
              <span className="text-xs font-semibold">Pipeline Estimado</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-700">
              R$ {metrics.totalPipelineValue.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-[#5F5F6B] mt-0.5">Valor aberto em negociação</div>
          </Card>

          <Card className="p-3.5 sm:p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#9B9BAD] mb-1">
              <span className="text-xs font-semibold">Fechados / Ganhos</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1A1A24]">{metrics.wonCount}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
              R$ {metrics.wonValue.toLocaleString('pt-BR')} convertidos
            </div>
          </Card>

          <Card className="p-3.5 sm:p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-xs">
            <div className="flex items-center justify-between text-[#9B9BAD] mb-1">
              <span className="text-xs font-semibold">Etapas Configuradas</span>
              <Briefcase className="w-4 h-4 text-[#7C5CFC]" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#1A1A24]">{leadStages.length}</div>
            <div className="text-[11px] text-[#5F5F6B] mt-0.5">Pipeline comercial padrão</div>
          </Card>
        </div>

        {/* Barra de Ações: Busca, Filtros e Alternância Lista / Kanban */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E5E5EC] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Busca e Filtros */}
          <div className="flex flex-1 flex-wrap items-center gap-2.5">
            {/* Input de Busca */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BAD]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar contato, empresa ou vendedor..."
                className="pl-9 text-xs rounded-xl border-[#E5E5EC] bg-[#FAF9FD] h-9 focus-visible:ring-[#7C5CFC]"
              />
            </div>

            {/* Filtro por Etapa */}
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="bg-[#FAF9FD] border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3 py-2 h-9 focus:ring-[#7C5CFC] focus:outline-none"
            >
              <option value="todos">Todas as etapas</option>
              {leadStages.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.label}
                </option>
              ))}
            </select>

            {/* Filtro por Origem */}
            <select
              value={filterOrigin}
              onChange={(e) => setFilterOrigin(e.target.value)}
              className="bg-[#FAF9FD] border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3 py-2 h-9 focus:ring-[#7C5CFC] focus:outline-none"
            >
              <option value="todos">Todas as origens</option>
              {availableOrigins.map((orig) => (
                <option key={orig} value={orig}>
                  {orig}
                </option>
              ))}
            </select>

            {/* Filtro por Responsável */}
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="bg-[#FAF9FD] border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3 py-2 h-9 focus:ring-[#7C5CFC] focus:outline-none"
            >
              <option value="todos">Todos os responsáveis</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
              <option value="sem_responsavel">Sem responsável (Fila)</option>
            </select>

            {(search ||
              filterStage !== 'todos' ||
              filterOrigin !== 'todos' ||
              filterOwner !== 'todos') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setFilterStage('todos')
                  setFilterOrigin('todos')
                  setFilterOwner('todos')
                }}
                className="text-xs text-[#7C5CFC] h-9 px-2.5 rounded-xl hover:bg-violet-50"
              >
                Limpar filtros
              </Button>
            )}
          </div>

          {/* Alternância Lista / Kanban */}
          <div className="flex items-center gap-1.5 self-end md:self-center bg-[#FAF9FD] p-1 rounded-xl border border-[#E5E5EC]">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#7C5CFC] shadow-xs'
                  : 'text-[#5F5F6B] hover:text-[#1A1A24]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lista')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'lista'
                  ? 'bg-white text-[#7C5CFC] shadow-xs'
                  : 'text-[#5F5F6B] hover:text-[#1A1A24]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
          </div>
        </div>

        {/* CONTEÚDO PRINCIPAL: MODO KANBAN */}
        {viewMode === 'kanban' && (
          <div className="overflow-x-auto pb-4 scrollbar-thin">
            <div className="flex gap-4 min-w-[1200px] items-start">
              {leadStages.map((stage) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === stage.id)
                const stageTotalValue = stageLeads.reduce(
                  (acc, l) => acc + (l.estimatedValue || 0),
                  0,
                )

                return (
                  <div
                    key={stage.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                    className="w-80 flex-shrink-0 bg-[#FAF9FD] rounded-2xl border border-[#E5E5EC] p-3 flex flex-col max-h-[calc(100vh-280px)]"
                  >
                    {/* Header da Coluna */}
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E5E5EC]">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                        <h3 className="font-bold text-xs text-[#1A1A24]">{stage.label}</h3>
                        <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-white border border-[#E5E5EC] text-[#5F5F6B]">
                          {stageLeads.length}
                        </span>
                      </div>
                      <span className="text-[11px] font-medium text-[#5F5F6B]">
                        R$ {stageTotalValue.toLocaleString('pt-BR')}
                      </span>
                    </div>

                    {/* Cards de Leads da Etapa */}
                    <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
                      {stageLeads.length === 0 ? (
                        <div className="p-6 text-center border-2 border-dashed border-[#E5E5EC] rounded-xl text-xs text-[#9B9BAD]">
                          Nenhum lead nesta etapa
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, lead.id)}
                            onClick={() => setDetailLead(lead)}
                            className="p-3 bg-white border border-[#E5E5EC] rounded-xl shadow-xs hover:shadow-md hover:border-[#7C5CFC]/40 transition-all cursor-pointer group space-y-2"
                          >
                            {/* Linha 1: Contato e Empresa */}
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-[#1A1A24] truncate group-hover:text-[#7C5CFC] transition-colors">
                                  {lead.contactName}
                                </h4>
                                <div className="text-[11px] text-[#5F5F6B] truncate flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-[#9B9BAD] shrink-0" />
                                  <span>{lead.company}</span>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-700 whitespace-nowrap">
                                R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                              </span>
                            </div>

                            {/* Linha 2: Origem + Agente de IA */}
                            <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-[#5F5F6B] border border-slate-200">
                                <Radio className="w-2.5 h-2.5 text-[#7C5CFC]" />
                                {lead.origin}
                              </span>

                              {lead.assignedAgentName && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F1EEFE] text-[#7C5CFC] font-medium border border-[#7C5CFC]/20">
                                  <Bot className="w-2.5 h-2.5" />
                                  {lead.assignedAgentName.split(' ')[0]}
                                </span>
                              )}
                            </div>

                            {/* Linha 3: Próxima Atividade */}
                            {lead.nextActivity && (
                              <div className="p-2 rounded-lg bg-[#FAF9FD] border border-[#E5E5EC] text-[10px] space-y-1">
                                <div className="flex items-center justify-between text-[#5F5F6B]">
                                  <span className="font-semibold text-[#1A1A24] flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-[#7C5CFC]" />
                                    Próxima atividade:
                                  </span>
                                  <span className="text-[#7C5CFC] font-medium">
                                    {lead.nextActivity.dueDate}
                                  </span>
                                </div>
                                <p className="text-[#5F5F6B] truncate">{lead.nextActivity.title}</p>
                              </div>
                            )}

                            {/* Rodapé do Card: Responsável Humano / Equipe + Ações Rápidas */}
                            <div className="flex items-center justify-between pt-1.5 border-t border-[#E5E5EC]/60 text-[10px] text-[#5F5F6B]">
                              <div className="flex items-center gap-1 truncate">
                                <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">
                                  {lead.assignedUserName || lead.assignedTeam || 'Sem responsável'}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {lead.linkedConversationId && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleGoToConversation(lead.linkedConversationId)
                                    }}
                                    className="p-1 rounded hover:bg-slate-100 text-[#7C5CFC]"
                                    title="Abrir conversa associada"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <ChevronRight className="w-3.5 h-3.5 text-[#9B9BAD]" />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL: MODO LISTA */}
        {viewMode === 'lista' && (
          <Card className="bg-white border border-[#E5E5EC] rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9FD] text-[#5F5F6B] font-semibold border-b border-[#E5E5EC]">
                  <tr>
                    <th className="py-3 px-4">Contato / Empresa</th>
                    <th className="py-3 px-3">Origem</th>
                    <th className="py-3 px-3">Agente de IA</th>
                    <th className="py-3 px-3">Responsável</th>
                    <th className="py-3 px-3">Etapa</th>
                    <th className="py-3 px-3 text-right">Valor Estimado</th>
                    <th className="py-3 px-3">Próxima Atividade</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EC]">
                  {filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[#9B9BAD]">
                        Nenhum lead encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => setDetailLead(lead)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        {/* Contato & Empresa */}
                        <td className="py-3 px-4">
                          <div className="font-semibold text-xs text-[#1A1A24] group-hover:text-[#7C5CFC] transition-colors">
                            {lead.contactName}
                          </div>
                          <div className="text-[11px] text-[#5F5F6B] flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-[#9B9BAD]" />
                            <span>{lead.company}</span>
                            <span>•</span>
                            <span className="text-[#9B9BAD]">{lead.phone}</span>
                          </div>
                        </td>

                        {/* Origem */}
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-[#5F5F6B] border border-slate-200">
                            {lead.origin}
                          </span>
                        </td>

                        {/* Agente IA */}
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#7C5CFC] font-medium">
                            <Bot className="w-3.5 h-3.5" />
                            {lead.assignedAgentName || 'Nenhum'}
                          </span>
                        </td>

                        {/* Responsável Humano / Equipe */}
                        <td className="py-3 px-3">
                          <div className="font-medium text-xs text-[#1A1A24]">
                            {lead.assignedUserName || 'Sem responsável'}
                          </div>
                          <div className="text-[10px] text-[#9B9BAD]">{lead.assignedTeam}</div>
                        </td>

                        {/* Etapa com Seletor Demonstrativo Rápido */}
                        <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={lead.stage}
                            onChange={(e) =>
                              updateLeadStage(lead.id, e.target.value as LeadStageId)
                            }
                            className="bg-white border border-[#E5E5EC] rounded-lg text-[11px] font-semibold py-1 px-2 text-[#1A1A24] focus:ring-[#7C5CFC] focus:outline-none cursor-pointer"
                          >
                            {leadStages.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Valor Estimado */}
                        <td className="py-3 px-3 text-right font-bold text-emerald-700 text-xs">
                          R$ {lead.estimatedValue.toLocaleString('pt-BR')}
                        </td>

                        {/* Próxima Atividade */}
                        <td className="py-3 px-3 max-w-[200px]">
                          {lead.nextActivity ? (
                            <div className="truncate">
                              <span className="font-medium text-[#1A1A24] text-[11px]">
                                {lead.nextActivity.dueDate}:
                              </span>{' '}
                              <span className="text-[11px] text-[#5F5F6B] truncate">
                                {lead.nextActivity.title}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[#9B9BAD] text-[11px]">Nenhuma</span>
                          )}
                        </td>

                        {/* Ações */}
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1">
                            {lead.linkedConversationId && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleGoToConversation(lead.linkedConversationId)}
                                className="h-7 w-7 p-0 rounded-lg text-[#7C5CFC] hover:bg-violet-50"
                                title="Ir para conversa"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </Button>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 rounded-lg text-[#9B9BAD] hover:text-[#1A1A24]"
                                >
                                  <MoreVertical className="w-3.5 h-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white border border-[#E5E5EC] rounded-xl shadow-lg p-1"
                              >
                                <DropdownMenuItem
                                  onClick={() => setDetailLead(lead)}
                                  className="text-xs cursor-pointer"
                                >
                                  Ver detalhes completos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-[#E5E5EC]" />
                                <DropdownMenuLabel className="text-[10px] text-[#9B9BAD] uppercase">
                                  Atribuir Vendedor
                                </DropdownMenuLabel>
                                {users.map((u) => (
                                  <DropdownMenuItem
                                    key={u.id}
                                    onClick={() =>
                                      assignLeadOwner(lead.id, {
                                        userId: u.id,
                                        userName: u.name,
                                      })
                                    }
                                    className="text-xs cursor-pointer flex items-center justify-between"
                                  >
                                    <span>{u.name}</span>
                                    {lead.assignedUserId === u.id && (
                                      <CheckCircle2 className="w-3 h-3 text-[#7C5CFC]" />
                                    )}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>

      {/* DIALOG: DETALHES COMPLETOS DO LEAD */}
      {currentDetailLead && (
        <Dialog open={!!currentDetailLead} onOpenChange={(open) => !open && setDetailLead(null)}>
          <DialogContent className="max-w-2xl bg-white border border-[#E5E5EC] rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between gap-2 flex-wrap pr-6">
                <div>
                  <DialogTitle className="text-lg font-bold text-[#1A1A24] flex items-center gap-2">
                    <span>{currentDetailLead.contactName}</span>
                    <Badge
                      variant="outline"
                      className="border-[#7C5CFC]/30 text-[#7C5CFC] bg-violet-50 text-[10px]"
                    >
                      Demonstração
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[#5F5F6B] mt-0.5">
                    {currentDetailLead.company} • Cadastrado em {currentDetailLead.createdAt}
                  </DialogDescription>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5F5F6B]">Etapa:</span>
                  <select
                    value={currentDetailLead.stage}
                    onChange={(e) =>
                      updateLeadStage(currentDetailLead.id, e.target.value as LeadStageId)
                    }
                    className="bg-[#FAF9FD] border border-[#E5E5EC] rounded-lg text-xs font-semibold py-1.5 px-3 text-[#1A1A24] focus:ring-[#7C5CFC] focus:outline-none"
                  >
                    {leadStages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-5 py-3 text-xs">
              {/* Bloco de Contato e Informações Principais */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#5F5F6B]">
                    <Phone className="w-3.5 h-3.5 text-[#9B9BAD]" />
                    <span className="font-medium text-[#1A1A24]">{currentDetailLead.phone}</span>
                  </div>
                  {currentDetailLead.email && (
                    <div className="flex items-center gap-2 text-[#5F5F6B]">
                      <Mail className="w-3.5 h-3.5 text-[#9B9BAD]" />
                      <span className="text-[#1A1A24]">{currentDetailLead.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[#5F5F6B]">
                    <Radio className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    <span>
                      Origem: <strong>{currentDetailLead.origin}</strong>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[#5F5F6B]">
                    <span>Valor estimado da proposta:</span>
                    <strong className="text-sm text-emerald-700">
                      R$ {currentDetailLead.estimatedValue.toLocaleString('pt-BR')}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[#5F5F6B]">
                    <span>Agente de IA condutor:</span>
                    <strong className="text-[#7C5CFC]">
                      {currentDetailLead.assignedAgentName || 'Não vinculado'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[#5F5F6B]">
                    <span>Responsável comercial:</span>
                    <strong className="text-[#1A1A24]">
                      {currentDetailLead.assignedUserName ||
                        currentDetailLead.assignedTeam ||
                        'Sem responsável'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Atribuição de Vendedor Demonstrativa */}
              <div className="p-4 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-xs text-[#1A1A24] flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    <span>Atribuir Vendedor / Equipe (Demonstrativo)</span>
                  </h4>
                  <span className="text-[10px] text-[#9B9BAD]">Atualização instantânea</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-[#5F5F6B] mb-1 block">
                      Vendedor responsável:
                    </label>
                    <select
                      value={currentDetailLead.assignedUserId || ''}
                      onChange={(e) => {
                        const targetUser = users.find((u) => u.id === e.target.value)
                        assignLeadOwner(currentDetailLead.id, {
                          userId: targetUser?.id,
                          userName: targetUser?.name,
                        })
                      }}
                      className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 text-[#1A1A24] focus:ring-[#7C5CFC]"
                    >
                      <option value="">Nenhum vendedor (Fila)</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#5F5F6B] mb-1 block">Equipe ou Fila:</label>
                    <select
                      value={currentDetailLead.assignedTeam || ''}
                      onChange={(e) => {
                        assignLeadOwner(currentDetailLead.id, {
                          userId: currentDetailLead.assignedUserId,
                          userName: currentDetailLead.assignedUserName,
                          team: e.target.value,
                        })
                      }}
                      className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 text-[#1A1A24] focus:ring-[#7C5CFC]"
                    >
                      <option value="Vendas Enterprise">Vendas Enterprise</option>
                      <option value="SDR Inbound">SDR Inbound</option>
                      <option value="Closer Mid-Market">Closer Mid-Market</option>
                      <option value="Fila sem responsável">Fila sem responsável</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Resumo da IA */}
              {currentDetailLead.aiSummary && (
                <div className="p-3.5 rounded-xl bg-violet-50/70 border border-violet-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-[#7C5CFC] font-semibold text-xs">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Resumo Gerado pela IA (Fictício)</span>
                  </div>
                  <p className="text-[#4338CA] leading-relaxed text-[11px]">
                    {currentDetailLead.aiSummary}
                  </p>
                </div>
              )}

              {/* Qualificação do Lead */}
              {currentDetailLead.qualification && (
                <div className="p-4 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD] space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-xs text-[#1A1A24]">
                      Campos de Qualificação Comercial
                    </h4>
                    {currentDetailLead.qualification.score && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        Score: {currentDetailLead.qualification.score}/100
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-[#5F5F6B]">
                    <div>
                      <span className="block text-[#9B9BAD]">Segmento:</span>
                      <strong className="text-[#1A1A24]">
                        {currentDetailLead.qualification.segment || 'Geral'}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#9B9BAD]">Porte:</span>
                      <strong className="text-[#1A1A24]">
                        {currentDetailLead.qualification.headcount || 'Não informado'}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#9B9BAD]">Prazo de decisão:</span>
                      <strong className="text-[#1A1A24]">
                        {currentDetailLead.qualification.decisionTimeline || 'Imediato'}
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Última conversa registrada */}
              <div className="p-3.5 rounded-xl border border-[#E5E5EC] bg-white space-y-1.5">
                <div className="flex items-center justify-between text-[#5F5F6B]">
                  <span className="font-semibold text-xs text-[#1A1A24] flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    Última conversa registrada
                  </span>
                  <span className="text-[10px] text-[#9B9BAD]">
                    {currentDetailLead.lastConversationDate}
                  </span>
                </div>
                <p className="text-xs text-[#5F5F6B] italic bg-[#FAF9FD] p-2.5 rounded-lg border border-[#E5E5EC]">
                  "{currentDetailLead.lastConversationText}"
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-[#E5E5EC] pt-3">
              {currentDetailLead.linkedConversationId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    handleGoToConversation(currentDetailLead.linkedConversationId)
                    setDetailLead(null)
                  }}
                  className="rounded-xl border-[#7C5CFC]/30 text-[#7C5CFC] hover:bg-violet-50 text-xs font-semibold gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ver conversa completa na Caixa de Entrada</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              ) : (
                <div className="text-[11px] text-[#9B9BAD]">
                  Sem histórico de chat vinculado a este lead.
                </div>
              )}

              <Button
                type="button"
                onClick={() => setDetailLead(null)}
                className="bg-[#1A1A24] hover:bg-black text-white rounded-xl text-xs font-semibold px-4"
              >
                Fechar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* DIALOG: NOVO LEAD (DEMONSTRATIVO) */}
      <Dialog open={isNewLeadOpen} onOpenChange={setIsNewLeadOpen}>
        <DialogContent className="max-w-lg bg-white border border-[#E5E5EC] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-[#1A1A24] flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#7C5CFC]" />
              Cadastrar Novo Lead (Demonstração)
            </DialogTitle>
            <DialogDescription className="text-xs text-[#5F5F6B]">
              Adicione um lead fictício ao pipeline local para testar a qualificação e o fluxo de
              etapas.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLeadSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">Nome do Contato *</label>
                <Input
                  required
                  value={newLeadForm.contactName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, contactName: e.target.value })}
                  placeholder="Ex: Ana Paula Ribeiro"
                  className="rounded-xl text-xs h-9 border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">Empresa / Razão *</label>
                <Input
                  required
                  value={newLeadForm.company}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, company: e.target.value })}
                  placeholder="Ex: Alfa Soluções Digitais"
                  className="rounded-xl text-xs h-9 border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">
                  Telefone / WhatsApp
                </label>
                <Input
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  placeholder="+55 (11) 98888-7777"
                  className="rounded-xl text-xs h-9 border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">
                  Valor Estimado (R$)
                </label>
                <Input
                  type="number"
                  value={newLeadForm.estimatedValue}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, estimatedValue: Number(e.target.value) })
                  }
                  placeholder="15000"
                  className="rounded-xl text-xs h-9 border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">Origem do Lead</label>
                <select
                  value={newLeadForm.origin}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, origin: e.target.value as LeadOrigin })
                  }
                  className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 h-9 text-[#1A1A24] focus:ring-[#7C5CFC]"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Chat do site">Chat do site</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Indicação">Indicação</option>
                  <option value="Campanha Meta Ads">Campanha Meta Ads</option>
                  <option value="Google Ads">Google Ads</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">Etapa Inicial</label>
                <select
                  value={newLeadForm.stage}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, stage: e.target.value as LeadStageId })
                  }
                  className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 h-9 text-[#1A1A24] focus:ring-[#7C5CFC]"
                >
                  {leadStages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">Agente de IA</label>
                <select
                  value={newLeadForm.assignedAgentId}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, assignedAgentId: e.target.value })
                  }
                  className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 h-9 text-[#1A1A24] focus:ring-[#7C5CFC]"
                >
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.purpose})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#1A1A24] mb-1 block">
                  Vendedor Responsável
                </label>
                <select
                  value={newLeadForm.assignedUserId}
                  onChange={(e) =>
                    setNewLeadForm({ ...newLeadForm, assignedUserId: e.target.value })
                  }
                  className="w-full bg-[#FAF9FD] border border-[#E5E5EC] rounded-xl text-xs px-3 py-2 h-9 text-[#1A1A24] focus:ring-[#7C5CFC]"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#1A1A24] mb-1 block">
                Última mensagem ou Demanda inicial
              </label>
              <Input
                value={newLeadForm.lastConversationText}
                onChange={(e) =>
                  setNewLeadForm({ ...newLeadForm, lastConversationText: e.target.value })
                }
                placeholder="Ex: Gostaria de saber preços para 10 operadores."
                className="rounded-xl text-xs h-9 border-[#E5E5EC] focus-visible:ring-[#7C5CFC]"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewLeadOpen(false)}
                className="rounded-xl text-xs border-[#E5E5EC]"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold"
              >
                Cadastrar Lead
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
