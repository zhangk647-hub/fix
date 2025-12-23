# 使用 CloudBase 静态托管部署（推荐方案）

参考文档：https://docs.cloudbase.net/hosting/cli-devops

## 为什么选择 CloudBase 静态托管？

- ✅ 自动构建和部署（通过 GitHub Actions）
- ✅ 无需手动配置 Content-Type
- ✅ 自动处理所有静态文件
- ✅ 免费额度充足
- ✅ 中国境内访问速度快
- ✅ 与你的 CloudBase 环境集成（数据库、云函数等）

## 前置准备

### 1. 获取 API 密钥

1. 登录腾讯云控制台：https://console.cloud.tencent.com/
2. 进入 **访问管理** → **API密钥管理**
3. 创建或获取现有的 `SecretId` 和 `SecretKey`
4. **重要**：妥善保管，不要泄露

### 2. 确认环境 ID

你的 CloudBase 环境 ID 是：`cloud1-0g7vmmxz0edb5524`

（可以在 CloudBase 控制台查看：https://console.cloud.tencent.com/tcb）

### 3. 准备 GitHub 仓库

确保你的代码已经推送到 GitHub 仓库（如 `zhangk647-hub/fix`）

## 部署步骤

### 步骤 1：配置 GitHub Secrets

1. 进入你的 GitHub 仓库
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**，添加以下三个 Secrets：

   **Secret 1:**
   - Name: `TCB_SECRET_ID`
   - Value: 你的腾讯云 SecretId

   **Secret 2:**
   - Name: `TCB_SECRET_KEY`
   - Value: 你的腾讯云 SecretKey

   **Secret 3:**
   - Name: `TCB_ENV_ID`
   - Value: `cloud1-0g7vmmxz0edb5524`

> 💡 **提示**：添加 Secrets 后，GitHub Actions 就可以使用这些密钥来部署你的应用，但不会暴露在代码中。

### 步骤 2：创建工作流文件（已自动创建）

我已经为你创建了 `.github/workflows/deploy.yml` 文件，它会：

1. 监听 `main` 分支的推送
2. 自动安装 Node.js 和依赖
3. 运行 `npm run build` 构建项目
4. 使用 CloudBase CLI 部署到静态托管

### 步骤 3：推送代码触发部署

1. 如果工作流文件是新创建的，需要先提交并推送：
   ```bash
   git add .github/workflows/deploy.yml
   git commit -m "Add CloudBase deployment workflow"
   git push origin main
   ```

2. 或者直接推送现有代码到 `main` 分支，也会触发部署

### 步骤 4：查看部署状态

1. 进入 GitHub 仓库页面
2. 点击 **Actions** 标签
3. 查看最新的工作流运行状态
4. 如果显示绿色的 ✓，说明部署成功

### 步骤 5：获取访问地址

部署成功后，访问地址格式为：
```
https://你的环境ID-xxxxx.tcb.qcloud.la
```

或者：
```
https://你的环境ID-xxxxx.app.tcloudbase.com
```

具体地址可以在：
1. CloudBase 控制台 → 静态网站托管 → 基础配置中查看
2. 或者查看 GitHub Actions 的部署日志

### 步骤 6：更新 CloudBase 安全域名

1. 进入 CloudBase 控制台：https://console.cloud.tencent.com/tcb
2. 选择你的环境（环境 ID: `cloud1-0g7vmmxz0edb5524`）
3. 进入 **安全配置** → **Web 安全域名**
4. 添加你的静态托管域名：
   ```
   https://你的环境ID-xxxxx.tcb.qcloud.la
   https://你的环境ID-xxxxx.app.tcloudbase.com
   ```
   （注意：只填写域名，不要加路径，不要加 `/`）

## 后续更新

每次你推送代码到 GitHub 的 `main` 分支，GitHub Actions 会自动：

1. ✅ 检测到代码更新
2. ✅ 自动构建项目
3. ✅ 自动部署到 CloudBase 静态托管

**无需手动操作！**

## 工作流配置说明

工作流文件 `.github/workflows/deploy.yml` 的主要步骤：

1. **检出代码**：从 GitHub 仓库获取最新代码
2. **设置 Node.js**：安装 Node.js 18（支持缓存加速）
3. **安装依赖**：运行 `npm ci`（适合 CI 环境）
4. **构建项目**：运行 `npm run build`，生成 `dist` 目录
5. **安装 CloudBase CLI**：全局安装 `@cloudbase/cli`
6. **登录 CloudBase**：使用 Secrets 中的密钥登录
7. **部署到静态托管**：将 `dist` 目录部署到 `/home` 路径

## 注意事项

1. **免费额度**：CloudBase 静态托管有免费额度，个人项目通常够用
2. **访问速度**：在中国境内访问速度快
3. **HTTPS**：自动支持 HTTPS
4. **域名**：可以使用自定义域名（需要备案）
5. **构建时间**：首次构建可能需要 3-5 分钟，后续会更快（因为有缓存）

## 故障排查

### 问题 1：GitHub Actions 部署失败

**检查：**
- Secrets 是否正确配置（TCB_SECRET_ID、TCB_SECRET_KEY、TCB_ENV_ID）
- 环境 ID 是否正确
- 查看 Actions 日志中的具体错误信息

### 问题 2：构建失败

**检查：**
- `package.json` 中的依赖是否正确
- Node.js 版本是否兼容（工作流中使用的是 Node 18）

### 问题 3：部署后无法访问

**检查：**
- CloudBase 控制台中静态网站托管是否已开启
- 安全域名是否已正确配置
- 访问地址是否正确

### 问题 4：数据库连接失败

**检查：**
- 静态托管域名是否已添加到 CloudBase 的 Web 安全域名中
- 环境 ID 是否正确（`cloud1-0g7vmmxz0edb5524`）

---

## 参考文档

- CloudBase 静态托管文档：https://docs.cloudbase.net/hosting/
- GitHub Actions 文档：https://docs.github.com/en/actions
- CloudBase CLI 文档：https://docs.cloudbase.net/cli-v1/

