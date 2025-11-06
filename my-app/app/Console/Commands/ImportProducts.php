<?php

namespace App\Console\Commands;

use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:import {file?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from CSV file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $filePath = $this->argument('file') ?? base_path('../Products.csv');

        if (!File::exists($filePath)) {
            $this->error("Arquivo não encontrado: {$filePath}");
            return 1;
        }

        $this->info("Importando produtos de: {$filePath}");

        // Clear existing products
        // Disable foreign key checks temporarily
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Product::query()->delete();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $this->info("Produtos antigos removidos.");

        // Read CSV file with UTF-8 encoding
        $content = File::get($filePath);
        // Try to detect and convert encoding
        if (!mb_check_encoding($content, 'UTF-8')) {
            $content = mb_convert_encoding($content, 'UTF-8', 'ISO-8859-1');
        }
        
        $lines = explode("\n", $content);
        // Skip header
        array_shift($lines);

        $imported = 0;
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            $data = str_getcsv($line, ';');
            
            // Skip empty rows
            if (empty($data[0]) || empty($data[1])) {
                continue;
            }

            $id = (int) $data[0];
            $name = trim($data[1]);
            $price = (float) str_replace(',', '.', $data[2]);
            $qty_stock = (int) ($data[3] ?? 0);
            $description = $data[4] ?? null;
            $imageUrl = $data[5] ?? null;

            Product::create([
                'name' => $name,
                'price' => $price,
                'qty_stock' => $qty_stock,
                'description' => $description,
                'image_url' => $imageUrl,
            ]);

            $imported++;
        }

        $this->info("✓ {$imported} produtos importados com sucesso!");
        return 0;
    }
}

