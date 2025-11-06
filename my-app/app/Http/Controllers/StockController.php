<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    /**
     * Display the stock listing.
     */
    public function index()
    {
        $products = Product::orderBy('name')->get([
            'id',
            'name',
            'qty_stock',
            'price',
            'description',
            'image_url',
        ]);

        return Inertia::render('stock/index', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('stock/create');
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'qty_stock' => 'required|integer|min:0',
            'description' => 'required|string',
        ]);

        Product::create($validated);

        return redirect()->route('stock.index')->with('success', 'Produto criado com sucesso!');
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'qty_stock' => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|url|max:255',
        ]);

        $product->update($validated);

        return redirect()->route('stock.index')->with('success', 'Produto atualizado com sucesso!');
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        // Verificar se o produto está em algum pedido
        if ($product->orderItems()->count() > 0) {
            return redirect()->route('stock.index')->with('error', 'Não é possível excluir um produto que está em pedidos.');
        }

        $product->delete();

        return redirect()->route('stock.index')->with('success', 'Produto excluído com sucesso!');
    }
}

