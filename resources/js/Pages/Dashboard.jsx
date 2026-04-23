import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent } from "@/Components/ui/card"
import { DollarSign, Users, BedDouble, CalendarCheck, Package } from "lucide-react"
import { Badge } from "@/Components/ui/badge";
import { usePage, router } from '@inertiajs/react';
import HotelStats from '@/Components/Hotel/HotelStats';
import OccupancyIndicator from '@/Components/Hotel/OccupancyIndicator';
import CheckInOutWidget from '@/Components/Hotel/CheckInOutWidget';
import RoomStatusCard from '@/Components/Hotel/RoomStatusCard';

const getStatusBadgeColor = (status) => {
    const statusMap = {
        'confirmed': { label: 'Confirmada', className: 'bg-green-600' },
        'pending': { label: 'Pendente', className: 'bg-yellow-500' },
        'completed': { label: 'Concluída', className: 'bg-blue-600' },
        'cancelled': { label: 'Cancelada', className: 'bg-red-600' },
        'checked_in': { label: 'Hospedado', className: 'bg-green-600' },
        'no_show': { label: 'No Show', className: 'bg-gray-600' },
        'confirmado': { label: 'Confirmada', className: 'bg-green-600' },
        'pendente': { label: 'Pendente', className: 'bg-yellow-500' },
        'completado': { label: 'Concluída', className: 'bg-blue-600' },
        'cancelado': { label: 'Cancelada', className: 'bg-red-600' }
    };

    const status_lower = String(status).toLowerCase();
    return statusMap[status_lower] || { label: status, className: 'bg-gray-500' };
};

export default function Dashboard({ stats, topProducts, recentReservations, rooms }) {

    const { auth } = usePage().props;
    const { user } = auth;
    const isAdmin = user.role === 'admin';
    const isSuperAdmin = user.role === 'super_admin';
    
    // Redirecionar Super Admin para painel próprio
    useEffect(() => {
        if (user?.role === 'super_admin') {
            router.visit(route('superadmin.dashboard'));
        }
    }, [user]);
    
    // Se for Super Admin, mostrar loading enquanto redireciona
    if (isSuperAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Redirecionando para o painel Super Admin...</p>
                </div>
            </div>
        );
    }

    const hotelStats = {
        todayGuests: stats?.checkinsToday || 0,
        occupancyRate: stats?.occupancyRate || 0,
        dailyRevenue: isAdmin ? (stats?.revenueToday || 0) : null,
        satisfaction: 4.2,
        guestsChange: 12.5,
        occupancyChange: 5.2,
        revenueChange: isAdmin ? 8.7 : null,
        satisfactionChange: 0.3
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <div className="space-y-6">
                {/* Estatísticas Principais */}
                <HotelStats stats={hotelStats} />

                {/* Indicadores de Ocupação */}
                <OccupancyIndicator 
                    occupancy={stats?.occupiedRooms || 0}
                    totalRooms={stats?.totalRooms || 50}
                    revenue={isAdmin ? (stats?.revenueToday || 0) : null}
                />

                {/* Widgets de Check-in/Check-out */}
                <CheckInOutWidget 
                    pendingReservations={recentReservations?.filter(r => r.status === 'confirmed')}
                    activeReservations={recentReservations?.filter(r => r.status === 'checked_in')}
                />

                {/* Grid de Quartos e Reservas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Status dos Quartos */}
                    <div className="lg:col-span-2">
                        <div className="hotel-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Status dos Quartos</h3>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-success rounded-full"></div>
                                        <span className="text-muted-foreground">Disponível</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-destructive rounded-full"></div>
                                        <span className="text-muted-foreground">Ocupado</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-warning rounded-full"></div>
                                        <span className="text-muted-foreground">Manutenção</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {rooms?.slice(0, 8).map((room) => (
                                    <RoomStatusCard 
                                        key={room.id}
                                        room={{
                                            ...room,
                                            status: room.occupied ? 'occupied' : 'available',
                                            number: room.number || room.name,
                                            type: room.type || 'Standard',
                                            beds: room.beds || 2,
                                            capacity: room.capacity || 2,
                                            price: room.price || 150.00,
                                            guest: room.current_guest
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Últimas Reservas */}
                    <div className="lg:col-span-1">
                        <div className="hotel-card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-foreground">Últimas Reservas</h3>
                                <span className="text-xs text-muted-foreground">Hoje</span>
                            </div>
                            
                            <div className="space-y-3">
                                {recentReservations?.slice(0, 5).map((reservation) => (
                                    <div key={reservation.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-foreground text-sm">
                                                {reservation.guest?.name || 'Cliente'}
                                            </span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                reservation.status === 'confirmed' ? 'hotel-status-available' :
                                                reservation.status === 'checked_in' ? 'hotel-status-occupied' :
                                                'hotel-status-maintenance'
                                            }`}>
                                                {reservation.status === 'confirmed' ? 'Confirmada' :
                                                 reservation.status === 'checked_in' ? 'Hospedado' :
                                                 'Pendente'}
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Quarto {reservation.room?.number || '-'} • R$ {parseFloat(reservation.total_price || 0).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                                
                                {(!recentReservations || recentReservations.length === 0) && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <CalendarCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Nenhuma reserva hoje</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Produtos Mais Vendidos */}
                {isAdmin && (
                    <div className="hotel-card p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-foreground">Produtos Mais Vendidos</h3>
                            <span className="text-xs text-muted-foreground">Este mês</span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {topProducts?.slice(0, 8).map((item, index) => (
                                <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center font-bold text-xs text-primary">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-foreground text-sm">{item.product?.name || 'Item'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">{item.total_qty} unidades</span>
                                        <span className="text-sm font-semibold text-foreground">R$ {parseFloat(item.total_revenue || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                            </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}

