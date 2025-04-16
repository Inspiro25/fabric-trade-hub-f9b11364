
import { useNavigate } from 'react-router-dom';

export function useProductNavigation() {
  const navigate = useNavigate();
  
  const navigateToProduct = (productId: string) => {
    navigate(`/products/${productId}`);
  };
  
  return { navigateToProduct };
}
