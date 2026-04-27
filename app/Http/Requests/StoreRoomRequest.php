<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRoomRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        if (!$user) {
            return false;
        }

        // Criar quarto: somente dono do SaaS (super_admin)
        if ($this->isMethod('post')) {
            return $user->isSuperAdmin();
        }

        // Editar quarto: super_admin ou dono do hotel (hotel_admin) do mesmo hotel
        $room = $this->route('room');
        if (!$room) {
            return $user->isSuperAdmin();
        }

        if ($user->isSuperAdmin()) {
            return true;
        }

        return $user->isHotelAdmin() && (int) $user->hotel_id === (int) $room->hotel_id;
    }

    public function rules(): array
    {
        $roomId = $this->route('room') ? $this->route('room')->id : null;
        $hotelId = $this->user()?->hotel_id;

        return [
            'number' => [
                'required',
                'string',
                'max:10',
                Rule::unique('rooms', 'number')
                    ->ignore($roomId)
                    ->where(fn ($query) => $query->where('hotel_id', $hotelId)),
            ],
            'type' => ['required', 'string', 'in:Standard,Luxo,Suíte Master'], // Pode personalizar
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'status' => ['required', 'string', 'in:available,occupied,cleaning,maintenance'],
        ];
    }
}
