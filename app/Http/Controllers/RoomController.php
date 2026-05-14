<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Http\Requests\StoreRoomRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query();
        
        // Filtro de busca por número ou tipo
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('number', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }
        
        // Filtro por status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Recupera TODOS os quartos (sem paginação) ou com paginação maior
        // Opção 1: Todos os quartos (recomendado para não perder nenhum)
        $rooms = $query->orderBy('number', 'asc')->get();
        
        // Opção 2: Paginação com limite maior (se preferir manter paginação)
        // $rooms = $query->orderBy('number', 'asc')->paginate(100);
        
        // Opção 3: Paginação com número variável via request
        // $perPage = $request->input('per_page', 50);
        // $rooms = $query->orderBy('number', 'asc')->paginate($perPage);

        // --- LÓGICA DE STATUS DINÂMICO OTIMIZADA ---
        $rooms = $this->updateRoomStatuses($rooms);

        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms, // Se for get(), retorna Collection; se for paginate(), retorna LengthAwarePaginator
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Atualiza os status dos quartos baseado em reservas ativas
     * Otimizado com eager loading para evitar N+1 queries
     */
    private function updateRoomStatuses($rooms)
    {
        // Se for paginator, pega a collection
        $roomsCollection = $rooms instanceof \Illuminate\Pagination\LengthAwarePaginator 
            ? $rooms->getCollection() 
            : $rooms;
        
        // Carrega todas as reservas ativas de uma vez (Eager Loading)
        $today = now()->format('Y-m-d');
        
        $roomsCollection->each(function ($room) use ($today) {
            // Mantém status de manutenção/limpeza
            if (in_array($room->status, ['maintenance', 'cleaning'])) {
                return $room;
            }
            
            // Verifica reservas ativas para este quarto
            $hasActiveReservation = $room->reservations()
                ->whereIn('status', ['confirmed', 'checked_in'])
                ->where('check_in', '<=', $today)
                ->where('check_out', '>', $today)
                ->exists();
            
            // Atualiza status baseado na reserva
            $room->status = $hasActiveReservation ? 'occupied' : 'available';
            
            // Se tiver hóspede, carrega informações adicionais (opcional)
            if ($hasActiveReservation) {
                $currentReservation = $room->reservations()
                    ->whereIn('status', ['confirmed', 'checked_in'])
                    ->where('check_in', '<=', $today)
                    ->where('check_out', '>', $today)
                    ->with('guest')
                    ->first();
                
                if ($currentReservation && $currentReservation->guest) {
                    $room->current_guest = $currentReservation->guest->name;
                    $room->check_in = $currentReservation->check_in;
                    $room->check_out = $currentReservation->check_out;
                }
            }
            
            return $room;
        });
        
        // Se era paginator, recoloca a collection atualizada
        if ($rooms instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $rooms->setCollection($roomsCollection);
        }
        
        return $rooms;
    }

    public function create()
    {
        abort_unless(request()->user()?->isSuperAdmin(), 403);
        return Inertia::render('Rooms/Form');
    }

    public function store(StoreRoomRequest $request)
    {
        abort_unless($request->user()?->isSuperAdmin(), 403);
        
        Room::create([
            ...$request->validated(),
            'hotel_id' => $request->user()->hotel_id,
        ]);
        
        return redirect()->route('rooms.index')->with('success', 'Quarto criado com sucesso!');
    }

    public function edit(Room $room)
    {
        return Inertia::render('Rooms/Form', [
            'room' => $room
        ]);
    }

    public function update(StoreRoomRequest $request, Room $room)
    {
        $room->update($request->validated());
        return redirect()->route('rooms.index')->with('success', 'Quarto atualizado!');
    }

    public function destroy(Room $room)
    {
        // TRAVA DE SEGURANÇA melhorada
        $hasActiveReservations = $room->reservations()
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'completed')
            ->where('check_out', '>=', now())
            ->exists();

        if ($hasActiveReservations) {
            return back()->with('error', 'Não é possível excluir este quarto pois existem reservas ativas ou futuras vinculadas a ele.');
        }

        $room->delete();
        return redirect()->route('rooms.index')->with('success', 'Quarto removido.');
    }
    
    /**
     * API endpoint para buscar quartos (opcional - para busca assíncrona)
     */
    public function search(Request $request)
    {
        $query = Room::query();
        
        if ($search = $request->input('search')) {
            $query->where('number', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
        }
        
        $rooms = $query->orderBy('number')->get();
        $rooms = $this->updateRoomStatuses($rooms);
        
        return response()->json($rooms);
    }
}