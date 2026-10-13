import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  Radio,
  MessageSquare,
  Plug,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  User,
  ShieldCheck,
  Check,
  UserCheck,
} from 'lucide-react'
import { APP_CONFIG, DEFAULT_USER } from '@/constants/app'
import { useApp } from '@/context/AppContext'
import { WorkspaceId } from '@/types/domain'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface SidebarProps {
  onNavigateMobile?: () => void
}

const navItems = [
  { to: '/', label: 'Visão geral', icon: LayoutDashboard },
  { to: '/agentes', label: 'Agentes', icon: Bot },
  { to: '/conhecimento', label: 'Conhecimento', icon: BookOpen },
  { to: '/canais', label: 'Canais', icon: Radio },
  { to: '/conversas', label: 'Conversas', icon: MessageSquare },
  { to: '/leads', label: 'Leads', icon: UserCheck },
  { to: '/integracoes', label: 'Integrações', icon: Plug },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export const Sidebar: React.FC<SidebarProps> = ({ onNavigateMobile }) => {
  const { workspaces, currentWorkspace, switchWorkspace } = useApp()
  const { toast } = useToast()

  const handleProfileClick = (action: string) => {
    toast({
      title: action,
      description: 'Ação em ambiente de demonstração local.',
    })
  }

  return (
    <aside className="w-full h-full bg-[#17171F] text-[#F4F4F8] flex flex-col justify-between select-none">
      {/* Top Header: Workspace Switcher + Brand */}
      <div className="p-4 border-b border-[#242432]">
        {/* Workspace Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#20202C] hover:bg-[#282837] border border-[#2E2E3E] transition-all text-left group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: currentWorkspace.color }}
                >
                  {currentWorkspace.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#F4F4F8] truncate leading-tight">
                    {currentWorkspace.name}
                  </div>
                  <div className="text-[10px] text-[#9B9BAD] truncate leading-tight">
                    Plano {currentWorkspace.plan}
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#9B9BAD] group-hover:text-[#F4F4F8] shrink-0 transition-transform" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-60 bg-[#1D1D28] border border-[#2E2E3E] text-[#F4F4F8] p-1.5 shadow-2xl rounded-xl"
          >
            <DropdownMenuLabel className="text-[11px] font-medium text-[#9B9BAD] px-2 py-1.5">
              Alternar Espaço de Trabalho
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2B2B3D]" />
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                onClick={() => switchWorkspace(ws.id as WorkspaceId)}
                className="flex items-center justify-between px-2.5 py-2 rounded-lg cursor-pointer hover:bg-[#282838] focus:bg-[#282838] focus:text-[#F4F4F8] text-xs transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: ws.color }}
                  >
                    {ws.initials}
                  </span>
                  <div className="truncate">
                    <p className="font-medium text-white truncate">{ws.name}</p>
                    <p className="text-[10px] text-[#9B9BAD]">{ws.plan}</p>
                  </div>
                </div>
                {ws.id === currentWorkspace.id && <Check className="w-3.5 h-3.5 text-[#7C5CFC]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Brand Name Text (Cérebro Agents by Cérebro Digital) */}
        <div className="mt-4 px-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white">
              {APP_CONFIG.productName}
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#7C5CFC]/20 text-[#A892FC] border border-[#7C5CFC]/30">
              SaaS
            </span>
          </div>
          <p className="text-[11px] text-[#9B9BAD] mt-0.5 font-medium">by {APP_CONFIG.brandName}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold text-[#9B9BAD] uppercase tracking-wider">
          Menu Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigateMobile}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative',
                  isActive
                    ? 'bg-[#7C5CFC]/15 text-white font-semibold'
                    : 'text-[#9B9BAD] hover:text-[#F4F4F8] hover:bg-[#20202C]',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#7C5CFC] rounded-r-full" />
                  )}
                  <Icon
                    className={cn(
                      'w-4 h-4 shrink-0 transition-colors',
                      isActive ? 'text-[#7C5CFC]' : 'text-[#9B9BAD] group-hover:text-[#F4F4F8]',
                    )}
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          )
        })}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#242432] bg-[#14141B]">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[#20202C] transition-colors group text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="w-8 h-8 rounded-lg border border-[#2E2E3E]">
                  <AvatarFallback className="bg-[#7C5CFC] text-white text-xs font-semibold">
                    {DEFAULT_USER.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-[#F4F4F8] truncate">
                    {DEFAULT_USER.name}
                  </div>
                  <div className="text-[10px] text-[#9B9BAD] truncate">{DEFAULT_USER.email}</div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#9B9BAD] group-hover:text-[#F4F4F8] shrink-0" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="top"
            className="w-56 bg-[#1D1D28] border border-[#2E2E3E] text-[#F4F4F8] p-1.5 shadow-2xl rounded-xl mb-2"
          >
            <DropdownMenuLabel className="text-xs px-2 py-1 font-medium text-[#9B9BAD]">
              Minha Conta
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#2B2B3D]" />
            <DropdownMenuItem
              onClick={() => handleProfileClick('Meu perfil')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs hover:bg-[#282838] focus:bg-[#282838] focus:text-white"
            >
              <User className="w-3.5 h-3.5 text-[#9B9BAD]" />
              <span>Meu perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleProfileClick('Permissões')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs hover:bg-[#282838] focus:bg-[#282838] focus:text-white"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#9B9BAD]" />
              <span>Função: {DEFAULT_USER.role}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#2B2B3D]" />
            <DropdownMenuItem
              onClick={() => handleProfileClick('Sair (demonstração)')}
              className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer text-xs text-rose-400 hover:bg-rose-950/40 focus:bg-rose-950/40 focus:text-rose-300"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair do sistema</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
