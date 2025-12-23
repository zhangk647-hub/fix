import cloudbase from "@cloudbase/js-sdk";

// 腾讯云开发环境配置
const TENCENT_CLOUD_CONFIG = {
  env: 'cloud1-0g7vmmxz0edb5524', // 已更新为您的腾讯云环境ID
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
  private initPromise: Promise<void> | null = null;
  app: any = null;
  db: any = null;

  constructor(env: string) {
    this.env = env;
  }

  init(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      try {
        console.log("Tencent CloudBase initializing...");
        // 初始化云开发环境并获取应用实例
        this.app = cloudbase.init({
          env: this.env
        });

        // 匿名登录
        const auth = this.app.auth();
        const loginState = await auth.getLoginState();

        if (!loginState) {
          console.log("No login state, signing in anonymously...");
          await auth.signInAnonymously();
          console.log("Anonymous sign-in successful.");
        } else {
          console.log("Existing login state found.");
        }

        // 获取数据库实例
        this.db = this.app.database();
        console.log("Tencent CloudBase initialized successfully.");
      } catch (error) {
        console.error('腾讯云初始化失败:', error);
        // Reset promise on failure to allow retries
        this.initPromise = null; 
        throw new Error('Cloudbase initialization failed: ' + (error as Error).message);
      }
    })();

    return this.initPromise;
  }

  // 获取数据库实例
  async getDatabase() {
    await this.init();
    return this.db;
  }

  // 调用云函数
  async callFunction(name: string, data: any) {
    await this.init();
    if (!this.app) throw new Error("Cloudbase not initialized");
    return this.app.callFunction({
      name,
      data
    });
  }

  // 数据库操作
  async database() {
    await this.init();
    if (!this.db) throw new Error("Database not initialized");
    return this.db;
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