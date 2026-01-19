import { useRef, useState } from 'react';
import { X, Download, Share2, MapPin, Star, Ticket } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Shop } from '@/lib/data';

interface ShareModalProps {
  shop: Shop;
  onClose: () => void;
  isOpen: boolean;
}

export function ShareModal({ shop, onClose, isOpen }: ShareModalProps) {
  const posterRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!posterRef.current) return;
    
    try {
      setIsGenerating(true);
      // Wait for images to load if needed, though they should be loaded in the preview
      const canvas = await html2canvas(posterRef.current, {
        useCORS: true, // Important for external images
        scale: 2, // Higher quality
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `findme-${shop.name}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate poster:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-background rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#FF4D4F]" />
            分享商家
          </h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30 flex justify-center">
          {/* Poster Container - This is what gets captured */}
          <div 
            ref={posterRef}
            className="w-[300px] bg-white rounded-xl overflow-hidden shadow-lg flex flex-col relative"
          >
            {/* Brand Header */}
            <div className="bg-[#FF4D4F] p-4 flex items-center justify-center">
              <div className="flex items-center gap-2 text-white">
                <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="font-black tracking-tighter text-lg">FIND ME</span>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative h-48 w-full bg-gray-100">
              <img 
                src={shop.imageUrl} 
                alt={shop.name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous" 
              />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Star className="w-3 h-3 fill-[#FF9900] text-[#FF9900]" />
                {shop.rating}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">
                  {shop.name}
                </h2>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{shop.sceneTheme === 'date' ? '浪漫约会' : '精选好店'}</span>
                  <span>•</span>
                  <span>人均 ¥{shop.price}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {shop.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 bg-[#FF4D4F]/5 text-[#FF4D4F] rounded border border-[#FF4D4F]/10">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="mt-2 relative bg-[#FFF0F0] border border-[#FFD6D6] rounded-lg p-3 flex items-center justify-between overflow-hidden">
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-r border-[#FFD6D6]" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-l border-[#FFD6D6]" />
                
                <div className="flex flex-col z-10">
                  <span className="text-[10px] text-[#FF4D4F] font-medium">凭此图到店享</span>
                  <span className="text-lg font-bold text-[#FF4D4F] leading-none mt-0.5">8.8折优惠</span>
                </div>
                
                <div className="flex flex-col items-end z-10">
                  <div className="flex items-center gap-1 text-[#FF4D4F]">
                    <Ticket className="w-3 h-3" />
                    <span className="text-[10px] font-mono font-bold">FINDME-888</span>
                  </div>
                  <span className="text-[9px] text-[#FF4D4F]/70 mt-0.5">限时优惠 截屏保存</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-1 border-dashed border-t border-gray-200" />

              {/* Footer / QR */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-gray-400 mb-1">长按识别二维码</p>
                  <p className="text-xs font-bold text-gray-800">查看更多宝藏好店</p>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  {/* Mock QR Code */}
                  <div className="grid grid-cols-3 gap-0.5 p-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className={`w-3 h-3 ${i % 2 === 0 ? 'bg-gray-800' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative Circles */}
            <div className="absolute -left-2 top-[230px] w-4 h-4 rounded-full bg-[#f3f4f6]" />
            <div className="absolute -right-2 top-[230px] w-4 h-4 rounded-full bg-[#f3f4f6]" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-background">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full bg-[#FF4D4F] hover:bg-[#FF4D4F]/90 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#FF4D4F]/20"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                生成中...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                保存海报
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
