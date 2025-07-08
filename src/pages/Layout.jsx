import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import PropTypes from 'prop-types';
import Header from "@/components/Header";
import Box from "@mui/material/Box";
export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-1 overflow-hidden">
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            {children}
          </Box>
        </Box>
      </SidebarInset>

    </SidebarProvider>
  )
}

Layout.propTypes = {
  children: PropTypes.node
};
