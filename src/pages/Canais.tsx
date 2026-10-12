import { useOutletContext } from 'react-router-dom'
import {
  Radio,
  Globe,
  Instagram,
  MessageCircle,
  MessageSquareQuote,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CHANNELS_LIST } from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'

export default function Canais() {
  const { toast } = useToast()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const handleConfigureChannel = (channelName: string) => {
    toast({
      title: 'Configuração futura',
      description: `A integração do canal "${channelName}" será habilitada em uma próxima etapa de desenvolvimento.`,
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
          <div className="text-xs text-[#5F5F6B]">
            <p className="font-semibold text-[#1A1A24] mb-0.5">Nenhum canal conectado ainda</p>
            <p>
              A configuração real dos canais (geração de QR Code, webhook do Meta Cloud API ou token
              de widget) será habilitada em uma próxima etapa. Nesta versão demonstrativa os status
              são apenas ilustrativos.
            </p>
          </div>
        </div>

        {/* Grid of channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {CHANNELS_LIST.map((channel) => (
            <Card
              key={channel.id}
              className="p-6 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F7FB] border border-[#E5E5EC] flex items-center justify-center shrink-0">
                      {getChannelIcon(channel.type)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#1A1A24]">{channel.name}</h3>
                      <span className="text-[11px] text-[#9B9BAD]">Canal Oficial</span>
                    </div>
                  </div>

                  <StatusPill status={channel.status} size="sm" />
                </div>

                <p className="text-xs text-[#5F5F6B] leading-relaxed">{channel.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-[#9B9BAD] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C5CFC]" />
                  Suporte a transbordo humano
                </span>

                <Button
                  onClick={() => handleConfigureChannel(channel.name)}
                  className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-4 shadow-sm"
                >
                  Configurar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
