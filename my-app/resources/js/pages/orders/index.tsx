import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, CheckCircle2, Pencil, Trash2, History } from 'lucide-react';

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
    status: string;
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

export default function OrdersIndex({ orders }: Props) {
    const formatCurrency = (value: number | string) =>
        Number(value ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

    const formatStatus = (status: string) => {
        if (status === 'confirmado') return 'Confirmado';
        return 'Pendente';
    };

    const statusBadgeClass = (status: string) => {
        if (status === 'confirmado') {
            return 'inline-flex items-center rounded-full bg-green-600/10 px-3 py-1 text-xs font-semibold text-green-400';
        }
        return 'inline-flex items-center rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-yellow-400';
    };

    const handleConfirm = (orderId: number) => {
        if (!window.confirm('Confirmar este pedido? O estoque será abatido.')) {
            return;
        }
        router.post(`/orders/${orderId}/confirm`);
    };

    const handleDelete = (orderId: number) => {
        if (!window.confirm('Deseja excluir este pedido?')) {
            return;
        }
        router.delete(`/orders/${orderId}`);
    };

    return (
        <AppLayout>
            <Head title="Pedidos" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 custom-scrollbar">
                <div className="page-header flex items-center justify-between fade-in">
                    <div>
                        <h1 className="text-2xl font-bold">Pedidos Pendentes</h1>
                        <p className="text-muted-foreground">
                            Gerencie os pedidos aguardando confirmação. Após confirmados, eles aparecerão no histórico.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/orders/history">
                            <Button variant="outline">
                                <History className="mr-2 size-4" /> Histórico
                            </Button>
                        </Link>
                        <Link href="/orders/create">
                            <Button>
                                <Plus className="size-4 mr-2" />
                                Novo Pedido
                            </Button>
                        </Link>
                    </div>
                </div>

                {orders.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Nenhum pedido pendente encontrado. Todos os pedidos foram confirmados ou você ainda não criou nenhum pedido.
                            </p>
                            <div className="mt-4 flex items-center justify-center gap-2">
                                <Link href="/orders/create">
                                    <Button>Novo Pedido</Button>
                                </Link>
                                <Link href="/orders/history">
                                    <Button variant="outline">
                                        <History className="mr-2 size-4" />
                                        Ver Histórico
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.data.map((order) => (
                            <Card key={order.id} className="order-list-card fade-in">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>Pedido #{order.id}</CardTitle>
                                            <CardDescription className="space-y-1">
                                                <div>
                                                    <span className="font-medium">Cliente:</span> {order.customer_name}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Endereço:</span>{' '}
                                                    {order.customer_address
                                                        ? `${order.customer_address}${order.customer_number ? `, ${order.customer_number}` : ''}${order.customer_complement ? `, ${order.customer_complement}` : ''} - CEP ${order.customer_zip}`
                                                        : 'Não informado'}
                                                </div>
                                                <div>
                                                    <span className="font-medium">Entrega:</span> {new Date(order.delivery_date).toLocaleDateString('pt-BR')}
                                                </div>
                                            </CardDescription>
                                            <div className="mt-2">
                                                <span className={statusBadgeClass(order.status)}>
                                                    {formatStatus(order.status)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 text-right">
                                            <div>
                                                <div className="text-2xl font-bold text-primary">
                                                    {formatCurrency(order.total)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {order.status !== 'confirmado' && (
                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        className="action-button-primary"
                                                        onClick={() => handleConfirm(order.id)}
                                                    >
                                                        <CheckCircle2 className="mr-1 size-4" /> Confirmar
                                                    </Button>
                                                )}
                                                <Link href={`/orders/${order.id}/edit`}>
                                                    <Button type="button" size="sm" variant="outline">
                                                        <Pencil className="mr-1 size-4" /> Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => handleDelete(order.id)}
                                                >
                                                    <Trash2 className="mr-1 size-4" /> Excluir
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <h4 className="font-semibold">Itens do Pedido:</h4>
                                        <div className="space-y-1">
                                            {order.order_items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="product-item flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

