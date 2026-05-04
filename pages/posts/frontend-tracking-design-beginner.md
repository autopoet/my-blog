---
title: 从零学习前端埋点设计：初学者入门版
date: 2026-04-23
categories:
  - 大数据
tags:
  - 前端
  - 埋点设计
  - 数据分析
---

<ArticleViews slug="frontend-tracking-design-beginner" />

很多前端同学第一次接触“埋点”时，会以为它只是：

用户点击按钮时，发一个请求记录一下。

比如：

```javascript
track('button_click')
```

但真正的埋点设计不只是“记录点击”，而是要把用户行为转化成可以分析的数据，帮助产品、运营、数据同学判断：用户从哪里来、看到了什么、点了什么、在哪一步流失了。

## 一、什么是埋点？

埋点就是在用户使用产品的关键位置记录行为。

比如一个电商推荐流页面，用户路径可能是：

**进入页面 -> 看到商品 -> 点击商品 -> 加入购物车 -> 购买**

这些行为都可以被记录成事件：

*   `page_view`
*   `product_exposure`
*   `product_click`
*   `add_to_cart`
*   `purchase_success`

通过这些数据，我们就能分析：

1.  有多少人进入页面？
2.  哪些商品被看到了？
3.  哪些商品被点击了？
4.  用户在哪一步流失？
5.  哪个广告渠道带来的用户转化更好？

## 二、为什么前端要懂埋点？

因为很多用户行为最先发生在浏览器里。

比如：

*   用户是否点击了按钮
*   商品是否进入视口
*   弹窗是否展示
*   图片是否加载失败
*   页面是否加载太慢

这些信息通常需要前端采集。

尤其在电商、广告、推荐流业务里，前端埋点非常重要。比如我们要计算商品点击率：

**CTR = 点击数 / 曝光数**

如果曝光埋点不准确，点击率也会失真。

## 三、常见埋点类型

### 1. 页面访问埋点
记录用户进入了哪个页面。

```javascript
track('page_view', {
  page: 'ProductFeed',
})
```

### 2. 曝光埋点
记录用户是否看到了某个内容。

```javascript
track('product_exposure', {
  productId: 'sku_1001',
  position: 3,
})
```

曝光埋点要注意定义“有效曝光”。比如：
**商品进入视口超过 50%，并停留 1 秒以上，才算一次曝光。**

### 3. 点击埋点
记录用户点击了某个元素。

```javascript
track('product_click', {
  productId: 'sku_1001',
  position: 3,
})
```

### 4. 转化埋点
记录用户完成了关键业务动作。

```javascript
track('add_to_cart', {
  productId: 'sku_1001',
  price: 199,
})
```

常见转化事件有：**加购、下单、支付成功、领取优惠券**。

## 四、一个埋点事件应该包含什么？

不要每个地方随手写不同格式的数据。更好的方式是设计统一事件模型。

```typescript
type TrackEvent = {
  eventId: string
  eventName: string
  timestamp: number
  sessionId: string
  userId?: string
  page: string
  productId?: string
  position?: number
  payload?: Record<string, unknown>
}
```

**字段含义：**

| 字段 | 含义 |
| :--- | :--- |
| eventId | 事件唯一 ID，用于去重 |
| eventName | 事件名称 |
| timestamp | 事件发生时间 |
| sessionId | 当前会话 |
| userId | 用户 ID |
| page | 当前页面 |
| productId | 商品 ID |
| position | 商品位置 |
| payload | 扩展字段 |

统一事件模型的好处是：后续分析、排查和维护都会更简单。

## 五、以前端商品推荐流为例

假设我们做一个电商推荐流页面，用户链路是：

**进入页面 -> 商品曝光 -> 商品点击 -> 加购 -> 购买**

可以设计这些事件：

| 事件名 | 触发时机 | 关键字段 |
| :--- | :--- | :--- |
| page_view | 进入页面 | page, channel |
| product_exposure | 商品有效曝光 | productId, position |
| product_click | 点击商品 | productId, position |
| add_to_cart | 加购商品 | productId, price |
| purchase_success | 购买成功 | productId, orderId |

这样就能形成一个简单漏斗：**曝光 -> 点击 -> 加购 -> 购买**

并计算：
*   **点击率** = 点击数 / 曝光数
*   **加购率** = 加购数 / 点击数
*   **购买率** = 购买数 / 点击数

## 六、一个简单的 track 方法

初学阶段可以先写一个简单版本：

```javascript
function track(eventName: string, payload = {}) {
  const event = {
    eventId: crypto.randomUUID(),
    eventName,
    timestamp: Date.now(),
    sessionId: getSessionId(),
    page: location.pathname,
    payload,
  }

  console.log('[track]', event)

  navigator.sendBeacon?.('/api/track', JSON.stringify(event))
}
```

`getSessionId` 可以这样写：

```javascript
function getSessionId() {
  const key = 'session_id'
  let sessionId = localStorage.getItem(key)

  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
  }

  return sessionId
}
```

这个版本虽然简单，但已经有了埋点系统的基本结构：
**统一入口 -> 补充公共字段 -> 上报事件**

## 七、初学者最容易踩的坑

1.  **只记录点击，不记录曝光**：如果只有点击数，没有曝光数，就无法计算点击率。
2.  **事件名不统一**：比如同一个行为，有时叫 `product_click`，有时叫 `click_product`。
3.  **字段格式不统一**：比如价格字段，有的传数字 `199`，有的传字符串 `'￥199'`。
4.  **重复上报**：常见原因包括组件重复渲染、用户反复滚动等。关键事件要考虑去重。

## 八、总结

埋点不是简单地“点一下发个请求”，而是一个从业务目标出发的数据设计过程。

初学者可以记住这几个点：
*   先梳理用户链路，再设计事件
*   事件名和字段结构要统一
*   曝光、点击、转化都要记录
*   曝光埋点要考虑有效曝光和去重
*   埋点代码最好封装成统一的 `track()` 方法

如果你想练习埋点设计，可以从一个电商推荐流页面开始：**曝光 -> 点击 -> 加购 -> 购买**。这条链路简单，但已经能覆盖埋点设计中最重要的概念。

<ArticleComments slug="frontend-tracking-design-beginner" />
