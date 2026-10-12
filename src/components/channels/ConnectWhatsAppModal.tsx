import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Layers,
  Building2,
  Server,
  Zap,
  Lock,
  Copy,
  RotateCw,
} from 'lucide-react'
import { WhatsAppProviderType, WhatsAppConnectionConfig } from '@/types/domain'
import { useToast } from '@/hooks/use-toast'

interface ConnectWhatsAppModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newConnection: Omit<WhatsAppConnectionConfig, 'id' | 'workspaceId'>) => void
}

type Step = 'select-provider' | 'provider-details' | 'simulated-connect' | 'finished'

export const ConnectWhatsAppModal: React.FC<ConnectWhatsAppModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { toast } = useToast()

  const [step, setStep] = useState<Step>('select-provider')
  const [selectedProvider, setSelectedProvider] = useState<WhatsAppProviderType>('meta_cloud_api')
  const [bspChoice, setBspChoice] = useState<'360dialog' | 'twilio' | 'zenvia'>('360dialog')
  const [evolutionType, setEvolutionType] = useState<'cloud_api' | 'baileys'>('cloud_api')
  const [uazapiAuthMode, setUazapiAuthMode] = useState<'qrcode' | 'pairing_code'>('qrcode')

  // Mock inputs claramente identificados como demonstrativos
  const [instanceName, setInstanceName] = useState('Atendimento Principal')
  const [simulatedPhone, setSimulatedPhone] = useState('+55 (11) 99888-7766')
  const [simulatedToken, setSimulatedToken] = useState(
    'EAABwz_exemplo_token_demonstrativo_mock_xyz',
  )
  const [simulatedEndpoint, setSimulatedEndpoint] = useState('https://api.evolution.exemplo.com')
  const [simulatedInstanceKey, setSimulatedInstanceKey] = useState('cerebro-instancia-demo-01')

  // Estado simulado do resultado
  const [simulatedStatus, setSimulatedStatus] = useState<
    'conectado_demonstracao' | 'atencao_conexao'
  >('conectado_demonstracao')
  const [isSimulating, setIsSimulating] = useState(false)

  const resetState = () => {
    setStep('select-provider')
    setSelectedProvider('meta_cloud_api')
    setBspChoice('360dialog')
    setEvolutionType('cloud_api')
    setUazapiAuthMode('qrcode')
    setSimulatedStatus('conectado_demonstracao')
    setIsSimulating(false)
  }

  const handleClose = () => {
    resetState()
    onOpenChange(false)
  }

  const handleStartSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      setIsSimulating(false)
      setStep('finished')
    }, 1200)
  }

  const handleFinalize = () => {
    let subType: WhatsAppConnectionConfig['subType'] = undefined
    let displayName = instanceName || 'Canal WhatsApp'

    if (selectedProvider === 'meta_cloud_api') {
      displayName = `${instanceName} (Meta Cloud API)`
    } else if (selectedProvider === 'bsp_partner') {
      subType = `bsp_${bspChoice}` as any
      displayName = `${instanceName} (${bspChoice.toUpperCase()})`
    } else if (selectedProvider === 'evolution_api') {
      subType = evolutionType === 'cloud_api' ? 'evolution_cloud_api' : 'evolution_baileys'
      displayName =
        evolutionType === 'cloud_api'
          ? `${instanceName} (Evolution - Meta Cloud)`
          : `${instanceName} (Evolution - Baileys Web)`
    } else if (selectedProvider === 'uazapi') {
      displayName = `${instanceName} (UAZAPI ${uazapiAuthMode === 'qrcode' ? 'QR Code' : 'Código'})`
    }

    onSuccess({
      providerType: selectedProvider,
      subType,
      displayName,
      phoneNumber: simulatedPhone,
      status: simulatedStatus,
      notes:
        selectedProvider === 'meta_cloud_api'
          ? 'Conexão oficial planejada via Meta Cloud API.'
          : selectedProvider === 'evolution_api' && evolutionType === 'baileys'
            ? 'Modo experimental baseado em sessão web (Baileys).'
            : 'Instância em homologação técnica com provider terceiro.',
    })

    toast({
      title: 'Conexão configurada na demonstração',
      description: `A instância "${displayName}" foi registrada no protótipo local com sucesso.`,
    })

    handleClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) handleClose()
        else onOpenChange(true)
      }}
    >
      <DialogContent className="max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-8 rounded-2xl border border-[#E5E5EC]">
        <DialogHeader className="border-b border-[#E5E5EC] pb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-100 text-[#7C5CFC] border border-violet-200">
              <Sparkles className="w-3 h-3" /> Demonstração Visual
            </span>
            <span className="text-xs text-[#9B9BAD]">
              Ambiente seguro sem tráfego de credenciais reais
            </span>
          </div>
          <DialogTitle className="text-xl font-bold text-[#1A1A24]">
            Conectar Canal WhatsApp
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5F5F6B]">
            Avalie arquiteturas de conexão para seus agentes de IA. Nenhuma credencial real é
            persistida ou transmitida neste protótipo.
          </DialogDescription>
        </DialogHeader>

        {/* Aviso de governança / estabilidade */}
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5 mt-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed">
            <p className="font-semibold text-amber-950">
              Aviso sobre estabilidade, suporte e termos comerciais
            </p>
            <p className="text-[11px] text-amber-900/90">
              A estabilidade de cada provedor, taxas de mensagem da Meta, termos de serviço de
              parceiros (BSPs) e riscos operacionais de conexões por emulação de sessão web devem
              ser formalmente validados antes de qualquer integração em ambiente produtivo.
            </p>
          </div>
        </div>

        {/* ETAPA 1: Seleção de Provedor */}
        {step === 'select-provider' && (
          <div className="space-y-4 py-4">
            <div className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider">
              1. Selecione o modelo de conexão WhatsApp
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Opção 1: Meta Cloud API */}
              <div
                onClick={() => setSelectedProvider('meta_cloud_api')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  selectedProvider === 'meta_cloud_api'
                    ? 'border-[#7C5CFC] bg-[#FAF8FE] shadow-sm'
                    : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Recomendada para produção
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-violet-100 text-[#7C5CFC]">
                      Oficial
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A24]">Meta WhatsApp Cloud API</h4>
                  <p className="text-xs text-[#5F5F6B] mt-1.5 leading-relaxed">
                    Conexão direta com a infraestrutura oficial da Meta. Alta estabilidade, suporte
                    a templates aprovados, webhooks nativos e sem dependência de celular ligado.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Planejada — conexão indisponível nesta demonstração
                  </span>
                </div>
              </div>

              {/* Opção 2: Parceiros/BSPs */}
              <div
                onClick={() => setSelectedProvider('bsp_partner')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  selectedProvider === 'bsp_partner'
                    ? 'border-[#7C5CFC] bg-[#FAF8FE] shadow-sm'
                    : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                      Sob Avaliação
                    </span>
                    <span className="text-[10px] text-[#9B9BAD]">Provedores de Solução</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A24]">
                    Parceiros/BSPs (360dialog, Twilio, Zenvia)
                  </h4>
                  <p className="text-xs text-[#5F5F6B] mt-1.5 leading-relaxed">
                    Gateways intermediários homologados pela Meta para simplificar faturamento e
                    provisionamento de números. Em fase de avaliação de SLA e custos.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-[#5F5F6B] italic">
                    * Opções sob avaliação técnica; não integradas no momento.
                  </span>
                </div>
              </div>

              {/* Opção 3: Evolution API */}
              <div
                onClick={() => setSelectedProvider('evolution_api')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  selectedProvider === 'evolution_api'
                    ? 'border-[#7C5CFC] bg-[#FAF8FE] shadow-sm'
                    : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-violet-100 text-[#7C5CFC] border border-violet-200">
                      Gateway Flexível
                    </span>
                    <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">
                      Exige Diferenciação
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A24]">Evolution API</h4>
                  <p className="text-xs text-[#5F5F6B] mt-1.5 leading-relaxed">
                    API auto-hospedada ou gerenciada que suporta tanto a{' '}
                    <strong>Meta Cloud API</strong> quanto sessões{' '}
                    <strong>Baileys / WhatsApp Web</strong> (modo experimental).
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-[#7C5CFC] font-medium">
                    Permite chave de instância e webhook configurável
                  </span>
                </div>
              </div>

              {/* Opção 4: UAZAPI */}
              <div
                onClick={() => setSelectedProvider('uazapi')}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative flex flex-col justify-between ${
                  selectedProvider === 'uazapi'
                    ? 'border-[#7C5CFC] bg-[#FAF8FE] shadow-sm'
                    : 'border-[#E5E5EC] bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      Conector de Sessão
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">
                      Sob Avaliação
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1A1A24]">UAZAPI</h4>
                  <p className="text-xs text-[#5F5F6B] mt-1.5 leading-relaxed">
                    Conector de sessão via QR Code ou código de pareamento numérico (Pairing Code).
                    Avaliação de latência e estabilidade em andamento.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[11px] text-[#5F5F6B]">
                    Conexão rápida para validações e testes de protótipo
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-[#E5E5EC]">
              <Button
                onClick={() => setStep('provider-details')}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1.5"
              >
                <span>Avançar para detalhes</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 2: Detalhes do Provedor e Dados Requeridos */}
        {step === 'provider-details' && (
          <div className="space-y-5 py-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider">
                2. Parâmetros e dados requeridos em futura integração
              </div>
              <span className="text-[11px] text-[#9B9BAD]">
                Todos os campos são exemplos ilustrativos
              </span>
            </div>

            {/* Configurações específicas conforme o provider selecionado */}
            {selectedProvider === 'meta_cloud_api' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A24]">
                      Meta WhatsApp Cloud API (Oficial)
                    </h4>
                    <p className="text-[11px] text-[#5F5F6B] mt-0.5">
                      Método: Chamadas diretas HTTP Graph API + Webhook de eventos assinado por App
                      Secret da Meta.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs border border-amber-200">
                  <strong>Estado na demonstração:</strong> Planejada — conexão indisponível nesta
                  demonstração. A integração real exigirá conta no Meta Business Manager, WABA ID e
                  número verificado.
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      WABA ID (WhatsApp Business Account ID)
                    </label>
                    <Input
                      disabled
                      value="109823471092837 (exemplo ilustrativo)"
                      className="bg-white border-[#E5E5EC] text-xs h-8 text-[#5F5F6B]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      Phone Number ID
                    </label>
                    <Input
                      disabled
                      value="102938475610293 (exemplo ilustrativo)"
                      className="bg-white border-[#E5E5EC] text-xs h-8 text-[#5F5F6B]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      Token de Acesso Permanente do Sistema (demonstrativo)
                    </label>
                    <div className="relative">
                      <Input
                        disabled
                        value={simulatedToken}
                        className="bg-white border-[#E5E5EC] text-xs h-8 pr-8 font-mono text-[#5F5F6B]"
                      />
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                    </div>
                    <span className="text-[10px] text-[#9B9BAD] mt-1 block">
                      Nunca digite sua chave real neste protótipo.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === 'bsp_partner' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#1A1A24] mb-2">
                    Selecione o Parceiro / BSP em avaliação:
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {(['360dialog', 'twilio', 'zenvia'] as const).map((bsp) => (
                      <button
                        key={bsp}
                        type="button"
                        onClick={() => setBspChoice(bsp)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                          bspChoice === bsp
                            ? 'bg-[#7C5CFC] text-white border-[#7C5CFC]'
                            : 'bg-white text-[#1A1A24] border-[#E5E5EC] hover:bg-slate-100'
                        }`}
                      >
                        {bsp === '360dialog' ? '360dialog' : bsp === 'twilio' ? 'Twilio' : 'Zenvia'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs border border-blue-200">
                  <strong>Estado na demonstração:</strong> Sob avaliação técnica e comercial. Não
                  afirmamos integração concluída.
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      API Key do Provedor ({bspChoice})
                    </label>
                    <Input
                      disabled
                      value={`d360-api-key-demo-exemplo-${bspChoice}-xyz`}
                      className="bg-white border-[#E5E5EC] text-xs h-8 font-mono text-[#5F5F6B]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      Webhook de Retorno Gerado pela Cérebro Digital
                    </label>
                    <Input
                      disabled
                      value={`https://api.cerebroagents.com.br/v1/webhooks/bsp/${bspChoice}/demo`}
                      className="bg-white border-[#E5E5EC] text-xs h-8 text-[#5F5F6B]"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === 'evolution_api' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-4">
                <div className="border-b border-[#E5E5EC] pb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1A1A24]">
                      Diferenciação Obrigatória da Evolution API:
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded">
                      Escolha o modo de operação
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5F5F6B]">
                    A Evolution API pode atuar como ponte da API oficial da Meta ou através de
                    emulação de sessão WhatsApp Web (Baileys).
                  </p>
                </div>

                <RadioGroup
                  value={evolutionType}
                  onValueChange={(val: 'cloud_api' | 'baileys') => setEvolutionType(val)}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <label
                    htmlFor="evo-cloud"
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      evolutionType === 'cloud_api'
                        ? 'bg-violet-50/70 border-[#7C5CFC]'
                        : 'bg-white border-[#E5E5EC]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RadioGroupItem value="cloud_api" id="evo-cloud" />
                        <span className="text-xs font-bold text-[#1A1A24]">Meta Cloud API</span>
                      </div>
                      <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                        Conexão oficial da Meta roteada através do gateway da Evolution API. Requer
                        credenciais da Meta.
                      </p>
                    </div>
                    <span className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                      Modo empresarial oficial
                    </span>
                  </label>

                  <label
                    htmlFor="evo-baileys"
                    className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                      evolutionType === 'baileys'
                        ? 'bg-amber-50/70 border-amber-500'
                        : 'bg-white border-[#E5E5EC]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RadioGroupItem value="baileys" id="evo-baileys" />
                        <span className="text-xs font-bold text-[#1A1A24]">
                          Baileys / WhatsApp Web
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5F5F6B] leading-relaxed">
                        Modo experimental baseado em sessão de navegador. Exige pareamento por QR
                        Code e verificação periódica.
                      </p>
                    </div>
                    <span className="mt-2 text-[10px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded w-fit">
                      Experimental / Sessão
                    </span>
                  </label>
                </RadioGroup>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      URL do Servidor Evolution (demonstrativo)
                    </label>
                    <Input
                      value={simulatedEndpoint}
                      onChange={(e) => setSimulatedEndpoint(e.target.value)}
                      className="bg-white border-[#E5E5EC] text-xs h-8"
                      placeholder="https://sua-evolution.com"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#1A1A24] mb-1">
                      Nome da Instância
                    </label>
                    <Input
                      value={simulatedInstanceKey}
                      onChange={(e) => setSimulatedInstanceKey(e.target.value)}
                      className="bg-white border-[#E5E5EC] text-xs h-8"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedProvider === 'uazapi' && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A1A24]">
                      UAZAPI — Conector de Sessão
                    </h4>
                    <p className="text-[11px] text-[#5F5F6B] mt-0.5">
                      Identificado como conector de sessão via QR Code ou código numérico de
                      pareamento, atualmente sob avaliação.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-900 rounded-lg text-xs border border-blue-200">
                  <strong>Estado na demonstração:</strong> Conector de sessão sob avaliação de
                  desempenho e estabilidade.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
                    Método de autenticação da sessão:
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setUazapiAuthMode('qrcode')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        uazapiAuthMode === 'qrcode'
                          ? 'bg-[#7C5CFC] text-white border-[#7C5CFC]'
                          : 'bg-white text-[#1A1A24] border-[#E5E5EC]'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Code (Simulado)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUazapiAuthMode('pairing_code')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                        uazapiAuthMode === 'pairing_code'
                          ? 'bg-[#7C5CFC] text-white border-[#7C5CFC]'
                          : 'bg-white text-[#1A1A24] border-[#E5E5EC]'
                      }`}
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Pairing Code (Código de 8 dígitos)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Identificação Geral da Instância */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <label className="block font-semibold text-[#1A1A24] mb-1">
                  Nome amigável da conexão
                </label>
                <Input
                  value={instanceName}
                  onChange={(e) => setInstanceName(e.target.value)}
                  className="bg-white border-[#E5E5EC] text-xs h-8"
                  placeholder="Ex: WhatsApp Vendas"
                />
              </div>
              <div>
                <label className="block font-semibold text-[#1A1A24] mb-1">
                  Número de Telefone (Exemplo)
                </label>
                <Input
                  value={simulatedPhone}
                  onChange={(e) => setSimulatedPhone(e.target.value)}
                  className="bg-white border-[#E5E5EC] text-xs h-8"
                  placeholder="+55 (11) 99999-9999"
                />
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E5E5EC]">
              <Button
                variant="outline"
                onClick={() => setStep('select-provider')}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              <Button
                onClick={() => setStep('simulated-connect')}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1.5"
              >
                <span>Avançar para simulação</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 3: Simulação de Conexão / Placeholder de QR Code */}
        {step === 'simulated-connect' && (
          <div className="space-y-5 py-4">
            <div className="text-xs font-semibold text-[#1A1A24] uppercase tracking-wider">
              3. Simulação de pareamento e ativação
            </div>

            {/* Exibição condicional de Placeholder de QR Code para conectores baseados em sessão */}
            {((selectedProvider === 'evolution_api' && evolutionType === 'baileys') ||
              (selectedProvider === 'uazapi' && uazapiAuthMode === 'qrcode')) && (
              <div className="p-6 rounded-2xl bg-[#FAF9FD] border-2 border-dashed border-[#7C5CFC]/30 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-40 h-40 rounded-xl bg-white border border-[#E5E5EC] shadow-inner flex flex-col items-center justify-center p-3 relative">
                  <QrCode className="w-20 h-20 text-[#7C5CFC]/40" />
                  <span className="text-[10px] font-bold text-[#7C5CFC] mt-2 uppercase tracking-wide">
                    Placeholder de QR Code
                  </span>
                </div>

                <div className="max-w-md space-y-1">
                  <p className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    Nenhum QR code real é gerado ou escaneado nesta demonstração.
                  </p>
                  <p className="text-[11px] text-[#5F5F6B]">
                    Área demonstrativa reservada para leitura óptica no aplicativo móvel em versões
                    futuras com gateway operacional.
                  </p>
                </div>
              </div>
            )}

            {/* Exibição condicional para Pairing Code do UAZAPI */}
            {selectedProvider === 'uazapi' && uazapiAuthMode === 'pairing_code' && (
              <div className="p-5 rounded-2xl bg-[#FAF9FD] border border-[#E5E5EC] text-center space-y-3">
                <p className="text-xs font-semibold text-[#1A1A24]">
                  Código de Pareamento de Demonstração (Pairing Code)
                </p>
                <div className="flex justify-center gap-2 font-mono text-lg font-bold text-[#7C5CFC]">
                  <span className="px-3 py-1.5 bg-white border rounded-lg">C</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">E</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">R</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">-</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">9</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">4</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">0</span>
                  <span className="px-3 py-1.5 bg-white border rounded-lg">1</span>
                </div>
                <p className="text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 inline-block">
                  * Código fictício para validação de fluxo de interface; nenhuma sessão real é
                  aberta.
                </p>
              </div>
            )}

            {/* Informação sobre token / webhook para Meta Cloud API ou BSP */}
            {(selectedProvider === 'meta_cloud_api' ||
              selectedProvider === 'bsp_partner' ||
              (selectedProvider === 'evolution_api' && evolutionType === 'cloud_api')) && (
              <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-[#1A1A24] font-semibold">
                  <Lock className="w-4 h-4 text-[#7C5CFC]" />
                  <span>Handshake de Webhook e Token emulado</span>
                </div>
                <p className="text-[11px] text-[#5F5F6B]">
                  Nenhum webhook real é disparado e nenhum token é validado contra a Meta. O
                  simulador apenas registrará o estado demonstrativo no AppContext local.
                </p>
              </div>
            )}

            {/* Escolha do estado final demonstrativo */}
            <div className="p-3.5 rounded-xl border border-[#E5E5EC] bg-white space-y-2">
              <label className="block text-xs font-semibold text-[#1A1A24]">
                Simular resultado do estado de conexão:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSimulatedStatus('conectado_demonstracao')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    simulatedStatus === 'conectado_demonstracao'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400'
                      : 'bg-white text-slate-600 border-[#E5E5EC]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conectado — demonstração</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimulatedStatus('atencao_conexao')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                    simulatedStatus === 'atencao_conexao'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 ring-1 ring-amber-400'
                      : 'bg-white text-slate-600 border-[#E5E5EC]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Atenção à conexão</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-[#E5E5EC]">
              <Button
                variant="outline"
                onClick={() => setStep('provider-details')}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </Button>

              <Button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-6 gap-2"
              >
                {isSimulating ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" />
                    <span>Simulando handshake...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Simular conexão</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ETAPA 4: Concluído */}
        {step === 'finished' && (
          <div className="space-y-5 py-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-[#1A1A24]">Fluxo demonstrativo concluído!</h3>
              <p className="text-xs text-[#5F5F6B] mt-1 max-w-md mx-auto">
                A instância foi salva no estado local com o status{' '}
                <span className="font-semibold text-[#1A1A24]">
                  {simulatedStatus === 'conectado_demonstracao'
                    ? 'Conectado — demonstração'
                    : 'Atenção à conexão'}
                </span>
                .
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-[#E5E5EC] text-left text-xs space-y-1.5 max-w-lg mx-auto">
              <div className="flex justify-between">
                <span className="text-[#5F5F6B]">Provedor selecionado:</span>
                <span className="font-semibold text-[#1A1A24] capitalize">
                  {selectedProvider.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5F6B]">Instância:</span>
                <span className="font-semibold text-[#1A1A24]">{instanceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5F6B]">Número configurado:</span>
                <span className="font-semibold text-[#1A1A24]">{simulatedPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5F5F6B]">Status atribuído:</span>
                <span className="font-bold text-[#7C5CFC]">
                  {simulatedStatus === 'conectado_demonstracao'
                    ? 'Conectado — demonstração'
                    : 'Atenção à conexão'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E5EC] flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4"
              >
                Cancelar
              </Button>

              <Button
                onClick={handleFinalize}
                className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-6"
              >
                Concluir e registrar no painel
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
