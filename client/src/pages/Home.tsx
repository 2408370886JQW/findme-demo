import { useState } from "react";
import { MapPin, Search, Filter, ChevronDown, Star, Flame } from "lucide-react";
import { SCENES, MAIN_CATEGORIES, MOCK_SHOPS, Category, Shop } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MapOverlay } from "@/components/MapOverlay";

export default function Home() {
  const [activeScene, setActiveScene] = useState<string>('date');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [activeShopId, setActiveShopId] = useState<string | undefined>(undefined);

  const filteredShops = MOCK_SHOPS.filter(shop => {
    const sceneMatch = activeScene === 'all' || shop.category === activeScene;
    const categoryMatch = activeCategory === 'all' || shop.subCategory === activeCategory;
    return sceneMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-[#FFFDF5] pb-20 font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#FFFDF5] border-b-2 border-black px-4 py-3 flex items-center justify-between neo-shadow-sm">
        <div className="flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary fill-current" />
          <span className="font-display text-xl font-bold">FIND ME</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="搜索好去处..." 
              className="pl-10 pr-4 py-2 rounded-full border-2 border-black bg-white w-48 focus:outline-none focus:ring-2 focus:ring-primary neo-shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-48 w-full overflow-hidden border-b-2 border-black">
        <img 
          src="/images/hero-banner.jpg" 
          alt="Find Me City" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
          <h1 className="text-white font-display text-3xl drop-shadow-[2px_2px_0_#000]">
            发现你的<br/>专属场景
          </h1>
        </div>
      </div>

      {/* Scene Navigation */}
      <div className="sticky top-[66px] z-40 bg-[#FFFDF5] border-b-2 border-black py-3">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 px-4">
            {SCENES.map((scene) => (
              <button
                key={scene.id}
                onClick={() => setActiveScene(scene.id)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200 group",
                  activeScene === scene.id ? "scale-110" : "opacity-70 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-full border-2 border-black flex items-center justify-center transition-all",
                  scene.color,
                  activeScene === scene.id ? "neo-shadow" : ""
                )}>
                  <scene.icon className="w-6 h-6 text-black" />
                </div>
                <span className="text-xs font-bold border-black px-2 py-0.5 rounded-full bg-white border">
                  {scene.name}
                </span>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Main Categories */}
      <div className="container py-6">
        <h2 className="font-display text-2xl mb-4 flex items-center gap-2">
          <span className="bg-primary text-white px-2 py-1 border-2 border-black neo-shadow-sm transform -rotate-2">
            吃喝玩乐
          </span>
          <span className="text-black">大本营</span>
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {MAIN_CATEGORIES.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? 'all' : cat.id)}
              className={cn(
                "relative aspect-square rounded-xl border-2 border-black overflow-hidden group transition-all",
                activeCategory === cat.id ? "neo-shadow ring-2 ring-offset-2 ring-black" : "hover:neo-shadow-sm"
              )}
            >
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className={cn(
                "absolute bottom-0 left-0 right-0 p-1 text-center border-t-2 border-black font-bold text-white text-sm",
                cat.color
              )}>
                {cat.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Shop List */}
      <div className="container pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">
            附近推荐 <span className="text-sm font-body font-normal text-gray-500 ml-2">({filteredShops.length}家)</span>
          </h2>
          <Button variant="outline" size="sm" className="neo-button bg-white h-8 text-xs">
            <Filter className="w-3 h-3 mr-1" /> 筛选
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredShops.map((shop) => (
            <div 
              key={shop.id} 
              onClick={() => {
                setActiveShopId(shop.id);
                setIsMapOpen(true);
              }}
              className="neo-card rounded-xl overflow-hidden flex h-32 relative group cursor-pointer hover:-translate-y-1 transition-transform"
            >
              {/* Image */}
              <div className="w-32 h-full relative border-r-2 border-black shrink-0">
                <img src={shop.imageUrl} alt={shop.name} className="w-full h-full object-cover" />
                {shop.isHot && (
                  <div className="absolute top-0 left-0 bg-accent text-white text-[10px] font-bold px-2 py-1 border-b-2 border-r-2 border-black z-10">
                    HOT
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="flex-1 p-3 flex flex-col justify-between bg-white">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg leading-tight line-clamp-1">{shop.name}</h3>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
                      {shop.distance}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold ml-0.5">{shop.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">¥{shop.price}/人</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {shop.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 border border-black rounded-md bg-gray-50">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 p-1.5 rounded border border-gray-200 mt-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  <span className="line-clamp-1">"{shop.description}"</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Map Button */}
      <button 
        onClick={() => setIsMapOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full border-2 border-black neo-shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
      >
        <MapPin className="w-7 h-7" />
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
