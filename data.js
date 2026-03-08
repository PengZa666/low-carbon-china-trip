// CHINA_OUTLINE_PATH 来自 china_outline.js（与省界同源 DataV GeoAtlas，确保对齐）

// 城市配置：id, 名称, 坐标(x,y), 地标, 地标描述, 纪念品描述, icon
// 坐标由经纬度投影计算：x=(lon-73)/62*1000, y=(54-lat)/36*850，与地图同系
const CITIES = [
  { id: 'beijing', name: '北京', x: 700, y: 333, landmark: '天坛', landmarkDesc: '北京地标 · 祈年殿', couponDesc: '天坛文创满50减10', icon: 'temple' },
  { id: 'shijiazhuang', name: '石家庄', x: 670, y: 376, landmark: '艺术中心', landmarkDesc: '燕赵古都', couponDesc: '正定古城商户券', icon: 'art' },
  { id: 'taiyuan', name: '太原', x: 638, y: 381, landmark: '晋祠', landmarkDesc: '龙城晋韵', couponDesc: '山西面食满60减12', icon: 'antique' },
  { id: 'hohhot', name: '呼和浩特', x: 625, y: 311, landmark: '大召寺', landmarkDesc: '草原青城', couponDesc: '蒙餐满80减18', icon: 'grassland' },
  { id: 'shenyang', name: '沈阳', x: 813, y: 288, landmark: '故宫', landmarkDesc: '盛京故宫', couponDesc: '东北菜满100减25', icon: 'palace' },
  { id: 'changchun', name: '长春', x: 844, y: 239, landmark: '净月潭', landmarkDesc: '北国春城', couponDesc: '东北菜满60减12', icon: 'lake' },
  { id: 'harbin', name: '哈尔滨', x: 863, y: 194, landmark: '圣索菲亚', landmarkDesc: '冰雪之城', couponDesc: '中央大街商户券', icon: 'church' },
  { id: 'shanghai', name: '上海', x: 782, y: 538, landmark: '东方明珠', landmarkDesc: '上海地标', couponDesc: '外滩餐饮满100减20', icon: 'tower' },
  { id: 'nanjing', name: '南京', x: 738, y: 517, landmark: '中山陵', landmarkDesc: '博爱之都', couponDesc: '秦淮小吃券', icon: 'gate' },
  { id: 'hangzhou', name: '杭州', x: 761, y: 560, landmark: '西湖', landmarkDesc: '人间天堂美景', couponDesc: '西湖景区消费券10元', icon: 'lotus' },
  { id: 'fuzhou', name: '福州', x: 747, y: 659, landmark: '三坊七巷', landmarkDesc: '有福之州', couponDesc: '闽菜满80减15', icon: 'street' },
  { id: 'jinan', name: '济南', x: 709, y: 409, landmark: '趵突泉', landmarkDesc: '泉城济南', couponDesc: '鲁菜满80减15', icon: 'fountain' },
  { id: 'zhengzhou', name: '郑州', x: 655, y: 455, landmark: '二七塔', landmarkDesc: '中原枢纽', couponDesc: '烩面专享券', icon: 'monument' },
  { id: 'wuhan', name: '武汉', x: 666, y: 553, landmark: '黄鹤楼', landmarkDesc: '天下江山第一楼', couponDesc: '热干面套餐券', icon: 'crane' },
  { id: 'changsha', name: '长沙', x: 644, y: 608, landmark: '岳麓书院', landmarkDesc: '橘子洲头', couponDesc: '湘菜满80减18', icon: 'book' },
  { id: 'guangzhou', name: '广州', x: 650, y: 729, landmark: '广州塔', landmarkDesc: '小蛮腰', couponDesc: '粤式茶点满60减15', icon: 'skyline' },
  { id: 'nanning', name: '南宁', x: 571, y: 736, landmark: '青秀山', landmarkDesc: '绿城南宁', couponDesc: '广西米粉满50减10', icon: 'mountain' },
  { id: 'haikou', name: '海口', x: 602, y: 802, landmark: '骑楼老街', landmarkDesc: '椰城风情', couponDesc: '海南特产满50减10', icon: 'palm' },
  { id: 'chengdu', name: '成都', x: 501, y: 550, landmark: '大熊猫基地', landmarkDesc: '国宝之乡', couponDesc: '火锅抵扣券20元', icon: 'panda' },
  { id: 'guiyang', name: '贵阳', x: 542, y: 646, landmark: '甲秀楼', landmarkDesc: '林城贵阳', couponDesc: '酸汤鱼满60减12', icon: 'lantern' },
  { id: 'kunming', name: '昆明', x: 479, y: 684, landmark: '石林', landmarkDesc: '春城', couponDesc: '云南米线券', icon: 'stone' },
  { id: 'lhasa', name: '拉萨', x: 292, y: 575, landmark: '布达拉宫', landmarkDesc: '雪域圣殿', couponDesc: '藏餐满80减15', icon: 'castle' },
  { id: 'xian', name: '西安', x: 580, y: 466, landmark: '大雁塔', landmarkDesc: '古都地标', couponDesc: '陕西美食满80减18', icon: 'pagoda' },
  { id: 'lanzhou', name: '兰州', x: 497, y: 423, landmark: '黄河铁桥', landmarkDesc: '黄河之都', couponDesc: '牛肉面专享券', icon: 'bridge' },
  { id: 'xining', name: '西宁', x: 464, y: 410, landmark: '塔尔寺', landmarkDesc: '高原夏都', couponDesc: '青海美食券', icon: 'wheel' },
  { id: 'yinchuan', name: '银川', x: 537, y: 367, landmark: '鼓楼', landmarkDesc: '塞上江南', couponDesc: '宁夏羊肉券', icon: 'drum' },
  { id: 'urumqi', name: '乌鲁木齐', x: 236, y: 240, landmark: '红山', landmarkDesc: '西域风情', couponDesc: '新疆美食券', icon: 'desert' }
];

// 环游中国：最短路径闭环（TSP 近似优化）
const ROUTES = [
  { from: 'beijing', to: 'hohhot', distance: 352 },
  { from: 'hohhot', to: 'shijiazhuang', distance: 356 },
  { from: 'shijiazhuang', to: 'taiyuan', distance: 146 },
  { from: 'taiyuan', to: 'xian', distance: 463 },
  { from: 'xian', to: 'yinchuan', distance: 486 },
  { from: 'yinchuan', to: 'lanzhou', distance: 310 },
  { from: 'lanzhou', to: 'xining', distance: 160 },
  { from: 'xining', to: 'urumqi', distance: 1280 },
  { from: 'urumqi', to: 'lhasa', distance: 1528 },
  { from: 'lhasa', to: 'chengdu', distance: 947 },
  { from: 'chengdu', to: 'kunming', distance: 611 },
  { from: 'kunming', to: 'nanning', distance: 476 },
  { from: 'nanning', to: 'haikou', distance: 328 },
  { from: 'haikou', to: 'guangzhou', distance: 393 },
  { from: 'guangzhou', to: 'fuzhou', distance: 538 },
  { from: 'fuzhou', to: 'guiyang', distance: 924 },
  { from: 'guiyang', to: 'changsha', distance: 490 },
  { from: 'changsha', to: 'wuhan', distance: 267 },
  { from: 'wuhan', to: 'hangzhou', distance: 429 },
  { from: 'hangzhou', to: 'shanghai', distance: 137 },
  { from: 'shanghai', to: 'nanjing', distance: 219 },
  { from: 'nanjing', to: 'zhengzhou', distance: 466 },
  { from: 'zhengzhou', to: 'jinan', distance: 319 },
  { from: 'jinan', to: 'shenyang', distance: 718 },
  { from: 'shenyang', to: 'changchun', distance: 261 },
  { from: 'changchun', to: 'harbin', distance: 220 },
  { from: 'harbin', to: 'beijing', distance: 964 }
];

// 单次出发消耗电量
const FUEL_PER_TRIP = 10;
// 充电增加量
const CHARGE_AMOUNT = 20;
// 初始电量 / 最大电量
const INITIAL_FUEL = 100;
const MAX_FUEL = 100;
