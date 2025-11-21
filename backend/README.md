# 🧟 ZombieLand - Backend API

API REST pour le parc d'attractions post-apocalyptique ZombieLand.

## 🚀 Démarrage rapide

### Prérequis
- Docker et Docker Compose installés
- Fichier `.env` configuré à la racine du projet

### Lancer le projet

Depuis la **racine du projet** :

```bash
# Démarrer tous les services (PostgreSQL, API, Frontend, Adminer)
docker compose up -d
```

C'est tout ! Le backend démarre automatiquement.

### Configuration initiale (uniquement si base de données vide)

Si vous devez créer les tables et alimenter la base :

```bash
# 1. Générer les DTOs depuis l'API Spec (en local)
cd backend
npm run generate:api

# 2. Entrer dans le conteneur backend
docker compose exec zombieland-api sh

# 3. Dans le conteneur, exécuter :
npx prisma generate          # Générer le client Prisma
npx prisma migrate dev       # Créer les tables
npm run seed                 # Alimenter la base de données
exit                         # Sortir du conteneur
```

> ⚠️ **Note** : Ces commandes sont optionnelles et uniquement nécessaires pour configurer une nouvelle base de données !

## 🔗 URLs d'accès

- **API** : http://localhost:3001/api/v1
- **Swagger UI** : http://localhost:3001/swagger-ui
- **Adminer** : http://localhost:8080

## 👥 Comptes de test

Après le seeding, vous pouvez vous connecter avec :

| Email | Mot de passe | Rôle |
|-------|--------------|------|
| admin@zombieland.com | password123 | ADMIN |
| jean@zombieland.com | password123 | CLIENT |
| marie@zombieland.com | password123 | CLIENT |

## 📦 Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Modèles de données
│   ├── seed.ts            # Script de seeding
│   └── migrations/        # Historique des migrations
├── src/
│   ├── generated/         # DTOs générés automatiquement
│   ├── app.module.ts
│   └── main.ts
└── api-spec.yml           # Spécification OpenAPI 3.0
```

## 🛠️ Commandes utiles

### Dans le conteneur Docker

```bash
# Entrer dans le conteneur
docker compose exec zombieland-api sh

# Lancer le serveur en mode dev (déjà lancé par défaut)
npm run start:dev

# Ouvrir Prisma Studio (interface graphique BDD)
npx prisma studio

# Relancer le seeding
npm run seed

# Lancer les tests
npm test
```

### En local (sans Docker)

```bash
cd backend

# Régénérer les DTOs depuis api-spec.yml
npm run generate:api
```

### Prisma

```bash
# Voir l'état des migrations
npx prisma migrate status

# Créer une nouvelle migration
npx prisma migrate dev --name nom_migration

# Réinitialiser la BDD (⚠️ supprime les données)
npx prisma migrate reset
```

## 📚 Technologies

- **NestJS 11** - Framework backend
- **Prisma 6** - ORM
- **PostgreSQL 15** - Base de données
- **JWT** - Authentification
- **OpenAPI Generator** - Génération des DTOs
- **Swagger** - Documentation API

## 🔐 Authentification

L'API utilise JWT. Pour les endpoints protégés, incluez le header :

```
Authorization: Bearer <votre_token_jwt>
```

## 📝 Points clés

- Les **DTOs** sont générés automatiquement depuis `api-spec.yml` avec `npm run generate:api`
- Le **seeding** crée 4 users, 5 catégories, 4 attractions, 5 activités, 31 dates, 5 tarifs, 4 réservations
- **Règle métier** : Annulation de réservation possible uniquement si visite > 10 jours (sauf ADMIN)
- La documentation complète de l'API est disponible sur **Swagger UI**
