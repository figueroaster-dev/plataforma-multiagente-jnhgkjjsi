import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Radio,
  Globe,
  Instagram,
  MessageCircle,
  MessageSquareQuote,
  AlertCircle,
  Sparkles,
  Plus,
  RefreshCw,
  Trash2,
  ShieldCheck,
  Building2,
  Server,
  QrCode,
  Lock,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CHANNELS_LIST } from '@/data/mockData'
import { useApp } from '@/context/AppContext'
import { useToast } from '@/hooks/use-toast'
import { ConnectWhatsAppModal } from '@/components/channels/ConnectWhatsAppModal'
import { WhatsAppConnectionConfig } from '@/types/domain'

export default function Canais() {
  const { toast } = useToast()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()
  const {
    whatsAppConnections,
    addWhatsAppConnection,
    updateWhatsAppConnectionStatus,
    removeWhatsAppConnection,
  } = useApp()

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const handleConfigureOtherChannel = (channelName: string) => {
    toast({
      title: 'Configuração futura',
      description: `A integração do canal "${channelName}" será habilitada em uma próxima etapa de desenvolvimento.`,
    })
  }

  const handleToggleState = (conn: WhatsAppConnectionConfig) => {
    const nextState =
      conn.status === 'conectado_demonstracao' ? 'atencao_conexao' : 'conectado_demonstracao'
    updateWhatsAppConnectionStatus(conn.id, nextState)
    toast({
      title: 'Status simulado alterado',
      description: `Instância alternada para "${nextState === 'conectado_demonstracao' ? 'Conectado — demonstração' : 'Atenção à conexão'}".`,
    })
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageSquareQuote className="w-6 h-6 text-emerald-600" />
      case 'webchat':
        return <Globe className="w-6 h-6 text-[#7C5CFC]" />
      case 'instagram':
        return <Instagram className="w-6 h-6 text-pink-600" />
      case 'messenger':
      default:
        return <MessageCircle className="w-6 h-6 text-blue-600" />
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-12">
      <Header
        title="Canais"
        subtitle="Conecte os canais onde seus agentes vão atender"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Canais' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Notice Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5EC] shadow-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#7C5CFC] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5F5F6B] space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-[#1A1A24]">
                Arquitetura de Conexões WhatsApp em Demonstração
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-[#7C5CFC]">
                Sem credenciais reais
              </span>
            </div>
            <p>
              Explore os modelos de conexão disponíveis (Meta WhatsApp Cloud API oficial,
              parceiros/BSPs, Evolution API e UAZAPI). Simule instâncias e estados de conexão com
              segurança total.
            </p>
          </div>
        </div>

        {/* SEÇÃO PRINCIPAL: Gerenciamento WhatsApp */}
        <div className="space-y-4">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-[#1A1A24]">Instâncias de WhatsApp</h2>
                <Badge
                  variant="outline"
                  className="border-emerald-300 text-emerald-700 bg-emerald-50 text-[11px]"
                >
                  {whatsAppConnections.length} configuradas
                </Badge>
              </div>
              <p className="text-xs text-[#5F5F6B] mt-0.5">
                Conexões ativas para recepção de mensagens, disparos e diálogo com agentes
                inteligentes.
              </p>
            </div>

            <Button
              onClick={() => setIsConnectModalOpen(true)}
              className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-sm gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Conectar WhatsApp (Demonstração)</span>
            </Button>
          </div>

          {/* Cards de Instâncias WhatsApp Configuradas */}
          {whatsAppConnections.length === 0 ? (
            <Card className="p-8 text-center bg-white border border-dashed border-[#E5E5EC] rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#F7F7FB] flex items-center justify-center mx-auto text-[#9B9BAD] mb-3">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1A1A24]">Nenhuma instância cadastrada</h3>
              <p className="text-xs text-[#5F5F6B] max-w-sm mx-auto mt-1 mb-4">
                Inicie o fluxo guiado para simular uma conexão oficial via Meta Cloud API, Evolution
                API ou UAZAPI.
              </p>
              <Button
                onClick={() => setIsConnectModalOpen(true)}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4"
              >
                Conectar primeira instância
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whatsAppConnections.map((conn) => (
                <Card
                  key={conn.id}
                  className="p-5 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
                          <MessageSquareQuote className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-[#1A1A24] leading-tight">
                            {conn.displayName}
                          </h3>
                          <span className="text-[11px] text-[#5F5F6B]">
                            {conn.phoneNumber || 'Número em homologação'}
                          </span>
                        </div>
                      </div>

                      <StatusPill status={conn.status} size="sm" />
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF9FD] border border-[#E5E5EC] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5F5F6B]">Provedor / Arquitetura:</span>
                        <span className="font-semibold text-[#1A1A24]">
                          {conn.providerType === 'meta_cloud_api'
                            ? 'Meta WhatsApp Cloud API (Oficial)'
                            : conn.providerType === 'bsp_partner'
                              ? 'Parceiro / BSP'
                              : conn.providerType === 'evolution_api'
                                ? conn.subType === 'evolution_baileys'
                                  ? 'Evolution API (Baileys / Sessão Web)'
                                  : 'Evolution API (Meta Cloud)'
                                : 'UAZAPI (Conector de Sessão)'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#5F5F6B]">Última verificação:</span>
                        <span className="text-[#1A1A24] font-medium">
                          {conn.lastCheckedAt || 'Recentemente'}
                        </span>
                      </div>
                      {conn.notes && (
                        <p className="text-[11px] text-[#5F5F6B] pt-1 border-t border-slate-200/60 italic">
                          {conn.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleState(conn)}
                      className="text-[11px] font-semibold text-[#7C5CFC] hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Alternar estado (demonstração)</span>
                    </button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWhatsAppConnection(conn.id)}
                      className="h-8 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      <span>Remover</span>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Guia Comparativo dos Provedores WhatsApp */}
        <div className="mt-8 space-y-3">
          <div className="border-b border-[#E5E5EC] pb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1A1A24]">
              Visão Técnica: Modelos de Conexão sob Avaliação
            </h3>
            <span className="text-[11px] text-[#9B9BAD]">Planejamento de integração futura</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Meta Cloud API */}
            <div className="p-4 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A24]">1. Meta Cloud API</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Oficial
                </span>
              </div>
              <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                Opção recomendada para ambiente de produção. Alta confiabilidade, sem risco de queda
                de sessão web e envio em escala corporativa.
              </p>
              <div className="text-[10px] font-medium text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                Planejada — indisponível nesta demonstração
              </div>
            </div>

            {/* Parceiros/BSPs */}
            <div className="p-4 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A24]">2. Parceiros / BSPs</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Sob avaliação
                </span>
              </div>
              <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                360dialog, Twilio e Zenvia. Facilitam faturamento unificado e suporte direto, em
                avaliação comparativa de custos de tráfego.
              </p>
              <div className="text-[10px] text-[#5F5F6B] italic">
                * Não integrados no protótipo.
              </div>
            </div>

            {/* Evolution API */}
            <div className="p-4 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A24]">3. Evolution API</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-[#7C5CFC]">
                  Dual Engine
                </span>
              </div>
              <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                Permite alternar entre <strong>Meta Cloud API</strong> e{' '}
                <strong>Baileys (WhatsApp Web)</strong> com chave de instância configurável.
              </p>
              <div className="text-[10px] font-semibold text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200">
                Baileys = Experimental por sessão
              </div>
            </div>

            {/* UAZAPI */}
            <div className="p-4 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A24]">4. UAZAPI</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  Sessão
                </span>
              </div>
              <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                Conector de sessão via QR Code ou Pairing Code numérico de 8 dígitos. Em análise de
                latência e custo-benefício.
              </p>
              <div className="text-[10px] text-[#5F5F6B] italic">
                Placeholder demonstrativo de pareamento
              </div>
            </div>
          </div>
        </div>

        {/* DEMAIS CANAIS DA PLATAFORMA (Webchat, Instagram, Messenger) */}
        <div className="mt-8 space-y-3">
          <div className="border-b border-[#E5E5EC] pb-2">
            <h3 className="text-sm font-bold text-[#1A1A24]">Outros Canais Omnichannel</h3>
            <p className="text-xs text-[#5F5F6B]">
              Canais complementares para centralização de atendimento na mesma caixa de entrada.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CHANNELS_LIST.filter((ch) => ch.type !== 'whatsapp').map((channel) => (
              <Card
                key={channel.id}
                className="p-5 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F7F7FB] border border-[#E5E5EC] flex items-center justify-center shrink-0">
                        {getChannelIcon(channel.type)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A24]">{channel.name}</h4>
                        <span className="text-[10px] text-[#9B9BAD]">Integração Nativa</span>
                      </div>
                    </div>

                    <StatusPill status={channel.status} size="sm" />
                  </div>

                  <p className="text-xs text-[#5F5F6B] leading-relaxed">{channel.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-[#9B9BAD] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#7C5CFC]" />
                    Transbordo humano
                  </span>

                  <Button
                    onClick={() => handleConfigureOtherChannel(channel.name)}
                    className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-8 px-3 shadow-sm"
                  >
                    Configurar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Modal de Conexão WhatsApp Demonstrativa */}
      <ConnectWhatsAppModal
        open={isConnectModalOpen}
        onOpenChange={setIsConnectModalOpen}
        onSuccess={(newConn) => {
          addWhatsAppConnection(newConn)
        }}
      />
    </div>
  )
}
