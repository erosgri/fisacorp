import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Trash2, Plus, AlertCircle } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number | string;
    qty_stock: number;
    description: string;
    image_url: string;
}

interface OrderItem {
    product_id: number;
    quantity: number;
    product?: Product;
}

interface OrderItemPayload {
    id?: number;
    product_id: number;
    quantity: number;
    price?: number | string;
    subtotal?: number | string;
}

interface ExistingOrder {
    id: number;
    customer_name: string;
    customer_address: string;
    customer_number?: string;
    customer_zip: string;
    customer_complement?: string;
    delivery_date: string;
    status: string;
}

interface Props {
    products: Product[];
    order?: ExistingOrder;
    orderItems?: OrderItemPayload[];
}

export default function CreateOrder({ products, order, orderItems = [] }: Props) {
    const isEdit = Boolean(order);
    const isConfirmed = order?.status === 'confirmado';

    const initialItemsState: OrderItem[] = orderItems.length
        ? orderItems.map((item) => ({
              product_id: item.product_id,
              quantity: item.quantity,
          }))
        : [];

    const initialCatalogState = initialItemsState.reduce<Record<number, number>>((acc, item) => {
        if (!acc[item.product_id]) {
            acc[item.product_id] = item.quantity;
        }
        return acc;
    }, {});

    const [items, setItems] = useState<OrderItem[]>(initialItemsState);
    const [stockErrors, setStockErrors] = useState<Record<number, string>>({});
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [catalogQuantities, setCatalogQuantities] = useState<Record<number, number>>(initialCatalogState);
    const [itemsError, setItemsError] = useState<string | null>(null);
    const [cepError, setCepError] = useState<string | null>(null);
    const [isValidatingCep, setIsValidatingCep] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        customer_name: order?.customer_name ?? '',
        customer_address: order?.customer_address ?? '',
        customer_number: order?.customer_number ?? '',
        customer_zip: order?.customer_zip ?? '',
        customer_complement: order?.customer_complement ?? '',
        delivery_date: order?.delivery_date ?? '',
        items: initialItemsState as OrderItem[],
    });

    const pageTitle = isEdit ? `Editar Pedido #${order?.id}` : 'Novo Pedido';
    const headerDescription = isEdit
        ? 'Atualize as informações do cliente e ajuste os produtos do pedido antes de confirmar.'
        : 'Preencha os dados do cliente e adicione os produtos do pedido';
    const submitLabel = isEdit ? 'Atualizar Pedido' : 'Salvar Pedido';
    const submitProcessingLabel = isEdit ? 'Atualizando...' : 'Salvando...';

    // Calculate total
    const total = items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.product_id);
        return sum + (product ? Number(product.price ?? 0) * item.quantity : 0);
    }, 0);
    const formatCurrency = (value: number | string) =>
        Number(value ?? 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });


    // Check stock availability when items change
    useEffect(() => {
        const errors: Record<number, string> = {};
        items.forEach((item, index) => {
            const product = products.find(p => p.id === item.product_id);
            if (product && product.qty_stock < item.quantity) {
                errors[index] = `Estoque insuficiente. Disponível: ${product.qty_stock}`;
            }
        });
        setStockErrors(errors);
    }, [items, products]);

    // Validate CEP using ViaCEP API
    const validateCep = async (cep: string) => {
        // Remove non-numeric characters
        const cleanCep = cep.replace(/\D/g, '');
        
        // CEP must have 8 digits
        if (cleanCep.length !== 8) {
            if (cleanCep.length > 0) {
                setCepError('CEP deve conter 8 dígitos');
            } else {
                setCepError(null);
            }
            return;
        }

        setIsValidatingCep(true);
        setCepError(null);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setCepError('CEP não encontrado. Verifique o CEP informado.');
                return;
            }

            // CEP is valid, optionally auto-fill address if empty
            if (data.logradouro && !data.customer_address) {
                const addressParts = [];
                if (data.logradouro) addressParts.push(data.logradouro);
                const fullAddress = addressParts.join(', ');
                setData('customer_address', fullAddress);
            }

            setCepError(null);
        } catch (error) {
            console.error('Erro ao validar CEP:', error);
            setCepError('Erro ao validar CEP. Tente novamente.');
        } finally {
            setIsValidatingCep(false);
        }
    };

    // Handle CEP input change
    const handleCepChange = (value: string) => {
        // Format CEP: 00000-000
        const cleanCep = value.replace(/\D/g, '');
        let formattedCep = cleanCep;
        
        if (cleanCep.length > 5) {
            formattedCep = cleanCep.slice(0, 5) + '-' + cleanCep.slice(5, 8);
        }

        setData('customer_zip', formattedCep);
        setCepError(null);

        // Validate when CEP is complete (8 digits)
        if (cleanCep.length === 8) {
            validateCep(cleanCep);
        }
    };

    const openCatalog = () => {
        if (isConfirmed) {
            return;
        }
        setIsCatalogOpen(true);
    };

    const handleCatalogQuantityChange = (productId: number, quantity: number, max: number) => {
        if (max <= 0) {
            setCatalogQuantities(prev => ({ ...prev, [productId]: 0 }));
            return;
        }

        const sanitized = Math.max(1, Math.min(quantity, max));
        setCatalogQuantities(prev => ({ ...prev, [productId]: sanitized }));
    };

    const handleAddProductToCart = (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product || product.qty_stock <= 0) {
            return;
        }

        const desiredQuantity = Math.max(1, catalogQuantities[productId] ?? 1);
        const quantityToAdd = Math.min(desiredQuantity, product.qty_stock);

        setItems((prevItems) => {
            const existingIndex = prevItems.findIndex(item => item.product_id === productId);

            if (existingIndex !== -1) {
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingIndex];
                const newQuantity = Math.min(existingItem.quantity + quantityToAdd, product.qty_stock);
                updatedItems[existingIndex] = {
                    ...existingItem,
                    quantity: newQuantity,
                };
                return updatedItems;
            }

            return [
                ...prevItems,
                {
                    product_id: productId,
                    quantity: quantityToAdd,
                },
            ];
        });

        setCatalogQuantities((prev) => ({ ...prev, [productId]: 1 }));
        setItemsError(null);
    };

    const removeItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        if (updatedItems.length === 0) {
            setItemsError('Adicione pelo menos um produto ao pedido.');
        }
    };

    const updateItem = (index: number, field: 'product_id' | 'quantity', value: number) => {
        const newItems = [...items];

        if (!newItems[index]) {
            return;
        }

        if (field === 'quantity') {
            const product = products.find(p => p.id === newItems[index].product_id);
            const max = product ? product.qty_stock : Number.MAX_SAFE_INTEGER;
            const sanitized = Math.max(1, Math.min(Number.isNaN(value) ? 1 : value, max));
            newItems[index] = { ...newItems[index], quantity: sanitized };
        } else {
            newItems[index] = { ...newItems[index], [field]: value };
        }

        setItems(newItems);
    };

    useEffect(() => {
        const payloadItems = items.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
        }));
        setData('items', payloadItems as OrderItem[]);
    }, [items, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isConfirmed) {
            return;
        }
        if (items.length === 0) {
            setItemsError('Adicione pelo menos um produto ao pedido.');
            return;
        }
        if (cepError) {
            return;
        }

        setItemsError(null);

        if (isEdit && order) {
            put(`/orders/${order.id}`);
        } else {
            post('/orders');
        }
    };

    const hasStockErrors = Object.keys(stockErrors).length > 0;

    return (
        <AppLayout>
            <Head title={pageTitle} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 custom-scrollbar">
                <Card className="order-card">
                    <CardHeader className="page-header">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <CardTitle className="text-2xl">
                                    {pageTitle}
                                </CardTitle>
                                <CardDescription className="text-base">
                                    {headerDescription}
                                </CardDescription>
                            </div>
                            {isEdit && order && (
                                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                                    Status: {order.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                                </span>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isConfirmed && (
                            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                                Este pedido já foi confirmado. As informações abaixo são apenas para consulta.
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="customer_name">Nome do Cliente *</Label>
                                    <Input
                                        id="customer_name"
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        required
                                        placeholder="Digite o nome do cliente"
                                        className="styled-input"
                                        disabled={isConfirmed}
                                    />
                                    {errors.customer_name && (
                                        <p className="text-sm text-destructive">{errors.customer_name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="delivery_date">Data de Entrega *</Label>
                                    <Input
                                        id="delivery_date"
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        className="styled-input"
                                        disabled={isConfirmed}
                                    />
                                    {errors.delivery_date && (
                                        <p className="text-sm text-destructive">{errors.delivery_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer_zip">CEP *</Label>
                                <div className="relative">
                                    <Input
                                        id="customer_zip"
                                        value={data.customer_zip}
                                        onChange={(e) => handleCepChange(e.target.value)}
                                        required
                                        placeholder="00000-000"
                                        className="styled-input"
                                        disabled={isConfirmed || isValidatingCep}
                                        maxLength={9}
                                    />
                                    {isValidatingCep && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        </div>
                                    )}
                                </div>
                                {cepError && (
                                    <p className="text-sm text-destructive">{cepError}</p>
                                )}
                                {errors.customer_zip && (
                                    <p className="text-sm text-destructive">{errors.customer_zip}</p>
                                )}
                                {!cepError && data.customer_zip && data.customer_zip.replace(/\D/g, '').length === 8 && !isValidatingCep && (
                                    <p className="text-sm text-green-600">✓ CEP válido</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="customer_address">Endereço *</Label>
                                    <Input
                                        id="customer_address"
                                        value={data.customer_address}
                                        onChange={(e) => setData('customer_address', e.target.value)}
                                        required
                                        placeholder="Rua, Avenida, etc."
                                        className="styled-input"
                                        disabled={isConfirmed}
                                    />
                                    {errors.customer_address && (
                                        <p className="text-sm text-destructive">{errors.customer_address}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customer_number">Número</Label>
                                    <Input
                                        id="customer_number"
                                        value={data.customer_number}
                                        onChange={(e) => setData('customer_number', e.target.value)}
                                        placeholder="123"
                                        className="styled-input"
                                        disabled={isConfirmed}
                                    />
                                    {errors.customer_number && (
                                        <p className="text-sm text-destructive">{errors.customer_number}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer_complement">Complemento</Label>
                                <Input
                                    id="customer_complement"
                                    value={data.customer_complement}
                                    onChange={(e) => setData('customer_complement', e.target.value)}
                                    placeholder="Apto, Bloco, Referência, etc."
                                    className="styled-input"
                                    disabled={isConfirmed}
                                />
                                {errors.customer_complement && (
                                    <p className="text-sm text-destructive">{errors.customer_complement}</p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Lista de Compras *</Label>
                                    <Button
                                        type="button"
                                        onClick={openCatalog}
                                        variant="outline"
                                        size="sm"
                                        disabled={isConfirmed}
                                    >
                                        <Plus className="size-4" />
                                        Adicionar Produto
                                    </Button>
                                </div>

                                <Dialog open={isCatalogOpen} onOpenChange={setIsCatalogOpen}>
                                    <DialogContent className="max-h-[90vh] w-full max-w-3xl overflow-hidden">
                                        <DialogHeader>
                                            <DialogTitle>Adicionar produtos ao pedido</DialogTitle>
                                            <DialogDescription>
                                                Selecione um produto da lista abaixo, informe a quantidade e adicione ao carrinho.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="custom-scrollbar max-h-[60vh] space-y-3 overflow-y-auto pr-2">
                                                {products.map((product) => {
                                                    const quantityInCart = items.find((item) => item.product_id === product.id)?.quantity ?? 0;
                                                    const desiredQuantity = catalogQuantities[product.id] ?? 1;
                                                    const hasStock = product.qty_stock > 0;

                                                    return (
                                                        <div
                                                            key={product.id}
                                                            className="rounded-lg border border-border bg-card/95 p-4 shadow-sm"
                                                        >
                                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                                <div className="max-w-xl space-y-1">
                                                                    <p className="font-semibold text-foreground">
                                                                        {product.name}
                                                                    </p>
                                                                    {product.description && (
                                                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                                                            {product.description}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="text-right text-sm">
                                                                    <p className="text-base font-semibold text-primary">
                                                                        {formatCurrency(product.price)}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Estoque: {product.qty_stock} un
                                                                    </p>
                                                                    {quantityInCart > 0 && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            No carrinho: {quantityInCart} un
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                                <div className="flex items-center gap-2">
                                                                    <Label className="text-xs uppercase tracking-wide">Quantidade</Label>
                                                                    <Input
                                                                        type="number"
                                                                        min={1}
                                                                        max={product.qty_stock}
                                                                        value={desiredQuantity}
                                                                        onChange={(e) =>
                                                                            handleCatalogQuantityChange(
                                                                                product.id,
                                                                                Number(e.target.value) || 1,
                                                                                product.qty_stock,
                                                                            )
                                                                        }
                                                                        disabled={!hasStock || isConfirmed}
                                                                        className="styled-input h-10 w-24"
                                                                    />
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => handleAddProductToCart(product.id)}
                                                                    disabled={!hasStock || isConfirmed}
                                                                    className="action-button-primary"
                                                                >
                                                                    <Plus className="mr-2 size-4" />
                                                                    {quantityInCart > 0 ? 'Adicionar mais' : 'Adicionar ao carrinho'}
                                                                </Button>
                                                            </div>

                                                            {!hasStock && (
                                                                <p className="mt-2 text-xs font-medium text-destructive">
                                                                    Este produto está sem estoque disponível.
                                                                </p>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                {items.length === 0 ? (
                                    <div className="rounded-lg border border-dashed p-8 text-center">
                                        <p className="text-muted-foreground">
                                            Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map((item, index) => {
                                            const product = products.find(p => p.id === item.product_id);
                                            if (!product) {
                                                return null;
                                            }

                                            const hasError = stockErrors[index];
                                            const subtotal = Number(product.price ?? 0) * item.quantity;

                                            return (
                                                <div
                                                    key={`${item.product_id}-${index}`}
                                                    className={`rounded-xl border border-border bg-card/90 p-4 shadow-sm transition-all ${
                                                        hasError ? 'border-destructive/60 ring-1 ring-destructive/40' : ''
                                                    }`}
                                                >
                                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                                        <div className="max-w-xl space-y-2">
                                                            <p className="text-base font-semibold text-foreground">
                                                                {product.name}
                                                            </p>
                                                            {product.description && (
                                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                                    {product.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right text-sm">
                                                            <p className="text-muted-foreground">Preço unitário</p>
                                                            <p className="text-lg font-semibold text-primary">
                                                                {formatCurrency(product.price)}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                Subtotal: {formatCurrency(subtotal)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <Label htmlFor={`quantity-${index}`} className="text-sm">
                                                                Quantidade
                                                            </Label>
                                                            <Input
                                                                id={`quantity-${index}`}
                                                                type="number"
                                                                min="1"
                                                                max={product.qty_stock}
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    updateItem(index, 'quantity', Number(e.target.value))
                                                                }
                                                                required
                                                                className="styled-input h-11 w-28"
                                                                disabled={isConfirmed}
                                                            />
                                                            <span className="text-xs text-muted-foreground">
                                                                Estoque disponível: {product.qty_stock} un
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeItem(index)}
                                                            className="text-destructive"
                                                            disabled={isConfirmed}
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>

                                                    {hasError && (
                                                        <div className="mt-3 flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                                                            <AlertCircle className="size-4" />
                                                            <span>{hasError}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {(errors.items || itemsError) && (
                                    <p className="text-sm text-destructive">{errors.items ?? itemsError}</p>
                                )}
                            </div>

                            <div className="order-summary-card">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold">Total do Pedido:</span>
                                    <span className="text-2xl font-bold order-total-badge px-4 py-2 rounded-lg">{formatCurrency(total)}</span>
                                </div>
                            </div>

                            {hasStockErrors && (
                                <div className="stock-alert rounded-lg border border-destructive bg-destructive/10 p-4 slide-up">
                                    <div className="flex items-center gap-2 text-destructive">
                                        <AlertCircle className="size-5" />
                                        <span className="font-semibold">Atenção: Há produtos com estoque insuficiente!</span>
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={isConfirmed || processing || items.length === 0 || hasStockErrors || !!cepError || isValidatingCep}
                                    className="action-button-primary"
                                >
                                    {processing ? submitProcessingLabel : submitLabel}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.visit('/orders')}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

