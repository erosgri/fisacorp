<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateTestDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cria o banco de dados de teste e executa as migrações';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $config = config('database.connections.mysql');
        
        try {
            $pdo = new \PDO(
                "mysql:host={$config['host']};port={$config['port']}",
                $config['username'],
                $config['password']
            );
            $pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);
            
            $pdo->exec('CREATE DATABASE IF NOT EXISTS fisacorp_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
            
            $this->info('Banco de dados "fisacorp_test" criado com sucesso!');
            
            // Executar migrações
            $this->info('Executando migrações...');
            $this->call('migrate', [
                '--database' => 'mysql',
                '--env' => 'testing',
                '--path' => 'database/migrations',
            ]);
            
        } catch (\PDOException $e) {
            $this->error('Erro ao criar banco de dados: ' . $e->getMessage());
            $this->info('Por favor, crie o banco manualmente via phpMyAdmin ou MySQL CLI.');
            return 1;
        }
        
        return 0;
    }
}
