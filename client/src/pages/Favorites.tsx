import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, Heart, Star, MapPin, Share2, Trash2 } from 'lucide-react';
import { MOCK_SHOPS, type Shop } from '@/lib/data';
import { ShareModal } from '@/components/ShareModal';

export default function Favorites() {
  const [location, setLocation] = useLocation();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteShops, setFavoriteShops] = useState<Shop[]>([]);
  const [showShare, setShowShare] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      setFavorites(parsedFavorites);
      
      // Filter shops based on favorites
      const filtered = MOCK_SHOPS.filter(shop => parsedFavorites.includes(shop.id));
      setFavoriteShops(filtered);
    }
  }, []);

  const removeFavorite = (e: React.MouseEvent, shopId: string) => {
    e.stopPropagation();
    const newFavorites = favorites.filter(id => id !== shopId);
    setFavorites(newFavorites);
    setFavoriteShops(favoriteShops.filter(shop => shop.id !== shopId));
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLocation('/')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#333333]" />
          </button>
          <h1 className="text-lg font-bold text-[#333333]">我的收藏</h1>
        </div>
        <div className="text-xs text-gray-500 font-medium">
          共 {favoriteShops.length} 家
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {favoriteShops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-gray-300 fill-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">暂无收藏店铺</h3>
            <p className="text-sm text-gray-500 mb-6">快去发现更多好吃的餐厅吧</p>
            <button 
              onClick={() => setLocation('/')}
              className="px-6 py-2 bg-[#FF5500] text-white rounded-full font-bold shadow-md hover:shadow-lg active:scale-95 transition-all"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {favoriteShops.map(shop => (
              <div 
                key={shop.id}
                className="bg-white rounded-xl p-3 flex gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-transparent cursor-pointer hover:shadow-md transition-all"
              >
                {/* Left Image */}
                <div className="relative w-[100px] h-[100px] flex-none">
                  <img src={shop.imageUrl} alt={shop.name} className="w-full h-full rounded-lg object-cover" />
                  {shop.ranking && (
                    <div className="absolute top-0 left-0 bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-lg rounded-br-lg shadow-sm">
                      榜单TOP
                    </div>
                  )}
                </div>
                
                {/* Right Content */}
                <div className="flex-1 flex flex-col justify-between h-[100px]">
                  <div className="flex justify-between items-start relative">
                    <h3 className="font-bold text-[#333333] text-[15px] leading-tight truncate pr-8">{shop.name}</h3>
                    <button 
                      onClick={(e) => removeFavorite(e, shop.id)}
                      className="absolute top-0 right-0 p-1 text-gray-400 hover:text-[#FF4D4F] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <div className="flex items-center text-[#FF6600] font-bold text-[13px]">
                      <Star className="w-3 h-3 fill-[#FF6600] mr-0.5" />
                      <span>{shop.rating}</span>
                    </div>
                    <div className="w-[1px] h-3 bg-gray-300"></div>
                    <span className="text-[#666666] text-[12px]">¥{shop.price}/人</span>
                    <div className="w-[1px] h-3 bg-gray-300"></div>
                    <span className="text-[#999999] text-[12px]">{shop.area}</span>
                  </div>

                  <div className="mt-auto pt-2 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="bg-[#FF4D4F]/10 text-[#FF4D4F] text-[10px] px-1 rounded flex-none">团</span>
                      <span className="text-[#666666] text-[11px] truncate">{shop.deals?.[0]?.title || shop.dealTitle}</span>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setShowShare(true); }}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {favoriteShops.length > 0 && (
        <ShareModal 
          isOpen={showShare} 
          onClose={() => setShowShare(false)} 
          shop={favoriteShops[0]} // Just a placeholder, ideally we should track which shop is being shared
        />
      )}
    </div>
  );
}
