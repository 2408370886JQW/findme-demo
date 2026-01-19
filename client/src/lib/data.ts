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
  packageType: string; // 'couple' | 'bestie' | 'brother' | 'fun'
  sceneTheme: string; // Updated scene themes
  deals?: {
    title: string;
    price: number;
    originalPrice: number;
    tags: string[];
  }[];
  coordinates?: { lat: number; lng: number };
  reviews?: Review[];
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  tags?: string[];
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
  // Couple Scenes (情侣套餐)
  { id: 'couple_date', name: '两人约会', packageTypeId: 'couple' },
  { id: 'couple_relax', name: '轻松或浪漫', packageTypeId: 'couple' },

  // Bestie Scenes (闺蜜套餐)
  { id: 'bestie_chat', name: '闺蜜叙旧', packageTypeId: 'bestie' },
  { id: 'bestie_photo', name: '可拍照', packageTypeId: 'bestie' },
  { id: 'bestie_emotion', name: '有情绪价值', packageTypeId: 'bestie' },

  // Brother Scenes (兄弟套餐)
  { id: 'brother_party', name: '兄弟聚会', packageTypeId: 'brother' },
  { id: 'brother_deep', name: '深度聊天', packageTypeId: 'brother' },

  // Fun Scenes (情趣套餐)
  { id: 'fun_heat', name: '感情升温', packageTypeId: 'fun' },
  { id: 'fun_vibe', name: '氛围拉满', packageTypeId: 'fun' },
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
    packageType: 'couple',
    sceneTheme: 'couple_date',
    deals: [
      { title: '浪漫双人烛光晚餐', price: 520, originalPrice: 888, tags: ['约会首选', '含红酒'] }
    ],
    coordinates: { lat: 31.2304, lng: 121.4737 },
    reviews: [
      {
        id: 'r1',
        userName: 'Alice',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
        date: '2023-10-15',
        content: '环境真的太棒了！露台夜景无敌，服务也很周到，男朋友求婚成功啦！',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80'],
        tags: ['求婚圣地', '夜景美']
      },
      {
        id: 'r2',
        userName: 'Bob',
        userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
        rating: 4.5,
        date: '2023-10-10',
        content: '菜品味道不错，尤其是牛排，就是价格稍微有点贵，不过为了这个环境也值了。',
        tags: ['牛排好吃']
      }
    ]
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
    packageType: 'couple',
    sceneTheme: 'couple_relax',
    deals: [
      { title: '微醺双人鸡尾酒套餐', price: 298, originalPrice: 468, tags: ['特调饮品'] }
    ],
    coordinates: { lat: 31.2324, lng: 121.4757 },
    reviews: [
      {
        id: 'r3',
        userName: 'Cathy',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80',
        rating: 5,
        date: '2023-10-12',
        content: '氛围感拉满！驻唱歌手声音很好听，鸡尾酒颜值也很高，适合和男朋友一起来。',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80'],
        tags: ['氛围好', '驻唱好听']
      }
    ]
  },
  
  // Couple - Anniversary (Mapped to couple_date for now)
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
    packageType: 'couple',
    sceneTheme: 'couple_date',
    deals: [
      { title: '至尊纪念日晚宴', price: 1314, originalPrice: 1999, tags: ['包含布置', '送鲜花'] }
    ],
    coordinates: { lat: 31.2354, lng: 121.4787 }
  },

  // Bestie - Afternoon Tea (Mapped to bestie_photo)
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
    packageType: 'bestie',
    sceneTheme: 'bestie_photo',
    deals: [
      { title: '梦幻双人下午茶', price: 198, originalPrice: 368, tags: ['拍照出片', '无限续杯'] }
    ],
    coordinates: { lat: 31.2284, lng: 121.4717 }
  },

  // Bestie - Photo (Mapped to bestie_photo)
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
    packageType: 'bestie',
    sceneTheme: 'bestie_photo',
    deals: [
      { title: '双人畅拍2小时', price: 128, originalPrice: 256, tags: ['服装任选', '送精修'] }
    ],
    coordinates: { lat: 31.2384, lng: 121.4827 }
  },

  // Brother - Drink (Mapped to brother_party)
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
    packageType: 'brother',
    sceneTheme: 'brother_party',
    deals: [
      { title: '兄弟欢聚4人餐', price: 398, originalPrice: 588, tags: ['啤酒畅饮', '量大管饱'] }
    ],
    coordinates: { lat: 31.2314, lng: 121.4747 },
    reviews: [
      {
        id: 'r4',
        userName: 'David',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
        rating: 5,
        date: '2023-10-08',
        content: '肉串很大，啤酒很冰，老板人也很豪爽，兄弟聚会首选！',
        tags: ['量大', '老板热情']
      }
    ]
  },

  // Brother - Game (Mapped to brother_party)
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
    packageType: 'brother',
    sceneTheme: 'brother_party',
    deals: [
      { title: '五连坐包房通宵卡', price: 299, originalPrice: 500, tags: ['送饮料', '私密包间'] }
    ],
    coordinates: { lat: 31.2274, lng: 121.4707 }
  },

  // Fun - Cosplay (Mapped to fun_vibe)
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
    packageType: 'fun',
    sceneTheme: 'fun_vibe',
    deals: [
      { title: '单人主题套餐+周边', price: 88, originalPrice: 128, tags: ['送限定徽章'] }
    ],
    coordinates: { lat: 31.2334, lng: 121.4767 }
  },

  // Fun - Private (Mapped to fun_heat)
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
    packageType: 'fun',
    sceneTheme: 'fun_heat',
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

export type OrderStatus = 'pending' | 'unused' | 'used' | 'refunded';

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  shopImage: string;
  dealTitle: string;
  price: number;
  originalPrice: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createTime: string;
  payTime?: string;
  useTime?: string;
  verifyCode?: string; // 核销码 (e.g., "8829 1034")
  qrCodeUrl?: string; // 二维码图片链接 (mock)
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-20231025-001',
    shopId: '1',
    shopName: 'Moonlight Bistro 月光法餐厅',
    shopImage: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80',
    dealTitle: '浪漫双人烛光晚餐',
    price: 520,
    originalPrice: 888,
    quantity: 1,
    totalPrice: 520,
    status: 'unused',
    createTime: '2023-10-25 14:30:00',
    payTime: '2023-10-25 14:32:15',
    verifyCode: '8829 1034',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FINDME-88291034'
  },
  {
    id: 'ORD-20231020-002',
    shopId: '6',
    shopName: 'Brothers\' BBQ 兄弟烧烤',
    shopImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    dealTitle: '兄弟欢聚4人餐',
    price: 398,
    originalPrice: 588,
    quantity: 1,
    totalPrice: 398,
    status: 'used',
    createTime: '2023-10-20 18:00:00',
    payTime: '2023-10-20 18:05:00',
    useTime: '2023-10-20 20:15:00',
    verifyCode: '1029 3847',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FINDME-10293847'
  },
  {
    id: 'ORD-20231026-003',
    shopId: '4',
    shopName: 'Alice\'s Tea Party 爱丽丝茶屋',
    shopImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    dealTitle: '梦幻双人下午茶',
    price: 198,
    originalPrice: 368,
    quantity: 1,
    totalPrice: 198,
    status: 'pending', // 待付款
    createTime: '2023-10-26 10:00:00'
  }
];
