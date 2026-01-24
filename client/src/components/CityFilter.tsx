import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MapPin, Check } from 'lucide-react';
import { DISTRICTS, type District, type Area } from '@/lib/data';

interface CityFilterProps {
  onSelect: (district: string | null, area: string | null) => void;
  selectedDistrict: string | null;
  selectedArea: string | null;
}

export function CityFilter({ onSelect, selectedDistrict, selectedArea }: CityFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(selectedDistrict || DISTRICTS[0].id);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDistrictClick = (districtId: string) => {
    setActiveDistrict(districtId);
  };

  const handleAreaClick = (districtId: string, areaId: string | null) => {
    onSelect(districtId, areaId);
    setIsOpen(false);
  };

  const handleReset = () => {
    onSelect(null, null);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedArea) {
      const district = DISTRICTS.find(d => d.id === selectedDistrict);
      const area = district?.areas.find(a => a.id === selectedArea);
      return area?.name || '全城';
    }
    if (selectedDistrict) {
      const district = DISTRICTS.find(d => d.id === selectedDistrict);
      return district?.name || '全城';
    }
    return '全城';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        className={`flex items-center justify-center py-4 cursor-pointer group transition-colors active:scale-95 duration-200 ${isOpen ? 'text-[#FF5500]' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-[14px] font-[600] group-hover:text-[#FF5500] transition-colors font-system tracking-tight ${isOpen ? 'text-[#FF5500]' : 'text-[#222222]'}`}>
          {getDisplayText()}
        </span>
        <ChevronDown className={`w-3 h-3 ml-1 group-hover:text-[#FF5500] transition-all duration-200 ${isOpen ? 'text-[#FF5500] rotate-180' : 'text-[#999999]'}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-[300px] bg-white rounded-xl shadow-xl border border-border/50 z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 origin-top-left">
          <div className="flex h-[320px]">
            {/* Left Column: Districts */}
            <div className="w-1/3 bg-[#F5F5F5] overflow-y-auto no-scrollbar">
              <button
                onClick={handleReset}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${!selectedDistrict ? 'bg-white text-[#FF5500]' : 'text-[#666666] hover:bg-white/50'}`}
              >
                全城
              </button>
              {DISTRICTS.map(district => (
                <button
                  key={district.id}
                  onClick={() => handleDistrictClick(district.id)}
                  className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors flex items-center justify-between ${activeDistrict === district.id ? 'bg-white text-[#333333]' : 'text-[#666666] hover:bg-white/50'}`}
                >
                  {district.name}
                  {selectedDistrict === district.id && <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500]" />}
                </button>
              ))}
            </div>

            {/* Right Column: Areas */}
            <div className="w-2/3 bg-white overflow-y-auto no-scrollbar p-2">
              {activeDistrict ? (
                <div className="space-y-1">
                  <button
                    onClick={() => handleAreaClick(activeDistrict, null)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedDistrict === activeDistrict && !selectedArea ? 'text-[#FF5500] bg-[#FFF0E5] font-bold' : 'text-[#333333] hover:bg-[#F5F5F5]'}`}
                  >
                    全部{DISTRICTS.find(d => d.id === activeDistrict)?.name}
                    {selectedDistrict === activeDistrict && !selectedArea && <Check className="w-4 h-4" />}
                  </button>
                  {DISTRICTS.find(d => d.id === activeDistrict)?.areas.map(area => (
                    <button
                      key={area.id}
                      onClick={() => handleAreaClick(activeDistrict, area.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedArea === area.id ? 'text-[#FF5500] bg-[#FFF0E5] font-bold' : 'text-[#333333] hover:bg-[#F5F5F5]'}`}
                    >
                      {area.name}
                      {selectedArea === area.id && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-xs">
                  <MapPin className="w-8 h-8 mb-2 opacity-20" />
                  请选择行政区
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
