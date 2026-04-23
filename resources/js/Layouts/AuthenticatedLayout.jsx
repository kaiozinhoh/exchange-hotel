import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    BedDouble,
    Package,
    DollarSign,
    Settings,
    LogOut,
    Menu,
    X,
    UserCircle,
    Building,
    Shield,
    TrendingUp,
    Hotel,
    UserCheck,
    Globe
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash, app_settings } = usePage().props;
    const user = auth.user;
    const isSuperAdmin = user.role === 'super_admin';
    const isHotelAdmin = user.role === 'hotel_admin';
    const isReceptionist = user.role === 'receptionist';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    
    // --- LÓGICA DE NOTIFICAÇÃO ---
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
        if (flash?.message) toast(flash.message);
    }, [flash]);

    // Componente de Link do Menu Lateral
    const SidebarLink = ({ href, active, icon: Icon, children }) => (
        <Link
            href={href}
            className={`hotel-sidebar-link ${active ? 'hotel-sidebar-link-active' : ''}`}
        >
            <Icon className="w-5 h-5 mr-3" />
            {children}
        </Link>
    );

    return (
        <div className="flex h-screen bg-background">

            {/* --- SIDEBAR (Desktop: Fixa / Mobile: Drawer) --- */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 hotel-sidebar shadow-hotel transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Logo Area */}
                <div className="flex items-center justify-center h-20 border-b border-sidebar-border bg-sidebar">
                    <Link href="/" className="flex flex-col items-center justify-center">
                        {app_settings?.logo_url ? (
                            <>
                                <img src={app_settings.logo_url} alt="Logo" className="h-10 w-auto rounded-lg" />
                                <div className="mt-1 text-xs font-semibold text-sidebar-foreground text-center">
                                    {isSuperAdmin ? 'Exchange Hotel Manager' : (app_settings?.hotel_name || 'Gestão de Hotel')}
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                    {isSuperAdmin ? (
                                        <Shield className="w-6 h-6 text-primary-foreground" />
                                    ) : (
                                        <Hotel className="w-6 h-6 text-primary-foreground" />
                                    )}
                                </div>
                                <div className="mt-1 text-xs font-semibold text-sidebar-foreground text-center">
                                    {isSuperAdmin ? 'Exchange Hotel Manager' : (app_settings?.hotel_name || 'Gestão de Hotel')}
                                </div>
                                <div className="text-[11px] text-sidebar-foreground/70 text-center">
                                    {isSuperAdmin ? 'Painel Super Admin' : 'Sistema de Gestão'}
                                </div>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Menu Itens */}
                <nav className="mt-6 px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
                    
                    {/* MENU SUPER ADMIN */}
                    {isSuperAdmin && (
                        <>
                            <div className="px-3 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                Painel SaaS
                            </div>
                            
                            <SidebarLink href={route('superadmin.dashboard')} active={route().current('superadmin.dashboard')} icon={LayoutDashboard}>
                                Dashboard SaaS
                            </SidebarLink>
                            <SidebarLink href={route('superadmin.hotels')} active={route().current('superadmin.hotels') || route().current('superadmin.hotels.*')} icon={Building}>
                                Hotéis
                            </SidebarLink>
                            <SidebarLink href={route('superadmin.users')} active={route().current('superadmin.users') || route().current('superadmin.users.*')} icon={UserCheck}>
                                Usuários
                            </SidebarLink>
                            <SidebarLink href={route('superadmin.analytics')} active={route().current('superadmin.analytics')} icon={TrendingUp}>
                                Analytics
                            </SidebarLink>

                            <div className="px-3 mt-6 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                Configurações
                            </div>
                            <SidebarLink href={route('superadmin.settings.index')} active={route().current('superadmin.settings.*')} icon={Settings}>
                                Configurações SaaS
                            </SidebarLink>
                        </>
                    )}

                    {/* MENU HOTEL ADMIN E RECEPCIONISTA */}
                    {!isSuperAdmin && (
                        <>
                            <div className="px-3 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                Operacional
                            </div>

                            <SidebarLink href={route('dashboard')} active={route().current('dashboard')} icon={LayoutDashboard}>
                                Dashboard
                            </SidebarLink>
                            <SidebarLink href={route('reservations.index')} active={route().current('reservations.*')} icon={CalendarDays}>
                                Reservas
                            </SidebarLink>
                            <SidebarLink href={route('calendar.index')} active={route().current('calendar.*')} icon={CalendarDays}>
                                Mapa / Calendário
                            </SidebarLink>
                            <SidebarLink href={route('guests.index')} active={route().current('guests.*')} icon={Users}>
                                Hóspedes
                            </SidebarLink>
                            <SidebarLink href={route('rooms.index')} active={route().current('rooms.*')} icon={BedDouble}>
                                Quartos
                            </SidebarLink>
                            <SidebarLink href={route('products.index')} active={route().current('products.*')} icon={Package}>
                                Produtos
                            </SidebarLink>

                            {/* Apenas para Hotel Admin */}
                            {isHotelAdmin && (
                                <>
                                    <div className="px-3 mt-6 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                        Canais de Venda
                                    </div>
                                    <SidebarLink href={route('channels.index')} active={route().current('channels.*')} icon={Globe}>
                                        Channel Manager
                                    </SidebarLink>
                                </>
                            )}

                            {/* Apenas para Hotel Admin */}
                            {isHotelAdmin && (
                                <>
                                    <div className="px-3 mt-6 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                        Financeiro
                                    </div>
                                    <SidebarLink href={route('financial.index')} active={route().current('financial.*')} icon={DollarSign}>
                                        Financeiro
                                    </SidebarLink>
                                </>
                            )}

                            {/* Apenas para Hotel Admin */}
                            {isHotelAdmin && (
                                <>
                                    <div className="px-3 mt-6 mb-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
                                        Configurações
                                    </div>
                                    <SidebarLink href={route('settings.edit')} active={route().current('settings.*')} icon={Settings}>
                                        Configurações
                                    </SidebarLink>
                                </>
                            )}
                        </>
                    )}
                </nav>
            </aside>

            {/* --- CONTEÚDO PRINCIPAL --- */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top Header (Navbar Superior Premium) */}
                <header className="hotel-header">
                    <div className="flex items-center justify-between h-16 px-6">

                        {/* Botão Hamburger (Mobile) */}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 text-muted-foreground rounded-lg lg:hidden hover:bg-muted transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Título da Página com Breadcrumb */}
                        <div className="flex-1 px-4">
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <span className="hover:text-foreground transition-colors cursor-pointer">Exchange Hoteis</span>
                                <span>/</span>
                                <span className="text-foreground font-medium">{header}</span>
                            </div>
                        </div>

                        {/* User Dropdown */}
                        <div className="flex items-center space-x-4">
                            {/* Status Indicator */}
                            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-success/10 text-success rounded-lg border border-success/20">
                                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                                <span className="text-xs font-medium">Online</span>
                            </div>

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring rounded-lg p-2 hover:bg-muted">
                                        <div className="text-right hidden md:block">
                                            <div className="text-sm font-semibold text-foreground">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {isSuperAdmin ? 'Super Admin' : isHotelAdmin ? 'Administrador' : 'Recepcionista'}
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                            <UserCircle className="w-5 h-5 text-primary" />
                                        </div>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content align="end">
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center space-x-2">
                                        <UserCircle className="w-4 h-4" />
                                        <span>Meu Perfil</span>
                                    </Dropdown.Link>
                                    
                                    {/* Logout Button Corrigido */}
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        preserveScroll
                                        onClick={(e) => {
                                            if (!confirm('Tem certeza que deseja sair?')) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className="flex items-center space-x-2 text-destructive w-full text-left px-2 py-2 hover:bg-gray-100 rounded"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sair</span>
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                {/* Área de Scroll do Conteúdo */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay para Mobile (fecha sidebar ao clicar fora) */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                ></div>
            )}

            <Toaster richColors position="top-right" />
        </div>
    );
}
