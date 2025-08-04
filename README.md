# API avec NestJS et Prisma

## Description

Une API REST construite avec NestJS et Prisma pour apprendre NestJS. L'API permet de gérer des produits, leurs images, avis et tags associés.

## Fonctionnalités

- Gestion complète des produits (CRUD)
- Gestion des images de produits
- Système d'avis et notations
- Tags pour catégoriser les produits
- Documentation API avec Swagger
- Base de données MySQL avec Prisma ORM

## Structure de données

### Produit
- ID (auto-incrémenté)
- Nom
- Description
- Prix
- Statut de vente (en solde ou non)
- Disponibilité (en magasin ou en ligne)
- Images associées
- Avis clients
- Tags
- Horodatage (création et mise à jour)

### Avis
- ID (auto-incrémenté)  
- Titre
- Contenu
- Note
- Produit associé

### Image
- ID (auto-incrémenté)
- URL
- Produit associé

### Tag
- ID (auto-incrémenté)
- Contenu
- Produits associés

## Prérequis

- Node.js
- MySQL
- npm ou yarn

## Installation

```bash
# Installation des dépendances
$ npm install

# Configuration de la base de données
# Créez un fichier .env à la racine du projet avec les variables suivantes :
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
PORT=3001

# Génération du client Prisma et application des migrations
$ npx prisma generate
$ npx prisma migrate dev
```

## Démarrage

```bash
# Mode développement
$ npm run start:dev

# Mode production
$ npm run start:prod
```

## Documentation API

Une fois l'application démarrée, la documentation Swagger est disponible à l'adresse :
`http://localhost:3001/api/docs`

## Tests

```bash
# Tests unitaires
$ npm run test

# Tests end-to-end
$ npm run test:e2e

# Couverture de tests
$ npm run test:cov
```

## Environnement de développement avec Docker

Un fichier docker-compose est fourni pour faciliter le développement :

```bash
# Démarrer la base de données MySQL
$ docker-compose up -d
```

## License

Ce projet est sous license [MIT](LICENSE.md).
