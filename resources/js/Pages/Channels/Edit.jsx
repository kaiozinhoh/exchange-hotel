import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { ArrowLeft, Save } from 'lucide-react';
import { Link, useForm } from '@inertiajs/react';

export default function ChannelsEdit({ channel }) {
    const { data, setData, patch, processing, errors } = useForm({
        credentials: channel.credentials || {},
        settings: channel.settings || {},
    });

    const onSubmit = (e) => {
        e.preventDefault();
        patch(route('channels.update', channel.id));
    };

    return (
        <AuthenticatedLayout header={`Editar Canal: ${channel.name}`}>
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center space-x-4">
                    <Link href={route('channels.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Voltar
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Editar Canal</h2>
                        <p className="text-gray-600">Atualize credenciais e configurações de sincronização.</p>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Credenciais (JSON)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="credentials">Credenciais</Label>
                            <Textarea
                                id="credentials"
                                className="mt-2 min-h-[220px] font-mono text-sm"
                                value={JSON.stringify(data.credentials, null, 2)}
                                onChange={(e) => {
                                    try {
                                        const parsed = JSON.parse(e.target.value || '{}');
                                        setData('credentials', parsed);
                                    } catch (_) {
                                        // Mantém valor anterior enquanto JSON estiver inválido
                                    }
                                }}
                            />
                            {errors.credentials && <p className="text-red-500 text-sm mt-2">{errors.credentials}</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="sync_interval">Intervalo de sincronização (min)</Label>
                                    <Input
                                        id="sync_interval"
                                        type="number"
                                        min="5"
                                        max="1440"
                                        value={data.settings.sync_interval ?? 30}
                                        onChange={(e) =>
                                            setData('settings', {
                                                ...data.settings,
                                                sync_interval: Number(e.target.value) || 30,
                                            })
                                        }
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.settings.auto_sync)}
                                        onChange={(e) =>
                                            setData('settings', { ...data.settings, auto_sync: e.target.checked })
                                        }
                                    />
                                    <span>Sincronização automática</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.settings.update_availability)}
                                        onChange={(e) =>
                                            setData('settings', { ...data.settings, update_availability: e.target.checked })
                                        }
                                    />
                                    <span>Atualizar disponibilidade</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(data.settings.update_pricing)}
                                        onChange={(e) =>
                                            setData('settings', { ...data.settings, update_pricing: e.target.checked })
                                        }
                                    />
                                    <span>Atualizar preços</span>
                                </label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Salvando...' : 'Salvar alterações'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
