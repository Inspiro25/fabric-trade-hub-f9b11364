export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  sale_price?: number; // Add this to ensure compatibility with Supabase data
  images: string[];
  category: string;
  colors: string[];
  sizes: string[];
  isNew?: boolean;
  is_new?: boolean; // Add for compatibility 
  isTrending?: boolean;
  is_trending?: boolean; // Add for compatibility
  rating: number;
  reviewCount: number;
  review_count?: number; // Add for compatibility
  stock: number;
  tags: string[];
  shopId?: string;
  shop_id?: string; // Add for compatibility
  category_id?: string; // Add for compatibility
  sku?: string; // Add SKU property
  brand?: string; // Add brand property
  specifications?: Record<string, string>; // Add specifications property
}

// Export mock products to be used as fallback
export const mockProducts: Product[] = [
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
  },
  {
    id: "p9",
    name: "Women's Floral Maxi Dress",
    description: "Elegant floral maxi dress perfect for summer occasions. Features a flattering silhouette with adjustable straps and a flowing skirt that moves beautifully with you.",
    price: 89.99,
    salePrice: 69.99,
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=2080",
      "https://images.unsplash.com/photo-1586062129117-08db958f3515?q=80&w=2071",
      "https://images.unsplash.com/photo-1577447181665-009d53bd8d15?q=80&w=1974"
    ],
    category: "Dresses",
    colors: ["Floral Print", "Blue", "Pink"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    rating: 4.7,
    reviewCount: 52,
    stock: 25,
    tags: ["dress", "summer", "floral", "women"]
  },
  {
    id: "p10",
    name: "Men's Leather Jacket",
    description: "Premium leather jacket with a modern cut and comfortable fit. Features multiple pockets, sturdy zippers, and a quilted lining for extra warmth.",
    price: 199.99,
    images: [
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=1992",
      "https://images.unsplash.com/photo-1553143802-91ca2ee83d82?q=80&w=2010",
      "https://images.unsplash.com/photo-1546257056-04ced1d6d76c?q=80&w=1974"
    ],
    category: "Jackets",
    colors: ["Black", "Brown"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isTrending: true,
    rating: 4.9,
    reviewCount: 78,
    stock: 15,
    tags: ["leather", "jacket", "winter", "men"]
  },
  {
    id: "p11",
    name: "Athletic Running Shoes",
    description: "Lightweight, breathable running shoes with responsive cushioning and excellent traction. Designed for both casual joggers and serious runners.",
    price: 119.99,
    salePrice: 99.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=1925"
    ],
    category: "Shoes",
    colors: ["Red/White", "Black/Blue", "Gray/Green"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    isNew: true,
    rating: 4.6,
    reviewCount: 115,
    stock: 45,
    tags: ["shoes", "running", "athletic", "sports"]
  },
  {
    id: "p12",
    name: "Women's Cropped Cardigan",
    description: "Soft, lightweight cardigan perfect for layering. Features a cropped length, button-up front, and ribbed cuffs for a comfortable fit.",
    price: 49.99,
    images: [
      "https://images.unsplash.com/photo-1553754538-466add009c05?q=80&w=1936",
      "https://images.unsplash.com/photo-1524041255072-7dd0e30feba1?q=80&w=1780",
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=1934"
    ],
    category: "Sweaters",
    colors: ["Cream", "Light Pink", "Sage Green"],
    sizes: ["XS", "S", "M", "L"],
    rating: 4.3,
    reviewCount: 67,
    stock: 30,
    tags: ["cardigan", "sweater", "women", "knitwear"]
  },
  {
    id: "p13",
    name: "Distressed Boyfriend Jeans",
    description: "Relaxed-fit jeans with a slightly slouchy silhouette and distressed details. Made from high-quality denim with just the right amount of stretch.",
    price: 84.99,
    salePrice: 69.99,
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1974",
      "https://images.unsplash.com/photo-1582418702059-97ebafb35d09?q=80&w=1975",
      "https://images.unsplash.com/photo-1604176424472-9d7a8f8eb344?q=80&w=1974"
    ],
    category: "Jeans",
    colors: ["Light Wash", "Medium Wash"],
    sizes: ["24", "26", "28", "30", "32"],
    isNew: true,
    rating: 4.5,
    reviewCount: 92,
    stock: 35,
    tags: ["jeans", "distressed", "denim", "women"]
  },
  {
    id: "p14",
    name: "Men's Polo Shirt",
    description: "Classic polo shirt made from breathable cotton piqué. Features a ribbed collar, button placket, and subtle embroidered logo.",
    price: 44.99,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1974",
      "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?q=80&w=1951",
      "https://images.unsplash.com/photo-1571455786673-9d9d6c194f90?q=80&w=1974"
    ],
    category: "Polo Shirts",
    colors: ["Navy", "White", "Light Blue", "Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    isTrending: true,
    rating: 4.4,
    reviewCount: 108,
    stock: 50,
    tags: ["polo", "casual", "men"]
  },
  {
    id: "p15",
    name: "Quilted Puffer Vest",
    description: "Lightweight yet warm puffer vest with quilted design. Perfect for layering in cooler weather, featuring side pockets and a stand collar.",
    price: 69.99,
    salePrice: 54.99,
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1936",
      "https://images.unsplash.com/photo-1608744882201-39d87a0e56da?q=80&w=1974",
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=1972"
    ],
    category: "Outerwear",
    colors: ["Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.6,
    reviewCount: 72,
    stock: 25,
    tags: ["vest", "puffer", "outerwear", "winter"]
  },
  {
    id: "p16",
    name: "Women's Yoga Leggings",
    description: "High-waisted compression leggings made from moisture-wicking fabric. Features a hidden pocket in the waistband and four-way stretch for maximum comfort.",
    price: 59.99,
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=2069",
      "https://images.unsplash.com/photo-1516902663522-75d87bf6a94e?q=80&w=1974",
      "https://images.unsplash.com/photo-1547086293-3b69a50579ed?q=80&w=1974"
    ],
    category: "Activewear",
    colors: ["Black", "Heather Gray", "Navy"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
    isTrending: true,
    rating: 4.8,
    reviewCount: 156,
    stock: 40,
    tags: ["yoga", "leggings", "activewear", "women"]
  }
];

// Create a product store module to manage the products state
class ProductStore {
  private _products: Product[] = [...mockProducts];
  
  get products(): Product[] {
    return [...this._products];
  }
  
  set products(newProducts: Product[]) {
    this._products = [...newProducts];
  }
  
  updateProducts(newProducts: Product[]) {
    this._products = [...newProducts];
  }
  
  addProduct(product: Product) {
    this._products = [...this._products, product];
  }
  
  updateProduct(id: string, updatedProduct: Partial<Product>) {
    this._products = this._products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    );
  }
  
  removeProduct(id: string) {
    this._products = this._products.filter(product => product.id !== id);
  }
}

// Create a singleton instance
export const productStore = new ProductStore();
