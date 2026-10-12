import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  BarChart3,
  MessageSquare,
  Bot,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { Header } from '@/components/layout/Header'
import { StatCard } from '@/components/common/StatCard'
import { Card } from '@/components/ui/card'
import { useApp } from '@/context/AppContext'

export default function Relatorios() {
  const { agents } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()
  const [period, setPeriod] = useState<'7dias' | '30dias'>('30dias')

  // Fictional realistic metric values
  const metrics = useMemo(() => {
    const activeAgentsCount = agents.filter((a) => a.status === 'ativo').length
    if (period === '7dias') {
      return {
        volume: 348,
        activeAgents: activeAgentsCount,
        transfers: 24,
        volumeTrend: '+8% vs semana anterior',
      }
    }
    return {
      volume: 1240,
      activeAgents: activeAgentsCount,
      transfers: 87,
      volumeTrend: '+16% vs últimos 30 dias',
    }
  }, [period, agents])

  // Chart 1: Daily conversations
  const dailyData = useMemo(() => {
    if (period === '7dias') {
      return [
        { dia: 'Seg', conversas: 42, transbordo: 3 },
        { dia: 'Ter', conversas: 58, transbordo: 4 },
        { dia: 'Qua', conversas: 64, transbordo: 5 },
        { dia: 'Qui', conversas: 51, transbordo: 2 },
        { dia: 'Sex', conversas: 69, transbordo: 6 },
        { dia: 'Sáb', conversas: 38, transbordo: 2 },
        { dia: 'Dom', conversas: 26, transbordo: 2 },
      ]
    }
    return [
      { dia: '01', conversas: 34, transbordo: 2 },
      { dia: '05', conversas: 48, transbordo: 4 },
      { dia: '10', conversas: 52, transbordo: 3 },
      { dia: '15', conversas: 63, transbordo: 6 },
      { dia: '20', conversas: 74, transbordo: 5 },
      { dia: '25', conversas: 68, transbordo: 4 },
      { dia: '30', conversas: 82, transbordo: 7 },
    ]
  }, [period])

  // Chart 2: By Channel
  const channelData = useMemo(() => {
    if (period === '7dias') {
      return [
        { canal: 'WhatsApp', total: 240 },
        { canal: 'Chat do Site', total: 108 },
      ]
    }
    return [
      { canal: 'WhatsApp', total: 890 },
      { canal: 'Chat do Site', total: 350 },
    ]
  }, [period])

  // Chart 3: By Status Donut
  const statusDistribution = useMemo(() => {
    if (period === '7dias') {
      return [
        { name: 'Resolvida pelo agente', value: 290, color: '#10B981' },
        { name: 'Transferência humana', value: 24, color: '#F59E0B' },
        { name: 'Em andamento', value: 34, color: '#7C5CFC' },
      ]
    }
    return [
      { name: 'Resolvida pelo agente', value: 1020, color: '#10B981' },
      { name: 'Transferência humana', value: 87, color: '#F59E0B' },
      { name: 'Em andamento', value: 133, color: '#7C5CFC' },
    ]
  }, [period])

  return (
    <div className="flex-1 flex flex-col min-h-full pb-16">
      <Header
        title="Relatórios"
        subtitle="Métricas operacionais de desempenho dos agentes"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Relatórios' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Visible Demo-Data Badge / Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Dados de demonstração:</strong> Os gráficos e indicadores abaixo são puramente
              ilustrativos e não refletem operações reais em produção.
            </span>
          </div>

          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-amber-200 text-amber-900 shrink-0">
            DEMO MODE
          </span>
        </div>

        {/* Period Selector Controls */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-[#1A1A24]">Desempenho Geral</h2>
            <p className="text-xs text-[#5F5F6B]">
              Taxas de retenção, resolução autônoma e transbordo
            </p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E5E5EC] shadow-sm">
            <button
              type="button"
              onClick={() => setPeriod('7dias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === '7dias'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#5F5F6B] hover:text-[#1A1A24]'
              }`}
            >
              Últimos 7 dias
            </button>
            <button
              type="button"
              onClick={() => setPeriod('30dias')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                period === '30dias'
                  ? 'bg-[#7C5CFC] text-white shadow-sm'
                  : 'text-[#5F5F6B] hover:text-[#1A1A24]'
              }`}
            >
              Últimos 30 dias
            </button>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Volume de Conversas"
            value={metrics.volume}
            trend={metrics.volumeTrend}
            trendPositive
            icon={MessageSquare}
            variant="primary"
            description="Interações registradas"
          />
          <StatCard
            label="Agentes Ativos"
            value={metrics.activeAgents}
            icon={Bot}
            description="Respondendo clientes"
          />
          <StatCard
            label="Transbordo Humano"
            value={metrics.transfers}
            icon={UserCheck}
            variant="warning"
            badge="Handoff"
            description="Atendimentos escalados"
          />
        </div>

        {/* Charts Row 1: Line/Area Chart */}
        <Card className="p-6 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-[#1A1A24]">Evolução Diária de Conversas</h3>
              <p className="text-xs text-[#5F5F6B]">
                Curva de atendimentos automáticos vs transbordo
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#5F5F6B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC]" />
                Conversas totais
              </span>
              <span className="flex items-center gap-1.5 text-[#5F5F6B]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                Transbordo
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EC" />
                <XAxis dataKey="dia" stroke="#9B9BAD" fontSize={11} tickLine={false} />
                <YAxis stroke="#9B9BAD" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17171F',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="conversas"
                  name="Conversas"
                  stroke="#7C5CFC"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorConv)"
                />
                <Area
                  type="monotone"
                  dataKey="transbordo"
                  name="Transbordo humano"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTrans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Charts Row 2: Bar + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: By Channel */}
          <Card className="p-6 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#1A1A24]">
                Conversas por Canal de Atendimento
              </h3>
              <p className="text-xs text-[#5F5F6B]">
                Distribuição entre WhatsApp e Chat institucional
              </p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EC" />
                  <XAxis dataKey="canal" stroke="#9B9BAD" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9B9BAD" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17171F',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="total" name="Atendimentos" fill="#7C5CFC" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Donut Chart: Resolution Status */}
          <Card className="p-6 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="mb-2">
              <h3 className="text-sm font-bold text-[#1A1A24]">
                Distribuição de Conversas por Status
              </h3>
              <p className="text-xs text-[#5F5F6B]">
                Eficiência da resolução autônoma vs intervenção humana
              </p>
            </div>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#17171F',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              {statusDistribution.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <span
                    className="w-2.5 h-2.5 rounded-full mb-1"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[11px] font-semibold text-[#1A1A24]">{item.value}</span>
                  <span className="text-[10px] text-[#9B9BAD] truncate max-w-full">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
