import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { 
    Building, 
    Users, 
    Calendar, 
    TrendingUp, 
    Search,
    Plus,
    Eye,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function HotelsIndex({ hotels, stats }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredHotels = hotels.filter(hotel => {
        const matchesSearch = hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            hotel.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || hotel.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const toggleHotelStatus = (hotelId) => {
        if (confirm('Tem certeza que deseja alterar o status deste hotel?')) {
            router.post(`/superadmin/hotels/${hotelId}/toggle-status`);
        }
    };

    const extendTrial = (hotelId) => {
        if (confirm('Deseja estender o trial por 30 dias?')) {
            router.post(`/superadmin/hotels/${hotelId}/extend-trial`);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'active': { label: 'Ativo', className: 'bg-green-100 text-green-800' },
            'trial': { label: 'Trial', className: 'bg-blue-100 text-blue-800' },
            'inactive': { label: 'Inativo', className: 'bg-red-100 text-red-800' },
            'suspended': { label: 'Suspenso', className: 'bg-yellow-100 text-yellow-800' }
        };
        return statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
    };

    const getTrialDaysLeft = (trialEndsAt) => {
        if (!trialEndsAt) return null;
        const days = Math.ceil(new Date(trialEndsAt) - new Date()) / (1000 * 60 * 60 * 24);
        return days > 0 ? Math.floor(days) : 0;
    };

    return (
        <AuthenticatedLayout header="Gestão de Hotéis">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Building className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Hotéis</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_hotels}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <TrendingUp className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.active_hotels}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Calendar className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Em Trial</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.trial_hotels}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Novos este Mês</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.new_hotels_this_month}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar hotéis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                        
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos Status</option>
                            <option value="active">Ativos</option>
                            <option value="trial">Trial</option>
                            <option value="inactive">Inativos</option>
                            <option value="suspended">Suspensos</option>
                        </select>
                    </div>
                    
                    <Link href={route('superadmin.hotels.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Novo Hotel
                        </Button>
                    </Link>
                </div>

                {/* Hotels Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Hotéis Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hotel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuários
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trial
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Criado em
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredHotels.map((hotel) => {
                                        const statusBadge = getStatusBadge(hotel.status);
                                        const trialDaysLeft = getTrialDaysLeft(hotel.trial_ends_at);
                                        
                                        return (
                                            <tr key={hotel.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {hotel.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {hotel.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={statusBadge.className}>
                                                        {statusBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                                                        {hotel.users_count || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {hotel.trial_ends_at ? (
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                            <span className={trialDaysLeft <= 7 ? 'text-red-600 font-medium' : ''}>
                                                                {trialDaysLeft} dias
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(hotel.created_at).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Link href={route('superadmin.hotels.edit', hotel.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => toggleHotelStatus(hotel.id)}
                                                            className={hotel.status === 'active' ? 'text-red-600' : 'text-green-600'}
                                                        >
                                                            {hotel.status === 'active' ? (
                                                                <ToggleLeft className="h-4 w-4" />
                                                            ) : (
                                                                <ToggleRight className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        
                                                        {hotel.status === 'trial' && trialDaysLeft <= 7 && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => extendTrial(hotel.id)}
                                                                className="text-blue-600"
                                                            >
                                                                <Calendar className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            
                            {filteredHotels.length === 0 && (
                                <div className="text-center py-8">
                                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Nenhum hotel encontrado
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Tente ajustar seus filtros ou criar um novo hotel.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
