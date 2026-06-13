# MADINDA Family Budget

Application de gestion des dépenses familiales — Site vitrine + Application mobile hybride + API REST.

## Architecture

```
madinda-app-manger/
├── src/                    # Frontend React + TypeScript
│   ├── public-pages/       # Site vitrine (landing page)
│   ├── pages/              # Pages application privée
│   ├── components/         # Composants partagés
│   ├── store/              # Zustand (état auth)
│   ├── services/           # Axios API client
│   ├── types/              # Types TypeScript
│   └── styles/             # Styles CSS
├── backend/                # API Node.js + Express + TypeScript
│   └── src/
│       ├── controllers/    # Contrôleurs REST
│       ├── routes/         # Routes API
│       ├── models/         # Modèles base de données
│       ├── middlewares/    # Auth JWT, error handler
│       └── services/       # Service auth (bcrypt + JWT)
├── docker-compose.yml      # Déploiement Docker
├── Dockerfile              # Frontend (Nginx)
└── nginx.conf              # Configuration proxy
```

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite 8 |
| Backend | Node.js 24, Express 5, TypeScript |
| Base de données | MariaDB 11 |
| Auth | JWT + bcrypt |
| State | Zustand |
| API Client | Axios |
| Charts | Recharts |
| Déploiement | Docker, Vercel, GitHub |

## Prérequis

- Node.js 24+
- Docker Desktop (pour MariaDB)
- npm

## Installation

```bash
# 1. Cloner le projet
git clone <url>
cd madinda-app-manger

# 2. Installer les dépendances frontend
npm install

# 3. Installer les dépendances backend
cd backend && npm install && cd ..

# 4. Démarrer MariaDB avec Docker
docker compose up -d database

# 5. Lancer le backend
cd backend && npm run dev

# 6. Lancer le frontend (nouveau terminal)
cd .. && npm run dev
```

## Routes

### Site public (accessible sans auth)

| Route | Page |
|-------|------|
| `/` | Accueil (Hero, Features, Comment ça marche, FAQ, Contact) |
| `/about` | À propos |
| `/features` | Fonctionnalités |
| `/download` | Téléchargement |
| `/contact` | Contact |

### Application privée (auth requise)

| Route | Page |
|-------|------|
| `/login` | Connexion |
| `/register` | Inscription |
| `/app` | Dashboard |
| `/app/expenses` | Dépenses |
| `/app/categories` | Catégories |
| `/app/reports` | Statistiques |
| `/app/profile` | Profil |

## API Endpoints

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/register` | Inscription |
| `POST` | `/api/auth/login` | Connexion |
| `GET` | `/api/auth/me` | Profil courant |
| `GET` | `/api/families` | Liste des familles |
| `POST` | `/api/families` | Créer une famille |
| `GET` | `/api/families/:id/members` | Membres d'une famille |
| `GET` | `/api/expenses` | Liste des dépenses |
| `POST` | `/api/expenses` | Ajouter une dépense |
| `PUT` | `/api/expenses/:id` | Modifier une dépense |
| `DELETE` | `/api/expenses/:id` | Supprimer une dépense |
| `GET` | `/api/expenses/stats` | Statistiques dashboard |
| `GET` | `/api/categories` | Catégories |
| `GET` | `/api/budgets` | Budgets |
| `POST` | `/api/budgets` | Créer un budget |

## Déploiement Docker

```bash
docker compose up -d --build
```

- Frontend : `http://localhost:8080`
- Backend API : `http://localhost:3000`
- MariaDB : `localhost:3307`

## Scripts

```bash
npm run dev        # Démarrer le frontend (Vite)
npm run build      # Build production
npm run lint       # Linter ESLint
npm run preview    # Preview build
```

## Base de données

Le schéma MariaDB se trouve dans `backend/src/database/schema.sql`.
Catégories préremplies : Alimentation, Transport, Logement, Santé, Éducation, Loisirs, etc.

## Problème connu : Docker Desktop

Si Docker Desktop n'est pas démarré, lancez-le manuellement depuis le menu Démarrer, puis :

```bash
docker compose up -d database
```

---

## Déploiement

- **Frontend (Vercel)** : [https://madinda-app-manger.vercel.app](https://madinda-app-manger.vercel.app)
- **Backend API** : accessible via `/_/backend/api` sur le même domaine
- **GitHub** : [https://github.com/Wabtechs/-MADINDA-Family-Budget](https://github.com/Wabtechs/-MADINDA-Family-Budget)

Projet développé dans le cadre du mémoire "Développement d'une application Android hybride pour le suivi des dépenses familiales — Cas de la famille MADINDA".
