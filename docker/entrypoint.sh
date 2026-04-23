#!/bin/sh
set -e

cd /app

if [ ! -f ".env" ]; then
    cp .env.example .env
fi

php artisan key:generate --force >/dev/null 2>&1 || true

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force
fi

php artisan storage:link >/dev/null 2>&1 || true
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

exec frankenphp run --config /etc/caddy/Caddyfile
