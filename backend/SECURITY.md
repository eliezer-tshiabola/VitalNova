# Sécurité du backend VitalNova

## Protections actives

- Hachage des mots de passe avec Argon2id et politique minimale de 12 caractères.
- Validation obligatoire de l’adresse e-mail avant émission de JWT.
- Jetons d’accès courts (10 minutes), rotation des refresh tokens et révocation par liste noire.
- Réinitialisation de mot de passe par jeton signé et réponse neutre contre l’énumération des comptes.
- Permissions fermées par défaut ; catalogue et avis approuvés sont explicitement publics en lecture seule.
- Avis autorisés uniquement pour le propriétaire d’une commande marquée livrée.
- Prix, remises et frais de livraison recalculés dans une transaction côté serveur.
- Limitation de débit distincte pour connexion, inscription, commande et avis ; Redis est obligatoire en production.
- CORS limité à une liste d’origines et API rendue uniquement en JSON.
- HTTPS, HSTS, cookies sécurisés, protection anti-clickjacking et en-têtes de sécurité obligatoires en production.
- Politique CSP appliquée par Django pour limiter les scripts, styles, images, formulaires et intégrations externes.
- Secrets, base de données et SMTP fournis uniquement par variables d’environnement.
- Limites de taille des requêtes et piège anti-robot sur la création de commande.

## Règles d’exploitation

1. Ne jamais committer `.env`, une clé Django, un mot de passe SMTP ou une URL PostgreSQL complète.
2. Utiliser une clé Django aléatoire d’au moins 64 caractères, différente pour chaque environnement.
3. Héberger l’API exclusivement derrière HTTPS et un proxy de confiance correctement configuré.
4. Conserver les jetons d’accès en mémoire dans le frontend, jamais dans `localStorage`. Pour une persistance forte, privilégier ensuite un refresh token en cookie `HttpOnly` avec protection CSRF.
5. Activer les sauvegardes PostgreSQL chiffrées, leur rotation et des tests réguliers de restauration.
6. Surveiller les connexions échouées, erreurs 5xx, changements administratifs et dépendances vulnérables.
7. Maintenir Django et toutes les dépendances sur leurs dernières versions correctives prises en charge.
8. Donner aux administrateurs des comptes nominatifs et activer un second facteur via l’infrastructure d’identité avant la production publique.

## Signalement

Les vulnérabilités ne doivent pas être publiées dans une issue publique. Utilisez un canal privé défini par l’exploitant avant le lancement commercial.
