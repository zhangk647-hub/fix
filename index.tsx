
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
    description: '浮子开关报警',
    solutions: [
      { id: 's1', text: '排水管堵塞', isApproved: true, author: 'system' },
      { id: 's2', text: '排水泵故障', isApproved: true, author: 'system' },
      { id: 's3', text: '浮子开关异常', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '02',
    description: '高压压力开关报警',
    solutions: [
      { id: 's4', text: '室外机翅片脏堵', isApproved: true, author: 'system' },
      { id: 's5', text: '冷媒充注过多', isApproved: true, author: 'system' },
      { id: 's6', text: '压力开关接插件松动', isApproved: true, author: 'system' },
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

  // 数据持久化
  useEffect(() => {
    const savedFaults = localStorage.getItem('ac_faults');
    const savedRequests = localStorage.getItem('ac_pending');
    if (savedFaults) {
      setFaults(JSON.parse(savedFaults));
    } else {
      setFaults(INITIAL_FAULTS);
      localStorage.setItem('ac_faults', JSON.stringify(INITIAL_FAULTS));
    }
    if (savedRequests) setPendingRequests(JSON.parse(savedRequests));
  }, []);

  const updateFaults = (newFaults: FaultCode[]) => {
    setFaults(newFaults);
    localStorage.setItem('ac_faults', JSON.stringify(newFaults));
    // 如果正在编辑某个故障，同步更新
    if (selectedFault) {
      const updated = newFaults.find(f => f.code === selectedFault.code);
      if (updated) setSelectedFault(updated);
    }
  };

  const updateRequests = (newRequests: PendingRequest[]) => {
    setPendingRequests(newRequests);
    localStorage.setItem('ac_pending', JSON.stringify(newRequests));
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
                  <PlusCircle size={20} />
                  上报新方案
                </h4>
                <p className="text-blue-100 text-sm mb-6">如果现有方法无效，请分享您的维修经验。管理员审核后将向全员发布。</p>
                <form onSubmit={(e: any) => {
                  e.preventDefault();
                  const val = e.target.solution.value;
                  if (!val.trim()) return;
                  const newReq: PendingRequest = {
                    id: Date.now().toString(),
                    faultCode: selectedFault.code,
                    solutionText: val,
                    timestamp: Date.now()
                  };
                  updateRequests([...pendingRequests, newReq]);
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
                      onClick={() => {
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
                        updateFaults(newFaults);
                        updateRequests(pendingRequests.filter(r => r.id !== req.id));
                      }}
                      className="flex-1 py-4 rounded-2xl bg-green-500 text-white text-sm font-black flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-green-200"
                    >
                      <Check size={18} /> 采纳发布
                    </button>
                    <button 
                      onClick={() => updateRequests(pendingRequests.filter(r => r.id !== req.id))}
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
