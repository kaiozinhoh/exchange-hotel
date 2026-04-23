<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ConsumptionController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\ChannelController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rota inicial
Route::get('/', function () {
    return redirect()->route('login');
});

// Login, recuperação de senha, etc. (middleware guest/auth está em routes/auth.php)
require __DIR__.'/auth.php';

// Rotas Super Admin (acesso global)
Route::middleware(['auth'])->prefix('superadmin')->name('superadmin.')->group(function () {
    Route::get('/dashboard', [SuperAdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/hotels', [SuperAdminController::class, 'hotels'])->name('hotels');
    Route::get('/hotels/create', [SuperAdminController::class, 'createHotel'])->name('hotels.create');
    Route::post('/hotels', [SuperAdminController::class, 'storeHotel'])->name('hotels.store');
    Route::get('/hotels/{hotel}/edit', [SuperAdminController::class, 'editHotel'])->name('hotels.edit');
    Route::put('/hotels/{hotel}', [SuperAdminController::class, 'updateHotel'])->name('hotels.update');
    Route::post('/hotels/{hotel}/toggle-status', [SuperAdminController::class, 'toggleHotelStatus'])->name('hotels.toggle-status');
    Route::post('/hotels/{hotel}/extend-trial', [SuperAdminController::class, 'extendTrial'])->name('hotels.extend-trial');
    
    Route::get('/users', [SuperAdminController::class, 'users'])->name('users');
    Route::get('/users/create', [SuperAdminController::class, 'createUser'])->name('users.create');
    Route::post('/users', [SuperAdminController::class, 'storeUser'])->name('users.store');
    Route::get('/users/{user}/edit', [SuperAdminController::class, 'editUser'])->name('users.edit');
    Route::put('/users/{user}', [SuperAdminController::class, 'updateUser'])->name('users.update');
    Route::post('/users/{user}/toggle-status', [SuperAdminController::class, 'toggleUserStatus'])->name('users.toggle-status');
    Route::get('/analytics', [SuperAdminController::class, 'analytics'])->name('analytics');
    
    // Configurações do SaaS
    Route::get('/settings', [SuperAdminController::class, 'settings'])->name('settings.index');
    Route::patch('/settings', [SuperAdminController::class, 'updateSettings'])->name('settings.update');
});

// Rotas do Tenant (sem middleware tenant temporariamente)
Route::middleware(['auth'])->group(function () {

    // Perfil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Operacional (Todos acessam)
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('guests', GuestController::class);
    Route::resource('rooms', RoomController::class);
    Route::resource('reservations', ReservationController::class);
    Route::post('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('/reservations/{reservation}/checkin', [ReservationController::class, 'checkin'])->name('reservations.checkin');
    Route::post('/reservations/{reservation}/checkout', [ReservationController::class, 'checkout'])->name('reservations.checkout');

    Route::get('/calendar', [CalendarController::class, 'index'])->name('calendar.index');
    Route::resource('products', ProductController::class);

    // Ações Específicas
    Route::post('/products/{product}/stock', [ProductController::class, 'addStock'])->name('products.addStock');
    Route::post('/reservations/{reservation}/consumption', [ConsumptionController::class, 'store'])->name('consumption.store');
    Route::delete('/consumption/{id}', [ConsumptionController::class, 'destroy'])->name('consumption.destroy');
    Route::post('/reservations/{reservation}/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // PDF (Qualquer um pode gerar recibo se tiver acesso à reserva)
    Route::get('/receipt/{id}', [ReceiptController::class, 'show'])->name('receipt.show');

    // --- ÁREA RESTRITA (APENAS ADMIN DO HOTEL) ---
    Route::middleware(['auth'])->group(function () {
        Route::get('/financial', [FinancialController::class, 'index'])->name('financial.index');
        Route::get('/settings', [SettingController::class, 'edit'])->name('settings.edit');
        Route::patch('/settings', [SettingController::class, 'update'])->name('settings.update');
        Route::resource('users', UserController::class);
        
        // Channel Manager
        Route::get('/channels', [ChannelController::class, 'index'])->name('channels.index');
        Route::get('/channels/create', [ChannelController::class, 'create'])->name('channels.create');
        Route::post('/channels', [ChannelController::class, 'store'])->name('channels.store');
        Route::get('/channels/{channel}/edit', [ChannelController::class, 'edit'])->name('channels.edit');
        Route::patch('/channels/{channel}', [ChannelController::class, 'update'])->name('channels.update');
        Route::delete('/channels/{channel}', [ChannelController::class, 'destroy'])->name('channels.destroy');
        Route::post('/channels/{channel}/sync', [ChannelController::class, 'sync'])->name('channels.sync');
        Route::post('/channels/{channel}/test', [ChannelController::class, 'testConnection'])->name('channels.test');
        Route::post('/channels/{channel}/toggle', [ChannelController::class, 'toggleStatus'])->name('channels.toggle');
    });
});
