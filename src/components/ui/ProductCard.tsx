
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  category?: string;
  isNew?: boolean;
  isTrending?: boolean;
  layout?: 'vertical' | 'horizontal';
  rating?: number;
  reviewCount?: number;
  isDarkMode?: boolean;
}

const ProductCard = ({ 
  id, 
  name, 
  price, 
  salePrice, 
  image,
  category,
  isNew,
  isTrending,
  layout = 'vertical', 
  rating,
  reviewCount,
  isDarkMode
}: ProductCardProps) => {
  return (
    <div className={cn(
      "group rounded-lg overflow-hidden transition-all",
      isDarkMode ? "bg-gray-800 hover:bg-gray-700 border-gray-700" : "bg-white hover:shadow-lg border-gray-200",
      "border",
      layout === 'horizontal' ? "flex" : ""
    )}>
      <Link to={`/products/${id}`} className={cn(
        layout === 'horizontal' ? "flex flex-1" : "block"
      )}>
        <div className={cn(
          "relative bg-gray-100",
          layout === 'horizontal' ? "w-24 h-24 shrink-0" : "aspect-[4/5]"
        )}>
          <img
            src={image || '/placeholder.svg'}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {isNew && (
            <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">New</span>
          )}
          {isTrending && (
            <span className="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded">Trending</span>
          )}
        </div>
        
        <div className={cn(
          "p-3",
          layout === 'horizontal' ? "flex-1" : ""
        )}>
          <h3 className={cn(
            "text-sm font-medium line-clamp-2 mb-1",
            isDarkMode ? "text-gray-200" : "text-gray-800"
          )}>
            {name}
          </h3>
          
          {category && (
            <p className={cn(
              "text-xs mb-1",
              isDarkMode ? "text-gray-400" : "text-gray-500"  
            )}>
              {category}
            </p>
          )}
          
          <div className="flex items-center justify-between mt-2">
            <div>
              {salePrice ? (
                <div className="flex items-center gap-1">
                  <p className={cn(
                    "text-base font-bold",
                    isDarkMode ? "text-white" : "text-gray-900"  
                  )}>
                    ${typeof salePrice === 'number' ? salePrice.toFixed(2) : '0.00'}
                  </p>
                  <p className="text-xs line-through text-gray-400">
                    ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                  </p>
                </div>
              ) : (
                <p className={cn(
                  "text-base font-bold",
                  isDarkMode ? "text-white" : "text-gray-900"  
                )}>
                  ${typeof price === 'number' ? price.toFixed(2) : '0.00'}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
