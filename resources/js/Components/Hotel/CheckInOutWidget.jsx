import React, { useState } from 'react';
import { UserPlus, UserMinus, Calendar, Clock, Search, Link } from 'lucide-react';
import { router } from '@inertiajs/react';

const CheckInOutWidget = ({ pendingReservations, activeReservations }) => {
    const [checkInSearch, setCheckInSearch] = useState('');
    const [checkOutSearch, setCheckOutSearch] = useState('');
    
    const filteredPendingReservations = pendingReservations?.filter(res => 
        res.guest?.name?.toLowerCase().includes(checkInSearch.toLowerCase()) ||
        res.room?.number?.toString().includes(checkInSearch) ||
        res.guest?.document_number?.toLowerCase().includes(checkInSearch.toLowerCase())
    ) || [];
    
    const filteredActiveReservations = activeReservations?.filter(res => 
        res.guest?.name?.toLowerCase().includes(checkOutSearch.toLowerCase()) ||
        res.room?.number?.toString().includes(checkOutSearch) ||
        res.guest?.document_number?.toLowerCase().includes(checkOutSearch.toLowerCase())
    ) || [];
    
    const handleCheckIn = (reservationId) => {
        router.post(
            route('reservations.checkin', reservationId),
            {},
            {
                onSuccess: () => {
                    setCheckInSearch('');
                },
                onError: (errors) => {
                    console.error('Erro no check-in:', errors);
                }
            }
        );
    };
    
    const handleCheckOut = (reservationId) => {
        router.post(
            route('reservations.checkout', reservationId),
            {},
            {
                onSuccess: () => {
                    setCheckOutSearch('');
                },
                onError: (errors) => {
                    console.error('Erro no check-out:', errors);
                }
            }
        );
    };
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Check-in Widget */}
            <div className="hotel-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-success" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Check-in Rápido</h3>
                            <p className="text-sm text-muted-foreground">
                                {filteredPendingReservations.length} reserva{filteredPendingReservations.length !== 1 ? 's' : ''} pendente{filteredPendingReservations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="hotel-form-group">
                        <label className="hotel-form-label">Buscar Reserva</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Nome, documento ou quarto..."
                                value={checkInSearch}
                                onChange={(e) => setCheckInSearch(e.target.value)}
                                className="hotel-form-input pl-10"
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredPendingReservations.length > 0 ? (
                            filteredPendingReservations.slice(0, 5).map((reservation) => (
                                <div key={reservation.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="font-medium text-foreground text-sm">
                                                {reservation.guest?.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Quarto {reservation.room?.number} • {reservation.room?.type}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-muted-foreground">Entrada</div>
                                            <div className="text-sm font-medium">
                                                {new Date(reservation.check_in).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCheckIn(reservation.id)}
                                        className="hotel-btn-primary w-full text-xs"
                                    >
                                        <UserPlus className="w-3 h-3 mr-1" />
                                        Check-in
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">
                                    {checkInSearch ? 'Nenhuma reserva encontrada' : 'Nenhuma reserva pendente'}
                                </p>
                                <button
                                    onClick={() => router.get(route('reservations.create'))}
                                    className="hotel-btn-primary w-full mt-3 text-sm py-3 shadow-hotel hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Criar Nova Reserva
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-success" />
                        <span className="text-sm text-success">
                            {new Date().toLocaleDateString('pt-BR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Check-out Widget */}
            <div className="hotel-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                            <UserMinus className="w-6 h-6 text-warning" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">Check-out Rápido</h3>
                            <p className="text-sm text-muted-foreground">
                                {filteredActiveReservations.length} hospedagem{filteredActiveReservations.length !== 1 ? 'ns' : ''} ativa{filteredActiveReservations.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="hotel-form-group">
                        <label className="hotel-form-label">Buscar Hospedagem</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Nome, documento ou quarto..."
                                value={checkOutSearch}
                                onChange={(e) => setCheckOutSearch(e.target.value)}
                                className="hotel-form-input pl-10"
                            />
                        </div>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredActiveReservations.length > 0 ? (
                            filteredActiveReservations.slice(0, 5).map((reservation) => (
                                <div key={reservation.id} className="p-3 bg-muted/30 rounded-lg border border-border">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <div className="font-medium text-foreground text-sm">
                                                {reservation.guest?.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Quarto {reservation.room?.number} • {reservation.room?.type}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-muted-foreground">Saída</div>
                                            <div className="text-sm font-medium">
                                                {new Date(reservation.check_out).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCheckOut(reservation.id)}
                                        className="hotel-btn-secondary w-full text-xs"
                                    >
                                        <UserMinus className="w-3 h-3 mr-1" />
                                        Check-out
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">
                                    {checkOutSearch ? 'Nenhuma hospedagem encontrada' : 'Nenhuma hospedagem ativa'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-warning" />
                        <span className="text-sm text-warning">
                            Check-out padrão: 12:00
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckInOutWidget;
