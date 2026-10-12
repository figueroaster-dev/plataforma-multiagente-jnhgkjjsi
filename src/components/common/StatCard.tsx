import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  trend?: string
  trendPositive?: boolean
  icon: LucideIcon
  badge?: string
  variant?: 'default' | 'warning' | 'primary'
  description?: string
  className?: string
  prefix?: string
  suffix?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  trendPositive = true,
  icon: Icon,
  badge,
  variant = 'default',
  description,
  className,
  prefix = '',
  suffix = '',
}) => {
  const [displayValue, setDisplayValue] = useState(value)

  // Count-up animation on value change
  useEffect(() => {
    let start = displayValue
    const end = value
    if (start === end) return

    const duration = 400
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const current = Math.round(start + (end - start) * progress)
      setDisplayValue(current)
      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [value])

  const iconBg =
    variant === 'warning'
      ? 'bg-amber-50 text-amber-600 border border-amber-200'
      : variant === 'primary'
        ? 'bg-[#F1EEFE] text-[#7C5CFC] border border-[#7C5CFC]/20'
        : 'bg-slate-100 text-slate-700'

  return (
    <Card
      className={cn(
        'p-5 bg-white border border-[#E5E5EC] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group',
        variant === 'warning' && 'border-amber-200 bg-amber-50/20',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#5F5F6B] uppercase tracking-wider">{label}</span>
        <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-105', iconBg)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-[#1A1A24] tracking-tight">
          {prefix}
          {displayValue.toLocaleString('pt-BR')}
          {suffix}
        </span>
        {badge && (
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs">
        {trend && (
          <span
            className={cn(
              'font-medium inline-flex items-center gap-1',
              trendPositive ? 'text-emerald-600' : 'text-slate-500',
            )}
          >
            {trend}
          </span>
        )}
        {description && <span className="text-[#9B9BAD] text-[11px]">{description}</span>}
      </div>
    </Card>
  )
}
