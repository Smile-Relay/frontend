# Smile Relay - Frontend

Smile Relay 是一个结合情绪识别与 AI 创作的互动应用。用户可以通过捕捉面部表情，生成对应情绪的 AI 艺术图片和感悟，并将其“扔”入虚拟大海，或打印成精美的实体漂流瓶。

## 🌟 主要功能

- **情绪识别**：实时捕捉并分析面部表情，识别多种核心情绪。
- **AI 艺术生成**：基于识别出的情绪，利用 AI 生成独特的视觉艺术作品。
- **情感漂流瓶**：用户可以撰写心情并生成专属 ID，将情绪“寄托”在漂流瓶中。
- **实体打印**：支持将生成的漂流瓶卡片通过实体打印机输出，保留珍贵的瞬间。
- **探索与互动**：搜索和查看其他人的漂流瓶，为他人的心情点赞、拥抱或送花。

## 🛠️ 技术栈

- **框架**: [Nuxt 3](https://nuxt.com/) (Vue 3)
- **样式**: Tailwind CSS
- **动画**: @oku-ui/motion
- **国际化**: Nuxt I18n (支持中英双语)
- **API 通讯**: 与 Python 后端进行交互

## 🚀 快速开始

### 环境准备

确保安装了依赖：

```bash
# 安装依赖
npm install
```

### 运行开发服务器

在 `http://localhost:3000` 启动开发服务器：

```bash
npm run dev
```

### 环境变量配置

在项目根目录创建 `.env` 文件，并配置以下密钥：

```env
SILICONFLOW_API_KEY=your_siliconflow_key
DASHSCOPE_API_KEY=your_dashscope_key
```

## 🏗️ 生产环境

编译生产版本：

```bash
npm run build
```

本地预览生产版本：

```bash
npm run preview
```

## 📄 开源说明

本项目前端代码现已开源。在开源过程中，我们已彻底清理了 Git 提交历史中的敏感密钥信息，确保代码库的安全。
