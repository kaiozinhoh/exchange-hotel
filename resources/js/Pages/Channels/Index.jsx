import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { 
    Plus, 
    Settings, 
    Trash2, 
    Power, 
    CheckCircle, 
    AlertCircle,
    Globe,
    Calendar,
    RefreshCw
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function ChannelsIndex({ channels }) {
    const syncChannel = (channelId) => {
        router.post(route('channels.sync', channelId));
    };

    const testChannel = (channelId) => {
        router.post(route('channels.test', channelId));
    };

    const toggleChannel = (channelId) => {
        router.post(route('channels.toggle', channelId));
    };

    const deleteChannel = (channelId, channelName) => {
        if (confirm(`Tem certeza que deseja remover ${channelName}?`)) {
            router.delete(route('channels.destroy', channelId));
        }
    };

    const getChannelIcon = (code) => {
        switch (code) {
            case 'booking':
                return <Globe className="w-5 h-5 text-blue-600" />;
            case 'airbnb':
                return <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                </div>;
            default:
                return <Globe className="w-5 h-5 text-gray-600" />;
        }
    };

    const getStatusBadge = (channel) => {
        if (!channel.is_active) {
            return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
        }
        
        if (channel.last_sync_at) {
            const lastSync = new Date(channel.last_sync_at);
            const now = new Date();
            const hoursDiff = (now - lastSync) / (1000 * 60 * 60);
            
            if (hoursDiff < 1) {
                return <Badge className="bg-green-100 text-green-800">Sincronizado</Badge>;
            } else if (hoursDiff < 24) {
                return <Badge className="bg-yellow-100 text-yellow-800">Sincronização antiga</Badge>;
            }
        }
        
        return <Badge className="bg-red-100 text-red-800">Nunca sincronizado</Badge>;
    };

    return (
        <AuthenticatedLayout header="Canais de Venda">
            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Canais</h2>
                        <p className="text-gray-600 mt-1">Conecte seu sistema com OTAs como Booking.com e Airbnb</p>
                    </div>
                    <Link href={route('channels.create')}>
                        <Button className="flex items-center space-x-2">
                            <Plus className="w-4 h-4" />
                            <span>Adicionar Canal</span>
                        </Button>
                    </Link>
                </div>

                {/* Channels Grid */}
                {channels.length === 0 ? (
                    <Card>
                        <CardContent className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Globe className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum canal configurado</h3>
                            <p className="text-gray-600 mb-6">Conecte seu sistema com OTAs para sincronizar reservas automaticamente</p>
                            <Link href={route('channels.create')}>
                                <Button>Configurar Primeiro Canal</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {channels.map((channel) => (
                            <Card key={channel.id} className="relative">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {getChannelIcon(channel.code)}
                                            <div>
                                                <CardTitle className="text-lg">{channel.name}</CardTitle>
                                                <p className="text-sm text-gray-600">ID: {channel.id}</p>
                                            </div>
                                        </div>
                                        {getStatusBadge(channel)}
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    {/* Status Information */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Status:</span>
                                            <span className={channel.is_active ? 'text-green-600' : 'text-gray-500'}>
                                                {channel.is_active ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        
                                        {channel.last_sync_at && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Última sincronização:</span>
                                                <span className="text-gray-900">
                                                    {new Date(channel.last_sync_at).toLocaleString('pt-BR')}
                                                </span>
                                            </div>
                                        )}
                                        
                                        {channel.sync_error && (
                                            <div className="flex items-start space-x-2 text-sm">
                                                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-red-600">{channel.sync_error}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => syncChannel(channel.id)}
                                            className="flex items-center space-x-1"
                                        >
                                            <RefreshCw className="w-3 h-3" />
                                            <span>Sincronizar</span>
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testChannel(channel.id)}
                                            className="flex items-center space-x-1"
                                        >
                                            <CheckCircle className="w-3 h-3" />
                                            <span>Testar</span>
                                        </Button>
                                    </div>

                                    {/* Management Actions */}
                                    <div className="flex space-x-2 pt-2 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.visit(route('channels.edit', channel.id))}
                                            className="flex-1 flex items-center justify-center space-x-1"
                                        >
                                            <Settings className="w-3 h-3" />
                                            <span>Configurar</span>
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleChannel(channel.id)}
                                            className="flex items-center justify-center"
                                        >
                                            <Power className="w-3 h-3" />
                                        </Button>
                                        
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => deleteChannel(channel.id, channel.name)}
                                            className="flex items-center justify-center text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Information Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Sincronização Automática</h3>
                                    <p className="text-sm text-gray-600">Reservas sincronizadas a cada 30 minutos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Disponibilidade em Tempo Real</h3>
                                    <p className="text-sm text-gray-600">Atualização instantânea nos canais</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900">Gestão de Preços</h3>
                                    <p className="text-sm text-gray-600">Preços sincronizados automaticamente</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
