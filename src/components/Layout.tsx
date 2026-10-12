import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen w-full bg-[#F7F7FB] overflow-hidden">
      {/* Desktop Persistent Sidebar (>= 1024px: 260px; tablet 768-1023px: 240px) */}
      <div className="hidden lg:block w-[260px] shrink-0 h-full">
        <Sidebar />
      </div>

      {/* Mobile Drawer (Sheet below 1024px) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-[280px] bg-[#17171F] border-r border-[#242432]">
          <Sidebar onNavigateMobile={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* We pass a helper via context or custom event, but React Router outlet renders pages */}
        <Outlet context={{ toggleMobileMenu: () => setMobileOpen(true) }} />
      </div>
    </div>
  )
}
