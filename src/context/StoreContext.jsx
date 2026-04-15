// src/context/StoreContext.jsx — Contexte global pour les produits et catégories
import { createContext, useContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

// === DONNÉES INITIALES ===
const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'Extraits de Parfum', nameAr: 'مستخلصات العطر', emoji: '🌹', description: 'L\'essence la plus concentrée de nos créations', order: 0 },
  { id: 'cat-2', name: 'Eaux de Parfum', nameAr: 'ماء العطر', emoji: '💧', description: 'L\'élégance au quotidien', order: 1 },
  { id: 'cat-3', name: 'Collections Signature', nameAr: 'المجموعات المميزة', emoji: '✨', description: 'Les pièces maîtresses de la maison', order: 2 },
  { id: 'cat-4', name: 'Éditions Limitées', nameAr: 'إصدارات محدودة', emoji: '💎', description: 'Créations éphémères et exclusives', order: 3 },
  { id: 'cat-5', name: 'Coffrets', nameAr: 'علب الهدايا', emoji: '🎁', description: 'L\'art d\'offrir', order: 4 },
]

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Oud Al Layl',
    nameAr: 'عود الليل',
    description: 'Un voyage nocturne à travers les souks anciens. Le bois d\'oud se mêle aux épices rares, créant une symphonie olfactive qui évoque les nuits étoilées du désert.',
    categoryId: 'cat-1',
    notes: {
      top: 'Safran, Cardamome',
      heart: 'Oud, Rose de Taïf',
      base: 'Santal, Musc blanc',
    },
    sizes: [
      { ml: 15, price: 490 },
      { ml: 30, price: 890 },
      { ml: 50, price: 1290 },
    ],
    price: 890,
    stock: 24,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Zahra Al Bayda',
    nameAr: 'زهرة البيضاء',
    description: 'La pureté d\'une fleur blanche à l\'aube. Un bouquet de jasmin et de tubéreuse enveloppé dans un voile de musc, comme un jardin secret marocain.',
    categoryId: 'cat-2',
    notes: {
      top: 'Bergamote, Néroli',
      heart: 'Jasmin Sambac, Tubéreuse',
      base: 'Musc, Ambre gris',
    },
    sizes: [
      { ml: 30, price: 650 },
      { ml: 50, price: 950 },
    ],
    price: 650,
    stock: 38,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Misk Al Arous',
    nameAr: 'مسك العروس',
    description: 'Le parfum de la mariée. Un musc envoûtant rehaussé de notes florales orientales, tradition et modernité se rencontrent dans cette fragrance nuptiale.',
    categoryId: 'cat-3',
    notes: {
      top: 'Rose, Pivoine',
      heart: 'Musc, Ambre',
      base: 'Vanille, Bois de cèdre',
    },
    sizes: [
      { ml: 15, price: 420 },
      { ml: 30, price: 720 },
      { ml: 50, price: 1080 },
    ],
    price: 720,
    stock: 15,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    name: 'Amber Marrakchi',
    nameAr: 'عنبر مراكشي',
    description: 'L\'âme de Marrakech capturée dans un flacon. L\'ambre chaud se fond avec les épices du souk, créant une fragrance addictive et enveloppante.',
    categoryId: 'cat-1',
    notes: {
      top: 'Poivre rose, Gingembre',
      heart: 'Ambre, Encens',
      base: 'Patchouli, Labdanum',
    },
    sizes: [
      { ml: 30, price: 780 },
      { ml: 50, price: 1150 },
    ],
    price: 780,
    stock: 20,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    name: 'Riad Soir',
    nameAr: 'رياض المساء',
    description: 'Le crépuscule dans un riad andalou. Des notes aquatiques fraîches se mêlent aux boisés nobles, évoquant une soirée d\'été dans un jardin intérieur.',
    categoryId: 'cat-2',
    notes: {
      top: 'Citron, Menthe, Notes aquatiques',
      heart: 'Lavande, Géranium',
      base: 'Vétiver, Cèdre de l\'Atlas',
    },
    sizes: [
      { ml: 30, price: 590 },
      { ml: 50, price: 850 },
    ],
    price: 590,
    stock: 42,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    name: 'Khamsa',
    nameAr: 'خمسة',
    description: 'Cinq éléments réunis dans une composition audacieuse. Édition limitée célébrant les cinq sens, un talisman olfactif protecteur et mystérieux.',
    categoryId: 'cat-4',
    notes: {
      top: 'Safran, Baies de genièvre',
      heart: 'Oud royal, Iris',
      base: 'Musc noir, Ambre, Santal',
    },
    sizes: [
      { ml: 15, price: 720 },
      { ml: 30, price: 1200 },
    ],
    price: 1200,
    stock: 8,
    image: null,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
]

// === REDUCER ===
const storeReducer = (state, action) => {
  switch (action.type) {
    // --- Produits ---
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        ),
      }
    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(p => p.id !== action.payload),
      }
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload }

    // --- Catégories ---
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(c =>
          c.id === action.payload.id ? { ...c, ...action.payload } : c
        ),
      }
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.payload),
      }
    case 'REORDER_CATEGORIES':
      return { ...state, categories: action.payload }

    default:
      return state
  }
}

// === CONTEXT ===
const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [savedProducts, setSavedProducts] = useLocalStorage('sodfa_products', INITIAL_PRODUCTS)
  const [savedCategories, setSavedCategories] = useLocalStorage('sodfa_categories', INITIAL_CATEGORIES)

  const [state, dispatch] = useReducer(storeReducer, {
    products: savedProducts,
    categories: savedCategories,
  })

  // Synchroniser avec localStorage à chaque changement
  useEffect(() => {
    setSavedProducts(state.products)
  }, [state.products, setSavedProducts])

  useEffect(() => {
    setSavedCategories(state.categories)
  }, [state.categories, setSavedCategories])

  // Helper : obtenir les produits d'une catégorie
  const getProductsByCategory = (categoryId) => {
    return state.products.filter(p => p.categoryId === categoryId && p.status === 'active')
  }

  // Helper : obtenir une catégorie par ID
  const getCategoryById = (categoryId) => {
    return state.categories.find(c => c.id === categoryId)
  }

  // Helper : obtenir un produit par ID
  const getProductById = (productId) => {
    return state.products.find(p => p.id === productId)
  }

  // Helper : produits actifs uniquement
  const activeProducts = state.products.filter(p => p.status === 'active')

  // Helper : produits en stock faible
  const lowStockProducts = state.products.filter(p => p.stock < 5 && p.status === 'active')

  return (
    <StoreContext.Provider value={{
      products: state.products,
      categories: state.categories,
      activeProducts,
      lowStockProducts,
      dispatch,
      getProductsByCategory,
      getCategoryById,
      getProductById,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore doit être utilisé à l\'intérieur de StoreProvider')
  }
  return context
}

export default StoreContext
