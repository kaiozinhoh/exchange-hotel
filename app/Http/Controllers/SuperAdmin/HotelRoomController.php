<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Hotel;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class HotelRoomController extends Controller
{
    public function index(Hotel $hotel, Request $request)
    {
        $query = Room::query()->where('hotel_id', $hotel->id);

        if ($search = $request->input('search')) {
            $query->where('number', 'like', "%{$search}%");
        }

        $rooms = $query->orderBy('number')->paginate(12)->withQueryString();

        return Inertia::render('SuperAdmin/Hotels/Rooms/Index', [
            'hotel' => $hotel->only(['id', 'name', 'subdomain', 'status']),
            'rooms' => $rooms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(Hotel $hotel)
    {
        return Inertia::render('SuperAdmin/Hotels/Rooms/Form', [
            'hotel' => $hotel->only(['id', 'name']),
        ]);
    }

    public function store(Hotel $hotel, Request $request)
    {
        $validated = $request->validate([
            'number' => [
                'required',
                'string',
                'max:10',
                Rule::unique('rooms', 'number')->where(fn ($q) => $q->where('hotel_id', $hotel->id)),
            ],
            'type' => ['required', 'string', 'in:Standard,Luxo,Suíte Master,Família'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,occupied,cleaning,maintenance'],
        ]);

        Room::create([
            ...$validated,
            'hotel_id' => $hotel->id,
        ]);

        return redirect()->route('superadmin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Quarto criado com sucesso!');
    }

    public function edit(Hotel $hotel, Room $room)
    {
        abort_unless((int) $room->hotel_id === (int) $hotel->id, 404);

        return Inertia::render('SuperAdmin/Hotels/Rooms/Form', [
            'hotel' => $hotel->only(['id', 'name']),
            'room' => $room,
        ]);
    }

    public function update(Hotel $hotel, Room $room, Request $request)
    {
        abort_unless((int) $room->hotel_id === (int) $hotel->id, 404);

        $validated = $request->validate([
            'number' => [
                'required',
                'string',
                'max:10',
                Rule::unique('rooms', 'number')
                    ->ignore($room->id)
                    ->where(fn ($q) => $q->where('hotel_id', $hotel->id)),
            ],
            'type' => ['required', 'string', 'in:Standard,Luxo,Suíte Master,Família'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,occupied,cleaning,maintenance'],
        ]);

        $room->update($validated);

        return redirect()->route('superadmin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Quarto atualizado!');
    }

    public function destroy(Hotel $hotel, Room $room)
    {
        abort_unless((int) $room->hotel_id === (int) $hotel->id, 404);

        $hasActiveReservations = $room->reservations()
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'completed')
            ->where('check_out', '>=', now())
            ->exists();

        if ($hasActiveReservations) {
            return back()->with('error', 'Não é possível excluir este quarto pois existem reservas ativas ou futuras vinculadas a ele.');
        }

        $room->delete();

        return redirect()->route('superadmin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Quarto removido.');
    }

    public function bulkStore(Hotel $hotel, Request $request)
    {
        $validated = $request->validate([
            'rooms' => ['required', 'array', 'min:1', 'max:300'],
            'rooms.*.number' => [
                'required',
                'string',
                'max:10',
                'distinct',
                Rule::unique('rooms', 'number')->where(fn ($q) => $q->where('hotel_id', $hotel->id)),
            ],
            'rooms.*.type' => ['required', 'string', 'in:Standard,Luxo,Suíte Master,Família'],
            'rooms.*.price_per_night' => ['required', 'numeric', 'min:0'],
            'rooms.*.status' => ['required', 'string', 'in:available,occupied,cleaning,maintenance'],
        ]);

        $payload = collect($validated['rooms'])
            ->map(fn ($r) => [
                'hotel_id' => $hotel->id,
                'number' => $r['number'],
                'type' => $r['type'],
                'price_per_night' => $r['price_per_night'],
                'status' => $r['status'],
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->values()
            ->all();

        Room::insert($payload);

        return redirect()->route('superadmin.hotels.rooms.index', $hotel->id)
            ->with('success', 'Quartos criados em massa com sucesso!');
    }

    public function bulkUpdate(Hotel $hotel, Request $request)
    {
        $validated = $request->validate([
            'room_ids' => ['required', 'array', 'min:1', 'max:300'],
            'room_ids.*' => ['integer'],

            // Aplica os mesmos valores em todos os selecionados
            'type' => ['nullable', 'string', 'in:Standard,Luxo,Suíte Master,Família'],
            'price_per_night' => ['nullable', 'numeric', 'min:0'],
            'status' => ['nullable', 'string', 'in:available,occupied,cleaning,maintenance'],
        ]);

        $changes = collect($validated)->only(['type', 'price_per_night', 'status'])->filter(fn ($v) => $v !== null)->all();
        if (empty($changes)) {
            return back()->with('error', 'Nenhuma alteração informada para aplicar.');
        }

        Room::query()
            ->where('hotel_id', $hotel->id)
            ->whereIn('id', $validated['room_ids'])
            ->update([
                ...$changes,
                'updated_at' => now(),
            ]);

        return back()->with('success', 'Quartos atualizados em massa!');
    }

    public function bulkDestroy(Hotel $hotel, Request $request)
    {
        $validated = $request->validate([
            'room_ids' => ['required', 'array', 'min:1', 'max:300'],
            'room_ids.*' => ['integer'],
        ]);

        $rooms = Room::query()
            ->where('hotel_id', $hotel->id)
            ->whereIn('id', $validated['room_ids'])
            ->get();

        $blocked = [];

        foreach ($rooms as $room) {
            $hasActiveReservations = $room->reservations()
                ->where('status', '!=', 'cancelled')
                ->where('status', '!=', 'completed')
                ->where('check_out', '>=', now())
                ->exists();

            if ($hasActiveReservations) {
                $blocked[] = $room->number;
                continue;
            }

            $room->delete();
        }

        if (!empty($blocked)) {
            return back()->with('error', 'Alguns quartos não puderam ser excluídos por terem reservas ativas/futuras: ' . implode(', ', $blocked));
        }

        return back()->with('success', 'Quartos excluídos em massa!');
    }
}

