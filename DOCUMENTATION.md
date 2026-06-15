
# 📚 Documentation technique — MADINDA Family Budget

> **Version :** 2.0.0  
> **Statut :** Production  
> **Stack :** React 19 · Express 5 · MariaDB · TypeScript  

---

## 1. Architecture générale

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Navigateur)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MADINDA PWA (React 19)                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │   │
│  │  │  Pages   │  │Components│  │  Store (Zustand)  │   │   │
│  │  ├──────────┤  ├──────────┤  ├──────────────────┤   │   │
│  │  │  Hooks   │  │ Services │  │   Types/DTOs     │   │   │
│  │  └──────────┘  └──────────┘  └──────────────────┘   │   │
│  │                    │ Axios                            │   │
│  │              ┌─────┴─────┐                           │   │
│  │              │SW Workbox │ Cache API & Offline       │   │
│  │              └───────────┘                           │   │
│  └──────────────────────────┬───────────────────────────┘   │
└─────────────────────────────┼───────────────────────────────┘
                              │ HTTP / HTTPS
┌─────────────────────────────┼───────────────────────────────┐
│  NODE ENV                   │                               │
│  ┌──────────────────────────┴───────────────────────────┐   │
│  │              SERVEUR EXPRESS 5                        │   │
│  │                                                        │   │
│  │  Routes → Middleware (auth) → Contrôleurs → Services │   │
│  │                              ↓                        │   │
│  │                          Modèles → MySQL2 → MariaDB  │   │
│  │                                                        │   │
│  │  Middleware : auth JWT · errorHandler · CORS · JSON   │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Structure du projet

```
madinda-app-manger/
├── index.html                        # Point d'entrée HTML
├── vite.config.ts                    # Configuration Vite + PWA
├── package.json                      # Dépendances frontend
├── tsconfig.json                     # Configuration TypeScript
├── Dockerfile                        # Build Docker frontend
├── nginx.conf                        # Configuration Nginx
├── docker-compose.yml                # Orchestration Docker
├── vercel.json                       # Déploiement Vercel
├── public/                           # Ressources statiques
│   ├── icons/                        # Icônes PWA (72px → 512px)
│   ├── favicon.png
│   └── logo.png
├── src/                              # Code source frontend
│   ├── main.tsx                      # Point d'entrée React
│   ├── App.tsx                       # Routes principales
│   ├── index.css                     # Styles globaux
│   ├── assets/                       # Images, polices
│   ├── components/                   # Composants réutilisables
│   │   ├── ui/                       # Boutons, Inputs, Modals, etc.
│   │   ├── layouts/                  # PublicLayout, AppLayout
│   │   ├── ProtectedRoute.tsx        # Garde d'authentification
│   │   ├── BottomNav.tsx             # Navigation mobile
│   │   └── PWAUpdatePrompt.tsx       # Notification de mise à jour PWA
│   ├── pages/                        # Pages
│   │   ├── public/                   # Site vitrine
│   │   │   ├── Home.tsx              # Accueil
│   │   │   ├── Features.tsx          # Fonctionnalités
│   │   │   ├── HowItWorks.tsx        # Comment ça marche
│   │   │   └── Contact.tsx           # Contact
│   │   └── app/                      # Application privée
│   │       ├── Dashboard.tsx         # Tableau de bord
│   │       ├── Incomes.tsx           # Revenus
│   │       ├── Expenses.tsx          # Dépenses
│   │       ├── Accounts.tsx          # Comptes
│   │       ├── Transfers.tsx         # Transferts
│   │       ├── Budgets.tsx           # Budgets
│   │       ├── Goals.tsx             # Objectifs
│   │       ├── Debts.tsx             # Dettes
│   │       ├── Documents.tsx         # Documents
│   │       ├── Reports.tsx           # Rapports
│   │       ├── Profile.tsx           # Profil
│   │       ├── Notifications.tsx     # Notifications
│   │       └── Login.tsx / Register.tsx # Authentification
│   ├── services/
│   │   └── api.ts                    # Client Axios (tous les endpoints)
│   ├── store/
│   │   ├── authStore.ts              # État authentification (Zustand)
│   │   └── entityStore.ts            # État entité active (Zustand)
│   ├── hooks/                        # Hooks personnalisés
│   ├── types/                        # Types TypeScript (DTOs)
│   └── data/                         # Données statiques
│
└── backend/                          # API REST
    ├── package.json                  # Dépendances backend
    ├── tsconfig.json
    ├── Dockerfile
    ├── .env                          # Variables d'environnement (ignoré par git)
    └── src/
        ├── server.ts                 # Point d'entrée Express
        ├── config/
        │   ├── database.ts           # Pool MySQL
        │   ├── env.ts                # Variables d'environnement typées
        │   └── schema.sql            # Schéma de base de données
        ├── routes/                   # 15 fichiers de routes REST
        │   ├── index.ts              # Regroupement des routes
        │   ├── auth.ts               # /api/auth/*
        │   ├── entities.ts           # /api/entities/*
        │   ├── accounts.ts           # /api/accounts/*
        │   ├── incomes.ts            # /api/incomes/*
        │   ├── expenses.ts           # /api/expenses/*
        │   ├── transfers.ts          # /api/transfers/*
        │   ├── budgets.ts            # /api/budgets/*
        │   ├── goals.ts              # /api/goals/*
        │   ├── debts.ts              # /api/debts/*
        │   ├── documents.ts          # /api/documents/*
        │   ├── categories.ts         # /api/categories/*
        │   ├── notifications.ts      # /api/notifications/*
        │   ├── dashboard.ts          # /api/dashboard/*
        │   ├── reports.ts            # /api/reports/*
        │   └── audit.ts              # /api/audit-logs/*
        ├── controllers/              # 14 contrôleurs
        ├── services/                 # 14 services métier (logique + auth)
        ├── models/                   # 16 modèles (requêtes SQL)
        ├── middlewares/
        │   ├── auth.ts               # Middleware JWT
        │   └── errorHandler.ts       # Gestionnaire d'erreurs
        ├── types/                    # Types TypeScript
        └── utils/
            └── errors.ts             # Classes d'erreur (AppError, etc.)
```

---

## 3. Base de données

### 3.1 Schéma relationnel

Le schéma complet se trouve dans `backend/src/database/schema.sql`.

**17 tables :**

| Table | Description |
|:------|:------------|
| `users` | Utilisateurs de l'application |
| `password_resets` | Tokens de réinitialisation de mot de passe |
| `entities` | Entités (famille, entreprise, association) |
| `entity_members` | Membres d'une entité avec leur rôle |
| `accounts` | Comptes bancaires ou financiers |
| `categories` | Catégories de revenus et dépenses |
| `incomes` | Revenus enregistrés |
| `expenses` | Dépenses enregistrées |
| `transfers` | Transferts entre comptes |
| `transactions` | Journal des transactions |
| `budgets` | Budgets définis |
| `goals` | Objectifs d'épargne |
| `debts` | Dettes (actives et passives) |
| `debt_payments` | Paiements effectués sur une dette |
| `documents` | Documents stockés (factures, reçus) |
| `notifications` | Notifications utilisateur |
| `audit_logs` | Journal d'audit |

### 3.2 Relations principales

```
users ──< entity_members >── entities
entities ──< accounts
entities ──< incomes
entities ──< expenses
entities ──< transfers
entities ──< budgets
entities ──< goals
entities ──< debts
entities ──< documents
accounts ──< transactions
incomes ──< transactions
expenses ──< transactions
debts ──< debt_payments
```

### 3.3 Index et performances

- Index sur `entity_id` dans toutes les tables de données
- Index sur `user_id` dans les tables relationnelles
- Index composite sur `(reference_type, reference_id)` dans `transactions`
- Index sur `date` pour les requêtes de période
- Index sur `email` dans `users` (unique)
- Index sur `token` dans `password_resets`

---

## 4. API REST

### 4.1 Authentification

```
POST   /api/auth/register         # Créer un compte
POST   /api/auth/login            # Se connecter
POST   /api/auth/forgot-password  # Demander un reset
POST   /api/auth/reset-password   # Réinitialiser le mot de passe
GET    /api/auth/me               # Profil (auth requis)
PUT    /api/auth/profile          # Modifier le profil (auth requis)
PUT    /api/auth/password         # Changer le mot de passe (auth requis)
```

### 4.2 Entités

```
GET    /api/entities              # Lister mes entités (auth)
POST   /api/entities              # Créer une entité (auth)
GET    /api/entities/:id          # Détail d'une entité (auth + membre)
PUT    /api/entities/:id          # Modifier une entité (auth + admin)
DELETE /api/entities/:id          # Supprimer une entité (auth + admin)
GET    /api/entities/:id/members  # Membres (auth + membre)
POST   /api/entities/:id/members  # Ajouter un membre (auth + admin)
PUT    /api/entities/:id/members/:userId   # Modifier rôle (auth + admin)
DELETE /api/entities/:id/members/:userId   # Retirer membre (auth + admin)
```

### 4.3 Comptes

```
GET    /api/accounts?entity_id=     # Lister (auth + membre)
POST   /api/accounts                # Créer (auth + membre)
GET    /api/accounts/:id            # Détail (auth + membre)
PUT    /api/accounts/:id            # Modifier (auth + admin)
DELETE /api/accounts/:id            # Supprimer (auth + admin)
POST   /api/accounts/transfer       # Transfert (auth + membre)
```

### 4.4 Revenus et Dépenses

```
GET    /api/incomes?entity_id=      # Lister
POST   /api/incomes                 # Créer
GET    /api/incomes/:id             # Détail
PUT    /api/incomes/:id             # Modifier (manager+)
DELETE /api/incomes/:id             # Supprimer (manager+)
GET    /api/incomes/stats           # Statistiques

GET    /api/expenses?entity_id=     # Lister
POST   /api/expenses                # Créer
GET    /api/expenses/:id            # Détail
PUT    /api/expenses/:id            # Modifier (manager+)
DELETE /api/expenses/:id            # Supprimer (manager+)
GET    /api/expenses/stats          # Statistiques
```

### 4.5 Budgets, Objectifs, Dettes

```
GET/POST     /api/budgets           # CRUD Budgets
GET/PUT/DEL  /api/budgets/:id

GET/POST     /api/goals             # CRUD Objectifs
GET/PUT/DEL  /api/goals/:id

GET/POST     /api/debts             # CRUD Dettes
GET/PUT/DEL  /api/debts/:id
POST         /api/debts/:id/payments  # Paiement sur dette
GET          /api/debts/:id/payments  # Historique paiements
```

### 4.6 Dashboard et Rapports

```
GET /api/dashboard?entity_id=       # Vue globale consolidée
GET /api/reports/monthly?entity_id=&year=   # Rapport mensuel
GET /api/reports/annual?entity_id=&year=    # Rapport annuel
GET /api/reports/categories?entity_id=&start_date=&end_date=  # Analyse catégories
```

### 4.7 Notifications, Documents, Audit

```
GET    /api/notifications           # Mes notifications
PUT    /api/notifications/:id/read  # Marquer comme lue
PUT    /api/notifications/read-all  # Tout marquer lu
GET    /api/notifications/unread-count  # Compteur non lues

GET/POST /api/documents             # Documents
DELETE   /api/documents/:id

GET /api/audit-logs?entity_id=      # Journal d'audit
```

### 4.8 Format des réponses

**Succès :**
```json
{
  "data": { ... },
  "message": "Action effectuée avec succès"
}
```

**Erreur :**
```json
{
  "error": {
    "message": "Description de l'erreur",
    "status": 400
  }
}
```

### 4.9 Codes HTTP utilisés

| Code | Signification |
|:-----|:--------------|
| 200 | Succès (GET, PUT) |
| 201 | Création réussie (POST) |
| 400 | Requête invalide (validation) |
| 401 | Non authentifié (token manquant/invalide) |
| 403 | Non autorisé (rôle insuffisant) |
| 404 | Ressource non trouvée |
| 500 | Erreur interne du serveur |

---

## 5. Sécurité

### 5.1 Authentification et autorisation

```
Request → [JWT Middleware] → vérifie token → [Controller] → [Service]
                                                              │
                                              ┌───────────────┴───────────────┐
                                              │ requireMembership(entityId)    │
                                              │ requireManager(entityId)       │
                                              │ requireAdmin(entityId)         │
                                              └───────────────────────────────┘
```

- **JWT** : signé avec `HS256`, contient `userId`, `email`, `role`
- **bcrypt** : 12 rounds de salage pour les mots de passe
- **Roles** : `admin` (tout), `manager` (CRUD), `viewer` (lecture seule)

### 5.2 Protection contre les injections SQL

Toutes les requêtes utilisent des **paramètres préparés** (MySQL2) :

```typescript
// ❌ Mauvaise pratique — concaténation
const sql = `SELECT * FROM users WHERE email = '${email}'`;

// ✅ Bonne pratique — paramètre préparé
const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
```

### 5.3 CORS

```typescript
// Production : origines spécifiques
origin: process.env.CORS_ORIGIN?.split(',') || [
  'http://localhost:5173',
  'http://localhost:4173',
],
credentials: true
```

### 5.4 Headers de sécurité (Nginx)

```nginx
# À ajouter dans nginx.conf
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
```

---

## 6. PWA — Progressive Web App

### 6.1 Configuration

Le fichier `vite.config.ts` configure `vite-plugin-pwa` avec :

- **Service Worker** : généré automatiquement par Workbox
- **Stratégie de cache** :
  - Pages et ressources : `precache` (à l'installation)
  - API : `NetworkFirst` avec fallback cache (7 jours)
  - Images : `CacheFirst` (30 jours)
  - Polices : `StaleWhileRevalidate` (60 jours)
- **Manifest** : icônes de 72px à 512px, thème `#059669`

### 6.2 Cycle de vie

```
Installation
  ↓
Téléchargement des ressources (precache)
  ↓
Activation du Service Worker
  ↓
Application prête (standalone ou navigateur)
  ↓
Mise à jour disponible → Notification → Rechargement
```

### 6.3 Cache offline

| Ressource | Stratégie | Durée |
|:----------|:----------|:------|
| HTML, JS, CSS | Precached (install) | Permanente |
| Icônes, logo | CacheFirst | 30 jours |
| API (GET) | NetworkFirst | 7 jours |
| Google Fonts | StaleWhileRevalidate | 30 jours |

---

## 7. Déploiement

### 7.1 Vercel (production)

Le fichier `vercel.json` configure :
- **Build** : `npm run build` (Vite)
- **Output** : `dist/`
- **Rewrites** : toutes les routes → `index.html` (SPA)
- **Backend** : service séparé monté sur `/_/backend/api`

Variables d'environnement à définir dans Vercel :
```
JWT_SECRET, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL, CORS_ORIGIN
```

### 7.2 Docker (auto-hébergé)

```bash
# Construction et démarrage
docker compose up -d --build

# Vérifier les logs
docker compose logs -f

# Arrêter
docker compose down
```

**Services :**
1. **frontend** (Nginx) → port 8080
2. **backend** (Node.js) → port 3000
3. **database** (MariaDB) → port 3307

### 7.3 Base de données Aiven

1. Créer un service MariaDB sur [Aiven](https://aiven.io)
2. Télécharger le certificat CA
3. Configurer les variables d'environnement :
   ```
   DB_HOST=<host>.aivencloud.com
   DB_PORT=<port>
   DB_USER=avnadmin
   DB_PASSWORD=<password>
   DB_NAME=madinda_budget
   DB_SSL=true
   ```
4. Importer le schéma :
   ```bash
   mysql -h <host> -P <port> -u avnadmin -p --ssl-mode=REQUIRED madinda_budget < backend/src/database/schema.sql
   ```

---

## 8. Guide du développeur

### 8.1 Ajouter une nouvelle fonctionnalité

1. **Backend** :
   - Créer la migration SQL dans `backend/src/database/schema.sql`
   - Créer le modèle dans `backend/src/models/`
   - Créer le service dans `backend/src/services/`
   - Créer le contrôleur dans `backend/src/controllers/`
   - Ajouter les routes dans `backend/src/routes/`
   - Enregistrer les routes dans `backend/src/routes/index.ts`

2. **Frontend** :
   - Ajouter les types dans `src/types/`
   - Ajouter les appels API dans `src/services/api.ts`
   - Créer la page dans `src/pages/app/`
   - Ajouter la route dans `src/App.tsx`
   - Ajouter le lien dans la navigation

### 8.2 Convention de code

- **Fichiers** : PascalCase pour les composants React et classes
- **Variables** : camelCase
- **Constantes** : UPPER_SNAKE_CASE
- **TypeScript** : typer strictement, éviter `any`
- **Requêtes SQL** : toujours paramétrées, jamais de concaténation

### 8.3 Commandes utiles

```bash
# Frontend
npm run dev          # Développement
npm run build        # Production
npm run lint         # Vérification
npx tsc --noEmit     # Vérification types

# Backend
cd backend && npm run dev   # Développement
cd backend && npm run build # Compilation
cd backend && npm start     # Production

# Base de données
docker compose up -d database  # DB locale
mysql -u root -p madinda_budget < schema.sql  # Import
```

---

## 9. Dépendances

### Frontend

| Package | Version | Rôle |
|:--------|:--------|:-----|
| `react` | ^19.2.6 | Bibliothèque UI |
| `react-router-dom` | ^7.17.0 | Routage SPA |
| `zustand` | ^5.0.14 | Gestion d'état |
| `axios` | ^1.17.0 | Client HTTP |
| `react-hook-form` | ^7.79.0 | Gestion formulaires |
| `zod` | ^4.4.3 | Validation schémas |
| `recharts` | ^3.8.1 | Graphiques |
| `bootstrap` | ^5.3.8 | Composants CSS |
| `tailwindcss` | ^4.3.1 | Framework CSS |
| `vite-plugin-pwa` | ^1.3.0 | PWA / Service Worker |
| `workbox-*` | ^7.4.1 | Cache et offline |

### Backend

| Package | Version | Rôle |
|:--------|:--------|:-----|
| `express` | ^5.1.0 | Framework HTTP |
| `mysql2` | ^3.14.1 | Driver MySQL |
| `jsonwebtoken` | ^9.0.2 | Tokens JWT |
| `bcryptjs` | ^2.4.3 | Hachage mots de passe |
| `cors` | ^2.8.5 | CORS |
| `dotenv` | ^16.4.7 | Variables d'environnement |
| `tsx` | ^4.19.4 | Exécution TypeScript (dev) |

---

## 10. Feuille de route

### Versions futures

| Version | Fonctionnalités prévues |
|:--------|:------------------------|
| 2.1 | Mode sombre, export PDF/CSV |
| 2.2 | Application mobile (Capacitor) |
| 2.3 | Push notifications, budget partagé temps réel |
| 2.4 | IA : catégorisation automatique, prédictions |
| 3.0 | API publique, webhooks, plugins |

---

<p align="center">
  <strong>MADINDA Family Budget</strong> — Documentation technique v2.0.0
  <br />
  <i>Développé avec ❤️ pour la famille MADINDA</i>
</p>
