const INITIAL_FAULTS: FaultCode[] = [
  {
    code: '01',
    description: '室内机保护装置动作（浮子开关）',
    solutions: [
      { id: 's1', text: '接水盘水位过高，排水管、浮子开关或排水泵异常', isApproved: true, author: 'system' },
      { id: 's2', text: '软件工装浮子开关未短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '02',
    description: '外机保护装置动作（高压压力开关）',
    solutions: [
      { id: 's3', text: '配管堵塞、制冷剂冲注过量、混入不凝不可压缩气体', isApproved: true, author: 'system' },
      { id: 's4', text: '基板故障，软件工装基板上高压开关未短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '03',
    description: '室内机与室外机间通讯异常',
    solutions: [
      { id: 's5', text: '室外机与室内机间通信线连接错误、断线、混接', isApproved: true, author: 'system' },
      { id: 's6', text: '室外机电源OFF，室外机通讯保险丝熔断', isApproved: true, author: 'system' },
      { id: 's7', text: '室内外机系统号不匹配', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '04',
    description: '变频控制基板与室外机基板间通讯异常',
    solutions: [
      { id: 's8', text: '连接线松动、接线错误、保险丝熔断', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '05',
    description: '室外风扇控制基板与室外机基板间通讯异常',
    solutions: [
      { id: 's9', text: '连接线松动、接线错误、保险丝熔断', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '06',
    description: '电源相序异常',
    solutions: [
      { id: 's10', text: '电源错误、电源接线缺相、电源相位接错', isApproved: true, author: 'system' },
      { id: 's11', text: '软件工装未屏蔽三相电', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '07',
    description: '变频器电压异常',
    solutions: [
      { id: 's12', text: '室外机电源电压过低、电源容量不足', isApproved: true, author: 'system' },
      { id: 's13', text: '压缩机变频模块控制板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '08',
    description: '室外机风扇控制基板电压异常',
    solutions: [
      { id: 's14', text: '风扇控制模块电压异常、风扇模块故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '09',
    description: '排气过热度Tdsh过低',
    solutions: [
      { id: 's15', text: '制冷剂冲注过多、温度传感器故障', isApproved: true, author: 'system' },
      { id: 's16', text: '电子膨胀阀故障、配管连接错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0A',
    description: '压缩机顶部温度Td过高异常',
    solutions: [
      { id: 's17', text: '制冷剂冲注过少、温度传感器故障', isApproved: true, author: 'system' },
      { id: 's18', text: '电子膨胀阀故障、配管连接错误、管路堵塞', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0B',
    description: '室外机风扇内置温感检测温度过高；或水源机水温异常',
    solutions: [
      { id: 's19', text: '室外风扇电机过热', isApproved: true, author: 'system' },
      { id: 's20', text: '软件工装49FE未短接', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0C',
    description: '室外机与室外机间通讯异常',
    solutions: [
      { id: 's21', text: '室外机间通讯线连接错误、断线、端子松动', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0D',
    description: '室外机子模块设定错误',
    solutions: [
      { id: 's22', text: '同一室外机系统中子模块设定错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0E',
    description: '室外机主模块设定错误',
    solutions: [
      { id: 's23', text: '同一室外机系统中设定了两个主模块', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '0F',
    description: '水热源水温异常',
    solutions: [
      { id: 's24', text: '水热源的温度低下', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '10',
    description: '湿度传感器异常',
    solutions: [
      { id: 's25', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's26', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '11',
    description: '室内机回风温度传感器Ti异常或水模块进水温度传感器TWi异常',
    solutions: [
      { id: 's27', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's28', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '12',
    description: '室内机出风温度传感器TO异常或水模块出水温度传感器TWO异常',
    solutions: [
      { id: 's29', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's30', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '13',
    description: '室内机液管温度传感器Ti异常',
    solutions: [
      { id: 's31', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's32', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '14',
    description: '室内机气管温度传感器Tg异常',
    solutions: [
      { id: 's33', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's34', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '15',
    description: '全热交换器环境温度传感器异常或水模块出水口TWO2温度传感器异常',
    solutions: [
      { id: 's35', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's36', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '16',
    description: '新风机远程传感器异常或远程温度传感器异常或水模块水箱水温传感器TDHW异常',
    solutions: [
      { id: 's37', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's38', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '17',
    description: '线控器内置传感器异常或水模块板出口水温传感器TVOHP异常',
    solutions: [
      { id: 's39', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's40', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '18',
    description: '室内风扇电机温度传感器异常、室内风驱报警风机不动作、失步检出；或水模块出水口3温度传感器异常或水压力传感器异常',
    solutions: [
      { id: 's41', text: '室内风扇电机异常过热、堵转、传感器异常', isApproved: true, author: 'system' },
      { id: 's42', text: '传感器配线误接线、断线、短路、基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '19',
    description: '室内机风扇电机保护装置动作',
    solutions: [
      { id: 's43', text: '风扇电机堵转、过热，电机保护回路断开', isApproved: true, author: 'system' },
      { id: 's44', text: '软件工装外F4未短接、未接电机，机种或容量设定错误', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1A',
    description: '室内风驱报警',
    solutions: [
      { id: 's45', text: '过电流保护、欠电压保护、短路保护', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1B',
    description: '室内风驱报警',
    solutions: [
      { id: 's46', text: '瞬时过电流，电机运转中电流连续30秒超过电流保护设定值', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1C',
    description: '室内风驱报警电流输出回路异常',
    solutions: [
      { id: 's47', text: '电机起动前电流检出异常、缺相时、未接电机时', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '1D',
    description: '室内风驱报警 欠电压',
    solutions: [
      { id: 's48', text: '无特别备注', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '20',
    description: '压机顶部温度传感器Ti异常或多管机室外机热交换器盘管中间温度传感器异常',
    solutions: [
      { id: 's49', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's50', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '21',
    description: '高压压力传感器Pd异常',
    solutions: [
      { id: 's51', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's52', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '22',
    description: '外气温度传感器Ta异常；水源室外机进水温度传感器异常',
    solutions: [
      { id: 's53', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's54', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '23',
    description: '压缩机顶部温度传感器Td异常',
    solutions: [
      { id: 's55', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's56', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '24',
    description: '室外换热器液管温度传感器Te异常',
    solutions: [
      { id: 's57', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's58', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '25',
    description: '室外换热器气管温度传感器Tg异常或多管机室外冻结温度传感器TL1异常',
    solutions: [
      { id: 's59', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's60', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '26',
    description: '室外出水温度传感器异常或多管机室外气管温度传感器Tg1异常',
    solutions: [
      { id: 's61', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's62', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '27',
    description: '水源机二重管气管出口温度传感器异常或多管机室外冻结温度传感器TL2异常',
    solutions: [
      { id: 's63', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's64', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '28',
    description: '变频一拖一散热片温度传感器异常或多管机室外气管温度传感器Tg2异常',
    solutions: [
      { id: 's65', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's66', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '29',
    description: '低压压力传感器Ps异常或多管机室外冻结温度传感器TL3异常',
    solutions: [
      { id: 's67', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's68', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '2A',
    description: '热交换器回水温度传感器（Twi）异常或水热源水温传感器异常',
    solutions: [
      { id: 's69', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's70', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '2B',
    description: '电器盒内空气温度传感器或水-氟热交出水温度传感器Tvo异常',
    solutions: [
      { id: 's71', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's72', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '2C',
    description: '热水水箱温度传感器TDHW异常',
    solutions: [
      { id: 's73', text: '传感器配线误接线、断线、短路', isApproved: true, author: 'system' },
      { id: 's74', text: '基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '30',
    description: 'CH装置连接错误或多管机室外气管温度传感器Tg3异常',
    solutions: [
      { id: 's75', text: '室外机组-室内机组之间CH装置2台以上连接', isApproved: true, author: 'system' },
      { id: 's76', text: '传感器配线误接线、断线、短路、基板故障', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '31',
    description: '室内外机容量组合异常',
    solutions: [
      { id: 's77', text: '内外机容量配比错误、接线错误、容量拨码开关错误', isApproved: true, author: 'system' },
      { id: 's78', text: '系统编号设定错误/通讯错误、断线、误配线', isApproved: true, author: 'system' },
    ]
  },
  {
    code: '32',
    description: '正常内机掉线或多管机室外冻结温度传感器TL4异常',
    solutions: [
      { id: 's79', text: '一台室内机出故障后，其他室内机未收到其
