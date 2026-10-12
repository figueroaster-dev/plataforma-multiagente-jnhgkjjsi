import { useState, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Bot,
  Plus,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Radio,
  Clock,
  Sparkles,
  MessageSquare,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { EmptyState } from '@/components/common/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { AgentPurpose, AgentStatus } from '@/types/domain'

export default function Agentes() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { agents } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const [search, setSearch] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('todos')
  const [selectedPurpose, setSelectedPurpose] = useState<string>('todos')

  const handleCreateAgent = () => {
    navigate('/agentes/novo')
  }

  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      const matchSearch =
        agent.name.toLowerCase().includes(search.toLowerCase()) ||
        agent.description.toLowerCase().includes(search.toLowerCase())

      const matchStatus =
        selectedStatus === 'todos' || agent.status === (selectedStatus as AgentStatus)

      const matchPurpose =
        selectedPurpose === 'todos' || agent.purpose === (selectedPurpose as AgentPurpose)

      return matchSearch && matchStatus && matchPurpose
    })
  }, [agents, search, selectedStatus, selectedPurpose])

  const clearFilters = () => {
    setSearch('')
    setSelectedStatus('todos')
    setSelectedPurpose('todos')
  }

  const hasActiveFilters =
    search.trim() !== '' || selectedStatus !== 'todos' || selectedPurpose !== 'todos'

  return (
    <div className="flex-1 flex flex-col min-h-full pb-12">
      <Header
        title="Agentes"
        subtitle="Gerencie os agentes de IA do seu espaço de trabalho"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Agentes' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <Button
            onClick={handleCreateAgent}
            className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl shadow-sm text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" />
            <span>Criar agente</span>
          </Button>
        }
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E5E5EC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9BAD]" />
            <Input
              type="text"
              placeholder="Buscar agente por nome ou objetivo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-[#F7F7FB] border-[#E5E5EC] rounded-xl text-xs h-9 focus-visible:ring-[#7C5CFC]"
            />
          </div>

          {/* Filter selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Status Segmented / Selector */}
            <div className="flex items-center gap-1 bg-[#F7F7FB] p-1 rounded-xl border border-[#E5E5EC] text-xs">
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'ativo', label: 'Ativos' },
                { id: 'rascunho', label: 'Rascunho' },
                { id: 'pausado', label: 'Pausados' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedStatus === st.id
                      ? 'bg-white text-[#7C5CFC] shadow-sm font-semibold'
                      : 'text-[#5F5F6B] hover:text-[#1A1A24]'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Purpose Select */}
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="bg-[#F7F7FB] border border-[#E5E5EC] text-[#5F5F6B] rounded-xl text-xs px-3 py-1.5 h-9 focus:ring-[#7C5CFC] focus:outline-none"
            >
              <option value="todos">Todas finalidades</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Suporte">Suporte</option>
              <option value="SDR">SDR</option>
              <option value="BDR">BDR</option>
              <option value="Vendas">Vendas</option>
              <option value="Personalizado">Personalizado</option>
              <option value="Outros">Outros</option>
            </select>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-[#5F5F6B] hover:text-[#EF4444] h-9 px-2"
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        {/* Agents Listing */}
        {filteredAgents.length === 0 ? (
          <EmptyState
            icon={Bot}
            title="Nenhum agente encontrado"
            description="Não encontramos nenhum agente que corresponda aos filtros selecionados. Tente ajustar a busca ou o status."
            actionLabel="Limpar filtros"
            onAction={clearFilters}
            className="my-8"
          />
        ) : (
          <div className="space-y-3">
            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#E5E5EC] shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9FD] text-[#5F5F6B] font-semibold border-b border-[#E5E5EC]">
                  <tr>
                    <th className="py-3.5 px-6">Nome do Agente</th>
                    <th className="py-3.5 px-4">Finalidade</th>
                    <th className="py-3.5 px-4">Canal</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Conversas</th>
                    <th className="py-3.5 px-4">Última Atividade</th>
                    <th className="py-3.5 px-6 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EC]">
                  {filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      onClick={() => navigate(`/agentes/${agent.id}/configuracao`)}
                      className="hover:bg-[#FAF9FD] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0 group-hover:bg-[#7C5CFC] group-hover:text-white transition-colors">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#1A1A24] group-hover:text-[#7C5CFC] transition-colors">
                              {agent.name}
                            </div>
                            <div className="text-[#5F5F6B] text-[11px] line-clamp-1 max-w-sm">
                              {agent.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {agent.purpose}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-[#1A1A24] font-medium">
                          <Radio className="w-3.5 h-3.5 text-[#7C5CFC]" />
                          <span>{agent.channel}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <StatusPill status={agent.status} size="sm" />
                      </td>

                      <td className="py-4 px-4 text-[#5F5F6B]">
                        <span className="font-semibold text-[#1A1A24]">
                          {agent.conversationsCount || 0}
                        </span>{' '}
                        atendimentos
                      </td>

                      <td className="py-4 px-4 text-[#9B9BAD]">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{agent.lastActivity}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[#7C5CFC] group-hover:text-[#6A48E8] group-hover:bg-[#F1EEFE] rounded-lg text-xs gap-1"
                        >
                          <span>Configurar</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet Card List */}
            <div className="lg:hidden space-y-3">
              {filteredAgents.map((agent) => (
                <Card
                  key={agent.id}
                  onClick={() => navigate(`/agentes/${agent.id}/configuracao`)}
                  className="p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#1A1A24]">{agent.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {agent.purpose}
                          </span>
                          <span className="text-[10px] text-[#9B9BAD]">via {agent.channel}</span>
                        </div>
                      </div>
                    </div>
                    <StatusPill status={agent.status} size="sm" />
                  </div>

                  <p className="text-xs text-[#5F5F6B] mt-2 line-clamp-2">{agent.description}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#9B9BAD]">
                    <span className="text-[#5F5F6B]">
                      <strong>{agent.conversationsCount || 0}</strong> atendimentos
                    </span>
                    <span className="text-[#7C5CFC] font-medium flex items-center gap-1">
                      Editar configuração <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
