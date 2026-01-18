import { Heart, Users, Coffee, Beer, Gamepad2, Sparkles, GraduationCap, MessageCircle, Camera, Smile, PartyPopper, Flame, Puzzle, Film, Palette, Moon, Gem, ShoppingBag } from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  icon: any;
}

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  tags: string[];
  subCategories?: SubCategory[];
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
  category: string;
  subCategory: string;
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

export const SCENES: Category[] = [
  {
    id: 'date',
    name: '两人约会',
    icon: Heart,
    color: 'text-pink-500',
    description: '初次见面 / 恋爱约会',
    tags: ['情侣', '暧昧对象'],
    subCategories: [
      { id: 'date_normal', name: '约会', icon: Heart },
      { id: 'party', name: '聚会', icon: PartyPopper },
      { id: 'catchup', name: '叙旧', icon: MessageCircle },
      { id: 'girls_tea', name: '闺蜜下午茶', icon: Coffee }
    ]
  },
  {
    id: 'emotion',
    name: '感情升温',
    icon: Sparkles,
    color: 'text-orange-500',
    description: '增进情感与互动',
    tags: ['情侣', '搭子'],
    subCategories: [
      { id: 'interactive', name: '互动体验', icon: Puzzle },
      { id: 'private_cinema', name: '私密影院', icon: Film },
      { id: 'diy', name: 'DIY手作', icon: Palette },
      { id: 'night_tour', name: '浪漫夜游', icon: Moon }
    ]
  },
  {
    id: 'girls',
    name: '闺蜜叙旧',
    icon: Users,
    color: 'text-purple-500',
    description: '女性社交聚会',
    tags: ['闺蜜', '好友'],
    subCategories: [
      { id: 'afternoon_tea', name: '精致下午茶', icon: Coffee },
      { id: 'beauty', name: '美甲美睫', icon: Gem },
      { id: 'shopping', name: '逛街购物', icon: ShoppingBag },
      { id: 'photo_spot', name: '拍照打卡', icon: Camera }
    ]
  },
  {
    id: 'bros',
    name: '兄弟聚会',
    icon: Beer,
    color: 'text-blue-500',
    description: '男性社交聚会',
    tags: ['兄弟', '朋友'],
    subCategories: [
      { id: 'bros_drink', name: '兄弟喝酒', icon: Beer },
      { id: 'acg', name: '二次元', icon: Gamepad2 },
      { id: 'bbq', name: '烧烤撸串', icon: Flame },
      { id: 'billiards', name: '台球竞技', icon: Puzzle }
    ]
  },
  {
    id: 'chat',
    name: '深度聊天',
    icon: MessageCircle,
    color: 'text-indigo-500',
    description: '适合静态交流的空间',
    tags: ['情侣', '闺蜜', '搭子'],
    subCategories: [
      { id: 'quiet_bar', name: '清吧', icon: Beer },
      { id: 'tea_house', name: '茶馆', icon: Coffee },
      { id: 'book_store', name: '书店', icon: GraduationCap },
      { id: 'coffee_shop', name: '咖啡馆', icon: Coffee }
    ]
  },
  {
    id: 'vibe',
    name: '氛围拉满',
    icon: Flame,
    color: 'text-red-500',
    description: '情绪与沉浸感强的消费场景',
    tags: ['情侣', '情趣', '搭子'],
    subCategories: [
      { id: 'live_house', name: 'LiveHouse', icon: PartyPopper },
      { id: 'club', name: '夜店', icon: Sparkles },
      { id: 'bistro', name: '小酒馆', icon: Beer },
      { id: 'rooftop', name: '露台酒吧', icon: Moon }
    ]
  },
  {
    id: 'photo',
    name: '轻松/浪漫可拍照',
    icon: Camera,
    color: 'text-rose-400',
    description: '高颜值、出片率高',
    tags: ['情侣', '闺蜜'],
    subCategories: [
      { id: 'exhibition', name: '看展', icon: Palette },
      { id: 'park', name: '公园', icon: Smile },
      { id: 'landmark', name: '地标打卡', icon: Map },
      { id: 'ins_cafe', name: '网红店', icon: Camera }
    ]
  },
  {
    id: 'value',
    name: '有情绪价值',
    icon: Smile,
    color: 'text-yellow-500',
    description: '能带来放松与陪伴体验',
    tags: ['所有人群'],
    subCategories: [
      { id: 'pet_cafe', name: '猫咖狗咖', icon: Heart },
      { id: 'massage', name: '按摩足疗', icon: Smile },
      { id: 'bath', name: '洗浴汗蒸', icon: Sparkles },
      { id: 'board_game', name: '剧本杀', icon: Puzzle }
    ]
  }
];

export const MOCK_SHOPS: Shop[] = [
  // 两人约会
  {
    id: '1',
    name: 'Moonlight Bistro 月光法餐厅',
    category: 'date',
    subCategory: 'date_normal',
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
  {
    id: '2',
    name: 'Neon Cyber Bar 赛博酒馆',
    category: 'date',
    subCategory: 'party',
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
  },
  {
    id: '3',
    name: 'Retro Arcade X 复古电玩城',
    category: 'bros',
    subCategory: 'acg',
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
  {
    id: '4',
    name: 'Cloud 9 Spa 云端SPA',
    category: 'date',
    subCategory: 'girls_tea',
    rating: 4.7,
    price: 450,
    distance: '2.5km',
    tags: ['精油', '放松', '私密'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    description: '做完SPA再喝个下午茶，闺蜜聚会的完美一站式体验。',
    reviewCount: 560,
    coordinates: { lat: 31.2354, lng: 121.4787 }
  },
  {
    id: '5',
    name: 'Silent Library Cafe 静谧书咖',
    category: 'date',
    subCategory: 'catchup',
    rating: 4.6,
    price: 45,
    distance: '300m',
    tags: ['安静', '书香', '手冲'],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    description: '在这里，时间仿佛静止，最适合老友重逢，深度长谈。',
    reviewCount: 340,
    coordinates: { lat: 31.2294, lng: 121.4727 }
  },
  {
    id: '6',
    name: 'Brothers BBQ 兄弟烧烤',
    category: 'bros',
    subCategory: 'bros_drink',
    rating: 4.5,
    price: 120,
    distance: '1.5km',
    tags: ['烧烤', '啤酒', '露天'],
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    description: '大口吃肉，大碗喝酒，兄弟聚会的不二之选。',
    reviewCount: 670,
    coordinates: { lat: 31.2314, lng: 121.4747 }
  },
  {
    id: '7',
    name: 'Campus Memory 校园回忆',
    category: 'date',
    subCategory: 'date_normal',
    rating: 4.8,
    price: 180,
    distance: '2.0km',
    tags: ['怀旧', '创意菜', '氛围'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '专为大学生情侣打造的纪念日餐厅，性价比高又有仪式感。',
    reviewCount: 450,
    coordinates: { lat: 31.2334, lng: 121.4767 }
  },
  // 感情升温
  {
    id: '8',
    name: 'Pottery Love 陶艺工坊',
    category: 'emotion',
    subCategory: 'diy',
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
  {
    id: '9',
    name: 'Starlight Cinema 星空影院',
    category: 'emotion',
    subCategory: 'private_cinema',
    rating: 4.7,
    price: 128,
    distance: '900m',
    tags: ['私密', '巨幕', '躺椅'],
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    description: '私密包厢，海量片源，享受二人世界的观影乐趣。',
    reviewCount: 580,
    coordinates: { lat: 31.2274, lng: 121.4707 }
  },
  {
    id: '10',
    name: 'Night Cruise 浦江夜游',
    category: 'emotion',
    subCategory: 'night_tour',
    rating: 4.6,
    price: 150,
    distance: '3.0km',
    tags: ['夜景', '游船', '浪漫'],
    imageUrl: 'https://images.unsplash.com/photo-1506351421178-63b52a2d2562?w=800&q=80',
    description: '吹着晚风，欣赏两岸璀璨灯火，浪漫指数爆表。',
    reviewCount: 2100,
    coordinates: { lat: 31.2404, lng: 121.4907 }
  },
  // 闺蜜叙旧
  {
    id: '11',
    name: 'Alice Garden 爱丽丝花园',
    category: 'girls',
    subCategory: 'afternoon_tea',
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
  {
    id: '12',
    name: 'Pink Lady Nail Salon 粉红佳人',
    category: 'girls',
    subCategory: 'beauty',
    rating: 4.7,
    price: 220,
    distance: '1.1km',
    tags: ['美甲', '美睫', '日式'],
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&q=80',
    description: '日式服务，环境优雅，和闺蜜一起变美的好去处。',
    reviewCount: 430,
    coordinates: { lat: 31.2344, lng: 121.4777 }
  },
  {
    id: '13',
    name: 'Art Museum 艺术美术馆',
    category: 'girls',
    subCategory: 'photo_spot',
    rating: 4.9,
    price: 100,
    distance: '2.2km',
    tags: ['展览', '艺术', '拍照'],
    imageUrl: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80',
    description: '光影交错的艺术空间，随手一拍都是大片。',
    reviewCount: 1500,
    coordinates: { lat: 31.2384, lng: 121.4827 }
  }
];
