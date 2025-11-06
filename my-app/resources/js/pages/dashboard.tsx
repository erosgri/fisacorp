import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Package, DollarSign, AlertTriangle, PlusCircle, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Order {
    id: number;
    customer_name: string;
    customer_address: string;
    customer_number?: string;
    customer_zip: string;
    customer_complement?: string;
    total: number | string;
    created_at: string;
    delivery_date: string;
}

interface Product {
    id: number;
    name: string;
    qty_stock: number;
}

interface Stats {
    totalOrders: number;
    totalProducts: number;
    totalRevenue: number | string;
    lowStockProducts: number;
    ordersLast30Days: number;
    revenueLast30Days: number | string;
}

interface Props {
    stats: Stats;
    recentOrders: Order[];
    lowStockList: Product[];
}

export default function Dashboard({ stats, recentOrders, lowStockList }: Props) {
    const formatCurrency = (value: number | string) =>
        Number(value ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 custom-scrollbar">
                {/* Hero Banner */}
                <div className="hero-banner fade-in">
                    <div className="hero-banner-content">
                        <div className="space-y-4">
                            <span className="hero-badge">Supermercado Premium</span>
                            <h1>Gestão fresca para pedidos e estoque</h1>
                            <p>
                                Acompanhe as vendas em tempo real, reduza rupturas e mantenha o estoque sempre saudável com uma experiência inspirada nas redes premium de supermercado.
                            </p>
                        </div>

                        <div className="hero-stat-grid">
                            <div className="hero-stat-card">
                                <div className="flex size-12 items-center justify-center rounded-full bg-white/80 text-primary shadow">
                                    <ShoppingCart className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Pedidos totais</p>
                                    <p className="text-2xl font-semibold text-primary-foreground/95">{stats.totalOrders}</p>
                                </div>
                            </div>
                            <div className="hero-stat-card">
                                <div className="flex size-12 items-center justify-center rounded-full bg-white/80 text-primary shadow">
                                    <Package className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Produtos ativos</p>
                                    <p className="text-2xl font-semibold text-primary-foreground/95">{stats.totalProducts}</p>
                                </div>
                            </div>
                            <div className="hero-stat-card">
                                <div className="flex size-12 items-center justify-center rounded-full bg-white/80 text-primary shadow">
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Receita mensal</p>
                                    <p className="text-2xl font-semibold text-primary-foreground/95">{formatCurrency(stats.revenueLast30Days)}</p>
                                </div>
                    </div>
                    </div>
                    </div>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalOrders}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.ordersLast30Days} nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(stats.revenueLast30Days)} nos últimos 30 dias
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Produtos cadastrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">{stats.lowStockProducts}</div>
                            <p className="text-xs text-muted-foreground">
                                Produtos com menos de 10 unidades
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Grid de Conteúdo */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Pedidos Recentes */}
                    <Card className="order-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Pedidos Recentes</CardTitle>
                                    <CardDescription>
                                        Últimos pedidos cadastrados
                                    </CardDescription>
                                </div>
                                <Link href="/orders">
                                    <Button variant="ghost" size="sm">
                                        Ver todos
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length === 0 ? (
                                <div className="py-8 text-center">
                                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">
                                        Nenhum pedido cadastrado ainda
                                    </p>
                                    <Link href="/orders/create">
                                        <Button className="mt-4 action-button-primary">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Criar Primeiro Pedido
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="order-item-card flex items-center justify-between rounded-lg border p-3 fade-in"
                                        >
                                            <div>
                                                <p className="font-semibold">Pedido #{order.id}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.customer_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customer_address
                                                        ? `${order.customer_address}${order.customer_number ? `, ${order.customer_number}` : ''}${order.customer_complement ? `, ${order.customer_complement}` : ''} - CEP ${order.customer_zip}`
                                                        : 'Endereço não informado'}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold">{formatCurrency(order.total)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Produtos com Estoque Baixo */}
                    <Card className="order-card">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Estoque Baixo</CardTitle>
                                    <CardDescription>
                                        Produtos que precisam de reposição
                                    </CardDescription>
                                </div>
                                <Link href="/stock">
                                    <Button variant="ghost" size="sm">
                                        Ver estoque
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {lowStockList.length === 0 ? (
                                <div className="py-8 text-center">
                                    <Package className="mx-auto h-12 w-12 text-green-600 mb-4" />
                                    <p className="text-muted-foreground">
                                        Todos os produtos estão com estoque adequado
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {lowStockList.map((product) => {
                                        const getStockBadgeClass = () => {
                                            if (product.qty_stock === 0) return 'stock-badge stock-badge-empty';
                                            return 'stock-badge stock-badge-low';
                                        };

                                        return (
                                            <div
                                                key={product.id}
                                                className="product-item flex items-center justify-between rounded-lg border p-3 fade-in"
                                            >
                                                <span className="font-medium">{product.name}</span>
                                                <span className={getStockBadgeClass()}>
                                                    {product.qty_stock} unidades
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Ações Rápidas */}
                <Card className="order-card">
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>
                            Acesse rapidamente as principais funcionalidades
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 md:grid-cols-3">
                            <Link href="/orders/create">
                                <Button className="w-full action-button-primary h-auto py-6 flex-col gap-2">
                                    <PlusCircle className="h-6 w-6" />
                                    <span className="font-semibold">Novo Pedido</span>
                                </Button>
                            </Link>
                            <Link href="/orders">
                                <Button className="w-full action-button-primary h-auto py-6 flex-col gap-2">
                                    <ShoppingCart className="h-6 w-6" />
                                    <span className="font-semibold">Ver Pedidos</span>
                                </Button>
                            </Link>
                            <Link href="/stock">
                                <Button className="w-full action-button-primary h-auto py-6 flex-col gap-2">
                                    <Package className="h-6 w-6" />
                                    <span className="font-semibold">Ver Estoque</span>
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
