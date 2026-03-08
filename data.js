// CHINA_OUTLINE_PATH 来自 china_outline.js（与省界同源 DataV GeoAtlas，确保对齐）

// 城市配置：id, 名称, 坐标(x,y), 地标, 地标描述, 纪念品描述, icon
// 坐标由经纬度投影计算：x=(lon-73)/62*1000, y=(54-lat)/36*850，与地图同系
const CITIES = [
  { id: 'beijing', name: '北京', x: 700, y: 333, landmark: '天坛', landmarkDesc: '北京地标 · 祈年殿', couponDesc: '天坛文创满50减10', icon: 'temple' },
  { id: 'shijiazhuang', name: '石家庄', x: 670, y: 376, landmark: '艺术中心', landmarkDesc: '燕赵古都', couponDesc: '正定古城商户券', icon: 'pagoda' },
  { id: 'taiyuan', name: '太原', x: 638, y: 381, landmark: '晋祠', landmarkDesc: '龙城晋韵', couponDesc: '山西面食满60减12', icon: 'temple' },
  { id: 'hohhot', name: '呼和浩特', x: 625, y: 311, landmark: '大召寺', landmarkDesc: '草原青城', couponDesc: '蒙餐满80减18', icon: 'temple' },
  { id: 'shenyang', name: '沈阳', x: 813, y: 288, landmark: '故宫', landmarkDesc: '盛京故宫', couponDesc: '东北菜满100减25', icon: 'temple' },
  { id: 'changchun', name: '长春', x: 844, y: 239, landmark: '净月潭', landmarkDesc: '北国春城', couponDesc: '东北菜满60减12', icon: 'mountain' },
  { id: 'harbin', name: '哈尔滨', x: 863, y: 194, landmark: '圣索菲亚', landmarkDesc: '冰雪之城', couponDesc: '中央大街商户券', icon: 'church' },
  { id: 'shanghai', name: '上海', x: 782, y: 538, landmark: '东方明珠', landmarkDesc: '上海地标', couponDesc: '外滩餐饮满100减20', icon: 'tower' },
  { id: 'nanjing', name: '南京', x: 738, y: 517, landmark: '中山陵', landmarkDesc: '博爱之都', couponDesc: '秦淮小吃券', icon: 'gate' },
  { id: 'hangzhou', name: '杭州', x: 761, y: 560, landmark: '西湖', landmarkDesc: '人间天堂美景', couponDesc: '西湖景区消费券10元', icon: 'pagoda' },
  { id: 'fuzhou', name: '福州', x: 747, y: 659, landmark: '三坊七巷', landmarkDesc: '有福之州', couponDesc: '闽菜满80减15', icon: 'gate' },
  { id: 'jinan', name: '济南', x: 709, y: 409, landmark: '趵突泉', landmarkDesc: '泉城济南', couponDesc: '鲁菜满80减15', icon: 'pagoda' },
  { id: 'zhengzhou', name: '郑州', x: 655, y: 455, landmark: '二七塔', landmarkDesc: '中原枢纽', couponDesc: '烩面专享券', icon: 'tower' },
  { id: 'wuhan', name: '武汉', x: 666, y: 553, landmark: '黄鹤楼', landmarkDesc: '天下江山第一楼', couponDesc: '热干面套餐券', icon: 'tower' },
  { id: 'changsha', name: '长沙', x: 644, y: 608, landmark: '岳麓书院', landmarkDesc: '橘子洲头', couponDesc: '湘菜满80减18', icon: 'pagoda' },
  { id: 'guangzhou', name: '广州', x: 650, y: 729, landmark: '广州塔', landmarkDesc: '小蛮腰', couponDesc: '粤式茶点满60减15', icon: 'tower' },
  { id: 'nanning', name: '南宁', x: 571, y: 736, landmark: '青秀山', landmarkDesc: '绿城南宁', couponDesc: '广西米粉满50减10', icon: 'mountain' },
  { id: 'haikou', name: '海口', x: 602, y: 802, landmark: '骑楼老街', landmarkDesc: '椰城风情', couponDesc: '海南特产满50减10', icon: 'palm' },
  { id: 'chengdu', name: '成都', x: 501, y: 550, landmark: '大熊猫基地', landmarkDesc: '国宝之乡', couponDesc: '火锅抵扣券20元', icon: 'panda' },
  { id: 'guiyang', name: '贵阳', x: 542, y: 646, landmark: '甲秀楼', landmarkDesc: '林城贵阳', couponDesc: '酸汤鱼满60减12', icon: 'pagoda' },
  { id: 'kunming', name: '昆明', x: 479, y: 684, landmark: '石林', landmarkDesc: '春城', couponDesc: '云南米线券', icon: 'mountain' },
  { id: 'lhasa', name: '拉萨', x: 292, y: 575, landmark: '布达拉宫', landmarkDesc: '雪域圣殿', couponDesc: '藏餐满80减15', icon: 'temple' },
  { id: 'xian', name: '西安', x: 580, y: 466, landmark: '大雁塔', landmarkDesc: '古都地标', couponDesc: '陕西美食满80减18', icon: 'pagoda' },
  { id: 'lanzhou', name: '兰州', x: 497, y: 423, landmark: '黄河铁桥', landmarkDesc: '黄河之都', couponDesc: '牛肉面专享券', icon: 'bridge' },
  { id: 'xining', name: '西宁', x: 464, y: 410, landmark: '塔尔寺', landmarkDesc: '高原夏都', couponDesc: '青海美食券', icon: 'temple' },
  { id: 'yinchuan', name: '银川', x: 537, y: 367, landmark: '鼓楼', landmarkDesc: '塞上江南', couponDesc: '宁夏羊肉券', icon: 'pagoda' },
  { id: 'urumqi', name: '乌鲁木齐', x: 236, y: 240, landmark: '红山', landmarkDesc: '西域风情', couponDesc: '新疆美食券', icon: 'mountain' }
];

// 环游中国：单向链式路线，每城市仅有一前一后，形成闭环
const ROUTES = [
  { from: 'beijing', to: 'shijiazhuang', distance: 280 },
  { from: 'shijiazhuang', to: 'taiyuan', distance: 220 },
  { from: 'taiyuan', to: 'hohhot', distance: 470 },
  { from: 'hohhot', to: 'shenyang', distance: 780 },
  { from: 'shenyang', to: 'changchun', distance: 310 },
  { from: 'changchun', to: 'harbin', distance: 280 },
  { from: 'harbin', to: 'jinan', distance: 1500 },
  { from: 'jinan', to: 'zhengzhou', distance: 510 },
  { from: 'zhengzhou', to: 'xian', distance: 510 },
  { from: 'xian', to: 'lanzhou', distance: 630 },
  { from: 'lanzhou', to: 'xining', distance: 220 },
  { from: 'xining', to: 'yinchuan', distance: 580 },
  { from: 'yinchuan', to: 'urumqi', distance: 1900 },
  { from: 'urumqi', to: 'lhasa', distance: 2500 },
  { from: 'lhasa', to: 'chengdu', distance: 2000 },
  { from: 'chengdu', to: 'guiyang', distance: 690 },
  { from: 'guiyang', to: 'kunming', distance: 520 },
  { from: 'kunming', to: 'nanning', distance: 830 },
  { from: 'nanning', to: 'haikou', distance: 550 },
  { from: 'haikou', to: 'guangzhou', distance: 550 },
  { from: 'guangzhou', to: 'changsha', distance: 660 },
  { from: 'changsha', to: 'wuhan', distance: 350 },
  { from: 'wuhan', to: 'nanjing', distance: 500 },
  { from: 'nanjing', to: 'shanghai', distance: 300 },
  { from: 'shanghai', to: 'hangzhou', distance: 180 },
  { from: 'hangzhou', to: 'fuzhou', distance: 680 },
  { from: 'fuzhou', to: 'beijing', distance: 1700 }
];

// 单次出发消耗电量
const FUEL_PER_TRIP = 10;
// 充电增加量
const CHARGE_AMOUNT = 20;
// 初始电量 / 最大电量
const INITIAL_FUEL = 100;
const MAX_FUEL = 100;
