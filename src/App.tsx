/* Main App Component - Handles routing (using react-router-dom) with Cérebro Agents prototype pages */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppProvider } from '@/context/AppContext'
import Layout from './components/Layout'

// Pages
import Index from './pages/Index'
import Agentes from './pages/Agentes'
import NovoAgente from './pages/NovoAgente'

import Conhecimento from './pages/Conhecimento'
import Conversas from './pages/Conversas'
import Leads from './pages/Leads'
import Canais from './pages/Canais'
import Integracoes from './pages/Integracoes'
import Relatorios from './pages/Relatorios'
import Configuracoes from './pages/Configuracoes'

const App = () => (
  <BrowserRouter>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/agentes" element={<Agentes />} />
            <Route path="/agentes/novo" element={<NovoAgente />} />
            <Route path="/agentes/:id/configuracao" element={<NovoAgente />} />
            <Route path="/conhecimento" element={<Conhecimento />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/canais" element={<Canais />} />
            <Route path="/integracoes" element={<Integracoes />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          {/* Unknown routes redirect to / as per specification */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </TooltipProvider>
    </AppProvider>
  </BrowserRouter>
)

export default App
