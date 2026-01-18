import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Flame, Quote } from 'lucide-react';
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

  // 获取对应的装饰图标 - 调整为更淡雅的麦穗风格
  const getCategoryIcons = (categoryId: string) => {
    // 默认淡灰色，选中时淡红色
    const className = "w-5 h-5 text-[#E5E5E5]"; 
    const activeClassName = "w-5 h-5 text-[#FFD1D1]"; 
    
    return { 
      Left: <CoupleLeftIcon className={categoryId === activeCategory ? activeClassName : className} />, 
      Right: <CoupleRightIcon className={categoryId === activeCategory ? activeClassName : className} /> 
    };
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5] overflow-hidden font-sans">
      {/* 顶部导航栏 */}
      <header className="flex-none h-12 px-4 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-1">
          <span className="text-base font-bold text-[#333333]">北京市</span>
          <ChevronDown className="w-4 h-4 text-[#333333]" />
        </div>
        
        <div className="flex-1 text-center">
          <span className="text-lg font-bold text-[#333333]">高德扫街榜 <span className="text-[#FF6B22]">2026</span></span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#333333] rounded-md flex items-center justify-center">
            <div className="w-2 h-2 border-t-2 border-r-2 border-[#333333] transform -rotate-45 mt-0.5"></div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
            <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
            <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
          </div>
        </div>
      </header>

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 左侧导航栏 - 严格还原截图布局 */}
        <nav className="w-[120px] flex-none bg-white flex flex-col overflow-y-auto no-scrollbar pb-20 border-r border-gray-100">
          {/* 顶部 "附近" 下拉 */}
          <div className="flex items-center justify-center py-4">
            <span className="text-lg font-bold text-[#666666]">附近</span>
            <ChevronDown className="w-4 h-4 text-[#666666] ml-1" />
          </div>

          {categories.map((category, index) => {
            const icons = getCategoryIcons(category.id);
            const isActive = activeCategory === category.id;
            
            return (
              <div key={category.id} className="flex flex-col w-full mb-2 shrink-0">
                {/* 一级标题 (分组头) */}
                <div className="flex flex-col items-center justify-center w-full px-1">
                  
                  {/* 第一行：淡色麦穗 + 标题 */}
                  <div className="flex items-center justify-center gap-0.5 w-full whitespace-nowrap">
                    <div className="transform scale-90 flex-none opacity-60">{icons.Left}</div>
                    <span className={`
                      text-[16px] font-bold tracking-wide whitespace-nowrap flex-none
                      ${isActive ? 'text-[#FF4D4F]' : 'text-[#666666]'}
                    `}>
                      {category.name.replace('套餐', '')}榜
                    </span>
                    <div className="transform scale-90 flex-none opacity-60">{icons.Right}</div>
                  </div>
                  
                  {/* 第二行：胶囊副标题 */}
                  <div className="mt-1 mb-3">
                    <span className={`
                      text-[10px] px-2 py-0.5 rounded-full font-medium transform scale-90 block
                      ${isActive 
                        ? 'bg-[#FF4D4F] text-white' 
                        : 'bg-[#F5F5F5] text-[#999999]'}
                    `}>
                      {category.label}
                    </span>
                  </div>

                  {/* 分隔线 */}
                  <div className="w-8 h-[1px] bg-gray-200 mb-4"></div>
                </div>

                {/* 二级菜单 (平铺列表) - 字体调小至13px */}
                <div className="flex flex-col w-full gap-3 mb-6">
                  {category.subCategories.map((sub) => {
                    const isSubActive = activeSubCategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSubCategoryClick(category.id, sub.id)}
                        className="w-full text-center transition-all duration-200 px-1"
                      >
                        <span className={`
                          text-[13px] transition-all duration-200 block leading-tight whitespace-nowrap
                          ${isSubActive 
                            ? 'text-[#333333] font-bold' 
                            : 'text-[#666666] font-medium'}
                        `}>
                          {sub.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col relative w-full min-w-0 px-3 pt-3 bg-[#F5F5F5]">
          
          {/* 顶部筛选栏 (胶囊按钮) */}
          <div className="flex-none mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button className="flex-none px-3 py-1.5 bg-white rounded-lg text-xs font-bold text-[#333333] shadow-sm flex items-center gap-1">
              全城 <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex-none px-3 py-1.5 bg-[#FFF0E5] text-[#FF6B22] rounded-lg text-xs font-bold">
              评分优先 <ChevronDown className="w-3 h-3 inline ml-0.5" />
            </button>
            <button className="flex-none px-3 py-1.5 bg-[#FF4D4F] text-white rounded-lg text-xs font-bold shadow-sm shadow-[#FF4D4F]/20">
              必吃美食
            </button>
            <button className="flex-none px-3 py-1.5 bg-white text-[#666666] rounded-lg text-xs font-medium">
              极致甄选
            </button>
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
                  <div key={shop.id} className="bg-white rounded-xl overflow-hidden shadow-sm p-3">
                    {/* 图片区域 (大图) */}
                    <div className="relative h-40 w-full rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <img 
                        src={shop.imageUrl} 
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <div className="flex items-center gap-0.5 text-white text-xs font-medium drop-shadow-md">
                          <Star className="w-3 h-3 fill-white" />
                          <span>3.1w+</span>
                        </div>
                      </div>
                    </div>

                    {/* 热度与评分行 (紧贴图片下方) */}
                    <div className="flex items-center justify-between mb-2 px-1">
                      <div className="flex items-center gap-1">
                        <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#2A82E4]"></div>
                        <span className="text-xs font-bold text-[#2A82E4]">全年热度值 {shop.heat || 97.8}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#2A82E4]">
                        <span className="text-xs font-medium">综合评分</span>
                        <span className="text-lg font-bold leading-none">{shop.rating}</span>
                        <ChevronUp className="w-3 h-3 rotate-90" />
                      </div>
                    </div>

                    {/* 店名 */}
                    <h3 className="text-[17px] font-bold text-[#333333] mb-1 truncate leading-tight">{shop.name}</h3>

                    {/* 基础信息行 */}
                    <div className="flex items-center gap-2 text-xs text-[#666666] mb-2">
                      <span>{shop.tags[0]}</span>
                      <span>¥{shop.price}/人</span>
                      <span>{shop.distance}</span>
                    </div>

                    {/* 标签行 (状元榜徽章) */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <div className="flex items-center bg-[#FFF8F0] rounded-[4px] overflow-hidden border border-[#F5E6D6]">
                        <span className="bg-[#333333] text-[#F5E6D6] text-[10px] font-bold px-1 py-0.5">状元榜</span>
                        <span className="text-[#8B6E4E] text-[10px] px-1.5 py-0.5">2026上榜餐厅</span>
                      </div>
                      {shop.tags.slice(1).map((tag, idx) => (
                        <span key={idx} className="text-[10px] text-[#666666] bg-gray-50 px-1.5 py-0.5 rounded-[4px] border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* 底部点评/推荐语 (引用样式) */}
                    <div className="relative bg-[#FFFBF5] rounded-lg p-2.5 mt-1">
                      <Quote className="absolute top-2 left-2 w-3 h-3 text-[#E6CBA8] fill-[#E6CBA8] transform rotate-180" />
                      <p className="text-xs text-[#8B572A] leading-relaxed pl-4 line-clamp-2 font-medium">
                        {shop.description} <span className="text-[#999999] font-normal ml-1">1655人也在说 &gt;</span>
                      </p>
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
