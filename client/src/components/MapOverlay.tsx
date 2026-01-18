import { useState, useEffect, useRef } from "react";
import { X, Navigation, Locate } from "lucide-react";
import { Shop, SCENE_THEMES } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MapView } from "./Map";

interface MapOverlayProps {
  isOpen?: boolean;
  onClose?: () => void;
  shops: Shop[];
  activeShopId?: string;
  activeSceneId?: string;
  activeCategory?: string;
  activeScene?: string;
  onSceneChange?: (sceneId: string) => void;
}

export function MapOverlay({ 
  isOpen = true, 
  onClose, 
  shops, 
  activeShopId, 
  activeSceneId,
  activeCategory,
  activeScene,
  onSceneChange
}: MapOverlayProps) {
  const [selectedShopId, setSelectedShopId] = useState<string | undefined>(activeShopId);
  const [activeSubScene, setActiveSubScene] = useState<string | null>(activeScene || null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mappedShops, setMappedShops] = useState<Shop[]>([]);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          // Default to Shanghai center if location fails
          setUserLocation({ lat: 31.2304, lng: 121.4737 });
        }
      );
    } else {
      setUserLocation({ lat: 31.2304, lng: 121.4737 });
    }
  }, []);

  // Map shops to user location
  useEffect(() => {
    if (!userLocation || shops.length === 0) return;

    // Generate random offsets to place shops around user
    const mapped = shops.map(shop => {
      // Create a deterministic random offset based on shop ID
      const idNum = shop.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const angle = (idNum % 360) * (Math.PI / 180);
      const distance = 0.005 + (idNum % 20) * 0.001; // Roughly 500m to 2.5km

      return {
        ...shop,
        coordinates: {
          lat: userLocation.lat + Math.cos(angle) * distance,
          lng: userLocation.lng + Math.sin(angle) * distance
        },
        // Recalculate distance string
        distance: `${(distance * 111).toFixed(1)}km`
      };
    });

    setMappedShops(mapped);
  }, [userLocation, shops]);

  // Sync with prop
  useEffect(() => {
    if (activeShopId) {
      setSelectedShopId(activeShopId);
    }
  }, [activeShopId]);

  // Sync active scene from props
  useEffect(() => {
    if (activeScene) {
      setActiveSubScene(activeScene);
    }
  }, [activeScene]);

  // Get sub-scenes for the current active scene (package type)
  const subScenes = activeCategory 
    ? SCENE_THEMES.filter(s => s.packageTypeId === activeCategory)
    : [];

  // Filter mapped shops based on sub-scene
  const filteredShops = activeSubScene
    ? mappedShops.filter(s => s.sceneTheme === activeSubScene)
    : mappedShops;

  const selectedShop = filteredShops.find(s => s.id === selectedShopId);

  // Handle map ready
  const handleMapReady = (map: google.maps.Map) => {
    mapRef.current = map;
    
    // Add markers for all shops
    filteredShops.forEach(shop => {
      if (!shop.coordinates) return;
      
      const marker = new google.maps.Marker({
        position: shop.coordinates,
        map: map,
        title: shop.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: shop.id === selectedShopId ? "#FF4D4F" : "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
        }
      });

      marker.addListener("click", () => {
        setSelectedShopId(shop.id);
      });
    });

    // Add user location marker
    if (userLocation) {
      new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "我的位置",
        zIndex: 999,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#3B82F6",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 3,
        }
      });
    }
  };

  // Center map on user or selected shop
  useEffect(() => {
    if (!mapRef.current) return;

    if (selectedShop && selectedShop.coordinates) {
      mapRef.current.panTo(selectedShop.coordinates);
      mapRef.current.setZoom(15);
    } else if (userLocation) {
      mapRef.current.panTo(userLocation);
      mapRef.current.setZoom(14);
    }
  }, [selectedShop, userLocation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      {onClose && (
        <div className="flex-none px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white z-10 shadow-sm">
          <h2 className="font-bold text-lg">地图模式</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      )}

      {/* Sub-scene Filter Bar */}
      {subScenes.length > 0 && (
        <div className="flex-none px-4 py-2 bg-white border-b border-gray-100 overflow-x-auto hide-scrollbar z-10">
          <div className="flex gap-2">
            {subScenes.map(sub => (
              <button
                key={sub.id}
                onClick={() => {
                  setActiveSubScene(sub.id);
                  onSceneChange?.(sub.id);
                }}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1",
                  activeSubScene === sub.id
                    ? "bg-[#FF4D4F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="flex-1 relative bg-gray-100">
        <MapView 
          className="w-full h-full"
          onMapReady={handleMapReady}
        />
        
        {/* Reset Location Button */}
        <button
          onClick={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.panTo(userLocation);
              mapRef.current.setZoom(14);
              setSelectedShopId(undefined);
            }
          }}
          className="absolute bottom-48 right-4 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:text-[#3B82F6] active:scale-95 transition-all z-10"
        >
          <Locate className="w-6 h-6" />
        </button>

        {/* Selected Shop Card */}
        {selectedShop && (
          <div className="absolute bottom-8 left-4 right-4 bg-white rounded-xl shadow-xl p-4 animate-in slide-in-from-bottom-10 duration-300 z-10">
            <div className="flex gap-3">
              <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                <img src={selectedShop.imageUrl} alt={selectedShop.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-base truncate pr-2">{selectedShop.name}</h3>
                  <span className="text-[#FF4D4F] font-bold text-sm whitespace-nowrap">¥{selectedShop.price}/人</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                  <span className="font-medium text-[#FFB800]">{selectedShop.rating}分</span>
                  <span>|</span>
                  <span>{selectedShop.distance}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedShop.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
                <button className="mt-2 w-full bg-[#3B82F6] text-white text-xs font-medium py-1.5 rounded-md flex items-center justify-center gap-1 active:scale-95 transition-transform">
                  <Navigation className="w-3 h-3" />
                  导航前往
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
