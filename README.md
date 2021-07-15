docker-compose build

docker-compose up

docker exec -it codeahead_api_1 composer install

docker exec -it codeahead_api_1 chown -R www-data:www-data /var/www/html

docker exec -it codeahead_api_1 php artisan queue:work
