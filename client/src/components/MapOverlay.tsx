import { useEffect, useState, useRef } from "react";
import { X, Navigation, Star, MapPin } from "lucide-react";
import { MapView } from "@/components/Map";
import { Shop } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  shops: Shop[];
  activeShopId?: string;
}

export function MapOverlay({ isOpen, onClose, shops, activeShopId }: MapOverlayProps) {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Initialize map and markers
  const onMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    updateMarkers(map);
  };

  // Update markers when shops change
  useEffect(() => {
    if (mapRef.current) {
      updateMarkers(mapRef.current);
    }
  }, [shops]);

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
    shops.forEach(shop => {
      const marker = new google.maps.Marker({
        position: shop.coordinates,
        map: map,
        title: shop.name,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        setSelectedShop(shop);
        map.panTo(shop.coordinates);
      });

      markersRef.current.push(marker);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white animate-in slide-in-from-bottom duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white shadow-sm z-10">
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
