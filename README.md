# VitalNova

Frontend e-commerce responsive pour VitalNova, conçu avec React, Vite et Tailwind CSS v4.

Le dépôt contient désormais aussi une première base backend sécurisée dans [`backend/`](backend/README.md), construite avec Django et Django REST Framework.

## Fonctionnalités

- Catalogue responsive, catégories et fiches produits.
- Panier et favoris persistants sur l’appareil.
- Offres quantitatives et frais de livraison configurables par palier.
- Préparation de commande via WhatsApp.
- Recherche plein écran et historique local.
- Interface mobile avec navigation inférieure.
- Structure préparée pour une future API Django.

## Développement local

```bash
npm install
npm run dev
```

## Vérification

```bash
npm run lint
npm run build
```

Pour les commandes Django, consultez [`backend/README.md`](backend/README.md) et les règles d’exploitation dans [`backend/SECURITY.md`](backend/SECURITY.md).

Les produits, tarifs, avis et frais actuellement visibles sont des données de démonstration à valider avant mise en production commerciale.
