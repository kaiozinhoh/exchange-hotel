import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { PlusCircle, Pencil, Trash2, BedDouble, ArrowLeft } from "lucide-react";

const getStatusConfig = (status) => {
    const map = {
        'available': { label: 'Disponível', className: 'bg-green-600 hover:bg-green-700 text-white' },
        'occupied': { label: 'Ocupado', className: 'bg-red-600 hover:bg-red-700 text-white' },
        'cleaning': { label: 'Limpeza', className: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
        'maintenance': { label: 'Manutenção', className: 'bg-gray-500 hover:bg-gray-600 text-white' },
    };
    return map[status] || map.available;
};

export default function SuperAdminHotelRoomsIndex({ hotel, rooms }) {
    const handleDelete = (roomId) => {
        if (confirm('Remover este quarto?')) {
            router.delete(route('superadmin.hotels.rooms.destroy', [hotel.id, roomId]));
        }
    };

    return (
        <AuthenticatedLayout
            header={`Quartos - ${hotel.name}`}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-4">
                        <Link href={route('superadmin.hotels.edit', hotel.id)}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Voltar para o Hotel
                            </Button>
                        </Link>
                        <Link href={route('superadmin.hotels.rooms.create', hotel.id)}>
                            <Button>
                                <PlusCircle className="w-4" />Novo Quarto
                            </Button>
                        </Link>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Quartos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {rooms.data.map((room) => {
                                    const status = getStatusConfig(room.status);
                                    return (
                                        <div key={room.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
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
                                                <p className="font-medium text-gray-700">{room.type}</p>
                                                <p className="text-gray-900 font-bold mt-1">
                                                    R$ {parseFloat(room.price_per_night).toFixed(2)} <span className="text-xs font-normal text-gray-500">/ noite</span>
                                                </p>
                                            </div>

                                            <div className="flex gap-2 mt-auto pt-4 border-t">
                                                <Link href={route('superadmin.hotels.rooms.edit', [hotel.id, room.id])} className="w-full">
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        <Pencil className="h-3 w-3 mr-2" /> Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(room.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {rooms.data.length === 0 && (
                                <div className="text-center py-10 text-gray-500">
                                    Nenhum quarto cadastrado para este hotel.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

