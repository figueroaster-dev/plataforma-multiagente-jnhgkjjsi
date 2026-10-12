import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  title: string
  subtitle?: string
}

interface StepperProps {
  steps: StepItem[]
  currentStep: number
  onSelectStep: (stepId: number) => void
  completedSteps?: number[]
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onSelectStep,
  completedSteps = [],
}) => {
  const progressPercent = ((currentStep - 1) / Math.max(steps.length - 1, 1)) * 100

  return (
    <div className="w-full bg-white border border-[#E5E5EC] rounded-2xl p-4 sm:p-5 shadow-sm">
      {/* Barra de progresso animada */}
      <div className="relative mb-5">
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#7C5CFC] transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Grid de etapas com suporte a scroll horizontal em mobile */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
        {steps.map((step) => {
          const isActive = step.id === currentStep
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep
          const canClick = isCompleted || step.id <= currentStep

          return (
            <button
              key={step.id}
              type="button"
              disabled={!canClick}
              onClick={() => canClick && onSelectStep(step.id)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all shrink-0',
                isActive && 'bg-[#F1EEFE] ring-1 ring-[#7C5CFC]/30 text-[#1A1A24]',
                !isActive && canClick && 'hover:bg-slate-50 cursor-pointer text-[#5F5F6B]',
                !canClick && 'opacity-50 cursor-not-allowed text-[#9B9BAD]',
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 transition-colors',
                  isActive && 'bg-[#7C5CFC] text-white shadow-sm',
                  isCompleted && !isActive && 'bg-emerald-100 text-emerald-700',
                  !isCompleted && !isActive && 'bg-slate-100 text-slate-500',
                )}
              >
                {isCompleted && !isActive ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.id}
              </div>

              <div className="hidden md:flex flex-col">
                <span
                  className={cn(
                    'text-xs font-medium leading-none',
                    isActive ? 'text-[#7C5CFC] font-semibold' : 'text-[#1A1A24]',
                  )}
                >
                  {step.title}
                </span>
                {step.subtitle && (
                  <span className="text-[10px] text-[#9B9BAD] mt-0.5 leading-none">
                    {step.subtitle}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
