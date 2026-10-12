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
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { StatusPill } from '@/components/common/StatusPill'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useApp } from '@/context/AppContext'
import { KnowledgeBase } from '@/types/domain'
import { NovaFonteModal } from '@/components/knowledge/NovaFonteModal'

export default function Conhecimento() {
  const { knowledgeBases, agents } = useApp()
  const outletCtx = useOutletContext<{ toggleMobileMenu?: () => void }>()

  const [selectedBase, setSelectedBase] = useState<KnowledgeBase | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isNovaFonteModalOpen, setIsNovaFonteModalOpen] = useState(false)

  const handleOpenDetail = (base: KnowledgeBase) => {
    setSelectedBase(base)
    setDrawerOpen(true)
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
            onClick={() => setIsNovaFonteModalOpen(true)}
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
              <h3 className="text-sm font-semibold text-[#1A1A24]">
                Biblioteca Central de Conhecimento
              </h3>
              <p className="text-xs text-[#5F5F6B]">
                Uma mesma base pode ser compartilhada por múltiplos agentes simultaneamente.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {knowledgeBases.length} fontes cadastradas
          </span>
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-2xl border border-[#E5E5EC] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9FD] text-[#5F5F6B] font-semibold border-b border-[#E5E5EC]">
                <tr>
                  <th className="py-3.5 px-6">Nome da Base</th>
                  <th className="py-3.5 px-4">Tipo</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Atualizada</th>
                  <th className="py-3.5 px-4">Agentes Vinculados</th>
                  <th className="py-3.5 px-6 text-right">Ação</th>
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
                          <div className="flex items-center gap-1.5 flex-wrap">
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
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de criação de nova fonte de conhecimento */}
        <NovaFonteModal open={isNovaFonteModalOpen} onOpenChange={setIsNovaFonteModalOpen} />

        {/* Side Panel (Drawer) for Knowledge Base Details */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md bg-white p-6 space-y-6">
            {selectedBase && (
              <>
                <SheetHeader className="text-left space-y-1 border-b border-[#E5E5EC] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {selectedBase.type}
                    </span>
                    <StatusPill status={selectedBase.status} size="sm" />
                  </div>
                  <SheetTitle className="text-lg font-bold text-[#1A1A24] pt-2">
                    {selectedBase.name}
                  </SheetTitle>
                  <SheetDescription className="text-xs text-[#5F5F6B]">
                    {selectedBase.description ||
                      'Base utilizada para contextualização dos agentes.'}
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4 text-xs">
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
                        <HardDrive className="w-3.5 h-3.5" /> Volume indexado:
                      </span>
                      <span className="font-semibold text-[#1A1A24]">{selectedBase.size}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#5F5F6B] flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> Última sincronização:
                      </span>
                      <span className="font-medium text-[#1A1A24]">{selectedBase.updatedAt}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#5F5F6B] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> Itens de fonte:
                      </span>
                      <span className="font-medium text-[#1A1A24]">
                        {selectedBase.sourcesCount || 1} documento(s)
                      </span>
                    </div>
                  </div>

                  {/* Linked Agents Section */}
                  <div>
                    <h4 className="font-semibold text-[#1A1A24] mb-2 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-[#7C5CFC]" />
                      Agentes que utilizam esta base:
                    </h4>

                    {selectedBase.linkedAgentIds.length === 0 ? (
                      <p className="text-xs text-[#9B9BAD]">
                        Nenhum agente vinculado a esta base atualmente.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {agents
                          .filter((a) => selectedBase.linkedAgentIds.includes(a.id))
                          .map((agent) => (
                            <div
                              key={agent.id}
                              className="p-2.5 rounded-xl border border-[#E5E5EC] bg-white flex items-center justify-between"
                            >
                              <span className="font-medium text-[#1A1A24]">{agent.name}</span>
                              <span className="text-[10px] text-[#5F5F6B] bg-slate-100 px-2 py-0.5 rounded">
                                {agent.channel}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-[#E5E5EC]">
                    <Button
                      variant="outline"
                      onClick={() => setDrawerOpen(false)}
                      className="w-full rounded-xl border-[#E5E5EC] text-xs h-9"
                    >
                      Fechar detalhes
                    </Button>
                  </div>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>
      </main>
    </div>
  )
}
