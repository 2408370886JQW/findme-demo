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
  services?: {
    openNow?: boolean;
    hasPrivateRoom?: boolean;
    hasParking?: boolean;
  };
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
  backgroundImage: string; // New field for immersive background image
  icon: any;
  subCategories?: SceneTheme[]; // Optional subcategories for UI convenience
}

export interface SceneTheme {
  id: string;
  name: string;
  packageTypeId: string;
}

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

export const PACKAGE_TYPES: PackageType[] = [
  { 
    id: 'couple', 
    name: '情侣套餐', 
    subTitle: '甜蜜升温', 
    recommendTag: '约会首选', 
    backgroundImage: '/images/bg_couple.jpg', 
    icon: Heart,
    subCategories: SCENE_THEMES.filter(s => s.packageTypeId === 'couple')
  },
  { 
    id: 'bestie', 
    name: '闺蜜套餐', 
    subTitle: '精致打卡', 
    recommendTag: '出片圣地', 
    backgroundImage: '/images/bg_bestie.jpg', 
    icon: Sparkles,
    subCategories: SCENE_THEMES.filter(s => s.packageTypeId === 'bestie')
  },
  { 
    id: 'brother', 
    name: '兄弟套餐', 
    subTitle: '畅爽聚会', 
    recommendTag: '聚会必去', 
    backgroundImage: '/images/bg_brother.jpg', 
    icon: Users,
    subCategories: SCENE_THEMES.filter(s => s.packageTypeId === 'brother')
  },
  { 
    id: 'fun', 
    name: '情趣套餐', 
    subTitle: '私密探索', 
    recommendTag: '人气推荐', 
    backgroundImage: '/images/bg_fun.jpg', 
    icon: PartyPopper,
    subCategories: SCENE_THEMES.filter(s => s.packageTypeId === 'fun')
  },
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
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    description: '360度俯瞰乌鲁木齐夜景，浪漫氛围拉满',
    reviewCount: 1288,
    packageType: 'couple',
    sceneTheme: 'couple_view',
    services: { openNow: true, hasPrivateRoom: false, hasParking: true },
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
    description: '地道新疆味，环境优雅，适合情侣约会',
    reviewCount: 3542,
    packageType: 'couple',
    sceneTheme: 'couple_date',
    services: { openNow: true, hasPrivateRoom: true, hasParking: true },
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
    description: '高端电竞配置，兄弟开黑首选',
    reviewCount: 680,
    packageType: 'brother',
    sceneTheme: 'brother_game',
    services: { openNow: true, hasPrivateRoom: true, hasParking: true },
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
  },
  // Additional Urumqi Restaurants
  {
    id: '10',
    name: '小尕子·明园店',
    rating: 4.5,
    price: 85,
    distance: '3.2km',
    tags: ['新疆菜', '老字号', '聚餐'],
     imageUrl: 'https://images.unsplash.com/photo-1594046243098-0fceea9d451e?w=800&q=80',
    description: '正宗新疆烧烤，大口吃肉大口喝酒',
    reviewCount: 4200,
    packageType: 'brother',
    sceneTheme: 'brother_bbq',
    services: { openNow: true, hasPrivateRoom: true, hasParking: true },
    district: '沙依巴克区',
    area: '明园',
    sales: 1500,
    dealTitle: '经典大盘鸡4人餐',
    deals: [
      { title: '经典大盘鸡4人餐', price: 268, originalPrice: 358, soldCount: '半年售1500+', tags: ['分量足'] }
    ],
    coordinates: { lat: 43.8150, lng: 87.5950 }
  },
  {
    id: '11',
    name: '海尔巴格·延安路店',
    rating: 4.8,
    price: 120,
    distance: '4.5km',
    tags: ['异域风情', '歌舞表演', '自助餐'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    description: '充满异域风情的餐厅，有歌舞表演',
    reviewCount: 2100,
    packageType: 'couple',
    sceneTheme: 'couple_activity',
    services: { openNow: true, hasPrivateRoom: true, hasParking: true },
    district: '天山区',
    area: '延安路',
    sales: 1800,
    dealTitle: '异域风情双人自助',
    deals: [
      { title: '异域风情双人自助', price: 238, originalPrice: 298, soldCount: '半年售1800+', tags: ['含表演'] }
    ],
    coordinates: { lat: 43.7800, lng: 87.6200 }
  },
  {
    id: '12',
    name: '丝路有约·万象汇店',
    rating: 4.7,
    price: 100,
    distance: '5.0km',
    tags: ['创意新疆菜', '环境好', '排队王'],
    imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80',
    description: '精致下午茶，甜品颜值超高',
    reviewCount: 1560,
    packageType: 'bestie',
    sceneTheme: 'bestie_chat',
    services: { openNow: true, hasPrivateRoom: false, hasParking: true },
    district: '新市区',
    area: '万象汇',
    sales: 3000,
    dealTitle: '精致双人下午茶餐',
    deals: [
      { title: '精致双人下午茶餐', price: 188, originalPrice: 268, soldCount: '半年售3000+', tags: ['网红店'] }
    ],
    coordinates: { lat: 43.8600, lng: 87.5500 }
  },
  {
    id: '13',
    name: '柴窝堡辣子鸡·总店',
    rating: 4.4,
    price: 70,
    distance: '35km',
    tags: ['辣子鸡', '农家乐', '特色'],
    imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&q=80',
    description: '乌鲁木齐必吃辣子鸡，虽然远但是值得。',
    reviewCount: 1200,
    packageType: 'brother',
    sceneTheme: 'brother_bbq',
    district: '达坂城区',
    area: '柴窝堡',
    sales: 800,
    dealTitle: '招牌辣子鸡大份',
    deals: [
      { title: '招牌辣子鸡大份', price: 128, originalPrice: 158, soldCount: '半年售800+', tags: ['辣味十足'] }
    ],
    coordinates: { lat: 43.5000, lng: 88.0000 }
  },
  {
    id: '14',
    name: '南山牧场·星空毡房',
    rating: 4.9,
    price: 400,
    distance: '45km',
    tags: ['露营', '星空', '烧烤'],
    imageUrl: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800&q=80',
    description: '在南山脚下住进星空毡房，看满天繁星。',
    reviewCount: 600,
    packageType: 'fun',
    sceneTheme: 'fun_hotel',
    district: '乌鲁木齐县',
    area: '南山',
    sales: 200,
    dealTitle: '星空毡房住宿+烧烤',
    deals: [
      { title: '星空毡房住宿+烧烤', price: 688, originalPrice: 988, soldCount: '半年售200+', tags: ['周末需预约'] }
    ],
    coordinates: { lat: 43.4000, lng: 87.4000 }
  },
  {
    id: '15',
    name: '米东·回民街美食',
    rating: 4.5,
    price: 60,
    distance: '15km',
    tags: ['小吃', '夜市', '清真'],
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    description: '米东区最热闹的美食街，各种清真小吃应有尽有。',
    reviewCount: 2200,
    packageType: 'brother',
    sceneTheme: 'brother_bbq',
    services: { openNow: true, hasPrivateRoom: false, hasParking: true },
    district: '米东区',
    area: '回民街',
    sales: 3000,
    dealTitle: '夜市通吃券',
    deals: [
      { title: '夜市通吃券', price: 50, originalPrice: 60, soldCount: '半年售3000+', tags: ['通用'] }
    ],
    coordinates: { lat: 43.9500, lng: 87.6500 }
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
  backgroundImage: string;
  subCategories: SubCategory[];
}

export const categories: Category[] = PACKAGE_TYPES.map(pkg => ({
  id: pkg.id,
  name: pkg.name,
  label: pkg.subTitle,
  recommendTag: pkg.recommendTag,
  backgroundImage: pkg.backgroundImage,
  subCategories: SCENE_THEMES
    .filter(scene => scene.packageTypeId === pkg.id)
    .map(scene => ({
      id: scene.id,
      name: scene.name
    }))
}));

export const shops = MOCK_SHOPS;

export const districts = [
  {
    name: '天山区',
    areas: ['大巴扎', '红山', '延安路', '解放南路', '中山路']
  },
  {
    name: '沙依巴克区',
    areas: ['友好', '明园', '德汇万达', '火车站', '红庙子']
  },
  {
    name: '新市区',
    areas: ['铁路局', '长春路', '万象汇', '植物园', '小西沟']
  },
  {
    name: '水磨沟区',
    areas: ['南湖', '会展中心', '七道湾', '温泉路']
  },
  {
    name: '头屯河区',
    areas: ['经开万达', '高铁站', '白鸟湖']
  },
  {
    name: '达坂城区',
    areas: ['柴窝堡', '达坂城古镇']
  },
  {
    name: '米东区',
    areas: ['回民街', '古牧地', '卡子湾']
  },
  {
    name: '乌鲁木齐县',
    areas: ['南山', '水西沟', '板房沟']
  }
];

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  USED = 'used',
  REFUNDING = 'refunding',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export interface Order {
  id: string;
  shopId: string;
  shopName: string;
  shopImage: string;
  dealTitle: string;
  price: number;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  createTime: string;
  payTime?: string;
  useTime?: string;
  qrCode?: string;
}

// Export aliases for compatibility
// export const categories = PACKAGE_TYPES;
// export const shops = MOCK_SHOPS;
// export type Category = PackageType;
// export type SubCategory = SceneTheme;

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    shopId: '1',
    shopName: '丝路星光·旋转餐厅',
    shopImage: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80',
    dealTitle: '星光浪漫双人餐',
    price: 520,
    quantity: 1,
    totalPrice: 520,
    status: OrderStatus.USED,
    createTime: '2023-10-15 18:30',
    payTime: '2023-10-15 18:35',
    useTime: '2023-10-15 20:00',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDER-123456'
  },
  {
    id: 'o2',
    shopId: '6',
    shopName: '兄弟烤肉·大巴扎店',
    shopImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
    dealTitle: '兄弟畅饮4人套餐',
    price: 388,
    quantity: 1,
    totalPrice: 388,
    status: OrderStatus.PAID,
    createTime: '2023-10-20 19:00',
    payTime: '2023-10-20 19:05',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ORDER-789012'
  }
];
