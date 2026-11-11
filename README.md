# Garage Mille – Garage automobile à Airaines (80) · Véhicules neufs & occasion, entretien

Maquette de site vitrine une page, en **HTML, CSS et JavaScript vanilla** (aucun framework, aucune dépendance, aucun build).

> ℹ️ Il s'agit d'une **maquette de démonstration** réalisée dans le cadre d'une proposition commerciale.
> Ce n'est pas le site officiel de l'établissement. Les photos sont des illustrations provisoires.

## Contenu

- `index.html` : la page (accueil, services, à propos, galerie, avis, contact)
- `style.css` : styles ; couleurs, polices et espacements réglables dans `:root` en tête de fichier
- `script.js` : menu mobile, horaires « ouvert / fermé », formulaire de contact (Web3Forms)
- `mentions-legales.html`
- `images/`

## Points techniques

- Mobile-first, responsive de 360 px à 1440 px, barre d'actions fixe sur mobile (appeler, itinéraire…)
- SEO : balises meta, Open Graph, données structurées JSON-LD (schema.org)
- Accessibilité : contrastes AA, textes alternatifs, cibles tactiles ≥ 44 px, navigation clavier

## Aperçu

Ouvrir `index.html` dans un navigateur, ou servir le dossier :

```bash
npx serve .
```

Déploiement prévu sur Cloudflare Pages (site statique, aucun réglage de build).
