import { useState, useEffect } from "react";
import { MapPin, Search, ChevronDown, Flame } from "lucide-react";
import { PACKAGE_TYPES, SCENE_THEMES, MOCK_SHOPS } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MapOverlay } from "@/components/MapOverlay";
import { ShopSkeleton } from "@/components/ShopSkeleton";

export default function Home() {
  const [activePackageType, setActivePackageType] = useState<string>('couple');
  const [activeSceneTheme, setActiveSceneTheme] = useState<string>('date');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeShopId, setActiveShopId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Get current scenes based on active package type
  const currentScenes = SCENE_THEMES.filter(scene => scene.packageTypeId === activePackageType);

  // Filter shops based on active package type and scene theme
  const filteredShops = MOCK_SHOPS.filter(shop => {
    const packageMatch = shop.packageType === activePackageType;
    const sceneMatch = shop.sceneTheme === activeSceneTheme;
    return packageMatch && sceneMatch;
  });

  // Auto-select first package type on load
  useEffect(() => {
    if (PACKAGE_TYPES.length > 0) {
      setActivePackageType(PACKAGE_TYPES[0].id);
    }
  }, []);

  // Auto-select first scene when package type changes
  useEffect(() => {
    const firstScene = SCENE_THEMES.find(scene => scene.packageTypeId === activePackageType);
    if (firstScene) {
      setActiveSceneTheme(firstScene.id);
    }
  }, [activePackageType]);

  // Simulate loading delay when changing filters
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activePackageType, activeSceneTheme]);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans">
      {/* Header - Fixed Top */}
      <header className="flex-none bg-white z-50 px-4 py-2 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <span className="font-bold text-lg text-[#333]">乌鲁木齐市</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-1 text-[#FF6B00] font-medium text-xs bg-[#FFF5E5] px-2 py-1 rounded-full">
            <span>高德扫街榜</span>
            <Flame className="w-3 h-3 fill-current" />
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-5 text-[13px] text-[#666] overflow-x-auto hide-scrollbar pb-1">
          <span className="font-bold text-[#333] shrink-0 text-[15px]">附近</span>
          <span className="shrink-0">排序</span>
          <span className="text-[#FF6B00] bg-[#FFF5E5] px-2 py-0.5 rounded shrink-0 font-medium">发现好店</span>
          <span className="shrink-0">全部美食</span>
          <span className="shrink-0">火锅</span>
          <span className="shrink-0">烧烤</span>
          <span className="shrink-0">更多</span>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Level 1 Sidebar - Package Types (Amap Style) */}
        <div className="w-[88px] bg-[#F7F8FA] flex-none overflow-y-auto hide-scrollbar flex flex-col border-r border-gray-100 pb-20">
          {PACKAGE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setActivePackageType(type.id)}
              className={cn(
                "relative py-6 px-1 text-center transition-all duration-200 ease-in-out w-full flex flex-col items-center justify-center gap-1.5 active:scale-95",
                activePackageType === type.id 
                  ? "bg-white" 
                  : "bg-[#F7F8FA] hover:bg-[#F0F2F5]"
              )}
            >
              {/* Wheat Ear Decoration (Left) */}
              <div className={cn(
                "absolute left-1 top-1/2 -translate-y-1/2 w-3 h-8 bg-contain bg-no-repeat opacity-50",
                activePackageType === type.id ? "text-[#FF4D4F]" : "text-gray-300"
              )} style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnYyMCIvPjxwYXRoIGQ9Ik0xMiA2bC00IDQiLz48cGF0aCBkPSJNMTIgMTBsLTQgNCIvPjxwYXRoIGQ9Ik0xMiAxNGwtNCA0Ii8+PC9zdmc+')" }}></div>
              
              {/* Wheat Ear Decoration (Right) */}
              <div className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2 w-3 h-8 bg-contain bg-no-repeat opacity-50 rotate-180",
                activePackageType === type.id ? "text-[#FF4D4F]" : "text-gray-300"
              )} style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMTIgMnYyMCIvPjxwYXRoIGQ9Ik0xMiA2bC00IDQiLz48cGF0aCBkPSJNMTIgMTBsLTQgNCIvPjxwYXRoIGQ9Ik0xMiAxNGwtNCA0Ii8+PC9zdmc+')" }}></div>

              {/* Main Title */}
              <span className={cn(
                "text-[15px] leading-tight transition-colors duration-200 z-10",
                activePackageType === type.id ? "font-bold text-[#FF4D4F]" : "font-medium text-[#666]"
              )}>
                {type.name.replace('套餐', '')}
              </span>

              {/* Sub Title Capsule */}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full z-10 transform scale-90",
                activePackageType === type.id 
                  ? "bg-[#FF4D4F] text-white font-medium" 
                  : "bg-[#E5E5E5] text-[#999]"
              )}>
                {activePackageType === type.id ? "精选上榜" : "全城·2025"}
              </span>
            </button>
          ))}
        </div>

        {/* Level 2 Sidebar - Scene Themes (Amap Style - Text Only) */}
        <div className="w-[100px] bg-white flex-none overflow-y-auto hide-scrollbar flex flex-col border-r border-gray-100 pb-20">
          {currentScenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => setActiveSceneTheme(scene.id)}
              className={cn(
                "relative py-4 px-4 text-left transition-all duration-200 ease-in-out w-full flex items-center active:scale-95",
                activeSceneTheme === scene.id 
                  ? "bg-white" 
                  : "hover:bg-gray-50"
              )}
            >
              <span className={cn(
                "text-[15px] truncate transition-colors duration-200",
                activeSceneTheme === scene.id ? "font-bold text-[#FF4D4F]" : "text-[#333] font-medium"
              )}>
                {scene.name}
              </span>
            </button>
          ))}
        </div>

        {/* Right Content - Shop List */}
        <div className="flex-1 bg-white overflow-y-auto p-3 pb-20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-[#999]">
              {isLoading ? "加载中..." : `精选 ${filteredShops.length} 家入榜`}
            </div>
            <div className="bg-[#FFF5E5] text-[#FF6B00] text-[10px] px-1.5 py-0.5 rounded">距离优先</div>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 3 }).map((_, i) => (
                <ShopSkeleton key={i} />
              ))
            ) : (
              // Real Data
              <>
                {filteredShops.map((shop, index) => (
                  <div 
                    key={shop.id} 
                    onClick={() => {
                      setActiveShopId(shop.id);
                      setIsMapOpen(true);
                    }}
                    className="flex flex-col gap-3 cursor-pointer group active:scale-[0.99] transition-transform duration-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Image Gallery */}
                    <div className="flex gap-1 h-28 overflow-hidden rounded-lg">
                      <div className="flex-1 relative">
                        <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                        {index < 3 && (
                          <div className="absolute top-0 left-0 bg-[#C8A064] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                            TOP {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="w-1/3 hidden sm:block">
                        <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-90" />
                      </div>
                      <div className="w-1/3 hidden sm:block relative">
                        <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">
                          1.0k+
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-[16px] text-[#333] leading-tight">{shop.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-[#999] mb-2">
                        <span>{shop.sceneTheme === 'date' ? '约会' : '娱乐'}</span>
                        <span>¥{shop.price}/人</span>
                        <span className="text-[#333]">{shop.distance}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <span className="text-[10px] text-[#8B572A] bg-[#FDF5E6] px-1.5 py-0.5 rounded border border-[#F5E6D3]">
                          扫街榜
                        </span>
                        {shop.tags.map(tag => (
                          <span key={tag} className="text-[10px] text-[#666] border border-[#EEE] px-1.5 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Deals Section */}
                      {shop.deals && shop.deals.length > 0 && (
                        <div className="mb-2 space-y-1">
                          {shop.deals.map((deal, i) => (
                            <div key={i} className="flex items-center justify-between bg-[#FFF0F0] px-2 py-1.5 rounded border border-[#FFE5E5]">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <div className="bg-[#FF4D4F] text-white text-[10px] px-1 rounded flex-shrink-0">惠</div>
                                <span className="text-[11px] font-medium text-[#333] truncate">{deal.title}</span>
                                {deal.tags.map(tag => (
                                  <span key={tag} className="text-[10px] text-[#FF4D4F] border border-[#FFCCCC] px-1 rounded hidden sm:inline-block">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex items-baseline gap-1 flex-shrink-0">
                                <span className="text-[13px] font-bold text-[#FF4D4F]">¥{deal.price}</span>
                                <span className="text-[10px] text-[#999] line-through">¥{deal.originalPrice}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Review Quote */}
                      <div className="bg-[#FFF8E1] p-2 rounded-lg flex gap-2 items-start">
                        <span className="text-[#FFB800] text-xl leading-none">“</span>
                        <p className="text-[11px] text-[#8B572A] line-clamp-2 flex-1 pt-0.5">
                          {shop.description}
                        </p>
                        <span className="text-[10px] text-[#999] whitespace-nowrap pt-0.5">{shop.reviewCount}人也在说</span>
                      </div>
                      
                      {/* Bottom Info */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-[#FF4D4F] text-[10px] font-medium">
                          <Flame className="w-3 h-3 fill-current" />
                          <span>近180天 {shop.reviewCount * 3} 回头客</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#4A90E2] font-bold text-[11px]">
                          <span>综合评分 {shop.rating}</span>
                          <span className="text-[#CCC] text-[10px]">&gt;</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Divider */}
                    <div className="h-px bg-[#F5F5F5] w-full mt-2" />
                  </div>
                ))}
                
                {/* Empty State */}
                {filteredShops.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <Search className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">该分类下暂无推荐商家</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Map Button */}
      <button 
        onClick={() => setIsMapOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-[#3B82F6] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-50 active:scale-90"
      >
        <MapPin className="w-6 h-6" />
        <span className="sr-only">地图模式</span>
      </button>

      <MapOverlay 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        shops={MOCK_SHOPS.filter(s => s.packageType === activePackageType)} // Pass all shops for the current package type
        activeShopId={activeShopId}
        activeSceneId={activePackageType} // Pass active package type ID
      />
    </div>
  );
}
