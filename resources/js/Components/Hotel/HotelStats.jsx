import React from 'react';
import { 
    TrendingUp, 
    Users, 
    BedDouble, 
    DollarSign, 
    Calendar,
    Star,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

const HotelStats = ({ stats }) => {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';
    
    const StatCard = ({ title, value, change, changeType, icon: Icon, color = 'primary' }) => (
        <div className="hotel-card p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 text-${color}`} />
                    </div>
                    <div>
                        <div className="text-sm font-medium text-muted-foreground">{title}</div>
                        <div className="text-2xl font-bold text-foreground">{value}</div>
                    </div>
                </div>
            </div>
            
            {change !== undefined && (
                <div className={`flex items-center space-x-1 text-sm ${
                    changeType === 'positive' ? 'text-success' : 'text-destructive'
                }`}>
                    {changeType === 'positive' ? (
                        <ArrowUpRight className="w-4 h-4" />
                    ) : (
                        <ArrowDownRight className="w-4 h-4" />
                    )}
                    <span className="font-medium">{change}% vs mês anterior</span>
                </div>
            )}
        </div>
    );

    const statsCards = [
        {
            title: "Hóspedes Hoje",
            value: stats?.todayGuests || 0,
            change: stats?.guestsChange,
            changeType: stats?.guestsChange >= 0 ? 'positive' : 'negative',
            icon: Users,
            color: 'primary'
        },
        {
            title: "Taxa de Ocupação",
            value: `${stats?.occupancyRate || 0}%`,
            change: stats?.occupancyChange,
            changeType: stats?.occupancyChange >= 0 ? 'positive' : 'negative',
            icon: BedDouble,
            color: 'success'
        }
    ];
    
    // Adiciona receita apenas para admin
    if (isAdmin && stats?.dailyRevenue !== null) {
        statsCards.push({
            title: "Receita Diária",
            value: `R$ ${stats?.dailyRevenue?.toFixed(2) || '0,00'}`,
            change: stats?.revenueChange,
            changeType: stats?.revenueChange >= 0 ? 'positive' : 'negative',
            icon: DollarSign,
            color: 'warning'
        });
    }
    
    statsCards.push({
        title: "Satisfação",
        value: `${stats?.satisfaction || 0}/5`,
        change: stats?.satisfactionChange,
        changeType: stats?.satisfactionChange >= 0 ? 'positive' : 'negative',
        icon: Star,
        color: 'info'
    });

    return (
        <div className={`grid gap-6 mb-6 ${
            isAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
            {statsCards.map((card, index) => (
                <StatCard key={index} {...card} />
            ))}
        </div>
    );
};

export default HotelStats;
