'use client';

import React from 'react';
import { CartProvider } from '@/app/contexts/CartContext';
import ShoppingCart from '@/app/components/ShoppingCart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  
  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-2">
              Review your items and proceed to checkout
            </p>
          </div>
          
          {/* Cart Content */}
          <div className="max-w-4xl mx-auto">
            <ShoppingCart />
          </div>
        </div>
      </div>
    </CartProvider>
  );
}