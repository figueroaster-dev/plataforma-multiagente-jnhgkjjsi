import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Settings,
  Building,
  Users,
  Sliders,
  UserPlus,
  Mail,
  Shield,
  Save,
  Bell,
  CheckCircle2,
  Cpu,
  Sparkles,
  Zap,
  Lock,
  AlertTriangle,
  RotateCw,
  HelpCircle,
  KeyRound,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { APP_CONFIG } from '@/constants/app'
import { AI_PROVIDERS_CONFIG } from '@/data/mockData'
import { AIProviderId } from '@/types/domain'

type SettingsTab = 'workspace' | 'modelos_ia' | 'usuarios' | 'preferencias'

export default function Configuracoes() {
  const { currentWorkspace, users } = useApp()
  const { toast } = useToast()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const [activeTab, setActiveTab] = useState<SettingsTab>('workspace')

  // Form local state (Espaço de trabalho)
  const [workspaceName, setWorkspaceName] = useState<string>(currentWorkspace.name)
  const [contactEmail, setContactEmail] = useState<string>(APP_CONFIG.supportEmail)
  const [timeZone, setTimeZone] = useState<string>('America/Sao_Paulo (UTC-03:00)')

  // Preferências local state
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true)
  const [notifyTransfers, setNotifyTransfers] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(false)
  const [language, setLanguage] = useState('pt-BR')

  // Modelos de IA local state (conectado ao AppContext)
  const { companyAISettings, updateCompanyAISettings, testAIConnectionSimulation, agents } =
    useApp()

  const [selectedProvider, setSelectedProvider] = useState<AIProviderId>(companyAISettings.provider)
  const [selectedModel, setSelectedModel] = useState<string>(companyAISettings.model)
  const [byokEnabled, setByokEnabled] = useState<boolean>(companyAISettings.byokEnabled)
  const [temperature, setTemperature] = useState<number>(companyAISettings.temperatureDefault)
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    latencyMs: number
    message: string
  } | null>(null)

  const handleProviderChange = (providerId: AIProviderId) => {
    setSelectedProvider(providerId)
    const firstModel = AI_PROVIDERS_CONFIG[providerId].models[0]?.id || ''
    setSelectedModel(firstModel)
    setTestResult(null)
  }

  const handleSaveAISettings = () => {
    updateCompanyAISettings({
      provider: selectedProvider,
      model: selectedModel,
      byokEnabled,
      temperatureDefault: temperature,
      status: 'conexao_demonstrativa',
      lastTestedAt: 'Hoje',
    })
    toast({
      title: 'Configurações de IA salvas (demonstração)',
      description: `Provedor padrão definido para ${AI_PROVIDERS_CONFIG[selectedProvider].name} (${selectedModel}).`,
    })
  }

  const handleRunTestConnection = async () => {
    setIsTesting(true)
    setTestResult(null)
    try {
      const res = await testAIConnectionSimulation()
      setTestResult(res)
      toast({
        title: 'Teste de conexão simulado concluído',
        description: `Resposta de demonstração obtida em ${res.latencyMs}ms.`,
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleSaveWorkspace = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    toast({
      title: 'Configurações salvas (demonstração)',
      description: 'As alterações do espaço de trabalho foram atualizadas localmente.',
    })
  }

  const handleInviteUser = () => {
    toast({
      title: 'Em breve: convidar usuários',
      description: 'O envio de convites e gestão RBAC será habilitado em uma próxima versão.',
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: 'Preferências salvas',
      description: 'Suas opções de notificação e idioma foram gravadas localmente.',
    })
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-16">
      <Header
        title="Configurações"
        subtitle="Gerencie as preferências e parâmetros do seu espaço de trabalho"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Configurações' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
      />

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#E5E5EC] pb-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'workspace'
                ? 'bg-[#F1EEFE] text-[#7C5CFC]'
                : 'text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Espaço de trabalho</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('modelos_ia')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'modelos_ia'
                ? 'bg-[#F1EEFE] text-[#7C5CFC]'
                : 'text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Modelos de IA</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-violet-100 text-[#7C5CFC] font-bold">
              Demonstração
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'usuarios'
                ? 'bg-[#F1EEFE] text-[#7C5CFC]'
                : 'text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Usuários e Acesso</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preferencias')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === 'preferencias'
                ? 'bg-[#F1EEFE] text-[#7C5CFC]'
                : 'text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Preferências</span>
          </button>
        </div>

        {/* TAB 1: Espaço de Trabalho */}
        {activeTab === 'workspace' && (
          <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-[#E5E5EC] pb-4">
              <h3 className="text-base font-bold text-[#1A1A24]">
                Identificação do Espaço de Trabalho
              </h3>
              <p className="text-xs text-[#5F5F6B] mt-1">
                Informações da organização atreladas aos agentes e histórico de atendimento.
              </p>
            </div>

            <form onSubmit={handleSaveWorkspace} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                  Nome do Espaço / Empresa
                </label>
                <Input
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="rounded-xl border-[#E5E5EC] text-xs h-9 focus-visible:ring-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                  E-mail de Contato Principal
                </label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="rounded-xl border-[#E5E5EC] text-xs h-9 focus-visible:ring-[#7C5CFC]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                  Fuso Horário Operacional
                </label>
                <Input
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="rounded-xl border-[#E5E5EC] text-xs h-9 focus-visible:ring-[#7C5CFC]"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] text-xs text-[#5F5F6B]">
                <span className="font-semibold text-[#1A1A24]">Plano do Workspace:</span>{' '}
                <span className="px-2 py-0.5 rounded bg-violet-100 text-[#7C5CFC] font-semibold text-[11px] ml-1">
                  {currentWorkspace.plan}
                </span>
                <p className="mt-1 text-[11px] text-[#9B9BAD]">
                  Gerenciado centralmente pela Cérebro Digital.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4 gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar alterações</span>
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* TAB 2: Modelos de IA (NOVA SEÇÃO DE GOVERNANÇA E SELEÇÃO) */}
        {activeTab === 'modelos_ia' && (
          <div className="space-y-6">
            {/* Aviso crítico de segurança */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-950 text-xs flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-amber-950">
                  Aviso de Segurança — Não insira credenciais reais
                </p>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Este é um protótipo de alta fidelidade para validação conceitual e testes de
                  usabilidade.
                  <strong> Não insira ou salve chaves de API reais</strong>. Os campos aceitam
                  apenas visualização ou exemplos demonstrativos (mock sk-...). O protótipo não
                  efetua faturamento de plataforma nem calcula custos por token reais.
                </p>
              </div>
            </div>

            {/* Painel Principal de Configuração Padrão da Empresa */}
            <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm space-y-6">
              <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap border-b border-[#E5E5EC] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#1A1A24]">
                      Configuração Padrão de Modelos de IA da Empresa
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-[#7C5CFC]">
                      Nível Empresa
                    </span>
                  </div>
                  <p className="text-xs text-[#5F5F6B] mt-1">
                    Defina o motor padrão compartilhado. Todos os novos agentes criados herdam
                    automaticamente esta configuração.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#5F5F6B]">Status da conexão:</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Conexão demonstrativa
                  </span>
                </div>
              </div>

              {/* Herança para agentes */}
              <div className="p-4 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC] flex items-start gap-3">
                <Layers className="w-5 h-5 text-[#7C5CFC] shrink-0 mt-0.5" />
                <div className="text-xs text-[#5F5F6B] space-y-1">
                  <p className="font-semibold text-[#1A1A24]">
                    Herança da Empresa e Flexibilidade por Agente
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Atualmente, <strong>{agents.length} agentes</strong> cadastrados herdam este
                    modelo como base operacional. Em uma etapa futura, cada agente poderá
                    opcionalmente sobrescrever o modelo padrão com sua própria configuração
                    especializada (ex: modelo ultra-rápido para recepção e modelo de raciocínio
                    profundo para diagnósticos técnicos).
                  </p>
                </div>
              </div>

              {/* Seleção do Provedor Demonstrativo */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-2">
                  1. Selecione o Provedor de IA (Demonstrativo)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(Object.keys(AI_PROVIDERS_CONFIG) as AIProviderId[]).map((provKey) => {
                    const prov = AI_PROVIDERS_CONFIG[provKey]
                    const isSelected = selectedProvider === provKey
                    return (
                      <div
                        key={provKey}
                        onClick={() => handleProviderChange(provKey)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left ${
                          isSelected
                            ? 'border-[#7C5CFC] bg-[#FAF8FE] shadow-sm'
                            : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <h4 className="text-sm font-bold text-[#1A1A24]">{prov.name}</h4>
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-100 text-[#7C5CFC]">
                              {prov.badge}
                            </span>
                          </div>
                          <p className="text-xs text-[#5F5F6B] leading-relaxed">
                            {prov.description}
                          </p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#9B9BAD]">
                          <span>{prov.models.length} modelos de exemplo</span>
                          {isSelected && (
                            <span className="text-[#7C5CFC] font-semibold">Ativo</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Seleção de Modelo do Provedor Selecionado */}
              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-2">
                  2. Modelo padrão para os agentes
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {AI_PROVIDERS_CONFIG[selectedProvider].models.map((modelOpt) => {
                    const isSelected = selectedModel === modelOpt.id
                    return (
                      <div
                        key={modelOpt.id}
                        onClick={() => {
                          setSelectedModel(modelOpt.id)
                          setTestResult(null)
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#7C5CFC] bg-[#FAF8FE] ring-1 ring-[#7C5CFC]'
                            : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-mono text-xs font-bold text-[#1A1A24]">
                              {modelOpt.id}
                            </span>
                            {modelOpt.isRecommended && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                                Recomendado
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#5F5F6B] leading-snug">
                            {modelOpt.description}
                          </p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] text-[#9B9BAD] flex justify-between">
                          <span>Janela: {modelOpt.contextWindow}</span>
                          <span className="text-[#7C5CFC] font-medium italic">Demonstração</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* BYOK: Traga sua Própria Chave (Bring Your Own Key) */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[#E5E5EC] bg-slate-50 space-y-4">
                <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-[#7C5CFC]" />
                      <h4 className="text-xs font-bold text-[#1A1A24]">
                        Faturamento Direto: Traga sua Própria Chave (BYOK — "Bring Your Own Key")
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#5F5F6B] mt-1 max-w-xl">
                      Permite que a sua empresa utilize sua própria conta corporativa no provedor (
                      {AI_PROVIDERS_CONFIG[selectedProvider].name}), pagando o consumo de tokens
                      diretamente ao fornecedor de IA, sem sobretaxas ou intermediação da
                      plataforma.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#1A1A24]">
                      {byokEnabled ? 'Habilitado' : 'Desabilitado (Chave da Cérebro)'}
                    </span>
                    <Switch
                      checked={byokEnabled}
                      onCheckedChange={setByokEnabled}
                      className="data-[state=checked]:bg-[#7C5CFC]"
                    />
                  </div>
                </div>

                {byokEnabled && (
                  <div className="pt-3 border-t border-slate-200/70 space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                        Chave de API da sua Organização (Exemplo visual protegido)
                      </label>
                      <div className="relative max-w-md">
                        <Input
                          disabled
                          value="sk-proj-•••••••••••••••••••••••••demo-exemplo"
                          className="bg-white border-[#E5E5EC] text-xs h-9 font-mono pr-8 text-[#5F5F6B]"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                      </div>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block mt-1.5">
                        * Campo protegido contra inserção de chaves reais neste protótipo.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Ações: Testar Conexão Simulada e Salvar */}
              <div className="pt-2 border-t border-[#E5E5EC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRunTestConnection}
                    disabled={isTesting}
                    className="border-[#7C5CFC]/40 text-[#7C5CFC] hover:bg-[#F1EEFE] rounded-xl text-xs font-semibold h-9 px-4 gap-1.5"
                  >
                    {isTesting ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Simulando teste...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Testar conexão (Simulado)</span>
                      </>
                    )}
                  </Button>

                  <span className="text-[11px] text-[#9B9BAD]">
                    Verifica resposta sintética do modelo selecionado
                  </span>
                </div>

                <Button
                  onClick={handleSaveAISettings}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar padrão da empresa</span>
                </Button>
              </div>

              {/* Resultado do Teste Simulado */}
              {testResult && (
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Conexão simulada bem-sucedida!</span>
                    <Badge
                      variant="outline"
                      className="border-emerald-300 text-emerald-700 bg-white text-[10px]"
                    >
                      Latência: {testResult.latencyMs} ms
                    </Badge>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    {testResult.message}
                  </p>
                  <p className="text-[10px] text-slate-500 italic pt-0.5">
                    * Simulação interna de validação de interface; nenhuma chamada foi feita à
                    internet.
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* TAB 2: Usuários e Acesso */}
        {activeTab === 'usuarios' && (
          <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm space-y-6">
            <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap border-b border-[#E5E5EC] pb-4">
              <div>
                <h3 className="text-base font-bold text-[#1A1A24]">Equipe do Espaço de Trabalho</h3>
                <p className="text-xs text-[#5F5F6B] mt-1">
                  Membros com acesso à configuração de agentes e caixa de entrada.
                </p>
              </div>

              <Button
                onClick={handleInviteUser}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4 gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Convidar membro</span>
              </Button>
            </div>

            <div className="border border-[#E5E5EC] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9FD] text-[#5F5F6B] font-semibold border-b border-[#E5E5EC]">
                  <tr>
                    <th className="py-3 px-6">Usuário</th>
                    <th className="py-3 px-4">Função</th>
                    <th className="py-3 px-4">Adicionado em</th>
                    <th className="py-3 px-6 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E5EC]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8 rounded-lg">
                            <AvatarFallback className="bg-[#F1EEFE] text-[#7C5CFC] text-xs font-bold">
                              {u.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-xs text-[#1A1A24]">{u.name}</div>
                            <div className="text-[11px] text-[#9B9BAD]">{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            u.role === 'Admin'
                              ? 'bg-violet-100 text-[#7C5CFC]'
                              : u.role === 'Editor'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#5F5F6B]">{u.addedAt}</td>

                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ativo
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* TAB 3: Preferências */}
        {activeTab === 'preferencias' && (
          <Card className="p-6 sm:p-8 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-[#E5E5EC] pb-4">
              <h3 className="text-base font-bold text-[#1A1A24]">
                Preferências de Notificação e Idioma
              </h3>
              <p className="text-xs text-[#5F5F6B] mt-1">
                Ajuste os alertas do sistema e a localização padrão da interface.
              </p>
            </div>

            <div className="space-y-5 max-w-2xl">
              {/* Notificação E-mail */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD]">
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A24]">
                    Receber notificações por e-mail
                  </h4>
                  <p className="text-[11px] text-[#5F5F6B]">
                    Alertas sobre transbordos urgentes e incidentes operacionais.
                  </p>
                </div>
                <Switch
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                  className="data-[state=checked]:bg-[#7C5CFC]"
                />
              </div>

              {/* Resumo Semanal */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD]">
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A24]">
                    Resumo semanal de desempenho
                  </h4>
                  <p className="text-[11px] text-[#5F5F6B]">
                    Relatório consolidado de volume de conversas enviado toda segunda-feira.
                  </p>
                </div>
                <Switch
                  checked={notifyWeeklyReport}
                  onCheckedChange={setNotifyWeeklyReport}
                  className="data-[state=checked]:bg-[#7C5CFC]"
                />
              </div>

              {/* Transbordos */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD]">
                <div>
                  <h4 className="text-xs font-semibold text-[#1A1A24]">
                    Alerta de transbordo humano
                  </h4>
                  <p className="text-[11px] text-[#5F5F6B]">
                    Notificação visual no sino ao entrar uma conversa aguardando atendente.
                  </p>
                </div>
                <Switch
                  checked={notifyTransfers}
                  onCheckedChange={setNotifyTransfers}
                  className="data-[state=checked]:bg-[#7C5CFC]"
                />
              </div>

              {/* Idioma */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                  Idioma da Interface
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-white border border-[#E5E5EC] text-[#1A1A24] rounded-xl text-xs px-3.5 py-2 w-full max-w-xs focus:ring-[#7C5CFC] focus:outline-none"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en" disabled>
                    English (Em breve)
                  </option>
                  <option value="es" disabled>
                    Español (Em breve)
                  </option>
                </select>
              </div>

              <div className="pt-3">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4"
                >
                  Salvar preferências
                </Button>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
