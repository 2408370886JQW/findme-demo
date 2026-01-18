import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Heart, X, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
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
  const [expandedCategory, setExpandedCategory] = useState<string | null>(categories[0].id);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 筛选状态
  const [priceFilter, setPriceFilter] = useState<string>('all'); // all, low, medium, high
  const [distanceFilter, setDistanceFilter] = useState<string>('all'); // all, 1km, 3km, 5km
  
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
  const filteredShops = shops.filter(shop => {
    // 基础分类过滤
    if (shop.packageType !== activeCategory || shop.sceneTheme !== activeSubCategory) return false;
    
    // 价格过滤
    if (priceFilter !== 'all') {
      if (priceFilter === 'low' && shop.price > 200) return false;
      if (priceFilter === 'medium' && (shop.price <= 200 || shop.price > 500)) return false;
      if (priceFilter === 'high' && shop.price <= 500) return false;
    }
    
    // 距离过滤 (简单模拟，实际应计算坐标距离)
    if (distanceFilter !== 'all') {
      const dist = parseFloat(shop.distance);
      const unit = shop.distance.includes('km') ? 'km' : 'm';
      const distInKm = unit === 'km' ? dist : dist / 1000;
      
      if (distanceFilter === '1km' && distInKm > 1) return false;
      if (distanceFilter === '3km' && distInKm > 3) return false;
      if (distanceFilter === '5km' && distInKm > 5) return false;
    }
    
    return true;
  });

  // 处理一级菜单点击
  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null); // 收起
    } else {
      setExpandedCategory(categoryId); // 展开
      setActiveCategory(categoryId);
      // Only auto-select first subcategory if we're switching to a new main category that wasn't active
      if (activeCategory !== categoryId) {
        const category = categories.find(c => c.id === categoryId);
        if (category && category.subCategories.length > 0) {
          setActiveSubCategory(category.subCategories[0].id);
        }
      }
    }
  };

  // 处理二级菜单点击
  const handleSubCategoryClick = (e: React.MouseEvent, subId: string) => {
    e.stopPropagation(); // 阻止冒泡，防止触发一级菜单点击
    setActiveSubCategory(subId);
  };

  // 点击空白处收起菜单
  const handleOutsideClick = () => {
    // 可选：点击空白处是否收起所有菜单？
    // setExpandedCategory(null); 
  };

  // 切换收藏状态
  const toggleFavorite = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId) 
        : [...prev, shopId]
    );
  };

  // 打开商家详情
  const handleShopClick = (shop: Shop) => {
    setSelectedShop(shop);
    setCurrentImageIndex(0);
  };

  // 关闭商家详情
  const closeShopDetail = () => {
    setSelectedShop(null);
  };

  // 切换图片
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 模拟多图：这里简单用同一张图演示，实际应从 shop.images 获取
    // 假设有3张图
    setCurrentImageIndex(prev => (prev + 1) % 3);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prev => (prev - 1 + 3) % 3);
  };

  // 获取对应的装饰图标
  const getCategoryIcons = (categoryId: string, isActive: boolean) => {
    const color = isActive ? "#FF4D4F" : "#999999";
    const className = "w-8 h-8 transition-colors duration-300";
    
    switch (categoryId) {
      case 'couple':
        return {
          Left: <CoupleLeftIcon className={className} color={color} />,
          Right: <CoupleRightIcon className={className} color={color} />
        };
      case 'bestie':
        return {
          Left: <BestieLeftIcon className={className} color={color} />,
          Right: <BestieRightIcon className={className} color={color} />
        };
      case 'bro':
        return {
          Left: <BroLeftIcon className={className} color={color} />,
          Right: <BroRightIcon className={className} color={color} />
        };
      case 'passion':
        return {
          Left: <PassionLeftIcon className={className} color={color} />,
          Right: <PassionRightIcon className={className} color={color} />
        };
      default:
        return {
          Left: <CoupleLeftIcon className={className} color={color} />,
          Right: <CoupleRightIcon className={className} color={color} />
        };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans" onClick={handleOutsideClick}>
      {/* 顶部导航栏 - 移动端优化 */}
      <header className="flex-none h-14 px-3 flex items-center justify-between bg-white border-b border-gray-100 z-20 shadow-sm gap-2">
        {/* Logo - 移动端只显示图标 */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <div className="w-8 h-8 bg-[#FF4D4F] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">F</div>
          <span className="text-lg font-bold text-[#FF4D4F] tracking-tight hidden md:block">FIND ME</span>
        </div>
        
        {/* 搜索框 - 自适应宽度 */}
        <div className="flex-1 max-w-md min-w-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-[#FF4D4F] transition-colors" />
            <input 
              type="text" 
              placeholder="搜索..." 
              className="w-full h-8 pl-8 pr-3 bg-gray-50 rounded-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#FF4D4F]/20 focus:bg-white transition-all border border-transparent focus:border-[#FF4D4F]/20"
            />
          </div>
        </div>

        {/* 功能按钮 - 紧凑排列 */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button 
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all active:scale-95 ${
              showFavorites 
                ? 'bg-[#FF4D4F] text-white shadow-md shadow-[#FF4D4F]/20' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavorites ? 'fill-current' : ''}`} />
          </button>

          <button 
            onClick={() => setShowMap(!showMap)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all active:scale-95 whitespace-nowrap ${
              showMap 
                ? 'bg-[#FF4D4F] text-white shadow-md shadow-[#FF4D4F]/20' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            {showMap ? '列表' : '地图'}
          </button>
        </div>
      </header>

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* 商家详情弹窗 */}
        {selectedShop && (
          <div className="absolute inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-right duration-300">
            {/* 顶部导航 */}
            <div className="flex-none h-14 px-4 flex items-center justify-between bg-white border-b border-gray-100">
              <button onClick={closeShopDetail} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <span className="font-bold text-lg text-gray-900">商家详情</span>
              <div className="flex gap-2">
                <button onClick={(e) => toggleFavorite(e, selectedShop.id)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Heart className={`w-6 h-6 ${favorites.includes(selectedShop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-gray-700'}`} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <Share2 className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>

            {/* 内容滚动区 */}
            <div className="flex-1 overflow-y-auto pb-20">
              {/* 图片轮播 */}
              <div className="relative w-full h-64 bg-gray-100 group">
                <img 
                  src={selectedShop.imageUrl} 
                  alt={selectedShop.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                
                {/* 轮播控制 */}
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors backdrop-blur-sm">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors backdrop-blur-sm">
                  <ChevronRight className="w-5 h-5" />
                </button>
                
                {/* 指示器 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'bg-white w-3' : 'bg-white/50'}`} />
                  ))}
                </div>
              </div>

              {/* 商家信息 */}
              <div className="p-5">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedShop.name}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                  <div className="flex items-center text-[#FF9900] font-bold">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    {selectedShop.rating}
                  </div>
                  <span>¥{selectedShop.price}/人</span>
                  <span>{selectedShop.distance}</span>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedShop.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 优惠套餐 */}
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                    超值套餐
                  </h2>
                  <div className="space-y-3">
                    {selectedShop.deals?.map((deal, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{deal.title}</h3>
                          <div className="flex gap-2 mb-1">
                            {deal.tags.map((t, idx) => (
                              <span key={idx} className="text-[10px] text-[#FF4D4F] border border-[#FF4D4F]/30 px-1 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#FF4D4F] font-bold text-lg">
                            <span className="text-xs">¥</span>{deal.price}
                          </div>
                          <div className="text-gray-400 text-xs line-through">¥{deal.originalPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 商家介绍 */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                    商家介绍
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {selectedShop.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="flex-none p-4 bg-white border-t border-gray-100 flex gap-3">
              <button className="flex-1 py-3 rounded-full bg-gray-100 text-gray-900 font-bold text-sm hover:bg-gray-200 transition-colors">
                导航到店
              </button>
              <button className="flex-1 py-3 rounded-full bg-[#FF4D4F] text-white font-bold text-sm hover:bg-[#ff3336] transition-colors shadow-lg shadow-[#FF4D4F]/30">
                立即预订
              </button>
            </div>
          </div>
        )}
        
        {/* 左侧手风琴导航栏 */}
        <nav className="w-[80px] md:w-[100px] flex-none bg-[#F7F8FA] flex flex-col overflow-y-auto border-r border-gray-100 no-scrollbar z-10 transition-all duration-300">
          <div className="flex flex-col py-2 pb-20">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const isExpanded = expandedCategory === category.id;
              const icons = getCategoryIcons(category.id, isActive);
              
              return (
                <div key={category.id} className="flex flex-col">
                  {/* 一级菜单项 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                    className={`
                      relative w-full py-2.5 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 group
                      ${isActive ? 'bg-white' : 'bg-transparent hover:bg-white/50'}
                    `}
                  >
                    {/* 选中指示条 - 仅在展开时显示 */}
                    {isActive && isExpanded && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#FF4D4F] rounded-r-full shadow-[2px_0_8px_rgba(255,77,79,0.3)]" />
                    )}
                    
                    {/* 主标题 (无装饰图标) */}
                    <div className="flex items-center justify-center w-full px-1">
                      <span className={`
                        text-[16px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap
                        ${isActive ? 'text-[#FF4D4F]' : 'text-[#333333]'}
                      `}>
                        {category.name}
                      </span>
                    </div>
                    
                    {/* 胶囊副标题 */}
                    <div className={`
                      px-1.5 py-[1px] rounded-full text-[10px] transform scale-90 transition-all duration-300 mt-0.5
                      ${isActive 
                        ? 'bg-[#FF4D4F] text-white font-medium shadow-sm' 
                        : 'bg-[#F0F0F0] text-[#999999]'}
                    `}>
                      {category.label}
                    </div>
                  </button>

                  {/* 二级菜单列表 (手风琴展开) */}
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out bg-white
                    ${isExpanded ? 'max-h-[500px] opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}
                  `}>
                    <div className="flex flex-col py-1">
                      {category.subCategories.map((sub) => {
                        const isSubActive = activeSubCategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => handleSubCategoryClick(e, sub.id)}
                            className={`
                              w-full py-2 text-center transition-all duration-200 relative flex items-center justify-center
                              ${isSubActive 
                                ? 'text-[#FF4D4F] font-bold bg-[#FFF0F0]' 
                                : 'text-[#666666] font-medium hover:bg-gray-50'}
                            `}
                          >
                            <span className={`text-[14px] ${isSubActive ? 'scale-105 inline-block' : ''}`}>
                              {sub.name}
                            </span>
                            {isSubActive && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-4 bg-[#FF4D4F] rounded-r-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col bg-white relative min-w-0 overflow-hidden">
          {/* 顶部筛选栏 - 移动端横向滚动优化 */}
          <div className="flex-none px-3 py-2 bg-white z-10 border-b border-gray-50 flex flex-col gap-2">
            {/* 标题行 */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 truncate">
                {categories.find(c => c.id === activeCategory)?.subCategories.find(s => s.id === activeSubCategory)?.name}
              </h2>
              {userLocation && (
                <span className="text-[10px] font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1 whitespace-nowrap flex-shrink-0">
                  <MapPin className="w-3 h-3" /> 附近
                </span>
              )}
            </div>
            
            {/* 筛选按钮行 - 支持横向滚动 */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3 px-3">
              {/* 价格筛选 */}
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors outline-none appearance-none cursor-pointer border-none"
              >
                <option value="all">价格不限</option>
                <option value="low">¥200以下</option>
                <option value="medium">¥200-500</option>
                <option value="high">¥500以上</option>
              </select>

              {/* 距离筛选 */}
              <select 
                value={distanceFilter}
                onChange={(e) => setDistanceFilter(e.target.value)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors outline-none appearance-none cursor-pointer border-none"
              >
                <option value="all">距离不限</option>
                <option value="1km">1km内</option>
                <option value="3km">3km内</option>
                <option value="5km">5km内</option>
              </select>

              <button className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap">好评优先</button>
              <button className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors whitespace-nowrap">人均高低</button>
            </div>
          </div>

          {/* 商家列表 */}
          <div className="flex-1 overflow-y-auto px-4 pb-20 scroll-smooth">
            {showFavorites ? (
              // 收藏列表视图
              <div className="space-y-4 py-2">
                {shops.filter(s => favorites.includes(s.id)).length > 0 ? (
                  shops.filter(s => favorites.includes(s.id)).map((shop) => (
                    <div 
                      key={shop.id} 
                      onClick={() => handleShopClick(shop)}
                      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden active:scale-[0.99] relative cursor-pointer"
                    >
                      {/* 收藏按钮 */}
                      <button 
                        onClick={(e) => toggleFavorite(e, shop.id)}
                        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all active:scale-90"
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(shop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-gray-400'}`} />
                      </button>

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
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <div className="flex items-center text-[#FF9900] font-bold bg-[#FFF7E6] px-1 rounded">
                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                {shop.rating}
                              </div>
                              <span>¥{shop.price}/人</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {shop.tags.slice(1).map((tag, index) => (
                                <span key={index} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <Heart className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">暂无收藏商家</p>
                  </div>
                )}
              </div>
            ) : loading ? (
              // 骨架屏加载状态
              <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <ShopSkeleton key={i} />
                ))}
              </div>
            ) : (
              // 真实数据列表
              <div className="space-y-4">
                {filteredShops.map((shop) => (
                  <div 
                    key={shop.id} 
                    onClick={() => handleShopClick(shop)}
                    className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden active:scale-[0.99] relative cursor-pointer"
                  >
                    {/* 收藏按钮 */}
                    <button 
                      onClick={(e) => toggleFavorite(e, shop.id)}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(shop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-gray-400'}`} />
                    </button>

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
