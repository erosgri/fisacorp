<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display the order form.
     */
    public function create()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('orders/create', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'customer_number' => 'nullable|string|max:20',
            'customer_zip' => 'required|string|max:20',
            'customer_complement' => 'nullable|string|max:255',
            'delivery_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Validate stock availability
        $errors = [];
        foreach ($validated['items'] as $index => $item) {
            $product = Product::find($item['product_id']);
            if (!$product->hasStock($item['quantity'])) {
                $errors["items.{$index}.quantity"] = "Estoque insuficiente para {$product->name}. Disponível: {$product->qty_stock}";
            }
        }

        if (!empty($errors)) {
            return back()->withErrors($errors)->withInput();
        }

        try {
            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'customer_name' => $validated['customer_name'],
                'customer_address' => $validated['customer_address'],
                'customer_number' => $validated['customer_number'] ?? null,
                'customer_zip' => $validated['customer_zip'],
                'customer_complement' => $validated['customer_complement'] ?? null,
                'delivery_date' => $validated['delivery_date'],
                'total' => 0,
                'status' => 'pendente',
            ]);

            $total = 0;

            // Create order items
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);

                $total += $orderItem->subtotal;
            }

            // Update order total
            $order->total = $total;
            $order->save();

            DB::commit();

            return redirect()->route('orders.index')
                ->with('success', 'Pedido criado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao criar pedido: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Display a listing of orders.
     */
    public function index()
    {
        $orders = Order::with('orderItems.product')
            ->where('status', 'pendente')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('orders/index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display history of confirmed orders.
     */
    public function history()
    {
        $orders = Order::with('orderItems.product')
            ->where('status', 'confirmado')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('orders/history', [
            'orders' => $orders,
        ]);
    }

    /**
     * Show the form for editing the specified order.
     */
    public function edit(Order $order)
    {
        $order->load('orderItems');
        $products = Product::orderBy('name')->get();

        return Inertia::render('orders/edit', [
            'order' => [
                'id' => $order->id,
                'customer_name' => $order->customer_name,
                'customer_address' => $order->customer_address,
                'customer_number' => $order->customer_number,
                'customer_zip' => $order->customer_zip,
                'customer_complement' => $order->customer_complement,
                'delivery_date' => $order->delivery_date?->format('Y-m-d') ?? '',
                'status' => $order->status,
            ],
            'orderItems' => $order->orderItems->map(function (OrderItem $item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ];
            }),
            'products' => $products,
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order)
    {
        if ($order->status === 'confirmado') {
            return back()->withErrors(['error' => 'Pedidos confirmados não podem ser editados.']);
        }

        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_address' => 'required|string|max:255',
            'customer_number' => 'nullable|string|max:20',
            'customer_zip' => 'required|string|max:20',
            'customer_complement' => 'nullable|string|max:255',
            'delivery_date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Validate stock availability (relative to current stock since not confirmed yet)
        $errors = [];
        foreach ($validated['items'] as $index => $item) {
            $product = Product::find($item['product_id']);
            if (!$product->hasStock($item['quantity'])) {
                $errors["items.{$index}.quantity"] = "Estoque insuficiente para {$product->name}. Disponível: {$product->qty_stock}";
            }
        }

        if (!empty($errors)) {
            return back()->withErrors($errors)->withInput();
        }

        try {
            DB::beginTransaction();

            $order->update([
                'customer_name' => $validated['customer_name'],
                'customer_address' => $validated['customer_address'],
                'customer_number' => $validated['customer_number'] ?? null,
                'customer_zip' => $validated['customer_zip'],
                'customer_complement' => $validated['customer_complement'] ?? null,
                'delivery_date' => $validated['delivery_date'],
            ]);

            // Remove previous items
            $order->orderItems()->delete();

            $total = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);

                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);

                $total += $orderItem->subtotal;
            }

            $order->update([
                'total' => $total,
            ]);

            DB::commit();

            return redirect()->route('orders.index')->with('success', 'Pedido atualizado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao atualizar pedido: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified order from storage.
     */
    public function destroy(Order $order)
    {
        try {
            DB::beginTransaction();

            $order->load('orderItems.product');

            if ($order->status === 'confirmado') {
                foreach ($order->orderItems as $item) {
                    $item->product->increaseStock($item->quantity);
                }
            }

            $order->orderItems()->delete();
            $order->delete();

            DB::commit();

            return redirect()->route('orders.index')->with('success', 'Pedido excluído com sucesso.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao excluir pedido: ' . $e->getMessage()]);
        }
    }

    /**
     * Confirm order and decrease stock.
     */
    public function confirm(Order $order)
    {
        if ($order->status === 'confirmado') {
            return back()->withErrors(['error' => 'Este pedido já foi confirmado.']);
        }

        $order->load('orderItems.product');

        $errors = [];
        foreach ($order->orderItems as $index => $item) {
            if (! $item->product->hasStock($item->quantity)) {
                $errors["items.{$index}.quantity"] = "Estoque insuficiente para {$item->product->name}. Disponível: {$item->product->qty_stock}";
            }
        }

        if (! empty($errors)) {
            return back()->withErrors($errors);
        }

        try {
            DB::beginTransaction();

            foreach ($order->orderItems as $item) {
                $item->product->decreaseStock($item->quantity);
            }

            $order->status = 'confirmado';
            $order->save();

            DB::commit();

            return redirect()->route('orders.index')->with('success', 'Pedido confirmado com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao confirmar pedido: ' . $e->getMessage()]);
        }
    }

    /**
     * Check stock availability for items.
     */
    public function checkStock(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $availability = [];
        foreach ($request->items as $item) {
            $product = Product::find($item['product_id']);
            $available = $product->hasStock($item['quantity']);
            
            $availability[] = [
                'product_id' => $item['product_id'],
                'available' => $available,
                'available_stock' => $product->qty_stock,
                'message' => $available 
                    ? 'Estoque disponível' 
                    : "Estoque insuficiente. Disponível: {$product->qty_stock}",
            ];
        }

        return response()->json($availability);
    }
}

