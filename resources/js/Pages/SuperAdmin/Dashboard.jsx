import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Building, 
    Users, 
    Calendar, 
    DollarSign, 
    TrendingUp,
    Hotel,
    UserPlus,
    CreditCard,
    Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";

const SuperAdminDashboard = ({ stats, recentHotels, topPerformingHotels }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const StatCard = ({ title, value, icon: Icon, color = 'primary', change }) => (
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</p>
                        <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold text-gray-900">{value}</span>
                            {change && (
                                <span className={`text-sm font-medium ${
                                    change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {change > 0 ? '+' : ''}{change}%
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AuthenticatedLayout header="Painel Super Admin">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Estatísticas Principais */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="Total de Hotéis"
                            value={stats.total_hotels}
                            icon={Building}
                            change={stats.new_hotels_this_month}
                        />
                        <StatCard
                            title="Hotéis Ativos"
                            value={stats.active_hotels}
                            icon={Hotel}
                        />
                        <StatCard
                            title="Total de Usuários"
                            value={stats.total_users}
                            icon={Users}
                        />
                        <StatCard
                            title="Receita Total"
                            value={formatCurrency(stats.total_revenue)}
                            icon={DollarSign}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Hotéis Recentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building className="w-5 h-5" />
                                    Hotéis Recentes
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentHotels.map((hotel) => (
                                        <div key={hotel.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <div className="font-medium">{hotel.name}</div>
                                                <div className="text-sm text-gray-500">{hotel.subdomain}.hotelmanager.com</div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Criado em {new Date(hotel.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge className={
                                                    hotel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }>
                                                    {hotel.status === 'active' ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {hotel.users_count} usuários
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Top Hotéis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Hotéis com Melhor Performance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {topPerformingHotels.map((hotel, index) => (
                                        <div key={hotel.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{hotel.name}</div>
                                                    <div className="text-sm text-gray-500">
                                                        {hotel.reservations_count} reservas
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatCurrency(hotel.reservations_sum_total_price)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {hotel.users_count} usuários
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Estatísticas Adicionais */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-yellow-50 rounded-full">
                                        <Calendar className="h-6 w-6 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Hotéis em Trial</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.trial_hotels}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-green-50 rounded-full">
                                        <Activity className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total de Reservas</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total_reservations}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="p-3 bg-purple-50 rounded-full">
                                        <CreditCard className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                                        <p className="text-2xl font-bold text-gray-900">68%</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SuperAdminDashboard;
