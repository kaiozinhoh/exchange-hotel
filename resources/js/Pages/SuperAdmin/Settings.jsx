import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Badge } from "@/Components/ui/badge";
import { 
    Settings,
    Shield,
    Database,
    Mail,
    Globe,
    CreditCard,
    Users,
    Building,
    Save,
    RefreshCw
} from 'lucide-react';

export default function SuperAdminSettings() {
    const [formData, setFormData] = useState({
        // Configurações Gerais do SaaS
        platform_name: 'Exchange Hotel Manager',
        admin_email: 'admin@hotelmanager.com',
        support_email: 'suporte@hotelmanager.com',
        
        // Configurações de Trial
        default_trial_days: 30,
        max_trial_extensions: 1,
        
        // Limites Padrão
        default_limits: {
            max_rooms: 50,
            max_users: 10,
            max_reservations_per_month: 1000,
        },
        
        // Configurações de Email
        smtp_host: '',
        smtp_port: 587,
        smtp_username: '',
        smtp_password: '',
        smtp_encryption: 'tls',
        
        // Configurações de Sistema
        maintenance_mode: false,
        debug_mode: false,
        backup_frequency: 'daily',
        
        // Configurações de Pagamento
        stripe_enabled: false,
        stripe_public_key: '',
        stripe_secret_key: '',
        
        // Configurações de Domínio
        base_domain: 'hotelmanager.com',
        force_https: true,
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('default_limits.')) {
            const limitField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                default_limits: {
                    ...prev.default_limits,
                    [limitField]: type === 'number' ? parseInt(value) : value
                }
            }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'number' ? parseInt(value) : value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implementar salvamento das configurações
        console.log('Salvando configurações:', formData);
    };

    const handleTestEmail = () => {
        // TODO: Implementar teste de email
        console.log('Testando configurações de email');
    };

    const handleBackup = () => {
        // TODO: Implementar backup manual
        console.log('Iniciando backup manual');
    };

    return (
        <AuthenticatedLayout header="Configurações do SaaS">
            <div className="space-y-6">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Building className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Hotéis Ativos</p>
                                    <p className="text-2xl font-bold text-gray-900">24</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Usuários Totais</p>
                                    <p className="text-2xl font-bold text-gray-900">156</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <CreditCard className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Receita/Mês</p>
                                    <p className="text-2xl font-bold text-gray-900">R$ 12.450</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Database className="h-8 w-8 text-orange-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Storage</p>
                                    <p className="text-2xl font-bold text-gray-900">2.4GB</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Configurações Principais */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Configurações Gerais */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Settings className="h-5 w-5 mr-2" />
                                        Configurações Gerais
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="platform_name">Nome da Plataforma</Label>
                                            <Input
                                                id="platform_name"
                                                name="platform_name"
                                                value={formData.platform_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="admin_email">Email do Admin</Label>
                                            <Input
                                                id="admin_email"
                                                name="admin_email"
                                                type="email"
                                                value={formData.admin_email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="support_email">Email de Suporte</Label>
                                        <Input
                                            id="support_email"
                                            name="support_email"
                                            type="email"
                                            value={formData.support_email}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="base_domain">Domínio Base</Label>
                                            <Input
                                                id="base_domain"
                                                name="base_domain"
                                                value={formData.base_domain}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="flex items-center space-x-2 pt-6">
                                            <input
                                                type="checkbox"
                                                id="force_https"
                                                name="force_https"
                                                checked={formData.force_https}
                                                onChange={handleInputChange}
                                                className="rounded"
                                            />
                                            <Label htmlFor="force_https">Forçar HTTPS</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Configurações de Trial */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Shield className="h-5 w-5 mr-2" />
                                        Configurações de Trial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="default_trial_days">Dias de Trial Padrão</Label>
                                            <Input
                                                id="default_trial_days"
                                                name="default_trial_days"
                                                type="number"
                                                value={formData.default_trial_days}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="365"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="max_trial_extensions">Máximo de Extensões</Label>
                                            <Input
                                                id="max_trial_extensions"
                                                name="max_trial_extensions"
                                                type="number"
                                                value={formData.max_trial_extensions}
                                                onChange={handleInputChange}
                                                min="0"
                                                max="10"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Limites Padrão */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Users className="h-5 w-5 mr-2" />
                                        Limites Padrão para Novos Hotéis
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label htmlFor="default_limits.max_rooms">Máximo de Quartos</Label>
                                            <Input
                                                id="default_limits.max_rooms"
                                                name="default_limits.max_rooms"
                                                type="number"
                                                value={formData.default_limits.max_rooms}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="default_limits.max_users">Máximo de Usuários</Label>
                                            <Input
                                                id="default_limits.max_users"
                                                name="default_limits.max_users"
                                                type="number"
                                                value={formData.default_limits.max_users}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="default_limits.max_reservations_per_month">Reservas/Mês</Label>
                                            <Input
                                                id="default_limits.max_reservations_per_month"
                                                name="default_limits.max_reservations_per_month"
                                                type="number"
                                                value={formData.default_limits.max_reservations_per_month}
                                                onChange={handleInputChange}
                                                min="1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Configurações de Email */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Mail className="h-5 w-5 mr-2" />
                                            Configurações de Email
                                        </div>
                                        <Button type="button" variant="outline" size="sm" onClick={handleTestEmail}>
                                            Testar Email
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="smtp_host">Servidor SMTP</Label>
                                            <Input
                                                id="smtp_host"
                                                name="smtp_host"
                                                value={formData.smtp_host}
                                                onChange={handleInputChange}
                                                placeholder="smtp.gmail.com"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="smtp_port">Porta SMTP</Label>
                                            <Input
                                                id="smtp_port"
                                                name="smtp_port"
                                                type="number"
                                                value={formData.smtp_port}
                                                onChange={handleInputChange}
                                                min="1"
                                                max="65535"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="smtp_username">Usuário SMTP</Label>
                                            <Input
                                                id="smtp_username"
                                                name="smtp_username"
                                                value={formData.smtp_username}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="smtp_password">Senha SMTP</Label>
                                            <Input
                                                id="smtp_password"
                                                name="smtp_password"
                                                type="password"
                                                value={formData.smtp_password}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="smtp_encryption">Criptografia</Label>
                                        <select
                                            id="smtp_encryption"
                                            name="smtp_encryption"
                                            value={formData.smtp_encryption}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="tls">TLS</option>
                                            <option value="ssl">SSL</option>
                                            <option value="">Nenhuma</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Status do Sistema */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Database className="h-5 w-5 mr-2" />
                                        Status do Sistema
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Modo Manutenção</span>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="maintenance_mode"
                                                    name="maintenance_mode"
                                                    checked={formData.maintenance_mode}
                                                    onChange={handleInputChange}
                                                    className="rounded"
                                                />
                                                <Badge className={formData.maintenance_mode ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                                                    {formData.maintenance_mode ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">Debug Mode</span>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="debug_mode"
                                                    name="debug_mode"
                                                    checked={formData.debug_mode}
                                                    onChange={handleInputChange}
                                                    className="rounded"
                                                />
                                                <Badge className={formData.debug_mode ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}>
                                                    {formData.debug_mode ? 'Ativo' : 'Inativo'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <Label htmlFor="backup_frequency">Frequência de Backup</Label>
                                        <select
                                            id="backup_frequency"
                                            name="backup_frequency"
                                            value={formData.backup_frequency}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="daily">Diário</option>
                                            <option value="weekly">Semanal</option>
                                            <option value="monthly">Mensal</option>
                                        </select>
                                        
                                        <Button type="button" variant="outline" className="w-full mt-3" onClick={handleBackup}>
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Backup Manual
                                        </Button>
                                    </div>
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
                                        Salvar Configurações
                                    </Button>
                                    
                                    <Button type="button" variant="outline" className="w-full">
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Restaurar Padrão
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
