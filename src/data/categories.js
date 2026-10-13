import wellnessCategoryImage from '../assets/category-wellness.jpg'
import hygieneCategoryImage from '../assets/category-hygiene.jpg'
import masculineVitalityImage from '../assets/category-masculine-vitality.jpg'

// Schéma prêt à être remplacé par l’API d’administration Django.
// Chaque catégorie expose les champs éditables demandés par le futur compte administrateur.
export const categories = [
  {
    id: 'bien-etre',
    title: 'Bien-être quotidien',
    description: 'Des essentiels pour prendre soin de vous chaque jour.',
    backgroundImage: wellnessCategoryImage,
    isActive: true,
    order: 1,
  },
  {
    id: 'hygiene',
    title: 'Hygiène dentaire',
    description: 'Une routine bucco-dentaire simple et soignée.',
    backgroundImage: hygieneCategoryImage,
    isActive: true,
    order: 2,
  },
  {
    id: 'vitalite-masculine',
    title: 'Vitalité et force masculine',
    description: 'Des produits pensés pour l’énergie et l’assurance au quotidien.',
    backgroundImage: masculineVitalityImage,
    isActive: true,
    order: 3,
  },
]

export const visibleCategories = categories
  .filter(category => category.isActive)
  .sort((a, b) => a.order - b.order)

export const CATEGORY_ADMIN_FIELDS = ['title', 'description', 'backgroundImage', 'isActive', 'order']
