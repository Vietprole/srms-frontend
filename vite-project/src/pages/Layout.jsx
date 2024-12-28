import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import PropTypes from 'prop-types';
import Header from "@/components/Header";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-1">
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node
};
