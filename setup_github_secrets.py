#!/usr/bin/env python3
"""
设置 GitHub Secrets 的脚本
需要先安装：pip install requests pynacl
"""

import os
import sys
import base64
import requests
from nacl import encoding, public

# 配置信息
REPO_OWNER = "zhangk647-hub"
REPO_NAME = "fix"
SECRETS = {
    "TCB_SECRET_ID": "AKID4KWhy63seKzjMmyykJgqoa9UdbMtCIAp",
    "TCB_SECRET_KEY": "Vnv3GY1LXc3QjBd0QnJjD1lKvaHrDHC3",
    "TCB_ENV_ID": "cloud1-0g7vmmxz0edb5524"
}

def encrypt_secret(public_key: str, secret_value: str) -> str:
    """使用公钥加密 Secret 值"""
    public_key_bytes = base64.b64decode(public_key)
    sealed_box = public.SealedBox(public.PublicKey(public_key_bytes))
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")


def get_public_key(token: str) -> tuple:
    """获取仓库的公钥和密钥 ID"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/actions/secrets/public-key"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"❌ 获取公钥失败: {response.status_code}")
        print(response.text)
        sys.exit(1)
    data = response.json()
    return data["key"], data["key_id"]


def set_secret(token: str, secret_name: str, secret_value: str, public_key: str, key_id: str):
    """设置 GitHub Secret"""
    encrypted_value = encrypt_secret(public_key, secret_value)
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/actions/secrets/{secret_name}"
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "Authorization": f"token {token}"
    }
    data = {
        "encrypted_value": encrypted_value,
        "key_id": key_id
    }
    response = requests.put(url, headers=headers, json=data)
    if response.status_code in [201, 204]:
        print(f"✅ 成功设置 Secret: {secret_name}")
    else:
        print(f"❌ 设置 Secret {secret_name} 失败: {response.status_code}")
        print(response.text)


def main():
    # 检查 GitHub Token
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("❌ 错误: 需要设置 GITHUB_TOKEN 环境变量")
        print("\n请按以下步骤操作:")
        print("1. 访问 https://github.com/settings/tokens")
        print("2. 点击 'Generate new token' → 'Generate new token (classic)'")
        print("3. 设置名称，勾选 'repo' 权限")
        print("4. 生成 Token 后，在 PowerShell 中运行:")
        print("   $env:GITHUB_TOKEN='你的token'")
        print("   python setup_github_secrets.py")
        sys.exit(1)

    print(f"📦 正在为仓库 {REPO_OWNER}/{REPO_NAME} 设置 Secrets...")
    print()

    # 获取公钥
    print("🔑 获取仓库公钥...")
    public_key, key_id = get_public_key(token)
    print("✅ 公钥获取成功")
    print()

    # 设置每个 Secret
    for secret_name, secret_value in SECRETS.items():
        print(f"🔐 设置 {secret_name}...")
        set_secret(token, secret_name, secret_value, public_key, key_id)

    print()
    print("🎉 所有 Secrets 设置完成！")
    print("现在可以推送代码到 main 分支，GitHub Actions 会自动部署到 CloudBase。")


if __name__ == "__main__":
    main()



