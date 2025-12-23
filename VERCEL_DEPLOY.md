# Vercel 部署指南

## 步骤 1：注册并登录 Vercel

1. 访问 https://vercel.com
2. 点击右上角 **Sign Up**（注册）
3. 选择 **Continue with GitHub**（使用 GitHub 账号登录）

## 步骤 2：导入项目

1. 登录后，点击 **Add New...** → **Project**（或直接点击 **Add New Project**）
2. 在 "Import Git Repository" 页面，找到你的仓库 `zhangk647-hub/fix`
3. 如果没有显示，点击 **Adjust GitHub App Permissions** 授权访问你的仓库
4. 点击仓库名称旁边的 **Import** 按钮

## 步骤 3：配置项目

在配置页面：

### Framework Preset（框架预设）
- 选择 **Vite**（会自动识别）

### Root Directory（根目录）
- 保持默认（**不填**，或填 `./`）

### Build Command（构建命令）
- 保持默认：`npm run build`（Vercel 会自动识别 Vite 项目）

### Output Directory（输出目录）
- 保持默认：`dist`（Vercel 会自动识别 Vite 项目）

### Install Command（安装命令）
- 保持默认：`npm install`

### Environment Variables（环境变量）
- **不需要添加任何环境变量**（你的代码不依赖环境变量）

## 步骤 4：部署

1. 点击页面底部的 **Deploy** 按钮
2. 等待构建完成（通常 1-2 分钟）
3. 部署成功后，会显示一个类似 `https://fix-xxx.vercel.app` 的地址

## 步骤 5：测试访问

1. 在浏览器打开 Vercel 给你的地址
2. 确认页面能正常显示
3. 测试提交功能，确认能连接到腾讯云数据库

## 步骤 6：更新腾讯云数据库权限（如果需要）

如果你在腾讯云开发控制台设置了安全域名限制，需要在 **安全配置** 中添加你的 Vercel 域名：
```
https://你的项目名.vercel.app
```

## 自动部署

之后每次你 `git push` 代码到 GitHub 的 `main` 分支，Vercel 会自动：
1. 检测到代码更新
2. 重新构建项目
3. 自动部署新版本

---

## 如果遇到问题

### 构建失败
- 检查 Console 输出的错误信息
- 确认 `package.json` 中的依赖都已正确安装

### 访问被拒绝（403）
- 检查 Vercel 项目的部署状态是否为 "Ready"
- 确认构建日志中没有错误

### 数据库连接失败
- 检查浏览器 Console 是否有错误
- 确认腾讯云环境 ID 是否正确
- 确认数据库集合 `pendingRequests` 已创建

