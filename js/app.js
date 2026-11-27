(() => {
  const DATA = window.PAWVERSE_DATA;
  const { WorldEngine, drawPetCharacter, getCachedImage } = window.PawVerseWorld;
  const { MyRoomEngine } = window.PawVerseMyRoom;

  const state = DATA.loadState();
  let draftAvatar = { ...state.avatar };
  let activeShopCategory = 'all';
  let activeHeroVideoId = DATA.LIVE_VIDEOS[0].id;
  let selectedPostPhoto = DATA.PEXELS_PHOTOS.walkPark;

  // Record visit memory on boot (Pillar 3 AI Persona Memory)
  const prevVisitTs = state.memory.lastVisitTs || Date.now();
  const hoursAway = (Date.now() - prevVisitTs) / (1000 * 60 * 60);
  state.memory.visitCount = (state.memory.visitCount || 0) + 1;
  state.memory.lastVisitTs = Date.now();
  DATA.saveState(state);

  const el = {
    coinBalance: document.getElementById('coinBalance'),
    quickJumpBtn: document.getElementById('quickJumpBtn'),
    heroVideo: document.getElementById('heroVideo'),
    heroVideoMeta: document.getElementById('heroVideoMeta'),
    heroVideoTitle: document.getElementById('heroVideoTitle'),
    heroVideoDesc: document.getElementById('heroVideoDesc'),
    heroPlayToggle: document.getElementById('heroPlayToggle'),
    heroChannelBar: document.getElementById('heroChannelBar'),
    currentZoneTitle: document.getElementById('currentZoneTitle'),
    currentZoneDesc: document.getElementById('currentZoneDesc'),
    hudAvatarImg: document.getElementById('hudAvatarImg'),
    hudPetText: document.getElementById('hudPetText'),
    hudWalkMeter: document.getElementById('hudWalkMeter'),
    metaverseCanvas: document.getElementById('metaverseCanvas'),
    leashToggleBtn: document.getElementById('leashToggleBtn'),
    throwBallBtn: document.getElementById('throwBallBtn'),
    careFeedBtn: document.getElementById('careFeedBtn'),
    careBrushBtn: document.getElementById('careBrushBtn'),
    careBathBtn: document.getElementById('careBathBtn'),
    careCleanBtn: document.getElementById('careCleanBtn'),
    careNapBtn: document.getElementById('careNapBtn'),
    centerCameraBtn: document.getElementById('centerCameraBtn'),
    growthBadge: document.getElementById('growthBadge'),
    coatSheenText: document.getElementById('coatSheenText'),
    growthExpText: document.getElementById('growthExpText'),
    growthExpFill: document.getElementById('growthExpFill'),
    statList: document.getElementById('statList'),
    realStepsCount: document.getElementById('realStepsCount'),
    stepsPercentBadge: document.getElementById('stepsPercentBadge'),
    stepsProgressFill: document.getElementById('stepsProgressFill'),
    syncStepsBtn: document.getElementById('syncStepsBtn'),
    customStepsInput: document.getElementById('customStepsInput'),
    applyCustomStepsBtn: document.getElementById('applyCustomStepsBtn'),
    sensorStepsBtn: document.getElementById('sensorStepsBtn'),
    nearbyList: document.getElementById('nearbyList'),
    nearbyCount: document.getElementById('nearbyCount'),
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    chatInput: document.getElementById('chatInput'),
    obedienceBadge: document.getElementById('obedienceBadge'),
    voiceListenBtn: document.getElementById('voiceListenBtn'),
    commandForm: document.getElementById('commandForm'),
    commandInput: document.getElementById('commandInput'),
    voiceStatus: document.getElementById('voiceStatus'),
    skillGrid: document.getElementById('skillGrid'),
    visitStreakBadge: document.getElementById('visitStreakBadge'),
    personaGreeting: document.getElementById('personaGreeting'),
    personaTraits: document.getElementById('personaTraits'),
    memoryLog: document.getElementById('memoryLog'),
    myRoomCanvas: document.getElementById('myRoomCanvas'),
    roomThemeBar: document.getElementById('roomThemeBar'),
    roomItemList: document.getElementById('roomItemList'),
    spaceCapacityChip: document.getElementById('spaceCapacityChip'),
    captureSpaceBtn: document.getElementById('captureSpaceBtn'),
    aiInteriorForm: document.getElementById('aiInteriorForm'),
    aiInteriorInput: document.getElementById('aiInteriorInput'),
    aiDesignerReply: document.getElementById('aiDesignerReply'),
    roomWarmthSlider: document.getElementById('roomWarmthSlider'),
    toggleSpotlightBtn: document.getElementById('toggleSpotlightBtn'),
    toggleVideoWallBtn: document.getElementById('toggleVideoWallBtn'),
    uploadFramePhoto: document.getElementById('uploadFramePhoto'),
    switchWallVideoBtn: document.getElementById('switchWallVideoBtn'),
    invitePetRow: document.getElementById('invitePetRow'),
    selectedObjBar: document.getElementById('selectedObjBar'),
    selectedObjName: document.getElementById('selectedObjName'),
    deleteObjBtn: document.getElementById('deleteObjBtn'),
    videoGrid: document.getElementById('videoGrid'),
    zonesGrid: document.getElementById('zonesGrid'),
    previewCanvas: document.getElementById('previewCanvas'),
    previewName: document.getElementById('previewName'),
    previewPersonality: document.getElementById('previewPersonality'),
    previewTagBadge: document.getElementById('previewTagBadge'),
    petNameInput: document.getElementById('petNameInput'),
    petTagInput: document.getElementById('petTagInput'),
    speciesOptions: document.getElementById('speciesOptions'),
    photoPickerGrid: document.getElementById('photoPickerGrid'),
    colorSwatches: document.getElementById('colorSwatches'),
    accessoryOptions: document.getElementById('accessoryOptions'),
    personalityOptions: document.getElementById('personalityOptions'),
    saveAvatarBtn: document.getElementById('saveAvatarBtn'),
    saveFeedback: document.getElementById('saveFeedback'),
    shopFilters: document.getElementById('shopFilters'),
    shopGrid: document.getElementById('shopGrid'),
    questProgressPill: document.getElementById('questProgressPill'),
    questGrid: document.getElementById('questGrid'),
    goodsGrid: document.getElementById('goodsGrid'),
    sitterGrid: document.getElementById('sitterGrid'),
    postForm: document.getElementById('postForm'),
    postCategory: document.getElementById('postCategory'),
    composerPhotoRow: document.getElementById('composerPhotoRow'),
    postContent: document.getElementById('postContent'),
    communityFeed: document.getElementById('communityFeed'),
    videoModal: document.getElementById('videoModal'),
    modalVideoTitle: document.getElementById('modalVideoTitle'),
    modalVideoDesc: document.getElementById('modalVideoDesc'),
    modalVideoPlayer: document.getElementById('modalVideoPlayer'),
    modalPexelsLink: document.getElementById('modalPexelsLink'),
    closeVideoModal: document.getElementById('closeVideoModal'),
    toast: document.getElementById('toast')
  };

  let toastTimer = null;
  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2700);
  }

  function clampStat(v) {
    return Math.max(0, Math.min(100, Math.round(v)));
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[ch]);
  }

  function getSpeciesEmoji(speciesId) {
    return (DATA.SPECIES.find((s) => s.id === speciesId) || DATA.SPECIES[0]).emoji;
  }

  function recordMemory(note, countKey) {
    if (countKey) {
      state.memory.counts[countKey] = (state.memory.counts[countKey] || 0) + 1;
    }
    if (note) {
      const timeStr = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      state.memory.notes.unshift(`[${timeStr}] ${note}`);
      if (state.memory.notes.length > 8) state.memory.notes.length = 8;
    }
    renderAIPersona();
  }

  function gainExp(amount) {
    const prevLevel = DATA.getGrowthInfo(state.growth.exp).current.level;
    state.growth.exp += amount;
    const nextInfo = DATA.getGrowthInfo(state.growth.exp);
    if (nextInfo.current.level > prevLevel) {
      world.setGrowthScale(nextInfo.current.scaleMult);
      world.triggerEmote('🌟', `성장 완료! Lv.${nextInfo.current.level} ${nextInfo.current.title}!`);
      recordMemory(`Lv.${nextInfo.current.level} '${nextInfo.current.title}' 단계로 성장했어요! 🌟`);
      showToast(`🎉 축하해요! ${state.avatar.name}가 Lv.${nextInfo.current.level} (${nextInfo.current.title})로 성장했어요!`);
    }
  }

  function adjustStats(delta) {
    for (const [k, v] of Object.entries(delta)) {
      if (k in state.stats) state.stats[k] = clampStat(state.stats[k] + v);
    }
    DATA.saveState(state);
    renderStatsAndGrowth();
    renderAITraining();
  }

  // Preload sprites
  Object.values(DATA.PET_SPRITES).forEach((s) => getCachedImage(s.spriteUrl));

  // Hero Live Video
  function initHeroVideo() {
    function selectHeroVideo(videoId) {
      const item = DATA.LIVE_VIDEOS.find((v) => v.id === videoId) || DATA.LIVE_VIDEOS[0];
      activeHeroVideoId = item.id;
      el.heroVideo.poster = item.posterUrl;
      el.heroVideo.src = item.videoUrl;
      el.heroVideo.play().catch(() => {});
      el.heroVideoMeta.textContent = item.badge;
      el.heroVideoTitle.textContent = item.title;
      el.heroVideoDesc.textContent = item.desc;
      el.heroPlayToggle.textContent = '⏸';

      el.heroChannelBar.querySelectorAll('.channel-pill').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.videoId === item.id);
      });
    }

    el.heroChannelBar.innerHTML = DATA.LIVE_VIDEOS.map(
      (v) => `<button type="button" class="channel-pill ${v.id === activeHeroVideoId ? 'active' : ''}" data-video-id="${v.id}">${v.tabLabel}</button>`
    ).join('');

    el.heroChannelBar.querySelectorAll('.channel-pill').forEach((btn) => {
      btn.addEventListener('click', () => selectHeroVideo(btn.dataset.videoId));
    });

    el.heroPlayToggle.addEventListener('click', () => {
      if (el.heroVideo.paused) {
        el.heroVideo.play().catch(() => {});
        el.heroPlayToggle.textContent = '⏸';
      } else {
        el.heroVideo.pause();
        el.heroPlayToggle.textContent = '▶';
      }
    });
  }

  // Initialize Photorealistic 2.5D Walk Engine
  let lastSavedWalk = state.walkMeters || 0;
  const world = new WorldEngine(el.metaverseCanvas, state, {
    onWalkProgress: (meters, earnedMilestone) => {
      state.walkMeters = meters;
      el.hudWalkMeter.textContent = formatWalkDistance(meters);
      if (earnedMilestone) {
        state.coins += 20;
        gainExp(18);
        adjustStats({ affection: 4, stress: -6, energy: -4, fullness: -3 });
        recordMemory(`산책 ${Math.floor(meters)}m 돌파! 공원 산책이 너무 즐거웠어요.`, 'walk');
        showToast('🎉 산책 100m 달성! 포우코인 +20 P & 성장 EXP 획득!');
      } else if (meters - lastSavedWalk > 18) {
        lastSavedWalk = meters;
        DATA.saveState(state);
      }
    },
    onFetchBall: () => {
      state.coins += 10;
      gainExp(12);
      adjustStats({ affection: 5, stress: -8, energy: -4 });
      recordMemory('공 던지기 놀이로 신나게 뛰어놀았어요! 🎾', 'ball');
      renderTopBar();
      showToast('🎾 공 물어오기 성공! (+10 P, 애정도 +5)');
    },
    onTreasureFound: (tr) => {
      state.coins += tr.coins;
      gainExp(15);
      adjustStats({ affection: 3, stress: -4 });
      recordMemory(`산책 중 숨겨진 ${tr.label}을(를) 발견했어요! (+${tr.coins} P)`, 'walk');
      renderTopBar();
      showToast(`${tr.emoji} 산책 돌발 이벤트: ${tr.label} 발견! (+${tr.coins} P)`);
    },
    onNpcGreet: (npc) => {
      gainExp(8);
      adjustStats({ affection: 4, stress: -5 });
      recordMemory(`산책로에서 친구 '${npc.name}'와 코 인사를 나눴어요! 🐾`);
      showToast(`👃 친구 '${npc.name}'와 냄새 인사 완료! (애정도 +4)`);
    },
    onPetZoneTouch: (zone) => {
      const zoneNames = { head: '머리', chin: '턱', belly: '배' };
      gainExp(6);
      adjustStats({ affection: 4, stress: -6 });
      recordMemory(`보호자님이 ${zoneNames[zone]}를 다정하게 쓰다듬어 주셨어요 ❤️`, 'pet');
    },
    onPoopSpawn: () => {
      showToast('💩 산책 중 배변 이벤트! 바닥의 💩 또는 [배변 치우기]를 눌러주세요.');
    },
    onPoopCleaned: () => {
      state.coins += 15;
      gainExp(10);
      adjustStats({ cleanliness: 10, affection: 3 });
      recordMemory('매너 있게 배변을 깨끗이 치워주셨어요! ✨');
      renderTopBar();
      showToast('✨ 배변 치우기 완료! 매너 산책 보너스 +15 P');
    }
  });

  function formatWalkDistance(meters) {
    if (meters >= 1000) return `🐾 산책 ${(meters / 1000).toFixed(2)} km`;
    return `🐾 산책 ${Math.floor(meters)} m`;
  }

  function renderTopBar() {
    el.coinBalance.textContent = state.coins.toLocaleString('ko-KR');
    el.hudAvatarImg.src = state.avatar.photoUrl;
    const g = DATA.getGrowthInfo(state.growth.exp).current;
    el.hudPetText.textContent = `${state.avatar.name} · Lv.${g.level} ${g.title}`;
    el.hudWalkMeter.textContent = formatWalkDistance(state.walkMeters || 0);
  }

  function renderStatsAndGrowth() {
    const g = DATA.getGrowthInfo(state.growth.exp);
    el.growthBadge.textContent = `Lv.${g.current.level} ${g.current.title}`;
    el.coatSheenText.textContent = `털 상태: ${g.current.coat}`;
    el.growthExpText.textContent = g.next
      ? `${state.growth.exp} / ${g.next.minExp} EXP`
      : `${state.growth.exp} EXP (MAX)`;
    el.growthExpFill.style.width = `${g.progress}%`;

    const s = state.stats;
    const items = [
      { label: '🍖 포만감', val: s.fullness, cls: 'fill-amber' },
      { label: '🫧 청결도', val: s.cleanliness, cls: 'fill-blue' },
      { label: '⚡ 에너지', val: s.energy, cls: 'fill-green' },
      { label: '❤️ 애정도', val: s.affection, cls: 'fill-pink' },
      { label: '🌿 스트레스', val: s.stress, cls: 'fill-stress' }
    ];
    el.statList.innerHTML = items
      .map(
        (it) => `
        <div class="stat-row">
          <span>${it.label}</span>
          <div class="progress-track"><div class="progress-fill ${it.cls}" style="width:${it.val}%"></div></div>
          <span class="stat-val">${it.val}%</span>
        </div>
      `
      )
      .join('');
    renderTopBar();
  }

  // Gentle live stat decay every 45 seconds (Core Loop realism)
  setInterval(() => {
    adjustStats({ fullness: -1, cleanliness: -1, energy: -1, stress: 1 });
  }, 45000);

  // Pillar 1 Care Buttons
  function initCareActions() {
    el.careFeedBtn.addEventListener('click', () => {
      world.performCareVisual('feed');
      gainExp(12);
      adjustStats({ fullness: 22, affection: 5, stress: -4 });
      recordMemory('맛있는 사료와 간식을 챙겨 먹었어요 🍖', 'feed');
      showToast('🍖 밥 주기 완료! 포만감 +22, 애정도 +5');
    });

    el.careBrushBtn.addEventListener('click', () => {
      world.performCareVisual('brush');
      gainExp(10);
      adjustStats({ cleanliness: 16, affection: 6, stress: -8 });
      recordMemory('부드러운 빗질로 털 윤기가 반짝거려요 🪮', 'brush');
      showToast('🪮 빗질 완료! 청결도 +16, 스트레스 -8');
    });

    el.careBathBtn.addEventListener('click', () => {
      world.performCareVisual('bath');
      gainExp(15);
      adjustStats({ cleanliness: 32, energy: -5, stress: -4, affection: 4 });
      recordMemory('보글보글 따뜻한 목욕을 마쳤어요 🛁', 'bath');
      showToast('🛁 목욕 완료! 청결도 +32');
    });

    el.careCleanBtn.addEventListener('click', () => {
      const cleaned = world.cleanAllPoops();
      if (cleaned > 0) {
        state.coins += cleaned * 15;
        gainExp(10);
        adjustStats({ cleanliness: 12, affection: 3 });
        renderTopBar();
        showToast(`✨ 배변 ${cleaned}건 치우기 완료! (+${cleaned * 15} P)`);
      } else {
        world.triggerEmote('✨', '주변이 아주 깨끗해요!');
        showToast('✨ 현재 산책로가 깨끗합니다! (산책 중 배변이 나타나면 바로 치워주세요)');
      }
    });

    el.careNapBtn.addEventListener('click', () => {
      world.performCareVisual('nap');
      gainExp(8);
      adjustStats({ energy: 30, stress: -12 });
      recordMemory('포근하게 낮잠 자며 에너지를 충전했어요 💤');
      showToast('🛏️ 꿀잠 휴식! 에너지 +30, 스트레스 -12');
    });
  }

  // Pillar 2: Real-world Pedometer O2O Sync
  function renderPedometer() {
    const goal = 3000;
    const steps = state.realStepsToday || 0;
    const pct = Math.min(100, Math.round((steps / goal) * 100));
    el.realStepsCount.textContent = steps.toLocaleString('ko-KR');
    el.stepsPercentBadge.textContent = `${pct}%`;
    el.stepsProgressFill.style.width = `${pct}%`;
  }

  function addRealSteps(addedSteps) {
    if (!addedSteps || addedSteps <= 0) return;
    state.realStepsToday = (state.realStepsToday || 0) + addedSteps;
    const addedMeters = Math.round(addedSteps * 0.65);
    state.walkMeters += addedMeters;
    world.walkMeters = state.walkMeters;
    const coinReward = Math.max(5, Math.floor(addedSteps / 25));
    state.coins += coinReward;
    gainExp(Math.min(40, Math.floor(addedSteps / 30)));
    adjustStats({ affection: 5, stress: -10 });
    recordMemory(`현실 만보기 ${addedSteps.toLocaleString()}걸음 연동! (+${addedMeters}m 산책, +${coinReward} P)`, 'walk');
    renderPedometer();
    renderTopBar();
    world.triggerEmote('👟', `현실 ${addedSteps}걸음 연동 완료!`);
    showToast(`👟 ${addedSteps.toLocaleString()}걸음 연동! 산책 +${addedMeters}m & +${coinReward} P`);
  }

  function initPedometer() {
    renderPedometer();
    el.syncStepsBtn.addEventListener('click', () => addRealSteps(500));
    el.applyCustomStepsBtn.addEventListener('click', () => {
      const val = parseInt(el.customStepsInput.value, 10);
      if (!val || val < 10) {
        showToast('연동할 걸음 수를 10 이상 입력해 주세요.');
        return;
      }
      addRealSteps(val);
      el.customStepsInput.value = '';
    });

    // Optional live DeviceMotion step sensor for mobile phones
    let sensorActive = false;
    let lastAccPeak = 0;
    const motionHandler = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const mag = Math.hypot(acc.x || 0, acc.y || 0, acc.z || 0);
      const now = Date.now();
      if (mag > 13.2 && now - lastAccPeak > 420) {
        lastAccPeak = now;
        addRealSteps(10);
      }
    };

    el.sensorStepsBtn.addEventListener('click', () => {
      if (!window.DeviceMotionEvent) {
        showToast('📱 PC 브라우저에서는 [+500걸음 연동] 또는 직접 입력을 이용해 주세요!');
        return;
      }
      sensorActive = !sensorActive;
      if (sensorActive) {
        window.addEventListener('devicemotion', motionHandler);
        el.sensorStepsBtn.textContent = '📱 ON';
        showToast('📱 모바일 가속도 걸음 센서가 활성화되었습니다!');
      } else {
        window.removeEventListener('devicemotion', motionHandler);
        el.sensorStepsBtn.textContent = '📱 센서';
        showToast('📱 걸음 센서를 종료했습니다.');
      }
    });
  }

  // Pillar 3: AI Voice & Text Command Training + Memory Persona
  function getObedienceRate() {
    return Math.min(98, Math.round(58 + state.stats.affection * 0.4));
  }

  function executeCommand(rawText) {
    const cmd = rawText.trim();
    if (!cmd) return;

    const rate = getObedienceRate();
    const roll = Math.random() * 100;
    const success = roll <= rate || cmd.includes('사랑');

    let matched = false;
    if (cmd.includes('앉아')) {
      matched = true;
      if (success) {
        world.setPose('sit', 150);
        world.triggerEmote('🪑', '네! 얌전히 앉았어요 🐾');
        state.memory.learnedSkills.sit = Math.min(3, (state.memory.learnedSkills.sit || 0) + 1);
      }
    } else if (cmd.includes('손')) {
      matched = true;
      if (success) {
        world.setPose('paw', 140);
        world.triggerEmote('🐾', '여기 내 앞발! 간식 주세요~');
        state.memory.learnedSkills.paw = Math.min(3, (state.memory.learnedSkills.paw || 0) + 1);
      }
    } else if (cmd.includes('점프') || cmd.includes('뛰어')) {
      matched = true;
      if (success) {
        world.triggerEmote('⚡', '폴짝! 높이 뛰었죠?');
        state.memory.learnedSkills.jump = Math.min(3, (state.memory.learnedSkills.jump || 0) + 1);
      }
    } else if (cmd.includes('기다려')) {
      matched = true;
      if (success) {
        world.setPose('sit', 180);
        world.say('꼼짝 않고 기다리는 중... 👀');
        state.memory.learnedSkills.wait = Math.min(3, (state.memory.learnedSkills.wait || 0) + 1);
      }
    } else if (cmd.includes('공')) {
      matched = true;
      world.throwBall();
    } else if (cmd.includes('산책')) {
      matched = true;
      world.triggerEmote('🌳', '산책!! 제일 좋아! 빨리 나가요 🐾');
      world.centerPlayer();
    } else if (cmd.includes('사랑') || cmd.includes('예뻐')) {
      matched = true;
      world.setPose('happy', 130);
      world.triggerEmote('❤️', '나도 보호자님 제일 사랑해!! ❤️');
    }

    if (!matched) {
      world.setPose('tilt', 110);
      world.say(`"${cmd}"? 갸우뚱~ 무슨 말이지?`);
      el.voiceStatus.textContent = `인식된 말: "${cmd}" → 아직 모르는 단어라 갸우뚱해요! ("앉아", "손", "점프", "산책 갈까?"를 시도해 보세요)`;
      return;
    }

    if (!success) {
      world.setPose('tilt', 120);
      world.say('갸우뚱...? 지금은 조금 딴청 피우고 싶어 🐾');
      el.voiceStatus.textContent = `명령 "${cmd}" 실패 (성공률 ${rate}%) — 쓰다듬거나 간식을 주어 애정도를 높여보세요!`;
      showToast('🐾 갸우뚱~ 친밀도를 높이면 말을 더 잘 들어요!');
    } else {
      gainExp(12);
      state.coins += 10;
      adjustStats({ affection: 5, stress: -4 });
      recordMemory(`"${cmd}" 훈련에 멋지게 성공했어요! (+10 P)`, 'train');
      el.voiceStatus.textContent = `✅ "${cmd}" 인식 & 훈련 성공! (성공률 ${rate}% · +10 P · 애정도 +5)`;
      showToast(`✨ "${cmd}" 명령 성공! (+10 P)`);
    }
    renderAITraining();
  }

  function renderAITraining() {
    el.obedienceBadge.textContent = `명령 성공률 ${getObedienceRate()}%`;
    const sk = state.memory.learnedSkills;
    const list = [
      { name: '앉아', lv: sk.sit || 0 },
      { name: '손', lv: sk.paw || 0 },
      { name: '점프', lv: sk.jump || 0 },
      { name: '기다려', lv: sk.wait || 0 }
    ];
    el.skillGrid.innerHTML = list
      .map(
        (s) => `
        <div class="skill-box">
          <strong>${s.name}</strong>
          <span class="skill-stars">${'★'.repeat(s.lv)}${'☆'.repeat(3 - s.lv)}</span>
        </div>
      `
      )
      .join('');
  }

  function renderAIPersona() {
    const hour = new Date().getHours();
    let timeGreet = '오후 햇살이 따뜻해요!';
    if (hour >= 5 && hour < 11) timeGreet = '상쾌한 아침이에요! 모닝 산책 갈까요? ☀️';
    else if (hour >= 18 && hour < 23) timeGreet = '오늘 하루도 고생 많으셨어요! 저녁 산책해요 🌇';
    else if (hour >= 23 || hour < 5) timeGreet = '늦은 밤에도 저 보러 와주셨네요 🌙';

    let awayNote = `벌써 ${state.memory.visitCount}번째 만남이에요!`;
    if (hoursAway > 12) awayNote = '오랜만에 오셔서 살짝 삐질 뻔했지만... 너무 반가워요! 🐾';

    const c = state.memory.counts;
    const traits = [state.avatar.personality];
    if (c.walk >= 2) traits.push('🌳 산책 마니아');
    if (c.pet >= 2) traits.push('❤️ 애교쟁이');
    if (c.feed >= 2) traits.push('🍖 미식가');
    if (c.train >= 2) traits.push('🎓 천재 훈련견');
    if (c.ball >= 2) traits.push('🎾 공놀이 에이스');

    el.visitStreakBadge.textContent = `접속 ${state.memory.visitCount}회차`;
    el.personaGreeting.textContent = `"${timeGreet} ${awayNote} 저는 ${state.avatar.name}예요!"`;
    el.personaTraits.innerHTML = traits.map((t) => `<span class="trait-chip">${escapeHtml(t)}</span>`).join('');
    el.memoryLog.innerHTML = state.memory.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join('');
  }

  function initAIHub() {
    renderAITraining();
    renderAIPersona();

    el.commandForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCommand(el.commandInput.value);
      el.commandInput.value = '';
    });

    document.querySelectorAll('.cmd-chip').forEach((btn) => {
      btn.addEventListener('click', () => executeCommand(btn.dataset.cmd));
    });

    // Real Browser Web Speech API Voice Recognition
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    el.voiceListenBtn.addEventListener('click', () => {
      if (!SpeechRec) {
        el.voiceStatus.textContent = '이 브라우저는 마이크 음성 인식을 지원하지 않습니다. 아래 명령 버튼이나 텍스트를 이용해 주세요!';
        showToast('🎤 Chrome/Edge에서 마이크 음성 인식이 지원됩니다.');
        return;
      }
      const recognition = new SpeechRec();
      recognition.lang = 'ko-KR';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      el.voiceStatus.classList.add('listening');
      el.voiceStatus.textContent = '🎙️ 듣고 있어요... "앉아", "손", "점프", "산책 갈까?"라고 말씀해 보세요!';
      recognition.start();

      recognition.onresult = (event) => {
        const spoken = event.results[0][0].transcript;
        el.voiceStatus.classList.remove('listening');
        executeCommand(spoken);
      };
      recognition.onerror = () => {
        el.voiceStatus.classList.remove('listening');
        el.voiceStatus.textContent = '마이크 권한이 없거나 음성이 인식되지 않았습니다. 버튼 또는 텍스트로 훈련해 보세요!';
      };
      recognition.onend = () => {
        el.voiceStatus.classList.remove('listening');
      };
    });
  }

  // Pillar 4: Spatial Architectural Spaces + AI Interior Designer
  let myRoomEngine = null;

  function getAllRoomCatalog() {
    return [...DATA.ROOM_ITEMS, ...(state.myRoom.customCatalog || [])];
  }

  function updateSpatialHeaderChip() {
    const theme = DATA.ROOM_THEMES.find((t) => t.id === state.myRoom.themeId) || DATA.ROOM_THEMES[0];
    const count = state.myRoom.placed.length;
    el.spaceCapacityChip.textContent = `${theme.name} · ${count} / 25 오브젝트`;
  }

  function renderInvitePets() {
    const choices = [
      { id: 'dog_brown', label: '🐶 초코' },
      { id: 'cat_ginger', label: '🐱 모찌' },
      { id: 'rabbit_white', label: '🐰 두부' },
      { id: 'hamster_cream', label: '🐹 코코' },
      { id: 'dog_golden', label: '🐕 해피' }
    ].filter((c) => c.id !== state.avatar.spriteId);

    const invited = state.myRoom.invitedSpriteIds || [];
    el.invitePetRow.innerHTML = choices
      .map(
        (c) => `<button type="button" class="invite-chip ${invited.includes(c.id) ? 'active' : ''}" data-invite-pet="${c.id}">${c.label}</button>`
      )
      .join('');

    el.invitePetRow.querySelectorAll('[data-invite-pet]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.invitePet;
        const list = state.myRoom.invitedSpriteIds || [];
        const idx = list.indexOf(id);
        if (idx !== -1) {
          list.splice(idx, 1);
        } else {
          if (list.length >= 2) list.shift();
          list.push(id);
        }
        state.myRoom.invitedSpriteIds = list;
        DATA.saveState(state);
        if (myRoomEngine) myRoomEngine.syncPets();
        renderInvitePets();
      });
    });
  }

  function renderRoomControls() {
    updateSpatialHeaderChip();
    el.roomWarmthSlider.value = state.myRoom.warmth ?? 12;
    el.toggleSpotlightBtn.textContent = state.myRoom.spotlights ? '💡 스포트라이트 ON' : '💡 스포트라이트 OFF';
    el.toggleVideoWallBtn.textContent = state.myRoom.showVideoWall ? '🎬 벽 영상 월 ON' : '🎬 벽 영상 월 OFF';

    el.roomThemeBar.innerHTML = DATA.ROOM_THEMES.map(
      (t) => `<button class="seg-btn ${state.myRoom.themeId === t.id ? 'active' : ''}" data-room-theme="${t.id}">${t.name}</button>`
    ).join('');

    el.roomThemeBar.querySelectorAll('[data-room-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.myRoom.themeId = btn.dataset.roomTheme;
        const t = DATA.ROOM_THEMES.find((x) => x.id === state.myRoom.themeId);
        if (t) state.myRoom.warmth = t.defaultWarmth;
        DATA.saveState(state);
        renderRoomControls();
      });
    });

    const catalog = getAllRoomCatalog();
    el.roomItemList.innerHTML = catalog
      .map((item) => {
        const unlocked = item.free || item.isAiCustom || state.ownedItems.includes(item.shopId);
        const isPlaced = state.myRoom.placed.some((p) => p.itemId === item.id);
        return `
          <div class="room-item-row">
            <div class="room-item-left">
              <span>${unlocked ? item.emoji : '🔒'}</span>
              <div>${escapeHtml(item.name)}${item.isAiCustom ? ' <small style="color:var(--accent)">AI</small>' : ''}</div>
            </div>
            <button
              class="btn ${isPlaced ? 'btn-secondary' : 'btn-primary'} btn-xs"
              data-toggle-room-item="${item.id}"
              data-unlocked="${unlocked}"
            >
              ${!unlocked ? '샵 구매' : isPlaced ? '빼기' : '배치'}
            </button>
          </div>
        `;
      })
      .join('');

    el.roomItemList.querySelectorAll('[data-toggle-room-item]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.unlocked !== 'true') {
          showToast('🔒 아이템 샵(마이룸 가구)에서 먼저 구매해 주세요!');
          document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
          return;
        }
        const id = btn.dataset.toggleRoomItem;
        const idx = state.myRoom.placed.findIndex((p) => p.itemId === id);
        if (idx !== -1) {
          state.myRoom.placed.splice(idx, 1);
        } else if (state.myRoom.placed.length < 25) {
          const nx = 140 + Math.random() * 640;
          const ny = 365 + Math.random() * 110;
          state.myRoom.placed.push({ itemId: id, x: nx, y: ny, scale: 1 });
          if (myRoomEngine) myRoomEngine.spawnSparkles(nx, ny - 20, '✨');
        }
        DATA.saveState(state);
        renderRoomControls();
      });
    });

    renderInvitePets();
  }

  function applyAIInteriorPrompt(rawPrompt) {
    const text = rawPrompt.trim();
    if (!text) return;
    const actions = [];

    // 1. Space / Architecture theme matching
    if (/(오션|바다|해변|빌라|테라스|여수)/.test(text)) {
      state.myRoom.themeId = 'ocean';
      actions.push('🌊 오션뷰 테라스 빌라 공간으로 전환');
    } else if (/(선셋|노을|아트리움|밤|감성|시네마|라운지)/.test(text)) {
      state.myRoom.themeId = 'atrium';
      actions.push('🌅 선셋 아트리움 라운지 공간으로 전환');
    } else if (/(갤러리|모던|북유럽|원목|전시)/.test(text)) {
      state.myRoom.themeId = 'gallery';
      actions.push('🏛️ 모던 펫 갤러리 공간으로 전환');
    }

    // 2. Lighting & Wall Video matching
    if (/(따뜻|노을|아늑|무드|골든)/.test(text)) {
      state.myRoom.warmth = 28;
      state.myRoom.spotlights = true;
      actions.push('💡 따뜻한 골든아워 스포트라이트 조명 적용');
    } else if (/(밝|화이트|시원|상쾌)/.test(text)) {
      state.myRoom.warmth = 4;
      state.myRoom.spotlights = true;
      actions.push('☀️ 화사한 내추럴 화이트 채광 적용');
    }
    if (/(영상|스크린|시네마|비디오|티비|TV)/i.test(text)) {
      state.myRoom.showVideoWall = true;
      if (myRoomEngine) myRoomEngine.cycleWallVideo();
      actions.push('🎬 벽면 대형 펫 영상 월 활성화');
    }

    // 3. Pet friends invitation matching
    if (/(3마리|세마리|3둥이|친구|파티)/.test(text)) {
      state.myRoom.invitedSpriteIds = ['dog_brown', 'cat_ginger'];
      actions.push('🐾 반려동물 3마리가 함께 뛰노는 공간으로 초대');
    } else if (/(고양이|냥)/.test(text) && /(토끼)/.test(text)) {
      state.myRoom.invitedSpriteIds = ['cat_ginger', 'rabbit_white'];
      actions.push('🐱🐰 고양이·토끼 친구 초대');
    } else if (/(고양이|냥)/.test(text)) {
      state.myRoom.invitedSpriteIds = ['cat_ginger'];
      actions.push('🐱 치즈 고양이 친구 초대');
    }

    // Helper to ensure item is placed cleanly
    const placeOrSpawn = (itemObj, xPos, yPos) => {
      if (state.myRoom.placed.length >= 25) return;
      const existing = state.myRoom.placed.find((p) => p.itemId === itemObj.id);
      const px = xPos ?? 150 + Math.random() * 620;
      const py = yPos ?? 370 + Math.random() * 105;
      if (!existing) {
        state.myRoom.placed.push({ itemId: itemObj.id, x: px, y: py, scale: 1 });
        if (myRoomEngine) myRoomEngine.spawnSparkles(px, py - 24, itemObj.emoji || '✨');
      }
    };

    // 4. Built-in furniture keyword matching
    const keywordMap = [
      { re: /(베드|방석|침대)/, id: 'room_bed', x: 210, y: 420 },
      { re: /(식기|밥그릇|간식 바|간식바)/, id: 'room_bowl', x: 465, y: 452 },
      { re: /(장난감|공|놀)/, id: 'room_toy', x: 710, y: 424 },
      { re: /(화분|식물|플랜테리어|화단)/, id: 'room_plant', x: 125, y: 372 },
      { re: /(무드등|조명|스탠드)/, id: 'room_lamp', x: 800, y: 375 }
    ];
    for (const kw of keywordMap) {
      if (kw.re.test(text)) {
        const meta = DATA.ROOM_ITEMS.find((i) => i.id === kw.id);
        if (meta) {
          placeOrSpawn(meta, kw.x, kw.y);
          actions.push(`${meta.emoji} ${meta.name} 배치`);
        }
      }
    }

    // 5. Dynamic AI Custom Object Synthesis (for ANY creative object the user asks for!)
    const customPatterns = [
      { re: /(소파)/, name: 'AI 럭셔리 패브릭 소파', emoji: '🛋️', photoUrl: DATA.PEXELS_PHOTOS.hamsterCouch, actionText: 'AI 소파 너무 편해~ 🛋️', actionType: 'nap' },
      { re: /(캣타워)/, name: 'AI 원목 캣타워', emoji: '🪵', photoUrl: DATA.PEXELS_PHOTOS.catCafe, actionText: '캣타워 꼭대기 탐험 중! 🐾', actionType: 'play' },
      { re: /(미끄럼틀)/, name: 'AI 원목 펫 미끄럼틀', emoji: '🛝', photoUrl: DATA.PEXELS_PHOTOS.dogPark, actionText: '미끄럼틀 슈웅~! 신나 🛝', actionType: 'play' },
      { re: /(수영장|풀장)/, name: 'AI 미니 펫 수영장', emoji: '🏊', photoUrl: DATA.PEXELS_PHOTOS.walkArena, actionText: '첨벙첨벙 물놀이 최고! 💧', actionType: 'play' },
      { re: /(벽난로)/, name: 'AI 감성 벽난로', emoji: '🔥', photoUrl: DATA.PEXELS_PHOTOS.petBed, actionText: '벽난로 앞이 따뜻해 Zzz 🔥', actionType: 'nap' },
      { re: /(해먹)/, name: 'AI 테라스 펫 해먹', emoji: '🏝️', photoUrl: DATA.PEXELS_PHOTOS.catGinger, actionText: '해먹에서 살랑살랑 휴식 🏝️', actionType: 'nap' },
      { re: /(트리|크리스마스)/, name: 'AI 반짝이 트리', emoji: '🎄', photoUrl: DATA.PEXELS_PHOTOS.flowerMeadow, actionText: '반짝반짝 트리 구경 중! 🎄', actionType: 'sniff' },
      { re: /(분수|급수기)/, name: 'AI 오브제 분수대', emoji: '⛲', photoUrl: DATA.PEXELS_PHOTOS.walkPark, actionText: '시원한 물소리 좋다 ⛲', actionType: 'sniff' },
      { re: /(러그|카펫)/, name: 'AI 북유럽 울 러그', emoji: '🧶', photoUrl: DATA.PEXELS_PHOTOS.petBed, actionText: '폭신한 러그 위에서 뒹굴뒹굴 🧶', actionType: 'nap' }
    ];

    let createdCustom = false;
    for (const cp of customPatterns) {
      if (cp.re.test(text)) {
        createdCustom = true;
        const customId = `ai_${cp.name.replace(/\s+/g, '_')}`;
        if (!state.myRoom.customCatalog.some((c) => c.id === customId)) {
          state.myRoom.customCatalog.push({ id: customId, ...cp, isAiCustom: true, free: true });
        }
        const meta = state.myRoom.customCatalog.find((c) => c.id === customId);
        placeOrSpawn(meta);
        actions.push(`✨ ${meta.emoji} ${meta.name} AI 생성 및 배치`);
      }
    }

    // Fallback: if user typed a unique custom item request not in patterns, synthesize it directly!
    if (actions.length === 0 || (!createdCustom && /(추가|만들|넣어|배치|놓아)/.test(text) && actions.length < 2)) {
      const cleaned = text.replace(/(추가해줘|만들어줘|넣어줘|배치해줘|놓아줘|해줘|추가|생성)/g, '').trim().slice(0, 14) || 'AI 커스텀 오브제';
      const customId = `ai_custom_${Date.now()}`;
      const newItem = {
        id: customId,
        name: `AI ${cleaned}`,
        emoji: '✨',
        photoUrl: DATA.PEXELS_PHOTOS.flowerMeadow,
        actionText: `${cleaned} 구경하는 중! 신기해 ✨`,
        actionType: 'play',
        isAiCustom: true,
        free: true
      };
      state.myRoom.customCatalog.push(newItem);
      placeOrSpawn(newItem);
      actions.push(`✨ '${newItem.name}' 커스텀 오브제 생성 및 배치`);
    }

    DATA.saveState(state);
    if (myRoomEngine) myRoomEngine.syncPets();
    renderRoomControls();
    el.aiDesignerReply.textContent = `✨ AI 인테리어 반영 완료: ${actions.join(' · ')}`;
    showToast('✨ AI가 요청하신 인테리어와 오브젝트를 공간에 반영했어요!');
  }

  function initMyRoom() {
    myRoomEngine = new MyRoomEngine(el.myRoomCanvas, state, {
      onLayoutChange: () => {
        DATA.saveState(state);
        updateSpatialHeaderChip();
      },
      onVideoSwitch: (vid) => {
        showToast(`🎬 벽면 영상 월 전환: ${vid.title}`);
      },
      onSelectChange: (idx) => {
        if (idx >= 0 && state.myRoom.placed[idx]) {
          const meta = getAllRoomCatalog().find((m) => m.id === state.myRoom.placed[idx].itemId);
          el.selectedObjName.textContent = `선택됨: ${meta ? meta.name : '오브젝트'}`;
          el.selectedObjBar.hidden = false;
        } else {
          el.selectedObjBar.hidden = true;
        }
      }
    });

    el.aiInteriorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyAIInteriorPrompt(el.aiInteriorInput.value);
      el.aiInteriorInput.value = '';
    });

    document.querySelectorAll('[data-ai-preset]').forEach((btn) => {
      btn.addEventListener('click', () => applyAIInteriorPrompt(btn.dataset.aiPreset));
    });

    el.roomWarmthSlider.addEventListener('input', (e) => {
      state.myRoom.warmth = parseInt(e.target.value, 10);
      DATA.saveState(state);
    });

    el.toggleSpotlightBtn.addEventListener('click', () => {
      state.myRoom.spotlights = !state.myRoom.spotlights;
      DATA.saveState(state);
      renderRoomControls();
    });

    el.toggleVideoWallBtn.addEventListener('click', () => {
      state.myRoom.showVideoWall = !state.myRoom.showVideoWall;
      DATA.saveState(state);
      renderRoomControls();
    });

    el.switchWallVideoBtn.addEventListener('click', () => {
      const next = myRoomEngine.cycleWallVideo();
      showToast(`🎬 벽면 영상 변경: ${next.title}`);
    });

    // Real custom pet photo upload onto the architectural gallery wall frames!
    el.uploadFramePhoto.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result;
        if (!Array.isArray(state.myRoom.galleryPhotos)) state.myRoom.galleryPhotos = [];
        state.myRoom.galleryPhotos.unshift(dataUrl);
        if (state.myRoom.galleryPhotos.length > 2) state.myRoom.galleryPhotos.length = 2;
        getCachedImage(dataUrl);
        DATA.saveState(state);
        showToast('🖼️ 내 반려동물 사진이 갤러리 벽면 액자에 걸렸습니다!');
      };
      reader.readAsDataURL(file);
    });

    document.querySelectorAll('[data-obj-scale]').forEach((btn) => {
      btn.addEventListener('click', () => {
        myRoomEngine.setSelectedScale(parseFloat(btn.dataset.objScale));
      });
    });

    el.deleteObjBtn.addEventListener('click', () => {
      myRoomEngine.deleteSelected();
      renderRoomControls();
    });

    el.captureSpaceBtn.addEventListener('click', () => {
      const dataUrl = myRoomEngine.captureSnapshot();
      if (!dataUrl) {
        showToast('⚠️ 브라우저 보안 정책으로 외부 이미지가 포함된 캔버스 저장이 제한될 수 있습니다.');
        return;
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `pawverse-space-${Date.now()}.png`;
      a.click();
      showToast('📸 나만의 반려동물 공간 스냅샷이 저장되었어요!');
    });

    renderRoomControls();
  }

  // Pillar 5: Adoption Pre-Simulation Quests
  function renderAdoptionQuests() {
    const doneCount = state.completedQuests.length;
    el.questProgressPill.textContent = `🎓 수료 현황: ${doneCount} / ${DATA.ADOPTION_QUESTS.length}`;

    el.questGrid.innerHTML = DATA.ADOPTION_QUESTS.map((q) => {
      const done = state.completedQuests.includes(q.id);
      return `
        <article class="quest-card ${done ? 'completed' : ''}">
          <span class="quest-badge">${q.badge}</span>
          <h3>${q.title}</h3>
          <p class="quest-desc">${q.desc}</p>
          <div class="quest-q">Q. ${q.question}</div>
          ${
            done
              ? `<div class="quest-done-banner">✅ 퀘스트 수료 완료! (+${q.reward} P 지급됨)</div>`
              : `<div class="quest-options">
                  ${q.options
                    .map(
                      (opt, idx) =>
                        `<button type="button" class="quest-opt-btn" data-quest-id="${q.id}" data-opt-idx="${idx}">${idx + 1}. ${opt}</button>`
                    )
                    .join('')}
                </div>`
          }
        </article>
      `;
    }).join('');

    el.questGrid.querySelectorAll('.quest-opt-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const q = DATA.ADOPTION_QUESTS.find((item) => item.id === btn.dataset.questId);
        const chosen = parseInt(btn.dataset.optIdx, 10);
        if (!q) return;
        if (chosen === q.correctIndex) {
          state.completedQuests.push(q.id);
          state.coins += q.reward;
          gainExp(25);
          DATA.saveState(state);
          renderTopBar();
          renderAdoptionQuests();
          showToast(`🎓 정답! '${q.badge}' 배지 획득 & +${q.reward} P`);
        } else {
          showToast('💡 조금만 더 생각해 볼까요? 설명을 다시 읽어보세요!');
        }
      });
    });
  }

  // Pillar 5: Real-world Custom Goods & O2O Commerce Preview
  function renderRealGoods() {
    const spec = DATA.PET_SPRITES[state.avatar.spriteId] || DATA.PET_SPRITES.dog_golden;
    el.goodsGrid.innerHTML = DATA.REAL_GOODS.map((g) => {
      const redeemed = state.redeemedGoods.includes(g.id);
      return `
        <article class="goods-card">
          <div class="goods-mockup">
            <span class="goods-tag">${g.tag}</span>
            <div class="mockup-keyring">
              <img src="${spec.spriteUrl}" alt="${escapeHtml(state.avatar.name)} 굿즈 미리보기" />
            </div>
            <span class="mockup-tag-label">🏷️ ${escapeHtml(state.avatar.name)} · ${escapeHtml(state.avatar.tagText || 'PAW-0127')}</span>
          </div>
          <div class="goods-body">
            <h3>${g.name}</h3>
            <p>${g.desc}</p>
            <div class="goods-price-row">
              <span>${g.priceWon}</span>
              <span class="goods-discount">${g.discountWon}</span>
            </div>
            <button class="btn ${redeemed ? 'btn-secondary' : 'btn-primary'} btn-sm btn-full" data-redeem-goods="${g.id}" ${redeemed ? 'disabled' : ''}>
              ${redeemed ? '쿠폰 발급 완료 ✓' : `🪙 ${g.discountCoin} P로 할인 쿠폰 발급`}
            </button>
          </div>
        </article>
      `;
    }).join('');

    el.goodsGrid.querySelectorAll('[data-redeem-goods]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = DATA.REAL_GOODS.find((x) => x.id === btn.dataset.redeemGoods);
        if (!g) return;
        if (state.coins < g.discountCoin) {
          showToast('🪙 포우코인이 부족해요! 산책이나 퀘스트로 모아보세요.');
          return;
        }
        state.coins -= g.discountCoin;
        state.redeemedGoods.push(g.id);
        DATA.saveState(state);
        renderTopBar();
        renderRealGoods();
        showToast(`🎁 '${g.name}' 실물 주문 할인 쿠폰이 발급되었습니다!`);
      });
    });
  }

  // Pillar 5: Pet Sitter Care Exchange
  function renderSitterRequests() {
    el.sitterGrid.innerHTML = DATA.PET_SITTER_REQUESTS.map((req) => {
      const helped = state.helpedSitters.includes(req.id);
      return `
        <article class="sitter-card">
          <img src="${req.photoUrl}" alt="${req.petName}" loading="lazy" />
          <div class="sitter-info">
            <strong>${req.petName} <span style="font-weight:500; color:var(--text-muted)">(${req.owner})</span></strong>
            <p>${req.task}</p>
            <button class="btn ${helped ? 'btn-secondary' : 'btn-primary'} btn-xs" data-help-sitter="${req.id}" ${helped ? 'disabled' : ''}>
              ${helped ? '돌봄 품앗이 완료 ✓' : `🤝 돌봐주기 (+${req.reward} P)`}
            </button>
          </div>
        </article>
      `;
    }).join('');

    el.sitterGrid.querySelectorAll('[data-help-sitter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const req = DATA.PET_SITTER_REQUESTS.find((r) => r.id === btn.dataset.helpSitter);
        if (!req || state.helpedSitters.includes(req.id)) return;
        state.helpedSitters.push(req.id);
        state.coins += req.reward;
        gainExp(15);
        DATA.saveState(state);
        renderTopBar();
        renderSitterRequests();
        showToast(`🤝 ${req.petName} 돌봄 품앗이 완료! (+${req.reward} P & 친절 배지)`);
      });
    });
  }

  // Sidebar Mini Tabs (Chat vs Nearby)
  function initSidebarTabs() {
    document.querySelectorAll('[data-side-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('[data-side-tab]').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.sideTab;
        document.getElementById('sideTabChat').hidden = target !== 'chat';
        document.getElementById('sideTabNearby').hidden = target !== 'nearby';
      });
    });
  }

  function renderZoneHeader() {
    const zone = DATA.ZONES.find((z) => z.id === state.zoneId) || DATA.ZONES[0];
    el.currentZoneTitle.textContent = `${zone.icon} ${zone.name}`;
    el.currentZoneDesc.textContent = `${zone.desc} 반려동물의 머리·턱·배를 직접 클릭해 쓰다듬거나 산책해 보세요!`;
  }

  function renderNearbyPets() {
    el.nearbyCount.textContent = String(DATA.NPCS.length + 1);
    el.nearbyList.innerHTML = DATA.NPCS.map(
      (npc) => `
      <li class="nearby-item">
        <div class="nearby-pet-info">
          <img class="nearby-avatar" src="${npc.photoUrl}" alt="${escapeHtml(npc.name)}" loading="lazy" />
          <div class="nearby-meta">
            <strong>${getSpeciesEmoji(npc.species)} ${escapeHtml(npc.name)}</strong>
            <span class="nearby-sub">${npc.personality}</span>
          </div>
        </div>
        <button class="wave-btn" data-wave="${npc.id}">인사하기</button>
      </li>
    `
    ).join('');

    el.nearbyList.querySelectorAll('[data-wave]').forEach((btn) => {
      btn.addEventListener('click', () => world.waveToNpc(btn.dataset.wave));
    });
  }

  function appendChat(sender, text, isMine = false) {
    const div = document.createElement('div');
    div.className = `chat-msg ${isMine ? 'mine' : ''}`;
    div.innerHTML = `<span class="chat-sender">${escapeHtml(sender)}</span><span></span>`;
    div.querySelector('span:last-child').textContent = text;
    el.chatMessages.appendChild(div);
    el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
  }

  function initChat() {
    appendChat('🐾 시스템', '산책로에서 보물상자🎁를 줍고 친구와 냄새 인사해 보세요!');
    appendChat('🐶 초코', '안녕! 채팅에 "앉아"나 "공 물어와"라고 치면 바로 반응해!');

    el.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = el.chatInput.value.trim();
      if (!text) return;
      const label = `${getSpeciesEmoji(state.avatar.species)} ${state.avatar.name}`;
      appendChat(label, text, true);
      if (/(앉아|손|점프|기다려|공|산책|사랑)/.test(text)) {
        executeCommand(text);
      } else {
        world.say(text);
      }
      el.chatInput.value = '';
    });
  }

  function updateLeashButton() {
    el.leashToggleBtn.textContent = state.leashEnabled ? '🦮 리드줄 ON' : '🐾 자유 산책';
    el.leashToggleBtn.setAttribute('aria-pressed', String(state.leashEnabled));
  }

  function initWorldControls() {
    updateLeashButton();
    el.leashToggleBtn.addEventListener('click', () => {
      state.leashEnabled = !state.leashEnabled;
      world.setLeashEnabled(state.leashEnabled);
      DATA.saveState(state);
      updateLeashButton();
      showToast(state.leashEnabled ? '🦮 산책 리드줄 착용!' : '🐾 자유 산책 모드!');
    });

    el.throwBallBtn.addEventListener('click', () => world.throwBall());

    document.querySelectorAll('.emote-btn[data-emote]').forEach((btn) => {
      btn.addEventListener('click', () => world.triggerEmote(btn.dataset.emote, btn.dataset.text));
    });

    document.querySelectorAll('[data-time]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.time === state.timeOfDay);
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-time]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.timeOfDay = btn.dataset.time;
        world.setTimeOfDay(state.timeOfDay);
        DATA.saveState(state);
      });
    });

    el.centerCameraBtn.addEventListener('click', () => world.centerPlayer());
    el.quickJumpBtn.addEventListener('click', () => {
      document.getElementById('world').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Zones & Video Lounge
  function renderZones() {
    el.zonesGrid.innerHTML = DATA.ZONES.map((zone) => {
      const active = zone.id === state.zoneId;
      return `
        <article class="zone-card ${active ? 'active' : ''}" data-zone-id="${zone.id}">
          <div class="zone-cover">
            <img src="${zone.coverPhoto}" alt="${zone.name}" loading="lazy" />
            <span class="zone-cover-badge">${zone.icon} ${active ? '산책 중' : `${zone.visitors}마리 접속`}</span>
          </div>
          <div class="zone-content">
            <h3 class="zone-title">${zone.name}</h3>
            <p class="zone-desc">${zone.desc}</p>
            <div class="zone-footer">
              <span>🟢 2.5D 실사 산책로</span>
              <span>${active ? '현재 위치 ✓' : '산책하러 가기 →'}</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    el.zonesGrid.querySelectorAll('.zone-card').forEach((card) => {
      card.addEventListener('click', () => {
        const nextId = card.dataset.zoneId;
        state.zoneId = nextId;
        DATA.saveState(state);
        world.setZone(nextId);
        renderZoneHeader();
        renderZones();
        const zone = DATA.ZONES.find((z) => z.id === nextId);
        appendChat('🐾 시스템', `${zone.name}(으)로 산책 코스를 변경했습니다.`);
        showToast(`${zone.icon} ${zone.name} 산책을 시작해요!`);
        document.getElementById('world').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function openVideoModal(video) {
    el.modalVideoTitle.textContent = video.title;
    el.modalVideoDesc.textContent = video.desc;
    el.modalPexelsLink.href = video.pageUrl;
    el.modalVideoPlayer.poster = video.posterUrl;
    el.modalVideoPlayer.src = video.videoUrl;
    el.videoModal.hidden = false;
    el.modalVideoPlayer.play().catch(() => {});
  }

  function closeModal() {
    el.videoModal.hidden = true;
    el.modalVideoPlayer.pause();
    el.modalVideoPlayer.removeAttribute('src');
  }

  function initVideoLounge() {
    el.videoGrid.innerHTML = DATA.LIVE_VIDEOS.map(
      (v) => `
      <article class="video-card" data-modal-video="${v.id}">
        <div class="video-card-media">
          <video muted loop playsinline preload="metadata" poster="${v.posterUrl}">
            <source src="${v.videoUrl}" type="video/mp4" />
          </video>
          <span class="video-card-badge">${v.badge}</span>
          <span class="video-play-pill">▶ 크게 보기</span>
        </div>
        <div class="video-card-body">
          <h3 class="video-card-title">${v.title}</h3>
          <p class="video-card-desc">${v.desc}</p>
        </div>
      </article>
    `
    ).join('');

    el.videoGrid.querySelectorAll('.video-card').forEach((card) => {
      const vid = card.querySelector('video');
      const item = DATA.LIVE_VIDEOS.find((v) => v.id === card.dataset.modalVideo);
      card.addEventListener('mouseenter', () => vid.play().catch(() => {}));
      card.addEventListener('mouseleave', () => vid.pause());
      card.addEventListener('click', () => item && openVideoModal(item));
    });

    el.closeVideoModal.addEventListener('click', closeModal);
    el.videoModal.addEventListener('click', (e) => {
      if (e.target === el.videoModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !el.videoModal.hidden) closeModal();
    });
  }

  // Studio
  function renderPreviewCanvas() {
    const ctx = el.previewCanvas.getContext('2d');
    const w = el.previewCanvas.width;
    const h = el.previewCanvas.height;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w / 2, h * 0.78, 12, w / 2, h * 0.78, 125);
    grad.addColorStop(0, 'rgba(99, 193, 116, 0.25)');
    grad.addColorStop(1, 'rgba(99, 193, 116, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    drawPetCharacter(ctx, draftAvatar, {
      x: w / 2,
      y: h * 0.78,
      scale: 1.45,
      walkPhase: performance.now() * 0.006,
      isMoving: true,
      facing: 1,
      isPlayer: false,
      showName: false,
      timeOfDay: 'day'
    });
    requestAnimationFrame(renderPreviewCanvas);
  }

  function isAccessoryUnlocked(acc) {
    return acc.free || state.ownedItems.includes(acc.shopId);
  }

  function renderStudioControls() {
    el.petNameInput.value = draftAvatar.name;
    el.petTagInput.value = draftAvatar.tagText || 'PAW-0127';
    el.previewName.textContent = draftAvatar.name || '이름 없음';
    el.previewPersonality.textContent = draftAvatar.personality;
    el.previewTagBadge.textContent = `🏷️ ${draftAvatar.tagText || 'PAW-0127'}`;

    el.speciesOptions.innerHTML = DATA.SPECIES.map(
      (sp) => `
      <button type="button" class="option-btn ${draftAvatar.species === sp.id ? 'active' : ''}" data-species="${sp.id}">
        <img class="opt-thumb" src="${sp.defaultPhoto}" alt="${sp.name}" loading="lazy" />
        <span>${sp.emoji} ${sp.name}</span>
      </button>
    `
    ).join('');

    el.speciesOptions.querySelectorAll('[data-species]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const sp = DATA.SPECIES.find((s) => s.id === btn.dataset.species);
        if (!sp) return;
        draftAvatar.species = sp.id;
        draftAvatar.spriteId = sp.defaultSprite;
        draftAvatar.photoUrl = sp.defaultPhoto;
        renderStudioControls();
      });
    });

    el.photoPickerGrid.innerHTML = DATA.PET_PORTRAITS.map(
      (p) => `
      <button type="button" class="photo-choice ${draftAvatar.spriteId === p.spriteId ? 'active' : ''}" data-sprite-id="${p.spriteId}" data-photo-url="${p.url}" data-photo-species="${p.species}">
        <img src="${p.url}" alt="${p.label}" loading="lazy" />
        <span>${p.label}</span>
      </button>
    `
    ).join('');

    el.photoPickerGrid.querySelectorAll('[data-sprite-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draftAvatar.spriteId = btn.dataset.spriteId;
        draftAvatar.photoUrl = btn.dataset.photoUrl;
        draftAvatar.species = btn.dataset.photoSpecies;
        renderStudioControls();
      });
    });

    el.colorSwatches.innerHTML = DATA.COLORS.map(
      (c) => `<button type="button" class="swatch-btn ${draftAvatar.color === c.hex ? 'active' : ''}" style="background:${c.hex}" title="${c.name}" data-color="${c.hex}"></button>`
    ).join('');

    el.colorSwatches.querySelectorAll('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draftAvatar.color = btn.dataset.color;
        renderStudioControls();
      });
    });

    el.accessoryOptions.innerHTML = DATA.ACCESSORIES.map((acc) => {
      const unlocked = isAccessoryUnlocked(acc);
      return `
        <button type="button" class="option-btn ${draftAvatar.accessory === acc.id ? 'active' : ''} ${unlocked ? '' : 'locked'}" data-acc="${acc.id}" data-unlocked="${unlocked}">
          <span class="opt-emoji">${unlocked ? acc.emoji : '🔒'}</span>
          <span>${acc.name}</span>
        </button>
      `;
    }).join('');

    el.accessoryOptions.querySelectorAll('[data-acc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.dataset.unlocked !== 'true') {
          showToast('🔒 아이템 샵에서 먼저 구매해 잠금을 해제해 주세요!');
          return;
        }
        draftAvatar.accessory = btn.dataset.acc;
        renderStudioControls();
      });
    });

    el.personalityOptions.innerHTML = DATA.PERSONALITIES.map(
      (p) => `<button type="button" class="chip-btn ${draftAvatar.personality === p ? 'active' : ''}" data-personality="${p}">${p}</button>`
    ).join('');

    el.personalityOptions.querySelectorAll('[data-personality]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draftAvatar.personality = btn.dataset.personality;
        renderStudioControls();
      });
    });
  }

  function initStudio() {
    el.petNameInput.addEventListener('input', (e) => {
      draftAvatar.name = e.target.value.trim() || '몽이';
      el.previewName.textContent = draftAvatar.name;
    });
    el.petTagInput.addEventListener('input', (e) => {
      draftAvatar.tagText = e.target.value.trim() || 'PAW-0127';
      el.previewTagBadge.textContent = `🏷️ ${draftAvatar.tagText}`;
    });

    el.saveAvatarBtn.addEventListener('click', () => {
      state.avatar = { ...draftAvatar };
      DATA.saveState(state);
      world.updatePlayerAvatar(state.avatar);
      world.triggerEmote('✨', '새 모습으로 산책 출발!');
      renderTopBar();
      renderAIPersona();
      renderRealGoods();
      if (myRoomEngine) myRoomEngine.syncPets();
      renderInvitePets();
      el.saveFeedback.textContent = '✓ 산책로 · 마이 룸 · 실물 굿즈 프리뷰에 모두 적용됐어요!';
      showToast('✨ 산책로·마이룸·실물 굿즈에 적용되었습니다!');
      setTimeout(() => (el.saveFeedback.textContent = ''), 2500);
    });

    renderStudioControls();
    renderPreviewCanvas();
  }

  // Shop
  function renderShop() {
    const items = activeShopCategory === 'all' ? DATA.SHOP_ITEMS : DATA.SHOP_ITEMS.filter((i) => i.category === activeShopCategory);
    el.shopGrid.innerHTML = items
      .map((item) => {
        const owned = state.ownedItems.includes(item.id);
        const isConsumable = item.category === 'treat';
        return `
          <article class="shop-card">
            <div class="shop-thumb-wrap">
              <img src="${item.photoUrl}" alt="${item.name}" loading="lazy" />
              <span class="shop-emoji-badge">${item.emoji}</span>
            </div>
            <div class="shop-body">
              <span class="shop-cat">${item.categoryLabel}</span>
              <h3 class="shop-title">${item.name}</h3>
              <p class="shop-desc">${item.desc}</p>
              <div class="shop-bottom">
                <span class="shop-price">🪙 ${item.price} P</span>
                <button class="btn ${owned && !isConsumable ? 'btn-secondary' : 'btn-primary'} btn-sm" data-buy="${item.id}" ${owned && !isConsumable ? 'disabled' : ''}>
                  ${owned && !isConsumable ? '보유 중 ✓' : '구매하기'}
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    el.shopGrid.querySelectorAll('[data-buy]').forEach((btn) => {
      btn.addEventListener('click', () => handleBuy(btn.dataset.buy));
    });
  }

  function handleBuy(itemId) {
    const item = DATA.SHOP_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    if (state.coins < item.price) {
      showToast('🪙 포우코인이 부족해요!');
      return;
    }
    state.coins -= item.price;
    if (item.category !== 'treat' && !state.ownedItems.includes(item.id)) {
      state.ownedItems.push(item.id);
    }

    if (item.accessoryId) {
      draftAvatar.accessory = item.accessoryId;
      state.avatar.accessory = item.accessoryId;
      world.updatePlayerAvatar(state.avatar);
      renderStudioControls();
      showToast(`${item.emoji} ${item.name} 구매 & 바로 착용 완료!`);
    } else if (item.category === 'treat') {
      world.performCareVisual('feed');
      adjustStats({ fullness: 25, affection: 10, stress: -12 });
      gainExp(15);
      showToast(`${item.emoji} ${item.name} 냠냠! 포만감·애정도 상승!`);
    } else {
      renderRoomControls();
      showToast(`${item.emoji} ${item.name} 잠금 해제! 마이 룸에서 배치해 보세요!`);
    }

    DATA.saveState(state);
    renderTopBar();
    renderShop();
  }

  function initShop() {
    el.shopFilters.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        el.shopFilters.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeShopCategory = btn.dataset.category;
        renderShop();
      });
    });
    renderShop();
  }

  // Community
  function renderComposerPhotos() {
    const choices = [
      DATA.PEXELS_PHOTOS.walkPark,
      DATA.PEXELS_PHOTOS.catCafe,
      DATA.PEXELS_PHOTOS.walkGarden,
      DATA.PEXELS_PHOTOS.walkArena
    ];
    el.composerPhotoRow.innerHTML = choices
      .map(
        (url, i) => `<button type="button" class="composer-photo-btn ${selectedPostPhoto === url ? 'active' : ''}" data-post-photo="${url}" aria-label="사진 ${i + 1}"><img src="${url}" alt="첨부 사진 ${i + 1}" loading="lazy" /></button>`
      )
      .join('');

    el.composerPhotoRow.querySelectorAll('[data-post-photo]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedPostPhoto = btn.dataset.postPhoto;
        renderComposerPhotos();
      });
    });
  }

  function renderCommunity() {
    el.communityFeed.innerHTML = state.posts
      .map(
        (post) => `
        <article class="post-card">
          ${post.photoUrl ? `<img class="post-photo" src="${post.photoUrl}" alt="커뮤니티 사진" loading="lazy" />` : ''}
          <div class="post-inner">
            <div class="post-meta">
              <span class="post-tag">${post.category}</span>
              <span>${post.time}</span>
            </div>
            <p class="post-body"></p>
            <div class="post-footer">
              <span class="post-author-wrap">
                <img class="post-author-img" src="${post.authorAvatar || DATA.PEXELS_PHOTOS.dogGolden}" alt="${escapeHtml(post.author)}" loading="lazy" />
                <strong>${escapeHtml(post.author)}</strong>
              </span>
              <button class="like-btn ${post.liked ? 'liked' : ''}" data-like="${post.id}">❤️ ${post.likes}</button>
            </div>
          </div>
        </article>
      `
      )
      .join('');

    el.communityFeed.querySelectorAll('.post-card').forEach((card, idx) => {
      card.querySelector('.post-body').textContent = state.posts[idx].content;
    });

    el.communityFeed.querySelectorAll('[data-like]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const post = state.posts.find((p) => p.id === btn.dataset.like);
        if (!post) return;
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        DATA.saveState(state);
        renderCommunity();
      });
    });
  }

  function initCommunity() {
    renderSitterRequests();
    renderComposerPhotos();
    el.postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = el.postContent.value.trim();
      if (!content) return;

      state.posts.unshift({
        id: `post-${Date.now()}`,
        category: el.postCategory.value,
        author: `${state.avatar.name} 집사`,
        authorAvatar: state.avatar.photoUrl,
        photoUrl: selectedPostPhoto,
        time: '방금 전',
        content,
        likes: 1,
        liked: true
      });
      state.coins += 30;
      DATA.saveState(state);
      el.postContent.value = '';
      renderTopBar();
      renderCommunity();
      showToast('✍️ 게시글이 등록되었어요! (+30 P 보너스)');
    });
    renderCommunity();
  }

  function initNavHighlight() {
    const sections = ['world', 'ai-hub', 'myroom', 'videos', 'studio', 'adoption', 'community'];
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener(
      'scroll',
      () => {
        const scrollPos = window.scrollY + 140;
        let current = 'world';
        for (const id of sections) {
          const sec = document.getElementById(id);
          if (sec && sec.offsetTop <= scrollPos) current = id;
        }
        links.forEach((l) => l.classList.toggle('active', l.dataset.section === current));
      },
      { passive: true }
    );
  }

  // Boot all 5 pillars!
  initHeroVideo();
  renderTopBar();
  renderStatsAndGrowth();
  renderZoneHeader();
  renderNearbyPets();
  initSidebarTabs();
  initChat();
  initWorldControls();
  initCareActions();
  initPedometer();
  initAIHub();
  initMyRoom();
  renderZones();
  initVideoLounge();
  initStudio();
  initShop();
  renderAdoptionQuests();
  renderRealGoods();
  initCommunity();
  initNavHighlight();
})();
