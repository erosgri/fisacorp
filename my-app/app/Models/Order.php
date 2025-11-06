<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_name',
        'customer_address',
        'customer_number',
        'customer_zip',
        'customer_complement',
        'delivery_date',
        'total',
        'status',
    ];

    protected $casts = [
        'delivery_date' => 'date',
        'total' => 'decimal:2',
        'status' => 'string',
    ];

    /**
     * Get the order items for the order.
     */
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Calculate and update the total of the order.
     */
    public function calculateTotal(): void
    {
        $this->total = $this->orderItems->sum('subtotal');
        $this->save();
    }
}

