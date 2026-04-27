# NewBody — App transformation corporelle

**PWA mobile-first** pour suivre ses séances, rester motivée et voir ses progrès.

🔗 **https://eurekai25.github.io/newbody-app/**

---

## Fonctionnalités

| Écran | Description |
|---|---|
| 🏠 Accueil | Objectif éditable, date cible J-X, fond personnalisable |
| ⚡ Séances | Séance aléatoire ou manuelle, filtre par groupe musculaire, validation par exercice |
| ⭐ Bonus | Visualisation, EFT, Connaissances, Mindset, Soins |
| 📅 Calendrier | Vue mensuelle colorée + stats (séances, jours actifs, bonus) |
| 📸 Photos | Avant/après par zone corporelle (9 zones) |
| ⚙️ Admin | CRUD exercices, bonus, visuels, rappels, configuration |

## Installation sur iPhone / iPad

1. Ouvrir l'URL dans **Safari**
2. Appuyer sur l'icône **Partager** (carré avec flèche)
3. Choisir **"Sur l'écran d'accueil"**
4. L'app s'installe comme une vraie application

## Notifications

Pour activer les rappels aléatoires :
1. Aller dans **Admin** → onglet **Rappels**
2. Cliquer **"Activer les rappels"** et accepter la permission
3. Les rappels se planifient automatiquement chaque jour à l'ouverture de l'app

Règles par défaut : 6 max/jour, 3 obligatoires, entre 8h et 21h, pause midi exclue, horaires imprévisibles.

## Admin

Accès : appuyer sur l'icône ⚙️ en haut à droite de l'accueil

**Mot de passe : `newbody2026`**

Depuis l'admin tu peux :
- Ajouter/modifier/supprimer les exercices (avec URL visuel)
- Gérer les bonus items (texte EFT, URLs vidéos/images)
- Ajouter des visuels d'inspiration
- Configurer les règles de rappels
- Modifier l'objectif et la date cible

## Données

Toutes les données sont stockées localement sur l'appareil (`localStorage`). Rien n'est envoyé sur un serveur. Chaque appareil a ses propres données.

## Groupes musculaires disponibles

Fessiers · Cuisses · Ventre · Abdos profonds · Bras · Dos · Hanches · Ischios · Quadriceps · Corps global · Mobilité · Étirements

## Stack technique

- **Frontend** : Vite + React + Tailwind CSS
- **Données** : localStorage (demo) → SQLite/VPS (production)
- **Notifications** : ServiceWorker (Web Push API)
- **Hébergement** : GitHub Pages

## Déploiement

Tout push sur `main` déclenche automatiquement un build et déploiement via GitHub Actions.

```bash
# Développement local
npm install
npm run dev

# Build production
npm run build
```
