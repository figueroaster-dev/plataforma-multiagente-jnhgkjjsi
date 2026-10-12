import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  BookOpen,
  Plus,
  FileText,
  Globe,
  HelpCircle,
  Eye,
  Info,
  Calendar,
  HardDrive,
  Users,
  AlertTriangle,
  MoreVertical,
  Edit2,
  Trash2,
  Unlink,
  Link2,
  ExternalLink,
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useApp } from '@/context/AppContext'
import { KnowledgeBase, Agent } from '@/types/domain'
import { NovaFonteModal } from '@/components/knowledge/NovaFonteModal'

export default function Conhecimento() {
  const { knowledgeBases, agents, deleteKnowledgeBase, unlinkKnowledgeBaseFromAgent } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  // Estado para visualização de detalhes (Drawer)
  const [selectedBaseId, setSelectedBaseId] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Estado para criação/edição de fonte
  const [isNovaFonteModalOpen, setIsNovaFonteModalOpen] = useState(false)
  const [editingBase, setEditingBase] = useState<KnowledgeBase | null>(null)

  // Estado para diálogo de confirmação de exclusão da fonte
  const [deletingBase, setDeletingBase] = useState<KnowledgeBase | null>(null)

  // Estado para diálogo de confirmação de remoção de vínculo
  const [unlinkingTarget, setUnlinkingTarget] = useState<{
    base: KnowledgeBase
    agent: Agent
  } | null>(null)

  // Obtém o objeto selecionado mais atualizado a partir do AppContext
  const selectedBase = knowledgeBases.find((b) => b.id === selectedBaseId) || null

  const handleOpenDetail = (base: KnowledgeBase) => {
    setSelectedBaseId(base.id)
    setDrawerOpen(true)
  }

  const handleOpenCreate = () => {
    setEditingBase(null)
    setIsNovaFonteModalOpen(true)
  }

  const handleOpenEdit = (base: KnowledgeBase, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingBase(base)
    setIsNovaFonteModalOpen(true)
  }

  const handleRequestDelete = (base: KnowledgeBase, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setDeletingBase(base)
  }

  const handleConfirmDelete = () => {
    if (!deletingBase) return
    const idToDelete = deletingBase.id
    deleteKnowledgeBase(idToDelete)
    if (selectedBaseId === idToDelete) {
      setDrawerOpen(false)
      setSelectedBaseId(null)
    }
    setDeletingBase(null)
  }

  const handleRequestUnlink = (base: KnowledgeBase, agent: Agent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setUnlinkingTarget({ base, agent })
  }

  const handleConfirmUnlink = () => {
    if (!unlinkingTarget) return
    unlinkKnowledgeBaseFromAgent(unlinkingTarget.base.id, unlinkingTarget.agent.id)
    setUnlinkingTarget(null)
  }

  const getSourceIcon = (type: KnowledgeBase['type']) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-500" />
      case 'Site':
        return <Globe className="w-4 h-4 text-blue-500" />
      case 'FAQ':
      default:
        return <HelpCircle className="w-4 h-4 text-[#7C5CFC]" />
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-full pb-12">
      <Header
        title="Conhecimento"
        subtitle="Bases de conhecimento disponíveis para seus agentes"
        breadcrumbs={[{ label: 'Início', href: '/' }, { label: 'Conhecimento' }]}
        onToggleSidebar={outletCtx?.toggleMobileMenu}
        action={
          <Button
            onClick={handleOpenCreate}
            className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl shadow-sm text-xs font-semibold gap-1.5 h-9"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar fonte</span>
          </Button>
        }
      />

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E5EC] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-[#1A1A24]">
                  Biblioteca Central de Conhecimento
                </h3>
                <Badge
                  variant="outline"
                  className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                >
                  Demonstração
                </Badge>
              </div>
              <p className="text-xs text-[#5F5F6B] mt-0.5">
                Consulte, edite, gerencie vínculos com agentes ou remova fontes demonstrativas do
                catálogo.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 shrink-0">
            {knowledgeBases.length} fontes cadastradas
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#E5E5EC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-[#FAF9FD] text-[#5F5F6B] font-semibold border-b border-[#E5E5EC]">
                <tr>
                  <th className="py-3.5 px-6">Nome da Base</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Atualizada</th>
                  <th className="py-3.5 px-4">Agentes Vinculados</th>
                  <th className="py-3.5 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5EC]">
                {knowledgeBases.map((base) => {
                  const linkedAgents = agents.filter((a) => base.linkedAgentIds.includes(a.id))

                  return (
                    <tr
                      key={base.id}
                      onClick={() => handleOpenDetail(base)}
                      className="hover:bg-[#FAF9FD] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#F1EEFE] transition-colors">
                            {getSourceIcon(base.type)}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-[#1A1A24] group-hover:text-[#7C5CFC] transition-colors">
                              {base.name}
                            </div>
                            <div className="text-[11px] text-[#9B9BAD]">
                              {base.size || 'Fonte indexada'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                          {base.type}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <StatusPill status={base.status} size="sm" />
                          {base.status === 'erro' && (
                            <span title={base.errorMessage} className="text-rose-500">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#5F5F6B]">{base.updatedAt}</td>

                      <td className="py-4 px-4">
                        {linkedAgents.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap max-w-xs">
                            {linkedAgents.map((ag) => (
                              <span
                                key={ag.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/20"
                              >
                                {ag.name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[11px] text-[#9B9BAD] italic">
                            Nenhum agente vinculado
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenDetail(base)
                            }}
                            className="h-8 px-2.5 text-[#5F5F6B] group-hover:text-[#7C5CFC] hover:bg-[#F1EEFE] rounded-lg text-xs gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver detalhes</span>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Opções da fonte ${base.name}`}
                                className="h-8 w-8 p-0 rounded-lg text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100 data-[state=open]:bg-slate-100"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-44 bg-white border border-[#E5E5EC] rounded-xl shadow-lg p-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuLabel className="text-[10px] font-semibold text-[#9B9BAD] px-2 py-1 uppercase tracking-wider">
                                Ações da fonte
                              </DropdownMenuLabel>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleOpenDetail(base)
                                }}
                                className="gap-2 cursor-pointer rounded-lg text-[#1A1A24] hover:bg-slate-100 focus:bg-slate-100 py-1.5 font-medium"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#7C5CFC]" />
                                <span>Ver detalhes</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={(e) => handleOpenEdit(base, e)}
                                className="gap-2 cursor-pointer rounded-lg text-[#1A1A24] hover:bg-slate-100 focus:bg-slate-100 py-1.5 font-medium"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Editar</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator className="bg-[#E5E5EC] my-1" />

                              <DropdownMenuItem
                                onClick={(e) => handleRequestDelete(base, e)}
                                className="gap-2 cursor-pointer rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-700 py-1.5 font-medium"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile & Small Screen Cards View */}
        <div className="md:hidden space-y-3">
          {knowledgeBases.map((base) => {
            const linkedAgents = agents.filter((a) => base.linkedAgentIds.includes(a.id))

            return (
              <Card
                key={base.id}
                onClick={() => handleOpenDetail(base)}
                className="p-4 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      {getSourceIcon(base.type)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-[#1A1A24] truncate">{base.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {base.type}
                        </span>
                        <span className="text-[10px] text-[#9B9BAD]">
                          {base.size || '1 documento'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <StatusPill status={base.status} size="sm" />

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Opções da fonte ${base.name}`}
                          className="h-8 w-8 p-0 rounded-lg text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-100 data-[state=open]:bg-slate-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-44 bg-white border border-[#E5E5EC] rounded-xl shadow-lg p-1 text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuLabel className="text-[10px] font-semibold text-[#9B9BAD] px-2 py-1 uppercase tracking-wider">
                          Ações da fonte
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDetail(base)
                          }}
                          className="gap-2 cursor-pointer rounded-lg text-[#1A1A24] hover:bg-slate-100 focus:bg-slate-100 py-1.5 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#7C5CFC]" />
                          <span>Ver detalhes</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => handleOpenEdit(base, e)}
                          className="gap-2 cursor-pointer rounded-lg text-[#1A1A24] hover:bg-slate-100 focus:bg-slate-100 py-1.5 font-medium"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Editar</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-[#E5E5EC] my-1" />

                        <DropdownMenuItem
                          onClick={(e) => handleRequestDelete(base, e)}
                          className="gap-2 cursor-pointer rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 focus:bg-rose-50 focus:text-rose-700 py-1.5 font-medium"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {base.description && (
                  <p className="text-xs text-[#5F5F6B] mt-2 line-clamp-2">{base.description}</p>
                )}

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#9B9BAD] flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#7C5CFC]" />
                    <span>
                      {linkedAgents.length === 0
                        ? 'Nenhum agente'
                        : `${linkedAgents.length} agente(s) vinculado(s)`}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#5F5F6B]">{base.updatedAt}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Modal de criação e edição de fonte de conhecimento */}
        <NovaFonteModal
          open={isNovaFonteModalOpen}
          onOpenChange={setIsNovaFonteModalOpen}
          knowledgeToEdit={editingBase}
        />

        {/* Side Panel (Drawer) for Knowledge Base Details */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md bg-white p-6 space-y-6 overflow-y-auto"
          >
            {selectedBase && (
              <>
                <SheetHeader className="text-left space-y-1 border-b border-[#E5E5EC] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedBase.type}
                    </span>
                    <div className="flex items-center gap-2">
                      <StatusPill status={selectedBase.status} size="sm" />
                      <Badge
                        variant="outline"
                        className="text-[10px] text-[#7C5CFC] border-[#7C5CFC]/30 bg-[#F1EEFE]"
                      >
                        Demonstração
                      </Badge>
                    </div>
                  </div>
                  <SheetTitle className="text-lg font-bold text-[#1A1A24] pt-2">
                    {selectedBase.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#5F5F6B]">
                    {selectedBase.description ||
                      'Base utilizada para contextualização e respostas dos agentes.'}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-5 text-xs">
                  {/* Status error message if any */}
                  {selectedBase.status === 'erro' && selectedBase.errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Detalhes do erro:</strong>
                        <p className="mt-0.5">{selectedBase.errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Metadata items */}
                  <div className="bg-[#F7F7FB] rounded-2xl p-4 space-y-2.5 border border-[#E5E5EC]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#5F5F6B] flex items-center gap-1.5">
                        <HardDrive className="w-3.5 h-3.5 text-[#7C5CFC]" /> Volume indexado:
                      </span>
                      <span className="font-semibold text-[#1A1A24]">{selectedBase.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#5F5F6B] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#7C5CFC]" /> Última atualização:
                      </span>
                      <span className="font-medium text-[#1A1A24]">{selectedBase.updatedAt}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#5F5F6B] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#7C5CFC]" /> Itens de fonte:
                      </span>
                      <span className="font-medium text-[#1A1A24]">
                        {selectedBase.sourcesCount || 1} documento(s)
                      </span>
                    </div>
                  </div>

                  {/* Detalhes de Conteúdo ou Referência Demonstrativa */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-[#1A1A24] flex items-center gap-1.5">
                      {getSourceIcon(selectedBase.type)}
                      <span>Conteúdo / Referência demonstrativa:</span>
                    </h4>

                    {selectedBase.type === 'PDF' && (
                      <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-rose-900 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-rose-600" />
                            {selectedBase.fileName ||
                              `${selectedBase.name.replace(/\s+/g, '_')}.pdf`}
                          </span>
                          <span className="text-[10px] text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                            {selectedBase.fileSize || selectedBase.size || 'PDF local'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F5F6B] pt-0.5">
                          Arquivo simulado vinculado à base; indexação mock sem leitura de OCR real.
                        </p>
                      </div>
                    )}

                    {selectedBase.type === 'Site' && (
                      <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-blue-900 flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5 text-blue-600" />
                            {selectedBase.siteUrl || 'https://suaempresa.com.br/ajuda'}
                          </span>
                          <span className="text-[10px] text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <ExternalLink className="w-3 h-3" /> Web
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5F5F6B] pt-0.5">
                          Sincronização web simulada de páginas de atendimento e perguntas
                          frequentes.
                        </p>
                      </div>
                    )}

                    {selectedBase.type === 'FAQ' && (
                      <div className="p-3 bg-[#F1EEFE]/40 border border-[#7C5CFC]/20 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#5232CD] flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5 text-[#7C5CFC]" />
                            {selectedBase.faqItems && selectedBase.faqItems.length > 0
                              ? `${selectedBase.faqItems.length} par(es) de pergunta e resposta`
                              : `${selectedBase.sourcesCount || 1} par(es) cadastrado(s)`}
                          </span>
                          <span className="text-[10px] text-[#7C5CFC] bg-[#F1EEFE] px-1.5 py-0.5 rounded font-medium">
                            FAQ estruturado
                          </span>
                        </div>

                        {selectedBase.faqItems && selectedBase.faqItems.length > 0 ? (
                          <div className="space-y-1.5 pt-1 max-h-36 overflow-y-auto pr-1">
                            {selectedBase.faqItems.map((faq, idx) => (
                              <div
                                key={faq.id || idx}
                                className="p-2 bg-white rounded-lg border border-[#E5E5EC] text-[11px]"
                              >
                                <strong className="text-[#1A1A24] block">P: {faq.pergunta}</strong>
                                <span className="text-[#5F5F6B] block mt-0.5">
                                  R: {faq.resposta}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-[#5F5F6B]">
                            Pares de perguntas e respostas demonstrativas configurados no
                            assistente.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Linked Agents Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-[#1A1A24] flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#7C5CFC]" />
                        <span>Agentes vinculados ({selectedBase.linkedAgentIds.length}):</span>
                      </h4>
                    </div>

                    {selectedBase.linkedAgentIds.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 border border-dashed border-[#E5E5EC] text-center">
                        <p className="text-xs text-[#9B9BAD]">
                          Nenhum agente vinculado a esta fonte atualmente.
                        </p>
                        <p className="text-[11px] text-[#5F5F6B] mt-1">
                          Você pode vincular esta base na Etapa 3 de configuração de qualquer
                          agente.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {agents
                          .filter((a) => selectedBase.linkedAgentIds.includes(a.id))
                          .map((agent) => (
                            <div
                              key={agent.id}
                              className="p-3 rounded-xl border border-[#E5E5EC] bg-white flex items-center justify-between gap-2 hover:border-[#7C5CFC]/40 transition-colors"
                            >
                              <div className="min-w-0">
                                <div className="font-semibold text-[#1A1A24] truncate">
                                  {agent.name}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-[#5F5F6B] bg-slate-100 px-1.5 py-0.5 rounded">
                                    {agent.channel}
                                  </span>
                                  <span className="text-[10px] text-[#9B9BAD]">
                                    {agent.purpose}
                                  </span>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => handleRequestUnlink(selectedBase, agent, e)}
                                title={`Desvincular do agente ${agent.name}`}
                                className="h-7 px-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-[11px] rounded-lg gap-1 shrink-0 font-medium"
                              >
                                <Unlink className="w-3.5 h-3.5" />
                                <span>Desvincular</span>
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Drawer Actions */}
                  <div className="pt-4 border-t border-[#E5E5EC] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={() => handleOpenEdit(selectedBase)}
                        className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs h-9 gap-1.5 font-semibold"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Editar fonte</span>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRequestDelete(selectedBase)}
                        className="rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs h-9 gap-1.5 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir fonte</span>
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setDrawerOpen(false)}
                      className="w-full rounded-xl border-[#E5E5EC] text-xs h-9 text-[#5F5F6B]"
                    >
                      Fechar detalhes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        {/* Diálogo de Confirmação: Exclusão de Fonte */}
        <AlertDialog
          open={Boolean(deletingBase)}
          onOpenChange={(open) => {
            if (!open) setDeletingBase(null)
          }}
        >
          <AlertDialogContent className="rounded-2xl border border-[#E5E5EC] bg-white max-w-md p-6">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-4 h-4" />
                </span>
                <AlertDialogTitle className="text-base font-bold text-[#1A1A24]">
                  Confirmar exclusão de fonte
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-xs text-[#5F5F6B] leading-relaxed pt-1">
                Tem certeza de que deseja excluir esta fonte de conhecimento demonstrativa?
              </AlertDialogDescription>
            </AlertDialogHeader>

            {deletingBase && (
              <div className="my-2 p-3.5 bg-[#FAF9FD] rounded-xl border border-[#E5E5EC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5F5F6B]">Fonte:</span>
                  <span className="font-semibold text-[#1A1A24]">{deletingBase.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5F5F6B]">Tipo:</span>
                  <span className="font-medium text-[#1A1A24]">{deletingBase.type}</span>
                </div>

                {/* Agentes vinculados */}
                <div className="pt-2 border-t border-[#E5E5EC]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#5F5F6B] font-medium">Agentes vinculados:</span>
                    <span className="font-semibold text-rose-600">
                      {deletingBase.linkedAgentIds.length}{' '}
                      {deletingBase.linkedAgentIds.length === 1 ? 'agente' : 'agentes'}
                    </span>
                  </div>

                  {deletingBase.linkedAgentIds.length > 0 ? (
                    <div className="space-y-1">
                      {agents
                        .filter((a) => deletingBase.linkedAgentIds.includes(a.id))
                        .map((ag) => (
                          <div
                            key={ag.id}
                            className="text-[11px] text-[#1A1A24] bg-white border border-[#E5E5EC] px-2.5 py-1 rounded-md flex items-center justify-between"
                          >
                            <span>{ag.name}</span>
                            <span className="text-[#9B9BAD] text-[10px]">{ag.channel}</span>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#9B9BAD] italic">
                      Nenhum agente vinculado a esta fonte.
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-[#E5E5EC]/60 text-[11px] text-[#9B9BAD] leading-relaxed">
                  Ao confirmar, a fonte será removida do catálogo e seus vínculos com os agentes
                  serão desfeitos. Os agentes não serão excluídos nem terão outras configurações
                  alteradas. Se cancelar, nada mudará.
                </div>
              </div>
            )}

            <AlertDialogFooter className="gap-2 sm:gap-2 mt-2">
              <AlertDialogCancel
                onClick={() => setDeletingBase(null)}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 text-[#5F5F6B] hover:text-[#1A1A24]"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold h-9 px-4 shadow-sm"
              >
                Sim, excluir fonte
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Diálogo de Confirmação: Remoção de Vínculo */}
        <AlertDialog
          open={Boolean(unlinkingTarget)}
          onOpenChange={(open) => {
            if (!open) setUnlinkingTarget(null)
          }}
        >
          <AlertDialogContent className="rounded-2xl border border-[#E5E5EC] bg-white max-w-md p-6">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Unlink className="w-4 h-4" />
                </span>
                <AlertDialogTitle className="text-base font-bold text-[#1A1A24]">
                  Confirmar remoção de vínculo
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-xs text-[#5F5F6B] leading-relaxed pt-1">
                Deseja remover o vínculo entre esta fonte de conhecimento e o agente selecionado?
              </AlertDialogDescription>
            </AlertDialogHeader>

            {unlinkingTarget && (
              <div className="my-2 p-3.5 bg-[#FAF9FD] rounded-xl border border-[#E5E5EC] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#5F5F6B]">Fonte de conhecimento:</span>
                  <span className="font-semibold text-[#1A1A24]">{unlinkingTarget.base.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#5F5F6B]">Agente a desvincular:</span>
                  <span className="font-semibold text-[#7C5CFC]">{unlinkingTarget.agent.name}</span>
                </div>
                <div className="pt-2 border-t border-[#E5E5EC]/60 text-[11px] text-[#9B9BAD] leading-relaxed">
                  A remoção do vínculo não exclui a fonte do catálogo e não altera as outras
                  configurações do agente. Se cancelar, o vínculo é preservado.
                </div>
              </div>
            )}

            <AlertDialogFooter className="gap-2 sm:gap-2 mt-2">
              <AlertDialogCancel
                onClick={() => setUnlinkingTarget(null)}
                className="rounded-xl border-[#E5E5EC] text-xs h-9 px-4 text-[#5F5F6B] hover:text-[#1A1A24]"
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmUnlink}
                className="rounded-xl bg-[#7C5CFC] hover:bg-[#6A48E8] text-white text-xs font-semibold h-9 px-4 shadow-sm"
              >
                Confirmar desvinculação
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
