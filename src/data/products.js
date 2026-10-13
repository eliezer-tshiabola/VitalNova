import teaImage from '../assets/ginseng-tea.jpeg'
import toothpasteImage from '../assets/toothpaste.jpeg'
import braceletImage from '../assets/bracelets.jpeg'
import benefitImage from '../assets/ginseng-benefits.jpeg'

const standardDiscounts = [
  { quantity: 2, percent: 5, label: 'Duo' },
  { quantity: 3, percent: 10, label: 'Pack 3' },
  { quantity: 5, percent: 15, label: 'Pack 5' },
]

const standardDeliveryRules = [
  { minQuantity: 1, maxQuantity: 1, fee: 3, label: 'Frais de livraison : 3.00 $' },
  { minQuantity: 2, maxQuantity: 2, fee: 2, label: 'Frais de livraison réduits : 2.00 $' },
  { minQuantity: 3, fee: 0, label: 'Livraison gratuite dès 3 pièces' },
]

const accessoryDeliveryRules = [
  { minQuantity: 1, maxQuantity: 1, fee: 5, label: 'Frais de livraison : 5.00 $' },
  { minQuantity: 2, maxQuantity: 2, fee: 3, label: 'Frais de livraison réduits : 3.00 $' },
  { minQuantity: 3, fee: 0, label: 'Livraison gratuite dès 3 pièces' },
]

export const products = [
  {
    id: 'the-ginseng-cinq-tresors', name: 'Thé Ginseng Cinq Trésors', category: 'bien-etre', categoryLabel: 'Bien-être quotidien',
    price: 20, image: teaImage, short: 'Une infusion aux ingrédients sélectionnés pour accompagner vos moments de vitalité.',
    description: 'Mélange à infuser à base de ginseng, baies de goji, mûres, jujube rouge et maca. Produit de démonstration à confirmer avant publication.',
    variants: ['Sachet'], gallery: [benefitImage], videoUrl: '', discounts: standardDiscounts, deliveryRules: standardDeliveryRules, popular: true, demo: true,
    specifications: [['Format', 'Sachet à infuser'], ['Ingrédients présentés', 'Ginseng, goji, mûres, jujube rouge et maca'], ['Conseil', 'Vérifier les indications figurant sur l’emballage']],
  },
  {
    id: 'dentifrice-repair', name: 'Dentifrice White Tooth Repair', category: 'hygiene', categoryLabel: 'Hygiène dentaire',
    price: 10, image: toothpasteImage, short: 'Un dentifrice à l’hydroxyapatite pour compléter votre routine d’hygiène bucco-dentaire.',
    description: 'Tube de 120 g, arôme menthe. Les caractéristiques définitives devront être vérifiées sur la fiche fournisseur.',
    variants: ['120 g'], gallery: [], videoUrl: '', discounts: standardDiscounts, deliveryRules: standardDeliveryRules, popular: true, demo: true,
    specifications: [['Contenance', '120 g'], ['Arôme', 'Menthe'], ['Type', 'Dentifrice à l’hydroxyapatite'], ['Usage', 'Suivre les indications figurant sur l’emballage']],
  },
  {
    id: 'bracelet-magnetique-noir', name: 'Bracelet magnétique — Noir', category: 'vitalite-masculine', categoryLabel: 'Vitalité et force masculine',
    price: 39, image: braceletImage, short: 'Un accessoire contemporain à finition noire, pensé pour un style sobre au quotidien.',
    description: 'Bracelet ajustable au style moderne. Aucune allégation médicale n’est associée à ce produit.',
    variants: ['Noir'], gallery: [], videoUrl: '', discounts: standardDiscounts, deliveryRules: accessoryDeliveryRules, popular: true, demo: true,
    specifications: [['Finition', 'Noire'], ['Type', 'Bracelet ajustable'], ['Entretien', 'Éviter le contact prolongé avec l’eau']],
  },
  {
    id: 'bracelet-magnetique-argent', name: 'Bracelet magnétique — Argent', category: 'vitalite-masculine', categoryLabel: 'Vitalité et force masculine',
    price: 39, image: braceletImage, short: 'Une finition argentée lumineuse, facile à porter avec toutes vos tenues.',
    description: 'Bracelet ajustable à finition argentée. Aucune allégation médicale n’est associée à ce produit.',
    variants: ['Argent'], gallery: [], videoUrl: '', discounts: standardDiscounts, deliveryRules: accessoryDeliveryRules, popular: false, demo: true,
    specifications: [['Finition', 'Argentée'], ['Type', 'Bracelet ajustable'], ['Entretien', 'Éviter le contact prolongé avec l’eau']],
  },
  {
    id: 'bracelet-magnetique-cuivre', name: 'Bracelet magnétique — Cuivre', category: 'vitalite-masculine', categoryLabel: 'Vitalité et force masculine',
    price: 39, image: braceletImage, short: 'Une finition cuivrée chaleureuse pour une présence élégante au poignet.',
    description: 'Bracelet ajustable à finition cuivrée. Aucune allégation médicale n’est associée à ce produit.',
    variants: ['Cuivre'], gallery: [], videoUrl: '', discounts: standardDiscounts, deliveryRules: accessoryDeliveryRules, popular: false, demo: true,
    specifications: [['Finition', 'Cuivrée'], ['Type', 'Bracelet ajustable'], ['Entretien', 'Éviter le contact prolongé avec l’eau']],
  },
  {
    id: 'the-ginseng-decouverte', name: 'Infusion Ginseng — Découverte', category: 'bien-etre', categoryLabel: 'Bien-être quotidien',
    price: 12, image: benefitImage, short: 'Un format découverte pour intégrer une pause infusion à votre routine.',
    description: 'Visuel et prix de démonstration. La composition et le conditionnement exacts sont à renseigner.',
    variants: ['Découverte'], gallery: [teaImage], videoUrl: '', discounts: standardDiscounts, deliveryRules: standardDeliveryRules, popular: false, demo: true,
    specifications: [['Format', 'Découverte'], ['Type', 'Mélange à infuser'], ['Information', 'Composition exacte à confirmer']],
  },
]

export const PRODUCT_ADMIN_DELIVERY_FIELDS = ['minQuantity', 'maxQuantity', 'fee', 'label']
