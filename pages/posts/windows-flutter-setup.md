---
title: Windows Flutter 安装指南
date: 2026-04-09
categories:
  - 前端
tags:
  - Flutter
  - Windows
  - 环境搭建
---

<ArticleViews slug="windows-flutter-setup" />

## 1. 软件必备组件下载

在安装 Flutter 之前，请确保你的设备上已安装以下核心工具：

### 1.1 安装 Git for Windows
Git 是版本控制的基础，也是 Flutter 获取 SDK 的必要工具。
- **下载地址**：[Git for Windows 官网](https://gitforwindows.org/)
- **安装建议**：下载最新版本并按照默认选项进行安装即可。

### 1.2 安装 Visual Studio Code
VS Code 是 Flutter 开发官方推荐的轻量级编辑器。
- **下载地址**：[VS Code 官网](https://code.visualstudio.com/)
- **说明**：Flutter 也支持 Android Studio，但 VS Code 启动更快，插件生态也非常丰富。

## 2. 在 VS Code 中配置 Flutter

安装好基础软件后，按照以下步骤在 VS Code 中集成 Flutter。

### 2.1 添加 Flutter 扩展
1. 打开 VS Code。
2. 点击左侧活动栏中的 **扩展 (Extensions)** 图标（或按 `Ctrl+Shift+X`）。
3. 搜索并安装 **"Flutter"** 扩展。这将自动安装依赖的 **"Dart"** 扩展。

### 2.2 使用 VS Code 安装 Flutter SDK
VS Code 提供了一站式的 SDK 定制化安装流程，非常方便：

1. 按 `Ctrl + Shift + P` 打开**命令面板**。
2. 输入 `flutter` 并选择 **Flutter: New Project (新建项目)**。
3. VS Code 会检测到未安装 SDK，点击弹出提示中的 **Download SDK (下载 SDK)**。
4. **选择存储位置**：在弹出的文件夹对话框中，选择一个你希望安装 Flutter SDK 的位置（建议不要安装在需要特殊权限的系统盘根目录下，如 `C:\Program Files`）。
5. 点击 **Clone Flutter** 开始克隆 SDK。

> [!NOTE]
> 下载过程可能需要几分钟。如果界面似乎卡住，请点击“取消”并检查网络链接后重试。

### 2.3 配置环境变量 (PATH)
SDK 下载完成后，VS Code 通常会提示：
- 点击通知中的 **"Add SDK to PATH"**。
- 如果成功，会显示 `The Flutter SDK was added to your PATH`。

**为了确保配置生效：**
- 关闭所有打开的终端窗口并重新打开。
- 重启 VS Code。

## 3. 验证与第一个应用

### 3.1 环境诊断
打开 VS Code 终端，输入以下命令检查环境是否完整：
```bash
flutter doctor
```
根据输出的提示，查漏补缺（例如是否需要安装 Android SDK 或 Chrome 浏览器）。

### 3.2 创建第一个应用
1. 再次打开命令面板 (`Ctrl + Shift + P`)。
2. 选择 **Flutter: New Project** -> **Application**。
3. 选择项目保存的文件夹并输入项目名称（如 `hello_flutter`）。
4. 项目创建后，按 `F5` 即可启动调试。

## 4. 核心特性体验：热重载 (Hot Reload)

Flutter 最受开发者欢迎的特性莫过于**有状态热重载 (Stateful Hot Reload)**。
- **尝试一下**：修改 `lib/main.dart` 中的文本或颜色。
- **即时生效**：保存文件后，你会在不到一秒钟的时间内看到应用界面的更改，而无需重启应用或丢失当前状态。

---

祝贺你！你已经成功在 Windows 上迈出了 Flutter 开发的第一步。现在，开始构建你的第一个跨平台应用吧！

<ArticleComments slug="windows-flutter-setup" />
