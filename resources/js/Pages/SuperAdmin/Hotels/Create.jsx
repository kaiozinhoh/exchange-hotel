import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Building, User, Mail, Lock, Palette, Globe, FileText } from 'lucide-react';

const CreateHotel = () => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        subdomain: '',
        description: '',
        primary_color: '#0088cc',
        secondary_color: '#6c757d',
        admin_name: '',
        admin_email: '',
        admin_password: '',
        admin_password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('superadmin.hotels.store'));
    };

    const generateSubdomain = (name) => {
        if (!name) return '';
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace(/\s+/g, '');
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        setData('name', name);
        if (!data.subdomain) {
            setData('subdomain', generateSubdomain(name));
        }
    };

    return (
        <AuthenticatedLayout header="Criar Novo Hotel">
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Configurar Novo Hotel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informações do Hotel */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <Building className="w-5 h-5" />
                                        Informações do Hotel
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Nome do Hotel</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={handleNameChange}
                                                placeholder="Hotel Exemplo"
                                                required
                                            />
                                            {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                                        </div>

                                        <div>
                                            <Label htmlFor="subdomain">Subdomínio</Label>
                                            <div className="relative">
                                                <Input
                                                    id="subdomain"
                                                    type="text"
                                                    value={data.subdomain}
                                                    onChange={(e) => setData('subdomain', e.target.value)}
                                                    placeholder="exemplo"
                                                    required
                                                />
                                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                                                    .hotelmanager.com
                                                </span>
                                            </div>
                                            {errors.subdomain && <span className="text-red-500 text-sm">{errors.subdomain}</span>}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="description">Descrição</Label>
                                        <textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Descrição do hotel..."
                                            rows={3}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                                    </div>
                                </div>

                                {/* Cores do Tema */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <Palette className="w-5 h-5" />
                                        Cores do Tema
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="primary_color">Cor Primária</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="primary_color"
                                                    type="color"
                                                    value={data.primary_color}
                                                    onChange={(e) => setData('primary_color', e.target.value)}
                                                    className="w-16 h-10"
                                                />
                                                <Input
                                                    type="text"
                                                    value={data.primary_color}
                                                    onChange={(e) => setData('primary_color', e.target.value)}
                                            placeholder="#0088cc"
                                                />
                                            </div>
                                            {errors.primary_color && <span className="text-red-500 text-sm">{errors.primary_color}</span>}
                                        </div>

                                        <div>
                                            <Label htmlFor="secondary_color">Cor Secundária</Label>
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    id="secondary_color"
                                                    type="color"
                                                    value={data.secondary_color}
                                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                                    className="w-16 h-10"
                                                />
                                                <Input
                                                    type="text"
                                                    value={data.secondary_color}
                                                    onChange={(e) => setData('secondary_color', e.target.value)}
                                                    placeholder="#6c757d"
                                                />
                                            </div>
                                            {errors.secondary_color && <span className="text-red-500 text-sm">{errors.secondary_color}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Administrador do Hotel */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Administrador do Hotel
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="admin_name">Nome do Administrador</Label>
                                            <Input
                                                id="admin_name"
                                                type="text"
                                                value={data.admin_name}
                                                onChange={(e) => setData('admin_name', e.target.value)}
                                                placeholder="João Silva"
                                                required
                                            />
                                            {errors.admin_name && <span className="text-red-500 text-sm">{errors.admin_name}</span>}
                                        </div>

                                        <div>
                                            <Label htmlFor="admin_email">Email do Administrador</Label>
                                            <Input
                                                id="admin_email"
                                                type="email"
                                                value={data.admin_email}
                                                onChange={(e) => setData('admin_email', e.target.value)}
                                                placeholder="joao@exemplo.com"
                                                required
                                            />
                                            {errors.admin_email && <span className="text-red-500 text-sm">{errors.admin_email}</span>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="admin_password">Senha</Label>
                                            <div className="relative">
                                                <Input
                                                    id="admin_password"
                                                    type={showPassword ? "text" : "password"}
                                                    value={data.admin_password}
                                                    onChange={(e) => setData('admin_password', e.target.value)}
                                                    placeholder="Mínimo 8 caracteres"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                                >
                                                    {showPassword ? 'Ocultar' : 'Mostrar'}
                                                </button>
                                            </div>
                                            {errors.admin_password && <span className="text-red-500 text-sm">{errors.admin_password}</span>}
                                        </div>

                                        <div>
                                            <Label htmlFor="admin_password_confirmation">Confirmar Senha</Label>
                                            <Input
                                                id="admin_password_confirmation"
                                                type="password"
                                                value={data.admin_password_confirmation}
                                                onChange={(e) => setData('admin_password_confirmation', e.target.value)}
                                                placeholder="Confirme a senha"
                                                required
                                            />
                                            {errors.admin_password_confirmation && <span className="text-red-500 text-sm">{errors.admin_password_confirmation}</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Resumo */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Resumo da Configuração</h4>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>URL de Acesso:</strong> https://{data.subdomain || 'subdominio'}.hotelmanager.com</p>
                                        <p><strong>Período de Teste:</strong> 30 dias gratuitos</p>
                                        <p><strong>Limites Iniciais:</strong> 50 quartos, 10 usuários, 1000 reservas/mês</p>
                                        <p><strong>Administrador:</strong> {data.admin_name || 'Nome'} ({data.admin_email || 'email'})</p>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700" 
                                    disabled={processing}
                                >
                                    <Building className="w-4 h-4 mr-2" />
                                    {processing ? 'Criando Hotel...' : 'Criar Hotel'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default CreateHotel;
