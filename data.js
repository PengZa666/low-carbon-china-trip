// 中国轮廓简化路径 (viewBox 0 0 1000 850，极简轮廓)
// 基于公开轮廓简化，仅用于界面展示
const CHINA_OUTLINE_PATH = 'M 896 90 L 918 120 L 920 180 L 908 240 L 900 300 L 890 360 L 880 420 L 865 480 L 850 540 L 830 600 L 810 650 L 780 700 L 740 750 L 700 780 L 650 810 L 600 825 L 550 835 L 500 838 L 450 832 L 400 818 L 350 795 L 300 765 L 260 730 L 220 690 L 185 650 L 155 600 L 130 550 L 110 500 L 95 450 L 85 400 L 80 350 L 78 300 L 82 250 L 90 200 L 105 150 L 125 110 L 150 80 L 180 55 L 220 38 L 270 28 L 320 25 L 380 30 L 440 45 L 500 65 L 560 90 L 620 118 L 680 145 L 740 168 L 800 182 L 850 185 L 880 175 L 896 90 Z M 520 280 L 560 290 L 600 310 L 620 350 L 615 400 L 590 440 L 550 465 L 500 470 L 450 455 L 415 420 L 400 380 L 398 340 L 410 300 L 440 275 L 480 268 L 520 280 Z';

// 城市配置：id, 名称, 坐标(x,y), 地标名, 地标描述, 纪念品描述
const CITIES = [
  { id: 'beijing', name: '北京', x: 720, y: 220, landmark: '天坛', landmarkDesc: '北京地标 · 祈年殿', couponDesc: '天坛文创满50减10', icon: 'temple' },
  { id: 'shanghai', name: '上海', x: 820, y: 420, landmark: '东方明珠', landmarkDesc: '上海地标', couponDesc: '外滩餐饮满100减20', icon: 'tower' },
  { id: 'hangzhou', name: '杭州', x: 780, y: 460, landmark: '西湖', landmarkDesc: '人间天堂美景', couponDesc: '西湖景区消费券10元', icon: 'pagoda' },
  { id: 'guangzhou', name: '广州', x: 680, y: 620, landmark: '广州塔', landmarkDesc: '小蛮腰', couponDesc: '粤式茶点满60减15', icon: 'tower' },
  { id: 'chengdu', name: '成都', x: 420, y: 480, landmark: '大熊猫基地', landmarkDesc: '国宝之乡', couponDesc: '火锅抵扣券20元', icon: 'panda' },
  { id: 'wuhan', name: '武汉', x: 620, y: 440, landmark: '黄鹤楼', landmarkDesc: '天下江山第一楼', couponDesc: '热干面套餐券', icon: 'tower' },
  { id: 'xian', name: '西安', x: 520, y: 380, landmark: '大雁塔', landmarkDesc: '古都地标', couponDesc: '陕西美食满80减18', icon: 'pagoda' },
  { id: 'harbin', name: '哈尔滨', x: 780, y: 140, landmark: '圣索菲亚', landmarkDesc: '冰雪之城', couponDesc: '中央大街商户券', icon: 'church' },
  { id: 'urumqi', name: '乌鲁木齐', x: 220, y: 320, landmark: '红山', landmarkDesc: '西域风情', couponDesc: '新疆美食券', icon: 'mountain' },
  { id: 'haikou', name: '海口', x: 520, y: 720, landmark: '骑楼老街', landmarkDesc: '椰城风情', couponDesc: '海南特产满50减10', icon: 'palm' },
  { id: 'shenyang', name: '沈阳', x: 760, y: 260, landmark: '故宫', landmarkDesc: '盛京故宫', couponDesc: '东北菜满100减25', icon: 'temple' },
  { id: 'nanjing', name: '南京', x: 760, y: 400, landmark: '中山陵', landmarkDesc: '博爱之都', couponDesc: '秦淮小吃券', icon: 'gate' },
  { id: 'chongqing', name: '重庆', x: 480, y: 500, landmark: '洪崖洞', landmarkDesc: '山城夜景', couponDesc: '火锅/小面双券', icon: 'tower' },
  { id: 'kunming', name: '昆明', x: 380, y: 600, landmark: '石林', landmarkDesc: '春城', couponDesc: '云南米线券', icon: 'mountain' },
  { id: 'lanzhou', name: '兰州', x: 420, y: 340, landmark: '黄河铁桥', landmarkDesc: '黄河之都', couponDesc: '牛肉面专享券', icon: 'bridge' },
  { id: 'changsha', name: '长沙', x: 600, y: 520, landmark: '岳麓书院', landmarkDesc: '橘子洲头', couponDesc: '湘菜满80减18', icon: 'pagoda' },
  { id: 'zhengzhou', name: '郑州', x: 600, y: 360, landmark: '二七塔', landmarkDesc: '中原枢纽', couponDesc: '烩面专享券', icon: 'tower' },
  { id: 'shenzhen', name: '深圳', x: 660, y: 660, landmark: '市民中心', landmarkDesc: '创新之城', couponDesc: '商圈餐饮满100减25', icon: 'tower' }
];

// 路线：相邻城市可通行，并带有大致里程(用于展示)
const ROUTES = [
  { from: 'beijing', to: 'harbin', distance: 1200 },
  { from: 'beijing', to: 'shenyang', distance: 650 },
  { from: 'beijing', to: 'zhengzhou', distance: 700 },
  { from: 'beijing', to: 'xian', distance: 1100 },
  { from: 'shanghai', to: 'nanjing', distance: 300 },
  { from: 'shanghai', to: 'hangzhou', distance: 180 },
  { from: 'hangzhou', to: 'nanjing', distance: 280 },
  { from: 'hangzhou', to: 'wuhan', distance: 750 },
  { from: 'guangzhou', to: 'shenzhen', distance: 140 },
  { from: 'guangzhou', to: 'changsha', distance: 660 },
  { from: 'chengdu', to: 'xian', distance: 720 },
  { from: 'chengdu', to: 'chongqing', distance: 310 },
  { from: 'chengdu', to: 'kunming', distance: 850 },
  { from: 'wuhan', to: 'zhengzhou', distance: 520 },
  { from: 'wuhan', to: 'changsha', distance: 350 },
  { from: 'wuhan', to: 'nanjing', distance: 520 },
  { from: 'xian', to: 'lanzhou', distance: 630 },
  { from: 'xian', to: 'zhengzhou', distance: 480 },
  { from: 'harbin', to: 'shenyang', distance: 550 },
  { from: 'urumqi', to: 'lanzhou', distance: 1900 },
  { from: 'lanzhou', to: 'xian', distance: 630 },
  { from: 'chongqing', to: 'wuhan', distance: 880 },
  { from: 'changsha', to: 'guangzhou', distance: 660 },
  { from: 'haikou', to: 'guangzhou', distance: 550 },
  { from: 'shenzhen', to: 'guangzhou', distance: 140 }
];

// 单次出发消耗油量
const FUEL_PER_TRIP = 10;
// 初始油量 / 最大油量
const INITIAL_FUEL = 100;
const MAX_FUEL = 100;
