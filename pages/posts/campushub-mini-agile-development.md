---
title: we的学习搭子：云开发避坑与技术拆解
date: 2026-04-07
categories:
  - 项目实践
tags:
  - 微信小程序
  - Vue3
  - 云开发
---
<ArticleViews slug="campushub-mini-agile-development" />

> 本项目基于aicoding快速开发。

## 1. 为什么要做这个项目？

很多同学在做毕设或者大作业时，为了等后端接口，前端经常卡在本地动不了。我也遇到了这个问题：我们的 Web 主站后端还在吭哧吭哧写 Postgres 的配置。

**与其坐以待毙，不如主动出击。** 我直接从 Web 版剥离了最核心的“组队匹配”业务，用 Uni-app 接上微信云开发（Serverless），做了一个不用后端也能跑的“先行版”。

下面的技术细节，我不仅给出了原理，还把源码贴出来了，直接复制进你的项目就能起飞。

---

## 2. 技术拆解

### 亮点一：【前端性能】幽灵骨架屏与入场动效

**白话理解**：让加载过程不再是黑屏或白屏，而是会有“呼吸感”的灰色卡片先占位，数据回来后瞬间替换。

**代码实现（index.vue 类结构）：**

```html
<!-- 1. 骨架屏占位：当数据还在加载（loading=true）且列表为空时显示 -->
<view v-if="loading && teams.length === 0" class="loading-wall">
  <!-- 循环生成6个假卡片 -->
  <view v-for="i in 6" :key="i"
        :class="['skeleton-sticker', i % 2 === 0 ? 'rotate-left' : 'rotate-right']">
    <!-- 闪烁的光影层 -->
    <view class="skeleton-shimmer"></view>
    <!-- 模拟文字行 -->
    <view class="skeleton-content-line short"></view>
    <view class="skeleton-content-line long"></view>
  </view>
</view>

<!-- 2. 真实数据卡片：入场时带随机旋转和交错延迟 -->
<view v-for="(item, index) in teams" :key="item._id"
      class="sticker-card animate-fall-in"
      :style="{
         backgroundColor: item.color,
         /* 🌟 亮点：交错入场逻辑。第0个延迟0秒，第1个延迟0.1秒，以此类推 */
         animationDelay: (index % 10) * 0.1 + 's',
         /* 🌟 亮点：交错旋转。奇数项左偏，偶数项右偏，营造手写贴纸感 */
         '--rotate': index % 2 === 0 ? '-1.5deg' : '1.5deg'
      }">
  {{ item.content }}
</view>
```

**关键 CSS 注释：**

```css
/* 模拟飘落入场动画 */
@keyframes fallIn {
  0% { transform: translateY(-100rpx) rotate(-10deg); opacity: 0; }
  60% { transform: translateY(10rpx) rotate(2deg); opacity: 1; }
  100% { transform: translateY(0) rotate(var(--rotate)); opacity: 1; }
}

/* 骨架屏的呼吸扫光效果 */
@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.skeleton-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite; /* 永不停止的扫光 */
}
```

### 亮点二：【云端架构】Admin 权限中转（signalAction 云函数）

**技术痛点**：微信云开发数据库默认设置是“仅创建者可写”。如果 A 给 B 发了信号，B 点击“接受”时，由于 B 不是这条记录的创建者，他会报错“权限不足”。

**解决方法**：写一个具有“至高无上权限”的云函数，让 B 调用云函数，云函数帮 B 去执行修改。

**源码（cloudfunctions/signalAction/index.js）：**

```javascript
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 初始化当前环境
const db = cloud.database()

exports.main = async (event, context) => {
  const { action, id, contacts } = event // 获取前端传来的：操作类型、记录ID、联系方式
  const { OPENID } = cloud.getWXContext() // 安全！获取当前用户的真实身份ID

  try {
    // 1. 先查出这条邀约记录
    const res = await db.collection('pokes').doc(id).get()
    const poke = res.data

    // 2. 权限校验：如果操作是“接受”，那么操作者必须是这条消息的【接收者】
    if (action === 'accept') {
      if (poke.receiverId !== OPENID) return { success: false, msg: '你没权处理别人的邀约' }

      // 3. 执行原子更新：云函数以管理员权限修改数据库，无视“仅创建者可写”
      return await db.collection('pokes').doc(id).update({
        data: {
          status: 'accepted',        // 状态改为“已接受”
          receiverContacts: contacts, // 把接收者的微信/QQ透传给发送者
          updateTime: db.serverDate() // 记录操作时间
        }
      })
    }
    // ... 其他逻辑类似
  } catch (e) {
    return { success: false, error: e }
  }
}
```

### 亮点三：【数据安全】“数据快照镜像”逻辑

**技术挑战**：如果 A 发了贴子，B 投递了邀约。半小时后 A 觉得自己贴子写得不好给删了，B 的消息中心就会显示“原帖内容已失效”。

**核心思路**：在 B 投递的那一刻，我们把 A 的贴子内容直接“复印”一份，存在邀约表里。

**源码（index.vue 发送逻辑）：**

```javascript
const confirmPoke = async () => {
  const item = selectedItem.value // 当前选中的那个贴纸对象

  uni.showLoading({ title: '发送中...' })
  try {
    const db = wx.cloud.database()
    await db.collection('pokes').add({
      data: {
        targetTeamId: item._id,       // 关联的原帖ID
        targetTeamContent: item.content, // 【关键】保存那张贴纸的文字镜像！
        receiverId: item._openid,     // 对方的ID
        status: 'pending',            // 初始状态：等待处理
        senderId: userStore.openid,   // 我的ID
        applyMsg: applyMsg.value,     // 我的留言
        createTime: db.serverDate()   // 服务器时间
      }
    })
    uni.showToast({ title: '已发射！' })
  } catch (e) {
    console.error(e)
  }
}
```

### 亮点四：【业务治理】内容时效沉降与抗并发校验

#### 功能 1：30 天自动清理广场

不用定时脚本！我们在查询时直接加一个时间过滤器，超过 30 天的帖子自动“沉没”。

```javascript
const fetchTeams = async () => {
  const db = wx.cloud.database()
  const _ = db.command
  // 计算30天前的时间点
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const { data } = await db.collection('teams')
    .where({
      createTime: _.gt(thirtyDaysAgo) // 🌟 只拉取创建时间大于30天前的帖子
    })
    .orderBy('createTime', 'desc')
    .get()
}
```

#### 功能 2：防止薅羊毛（幂等性校验）

同一个贴纸，你只能投递一次，防止有人恶意轰炸。

```javascript
// 在点击“发送”之前执行
const handlePoke = async (item) => {
  const db = wx.cloud.database()
  // 查一下库里有没有【我给这个帖子发过信号】的记录
  const { data } = await db.collection('pokes').where({
    targetTeamId: item._id,
    senderId: userStore.openid
  }).get()

  if (data.length > 0) {
    uni.showToast({ title: '你已经投递过啦，请耐心等待', icon: 'none' })
    return // 直接拦截，不准再填表单
  }
  // ... 弹出留言面板
}
```

---

## 3. 未来如何推进？（无缝迁移思路）

等我们统一的正规大后端建设完毕，小程序端的重构也是非常丝滑的：

- **网路层适配**：我会在代码中定义一个 service 模块。现在 `service.getTeams` 内部调用的是 `wx.cloud.callFunction`。
- **平滑重构**：重构时，我只需要在 service 模块内部改写成 `wx.request` 统一调用主站 API。
- **UI 零改动**：由于业务逻辑和 UI 展示是完全解耦的，页面代码（.vue 文件）一行都不用动。

---

**总结**：不仅跑得快，还留有后手，这才是敏捷开发的真谛。

<ArticleComments slug="campushub-mini-agile-development" />
