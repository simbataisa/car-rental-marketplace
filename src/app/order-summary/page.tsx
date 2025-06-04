'use client';

// Multi-item order summary page

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Star, 
  Car, 
  Fuel, 
  Users, 
  Settings, 
  CheckCircle, 
  CreditCard,
  Zap,
  ArrowLeft,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { MultiItemOrder, OrderItem, isMultiItemOrder } from '@/lib/orderService';
import { toast } from 'sonner';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function OrderSummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<MultiItemOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const orderId = searchParams.get('orderId');
  
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        toast.error('Order ID not provided');
        router.push('/account?tab=bookings');
        return;
      }
      
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          const orderData = { id: orderDoc.id, ...orderDoc.data() } as any;
          
          if (isMultiItemOrder(orderData)) {
            setOrder(orderData);
          } else {
            toast.error('This page is for multi-item orders only');
            router.push('/account?tab=bookings');
          }
        } else {
          toast.error('Order not found');
          router.push('/account?tab=bookings');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order');
        router.push('/account?tab=bookings');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, router]);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };
  
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getItemIcon = (type: string) => {
    switch (type) {
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
        return <Package className="h-5 w-5" />;
    }
  };
  
  const getItemTypeLabel = (type: string) => {
    switch (type) {
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
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const renderItemDetails = (item: OrderItem) => {
    switch (item.type) {
      case 'vehicle_rental':
        return (
          <div className="space-y-2">
            {item.vehicleData && (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>{item.vehicleData.pickupLocation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(item.vehicleData.pickupDate)}
                    {item.vehicleData.returnDate && ` - ${formatDate(item.vehicleData.returnDate)}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-3 w-3" />
                  <span>{item.vehicleData.dealerName}</span>
                </div>
              </>
            )}
          </div>
        );
      case 'addon_service':
        return (
          <div className="text-sm text-gray-600">
            {item.serviceData && (
              <>
                <span className="capitalize">{item.serviceData.category}</span>
                {item.serviceData.duration && ` • ${item.serviceData.duration}`}
                {item.serviceData.location && (
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{item.serviceData.location}</span>
                  </div>
                )}
              </>
            )}
          </div>
        );
      case 'charging_voucher':
        return (
          <div className="text-sm text-gray-600">
            {item.voucherData && (
              <>
                <span>{item.voucherData.energyAmount} kWh</span>
                {item.voucherData.validityPeriod && ` • Valid: ${item.voucherData.validityPeriod}`}
                {item.voucherData.stationNetwork && (
                  <div className="mt-1">Network: {item.voucherData.stationNetwork}</div>
                )}
              </>
            )}
          </div>
        );
      case 'subscription_service':
        return (
          <div className="text-sm text-gray-600">
            {item.subscriptionData && (
              <>
                <span className="capitalize">{item.subscriptionData.plan} Plan</span>
                <span className="capitalize"> • {item.subscriptionData.billingCycle}</span>
                {item.subscriptionData.startDate && (
                  <div className="mt-1">Starts: {formatDate(item.subscriptionData.startDate)}</div>
                )}
              </>
            )}
          </div>
        );
      default:
        return item.description && (
          <div className="text-sm text-gray-600">{item.description}</div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order summary...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/account?tab=bookings')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Confirmation</h1>
              <p className="text-gray-600 mt-2">
                Order #{order.orderNumber} • {order.items.length} items
              </p>
            </div>
            <div className="text-right">
              <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <div className="text-sm text-gray-500 mt-1">
                {formatDate(order.createdAt?.toDate?.() || order.createdAt)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-green-700">
                    Thank you for your order. We&apos;ll process your items and keep you updated.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item, index) => (
                <div key={item.id}>
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
                          {getItemIcon(item.type)}
                        </div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getItemTypeLabel(item.type)}
                            </Badge>
                            <Badge className={`${getStatusColor(item.status)} text-xs`}>
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="mt-2">
                            {renderItemDetails(item)}
                          </div>
                          {item.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>Notes:</strong> {item.notes}
                            </div>
                          )}
                        </div>
                        
                        {/* Price */}
                        <div className="text-right ml-4">
                          <div className="font-semibold text-lg">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.price)} × {item.quantity}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
          
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 text-gray-500">@</span>
                <span>{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{order.customerPhone}</span>
              </div>
              {order.notes && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
              {order.specialRequests && (
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Special Requests:</h4>
                  <p className="text-gray-600">{order.specialRequests}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>{formatPrice(order.totalPrice)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Currency: {order.currency}
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              onClick={() => router.push('/account?tab=bookings')}
              className="flex-1"
            >
              View All Orders
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/search')}
              className="flex-1"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSummaryContent />
    </Suspense>
  );
}