import React, { useState, useMemo } from 'react';
import { Search, User, Phone, Mail, CreditCard } from 'lucide-react';

const GuestSearch = ({ guests, selectedGuest, onGuestSelect, placeholder = "Buscar hóspede..." }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const filteredGuests = useMemo(() => {
        if (!searchQuery) return guests?.slice(0, 10) || [];
        
        const query = searchQuery.toLowerCase();
        return guests?.filter(guest => 
            guest.name?.toLowerCase().includes(query) ||
            guest.document_number?.toLowerCase().includes(query) ||
            guest.phone?.toLowerCase().includes(query) ||
            guest.email?.toLowerCase().includes(query)
        ).slice(0, 20) || [];
    }, [guests, searchQuery]);

    const selectedGuestData = guests?.find(g => String(g.id) === String(selectedGuest));

    const handleGuestSelect = (guest) => {
        onGuestSelect(String(guest.id));
        setSearchQuery('');
        setIsOpen(false);
    };

    const formatDocument = (guest) => {
        if (guest.document_number) {
            return `${guest.document_type || 'Doc'}: ${guest.document_number}`;
        }
        return guest.document ? `Doc: ${guest.document}` : 'Sem Doc';
    };

    return (
        <div className="relative">
            {/* Campo de Busca */}
            <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="hotel-form-input pl-10 pr-10"
                />
                {selectedGuestData && (
                    <button
                        onClick={() => {
                            onGuestSelect('');
                            setSearchQuery('');
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                        ×
                    </button>
                )}
            </div>

            {/* Hóspede Selecionado */}
            {selectedGuestData && !searchQuery && (
                <div className="mt-2 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <div className="font-medium text-foreground text-sm">{selectedGuestData.name}</div>
                                <div className="text-xs text-muted-foreground">{formatDocument(selectedGuestData)}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                onGuestSelect('');
                            }}
                            className="text-destructive hover:text-destructive/80 text-sm"
                        >
                            Remover
                        </button>
                    </div>
                </div>
            )}

            {/* Dropdown de Resultados */}
            {isOpen && searchQuery && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-card border border-border rounded-lg shadow-hotel max-h-80 overflow-y-auto">
                        {filteredGuests.length > 0 ? (
                            <div className="py-1">
                                {filteredGuests.map((guest) => (
                                    <div
                                        key={guest.id}
                                        onClick={() => handleGuestSelect(guest)}
                                        className="px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-primary" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-foreground text-sm truncate">
                                                    {guest.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDocument(guest)}
                                                </div>
                                                {(guest.phone || guest.email) && (
                                                    <div className="flex items-center space-x-4 mt-1">
                                                        {guest.phone && (
                                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                                                <Phone className="w-3 h-3" />
                                                                <span>{guest.phone}</span>
                                                            </div>
                                                        )}
                                                        {guest.email && (
                                                            <div className="flex items-center space-x-1 text-xs text-muted-foreground truncate">
                                                                <Mail className="w-3 h-3" />
                                                                <span className="truncate">{guest.email}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-muted-foreground">
                                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Nenhum hóspede encontrado</p>
                                <p className="text-xs mt-1">Tente buscar por nome, documento ou telefone</p>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default GuestSearch;
