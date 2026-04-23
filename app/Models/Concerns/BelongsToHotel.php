<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

trait BelongsToHotel
{
    protected static array $hotelColumnCache = [];

    public static function bootBelongsToHotel(): void
    {
        static::addGlobalScope('hotel', function (Builder $builder) {
            $user = Auth::user();

            if (!$user || $user->role === 'super_admin') {
                return;
            }

            $model = $builder->getModel();
            if (!$model->usesHotelColumn()) {
                return;
            }

            $builder->where($model->qualifyColumn('hotel_id'), $user->hotel_id);
        });

        static::creating(function ($model) {
            $user = Auth::user();

            if (!$user || $user->role === 'super_admin') {
                return;
            }

            if ($model->usesHotelColumn() && empty($model->hotel_id)) {
                $model->hotel_id = $user->hotel_id;
            }
        });
    }

    protected function usesHotelColumn(): bool
    {
        $class = static::class;

        if (array_key_exists($class, self::$hotelColumnCache)) {
            return self::$hotelColumnCache[$class];
        }

        return self::$hotelColumnCache[$class] = Schema::hasColumn($this->getTable(), 'hotel_id');
    }
}
