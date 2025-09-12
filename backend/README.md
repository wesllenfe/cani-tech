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

Criar migrations

`php artisan make:migration create_nome_da_tabela_table`

Executar migrations

`php artisan migrate

Migrations limpas:

`php artisan migrate:fresh`

Com seeders

`php artisan migrate:fresh --seed``
