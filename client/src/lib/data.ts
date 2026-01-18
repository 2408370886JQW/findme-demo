import { MapPin, Heart, Users, Coffee, Utensils, Beer, Gamepad2, Sparkles, Camera, Smile } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  tags: string[];
}

export interface Shop {
  id: string;
  name: string;
  category: string; // 对应 Category.id
  subCategory: 'eat' | 'drink' | 'play' | 'joy';
  rating: number;
  price: number;
  distance: string;
  tags: string[];
  imageUrl: string;
  description: string;
  reviewCount: number;
  isHot?: boolean;
  coordinates: { lat: number; lng: number };
}

export const SCENES: Category[] = [
  {
    id: 'date',
    name: '两人约会',
    icon: Heart,
    color: 'bg-pink-400',
    description: '初次见面 / 恋爱约会',
    tags: ['精致西餐', '氛围感', '私密']
  },
  {
    id: 'intimacy',
    name: '感情升温',
    icon: Sparkles,
    color: 'bg-red-400',
    description: '增进情感与互动',
    tags: ['互动娱乐', '小酒馆', '沉浸式']
  },
  {
    id: 'girls',
    name: '闺蜜叙旧',
    icon: Users,
    color: 'bg-purple-400',
    description: '女性社交聚会',
    tags: ['下午茶', '拍照', 'SPA']
  },
  {
    id: 'bros',
    name: '兄弟聚会',
    icon: Beer,
    color: 'bg-blue-400',
    description: '男性社交聚会',
    tags: ['烧烤', '电玩', 'KTV']
  },
  {
    id: 'chat',
    name: '深度聊天',
    icon: Coffee,
    color: 'bg-amber-400',
    description: '适合静态交流的空间',
    tags: ['安静', '咖啡馆', '茶室']
  },
  {
    id: 'vibe',
    name: '氛围拉满',
    icon: Utensils,
    color: 'bg-indigo-400',
    description: '情绪与沉浸感强的消费场景',
    tags: ['Livehouse', '调酒', '夜景']
  },
  {
    id: 'photo',
    name: '轻松/浪漫可拍照',
    icon: Camera,
    color: 'bg-rose-400',
    description: '高颜值、出片率高',
    tags: ['网红店', '设计感', '打卡']
  },
  {
    id: 'emotion',
    name: '有情绪价值',
    icon: Smile,
    color: 'bg-green-400',
    description: '能带来放松与陪伴体验',
    tags: ['猫咖', '解压', '治愈']
  }
];

export const MAIN_CATEGORIES = [
  { id: 'eat', name: '吃', icon: Utensils, color: 'bg-orange-500', image: '/images/category-eat.jpg' },
  { id: 'drink', name: '喝', icon: Coffee, color: 'bg-blue-500', image: '/images/category-drink.jpg' },
  { id: 'play', name: '玩', icon: Gamepad2, color: 'bg-purple-500', image: '/images/category-play.jpg' },
  { id: 'joy', name: '乐', icon: Smile, color: 'bg-green-500', image: '/images/category-joy.jpg' },
];

export const MOCK_SHOPS: Shop[] = [
  {
    id: '1',
    name: 'Moonlight Bistro',
    category: 'date',
    subCategory: 'eat',
    rating: 4.8,
    price: 280,
    distance: '500m',
    tags: ['法式', '露台', '夜景'],
    imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80',
    description: '浪漫的法式小馆，拥有绝佳的城市夜景视野，适合情侣约会。',
    reviewCount: 1205,
    isHot: true,
    coordinates: { lat: 31.2304, lng: 121.4737 }
  },
  {
    id: '2',
    name: 'Neon Cyber Bar',
    category: 'vibe',
    subCategory: 'drink',
    rating: 4.6,
    price: 120,
    distance: '1.2km',
    tags: ['赛博朋克', '特调', 'DJ'],
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800&q=80',
    description: '充满未来感的霓虹灯装饰，每晚都有知名DJ驻场。',
    reviewCount: 890,
    coordinates: { lat: 31.2324, lng: 121.4757 }
  },
  {
    id: '3',
    name: 'Retro Arcade X',
    category: 'bros',
    subCategory: 'play',
    rating: 4.9,
    price: 80,
    distance: '800m',
    tags: ['街机', '怀旧', '竞技'],
    imageUrl: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&q=80',
    description: '集合了80-90年代经典街机游戏，兄弟对战首选。',
    reviewCount: 2300,
    isHot: true,
    coordinates: { lat: 31.2284, lng: 121.4717 }
  },
  {
    id: '4',
    name: 'Cloud 9 Spa',
    category: 'girls',
    subCategory: 'joy',
    rating: 4.7,
    price: 450,
    distance: '2.5km',
    tags: ['精油', '放松', '私密'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
    description: '云端般的放松体验，专业的芳疗师为您缓解疲劳。',
    reviewCount: 560,
    coordinates: { lat: 31.2354, lng: 121.4787 }
  },
  {
    id: '5',
    name: 'Silent Library Cafe',
    category: 'chat',
    subCategory: 'drink',
    rating: 4.5,
    price: 45,
    distance: '300m',
    tags: ['安静', '书香', '手冲'],
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    description: '在这里，时间仿佛静止，只剩下咖啡香和书页翻动的声音。',
    reviewCount: 340,
    coordinates: { lat: 31.2294, lng: 121.4727 }
  },
  {
    id: '6',
    name: 'Secret Garden Pot',
    category: 'intimacy',
    subCategory: 'eat',
    rating: 4.4,
    price: 150,
    distance: '1.5km',
    tags: ['火锅', '鲜花', '创意'],
    imageUrl: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80',
    description: '在花海中享用热气腾腾的火锅，独特的视觉与味觉双重享受。',
    reviewCount: 670,
    coordinates: { lat: 31.2314, lng: 121.4747 }
  }
];
