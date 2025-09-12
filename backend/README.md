## Comandos

Rodar container: 

`sudo docker-compose up -d`

Testar se container está funcionando: 

`sudo docker ps`

Abrir terminal do php:

`php artisan tinker`

Testar conexão:

`DB::connection()->getPdo();`

Ver containers rodando
`sudo docker ps`

Parar o banco
`sudo docker-compose down`

Iniciar novamente
`sudo docker-compose up -d`

Ver logs do banco
`sudo docker logs laravel_postgres`
