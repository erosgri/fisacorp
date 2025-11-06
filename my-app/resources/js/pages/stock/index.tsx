import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Head, Link, router } from '@inertiajs/react';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
    id: number;
    name: string;
    qty_stock: number;
    price: number | string;
    description: string;
    image_url: string;
}

interface Props {
    products: Product[];
}

export default function StockIndex({ products }: Props) {
    const totalProducts = products.length;
    const lowStockProducts = products.filter((p) => p.qty_stock < 10);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        qty_stock: '',
        description: '',
    });

    const formatCurrency = (value: number | string) =>
        Number(value ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

    const getStockBadgeClass = (qty: number) => {
        if (qty === 0) return 'stock-badge stock-badge-empty';
        if (qty < 10) return 'stock-badge stock-badge-low';
        if (qty < 50) return 'stock-badge stock-badge-medium';
        return 'stock-badge stock-badge-high';
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: String(product.price),
            qty_stock: String(product.qty_stock),
            description: product.description || '',
        });
        setIsEditDialogOpen(true);
    };

    const handleDelete = (productId: number) => {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            router.delete(`/stock/${productId}`, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            router.put(`/stock/${editingProduct.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => {
                    setIsEditDialogOpen(false);
                    setEditingProduct(null);
                    setFormData({
                        name: '',
                        price: '',
                        qty_stock: '',
                        description: '',
                    });
                },
            });
        }
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            price: '',
            qty_stock: '',
            description: '',
        });
    };

    useEffect(() => {
        if (isAddDialogOpen) {
            resetFormData();
        }
    }, [isAddDialogOpen]);

    const handleSubmitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/stock', formData, {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddDialogOpen(false);
                resetFormData();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Estoque" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 custom-scrollbar">
                <div className="page-header fade-in">
                    <h1 className="text-2xl font-bold">Estoque Atual</h1>
                    <p className="text-muted-foreground">
                        Visualize o estoque de todos os produtos cadastrados
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="stat-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalProducts}</div>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Produtos em Estoque</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {products.filter((p) => p.qty_stock > 0).length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="stat-card">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {lowStockProducts.length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-border bg-card shadow-sm">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Produtos</CardTitle>
                                <CardDescription>
                                    Visualização em lista com valores e disponibilidade atualizada
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hero-badge hidden md:inline-flex">
                                    <Package className="h-4 w-4" /> {totalProducts} itens cadastrados
                                </span>
                                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="action-button-primary">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Adicionar Produto
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <form onSubmit={handleSubmitAdd}>
                                            <DialogHeader>
                                                <DialogTitle>Adicionar Novo Produto</DialogTitle>
                                                <DialogDescription>
                                                    Preencha os dados do novo produto
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="name">Nome do Produto *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, name: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="price">Preço *</Label>
                                                    <Input
                                                        id="price"
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        value={formData.price}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, price: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="qty_stock">Quantidade em Estoque *</Label>
                                                    <Input
                                                        id="qty_stock"
                                                        type="number"
                                                        min="0"
                                                        value={formData.qty_stock}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, qty_stock: e.target.value })
                                                        }
                                                        required
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="description">Descrição *</Label>
                                                    <Textarea
                                                        id="description"
                                                        value={formData.description}
                                                        onChange={(e) =>
                                                            setFormData({ ...formData, description: e.target.value })
                                                        }
                                                        rows={3}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setIsAddDialogOpen(false);
                                                        resetFormData();
                                                    }}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button type="submit" className="action-button-primary">
                                                    Adicionar
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {products.length === 0 ? (
                            <div className="py-12 text-center">
                                <Package className="mx-auto size-12 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    Nenhum produto cadastrado no sistema
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-fixed divide-y divide-border">
                                    <thead className="bg-muted/40">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Produto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Descrição
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Preço
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Estoque
                                            </th>
                                            <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border bg-card">
                                        {products.map((product) => (
                                            <tr key={product.id}>
                                                <td className="px-4 py-3 align-top">
                                                    <div className="font-medium text-foreground">{product.name}</div>
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <p className="text-sm text-muted-foreground line-clamp-3">
                                                        {product.description || 'Sem descrição cadastrada.'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 align-top text-sm font-semibold text-foreground">
                                                    {formatCurrency(product.price)}
                                                </td>
                                                <td className="px-4 py-3 align-top">
                                                    <span className={getStockBadgeClass(product.qty_stock)}>
                                                        {product.qty_stock} un
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 align-top text-right text-sm">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEdit(product)}
                                                            className="h-8"
                                                        >
                                                            <Edit className="h-3 w-3 mr-1" />
                                                            Editar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(product.id)}
                                                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-3 w-3 mr-1" />
                                                            Excluir
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Dialog de Edição */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent>
                        <form onSubmit={handleSubmitEdit}>
                            <DialogHeader>
                                <DialogTitle>Editar Produto</DialogTitle>
                                <DialogDescription>
                                    Edite as informações do produto
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-name">Nome do Produto *</Label>
                                    <Input
                                        id="edit-name"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-price">Preço *</Label>
                                    <Input
                                        id="edit-price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-qty_stock">Quantidade em Estoque *</Label>
                                    <Input
                                        id="edit-qty_stock"
                                        type="number"
                                        min="0"
                                        value={formData.qty_stock}
                                        onChange={(e) =>
                                            setFormData({ ...formData, qty_stock: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Descrição</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" className="action-button-primary">
                                    Salvar Alterações
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}


