
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ChevronRight, 
  Plus, 
  ShieldCheck, 
  Wrench, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  Trash2, 
  Check, 
  X,
  PlusCircle,
  LogOut,
  AlertTriangle,
  Settings,
  ClipboardList,
  FileText,
  Save
} from 'lucide-react';

// 导入腾讯云服务
import { 
  tcCreatePendingRequest, 
  tcFetchPendingRequests, 
  tcDeletePendingRequest,
  tcFetchFaults,
  tcSaveFaults
} from './tencentcloud';

// --- 类型定义 ---

interface Solution {
  id: string;
  text: string;
  isApproved: boolean;
  author: 'system' | 'technician';
}

interface FaultCode {
  code: string;
  description: string;
  solutions: Solution[];
}

interface PendingRequest {
  id: string;
  faultCode: string;
  solutionText: string;
  timestamp: number;
}

// --- 初始数据 ---

const INITIAL_FAULTS: FaultCode[] = [
  {
    code: '01',
    description: '室内机保护装置动作（浮子开关）',
    solutions: [
      { id: 's1', text: '检查接水盘是否水位过高', isApproved: true, author: 'system' },
      { id: 's2', text: '检查排水管、浮子开关或排水泵是否异常', isApproved: true, author: 'system' },
      { id: 's3', text: '检查软件工装中的浮子开关是否未短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '02',
    description: '外机保护装置动作（高压压力开关）',
    solutions: [
      { id: 's4', text: '检查配管是否堵塞', isApproved: true, author: 'system' },
      { id: 's5', text: '检查制冷剂是否充注过量', isApproved: true, author: 'system' },
      { id: 's6', text: '检查是否有不凝性气体混入', isApproved: true, author: 'system' },
      { id: 's7', text: '检查基板是否故障', isApproved: true, author: 'system' },
      { id: 's8', text: '检查软件工装基板上高压开关是否未短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '03',
    description: '室内机与室外机间通讯异常',
    solutions: [
      { id: 's9', text: '检查室外机和室内机间通信线是否连接错误、断线或混接', isApproved: true, author: 'system' },
      { id: 's10', text: '检查室外机电源是否关闭', isApproved: true, author: 'system' },
      { id: 's11', text: '检查室外机通讯保险丝是否熔断', isApproved: true, author: 'system' },
      { id: 's12', text: '检查室内外机系统号是否不匹配', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '04',
    description: '变频控制基板与室外机基板间通讯异常',
    solutions: [
      { id: 's13', text: '检查连接线是否松动', isApproved: true, author: 'system' },
      { id: 's14', text: '检查接线是否错误', isApproved: true, author: 'system' },
      { id: 's15', text: '检查保险丝是否熔断', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '05',
    description: '室外风扇控制基板与室外机基板间通讯异常',
    solutions: [
      { id: 's16', text: '检查连接线是否松动', isApproved: true, author: 'system' },
      { id: 's17', text: '检查接线是否错误', isApproved: true, author: 'system' },
      { id: 's18', text: '检查保险丝是否熔断', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '06',
    description: '电源相序异常',
    solutions: [
      { id: 's19', text: '检查电源是否正确', isApproved: true, author: 'system' },
      { id: 's20', text: '检查电源接线是否缺相', isApproved: true, author: 'system' },
      { id: 's21', text: '检查电源相位是否接错', isApproved: true, author: 'system' },
      { id: 's22', text: '检查软件工装是否没有屏蔽三相电', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '07',
    description: '变频器电压异常',
    solutions: [
      { id: 's23', text: '检查室外机电源电压是否过低', isApproved: true, author: 'system' },
      { id: 's24', text: '检查电源容量是否不够', isApproved: true, author: 'system' },
      { id: 's25', text: '检查压缩机变频模块控制板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '08',
    description: '室外机风扇控制基板电压异常',
    solutions: [
      { id: 's26', text: '检查风扇控制模块电压是否异常', isApproved: true, author: 'system' },
      { id: 's27', text: '检查风扇模块是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '09',
    description: '排气过热度Tdsh过低',
    solutions: [
      { id: 's28', text: '检查制冷剂是否充注过多', isApproved: true, author: 'system' },
      { id: 's29', text: '检查温度传感器是否故障', isApproved: true, author: 'system' },
      { id: 's30', text: '检查电子膨胀阀是否故障', isApproved: true, author: 'system' },
      { id: 's31', text: '检查配管连接是否错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0A',
    description: '压缩机顶部温度Td过高异常',
    solutions: [
      { id: 's32', text: '检查压缩机是否不良', isApproved: true, author: 'system' },
      { id: 's33', text: '检查冷媒是否不足', isApproved: true, author: 'system' },
      { id: 's34', text: '检查配管连接是否错误', isApproved: true, author: 'system' },
      { id: 's35', text: '检查管路是否堵塞', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0C',
    description: '室外机风扇内置温感检测温度过高；或水源机水温异常',
    solutions: [
      { id: 's36', text: '检查室外风扇电机是否过热', isApproved: true, author: 'system' },
      { id: 's37', text: '检查软件工装49FE是否没有短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0D',
    description: '室外机与室外机间通讯异常',
    solutions: [
      { id: 's38', text: '检查室外机间通讯线是否连接错误或断线', isApproved: true, author: 'system' },
      { id: 's39', text: '检查端子是否松动', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0E',
    description: '室外机子模块设定错误',
    solutions: [
      { id: 's40', text: '检查同一室外机系统中子模块设定是否正确', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0F',
    description: '室外机主模块设定错误',
    solutions: [
      { id: 's41', text: '检查同一室外机系统中是否设定了两个主模块', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '10',
    description: '水热源水温异常',
    solutions: [
      { id: 's42', text: '检查水热源的温度是否过低', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '11',
    description: '湿度传感器异常',
    solutions: [
      { id: 's43', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's44', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '12',
    description: '室内机回风温度传感器Ti异常或水模块进水温度传感器Twi异常',
    solutions: [
      { id: 's45', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's46', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '13',
    description: '室内机出风温度传感器To异常或水模块出水温度传感器Two异常',
    solutions: [
      { id: 's47', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's48', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '14',
    description: '室内机液管温度传感器TI异常',
    solutions: [
      { id: 's49', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's50', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '15',
    description: '室内机气管温度传感器Tg异常',
    solutions: [
      { id: 's51', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's52', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '16',
    description: '全热交换器环境温度传感器异常或水模块出水口Two2温度传感器异常',
    solutions: [
      { id: 's53', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's54', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '17',
    description: '新风机远程传感器异常或远程温度传感器异常或水模块水箱水温传感器TDHW异常',
    solutions: [
      { id: 's55', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's56', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '18',
    description: '线控器内置传感器异常或水模块板换出口水温传感器TWOHP异常',
    solutions: [
      { id: 's57', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's58', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '19',
    description: '室内风扇电机温度传感器异常、室内风驱报警风机不动作、失步检出。或水模块出水口3温度传感器异常或水压压力传感器异常',
    solutions: [
      { id: 's59', text: '检查室内风扇电机是否异常过热、堵转或传感器异常', isApproved: true, author: 'system' },
      { id: 's60', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's61', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1A',
    description: '室内机风扇电机保护装置动作',
    solutions: [
      { id: 's62', text: '检查风扇电机是否堵转、过热', isApproved: true, author: 'system' },
      { id: 's63', text: '检查电机保护回路是否断开', isApproved: true, author: 'system' },
      { id: 's64', text: '检查软件工装49FE是否未短接或未接电机', isApproved: true, author: 'system' },
      { id: 's65', text: '检查机种或容量设定是否错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1B',
    description: '室内风驱报警',
    solutions: [
      { id: 's66', text: '检查是否存在电流保护、欠电压保护或短路保护', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1C',
    description: '室内风驱报警',
    solutions: [
      { id: 's67', text: '检查电机运转中，电机电流是否连续30秒超过电流保护设定值（瞬时过电流）', isApproved: true, author: 'system' },
      { id: 's68', text: '检查是否缺相', isApproved: true, author: 'system' },
      { id: 's69', text: '检查是否未接电机', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1D',
    description: '室内风驱报警、欠电压',
    solutions: [
      { id: 's70', text: '没有特别备注', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '21',
    description: '压机顶部温度传感器Td异常或多管机室热交换器盘管中间温度传感器异常',
    solutions: [
      { id: 's71', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's72', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '39',
    description: '压缩比过低保护动作',
    solutions: [
      { id: 's73', text: '检查压缩机是否不良或故障', isApproved: true, author: 'system' },
      { id: 's74', text: '检查变频器是否故障', isApproved: true, author: 'system' },
      { id: 's75', text: '检查电源是否异常', isApproved: true, author: 'system' },
      { id: 's76', text: '根据排气压力(Pd)和吸气压力(Ps)计算压缩比 {(Pd+0.1)/(Ps+0.1)}，判断是否过低', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '43',
    description: '低压压力过高保护动作',
    solutions: [
      { id: 's77', text: '检查冷媒是否过多', isApproved: true, author: 'system' },
      { id: 's78', text: '检查四通阀是否误动作', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '44',
    description: '高压压力过高保护动作',
    solutions: [
      { id: 's79', text: '检查是否过负荷运行', isApproved: true, author: 'system' },
      { id: 's80', text: '检查热交换器是否阻塞或回风短路', isApproved: true, author: 'system' },
      { id: 's81', text: '检查冷媒配管是否堵塞', isApproved: true, author: 'system' },
      { id: 's82', text: '检查冷媒是否过多', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '45',
    description: '高压压力过低保护动作',
    solutions: [
      { id: 's83', text: '检查冷媒是否不足', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '46',
    description: '低压压力过低保护动作',
    solutions: [
      { id: 's84', text: '检查制冷剂是否不足或泄漏', isApproved: true, author: 'system' },
      { id: 's85', text: '检查冷媒配管是否阻塞', isApproved: true, author: 'system' },
      { id: 's86', text: '检查膨胀阀是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '47',
    description: '压机变频器过电流保护动作',
    solutions: [
      { id: 's87', text: '检查是否过负荷运行', isApproved: true, author: 'system' },
      { id: 's88', text: '检查压缩机是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '48',
    description: '传感器配线误接线、断线、短路，基板故障。',
    solutions: [
      { id: 's89', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's90', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '49',
    description: '压缩机变频器检测到过电流保护动作',
    solutions: [
      { id: 's91', text: '检查变频器是否控制错误（过电流，过电压，短路保护）', isApproved: true, author: 'system' },
      { id: 's92', text: '检查是否出现瞬间过电流', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '51',
    description: '压缩机变频器检测到异常',
    solutions: [
      { id: 's93', text: '检查变频器控制是否错误（过电流，过电压，短路保护）', isApproved: true, author: 'system' },
      { id: 's94', text: '检查是否出现瞬间过电流', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '52',
    description: '压缩机变频器温感过热',
    solutions: [
      { id: 's95', text: '检查温度传感器是否异常', isApproved: true, author: 'system' },
      { id: 's96', text: '检查换热器是否堵塞', isApproved: true, author: 'system' },
      { id: 's97', text: '检查风扇电机是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '53',
    description: '压缩机变频器不动作',
    solutions: [
      { id: 's98', text: '检查变频器基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '54',
    description: '风扇位置检测异常',
    solutions: [
      { id: 's99', text: '检查位置检出状况是否异常', isApproved: true, author: 'system' },
      { id: 's100', text: '检查位置检出回路是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '55',
    description: '风记控制基板保护动作或多管机室外机风记电机异常或水源机水流开关异常',
    solutions: [
      { id: 's101', text: '检查风扇控制基板控制是否错误（过电流，过电压，短路保护）或存在瞬间过电流', isApproved: true, author: 'system' },
      { id: 's102', text: '检查控制基板一变频基板一风扇电机连接配线是否断线或误接线', isApproved: true, author: 'system' },
      { id: 's103', text: '检查水源机水流量是否太小', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '56',
    description: '风扇控制异常',
    solutions: [
      { id: 's104', text: '检查是否起动失败', isApproved: true, author: 'system' },
      { id: 's105', text: '检查速度是否异常', isApproved: true, author: 'system' },
      { id: 's106', text: '检查芯片是否重置', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '57',
    description: '室外机风扇变频器电流保护动作（AC斩波器回路异常）',
    solutions: [
      { id: 's107', text: '检查AC斩波器基板是否故障', isApproved: true, author: 'system' },
      { id: 's108', text: '检查电流传感器(CT)是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '58',
    description: '风扇控制基板温度上升保护',
    solutions: [
      { id: 's109', text: '检查温度传感器是否异常', isApproved: true, author: 'system' },
      { id: 's110', text: '检查换热器是否堵塞', isApproved: true, author: 'system' },
      { id: 's111', text: '检查风扇电机是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '59',
    description: '风扇控制基板过电流保护',
    solutions: [
      { id: 's112', text: '检查风扇电机是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '5A',
    description: '风扇控制基板电流传感器异常',
    solutions: [
      { id: 's113', text: '检查风驱基板是否异常', isApproved: true, author: 'system' },
      { id: 's114', text: '检查电流传感器是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '62',
    description: '集控器与室外机间通信异常（该系统有1台以上室内机运行时）',
    solutions: [
      { id: 's115', text: '检查室外机运行中是否与集控器断开连接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '63',
    description: '集控器与室外机间通信和异常（该系统所有室内机停机时）',
    solutions: [
      { id: 's116', text: '检查室外机停止时是否与集控器断开连接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '64',
    description: 'H-LINKII对应/未对应设定错误',
    solutions: [
      { id: 's117', text: '请确认中央控制器以及并用的中央控制器的DSW2-4 H-LINKII 对应/未对应设置', isApproved: true, author: 'system' },
      { id: 's118', text: '与其他集控器并用时也可能报63警报', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '71',
    description: '水异常报警（低水量低水压）',
    solutions: [
      { id: 's119', text: '检查水流量是否不够或者水压不够', isApproved: true, author: 'system' },
      { id: 's120', text: '检查水于开关（对应工装FS）是否断开', isApproved: true, author: 'system' },
      { id: 's121', text: '软件工装针对AC水泵机型，保持FS闭合即可', isApproved: true, author: 'system' },
      { id: 's122', text: '针对DC水泵机型，可通过水模块机能选择项目进行屏蔽', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '72',
    description: '水箱电加热器异常',
    solutions: [
      { id: 's123', text: '检查水箱电加热配线是否错误', isApproved: true, author: 'system' },
      { id: 's124', text: '软件工装检查DHW Heat (PCN4-3) 端子是否短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '73',
    description: '水模块电加热器异常',
    solutions: [
      { id: 's125', text: '检查电加热配线是否错误', isApproved: true, author: 'system' },
      { id: 's126', text: '软件工装检查Heat (PCN5-3) 端子是否短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '74',
    description: '水流开关异常',
    solutions: [
      { id: 's127', text: '检查停机状态下水流开关是否闭合', isApproved: true, author: 'system' },
      { id: 's128', text: '检查水流开关配线是否接错或损坏', isApproved: true, author: 'system' },
      { id: 's129', text: '可通过机能选择73开关屏蔽该报警', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '75',
    description: 'c2_water过热保护',
    solutions: [
      { id: 's130', text: '检查压缩机是否运行中或锅炉是否给出ON信号', isApproved: true, author: 'system' },
      { id: 's131', text: '检查WP2是否ON且水模块是否为制热模式', isApproved: true, author: 'system' },
      { id: 's132', text: '检查线控器c2_water是否ON且overT_offset是否为非OFF', isApproved: true, author: 'system' },
      { id: 's133', text: '检查Two2温度是否超过c2_water_h_max + overT_offset达10分钟', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '76',
    description: '水泵异常保护',
    solutions: [
      { id: 's134', text: '检查水泵是否堵转', isApproved: true, author: 'system' },
      { id: 's135', text: '检查水泵与基板连接线是否脱落', isApproved: true, author: 'system' },
      { id: 's136', text: '检查Twi、Two传感器是否正常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '77',
    description: '冻结防止/低压压力低下异常',
    solutions: [
      { id: 's137', text: '检查水模块出水是否冻结', isApproved: true, author: 'system' },
      { id: 's138', text: '检查制冷低压压力是否低下', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '78',
    description: '水泵水流量异常',
    solutions: [
      { id: 's139', text: '检查水泵反馈水流量是否偏低', isApproved: true, author: 'system' },
      { id: 's140', text: 'DSW5-1设置为ON可屏蔽此报警', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '79',
    description: '通讯异常',
    solutions: [
      { id: 's141', text: '检查室外机机种是否错误', isApproved: true, author: 'system' },
      { id: 's142', text: '检查水模块是否与非对应室外机相连', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7A',
    description: '水压过低或水流量过小或水模块液管冻结',
    solutions: [
      { id: 's143', text: '当发生70、76和77报警时，水模块与线控器显示当下报警，但外机基板会显示7A。请按照70、76和77的排除方法操作', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7B',
    description: '水模块通讯异常（外机报）',
    solutions: [
      { id: 's144', text: '检查外机机型与水模块联机方案是否不匹配导致报警', isApproved: true, author: 'system' },
      { id: 's145', text: '当系统连接水模块时，外机DSW6-3需设为on', isApproved: true, author: 'system' },
      { id: 's146', text: '当系统未连接水模块时，DSW6-3需设为off', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7C',
    description: '通讯异常（室内机和室外机通讯异常）',
    solutions: [
      { id: 's147', text: '检查室内机和室外机通讯是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7D',
    description: '变频水泵异常',
    solutions: [
      { id: 's148', text: '检查水泵是否堵转', isApproved: true, author: 'system' },
      { id: 's149', text: '可通过机能选择进行屏蔽', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7E',
    description: '通讯异常（线控器和水模块通讯异常持续5min）',
    solutions: [
      { id: 's150', text: '检查线控器和水模块通讯是否异常持续5分钟', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '7F',
    description: '水泵驱动板通讯异常',
    solutions: [
      { id: 's151', text: '检查通讯线是否连接错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '96',
    description: 'KPI房间温度传感器异常 (FSN)',
    solutions: [
      { id: 's152', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's153', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '97',
    description: 'KPI室外温度传感器异常 (FSN)',
    solutions: [
      { id: 's154', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's155', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'A2',
    description: '3D风口水平摆页1故障或ATW产品传感器异常',
    solutions: [
      { id: 's156', text: '检查摆页是否未连接', isApproved: true, author: 'system' },
      { id: 's157', text: '检查基板是否故障', isApproved: true, author: 'system' },
      { id: 's158', text: '检查ATW产品传感器是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'EE',
    description: 'EEPROM异常、DC机电源板E方错误',
    solutions: [
      { id: 's159', text: '检查EEPROM是否故障或者EEPROM内部参数是否有问题', isApproved: true, author: 'system' },
      { id: 's160', text: '检查DC机电源板E方是否错误，请检查机种拨码', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F5',
    description: '3D风口通信故障或ATW产品传感器异常',
    solutions: [
      { id: 's161', text: '检查ATW产品传感器是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F6',
    description: '冷媒散热进温度传感器Tsc异常',
    solutions: [
      { id: 's162', text: '检查因冷媒过少或EVO电子膨胀阀异常导致的报警', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E1',
    description: '高压压力传感器Pd异常',
    solutions: [
      { id: 's163', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's164', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E2',
    description: '外气温度传感器Ta异常、水源室外机进水温度传感器异常',
    solutions: [
      { id: 's165', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's166', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E3',
    description: '压缩机顶部温度传感器Td异常',
    solutions: [
      { id: 's167', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's168', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E4',
    description: '室外换热器液管温度传感器Te异常',
    solutions: [
      { id: 's169', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's170', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E5',
    description: '室外换热器气管温度传感器Tg异常或多管机室外冻结温度传感器TL1异常',
    solutions: [
      { id: 's171', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's172', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E6',
    description: '室外出水温度传感器异常或多管机室外和气管温度传感器Tg1异常',
    solutions: [
      { id: 's173', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's174', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E7',
    description: '水源机二重管气管出口温度传感器异常或多管机室外冻结温度传感器TL2异常',
    solutions: [
      { id: 's175', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's176', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E8',
    description: '变频一拖一散热片温度传感器异常或多管机室外和气管温度传感器Tg2异常',
    solutions: [
      { id: 's177', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's178', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'E9',
    description: '低压压力传感器Ps异常或多管机室外冻结温度传感器TL3异常',
    solutions: [
      { id: 's179', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's180', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'EA',
    description: '热交换器回水温度传感器 (Twi) 异常或水热源水温传感器异常',
    solutions: [
      { id: 's181', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's182', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'EB',
    description: '电器盒内空气温度传感器或水-毛热交出水温度传感器Two异常',
    solutions: [
      { id: 's183', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's184', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'EC',
    description: '热水水箱温度传感器TDHW异常',
    solutions: [
      { id: 's185', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's186', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'ED',
    description: 'CH装置连接错误或多管机室外和气管温度传感器Tg3异常',
    solutions: [
      { id: 's187', text: '检查室外机组-室内机组之间CH装置是否2台以上连接', isApproved: true, author: 'system' },
      { id: 's188', text: '检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's189', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F0',
    description: '室内外机容量组合异常',
    solutions: [
      { id: 's190', text: '检查内外机容量配比是否错误', isApproved: true, author: 'system' },
      { id: 's191', text: '检查接线是否错误', isApproved: true, author: 'system' },
      { id: 's192', text: '检查容量拨码开关是否错误', isApproved: true, author: 'system' },
      { id: 's193', text: '检查系统编号设定是否错误', isApproved: true, author: 'system' },
      { id: 's194', text: '检查是否存在通讯错误、断线或误配线', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F1',
    description: '正常内机掉线或多管机室外冻结温度传感器TL4异常',
    solutions: [
      { id: 's195', text: '情况一：一台室内机出故障，其他室内机在收到这台室内机发出的数据信号之后超过60分钟没有再收到它发出的数据信号，在其他室内机的遥控器上将显示故障代码。', isApproved: true, author: 'system' },
      { id: 's196', text: '情况二：检查多管机传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's197', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F2',
    description: '选购件加热器、加湿器等异常或多管机室外气管温度传感器Tg4异常',
    solutions: [
      { id: 's198', text: '情况一：检查选购件保护装置是否作动、保护装置是否异常、室内风扇是否停止', isApproved: true, author: 'system' },
      { id: 's199', text: '情况二：检查传感器配线是否误接线、断线或短路', isApproved: true, author: 'system' },
      { id: 's200', text: '检查基板是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F3',
    description: '外机或者内机编号重复/线控器地址设定错误',
    solutions: [
      { id: 's201', text: '情况一：检查系统中是否有重复的内外机地址号系统号。室外机接通电源三分钟后，如果设定的室内机的编号重复，将显示故障代码。', isApproved: true, author: 'system' },
      { id: 's202', text: '情况二：检查同一水系统内的不同的室内机线控器是否设为同一地址', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F4',
    description: '室内外机组合错误或品牌错误',
    solutions: [
      { id: 's203', text: '没有特别备注', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F7',
    description: '连接的水模块的编号设置错误',
    solutions: [
      { id: 's204', text: '检查室外机机能选择n3功能设定值是否错误', isApproved: true, author: 'system' },
      { id: 's205', text: '检查水模块电源是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F8',
    description: '室外机保护电路动作',
    solutions: [
      { id: 's206', text: '检查室外机高压开关是否断开', isApproved: true, author: 'system' },
      { id: 's207', text: '检查接线是否错误', isApproved: true, author: 'system' },
      { id: 's208', text: '检查室外机基板的配线是否有错误接线', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'F9',
    description: '定速压机过电流或者零电流',
    solutions: [
      { id: 's209', text: '检查是否过电流、零电流', isApproved: true, author: 'system' },
      { id: 's210', text: '检查电流互感器是否异常', isApproved: true, author: 'system' },
      { id: 's211', text: '检查电源电压是否异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'FA',
    description: '室外机组合模块台数大于四台',
    solutions: [
      { id: 's212', text: '检查室外机与子机是否组合错误', isApproved: true, author: 'system' },
      { id: 's213', text: '检查电源设定是否错误', isApproved: true, author: 'system' },
      { id: 's214', text: '检查主机和子机的机种或电压设定是否不同', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'FB',
    description: '室外机主机与子机通讯异常/部分从机丢失异常',
    solutions: [
      { id: 's215', text: '检查接线是否错误或端子是否松动', isApproved: true, author: 'system' },
      { id: 's216', text: '检查与子机的通信是否连续30秒不通', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'FC',
    description: '变频基板组合异常',
    solutions: [
      { id: 's217', text: '检查变频基板是否组合错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'FD',
    description: '制冷过负荷保护',
    solutions: [
      { id: 's218', text: '检查室外机热交换器是否阻塞、短路', isApproved: true, author: 'system' },
      { id: 's219', text: '检查室外风扇电机是否故障', isApproved: true, author: 'system' },
      { id: 's220', text: '检查换热器是否堵塞、通风不畅', isApproved: true, author: 'system' },
      { id: 's221', text: '检查风机是否故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: 'FE',
    description: '制热过负荷保护',
    solutions: [
      { id: 's222', text: '检查室外机热交换器是否阻塞、短路', isApproved: true, author: 'system' },
      { id: 's223', text: '检查室外风扇电机是否故障', isApproved: true, author: 'system' },
      { id: 's224', text: '检查换热器是否堵塞、通风不畅', isApproved: true, author: 'system' },
      { id: 's225', text: '检查风机是否故障', isApproved: true, author: 'system' },
    ]
  }
];

const COLORS = {
  primary: '#005a9c', 
  secondary: '#0097a7',
  background: '#f4f7f9',
  card: '#ffffff',
  text: '#333333',
  danger: '#e53935',
  success: '#43a047',
  warning: '#fb8c00'
};

function ACRepairApp() {
  const [role, setRole] = useState<'guest' | 'tech' | 'admin'>('guest');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'list' | 'detail' | 'admin-dashboard' | 'admin-review' | 'admin-manage' | 'admin-edit-solutions'>('list');
  const [selectedFault, setSelectedFault] = useState<FaultCode | null>(null);
  const [faults, setFaults] = useState<FaultCode[]>([]);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 数据持久化（从云端加载）
  useEffect(() => {
    // 从腾讯云获取故障代码列表和待审批请求
    const fetchFromCloud = async () => {
      try {
        // 1. 获取故障代码列表（优先使用云端数据）
        try {
          const cloudFaults = await tcFetchFaults();
          if (cloudFaults && cloudFaults.length > 0) {
            setFaults(cloudFaults);
            localStorage.setItem('ac_faults', JSON.stringify(cloudFaults));
          } else {
            // 如果云端没有数据，检查本地是否有数据
            const savedFaults = localStorage.getItem('ac_faults');
            if (savedFaults) {
              const localFaults = JSON.parse(savedFaults);
              setFaults(localFaults);
              // 将本地数据同步到云端（首次使用）
              await tcSaveFaults(localFaults);
            } else {
              // 既没有云端数据也没有本地数据，使用初始数据并上传
              setFaults(INITIAL_FAULTS);
              localStorage.setItem('ac_faults', JSON.stringify(INITIAL_FAULTS));
              await tcSaveFaults(INITIAL_FAULTS);
            }
          }
        } catch (error) {
          console.error('从腾讯云获取故障代码失败，使用本地数据:', error);
          // 如果云端获取失败，使用本地数据
          const savedFaults = localStorage.getItem('ac_faults');
          if (savedFaults) {
            setFaults(JSON.parse(savedFaults));
          } else {
            setFaults(INITIAL_FAULTS);
            localStorage.setItem('ac_faults', JSON.stringify(INITIAL_FAULTS));
          }
        }

        // 2. 获取待审批请求
        try {
          const cloudRequests = await tcFetchPendingRequests();
          if (cloudRequests.length > 0) {
            const requests: PendingRequest[] = cloudRequests.map(req => ({
              id: req._id,
              faultCode: req.faultCode,
              solutionText: req.solutionText,
              timestamp: req.timestamp
            }));
            setPendingRequests(requests);
            localStorage.setItem('ac_pending', JSON.stringify(requests));
          } else {
            // 如果云端没有数据，使用本地数据
            const savedRequests = localStorage.getItem('ac_pending');
            if (savedRequests) setPendingRequests(JSON.parse(savedRequests));
          }
        } catch (error) {
          console.error('从腾讯云获取待审批请求失败，使用本地数据:', error);
          const savedRequests = localStorage.getItem('ac_pending');
          if (savedRequests) setPendingRequests(JSON.parse(savedRequests));
        }
      } catch (error) {
        console.error('云端数据加载失败:', error);
        // 完全失败时，使用本地数据
        const savedFaults = localStorage.getItem('ac_faults');
        const savedRequests = localStorage.getItem('ac_pending');
        if (savedFaults) setFaults(JSON.parse(savedFaults));
        else {
          setFaults(INITIAL_FAULTS);
          localStorage.setItem('ac_faults', JSON.stringify(INITIAL_FAULTS));
        }
        if (savedRequests) setPendingRequests(JSON.parse(savedRequests));
      }
    };
    
    fetchFromCloud();
  }, []);

  const updateFaults = async (newFaults: FaultCode[]) => {
    setFaults(newFaults);
    localStorage.setItem('ac_faults', JSON.stringify(newFaults));
    
    // 同步到云端（异步，不影响界面响应）
    try {
      await tcSaveFaults(newFaults);
      console.log('故障代码已同步到云端');
    } catch (error) {
      console.error('故障代码同步到云端失败:', error);
      // 即使同步失败，本地数据已经更新，不影响使用
    }
    
    // 如果正在编辑某个故障，同步更新
    if (selectedFault) {
      const updated = newFaults.find(f => f.code === selectedFault.code);
      if (updated) setSelectedFault(updated);
    }
  };

  const updateRequests = async (newRequests: PendingRequest[]) => {
    setPendingRequests(newRequests);
    localStorage.setItem('ac_pending', JSON.stringify(newRequests));
    
    // 这里可以根据需要实现与腾讯云的同步逻辑
    // 例如：只同步新增的请求，或者全量同步
  };

  // 添加待审批请求
  const addPendingRequest = async (request: PendingRequest) => {
    try {
      // 同步到腾讯云
      const cloudRequest = await tcCreatePendingRequest({
        faultCode: request.faultCode,
        solutionText: request.solutionText,
        timestamp: request.timestamp
      });
      
      // 更新本地状态
      const newRequest = {
        ...request,
        id: cloudRequest._id
      };
      const newRequests = [...pendingRequests, newRequest];
      setPendingRequests(newRequests);
      localStorage.setItem('ac_pending', JSON.stringify(newRequests));
      
      return newRequest;
    } catch (error) {
      console.error('添加待审批请求失败:', error);
      // 如果云同步失败，仍然保存到本地
      const newRequests = [...pendingRequests, request];
      setPendingRequests(newRequests);
      localStorage.setItem('ac_pending', JSON.stringify(newRequests));
      return request;
    }
  };

  // 删除待审批请求
  const removePendingRequest = async (id: string) => {
    try {
      // 从腾讯云删除
      await tcDeletePendingRequest(id);
    } catch (error) {
      console.error('从腾讯云删除待审批请求失败:', error);
    } finally {
      // 更新本地状态
      const newRequests = pendingRequests.filter(req => req.id !== id);
      setPendingRequests(newRequests);
      localStorage.setItem('ac_pending', JSON.stringify(newRequests));
    }
  };

  // 逻辑处理
  const filteredFaults = useMemo(() => {
    return faults.filter(f => 
      f.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
      f.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [faults, searchQuery]);

  const handleAdminLogin = () => {
    if (password === 'hisense123') {
      setRole('admin');
      setView('admin-dashboard');
    } else {
      alert('密码错误！');
    }
  };

  const logout = () => {
    setRole('guest');
    setShowAdminLogin(false);
    setPassword('');
    setView('list');
  };

  // --- 管理员操作函数 ---

  const deleteFault = (code: string) => {
    if (confirm(`确定要彻底删除故障代码 ${code} 及其所有方案吗？`)) {
      updateFaults(faults.filter(f => f.code !== code));
    }
  };

  const addSolutionToFault = (faultCode: string, text: string) => {
    const newFaults = faults.map(f => {
      if (f.code === faultCode) {
        return {
          ...f,
          solutions: [...f.solutions, { id: Date.now().toString(), text, isApproved: true, author: 'system' as const }]
        };
      }
      return f;
    });
    updateFaults(newFaults);
  };

  const deleteSolution = (faultCode: string, solId: string) => {
    const newFaults = faults.map(f => {
      if (f.code === faultCode) {
        return {
          ...f,
          solutions: f.solutions.filter(s => s.id !== solId)
        };
      }
      return f;
    });
    updateFaults(newFaults);
  };

  const updateSolutionText = (faultCode: string, solId: string, newText: string) => {
    const newFaults = faults.map(f => {
      if (f.code === faultCode) {
        return {
          ...f,
          solutions: f.solutions.map(s => s.id === solId ? { ...s, text: newText } : s)
        };
      }
      return f;
    });
    updateFaults(newFaults);
  };

  // --- 视图组件 ---

  if (role === 'guest') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
          <div className="p-10 text-center" style={{ backgroundColor: COLORS.primary }}>
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20 shadow-inner">
              <Settings className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-1">空调故障维护系统</h1>
            <p className="text-white/60 text-xs tracking-widest uppercase">Maintenance Intelligence</p>
          </div>
          
          <div className="p-8 space-y-6">
            {!showAdminLogin ? (
              <div className="space-y-4">
                <button 
                  onClick={() => { setRole('tech'); setView('list'); }}
                  className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg text-white font-bold text-lg"
                  style={{ backgroundColor: COLORS.secondary }}
                >
                  <Wrench size={22} />
                  进入维修模式
                </button>
                <button 
                  onClick={() => setShowAdminLogin(true)}
                  className="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-md bg-white border-2 font-bold text-lg"
                  style={{ color: COLORS.primary, borderColor: COLORS.primary }}
                >
                  <ShieldCheck size={22} />
                  管理员登录
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-700">管理身份验证</h3>
                  <button onClick={() => setShowAdminLogin(false)} className="text-xs text-slate-400">返回</button>
                </div>
                <input 
                  type="password" 
                  autoFocus
                  placeholder="请输入管理密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
                <button 
                  onClick={handleAdminLogin}
                  className="w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg text-white font-bold"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  确认进入
                </button>
              </div>
            )}
          </div>
          <div className="pb-6 text-center text-[10px] text-slate-300 font-medium">
            HISENSE SERVICE MANAGEMENT v2.0
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 px-5 py-4 flex items-center justify-between shadow-md" style={{ backgroundColor: COLORS.primary, color: 'white' }}>
        <div className="flex items-center gap-4">
          {(view !== 'list' && view !== 'admin-dashboard') && (
            <button 
              onClick={() => {
                if (view === 'admin-edit-solutions') setView('admin-manage');
                else setView(role === 'admin' ? 'admin-dashboard' : 'list');
              }}
              className="p-1 active:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold leading-none">
              {view === 'list' ? '故障查询' : 
               view === 'detail' ? `代码 ${selectedFault?.code}` : 
               view === 'admin-dashboard' ? '管理后台' :
               view === 'admin-review' ? '审核建议' : 
               view === 'admin-edit-solutions' ? `维护: ${selectedFault?.code}` : '数据中心'}
            </h1>
            <p className="text-[10px] text-white/60 mt-1 uppercase tracking-tighter">
              {role === 'admin' ? 'Administrator Access' : 'Technician Mode'}
            </p>
          </div>
        </div>
        <button onClick={logout} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors">
          <LogOut size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 max-w-lg mx-auto w-full">
        
        {/* --- 维修工视角: 列表 --- */}
        {view === 'list' && (
          <div className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" size={20} />
              <input 
                type="text"
                placeholder="搜索故障代码或关键词..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-3">
              {filteredFaults.map(fault => (
                <div 
                  key={fault.code}
                  onClick={() => { setSelectedFault(fault); setView('detail'); }}
                  className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm border border-transparent active:border-blue-100 active:bg-blue-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-xl shadow-inner" style={{ backgroundColor: '#e1f5fe', color: COLORS.primary }}>
                      <span className="text-[10px] uppercase opacity-50 mb-0.5">Code</span>
                      {fault.code}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700">{fault.description}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                          {fault.solutions.length} 方案
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300" />
                </div>
              ))}
              {filteredFaults.length === 0 && (
                <div className="text-center py-20 text-slate-300">
                  <AlertTriangle size={64} className="mx-auto mb-4 opacity-10" />
                  <p className="font-medium">未找到匹配代码</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- 维修工视角: 详情 --- */}
        {view === 'detail' && selectedFault && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-white p-7 rounded-[2rem] shadow-sm border-t-8" style={{ borderTopColor: COLORS.secondary }}>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={14} className="text-slate-400" />
                <h2 className="text-xs text-slate-400 font-bold uppercase tracking-widest">故障描述</h2>
              </div>
              <p className="text-2xl font-black text-slate-800">{selectedFault.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-500 px-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" /> 
                解决措施列表
              </h3>
              
              <div className="space-y-3">
                {selectedFault.solutions.filter(s => s.isApproved).map((sol, index) => (
                  <div key={sol.id} className="bg-white p-5 rounded-2xl flex gap-4 shadow-sm border border-slate-100">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black text-white shrink-0 shadow-md" style={{ backgroundColor: COLORS.secondary }}>
                      {index + 1}
                    </div>
                    <p className="flex-1 text-slate-700 leading-relaxed font-medium">{sol.text}</p>
                  </div>
                ))}
              </div>
            </div>

             {/* 提交新建议 */}
             <div className="mt-8 pt-8 border-t border-slate-200">
               <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl">
                 <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                   <PlusCircle size={20} />上报新方案
                 </h4>
                 <p className="text-blue-100 text-sm mb-6">如果现有方法无效，请分享您的维修经验。管理员审核后将向全员发布。</p>
                 <form onSubmit={async (e: any) => {
                   e.preventDefault();
                   const val = e.target.solution.value;
                   if (!val.trim()) return;
                   const newReq: PendingRequest = {
                     id: Date.now().toString(),
                     faultCode: selectedFault.code,
                     solutionText: val,
                     timestamp: Date.now()
                   };
                   await addPendingRequest(newReq);
                   alert('申请已提交，感谢您的贡献！');
                   e.target.reset();
                 }}>
                   <textarea 
                     name="solution"
                     placeholder="请详述您的解决方案..."
                     className="w-full p-5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 min-h-[120px] mb-4 outline-none focus:bg-white/20 transition-all text-sm"
                   />
                   <button 
                     type="submit"
                     className="w-full py-4 rounded-xl bg-white text-blue-600 font-bold text-lg transition-all active:scale-95 shadow-lg"
                   >
                     提交审核
                   </button>
                 </form>
               </div>
             </div>
          </div>
        )}

        {/* --- 管理员: 控制台 --- */}
        {view === 'admin-dashboard' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                  <ShieldCheck size={32} style={{ color: COLORS.primary }} />
                </div>
                <div>
                  <h2 className="font-black text-xl text-slate-800">系统维护终端</h2>
                  <p className="text-xs text-slate-400">当前权限: 最高管理员</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-3xl font-black" style={{ color: COLORS.primary }}>{faults.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">总故障项</p>
                </div>
                <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100">
                  <p className="text-3xl font-black text-orange-600">{pendingRequests.length}</p>
                  <p className="text-[10px] text-orange-400 font-bold uppercase mt-1">待审建议</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => setView('admin-review')}
                className="w-full bg-white p-6 rounded-3xl flex items-center justify-between shadow-md border-l-8 active:scale-98 transition-all"
                style={{ borderLeftColor: COLORS.warning }}
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-orange-100 rounded-2xl text-orange-600"><ClipboardList size={24} /></div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-700">建议审核队列</h3>
                    <p className="text-xs text-slate-400">处理前端维修工上报的数据</p>
                  </div>
                </div>
                {pendingRequests.length > 0 && (
                  <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-black ring-4 ring-orange-100 animate-pulse">{pendingRequests.length}</span>
                )}
                <ChevronRight className="text-slate-300" />
              </button>

              <button 
                onClick={() => setView('admin-manage')}
                className="w-full bg-white p-6 rounded-3xl flex items-center justify-between shadow-md border-l-8 active:scale-98 transition-all"
                style={{ borderLeftColor: COLORS.primary }}
              >
                <div className="flex items-center gap-5">
                  <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><Settings size={24} /></div>
                  <div className="text-left">
                    <h3 className="font-bold text-slate-700">基础数据管理</h3>
                    <p className="text-xs text-slate-400">管理代码及关联解决措施</p>
                  </div>
                </div>
                <ChevronRight className="text-slate-300" />
              </button>
            </div>
          </div>
        )}

        {/* --- 管理员: 数据管理(列表) --- */}
        {view === 'admin-manage' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6 duration-300">
            <div className="bg-white p-7 rounded-[2rem] shadow-lg border border-slate-100">
              <h3 className="font-bold mb-5 flex items-center gap-2 text-slate-700">
                <Plus size={20} className="text-blue-600" />
                新增故障代码
              </h3>
              <form onSubmit={(e: any) => {
                e.preventDefault();
                const code = e.target.code.value.trim();
                const desc = e.target.desc.value.trim();
                if (!code || !desc) return;
                if (faults.some(f => f.code === code)) return alert('代码已存在');
                const newFault: FaultCode = { code, description: desc, solutions: [] };
                updateFaults([...faults, newFault]);
                e.target.reset();
              }} className="space-y-3">
                <input name="code" placeholder="输入代码 (如 03)" className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-400" />
                <input name="desc" placeholder="输入描述 (如 低压压力开关报警)" className="w-full p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-400" />
                <button type="submit" className="w-full py-4 rounded-xl bg-slate-800 text-white font-bold transition-all active:scale-95 shadow-lg">确认添加</button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">现有数据表 ({faults.length})</h3>
              {faults.map(f => (
                <div 
                  key={f.code} 
                  className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div 
                    className="flex items-center gap-4 flex-1 cursor-pointer"
                    onClick={() => { setSelectedFault(f); setView('admin-edit-solutions'); }}
                  >
                    <span className="font-black text-blue-600 w-8 text-xl">{f.code}</span>
                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-700 block">{f.description}</span>
                      <span className="text-[10px] text-slate-400">{f.solutions.length} 项措施 • 点击管理内容</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const newDesc = prompt('修改描述:', f.description);
                        if (newDesc && newDesc.trim()) {
                          updateFaults(faults.map(it => it.code === f.code ? {...it, description: newDesc} : it));
                        }
                      }}
                      className="p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => deleteFault(f.code)}
                      className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 管理员: 解决措施管理(核心功能) --- */}
        {view === 'admin-edit-solutions' && selectedFault && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-800 p-7 rounded-[2.5rem] text-white shadow-xl">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black uppercase text-blue-400 tracking-tighter">Code Content Management</span>
                 <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded">ID: {selectedFault.code}</span>
              </div>
              <h2 className="text-2xl font-black">{selectedFault.description}</h2>
              <p className="text-white/40 text-xs mt-4">在这里您可以管理该故障代码的所有解决措施条目。</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <PlusCircle size={18} className="text-green-500" />
                新增官方解决措施
              </h3>
              <div className="flex gap-2">
                <input 
                  id="new-sol-input"
                  placeholder="请输入新措施描述..." 
                  className="flex-1 p-4 rounded-xl border border-slate-100 bg-slate-50 outline-none text-sm focus:ring-2 focus:ring-blue-400"
                />
                <button 
                  onClick={() => {
                    const input = document.getElementById('new-sol-input') as HTMLInputElement;
                    if (input.value.trim()) {
                      addSolutionToFault(selectedFault.code, input.value.trim());
                      input.value = '';
                    }
                  }}
                  className="px-5 bg-green-500 text-white rounded-xl font-bold active:scale-95 transition-all shadow-md"
                >
                  添加
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">措施库管理</h3>
              {selectedFault.solutions.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
                  暂无措施，请点击上方添加
                </div>
              ) : (
                selectedFault.solutions.map((sol, index) => (
                  <div key={sol.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50 group">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400">
                        {index + 1}
                      </div>
                      <textarea 
                        className="flex-1 text-sm font-medium text-slate-700 bg-transparent border-none outline-none resize-none min-h-[60px] focus:bg-slate-50 rounded p-1"
                        defaultValue={sol.text}
                        onBlur={(e) => {
                          if (e.target.value !== sol.text) {
                            updateSolutionText(selectedFault.code, sol.id, e.target.value);
                          }
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sol.author === 'system' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'}`}>
                          {sol.author === 'system' ? '官方' : '维修工提交'}
                        </span>
                        {!sol.isApproved && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">待审核</span>
                        )}
                      </div>
                      <button 
                        onClick={() => deleteSolution(selectedFault.code, sol.id)}
                        className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

         {/* --- 管理员: 审核界面 --- */}
         {view === 'admin-review' && (
           <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
             {pendingRequests.length === 0 ? (
               <div className="text-center py-24 text-slate-300">
                 <CheckCircle2 size={80} className="mx-auto mb-4 opacity-5" />
                 <p className="font-bold">审核队列已清空</p>
                 <button 
                   onClick={() => setView('admin-dashboard')}
                   className="mt-6 text-blue-600 font-bold text-sm underline"
                 >
                   返回控制台
                 </button>
               </div>
             ) : (
               pendingRequests.map(req => (
                 <div key={req.id} className="bg-white p-6 rounded-[2rem] shadow-lg space-y-4 border border-slate-100">
                   <div className="flex items-center justify-between">
                     <span className="text-xs font-black px-4 py-1.5 bg-blue-600 text-white rounded-full shadow-md">
                       故障码: {req.faultCode}
                     </span>
                     <span className="text-[10px] text-slate-400 font-bold">
                       {new Date(req.timestamp).toLocaleString()}
                     </span>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                     <p className="text-sm font-bold text-slate-700 leading-relaxed italic">“{req.solutionText}”</p>
                   </div>
                   <div className="flex gap-3 pt-2">
                     <button 
                       onClick={async () => {
                         const newFaults = faults.map(f => {
                           if (f.code === req.faultCode) {
                             return {
                               ...f,
                               solutions: [...f.solutions, { 
                                 id: req.id, 
                                 text: req.solutionText, 
                                 isApproved: true, 
                                 author: 'technician' as const
                               }]
                             };
                           }
                           return f;
                         });
                         // 先更新故障代码（会同步到云端），再删除待审核记录
                         await updateFaults(newFaults);
                         await removePendingRequest(req.id);
                       }}
                       className="flex-1 py-4 rounded-2xl bg-green-500 text-white text-sm font-black flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-green-200"
                     >
                       <Check size={18} /> 采纳发布
                     </button>
                     <button 
                       onClick={async () => {
                         await removePendingRequest(req.id);
                       }}
                       className="flex-1 py-4 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 text-sm font-bold flex items-center justify-center gap-2 active:scale-95"
                     >
                       <X size={18} /> 拒绝
                     </button>
                   </div>
                 </div>
               ))
             )}
           </div>
         )}

      </main>

      {/* 底部悬浮指示器 */}
      {role === 'tech' && view === 'detail' && (
        <div className="fixed bottom-8 right-8 animate-bounce">
          <button 
            onClick={() => {
              const el = document.querySelector('textarea[name="solution"]');
              el?.scrollIntoView({ behavior: 'smooth' });
              (el as HTMLTextAreaElement)?.focus();
            }}
            className="w-16 h-16 rounded-3xl shadow-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
            style={{ backgroundColor: COLORS.secondary }}
          >
            <Plus size={32} />
          </button>
        </div>
      )}
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<ACRepairApp />);
}

// PWA Service Worker 注册代码
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered with scope:', registration.scope);
      })
      .catch(error => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}