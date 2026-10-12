import { useState, useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  Bot,
  MessageSquare,
  UserCheck,
  BookOpen,
  ArrowRight,
  Plus,
  Radio,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/common/StatCard'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { APP_CONFIG, DEFAULT_USER } from '@/constants/app'

type Period = 'hoje' | '7dias' | '30dias' | 'mes'

export default function Index() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { agents, knowledgeBases, conversations, setSelectedConversationId } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const [period, setPeriod] = useState<Period>('hoje')

  // Greeting based on time
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }, [])

  // Realistic mock stats adjusted per selected period
  const stats = useMemo(() => {
    const activeAgentsCount = agents.filter((a) => a.status === 'ativo').length
    const kbCount = knowledgeBases.length
    const waitingHumanCount = conversations.filter((c) => c.status === 'aguardando').length

    switch (period) {
      case '7dias':
        return {
          activeAgents: activeAgentsCount,
          conversations: 1840,
          conversationsTrend: '+18% vs semana anterior',
          waitingHuman: waitingHumanCount,
          knowledgeBases: kbCount,
        }
      case '30dias':
        return {
          activeAgents: activeAgentsCount,
          conversations: 6420,
          conversationsTrend: '+24% vs mês anterior',
          waitingHuman: waitingHumanCount,
          knowledgeBases: kbCount,
        }
      case 'mes':
        return {
          activeAgents: activeAgentsCount,
          conversations: 5190,
          conversationsTrend: '+12% no acumulado',
          waitingHuman: waitingHumanCount,
          knowledgeBases: kbCount,
        }
      case 'hoje':
      default:
        return {
          activeAgents: activeAgentsCount,
          conversations: 347,
          conversationsTrend: '+14% vs ontem',
          waitingHuman: waitingHumanCount,
          knowledgeBases: kbCount,
        }
    }
  }, [period, agents, knowledgeBases, conversations])

  // Attention queue (conversas aguardando humano)
  const waitingConversations = useMemo(() => {
    return conversations.filter((c) => c.status === 'aguardando')
  }, [conversations])

  const handleOpenConversation = (convId: string) => {
    setSelectedConversationId(convId)
    navigate('/conversas')
  }

  const handleCreateAgent = () => {
    navigate('/agentes/novo')
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-12">
      <Header
        title="Visão Geral"
        subtitle="Resumo operacional dos seus agentes"
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <Button
            onClick={handleCreateAgent}
            className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl shadow-sm text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Criar agente</span>
          </Button>
        }
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Welcome & Period Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5E5EC] shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A24] tracking-tight">
                {greeting}, {DEFAULT_USER.name.split(' ')[0]} 👋
              </h2>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-50 text-[#7C5CFC] border border-[#7C5CFC]/20">
                Workspace Ativo
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#5F5F6B] mt-1">
              Aqui está o resumo do seu espaço de trabalho no {APP_CONFIG.productName}.
            </p>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-1 bg-[#F7F7FB] p-1 rounded-xl border border-[#E5E5EC] self-start md:self-auto">
            {(
              [
                { id: 'hoje', label: 'Hoje' },
                { id: '7dias', label: '7 dias' },
                { id: '30dias', label: '30 dias' },
                { id: 'mes', label: 'Este mês' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPeriod(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  period === item.id
                    ? 'bg-white text-[#7C5CFC] shadow-sm font-semibold'
                    : 'text-[#5F5F6B] hover:text-[#1A1A24]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Notice Banner */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#F1EEFE] border border-[#7C5CFC]/30 text-xs text-[#5232CD]">
          <Info className="w-4 h-4 shrink-0 text-[#7C5CFC]" />
          <span>
            <strong>Ambiente Demonstrativo:</strong> Métricas e dados calculados com base no estado
            local. Resultados não são garantidos.
          </span>
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Agentes Ativos"
            value={stats.activeAgents}
            icon={Bot}
            variant="primary"
            description="Em produção agora"
          />
          <StatCard
            label="Conversas Realizadas"
            value={stats.conversations}
            trend={stats.conversationsTrend}
            trendPositive
            icon={MessageSquare}
            description="Volume total"
          />
          <StatCard
            label="Aguardando Humano"
            value={stats.waitingHuman}
            icon={UserCheck}
            variant={stats.waitingHuman > 0 ? 'warning' : 'default'}
            badge={stats.waitingHuman > 0 ? 'Ação necessária' : undefined}
            description="Fila de transbordo"
          />
          <StatCard
            label="Fontes de Conhecimento"
            value={stats.knowledgeBases}
            icon={BookOpen}
            description="Bases sincronizadas"
          />
        </div>

        {/* Dual Section Grid: Recent Agents + Attention Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Section: Agentes Recentes (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1A1A24]">Agentes no Espaço</h3>
                <p className="text-xs text-[#5F5F6B]">Status operacional e canais vinculados</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/agentes')}
                className="text-xs text-[#7C5CFC] hover:text-[#6A48E8] hover:bg-[#F1EEFE] gap-1 h-8 px-2"
              >
                <span>Ver todos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  onClick={() => navigate(`/agentes/${agent.id}/configuracao`)}
                  className="p-4 bg-white border border-[#E5E5EC] rounded-2xl hover:border-[#7C5CFC]/40 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0 group-hover:bg-[#7C5CFC] group-hover:text-white transition-colors">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-[#1A1A24] group-hover:text-[#7C5CFC] transition-colors truncate">
                            {agent.name}
                          </h4>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {agent.purpose}
                          </span>
                        </div>
                        <p className="text-xs text-[#5F5F6B] line-clamp-1 mt-0.5">
                          {agent.description}
                        </p>
                      </div>
                    </div>

                    <StatusPill status={agent.status} size="sm" />
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#9B9BAD]">
                    <div className="flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-[#5F5F6B]" />
                      <span className="text-[#5F5F6B] font-medium">{agent.channel}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{agent.lastActivity}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section: Conversas que precisam de atenção humana (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#1A1A24]">Atenção Humana</h3>
                <p className="text-xs text-[#5F5F6B]">Clientes que solicitaram transbordo</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {waitingConversations.length} pendentes
              </span>
            </div>

            <div className="space-y-2.5">
              {waitingConversations.length === 0 ? (
                <Card className="p-8 text-center bg-white border border-[#E5E5EC] rounded-2xl">
                  <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#1A1A24]">Fila zerada!</p>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Nenhuma conversa aguardando operador humano neste momento.
                  </p>
                </Card>
              ) : (
                waitingConversations.map((conv) => (
                  <Card
                    key={conv.id}
                    className="p-4 bg-white border border-amber-200/70 bg-gradient-to-r from-amber-50/20 to-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A24] truncate">
                            {conv.contactName}
                          </h4>
                          <span className="text-[10px] text-[#9B9BAD]">• {conv.updatedAt}</span>
                        </div>
                        <p className="text-xs text-[#5F5F6B] mt-1 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                          &ldquo;{conv.lastMessage}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between pt-2">
                      <span className="text-[11px] text-[#5F5F6B]">
                        Via <strong className="text-[#1A1A24]">{conv.channel}</strong> (
                        {conv.assignedAgentName})
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleOpenConversation(conv.id)}
                        className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-lg text-xs h-7 px-2.5"
                      >
                        Ver conversa
                      </Button>
                    </div>
                  </Card>
                ))
              )}

              <Card className="p-4 bg-slate-50/70 border border-[#E5E5EC] rounded-2xl text-xs text-[#5F5F6B] flex items-center justify-between">
                <span>Quer conferir o histórico completo?</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/conversas')}
                  className="rounded-lg text-xs h-7 px-2.5 bg-white border-[#E5E5EC] text-[#1A1A24]"
                >
                  Abrir Caixa de Entrada
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
