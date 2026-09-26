#!/bin/bash
set -e

# Render injects PORT at runtime; default to 8080 for local testing
export PORT="${PORT:-8080}"

# Render nginx.conf template with the actual port
envsubst '${PORT}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Generate an app key if one isn't set (safe to run repeatedly)
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force || true
fi

# Cache config/routes/views for production performance
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Ensure storage symlink exists (for public file access)
php artisan storage:link || true

# Run migrations automatically on boot, but only if a DB is actually configured
# (set RUN_MIGRATIONS=false to force-skip even if DB_CONNECTION is set)
if [ -n "$DB_CONNECTION" ] && [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force || true
else
    echo "Skipping migrations (no DB_CONNECTION set or RUN_MIGRATIONS=false)"
fi

# Fix permissions in case volumes reset ownership
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf