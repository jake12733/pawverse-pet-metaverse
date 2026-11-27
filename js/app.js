(() => {
  const DATA = window.PAWVERSE_DATA;
  const { WorldEngine, drawPetCharacter, getCachedImage } = window.PawVerseWorld;

  const state = DATA.loadState();
  let draftAvatar = { ...state.avatar };
  let activeShopCategory = 'all';
  let activeHeroVideoId = DATA.LIVE_VIDEOS[0].id;
  let selectedPostPhoto = DATA.PEXELS_PHOTOS.dogPark;

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
    metaverseCanvas: document.getElementById('metaverseCanvas'),
    centerCameraBtn: document.getElementById('centerCameraBtn'),
    nearbyList: document.getElementById('nearbyList'),
    nearbyCount: document.getElementById('nearbyCount'),
    chatMessages: document.getElementById('chatMessages'),
    chatForm: document.getElementById('chatForm'),
    chatInput: document.getElementById('chatInput'),
    videoGrid: document.getElementById('videoGrid'),
    zonesGrid: document.getElementById('zonesGrid'),
    previewCanvas: document.getElementById('previewCanvas'),
    previewName: document.getElementById('previewName'),
    previewPersonality: document.getElementById('previewPersonality'),
    petNameInput: document.getElementById('petNameInput'),
    speciesOptions: document.getElementById('speciesOptions'),
    photoPickerGrid: document.getElementById('photoPickerGrid'),
    colorSwatches: document.getElementById('colorSwatches'),
    accessoryOptions: document.getElementById('accessoryOptions'),
    personalityOptions: document.getElementById('personalityOptions'),
    saveAvatarBtn: document.getElementById('saveAvatarBtn'),
    saveFeedback: document.getElementById('saveFeedback'),
    shopFilters: document.getElementById('shopFilters'),
    shopGrid: document.getElementById('shopGrid'),
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
    toastTimer = setTimeout(() => el.toast.classList.remove('show'), 2600);
  }

  function getSpeciesEmoji(speciesId) {
    return (DATA.SPECIES.find((s) => s.id === speciesId) || DATA.SPECIES[0]).emoji;
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

  // Preload portraits for instant Canvas rendering
  DATA.PET_PORTRAITS.forEach((p) => getCachedImage(p.url));

  // Hero Live Video Switcher
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
      (v) => `
      <button type="button" class="channel-pill ${v.id === activeHeroVideoId ? 'active' : ''}" data-video-id="${v.id}">
        ${v.tabLabel}
      </button>
    `
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

  // Video Lounge Cards & Fullscreen Modal
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

      card.addEventListener('mouseenter', () => {
        vid.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        vid.pause();
      });
      card.addEventListener('click', () => {
        if (item) openVideoModal(item);
      });
    });

    el.closeVideoModal.addEventListener('click', closeModal);
    el.videoModal.addEventListener('click', (e) => {
      if (e.target === el.videoModal) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !el.videoModal.hidden) closeModal();
    });
  }

  // Initialize Metaverse World Engine
  const world = new WorldEngine(el.metaverseCanvas, state);

  function renderTopBar() {
    el.coinBalance.textContent = state.coins.toLocaleString('ko-KR');
    el.hudAvatarImg.src = state.avatar.photoUrl;
    el.hudPetText.textContent = `${state.avatar.name} · ${state.avatar.personality}`;
  }

  function renderZoneHeader() {
    const zone = DATA.ZONES.find((z) => z.id === state.zoneId) || DATA.ZONES[0];
    el.currentZoneTitle.textContent = `${zone.icon} ${zone.name}`;
    el.currentZoneDesc.textContent = `${zone.desc} 바닥을 클릭하거나 WASD로 이동해 보세요.`;
  }

  // Nearby Pets with Real Pexels Thumbnails
  function renderNearbyPets() {
    el.nearbyCount.textContent = `${DATA.NPCS.length + 1}마리`;
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

  // Chat Feed
  function appendChat(sender, text, isMine = false) {
    const div = document.createElement('div');
    div.className = `chat-msg ${isMine ? 'mine' : ''}`;
    div.innerHTML = `<span class="chat-sender">${escapeHtml(sender)}</span><span></span>`;
    div.querySelector('span:last-child').textContent = text;
    el.chatMessages.appendChild(div);
    el.chatMessages.scrollTop = el.chatMessages.scrollHeight;
  }

  function initChat() {
    appendChat('🐾 시스템', 'Pexels 실사 포토 아바타 모드로 햇살 공원에 입장했어요!');
    appendChat('🐶 초코', '안녕! 오늘 잔디밭 산책하기 딱 좋은 날이야~');
    appendChat('🐱 모찌', '위에 라이브 캠 영상도 진짜 힐링된다 냥!');

    el.chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = el.chatInput.value.trim();
      if (!text) return;
      const label = `${getSpeciesEmoji(state.avatar.species)} ${state.avatar.name}`;
      appendChat(label, text, true);
      world.say(text);
      el.chatInput.value = '';
    });
  }

  // Emotes, Avatar Mode & Time of Day Controls
  function initWorldControls() {
    document.querySelectorAll('.emote-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        world.triggerEmote(btn.dataset.emote, btn.dataset.text);
      });
    });

    document.querySelectorAll('[data-avatar-mode]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.avatarMode === state.avatarMode);
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-avatar-mode]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.avatarMode = btn.dataset.avatarMode;
        world.setAvatarMode(state.avatarMode);
        DATA.saveState(state);
        showToast(state.avatarMode === 'photo' ? '📸 실사 포토 아바타 모드로 전환!' : '🎨 일러스트 아바타 모드로 전환!');
      });
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

  // World Zones Cards with Real Pexels Cover Photos
  function renderZones() {
    el.zonesGrid.innerHTML = DATA.ZONES.map((zone) => {
      const active = zone.id === state.zoneId;
      return `
        <article class="zone-card ${active ? 'active' : ''}" data-zone-id="${zone.id}">
          <div class="zone-cover">
            <img src="${zone.coverPhoto}" alt="${zone.name}" loading="lazy" />
            <span class="zone-cover-badge">${zone.icon} ${active ? '현재 위치' : `${zone.visitors}마리 접속`}</span>
          </div>
          <div class="zone-content">
            <h3 class="zone-title">${zone.name}</h3>
            <p class="zone-desc">${zone.desc}</p>
            <div class="zone-footer">
              <span>🟢 실시간 산책 가능</span>
              <span>${active ? '입장 중 ✓' : '이동하기 →'}</span>
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
        appendChat('🐾 시스템', `${zone.name}(으)로 이동했습니다.`);
        showToast(`${zone.icon} ${zone.name}에 입장했어요!`);
        document.getElementById('world').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  // Avatar Studio Preview
  function renderPreviewCanvas() {
    const ctx = el.previewCanvas.getContext('2d');
    const w = el.previewCanvas.width;
    const h = el.previewCanvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(255, 122, 89, 0.12)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.74, 78, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    const bob = Math.sin(performance.now() * 0.004) * 0.5;
    drawPetCharacter(ctx, draftAvatar, {
      x: w / 2,
      y: h * 0.65,
      scale: 2.35,
      bob,
      facing: 1,
      isPlayer: false,
      showName: false,
      mode: state.avatarMode
    });
    requestAnimationFrame(renderPreviewCanvas);
  }

  function isAccessoryUnlocked(acc) {
    return acc.free || state.ownedItems.includes(acc.shopId);
  }

  function renderStudioControls() {
    el.petNameInput.value = draftAvatar.name;
    el.previewName.textContent = draftAvatar.name || '이름 없음';
    el.previewPersonality.textContent = draftAvatar.personality;

    // Species buttons with real pet thumbnails
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
        draftAvatar.photoUrl = sp.defaultPhoto;
        getCachedImage(sp.defaultPhoto);
        renderStudioControls();
      });
    });

    // Real Pexels Pet Portrait Picker
    el.photoPickerGrid.innerHTML = DATA.PET_PORTRAITS.map(
      (p) => `
      <button type="button" class="photo-choice ${draftAvatar.photoUrl === p.url ? 'active' : ''}" data-photo-url="${p.url}" data-photo-species="${p.species}">
        <img src="${p.url}" alt="${p.label}" loading="lazy" />
        <span>${p.label}</span>
      </button>
    `
    ).join('');

    el.photoPickerGrid.querySelectorAll('[data-photo-url]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draftAvatar.photoUrl = btn.dataset.photoUrl;
        draftAvatar.species = btn.dataset.photoSpecies;
        getCachedImage(draftAvatar.photoUrl);
        renderStudioControls();
      });
    });

    // Colors
    el.colorSwatches.innerHTML = DATA.COLORS.map(
      (c) => `
      <button
        type="button"
        class="swatch-btn ${draftAvatar.color === c.hex ? 'active' : ''}"
        style="background:${c.hex}"
        title="${c.name}"
        aria-label="${c.name}"
        data-color="${c.hex}"
      ></button>
    `
    ).join('');

    el.colorSwatches.querySelectorAll('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        draftAvatar.color = btn.dataset.color;
        renderStudioControls();
      });
    });

    // Accessories
    el.accessoryOptions.innerHTML = DATA.ACCESSORIES.map((acc) => {
      const unlocked = isAccessoryUnlocked(acc);
      return `
        <button
          type="button"
          class="option-btn ${draftAvatar.accessory === acc.id ? 'active' : ''} ${unlocked ? '' : 'locked'}"
          data-acc="${acc.id}"
          data-unlocked="${unlocked}"
        >
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

    // Personalities
    el.personalityOptions.innerHTML = DATA.PERSONALITIES.map(
      (p) => `
      <button type="button" class="chip-btn ${draftAvatar.personality === p ? 'active' : ''}" data-personality="${p}">
        ${p}
      </button>
    `
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

    el.saveAvatarBtn.addEventListener('click', () => {
      state.avatar = { ...draftAvatar };
      DATA.saveState(state);
      world.updatePlayerAvatar(state.avatar);
      world.triggerEmote('✨', '변신 완료!');
      renderTopBar();
      el.saveFeedback.textContent = '✓ 광장 실사 아바타에 즉시 반영되었어요!';
      showToast('✨ 실사 아바타가 광장에 적용되었습니다!');
      setTimeout(() => (el.saveFeedback.textContent = ''), 2500);
    });

    renderStudioControls();
    renderPreviewCanvas();
  }

  // Shop with Real Pexels Photos
  function renderShop() {
    const items =
      activeShopCategory === 'all'
        ? DATA.SHOP_ITEMS
        : DATA.SHOP_ITEMS.filter((i) => i.category === activeShopCategory);

    el.shopGrid.innerHTML = items
      .map((item) => {
        const owned = state.ownedItems.includes(item.id);
        const isConsumable = item.category === 'treat';
        const btnLabel = owned && !isConsumable ? '보유 중 ✓' : '구매하기';
        const disabled = owned && !isConsumable ? 'disabled' : '';
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
                <button class="btn ${owned && !isConsumable ? 'btn-secondary' : 'btn-primary'} btn-sm" data-buy="${item.id}" ${disabled}>
                  ${btnLabel}
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
      world.triggerEmote(item.emoji, `${item.name} 냠냠!`);
      showToast(`${item.emoji} ${item.name}을(를) 맛있게 먹었어요!`);
    } else {
      showToast(`${item.emoji} ${item.name}이(가) 마이 룸 보관함에 담겼어요!`);
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

  // Community with Real Pexels Photos
  function renderComposerPhotos() {
    const choices = [
      DATA.PEXELS_PHOTOS.dogPark,
      DATA.PEXELS_PHOTOS.catCafe,
      DATA.PEXELS_PHOTOS.rabbitGray,
      DATA.PEXELS_PHOTOS.flowerMeadow
    ];
    el.composerPhotoRow.innerHTML = choices
      .map(
        (url, i) => `
        <button type="button" class="composer-photo-btn ${selectedPostPhoto === url ? 'active' : ''}" data-post-photo="${url}" aria-label="사진 ${i + 1}">
          <img src="${url}" alt="첨부 사진 선택 ${i + 1}" loading="lazy" />
        </button>
      `
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
          ${post.photoUrl ? `<img class="post-photo" src="${post.photoUrl}" alt="커뮤니티 반려동물 사진" loading="lazy" />` : ''}
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
              <button class="like-btn ${post.liked ? 'liked' : ''}" data-like="${post.id}">
                ❤️ ${post.likes}
              </button>
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
    renderComposerPhotos();
    el.postForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = el.postContent.value.trim();
      if (!content) return;

      const newPost = {
        id: `post-${Date.now()}`,
        category: el.postCategory.value,
        author: `${state.avatar.name} 집사`,
        authorAvatar: state.avatar.photoUrl,
        photoUrl: selectedPostPhoto,
        time: '방금 전',
        content,
        likes: 1,
        liked: true
      };

      state.posts.unshift(newPost);
      state.coins += 30;
      DATA.saveState(state);
      el.postContent.value = '';
      renderTopBar();
      renderCommunity();
      showToast('✍️ 실사 포토 글이 등록되었어요! (+30 P 보너스)');
    });
    renderCommunity();
  }

  function initNavHighlight() {
    const sections = ['world', 'videos', 'zones', 'studio', 'shop', 'community'];
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

  // Boot
  initHeroVideo();
  initVideoLounge();
  renderTopBar();
  renderZoneHeader();
  renderNearbyPets();
  initChat();
  initWorldControls();
  renderZones();
  initStudio();
  initShop();
  initCommunity();
  initNavHighlight();
})();
