import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Eye } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
}

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    subtotal: number;
    product: Product;
}

interface Order {
    id: number;
    customer_name: string;
    customer_address: string;
    customer_number?: string;
    customer_zip: string;
    customer_complement?: string;
    delivery_date: string;
    total: number | string;
    created_at: string;
    order_items: OrderItem[];
}

interface Props {
    orders: {
        data: Order[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function OrdersHistory({ orders }: Props) {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const formatCurrency = (value: number | string) =>
        Number(value ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setIsDialogOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Histórico de Compras" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 custom-scrollbar">
                <div className="page-header fade-in">
                    <h1 className="text-2xl font-bold">Histórico de Compras</h1>
                    <p className="text-muted-foreground">
                        Consulte pedidos já confirmados e visualize os detalhes quando necessário.
                    </p>
                </div>

                {orders.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Nenhum pedido confirmado encontrado.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pedidos Confirmados</CardTitle>
                            <CardDescription>
                                Clique em "Ver Detalhes" para visualizar informações completas do pedido
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {orders.data.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">
                                                    Pedido #{order.id}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {order.customer_name}
                                                </span>
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(order)}
                                        >
                                            <Eye className="mr-2 size-4" />
                                            Ver Detalhes
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Detalhes do Pedido #{selectedOrder?.id}</DialogTitle>
                            <DialogDescription>
                                Informações completas do pedido confirmado
                            </DialogDescription>
                        </DialogHeader>
                        {selectedOrder && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Cliente</h3>
                                        <p className="text-base font-medium">{selectedOrder.customer_name}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-1">Endereço</h3>
                                        <p className="text-base">
                                            {selectedOrder.customer_address
                                                ? `${selectedOrder.customer_address}${selectedOrder.customer_number ? `, ${selectedOrder.customer_number}` : ''}${selectedOrder.customer_complement ? `, ${selectedOrder.customer_complement}` : ''} - CEP ${selectedOrder.customer_zip}`
                                                : 'Não informado'}
                                        </p>
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Data de Entrega</h3>
                                            <p className="text-base">
                                                {new Date(selectedOrder.delivery_date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Data do Pedido</h3>
                                            <p className="text-base">
                                                {new Date(selectedOrder.created_at).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Itens do Pedido</h3>
                                    <div className="space-y-2">
                                        {selectedOrder.order_items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-foreground">
                                                        {item.product.name}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.quantity} un • {formatCurrency(item.product.price)} cada
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-primary">
                                                    {formatCurrency(item.subtotal)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-semibold">Total do Pedido:</span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatCurrency(selectedOrder.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
