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