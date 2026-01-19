import React, { useState, useEffect, useRef } from 'react';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Heart, X, ChevronLeft, ChevronRight, Share2, Moon, Sun, MessageSquare, Camera, Sparkles, Trophy, ShoppingBag } from 'lucide-react';
import { categories, shops, type Shop, type Category, type SubCategory, type Order } from '@/lib/data';
import { MapOverlay } from '@/components/MapOverlay';
import { ShareModal } from '@/components/ShareModal';
import { ShopSkeleton } from '@/components/ShopSkeleton';
import { OrderList } from '@/components/OrderList';
import { OrderDetail } from '@/components/OrderDetail';
import { NotificationManager } from '@/components/NotificationManager';
import { 
  CoupleLeftIcon, CoupleRightIcon, 
  BestieLeftIcon, BestieRightIcon, 
  BroLeftIcon, BroRightIcon, 
  PassionLeftIcon, PassionRightIcon 
} from '@/components/CategoryIcons';

// 模拟用户位置 (上海市中心)
const MOCK_USER_LOCATION = { lat: 31.2304, lng: 121.4737 };

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>('couple');
  const [activeSubCategory, setActiveSubCategory] = useState<string>('couple_date');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('couple');
  const [showMap, setShowMap] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(MOCK_USER_LOCATION);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavorites, setShowFavorites] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filters, setFilters] = useState({
    price: 'all', // all, low (<200), mid (200-500), high (>500)
    distance: 'all', // all, near (<1km), mid (1-3km), far (>3km)
    cuisine: 'all' // all, western, bar, bbq, etc.
  });
  const [guessYouLike, setGuessYouLike] = useState<Shop[]>([]);
  
  // 处理通知点击跳转
  const handleNotificationClick = (order: Order) => {
    setShowOrders(true);
    setSelectedOrder(order);
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // 监听暗色模式变化
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 保存收藏状态
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(shopId) 
        ? prev.filter(id => id !== shopId)
        : [...prev, shopId]
    );
  };

  // 模拟加载效果
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategory, activeSubCategory]);

  // 智能推荐逻辑
  useEffect(() => {
    const hour = new Date().getHours();
    let recommendType = '';
    
    // 根据时间段决定推荐类型
    if (hour >= 6 && hour < 11) {
      recommendType = 'bestie_chat'; // 早上推荐咖啡/早茶
    } else if (hour >= 11 && hour < 14) {
      recommendType = 'couple_date'; // 中午推荐约会餐厅
    } else if (hour >= 14 && hour < 17) {
      recommendType = 'bestie_photo'; // 下午推荐下午茶/拍照
    } else if (hour >= 17 && hour < 21) {
      recommendType = 'couple_relax'; // 晚上推荐浪漫晚餐
    } else {
      recommendType = 'brother_party'; // 深夜推荐酒吧/烧烤
    }

    // 筛选推荐店铺 (排除当前分类，增加多样性)
    const recommendations = shops
      .filter(shop => shop.sceneTheme === recommendType || shop.rating >= 4.8)
      .sort(() => Math.random() - 0.5) // 随机排序
      .slice(0, 2); // 只取2个

    setGuessYouLike(recommendations);
  }, []);

  // 处理一级分类点击
  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory !== categoryId) {
      setActiveCategory(categoryId);
      // 默认选中第一个子分类
      const category = categories.find(c => c.id === categoryId);
      if (category && category.subCategories.length > 0) {
        setActiveSubCategory(category.subCategories[0].id);
      }
      // 展开当前分类
      setExpandedCategory(categoryId);
    } else {
      // 如果点击已选中的分类，切换展开/收起状态
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    }
  };

  // 处理二级分类点击
  const handleSubCategoryClick = (e: React.MouseEvent, subCategoryId: string) => {
    e.stopPropagation();
    setActiveSubCategory(subCategoryId);
  };

  // 获取分类副标题
  const getCategorySubtitle = (categoryId: string) => {
    switch (categoryId) {
      case 'couple': return '全城·2025';
      case 'bestie': return '本地人推荐';
      case 'brother': return '专程前往';
      case 'fun': return '全城最热';
      default: return '特色体验';
    }
  };

  // 筛选逻辑
  const filteredShops = shops.filter(shop => {
    // 基础分类筛选
    if (shop.packageType !== activeCategory || shop.sceneTheme !== activeSubCategory) {
      return false;
    }
    
    // 价格筛选
    if (filters.price !== 'all') {
      if (filters.price === 'low' && shop.price >= 200) return false;
      if (filters.price === 'mid' && (shop.price < 200 || shop.price > 500)) return false;
      if (filters.price === 'high' && shop.price <= 500) return false;
    }

    // 距离筛选 (简单模拟，实际应计算坐标距离)
    if (filters.distance !== 'all') {
      const dist = parseFloat(shop.distance);
      const isKm = shop.distance.includes('km');
      const distInKm = isKm ? dist : dist / 1000;
      
      if (filters.distance === 'near' && distInKm >= 1) return false;
      if (filters.distance === 'mid' && (distInKm < 1 || distInKm > 3)) return false;
      if (filters.distance === 'far' && distInKm <= 3) return false;
    }

    return true;
  });

  // 收藏列表筛选
  const favoriteShops = shops.filter(shop => favorites.includes(shop.id));

  // 处理图片轮播
  const nextImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent, images: string[]) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col h-screen bg-background transition-colors duration-300">
      {/* 顶部导航栏 - 移动端优化布局 */}
      <header className="flex-none glass px-3 py-2 z-20 sticky top-0">
        <div className="flex items-center justify-between gap-2 max-w-full overflow-hidden">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#FF4D4F] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF4D4F]/20">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-foreground hidden sm:block">
              FIND <span className="text-[#FF4D4F]">ME</span>
            </h1>
          </div>

          {/* Search Bar - 自适应宽度 */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-[#FF4D4F] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-muted/50 border-none rounded-full py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#FF4D4F]/20 focus:bg-background transition-all"
                placeholder="搜索好去处..."
              />
            </div>
          </div>

          {/* Action Buttons - 紧凑排列 */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowOrders(true)}
              className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowFavorites(!showFavorites)}
              className={`p-2 rounded-full transition-colors ${showFavorites ? 'bg-[#FF4D4F]/10 text-[#FF4D4F]' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            >
              <Heart className={`w-5 h-5 ${showFavorites ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => setShowMap(!showMap)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold transition-all
                ${showMap 
                  ? 'bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/30' 
                  : 'bg-muted text-foreground hover:bg-muted/80'}
              `}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden xs:inline">地图</span>
            </button>
          </div>
        </div>
      </header>

      {/* 全局通知管理器 */}
      <NotificationManager onNotificationClick={handleNotificationClick} />

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 订单中心浮层 */}
        {showOrders && (
          <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right duration-300">
            {selectedOrder ? (
              <OrderDetail 
                order={selectedOrder} 
                onBack={() => setSelectedOrder(null)} 
              />
            ) : (
              <OrderList 
                onBack={() => setShowOrders(false)} 
                onOrderClick={(order) => setSelectedOrder(order)}
              />
            )}
          </div>
        )}

        {/* 收藏夹浮层 */}
        {showFavorites && (
          <div className="absolute inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Heart className="w-5 h-5 fill-[#FF4D4F] text-[#FF4D4F]" />
                我的收藏
              </h2>
              <button onClick={() => setShowFavorites(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {favoriteShops.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {favoriteShops.map(shop => (
                    <div key={shop.id} className="bg-card rounded-xl p-3 flex gap-3 shadow-sm border border-border" onClick={() => {
                      setSelectedShop(shop);
                      setShowFavorites(false);
                    }}>
                      <img src={shop.imageUrl} alt={shop.name} className="w-24 h-24 rounded-lg object-cover flex-none" />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-foreground truncate">{shop.name}</h3>
                          <button onClick={(e) => toggleFavorite(e, shop.id)}>
                            <Heart className="w-4 h-4 fill-[#FF4D4F] text-[#FF4D4F]" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1 text-[#FF9900] text-xs mt-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="font-bold">{shop.rating}</span>
                          <span className="text-muted-foreground ml-1">¥{shop.price}/人</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {shop.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Heart className="w-12 h-12 mb-2 opacity-20" />
                  <p>暂无收藏店铺</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 商家详情浮层 */}
        {selectedShop && (
          <div className="absolute inset-0 z-40 bg-background/95 backdrop-blur-xl flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* 详情页头部 */}
            <div className="relative h-64 flex-none">
              <img src={selectedShop.imageUrl} alt={selectedShop.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* 导航栏 */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center text-white">
                <button 
                  onClick={() => setSelectedShop(null)}
                  className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={(e) => toggleFavorite(e, selectedShop.id)}
                    className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <Heart className={`w-5 h-5 ${favorites.includes(selectedShop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-white'}`} />
                  </button>
                  <button 
                    onClick={() => setShowShare(true)}
                    className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center hover:bg-black/50 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* 底部信息 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h1 className="text-2xl font-bold mb-2">{selectedShop.name}</h1>
                <div className="flex items-center gap-3 text-sm opacity-90">
                  <div className="flex items-center gap-1 text-[#FF9900]">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{selectedShop.rating}</span>
                  </div>
                  <span>¥{selectedShop.price}/人</span>
                  <span>{selectedShop.distance}</span>
                </div>
              </div>
            </div>

            {/* 详情内容 - 可滚动 */}
            <div className="flex-1 overflow-y-auto bg-background">
              <div className="p-4 space-y-6">
                {/* 标签栏 */}
                <div className="flex flex-wrap gap-2">
                  {selectedShop.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 优惠套餐 */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                    优惠套餐
                  </h2>
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-foreground">{selectedShop.dealTitle}</h3>
                      <div className="text-right">
                        <span className="text-[#FF4D4F] font-bold text-lg">¥{selectedShop.price}</span>
                        <span className="text-muted-foreground text-xs line-through ml-2">¥{Math.floor(selectedShop.price * 1.5)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mb-4">
                      <span className="px-1.5 py-0.5 border border-[#FF4D4F]/30 text-[#FF4D4F] text-[10px] rounded">随时退</span>
                      <span className="px-1.5 py-0.5 border border-[#FF4D4F]/30 text-[#FF4D4F] text-[10px] rounded">过期退</span>
                    </div>
                    <button className="w-full py-2.5 bg-[#FF4D4F] text-white rounded-lg font-bold text-sm hover:bg-[#ff3336] transition-colors shadow-lg shadow-[#FF4D4F]/20">
                      立即抢购
                    </button>
                  </div>
                </div>

                {/* 评价概览 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                      用户评价
                    </h2>
                    <span className="text-xs text-muted-foreground flex items-center">
                      查看全部 <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex-none w-64 bg-muted/30 rounded-xl p-3 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px]">
                            U{i}
                          </div>
                          <span className="text-xs font-bold">用户88{i}</span>
                          <div className="flex ml-auto">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} className="w-2 h-2 fill-[#FF9900] text-[#FF9900]" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          环境非常棒，服务也很周到，特别是那个招牌菜真的很好吃！下次还会再来。
                        </p>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 py-2.5 rounded-full border border-[#FF4D4F] text-[#FF4D4F] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#FF4D4F]/5 transition-colors">
                    <Camera className="w-4 h-4" />
                    写评价
                  </button>
                </div>

                {/* 商家介绍 */}
                <div>
                  <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                    商家介绍
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {selectedShop.description}
                  </p>
                </div>
              </div>
            </div>
            
            {/* 底部按钮 */}
            <div className="flex-none p-4 bg-background border-t border-border flex gap-3">
              <button className="flex-1 py-3 rounded-full bg-muted text-foreground font-bold text-sm hover:bg-muted/80 transition-colors">
                导航到店
              </button>
              <button className="flex-1 py-3 rounded-full bg-[#FF4D4F] text-white font-bold text-sm hover:bg-[#ff3336] transition-colors shadow-lg shadow-[#FF4D4F]/30">
                立即预订
              </button>
            </div>
          </div>
        )}
        
        {/* 左侧手风琴导航栏 - 高德风格重构 */}
        <nav className="w-[100px] flex-none bg-background flex flex-col overflow-y-auto border-r border-border/50 no-scrollbar z-30 transition-all duration-300 relative">
          {/* 顶部全城筛选 */}
          <div className="flex items-center justify-center py-4 cursor-pointer hover:text-[#FF4D4F] transition-colors">
            <span className="text-sm font-bold text-foreground/80">全城</span>
            <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
          </div>

          <div className="flex flex-col pb-20 gap-6">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.id;
              const isExpanded = expandedCategory === category.id;
              const subtitle = getCategorySubtitle(category.id);
              
              // 第一个分类使用橙红色系，其他使用银灰色系
              const isPrimary = index === 0;
              const themeColor = isPrimary ? '#FF5500' : '#999999';
              const titleColor = isPrimary ? 'text-[#FF5500]' : 'text-[#666666]';
              const subtitleBg = isPrimary ? 'bg-[#FF5500]' : 'bg-[#999999]';
              
              // 映射图标
              const iconMap: Record<string, string> = {
                'couple': '/images/icon_couple.png',
                'bestie': '/images/icon_friends.png',
                'bro': '/images/icon_bros.png',
                'intimate': '/images/icon_intimate.png'
              };
              const iconPath = iconMap[category.id] || '';

              return (
                <div key={category.id} className="flex flex-col items-center relative">
                  {/* 分隔线 (除了第一个) */}
                  {index > 0 && (
                    <div className="w-8 h-[1px] bg-border/60 absolute -top-3 left-1/2 -translate-x-1/2"></div>
                  )}

                  {/* 一级菜单项 - 榜单头部风格 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                    className="relative w-full flex flex-col items-center justify-center gap-1 group cursor-pointer"
                  >
                    {/* 麦穗装饰 */}
                    <div className="relative flex items-center justify-center w-full">
                      {/* 左麦穗 */}
                      <svg width="16" height="32" viewBox="0 0 16 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-2 top-1/2 -translate-y-1/2 opacity-30">
                        <path d="M8 4C6 6 4 10 4 16C4 22 6 26 8 28" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 8C10 10 9 13 9 16C9 19 10 22 12 24" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M15 12C14 13 13.5 14.5 13.5 16C13.5 17.5 14 19 15 20" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>

                      {/* 右麦穗 */}
                      <svg width="16" height="32" viewBox="0 0 16 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 -translate-y-1/2 opacity-30 transform scale-x-[-1]">
                        <path d="M8 4C6 6 4 10 4 16C4 22 6 26 8 28" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M12 8C10 10 9 13 9 16C9 19 10 22 12 24" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                        <path d="M15 12C14 13 13.5 14.5 13.5 16C13.5 17.5 14 19 15 20" stroke={themeColor} strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>

                      {/* 主标题容器 */}
                      <div className="flex flex-col items-center z-10">
                        {/* 3D金属图标 */}
                        {iconPath && (
                          <img 
                            src={iconPath} 
                            alt={category.name} 
                            className="w-8 h-8 object-contain mb-1 drop-shadow-sm"
                          />
                        )}
                        {/* 主标题 */}
                        <span className={`text-[13px] font-medium tracking-wide ${titleColor}`}>
                          {category.name}
                        </span>
                      </div>
                    </div>
                    
                    {/* 副标题胶囊 */}
                    <div className={`px-2 py-0.5 rounded-full ${subtitleBg} text-white text-[10px] font-medium scale-90`}>
                      {subtitle}
                    </div>
                  </button>

                  {/* 二级菜单列表 */}
                  <div className={`
                    w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center gap-3 mt-3
                    ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {category.subCategories.map((sub, subIndex) => {
                      const isSubActive = activeSubCategory === sub.id;
                      // 第一个子项高亮显示 (粉色胶囊)，其他为普通文本
                      const isHighlight = subIndex === 0;
                      
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => handleSubCategoryClick(e, sub.id)}
                          className={`
                            text-[12px] transition-all duration-200 relative flex items-center justify-center cursor-pointer z-20
                            ${isHighlight 
                              ? 'bg-[#FFF0F0] text-[#FF4D4F] font-bold px-3 py-1 rounded-full' 
                              : 'text-[#333333] hover:text-[#000000] font-medium'}
                            ${isSubActive && !isHighlight ? 'text-[#FF4D4F] font-bold' : ''}
                          `}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                    {/* 底部留白 */}
                    <div className="h-1"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col bg-background relative min-w-0 overflow-hidden">
          {/* 顶部筛选栏 - 移动端横向滚动优化 */}
          <div className="flex-none px-3 py-2 bg-background/80 backdrop-blur-md z-20 border-b border-border/50 flex flex-col gap-2">
            {/* 标题行 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2 truncate">
                  {categories.find(c => c.id === activeCategory)?.subCategories.find(s => s.id === activeSubCategory)?.name}
                </h2>
                
                {/* 猜你喜欢入口 */}
                <div className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#FF4D4F]/10 to-[#FF9900]/10 rounded-full border border-[#FF4D4F]/20">
                  <Sparkles className="w-3 h-3 text-[#FF4D4F] animate-pulse" />
                  <span className="text-[10px] font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#FF4D4F] to-[#FF9900]">
                    猜你喜欢
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground whitespace-nowrap">
                <Locate className="w-3 h-3" />
                <span>距您 500m</span>
              </div>
            </div>

            {/* 猜你喜欢推荐卡片 (仅在有推荐且非加载状态显示) */}
            {!isLoading && guessYouLike.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-1 pr-4">
                {guessYouLike.map(shop => (
                  <div 
                    key={`guess-${shop.id}`}
                    onClick={() => setSelectedShop(shop)}
                    className="flex-none w-64 bg-card border border-border rounded-lg p-2 flex gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <img src={shop.imageUrl} alt={shop.name} className="w-16 h-16 rounded-md object-cover flex-none" />
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <h4 className="font-bold text-sm truncate">{shop.name}</h4>
                      <div className="flex items-center gap-1 text-[#FF9900] text-xs">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{shop.rating}</span>
                        <span className="text-muted-foreground ml-1">¥{shop.price}/人</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="text-[10px] px-1 bg-[#FF4D4F]/10 text-[#FF4D4F] rounded">
                          {shop.sceneTheme === 'couple_date' ? '约会首选' : '人气推荐'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 筛选标签行 */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, price: 'all' }))}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${filters.price === 'all' ? 'bg-foreground text-background font-bold' : 'bg-muted text-muted-foreground'}`}
              >
                价格不限
              </button>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, distance: 'all' }))}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${filters.distance === 'all' ? 'bg-foreground text-background font-bold' : 'bg-muted text-muted-foreground'}`}
              >
                距离不限
              </button>
              <button className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs whitespace-nowrap">
                好评优先
              </button>
              <button className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs whitespace-nowrap">
                人均高低
              </button>
            </div>
          </div>

          {/* 商家列表 - 虚拟滚动优化 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
            {isLoading ? (
              // 加载骨架屏
              Array(4).fill(0).map((_, i) => <ShopSkeleton key={i} />)
            ) : filteredShops.length > 0 ? (
              filteredShops.map((shop, index) => (
                <div 
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  {/* 卡片头部：图片与关键信息 */}
                  <div className="flex p-3 gap-3">
                    <div className="relative w-24 h-24 flex-none overflow-hidden rounded-lg">
                      <img 
                        src={shop.imageUrl} 
                        alt={shop.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {index < 3 && (
                        <div className="absolute top-0 left-0 bg-[#FF4D4F] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                          精选
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-bold text-foreground truncate pr-2">{shop.name}</h3>
                          <span className="text-xs text-muted-foreground flex-none">{shop.distance}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 text-xs">
                          <div className="flex items-center text-[#FF9900] font-bold">
                            <Star className="w-3 h-3 fill-current mr-0.5" />
                            {shop.rating}
                          </div>
                          <span className="text-muted-foreground">¥{shop.price}/人</span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {shop.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 优惠套餐条 - 仅在有套餐时显示 */}
                  <div className="px-3 pb-3 pt-0">
                    <div className="bg-[#FF4D4F]/5 rounded-lg p-2 flex items-center justify-between group-hover:bg-[#FF4D4F]/10 transition-colors">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="bg-[#FF4D4F] text-white text-[10px] px-1 rounded flex-none">团</span>
                        <span className="text-xs font-medium text-foreground truncate">{shop.dealTitle}</span>
                      </div>
                      <div className="flex items-baseline gap-1 flex-none ml-2">
                        <span className="text-[#FF4D4F] font-bold text-sm">¥{shop.price}</span>
                        <span className="text-muted-foreground text-[10px] line-through">¥{Math.floor(shop.price * 1.5)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // 空状态
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>暂无符合条件的店铺</p>
                <button 
                  onClick={() => setFilters({ price: 'all', distance: 'all', cuisine: 'all' })}
                  className="mt-4 text-[#FF4D4F] text-sm font-bold hover:underline"
                >
                  清除筛选条件
                </button>
              </div>
            )}
            
            {/* 底部提示 */}
            {!isLoading && filteredShops.length > 0 && (
              <div className="text-center py-4 text-xs text-muted-foreground/50">
                已经到底啦，去其他分类看看吧 ~
              </div>
            )}
          </div>
        </main>

        {/* 地图浮层 */}
        {showMap && (
          <div className="absolute inset-0 z-30 bg-background animate-in fade-in duration-300">
            <MapOverlay 
              shops={filteredShops} 
              userLocation={userLocation}
              onClose={() => setShowMap(false)}
              onShopClick={(shop) => {
                setSelectedShop(shop);
                setShowMap(false);
              }}
            />
          </div>
        )}

        {/* 分享弹窗 */}
        {selectedShop && (
          <ShareModal 
            isOpen={showShare}
            onClose={() => setShowShare(false)}
            shop={selectedShop}
          />
        )}
      </div>
    </div>
  );
}
