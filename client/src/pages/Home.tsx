import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Flame } from 'lucide-react';
import { categories, shops, type Shop, type Category, type SubCategory } from '@/lib/data';
import { MapOverlay } from '@/components/MapOverlay';
import { ShopSkeleton } from '@/components/ShopSkeleton';
import { 
  CoupleLeftIcon, CoupleRightIcon, 
  BestieLeftIcon, BestieRightIcon, 
  BroLeftIcon, BroRightIcon, 
  PassionLeftIcon, PassionRightIcon 
} from '@/components/CategoryIcons';

// 模拟加载延迟 Hook
function useDelayedLoading(dependency: any, delay = 500) {
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(timer);
  }, [dependency]);
  
  return loading;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [activeSubCategory, setActiveSubCategory] = useState<string>(categories[0].subCategories[0].id);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // 骨架屏加载状态
  const loading = useDelayedLoading(activeSubCategory);

  // 获取用户位置
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError("无法获取您的位置，已显示默认推荐");
        }
      );
    }
  }, []);

  // 过滤商家逻辑
  const filteredShops = shops.filter(shop => 
    shop.packageType === activeCategory && 
    shop.sceneTheme === activeSubCategory
  );

  // 处理二级菜单点击
  const handleSubCategoryClick = (categoryId: string, subId: string) => {
    setActiveCategory(categoryId);
    setActiveSubCategory(subId);
  };

  // 获取对应的装饰图标
  const getCategoryIcons = (categoryId: string) => {
    const className = "w-5 h-5 text-[#FF4D4F]"; // 统一使用品牌色
    
    switch (categoryId) {
      case 'couple':
        return { Left: <CoupleLeftIcon className={className} />, Right: <CoupleRightIcon className={className} /> };
      case 'bestie':
        return { Left: <BestieLeftIcon className={className} />, Right: <BestieRightIcon className={className} /> };
      case 'bro':
        return { Left: <BroLeftIcon className={className} />, Right: <BroRightIcon className={className} /> };
      case 'passion':
        return { Left: <PassionLeftIcon className={className} />, Right: <PassionRightIcon className={className} /> };
      default:
        return { Left: <CoupleLeftIcon className={className} />, Right: <CoupleRightIcon className={className} /> };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* 顶部导航栏 */}
      <header className="flex-none h-14 px-4 flex items-center justify-between bg-white border-b border-gray-100 z-20 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF4D4F] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">F</div>
          <span className="text-lg font-bold text-[#FF4D4F] tracking-tight">FIND ME</span>
        </div>
        
        <div className="flex-1 mx-4 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF4D4F] transition-colors" />
            <input 
              type="text" 
              placeholder="搜索商家、套餐..." 
              className="w-full h-9 pl-9 pr-4 bg-gray-50 rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF4D4F]/20 focus:bg-white transition-all border border-transparent focus:border-[#FF4D4F]/20"
            />
          </div>
        </div>

        <button 
          onClick={() => setShowMap(!showMap)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
            showMap 
              ? 'bg-[#FF4D4F] text-white shadow-md shadow-[#FF4D4F]/20' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MapIcon className="w-4 h-4" />
          {showMap ? '列表' : '地图'}
        </button>
      </header>

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden relative bg-[#F5F5F5]">
        
        {/* 左侧导航栏 - 高德扫街榜风格 */}
        <nav className="w-[100px] flex-none bg-white flex flex-col overflow-y-auto no-scrollbar pb-20">
          {categories.map((category) => {
            const icons = getCategoryIcons(category.id);
            
            return (
              <div key={category.id} className="flex flex-col mb-2">
                {/* 一级标题 (分组头) */}
                <div className="flex flex-col items-center justify-center py-4 relative">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="transform scale-75 opacity-80">{icons.Left}</div>
                    <div className="transform scale-75 opacity-80">{icons.Right}</div>
                  </div>
                  <span className="text-[13px] font-bold text-[#333333] tracking-wide">
                    {category.name.replace('套餐', '')}榜
                  </span>
                  <span className="text-[9px] text-[#999999] mt-0.5 scale-90">
                    {category.label}
                  </span>
                  
                  {/* 装饰线 */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gray-100" />
                </div>

                {/* 二级菜单 (平铺) */}
                <div className="flex flex-col w-full">
                  {category.subCategories.map((sub) => {
                    const isSubActive = activeSubCategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubCategoryClick(category.id, sub.id)}
                        className={`
                          relative w-full py-3 text-center transition-all duration-200
                          ${isSubActive ? 'bg-transparent' : 'bg-transparent'}
                        `}
                      >
                        <span className={`
                          text-[13px] transition-all duration-200 block
                          ${isSubActive 
                            ? 'text-[#FF4D4F] font-bold scale-105' 
                            : 'text-[#666666] font-medium'}
                        `}>
                          {sub.name}
                        </span>
                        {isSubActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FF4D4F] rounded-r-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col relative w-full min-w-0 px-3 pt-3">
          
          {/* 顶部筛选栏 */}
          <div className="flex-none mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-white rounded-full text-xs font-bold text-[#333333] shadow-sm flex items-center gap-1">
                全城 <ChevronDown className="w-3 h-3" />
              </button>
              <div className="h-4 w-[1px] bg-gray-300 mx-1" />
              <span className="text-xs font-bold text-[#333333]">状元榜</span>
            </div>
            <div className="flex gap-2">
              <span className="text-xs text-[#2A82E4] font-bold flex items-center gap-0.5">
                综合评分 4.7 <ChevronUp className="w-3 h-3 rotate-90" />
              </span>
            </div>
          </div>

          {/* 商家列表 */}
          <div className="flex-1 overflow-y-auto pb-20 scroll-smooth no-scrollbar">
            {loading ? (
              // 骨架屏加载状态
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-xl h-64 w-full" />
                ))}
              </div>
            ) : (
              // 真实数据列表
              <div className="space-y-3">
                {filteredShops.map((shop) => (
                  <div key={shop.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    {/* 图片区域 (大图) */}
                    <div className="relative h-48 w-full bg-gray-100">
                      <img 
                        src={shop.imageUrl} 
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <button className="w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white">
                          <Star className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="p-3">
                      {/* 热度与评分行 */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-[#2A82E4] fill-[#2A82E4]" />
                          <span className="text-xs font-bold text-[#2A82E4]">全年热度值 {shop.heat || 90}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#2A82E4]">
                          <span className="text-xs font-medium">综合评分</span>
                          <span className="text-lg font-bold leading-none">{shop.rating}</span>
                          <ChevronUp className="w-3 h-3 rotate-90" />
                        </div>
                      </div>

                      {/* 店名 */}
                      <h3 className="text-lg font-bold text-[#333333] mb-1 truncate">{shop.name}</h3>

                      {/* 基础信息行 */}
                      <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
                        <span>{shop.tags[0]}</span>
                        <span className="w-[1px] h-2.5 bg-gray-300" />
                        <span>¥{shop.price}/人</span>
                        <span className="w-[1px] h-2.5 bg-gray-300" />
                        <span>{shop.distance}</span>
                      </div>

                      {/* 标签行 */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {shop.tags.slice(1).map((tag, idx) => (
                          <span key={idx} className="text-[10px] text-[#856138] bg-[#FFF8F0] px-1.5 py-0.5 rounded-[4px]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* 底部点评/套餐 (橙色风格) */}
                      {shop.deals && shop.deals.length > 0 && (
                        <div className="flex items-start gap-2 pt-3 border-t border-gray-50">
                          <div className="flex-none mt-0.5">
                            <span className="text-[10px] font-bold text-[#FF6B22] border border-[#FF6B22] px-1 rounded-[4px]">
                              团
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#333333] truncate mb-0.5">
                              {shop.deals[0].title}
                            </p>
                            <p className="text-[11px] text-[#999999] line-clamp-1">
                              "{shop.description}"
                            </p>
                          </div>
                          <div className="flex-none text-right">
                            <span className="text-sm font-bold text-[#FF4D4F]">¥{shop.deals[0].price}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* 底部提示 */}
                <div className="py-6 text-center">
                  <p className="text-xs text-gray-400">已经到底啦，去其他分类看看吧 ~</p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 地图覆盖层 */}
        {showMap && (
          <MapOverlay 
            shops={filteredShops} 
            onClose={() => setShowMap(false)} 
            userLocation={userLocation}
            activeCategory={activeCategory}
            activeScene={activeSubCategory}
            onSceneChange={(subId) => handleSubCategoryClick(activeCategory, subId)}
          />
        )}
      </div>
    </div>
  );
}
