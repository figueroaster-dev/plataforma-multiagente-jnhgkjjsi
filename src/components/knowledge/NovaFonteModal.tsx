import React, { useState } from 'react'
import {
  FileText,
  Globe,
  HelpCircle,
  Upload,
  Plus,
  Trash2,
  AlertCircle,
  Sparkles,
  Info,
  Check,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useApp } from '@/context/AppContext'
import { KnowledgeBase, KnowledgeType } from '@/types/domain'

export interface NovaFonteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /**
   * Callback opcional disparado quando a nova fonte é criada com sucesso.
   * Recebe o objeto da fonte recém-criada (ex: para auto-seleção na Etapa 3).
   */
  onCreated?: (newKnowledge: KnowledgeBase) => void
  /**
   * ID do agente atual (se estiver no assistente de criação/edição),
   * permitindo vincular opcionalmente à nova fonte de forma imediata.
   */
  currentAgentId?: string
}

interface FaqItem {
  id: string
  pergunta: string
  resposta: string
}

export function NovaFonteModal({
  open,
  onOpenChange,
  onCreated,
  currentAgentId,
}: NovaFonteModalProps) {
  const { createKnowledgeBase } = useApp()

  const [type, setType] = useState<KnowledgeType>('PDF')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  // Campos específicos de PDF
  const [selectedFileName, setSelectedFileName] = useState<string>('')
  const [simulatedFileSize, setSimulatedFileSize] = useState<string>('')

  // Campos específicos de Site
  const [siteUrl, setSiteUrl] = useState('')

  // Campos específicos de FAQ
  const [faqItems, setFaqItems] = useState<FaqItem[]>([{ id: '1', pergunta: '', resposta: '' }])

  // Erros de validação
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Reseta o formulário
  const resetForm = () => {
    setType('PDF')
    setName('')
    setDescription('')
    setSelectedFileName('')
    setSimulatedFileSize('')
    setSiteUrl('')
    setFaqItems([{ id: '1', pergunta: '', resposta: '' }])
    setErrors({})
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  // Manipulação de arquivos fictícios / upload demonstrativo
  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      setSimulatedFileSize(`${sizeMb} MB`)
      if (!name.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '')
        setName(cleanName)
      }
      if (errors.file) {
        setErrors((prev) => ({ ...prev, file: '' }))
      }
    }
  }

  const handleSelectDemoPdf = (presetName: string, presetSize: string) => {
    setSelectedFileName(presetName)
    setSimulatedFileSize(presetSize)
    if (!name.trim()) {
      setName(presetName.replace(/\.pdf$/i, ''))
    }
    if (errors.file) {
      setErrors((prev) => ({ ...prev, file: '' }))
    }
  }

  // FAQ item helpers
  const handleAddFaqItem = () => {
    setFaqItems((prev) => [...prev, { id: Date.now().toString(), pergunta: '', resposta: '' }])
  }

  const handleRemoveFaqItem = (id: string) => {
    if (faqItems.length <= 1) return
    setFaqItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleUpdateFaqItem = (id: string, field: 'pergunta' | 'resposta', value: string) => {
    setFaqItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
    if (errors.faq) {
      setErrors((prev) => ({ ...prev, faq: '' }))
    }
  }

  // Validação
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!name.trim()) {
      newErrors.name = 'O nome da fonte é obrigatório.'
    } else if (name.trim().length < 3) {
      newErrors.name = 'O nome deve ter pelo menos 3 caracteres.'
    }

    if (type === 'PDF') {
      if (!selectedFileName.trim()) {
        newErrors.file = 'Selecione ou anexe um arquivo PDF demonstrativo.'
      }
    }

    if (type === 'Site') {
      if (!siteUrl.trim()) {
        newErrors.siteUrl = 'A URL do site é obrigatória.'
      } else {
        const urlLower = siteUrl.trim().toLowerCase()
        if (!urlLower.startsWith('http://') && !urlLower.startsWith('https://')) {
          newErrors.siteUrl = 'A URL deve iniciar com https:// ou http://'
        }
      }
    }

    if (type === 'FAQ') {
      const validPairs = faqItems.filter(
        (item) => item.pergunta.trim().length > 0 && item.resposta.trim().length > 0,
      )
      if (validPairs.length === 0) {
        newErrors.faq = 'Preencha ao menos uma pergunta e resposta no FAQ.'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submissão
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    let calculatedSize = '1 documento'
    let finalDescription = description.trim()
    let sourcesCount = 1

    if (type === 'PDF') {
      calculatedSize = simulatedFileSize || '2.4 MB'
      sourcesCount = 1
      if (!finalDescription) {
        finalDescription = `Documento PDF demonstrativo: ${selectedFileName}`
      }
    } else if (type === 'Site') {
      calculatedSize = 'Indexação web'
      sourcesCount = 1
      if (!finalDescription) {
        finalDescription = `Base sincronizada a partir do site: ${siteUrl.trim()}`
      }
    } else if (type === 'FAQ') {
      const validPairs = faqItems.filter(
        (item) => item.pergunta.trim().length > 0 && item.resposta.trim().length > 0,
      )
      sourcesCount = validPairs.length
      calculatedSize = `${validPairs.length} ${validPairs.length === 1 ? 'pergunta' : 'perguntas'}`
      if (!finalDescription) {
        finalDescription = `Base de perguntas e respostas com ${validPairs.length} item(ns) cadastrados.`
      }
    }

    const linkedAgentIds: string[] = currentAgentId ? [currentAgentId] : []

    const newKb = createKnowledgeBase({
      name: name.trim(),
      type,
      status: 'pronto',
      size: calculatedSize,
      description: finalDescription,
      sourcesCount,
      linkedAgentIds,
    })

    if (onCreated) {
      onCreated(newKb)
    }

    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : handleClose())}>
      <DialogContent className="max-w-xl w-full p-6 bg-white rounded-2xl border border-[#E5E5EC] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1 border-b border-[#E5E5EC] pb-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <DialogTitle className="text-lg font-bold text-[#1A1A24] flex items-center gap-2">
              <span>Nova Fonte de Conhecimento</span>
            </DialogTitle>
            <Badge
              variant="outline"
              className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE] font-medium"
            >
              <Sparkles className="w-3 h-3 mr-1 inline" />
              Demonstração
            </Badge>
          </div>
          <DialogDescription className="text-xs text-[#5F5F6B]">
            Cadastre uma fonte de conhecimento para alimentar as respostas e contextualização dos
            agentes inteligentes.
          </DialogDescription>
        </DialogHeader>

        {/* Aviso de Demonstração */}
        <div className="p-3 rounded-xl bg-violet-50/70 border border-[#7C5CFC]/20 text-xs text-[#5232CD] flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#7C5CFC] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            <strong>Ambiente demonstrativo:</strong> Nenhum arquivo real é enviado, indexado ou
            armazenado em servidores externos. A base será adicionada ao catálogo local da sessão.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Seletor de Tipo */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A24] mb-1.5">
              Tipo da fonte <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                {
                  id: 'PDF' as const,
                  label: 'PDF',
                  desc: 'Documentos e manuais',
                  icon: FileText,
                  color: 'text-rose-500',
                  bgSelected: 'bg-rose-50 border-rose-300',
                },
                {
                  id: 'Site' as const,
                  label: 'Site',
                  desc: 'URLs e páginas web',
                  icon: Globe,
                  color: 'text-blue-500',
                  bgSelected: 'bg-blue-50 border-blue-300',
                },
                {
                  id: 'FAQ' as const,
                  label: 'FAQ',
                  desc: 'Perguntas e respostas',
                  icon: HelpCircle,
                  color: 'text-[#7C5CFC]',
                  bgSelected: 'bg-[#F1EEFE] border-[#7C5CFC]',
                },
              ].map((item) => {
                const isSelected = type === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setType(item.id)
                      setErrors({})
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${item.bgSelected} border-2 shadow-sm`
                        : 'bg-white border-[#E5E5EC] hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="w-7 h-7 rounded-lg bg-white shadow-xs flex items-center justify-center">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#7C5CFC]" />}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1A1A24] text-xs">{item.label}</div>
                      <div className="text-[10px] text-[#9B9BAD] mt-0.5">{item.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nome da Fonte */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
              Nome da fonte <span className="text-rose-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
              }}
              placeholder={
                type === 'PDF'
                  ? 'Ex: Catálogo de Produtos 2024'
                  : type === 'Site'
                    ? 'Ex: Central de Ajuda do Portal'
                    : 'Ex: Perguntas Frequentes de Onboarding'
              }
              className={`rounded-xl text-xs bg-white ${
                errors.name
                  ? 'border-rose-400 focus-visible:ring-rose-400 bg-rose-50/20'
                  : 'border-[#E5E5EC]'
              }`}
            />
            {errors.name ? (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.name}</span>
              </p>
            ) : (
              <span className="text-[10px] text-[#9B9BAD] mt-1 block">
                Nome visível nos vínculos com agentes e relatórios de conhecimento.
              </span>
            )}
          </div>

          {/* Descrição Opcional */}
          <div>
            <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
              Descrição (opcional)
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Utilizada para orientar clientes sobre regras de devolução e catálogo."
              className="rounded-xl text-xs bg-white border-[#E5E5EC]"
            />
          </div>

          {/* CAMPOS ESPECÍFICOS: PDF */}
          {type === 'PDF' && (
            <div className="space-y-3 pt-1 border-t border-[#E5E5EC]/60">
              <label className="block text-xs font-semibold text-[#1A1A24]">
                Arquivo PDF demonstrativo <span className="text-rose-500">*</span>
              </label>

              {/* Upload Dropzone Demonstrativo */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition-all bg-[#FAF9FD] ${
                  errors.file
                    ? 'border-rose-400 bg-rose-50/20'
                    : selectedFileName
                      ? 'border-[#7C5CFC]/40 bg-[#F1EEFE]/30'
                      : 'border-[#E5E5EC] hover:border-[#7C5CFC]/50'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Selecionar arquivo PDF demonstrativo"
                />
                <div className="flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#7C5CFC] mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  {selectedFileName ? (
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A24]">
                        Arquivo selecionado:{' '}
                        <span className="text-[#7C5CFC]">{selectedFileName}</span>
                      </p>
                      <p className="text-[11px] text-[#9B9BAD] mt-0.5">
                        {simulatedFileSize || 'Tamanho estimado: 2.8 MB'} • Pronto para demonstração
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A24]">
                        Clique ou arraste um arquivo PDF demonstrativo
                      </p>
                      <p className="text-[10px] text-[#9B9BAD] mt-0.5">
                        Formatos aceitos: PDF (nenhum upload real será realizado)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {errors.file && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.file}</span>
                </p>
              )}

              {/* Sugestões rápidas de arquivos de teste */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                <span className="text-[#9B9BAD]">Ou escolha um modelo rápido:</span>
                {[
                  { name: 'Guia_de_Politicas_2024.pdf', size: '3.1 MB' },
                  { name: 'Tabela_Precos_Vendas.pdf', size: '1.9 MB' },
                  { name: 'Manual_Integracao_API.pdf', size: '4.5 MB' },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectDemoPdf(preset.name, preset.size)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F1EEFE] hover:text-[#7C5CFC] text-[#5F5F6B] text-[10px] font-medium transition-colors border border-slate-200"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS: Site */}
          {type === 'Site' && (
            <div className="space-y-3 pt-1 border-t border-[#E5E5EC]/60">
              <div>
                <label className="block text-xs font-semibold text-[#1A1A24] mb-1">
                  URL do Site <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-[#9B9BAD] absolute left-3 top-2.5 pointer-events-none" />
                  <Input
                    value={siteUrl}
                    onChange={(e) => {
                      setSiteUrl(e.target.value)
                      if (errors.siteUrl) setErrors((prev) => ({ ...prev, siteUrl: '' }))
                    }}
                    placeholder="https://suaempresa.com.br/ajuda"
                    className={`pl-9 rounded-xl text-xs font-mono bg-white ${
                      errors.siteUrl
                        ? 'border-rose-400 focus-visible:ring-rose-400 bg-rose-50/20'
                        : 'border-[#E5E5EC]'
                    }`}
                  />
                </div>
                {errors.siteUrl ? (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.siteUrl}</span>
                  </p>
                ) : (
                  <span className="text-[10px] text-[#9B9BAD] mt-1 block">
                    Endereço público das páginas institucionais ou central de ajuda a indexar.
                  </span>
                )}
              </div>

              {/* Sugestões de URL para teste rápido */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                <span className="text-[#9B9BAD]">Sugestões rápidas:</span>
                {[
                  { label: 'Central de Ajuda', url: 'https://suaempresa.com.br/ajuda' },
                  { label: 'Termos e Condições', url: 'https://suaempresa.com.br/termos' },
                  { label: 'Blog de Novidades', url: 'https://suaempresa.com.br/blog' },
                ].map((sug) => (
                  <button
                    key={sug.url}
                    type="button"
                    onClick={() => {
                      setSiteUrl(sug.url)
                      if (!name.trim()) setName(sug.label)
                      if (errors.siteUrl) setErrors((prev) => ({ ...prev, siteUrl: '' }))
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#F1EEFE] hover:text-[#7C5CFC] text-[#5F5F6B] text-[10px] font-medium transition-colors border border-slate-200"
                  >
                    {sug.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS: FAQ */}
          {type === 'FAQ' && (
            <div className="space-y-3 pt-1 border-t border-[#E5E5EC]/60">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1A24]">
                    Perguntas e Respostas <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-[#9B9BAD]">
                    Cadastre pares estruturados de dúvidas frequentes e respostas oficiais.
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddFaqItem}
                  className="h-7 text-[11px] gap-1 rounded-lg border-[#E5E5EC] text-[#7C5CFC] hover:bg-[#F1EEFE]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar pergunta</span>
                </Button>
              </div>

              {errors.faq && (
                <p className="text-[11px] text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.faq}</span>
                </p>
              )}

              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {faqItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-[#E5E5EC] bg-[#FAF9FD] space-y-2 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wide">
                        Item {idx + 1}
                      </span>
                      {faqItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaqItem(item.id)}
                          className="text-[#9B9BAD] hover:text-rose-500 p-1 rounded-md transition-colors"
                          title="Remover pergunta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div>
                      <Input
                        value={item.pergunta}
                        onChange={(e) => handleUpdateFaqItem(item.id, 'pergunta', e.target.value)}
                        placeholder="Pergunta: Ex: Qual é o prazo de entrega?"
                        className="rounded-lg text-xs bg-white border-[#E5E5EC] h-8"
                      />
                    </div>
                    <div>
                      <Textarea
                        rows={2}
                        value={item.resposta}
                        onChange={(e) => handleUpdateFaqItem(item.id, 'resposta', e.target.value)}
                        placeholder="Resposta oficial: Ex: O prazo padrão para todo o Brasil é de 3 a 5 dias úteis."
                        className="rounded-lg text-xs bg-white border-[#E5E5EC]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rodapé com botões de Ação */}
          <DialogFooter className="pt-4 border-t border-[#E5E5EC] gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs font-semibold h-9 px-5 gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar fonte</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
