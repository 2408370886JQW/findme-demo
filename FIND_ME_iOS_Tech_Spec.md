# FIND ME iOS 客户端开发技术规格书

**版本号**: v1.0  
**适用对象**: iOS 开发工程师  
**技术栈**: Swift 5+, SwiftUI / UIKit (混合开发), MVVM, Combine  
**最后更新**: 2026-01-19

---

## 1. 架构设计 (Architecture)

### 1.1 总体架构
推荐采用 **MVVM (Model-View-ViewModel)** 架构，配合 **Combine** 框架处理数据流绑定。

*   **Model**: 定义数据结构 (`struct`, `Codable`)，负责数据解析。
*   **ViewModel**: 持有状态 (`@Published`)，处理业务逻辑（如筛选过滤、团购计算），不引用 UIKit/SwiftUI View。
*   **View**: 负责 UI 布局和交互，通过 `ObservedObject` 或 `Combine` 订阅 ViewModel 变化。
*   **Service Layer**: 封装网络请求 (`NetworkManager`)、定位服务 (`LocationManager`) 和本地存储。

### 1.2 目录结构建议
```
FindMe/
├── App/
│   ├── AppDelegate.swift
│   └── SceneDelegate.swift
├── Models/              # 数据模型 (Codable)
├── ViewModels/          # 业务逻辑
├── Views/
│   ├── Home/            # 首页模块
│   ├── ShopDetail/      # 商家详情 & 团购
│   ├── Order/           # 订单中心
│   └── Components/      # 通用组件 (Button, Card, Badge)
├── Services/            # 核心服务 (API, Location, Payment)
├── Utils/               # 工具类 (Extensions, Constants)
└── Resources/           # Assets, Localizable
```

---

## 2. 核心模块技术实现 (Core Modules Implementation)

### 2.1 首页与地图 (Home & Map)
**技术选型**: `MAMapKit` (高德地图 SDK) 或 `MapKit` (Apple 原生)。鉴于设计风格仿高德，建议优先考虑高德 SDK 以获得更好的国内数据支持，若追求原生体验则用 MapKit。

*   **UI 实现**:
    *   **侧边栏 (Sidebar)**: 使用 `UICollectionView` (Compositional Layout) 或 SwiftUI `List` 实现手风琴效果。
    *   **地图层**: 封装 `UIViewRepresentable` (SwiftUI) 或直接在 VC 中添加 `MAMapView`。
    *   **POI 聚合**: 开启地图 SDK 的点聚合功能 (`clusteringEnabled = true`)，自定义 `MAAnnotationView` 实现气泡样式。
*   **交互逻辑**:
    *   监听侧边栏点击 -> 更新 ViewModel `selectedCategory` -> 触发地图 `removeAnnotations` & `addAnnotations`。
    *   监听地图 Region 变化 -> 触发“搜索该区域”逻辑。

### 2.2 团购交易 (Group Buying Transaction)
**核心逻辑**: 完整的电商下单闭环。

#### 2.2.1 数据模型 (Swift)
```swift
// 团购套餐详情
struct DealDetail: Codable, Identifiable {
    let id: String
    let title: String
    let price: Decimal
    let originalPrice: Decimal
    let salesCount: Int
    let menu: [MenuSection]
    let rules: DealRules
}

struct MenuSection: Codable {
    let category: String // e.g. "前菜"
    let items: [MenuItem]
}

struct MenuItem: Codable {
    let name: String
    let count: Int
    let price: Decimal?
}

struct DealRules: Codable {
    let validity: String
    let usageTime: String
    let refundPolicy: String // e.g. "anytime_refund"
}
```

#### 2.2.2 支付流程 (Payment Flow)
1.  **创建订单**: 调用后端 API `POST /order/create`，获取 `orderId` 和 `payParams`。
2.  **调起支付**:
    *   集成 **AlipaySDK** 和 **WeChatSDK**。
    *   使用 `Strategy Pattern` 封装支付服务 `PaymentService.pay(order: method:)`。
3.  **支付回调**:
    *   在 `AppDelegate` 中处理 `openURL` 回调。
    *   通过 `NotificationCenter` 或 `Combine Subject` 通知 UI 支付结果。

### 2.3 订单与核销 (Order & Redemption)
**核心功能**: 二维码生成与屏幕亮度调节。

*   **二维码生成**:
    使用 `CoreImage` 滤镜生成二维码，无需第三方库。
    ```swift
    func generateQRCode(from string: String) -> UIImage? {
        let data = string.data(using: String.Encoding.ascii)
        if let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(data, forKey: "inputMessage")
            let transform = CGAffineTransform(scaleX: 10, y: 10) // 放大以防模糊
            if let output = filter.outputImage?.transformed(by: transform) {
                return UIImage(ciImage: output)
            }
        }
        return nil
    }
    ```
*   **屏幕高亮**:
    进入核销页时强制调亮屏幕，退出时恢复。
    ```swift
    // onAppear
    let originalBrightness = UIScreen.main.brightness
    UIScreen.main.brightness = 1.0 
    
    // onDisappear
    UIScreen.main.brightness = originalBrightness
    ```

### 2.4 视觉效果 (Visual Effects)
*   **Glassmorphism (毛玻璃)**:
    *   SwiftUI: `.background(.ultraThinMaterial)`
    *   UIKit: `UIVisualEffectView(effect: UIBlurEffect(style: .systemUltraThinMaterial))`
*   **阴影优化**:
    避免直接使用黑色阴影，建议使用带有主色调的阴影以提升质感。
    ```swift
    view.layer.shadowColor = UIColor(named: "PrimaryRed")?.withAlphaComponent(0.2).cgColor
    view.layer.shadowOffset = CGSize(width: 0, height: 4)
    view.layer.shadowRadius = 8
    view.layer.shadowOpacity = 1
    ```

---

## 3. 数据存储与网络 (Data & Network)

### 3.1 本地持久化
*   **用户偏好**: `UserDefaults` 存储 `isDarkMode`, `lastLocation`。
*   **收藏列表**: 建议使用 **CoreData** 或 **Realm**，因为需要支持离线查看和复杂查询（如按时间排序）。

### 3.2 网络层
*   推荐使用 **Moya** (基于 Alamofire) 进行 API 抽象，定义 `ShopAPI` 枚举。
*   **图片加载**: 使用 **Kingfisher** 或 **SDWebImage**，开启内存+磁盘双重缓存。

---

## 4. 关键第三方库推荐 (Dependencies)

| 功能 | 推荐库 (Swift Package Manager) | 说明 |
| :--- | :--- | :--- |
| **网络请求** | `Moya` / `Alamofire` | 规范化 API 调用 |
| **图片加载** | `Kingfisher` | 高性能图片缓存与处理 |
| **布局 (UIKit)** | `SnapKit` | 简洁的 DSL 链式布局 |
| **UI 组件** | `FloatingPanel` | 实现类似地图 App 的底部浮层交互 |
| **Toast 提示** | `ProgressHUD` / `Toast-Swift` | 轻量级提示反馈 |
| **骨架屏** | `SkeletonView` | 加载状态占位动画 |

---

## 5. 开发注意事项 (Notes)

1.  **权限处理**:
    *   定位权限 (`NSLocationWhenInUseUsageDescription`) 需在 Info.plist 配置，并在首次进入地图时动态申请。
    *   相册权限 (`NSPhotoLibraryAddUsageDescription`) 用于保存分享海报。
2.  **深色模式适配**:
    *   所有颜色资源需在 `Assets.xcassets` 中配置 Light/Dark 两套色值。
    *   代码中尽量使用 `UIColor.systemBackground`, `UIColor.label` 等语义化颜色。
3.  **安全区域**:
    *   自定义导航栏和底部浮层时，务必通过 `safeAreaInsets` 适配刘海屏和灵动岛。
