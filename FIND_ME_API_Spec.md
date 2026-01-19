# FIND ME 后端接口设计文档 (API Specification)

**版本号**: v1.0  
**适用对象**: 后端开发工程师  
**协议**: RESTful API, JSON  
**最后更新**: 2026-01-19

---

## 1. 概述 (Overview)
本接口文档旨在支持“FIND ME”团购业务的完整闭环，涵盖套餐展示、交易下单、支付回调及核销验证。设计遵循 RESTful 规范，所有接口均需通过 JWT 鉴权（除公开查询接口外）。

### 1.1 通用响应结构
```json
{
  "code": 200,          // 业务状态码 (200: 成功, 400: 参数错误, 500: 系统异常)
  "message": "success", // 提示信息
  "data": { ... }       // 业务数据
}
```

---

## 2. 数据模型 (Data Models)

### 2.1 套餐 (Deal)
对应前端展示需求，支持结构化菜单和购买须知。

```typescript
interface Deal {
  id: string;
  shopId: string;
  title: string;          // 套餐标题 (e.g., "浪漫双人烛光晚餐")
  price: number;          // 现价 (精确到分)
  originalPrice: number;  // 原价
  discountLabel: string;  // 折扣标签 (e.g., "5.8折")
  salesCount: number;     // 销量 (用于展示 "半年售 1000+")
  stock: number;          // 库存 (-1 表示无限)
  status: 'ACTIVE' | 'SOLD_OUT' | 'OFFLINE'; // 状态
  
  images: string[];       // 图片列表 (首图为封面)
  
  // 结构化菜单 (支持时间轴展示)
  menu: {
    category: string;     // 分类 (e.g., "前菜")
    items: {
      name: string;       // 菜名
      count: number;      // 数量
      price?: number;     // 单价 (可选)
      imageUrl?: string;  // 菜品特写图 (用于配图联动)
    }[];
  }[];

  // 购买须知 (Icon + 文本)
  rules: {
    validity: string;     // 有效期描述
    usageTime: string;    // 使用时间 (e.g., "17:00 - 22:00")
    appointment: string;  // 预约规则
    refundPolicy: string; // 退款政策 (e.g., "anytime_refund")
    limitations: string[];// 限制条件 (e.g., ["周末不可用"])
  };
}
```

### 2.2 订单 (Order)
```typescript
interface Order {
  id: string;             // 订单号 (全局唯一)
  userId: string;
  dealId: string;
  shopId: string;
  
  status: 'PENDING_PAY' | 'PAID' | 'USED' | 'REFUNDING' | 'REFUNDED' | 'EXPIRED';
  
  quantity: number;       // 购买数量
  totalAmount: number;    // 总金额 (分)
  payTime?: number;       // 支付时间戳
  
  // 核销信息
  redemptionCode?: string;// 12位核销码 (支付成功后生成)
  qrCodeUrl?: string;     // 二维码链接
}
```

---

## 3. 接口定义 (Endpoints)

### 3.1 商家与套餐 (Shop & Deals)

#### 3.1.1 获取商家套餐列表
`GET /api/v1/shops/{shopId}/deals`

*   **描述**: 获取指定商家的所有上架套餐，用于商家详情页展示。
*   **响应**:
    ```json
    {
      "code": 200,
      "data": [
        {
          "id": "deal_001",
          "title": "浪漫双人餐",
          "price": 52000,
          "originalPrice": 88800,
          "discountLabel": "5.8折",
          "salesCount": 1205,
          "imageUrl": "https://..."
        }
      ]
    }
    ```

#### 3.1.2 获取套餐详情
`GET /api/v1/deals/{dealId}`

*   **描述**: 获取套餐的完整信息，包括结构化菜单和购买须知。
*   **响应**: 包含 `menu` 和 `rules` 完整字段。

### 3.2 交易 (Transaction)

#### 3.2.1 创建订单
`POST /api/v1/orders`

*   **描述**: 用户点击“立即购买”时调用，预占库存。
*   **请求**:
    ```json
    {
      "dealId": "deal_001",
      "quantity": 1
    }
    ```
*   **响应**:
    ```json
    {
      "code": 200,
      "data": {
        "orderId": "ord_20260119_001",
        "payParams": { ... } // 支付宝/微信支付 SDK 所需参数
      }
    }
    ```

#### 3.2.2 支付回调 (Webhook)
`POST /api/v1/callbacks/payment/{gateway}`

*   **描述**: 接收支付网关（微信/支付宝）的异步通知。
*   **逻辑**:
    1.  验签。
    2.  更新订单状态为 `PAID`。
    3.  生成 12 位唯一核销码 `redemptionCode`。
    4.  通过 WebSocket 推送消息给前端（触发“支付成功”全屏动画）。

### 3.3 订单与核销 (Order & Redemption)

#### 3.3.1 获取订单详情
`GET /api/v1/orders/{orderId}`

*   **描述**: 用于订单详情页展示，包含核销码。
*   **权限**: 仅限下单用户查看。
*   **响应**:
    ```json
    {
      "code": 200,
      "data": {
        "id": "ord_001",
        "status": "PAID",
        "redemptionCode": "2839 1029 3847", // 格式化后的字符串
        "qrCodeUrl": "https://...",
        "dealSnapshot": { ... } // 套餐快照
      }
    }
    ```

#### 3.3.2 商家核销 (Redeem)
`POST /api/v1/merchant/redeem`

*   **描述**: 商家端扫码或输入券码进行核销。
*   **请求**:
    ```json
    {
      "code": "283910293847" // 纯数字
    }
    ```
*   **逻辑**:
    1.  校验券码是否存在且状态为 `PAID`。
    2.  更新订单状态为 `USED`。
    3.  记录核销时间与操作人。
    4.  **WebSocket 推送**: 通知用户端订单状态变更（触发“盖章”动画）。

---

## 4. 业务逻辑约束 (Business Logic)

### 4.1 库存扣减
*   采用 **Redis Lua 脚本** 实现原子扣减，防止超卖。
*   订单创建时预扣库存，若 15 分钟内未支付则自动释放库存。

### 4.2 核销码生成算法
*   **格式**: 12 位纯数字。
*   **算法**: `(Timestamp + Random + Checksum)` 混淆生成，确保全局唯一且不可预测。
*   **存储**: 建立 `code -> orderId` 的唯一索引，支持 O(1) 查询。

### 4.3 状态流转限制
*   `PENDING_PAY` -> `PAID`: 仅当支付回调成功。
*   `PAID` -> `USED`: 仅当商家核销接口调用成功。
*   `PAID` -> `REFUNDING`: 用户申请退款。
*   `REFUNDING` -> `REFUNDED`: 审核通过或自动退款。
*   **不可逆**: `USED`, `REFUNDED`, `EXPIRED` 为终态，不可变更。
