# Escolhe a imagem PHP com extensions necessárias
FROM php:8.2-fpm

# Instala extensões do PHP e composer
RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git \
    && docker-php-ext-install pdo pdo_mysql

# Instala Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copia código do Laravel
WORKDIR /var/www/html
COPY . .

# Instala dependências do Laravel
RUN composer install --no-dev --optimize-autoloader

# Expose porta do PHP-FPM
EXPOSE 9000

# Start command
CMD ["php-fpm"]
