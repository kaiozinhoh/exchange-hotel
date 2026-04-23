<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;

class SettingController extends Controller
{
    public function edit()
    {
        $user = auth()->user();
        $hotel = $user?->hotel;

        if (Schema::hasColumn('settings', 'hotel_id')) {
            $setting = Setting::firstOrCreate(['hotel_id' => $hotel?->id], [
                'hotel_name' => 'Nome da Sua Pousada',
                'email' => 'contato@exemplo.com'
            ]);
        } else {
            $setting = Setting::firstOrCreate([], [
                'hotel_name' => 'Nome da Sua Pousada',
                'email' => 'contato@exemplo.com'
            ]);
        }

        // Cada hotel usa sua própria logo salva em hotels.logo_url
        $setting->logo_url = $hotel?->logo_url;

        return Inertia::render('Settings/Edit', [
            'setting' => $setting
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hotel_name' => 'required|string|max:255',
            'logo' => 'nullable|image|max:2048',

            // Aumentei o max para 30 para caber a máscara se necessário, mas vamos limpar
            'cnpj' => 'nullable|string|max:30',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:30',
            'address' => 'nullable|string|max:500',

            // CORREÇÃO: Mudado de numeric para string (aceita "14:00")
            'check_in_time' => 'required|string',
            'check_out_time' => 'required|string',
        ]);

        $hotel = $request->user()->hotel;
        if (Schema::hasColumn('settings', 'hotel_id')) {
            $setting = Setting::firstOrCreate(['hotel_id' => $hotel?->id], [
                'hotel_name' => 'Nome da Sua Pousada',
                'email' => 'contato@exemplo.com'
            ]);
        } else {
            $setting = Setting::firstOrCreate([], [
                'hotel_name' => 'Nome da Sua Pousada',
                'email' => 'contato@exemplo.com'
            ]);
        }
        $data = $validated;

        // --- LIMPEZA DE DADOS (Sanatização) ---
        // Salvar CNPJ e Telefone apenas com números
        if (!empty($data['cnpj'])) {
            $data['cnpj'] = preg_replace('/\D/', '', $data['cnpj']);
        }

        if (!empty($data['phone'])) {
            $data['phone'] = preg_replace('/\D/', '', $data['phone']);
        }
        // ----------------------------------------

        // Lógica de Upload
        if ($request->hasFile('logo')) {
            // Remove arquivo antigo apenas se estiver no disco local /storage
            if ($hotel && $hotel->logo_url && str_contains($hotel->logo_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', parse_url($hotel->logo_url, PHP_URL_PATH) ?? '');
                if (!empty($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $path = $request->file('logo')->store('logos', 'public');

            if ($hotel) {
                $hotel->update([
                    'logo_url' => '/storage/' . $path,
                ]);
            }

            // Mantém compatibilidade antiga, mas não é mais a fonte principal
            $data['logo_path'] = $path;
        }

        unset($data['logo']);

        $setting->update($data);

        return back()->with('success', 'Configurações atualizadas com sucesso!');
    }
}
