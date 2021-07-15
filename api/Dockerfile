FROM php:8.0-apache

RUN rm /etc/apache2/sites-available/000-default.conf
COPY 000-default.conf /etc/apache2/sites-available/

RUN apt-get update && apt-get install -y \
    zlib1g-dev \
    libzip-dev

RUN docker-php-ext-install zip

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

COPY . /var/www/html

WORKDIR /var/www/html

RUN a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html

CMD ["apache2-foreground"]
