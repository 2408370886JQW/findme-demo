import React, { useState, useEffect, useRef } from 'react';
import { Search, Map as MapIcon, Navigation2, Star, ThumbsUp, ChevronDown, ChevronUp, MapPin, Locate, Heart, X, ChevronLeft, ChevronRight, Share2, Moon, Sun, MessageSquare, Camera, Sparkles, Trophy } from 'lucide-react';
import { categories, shops, type Shop, type Category, type SubCategory } from '@/lib/data';
import { MapOverlay } from '@/components/MapOverlay';
import { ShareModal } from '@/components/ShareModal';
import { ShopSkeleton } from '@/components/ShopSkeleton';
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
  const [filters, setFilters] = useState({
    price: 'all', // all, low (<200), mid (200-500), high (>500)
    distance: 'all', // all, near (<1km), mid (1-3km), far (>3km)
    cuisine: 'all' // all, western, bar, bbq, etc.
  });
  const [guessYouLike, setGuessYouLike] = useState<Shop[]>([]);
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
      case 'couple': return '甜蜜升温';
      case 'bestie': return '轻松时刻';
      case 'brother': return '畅所欲言';
      case 'fun': return '氛围拉满';
      default: return '精选推荐';
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

      {/* 主体内容区 */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 收藏夹浮层 */}
        {showFavorites && (
          <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-xl flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 fill-[#FF4D4F] text-[#FF4D4F]" />
                我的收藏
              </h2>
              <button 
                onClick={() => setShowFavorites(false)}
                className="p-2 hover:bg-muted rounded-full text-muted-foreground"
              >
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
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                    超值套餐
                  </h2>
                  <div className="space-y-3">
                    {selectedShop.deals?.map((deal, i) => (
                      <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-foreground mb-1">{deal.title}</h3>
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
                          <div className="text-muted-foreground/50 text-xs line-through">¥{deal.originalPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 评价板块 */}
                <div className="mb-8 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#FF4D4F] rounded-full"></span>
                      用户评价
                    </h2>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <span>4.9</span>
                      <div className="flex text-[#FF9900]">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* 评价列表 */}
                  <div className="space-y-4">
                    {selectedShop.reviews && selectedShop.reviews.length > 0 ? (
                      selectedShop.reviews.map((review, i) => (
                        <div key={i} className="bg-card/50 rounded-xl p-3 border border-border/50">
                          <div className="flex items-start gap-3 mb-2">
                            <img src={review.userAvatar} alt={review.userName} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <span className="text-sm font-bold text-foreground">{review.userName}</span>
                                <div className="flex flex-col items-end">
                                  <div className="flex text-[#FF9900] scale-75 origin-right">
                                    {[...Array(review.rating)].map((_, idx) => (
                                      <Star key={idx} className="w-3 h-3 fill-current" />
                                    ))}
                                  </div>
                                  <span className="text-[10px] text-muted-foreground">{review.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-foreground mb-2 leading-relaxed">{review.content}</p>
                          {review.images && review.images.length > 0 && (
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                              {review.images.map((img, idx) => (
                                <img key={idx} src={img} alt="review" className="w-24 h-24 rounded-lg object-cover flex-none" />
                              ))}
                            </div>
                          )}
                          {review.tags && review.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {review.tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p className="text-sm">暂无评价，快来抢沙发吧！</p>
                      </div>
                    )}
                  </div>

                  {/* 写评价按钮 */}
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
        <nav className="w-[100px] flex-none bg-muted/30 backdrop-blur-sm flex flex-col overflow-y-auto border-r border-border/50 no-scrollbar z-10 transition-all duration-300">
          <div className="flex flex-col py-2 pb-20 gap-4">
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              const isExpanded = expandedCategory === category.id;
              const subtitle = getCategorySubtitle(category.id);
              
              return (
                <div key={category.id} className="flex flex-col">
                  {/* 一级菜单项 - 榜单头部风格 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                    className={`
                      relative w-full py-2 flex flex-col items-center justify-center gap-0.5 transition-all duration-300 group
                    `}
                  >
                    {/* 装饰性麦穗效果 (CSS模拟) */}
                    <div className="flex items-center justify-center w-full relative">
                      {/* 左麦穗 */}
                      <div className={`
                        absolute left-1 top-1/2 -translate-y-1/2 w-3 h-6 
                        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY5OTAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTcgMTBhMiAyIDAgMCAxIDIgMnY2Ii8+PHBhdGggZD0iTTUgMTJhMiAyIDAgMCAxIDIgMnY0Ii8+PHBhdGggZD0iTTMgMTRhMiAyIDAgMCAxIDIgMnYyIi8+PC9zdmc+')] 
                        bg-contain bg-no-repeat opacity-0 transition-opacity duration-300
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}></div>
                      
                      {/* 右麦穗 */}
                      <div className={`
                        absolute right-1 top-1/2 -translate-y-1/2 w-3 h-6 
                        bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY5OTAwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE3IDEwYTIgMiAwIDAgMCAtMiAydjYiLz48cGF0aCBkPSJNMTkgMTJhMiAyIDAgMCAwIC0yIDJ2NCIvPjxwYXRoIGQ9Ik0yMSAxNGEyIDIgMCAwIDAgLTIgMnYyIi8+PC9zdmc+')] 
                        bg-contain bg-no-repeat opacity-0 transition-opacity duration-300
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}></div>

                      <span className={`
                        text-[13px] font-bold tracking-wide transition-colors duration-300 whitespace-nowrap z-10
                        ${isActive ? 'text-foreground scale-105' : 'text-muted-foreground/70'}
                      `}>
                        {category.name}
                      </span>
                    </div>
                    
                    {/* 副标题已移除 */}
                  </button>

                  {/* 二级菜单列表 (纯文本列表) */}
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
                  `}>
                    <div className="flex flex-col py-1 gap-1">
                      {category.subCategories.map((sub) => {
                        const isSubActive = activeSubCategory === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={(e) => handleSubCategoryClick(e, sub.id)}
                            className={`
                              w-full py-1.5 text-center transition-all duration-200 relative flex items-center justify-center gap-1
                              ${isSubActive 
                                ? 'text-[#FF4D4F] font-bold' 
                                : 'text-muted-foreground hover:text-foreground'}
                            `}
                          >
                            {/* 选中态小红点 */}
                            {isSubActive && (
                              <div className="w-1 h-1 rounded-full bg-[#FF4D4F]" />
                            )}
                            <span className={`text-[12px] ${isSubActive ? 'scale-105' : ''}`}>
                              {sub.name}
                            </span>
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
        <main className="flex-1 flex flex-col bg-background relative min-w-0 overflow-hidden">
          {/* 顶部筛选栏 - 移动端横向滚动优化 */}
          <div className="flex-none px-3 py-2 bg-background/80 backdrop-blur-md z-10 border-b border-border/50 flex flex-col gap-2">
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
                    className="flex-none w-48 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-2 flex gap-2 cursor-pointer hover:bg-card/80 transition-colors"
                  >
                    <img src={shop.imageUrl} className="w-12 h-12 rounded-md object-cover flex-none" alt={shop.name} />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] px-1 rounded bg-[#FF4D4F] text-white flex-none">荐</span>
                        <h4 className="text-xs font-bold truncate text-foreground">{shop.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-[#FF9900] font-bold">★{shop.rating}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{shop.sceneTheme === 'drink' ? '深夜微醺' : '当下热门'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 筛选标签 */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button 
                onClick={() => setFilters(prev => ({ ...prev, price: prev.price === 'all' ? 'low' : 'all' }))}
                className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filters.price !== 'all' 
                    ? 'bg-[#FF4D4F]/10 text-[#FF4D4F] border-[#FF4D4F]/20' 
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                }`}
              >
                价格不限
              </button>
              <button 
                onClick={() => setFilters(prev => ({ ...prev, distance: prev.distance === 'all' ? 'near' : 'all' }))}
                className={`flex-none px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                  filters.distance !== 'all' 
                    ? 'bg-[#FF4D4F]/10 text-[#FF4D4F] border-[#FF4D4F]/20' 
                    : 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
                }`}
              >
                距离不限
              </button>
              <button className="flex-none px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted transition-colors">
                好评优先
              </button>
              <button className="flex-none px-3 py-1 rounded-full text-xs font-medium bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted transition-colors">
                人均高低
              </button>
            </div>
          </div>

          {/* 商家列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 pb-20">
            {isLoading ? (
              // 加载骨架屏
              <>
                <ShopSkeleton />
                <ShopSkeleton />
                <ShopSkeleton />
              </>
            ) : filteredShops.length > 0 ? (
              filteredShops.map((shop) => (
                <div 
                  key={shop.id}
                  onClick={() => setSelectedShop(shop)}
                  className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 hover:shadow-md transition-all duration-300 group"
                >
                  {/* 卡片上半部分：图片和基本信息 */}
                  <div className="flex p-3 gap-3">
                    <div className="relative w-24 h-24 flex-none">
                      <img 
                        src={shop.imageUrl} 
                        alt={shop.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {shop.rating >= 4.8 && (
                        <div className="absolute -top-1 -left-1 bg-[#FF4D4F] text-white text-[10px] px-1.5 py-0.5 rounded-br-lg rounded-tl-lg shadow-sm z-10">
                          精选
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="text-base font-bold text-foreground truncate pr-2">{shop.name}</h3>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-1">{shop.distance}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5 text-[#FF9900] text-xs font-bold">
                            <Star className="w-3 h-3 fill-current" />
                            {shop.rating}
                          </div>
                          <span className="text-xs text-muted-foreground">¥{shop.price}/人</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {shop.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-muted/50 text-muted-foreground rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 卡片下半部分：优惠套餐 (如果有) */}
                  {shop.deals && shop.deals.length > 0 && (
                    <div className="px-3 pb-3 pt-0">
                      <div className="bg-[#FF4D4F]/5 rounded-lg p-2 flex items-center justify-between border border-[#FF4D4F]/10">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="flex-none w-4 h-4 bg-[#FF4D4F] text-white text-[10px] flex items-center justify-center rounded">团</span>
                          <span className="text-xs text-foreground truncate">{shop.deals[0].title}</span>
                        </div>
                        <div className="flex items-baseline gap-1 flex-none ml-2">
                          <span className="text-[#FF4D4F] font-bold text-sm">¥{shop.deals[0].price}</span>
                          <span className="text-muted-foreground/50 text-[10px] line-through">¥{shop.deals[0].originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <MapPin className="w-12 h-12 mb-2 opacity-20" />
                <p>该分类下暂无商家</p>
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

        {/* 分享弹窗 */}
        {showShare && selectedShop && (
          <ShareModal 
            shop={selectedShop} 
            onClose={() => setShowShare(false)} 
          />
        )}

        {/* 地图覆盖层 */}
        {showMap && (
          <MapOverlay 
            shops={filteredShops} 
            userLocation={userLocation}
            onClose={() => setShowMap(false)}
            activeShopId={selectedShop?.id}
          />
        )}
      </div>
    </div>
  );
}
