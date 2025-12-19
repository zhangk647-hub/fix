// 腾讯云开发环境配置
const TENCENT_CLOUD_CONFIG = {
  env: 'your-tencent-cloud-env-id', // 替换为您的腾讯云环境ID
  database: {
    pendingRequestsCollection: 'pendingRequests' // 待审批请求集合名
  }
};

// 接口定义
export interface TCPendingRequestPayload {
  faultCode: string;
  solutionText: string;
  timestamp: number;
}

export interface TCPendingRequest {
  _id: string;
  faultCode: string;
  solutionText: string;
  timestamp: number;
}

// 腾讯云基础类
class TencentCloudBase {
  private env: string;
  private initialized: boolean = false;

  constructor(env: string) {
    this.env = env;
  }

  private async init() {
    if (this.initialized) return;
    
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      throw new Error('TencentCloudBase must be used in browser environment');
    }

    // 动态加载腾讯云开发SDK
    if (!window.cloud) {
      const script = document.createElement('script');
      script.src = 'https://imgcache.qq.com/qcloud/cloudbase-js-sdk/1.7.1/cloudbase.full.js';
      document.head.appendChild(script);
      
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // 初始化云开发环境
    window.cloud.init({
      env: this.env
    });

    this.initialized = true;
  }

  private async getDatabase() {
    await this.init();
    return window.cloud.database();
  }

  // 调用云函数
  async callFunction(name: string, data: any) {
    await this.init();
    return window.cloud.callFunction({
      name,
      data
    });
  }

  // 数据库操作
  async database() {
    return this.getDatabase();
  }
}

// 创建实例
const tcBase = new TencentCloudBase(TENCENT_CLOUD_CONFIG.env);

// API 函数
export async function tcCreatePendingRequest(payload: TCPendingRequestPayload): Promise<TCPendingRequest> {
  try {
    const db = await tcBase.database();
    const result = await db.collection(TENCENT_CLOUD_CONFIG.database.pendingRequestsCollection).add({
      ...payload,
      createdAt: new Date()
    });

    return {
      _id: result._id,
      ...payload
    };
  } catch (error) {
    console.error('创建待审批请求失败:', error);
    throw error;
  }
}

export async function tcFetchPendingRequests(): Promise<TCPendingRequest[]> {
  try {
    const db = await tcBase.database();
    const result = await db.collection(TENCENT_CLOUD_CONFIG.database.pendingRequestsCollection).get();
    return result.data as TCPendingRequest[];
  } catch (error) {
    console.error('获取待审批请求失败:', error);
    throw error;
  }
}

export async function tcDeletePendingRequest(id: string): Promise<void> {
  try {
    const db = await tcBase.database();
    await db.collection(TENCENT_CLOUD_CONFIG.database.pendingRequestsCollection).doc(id).remove();
  } catch (error) {
    console.error('删除待审批请求失败:', error);
    throw error;
  }
}
