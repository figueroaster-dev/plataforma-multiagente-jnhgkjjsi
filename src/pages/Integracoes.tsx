import { useOutletContext } from 'react-router-dom'
import { Plug, Code2, UserCheck, Boxes, Network, Lock, ExternalLink, Shield } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { INTEGRATIONS_LIST } from '@/data/mockData'
import { useToast } from '@/hooks/use-toast'

export default function Integracoes() {
  const { toast } = useToast()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const handleConnectIntegration = (name: string) => {
    toast({
      title: 'Não conectado — disponível em breve',
      description: `A integração "${name}" está em homologação técnica. Nenhuma credencial necessária nesta fase.`,
    })
  }

  const getIntegrationIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#7C5CFC]" />
      case 'UserCheck':
        return <UserCheck className="w-5 h-5 text-emerald-600" />
      case 'Boxes':
        return <Boxes className="w-5 h-5 text-amber-600" />
      case 'Network':
      default:
        return <Network className="w-5 h-5 text-blue-600" />
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-12">
      <Header
        title="Integrações"
        subtitle="Ferramentas e APIs disponíveis para seus agentes"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Integrações' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner informativo */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5EC] shadow-sm flex items-start gap-3">
          <Shield className="w-5 h-5 text-[#7C5CFC] shrink-0 mt-0.5" />
          <div className="text-xs text-[#5F5F6B]">
            <p className="font-semibold text-[#1A1A24] mb-0.5">Camada de Conexão Segura</p>
            <p>
              Nenhum dado real ou credencial externa é trafegado no protótipo. Todas as integrações
              e chamadas a modelos ou APIs externas permanecem desligadas.
            </p>
          </div>
        </div>

        {/* Grid de Integrações */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {INTEGRATIONS_LIST.map((item) => (
            <Card
              key={item.id}
              className="p-6 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:border-[#7C5CFC]/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#F7F7FB] border border-[#E5E5EC] flex items-center justify-center shrink-0">
                      {getIntegrationIcon(item.icon)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A24]">{item.name}</h3>
                      <span className="text-[11px] text-[#9B9BAD] capitalize">
                        Categoria: {item.category}
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-400" /> Não conectada
                  </span>
                </div>

                <p className="text-xs text-[#5F5F6B] leading-relaxed mt-2">{item.description}</p>

                {item.requiresChannel && (
                  <span className="inline-block mt-3 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    * Requer canal configurado com suporte a transbordo
                  </span>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-[#9B9BAD]">Conexão via Webhook / REST</span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnectIntegration(item.name)}
                  className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 text-[#1A1A24] hover:bg-[#F1EEFE] hover:text-[#7C5CFC] hover:border-[#7C5CFC]/30 font-medium"
                >
                  Conectar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
