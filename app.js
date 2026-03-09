(function () {
  'use strict';

  const FUEL_PER_TRIP = 10;
  const INITIAL_FUEL = 100;
  const MAX_FUEL = 100;
  const TOTAL_ENERGY_INIT = 750;

  function pickRandomCoupon() {
    const list = typeof MEITUAN_RIDING_COUPONS !== 'undefined' ? MEITUAN_RIDING_COUPONS : [];
    if (list.length === 0) return { id: 'default', title: '骑行券', desc: '美团骑行优惠', icon: 'bike' };
    return list[Math.floor(Math.random() * list.length)];
  }

  let state = {
    fuel: INITIAL_FUEL,
    totalEnergy: TOTAL_ENERGY_INIT,
    currentCityId: 'beijing',
    unlockedIds: new Set(['beijing']),
    rewardClaimed: new Map([['beijing', pickRandomCoupon()]]),
    isMoving: false,
    welcomeModalPending: null,
    allMapRewardClaimed: false
  };

  const cityById = {};
  CITIES.forEach(c => { cityById[c.id] = c; });

  const AUTO_SAVE_KEY = 'lowCarbon_autoSaveReward';

  function getAutoSaveRewardPreference() {
    try {
      return localStorage.getItem(AUTO_SAVE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setAutoSaveRewardPreference(checked) {
    try {
      localStorage.setItem(AUTO_SAVE_KEY, checked ? '1' : '0');
    } catch (e) {}
  }

  // 单向链：仅返回当前城市的下一个目的地
  function getNextCityOptions() {
    return ROUTES.filter(r => r.from === state.currentCityId);
  }

  function getRouteDistance(fromId, toId) {
    const r = ROUTES.find(x => (x.from === fromId && x.to === toId) || (x.from === toId && x.to === fromId));
    return r ? r.distance : 0;
  }

  function renderChinaOutline() {
    const el = document.getElementById('chinaOutline');
    if (el && typeof CHINA_OUTLINE_PATH !== 'undefined') el.setAttribute('d', CHINA_OUTLINE_PATH);
  }

  function renderProvinceBoundaries() {
    const g = document.getElementById('provinceBoundariesLayer');
    if (!g || typeof CHINA_PROVINCE_PATHS === 'undefined') return;
    g.innerHTML = '';
    CHINA_PROVINCE_PATHS.forEach(item => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', item.path);
      path.setAttribute('class', 'province-boundary');
      g.appendChild(path);
    });
  }

  function renderProvinceFills() {
    const g = document.getElementById('provinceFillLayer');
    if (!g || typeof CHINA_PROVINCE_PATHS === 'undefined') return;
    const highlightedAdcodes = new Set();
    CITIES.forEach(c => {
      if (c.provinceAdcode && state.unlockedIds.has(c.id)) highlightedAdcodes.add(c.provinceAdcode);
    });
    g.innerHTML = '';
    CHINA_PROVINCE_PATHS.forEach(item => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', item.path);
      path.setAttribute('class', 'province-fill' + (highlightedAdcodes.has(item.adcode) ? ' province-highlighted' : ''));
      g.appendChild(path);
    });
  }

  function renderRoutes() {
    const g = document.getElementById('routesLayer');
    if (!g) return;
    g.innerHTML = '';
    ROUTES.forEach(route => {
      const from = cityById[route.from];
      const to = cityById[route.to];
      if (!from || !to) return;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      line.setAttribute('d', `M ${from.x} ${from.y} Q ${midX} ${midY} ${to.x} ${to.y}`);
      line.setAttribute('class', 'route-line');
      g.appendChild(line);
    });
  }

  function renderNodes() {
    const g = document.getElementById('nodesLayer');
    if (!g) return;
    g.innerHTML = '';
    CITIES.forEach(city => {
      const gNode = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      gNode.setAttribute('class', 'city-node-wrap');
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', city.x);
      circle.setAttribute('cy', city.y);
      circle.setAttribute('r', 8);
      circle.setAttribute('class', 'city-node ' + (state.unlockedIds.has(city.id) ? 'unlocked' : 'locked'));
      gNode.appendChild(circle);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x);
      label.setAttribute('y', city.y + 22);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('class', 'node-label');
      label.textContent = city.name;
      gNode.appendChild(label);
      g.appendChild(gNode);
    });
  }

  function updateAvatarPosition(x, y) {
    const avatar = document.getElementById('avatar');
    const layer = document.getElementById('avatarLayer');
    if (!avatar || !layer) return;
    layer.setAttribute('transform', `translate(${x}, ${y})`);
  }

  function setAvatarAtCurrentCity() {
    const city = cityById[state.currentCityId];
    if (city) updateAvatarPosition(city.x, city.y);
  }

  function animateAvatarToCity(toCityId, onComplete) {
    const from = cityById[state.currentCityId];
    const to = cityById[toCityId];
    if (!from || !to) {
    if (onComplete) onComplete();
    return;
    }
    const avatar = document.getElementById('avatar');
    if (avatar) avatar.classList.add('riding');
    state.isMoving = true;

    const duration = 1800;
    const startTime = performance.now();
    function tick(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const x = from.x + (to.x - from.x) * ease;
      const y = from.y + (to.y - from.y) * ease;
      updateAvatarPosition(x, y);
      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        if (avatar) avatar.classList.remove('riding');
        state.currentCityId = toCityId;
        const wasNew = !state.unlockedIds.has(toCityId);
        state.unlockedIds.add(toCityId);
        state.isMoving = false;
        if (onComplete) onComplete(wasNew);
      }
    }
    requestAnimationFrame(tick);
  }

  function triggerNodeUnlockEffect(cityId) {
    const g = document.getElementById('nodesLayer');
    if (!g) return;
    const idx = CITIES.findIndex(c => c.id === cityId);
    if (idx < 0) return;
    const wrap = g.querySelectorAll('.city-node-wrap')[idx];
    if (!wrap) return;
    const circle = wrap.querySelector('.city-node');
    if (circle) {
      circle.classList.add('just-unlocked');
      setTimeout(() => circle.classList.remove('just-unlocked'), 600);
    }
  }

  function updateUI() {
    const fill = document.getElementById('energyFill');
    const value = document.getElementById('energyValue');
    const count = document.getElementById('unlockedCount');
    if (fill) fill.style.maxWidth = (state.fuel / MAX_FUEL * 100) + '%';
    if (value) value.textContent = state.fuel + '/' + MAX_FUEL;
    if (count) count.textContent = '已解锁城市: ' + state.unlockedIds.size + '/' + CITIES.length;

    const walletCount = document.getElementById('walletCount');
    if (walletCount) walletCount.textContent = state.rewardClaimed.size;

    const cityCardsCount = document.getElementById('cityCardsCount');
    if (cityCardsCount) cityCardsCount.textContent = state.unlockedIds.size;

    const city = cityById[state.currentCityId];
    if (city) {
      const nameEl = document.getElementById('landmarkName');
      const descEl = document.getElementById('landmarkDesc');
      const iconEl = document.getElementById('landmarkIcon');
      if (nameEl) nameEl.textContent = city.landmark;
      if (descEl) descEl.textContent = city.landmarkDesc;
      if (iconEl) {
        iconEl.textContent = getLandmarkEmoji(city.icon);
        iconEl.title = city.landmark;
      }
    }

    const rewardCity = document.getElementById('rewardCityName');
    if (rewardCity) rewardCity.textContent = city ? city.name : '';
    const checkEl = document.getElementById('rewardCheck');
    if (checkEl) {
      checkEl.style.display = state.rewardClaimed.has(state.currentCityId) ? 'inline-flex' : 'none';
    }

    const chargeBtn = document.getElementById('btnCharge');
    if (chargeBtn) chargeBtn.disabled = state.fuel >= MAX_FUEL;

    const btn = document.getElementById('btnDepart');
    const costEl = document.getElementById('departCost');
    if (btn) {
      const options = getNextCityOptions();
      const canGo = !state.isMoving && state.fuel >= FUEL_PER_TRIP && options.length > 0;
      btn.disabled = !canGo;
    }
    if (costEl) costEl.textContent = '(-' + FUEL_PER_TRIP + '电量)';

    renderNodes();
    renderProvinceFills();
    setAvatarAtCurrentCity();
  }

  function getLandmarkEmoji(icon) {
    const map = {
      temple: '🏯', tower: '🗼', pagoda: '⛩️', panda: '🐼', church: '⛪', mountain: '⛰️', palm: '🌴', gate: '🚪', bridge: '🌉',
      art: '🎨', antique: '🏺', grassland: '🌾', palace: '🏛️', lake: '🌊', lotus: '🪷', street: '🏘️', fountain: '⛲',
      monument: '🗿', crane: '🦅', book: '📚', skyline: '🌃', lantern: '🏮', stone: '🪨', castle: '🏰', wheel: '☸️', drum: '🥁', desert: '🏜️',
      pavilion: '🏛️', building: '🏢', garden: '🌳'
    };
    return map[icon] || '📍';
  }

  function showWelcomeModal(cityId, distance) {
    const city = cityById[cityId];
    if (!city) return;
    state.welcomeModalPending = { cityId, distance };
    const modal = document.getElementById('welcomeModal');
    const nameEl = document.getElementById('modalCityName');
    const distEl = document.getElementById('modalDistance');
    if (nameEl) nameEl.textContent = city.name;
    if (distEl) distEl.textContent = distance;
    if (modal) modal.classList.remove('hidden');
  }

  function hideWelcomeModal(skipGrandPrizeCheck) {
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.classList.add('hidden');
    state.welcomeModalPending = null;
    if (!skipGrandPrizeCheck) checkAndShowGrandPrize();
  }

  function getCouponEmoji(icon) {
    if (icon === 'bike') return '🚴';
    if (icon === 'monthly') return '👑';
    return '🎫';
  }

  function showCouponModal(coupon, count) {
    if (!coupon) return;
    if (typeof count !== 'number') count = 1;
    const modal = document.getElementById('couponModal');
    const nameEl = document.getElementById('couponCityName');
    const descEl = document.getElementById('couponDesc');
    const landmarkEl = document.getElementById('couponLandmark');
    const tipEl = document.getElementById('couponTip');
    const iconEl = document.getElementById('couponIcon');
    const chk = document.getElementById('chkAutoSaveReward');
    if (nameEl) nameEl.textContent = count > 1 ? coupon.title + ' ×' + count : coupon.title;
    if (descEl) descEl.textContent = coupon.desc;
    if (landmarkEl) {
      if (count > 1) {
        landmarkEl.textContent = '共' + count + '张，多城市通用';
        landmarkEl.style.display = '';
      } else {
        landmarkEl.textContent = '';
        landmarkEl.style.display = 'none';
      }
    }
    if (tipEl) tipEl.textContent = '可在美团骑行APP内使用';
    if (iconEl) iconEl.textContent = getCouponEmoji(coupon.icon);
    if (chk) chk.checked = getAutoSaveRewardPreference();
    if (modal) modal.classList.remove('hidden');
  }

  function hideCouponModal() {
    const modal = document.getElementById('couponModal');
    if (modal) modal.classList.add('hidden');
  }

  function showWalletModal() {
    const modal = document.getElementById('walletModal');
    const list = document.getElementById('walletList');
    if (!modal || !list) return;
    list.innerHTML = '';
    const entries = Array.from(state.rewardClaimed.entries());
    if (entries.length === 0) {
      list.innerHTML = '<div class="wallet-empty"><div class="wallet-empty-icon">🎫</div><p>暂无优惠券<br>骑行到达新城市并领取即可随机获得美团骑行券</p></div>';
    } else {
      const grouped = {};
      entries.forEach(([cityId, coupon]) => {
        if (!coupon) return;
        const key = coupon.id || (coupon.title + coupon.desc);
        if (!grouped[key]) grouped[key] = { coupon, count: 0 };
        grouped[key].count += 1;
      });
      Object.values(grouped).forEach(({ coupon, count }) => {
        const card = document.createElement('div');
        card.className = 'wallet-card';
        card.innerHTML = '<div class="wallet-card-icon">' + getCouponEmoji(coupon.icon) + '</div>' +
          '<div class="wallet-card-body"><div class="wallet-card-city">' + coupon.title + (count > 1 ? ' ×' + count : '') + '</div>' +
          '<div class="wallet-card-desc">' + coupon.desc + '</div></div>';
        card.addEventListener('click', () => {
          hideWalletModal();
          showCouponModal(coupon, count);
        });
        list.appendChild(card);
      });
    }
    modal.classList.remove('hidden');
  }

  function hideWalletModal() {
    const modal = document.getElementById('walletModal');
    if (modal) modal.classList.add('hidden');
  }

  function showCityCardsModal() {
    const modal = document.getElementById('cityCardsModal');
    const list = document.getElementById('cityCardsList');
    if (!modal || !list) return;
    list.innerHTML = '';
    const unlocked = Array.from(state.unlockedIds).map(id => cityById[id]).filter(Boolean);
    if (unlocked.length === 0) {
      list.innerHTML = '<div class="city-cards-empty"><div class="city-cards-empty-icon">📍</div><p>暂无打卡城市<br>点击「立即出发」骑行解锁新城市</p></div>';
    } else {
      unlocked.forEach(city => {
        const item = document.createElement('div');
        item.className = 'city-card-item';
        item.innerHTML = '<div class="city-card-icon">' + getLandmarkEmoji(city.icon) + '</div>' +
          '<div class="city-card-body"><div class="city-card-name">' + city.name + '</div>' +
          '<div class="city-card-landmark">' + city.landmark + ' · ' + city.landmarkDesc + '</div></div>';
        list.appendChild(item);
      });
    }
    modal.classList.remove('hidden');
  }

  function hideCityCardsModal() {
    const modal = document.getElementById('cityCardsModal');
    if (modal) modal.classList.add('hidden');
  }

  function checkAndShowGrandPrize() {
    if (state.unlockedIds.size !== CITIES.length || state.allMapRewardClaimed) return;
    const grandPrize = typeof GRAND_PRIZE_COUPON !== 'undefined' ? GRAND_PRIZE_COUPON : null;
    if (!grandPrize) return;
    setTimeout(showGrandPrizeModal, 300);
  }

  function showGrandPrizeModal() {
    const modal = document.getElementById('grandPrizeModal');
    const giftBox = document.getElementById('giftBox');
    const giftOpened = document.getElementById('giftOpened');
    const btnAdd = document.getElementById('btnAddToWallet');
    if (!modal || !giftBox || !giftOpened || !btnAdd) return;
    giftBox.classList.remove('opened');
    giftBox.classList.remove('hidden');
    giftOpened.classList.add('hidden');
    modal.classList.remove('hidden');

    function onGiftClick() {
      giftBox.classList.add('opened');
      giftBox.style.cursor = 'default';
      giftBox.onclick = null;
      setTimeout(() => {
        giftBox.classList.add('hidden');
        giftBox.style.display = 'none';
        giftOpened.classList.remove('hidden');
        giftOpened.style.display = 'block';
      }, 450);
    }

    function onAddToWallet() {
      const coupon = typeof GRAND_PRIZE_COUPON !== 'undefined' ? GRAND_PRIZE_COUPON : null;
      if (coupon) {
        state.rewardClaimed.set('grand_prize', coupon);
        state.allMapRewardClaimed = true;
      }
      modal.classList.add('hidden');
      giftBox.classList.remove('opened', 'hidden');
      giftBox.style.display = '';
      giftBox.style.cursor = 'pointer';
      giftBox.onclick = onGiftClick;
      updateUI();
    }

    giftBox.onclick = onGiftClick;
    btnAdd.onclick = onAddToWallet;
  }

  function claimReward() {
    if (!state.welcomeModalPending) return;
    const { cityId } = state.welcomeModalPending;
    hideWelcomeModal(true);
    const coupon = pickRandomCoupon();
    state.rewardClaimed.set(cityId, coupon);
    state.totalEnergy += 50;
    if (getAutoSaveRewardPreference()) {
      updateUI();
      checkAndShowGrandPrize();
    } else {
      showCouponModal(coupon, 1);
      updateUI();
    }
  }

  function depart() {
    const options = getNextCityOptions();
    if (state.isMoving || state.fuel < FUEL_PER_TRIP || options.length === 0) return;
    const chosen = options[0];
    const nextId = chosen.from === state.currentCityId ? chosen.to : chosen.from;
    const distance = chosen.distance;

    state.fuel -= FUEL_PER_TRIP;
    state.totalEnergy += 30;
    updateUI();

    animateAvatarToCity(nextId, (wasNew) => {
      updateUI();
      if (wasNew) {
        requestAnimationFrame(() => {
          triggerNodeUnlockEffect(nextId);
          requestAnimationFrame(() => {
            showWelcomeModal(nextId, distance);
          });
        });
      }
    });
  }

  function charge() {
    if (state.fuel >= MAX_FUEL) return;
    const amt = typeof CHARGE_AMOUNT !== 'undefined' ? CHARGE_AMOUNT : 20;
    state.fuel = Math.min(MAX_FUEL, state.fuel + amt);
    state.totalEnergy += 15;
    updateUI();
  }

  function bindEvents() {
    document.getElementById('btnDepart').addEventListener('click', depart);
    document.getElementById('btnCharge').addEventListener('click', charge);
    document.getElementById('btnCityCards').addEventListener('click', showCityCardsModal);
    document.getElementById('btnCloseCityCards').addEventListener('click', hideCityCardsModal);
    document.getElementById('btnWallet').addEventListener('click', showWalletModal);
    document.getElementById('btnCloseWallet').addEventListener('click', hideWalletModal);
    document.getElementById('btnClaimReward').addEventListener('click', claimReward);
    document.getElementById('btnCloseModal').addEventListener('click', hideWelcomeModal);
    document.getElementById('btnCloseCoupon').addEventListener('click', () => {
      const chk = document.getElementById('chkAutoSaveReward');
      if (chk && chk.checked) setAutoSaveRewardPreference(true);
      hideCouponModal();
      checkAndShowGrandPrize();
      updateUI();
    });
  }

  function init() {
    renderChinaOutline();
    renderProvinceBoundaries();
    renderProvinceFills();
    renderRoutes();
    renderNodes();
    setAvatarAtCurrentCity();
    updateUI();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
