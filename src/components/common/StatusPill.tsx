import React from 'react'
import { cn } from '@/lib/utils'

export type StatusType =
  | 'ativo'
  | 'rascunho'
  | 'pausado'
  | 'pronto'
  | 'processando'
  | 'erro'
  | 'aberta'
  | 'aguardando'
  | 'resolvida'
  | 'nao_conectado'
  | 'configuracao_futura'
  | 'conectado_demonstracao'
  | 'atencao_conexao'

interface StatusPillProps {
  status: StatusType
  label?: string
  className?: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  ativo: {
    label: 'Ativo',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  pronto: {
    label: 'Pronto',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  resolvida: {
    label: 'Resolvida',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  rascunho: {
    label: 'Rascunho',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
  },
  pausado: {
    label: 'Pausado',
    bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
  },
  aguardando: {
    label: 'Aguardando humano',
    bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    text: 'text-amber-800',
    dot: 'bg-amber-500 animate-pulse',
  },
  processando: {
    label: 'Processando',
    bg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    text: 'text-blue-700',
    dot: 'bg-blue-500 animate-pulse',
  },
  erro: {
    label: 'Erro',
    bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
    text: 'text-rose-700',
    dot: 'bg-rose-500',
  },
  aberta: {
    label: 'Em andamento',
    bg: 'bg-violet-50 text-violet-700 border-violet-200/60',
    text: 'text-violet-700',
    dot: 'bg-violet-500',
  },
  nao_conectado: {
    label: 'Não conectado',
    bg: 'bg-slate-100 text-slate-600 border-slate-200',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
  },
  configuracao_futura: {
    label: 'Configuração futura',
    bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    text: 'text-purple-700',
    dot: 'bg-purple-400',
  },
  conectado_demonstracao: {
    label: 'Conectado — demonstração',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
  },
  atencao_conexao: {
    label: 'Atenção à conexão',
    bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    text: 'text-amber-800',
    dot: 'bg-amber-500 animate-pulse',
  },
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  label,
  className,
  size = 'md',
}) => {
  const conf = statusConfig[status] || statusConfig.rascunho
  const displayLabel = label || conf.label

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full border transition-colors',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        conf.bg,
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', conf.dot)} />
      <span>{displayLabel}</span>
    </span>
  )
}
