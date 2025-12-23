# 快速设置 GitHub Secrets

## ⚡ 最快的方法：手动设置（推荐）

### 1. 打开 GitHub Secrets 页面

直接访问：https://github.com/zhangk647-hub/fix/settings/secrets/actions

或者：
1. 访问：https://github.com/zhangk647-hub/fix
2. 点击 **Settings**（设置）
3. 左侧菜单：**Secrets and variables** → **Actions**
4. 点击 **New repository secret**

### 2. 添加第一个 Secret

- **Name**: `TCB_SECRET_ID`
- **Secret**: `AKID4KWhy63seKzjMmyykJgqoa9UdbMtCIAp`
- 点击 **Add secret**

### 3. 添加第二个 Secret

点击 **New repository secret** 再次添加：

- **Name**: `TCB_SECRET_KEY`
- **Secret**: `Vnv3GY1LXc3QjBd0QnJjD1lKvaHrDHC3`
- 点击 **Add secret**

### 4. 添加第三个 Secret

点击 **New repository secret** 再次添加：

- **Name**: `TCB_ENV_ID`
- **Secret**: `cloud1-0g7vmmxz0edb5524`
- 点击 **Add secret**

### 5. 完成！

设置完成后，你应该在列表中看到 3 个 Secrets：
- ✅ TCB_SECRET_ID
- ✅ TCB_SECRET_KEY  
- ✅ TCB_ENV_ID

---

## 验证部署

Secrets 设置完成后：

1. 访问：https://github.com/zhangk647-hub/fix/actions
2. 点击最新的工作流运行（应该会自动触发，因为我们刚才推送了代码）
3. 查看部署状态

如果看到 ✅ 绿色勾号，说明部署成功！

---

## 获取访问地址

部署成功后：

1. 访问 CloudBase 控制台：https://console.cloud.tencent.com/tcb
2. 选择环境：`cloud1-0g7vmmxz0edb5524`
3. 进入 **静态网站托管** → **基础配置**
4. 查看访问地址（类似：`https://cloud1-0g7vmmxz0edb5524-xxxxx.tcb.qcloud.la`）
5. 在 **安全配置** → **Web 安全域名** 中添加这个地址

---

## 下一步

✅ Secrets 已设置
✅ 工作流文件已推送
✅ 代码已提交

现在每次你推送代码到 `main` 分支，GitHub Actions 会自动：
1. 构建项目
2. 部署到 CloudBase 静态托管

无需任何手动操作！

