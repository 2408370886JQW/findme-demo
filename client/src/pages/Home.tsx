import { useState, useEffect } from "react";
import { MapPin, Search, ChevronDown, Star, Flame, ThumbsUp, Navigation, ChevronRight, Locate } from "lucide-react";
import { SCENES, MOCK_SHOPS, Shop } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapOverlay } from "@/components/MapOverlay";

export default function Home() {
  const [activeScene, setActiveScene] = useState<string>('date');
  const [activeSubScene, setActiveSubScene] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeShopId, setActiveShopId] = useState<string | undefined>(undefined);

  // Filter shops based on active scene and sub-scene
  const filteredShops = MOCK_SHOPS.filter(shop => {
    const sceneMatch = activeScene === 'all' || shop.category === activeScene;
    const subSceneMatch = !activeSubScene || shop.subCategory === activeSubScene;
    return sceneMatch && subSceneMatch;
  });

  // Auto-select first scene on load
  useEffect(() => {
    if (SCENES.length > 0) {
      setActiveScene(SCENES[0].id);
    }
  }, []);

  // Reset sub-scene when changing main scene
  const handleSceneChange = (sceneId: string) => {
    if (activeScene === sceneId) {
      return;
    }
    setActiveScene(sceneId);
    setActiveSubScene(null);
  };

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

      {/* Main Content - Dual Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scene Navigation */}
        <div className="w-[92px] bg-[#F7F8FA] flex-none overflow-y-auto hide-scrollbar flex flex-col pb-20">
          <div className="flex flex-col">
            {SCENES.map((scene) => (
              <div key={scene.id} className="flex flex-col">
                <button
                  onClick={() => handleSceneChange(scene.id)}
                  className={cn(
                    "relative py-4 px-1 text-center transition-all duration-200 ease-in-out w-full flex flex-col items-center justify-center gap-0.5 active:scale-95",
                    activeScene === scene.id 
                      ? "bg-white" 
                      : "bg-[#F7F8FA] hover:bg-[#F0F2F5]"
                  )}
                >
                  {activeScene === scene.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-[#FF4D4F] rounded-r-full" />
                  )}
                  <span className={cn(
                    "text-[13px] leading-tight transition-colors duration-200",
                    activeScene === scene.id ? "font-bold text-[#FF4D4F]" : "font-medium text-[#666]"
                  )}>
                    {scene.name}
                  </span>
                  {activeScene === scene.id && (
                    <span className="text-[10px] scale-90 text-[#FF4D4F] font-normal mt-0.5 bg-[#FFF0F0] px-1 rounded-sm animate-in fade-in zoom-in duration-200">
                      精选上榜
                    </span>
                  )}
                </button>
                
                {/* Sub Categories */}
                {activeScene === scene.id && scene.subCategories && (
                  <div className="bg-white w-full pb-2 animate-in slide-in-from-top-2 duration-200 flex flex-col items-center">
                    {scene.subCategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubScene(sub.id)}
                        className={cn(
                          "w-[76px] py-2 px-1 text-center transition-all duration-200 ease-in-out flex items-center justify-center gap-1.5 rounded-md my-0.5 active:scale-95",
                          activeSubScene === sub.id 
                            ? "bg-[#FFF0F0]" 
                            : "hover:bg-gray-50"
                        )}
                      >
                        <sub.icon className={cn(
                          "w-3 h-3 shrink-0 transition-colors duration-200", 
                          activeSubScene === sub.id ? "text-[#FF4D4F]" : "text-[#999]"
                        )} />
                        <span className={cn(
                          "text-[11px] truncate transition-colors duration-200",
                          activeSubScene === sub.id ? "text-[#FF4D4F] font-medium" : "text-[#666]"
                        )}>
                          {sub.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Content - Shop List */}
        <div className="flex-1 bg-white overflow-y-auto p-3 pb-20">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] text-[#999]">精选 {filteredShops.length} 家入榜</div>
            <div className="bg-[#FFF5E5] text-[#FF6B00] text-[10px] px-1.5 py-0.5 rounded">距离优先</div>
          </div>

          <div className="space-y-6">
            {filteredShops.map((shop, index) => (
              <div 
                key={shop.id} 
                onClick={() => {
                  setActiveShopId(shop.id);
                  setIsMapOpen(true);
                }}
                className="flex flex-col gap-3 cursor-pointer group active:scale-[0.99] transition-transform duration-100"
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
                    <span>{shop.subCategory === 'eat' ? '美食' : shop.subCategory === 'drink' ? '饮品' : '娱乐'}</span>
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

                  {/* Deals Section - New Feature */}
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
        shops={MOCK_SHOPS.filter(s => s.category === activeScene)} // Pass all shops for the current scene
        activeShopId={activeShopId}
        activeSceneId={activeScene} // Pass active scene ID
      />
    </div>
  );
}
