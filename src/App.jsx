import './App.css'
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"

export default function App() {
  return (
    <SidebarProvider defaultOpen={true} collapsible>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1">
          {/* Your main content */}
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
