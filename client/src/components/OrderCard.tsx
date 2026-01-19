import React, { useState, useEffect } from 'react';
import { Order } from '@/lib/data';
import { ChevronRight, Clock, CheckCircle2, XCircle, Wallet, Timer } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    if (!order.expireTime || (order.status !== 'unused' && order.status !== 'pending')) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expire = new Date(order.expireTime!).getTime();
      const diff = expire - now;

      if (diff <= 0) {
        setTimeLeft('已过期');
        setIsExpiring(false);
        return;
      }

      // 如果剩余时间小于24小时，显示倒计时
      if (diff < 24 * 60 * 60 * 1000) {
        setIsExpiring(true);
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setIsExpiring(false);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [order.expireTime, order.status]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: '待付款', color: 'text-[#FF9900]', icon: Wallet, bg: 'bg-[#FF9900]/10' };
      case 'unused':
        return { label: '待使用', color: 'text-[#FF4D4F]', icon: Clock, bg: 'bg-[#FF4D4F]/10' };
      case 'used':
        return { label: '已使用', color: 'text-muted-foreground', icon: CheckCircle2, bg: 'bg-muted' };
      case 'refunded':
        return { label: '已退款', color: 'text-muted-foreground', icon: XCircle, bg: 'bg-muted' };
      default:
        return { label: status, color: 'text-muted-foreground', icon: Clock, bg: 'bg-muted' };
    }
  };

  const statusConfig = getStatusConfig(order.status);

  return (
    <div 
      onClick={() => onClick(order)}
      className="bg-card rounded-xl p-4 shadow-sm border border-border/50 active:scale-[0.98] transition-all duration-200 relative overflow-hidden"
    >
      {/* Header: Shop Name & Status */}
      <div className="flex justify-between items-center mb-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-foreground truncate max-w-[180px]">
            {order.shopName}
          </h3>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <span className={`text-xs font-medium ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      {/* Content: Image & Deal Info */}
      <div className="flex gap-3">
        <img 
          src={order.shopImage} 
          alt={order.shopName} 
          className="w-20 h-20 rounded-lg object-cover flex-none bg-muted"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            <h4 className="text-sm font-medium text-foreground truncate mb-1">
              {order.dealTitle}
            </h4>
            <div className="text-xs text-muted-foreground">
              数量: x{order.quantity}
            </div>
          </div>
          
          {/* 倒计时提示条 (仅在即将过期时显示) */}
          {isExpiring && (
            <div className="flex items-center gap-1 text-[10px] text-[#FF4D4F] bg-[#FF4D4F]/5 px-2 py-0.5 rounded-full w-fit mt-1 animate-pulse">
              <Timer className="w-3 h-3" />
              <span>仅剩 {timeLeft} 过期</span>
            </div>
          )}

          <div className="flex justify-between items-end mt-2">
            <div className="text-xs text-muted-foreground">
              总价: <span className="text-foreground font-bold text-sm">¥{order.totalPrice}</span>
            </div>
            
            {/* Action Button based on status */}
            {order.status === 'pending' && (
              <button className="px-3 py-1.5 rounded-full bg-[#FF4D4F] text-white text-xs font-bold shadow-sm shadow-[#FF4D4F]/20">
                去支付
              </button>
            )}
            {order.status === 'unused' && (
              <button className="px-3 py-1.5 rounded-full border border-[#FF4D4F] text-[#FF4D4F] text-xs font-bold">
                查看券码
              </button>
            )}
            {order.status === 'used' && (
              <button className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-xs">
                写评价
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
