# Use a PHP image with FPM
FROM php:8.4-fpm-alpine3.20 AS php

# Install system dependencies for PHP extensions and Composer
RUN apk add --no-cache \
    libpng libpng-dev \
    libjpeg-turbo libjpeg-turbo-dev \
    freetype freetype-dev \
    libzip libzip-dev \
    oniguruma oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_mysql gd opcache zip mbstring exif pcntl bcmath

# Install Composer globally
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy the application's composer.json and composer.lock to /var/www/html
COPY composer.json composer.lock ./

# Install PHP dependencies
RUN composer install --no-scripts --no-autoloader

# Copy the remaining application code
COPY . .

# Finish the composer installation
RUN composer dump-autoload --optimize

# Install Nginx
RUN apk add --no-cache nginx

# Create a directory for Nginx PID file and run directory
RUN mkdir -p /run/nginx

# Copy a custom nginx.conf into the image
COPY nginx.conf /etc/nginx/http.d/default.conf

# Forward request and error logs to Docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Make Database
RUN mkdir /var/www/html/storage/database \
    && touch /var/www/html/storage/database/database.sqlite

# Make laravel log
RUN touch /var/www/html/storage/logs/laravel.log

# Fix permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Copy initial storage data to a separate directory
RUN cp -r storage /storage-initial

# Create .env file
RUN cp .env.production.example .env

# Expose port 80
EXPOSE 80

# Start PHP-FPM and Nginx
CMD php-fpm -D && nginx -g 'daemon off;'
