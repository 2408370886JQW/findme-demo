import React from 'react';

interface IconProps {
  className?: string;
  color?: string;
}

// 情侣 - 左侧：男生剪影
export const CoupleLeftIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 15C14.2091 15 16 13.2091 16 11C16 8.79086 14.2091 7 12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 7V5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 5L12 3L14 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 情侣 - 右侧：女生剪影
export const CoupleRightIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C8 10 7 12 7 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 10C16 10 17 12 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 闺蜜 - 左侧：女孩A（扎马尾）
export const BestieLeftIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8L18 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 闺蜜 - 右侧：女孩B（牵手）
export const BestieRightIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 20V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16L6 19" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 兄弟 - 左侧：搭肩
export const BroLeftIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M15 14C17.2091 14 19 12.2091 19 10C19 7.79086 17.2091 6 15 6C12.7909 6 11 7.79086 11 10C11 12.2091 12.7909 14 15 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 20V19C9 16.7909 10.7909 15 13 15H17C19.2091 15 21 16.7909 21 19V20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 14C7.20914 14 9 12.2091 9 10C9 7.79086 7.20914 6 5 6C2.79086 6 1 7.79086 1 10C1 12.2091 2.79086 14 5 14Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 20V19C3 16.7909 4.79086 15 7 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 兄弟 - 右侧：篮球
export const BroRightIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3C12 3 8 8 8 12C8 16 12 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3C12 3 16 8 16 12C16 16 12 21 12 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 12H20.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 情趣 - 左侧：面具
export const PassionLeftIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M2 12C2 12 5 8 12 8C19 8 22 12 22 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 12C7 13.1046 7.89543 14 9 14C10.1046 14 11 13.1046 11 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 12C13 13.1046 13.8954 14 15 14C16.1046 14 17 13.1046 17 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L4 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 12L20 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// 情趣 - 右侧：火焰
export const PassionRightIcon: React.FC<IconProps> = ({ className, color = "currentColor" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18C13.6569 18 15 16.6569 15 15C15 13 12 11 12 11C12 11 9 13 9 15C9 16.6569 10.3431 18 12 18Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
