import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { 
    TrendingUp, 
    Users, 
    Building, 
    DollarSign,
    Calendar,
    Activity,
    BarChart3,
    PieChart,
    Download
} from 'lucide-react';

export default function Analytics({ analytics, period, setPeriod }) {
    const [selectedPeriod, setSelectedPeriod] = useState(period || '30d');

    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
        setPeriod(newPeriod);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0);
    };

    const formatNumber = (value) => {
        return new Intl.NumberFormat('pt-BR').format(value || 0);
    };

    const getGrowthRate = (current, previous) => {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    };

    const getGrowthIcon = (rate) => {
        const numRate = parseFloat(rate);
        if (numRate > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (numRate < 0) return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
        return <Activity className="h-4 w-4 text-gray-400" />;
    };

    const getGrowthColor = (rate) => {
        const numRate = parseFloat(rate);
        if (numRate > 0) return 'text-green-600';
        if (numRate < 0) return 'text-red-600';
        return 'text-gray-600';
    };

    return (
        <AuthenticatedLayout header="Analytics SaaS">
            <div className="space-y-6">
                {/* Period Selector */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">Análise da Plataforma</h2>
                    <div className="flex items-center space-x-2">
                        <select
                            value={selectedPeriod}
                            onChange={(e) => handlePeriodChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="7d">Últimos 7 dias</option>
                            <option value="30d">Últimos 30 dias</option>
                            <option value="90d">Últimos 90 dias</option>
                            <option value="1y">Último ano</option>
                        </select>
                        <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Exportar
                        </Button>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Receita Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(analytics.total_revenue)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {getGrowthIcon(analytics.revenue_growth)}
                                        <span className={`text-sm ml-1 ${getGrowthColor(analytics.revenue_growth)}`}>
                                            {analytics.revenue_growth}%
                                        </span>
                                    </div>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Hotéis Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analytics.active_hotels)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {getGrowthIcon(analytics.hotels_growth)}
                                        <span className={`text-sm ml-1 ${getGrowthColor(analytics.hotels_growth)}`}>
                                            {analytics.hotels_growth}%
                                        </span>
                                    </div>
                                </div>
                                <Building className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analytics.active_users)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {getGrowthIcon(analytics.users_growth)}
                                        <span className={`text-sm ml-1 ${getGrowthColor(analytics.users_growth)}`}>
                                            {analytics.users_growth}%
                                        </span>
                                    </div>
                                </div>
                                <Users className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Reservas/Mês</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatNumber(analytics.monthly_reservations)}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        {getGrowthIcon(analytics.reservations_growth)}
                                        <span className={`text-sm ml-1 ${getGrowthColor(analytics.reservations_growth)}`}>
                                            {analytics.reservations_growth}%
                                        </span>
                                    </div>
                                </div>
                                <Calendar className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2" />
                                Receita por Período
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center text-gray-500">
                                    <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                                    <p>Gráfico de Receita</p>
                                    <p className="text-sm">(Integrar com Chart.js ou similar)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Hotel Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <PieChart className="h-5 w-5 mr-2" />
                                Distribuição de Hotéis
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                                <div className="text-center text-gray-500">
                                    <PieChart className="h-12 w-12 mx-auto mb-2" />
                                    <p>Gráfico de Distribuição</p>
                                    <p className="text-sm">(Por status/plano)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Performing Hotels */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hotéis com Melhor Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.top_hotels?.map((hotel, index) => (
                                <div key={hotel.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-blue-600">
                                                    {index + 1}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{hotel.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {hotel.reservations_count} reservas
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatCurrency(hotel.reservations_sum_total_price)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {hotel.users_count} usuários
                                        </p>
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center py-8">
                                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Nenhum dado disponível
                                    </h3>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Atividade Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.recent_activity?.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
                                    <div className="flex-shrink-0">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            activity.type === 'hotel_created' ? 'bg-blue-100' :
                                            activity.type === 'user_registered' ? 'bg-green-100' :
                                            activity.type === 'reservation_made' ? 'bg-purple-100' :
                                            'bg-gray-100'
                                        }`}>
                                            {
                                                activity.type === 'hotel_created' ? <Building className="h-4 w-4 text-blue-600" /> :
                                                activity.type === 'user_registered' ? <Users className="h-4 w-4 text-green-600" /> :
                                                activity.type === 'reservation_made' ? <Calendar className="h-4 w-4 text-purple-600" /> :
                                                <Activity className="h-4 w-4 text-gray-600" />
                                            }
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            )) || (
                                <div className="text-center py-8">
                                    <Activity className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Nenhuma atividade recente
                                    </h3>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
