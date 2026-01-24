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
  dealTitle?: string; // Main deal title for display
  ranking?: string; // Ranking badge text (e.g., "天山区西餐好评榜第1名")
  district?: string; // e.g., "天山区"
  area?: string; // e.g., "大巴扎"
  sales?: number; // Monthly sales count
  deals?: {
    title: string;
    price: number;
    originalPrice: number;
    soldCount: string;
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
  recommendTag: string; // New field for recommendation tag (e.g., "非常推荐")
  icon: any;
}

export interface SceneTheme {
  id: string;
  name: string;
  packageTypeId: string;
}

export const PACKAGE_TYPES: PackageType[] = [
  { id: 'couple', name: '情侣套餐', subTitle: '甜蜜升温', recommendTag: '约会首选', icon: Heart },
  { id: 'bestie', name: '闺蜜套餐', subTitle: '精致打卡', recommendTag: '出片圣地', icon: Sparkles },
  { id: 'brother', name: '兄弟套餐', subTitle: '畅爽聚会', recommendTag: '聚会必去', icon: Users },
  { id: 'fun', name: '情趣套餐', subTitle: '私密探索', recommendTag: '人气推荐', icon: PartyPopper },
];

export const SCENE_THEMES: SceneTheme[] = [
  // Couple Scenes (情侣套餐)
  { id: 'couple_date', name: '浪漫晚餐', packageTypeId: 'couple' },
  { id: 'couple_relax', name: '轻松休闲', packageTypeId: 'couple' },
  { id: 'couple_activity', name: '互动体验', packageTypeId: 'couple' },
  { id: 'couple_view', name: '景观餐厅', packageTypeId: 'couple' },

  // Bestie Scenes (闺蜜套餐)
  { id: 'bestie_photo', name: '拍照打卡', packageTypeId: 'bestie' },
  { id: 'bestie_chat', name: '下午茶', packageTypeId: 'bestie' },
  { id: 'bestie_brunch', name: '精致早午餐', packageTypeId: 'bestie' },
  { id: 'bestie_shopping', name: '逛吃逛吃', packageTypeId: 'bestie' },

  // Brother Scenes (兄弟套餐)
  { id: 'brother_bbq', name: '烧烤撸串', packageTypeId: 'brother' },
  { id: 'brother_drink', name: '小酌一杯', packageTypeId: 'brother' },
  { id: 'brother_game', name: '电竞网咖', packageTypeId: 'brother' },
  { id: 'brother_sport', name: '运动看球', packageTypeId: 'brother' },

  // Fun Scenes (情趣套餐)
  { id: 'fun_hotel', name: '主题酒店', packageTypeId: 'fun' },
  { id: 'fun_spa', name: '私密SPA', packageTypeId: 'fun' },
  { id: 'fun_bar', name: '氛围清吧', packageTypeId: 'fun' },
  { id: 'fun_show', name: '特色演出', packageTypeId: 'fun' },
];

export const MOCK_SHOPS: Shop[] = [
  // Couple - Date
  {
    id: '1',
    name: '丝路星光·旋转餐厅',
    rating: 4.9,
    price: 320,
    distance: '500m',
    tags: ['新疆菜', '夜景', '旋转餐厅'],
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    description: '俯瞰乌鲁木齐夜景的绝佳位置，融合创意新疆菜，适合情侣约会。',
    reviewCount: 1205,
    packageType: 'couple',
    sceneTheme: 'couple_date',
    ranking: '天山区景观餐厅第1名',
    district: '天山区',
    area: '大巴扎',
    sales: 2000,
    dealTitle: '星光浪漫双人餐',
    deals: [
      { title: '星光浪漫双人餐', price: 520, originalPrice: 888, soldCount: '半年售2000+', tags: ['约会首选', '含红酒'] },
      { title: '经典新疆风味午餐', price: 168, originalPrice: 298, soldCount: '半年售500+', tags: ['工作日可用'] }
    ],
    coordinates: { lat: 43.7930, lng: 87.6177 },
    reviews: [
      {
        id: 'r1',
        userName: '古丽',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
        rating: 5,
        date: '2023-10-15',
        content: '大巴扎的夜景太美了，菜品也很精致，男朋友求婚成功啦！',
        images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80'],
        tags: ['求婚圣地', '夜景美']
      }
    ]
  },
  {
    id: '2',
    name: '天山雪莲·私房菜',
    rating: 4.8,
    price: 520,
    distance: '2.5km',
    tags: ['私房菜', '包间', '定制服务'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '隐匿于市区的私密花园，提供高端定制私房菜。',
    reviewCount: 2100,
    packageType: 'couple',
    sceneTheme: 'couple_date',
    ranking: '沙依巴克区私房菜热门榜第2名',
    district: '沙依巴克区',
    area: '友好',
    sales: 300,
    dealTitle: '520限定告白套餐',
    deals: [
      { title: '520限定告白套餐', price: 1314, originalPrice: 1999, soldCount: '半年售300+', tags: ['包含布置', '送鲜花'] }
    ],
    coordinates: { lat: 43.8050, lng: 87.5850 }
  },
  {
    id: '3',
    name: '红山顶·云端酒廊',
    rating: 4.7,
    price: 280,
    distance: '1.2km',
    tags: ['高空', '鸡尾酒', '爵士乐'],
    imageUrl: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&q=80',
    description: '红山公园旁的云端酒廊，鸡尾酒很有创意，驻唱歌手很棒。',
    reviewCount: 856,
    packageType: 'couple',
    sceneTheme: 'couple_relax',
    district: '天山区',
    area: '红山',
    sales: 1000,
    dealTitle: '云端微醺双人套餐',
    deals: [
      { title: '云端微醺双人套餐', price: 398, originalPrice: 588, soldCount: '半年售1000+', tags: ['特调饮品'] },
      { title: '经典鸡尾酒2杯', price: 128, originalPrice: 198, soldCount: '半年售3000+', tags: ['周三半价'] }
    ],
    coordinates: { lat: 43.8000, lng: 87.6000 }
  },

  // Bestie - Photo
  {
    id: '4',
    name: '花田错·下午茶',
    rating: 4.9,
    price: 158,
    distance: '800m',
    tags: ['粉色主题', '甜点', '出片'],
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    description: '仿佛置身花海的下午茶，每一款甜点都精致得让人舍不得吃。',
    reviewCount: 3420,
    packageType: 'bestie',
    sceneTheme: 'bestie_photo',
    ranking: '新市区网红打卡圣地第1名',
    district: '新市区',
    area: '铁路局',
    sales: 5000,
    dealTitle: '梦幻公主双人下午茶',
    deals: [
      { title: '梦幻公主双人下午茶', price: 268, originalPrice: 398, soldCount: '半年售5000+', tags: ['拍照出片', '无限续杯'] }
    ],
    coordinates: { lat: 43.8500, lng: 87.5600 }
  },
  {
    id: '5',
    name: '时光胶片馆',
    rating: 4.6,
    price: 88,
    distance: '1.5km',
    tags: ['自拍馆', '换装', '场景丰富'],
    imageUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80',
    description: '30+主题场景任拍，提供百套民族服装，和闺蜜拍出大片。',
    reviewCount: 1560,
    packageType: 'bestie',
    sceneTheme: 'bestie_photo',
    district: '水磨沟区',
    area: '南湖',
    sales: 800,
    dealTitle: '双人畅拍2小时',
    deals: [
      { title: '双人畅拍2小时', price: 128, originalPrice: 256, soldCount: '半年售800+', tags: ['服装任选', '送精修'] }
    ],
    coordinates: { lat: 43.8200, lng: 87.6300 }
  },

  // Brother - BBQ
  {
    id: '6',
    name: '兄弟烤肉·大巴扎店',
    rating: 4.6,
    price: 110,
    distance: '300m',
    tags: ['红柳烤肉', '夺命大乌苏', '热闹'],
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    description: '正宗红柳烤肉，大口吃肉，大碗喝酒，这就是兄弟聚会的正确打开方式。',
    reviewCount: 5600,
    packageType: 'brother',
    sceneTheme: 'brother_bbq',
    ranking: '乌鲁木齐烧烤必吃榜',
    district: '天山区',
    area: '大巴扎',
    sales: 2000,
    dealTitle: '兄弟畅饮4人套餐',
    deals: [
      { title: '兄弟畅饮4人套餐', price: 388, originalPrice: 528, soldCount: '半年售2000+', tags: ['啤酒畅饮', '量大管饱'] },
      { title: '双人撸串套餐', price: 168, originalPrice: 228, soldCount: '半年售1000+', tags: ['经典搭配'] }
    ],
    coordinates: { lat: 43.7930, lng: 87.6177 }
  },
  {
    id: '7',
    name: '极速电竞·经开万达店',
    rating: 4.9,
    price: 45,
    distance: '1.0km',
    tags: ['电竞', 'RTX4090', '专业外设'],
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    description: '顶级配置，专业电竞椅，带上兄弟一起开黑上分。',
    reviewCount: 2300,
    packageType: 'brother',
    sceneTheme: 'brother_game',
    district: '头屯河区',
    area: '经开万达',
    sales: 500,
    dealTitle: '五连坐包房通宵卡',
    deals: [
      { title: '五连坐包房通宵卡', price: 299, originalPrice: 500, soldCount: '半年售500+', tags: ['送饮料', '私密包间'] }
    ],
    coordinates: { lat: 43.8600, lng: 87.5000 }
  },

  // Fun - Vibe
  {
    id: '8',
    name: '次元壁·动漫主题餐厅',
    rating: 4.7,
    price: 98,
    distance: '2.0km',
    tags: ['二次元', '手办', '主题餐饮'],
    imageUrl: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=800&q=80',
    description: '二次元爱好者的天堂，定期举办Cosplay聚会。',
    reviewCount: 1890,
    packageType: 'fun',
    sceneTheme: 'fun_show',
    district: '沙依巴克区',
    area: '德汇万达',
    sales: 1200,
    dealTitle: '单人主题套餐+周边',
    deals: [
      { title: '单人主题套餐+周边', price: 88, originalPrice: 128, soldCount: '半年售1200+', tags: ['送限定徽章'] }
    ],
    coordinates: { lat: 43.8100, lng: 87.5900 }
  },
  {
    id: '9',
    name: '静谧时光·私人影院',
    rating: 4.8,
    price: 158,
    distance: '1.8km',
    tags: ['私人影院', '情侣包间', '4K投影'],
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    description: '私密舒适的观影空间，海量片源随心看。',
    reviewCount: 1120,
    packageType: 'fun',
    sceneTheme: 'fun_hotel',
    district: '新市区',
    area: '长春路',
    sales: 600,
    dealTitle: '情侣观影3小时',
    deals: [
      { title: '情侣观影3小时', price: 168, originalPrice: 298, soldCount: '半年售600+', tags: ['送爆米花', '可躺看'] }
    ],
    coordinates: { lat: 43.8800, lng: 87.5700 }
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
  recommendTag: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = PACKAGE_TYPES.map(pkg => ({
  id: pkg.id,
  name: pkg.name,
  label: pkg.subTitle,
  recommendTag: pkg.recommendTag,
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
  expireTime?: string; // 过期时间
  verifyCode?: string; // 核销码 (e.g., "8829 1034")
  qrCodeUrl?: string; // 二维码图片链接 (mock)
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-20231025-001',
    shopId: '1',
    shopName: '丝路星光·旋转餐厅',
    shopImage: 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80',
    dealTitle: '星光浪漫双人餐',
    price: 520,
    originalPrice: 888,
    quantity: 1,
    totalPrice: 520,
    status: 'unused',
    createTime: '2023-10-25 14:30:00',
    payTime: '2023-10-25 14:32:15',
    expireTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), // 3小时后过期
    verifyCode: '8829 1034',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FINDME-88291034'
  },
  {
    id: 'ORD-20231020-002',
    shopId: '6',
    shopName: '兄弟烤肉·大巴扎店',
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
    shopName: '花田错·下午茶',
    shopImage: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80',
    dealTitle: '梦幻双人下午茶',
    price: 198,
    originalPrice: 368,
    quantity: 1,
    totalPrice: 198,
    status: 'pending', // 待付款
    createTime: '2023-10-26 10:00:00',
    expireTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30分钟后过期
  }
];

// District and Area Data (Urumqi)
export interface Area {
  id: string;
  name: string;
}

export interface District {
  id: string;
  name: string;
  areas: Area[];
}

export const DISTRICTS: District[] = [
  {
    id: 'tianshan',
    name: '天山区',
    areas: [
      { id: 'dabazha', name: '大巴扎' },
      { id: 'hongshan', name: '红山' },
      { id: 'jiefanglu', name: '解放路' },
      { id: 'zhongshanlu', name: '中山路' }
    ]
  },
  {
    id: 'shayibake',
    name: '沙依巴克区',
    areas: [
      { id: 'youhao', name: '友好' },
      { id: 'dehuiwanda', name: '德汇万达' },
      { id: 'hongshan', name: '红山' }, // Shared area
      { id: 'nongda', name: '农大' }
    ]
  },
  {
    id: 'xinshi',
    name: '新市区',
    areas: [
      { id: 'tieluju', name: '铁路局' },
      { id: 'changchunlu', name: '长春路' },
      { id: 'xiaoxigou', name: '小西沟' },
      { id: 'zhiwuyuan', name: '植物园' }
    ]
  },
  {
    id: 'shuimogou',
    name: '水磨沟区',
    areas: [
      { id: 'nanhu', name: '南湖' },
      { id: 'huizhan', name: '会展中心' },
      { id: 'liudaowan', name: '六道湾' }
    ]
  },
  {
    id: 'toutunhe',
    name: '头屯河区',
    areas: [
      { id: 'jingkaiwanda', name: '经开万达' },
      { id: 'gaotie', name: '高铁站' }
    ]
  }
];
