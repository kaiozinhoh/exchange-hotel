import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { 
    PlusCircle, 
    Pencil, 
    Trash2, 
    BedDouble, 
    Search, 
    ArrowUpDown,
    Filter
} from "lucide-react";

// Mapa de Cores/Estilos dos Badges
const getStatusConfig = (status) => {
    const map = {
        'available': { label: 'Disponível', className: 'bg-green-600 hover:bg-green-700 text-white' },
        'occupied': { label: 'Ocupado', className: 'bg-red-600 hover:bg-red-700 text-white' },
        'cleaning': { label: 'Limpeza', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
        'maintenance': { label: 'Manutenção', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    };
    return map[status] || map.available;
};

export default function RoomIndex({ rooms: initialRooms }) {
    const { auth } = usePage().props;
    const canCreateRoom = auth?.user?.role === 'super_admin';
    
    // Estados para busca e ordenação
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [filteredRooms, setFilteredRooms] = useState([]);
    
    // Extrair quartos do objeto de paginação ou array
    const roomsArray = Array.isArray(initialRooms) 
        ? initialRooms 
        : (initialRooms?.data || []);

    // Função para buscar e ordenar quartos
    useEffect(() => {
        let result = [...roomsArray];
        
        // Filtrar por número do quarto ou tipo
        if (searchTerm) {
            result = result.filter(room => 
                room.number.toString().includes(searchTerm) ||
                room.type?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Ordenar por número do quarto
        result.sort((a, b) => {
            const numA = parseInt(a.number);
            const numB = parseInt(b.number);
            return sortOrder === 'asc' ? numA - numB : numB - numA;
        });
        
        setFilteredRooms(result);
    }, [searchTerm, sortOrder, roomsArray]);

    const handleDelete = (id) => {
        if (confirm('Remover este quarto?')) {
            router.delete(route('rooms.destroy', id));
        }
    };

    // Função para limpar busca
    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Acomodações</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                            <CardTitle>Quartos</CardTitle>
                            <div className="flex gap-2 flex-wrap">
                                {/* Campo de busca */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar por número ou tipo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-8 w-64"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={clearSearch}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                                
                                {/* Botão de ordenação */}
                                <Button
                                    variant="outline"
                                    size="default"
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="flex items-center gap-2"
                                >
                                    <ArrowUpDown className="h-4 w-4" />
                                    Quarto {sortOrder === 'asc' ? '1 → N' : 'N → 1'}
                                </Button>
                                
                                {/* Botão novo quarto */}
                                {canCreateRoom && (
                                    <Link href={route('rooms.create')}>
                                        <Button>
                                            <PlusCircle className="w-4 mr-2" />
                                            Novo Quarto
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardHeader>
                        
                        <CardContent>
                            {/* Informações de resultados */}
                            <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
                                <span>
                                    Mostrando {filteredRooms.length} de {roomsArray.length} quartos
                                    {searchTerm && ` (busca: "${searchTerm}")`}
                                </span>
                                {searchTerm && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={clearSearch}
                                        className="text-xs"
                                    >
                                        Limpar busca
                                    </Button>
                                )}
                            </div>

                            {/* Grid de Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredRooms.map((room) => {
                                    const status = getStatusConfig(room.status);
                                    
                                    return (
                                        <div 
                                            key={room.id} 
                                            className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-2 bg-slate-100 rounded-full">
                                                        <BedDouble className="h-5 w-5 text-slate-600" />
                                                    </div>
                                                    <span className="font-bold text-lg">#{room.number}</span>
                                                </div>
                                                <Badge className={status.className}>
                                                    {status.label}
                                                </Badge>
                                            </div>

                                            <div className="text-sm text-gray-500 mb-4 px-1">
                                                <p className="font-medium text-gray-700">{room.type || 'Quarto Standard'}</p>
                                                <p className="text-gray-900 font-bold mt-1">
                                                    R$ {parseFloat(room.price_per_night || 0).toFixed(2)} 
                                                    <span className="text-xs font-normal text-gray-500"> / noite</span>
                                                </p>
                                                {room.capacity && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Capacidade: {room.capacity} pessoas
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-4 border-t">
                                                <Link href={route('rooms.edit', room.id)} className="flex-1">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Pencil className="h-3 w-3 mr-2" /> Editar
                                                    </Button>
                                                </Link>
                                                {canCreateRoom && (
                                                    <Button 
                                                        variant="destructive" 
                                                        size="sm"
                                                        onClick={() => handleDelete(room.id)}
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {filteredRooms.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    {searchTerm 
                                        ? `Nenhum quarto encontrado para "${searchTerm}"`
                                        : 'Nenhum quarto cadastrado.'
                                    }
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}