// 腾讯云开发环境配置
const TENCENT_CLOUD_CONFIG = {
  env: 'your-tencent-cloud-env-id', // 替换为您的腾讯云环境ID
  database: {
    pendingRequestsCollection: 'pendingRequests' // 待审批请求集合名
  },
  // 静态网站环境下的本地存储回退配置
  localFallback: true
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
  private useLocalFallback: boolean = false;

  constructor(env: string, localFallback: boolean = true) {
    this.env = env;
    this.useLocalFallback = localFallback;
  }

  private async init() {
    if (this.initialized) return;
    
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') {
      throw new Error('TencentCloudBase must be used in browser environment');
    }

    try {
      // 动态加载腾讯云开发SDK
      if (!window.cloud) {
        const script = document.createElement('script');
        script.src = 'https://imgcache.qq.com/qcloud/cloudbase-js-sdk/1.7.1/cloudbase.full.js';
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = () => {
            console.warn('腾讯云SDK加载失败，将使用本地存储回退');
            this.useLocalFallback = true;
            reject(new Error('Cloudbase SDK load failed'));
          };
        });
      }

      // 初始化云开发环境
      window.cloud.init({
        env: this.env
      });

      this.initialized = true;
    } catch (error) {
      console.warn('腾讯云初始化失败，将使用本地存储回退:', error);
      this.useLocalFallback = true;
      this.initialized = true; // 标记为已初始化（使用回退）
    }
  }

  private async getDatabase() {
    await this.init();
    
    if (this.useLocalFallback) {
      // 返回本地存储包装器
      return {
        collection: (name: string) => ({
          add: async (data: any) => {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const records = JSON.parse(localStorage.getItem(`tc_${name}`) || '[]');
            const newRecord = { ...data, _id: id };
            records.push(newRecord);
            localStorage.setItem(`tc_${name}`, JSON.stringify(records));
            return { _id: id };
          },
          get: async () => {
            const records = JSON.parse(localStorage.getItem(`tc_${name}`) || '[]');
            return { data: records };
          },
          doc: (id: string) => ({
            remove: async () => {
              const records = JSON.parse(localStorage.getItem(`tc_${name}`) || '[]');
              const filtered = records.filter((record: any) => record._id !== id);
              localStorage.setItem(`tc_${name}`, JSON.stringify(filtered));
              return { deleted: true };
            }
          })
        })
      };
    }

    return window.cloud.database();
  }

  // 调用云函数
  async callFunction(name: string, data: any) {
    await this.init();
    
    if (this.useLocalFallback) {
      console.warn(`云函数 ${name} 调用已回退到本地处理`);
      return { result: {} };
    }

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
const tcBase = new TencentCloudBase(TENCENT_CLOUD_CONFIG.env, TENCENT_CLOUD_CONFIG.localFallback);

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
    // 如果是静态网站环境，尝试使用本地存储
    if (TENCENT_CLOUD_CONFIG.localFallback) {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const records = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      const newRecord = { _id: id, ...payload };
      records.push(newRecord);
      localStorage.setItem('pendingRequests', JSON.stringify(records));
      return newRecord;
    }
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
    // 如果是静态网站环境，尝试使用本地存储
    if (TENCENT_CLOUD_CONFIG.localFallback) {
      return JSON.parse(localStorage.getItem('pendingRequests') || '[]');
    }
    return [];
  }
}

export async function tcDeletePendingRequest(id: string): Promise<void> {
  try {
    const db = await tcBase.database();
    await db.collection(TENCENT_CLOUD_CONFIG.database.pendingRequestsCollection).doc(id).remove();
  } catch (error) {
    console.error('删除待审批请求失败:', error);
    // 如果是静态网站环境，尝试使用本地存储
    if (TENCENT_CLOUD_CONFIG.localFallback) {
      const records = JSON.parse(localStorage.getItem('pendingRequests') || '[]');
      const filtered = records.filter((record: any) => record._id !== id);
      localStorage.setItem('pendingRequests', JSON.stringify(filtered));
    }
  }
}