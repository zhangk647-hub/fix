# 腾讯云静态网站托管部署指南

## 方案一：腾讯云 COS + 静态网站托管（推荐）

### 步骤 1：创建 COS 存储桶

1. 登录腾讯云控制台：https://console.cloud.tencent.com/
2. 进入 **对象存储 COS**
3. 点击 **创建存储桶**
4. 配置：
   - **名称**：例如 `fix-up-static`（需全局唯一）
   - **所属地域**：选择离你最近的（如：北京、上海、广州）
   - **访问权限**：选择 **公有读私有写**（重要！）
   - **存储类型**：标准存储
5. 点击 **创建**

### 步骤 2：开启静态网站托管

1. 进入刚创建的存储桶
2. 左侧菜单找到 **基础配置** → **静态网站**
3. 点击 **编辑**，开启静态网站托管
4. 配置：
   - **索引文档**：`index.html`
   - **错误文档**：`index.html`（SPA 路由需要）
   - **错误码**：`404`
5. 保存后，会得到一个 **访问节点**，例如：
   ```
   https://fix-up-static-xxxxx.cos.ap-beijing.myqcloud.com
   ```

### 步骤 3：上传 dist 目录文件

#### 方法 A：使用控制台上传（简单）

1. 在存储桶页面，点击 **文件列表**
2. 点击 **上传文件**
3. 选择本地项目的 `dist` 目录下的**所有文件**（包括子目录）
   - `index.html`
   - `manifest.webmanifest`
   - `sw.js`
   - `workbox-*.js`
   - `assets/` 目录下的所有文件
4. 上传完成后，访问你的静态网站地址即可

#### 方法 B：使用 COS CLI 工具（自动化）

1. 安装 COS CLI：
   ```bash
   pip install coscmd
   ```
2. 配置：
   ```bash
   coscmd config -a <SecretId> -s <SecretKey> -b <BucketName> -r <Region>
   ```
   （SecretId 和 SecretKey 在：控制台 → 访问管理 → API密钥管理）
3. 上传：
   ```bash
   cd dist
   coscmd upload -r . /
   ```

### 步骤 4：配置自定义域名（可选，但推荐）

1. 在存储桶 → **域名管理** → **自定义源站域名**
2. 添加你的域名（如果有）
3. 配置 CDN 加速（可选，但能提升访问速度）

### 步骤 5：更新 LeanCloud 安全域名

在 LeanCloud 控制台 → 安全中心 → Web 安全域名，添加：
```
https://你的COS访问节点域名
https://你的自定义域名（如果有）
```

---

## 方案二：腾讯云 Webify（自动部署）

### 步骤 1：创建 Webify 应用

1. 登录腾讯云控制台
2. 搜索 **Webify** 或访问：https://console.cloud.tencent.com/webify
3. 点击 **新建应用**
4. 选择 **从代码仓库导入**
5. 授权 GitHub，选择你的仓库 `zhangk647-hub/fix`

### 步骤 2：配置构建

- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **Node 版本**：选择 18 或更高

### 步骤 3：部署

点击 **部署**，等待完成。会得到一个 `xxx.app.tcloudbase.com` 的地址。

---

## 注意事项

1. **LeanCloud 安全域名**：部署完成后，务必在 LeanCloud 控制台添加新的访问地址
2. **HTTPS**：腾讯云 COS 静态网站默认支持 HTTPS
3. **更新代码**：每次修改代码后，需要重新 `npm run build`，然后上传新的 `dist` 文件

---

## 推荐方案

- **如果只是临时测试**：用方案一（COS），手动上传一次即可
- **如果需要自动部署**：用方案二（Webify），连接 GitHub 后每次 push 自动部署





