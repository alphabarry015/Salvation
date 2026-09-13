# Salvation

Un lieu calme pour lire la Torah, la Bible et le Coran ensemble, en français. Chaque texte est accueilli dans le respect de sa voix.

## Stack

- Next.js (App Router)
- React et TypeScript
- Tailwind CSS
- Proxys `/api/bible` et `/api/quran` (cache 24 h)

Pages : `/` accueil, `/torah`, `/bible`, `/coran`, `/comparer`.

## Démarrer en local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Les variables de `.env.example` sont optionnelles. Les APIs publiques sont déjà renseignées par défaut.

## Déploiement sur Vercel

Le projet est prêt pour Vercel (framework Next.js, région Paris `cdg1`, Node 20).

1. Poussez `main` sur GitHub : [alphabarry015/Salvation](https://github.com/alphabarry015/Salvation).
2. Sur [vercel.com/new](https://vercel.com/new), importez ce dépôt.
3. Laissez les réglages par défaut : Framework `Next.js`, Build `next build`, Output détecté.
4. Variables d’environnement, toutes optionnelles :
   - `NEXT_PUBLIC_SITE_URL` : l’adresse définitive, par exemple `https://votre-projet.vercel.app`
   - `BIBLE_API_BASE` : `https://bible.helloao.org`
   - `QURAN_API_BASE` : `https://api.alquran.cloud`
5. Déployez. Chaque push sur `main` republie le site.

Aucune clé secrète n’est requise.

## Sources

- Bible : Louis Segond, 1910, via Free Use Bible API
- Coran : texte arabe Uthmani et traduction Hamidullah, via Al Quran Cloud

Les passages sont offerts sans commentaire. Chaque livre a son exégèse : une lecture seule ne donne pas le vrai sens.
