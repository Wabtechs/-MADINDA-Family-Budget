# MADINDA Family Budget v2

Plateforme SaaS complète de gestion financière multi-entités (familles, entreprises, associations).

## Stack

| Couche | Technologies |
|--------|-------------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS 4, Bootstrap 5 |
| Backend | Node.js 24, Express 5, TypeScript |
| Base de données | MariaDB / MySQL (Aiven cloud) |
| Auth | JWT + bcrypt |
| State | Zustand |
| API Client | Axios |
| Charts | Recharts |
| Forms | react-hook-form + zod |
| Déploiement | Vercel + Aiven |

## Fonctionnalités

### Site vitrine (pages publiques)
- Page d'accueil avec Hero, Features, Statistiques, Témoignages, FAQ
- Fonctionnalités détaillées
- Comment ça marche
- Contact

### Application privée (14 modules)
| Module | Description |
|--------|-------------|
| Dashboard | Vue globale : solde, revenus/dépenses du mois, graphiques indicateurs |
| Revenus | CRUD entrées financières avec comptes et catégories |
| Dépenses | CRUD sorties financières avec pièces justificatives |
| Comptes | Multi-comptes (banque, Mobile Money, caisse, investissement) |
| Transferts | Transferts entre comptes avec mise à jour des soldes |
| Budgets | Budgets mensuels/annuels avec suivi et alertes de dépassement |
| Objectifs | Objectifs d'épargne avec progression en % |
| Dettes | Suivi dettes actives/passives avec échéancier de remboursement |
| Documents | Stockage factures, reçus, contrats |
| Rapports | Analyses mensuelles/annuelles, export |
| Notifications | Alertes intelligentes (budget, solde, échéances) |
| Audit | Traçabilité de toutes les actions |
| Profil | Gestion du compte et mot de passe |
| Utilisateurs | Rôles (admin, manager, viewer) par entité |

## Architecture Backend (MVC)

```
backend/src/
├── config/          # Configuration (DB, env, CORS)
├── controllers/     # 14 contrôleurs REST
├── database/        # Schémas SQL
├── middlewares/     # Auth JWT + Error handler
├── models/          # 16 modèles avec requêtes paramétrées
├── routes/          # 15 fichiers de routes
├── services/        # 14 services métier
├── types/           # Types TypeScript
└── utils/           # Classes d'erreur
```

## API REST

| Groupe | Routes principales |
|--------|-------------------|
| Auth | POST register, login, forgot-password, reset-password, GET me |
| Entities | CRUD + membres (invitation, rôle) |
| Accounts | CRUD + transfert entre comptes |
| Incomes | CRUD + statistiques |
| Expenses | CRUD + statistiques |
| Budgets | CRUD |
| Goals | CRUD |
| Debts | CRUD + paiements |
| Documents | CRUD |
| Notifications | Lister, marquer lu |
| Dashboard | Vue globale consolidée |
| Reports | Mensuel, annuel, catégories |
| Audit | Journal d'audit |

## Déploiement

- **Frontend** : [https://madinda-app-manger.vercel.app](https://madinda-app-manger.vercel.app)
- **Backend API** : `/_/backend/api` sur le même domaine
- **GitHub** : [https://github.com/Wabtechs/-MADINDA-Family-Budget](https://github.com/Wabtechs/-MADINDA-Family-Budget)
- **Base de données** : Aiven MariaDB (cloud)

## Installation

```bash
npm install
cd backend && npm install && cd ..
npm run dev          # Frontend Vite
cd backend && npm run dev  # Backend Express
```

## Base de données

Le schéma v2 complet (17 tables) se trouve dans `backend/src/database/schema_v2.sql`.
Catégories par défaut : 6 revenus + 11 dépenses préremplis globalement.

Projet développé dans le cadre du mémoire "Développement d'une application Android hybride pour le suivi des dépenses familiales — Cas de la famille MADINDA".
