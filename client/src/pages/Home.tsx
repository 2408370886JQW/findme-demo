import { useState, useEffect } from "react";
import { MapPin, Search, ChevronDown, Star, Flame, ThumbsUp, Navigation, ChevronRight } from "lucide-react";
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
      // Toggle sub-menu if clicking same scene? No, keep it simple for now.
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
            <span className="font-bold text-lg">乌鲁木齐市</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2 text-amber-600 font-medium text-sm bg-amber-50 px-2 py-1 rounded-full">
            <span>高德扫街榜</span>
            <Flame className="w-3 h-3 fill-current" />
          </div>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-4 text-sm text-gray-600 overflow-x-auto hide-scrollbar pb-1">
          <span className="font-bold text-black shrink-0">附近</span>
          <span className="shrink-0">排序</span>
          <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded shrink-0">发现好店</span>
          <span className="shrink-0">全部美食</span>
          <span className="shrink-0">火锅</span>
          <span className="shrink-0">烧烤</span>
          <span className="shrink-0">更多</span>
        </div>
      </header>

      {/* Main Content - Dual Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Scene Navigation */}
        <div className="w-28 bg-[#F7F8FA] flex-none overflow-y-auto hide-scrollbar flex flex-col">
          <div className="flex flex-col py-2">
            {SCENES.map((scene) => (
              <div key={scene.id} className="flex flex-col">
                <button
                  onClick={() => handleSceneChange(scene.id)}
                  className={cn(
                    "relative py-4 px-2 text-xs font-medium text-center transition-colors w-full",
                    activeScene === scene.id 
                      ? "bg-white text-red-500 font-bold" 
                      : "text-gray-500 hover:bg-gray-100"
                  )}
                >
                  {activeScene === scene.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-red-500 rounded-r-full" />
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <span className="leading-tight">{scene.name}</span>
                    {activeScene === scene.id && <span className="text-[10px] scale-90 text-red-400 font-normal">精选上榜</span>}
                  </div>
                </button>
                
                {/* Sub Categories */}
                {activeScene === scene.id && scene.subCategories && (
                  <div className="bg-white w-full pb-2 animate-in slide-in-from-top-2 duration-200">
                    {scene.subCategories.map(sub => (
                      <button
                        key={sub.id}
                        onClick={() => setActiveSubScene(sub.id)}
                        className={cn(
                          "w-full py-2 px-4 text-xs text-left transition-colors flex items-center justify-between",
                          activeSubScene === sub.id 
                            ? "text-red-500 bg-red-50 font-medium" 
                            : "text-gray-500 hover:bg-gray-50"
                        )}
                      >
                        <span className="truncate">{sub.name}</span>
                        {activeSubScene === sub.id && <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
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
            <div className="text-xs text-gray-400">精选 {filteredShops.length} 家入榜</div>
            <div className="bg-orange-50 text-orange-600 text-xs px-2 py-1 rounded">距离优先</div>
          </div>

          <div className="space-y-6">
            {filteredShops.map((shop, index) => (
              <div 
                key={shop.id} 
                onClick={() => {
                  setActiveShopId(shop.id);
                  setIsMapOpen(true);
                }}
                className="flex flex-col gap-3 cursor-pointer group"
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
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{shop.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{shop.subCategory === 'eat' ? '美食' : shop.subCategory === 'drink' ? '饮品' : '娱乐'}</span>
                    <span>¥{shop.price}/人</span>
                    <span className="text-blue-500 font-medium">{shop.distance}</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-[10px] text-[#8B572A] bg-[#FDF5E6] px-1.5 py-0.5 rounded border border-[#F5E6D3]">
                      扫街榜
                    </span>
                    {shop.tags.map(tag => (
                      <span key={tag} className="text-[10px] text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Review Quote */}
                  <div className="bg-[#FFF7E6] p-2 rounded-lg flex gap-2 items-start">
                    <span className="text-orange-400 text-xl leading-none">“</span>
                    <p className="text-xs text-[#8B572A] line-clamp-2 flex-1 pt-0.5">
                      {shop.description}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap pt-0.5">{shop.reviewCount}人也在说</span>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 text-blue-500 text-xs font-medium">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>近180天 {shop.reviewCount * 3} 回头客</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-bold text-sm">
                      <span>综合评分 {shop.rating}</span>
                      <span className="text-gray-300 text-xs">&gt;</span>
                    </div>
                  </div>
                </div>
                
                {/* Divider */}
                <div className="h-px bg-gray-100 w-full mt-2" />
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
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors z-50"
      >
        <MapPin className="w-6 h-6" />
        <span className="sr-only">地图模式</span>
      </button>

      <MapOverlay 
        isOpen={isMapOpen} 
        onClose={() => setIsMapOpen(false)} 
        shops={filteredShops}
        activeShopId={activeShopId}
      />
    </div>
  );
}
