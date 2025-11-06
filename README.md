# Sistema de Pedidos de Supermercado - Fisa Supermercados

Sistema completo de gestão de pedidos e estoque para supermercado desenvolvido com Laravel (PHP) no backend e React/TypeScript no frontend, utilizando Inertia.js para integração.

## 📋 Requisitos do Sistema

Este sistema implementa todos os requisitos solicitados:

1. ✅ Formulário de cadastro de pedidos
2. ✅ Campos: Nome do Cliente, Data de Entrega, Lista de Compras
3. ✅ Lista de compras com produtos e quantidades
4. ✅ Alterar quantidade ou excluir itens
5. ✅ Cálculo automático do valor total
6. ✅ Dados salvos em banco de dados
7. ✅ Pedido salvo debita estoque (ao confirmar)
8. ✅ Alerta quando quantidade não disponível
9. ✅ Função para mostrar estoque
10. ✅ Importação do arquivo Products.csv

## 🛠️ Tecnologias Utilizadas

### Backend
- **Laravel 12** - Framework PHP
- **PHP 8.2+** - Linguagem de programação
- **MySQL** - Banco de dados
- **Laravel Fortify** - Autenticação
- **Inertia.js** - Integração frontend/backend

### Frontend
- **React 19** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS
- **Vite** - Build tool
- **Radix UI** - Componentes acessíveis

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **PHP 8.2 ou superior**
   - Extensões necessárias: `pdo`, `pdo_mysql`, `mbstring`, `openssl`, `curl`, `xml`, `zip`, `gd`

2. **Composer** (Gerenciador de dependências PHP)
   - Download: https://getcomposer.org/download/

3. **Node.js 18+ e npm** (ou yarn)
   - Download: https://nodejs.org/

4. **MySQL 8.0+** ou **MariaDB 10.3+**
   - Servidor MySQL instalado e rodando

5. **Git** (opcional, para clonar o repositório)

## 🚀 Instalação Passo a Passo

### Passo 1: Clonar/Baixar o Projeto

Se você tem o repositório Git:
```bash
git clone <url-do-repositorio>
cd fisacorp
```

Ou simplesmente extraia o arquivo ZIP do projeto na pasta desejada.

### Passo 2: Entrar na Pasta do Projeto

```bash
cd my-app
```

### Passo 3: Instalar Dependências do PHP

```bash
composer install
```

Este comando instalará todas as dependências PHP definidas no `composer.json`.

### Passo 4: Configurar o Arquivo de Ambiente

Copie o arquivo `.env.example` para `.env`:

**Windows:**
```bash
copy .env.example .env
```

**Linux/Mac:**
```bash
cp .env.example .env
```

### Passo 5: Configurar o Banco de Dados

Abra o arquivo `.env` e configure as seguintes variáveis:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fisacorp
DB_USERNAME=root
DB_PASSWORD=sua_senha_mysql
```

**Importante:** 
- Substitua `fisacorp` pelo nome do banco de dados que você criou ou deseja criar
- Substitua `root` pelo seu usuário MySQL
- Substitua `sua_senha_mysql` pela senha do seu MySQL

### Passo 6: Criar o Banco de Dados

Crie o banco de dados MySQL. Você pode fazer isso de duas formas:

#### Opção A: Via MySQL Command Line
```bash
mysql -u root -p
```

Depois, dentro do MySQL:
```sql
CREATE DATABASE fisacorp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### Opção B: Via phpMyAdmin ou outro gerenciador
1. Acesse o phpMyAdmin (geralmente em `http://localhost/phpmyadmin`)
2. Clique em "Novo" ou "Criar banco de dados"
3. Digite o nome: `fisacorp`
4. Selecione o charset: `utf8mb4_unicode_ci`
5. Clique em "Criar"

### Passo 7: Gerar a Chave de Aplicação

```bash
php artisan key:generate
```

Este comando gera uma chave única para criptografia da aplicação.

### Passo 8: Executar as Migrações

```bash
php artisan migrate
```

Este comando criará todas as tabelas necessárias no banco de dados:
- `users` - Usuários do sistema
- `products` - Produtos do estoque
- `orders` - Pedidos
- `order_items` - Itens dos pedidos
- Tabelas de cache, sessões, filas, etc.

### Passo 9: Instalar Dependências do Node.js

```bash
npm install
```

Este comando instalará todas as dependências JavaScript/TypeScript definidas no `package.json`.

### Passo 10: Importar Produtos (Opcional mas Recomendado)

Se você tem o arquivo `Products.csv` na raiz do projeto (`C:\wamp64\www\fisacorp\Products.csv`), importe os produtos:

```bash
php artisan products:import ../Products.csv
```

**Nota:** O caminho pode variar dependendo de onde você colocou o arquivo CSV. Ajuste conforme necessário.

### Passo 11: Compilar os Assets do Frontend

```bash
npm run build
```

Este comando compila todos os arquivos React/TypeScript e CSS para produção.

**OU**, para desenvolvimento com hot-reload:

```bash
npm run dev
```

Mantenha este comando rodando em um terminal separado.

### Passo 12: Criar um Usuário (Opcional)

Você pode criar um usuário através do Tinker ou diretamente no banco de dados:

```bash
php artisan tinker
```

Dentro do Tinker:
```php
$user = \App\Models\User::create([
    'name' => 'Administrador',
    'email' => 'admin@fisacorp.com',
    'password' => \Illuminate\Support\Facades\Hash::make('senha123'),
    'email_verified_at' => now(),
]);
```

Ou use o seeder (se existir):
```bash
php artisan db:seed
```

## 🎯 Executando o Projeto

### Modo Desenvolvimento

Você precisa ter **dois terminais** abertos:

**Terminal 1 - Servidor Laravel:**
```bash
php artisan serve
```

O servidor estará rodando em: `http://127.0.0.1:8000`

**Terminal 2 - Vite (Frontend):**
```bash
npm run dev
```

O Vite estará rodando em: `http://localhost:5173` (geralmente)

**Acesse:** `http://127.0.0.1:8000`

### Modo Produção

Após compilar os assets (`npm run build`), execute apenas:

```bash
php artisan serve
```

Acesse: `http://127.0.0.1:8000`

### Comando Único (Recomendado)

Laravel também oferece um comando que inicia tudo de uma vez:

```bash
composer run dev
```

Este comando inicia o servidor PHP, filas e o Vite simultaneamente.

## 👤 Primeiro Acesso

1. Acesse `http://127.0.0.1:8000`
2. Clique em "Registrar" ou "Login"
3. Se você não criou um usuário, registre-se com:
   - Nome: Seu Nome
   - Email: seu@email.com
   - Senha: (mínimo 8 caracteres)
4. Após o login, você será redirecionado para o Dashboard

## 📁 Estrutura do Projeto

```
fisacorp/
├── my-app/                    # Aplicação Laravel
│   ├── app/
│   │   ├── Console/Commands/ # Comandos Artisan
│   │   ├── Http/Controllers/ # Controladores
│   │   └── Models/           # Modelos Eloquent
│   ├── database/
│   │   ├── migrations/        # Migrações do banco
│   │   └── seeders/           # Seeders
│   ├── resources/
│   │   ├── js/
│   │   │   ├── pages/         # Páginas React
│   │   │   ├── components/    # Componentes React
│   │   │   └── layouts/       # Layouts
│   │   └── css/               # Estilos CSS
│   ├── routes/
│   │   └── web.php            # Rotas web
│   └── .env                   # Configurações (não versionado)
├── Products.csv              # Arquivo para importação
└── README.md                 # Este arquivo
```

## 🔧 Comandos Úteis

### Artisan (Backend)
```bash
# Executar migrações
php artisan migrate

# Reverter última migração
php artisan migrate:rollback

# Ver rotas
php artisan route:list

# Limpar cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Importar produtos
php artisan products:import caminho/do/arquivo.csv
```

### NPM (Frontend)
```bash
# Desenvolvimento
npm run dev

# Compilar para produção
npm run build

# Verificar tipos TypeScript
npm run types

# Formatar código
npm run format

# Verificar lint
npm run lint
```

## 🧪 Testes

Para executar os testes PHPUnit:

```bash
php artisan test
```

## 📝 Funcionalidades Principais

### 1. Dashboard
- Estatísticas gerais do sistema
- Pedidos recentes
- Produtos com estoque baixo
- Receita total

### 2. Gestão de Pedidos
- Criar novo pedido
- Editar pedido pendente
- Confirmar pedido (debita estoque)
- Excluir pedido
- Histórico de pedidos confirmados

### 3. Gestão de Estoque
- Visualizar produtos e estoque
- Adicionar novos produtos
- Editar produtos (incluindo estoque)
- Excluir produtos

### 4. Validação de CEP
- Integração com ViaCEP
- Validação automática ao digitar 8 dígitos
- Preenchimento automático do endereço

## 🐛 Solução de Problemas Comuns

### Erro: "Could not find driver"
**Solução:** Instale a extensão PDO do MySQL:
```bash
# No php.ini, descomente ou adicione:
extension=pdo_mysql
```

### Erro: "Access denied for user"
**Solução:** Verifique as credenciais no arquivo `.env` (DB_USERNAME e DB_PASSWORD)

### Erro: "Class not found"
**Solução:** Execute:
```bash
composer dump-autoload
```

### Erro: "Vite manifest not found"
**Solução:** Execute:
```bash
npm run build
```

### Porta 8000 já em uso
**Solução:** Use outra porta:
```bash
php artisan serve --port=8001
```

### Erro ao importar produtos
**Solução:** Verifique:
1. O caminho do arquivo CSV está correto?
2. O arquivo tem a codificação correta (ISO-8859-1 ou UTF-8)?
3. O arquivo tem as colunas: id, name, price, qty_stock?

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique os logs em `storage/logs/laravel.log`
2. Verifique o console do navegador (F12) para erros JavaScript
3. Certifique-se de que todas as dependências foram instaladas corretamente

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais e de avaliação.

## ✅ Checklist de Instalação

- [ ] PHP 8.2+ instalado
- [ ] Composer instalado
- [ ] Node.js e npm instalados
- [ ] MySQL instalado e rodando
- [ ] Banco de dados criado
- [ ] Arquivo `.env` configurado
- [ ] `composer install` executado
- [ ] `npm install` executado
- [ ] `php artisan key:generate` executado
- [ ] `php artisan migrate` executado
- [ ] `npm run build` executado (ou `npm run dev` em outro terminal)
- [ ] `php artisan serve` executado
- [ ] Acesso ao sistema em `http://127.0.0.1:8000`

---

**Desenvolvido com ❤️ para Fisa Supermercados**

