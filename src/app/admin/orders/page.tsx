'use client';

import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Phone, 
  Mail, 
  Clock, 
  User, 
  DollarSign, 
  CheckCircle, 
  RefreshCw,
  FileText,
  Plus} from 'lucide-react'
import { toast } from 'sonner'
import { createOrderForCustomer, OrderData, Order } from '@/lib/orderService'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

// User roles and permissions
type UserRole = 'admin' | 'customer_service' | 'telesale' | 'operation' | 'customer'

interface RolePermissions {
  canViewAll: boolean
  canEdit: boolean
  canDelete: boolean
  canAssign: boolean
  canViewFinancials: boolean
  canManageStatus: boolean
  canContactCustomer: boolean
  canViewReports: boolean
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canViewAll: true,
    canEdit: true,
    canDelete: true,
    canAssign: true,
    canViewFinancials: true,
    canManageStatus: true,
    canContactCustomer: true,
    canViewReports: true
  },
  customer_service: {
    canViewAll: true,
    canEdit: true,
    canDelete: false,
    canAssign: false,
    canViewFinancials: false,
    canManageStatus: true,
    canContactCustomer: true,
    canViewReports: false
  },
  telesale: {
    canViewAll: false,
    canEdit: true,
    canDelete: false,
    canAssign: false,
    canViewFinancials: true,
    canManageStatus: true,
    canContactCustomer: true,
    canViewReports: true
  },
  operation: {
    canViewAll: true,
    canEdit: true,
    canDelete: false,
    canAssign: true,
    canViewFinancials: false,
    canManageStatus: true,
    canContactCustomer: false,
    canViewReports: true
  },
  customer: {
    canViewAll: false,
    canEdit: false,
    canDelete: false,
    canAssign: false,
    canViewFinancials: false,
    canManageStatus: false,
    canContactCustomer: false,
    canViewReports: false
  }
}



// Mock orders data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    customerId: 'customer-uid-001', // Mock customer Firebase UID
    customerName: 'Nguyen Van A',
    customerEmail: 'nguyenvana@email.com',
    customerPhone: '+84 901 234 567',
    vehicleName: 'VinFast VF 8',
    vehicleType: 'Electric SUV',
    vehicleProvider: 'VinFast',
    vehicleImages: ['https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'],
    dealerName: 'VinFast Smart Hub Central',
    dealerAddress: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    pickupDate: new Date('2024-02-15'),
    returnDate: new Date('2024-02-18'),
    pickupLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    returnLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    totalPrice: 2400000,
    status: 'confirmed',
    paymentStatus: 'paid',
    createdAt: { toDate: () => new Date('2024-01-20T10:30:00Z') },
    updatedAt: { toDate: () => new Date('2024-01-20T14:15:00Z') },
    assignedTo: 'John Doe',
    notes: 'Customer requested early pickup',
    priority: 'medium',
    source: 'website',
    createdBy: 'admin-uid-001',
    createdByRole: 'admin'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    customerId: 'customer-uid-002', // Mock customer Firebase UID
    customerName: 'Tran Thi B',
    customerEmail: 'tranthib@email.com',
    customerPhone: '+84 902 345 678',
    vehicleName: 'Toyota Camry',
    vehicleType: 'Sedan',
    vehicleProvider: 'Toyota',
    vehicleImages: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    dealerName: 'Premium Car Rental',
    dealerAddress: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    pickupDate: new Date('2024-02-20'),
    returnDate: new Date('2024-02-25'),
    pickupLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    returnLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    totalPrice: 3500000,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: { toDate: () => new Date('2024-01-21T09:15:00Z') },
    updatedAt: { toDate: () => new Date('2024-01-21T09:15:00Z') },
    notes: 'Urgent - Corporate client',
    priority: 'high',
    source: 'phone',
    createdBy: 'admin-uid-002',
    createdByRole: 'admin'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    customerId: 'customer-uid-003', // Mock customer Firebase UID
    customerName: 'Le Van C',
    customerEmail: 'levanc@email.com',
    customerPhone: '+84 903 456 789',
    vehicleName: 'Honda CR-V',
    vehicleType: 'SUV',
    vehicleProvider: 'Honda',
    vehicleImages: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    dealerName: 'City Car Rental',
    dealerAddress: '456 Le Loi Street, District 3, Ho Chi Minh City',
    pickupDate: new Date('2024-02-10'),
    returnDate: new Date('2024-02-12'),
    pickupLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    returnLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    totalPrice: 1800000,
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: { toDate: () => new Date('2024-01-18T16:45:00Z') },
    updatedAt: { toDate: () => new Date('2024-01-22T11:30:00Z') },
    assignedTo: 'Jane Smith',
    notes: 'Smooth transaction, customer satisfied',
    priority: 'low',
    source: 'website',
    createdBy: 'admin-uid-003',
    createdByRole: 'admin'
  }
]

export default function OrderManagementPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(mockOrders)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Order>>({})
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false)
  const [createOrderForm, setCreateOrderForm] = useState<Partial<OrderData>>({})
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)
  
  // Get user role from authentication context
  const userRole: UserRole = userProfile?.role || 'customer'
  const permissions = rolePermissions[userRole]

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
  }, [user, router])

  useEffect(() => {
    let filtered = orders

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vehicleName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(order => order.priority === priorityFilter)
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter(order => order.source === sourceFilter)
    }

    // Role-based filtering
    if (userRole === 'telesale') {
      // Telesale can only see orders from phone/email sources
      filtered = filtered.filter(order => order.source === 'phone' || order.source === 'email')
    } else if (userRole === 'customer') {
      // Customers can only see their own orders
      filtered = filtered.filter(order => order.customerId === user?.uid)
    }
    // Admin and other staff roles can see all orders (for supporting external customers)

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter, priorityFilter, sourceFilter, userRole])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'paid': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'refunded': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleEditOrder = (order: Order) => {
    if (!permissions.canEdit) {
      toast.error('You do not have permission to edit orders')
      return
    }
    setSelectedOrder(order)
    setEditForm(order)
    setIsEditModalOpen(true)
  }

  const handleUpdateOrder = () => {
    if (!selectedOrder || !permissions.canEdit) return

    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id 
        ? { ...order, ...editForm, updatedAt: new Date().toISOString() }
        : order
    )
    setOrders(updatedOrders)
    setIsEditModalOpen(false)
    toast.success('Order updated successfully')
  }

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (!permissions.canManageStatus) {
      toast.error('You do not have permission to change order status')
      return
    }

    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    )
    setOrders(updatedOrders)
    toast.success('Order status updated successfully')
  }

  const handleAssignOrder = (orderId: string, assignee: string) => {
    if (!permissions.canAssign) {
      toast.error('You do not have permission to assign orders')
      return
    }

    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, assignedTo: assignee, updatedAt: new Date().toISOString() }
        : order
    )
    setOrders(updatedOrders)
    toast.success('Order assigned successfully')
  }

  const handleContactCustomer = (order: Order, method: 'phone' | 'email') => {
    if (!permissions.canContactCustomer) {
      toast.error('You do not have permission to contact customers')
      return
    }

    if (method === 'phone') {
      window.open(`tel:${order.customerPhone}`)
    } else {
      window.open(`mailto:${order.customerEmail}?subject=Regarding Order ${order.orderNumber}`)
    }
  }

  const exportOrders = () => {
    if (!permissions.canViewReports) {
      toast.error('You do not have permission to export data')
      return
    }

    // In a real app, this would generate and download a CSV/Excel file
    toast.success('Export functionality would be implemented here')
  }

  const handleCreateOrder = async () => {
    if (!createOrderForm.customerEmail || !createOrderForm.customerName || !createOrderForm.customerPhone ||
        !createOrderForm.vehicleName || !createOrderForm.dealerName || !createOrderForm.pickupDate ||
        !createOrderForm.returnDate || !createOrderForm.totalPrice) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsSubmittingOrder(true)
    try {
      const orderData: OrderData = {
        customerEmail: createOrderForm.customerEmail,
        customerName: createOrderForm.customerName,
        customerPhone: createOrderForm.customerPhone,
        vehicleName: createOrderForm.vehicleName,
        vehicleType: createOrderForm.vehicleType || 'Not specified',
        dealerName: createOrderForm.dealerName,
        dealerAddress: createOrderForm.dealerAddress || 'Not specified',
        pickupDate: createOrderForm.pickupDate ? new Date(createOrderForm.pickupDate) : new Date(),
        returnDate: createOrderForm.returnDate ? new Date(createOrderForm.returnDate) : undefined,
        pickupLocation: createOrderForm.pickupLocation || 'Pickup location not specified',
         returnLocation: createOrderForm.returnLocation || 'Return location not specified',
        totalPrice: createOrderForm.totalPrice,
        notes: createOrderForm.notes || ''
      }

      const newOrder = await createOrderForCustomer(orderData, user!)
      
      // Add the new order to the local state
      const orderForDisplay: Order = {
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerId: newOrder.customerId,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        vehicleName: newOrder.vehicleName,
        vehicleType: newOrder.vehicleType,
        vehicleProvider: newOrder.vehicleProvider,
        dealerName: newOrder.dealerName,
        dealerAddress: newOrder.dealerAddress,
        pickupDate: newOrder.pickupDate,
        returnDate: newOrder.returnDate,
        pickupLocation: newOrder.pickupLocation,
        returnLocation: newOrder.returnLocation,
        totalPrice: newOrder.totalPrice,
        status: newOrder.status,
        paymentStatus: newOrder.paymentStatus,
        createdAt: newOrder.createdAt,
        updatedAt: newOrder.updatedAt,
        notes: newOrder.notes || '',
        priority: newOrder.priority,
        source: newOrder.source,
        createdBy: newOrder.createdBy,
        createdByRole: newOrder.createdByRole,
        assignedTo: newOrder.assignedTo
      }
      
      setOrders(prev => [orderForDisplay, ...prev])
      setIsCreateOrderModalOpen(false)
      setCreateOrderForm({})
      toast.success(`Order ${newOrder.orderNumber} created successfully!`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to create order. Please try again.')
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userRole === 'customer' ? 'My Bookings' : 'Order Management'}
              </h1>
              <p className="text-gray-600 mt-2">
                {userRole === 'customer' 
                  ? 'View and track your rental bookings' 
                  : 'Manage and track all rental orders'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Role: {userRole.replace('_', ' ').toUpperCase()}
              </Badge>
              {(['admin', 'telesale', 'customer_service'].includes(userRole)) && (
                <Button onClick={() => setIsCreateOrderModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              )}
              {permissions.canViewReports && (
                <Button onClick={exportOrders} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredOrders.filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>
          
          {permissions.canViewFinancials && (
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0))}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className={`grid grid-cols-1 gap-4 ${
            userRole === 'customer' ? 'md:grid-cols-3' : 'md:grid-cols-5'
          }`}>
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder={userRole === 'customer' ? 'Search your bookings...' : 'Search orders...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {userRole !== 'customer' && (
              <div>
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {userRole !== 'customer' && (
              <div>
                <Label>Source</Label>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="walk_in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('')
                  setStatusFilter('all')
                  if (userRole !== 'customer') {
                    setPriorityFilter('all')
                    setSourceFilter('all')
                  }
                }}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Orders Table */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  {userRole !== 'customer' && <TableHead>Customer</TableHead>}
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  {userRole !== 'customer' && <TableHead>Priority</TableHead>}
                  {permissions.canViewFinancials && <TableHead>Amount</TableHead>}
                  {userRole !== 'customer' && <TableHead>Assigned To</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p>{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </TableCell>
                    {userRole !== 'customer' && (
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-gray-500">{order.customerEmail}</p>
                          <p className="text-sm text-gray-500">{order.customerPhone}</p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.vehicleName}</p>
                        <p className="text-sm text-gray-500">{order.vehicleType}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{formatDate(order.pickupDate)}</p>
                        <p className="text-sm text-gray-500">to {formatDate(order.returnDate)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    {userRole !== 'customer' && (
                      <TableCell>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </TableCell>
                    )}
                    {permissions.canViewFinancials && (
                      <TableCell className="font-medium">
                        {formatPrice(order.totalPrice)}
                      </TableCell>
                    )}
                    {userRole !== 'customer' && (
                      <TableCell>
                        {order.assignedTo ? (
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{order.assignedTo}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {permissions.canEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {permissions.canContactCustomer && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContactCustomer(order, 'phone')}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleContactCustomer(order, 'email')}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Order Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>
                Complete information about this rental order
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm font-medium">{selectedOrder.customerName}</p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium">{selectedOrder.customerEmail}</p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Vehicle Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Vehicle Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vehicle</Label>
                      <p className="text-sm font-medium">{selectedOrder.vehicleName}</p>
                    </div>
                    <div>
                      <Label>Type</Label>
                      <p className="text-sm font-medium">{selectedOrder.vehicleType}</p>
                    </div>
                    <div>
                      <Label>Dealer</Label>
                      <p className="text-sm font-medium">{selectedOrder.dealerName}</p>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <p className="text-sm font-medium">{selectedOrder.dealerAddress}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Rental Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rental Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Pickup Date</Label>
                      <p className="text-sm font-medium">{formatDate(selectedOrder.pickupDate)}</p>
                    </div>
                    <div>
                      <Label>Return Date</Label>
                      <p className="text-sm font-medium">{formatDate(selectedOrder.returnDate)}</p>
                    </div>
                    {permissions.canViewFinancials && (
                      <div>
                        <Label>Total Price</Label>
                        <p className="text-sm font-medium">{formatPrice(selectedOrder.totalPrice)}</p>
                      </div>
                    )}
                    <div>
                      <Label>Source</Label>
                      <p className="text-sm font-medium">{selectedOrder.source}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Order Status */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Status</Label>
                      <div className="mt-1">
                        {permissions.canManageStatus ? (
                          <Select 
                            value={selectedOrder.status} 
                            onValueChange={(value) => handleStatusChange(selectedOrder.id, value as Order['status'])}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="in_progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="refunded">Refunded</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge className={getStatusColor(selectedOrder.status)}>
                            {selectedOrder.status.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <div className="mt-1">
                        <Badge className={getPriorityColor(selectedOrder.priority)}>
                          {selectedOrder.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label>Payment Status</Label>
                      <div className="mt-1">
                        <Badge className={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                {permissions.canAssign && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Assignment</h3>
                      <div>
                        <Label>Assigned To</Label>
                        <Select 
                          value={selectedOrder.assignedTo || ''} 
                          onValueChange={(value) => handleAssignOrder(selectedOrder.id, value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Unassigned</SelectItem>
                            <SelectItem value="John Doe">John Doe</SelectItem>
                            <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                            <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {/* Notes */}
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
                    {selectedOrder.notes || 'No notes available'}
                  </p>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Timestamps</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Created At</Label>
                      <p className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <Label>Last Updated</Label>
                      <p className="text-sm font-medium">{formatDate(selectedOrder.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Order Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Order - {selectedOrder?.orderNumber}</DialogTitle>
              <DialogDescription>
                Update order information and settings
              </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select 
                      value={editForm.status || selectedOrder.status} 
                      onValueChange={(value) => setEditForm({...editForm, status: value as Order['status']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select 
                      value={editForm.priority || selectedOrder.priority} 
                      onValueChange={(value) => setEditForm({...editForm, priority: value as Order['priority']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {permissions.canAssign && (
                  <div>
                    <Label htmlFor="edit-assigned">Assigned To</Label>
                    <Select 
                      value={editForm.assignedTo || selectedOrder.assignedTo || ''} 
                      onValueChange={(value) => setEditForm({...editForm, assignedTo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                        <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="edit-notes">Notes</Label>
                  <Textarea
                    id="edit-notes"
                    value={editForm.notes || selectedOrder.notes}
                    onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    placeholder="Add notes about this order..."
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateOrder}>
                    Update Order
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create Order Modal */}
        <Dialog open={isCreateOrderModalOpen} onOpenChange={setIsCreateOrderModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Create a new order for a customer (as {userRole})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      value={createOrderForm.customerName || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, customerName: e.target.value})}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customer-email">Email *</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={createOrderForm.customerEmail || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, customerEmail: e.target.value})}
                      placeholder="customer@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone Number *</Label>
                  <Input
                    id="customer-phone"
                    value={createOrderForm.customerPhone || ''}
                    onChange={(e) => setCreateOrderForm({...createOrderForm, customerPhone: e.target.value})}
                    placeholder="+84 xxx xxx xxx"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vehicle Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicle-name">Vehicle Name *</Label>
                    <Input
                      id="vehicle-name"
                      value={createOrderForm.vehicleName || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, vehicleName: e.target.value})}
                      placeholder="e.g., Toyota Camry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Input
                      id="vehicle-type"
                      value={createOrderForm.vehicleType || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, vehicleType: e.target.value})}
                      placeholder="e.g., Sedan, SUV"
                    />
                  </div>
                </div>
              </div>

              {/* Dealer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Dealer Information</h3>
                <div>
                  <Label htmlFor="dealer-name">Dealer Name *</Label>
                  <Input
                    id="dealer-name"
                    value={createOrderForm.dealerName || ''}
                    onChange={(e) => setCreateOrderForm({...createOrderForm, dealerName: e.target.value})}
                    placeholder="Enter dealer name"
                  />
                </div>
                <div>
                  <Label htmlFor="dealer-address">Dealer Address</Label>
                  <Input
                    id="dealer-address"
                    value={createOrderForm.dealerAddress || ''}
                    onChange={(e) => setCreateOrderForm({...createOrderForm, dealerAddress: e.target.value})}
                    placeholder="Enter dealer address"
                  />
                </div>
              </div>

              {/* Rental Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Rental Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pickup-date">Pickup Date *</Label>
                    <Input
                      id="pickup-date"
                      type="date"
                      value={formatDate(createOrderForm.pickupDate) || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, pickupDate: new Date(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="return-date">Return Date *</Label>
                    <Input
                      id="return-date"
                      type="date"
                      value={formatDate(createOrderForm.returnDate) || ''}
                      onChange={(e) => setCreateOrderForm({...createOrderForm, returnDate: new Date(e.target.value)})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="total-price">Total Price (VND) *</Label>
                  <Input
                    id="total-price"
                    type="number"
                    value={createOrderForm.totalPrice || ''}
                    onChange={(e) => setCreateOrderForm({...createOrderForm, totalPrice: Number(e.target.value)})}
                    placeholder="Enter total price"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="order-notes">Notes</Label>
                <Textarea
                  id="order-notes"
                  value={createOrderForm.notes || ''}
                  onChange={(e) => setCreateOrderForm({...createOrderForm, notes: e.target.value})}
                  placeholder="Add any additional notes..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateOrderModalOpen(false)
                    setCreateOrderForm({})
                  }}
                  disabled={isSubmittingOrder}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateOrder}
                  disabled={isSubmittingOrder}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmittingOrder ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}