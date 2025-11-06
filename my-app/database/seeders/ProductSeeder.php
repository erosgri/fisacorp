<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Arroz Tio João 5kg',
                'price' => 24.90,
                'qty_stock' => 50,
                'description' => 'Arroz branco tipo 1, ideal para refeições do dia a dia e pratos especiais.',
                'image_url' => 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Feijão Carioca 1kg',
                'price' => 8.90,
                'qty_stock' => 80,
                'description' => 'Feijão carioca selecionado, perfeito para feijoadas e pratos tradicionais.',
                'image_url' => 'https://images.unsplash.com/photo-1584270354949-1f5c7846de41?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Açúcar Cristal 1kg',
                'price' => 5.50,
                'qty_stock' => 120,
                'description' => 'Açúcar cristal de alta pureza para uso culinário e bebidas.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Óleo de Soja 900ml',
                'price' => 7.90,
                'qty_stock' => 60,
                'description' => 'Óleo de soja refinado, ideal para frituras e preparos diários.',
                'image_url' => 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Macarrão Espaguete 500g',
                'price' => 4.90,
                'qty_stock' => 100,
                'description' => 'Espaguete de trigo enriquecido, com cozimento uniforme e sabor delicioso.',
                'image_url' => 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Leite Integral 1L',
                'price' => 5.90,
                'qty_stock' => 90,
                'description' => 'Leite integral UHT, fonte de cálcio e vitaminas essenciais.',
                'image_url' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Pão de Açúcar 500g',
                'price' => 6.50,
                'qty_stock' => 40,
                'description' => 'Pão de forma clássico, macio e saboroso para lanches e cafés da manhã.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Café Pilão 500g',
                'price' => 18.90,
                'qty_stock' => 45,
                'description' => 'Café torrado e moído, sabor intenso e aroma marcante.',
                'image_url' => 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Sal Refinado 1kg',
                'price' => 2.90,
                'qty_stock' => 150,
                'description' => 'Sal refinado iodado para temperar diversas receitas.',
                'image_url' => 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Farinha de Trigo 1kg',
                'price' => 5.90,
                'qty_stock' => 70,
                'description' => 'Farinha de trigo branca, ideal para bolos, pães e massas.',
                'image_url' => 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Açúcar Refinado 1kg',
                'price' => 5.90,
                'qty_stock' => 85,
                'description' => 'Açúcar refinado fininho, excelente para confeitaria e bebidas.',
                'image_url' => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Óleo de Girassol 900ml',
                'price' => 8.50,
                'qty_stock' => 55,
                'description' => 'Óleo de girassol rico em vitamina E, sabor leve e saudável.',
                'image_url' => 'https://images.unsplash.com/photo-1448907503123-67254d59ca4f?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Macarrão Parafuso 500g',
                'price' => 4.90,
                'qty_stock' => 95,
                'description' => 'Macarrão tipo parafuso, absorve bem molhos cremosos e encorpados.',
                'image_url' => 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Leite Desnatado 1L',
                'price' => 6.20,
                'qty_stock' => 75,
                'description' => 'Leite desnatado UHT, menor teor de gordura sem perder nutrientes.',
                'image_url' => 'https://images.unsplash.com/photo-1582719478181-2cf4e1f7f22a?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Manteiga 200g',
                'price' => 9.90,
                'qty_stock' => 50,
                'description' => 'Manteiga tradicional, cremosa e perfeita para pães e receitas.',
                'image_url' => 'https://images.unsplash.com/photo-1589308078055-504c6ae85b3e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Margarina 500g',
                'price' => 7.50,
                'qty_stock' => 65,
                'description' => 'Margarina cremosa com sal, ótima para culinária e receitas do dia.',
                'image_url' => 'https://images.unsplash.com/photo-1617634667039-8ddfd5e76879?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Ovos Brancos Dúzia',
                'price' => 12.90,
                'qty_stock' => 30,
                'description' => 'Ovos brancos frescos, perfeitos para omeletes, bolos e refeições.',
                'image_url' => 'https://images.unsplash.com/photo-1569058242253-92a9cce77899?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Banana Prata kg',
                'price' => 4.90,
                'qty_stock' => 25,
                'description' => 'Bananas prata selecionadas, frutas frescas e nutritivas.',
                'image_url' => 'https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Tomate kg',
                'price' => 7.90,
                'qty_stock' => 35,
                'description' => 'Tomates vermelhos e firmes, ideais para saladas e molhos.',
                'image_url' => 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Cebola kg',
                'price' => 5.50,
                'qty_stock' => 45,
                'description' => 'Cebolas amarelas frescas, indispensáveis para temperos e refogados.',
                'image_url' => 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Batata kg',
                'price' => 6.90,
                'qty_stock' => 40,
                'description' => 'Batatas selecionadas, próprias para cozidos, purês e frituras.',
                'image_url' => 'https://images.unsplash.com/photo-1570211776086-0d41e65ee7df?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Cenoura kg',
                'price' => 5.90,
                'qty_stock' => 30,
                'description' => 'Cenouras frescas, crocantes e cheias de vitaminas.',
                'image_url' => 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Alface Unidade',
                'price' => 3.90,
                'qty_stock' => 20,
                'description' => 'Alface fresca e crocante, perfeita para saladas e sanduíches.',
                'image_url' => 'https://images.unsplash.com/photo-1524592879375-d366e108b96c?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Frango Congelado kg',
                'price' => 12.90,
                'qty_stock' => 25,
                'description' => 'Frango inteiro congelado, pronto para preparo de assados e cozidos.',
                'image_url' => 'https://images.unsplash.com/photo-1612874472269-5aa8489817ee?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Carne Moída kg',
                'price' => 28.90,
                'qty_stock' => 15,
                'description' => 'Carne bovina moída de primeira qualidade, versátil e saborosa.',
                'image_url' => 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Sardinha em Lata 125g',
                'price' => 4.50,
                'qty_stock' => 60,
                'description' => 'Sardinha em lata conservada em óleo vegetal, rica em ômega-3.',
                'image_url' => 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Atum em Lata 170g',
                'price' => 8.90,
                'qty_stock' => 40,
                'description' => 'Atum sólido em água, perfeito para saladas, sanduíches e receitas leves.',
                'image_url' => 'https://images.unsplash.com/photo-1511466156986-5585135563c4?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Molho de Tomate 340g',
                'price' => 3.90,
                'qty_stock' => 80,
                'description' => 'Molho de tomate pronto, sabor tradicional com textura encorpada.',
                'image_url' => 'https://images.unsplash.com/photo-1589308078055-504c6ae85b3e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Extrato de Tomate 350g',
                'price' => 4.50,
                'qty_stock' => 70,
                'description' => 'Extrato concentrado de tomate para realçar o sabor das suas receitas.',
                'image_url' => 'https://images.unsplash.com/photo-1589308078055-504c6ae85b3e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Sabão em Pó 1kg',
                'price' => 12.90,
                'qty_stock' => 50,
                'description' => 'Sabão em pó lava-roupas com perfume suave e alto rendimento.',
                'image_url' => 'https://images.unsplash.com/photo-1627496031745-01bc7351fc03?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Detergente 500ml',
                'price' => 3.90,
                'qty_stock' => 90,
                'description' => 'Detergente líquido neutro, eficiente na limpeza diária da sua cozinha.',
                'image_url' => 'https://images.unsplash.com/photo-1615485737543-6170fc8c3b94?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Papel Higiênico 4 unidades',
                'price' => 8.90,
                'qty_stock' => 45,
                'description' => 'Papel higiênico folha dupla, macio e resistente.',
                'image_url' => 'https://images.unsplash.com/photo-1584551444260-512f74ef0f3b?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Sabonete 90g',
                'price' => 2.90,
                'qty_stock' => 120,
                'description' => 'Sabonete perfumado com glicerina, deixa a pele macia e hidratada.',
                'image_url' => 'https://images.unsplash.com/photo-1610210981657-6d425e32e5b4?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Shampoo 325ml',
                'price' => 12.90,
                'qty_stock' => 35,
                'description' => 'Shampoo com ação nutritiva, brilho e maciez para os cabelos.',
                'image_url' => 'https://images.unsplash.com/photo-1625848886068-185c1f286df9?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Condicionador 325ml',
                'price' => 12.90,
                'qty_stock' => 35,
                'description' => 'Condicionador hidratante, facilita o desembaraço e protege os fios.',
                'image_url' => 'https://images.unsplash.com/photo-1625848886068-185c1f286df9?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Creme Dental 90g',
                'price' => 4.90,
                'qty_stock' => 75,
                'description' => 'Creme dental com flúor, proteção completa contra cáries.',
                'image_url' => 'https://images.unsplash.com/photo-1588779485631-8f34f31b3a67?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Água Mineral 1,5L',
                'price' => 3.50,
                'qty_stock' => 100,
                'description' => 'Água mineral sem gás, pura e naturalmente leve.',
                'image_url' => 'https://images.unsplash.com/photo-1532635045-23cda6acd6e0?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Refrigerante 2L',
                'price' => 7.90,
                'qty_stock' => 60,
                'description' => 'Bebida gaseificada refrescante, perfeita para acompanhar refeições.',
                'image_url' => 'https://images.unsplash.com/photo-1563371351-e53ebb744a1d?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Suco de Laranja 1L',
                'price' => 6.90,
                'qty_stock' => 40,
                'description' => 'Suco de laranja pronto para beber, sabor natural e refrescante.',
                'image_url' => 'https://images.unsplash.com/photo-1558640472-9d2a7deb7f62?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Biscoito Recheado 130g',
                'price' => 3.90,
                'qty_stock' => 85,
                'description' => 'Biscoito recheado crocante, ideal para lanches e sobremesas.',
                'image_url' => 'https://images.unsplash.com/photo-1509365465985-21b0f85f5cb4?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Bolacha de Água e Sal 200g',
                'price' => 3.50,
                'qty_stock' => 95,
                'description' => 'Bolacha salgada tradicional, leve e perfeita para acompanhamentos.',
                'image_url' => 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'name' => 'Achocolatado 400g',
                'price' => 8.90,
                'qty_stock' => 50,
                'description' => 'Achocolatado em pó, sabor marcante para leite e sobremesas.',
                'image_url' => 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}

