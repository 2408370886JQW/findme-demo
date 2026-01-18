import { Heart, Users, Coffee, Beer, Gamepad2, Sparkles, GraduationCap, MessageCircle, Camera, Smile, PartyPopper, Flame, Puzzle, Film, Palette, Moon, Gem, ShoppingBag, Gift } from "lucide-react";

// 一级分类：套餐类型
export interface PackageType {
  id: string;
  name: string;
  icon: any;
  color: string;
}

// 二级分类：场景主题
export interface SceneTheme {
  id: string;
  name: string;
  icon: any;
  packageTypeId: string; // 关联一级分类
}

export interface Deal {
  title: string;
  price: number;
  originalPrice: number;
  sales: number;
  tags: string[];
}

export interface Shop {
  id: string;
  name: string;
  packageType: string; // 对应一级分类ID
  sceneTheme: string;  // 对应二级分类ID
  rating: number;
  price: number;
  distance: string;
  tags: string[];
  imageUrl: string;
  description: string;
  reviewCount: number;
  isHot?: boolean;
  coordinates: { lat: number; lng: number };
  deals?: Deal[];
}

// 定义一级分类：套餐类型
export const PACKAGE_TYPES: PackageType[] = [
  { id: 'couple', name: '情侣套餐', icon: Heart, color: 'text-pink-500' },
  { id: 'girls', name: '闺蜜套餐', icon: Users, color: 'text-purple-500' },
  { id: 'bros', name: '兄弟套餐', icon: Beer, color: 'text-blue-500' },
  { id: 'vibe', name: '情趣套餐', icon: Flame, color: 'text-red-500' }
];

// 定义二级分类：场景主题
export const SCENE_THEMES: SceneTheme[] = [
  // 情侣套餐下的场景
  { id: 'date', name: '约会', icon: Heart, packageTypeId: 'couple' },
  { id: 'anniversary', name: '大学情侣周年纪念', icon: Gift, packageTypeId: 'couple' },
  { id: 'interactive', name: '互动体验', icon: Puzzle, packageTypeId: 'couple' },
  { id: 'private_cinema', name: '私密影院', icon: Film, packageTypeId: 'couple' },
  
  // 闺蜜套餐下的场景
  { id: 'girls_tea', name: '闺蜜下午茶', icon: Coffee, packageTypeId: 'girls' },
  { id: 'photo_spot', name: '拍照打卡', icon: Camera, packageTypeId: 'girls' },
  { id: 'beauty', name: '美甲美睫', icon: Gem, packageTypeId: 'girls' },
  { id: 'shopping', name: '逛街购物', icon: ShoppingBag, packageTypeId: 'girls' },
  
  // 兄弟套餐下的场景
  { id: 'bros_drink', name: '兄弟喝酒', icon: Beer, packageTypeId: 'bros' },
  { id: 'acg', name: '二次元', icon: Gamepad2, packageTypeId: 'bros' },
  { id: 'bbq', name: '烧烤撸串', icon: Flame, packageTypeId: 'bros' },
  { id: 'billiards', name: '台球竞技', icon: Puzzle, packageTypeId: 'bros' },
  
  // 情趣套餐下的场景
  { id: 'night_tour', name: '浪漫夜游', icon: Moon, packageTypeId: 'vibe' },
  { id: 'club', name: '夜店', icon: Sparkles, packageTypeId: 'vibe' },
  { id: 'bistro', name: '小酒馆', icon: Beer, packageTypeId: 'vibe' },
  { id: 'rooftop', name: '露台酒吧', icon: Moon, packageTypeId: 'vibe' }
];

export const MOCK_SHOPS: Shop[] = [
  // 情侣套餐 - 约会
  {
    id: '1',
    name: 'Moonlight Bistro 月光法餐厅',
    packageType: 'couple',
    sceneTheme: 'date',
    rating: 4.9,
    price: 320,
    distance: '500m',
    tags: ['法式', '露台', '夜景'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '浪漫的法式小馆，拥有绝佳的城市夜景视野，适合情侣约会。',
    reviewCount: 1205,
    isHot: true,
    coordinates: { lat: 31.2304, lng: 121.4737 },
    deals: [
      { title: '浪漫双人烛光晚餐', price: 520, originalPrice: 888, sales: 300, tags: ['约会首选', '含红酒'] }
    ]
  },
  // 情侣套餐 - 大学情侣周年纪念
  {
    id: '7',
    name: 'Campus Memory 校园回忆',
    packageType: 'couple',
    sceneTheme: 'anniversary',
    rating: 4.8,
    price: 180,
    distance: '2.0km',
    tags: ['怀旧', '创意菜', '氛围'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '专为大学生情侣打造的纪念日餐厅，性价比高又有仪式感。',
    reviewCount: 450,
    coordinates: { lat: 31.2334, lng: 121.4767 },
    deals: [
      { title: '周年纪念双人套餐', price: 199, originalPrice: 399, sales: 520, tags: ['送鲜花', '拍立得'] }
    ]
  },
  // 兄弟套餐 - 二次元
  {
    id: '3',
    name: 'Retro Arcade X 复古电玩城',
    packageType: 'bros',
    sceneTheme: 'acg',
    rating: 4.8,
    price: 80,
    distance: '800m',
    tags: ['街机', '怀旧', '二次元'],
    imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80',
    description: '集合了80-90年代经典街机游戏，还有大量手办展示，二次元天堂。',
    reviewCount: 2300,
    isHot: true,
    coordinates: { lat: 31.2284, lng: 121.4717 },
    deals: [
      { title: '全天畅玩通票', price: 68, originalPrice: 128, sales: 500, tags: ['单人', '不限时'] }
    ]
  },
  // 闺蜜套餐 - 闺蜜下午茶
  {
    id: '11',
    name: 'Alice Garden 爱丽丝花园',
    packageType: 'girls',
    sceneTheme: 'girls_tea',
    rating: 4.8,
    price: 198,
    distance: '600m',
    tags: ['英式', '花园', '甜点'],
    imageUrl: 'https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=800&q=80',
    description: '仿佛置身童话世界的花园餐厅，下午茶颜值超高。',
    reviewCount: 890,
    coordinates: { lat: 31.2314, lng: 121.4757 },
    deals: [
      { title: '梦幻双人下午茶', price: 298, originalPrice: 468, sales: 450, tags: ['拍照必选', '限定'] }
    ]
  },
  // 情趣套餐 - 浪漫夜游
  {
    id: '10',
    name: 'Night Cruise 浦江夜游',
    packageType: 'vibe',
    sceneTheme: 'night_tour',
    rating: 4.6,
    price: 150,
    distance: '3.0km',
    tags: ['夜景', '游船', '浪漫'],
    imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?w=800&q=80',
    description: '吹着晚风，欣赏两岸璀璨灯火，浪漫指数爆表。',
    reviewCount: 2100,
    coordinates: { lat: 31.2404, lng: 121.4907 }
  },
  // 兄弟套餐 - 兄弟喝酒
  {
    id: '6',
    name: 'Brothers BBQ 兄弟烧烤',
    packageType: 'bros',
    sceneTheme: 'bros_drink',
    rating: 4.5,
    price: 120,
    distance: '1.5km',
    tags: ['烧烤', '啤酒', '露天'],
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    description: '大口吃肉，大碗喝酒，兄弟聚会的不二之选。',
    reviewCount: 670,
    coordinates: { lat: 31.2314, lng: 121.4747 }
  },
  // 情侣套餐 - 互动体验
  {
    id: '8',
    name: 'Pottery Love 陶艺工坊',
    packageType: 'couple',
    sceneTheme: 'interactive',
    rating: 4.9,
    price: 168,
    distance: '1.8km',
    tags: ['DIY', '情侣', '手作'],
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',
    description: '一起动手制作专属的陶艺作品，记录甜蜜时光。',
    reviewCount: 320,
    coordinates: { lat: 31.2364, lng: 121.4797 },
    deals: [
      { title: '情侣双人陶艺体验', price: 288, originalPrice: 398, sales: 120, tags: ['包烧制', '指导'] }
    ]
  },
  // 情侣套餐 - 私密影院
  {
    id: '9',
    name: 'Starlight Cinema 星空影院',
    packageType: 'couple',
    sceneTheme: 'private_cinema',
    rating: 4.7,
    price: 128,
    distance: '900m',
    tags: ['私密', '巨幕', '躺椅'],
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    description: '私密包厢，海量片源，享受二人世界的观影乐趣。',
    reviewCount: 580,
    coordinates: { lat: 31.2274, lng: 121.4707 }
  },
  // 闺蜜套餐 - 美甲美睫
  {
    id: '12',
    name: 'Pink Lady Nail Salon 粉红佳人',
    packageType: 'girls',
    sceneTheme: 'beauty',
    rating: 4.7,
    price: 220,
    distance: '1.1km',
    tags: ['美甲', '美睫', '日式'],
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80',
    description: '日式服务，环境优雅，和闺蜜一起变美的好去处。',
    reviewCount: 430,
    coordinates: { lat: 31.2344, lng: 121.4777 }
  },
  // 闺蜜套餐 - 拍照打卡
  {
    id: '13',
    name: 'Art Museum 艺术美术馆',
    packageType: 'girls',
    sceneTheme: 'photo_spot',
    rating: 4.9,
    price: 100,
    distance: '2.2km',
    tags: ['展览', '艺术', '拍照'],
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80',
    description: '光影交错的艺术空间，随手一拍都是大片。',
    reviewCount: 1500,
    coordinates: { lat: 31.2384, lng: 121.4827 }
  },
  // 情趣套餐 - 夜店
  {
    id: '2',
    name: 'Neon Cyber Bar 赛博酒馆',
    packageType: 'vibe',
    sceneTheme: 'club',
    rating: 4.7,
    price: 150,
    distance: '1.2km',
    tags: ['赛博朋克', '特调', 'DJ'],
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
    description: '充满未来感的霓虹灯装饰，每晚都有知名DJ驻场，聚会气氛拉满。',
    reviewCount: 890,
    coordinates: { lat: 31.2324, lng: 121.4757 },
    deals: [
      { title: '4-6人狂欢畅饮套餐', price: 666, originalPrice: 998, sales: 150, tags: ['聚会神券', '无限续杯'] }
    ]
  }
];
