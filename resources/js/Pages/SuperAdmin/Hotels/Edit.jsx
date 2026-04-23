import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { 
    ArrowLeft,
    Building,
    Users,
    Calendar,
    Settings,
    Save,
    Trash2,
    UserPlus
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function EditHotel({ hotel }) {
    const [formData, setFormData] = useState({
        name: hotel.name || '',
        subdomain: hotel.subdomain || '',
        description: hotel.description || '',
        primary_color: hotel.primary_color || '#0088cc',
        secondary_color: hotel.secondary_color || '#6c757d',
        status: hotel.status || 'active',
        subscription_limits: {
            max_rooms: hotel.subscription_limits?.max_rooms || 50,
            max_users: hotel.subscription_limits?.max_users || 10,
            max_reservations_per_month: hotel.subscription_limits?.max_reservations_per_month || 1000,
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('subscription_limits.')) {
            const limitField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                subscription_limits: {
                    ...prev.subscription_limits,
                    [limitField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('superadmin.hotels.update', hotel.id), formData);
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

    const statusBadge = getStatusBadge(hotel.status);
    const trialDaysLeft = getTrialDaysLeft(hotel.trial_ends_at);

    return (
        <AuthenticatedLayout header={`Editar Hotel - ${hotel.name}`}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('superadmin.hotels')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{hotel.name}</h1>
                            <div className="flex items-center space-x-2 mt-1">
                                <Badge className={statusBadge.className}>
                                    {statusBadge.label}
                                </Badge>
                                {hotel.trial_ends_at && (
                                    <span className="text-sm text-gray-500">
                                        Trial: {trialDaysLeft} dias restantes
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informações Básicas */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Building className="h-5 w-5 mr-2" />
                                        Informações Básicas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Nome do Hotel</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="subdomain">Subdomínio</Label>
                                        <Input
                                            id="subdomain"
                                            name="subdomain"
                                            value={formData.subdomain}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="hotel-exemplo"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            URL: https://{formData.subdomain}.seusite.com
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descrição</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Descrição do hotel..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="primary_color">Cor Primária</Label>
                                            <Input
                                                id="primary_color"
                                                name="primary_color"
                                                type="color"
                                                value={formData.primary_color}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="secondary_color">Cor Secundária</Label>
                                            <Input
                                                id="secondary_color"
                                                name="secondary_color"
                                                type="color"
                                                value={formData.secondary_color}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">Ativo</option>
                                            <option value="trial">Trial</option>
                                            <option value="inactive">Inativo</option>
                                            <option value="suspended">Suspenso</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Limites da Assinatura */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="h-5 w-5 mr-2" />
                                        Limites da Assinatura
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="subscription_limits.max_rooms">Máximo de Quartos</Label>
                                            <Input
                                                id="subscription_limits.max_rooms"
                                                name="subscription_limits.max_rooms"
                                                type="number"
                                                value={formData.subscription_limits.max_rooms}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="subscription_limits.max_users">Máximo de Usuários</Label>
                                            <Input
                                                id="subscription_limits.max_users"
                                                name="subscription_limits.max_users"
                                                type="number"
                                                value={formData.subscription_limits.max_users}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="subscription_limits.max_reservations_per_month">Máximo de Reservas/Mês</Label>
                                            <Input
                                                id="subscription_limits.max_reservations_per_month"
                                                name="subscription_limits.max_reservations_per_month"
                                                type="number"
                                                value={formData.subscription_limits.max_reservations_per_month}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Estatísticas */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Estatísticas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Usuários</span>
                                        <span className="font-semibold">{hotel.users_count || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Criado em</span>
                                        <span className="text-sm">
                                            {new Date(hotel.created_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    {hotel.trial_ends_at && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-600">Trial termina</span>
                                            <span className="text-sm">
                                                {new Date(hotel.trial_ends_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Ações */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ações</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button type="submit" className="w-full">
                                        <Save className="h-4 w-4 mr-2" />
                                        Salvar Alterações
                                    </Button>
                                    
                                    <Link href={route('superadmin.hotels')}>
                                        <Button variant="outline" className="w-full">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
