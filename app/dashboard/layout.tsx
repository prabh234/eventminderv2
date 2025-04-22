import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThemeSwitcher } from '../../components/assets/my-theme';
import { AppSidebar } from "@/components/app-sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <SidebarProvider className=" dark:bg-sky-950 bg-blue-200">
      <AppSidebar />
      <SidebarInset className="my-background-image">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="my-background- flex items-center gap-2 px-4">
            <SidebarTrigger className="dark:hover:bg-gray-700 hover:bg-slate-100/55 p-5 rounded-full" />
            <ThemeSwitcher/>
          </div>
        </header>
            {children}
        </SidebarInset>
    </SidebarProvider>
  
    );
}
