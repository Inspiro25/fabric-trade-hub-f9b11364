
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  isTrending?: boolean;
  rating: number;
  reviewCount: number;
  stock: number;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "p1",
    name: "Premium Cotton T-Shirt",
    description: "Made from 100% organic cotton, this premium t-shirt offers exceptional comfort and durability. Perfect for everyday wear, it features a classic fit and is available in multiple colors and sizes.",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2071",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1951"
    ],
    category: "T-Shirts",
    colors: ["White", "Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isNew: true,
    rating: 4.5,
    reviewCount: 128,
    stock: 50,
    tags: ["cotton", "casual", "summer"]
  },
  {
    id: "p2",
    name: "Slim Fit Denim Jeans",
    description: "Our slim fit denim jeans combine style with comfort. Made from premium denim with a touch of stretch for flexibility, these jeans feature a modern silhouette that flatters your shape.",
    price: 79.99,
    salePrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1926",
      "https://images.unsplash.com/photo-1609535765869-9ce17b15c17e?q=80&w=1990",
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2009"
    ],
    category: "Jeans",
    colors: ["Blue", "Black", "Gray"],
    sizes: ["28", "30", "32", "34", "36"],
    isTrending: true,
    rating: 4.7,
    reviewCount: 93,
    stock: 35,
    tags: ["denim", "slim fit", "casual"]
  },
  {
    id: "p3",
    name: "Oversized Hoodie",
    description: "Stay cozy and stylish with our oversized hoodie. Made from a soft cotton blend, it features a spacious hood, kangaroo pocket, and a relaxed fit that's perfect for lounging or casual outings.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974",
      "https://images.unsplash.com/photo-1572495641004-28421ae29efe?q=80&w=1974",
      "https://images.unsplash.com/photo-1509942774463-acf339cf87d5?q=80&w=1974"
    ],
    category: "Hoodies",
    colors: ["Gray", "Black", "Beige"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.3,
    reviewCount: 67,
    stock: 25,
    tags: ["hoodie", "casual", "winter"]
  },
  {
    id: "p4",
    name: "Structured Blazer",
    description: "Elevate your professional wardrobe with our structured blazer. Tailored from high-quality fabric with a slight stretch, it features a fitted silhouette, notched lapels, and functional pockets.",
    price: 129.99,
    salePrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae34?q=80&w=2080",
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?q=80&w=1974",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?q=80&w=1738"
    ],
    category: "Blazers",
    colors: ["Black", "Navy", "Gray"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.8,
    reviewCount: 42,
    stock: 15,
    tags: ["formal", "business", "professional"]
  },
  {
    id: "p5",
    name: "Graphic Print T-Shirt",
    description: "Express your unique style with our graphic print t-shirt. Made from soft cotton, this comfortable tee features an eye-catching design that's sure to make a statement.",
    price: 34.99,
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1974",
      "https://images.unsplash.com/photo-1503342784814-e88c5b09e2a5?q=80&w=2080",
      "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=2080"
    ],
    category: "T-Shirts",
    colors: ["White", "Black", "Red"],
    sizes: ["S", "M", "L", "XL"],
    isNew: true,
    isTrending: true,
    rating: 4.2,
    reviewCount: 53,
    stock: 40,
    tags: ["graphic", "casual", "cotton"]
  },
  {
    id: "p6",
    name: "Summer Linen Shirt",
    description: "Stay cool and sophisticated with our summer linen shirt. Made from 100% natural linen, this breathable shirt features a relaxed fit and is perfect for warm weather occasions.",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1602810318660-d2c46b750065?q=80&w=1974",
      "https://images.unsplash.com/photo-1617952236317-19d25bfdbfd6?q=80&w=1974",
      "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?q=80&w=1974"
    ],
    category: "Shirts",
    colors: ["White", "Blue", "Beige"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 78,
    stock: 30,
    tags: ["linen", "summer", "casual"]
  },
  {
    id: "p7",
    name: "Pleated Midi Skirt",
    description: "Add a touch of elegance to your wardrobe with our pleated midi skirt. The flowing pleats create beautiful movement, while the midi length offers versatility for different occasions.",
    price: 69.99,
    salePrice: 49.99,
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1974",
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1974",
      "https://images.unsplash.com/photo-1577900232427-18219b8349fd?q=80&w=1770"
    ],
    category: "Skirts",
    colors: ["Black", "Navy", "Beige"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.4,
    reviewCount: 31,
    stock: 20,
    tags: ["skirt", "midi", "elegant"]
  },
  {
    id: "p8",
    name: "Designer Sunglasses",
    description: "Protect your eyes in style with our designer sunglasses. Featuring UV protection and a timeless design, these sunglasses are the perfect accessory for sunny days.",
    price: 149.99,
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=1980",
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1980",
      "https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=1966"
    ],
    category: "Accessories",
    colors: ["Black", "Brown", "Gold"],
    sizes: ["One Size"],
    isTrending: true,
    rating: 4.9,
    reviewCount: 64,
    stock: 15,
    tags: ["sunglasses", "accessories", "summer"]
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getRelatedProducts = (currentProductId: string, category: string): Product[] => {
  return products
    .filter(product => product.id !== currentProductId && product.category === category)
    .slice(0, 4);
};

export const getNewArrivals = (): Product[] => {
  return products.filter(product => product.isNew).slice(0, 4);
};

export const getTrendingProducts = (): Product[] => {
  return products.filter(product => product.isTrending).slice(0, 4);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

export const getAllCategories = (): string[] => {
  const categories = new Set(products.map(product => product.category));
  return Array.from(categories);
};
