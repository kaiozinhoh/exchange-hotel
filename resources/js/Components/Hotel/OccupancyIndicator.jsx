import React from 'react';
import { TrendingUp, TrendingDown, Users, Bed } from 'lucide-react';
import { usePage } from '@inertiajs/react';

const OccupancyIndicator = ({ occupancy, totalRooms, revenue }) => {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    
    const occupancyRate = ((occupancy / totalRooms) * 100).toFixed(1);
    const availableRooms = totalRooms - occupancy;
    
    return (
        <div className={`grid gap-4 mb-6 ${
            isAdmin ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'
        }`}>
            {/* Taxa de Ocupação */}
            <div className="hotel-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Ocupação</div>
                            <div className="text-2xl font-bold text-foreground">{occupancyRate}%</div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                            className="bg-primary h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${occupancyRate}%` }}
                        ></div>
                    </div>
                    <span className="text-sm text-muted-foreground">{occupancy}/{totalRooms}</span>
                </div>
            </div>

            {/* Quartos Disponíveis */}
            <div className="hotel-card p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <Bed className="w-5 h-5 text-success" />
                        </div>
                        <div>
                            <div className="text-sm font-medium text-muted-foreground">Disponíveis</div>
                            <div className="text-2xl font-bold text-foreground">{availableRooms}</div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        availableRooms > 10 ? 'hotel-status-available' : 'hotel-status-maintenance'
                    }`}>
                        {availableRooms > 10 ? 'Boa' : 'Baixa'}
                    </div>
                </div>
                <div className="text-sm text-muted-foreground">
                    {availableRooms > 0 
                        ? `${availableRooms} quartos prontos para check-in` 
                        : 'Nenhum quarto disponível'
                    }
                </div>
            </div>

            {/* Receita do Dia - Apenas para Admin */}
            {isAdmin && revenue !== null && (
                <div className="hotel-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-warning" />
                            </div>
                            <div>
                                <div className="text-sm font-medium text-muted-foreground">Receita Hoje</div>
                                <div className="text-2xl font-bold text-foreground">
                                    R$ {revenue?.toFixed(2) || '0,00'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Baseado em {occupancy} check-ins
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OccupancyIndicator;
