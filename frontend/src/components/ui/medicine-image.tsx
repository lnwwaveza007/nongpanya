import { Pill } from "lucide-react";
import { Medicine } from "@/types/medicine";

interface MedicineImageProps {
  medicine: Medicine | Partial<Medicine>;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showGrayscale?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16", 
  lg: "w-20 h-20",
  xl: "w-24 h-24"
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 28,
  xl: 32
};

const fallbackImages = {
  sm: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iNiIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjQgMTZIMjhWMjRIMjBWMTZIMjRaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik0yMCAzMkgzMlYyNEgyMFYzMloiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+",
  md: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMzIgMjBIMzZWMjhIMjhWMjBIMzJaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik0yOCAzNkg0NFYyOEgyOFYzNloiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+",
  lg: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTAiIGZpbGw9IiNGOUZBRkIiLz4KPHA+aCBkPSJNNDAgMjVINDVWMzVIMzVWMjVINDBaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik0zNSA0NUg1NVYzNUgzNVY0NVoiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+",
  xl: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iMTIiIGZpbGw9IiNGOUZBRkIiLz4KPHA+aCBkPSJNNDggMzBINTRWNDJINDJWMzBINDhaIiBmaWxsPSIjRjU5RTBCIi8+CjxwYXRoIGQ9Ik00MiA1NEg2NlY0Mkg0MlY1NFoiIGZpbGw9IiNGNTlFMEIiLz4KPC9zdmc+"
};

export const MedicineImage: React.FC<MedicineImageProps> = ({
  medicine,
  size = "md",
  className = "",
  showGrayscale = false
}) => {
  const sizeClass = sizeClasses[size];
  const iconSize = iconSizes[size];
  const fallbackSvg = fallbackImages[size];

  const shouldShowGrayscale = showGrayscale && medicine.total_stock === 0;

  if (medicine.image_url) {
    return (
      <img
        src={medicine.image_url}
        alt={medicine.name || "Medicine"}
        className={`${sizeClass} rounded-lg object-cover border border-gray-200 ${
          shouldShowGrayscale ? "grayscale" : ""
        } ${className}`}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = fallbackSvg;
        }}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-lg bg-orange-200 flex items-center justify-center border border-orange-300 ${
        shouldShowGrayscale ? "grayscale" : ""
      } ${className}`}
    >
      <Pill size={iconSize} className="text-orange-600" />
    </div>
  );
};

export default MedicineImage;
