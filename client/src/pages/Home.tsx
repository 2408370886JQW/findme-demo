import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate } from 'lucide-react';
import { categories, shops, type Shop, type Category, type SubCategory } from '@/lib/data';
import { MapOverlay } from '@/components/MapOverlay';
import { ShopSkeleton } from '@/components/ShopSkeleton';

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

  // 处理一级菜单点击
  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    // 默认选中第一个子分类
    const category = categories.find(c => c.id === categoryId);
    if (category && category.subCategories.length > 0) {
      setActiveSubCategory(category.subCategories[0].id);
    }
  };

  // 处理二级菜单点击
  const handleSubCategoryClick = (subId: string) => {
    setActiveSubCategory(subId);
  };

  // 获取当前选中的一级分类对象
  const currentCategory = categories.find(c => c.id === activeCategory);

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
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 左侧一级导航栏 - 极简风格 */}
        <nav className="w-[90px] flex-none bg-[#F7F8FA] flex flex-col overflow-y-auto border-r border-gray-100 no-scrollbar">
          <div className="flex flex-col py-2">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    relative w-full py-4 flex flex-col items-center justify-center gap-1 transition-all duration-200
                    ${isActive ? 'bg-white' : 'bg-transparent hover:bg-white/50'}
                  `}
                >
                  {/* 选中指示条 */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF4D4F] rounded-r-full" />
                  )}
                  
                  {/* 主标题 */}
                  <span className={`
                    text-[15px] font-bold tracking-wide transition-colors duration-200
                    ${isActive ? 'text-[#FF4D4F]' : 'text-[#666666]'}
                  `}>
                    {category.name}
                  </span>
                  
                  {/* 副标题 (原label) - 简化显示 */}
                  <span className={`
                    text-[10px] transform scale-90 transition-colors duration-200
                    ${isActive ? 'text-[#FF4D4F]/80' : 'text-[#999999]'}
                  `}>
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col bg-white relative w-full min-w-0">
          
          {/* 顶部二级导航 (Tabs) */}
          <div className="flex-none px-4 pt-3 pb-1 bg-white z-10 border-b border-gray-50">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
              {currentCategory?.subCategories.map((sub) => {
                const isSubActive = activeSubCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategoryClick(sub.id)}
                    className={`
                      flex-none relative px-1 pb-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                      ${isSubActive ? 'text-[#FF4D4F] font-bold' : 'text-gray-500 hover:text-gray-700'}
                    `}
                  >
                    {sub.name}
                    {isSubActive && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF4D4F] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 筛选栏 */}
          <div className="flex-none px-4 py-2 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {userLocation && (
                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                  <MapPin className="w-3 h-3" /> 附近推荐
                </span>
              )}
              <span className="bg-gray-50 px-2 py-1 rounded-md">
                共 {filteredShops.length} 家好店
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">距离最近</button>
              <button className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">好评优先</button>
            </div>
          </div>

          {/* 商家列表 */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 scroll-smooth">
            {loading ? (
              // 骨架屏加载状态
              <div className="space-y-4 animate-pulse mt-2">
                {[1, 2, 3].map((i) => (
                  <ShopSkeleton key={i} />
                ))}
              </div>
            ) : (
              // 真实数据列表
              <div className="space-y-4 mt-2">
                {filteredShops.map((shop) => (
                  <div key={shop.id} className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden active:scale-[0.99]">
                    <div className="flex p-3 gap-3">
                      {/* 图片容器 */}
                      <div className="relative w-24 h-24 flex-none rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={shop.imageUrl} 
                          alt={shop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {shop.tags && shop.tags.length > 0 && (
                          <div className="absolute top-0 left-0 bg-[#FF4D4F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">
                            {shop.tags[0]}
                          </div>
                        )}
                      </div>
                      
                      {/* 内容容器 */}
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 text-base truncate pr-2">{shop.name}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap font-medium">{shop.distance}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3.5 h-3.5 text-[#FF9500] fill-[#FF9500]" />
                            <span className="text-sm font-bold text-[#FF9500]">{shop.rating}</span>
                            <span className="text-xs text-gray-400 ml-1">¥{shop.price}/人</span>
                          </div>
                          
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {shop.tags.slice(1).map((tag, idx) => (
                              <span key={idx} className="text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 底部优惠条 */}
                    {shop.deals && shop.deals.length > 0 && (
                      <div className="px-3 py-2.5 bg-[#FFF7F7] border-t border-[#FFF0F0] flex justify-between items-center">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="flex-none w-4 h-4 bg-[#FF4D4F] text-white text-[10px] font-bold flex items-center justify-center rounded">团</span>
                          <span className="text-xs text-gray-700 truncate font-medium">{shop.deals[0].title}</span>
                        </div>
                        <div className="flex items-baseline gap-1 flex-none ml-2">
                          <span className="text-sm font-bold text-[#FF4D4F]">¥{shop.deals[0].price}</span>
                          <span className="text-[10px] text-gray-400 line-through decoration-gray-300">¥{shop.deals[0].originalPrice}</span>
                        </div>
                      </div>
                    )}
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
            onSceneChange={setActiveSubCategory}
          />
        )}
      </div>
    </div>
  );
}
