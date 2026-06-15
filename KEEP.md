
# 🔐 KEEP — Gestion des informations sensibles

> **IMPORTANT :** Ce fichier explique COMMENT gérer les secrets.
> Ne JAMAIS y écrire les vraies valeurs. Les vraies valeurs vont dans `.env` (ignoré par git).

---

## 📋 Inventaire des secrets

### 1. Backend — Variables d'environnement

| Variable | Où la définir | Description | Valeur par défaut (DEV uniquement) |
|:---------|:--------------|:------------|:----------------------------------|
| `PORT` | `backend/.env`, Vercel, Docker | Port du serveur Express | `3000` |
| `JWT_SECRET` | `backend/.env`, Vercel, Docker | Clé secrète pour signer les tokens JWT | ⚠️ **À CHANGER ABSOLUMENT** |
| `JWT_EXPIRES_IN` | `backend/.env` | Durée de validé des tokens | `7d` |
| `DB_HOST` | `backend/.env`, Docker | Hôte de la base de données | `localhost` |
| `DB_PORT` | `backend/.env`, Docker | Port de la base de données | `3306` |
| `DB_USER` | `backend/.env`, Docker | Utilisateur MySQL | `madinda` |
| `DB_PASSWORD` | `backend/.env`, Docker | Mot de passe MySQL | ⚠️ **À CHANGER ABSOLUMENT** |
| `DB_NAME` | `backend/.env`, Docker | Nom de la base de données | `madinda_budget` |
| `DB_SSL` | `backend/.env` | Activer SSL pour la DB | `false` |
| `CORS_ORIGIN` | `backend/.env`, Vercel | Domaines autorisés (séparés par des virgules) | `http://localhost:5173,http://localhost:4173` |

### 2. Frontend — Variable d'environnement

| Variable | Où la définir | Description |
|:---------|:--------------|:------------|
| `VITE_API_URL` | `.env` (racine), Vercel | URL de l'API backend |

### 3. Docker — docker-compose.yml

> ⚠️ Le fichier `docker-compose.yml` contient des valeurs par défaut.
> **Ne pas utiliser en production sans les modifier.**

| Service | Variable | Valeur par défaut (DEV) |
|:--------|:---------|:------------------------|
| **backend** | `JWT_SECRET` | `madinda-super-secret-key-change-in-production` |
| **backend** | `DB_PASSWORD` | `madinda123` |
| **database** | `MARIADB_ROOT_PASSWORD` | `root123` |
| **database** | `MARIADB_PASSWORD` | `madinda123` |

### 4. Base de données Aiven (production)

| Information | Où la trouver |
|:------------|:--------------|
| URI de connexion | Dashboard Aiven → votre service MariaDB → Overview |
| Certificat CA | Dashboard Aiven → Download CA Certificate |
| Utilisateur | Créé dans Aiven |
| Mot de passe | Défini dans Aiven |

---

## 🛡️ Règles de sécurité

### À FAIRE ✅

- [ ] Toujours utiliser des variables d'environnement pour les secrets
- [ ] Générer des clés JWT fortes : `openssl rand -hex 64`
- [ ] Utiliser des mots de passe DB différents par environnement
- [ ] Activer SSL pour la base de données en production
- [ ] Limiter les origines CORS aux domaines autorisés
- [ ] Faire tourner les rotations de clés tous les 90 jours
- [ ] Supprimer les droits d'accès aux utilisateurs inactifs

### À NE PAS FAIRE ❌

- [ ] Ne JAMAIS commiter les fichiers `.env` dans git (ils sont dans `.gitignore`)
- [ ] Ne JAMAIS écrire les mots de passe en dur dans le code source
- [ ] Ne JAMAIS exposer `JWT_SECRET` dans les logs
- [ ] Ne JAMAIS partager les secrets par email, chat ou ticket
- [ ] Ne JAMAIS utiliser les mots de passe par défaut en production
- [ ] Ne JAMAIS désactiver SSL en production

---

## 🔄 Gestion des secrets par environnement

### Développement local
```bash
# 1. Copier le fichier d'exemple
cp backend/.env.example backend/.env

# 2. Générer une clé JWT
openssl rand -hex 64

# 3. Éditer .env avec vos valeurs
nano backend/.env
```

### Vercel (production)
```bash
# Installer Vercel CLI
npm i -g vercel

# Définir les variables d'environnement
vercel env add JWT_SECRET
vercel env add DB_HOST
vercel env add DB_PASSWORD
vercel env add CORS_ORIGIN

# Vérifier
vercel env ls
```

### Docker (auto-hébergé)
```yaml
# Ne PAS modifier docker-compose.yml directement
# Créer plutôt un fichier docker-compose.override.yml
services:
  backend:
    environment:
      JWT_SECRET: ${JWT_SECRET}
      DB_PASSWORD: ${DB_PASSWORD}
```

### Base de données Aiven
```env
# Connexion avec SSL
DB_HOST=votre-instance.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=votre-mot-de-passe-aiven
DB_NAME=madinda_budget
DB_SSL=true
```

---

## 🔑 Génération de mots de passe forts

```bash
# Clé JWT (64 caractères hex)
openssl rand -hex 64

# Mot de passe aléatoire (20 caractères)
openssl rand -base64 20

# Mot de passe lisible
date +%s | sha256sum | base64 | head -c 20
```

---

## 📊 Audit des accès

| Ressource | Accès | Journalisé ? |
|:----------|:------|:-------------|
| API REST | Token JWT requis | Oui (table `audit_logs`) |
| Base de données | Identifiant + mot de passe | MySQL général log |
| Docker | `docker compose` | Non |
| Vercel | Dashboard Vercel | Vercel Audit Logs |
| Aiven | Dashboard Aiven | Aiven Activity Log |

---

## 📞 En cas de fuite de secret

1. **Révoquer immédiatement** le secret concerné
2. **Régénérer** une nouvelle clé/mot de passe
3. **Déployer** la nouvelle configuration
4. **Vérifier** les logs d'accès suspects
5. **Notifier** les utilisateurs concernés si nécessaire

---

## 🏗️ Technologies et leurs secrets

| Technologie | Secret(s) géré(s) | Recommandation |
|:------------|:------------------|:---------------|
| **Node.js / Express** | JWT_SECRET, DB_PASSWORD | Variables d'environnement |
| **JWT (jsonwebtoken)** | Clé de signature | Rotation tous les 90 jours |
| **bcrypt** | SaltRounds (12) | Valeur par défaut OK |
| **MySQL / MariaDB** | DB_USER, DB_PASSWORD | Mot de passe fort + SSL |
| **Aiven** | Certificat CA, mot de passe | Dashboard sécurisé |
| **Vercel** | Environment Variables | Encrypted at rest |
| **Docker** | Variables dans compose | Fichier .env séparé |
| **GitHub** | Aucun secret (dépôt public) | Vérifier `.gitignore` |

---

<p align="center">
  <i>Protéger les données de vos utilisateurs, c'est protéger votre application.</i>
</p>
