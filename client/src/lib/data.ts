import { MapPin, Coffee, Utensils, GlassWater, Heart, Users, Sparkles, PartyPopper, Music, Camera, Gift, Gamepad2 } from "lucide-react";

export interface Shop {
  id: string;
  name: string;
  rating: number;
  price: number;
  distance: string;
  tags: string[];
  imageUrl: string;
  description: string;
  reviewCount: number;
  heat?: number; // 全年热度值
  packageType: string; // 'couple' | 'bestie' | 'brother' | 'fun'
  sceneTheme: string; // 'date' | 'anniversary' | 'afternoon_tea' | 'photo' | 'drink' | 'game' | 'cosplay' | 'private'
  deals?: {
    title: string;
    price: number;
    originalPrice: number;
    tags: string[];
  }[];
  coordinates?: { lat: number; lng: number };
}

export interface PackageType {
  id: string;
  name: string;
  subTitle: string; // New field for custom capsule text
  icon: any;
}

export interface SceneTheme {
  id: string;
  name: string;
  packageTypeId: string;
}

export const PACKAGE_TYPES: PackageType[] = [
  { id: 'couple', name: '情侣套餐', subTitle: '甜蜜升温', icon: Heart },
  { id: 'bestie', name: '闺蜜套餐', subTitle: '精致打卡', icon: Sparkles },
  { id: 'brother', name: '兄弟套餐', subTitle: '畅爽聚会', icon: Users },
  { id: 'fun', name: '情趣套餐', subTitle: '私密探索', icon: PartyPopper },
];

export const SCENE_THEMES: SceneTheme[] = [
  // Couple Scenes
  { id: 'date', name: '浪漫约会', packageTypeId: 'couple' },
  { id: 'anniversary', name: '纪念日', packageTypeId: 'couple' },
  { id: 'university', name: '校园回忆', packageTypeId: 'couple' },
  { id: 'proposal', name: '求婚策划', packageTypeId: 'couple' },

  // Bestie Scenes
  { id: 'afternoon_tea', name: '下午茶', packageTypeId: 'bestie' },
  { id: 'photo', name: '网红拍照', packageTypeId: 'bestie' },
  { id: 'shopping', name: '逛街探店', packageTypeId: 'bestie' },
  { id: 'spa', name: '美容SPA', packageTypeId: 'bestie' },

  // Brother Scenes
  { id: 'drink', name: '喝酒撸串', packageTypeId: 'brother' },
  { id: 'game', name: '电竞开黑', packageTypeId: 'brother' },
  { id: 'sports', name: '运动竞技', packageTypeId: 'brother' },
  { id: 'ktv', name: 'KTV狂欢', packageTypeId: 'brother' },

  // Fun Scenes
  { id: 'cosplay', name: '二次元', packageTypeId: 'fun' },
  { id: 'private', name: '私密影院', packageTypeId: 'fun' },
  { id: 'roleplay', name: '剧本杀', packageTypeId: 'fun' },
  { id: 'bar', name: '主题酒吧', packageTypeId: 'fun' },
];

export const MOCK_SHOPS: Shop[] = [
  // Couple - Date
  {
    id: '1',
    name: 'Moonlight Bistro 月光法餐厅',
    rating: 4.9,
    price: 320,
    distance: '500m',
    tags: ['法式', '露台', '夜景'],
    imageUrl: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80',
    description: '浪漫的法式小馆，拥有绝佳的城市夜景视野，适合情侣约会。',
    reviewCount: 1205,
    heat: 98,
    packageType: 'couple',
    sceneTheme: 'date',
    deals: [
      { title: '浪漫双人烛光晚餐', price: 520, originalPrice: 888, tags: ['约会首选', '含红酒'] }
    ],
    coordinates: { lat: 31.2304, lng: 121.4737 }
  },
  {
    id: '2',
    name: 'Starry Sky Lounge 星空酒廊',
    rating: 4.8,
    price: 180,
    distance: '1.2km',
    tags: ['清吧', '鸡尾酒', '氛围感'],
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
    description: '在星空下小酌一杯，享受二人世界的静谧时光。',
    reviewCount: 856,
    heat: 92,
    packageType: 'couple',
    sceneTheme: 'date',
    deals: [
      { title: '微醺双人鸡尾酒套餐', price: 298, originalPrice: 468, tags: ['特调饮品'] }
    ],
    coordinates: { lat: 31.2324, lng: 121.4757 }
  },
  
  // Couple - Anniversary
  {
    id: '3',
    name: 'Rose Garden 玫瑰花园',
    rating: 4.9,
    price: 520,
    distance: '2.5km',
    tags: ['鲜花主题', '西餐', '定制服务'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '被玫瑰花海包围的餐厅，提供纪念日布置服务。',
    reviewCount: 2100,
    heat: 99,
    packageType: 'couple',
    sceneTheme: 'anniversary',
    deals: [
      { title: '至尊纪念日晚宴', price: 1314, originalPrice: 1999, tags: ['包含布置', '送鲜花'] }
    ],
    coordinates: { lat: 31.2354, lng: 121.4787 }
  },

  // Bestie - Afternoon Tea
  {
    id: '4',
    name: 'Alice\'s Tea Party 爱丽丝茶屋',
    rating: 4.7,
    price: 128,
    distance: '800m',
    tags: ['英式下午茶', '甜点', '少女心'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    description: '仿佛置身童话世界的下午茶，每一款甜点都精致得让人舍不得吃。',
    reviewCount: 3420,
    heat: 95,
    packageType: 'bestie',
    sceneTheme: 'afternoon_tea',
    deals: [
      { title: '梦幻双人下午茶', price: 198, originalPrice: 368, tags: ['拍照出片', '无限续杯'] }
    ],
    coordinates: { lat: 31.2284, lng: 121.4717 }
  },

  // Bestie - Photo
  {
    id: '5',
    name: 'Pink Dream Studio 粉色梦境馆',
    rating: 4.6,
    price: 88,
    distance: '1.5km',
    tags: ['自拍馆', '换装', '场景丰富'],
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    description: '30+主题场景任拍，提供百套服装，和闺蜜拍出大片。',
    reviewCount: 1560,
    heat: 88,
    packageType: 'bestie',
    sceneTheme: 'photo',
    deals: [
      { title: '双人畅拍2小时', price: 128, originalPrice: 256, tags: ['服装任选', '送精修'] }
    ],
    coordinates: { lat: 31.2384, lng: 121.4827 }
  },

  // Brother - Drink
  {
    id: '6',
    name: 'Brothers\' BBQ 兄弟烧烤',
    rating: 4.8,
    price: 110,
    distance: '600m',
    tags: ['烧烤', '啤酒', '露天'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    description: '大口吃肉，大碗喝酒，这就是兄弟聚会的正确打开方式。',
    reviewCount: 5600,
    heat: 97,
    packageType: 'brother',
    sceneTheme: 'drink',
    deals: [
      { title: '兄弟欢聚4人餐', price: 398, originalPrice: 588, tags: ['啤酒畅饮', '量大管饱'] }
    ],
    coordinates: { lat: 31.2314, lng: 121.4747 }
  },

  // Brother - Game
  {
    id: '7',
    name: 'CyberZone E-Sports 赛博电竞馆',
    rating: 4.9,
    price: 45,
    distance: '1.0km',
    tags: ['电竞', 'RTX4090', '专业外设'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    description: '顶级配置，专业电竞椅，带上兄弟一起开黑上分。',
    reviewCount: 2300,
    heat: 94,
    packageType: 'brother',
    sceneTheme: 'game',
    deals: [
      { title: '五连坐包房通宵卡', price: 299, originalPrice: 500, tags: ['送饮料', '私密包间'] }
    ],
    coordinates: { lat: 31.2274, lng: 121.4707 }
  },

  // Fun - Cosplay
  {
    id: '8',
    name: 'Dimension Gate 次步元之门',
    rating: 4.7,
    price: 98,
    distance: '2.0km',
    tags: ['二次元', '手办', '主题餐饮'],
    imageUrl: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80',
    description: '二次元爱好者的天堂，定期举办Cosplay聚会。',
    reviewCount: 1890,
    heat: 85,
    packageType: 'fun',
    sceneTheme: 'cosplay',
    deals: [
      { title: '单人主题套餐+周边', price: 88, originalPrice: 128, tags: ['送限定徽章'] }
    ],
    coordinates: { lat: 31.2334, lng: 121.4767 }
  },

  // Fun - Private
  {
    id: '9',
    name: 'Secret Garden Cinema 私密花园影院',
    rating: 4.8,
    price: 158,
    distance: '1.8km',
    tags: ['私人影院', '情侣包间', '4K投影'],
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    description: '私密舒适的观影空间，海量片源随心看。',
    reviewCount: 1120,
    heat: 90,
    packageType: 'fun',
    sceneTheme: 'private',
    deals: [
      { title: '情侣观影3小时', price: 168, originalPrice: 298, tags: ['送爆米花', '可躺看'] }
    ],
    coordinates: { lat: 31.2404, lng: 121.4907 }
  }
];

export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  label: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = PACKAGE_TYPES.map(pkg => ({
  id: pkg.id,
  name: pkg.name,
  label: pkg.subTitle,
  subCategories: SCENE_THEMES
    .filter(scene => scene.packageTypeId === pkg.id)
    .map(scene => ({
      id: scene.id,
      name: scene.name
    }))
}));

export const shops = MOCK_SHOPS;
