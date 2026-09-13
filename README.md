# Salvation

Plateforme d'étude comparative et neutre entre la Bible et le Coran, en français. Interface épurée, lecture croisée, sans parti pris doctrinal.

## Stack

- **Next.js** (App Router) — rendu et SEO
- **React** + **TypeScript**
- **Tailwind CSS** — thème clair / sombre, typographie académique
- **JSON local** pour le MVP, adaptateurs prêts pour bible-api.com / Bolls Life et Al Quran Cloud

## Arborescence

```
src/
  app/                  # Pages Next.js (SEO, métadonnées)
  components/           # UI : navigation, sélecteur, split-screen
  data/texts.json       # Corpus local + requêtes API
  services/api.ts       # Clients Bible (helloao) et Coran (Al Quran Cloud)
  app/api/bible|quran   # Proxys Next.js (cache, déploiement)
  lib/texts.ts          # Recherche et filtres
  types/scripture.ts    # Fiches, requêtes, états de lecture
public/                 # Manifeste PWA, icône
```

Pages : `/` accueil, `/bible`, `/coran`, `/comparer`.

## Démarrer

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Sources des extraits

- Bible : Louis Segond, 1910 (domaine public)
- Coran : traduction française de Muhammad Hamidullah (usage pédagogique)

Les textes sont présentés sans commentaire. Consulter toujours le contexte intégral.
