# 🚀 YumyLand - Guia de Deploy & Setup

## 📋 Pré-requisitos

- Node.js 18+ (recomendado: 22)
- PostgreSQL 14+ (ou Docker)
- Conta Stripe (para Visa/Mastercard)
- Conta PaySuite (para M-Pesa/e-Mola)

---

## 🔧 Setup Local (Desenvolvimento)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

**Opção A: Docker (recomendado)**
```bash
docker compose up -d
```

**Opção B: PostgreSQL local**
Instale PostgreSQL e crie um banco chamado `yumyland`.

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais.

### 4. Criar tabelas no banco

```bash
npx prisma migrate dev --name init
```

### 5. Popular com dados de teste

```bash
npx prisma db seed
```

### 6. Rodar o servidor

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 👤 Contas de Teste (após seed)

| Email | Senha | Role | Empresa |
|-------|-------|------|---------|
| master@yumyland.co.mz | master123 | MASTER | — |
| carlos@tropical.co.mz | owner123 | OWNER | Restaurante Tropical |
| ana@cafemaputo.co.mz | owner123 | OWNER | Cafe Maputo |
| joao@pizzabeira.co.mz | owner123 | OWNER | Pizza Beira |

---

## 💳 Configurar Pagamentos

### Stripe (Visa / Mastercard)

1. Crie conta em [stripe.com](https://stripe.com)
2. Copie as chaves de teste do Dashboard → API Keys
3. Configure webhook:
   - URL: `https://seu-dominio.com/api/payments/stripe/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`

**Para testar localmente:**
```bash
# Instale Stripe CLI
stripe listen --forward-to localhost:3000/api/payments/stripe/webhook
```

### PaySuite (M-Pesa / e-Mola)

1. Crie conta em [paysuite.co.mz](https://paysuite.co.mz)
2. Obtenha API Key e Merchant ID
3. Configure webhook URL: `https://seu-dominio.com/api/payments/paysuite/webhook`

---

## 🌐 Deploy em Produção

### Opção 1: Vercel (Frontend + API)

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Adicione as variáveis de ambiente no dashboard Vercel.

### Opção 2: Railway (Full Stack)

1. Conecte seu repositório GitHub
2. Railway detectará automaticamente o Next.js
3. Adicione um serviço PostgreSQL
4. Configure variáveis de ambiente
5. Deploy automático a cada push

### Opção 3: Docker (VPS/DigitalOcean)

```bash
# Build
docker build -t yumyland .

# Run
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://seu-dominio.com" \
  -e STRIPE_SECRET_KEY="..." \
  -e PAYSUITE_API_KEY="..." \
  yumyland
```

---

## 📊 Comandos Úteis

```bash
# Ver dados no banco
npx prisma studio

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma migrate reset

# Gerar cliente Prisma após mudanças no schema
npx prisma generate

# Push schema sem criar migration (desenvolvimento)
npx prisma db push

# Build de produção
npm run build

# Rodar build de produção
npm start
```

---

## 🔒 Checklist de Segurança para Produção

- [ ] Alterar NEXTAUTH_SECRET para uma chave forte
- [ ] Usar variáveis de produção do Stripe (sk_live_)
- [ ] Configurar CORS adequadamente
- [ ] Ativar SSL/HTTPS
- [ ] Configurar rate limiting
- [ ] Backup automático do PostgreSQL
- [ ] Monitoramento de erros (Sentry, etc.)

---

## 📁 Estrutura de API

| Rota | Método | Descrição | Auth |
|------|--------|-----------|------|
| `/api/auth/register` | POST | Cadastro de empresa | ❌ |
| `/api/auth/[...nextauth]` | GET/POST | Login/Logout | ❌ |
| `/api/dashboard/stats` | GET | Estatísticas do painel | ✅ OWNER |
| `/api/products` | GET/POST | Listar/Criar produtos | ✅ OWNER |
| `/api/products/[id]` | GET/PUT/DELETE/PATCH | CRUD produto | ✅ OWNER |
| `/api/categories` | GET/POST | Listar/Criar categorias | ✅ OWNER |
| `/api/categories/[id]` | PUT/DELETE | Editar/Apagar categoria | ✅ OWNER |
| `/api/reservations` | GET/POST | Listar/Criar reservas | ✅ OWNER |
| `/api/reservations/[id]` | PATCH | Atualizar status | ✅ OWNER |
| `/api/customers` | GET/POST | Listar/Criar clientes | ✅ OWNER |
| `/api/payments/paysuite/initiate` | POST | Iniciar pagamento M-Pesa/e-Mola | ✅ OWNER |
| `/api/payments/paysuite/webhook` | POST | Webhook PaySuite | ❌ (assinatura) |
| `/api/payments/stripe/create-intent` | POST | Criar PaymentIntent | ✅ OWNER |
| `/api/payments/stripe/webhook` | POST | Webhook Stripe | ❌ (assinatura) |
| `/api/payments/status/[id]` | GET | Status do pagamento | ✅ OWNER |
| `/api/subscriptions/pay` | POST | Pagar assinatura | ✅ OWNER |
| `/api/master/stats` | GET | Stats gerais (admin) | ✅ MASTER |
| `/api/master/companies` | GET | Listar empresas | ✅ MASTER |
| `/api/master/companies/[id]` | PATCH | Ativar/Suspender empresa | ✅ MASTER |
| `/api/master/subscriptions` | GET | Listar assinaturas | ✅ MASTER |
| `/api/master/subscriptions/[id]` | PATCH | Gerir assinatura | ✅ MASTER |
| `/api/public/menu/[slug]` | GET | Cardápio público | ❌ |
| `/api/public/reserve` | POST | Reservar mesa (público) | ❌ |
