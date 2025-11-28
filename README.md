# Flowfest - Protótipo de Alta Fidelidade

Sistema completo de pedidos para bares e festivais com interface moderna, vibrante e otimizada para ambiente noturno.

## 🎨 Características do Design

- **Estilo Visual**: Moderno, vibrante, quente e energizante
- **Paleta de Cores**: Laranja vibrante (#FF7A1A), laranja queimado (#FF5C00), âmbar quente (#FFA733), preto grafite (#0E0E0E), cinza escuro (#1A1A1A)
- **Modo Escuro**: Interface otimizada para uso em ambiente escuro (festival)
- **Design System**: Componentes reutilizáveis e organizados
- **Responsivo**: Versão mobile (obrigatória) e desktop

## 📱 Telas Implementadas

### Fluxo do Usuário
1. **Tela de Boas-vindas** - Logo, slogan, exibição de saldo (se logado) e botões de login/cadastro
2. **Tela de Login** - Autenticação de usuário
3. **Tela de Cadastro** - Criação de conta de usuário
4. **Tela de Seleção do Bar** - Lista de bares com indicadores de demanda
5. **Tela do Cardápio** - Produtos prontos com carrinho flutuante
6. **Tela do Carrinho** - Lista de itens e total
7. **Tela de Pagamento** - PIX e Cartão com estados visuais
8. **Tela de Status** - Status do pedido e botão para QR Code
9. **Tela do QR Code** - QR Code grande com instruções de retirada

### Painel do Bar (Vendedor)
1. **Tela de Login** - Autenticação do vendedor
2. **Painel de Pedidos** - Lista de pedidos pagos com validação
3. **Scanner QR Code** - Simulação de leitura de QR Code
4. **Configurações do Bar** - Nome, status e itens/preços

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start
```

O aplicativo estará disponível em `http://localhost:3000`

## 🎯 Funcionalidades

### Fluxo Completo do Usuário
1. Login/Cadastro → visualizar saldo → selecionar bar → escolher bebidas → carrinho → pagar → QR Code → retirar
2. Sistema de autenticação de usuários (localStorage)
3. Exibição de saldo na página inicial (para depósitos antecipados)
4. Carrinho persistente (localStorage)
5. Simulação de pagamento com estados visuais
6. Geração de QR Code único por pedido

### Fluxo do Bar
1. Login → visualizar pedidos → escanear → validar retirada
2. Gerenciamento de status (aberto/fechado)
3. Edição de itens e preços

## 🎨 Design System

### Componentes
- **Button**: Primário, secundário e desabilitado
- **Input**: Campos de formulário estilizados
- **Card**: Cards reutilizáveis com hover
- **Badge**: Indicadores de status (sucesso, aviso, erro)
- **QuantityButton**: Botões de quantidade (+/-)

### Microinterações
- Animações de entrada/saída
- Transições suaves entre telas
- Feedback visual nos botões
- Efeitos de hover e tap
- Animações de loading

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Desktop**: Layout adaptado para telas maiores
- **Breakpoints**: Tailwind CSS padrão (sm, md, lg, xl)

## 🛠️ Tecnologias

- **Next.js 14**: Framework React
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Framer Motion**: Animações
- **qrcode.react**: Geração de QR Codes

## 📂 Estrutura do Projeto

```
├── app/                    # Páginas Next.js
│   ├── page.tsx           # Tela de boas-vindas
│   ├── login/             # Login de usuário
│   ├── register/          # Cadastro de usuário
│   ├── bars/              # Seleção de bares
│   ├── menu/              # Cardápio
│   ├── cart/              # Carrinho
│   ├── payment/           # Pagamento
│   ├── status/            # Status do pedido
│   ├── qr-code/           # QR Code de retirada
│   └── bar/               # Painel do vendedor
│       ├── login/         # Login
│       ├── dashboard/     # Painel de pedidos
│       ├── scanner/       # Scanner QR
│       └── settings/      # Configurações
├── components/
│   └── design-system/     # Componentes do design system
└── public/                # Arquivos estáticos
```

## 🎭 Estados Visuais

### Pagamento
- **Aguardando**: Seleção de método
- **Processando**: Animação de loading
- **Confirmado**: Feedback verde com check
- **Erro**: Feedback vermelho com opção de retry

### Scanner QR
- **Idle**: Área de leitura pronta
- **Escaneando**: Animação de leitura
- **Válido**: Card verde com confirmação
- **Inválido**: Card vermelho com erro

## 📝 Notas

- O protótipo simula todas as funcionalidades sem backend real
- Dados são armazenados no localStorage do navegador
- QR Codes são gerados com base no ID do pedido
- O scanner simula a leitura após 2 segundos

## 🎨 Paleta de Cores

- **Laranja Vibrante**: `#FF7A1A` - Botões principais, destaques
- **Laranja Queimado**: `#FF5C00` - Hover dos botões
- **Âmbar Quente**: `#FFA733` - Acentos secundários
- **Preto Grafite**: `#0E0E0E` - Fundo principal
- **Cinza Escuro**: `#1A1A1A` - Cards e elementos
- **Branco**: `#FFFFFF` - Texto principal

---

Desenvolvido com ❤️ para festivais e vida noturna


