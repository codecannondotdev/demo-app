# Prepare vendor files for Laravel
FROM php:8.5-cli-alpine AS vendor

WORKDIR /app

# Install PHP extensions
RUN apk add --no-cache libzip-dev && docker-php-ext-install zip;

# Install composer and dependencies
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/composer-cache,id=composer-cache \
    composer install --no-interaction --no-progress --no-scripts --no-autoloader;

# Copy project files so we can optimize
COPY . .

# Dump autoload and optimize
RUN composer dump-autoload --optimize;
RUN php artisan optimize;

#------------------------------------------------------------------------------

# Prepare runtime base
FROM dunglas/frankenphp:1.9-php8.4 AS runtime-base

# Create non root user for dropped privileges at runtime
RUN \
	groupadd codecannon -g 1000; \
	useradd codecannon -u 1000 -g 1000; \
	# Add additional capability to bind to port 80 and 443
	setcap CAP_NET_BIND_SERVICE=+eip /usr/local/bin/frankenphp; \
	# Give write access to /config/caddy and /data/caddy
	chown -R codecannon:codecannon /config/caddy /data/caddy /app && \
	chmod 775 /app;

# Install system dependencies for PHP extensions and Composer
RUN apt-get update && apt-get install -y \
	libzip-dev \
	libpng-dev \
	libjpeg-dev \
	libfreetype-dev \
	libonig-dev;

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
	&& docker-php-ext-install pdo pdo_mysql gd opcache zip mbstring exif pcntl bcmath \
	&& install-php-extensions zlib ffi protobuf;

USER codecannon:codecannon
WORKDIR /app

# Add project files
COPY --chown=codecannon:codecannon --from=vendor /app/vendor /app/vendor
COPY --chown=codecannon:codecannon . .

# Create .env file
RUN cp .env.production.example .env;

#------------------------------------------------------------------------------

# Prepare local development runtime
FROM runtime-base AS runtime-local

# Disable https. We don't need it locally.
ENV SERVER_NAME=:80

# Start with root user so we can use the entrypoint to drop privileges after
# syncing host UID/GID with container user's UID/GID
USER root:root

# copy composer back in for this variant
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Install gosu, required in entrypoint
RUN set -eux; \
	apt-get install --update -y gosu; \
	apt-get dist-clean;

# Add and enable entrypoint
RUN cp $PHP_INI_DIR/php.ini-development $PHP_INI_DIR/php.ini;
RUN cp /app/docker-entrypoint-local.sh /root/docker-entrypoint-local.sh && \
	chmod +x /root/docker-entrypoint-local.sh;
ENTRYPOINT ["/root/docker-entrypoint-local.sh"]

#------------------------------------------------------------------------------

# Prepare production development runtime
FROM runtime-base AS runtime-production

USER root:root

# Disable https. It's handled on the ingress level for simplicity. You can
# review the Caddy/FrankenPHP docs for how to enable it if you need it.
ENV SERVER_NAME=:80

# Enable PHP production settings
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini";

# Preapre initial storage dir
RUN mkdir /storage-initial && chown codecannon:codecannon /storage-initial;

USER codecannon:codecannon
WORKDIR /app

# Make Database
RUN touch /app/storage/database/database.sqlite;

# Make laravel log
RUN touch /app/storage/logs/laravel.log;

# Copy initial storage data to a separate directory
RUN cp -r storage /storage-initial;

# Create production .env file
RUN cp .env.production.example .env;
