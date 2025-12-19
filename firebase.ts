// Firebase 初始化配置文件
// 1. 先在 https://console.firebase.google.com 创建项目，开启 Firestore 数据库
// 2. 在 Firebase 控制台创建 Web 应用，复制得到的配置填到下面的 firebaseConfig 中
// 3. 填好后重新构建 / 部署，本系统的“建议上报 + 管理员审核”就会走云端

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyA-sEvVw2SXevbxHURe5F8Xw4E-kTiAmWM',
  authDomain: 'fix-up-fef91.firebaseapp.com',
  projectId: 'fix-up-fef91',
  storageBucket: 'fix-up-fef91.appspot.com',
  messagingSenderId: '765894326552',
  appId: '1:765894326552:web:7c7edb00887473775466d', // Web 应用 appId
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);


