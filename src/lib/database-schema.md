
# E-Commerce Application Database Schema

This document outlines the Firebase Firestore database schema used in the e-commerce application. It includes details about each collection, their fields, and the relationships between them.

## Collections Overview

The database is organized into the following collections:
- `users`: User accounts and profiles
- `products`: Product catalog information
- `shops`: Vendor/shop information
- `carts`: Shopping carts for users
- `wishlists`: User wishlist items
- `orders`: Order information
- `reviews`: Product reviews
- `categories`: Product categories
- `addresses`: User shipping addresses

## Detailed Schema

### Users Collection
**Collection**: `users`

**Description**: Stores user profile information and account details.

**Fields**:
- `displayName`: string - User's display name
- `email`: string - User's email address
- `phone`: string (optional) - User's phone number
- `address`: string (optional) - User's default address
- `savedAddresses`: array (optional) - Array of user's saved addresses
  - `id`: string - Unique identifier for the address
  - `name`: string - Name for the address (e.g., "Home", "Work")
  - `addressLine1`: string - Street address, line 1
  - `addressLine2`: string (optional) - Street address, line 2
  - `city`: string - City
  - `state`: string - State/province
  - `postalCode`: string - ZIP/postal code
  - `country`: string - Country
  - `isDefault`: boolean - Whether this is the default address

**Relationships**:
- Referenced by `orders` (one-to-many)
- Referenced by `carts` (one-to-one)
- Referenced by `wishlists` (one-to-one)
- References `addresses` (one-to-many)

### Products Collection
**Collection**: `products`

**Description**: Contains information about the products available in the store.

**Fields**:
- `id`: string - Unique product identifier
- `name`: string - Product name
- `description`: string - Product description
- `price`: number - Regular price
- `salePrice`: number (optional) - Discounted price if on sale
- `images`: array of strings - URLs to product images
- `category`: string - Product category
- `colors`: array of strings - Available colors
- `sizes`: array of strings - Available sizes
- `isNew`: boolean - Whether the product is new
- `isTrending`: boolean - Whether the product is trending
- `rating`: number - Average product rating
- `reviewCount`: number - Number of reviews
- `stock`: number - Available stock quantity
- `tags`: array of strings - Product tags for searching/filtering
- `shopId`: string - ID of the shop that sells this product

**Relationships**:
- References `shops` (many-to-one)
- Referenced by `carts.items` (one-to-many)
- Referenced by `wishlists.items` (one-to-many)
- Referenced by `orders.items` (one-to-many)
- Referenced by `reviews` (one-to-many)

### Shops Collection
**Collection**: `shops`

**Description**: Stores information about sellers/shops.

**Fields**:
- `id`: string - Unique shop identifier
- `name`: string - Shop name
- `description`: string - Shop description
- `logo`: string - URL to shop logo
- `coverImage`: string - URL to shop cover image
- `address`: string - Shop physical address
- `rating`: number - Average shop rating
- `reviewCount`: number - Number of shop reviews
- `productIds`: array of strings - IDs of products sold by this shop
- `isVerified`: boolean - Whether the shop is verified
- `createdAt`: string - Shop creation date

**Relationships**:
- Referenced by `products` (one-to-many)

### Carts Collection
**Collection**: `carts`

**Description**: Stores users' shopping cart information.

**Fields**:
- `userId`: string - ID of the user who owns the cart
- `items`: array - Products in the cart
  - `id`: string - Product ID
  - `product`: object - Product information
  - `quantity`: number - Quantity of the product
  - `color`: string - Selected color
  - `size`: string - Selected size

**Relationships**:
- References `users` (many-to-one)
- References `products` in items array (many-to-many)

### Wishlists Collection
**Collection**: `wishlists`

**Description**: Stores users' wishlist items.

**Fields**:
- `userId`: string - ID of the user who owns the wishlist
- `items`: array of strings - IDs of products in the wishlist

**Relationships**:
- References `users` (many-to-one)
- References `products` through items array (many-to-many)

### Orders Collection
**Collection**: `orders`

**Description**: Stores order information.

**Fields**:
- `id`: string - Unique order identifier
- `userId`: string - ID of the user who placed the order
- `items`: array - Products in the order
  - `productId`: string - Product ID
  - `quantity`: number - Quantity ordered
  - `price`: number - Price at time of purchase
  - `color`: string - Selected color
  - `size`: string - Selected size
- `totalAmount`: number - Total order amount
- `status`: string - Order status (e.g., "pending", "shipped", "delivered")
- `paymentStatus`: string - Payment status (e.g., "paid", "pending")
- `paymentMethod`: string - Payment method used
- `shippingAddress`: object - Shipping address information
- `billingAddress`: object - Billing address information
- `createdAt`: timestamp - Order creation date
- `updatedAt`: timestamp - Last order update date

**Relationships**:
- References `users` (many-to-one)
- References `products` through items array (many-to-many)

### Reviews Collection
**Collection**: `reviews`

**Description**: Stores product reviews.

**Fields**:
- `id`: string - Unique review identifier
- `productId`: string - ID of the reviewed product
- `userId`: string - ID of the user who wrote the review
- `rating`: number - Rating (1-5)
- `comment`: string - Review text
- `createdAt`: timestamp - Review creation date
- `updatedAt`: timestamp - Last review update date

**Relationships**:
- References `products` (many-to-one)
- References `users` (many-to-one)

### Categories Collection
**Collection**: `categories`

**Description**: Stores product categories.

**Fields**:
- `id`: string - Unique category identifier
- `name`: string - Category name
- `description`: string - Category description
- `image`: string - URL to category image
- `parentId`: string (optional) - ID of parent category for nested categories

**Relationships**:
- Referenced by `products` (one-to-many)
- Self-referencing for hierarchical categories

### Addresses Collection
**Collection**: `addresses`

**Description**: Stores user addresses.

**Fields**:
- `id`: string - Unique address identifier
- `userId`: string - ID of the user who owns this address
- `name`: string - Address name (e.g., "Home", "Work")
- `addressLine1`: string - Street address, line 1
- `addressLine2`: string (optional) - Street address, line 2
- `city`: string - City
- `state`: string - State/province
- `postalCode`: string - ZIP/postal code
- `country`: string - Country
- `isDefault`: boolean - Whether this is the user's default address

**Relationships**:
- References `users` (many-to-one)
- Referenced by `orders` (one-to-many)

## Security Rules

The database is secured with Firebase Security Rules that ensure:
- Users can only read and write their own data
- Shop owners can only modify their own shop and product information
- Public data (like product listings) is read-only for all users
- Administrative functions are restricted to authorized admin accounts

## Indexes

The following indexes are recommended for optimal performance:
- `products` collection: `category` and `price` (for filtered product listings)
- `products` collection: `shopId` and `category` (for shop category filtering)
- `orders` collection: `userId` and `createdAt` (for user order history)
- `reviews` collection: `productId` and `rating` (for product review filtering)

## Data Flow

1. User Authentication → `users` collection
2. Product Browsing → `products` and `categories` collections
3. Shop Browsing → `shops` collection
4. Cart Management → `carts` collection
5. Wishlist Management → `wishlists` collection
6. Order Placement → `orders` collection
7. Review Submission → `reviews` collection
8. Address Management → `addresses` collection

This schema provides a comprehensive foundation for the e-commerce application, with clear relationships between collections and efficient data organization.
