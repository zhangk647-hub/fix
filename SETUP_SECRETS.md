# 设置 GitHub Secrets 指南

## 方法一：使用 Python 脚本（推荐，自动化）

### 步骤 1：安装 Python 依赖

```powershell
pip install requests pynacl
```

### 步骤 2：创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 设置名称：例如 `Setup Secrets`
4. 勾选权限：**repo**（全部勾选）
5. 点击 **Generate token**
6. **重要**：复制生成的 Token（只显示一次！）

### 步骤 3：运行脚本

在 PowerShell 中运行：

```powershell
# 设置环境变量（替换 YOUR_TOKEN 为你的 Token）
$env:GITHUB_TOKEN='YOUR_TOKEN'

# 运行脚本
python setup_github_secrets.py
```

如果成功，你会看到：
```
✅ 成功设置 Secret: TCB_SECRET_ID
✅ 成功设置 Secret: TCB_SECRET_KEY
✅ 成功设置 Secret: TCB_ENV_ID
🎉 所有 Secrets 设置完成！
```

---

## 方法二：手动在 GitHub 网页设置（简单但需手动操作）

### 步骤 1：进入 Secrets 设置页面

1. 访问你的 GitHub 仓库：https://github.com/zhangk647-hub/fix
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Secrets and variables** → **Actions**
4. 点击 **New repository secret**

### 步骤 2：添加三个 Secrets

**Secret 1:**
- Name: `TCB_SECRET_ID`
- Secret: `AKID4KWhy63seKzjMmyykJgqoa9UdbMtCIAp`
- 点击 **Add secret**

**Secret 2:**
- Name: `TCB_SECRET_KEY`
- Secret: `Vnv3GY1LXc3QjBd0QnJjD1lKvaHrDHC3`
- 点击 **Add secret**

**Secret 3:**
- Name: `TCB_ENV_ID`
- Secret: `cloud1-0g7vmmxz0edb5524`
- 点击 **Add secret**

### 步骤 3：验证设置

在 Secrets 列表中，你应该看到 3 个 Secrets：
- ✅ TCB_SECRET_ID
- ✅ TCB_SECRET_KEY
- ✅ TCB_ENV_ID

---

## 设置完成后的操作

1. ✅ Secrets 设置完成后，GitHub Actions 就可以自动部署了
2. ✅ 推送任何代码到 `main` 分支都会触发自动部署
3. ✅ 在 GitHub 仓库的 **Actions** 标签中查看部署状态

---

## 故障排查

### 问题：Python 脚本运行失败

**检查：**
- 是否安装了 `requests` 和 `pynacl`：`pip install requests pynacl`
- GITHUB_TOKEN 是否正确设置
- Token 是否有 `repo` 权限

### 问题：手动设置时找不到 Settings

**检查：**
- 你是否有仓库的管理员权限
- 仓库是否是公开的（私有仓库需要管理员权限）

### 问题：部署失败

**检查：**
- Secrets 是否正确设置（名称大小写要完全匹配）
- 在 GitHub Actions 日志中查看具体错误信息



