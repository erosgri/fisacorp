<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'qty_stock',
        'description',
        'image_url',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'qty_stock' => 'integer',
    ];

    protected function imageUrl(): Attribute
    {
        return Attribute::get(function ($value) {
            return $value ?? 'https://cdn.pixabay.com/photo/2017/06/01/18/46/vegetables-2076774_1280.jpg';
        });
    }

    protected function description(): Attribute
    {
        return Attribute::get(fn ($value) => $value);
    }

    /**
     * Get the order items for the product.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Check if product has enough stock.
     */
    public function hasStock(int $quantity): bool
    {
        return $this->qty_stock >= $quantity;
    }

    /**
     * Decrease stock quantity.
     */
    public function decreaseStock(int $quantity): bool
    {
        if (!$this->hasStock($quantity)) {
            return false;
        }

        $this->qty_stock -= $quantity;
        return $this->save();
    }

        /**
         * Increase stock quantity.
         */
        public function increaseStock(int $quantity): bool
        {
            if ($quantity < 1) {
                return true;
            }

            $this->qty_stock += $quantity;
            return $this->save();
        }
}

