// Vocabulaire partagé — scan IA, profil, UI
// Modifier ici pour étendre les listes partout à la fois

export const ACCESSORIES = [
  { slug: 'halteres',  label: 'Haltères' },
  { slug: 'elastique', label: 'Élastique' },
  { slug: 'step',      label: 'Step' },
  { slug: 'corde',     label: 'Corde à sauter' },
]

// Contextes toujours disponibles par défaut (mur, chaise, etc.)
// Affichés sur les cartes pour info, non bloquants
export const CONTEXTS = [
  { slug: 'mur',    label: 'Mur' },
  { slug: 'chaise', label: 'Chaise' },
  { slug: 'tapis',  label: 'Tapis de sol' },
  { slug: 'ballon', label: 'Ballon pilates' },
]

export const ACCESSORY_SLUGS = ACCESSORIES.map(a => a.slug)
export const CONTEXT_SLUGS   = [...CONTEXTS.map(c => c.slug), 'aucun']
