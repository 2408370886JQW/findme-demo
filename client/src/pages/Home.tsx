import { useState, useEffect, useRef } from "react";
import { MapPin, Search, ChevronRight, Navigation, Star, Heart, Share2, ArrowLeft, RotateCcw } from "lucide-react";
import { PACKAGE_TYPES, SCENE_THEMES, MOCK_SHOPS, Shop, PackageType, SceneTheme } from "@/lib/data";
import { MapOverlay } from "@/components/MapOverlay";
import { ShopSkeleton } from "@/components/ShopSkeleton";
import { cn } from "@/lib/utils";

export default function Home() {
  const [activePackageType, setActivePackageType] = useState<string>(PACKAGE_TYPES[0].id);
  const [activeSceneTheme, setActiveSceneTheme] = useState<string>(SCENE_THEMES.filter(t => t.packageTypeId === PACKAGE_TYPES[0].id)[0].id);
  const [isMapMode, setIsMapMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPackage, setExpandedPackage] = useState<string | null>(PACKAGE_TYPES[0].id);
  
  // Filter shops based on active selection
  const filteredShops = MOCK_SHOPS.filter(shop => 
    shop.packageType === activePackageType && 
    shop.sceneTheme === activeSceneTheme
  );

  // Handle package type change
  const handlePackageTypeChange = (typeId: string) => {
    if (expandedPackage === typeId) {
      setExpandedPackage(null); // Collapse if already expanded
      return;
    }

    setExpandedPackage(typeId);
    setActivePackageType(typeId);
    
    // Auto-select first scene of the new package type
    const firstScene = SCENE_THEMES.find(t => t.packageTypeId === typeId);
    if (firstScene) {
      setActiveSceneTheme(firstScene.id);
    }
    
    // Trigger loading state
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  // Handle scene theme change
  const handleSceneThemeChange = (sceneId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click
    setActiveSceneTheme(sceneId);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Close accordion when clicking outside
  const sidebarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setExpandedPackage(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden font-sans text-gray-900">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm z-20 shrink-0 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
            F
          </div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
            FIND ME
          </h1>
        </div>
        
        <div className="flex-1 mx-4 max-w-md">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="搜索商家、套餐..." 
              className="w-full bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button 
          onClick={() => setIsMapMode(!isMapMode)}
          className={cn(
            "p-2 rounded-full transition-all duration-300 relative overflow-hidden group",
            isMapMode ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          <div className="relative z-10 flex items-center gap-1 px-1">
            {isMapMode ? <ArrowLeft className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            <span className="text-sm font-medium hidden sm:inline-block">
              {isMapMode ? "列表" : "地图"}
            </span>
          </div>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar - Accordion Style */}
        <aside 
          ref={sidebarRef}
          className="w-[100px] bg-[#F5F5F5] flex flex-col shrink-0 overflow-y-auto border-r border-gray-200 no-scrollbar z-10"
        >
          <div className="py-4 space-y-6 flex flex-col items-center">
            {PACKAGE_TYPES.map((type) => {
              const isActive = activePackageType === type.id;
              const isExpanded = expandedPackage === type.id;
              
              return (
                <div key={type.id} className="w-full flex flex-col items-center">
                  {/* Level 1 Menu Item */}
                  <button
                    onClick={() => handlePackageTypeChange(type.id)}
                    className="relative group flex flex-col items-center justify-center w-full px-1 transition-all duration-300"
                  >
                    {/* Wheat Decoration - Left */}
                    <div className={cn(
                      "absolute left-1 top-1/2 -translate-y-1/2 w-3 h-8 bg-[url('/wheat-left.svg')] bg-contain bg-no-repeat transition-opacity duration-300",
                      isActive ? "opacity-100 brightness-125 saturate-150" : "opacity-0"
                    )} style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCA2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY0RDRGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDYwVjQiLz48cGF0aCBkPSJNMTIgNTZMNCA1MiIvPjxwYXRoIGQ9Ik0xMiA0OEw0IDQ0Ii8+PHBhdGggZD0iTTEyIDQwTDQgMzYiLz48cGF0aCBkPSJNMTIgMzJMNCAyOCIvPjxwYXRoIGQ9Ik0xMiAyNEw0IDIwIi8+PHBhdGggZD0iTTEyIDE2TDQgMTIiLz48cGF0aCBkPSJNMTIgOEw0IDQiLz48L3N2Zz4=')" }}></div>
                    
                    {/* Wheat Decoration - Right */}
                    <div className={cn(
                      "absolute right-1 top-1/2 -translate-y-1/2 w-3 h-8 bg-[url('/wheat-right.svg')] bg-contain bg-no-repeat transition-opacity duration-300",
                      isActive ? "opacity-100 brightness-125 saturate-150" : "opacity-0"
                    )} style={{ backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCA2NCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkY0RDRGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDYwVjQiLz48cGF0aCBkPSJNMTIgNTZMMjAgNTIiLz48cGF0aCBkPSJNMTIgNDhMMjAgNDQiLz48cGF0aCBkPSJNMTIgNDBMMjAgMzYiLz48cGF0aCBkPSJNMTIgMzJMMjAgMjgiLz48cGF0aCBkPSJNMTIgMjRMMjAgMjAiLz48cGF0aCBkPSJNMTIgMTZMMjAgMTIiLz48cGF0aCBkPSJNMTIgOEwyMCA0Ii8+PC9zdmc+')" }}></div>

                    {/* Main Title */}
                    <span className={cn(
                      "text-[16px] font-bold mb-1.5 transition-colors duration-300 z-10",
                      isActive ? "text-[#FF4D4F] scale-105" : "text-[#666666]"
                    )}>
                      {type.name.slice(0, 2)}
                    </span>
                    
                    {/* Capsule Subtitle */}
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-medium transition-all duration-300 z-10 whitespace-nowrap scale-90 origin-top",
                      isActive 
                        ? "bg-gradient-to-r from-[#FF4D4F] to-[#FF7875] text-white shadow-sm" 
                        : "bg-[#E5E5E5] text-[#999999]"
                    )}>
                      {type.subTitle}
                    </div>
                  </button>

                  {/* Level 2 Menu Items (Accordion Content) */}
                  <div className={cn(
                    "w-full overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0 mt-0"
                  )}>
                    <div className="flex flex-col items-center space-y-1 pb-2">
                      {SCENE_THEMES.filter(theme => theme.packageTypeId === type.id).map(theme => {
                        const isThemeActive = activeSceneTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={(e) => handleSceneThemeChange(theme.id, e)}
                            className={cn(
                              "w-[80%] py-1.5 text-[12px] rounded transition-all duration-200 text-center",
                              isThemeActive 
                                ? "text-[#FF4D4F] font-bold bg-white shadow-sm" 
                                : "text-[#666666] hover:text-[#333333]"
                            )}
                          >
                            {theme.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 relative bg-white h-full overflow-hidden">
          {isMapMode ? (
            <div className="absolute inset-0 z-10">
              <MapOverlay 
                shops={filteredShops} 
                activeCategory={activePackageType}
                activeScene={activeSceneTheme}
                onSceneChange={setActiveSceneTheme}
              />
            </div>
          ) : (
            <div className="h-full overflow-y-auto scroll-smooth pb-20">
              <div className="p-4 space-y-4 max-w-2xl mx-auto">
                {/* Header for List View */}
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-white/95 backdrop-blur-sm py-2 z-10">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      {SCENE_THEMES.find(t => t.id === activeSceneTheme)?.name}
                    </h2>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> 附近 5km 内推荐
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                      距离最近
                    </button>
                    <button className="text-xs px-3 py-1.5 bg-gray-100 rounded-full text-gray-600 font-medium hover:bg-gray-200 transition-colors">
                      好评优先
                    </button>
                  </div>
                </div>

                {/* Shop List */}
                {isLoading ? (
                  // Skeleton Loading State
                  Array.from({ length: 4 }).map((_, i) => (
                    <ShopSkeleton key={i} />
                  ))
                ) : (
                  // Real Data
                  filteredShops.map((shop) => (
                    <div 
                      key={shop.id}
                      className="group bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 active:scale-[0.99]"
                    >
                      <div className="flex gap-3">
                        {/* Image */}
                        <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img 
                            src={shop.imageUrl} 
                            alt={shop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          {shop.deals && (
                            <div className="absolute top-0 left-0 bg-[#FF4D4F] text-white text-[10px] px-1.5 py-0.5 rounded-br-lg font-medium">
                              惠
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-bold text-gray-900 text-[15px] leading-tight truncate">
                                {shop.name}
                              </h3>
                              <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">
                                {shop.distance}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                                <span className="text-xs font-bold text-orange-500">{shop.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">¥{shop.price}/人</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {shop.tags.slice(0, 3).map((tag, i) => (
                                <span key={i} className="text-[10px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Deals Section */}
                      {shop.deals && shop.deals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-50">
                          {shop.deals.map((deal, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-2 overflow-hidden">
                                <span className="shrink-0 w-4 h-4 flex items-center justify-center bg-orange-100 text-orange-600 text-[10px] rounded font-bold">
                                  团
                                </span>
                                <span className="text-xs text-gray-700 truncate">{deal.title}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-sm font-bold text-[#FF4D4F]">¥{deal.price}</span>
                                <span className="text-[10px] text-gray-300 line-through">¥{deal.originalPrice}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
                
                {/* Empty State */}
                {!isLoading && filteredShops.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm">暂无该分类下的商家</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
