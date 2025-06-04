'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/app/contexts/CartContext';
import { useRouter } from 'next/navigation';

export default function CartIcon() {
  const { getCartItemCount } = useCart();
  const router = useRouter();
  const itemCount = getCartItemCount();
  
  const handleCartClick = () => {
    router.push('/cart');
  };
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCartClick}
      className="relative p-2 hover:bg-gray-100 transition-colors"
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold min-w-[20px] rounded-full"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </Badge>
      )}
    </Button>
  );
}