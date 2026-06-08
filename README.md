# 拾光集市 — 微信小程序商城

![version](https://img.shields.io/badge/version-1.0.0-blue)

## 项目简介

**拾光集市**是一个完整的微信小程序电商平台，包含商品浏览、购物车、订单管理、支付、评论等完整的电商功能。项目采用前后端分离架构：

- **前端**：微信小程序原生开发（WXML + WXSS + JavaScript）
- **后端**：Spring Boot + MyBatis + MySQL RESTful API 服务

---

## 功能模块

### 用户端（小程序）

| 模块 | 功能描述 |
|------|----------|
| 🏠 **首页** | 轮播图、推荐商品、热卖商品、全部商品展示 |
| 📂 **分类** | 按商品类别浏览筛选 |
| 🛒 **购物车** | 商品加入购物车、数量修改、结算 |
| 👤 **个人中心** | 用户信息管理、地址管理 |
| 📦 **订单管理** | 订单创建、查看、支付、状态跟踪 |
| ✍️ **商品评价** | 订单完成后发表评论 |
| 🔍 **搜索** | 商品名称搜索 |
| 🏪 **商品发布** | 用户可发布自有商品 |
| 💰 **账户余额** | 用户账户充值与管理 |

### 管理后台（API 层面）

| 接口模块 | 功能 |
|----------|------|
| 商品管理 | 商品 CRUD、推荐/热卖设置 |
| 分类管理 | 商品类别维护 |
| 订单管理 | 订单状态流转 |
| 用户管理 | 用户信息查询与维护 |
| 评论管理 | 评论审核与管理 |
| 轮播图管理 | 首页广告位管理 |
| 文件管理 | 图片上传与下载 |

---

## 技术栈

### 后端

| 技术 | 版本 | 说明 |
|------|------|------|
| Java | 17 | 运行环境 |
| Spring Boot | 2.6.8 | 核心框架 |
| MyBatis | 2.2.0 | ORM 持久层 |
| tk.mapper | 4.1.5 | 通用 Mapper |
| PageHelper | 1.2.10 | 分页插件 |
| MySQL | 8.0+ | 数据库 |
| Druid | 1.2.4 | 阿里连接池 |
| Hutool | 5.3.7 | Java 工具库 |
| Thumbnailator | 0.4.8 | 图片缩略图处理 |

### 前端

| 技术 | 说明 |
|------|------|
| 微信小程序原生框架 | WXML / WXSS / JavaScript |
| WeUI 风格 | 界面设计 |
| wx.request | 网络请求封装 |

---

## 项目结构

```
wxshop/
├── wxshopfront/                 # 微信小程序前端
│   ├── app.js                   # 小程序入口
│   ├── app.json                 # 全局配置（导航栏、TabBar）
│   ├── app.wxss                 # 全局样式
│   ├── components/              # 公共组件
│   │   └── navigation-bar/      # 自定义导航栏
│   ├── icons/                   # 图标资源
│   ├── imgs/                    # 图片资源
│   ├── pages/                   # 页面目录
│   │   ├── index/               # 首页
│   │   ├── category/            # 分类页
│   │   ├── cartInfo/            # 购物车
│   │   ├── user/                # 个人中心
│   │   ├── goodsInfo/           # 商品详情
│   │   ├── login/               # 登录页
│   │   ├── orderInfo/           # 订单列表
│   │   ├── orderDetail/         # 订单详情
│   │   ├── pay/                 # 支付页
│   │   ├── comment/             # 评价页
│   │   ├── search/              # 搜索页
│   │   ├── myGoods/             # 我的商品
│   │   ├── myGoodsList/         # 商品发布列表
│   │   ├── myGoodsOrder/        # 我的订单
│   │   ├── myComments/          # 我的评价
│   │   └── profile/             # 个人资料
│   └── request/                 # 网络请求封装
│       ├── config.js            # API 配置
│       └── index.js             # 请求工具
│
└── wxshopback/                  # Spring Boot 后端
    └── xshopping/
        ├── pom.xml              # Maven 依赖
        └── src/
            ├── main/
            │   ├── java/com/javaclimb/
            │   │   ├── XshoppingApplication.java   # 启动类
            │   │   ├── common/          # 公共类（Result、Common）
            │   │   ├── config/          # 拦截器配置
            │   │   ├── controller/      # 控制器层
            │   │   ├── entity/          # 实体类
            │   │   ├── exception/       # 异常处理
            │   │   ├── mapper/          # MyBatis 映射接口
            │   │   ├── service/         # 业务服务层
            │   │   └── vo/              # 视图对象
            │   └── resources/
            │       ├── application.yml  # 应用配置
            │       └── mapper/          # MyBatis XML 映射
            └── test/
```

---

## 数据库设计

### 核心数据表

| 表名 | 说明 |
|------|------|
| `user_info` | 用户表（姓名、密码、昵称、性别、电话、地址、余额等） |
| `goods_info` | 商品表（名称、价格、折扣、库存、销量、描述等） |
| `type_info` | 商品分类表 |
| `cart_info` | 购物车表 |
| `order_info` | 订单表 |
| `order_goods_rel` | 订单-商品关联表 |
| `comment_info` | 评价表 |
| `advertiser_info` | 轮播图/广告表 |
| `nx_system_file_info` | 文件管理表 |

---

## 快速开始

### 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0+
- 微信开发者工具

### 后端启动

1. **创建数据库**

```sql
CREATE DATABASE wx_shop CHARACTER SET utf8mb4;
```

2. **修改数据库配置**

编辑 `wxshopback/xshopping/src/main/resources/application.yml`，修改数据库用户名和密码：

```yaml
spring:
  datasource:
    username: your_username
    password: your_password
```

3. **启动后端服务**

```bash
cd wxshopback/xshopping
mvn spring-boot:run
```

服务默认运行在 `http://localhost:8080`。

### 前端启动

1. 打开**微信开发者工具**
2. 导入项目目录 `wxshopfront/`
3. 配置 AppID（可使用测试号）
4. 修改 `request/config.js` 中的 `baseFileUrl` 为后端实际地址
5. 编译运行即可预览

### API 接口概览

| 路径前缀 | 说明 |
|----------|------|
| `/goodsInfo` | 商品相关接口 |
| `/typeInfo` | 分类相关接口 |
| `/cartInfo` | 购物车接口 |
| `/orderInfo` | 订单接口 |
| `/commentInfo` | 评论接口 |
| `/userInfo` | 用户接口 |
| `/advertiserInfo` | 广告/轮播图接口 |
| `/files` | 文件上传下载 |
| `/account` | 账户操作（登录/注册） |
| `/echarts` | 数据统计接口 |

---

## 项目亮点

1. **完整的电商闭环**：涵盖商品展示 → 购物车 → 下单 → 支付 → 评价全流程
2. **前后端分离架构**：小程序通过 RESTful API 与后端通信
3. **通用 CRUD 封装**：基于 tk.mapper 和自定义 Common 类实现快速开发
4. **统一响应格式**：`Result<T>` 统一封装 API 返回结果
5. **分页支持**：PageHelper 插件实现高效分页查询
6. **文件管理**：支持商品图片上传、缩略图生成
7. **拦截器机制**：登录状态校验与权限控制

---

## 小程序截图导航

小程序名为**「拾光集市」**，包含底部四个 Tab：

- **首页** — 轮播广告 + 推荐/热卖/全部商品
- **分类** — 按类别筛选商品
- **购物车** — 管理待购商品
- **我的** — 个人中心入口

---

## License

本项目基于 MIT License 开源，可自由使用、修改和分发。
