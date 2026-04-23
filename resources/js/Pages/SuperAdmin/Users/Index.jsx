import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { 
    Users, 
    Building, 
    Mail, 
    Calendar,
    Search,
    UserPlus,
    Eye,
    Edit,
    Trash2,
    Shield,
    UserCheck,
    Settings
} from 'lucide-react';
import { Link, router } from '@inertiajs/react';

export default function UsersIndex({ users, stats }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.hotel?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        const matchesStatus = filterStatus === 'all' || 
                             (filterStatus === 'active' && user.is_active) ||
                             (filterStatus === 'inactive' && !user.is_active);
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleBadge = (role) => {
        const roleMap = {
            'super_admin': { label: 'Super Admin', className: 'bg-purple-100 text-purple-800', icon: Shield },
            'hotel_admin': { label: 'Admin Hotel', className: 'bg-blue-100 text-blue-800', icon: Settings },
            'receptionist': { label: 'Recepcionista', className: 'bg-green-100 text-green-800', icon: UserCheck }
        };
        return roleMap[role] || { label: role, className: 'bg-gray-100 text-gray-800', icon: Users };
    };

    const getStatusBadge = (isActive) => {
        return {
            label: isActive ? 'Ativo' : 'Inativo',
            className: isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        };
    };

    const toggleUserStatus = (userId) => {
        if (confirm('Tem certeza que deseja alterar o status deste usuário?')) {
            router.post(`/superadmin/users/${userId}/toggle-status`);
        }
    };

    return (
        <AuthenticatedLayout header="Gestão de Usuários">
            <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Shield className="h-8 w-8 text-purple-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Super Admin</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.super_admin_count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <Settings className="h-8 w-8 text-blue-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Admins Hotel</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.hotel_admin_count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <UserCheck className="h-8 w-8 text-green-600" />
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Recepcionistas</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.receptionist_count}</p>
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
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full sm:w-80"
                            />
                        </div>
                        
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos Cargos</option>
                            <option value="super_admin">Super Admin</option>
                            <option value="hotel_admin">Admin Hotel</option>
                            <option value="receptionist">Recepcionista</option>
                        </select>
                        
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Todos Status</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                    
                    <Link href={route('superadmin.users.create')}>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Novo Usuário
                        </Button>
                    </Link>
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Usuários Cadastrados</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuário
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Cargo
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hotel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Último Login
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.map((user) => {
                                        const roleBadge = getRoleBadge(user.role);
                                        const statusBadge = getStatusBadge(user.is_active);
                                        const RoleIcon = roleBadge.icon;
                                        
                                        return (
                                            <tr key={user.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10">
                                                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 flex items-center">
                                                                <Mail className="h-3 w-3 mr-1" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={roleBadge.className}>
                                                        <RoleIcon className="h-3 w-3 mr-1" />
                                                        {roleBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.hotel ? (
                                                        <div className="flex items-center">
                                                            <Building className="h-4 w-4 mr-1 text-gray-400" />
                                                            {user.hotel.name}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={statusBadge.className}>
                                                        {statusBadge.label}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {user.last_login_at ? (
                                                        <div className="flex items-center">
                                                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                                            {new Date(user.last_login_at).toLocaleDateString('pt-BR')}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">Nunca</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.visit(route('superadmin.users.edit', user.id))}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => toggleUserStatus(user.id)}
                                                            className={user.is_active ? 'text-red-600' : 'text-green-600'}
                                                        >
                                                            {user.is_active ? (
                                                                <Trash2 className="h-4 w-4" />
                                                            ) : (
                                                                <UserCheck className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-8">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        Nenhum usuário encontrado
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Tente ajustar seus filtros ou criar um novo usuário.
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
