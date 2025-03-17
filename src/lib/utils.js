import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  Plane, 
  Laptop, 
  ShoppingBag, 
  Car, 
  Home 
} from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getCategoryIcon(category) {
  const icons = {
    TRAVEL: Plane,
    ELECTRONICS: Laptop,
    CLOTHES: ShoppingBag,
    VEHICLE: Car,
    ACCOMMODATION: Home,
  };
  return icons[category] || ShoppingBag;
}