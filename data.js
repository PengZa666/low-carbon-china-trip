// CHINA_OUTLINE_PATH 来自 china_outline.js（与省界同源 DataV GeoAtlas，确保对齐）

// 城市配置：id, 名称, 坐标(x,y), 地标, 地标描述, 纪念品描述, icon, provinceAdcode
// 坐标由经纬度投影计算：x=(lon-73)/62*1000, y=(54-lat)/36*850，与地图同系
const CITIES = [
  { id: 'beijing', name: '北京', x: 700, y: 333, landmark: '天坛', landmarkDesc: '北京地标 · 祈年殿', couponDesc: '天坛文创满50减10', icon: 'temple', provinceAdcode: 110000 },
  { id: 'tianjin', name: '天津', x: 718, y: 345, landmark: '天津之眼', landmarkDesc: '永乐桥摩天轮', couponDesc: '天津狗不理包子券', icon: 'bridge', provinceAdcode: 120000 },
  { id: 'shijiazhuang', name: '石家庄', x: 670, y: 376, landmark: '艺术中心', landmarkDesc: '燕赵古都', couponDesc: '正定古城商户券', icon: 'art', provinceAdcode: 130000 },
  { id: 'taiyuan', name: '太原', x: 638, y: 381, landmark: '晋祠', landmarkDesc: '龙城晋韵', couponDesc: '山西面食满60减12', icon: 'antique', provinceAdcode: 140000 },
  { id: 'hohhot', name: '呼和浩特', x: 625, y: 311, landmark: '大召寺', landmarkDesc: '草原青城', couponDesc: '蒙餐满80减18', icon: 'grassland', provinceAdcode: 150000 },
  { id: 'shenyang', name: '沈阳', x: 813, y: 288, landmark: '故宫', landmarkDesc: '盛京故宫', couponDesc: '东北菜满100减25', icon: 'palace', provinceAdcode: 210000 },
  { id: 'changchun', name: '长春', x: 844, y: 239, landmark: '净月潭', landmarkDesc: '北国春城', couponDesc: '东北菜满60减12', icon: 'lake', provinceAdcode: 220000 },
  { id: 'harbin', name: '哈尔滨', x: 863, y: 194, landmark: '圣索菲亚', landmarkDesc: '冰雪之城', couponDesc: '中央大街商户券', icon: 'church', provinceAdcode: 230000 },
  { id: 'shanghai', name: '上海', x: 782, y: 538, landmark: '东方明珠', landmarkDesc: '上海地标', couponDesc: '外滩餐饮满100减20', icon: 'tower', provinceAdcode: 310000 },
  { id: 'nanjing', name: '南京', x: 738, y: 517, landmark: '中山陵', landmarkDesc: '博爱之都', couponDesc: '秦淮小吃券', icon: 'gate', provinceAdcode: 320000 },
  { id: 'hangzhou', name: '杭州', x: 761, y: 560, landmark: '西湖', landmarkDesc: '人间天堂美景', couponDesc: '西湖景区消费券10元', icon: 'lotus', provinceAdcode: 330000 },
  { id: 'fuzhou', name: '福州', x: 747, y: 659, landmark: '三坊七巷', landmarkDesc: '有福之州', couponDesc: '闽菜满80减15', icon: 'street', provinceAdcode: 350000 },
  { id: 'jinan', name: '济南', x: 709, y: 409, landmark: '趵突泉', landmarkDesc: '泉城济南', couponDesc: '鲁菜满80减15', icon: 'fountain', provinceAdcode: 370000 },
  { id: 'zhengzhou', name: '郑州', x: 655, y: 455, landmark: '二七塔', landmarkDesc: '中原枢纽', couponDesc: '烩面专享券', icon: 'monument', provinceAdcode: 410000 },
  { id: 'wuhan', name: '武汉', x: 666, y: 553, landmark: '黄鹤楼', landmarkDesc: '天下江山第一楼', couponDesc: '热干面套餐券', icon: 'crane', provinceAdcode: 420000 },
  { id: 'changsha', name: '长沙', x: 644, y: 608, landmark: '岳麓书院', landmarkDesc: '橘子洲头', couponDesc: '湘菜满80减18', icon: 'book', provinceAdcode: 430000 },
  { id: 'guangzhou', name: '广州', x: 650, y: 729, landmark: '广州塔', landmarkDesc: '小蛮腰', couponDesc: '粤式茶点满60减15', icon: 'skyline', provinceAdcode: 440000 },
  { id: 'nanning', name: '南宁', x: 571, y: 736, landmark: '青秀山', landmarkDesc: '绿城南宁', couponDesc: '广西米粉满50减10', icon: 'mountain', provinceAdcode: 450000 },
  { id: 'haikou', name: '海口', x: 602, y: 802, landmark: '骑楼老街', landmarkDesc: '椰城风情', couponDesc: '海南特产满50减10', icon: 'palm', provinceAdcode: 460000 },
  { id: 'chengdu', name: '成都', x: 501, y: 550, landmark: '大熊猫基地', landmarkDesc: '国宝之乡', couponDesc: '火锅抵扣券20元', icon: 'panda', provinceAdcode: 510000 },
  { id: 'guiyang', name: '贵阳', x: 542, y: 646, landmark: '甲秀楼', landmarkDesc: '林城贵阳', couponDesc: '酸汤鱼满60减12', icon: 'lantern', provinceAdcode: 520000 },
  { id: 'kunming', name: '昆明', x: 479, y: 684, landmark: '石林', landmarkDesc: '春城', couponDesc: '云南米线券', icon: 'stone', provinceAdcode: 530000 },
  { id: 'lhasa', name: '拉萨', x: 292, y: 575, landmark: '布达拉宫', landmarkDesc: '雪域圣殿', couponDesc: '藏餐满80减15', icon: 'castle', provinceAdcode: 540000 },
  { id: 'xian', name: '西安', x: 580, y: 466, landmark: '大雁塔', landmarkDesc: '古都地标', couponDesc: '陕西美食满80减18', icon: 'pagoda', provinceAdcode: 610000 },
  { id: 'lanzhou', name: '兰州', x: 497, y: 423, landmark: '黄河铁桥', landmarkDesc: '黄河之都', couponDesc: '牛肉面专享券', icon: 'bridge', provinceAdcode: 620000 },
  { id: 'xining', name: '西宁', x: 464, y: 410, landmark: '塔尔寺', landmarkDesc: '高原夏都', couponDesc: '青海美食券', icon: 'wheel', provinceAdcode: 630000 },
  { id: 'yinchuan', name: '银川', x: 537, y: 367, landmark: '鼓楼', landmarkDesc: '塞上江南', couponDesc: '宁夏羊肉券', icon: 'drum', provinceAdcode: 640000 },
  { id: 'urumqi', name: '乌鲁木齐', x: 236, y: 240, landmark: '红山', landmarkDesc: '西域风情', couponDesc: '新疆美食券', icon: 'desert', provinceAdcode: 650000 },
  { id: 'nanchang', name: '南昌', x: 691, y: 598, landmark: '滕王阁', landmarkDesc: '豫章故郡', couponDesc: '赣菜满80减15', icon: 'pavilion', provinceAdcode: 360000 },
  { id: 'chongqing', name: '重庆', x: 541, y: 576, landmark: '洪崖洞', landmarkDesc: '山城魔幻', couponDesc: '火锅满100减20', icon: 'building', provinceAdcode: 500000 },
  { id: 'hefei', name: '合肥', x: 714, y: 523, landmark: '包公园', landmarkDesc: '包公故里', couponDesc: '巢湖银鱼券', icon: 'garden', provinceAdcode: 340000 }
];

// 环游中国：最短路径闭环（TSP 近似优化）
const ROUTES = [
  { from: 'beijing', to: 'tianjin', distance: 120 },
  { from: 'tianjin', to: 'hohhot', distance: 450 },
  { from: 'hohhot', to: 'shijiazhuang', distance: 356 },
  { from: 'shijiazhuang', to: 'taiyuan', distance: 146 },
  { from: 'taiyuan', to: 'xian', distance: 463 },
  { from: 'xian', to: 'yinchuan', distance: 486 },
  { from: 'yinchuan', to: 'lanzhou', distance: 310 },
  { from: 'lanzhou', to: 'xining', distance: 160 },
  { from: 'xining', to: 'urumqi', distance: 1280 },
  { from: 'urumqi', to: 'lhasa', distance: 1528 },
  { from: 'lhasa', to: 'chengdu', distance: 947 },
  { from: 'chengdu', to: 'chongqing', distance: 320 },
  { from: 'chongqing', to: 'kunming', distance: 880 },
  { from: 'kunming', to: 'nanning', distance: 476 },
  { from: 'nanning', to: 'haikou', distance: 328 },
  { from: 'haikou', to: 'guangzhou', distance: 393 },
  { from: 'guangzhou', to: 'fuzhou', distance: 538 },
  { from: 'fuzhou', to: 'guiyang', distance: 924 },
  { from: 'guiyang', to: 'changsha', distance: 490 },
  { from: 'changsha', to: 'wuhan', distance: 267 },
  { from: 'wuhan', to: 'nanchang', distance: 350 },
  { from: 'nanchang', to: 'hefei', distance: 400 },
  { from: 'hefei', to: 'hangzhou', distance: 450 },
  { from: 'hangzhou', to: 'shanghai', distance: 137 },
  { from: 'shanghai', to: 'nanjing', distance: 219 },
  { from: 'nanjing', to: 'zhengzhou', distance: 466 },
  { from: 'zhengzhou', to: 'jinan', distance: 319 },
  { from: 'jinan', to: 'shenyang', distance: 718 },
  { from: 'shenyang', to: 'changchun', distance: 261 },
  { from: 'changchun', to: 'harbin', distance: 220 },
  { from: 'harbin', to: 'beijing', distance: 964 }
];

// 美团骑行相关优惠券池（到达新城市随机获得其一）
const MEITUAN_RIDING_COUPONS = [
  { id: 'free30', title: '免费骑行券', desc: '首单免费骑30分钟', icon: 'bike' },
  { id: 'discount2', title: '骑行立减券', desc: '单次骑行立减2元', icon: 'bike' },
  { id: 'weekcard', title: '畅骑体验券', desc: '7天畅骑卡享5折优惠', icon: 'bike' },
  { id: 'lowcarbon', title: '低碳出行券', desc: '骑行满3次送1次免费骑', icon: 'bike' },
  { id: 'weekend', title: '周末畅骑券', desc: '周末骑行享5折', icon: 'bike' },
  { id: 'night', title: '夜间骑行券', desc: '22点后骑行减1元', icon: 'bike' },
  { id: 'longtrip', title: '长途骑行券', desc: '骑行超5公里减3元', icon: 'bike' },
  { id: 'invite', title: '邀友共骑券', desc: '邀请好友注册送双人免费骑', icon: 'bike' },
  { id: 'eco', title: '环保能量券', desc: '积累骑行里程兑换免费时长', icon: 'bike' }
];

// 单次出发消耗电量
const FUEL_PER_TRIP = 10;
// 充电增加量
const CHARGE_AMOUNT = 20;
// 初始电量 / 最大电量
const INITIAL_FUEL = 100;
const MAX_FUEL = 100;
