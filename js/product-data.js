// ALOBORA Bottled Water Commercial Product Catalog
// Structured multi-size catalog across 4 commercial categories

const ALOBORA_PRODUCT_CATALOG = [
  // 1. SMALL / ON-THE-GO CATEGORY
  {
    id: "alb-200ml",
    name: "ALOBORA Compact Pocket",
    size: "200ml",
    category: "small",
    categoryLabel: "On-The-Go",
    price: 15,
    designFamily: "ALOBORA Compact",
    description: "Compact 200 ml pocket bottle with micro-grooves. Designed for quick hydration, catering, and event serving.",
    mainImage: "images/bottles/200ml/alobora-200ml-front.png",
    thumbnails: [
      "images/bottles/200ml/alobora-200ml-front.png",
      "images/bottles/500ml/alobora-500ml-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Events, Conferences & Quick Hydration"
  },
  {
    id: "alb-250ml",
    name: "ALOBORA Petite Stream",
    size: "250ml",
    category: "small",
    categoryLabel: "On-The-Go",
    price: 20,
    designFamily: "ALOBORA Petite",
    description: "Sleek 250 ml slimline bottle with a tapered waist. Fits easily into handbags and dining setups.",
    mainImage: "images/bottles/250ml/alobora-250ml-front.png",
    thumbnails: [
      "images/bottles/250ml/alobora-250ml-front.png",
      "images/bottles/750ml/alobora-750ml-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Dining, Kids & Short Walks"
  },
  {
    id: "alb-300ml",
    name: "ALOBORA Mini Grip",
    size: "300ml",
    category: "small",
    categoryLabel: "On-The-Go",
    price: 25,
    designFamily: "ALOBORA Mini Grip",
    description: "Compact 300 ml ribbed bottle with non-slip thumb contour. Fits perfectly into car cup holders.",
    mainImage: "images/bottles/300ml/alobora-300ml-front.png",
    thumbnails: [
      "images/bottles/300ml/alobora-300ml-front.png",
      "images/bottles/500ml/alobora-500ml-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Car Cup Holders & Commutes"
  },

  // 2. EVERYDAY HYDRATION CATEGORY
  {
    id: "alb-500ml",
    name: "ALOBORA Flow Everyday",
    size: "500ml",
    category: "everyday",
    categoryLabel: "Everyday",
    price: 30,
    designFamily: "ALOBORA Flow",
    description: "Ergonomic 500 ml everyday bottle with spiral flowing body grooves. Lightweight and ideal for daily carry.",
    mainImage: "images/bottles/500ml/alobora-500ml-front.png",
    thumbnails: [
      "images/bottles/500ml/alobora-500ml-front.png",
      "images/bottles/750ml/alobora-750ml-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Daily Desk Carry & Walking"
  },
  {
    id: "alb-600ml",
    name: "ALOBORA Active Ergonomic",
    size: "600ml",
    category: "everyday",
    categoryLabel: "Everyday",
    price: 35,
    designFamily: "ALOBORA Active",
    description: "Tapered 600 ml athletic bottle with anti-slip lower ridges for active outdoor use.",
    mainImage: "images/bottles/600ml/alobora-600ml-front.png",
    thumbnails: [
      "images/bottles/600ml/alobora-600ml-front.png",
      "images/bottles/500ml/alobora-500ml-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Gym, Workouts & Fitness"
  },
  {
    id: "alb-750ml",
    name: "ALOBORA Travel Premium",
    size: "750ml",
    category: "everyday",
    categoryLabel: "Everyday",
    price: 45,
    designFamily: "ALOBORA Travel",
    description: "High-shoulder 750 ml bottle with refined neck ring. Engineered for extended daily travel and work.",
    mainImage: "images/bottles/750ml/alobora-750ml-front.png",
    thumbnails: [
      "images/bottles/750ml/alobora-750ml-front.png",
      "images/bottles/1l/alobora-1l-front.png",
      "images/bottles/500ml/alobora-500ml-front.png"
    ],
    bestFor: "Travel & Long Commutes"
  },

  // 3. LARGE FAMILY CATEGORY
  {
    id: "alb-1l",
    name: "ALOBORA Signature 1 L",
    size: "1000ml",
    category: "large",
    categoryLabel: "Large Family",
    price: 55,
    designFamily: "ALOBORA Signature",
    description: "The flagship 1 Litre ALOBORA bottle with diamond-faceted vertical clarity grooves. Iconic brand silhouette.",
    mainImage: "images/bottles/1l/alobora-1l-front.png",
    thumbnails: [
      "images/bottles/1l/alobora-1l-front.png",
      "images/bottles/750ml/alobora-750ml-front.png",
      "images/bottles/2l/alobora-2l-front.png"
    ],
    bestFor: "Daily Hydration, Office & Travel (Main Brand Icon)"
  },
  {
    id: "alb-1.5l",
    name: "ALOBORA Family Tour",
    size: "1500ml",
    category: "large",
    categoryLabel: "Large Family",
    price: 75,
    designFamily: "ALOBORA Family Tour",
    description: "Reinforced 1.5 Litre family bottle with structural neck and horizontal stabilizer ribs.",
    mainImage: "images/bottles/1.5l/alobora-1.5l-front.png",
    thumbnails: [
      "images/bottles/1.5l/alobora-1.5l-front.png",
      "images/bottles/2l/alobora-2l-front.png",
      "images/bottles/1l/alobora-1l-front.png"
    ],
    bestFor: "Road Trips & Family Outings"
  },
  {
    id: "alb-2l",
    name: "ALOBORA Family Grip",
    size: "2000ml",
    category: "large",
    categoryLabel: "Large Family",
    price: 95,
    designFamily: "ALOBORA Family Grip",
    description: "Wide stable 2 Litre bottle with dual ergonomic side-grip indentations for comfortable pouring.",
    mainImage: "images/bottles/2l/alobora-2l-front.png",
    thumbnails: [
      "images/bottles/2l/alobora-2l-front.png",
      "images/bottles/1l/alobora-1l-front.png",
      "images/bottles/500ml/alobora-500ml-front.png"
    ],
    bestFor: "Home Refrigerator Storage & Long Journeys"
  },

  // 4. HOME & OFFICE CATEGORY
  {
    id: "alb-5l",
    name: "ALOBORA Home Dispenser 5 L",
    size: "5 L",
    category: "home_office",
    categoryLabel: "Home & Office",
    price: 180,
    designFamily: "ALOBORA Home",
    description: "Heavy-duty 5 Litre square container with integrated sturdy carrying handle. Perfect for kitchen counters.",
    mainImage: "images/bottles/5l/alobora-5l-front.png",
    thumbnails: [
      "images/bottles/5l/alobora-5l-front.png",
      "images/bottles/20l/alobora-20l-front.png"
    ],
    bestFor: "Home Kitchens & Camping"
  },
  {
    id: "alb-10l",
    name: "ALOBORA Office Jar 10 L",
    size: "10 L",
    category: "home_office",
    categoryLabel: "Home & Office",
    price: 280,
    designFamily: "ALOBORA Office Jar",
    description: "Heavy ribbed 10 Litre bulk container equipped with quick-dispense tap socket.",
    mainImage: "images/bottles/10l/alobora-10l-front.png",
    thumbnails: [
      "images/bottles/10l/alobora-10l-front.png",
      "images/bottles/20l/alobora-20l-front.png"
    ],
    bestFor: "Small Offices & Gathering Stations"
  },
  {
    id: "alb-20l",
    name: "ALOBORA Commercial Jar 20 L",
    size: "20 L",
    category: "home_office",
    categoryLabel: "Home & Office",
    price: 350,
    designFamily: "ALOBORA Commercial Dispenser",
    description: "20 Litre heavy-duty commercial dispenser jar engineered for water cooler dispensers.",
    mainImage: "images/bottles/20l/alobora-20l-front.png",
    thumbnails: [
      "images/bottles/20l/alobora-20l-front.png",
      "images/bottles/10l/alobora-10l-front.png"
    ],
    bestFor: "Commercial Dispensers & Full Household Stations"
  }
];

// Compatibility wrapper for legacy size-based lookups
const waterBottleVariants = ALOBORA_PRODUCT_CATALOG.map(item => ({
  size: item.size,
  price: item.price,
  mainImage: item.mainImage,
  thumbnails: item.thumbnails
}));
