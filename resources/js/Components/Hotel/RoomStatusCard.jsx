import React from 'react';
import { Bed, Users, Calendar, Clock } from 'lucide-react';

const RoomStatusCard = ({ room, onStatusChange }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'available':
                return 'hotel-status-available';
            case 'occupied':
                return 'hotel-status-occupied';
            case 'maintenance':
                return 'hotel-status-maintenance';
            case 'cleaning':
                return 'hotel-status-maintenance';
            default:
                return 'hotel-status-available';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'available':
                return 'Disponível';
            case 'occupied':
                return 'Ocupado';
            case 'maintenance':
                return 'Manutenção';
            case 'cleaning':
                return 'Limpando';
            default:
                return 'Disponível';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'available':
                return <Bed className="w-4 h-4" />;
            case 'occupied':
                return <Users className="w-4 h-4" />;
            case 'maintenance':
                return <Clock className="w-4 h-4" />;
            case 'cleaning':
                return <Clock className="w-4 h-4" />;
            default:
                return <Bed className="w-4 h-4" />;
        }
    };

    return (
        <div className={`hotel-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${getStatusColor(room.status)}`}
             onClick={() => onStatusChange && onStatusChange(room)}>
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-background">
                        {getStatusIcon(room.status)}
                    </div>
                    <div>
                        <div className="font-semibold text-foreground">Quarto {room.number}</div>
                        <div className="text-xs text-muted-foreground">{room.type}</div>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusText(room.status)}
                </div>
            </div>
            
            {room.guest && (
                <div className="mt-3 p-2 bg-background/50 rounded-lg">
                    <div className="flex items-center space-x-2">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">{room.guest.name}</span>
                    </div>
                    {room.check_in && (
                        <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                Check-in: {new Date(room.check_in).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    )}
                    {room.check_out && (
                        <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                Check-out: {new Date(room.check_out).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    )}
                </div>
            )}
            
            <div className="mt-3 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    {room.beds} camas • {room.capacity} hóspedes
                </div>
                <div className="text-sm font-semibold text-foreground">
                    R$ {room.price?.toFixed(2) || '0,00'}
                </div>
            </div>
        </div>
    );
};

export default RoomStatusCard;
