<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class ProductMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = base_path('database/data/product_media.json');

        if (! File::exists($path)) {
            $this->command?->warn('Arquivo database/data/product_media.json não encontrado.');
            return;
        }

        $items = json_decode(File::get($path), true);

        if (! is_array($items)) {
            $this->command?->error('Não foi possível ler o JSON de mídia dos produtos.');
            return;
        }

        $updated = 0;

        foreach ($items as $item) {
            if (! isset($item['name'])) {
                continue;
            }

            $product = Product::where('name', $item['name'])->first();

            if (! $product) {
                $this->command?->warn("Produto não encontrado: {$item['name']}");
                continue;
            }

            $product->update([
                'description' => $item['description'] ?? $product->description,
                'image_url' => $item['image_url'] ?? $product->image_url,
            ]);

            $updated++;
        }

        $this->command?->info("{$updated} produtos atualizados com imagem e descrição.");
    }
}
