import { Heart, Users, Coffee, Beer, Gamepad2, Sparkles, GraduationCap, MessageCircle, Camera, Smile, PartyPopper, Flame } from "lucide-react";

export interface SubCategory {
  id: string;
  name: string;
  icon: any; // 新增图标字段
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

// 更新场景数据，为二级分类添加图标
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
      { id: 'girls_tea', name: '闺蜜下午茶', icon: Coffee },
      { id: 'bros_drink', name: '兄弟喝酒', icon: Beer },
      { id: 'acg', name: '二次元', icon: Gamepad2 },
      { id: 'anniversary', name: '大学情侣周年纪念', icon: GraduationCap }
    ]
  },
  {
    id: 'emotion',
    name: '感情升温',
    icon: Sparkles,
    color: 'text-orange-500',
    description: '增进情感与互动',
    tags: ['情侣', '搭子']
  },
  {
    id: 'girls',
    name: '闺蜜叙旧',
    icon: Users,
    color: 'text-purple-500',
    description: '女性社交聚会',
    tags: ['闺蜜', '好友']
  },
  {
    id: 'bros',
    name: '兄弟聚会',
    icon: Beer,
    color: 'text-blue-500',
    description: '男性社交聚会',
    tags: ['兄弟', '朋友']
  },
  {
    id: 'chat',
    name: '深度聊天',
    icon: MessageCircle,
    color: 'text-indigo-500',
    description: '适合静态交流的空间',
    tags: ['情侣', '闺蜜', '搭子']
  },
  {
    id: 'vibe',
    name: '氛围拉满',
    icon: Flame,
    color: 'text-red-500',
    description: '情绪与沉浸感强的消费场景',
    tags: ['情侣', '情趣', '搭子']
  },
  {
    id: 'photo',
    name: '轻松/浪漫可拍照',
    icon: Camera,
    color: 'text-rose-400',
    description: '高颜值、出片率高',
    tags: ['情侣', '闺蜜']
  },
  {
    id: 'value',
    name: '有情绪价值',
    icon: Smile,
    color: 'text-yellow-500',
    description: '能带来放松与陪伴体验',
    tags: ['所有人群']
  }
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Moonlight Bistro 月光法餐厅',
    category: 'date',
    subCategory: 'anniversary',
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
    category: 'date',
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
    category: 'date',
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
  }
];
