I made a mistake... <br />

At this moment to make it work you have to edit .env file, set you ip.

Then run commands

cd front

npm run build

docker-compose build

docker-compose up

docker exec -it codeahead_api_1 composer install

docker exec -it codeahead_api_1 chown -R www-data:www-data /var/www/html

docker exec -it codeahead_api_1 php artisan queue:work
