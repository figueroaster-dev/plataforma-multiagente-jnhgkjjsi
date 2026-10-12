import React from 'react'
import { Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface HeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: { label: string; href?: string }[]
  action?: React.ReactNode
  onToggleSidebar?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  action,
  onToggleSidebar,
}) => {
  const { toast } = useToast()

  const handleNotificationClick = () => {
    toast({
      title: 'Notificações do sistema',
      description: '3 novas conversas aguardando atendimento humano no momento.',
    })
  }

  return (
    <header className="sticky top-0 z-20 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E5EC] px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Breadcrumb + Title */}
        <div className="flex items-center gap-3 min-w-0">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl border border-[#E5E5EC] text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-50 transition-colors"
              aria-label="Abrir menu lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="min-w-0">
            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav
                aria-label="Navegação breadcrumb"
                className="flex items-center gap-1.5 text-xs text-[#9B9BAD] mb-0.5"
              >
                {breadcrumbs.map((bc, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && <span>/</span>}
                    {bc.href ? (
                      <a
                        href={bc.href}
                        className="hover:text-[#7C5CFC] transition-colors truncate max-w-[140px]"
                      >
                        {bc.label}
                      </a>
                    ) : (
                      <span className="text-[#5F5F6B] font-medium truncate max-w-[140px]">
                        {bc.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}

            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A24] tracking-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <span className="hidden md:inline-block text-xs text-[#5F5F6B] border-l border-[#E5E5EC] pl-3 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions + Notification Bell */}
        <div className="flex items-center gap-2.5 shrink-0">
          {action}

          <Button
            variant="outline"
            size="icon"
            onClick={handleNotificationClick}
            className="relative rounded-xl border-[#E5E5EC] text-[#5F5F6B] hover:text-[#1A1A24] hover:bg-slate-50 h-9 w-9"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#7C5CFC] ring-2 ring-white" />
          </Button>
        </div>
      </div>
    </header>
  )
}
