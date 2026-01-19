import React from 'react';
import { Order } from '@/lib/data';
import { ArrowLeft, MapPin, Phone, Copy, QrCode, Info } from 'lucide-react';

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

export function OrderDetail({ order, onBack }: OrderDetailProps) {
  return (
    <div className="flex flex-col h-full bg-muted/30 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex-none px-4 py-3 flex items-center gap-3 border-b border-border bg-background sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-lg font-bold text-foreground">订单详情</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Status Banner */}
        <div className="bg-[#FF4D4F] text-white rounded-xl p-6 shadow-lg shadow-[#FF4D4F]/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">
              {order.status === 'unused' ? '待使用' : 
               order.status === 'used' ? '已使用' : 
               order.status === 'pending' ? '待付款' : '已退款'}
            </h2>
            <p className="text-white/80 text-sm">
              {order.status === 'unused' ? '请向商家出示二维码或券码' : 
               order.status === 'used' ? '感谢您的光临，期待再次相遇' : 
               order.status === 'pending' ? '请在15分钟内完成支付' : '退款已原路返回'}
            </p>
          </div>
          <QrCode className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
        </div>

        {/* Verification Code Section (Only for unused/used) */}
        {(order.status === 'unused' || order.status === 'used') && (
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border flex flex-col items-center text-center">
            <h3 className="text-sm text-muted-foreground mb-4">
              {order.status === 'unused' ? '向商家出示二维码核销' : '该券码已核销'}
            </h3>
            
            {/* QR Code Mock */}
            <div className={`
              w-48 h-48 bg-white p-2 rounded-xl border-2 border-dashed mb-6
              ${order.status === 'used' ? 'opacity-50 grayscale' : 'border-[#FF4D4F]/30'}
            `}>
              <img 
                src={order.qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${order.id}`} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Numeric Code */}
            <div className="w-full bg-muted/50 rounded-lg p-4 flex items-center justify-between">
              <div className="text-left">
                <div className="text-xs text-muted-foreground mb-1">券码</div>
                <div className={`text-xl font-mono font-bold tracking-wider ${order.status === 'used' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {order.verifyCode || '8829 1034'}
                </div>
              </div>
              <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Shop Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-foreground">{order.shopName}</h3>
            <button className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" /> 联系商家
            </button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-none" />
            <div className="text-sm text-muted-foreground">
              上海市黄浦区南京东路888号 (距您500m)
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              查看地图
            </button>
            <button className="flex-1 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              拨打电话
            </button>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-3">
          <h3 className="font-bold text-foreground border-b border-border/50 pb-2">订单信息</h3>
          
          <div className="flex gap-3 py-2">
            <img src={order.shopImage} className="w-16 h-16 rounded-lg object-cover bg-muted" alt="item" />
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground mb-1">{order.dealTitle}</div>
              <div className="text-xs text-muted-foreground">单价: ¥{order.price}</div>
              <div className="text-xs text-muted-foreground">数量: x{order.quantity}</div>
            </div>
            <div className="text-sm font-bold text-foreground">¥{order.totalPrice}</div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border/50 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">订单编号</span>
              <span className="font-mono text-foreground">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">下单时间</span>
              <span className="text-foreground">{order.createTime}</span>
            </div>
            {order.payTime && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付时间</span>
                <span className="text-foreground">{order.payTime}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-foreground font-bold">实付金额</span>
              <span className="text-lg font-bold text-[#FF4D4F]">¥{order.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Help */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground py-4">
          <Info className="w-3 h-3" />
          <span>对此订单有疑问？联系客服</span>
        </div>
      </div>
    </div>
  );
}
