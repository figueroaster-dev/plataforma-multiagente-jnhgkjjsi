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
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { APP_CONFIG } from '@/constants/app'

type SettingsTab = 'workspace' | 'usuarios' | 'preferencias'

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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
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
            onClick={() => setActiveTab('usuarios')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
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
