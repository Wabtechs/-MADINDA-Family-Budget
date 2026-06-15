
<p align="center">
  <img src="public/logo.png" alt="MADINDA Logo" width="120" />
</p>

<h1 align="center">MADINDA Family Budget</h1>

<p align="center">
  <strong>Application de gestion financière multi-entités</strong>
  <br />
  Gérez vos budgets, revenus, dépenses, objectifs et dettes en famille ou en entreprise.
  <br /><br />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express 5" />
  <img src="https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/Node-24-339933?logo=nodedotjs" alt="Node 24" />
  <img src="https://img.shields.io/badge/Licence-MIT-green" alt="MIT" />
</p>

---

## 📖 Qu'est-ce que MADINDA ?

**MADINDA Family Budget** est une application web progressive (PWA) complète qui permet à plusieurs personnes (famille, entreprise, association) de **gérer ensemble leurs finances** depuis un seul compte.

### 👥 Qui peut l'utiliser ?

- **Une famille** qui veut suivre son budget mensuel
- **Une entreprise** qui gère ses comptes et dépenses
- **Une association** qui suit ses cotisations et projets
- **Un indépendant** qui gère ses finances personnelles et pro

### ✨ Ce que vous pouvez faire

| Fonctionnalité | Description |
|:---------------|:------------|
| **Tableau de bord** | Voyez tout l'essentiel en un coup d'œil : solde, revenus, dépenses, graphiques |
| **Revenus & Dépenses** | Enregistrez chaque transaction, classez-la par catégorie |
| **Comptes bancaires** | Gérez plusieurs comptes : banque, Mobile Money, caisse, etc. |
| **Transferts** | Déplacez de l'argent entre vos comptes |
| **Budgets** | Fixez des limites et recevez des alertes avant dépassement |
| **Objectifs d'épargne** | Économisez pour un projet et suivez votre progression |
| **Dettes** | Suivez qui vous doit de l'argent et à qui vous en devez |
| **Documents** | Stockez vos factures, reçus et contrats |
| **Rapports** | Analysez vos finances par mois, année ou catégorie |
| **Multi-utilisateurs** | Invitez des membres avec des rôles (admin, manager, viewer) |
| **Mode hors-ligne** | Consultez vos données même sans connexion Internet |
| **Installable** | Ajoutez MADINDA à l'écran d'accueil de votre téléphone ou PC |

---

## 📱 PWA — Installable et hors-ligne

MADINDA est une **Progressive Web App (PWA)**. Cela signifie que vous pouvez :

### Sur Android (Chrome)
1. Ouvrez l'application dans Chrome
2. Appuyez sur le menu ⋮ → **Installer l'application**
3. L'icône apparaît sur votre écran d'accueil comme une application native

### Sur PC (Chrome, Edge)
1. Cliquez sur l'icône d'installation dans la barre d'adresse
2. L'application s'ouvre dans sa propre fenêtre, sans navigateur

### Sur iPhone (Safari)
1. Appuyez sur le bouton Partager
2. Faites défiler et choisissez **Sur l'écran d'accueil**

### Mode hors-ligne
L'application met en cache automatiquement :
- Les pages et ressources (fonctionne sans Internet)
- Les dernières données API consultées
- Les images et polices

Quand vous êtes hors-ligne, une barre jaune vous le signifie. Dès que la connexion revient, les données sont synchronisées.

---

## 🏗️ Architecture technique

```
┌─────────────────────────────────────────────────┐
│                   NAVIGATEUR                     │
│  ┌───────────────────────────────────────────┐   │
│  │        MADINDA Frontend (React + Vite)     │   │
│  │  PWA · Service Worker · Cache API          │   │
│  └──────────────┬────────────────────────────┘   │
│                 │ HTTP (Axios)                   │
└─────────────────┼────────────────────────────────┘
                  │
┌─────────────────┼────────────────────────────────┐
│  ┌──────────────┴────────────────────────────┐   │
│  │       MADINDA Backend (Node + Express)     │   │
│  │  Contrôleurs → Services → Modèles          │   │
│  │  Middleware JWT · Validation · Audit       │   │
│  └──────────────┬────────────────────────────┘   │
│                 │ SQL                            │
│  ┌──────────────┴────────────────────────────┐   │
│  │         MariaDB / MySQL (Aiven)           │   │
│  │           17 tables                       │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### Technologies utilisées

| Couche | Technologie | Rôle |
|:-------|:------------|:-----|
| **Frontend** | React 19 + TypeScript | Interface utilisateur moderne et réactive |
| **Build** | Vite 8 | Compilation ultra-rapide |
| **Styles** | Tailwind CSS 4 + Bootstrap 5 | Design responsive et élégant |
| **PWA** | vite-plugin-pwa + Workbox | Installation et mode hors-ligne |
| **État** | Zustand | Gestion des données côté client |
| **Formulaires** | react-hook-form + Zod | Saisie et validation |
| **Graphiques** | Recharts | Visualisation des données |
| **Backend** | Node.js 24 + Express 5 | API REST sécurisée |
| **Base de données** | MariaDB (MySQL) | Stockage des données |
| **Authentification** | JWT + bcrypt | Connexion sécurisée |
| **Déploiement** | Vercel + Docker + Aiven | Hébergement cloud |

---

## 🚀 Démarrage rapide

### Prérequis
- **Node.js** version 18 ou plus
- **npm** ou **yarn**
- **MariaDB** ou **MySQL** (ou une base distante Aiven)

### 1. Installation

```bash
# Cloner le projet
git clone https://github.com/Wabtechs/-MADINDA-Family-Budget.git
cd madinda-app-manger

# Installer les dépendances frontend
npm install

# Installer les dépendances backend
cd backend && npm install && cd ..
```

### 2. Configuration de la base de données

Créez une base de données MySQL nommée `madinda_budget` :

```sql
CREATE DATABASE madinda_budget CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Importez le schéma :

```bash
mysql -u root -p madinda_budget < backend/src/database/schema.sql
```

### 3. Configuration des variables d'environnement

Créez un fichier `backend/.env` :

```env
PORT=3000
JWT_SECRET=votre-cle-secrete-tres-longue-et-aleatoire
JWT_EXPIRES_IN=7d
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre-mot-de-passe
DB_NAME=madinda_budget
DB_SSL=false
```

Créez un fichier `.env` à la racine pour le frontend :

```env
VITE_API_URL=http://localhost:3000/api
```

### 4. Lancer l'application

```bash
# Terminal 1 : Backend
cd backend && npm run dev

# Terminal 2 : Frontend
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### 5. Avec Docker (tout-en-un)

```bash
docker compose up -d
```

L'application est accessible sur [http://localhost:8080](http://localhost:8080).

---

## 📚 Documentation

Pour en savoir plus sur le fonctionnement détaillé :

| Document | Description |
|:---------|:------------|
| [`DOCUMENTATION.md`](DOCUMENTATION.md) | Guide complet : architecture, API, base de données, sécurité |
| [`KEEP.md`](KEEP.md) | Gestion des informations sensibles et mots de passe |
| `backend/src/database/schema.sql` | Schéma complet de la base de données |

---

## 🔐 Sécurité

- **Mots de passe** : hachés avec bcrypt (12 rounds)
- **Authentification** : tokens JWT avec expiration
- **API** : toutes les routes protégées (sauf inscription et connexion)
- **Autorisation** : contrôle d'accès par rôles (admin, manager, viewer)
- **Données** : requêtes SQL paramétrées (protection contre les injections)
- **CORS** : origines limitées en production

---

## 🧪 Tests

```bash
# Frontend
npm run lint

# Backend
cd backend && npm run lint
```

---

## 🐳 Déploiement

### Sur Vercel (automatique)

1. Poussez le code sur GitHub
2. Connectez Vercel à votre dépôt GitHub
3. Les variables d'environnement sont configurables dans le dashboard Vercel

### Avec Docker (auto-hébergé)

```bash
docker compose up -d --build
```

---

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/ma-fonctionnalite`)
3. Commitez (`git commit -m 'Ajout de ma fonctionnalité'`)
4. Pushez (`git push origin feature/ma-fonctionnalite`)
5. Ouvrez une Pull Request

---

## 📄 Licence

Projet développé dans le cadre du mémoire :

> **"Développement d'une application Android hybride pour le suivi des dépenses familiales — Cas de la famille MADINDA"**

&copy; 2025 MADINDA Family Budget. MIT Licence.

---

<p align="center">
  <strong>MADINDA</strong> — Parce que gérer son budget en famille, c'est mieux ensemble. 🤝
</p>
