<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\Hotel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChannelController extends Controller
{
    public function index(Request $request)
    {
        $hotel = $request->user()->hotel;
        $channels = Channel::where('hotel_id', $hotel->id)->get();

        return Inertia::render('Channels/Index', [
            'channels' => $channels,
        ]);
    }

    public function create()
    {
        return Inertia::render('Channels/Create', [
            'availableChannels' => [
                [
                    'code' => 'booking',
                    'name' => 'Booking.com',
                    'description' => 'Conecte com a maior plataforma de reservas do mundo',
                    'features' => ['Sincronização de reservas', 'Atualização de disponibilidade', 'Gestão de preços'],
                ],
                [
                    'code' => 'airbnb',
                    'name' => 'Airbnb',
                    'description' => 'Conecte com a plataforma de aluguel de curta temporada',
                    'features' => ['Sincronização de reservas', 'Atualização de calendário', 'Mensagens de hóspedes'],
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'channel_code' => 'required|in:booking,airbnb',
            'credentials' => 'required|array',
            'settings' => 'nullable|array',
        ]);

        $hotel = $request->user()->hotel;
        
        $channelNames = [
            'booking' => 'Booking.com',
            'airbnb' => 'Airbnb',
        ];

        $channel = Channel::create([
            'hotel_id' => $hotel->id,
            'name' => $channelNames[$request->channel_code],
            'code' => $request->channel_code,
            'credentials' => $request->credentials,
            'settings' => $request->settings ?? [],
        ]);

        return redirect()->route('channels.index')
            ->with('success', "Canal {$channel->name} configurado com sucesso!");
    }

    public function edit(Channel $channel)
    {
        return Inertia::render('Channels/Edit', [
            'channel' => $channel,
        ]);
    }

    public function update(Request $request, Channel $channel)
    {
        $request->validate([
            'credentials' => 'required|array',
            'settings' => 'nullable|array',
        ]);

        $channel->update([
            'credentials' => $request->credentials,
            'settings' => $request->settings ?? [],
        ]);

        return redirect()->route('channels.index')
            ->with('success', "Canal {$channel->name} atualizado com sucesso!");
    }

    public function destroy(Channel $channel)
    {
        $channelName = $channel->name;
        $channel->delete();

        return redirect()->route('channels.index')
            ->with('success', "Canal {$channelName} removido com sucesso!");
    }

    public function sync(Channel $channel)
    {
        try {
            // Se for sandbox, usa a classe de sandbox
            if ($channel->settings['sandbox_mode'] ?? false) {
                $sandboxClass = 'App\\Services\\Channels\\' . ucfirst($channel->code) . 'SandboxChannel';
                if (class_exists($sandboxClass)) {
                    $sandboxService = new $sandboxClass($channel);
                    $result = $sandboxService->syncReservations();
                } else {
                    $result = $channel->syncReservations();
                }
            } else {
                $result = $channel->syncReservations();
            }
            
            $message = "Sincronização concluída! " . count($result['synced']) . " reservas sincronizadas.";
            if (!empty($result['errors'])) {
                $message .= " Erros: " . implode(', ', $result['errors']);
            }

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'Erro na sincronização: ' . $e->getMessage());
        }
    }

    public function testConnection(Channel $channel)
    {
        try {
            $success = $channel->syncReservations(); // Usa o método de teste da classe
            
            if ($success) {
                return back()->with('success', "Conexão com {$channel->name} estabelecida com sucesso!");
            } else {
                return back()->with('error', "Falha ao conectar com {$channel->name}.");
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Erro de conexão: ' . $e->getMessage());
        }
    }

    public function toggleStatus(Channel $channel)
    {
        $channel->update(['is_active' => !$channel->is_active]);
        
        $status = $channel->is_active ? 'ativado' : 'desativado';
        
        return back()->with('success', "Canal {$channel->name} {$status} com sucesso!");
    }
}
