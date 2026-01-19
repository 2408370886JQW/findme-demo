import React, { useEffect, useRef } from 'react';
import { MOCK_ORDERS } from '@/lib/data';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

export function NotificationManager() {
  const notifiedOrders = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 请求通知权限
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const checkExpiringOrders = () => {
      const now = new Date().getTime();
      const threeHours = 3 * 60 * 60 * 1000;

      MOCK_ORDERS.forEach(order => {
        if (order.status !== 'unused' || !order.expireTime) return;

        const expireTime = new Date(order.expireTime).getTime();
        const diff = expireTime - now;

        // 如果剩余时间小于3小时且未通知过
        if (diff > 0 && diff <= threeHours && !notifiedOrders.current.has(order.id)) {
          // 1. 触发 Web Notification (系统级推送)
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('FIND ME 订单提醒', {
              body: `您的订单【${order.shopName}】即将过期，请尽快使用！`,
              icon: '/vite.svg', // 使用默认图标
              tag: order.id
            });
          }

          // 2. 触发应用内 Toast (模拟短信)
          toast.custom((t) => (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg p-4 flex gap-3 w-full max-w-md animate-in slide-in-from-top-2 duration-300">
              <div className="bg-[#FF4D4F]/10 p-2 rounded-full h-fit">
                <Bell className="w-5 h-5 text-[#FF4D4F]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">【FIND ME】温馨提示</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  您的订单 <span className="font-bold text-foreground">{order.dealTitle}</span> 还有不到3小时过期，请及时到店核销，以免造成损失。
                </p>
                <div className="mt-2 text-[10px] text-muted-foreground/50">
                  刚刚
                </div>
              </div>
            </div>
          ), { duration: 5000, position: 'top-center' });

          // 标记为已通知
          notifiedOrders.current.add(order.id);
        }
      });
    };

    // 立即检查一次
    checkExpiringOrders();

    // 每分钟检查一次
    const interval = setInterval(checkExpiringOrders, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null; // 此组件不渲染任何可见 UI
}
