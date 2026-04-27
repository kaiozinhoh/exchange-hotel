import React, { useMemo, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router } from '@inertiajs/react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { PlusCircle, Pencil, Trash2, BedDouble, ArrowLeft } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

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
    const [selectedIds, setSelectedIds] = useState(() => new Set());
    const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);
    const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
    const [bulkText, setBulkText] = useState('');

    const [bulkDefaults, setBulkDefaults] = useState({
        type: 'Standard',
        price_per_night: '',
        status: 'available',
    });

    const [bulkEdit, setBulkEdit] = useState({
        type: '',
        price_per_night: '',
        status: '',
    });

    const selectedCount = selectedIds.size;

    const allIdsOnPage = useMemo(() => rooms.data.map(r => String(r.id)), [rooms.data]);
    const isAllOnPageSelected = useMemo(() => {
        if (allIdsOnPage.length === 0) return false;
        return allIdsOnPage.every(id => selectedIds.has(id));
    }, [allIdsOnPage, selectedIds]);

    const toggleSelectAllOnPage = () => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (isAllOnPageSelected) {
                allIdsOnPage.forEach(id => next.delete(id));
            } else {
                allIdsOnPage.forEach(id => next.add(id));
            }
            return next;
        });
    };

    const toggleOne = (id) => {
        const sid = String(id);
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(sid)) next.delete(sid);
            else next.add(sid);
            return next;
        });
    };

    const parseBulkRooms = () => {
        const lines = bulkText
            .split('\n')
            .map(l => l.trim())
            .filter(Boolean);

        const out = [];

        for (const line of lines) {
            // Aceita:
            // - "101"
            // - "101-110"
            // - "101;Luxo;250;available"
            // - "101, Luxo, 250, available"
            const normalized = line.replace(/,/g, ';');
            const parts = normalized.split(';').map(p => p.trim()).filter(Boolean);

            if (parts.length === 1 && parts[0].includes('-')) {
                const [a, b] = parts[0].split('-').map(x => x.trim());
                const start = Number(a);
                const end = Number(b);
                if (!Number.isFinite(start) || !Number.isFinite(end) || start <= 0 || end < start) {
                    throw new Error(`Intervalo inválido: "${line}"`);
                }
                for (let n = start; n <= end; n++) {
                    out.push({
                        number: String(n),
                        type: bulkDefaults.type,
                        price_per_night: bulkDefaults.price_per_night,
                        status: bulkDefaults.status,
                    });
                }
                continue;
            }

            const number = parts[0];
            const type = parts[1] ?? bulkDefaults.type;
            const price = parts[2] ?? bulkDefaults.price_per_night;
            const status = parts[3] ?? bulkDefaults.status;

            out.push({
                number,
                type,
                price_per_night: price,
                status,
            });
        }

        return out;
    };

    const handleDelete = (roomId) => {
        if (confirm('Remover este quarto?')) {
            router.delete(route('superadmin.hotels.rooms.destroy', [hotel.id, roomId]));
        }
    };

    const handleBulkDelete = () => {
        if (selectedCount === 0) return;
        if (!confirm(`Excluir ${selectedCount} quarto(s) selecionado(s)?`)) return;

        router.delete(route('superadmin.hotels.rooms.bulkDestroy', hotel.id), {
            data: { room_ids: Array.from(selectedIds) },
            onSuccess: () => setSelectedIds(new Set()),
        });
    };

    const handleBulkCreate = () => {
        const parsed = parseBulkRooms();
        if (parsed.length === 0) return;

        router.post(route('superadmin.hotels.rooms.bulkStore', hotel.id), { rooms: parsed }, {
            onSuccess: () => {
                setIsBulkCreateOpen(false);
                setBulkText('');
            }
        });
    };

    const handleBulkEdit = () => {
        if (selectedCount === 0) return;
        const payload = {};
        if (bulkEdit.type) payload.type = bulkEdit.type;
        if (bulkEdit.status) payload.status = bulkEdit.status;
        if (bulkEdit.price_per_night !== '') payload.price_per_night = bulkEdit.price_per_night;

        router.patch(route('superadmin.hotels.rooms.bulkUpdate', hotel.id), {
            room_ids: Array.from(selectedIds),
            ...payload,
        }, {
            onSuccess: () => setIsBulkEditOpen(false),
        });
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
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => setIsBulkCreateOpen(true)}>
                                Criar em massa
                            </Button>
                            <Button variant="outline" disabled={selectedCount === 0} onClick={() => setIsBulkEditOpen(true)}>
                                Editar em massa {selectedCount > 0 ? `(${selectedCount})` : ''}
                            </Button>
                            <Button variant="destructive" disabled={selectedCount === 0} onClick={handleBulkDelete}>
                                Excluir selecionados {selectedCount > 0 ? `(${selectedCount})` : ''}
                            </Button>
                            <Link href={route('superadmin.hotels.rooms.create', hotel.id)}>
                                <Button>
                                    <PlusCircle className="w-4" />Novo Quarto
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Quartos</CardTitle>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <input
                                    type="checkbox"
                                    checked={isAllOnPageSelected}
                                    onChange={toggleSelectAllOnPage}
                                />
                                <span>Selecionar página</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {rooms.data.map((room) => {
                                    const status = getStatusConfig(room.status);
                                    return (
                                        <div key={room.id} className="border rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition-shadow bg-white">
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="flex items-center gap-2 text-sm text-gray-600">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIds.has(String(room.id))}
                                                        onChange={() => toggleOne(room.id)}
                                                    />
                                                    Selecionar
                                                </label>
                                            </div>
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

            {/* Modal Bulk Create */}
            {isBulkCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Criar quartos em massa</h3>
                            <button onClick={() => setIsBulkCreateOpen(false)} className="text-gray-300 hover:text-white">Fechar</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label>Tipo padrão</Label>
                                    <Select value={bulkDefaults.type} onValueChange={(val) => setBulkDefaults(prev => ({ ...prev, type: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Standard">Standard</SelectItem>
                                            <SelectItem value="Luxo">Luxo</SelectItem>
                                            <SelectItem value="Suíte Master">Suíte Master</SelectItem>
                                            <SelectItem value="Família">Família</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Preço padrão (R$)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        value={bulkDefaults.price_per_night}
                                        onChange={(e) => setBulkDefaults(prev => ({ ...prev, price_per_night: e.target.value }))}
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <Label>Status padrão</Label>
                                    <Select value={bulkDefaults.status} onValueChange={(val) => setBulkDefaults(prev => ({ ...prev, status: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponível</SelectItem>
                                            <SelectItem value="occupied">Ocupado</SelectItem>
                                            <SelectItem value="cleaning">Limpeza</SelectItem>
                                            <SelectItem value="maintenance">Manutenção</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label>Linhas (1 por quarto)</Label>
                                <textarea
                                    className="w-full min-h-[180px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={bulkText}
                                    onChange={(e) => setBulkText(e.target.value)}
                                    placeholder={`Exemplos:\n101\n102\n201-210\n301;Luxo;250;available\n302, Standard, 180, cleaning`}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    Você pode informar só o número (usa padrão), intervalo (ex: 201-220) ou completo (número;tipo;preço;status).
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setIsBulkCreateOpen(false)}>Cancelar</Button>
                                <Button onClick={handleBulkCreate} className="bg-blue-600 hover:bg-blue-700">Criar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Bulk Edit */}
            {isBulkEditOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden">
                        <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <h3 className="text-xl font-bold">Editar em massa ({selectedCount})</h3>
                            <button onClick={() => setIsBulkEditOpen(false)} className="text-gray-300 hover:text-white">Fechar</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Tipo (opcional)</Label>
                                    <Select value={bulkEdit.type} onValueChange={(val) => setBulkEdit(prev => ({ ...prev, type: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Não alterar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Standard">Standard</SelectItem>
                                            <SelectItem value="Luxo">Luxo</SelectItem>
                                            <SelectItem value="Suíte Master">Suíte Master</SelectItem>
                                            <SelectItem value="Família">Família</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Status (opcional)</Label>
                                    <Select value={bulkEdit.status} onValueChange={(val) => setBulkEdit(prev => ({ ...prev, status: val }))}>
                                        <SelectTrigger><SelectValue placeholder="Não alterar" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponível</SelectItem>
                                            <SelectItem value="occupied">Ocupado</SelectItem>
                                            <SelectItem value="cleaning">Limpeza</SelectItem>
                                            <SelectItem value="maintenance">Manutenção</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div>
                                <Label>Preço da diária (opcional)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={bulkEdit.price_per_night}
                                    onChange={(e) => setBulkEdit(prev => ({ ...prev, price_per_night: e.target.value }))}
                                    placeholder="Deixe vazio para não alterar"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button variant="outline" onClick={() => setIsBulkEditOpen(false)}>Cancelar</Button>
                                <Button onClick={handleBulkEdit} className="bg-blue-600 hover:bg-blue-700">Aplicar</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

