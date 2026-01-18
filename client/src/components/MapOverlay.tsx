import { useEffect, useState, useRef } from "react";
import { X, Navigation, Star } from "lucide-react";
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
      // Create custom marker icon based on category color
      // Since we can't easily use complex HTML for markers without an overlay view,
      // we'll use standard markers with colors for now, or simple SVG icons
      
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
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-black bg-[#FFFDF5]">
        <h2 className="font-display text-xl">探索地图</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6" />
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
            <div className="bg-white neo-border neo-shadow p-4 rounded-xl relative">
              <button 
                onClick={() => setSelectedShop(null)}
                className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-3">
                <div className="w-24 h-24 shrink-0 border-2 border-black rounded-lg overflow-hidden">
                  <img 
                    src={selectedShop.imageUrl} 
                    alt={selectedShop.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg truncate pr-6">{selectedShop.name}</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 mb-2">
                    <div className="flex items-center text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-bold ml-0.5">{selectedShop.rating}</span>
                    </div>
                    <span className="text-xs text-gray-500">¥{selectedShop.price}/人</span>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 ml-auto">
                      {selectedShop.distance}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <Button className="flex-1 h-8 text-xs neo-button bg-primary text-white hover:bg-primary/90">
                      查看详情
                    </Button>
                    <Button className="w-10 h-8 p-0 neo-button bg-accent text-white hover:bg-accent/90 flex items-center justify-center">
                      <Navigation className="w-4 h-4" />
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
