
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";

interface ProductCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ 
  viewMode = 'grid'
}) => {
  const { isDarkMode } = useTheme();
  
  if (viewMode === 'list') {
    return (
      <div className={cn(
        "rounded-lg shadow-sm overflow-hidden border",
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      )}>
        <div className="flex flex-row">
          <div className="w-1/3">
            <Skeleton className={cn(
              "w-full aspect-square",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
          </div>
          
          <div className="p-4 w-2/3 flex flex-col">
            <Skeleton className={cn(
              "h-3 w-1/3 mb-2",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <Skeleton className={cn(
              "h-5 w-5/6 mb-2",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <Skeleton className={cn(
              "h-3 w-24 mb-2",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <Skeleton className={cn(
              "h-4 w-full mb-2",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <Skeleton className={cn(
              "h-4 w-full mb-4",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <Skeleton className={cn(
              "h-4 w-28 mb-5",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )} />
            
            <div className="flex gap-2 mt-auto">
              <Skeleton className={cn(
                "h-9 flex-grow",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )} />
              <Skeleton className={cn(
                "h-9 w-9",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )} />
              <Skeleton className={cn(
                "h-9 w-9",
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              )} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn(
      "rounded-lg shadow-sm overflow-hidden border h-full",
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
    )}>
      <Skeleton className={cn(
        "w-full aspect-square",
        isDarkMode ? "bg-gray-700" : "bg-gray-200"
      )} />
      
      <div className="p-3 flex flex-col h-[calc(100%-100%*(1/1))]">
        <Skeleton className={cn(
          "h-3 w-1/2 mb-2",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )} />
        
        <Skeleton className={cn(
          "h-5 w-full mb-2",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )} />
        
        <Skeleton className={cn(
          "h-5 w-full mb-2",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )} />
        
        <Skeleton className={cn(
          "h-3 w-20 mb-2",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )} />
        
        <Skeleton className={cn(
          "h-4 w-1/2 mb-5",
          isDarkMode ? "bg-gray-700" : "bg-gray-200"
        )} />
        
        <div className="mt-auto flex gap-2">
          <Skeleton className={cn(
            "h-8 flex-grow",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )} />
          <Skeleton className={cn(
            "h-8 w-8",
            isDarkMode ? "bg-gray-700" : "bg-gray-200"
          )} />
        </div>
      </div>
    </div>
  );
};
