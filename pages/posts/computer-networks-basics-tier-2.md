---
title: 计算机网络基础知识 - 第二梯队（高频）
date: 2026-01-05
categories:
  - 啃啃原理
tags:
  - 计算机网络
  - 基础
  - 高频
---
<ArticleViews slug="computer-networks-basics-tier-2" />

## 1. TCP 三次握手与四次挥手

### **三次握手（建立连接）**
- **SYN**：客户端发送 SYN 包请求建立连接。
- **SYN-ACK**：服务器收到 SYN 包后，回复 SYN-ACK 包。
- **ACK**：客户端收到 SYN-ACK 包后，回复 ACK 包，建立连接。

### **四次挥手（断开连接）**
- **FIN**：客户端发送 FIN 包，表示请求关闭连接。
- **ACK**：服务器收到 FIN 包后，回复 ACK 包。
- **FIN**：服务器准备好关闭连接后，发送 FIN 包。
- **ACK**：客户端收到服务器的 FIN 包后，回复 ACK 包，连接关闭。

