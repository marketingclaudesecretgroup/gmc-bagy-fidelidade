# Bagy Fidelidade & Google Merchant Center Hub

> Plataforma completa de Programa de Fidelidade e Recompensas especializada para e-commerce Bagy (Locaweb Company), com integração nativa às diretrizes do Google Merchant Center para programas de fidelidade (`loyalty_program`). Inspirada no Fidelizar Mais com arquitetura de alta performance.

---

## 🌟 Principais Recursos & Conformidade com o Google

### 1. Google Merchant Center Loyalty Program Spec (12827255 & 15500486)
- **Atributos de Feed XML / TSV Nativos**:
  - `g:program_label`: Nome único do programa cadastrado no GMC (`Clube Fidelidade Bagy`).
  - `g:tier_label`: Nível de associação (`BRONZE`, `PRATA`, `OURO`, `VIP`).
  - `g:price`: Preço exclusivo para membros destacado no Google Shopping.
  - `g:cashback_for_future_use`: Valor em reais acumulado para compras futuras.
  - `g:loyalty_points`: Pontuação obtida na compra de cada SKU.
  - `g:member_price_effective_date`: Intervalo de vigência dos preços especiais.
  - `g:shipping_label`: Rótulo de frete para ativar o **Frete Grátis exclusivo para membros** nos serviços de entrega do Merchant Center.
- **Vínculo com Conta Google**:
  - Quando o usuário faz buscas logado na sua Conta Google, os badges *"Preço p/ membros"* e *"Frete grátis com programa de fidelidade"* são exibidos automaticamente na SERP e no Google Shopping.
- **Landing Page Homologada (`/clube-fidelidade`)**:
  - Requisito mandatório do Google para aprovação do programa de fidelidade. Contém tabela de níveis, política de frete grátis, termos oficiais, FAQ e JSON-LD semântico `Schema.org/LoyaltyProgram`.

---

### 2. Integração Profunda com E-commerce Bagy
- **Motor de Webhooks (`POST /api/webhooks/bagy`)**:
  - `order.paid`: Credita pontos na conta do cliente com base no total do pedido e no multiplicador do nível ativo. Promove o cliente para novos níveis (Bronze -> Prata -> Ouro -> VIP) automaticamente.
  - `order.cancelled`: Estorna os pontos creditados de compras canceladas ou reembolsadas.
  - `customer.created`: Auto-cadastro no clube com concessão imediata de bônus de 100 pontos de boas-vindas.
- **Motor de Cupons da API Bagy (`POST /api/loyalty/redeem`)**:
  - Resgate em tempo real: o cliente troca saldo de pontos por cupons aplicáveis no checkout da loja Bagy (ex: `VIP-GOLD-7X9B` ou `FIDELIDADE-VAL-30-...`).
- **Widget Flutuante JavaScript (`/widget/bagy-loyalty.js`)**:
  - Script isolado via **Shadow DOM** para injetar na loja Bagy via Tag Manager ou HTML da Bagy.
  - Exibe botão flutuante com badge de pontos, extrato do membro, barra de progresso de nível, catálogo de resgate e cópia de cupom em 1 clique.

---

### 3. Painel Administrativo de Alta Conversão (`/admin`)
- **Design System Dark Glass / Clean Tech**: Interface sem clichês de IA, com alto refinamento estético e microinterações.
- **Métricas de LTV & ROI de Frete**:
  - LTV de membros (R$ 564,80) vs Não-membros (R$ 189,50).
  - Taxa de recompra (+46.4%).
  - ROI de 689% sobre o investimento em frete grátis para membros.
- **Simulador Visual Google Shopping**:
  - Preview interativo em tempo real de como o produto da loja aparece na busca do Google para membros logados na Conta Google versus visitantes genéricos.
- **Gerenciador de Feeds GMC**:
  - Links ao vivo do Feed XML (`/api/gmc/feed.xml`) e TSV (`/api/gmc/feed.tsv`).
  - Auditoria automática de saúde do catálogo (Score 100/100).
- **Configurador de Níveis (Tiers)**:
  - Personalização de Bronze, Prata, Ouro e VIP (multiplicador de pontos, % de desconto de membro, % de cashback, frete grátis sem valor mínimo).
- **Simulador de Webhooks**:
  - Disparador de eventos de teste para validar pedidos pagos, novos clientes e upgrades de nível instantaneamente.

---

## 🚀 Como Executar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Executar em ambiente de desenvolvimento
npm run dev

# 3. Gerar build de produção e iniciar servidor
npm run build
npm run start
```

O sistema estará disponível em `http://localhost:3000`.

### Rotas Principais:
- **Página Inicial / Hub**: `http://localhost:3000/`
- **Painel Administrativo**: `http://localhost:3000/admin`
- **Landing Page Oficial Google**: `http://localhost:3000/clube-fidelidade`
- **Demonstração Loja Bagy + Widget**: `http://localhost:3000/bagy-store-demo`
- **Feed GMC (XML)**: `http://localhost:3000/api/gmc/feed.xml`
- **Feed GMC (TSV)**: `http://localhost:3000/api/gmc/feed.tsv`
- **Auditoria & Schema.org**: `http://localhost:3000/api/gmc/validate`
- **Script do Widget**: `http://localhost:3000/widget/bagy-loyalty.js`

---

## 🛠️ Como Injetar o Widget na Loja Bagy

No painel administrativo da Bagy, acesse **Configurações > Inclusão de Código / Scripts**:

```html
<!-- Bagy Loyalty Widget Script -->
<script 
  src="https://sua-url-de-hospedagem.com/widget/bagy-loyalty.js" 
  data-store-id="bagy_str_994208" 
  async>
</script>
```

---

## 📦 Como Configurar no Google Merchant Center

1. Acesse o **Google Merchant Center**.
2. Vá em **Configurações > Programas do comerciante > Programa de fidelidade** (Loyalty program).
3. Cadastre o nome do programa: `Clube Fidelidade Bagy`.
4. Insira a URL da Landing Page: `https://sua-loja.com.br/clube-fidelidade`.
5. Vá em **Feeds > Adicionar Feed Suplementar**:
   - Tipo: Busca programada (Scheduled fetch).
   - URL do arquivo: `https://sua-url-de-hospedagem.com/api/gmc/feed.xml`.
6. Em **Serviços de Frete**, crie uma regra de frete gratuito associada ao rótulo `loyalty_free_shipping`.
