# =========================================================
# Stage 1: Build frontend assets (Vite/React/Inertia)
# =========================================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# =========================================================
# Stage 2: Install PHP / Composer dependencies
# =========================================================
FROM composer:2 AS vendor

WORKDIR /app

COPY database/ database/
COPY composer.json composer.lock ./

RUN composer install \
    --no-dev \
    --ignore-platform-reqs \
    --no-interaction \
    --no-plugins \
    --no-scripts \
    --prefer-dist \
    --optimize-autoloader

# =========================================================
# Stage 3: Final runtime image (PHP-FPM + Nginx + Supervisor)
# =========================================================
FROM php:8.3-fpm-alpine

# --- System deps + PHP extensions ---
RUN apk add --no-cache \
        nginx \
        supervisor \
        bash \
        curl \
        gettext \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        libzip-dev \
        oniguruma-dev \
        icu-dev \
        postgresql-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_mysql \
        pdo_pgsql \
        mbstring \
        zip \
        exif \
        pcntl \
        bcmath \
        gd \
        intl \
        opcache

WORKDIR /var/www/html

# --- App code ---
COPY . .

# --- Vendor from composer stage ---
COPY --from=vendor /app/vendor ./vendor

# --- Built frontend assets from node stage ---
COPY --from=frontend /app/public/build ./public/build

# --- Config files ---
COPY docker/nginx.conf /etc/nginx/nginx.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /var/log/nginx /var/log/supervisor \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
    && cp .env.example .env 2>/dev/null || true

EXPOSE 8080

ENTRYPOINT ["entrypoint.sh"]