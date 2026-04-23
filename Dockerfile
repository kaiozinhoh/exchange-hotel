FROM composer:2 AS vendor

WORKDIR /app
COPY composer.json composer.lock ./
COPY artisan ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader

FROM node:20-alpine AS frontend

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources ./resources
COPY public ./public
COPY vite.config.js ./
RUN npm run build

FROM dunglas/frankenphp:1-php8.3

WORKDIR /app

RUN install-php-extensions pdo_mysql mbstring bcmath intl gd zip opcache pcntl

COPY . .
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data /app/storage /app/bootstrap/cache

ENV APP_ENV=production
ENV APP_DEBUG=false
ENV SERVER_NAME=:8000

EXPOSE 8000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
