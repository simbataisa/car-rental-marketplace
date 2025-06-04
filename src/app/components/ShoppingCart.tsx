'use client';

import React, { useState } from 'react';
import { useCart } from '@/app/contexts/CartContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { cartService } from '@/lib/cartService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ShoppingCart as ShoppingCartIcon,
  Plus,
  Minus,
  Trash2,
  Car,
  Settings,
  Zap,
  CreditCard,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Cart item component
function CartItemComponent({ item }: { item: any }) {
  const { updateQuantity, removeFromCart } = useCart();
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  
  const getItemIcon = () => {
    switch (item.type) {
      case 'vehicle_rental':
        return <Car className="h-5 w-5" />;
      case 'addon_service':
        return <Settings className="h-5 w-5" />;
      case 'car_care':
        return <Settings className="h-5 w-5" />;
      case 'charging_voucher':
        return <Zap className="h-5 w-5" />;
      case 'prepaid_item':
      case 'postpaid_item':
        return <CreditCard className="h-5 w-5" />;
      case 'subscription_service':
        return <Calendar className="h-5 w-5" />;
      default:
        return <ShoppingCartIcon className="h-5 w-5" />;
    }
  };
  
  const getItemTypeLabel = () => {
    switch (item.type) {
      case 'vehicle_rental':
        return 'Vehicle Rental';
      case 'addon_service':
        return 'Add-on Service';
      case 'car_care':
        return 'Car Care';
      case 'charging_voucher':
        return 'Charging Voucher';
      case 'prepaid_item':
        return 'Prepaid Item';
      case 'postpaid_item':
        return 'Postpaid Item';
      case 'subscription_service':
        return 'Subscription';
      default:
        return 'Item';
    }
  };
  
  const renderItemDetails = () => {
    switch (item.type) {
      case 'vehicle_rental':
        return (
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3" />
              <span>{item.vehicleData?.pickupLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              <span>
                {item.vehicleData?.pickupDate ? new Date(item.vehicleData.pickupDate).toLocaleDateString() : 'N/A'}
                {item.vehicleData?.returnDate && ` - ${new Date(item.vehicleData.returnDate).toLocaleDateString()}`}
              </span>
            </div>
          </div>
        );
      case 'addon_service':
        return (
          <div className="text-sm text-gray-600">
            <span className="capitalize">{item.serviceData?.category}</span>
            {item.serviceData?.duration && ` • ${item.serviceData.duration}`}
          </div>
        );
      case 'charging_voucher':
        return (
          <div className="text-sm text-gray-600">
            <span>{item.voucherData?.energyAmount} kWh</span>
            {item.voucherData?.validityPeriod && ` • Valid: ${item.voucherData.validityPeriod}`}
          </div>
        );
      case 'subscription_service':
        return (
          <div className="text-sm text-gray-600">
            <span className="capitalize">{item.subscriptionData?.plan} Plan</span>
            <span className="capitalize"> • {item.subscriptionData?.billingCycle}</span>
          </div>
        );
      default:
        return item.description && (
          <div className="text-sm text-gray-600">{item.description}</div>
        );
    }
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Item Image */}
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">
                {getItemIcon()}
              </div>
            )}
          </div>
          
          {/* Item Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                <Badge variant="outline" className="mt-1 text-xs">
                  {getItemTypeLabel()}
                </Badge>
                <div className="mt-2">
                  {renderItemDetails()}
                </div>
              </div>
              
              {/* Price and Actions */}
              <div className="text-right ml-4">
                <div className="font-semibold text-lg">
                  {formatPrice(item.price * item.quantity)}
                </div>
                <div className="text-sm text-gray-500">
                  {formatPrice(item.price)} each
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Checkout form component
function CheckoutForm({ onSubmit, isLoading }: {
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    customerName: user?.displayName || '',
    customerEmail: user?.email || '',
    customerPhone: '',
    notes: '',
    specialRequests: ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Full Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="customerEmail">Email *</Label>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="customerPhone">Phone Number *</Label>
        <Input
          id="customerPhone"
          value={formData.customerPhone}
          onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Any additional notes..."
        />
      </div>
      
      <div>
        <Label htmlFor="specialRequests">Special Requests</Label>
        <Textarea
          id="specialRequests"
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          placeholder="Any special requests or requirements..."
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Place Order
          </div>
        )}
      </Button>
    </form>
  );
}

// Main shopping cart component
export default function ShoppingCart() {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };
  
  const handleCheckout = async (customerInfo: any) => {
    if (!user) {
      toast.error('Please login to checkout');
      return;
    }
    
    try {
      setIsCheckingOut(true);
      const order = await cartService.checkoutCart(user.uid, customerInfo);
      
      toast.success('Order placed successfully!');
      setIsCheckoutOpen(false);
      
      // Redirect to account page to view the order
      router.push('/account?tab=bookings');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };
  
  if (state.isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!state.cart || state.cart.items.length === 0) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <ShoppingCartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Add some items to get started</p>
            <Button onClick={() => router.push('/search')}>
              Browse Vehicles
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingCartIcon className="h-5 w-5" />
              Shopping Cart ({state.cart.items.length} items)
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>
        </CardHeader>
      </Card>
      
      {/* Cart Items */}
      <div>
        {state.cart.items.map((item) => (
          <CartItemComponent key={item.id} item={item} />
        ))}
      </div>
      
      {/* Cart Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(state.cart.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax:</span>
            <span>{formatPrice(state.cart.tax)}</span>
          </div>
          {state.cart.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>-{formatPrice(state.cart.discount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>{formatPrice(state.cart.total)}</span>
          </div>
          
          {/* Checkout Button */}
          <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
            <DialogTrigger asChild>
              <Button className="w-full mt-4" size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Checkout</DialogTitle>
                <DialogDescription>
                  Please provide your information to complete the order.
                </DialogDescription>
              </DialogHeader>
              <CheckoutForm onSubmit={handleCheckout} isLoading={isCheckingOut} />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}