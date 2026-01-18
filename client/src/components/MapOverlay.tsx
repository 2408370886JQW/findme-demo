import { useEffect, useState, useRef } from "react";
import { X, Navigation, Star, MapPin } from "lucide-react";
import { MapView } from "@/components/Map";
import { Shop, SCENES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  shops: Shop[];
  activeShopId?: string;
  activeSceneId?: string; // Add active scene ID to filter sub-categories
}

export function MapOverlay({ isOpen, onClose, shops, activeShopId, activeSceneId }: MapOverlayProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [activeSubFilter, setActiveSubFilter] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Get sub-categories for the current active scene
  const currentScene = SCENES.find(s => s.id === activeSceneId);
  const subCategories = currentScene?.subCategories || [];

  // Filter shops based on active sub-filter
  const filteredShops = activeSubFilter 
    ? shops.filter(shop => shop.subCategory === activeSubFilter)
    : shops;

  // Initialize map and markers
  const onMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    updateMarkers(map);
  };

  // Update markers when filtered shops change
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers(mapRef.current);
    }
  }, [filteredShops]);

  // Handle active shop selection from outside
  useEffect(() => {
    if (activeShopId && mapRef.current) {
      const shop = shops.find(s => s.id === activeShopId);
      if (shop) {
        setSelectedShop(shop);
        mapRef.current.panTo(shop.coordinates);
        mapRef.current.setZoom(15);
      }
    }
  }, [activeShopId, shops]);

  const updateMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    filteredShops.forEach(shop => {
      const marker = new google.maps.Marker({
        position: shop.coordinates,
        map: map,
        title: shop.name,
        animation: google.maps.Animation.DROP,
        // Optional: Custom icon based on category could go here
      });

      marker.addListener("click", () => {
        setSelectedShop(shop);
        map.panTo(shop.coordinates);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if there are markers
    if (filteredShops.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredShops.forEach(shop => bounds.extend(shop.coordinates));
      // Don't fit bounds if only one shop is selected (to avoid too much zoom)
      if (filteredShops.length > 1) {
        map.fitBounds(bounds);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex flex-col border-b border-gray-100 bg-white shadow-sm z-10">
        <div className="flex items-center justify-between p-3 pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500 text-white p-1 rounded-md">
              <MapPin className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-gray-800">地图模式</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-full h-8 w-8">
            <X className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* Sub-category Filter Bar */}
        {subCategories.length > 0 && (
          <div className="flex items-center gap-2 px-3 pb-3 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveSubFilter(null)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                !activeSubFilter 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              全部
            </button>
            {subCategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubFilter(sub.id === activeSubFilter ? null : sub.id)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border",
                  activeSubFilter === sub.id 
                    ? "bg-blue-500 text-white border-blue-500" 
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                <sub.icon className="w-3 h-3" />
                {sub.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapView 
          className="w-full h-full"
          onMapReady={onMapReady}
          initialCenter={{ lat: 31.2304, lng: 121.4737 }} // Shanghai center
          initialZoom={13}
        />

        {/* Shop Card Overlay */}
        {selectedShop && (
          <div className="absolute bottom-8 left-4 right-4 z-10 animate-in slide-in-from-bottom-10 duration-300">
            <div className="bg-white shadow-xl p-4 rounded-xl relative border border-gray-100">
              <button 
                onClick={() => setSelectedShop(null)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-3">
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedShop.imageUrl} 
                    alt={selectedShop.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-base text-gray-900 truncate pr-6">{selectedShop.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <div className="flex items-center text-amber-500 font-bold text-sm">
                      <span>{selectedShop.rating}</span>
                      <span className="text-xs font-normal text-gray-400 ml-1">分</span>
                    </div>
                    <span className="text-xs text-gray-500">¥{selectedShop.price}/人</span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button className="flex-1 h-8 text-xs bg-blue-500 text-white hover:bg-blue-600 rounded-full font-medium shadow-sm shadow-blue-200">
                      查看详情
                    </Button>
                    <Button className="w-20 h-8 p-0 bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full flex items-center justify-center gap-1 text-xs font-medium">
                      <Navigation className="w-3 h-3" />
                      <span>导航</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
