import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Heart, X, ChevronLeft, ChevronRight, Share2, Moon, Sun, MessageSquare, Camera, Sparkles, Trophy, ShoppingBag, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { PACKAGE_TYPES as categories, MOCK_SHOPS as shops, type Shop, type PackageType as Category, type SceneTheme as SubCategory, type Order, OrderStatus } from '@/lib/data';
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

// 模拟用户位置 (乌鲁木齐市中心 - 大巴扎附近)
const MOCK_USER_LOCATION = { lat: 43.7930, lng: 87.6177 };

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
    cuisine: 'all', // all, western, bar, bbq, etc.
    district: null as string | null,
    area: null as string | null,
    services: [] as string[], // 'openNow', 'hasPrivateRoom', 'hasParking'
    scenario: null as 'weekend' | 'midnight' | null, // 场景筛选
    sort: 'distance' // distance, rating, price_asc, price_desc, sales
  });
  const [guessYouLike, setGuessYouLike] = useState<Shop[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('browsingHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  // 记录浏览历史
  useEffect(() => {
    localStorage.setItem('browsingHistory', JSON.stringify(browsingHistory));
  }, [browsingHistory]);

  const addToHistory = (shopId: string) => {
    setBrowsingHistory(prev => {
      const newHistory = [shopId, ...prev.filter(id => id !== shopId)].slice(0, 20); // 保留最近20条
      return newHistory;
    });
  };

  // 智能推荐逻辑 (增强版)
  useEffect(() => {
    const hour = new Date().getHours();
    let timeBasedType = '';
    
    // 1. 时间维度推荐
    if (hour >= 6 && hour < 11) timeBasedType = 'bestie_chat';
    else if (hour >= 11 && hour < 14) timeBasedType = 'couple_date';
    else if (hour >= 14 && hour < 17) timeBasedType = 'bestie_photo';
    else if (hour >= 17 && hour < 21) timeBasedType = 'couple_relax';
    else timeBasedType = 'brother_party';

    // 2. 兴趣维度推荐 (基于收藏和历史)
    const interestScores = new Map<string, number>();
    
    // 分析收藏偏好
    favorites.forEach(shopId => {
      const shop = shops.find(s => s.id === shopId);
      if (shop) {
        interestScores.set(shop.sceneTheme, (interestScores.get(shop.sceneTheme) || 0) + 3); // 收藏权重+3
        interestScores.set(shop.packageType, (interestScores.get(shop.packageType) || 0) + 2);
      }
    });

    // 分析浏览偏好
    browsingHistory.forEach(shopId => {
      const shop = shops.find(s => s.id === shopId);
      if (shop) {
        interestScores.set(shop.sceneTheme, (interestScores.get(shop.sceneTheme) || 0) + 1); // 浏览权重+1
      }
    });

    // 找出得分最高的偏好类型
    let preferredTheme = '';
    let maxScore = 0;
    interestScores.forEach((score, theme) => {
      if (score > maxScore) {
        maxScore = score;
        preferredTheme = theme;
      }
    });

    // 综合推荐列表
    const recommendations = shops
      .filter(shop => {
        // 排除已收藏的 (推荐新店)
        if (favorites.includes(shop.id)) return false;
        
        // 匹配规则：
        // 1. 命中时间场景
        // 2. 命中用户偏好场景
        // 3. 高评分兜底
        return (
          shop.sceneTheme === timeBasedType || 
          shop.sceneTheme === preferredTheme || 
          shop.rating >= 4.9
        );
      })
      .sort((a, b) => {
        // 优先推荐命中偏好的
        const aScore = (a.sceneTheme === preferredTheme ? 2 : 0) + (a.sceneTheme === timeBasedType ? 1 : 0);
        const bScore = (b.sceneTheme === preferredTheme ? 2 : 0) + (b.sceneTheme === timeBasedType ? 1 : 0);
        return bScore - aScore || b.rating - a.rating;
      })
      .slice(0, 3); // 取前3个

    setGuessYouLike(recommendations);
  }, [favorites, browsingHistory]);

  // 处理一级分类点击
  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory !== categoryId) {
      setActiveCategory(categoryId);
      // 默认选中第一个子分类
      const category = categories.find(c => c.id === categoryId);
      if (category && category.subCategories && category.subCategories.length > 0) {
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

    // 区域筛选
    if (filters.district && shop.district !== filters.district) return false;
    if (filters.area && shop.area !== filters.area) return false;
    
    // 价格筛选
    if (filters.price !== 'all') {
      if (filters.price === 'low' && shop.price >= 200) return false;
      if (filters.price === 'mid' && (shop.price < 200 || shop.price > 500)) return false;
      if (filters.price === 'high' && shop.price <= 500) return false;
    }

    // 距离筛选 (解析距离字符串)
    if (filters.distance !== 'all') {
      const distStr = shop.distance.toLowerCase();
      let distInKm = 0;
      
      if (distStr.includes('km')) {
        distInKm = parseFloat(distStr);
      } else if (distStr.includes('m')) {
        distInKm = parseFloat(distStr) / 1000;
      }
      
      if (filters.distance === 'near' && distInKm >= 1) return false;
      if (filters.distance === 'mid' && (distInKm < 1 || distInKm > 3)) return false;
      if (filters.distance === 'far' && distInKm <= 3) return false;
    }

    // 服务标签筛选
    if (filters.services.length > 0) {
      if (filters.services.includes('openNow') && !shop.services?.openNow) return false;
      if (filters.services.includes('hasPrivateRoom') && !shop.services?.hasPrivateRoom) return false;
      if (filters.services.includes('hasParking') && !shop.services?.hasParking) return false;
    }

    // 场景筛选
    if (filters.scenario === 'weekend') {
      // 周末去哪儿：景观、休闲、互动、拍照
      const weekendThemes = ['couple_view', 'couple_relax', 'couple_activity', 'bestie_photo', 'bestie_chat', 'bestie_shopping'];
      if (!weekendThemes.includes(shop.sceneTheme)) return false;
    } else if (filters.scenario === 'midnight') {
      // 深夜食堂：烧烤、酒吧、夜宵
      const midnightThemes = ['brother_bbq', 'brother_drink', 'brother_game', 'fun_bar'];
      if (!midnightThemes.includes(shop.sceneTheme) && !shop.tags.includes('夜宵')) return false;
      // 必须营业中
      if (!shop.services?.openNow) return false;
    }

    return true;
  }).sort((a, b) => {
    // 排序逻辑
    switch (filters.sort) {
      case 'rating':
        // 评分优先，评分相同时按距离排序
        if (b.rating !== a.rating) return b.rating - a.rating;
        break;
      case 'price_asc':
        // 价格从低到高
        if (a.price !== b.price) return a.price - b.price;
        break;
      case 'price_desc':
        // 价格从高到低
        if (b.price !== a.price) return b.price - a.price;
        break;
      case 'sales':
        // 销量优先
        if ((b.sales || 0) !== (a.sales || 0)) return (b.sales || 0) - (a.sales || 0);
        break;
      case 'distance':
      default:
        // 默认距离排序
        break;
    }
    
    // 辅助排序：距离 (所有排序方式的次级排序)
    const getDist = (s: Shop) => {
      const distStr = s.distance.toLowerCase();
      if (distStr.includes('km')) {
        return parseFloat(distStr) * 1000;
      } else if (distStr.includes('m')) {
        return parseFloat(distStr);
      }
      return 999999; // 未知距离排最后
    };
    return getDist(a) - getDist(b);
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
    <div className="flex flex-col h-screen bg-[#F5F5F5] transition-colors duration-300">
      {/* 顶部导航栏 - 移动端优化布局 */}
      <header className="flex-none bg-white px-3 py-2 z-20 sticky top-0 shadow-sm">
        <div className="flex items-center justify-between gap-2 max-w-full overflow-hidden">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* 移动端菜单按钮 */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 -ml-2 rounded-full hover:bg-muted text-foreground">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0 bg-background border-r border-border/50">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-border/50 flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#FF4D4F] rounded-lg flex items-center justify-center shadow-lg shadow-[#FF4D4F]/20">
                      <MapPin className="text-white w-5 h-5" />
                    </div>
                    <h1 className="text-lg font-black tracking-tighter text-foreground">
                      FIND <span className="text-[#FF4D4F]">ME</span>
                    </h1>
                  </div>
                  <div className="flex-1 overflow-y-auto py-4">
                    {/* 移动端侧边栏内容复用 */}
                    <div className="flex flex-col gap-6 px-4">
                      {/* 顶部全城筛选 */}
                      <div className="flex items-center justify-center py-2 cursor-pointer hover:text-[#FF4D4F] transition-colors border-b border-border/30 pb-4">
                        <span className="text-sm font-bold text-foreground/80">全城</span>
                        <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground" />
                      </div>
                      
                      {categories.map((category, index) => {
                        const isActive = activeCategory === category.id;
                        const isExpanded = expandedCategory === category.id;
                        const subtitle = getCategorySubtitle(category.id);
                        
                        const isSelected = isActive || isExpanded;
                        const titleColor = isSelected ? 'text-[#FF5500]' : 'text-[#333333]';
                        
                        return (
                          <div key={category.id} className="flex flex-col items-center relative">
                            {/* 分隔线 */}
                            {index > 0 && (
                              <div className="w-full h-[1px] bg-border/30 absolute -top-3 left-0"></div>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(category.id);
                              }}
                              className="relative w-full flex items-center justify-between py-2 group cursor-pointer hover:opacity-80 transition-opacity"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`text-[15px] font-[500] tracking-wide ${titleColor} transition-colors duration-200 font-system`}>
                                  {category.name}
                                </span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* 二级菜单列表 */}
                            <div className={`
                              w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2 pl-4
                              ${isExpanded ? 'max-h-[500px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                            `}>
                              {category.subCategories?.map((sub, subIndex) => {
                                const isSubActive = activeSubCategory === sub.id;
                                const isHighlight = subIndex === 0;
                                
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={(e) => {
                                      handleSubCategoryClick(e, sub.id);
                                      setIsMobileMenuOpen(false); // 选择后关闭菜单
                                    }}
                                    className={`
                                      text-[13px] transition-all duration-200 relative flex items-center justify-start cursor-pointer z-20 tracking-wide py-2 px-3 rounded-md w-full font-system
                                      ${isSubActive 
                                        ? 'text-white font-[400] bg-[#FF5500] shadow-sm' 
                                        : 'text-[#666666] hover:text-[#FF5500] hover:bg-[#FFF5F0] font-[400]'}
                                    `}
                                  >
                                    {sub.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <div className="w-8 h-8 bg-[#FF4D4F] rounded-lg hidden md:flex items-center justify-center shadow-lg shadow-[#FF4D4F]/20">
              <MapPin className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-foreground hidden md:block">
              FIND <span className="text-[#FF4D4F]">ME</span>
            </h1>
          </div>

          {/* Search Bar - 自适应宽度 */}
          <div className="flex-1 max-w-md mx-2 min-w-0">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-[#FF4D4F] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-muted/50 border-none rounded-full py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-[#FF4D4F]/20 focus:bg-background transition-all"
                placeholder="搜索..."
              />
            </div>
          </div>

          {/* Action Buttons - 紧凑排列 */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <button 
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setShowOrders(true)}
              className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <Link href="/favorites">
              <button 
                className={`p-1.5 rounded-full transition-colors hover:bg-muted text-muted-foreground hover:text-foreground`}
              >
                <Heart className={`w-5 h-5`} />
              </button>
            </Link>
            <button 
              onClick={() => setShowMap(!showMap)}
              className={`
                flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ml-1
                ${showMap 
                  ? 'bg-[#FF4D4F] text-white shadow-lg shadow-[#FF4D4F]/30' 
                  : 'bg-muted text-foreground hover:bg-muted/80'}
              `}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">地图</span>
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
        <nav className="w-[88px] flex-none bg-white flex flex-col overflow-y-auto border-r border-[#EEEEEE] no-scrollbar z-30 transition-all duration-300 relative">
          {/* 顶部全城筛选 - 增加点击反馈 */}
          <div className="flex items-center justify-center py-4 cursor-pointer group transition-colors active:scale-95 duration-200">
            <span className="text-[14px] font-[600] text-[#222222] group-hover:text-[#FF5500] transition-colors font-system tracking-tight">全城</span>
            <ChevronDown className="w-3 h-3 ml-1 text-[#999999] group-hover:text-[#FF5500] transition-colors" />
          </div>

          <div className="flex flex-col pb-20 gap-2">
            {categories.map((category, index) => {
              const isActive = activeCategory === category.id;
              const isExpanded = expandedCategory === category.id;
              const subtitle = getCategorySubtitle(category.id);
              
              // 统一所有分类的交互状态，不再区分首项和非首项
              // 选中状态下使用橙红色，未选中状态使用深灰色
              const isSelected = isActive || isExpanded;
              const titleColor = isSelected ? 'text-[#FF5500]' : 'text-[#333333]';
              const subtitleBg = isSelected ? 'bg-[#FF5500]' : 'bg-[#FF5500]'; // 统一使用品牌色背景，或者未选中时用浅一点的颜色
              
              return (
                <div key={category.id} className="flex flex-col items-center relative">
                  {/* 分隔线 (除了第一个) */}
                  {index > 0 && (
                    <div className="w-6 h-[1px] bg-border/30 absolute -top-1 left-1/2 -translate-x-1/2"></div>
                  )}

                  {/* 一级菜单项 - 极简精致风格 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                    className="relative w-full flex flex-col items-center justify-center gap-0.5 group cursor-pointer py-2 hover:opacity-80 transition-opacity"
                  >
                    {/* 主标题 - 纤细精致 */}
                    <span className={`text-[15px] font-[600] tracking-[0.02em] ${titleColor} transition-colors duration-200 font-system leading-tight`}>
                      {category.name}
                    </span>
                    {/* 推荐标签 - 高德风格 */}
                    <span className={`text-[10px] transform scale-90 origin-center px-1.5 py-0.5 rounded-full mt-0.5 ${isSelected ? 'bg-[#FFF0E5] text-[#FF5500]' : 'bg-[#F5F5F5] text-[#999999]'}`}>
                      {category.recommendTag}
                    </span>
                  </button>

                  {/* 二级菜单列表 */}
                  <div className={`
                    w-full overflow-hidden transition-all duration-300 ease-in-out flex flex-col items-center gap-2 mt-1
                    ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    {category.subCategories?.map((sub, subIndex) => {
                      const isSubActive = activeSubCategory === sub.id;
                      // 第一个子项高亮显示 (粉色胶囊)，其他为普通文本
                      const isHighlight = subIndex === 0;
                      
                      return (
                        <button
                          key={sub.id}
                          onClick={(e) => handleSubCategoryClick(e, sub.id)}
                          className={`
                            text-[12px] transition-all duration-200 relative flex items-center justify-center cursor-pointer z-20 tracking-[0.01em]
                            w-full py-1.5 px-2 rounded-xl font-system leading-none mx-2
                            ${isSubActive 
                              ? 'text-white font-bold bg-[#FF5500] shadow-sm' 
                              : 'text-[#666666] hover:text-[#FF5500] hover:bg-[#FFF5F0] font-normal'}
                          `}
                        >
                          {sub.name}
                        </button>
                      );
                    })}
                    {/* 底部留白 */}
                    <div className="h-2"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </nav>

        {/* 右侧内容区 */}
        <main className="flex-1 flex flex-col bg-background relative min-w-0 overflow-hidden">
          {/* 沉浸式背景图 - 固定在顶部 */}
          <div className="absolute top-0 left-0 right-0 h-[280px] z-0 pointer-events-none">
            {categories.map(cat => (
              <div 
                key={cat.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  activeCategory === cat.id ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img 
                  src={cat.backgroundImage} 
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                {/* 渐变遮罩，确保文字可读性 */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#F5F5F5]" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
              </div>
            ))}
          </div>

          {/* 顶部吸顶区域容器 */}
          <div className="sticky top-0 z-40 transition-all duration-300">
            {/* 顶部状态栏 (猜你喜欢/距离) */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between text-white/90 relative z-50">
              {/* 场景化搜索入口 */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar absolute top-14 left-0 right-0 px-4 pb-2 z-40">
                <button
                  onClick={() => setFilters(prev => ({ ...prev, scenario: prev.scenario === 'weekend' ? null : 'weekend' }))}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 ${
                    filters.scenario === 'weekend' 
                      ? 'bg-[#FF5500]/90 text-white border-[#FF5500]' 
                      : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
                  }`}
                >
                  <span className="text-sm">🎡</span> 周末去哪儿
                </button>
                <button
                  onClick={() => setFilters(prev => ({ ...prev, scenario: prev.scenario === 'midnight' ? null : 'midnight' }))}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all flex items-center gap-1.5 ${
                    filters.scenario === 'midnight' 
                      ? 'bg-[#722ED1]/90 text-white border-[#722ED1]' 
                      : 'bg-white/20 text-white border-white/20 hover:bg-white/30'
                  }`}
                >
                  <span className="text-sm">🌙</span> 深夜食堂
                </button>
              </div>
              <div 
                className="flex items-center gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm cursor-pointer active:scale-95 transition-transform"
                onClick={() => {
                  // 滚动到推荐卡片
                  const recommendCard = document.getElementById('recommend-card');
                  recommendCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-xs font-medium tracking-wide">猜你喜欢 {guessYouLike.length > 0 ? `(${guessYouLike.length})` : ''}</span>
              </div>
              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-xs font-medium tracking-wide">距离 500m</span>
              </div>
            </div>

            {/* 筛选栏 - 吸顶时增加背景 */}
            <div className="px-4 py-2 mt-10 flex gap-2 overflow-x-auto no-scrollbar mask-linear-fade relative z-50 sticky-header-bg">
              {/* 综合排序/距离筛选 */}
              <div className="relative group">
                <button 
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer active:scale-95 ${filters.sort === 'distance' || filters.sort === 'sales' ? 'bg-[#FFF0E5] text-[#FF5500] font-bold border border-[#FF5500]' : 'bg-white/90 text-gray-600 border-gray-100 hover:bg-white'}`}
                >
                  {filters.sort === 'distance' ? '离我最近' : filters.sort === 'sales' ? '销量最高' : '综合排序'} 
                  <ChevronDown className={`w-3 h-3 ${filters.sort === 'distance' || filters.sort === 'sales' ? 'text-[#FF5500]' : 'text-[#999999]'}`} />
                </button>
                {/* 下拉菜单 */}
                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-border/50 z-50 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, sort: 'distance' }))}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.sort === 'distance' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}
                    >
                      离我最近
                    </button>
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, sort: 'sales' }))}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.sort === 'sales' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}
                    >
                      销量最高
                    </button>
                  </div>
                </div>
              </div>

              {/* 服务筛选 */}
              <div className="relative group">
                <button 
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer active:scale-95 ${filters.services.length > 0 ? 'bg-[#FFF0E5] text-[#FF5500] font-bold border border-[#FF5500]' : 'bg-white/90 text-gray-600 border-gray-100 hover:bg-white'}`}
                >
                  {filters.services.length > 0 ? `已选${filters.services.length}项` : '服务筛选'}
                  <ChevronDown className={`w-3 h-3 ${filters.services.length > 0 ? 'text-[#FF5500]' : 'text-[#999999]'}`} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-border/50 z-50 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    {[
                      { id: 'openNow', label: '营业中' },
                      { id: 'hasPrivateRoom', label: '有包间' },
                      { id: 'hasParking', label: '可停车' }
                    ].map(service => (
                      <button
                        key={service.id}
                        onClick={() => {
                          setFilters(prev => {
                            const newServices = prev.services.includes(service.id)
                              ? prev.services.filter(id => id !== service.id)
                              : [...prev.services, service.id];
                            return { ...prev, services: newServices };
                          });
                        }}
                        className={`w-full text-left px-3 py-2 text-xs rounded-md transition-colors flex items-center justify-between ${
                          filters.services.includes(service.id)
                            ? 'bg-[#FFF0E5] text-[#FF5500] font-bold'
                            : 'hover:bg-muted text-[#333333]'
                        }`}
                      >
                        {service.label}
                        {filters.services.includes(service.id) && <span className="text-[#FF5500]">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 价格筛选 */}
              <div className="relative group">
                <button 
                  className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer active:scale-95 ${filters.price !== 'all' ? 'bg-[#FFF0E5] text-[#FF5500] font-bold border border-[#FF5500]' : 'bg-white/90 text-gray-600 border-gray-100 hover:bg-white'}`}
                >
                  {filters.price === 'low' ? '¥200以下' : filters.price === 'mid' ? '¥200-500' : filters.price === 'high' ? '¥500以上' : '价格不限'}
                  <ChevronDown className={`w-3 h-3 ${filters.price !== 'all' ? 'text-[#FF5500]' : 'text-[#999999]'}`} />
                </button>
                <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-border/50 z-50 hidden group-hover:block animate-in fade-in zoom-in-95 duration-200">
                  <div className="py-1">
                    <button onClick={() => setFilters(prev => ({ ...prev, price: 'all' }))} className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.price === 'all' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}>不限</button>
                    <button onClick={() => setFilters(prev => ({ ...prev, price: 'low' }))} className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.price === 'low' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}>¥200以下</button>
                    <button onClick={() => setFilters(prev => ({ ...prev, price: 'mid' }))} className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.price === 'mid' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}>¥200-500</button>
                    <button onClick={() => setFilters(prev => ({ ...prev, price: 'high' }))} className={`w-full text-left px-4 py-2 text-xs hover:bg-muted ${filters.price === 'high' ? 'text-[#FF5500] font-bold' : 'text-[#333333]'}`}>¥500以上</button>
                  </div>
                </div>
              </div>

              {/* 好评优先 */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, sort: prev.sort === 'rating' ? 'distance' : 'rating' }))}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors cursor-pointer active:scale-95 ${filters.sort === 'rating' ? 'bg-[#FFF0E5] text-[#FF5500] font-bold border border-[#FF5500]' : 'bg-white/90 text-gray-600 border-gray-100 hover:bg-white'}`}
              >
                好评优先
              </button>

              {/* 人均高低 */}
              <button 
                onClick={() => setFilters(prev => ({ ...prev, sort: prev.sort === 'price_asc' ? 'price_desc' : 'price_asc' }))}
                className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer active:scale-95 ${filters.sort === 'price_asc' || filters.sort === 'price_desc' ? 'bg-[#FFF0E5] text-[#FF5500] font-bold border border-[#FF5500]' : 'bg-white/90 text-gray-600 border-gray-100 hover:bg-white'}`}
              >
                {filters.sort === 'price_asc' ? '人均从低到高' : filters.sort === 'price_desc' ? '人均从高到低' : '人均排序'}
                {filters.sort === 'price_asc' ? <ChevronUp className="w-3 h-3 text-[#FF5500]" /> : <ChevronDown className={`w-3 h-3 ${filters.sort === 'price_desc' ? 'text-[#FF5500]' : 'text-[#999999]'}`} />}
              </button>
            </div>
          </div>

          {/* 商家列表 - 虚拟滚动优化 */}
          <div className="flex-1 overflow-y-auto p-3 pb-20 relative z-0">
            {isLoading ? (
              // 加载骨架屏
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => <ShopSkeleton key={i} />)}
              </div>
            ) : filteredShops.length > 0 ? (
              <div className="flex flex-col gap-3">
                {/* 智能推荐卡片 - 列表首位 */}
                {(() => {
                  // 优先使用个性化推荐，如果没有则回退到分类最佳
                  const recommendShop = guessYouLike[0] || shops.filter(s => 
                    categories.find(c => c.id === activeCategory)?.subCategories?.some(sub => sub.id === s.sceneTheme)
                  ).sort((a, b) => b.rating - a.rating)[0];
                  
                  if (!recommendShop) return null;

                  return (
                    <div 
                      id="recommend-card"
                      onClick={() => {
                        setSelectedShop(recommendShop);
                        addToHistory(recommendShop.id);
                      }}
                      className="relative bg-gradient-to-r from-[#FFF0E5] to-white rounded-xl p-3 flex gap-3 shadow-md border border-[#FF5500]/20 cursor-pointer hover:shadow-lg transition-all group overflow-hidden shrink-0"
                    >
                      {/* 闪光特效 */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
                      
                      {/* 左侧图片区域 */}
                      <div className="relative w-[110px] h-[110px] flex-none">
                        <img src={recommendShop.imageUrl} alt={recommendShop.name} className="w-full h-full rounded-lg object-cover shadow-sm" />
                        <div className="absolute -top-1 -left-1 bg-gradient-to-r from-[#FF4D4F] to-[#FF9900] text-white text-[10px] font-bold px-2 py-0.5 rounded-tl-lg rounded-br-lg shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3 fill-white" />
                          {guessYouLike.includes(recommendShop) ? '猜你喜欢' : '今日甄选'}
                        </div>
                      </div>
                      
                      {/* 右侧内容区域 */}
                      <div className="flex-1 min-w-0 flex flex-col min-h-[110px]">
                        <div className="flex justify-between items-start relative min-w-0">
                          <h3 className="font-bold text-[#222222] text-[16px] leading-tight truncate flex-1 mr-12">{recommendShop.name}</h3>
                          <div className="flex gap-2 absolute top-0 right-0 z-10 pl-1 bg-gradient-to-l from-[#FFF0E5] via-[#FFF0E5] to-transparent">
                            <button onClick={(e) => { e.stopPropagation(); setShowShare(true); }}>
                              <Share2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button onClick={(e) => toggleFavorite(e, recommendShop.id)}>
                              <Heart className={`w-4 h-4 transition-colors ${favorites.includes(recommendShop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-gray-400 hover:text-gray-600'}`} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs min-w-0">
                          <div className="flex items-center text-[#FF6600] font-bold flex-shrink-0">
                            <span className="text-[14px]">{recommendShop.rating}</span>
                            <span className="text-[10px] ml-0.5">分</span>
                          </div>
                          <div className="w-[1px] h-3 bg-gray-300 flex-shrink-0"></div>
                          <span className="text-[#FF4D4F] font-bold flex-shrink-0">¥{recommendShop.price}/人</span>
                          <div className="w-[1px] h-3 bg-gray-300 flex-shrink-0"></div>
                          <div className="flex items-center min-w-0 flex-1">
                            <span className="text-[#666666] truncate">{recommendShop.area}</span>
                            <span className="text-[#666666] flex-shrink-0 ml-1">· {recommendShop.distance}</span>
                          </div>
                        </div>

                        <div className="mt-auto pt-2 border-t border-[#FF5500]/10">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="bg-[#FF4D4F] text-white text-[10px] px-1 rounded flex-none">团</span>
                            <span className="text-[#333333] text-[12px] font-medium truncate flex-1">{recommendShop.deals?.[0]?.title || recommendShop.dealTitle}</span>
                            <div className="flex items-center gap-1 flex-none">
                              <span className="text-[#FF4D4F] font-bold text-[12px]">¥{recommendShop.deals?.[0]?.price || recommendShop.price}</span>
                              <span className="text-[#999999] text-[10px] line-through decoration-gray-400 hidden xs:inline">¥{recommendShop.deals?.[0]?.originalPrice || (recommendShop.price * 1.5).toFixed(0)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {filteredShops.map((shop, index) => (
                <div 
                  key={shop.id}
                  onClick={() => {
                        setSelectedShop(shop);
                        addToHistory(shop.id);
                      }}
                  className="bg-white rounded-xl p-3 flex gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent cursor-pointer hover:shadow-md transition-all shrink-0"
                >
                  {/* 左侧图片区域 */}
                  <div className="relative w-[110px] h-[110px] flex-none">
                    <img src={shop.imageUrl} alt={shop.name} className="w-full h-full rounded-lg object-cover" />
                    {shop.ranking && (
                      <div className="absolute top-0 left-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg rounded-br-lg shadow-sm">
                        榜单TOP
                      </div>
                    )}
                  </div>
                  
                  {/* 右侧内容区 */}
                  <div className="flex-1 min-w-0 flex flex-col min-h-[110px]">
                    {/* 标题与操作栏 */}
                        <div className="flex justify-between items-start relative min-w-0">
                          <h3 className="font-bold text-[#333333] text-[16px] leading-tight truncate flex-1 mr-12">{shop.name}</h3>
                          <div className="flex gap-2 absolute top-0 right-0 z-10 bg-gradient-to-l from-white via-white to-transparent pl-2">
                            <button onClick={(e) => { e.stopPropagation(); setShowShare(true); }}>
                              <Share2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                            <button onClick={(e) => toggleFavorite(e, shop.id)}>
                              <Heart className={`w-4 h-4 transition-colors ${favorites.includes(shop.id) ? 'fill-[#FF4D4F] text-[#FF4D4F]' : 'text-gray-400 hover:text-gray-600'}`} />
                            </button>
                          </div>
                        </div>

                    {/* 评分与价格 */}
                        <div className="flex items-center gap-2 mt-1 flex-wrap text-xs min-w-0">
                          <div className="flex items-center text-[#FF6600] font-bold flex-shrink-0">
                            <span>{shop.rating}分</span>
                          </div>
                          <div className="w-[1px] h-3 bg-gray-300 flex-shrink-0"></div>
                          <span className="text-[#666666] flex-shrink-0">¥{shop.price}/人</span>
                          <div className="w-[1px] h-3 bg-gray-300 flex-shrink-0"></div>
                          <span className="text-[#999999] flex-shrink-0">{shop.distance}</span>
                        </div>

                    {/* 榜单标签 */}
                    {shop.ranking && (
                      <div className="mt-1">
                        <span className="inline-block bg-[#FFF5E5] text-[#FF8800] text-[11px] px-1.5 py-0.5 rounded">
                          {shop.ranking}
                        </span>
                      </div>
                    )}

                    {/* 标签与服务 */}
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {shop.tags.slice(0, 3).map((tag, i) => (
                        <span key={i} className="text-[10px] px-1 py-0.5 border border-[#E0E0E0] text-[#666666] rounded">
                          {tag}
                        </span>
                      ))}
                      {shop.services?.openNow && (
                        <span className="text-[10px] px-1 py-0.5 bg-green-50 text-green-600 rounded border border-green-100">
                          营业中
                        </span>
                      )}
                    </div>

                    {/* 团购列表 (仅展示前2条) */}
                    {shop.deals && shop.deals.length > 0 && (
                      <div className="mt-auto pt-2 space-y-1">
                        {shop.deals.slice(0, 2).map((deal, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <span className="bg-[#FFEEF0] text-[#FF4D4F] text-[10px] font-bold px-1 py-0.5 rounded">团</span>
                            <span className="text-[#333333] text-[12px] truncate flex-1">{deal.title}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-[#FF4D4F] font-bold text-[14px]">¥{deal.price}</span>
                              <span className="text-[#999999] text-[10px] line-through">¥{deal.originalPrice}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>
            ) : (
              // 空状态
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p>暂无符合条件的店铺</p>
                <button 
                  onClick={() => setFilters({ price: 'all', distance: 'all', cuisine: 'all', district: null, area: null, services: [], scenario: null, sort: 'distance' })}
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
