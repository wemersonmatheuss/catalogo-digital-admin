# 🗂️ Catálogo Digital — Admin e API

Painel da Sempre-Viva e a API que guarda o catálogo. O painel cadastra categorias, peças e banners. A vitrine pública, em outro repositório, só lê esses dados e registra a sacola.

O banco previsto é PostgreSQL, via Prisma. Enquanto a conexão não estiver configurada, a API continua gravando em arquivo local.

---

## 📌 Objetivo

> Ter um back-end com camadas separadas e um painel que não chama HTTP espalhado pelas telas.

O projeto teve como objetivos principais:

* Expor o catálogo e os carrinhos em uma API REST
* Isolar rota, regra e persistência
* Deixar o Prisma pronto para PostgreSQL
* Fazer o painel consumir essa API por uma camada própria

---

## 🧠 O que foi aplicado neste projeto

* API em **controller, service e repository**
* Dois repositórios para o mesmo contrato: arquivo JSON agora, **Prisma** quando existir `DATABASE_URL`
* Painel Angular organizado por **features**
* Camada **`core/api`** como único lugar do painel que fala com a API
* Estilos do painel em **SCSS**, com tokens em `frontend/src/styles/abstracts`

---

## 🛠️ Tecnologias Utilizadas

### Back-end

* **Node.js** — runtime
* **TypeScript** — linguagem da API
* **Prisma** — ORM, com provider PostgreSQL
* **PostgreSQL** — banco previsto; a conexão fica para a próxima etapa

### Front-end do painel

* **Angular 21**
* **Ionic 9**
* **TypeScript**
* **SCSS**

---

## 🗂️ Padrões de Projeto Aplicados

| Padrão | Onde foi aplicado |
|---|---|
| **Repository** | `CatalogRepository` e `CartRepository` — o service não sabe se o dado está em arquivo ou no PostgreSQL |
| **Controller** | `CatalogController` e `CartController` — traduzem HTTP para o service |
| **Service** | `CatalogService` e `CartService` — validam o pedido antes de persistir |

---

## ⚙️ Funcionalidades

* 📦 Leitura e gravação do catálogo (categorias, peças e banners)
* 🛍️ Registro da sacola com código `SV-`
* 🔎 Consulta de uma sacola pelo código
* 🖥️ Painel para entrar, ver o resumo e manter peças, categorias, banners e carrinhos

O acesso do painel ainda é de demonstração: um e-mail válido e uma senha de pelo menos 8 caracteres. A senha não é conferida no servidor.

---

## 🖥️ Como rodar o projeto localmente

### Pré-requisitos

* Node.js 22.12 ou superior
* PostgreSQL só quando for ligar o banco. Sem `DATABASE_URL`, a API usa `backend/data`

### API

1. Clone o repositório:

```bash
git clone https://github.com/wemersonmatheuss/catalogo-digital-admin.git
```

2. Suba a API:

```bash
npm install --prefix backend
npm run dev:api
```

A API fica em `http://localhost:3002`.

Para usar PostgreSQL depois, copie `backend/.env.example` para `backend/.env`, preencha `DATABASE_URL` e rode:

```bash
cd backend
npx prisma migrate dev
```

### Painel

```bash
npm install
npm run dev
```

O painel fica em `http://localhost:4201`.

### Rotas do painel

| Rota | Tela |
|---|---|
| `/login` | Entrada |
| `/dashboard` | Resumo |
| `/produtos` | Peças |
| `/banners` | Banners |
| `/categorias` | Categorias |
| `/carrinhos` | Consulta de sacola |

---

## 📡 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/catalog` | Devolve categorias, peças e banners |
| `PUT` | `/catalog` | Substitui o catálogo inteiro |
| `POST` | `/carts` | Grava uma sacola e devolve o código `SV-` |
| `GET` | `/carts/{id}` | Busca uma sacola pelo código |

---

## 👨‍💻 Autor

Wemerson Matheus  
[github.com/wemersonmatheuss](https://github.com/wemersonmatheuss)
