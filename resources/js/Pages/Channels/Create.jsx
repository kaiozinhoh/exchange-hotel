import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { 
    ArrowLeft, 
    Globe, 
    Key, 
    Settings, 
    CheckCircle, 
    AlertCircle,
    Hotel
} from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function ChannelsCreate({ availableChannels }) {
    const { post, processing, errors, setData, data } = useForm({
        channel_code: '',
        credentials: {
            api_key: '',
            property_id: '',
            client_id: '',
            client_secret: '',
            access_token: '',
        },
        settings: {
            auto_sync: true,
            sync_interval: 30,
            update_availability: true,
            update_pricing: true,
        },
    });

    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('channels.store'));
    };

    const handleChannelSelect = (channel) => {
        setSelectedChannel(channel);
        setData('channel_code', channel.code);
        
        // Reset credentials for new selection
        setData('credentials', {
            api_key: '',
            property_id: '',
            client_id: '',
            client_secret: '',
            access_token: '',
        });
    };

    const renderCredentialFields = () => {
        if (!selectedChannel) return null;

        switch (selectedChannel.code) {
            case 'booking':
                return (
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                            <Key className="w-5 h-5 mr-2" />
                            Credenciais Booking.com
                        </h4>
                        
                        <div>
                            <Label htmlFor="api_key">API Key</Label>
                            <Input
                                id="api_key"
                                type="password"
                                value={data.credentials.api_key}
                                onChange={(e) => setData('credentials.api_key', e.target.value)}
                                placeholder="Sua API Key do Booking.com"
                                className="mt-1"
                            />
                            {errors.api_key && (
                                <p className="text-red-500 text-sm mt-1">{errors.api_key}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="property_id">Property ID</Label>
                            <Input
                                id="property_id"
                                value={data.credentials.property_id}
                                onChange={(e) => setData('credentials.property_id', e.target.value)}
                                placeholder="ID da sua propriedade no Booking.com"
                                className="mt-1"
                            />
                            {errors.property_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.property_id}</p>
                            )}
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-2">Como obter suas credenciais:</h5>
                            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                                <li>Acesse o portal de parceiros do Booking.com</li>
                                <li>Vá para "API &amp; Connectivity" &gt; "API Keys"</li>
                                <li>Gere uma nova API Key para seu hotel</li>
                                <li>Encontre seu Property ID nas configurações da propriedade</li>
                            </ol>
                        </div>
                    </div>
                );

            case 'airbnb':
                return (
                    <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-900 flex items-center">
                            <Key className="w-5 h-5 mr-2" />
                            Credenciais Airbnb
                        </h4>
                        
                        <div>
                            <Label htmlFor="client_id">Client ID</Label>
                            <Input
                                id="client_id"
                                value={data.credentials.client_id}
                                onChange={(e) => setData('credentials.client_id', e.target.value)}
                                placeholder="Seu Client ID da API do Airbnb"
                                className="mt-1"
                            />
                            {errors.client_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="client_secret">Client Secret</Label>
                            <Input
                                id="client_secret"
                                type="password"
                                value={data.credentials.client_secret}
                                onChange={(e) => setData('credentials.client_secret', e.target.value)}
                                placeholder="Seu Client Secret da API do Airbnb"
                                className="mt-1"
                            />
                            {errors.client_secret && (
                                <p className="text-red-500 text-sm mt-1">{errors.client_secret}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="access_token">Access Token</Label>
                            <Textarea
                                id="access_token"
                                value={data.credentials.access_token}
                                onChange={(e) => setData('credentials.access_token', e.target.value)}
                                placeholder="Seu Access Token (gerado via OAuth)"
                                className="mt-1"
                                rows={3}
                            />
                            {errors.access_token && (
                                <p className="text-red-500 text-sm mt-1">{errors.access_token}</p>
                            )}
                        </div>

                        <div className="bg-pink-50 p-4 rounded-lg">
                            <h5 className="font-medium text-pink-900 mb-2">Como obter suas credenciais:</h5>
                            <ol className="text-sm text-pink-800 space-y-1 list-decimal list-inside">
                                <li>Registre seu aplicativo no Airbnb Developer Portal</li>
                                <li>Configure OAuth 2.0 com as URLs de callback</li>
                                <li>Obtenha autorização do proprietário do listing</li>
                                <li>Gere o Access Token através do fluxo OAuth</li>
                            </ol>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout header="Configurar Canal de Venda">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link href={route('channels.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Adicionar Canal de Venda</h2>
                        <p className="text-gray-600">Conecte seu sistema com OTAs para sincronizar reservas</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Channel Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Globe className="w-5 h-5 mr-2" />
                                Selecione o Canal
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableChannels.map((channel) => (
                                    <div
                                        key={channel.code}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedChannel?.code === channel.code
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleChannelSelect(channel)}
                                    >
                                        <div className="flex items-start space-x-3">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {channel.code === 'booking' ? (
                                                    <Globe className="w-5 h-5 text-blue-600" />
                                                ) : (
                                                    <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                                                        <span className="text-white text-xs font-bold">A</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-900">{channel.name}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                                                <div className="mt-2">
                                                    {channel.features.map((feature, index) => (
                                                        <div key={index} className="flex items-center text-xs text-gray-500">
                                                            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {selectedChannel?.code === channel.code && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {errors.channel_code && (
                                <p className="text-red-500 text-sm mt-2">{errors.channel_code}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Credentials */}
                    {selectedChannel && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Key className="w-5 h-5 mr-2" />
                                    Configurações de API
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {renderCredentialFields()}
                            </CardContent>
                        </Card>
                    )}

                    {/* Settings */}
                    {selectedChannel && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Settings className="w-5 h-5 mr-2" />
                                    Configurações de Sincronização
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="auto_sync"
                                            checked={data.settings.auto_sync}
                                            onChange={(e) => setData('settings.auto_sync', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="auto_sync">Sincronização automática</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="update_availability"
                                            checked={data.settings.update_availability}
                                            onChange={(e) => setData('settings.update_availability', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="update_availability">Atualizar disponibilidade</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="update_pricing"
                                            checked={data.settings.update_pricing}
                                            onChange={(e) => setData('settings.update_pricing', e.target.checked)}
                                            className="rounded"
                                        />
                                        <Label htmlFor="update_pricing">Atualizar preços</Label>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="sync_interval">Intervalo de sincronização (minutos)</Label>
                                    <Input
                                        id="sync_interval"
                                        type="number"
                                        min="5"
                                        max="1440"
                                        value={data.settings.sync_interval}
                                        onChange={(e) => setData('settings.sync_interval', parseInt(e.target.value))}
                                        className="mt-1 w-full md:w-64"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Submit */}
                    {selectedChannel && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-end space-x-4">
                                    <Link href={route('channels.index')}>
                                        <Button variant="outline" type="button">
                                            Cancelar
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Configurando...' : 'Configurar Canal'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
