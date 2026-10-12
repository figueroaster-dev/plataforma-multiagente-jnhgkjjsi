import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Bot, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound = () => {
  const location = useLocation()

  useEffect(() => {
    console.error('404 Error: Usuário tentou acessar rota inexistente:', location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF9FD] px-4">
      <div className="text-center max-w-md p-8 bg-white rounded-2xl border border-[#E5E5EC] shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#F1EEFE] text-[#7C5CFC] flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold text-[#1A1A24] mb-2">404</h1>
        <h2 className="text-base font-semibold text-[#1A1A24] mb-2">Página não encontrada</h2>
        <p className="text-xs text-[#5F5F6B] mb-6">
          A rota solicitada não existe ou foi movida no protótipo.
        </p>
        <Button asChild className="bg-[#7C5CFC] hover:bg-[#6A48E8] text-white rounded-xl text-xs">
          <Link to="/" className="inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Voltar para o Início</span>
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default NotFound
