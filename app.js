(function () {
  'use strict';

  const FUEL_PER_TRIP = 10;
  const INITIAL_FUEL = 100;
  const MAX_FUEL = 100;
  const TOTAL_ENERGY_INIT = 750;

  let state = {
    fuel: INITIAL_FUEL,
    totalEnergy: TOTAL_ENERGY_INIT,
    currentCityId: 'beijing',
    unlockedIds: new Set(['beijing']),
    rewardClaimed: new Set(['beijing']),
    isMoving: false,
    welcomeModalPending: null
  };

  const cityById = {};
  CITIES.forEach(c => { cityById[c.id] = c; });

  function getNextCityOptions() {
    return ROUTES.filter(r => {
      const fromCurrent = r.from === state.currentCityId;
      const toCurrent = r.to === state.currentCityId;
      if (!fromCurrent && !toCurrent) return false;
      const nextId = fromCurrent ? r.to : r.from;
      return !state.unlockedIds.has(nextId);
    });
  }

  function getRouteDistance(fromId, toId) {
    const r = ROUTES.find(x => (x.from === fromId && x.to === toId) || (x.from === toId && x.to === fromId));
    return r ? r.distance : 0;
  }

  function renderChinaOutline() {
    const el = document.getElementById('chinaOutline');
    if (el && typeof CHINA_OUTLINE_PATH !== 'undefined') el.setAttribute('d', CHINA_OUTLINE_PATH);
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
      circle.setAttribute('r', 14);
      circle.setAttribute('class', 'city-node ' + (state.unlockedIds.has(city.id) ? 'unlocked' : 'locked'));
      gNode.appendChild(circle);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', city.x);
      label.setAttribute('y', city.y + 28);
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
        state.unlockedIds.add(toCityId);
        state.isMoving = false;
        if (onComplete) onComplete();
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
    const totalEl = document.getElementById('totalEnergy');
    if (fill) fill.style.maxWidth = (state.fuel / MAX_FUEL * 100) + '%';
    if (value) value.textContent = state.fuel + '/' + MAX_FUEL;
    if (count) count.textContent = '已解锁城市: ' + state.unlockedIds.size + '/' + CITIES.length;
    if (totalEl) totalEl.textContent = state.totalEnergy;

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
    setAvatarAtCurrentCity();
  }

  function getLandmarkEmoji(icon) {
    const map = { temple: '🏯', tower: '🗼', pagoda: '⛩️', panda: '🐼', church: '⛪', mountain: '⛰️', palm: '🌴', gate: '🚪', bridge: '🌉' };
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

  function hideWelcomeModal() {
    const modal = document.getElementById('welcomeModal');
    if (modal) modal.classList.add('hidden');
    state.welcomeModalPending = null;
  }

  function showCouponModal(cityId) {
    const city = cityById[cityId];
    if (!city) return;
    const modal = document.getElementById('couponModal');
    const nameEl = document.getElementById('couponCityName');
    const descEl = document.getElementById('couponDesc');
    const iconEl = document.getElementById('couponIcon');
    if (nameEl) nameEl.textContent = city.name;
    if (descEl) descEl.textContent = city.couponDesc;
    if (iconEl) iconEl.textContent = getLandmarkEmoji(city.icon);
    if (modal) modal.classList.remove('hidden');
  }

  function hideCouponModal() {
    const modal = document.getElementById('couponModal');
    if (modal) modal.classList.add('hidden');
  }

  function claimReward() {
    if (!state.welcomeModalPending) return;
    const { cityId } = state.welcomeModalPending;
    hideWelcomeModal();
    state.rewardClaimed.add(cityId);
    state.totalEnergy += 50;
    showCouponModal(cityId);
    updateUI();
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

    animateAvatarToCity(nextId, () => {
      updateUI();
      triggerNodeUnlockEffect(nextId);
      showWelcomeModal(nextId, distance);
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
    document.getElementById('btnClaimReward').addEventListener('click', claimReward);
    document.getElementById('btnCloseModal').addEventListener('click', hideWelcomeModal);
    document.getElementById('btnCloseCoupon').addEventListener('click', () => {
      hideCouponModal();
      updateUI();
    });
  }

  function init() {
    renderChinaOutline();
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
