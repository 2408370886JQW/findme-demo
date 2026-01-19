import React, { useState } from 'react';
import { Order, MOCK_ORDERS, OrderStatus } from '@/lib/data';
import { OrderCard } from './OrderCard';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

interface OrderListProps {
  onBack: () => void;
  onOrderClick: (order: Order) => void;
}

type FilterType = 'all' | OrderStatus;

export function OrderList({ onBack, onOrderClick }: OrderListProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: '全部' },
    { id: 'pending', label: '待付款' },
    { id: 'unused', label: '待使用' },
    { id: 'used', label: '已使用' },
    { id: 'refunded', label: '退款/售后' },
  ];

  const filteredOrders = activeFilter === 'all' 
    ? MOCK_ORDERS 
    : MOCK_ORDERS.filter(order => order.status === activeFilter);

  return (
    <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex-none px-4 py-3 flex items-center gap-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">我的订单</h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex-none px-4 py-2 border-b border-border/50 overflow-x-auto no-scrollbar bg-background">
        <div className="flex gap-4 min-w-max">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`
                relative py-2 text-sm font-medium transition-colors
                ${activeFilter === filter.id ? 'text-[#FF4D4F]' : 'text-muted-foreground'}
              `}
            >
              {filter.label}
              {activeFilter === filter.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#FF4D4F] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/30">
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onClick={onOrderClick} 
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-sm">暂无相关订单</p>
          </div>
        )}
      </div>
    </div>
  );
}
