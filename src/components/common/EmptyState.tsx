import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#E5E5EC] bg-white/70 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F1EEFE] flex items-center justify-center text-[#7C5CFC] mb-4 shadow-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-[#1A1A24] mb-1">{title}</h3>
      <p className="text-sm text-[#5F5F6B] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="border-[#E5E5EC] text-[#1A1A24] hover:bg-[#F1EEFE] hover:text-[#7C5CFC] hover:border-[#7C5CFC]/30 rounded-xl"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
