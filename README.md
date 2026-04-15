# SODFA v2

SODFA est une boutique React + Vite avec une interface admin (produits, catégories, commandes).

## Démarrage local

1. Installer les dépendances:
	- `npm install`
2. Lancer le projet:
	- `npm run dev`

## Configuration Supabase

Le projet peut fonctionner en fallback local (`localStorage`) si Supabase n'est pas configuré.

### 1) Créer un projet Supabase

- Créer un nouveau projet dans Supabase.
- Ouvrir **SQL Editor** et exécuter le script [supabase/schema.sql](supabase/schema.sql).

### 2) Variables d'environnement

- Copier [.env.example](.env.example) vers `.env`.
- Renseigner:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

### 3) Déploiement Vercel

Ajouter les mêmes variables dans les settings Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Puis redéployer.

## Notes importantes

- `products`, `categories` et `orders` sont synchronisés avec Supabase si les variables sont présentes.
- Le panier (`cart`) reste local au navigateur.
- L'auth admin actuelle est encore locale (mot de passe statique côté client).
