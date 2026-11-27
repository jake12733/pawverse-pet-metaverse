window.PawVerseMyRoom = (() => {
  const { ROOM_THEMES, ROOM_ITEMS, LIVE_VIDEOS, PET_SPRITES, PEXELS_PHOTOS } = window.PAWVERSE_DATA;
  const { drawPetCharacter, getCachedImage } = window.PawVerseWorld;

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCoverRect(ctx, img, x, y, w, h) {
    const iw = img.naturalWidth || img.width || 16;
    const ih = img.naturalHeight || img.height || 9;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  class MyRoomEngine {
    constructor(canvas, state, callbacks = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.state = state;
      this.callbacks = callbacks;

      this.draggingIdx = -1;
      this.selectedIdx = -1;
      this.camX = 0;
      this.targetCamX = 0;
      this.sparkles = [];

      // Offscreen HTML5 video element rendered directly onto the gallery wall screen!
      this.wallVideo = document.createElement('video');
      this.wallVideo.muted = true;
      this.wallVideo.loop = true;
      this.wallVideo.playsInline = true;
      this.wallVideo.crossOrigin = 'anonymous';
      this.videoPlaying = true;
      this._loadWallVideo(state.myRoom.videoIndex || 0);

      // Preload architectural spaces and sprites
      ROOM_THEMES.forEach((t) => getCachedImage(t.bgUrl));
      ROOM_ITEMS.forEach((i) => i.photoUrl && getCachedImage(i.photoUrl));
      Object.values(PET_SPRITES).forEach((s) => getCachedImage(s.spriteUrl));

      // Multi-pet actors inside your architectural space (Main pet + up to 2 invited pets!)
      this.actors = [];
      this.syncPets();

      this._bindEvents();
      this._loop = this._loop.bind(this);
      requestAnimationFrame(this._loop);
    }

    _getAllItemMeta(itemId) {
      const custom = (this.state.myRoom.customCatalog || []).find((c) => c.id === itemId);
      if (custom) return custom;
      return ROOM_ITEMS.find((i) => i.id === itemId) || null;
    }

    _loadWallVideo(idx) {
      const safeIdx = ((idx % LIVE_VIDEOS.length) + LIVE_VIDEOS.length) % LIVE_VIDEOS.length;
      this.state.myRoom.videoIndex = safeIdx;
      const vid = LIVE_VIDEOS[safeIdx];
      this.wallVideo.src = vid.videoUrl;
      this.wallVideo.poster = vid.posterUrl;
      getCachedImage(vid.posterUrl);
      if (this.videoPlaying) {
        this.wallVideo.play().catch(() => {});
      }
    }

    cycleWallVideo() {
      this._loadWallVideo((this.state.myRoom.videoIndex || 0) + 1);
      if (this.callbacks.onLayoutChange) this.callbacks.onLayoutChange();
      return LIVE_VIDEOS[this.state.myRoom.videoIndex];
    }

    syncPets() {
      const prevMap = new Map(this.actors.map((a) => [a.key, a]));
      const list = [];

      // Player main pet
      const mainPrev = prevMap.get('main');
      list.push({
        key: 'main',
        isPlayer: true,
        pet: this.state.avatar,
        x: mainPrev ? mainPrev.x : 455,
        y: mainPrev ? mainPrev.y : 425,
        targetX: mainPrev ? mainPrev.targetX : 455,
        targetY: mainPrev ? mainPrev.targetY : 425,
        facing: mainPrev ? mainPrev.facing : 1,
        walkPhase: 0,
        isMoving: false,
        pose: null,
        bubble: mainPrev ? mainPrev.bubble : { text: '나만의 실사 갤러리 공간이야! ✨', timer: 180 },
        aiTimer: 80
      });

      // Invited friend pets (Spatial "강아지 3둥이" or dog + cat + bunny playroom!)
      const invited = this.state.myRoom.invitedSpriteIds || [];
      const presets = {
        dog_golden: { name: '해피', species: 'dog', accessory: 'scarf' },
        dog_brown: { name: '초코', species: 'dog', accessory: 'none' },
        cat_ginger: { name: '모찌', species: 'cat', accessory: 'ribbon' },
        rabbit_white: { name: '두부', species: 'rabbit', accessory: 'sprout' },
        hamster_cream: { name: '코코', species: 'hamster', accessory: 'crown' }
      };

      invited.slice(0, 2).forEach((spriteId, idx) => {
        const key = `guest_${spriteId}`;
        const prev = prevMap.get(key);
        const info = presets[spriteId] || { name: '친구', species: 'dog', accessory: 'none' };
        list.push({
          key,
          isPlayer: false,
          pet: { ...info, spriteId },
          x: prev ? prev.x : idx === 0 ? 290 : 625,
          y: prev ? prev.y : idx === 0 ? 445 : 405,
          targetX: prev ? prev.targetX : idx === 0 ? 290 : 625,
          targetY: prev ? prev.targetY : idx === 0 ? 445 : 405,
          facing: idx === 0 ? 1 : -1,
          walkPhase: idx * 2,
          isMoving: false,
          pose: null,
          bubble: null,
          aiTimer: 110 + idx * 55
        });
      });

      this.actors = list;
    }

    spawnSparkles(x, y, emoji = '✨') {
      for (let i = 0; i < 8; i++) {
        this.sparkles.push({
          x: x + (Math.random() - 0.5) * 60,
          y: y + (Math.random() - 0.5) * 40,
          vy: -0.9 - Math.random() * 0.9,
          vx: (Math.random() - 0.5) * 1.1,
          emoji,
          life: 60 + Math.random() * 20
        });
      }
    }

    setSelectedScale(scaleVal) {
      if (this.selectedIdx < 0 || !this.state.myRoom.placed[this.selectedIdx]) return;
      this.state.myRoom.placed[this.selectedIdx].scale = scaleVal;
      if (this.callbacks.onLayoutChange) this.callbacks.onLayoutChange();
    }

    deleteSelected() {
      if (this.selectedIdx < 0 || !this.state.myRoom.placed[this.selectedIdx]) return;
      this.state.myRoom.placed.splice(this.selectedIdx, 1);
      this.selectedIdx = -1;
      if (this.callbacks.onSelectChange) this.callbacks.onSelectChange(-1);
      if (this.callbacks.onLayoutChange) this.callbacks.onLayoutChange();
    }

    captureSnapshot() {
      try {
        return this.canvas.toDataURL('image/png');
      } catch {
        return null;
      }
    }

    _getTheme() {
      return ROOM_THEMES.find((t) => t.id === this.state.myRoom.themeId) || ROOM_THEMES[0];
    }

    _getFloorBounds() {
      const theme = this._getTheme();
      const minY = Math.round(this.height * (theme.horizonRatio || 0.62));
      return { minX: 76, maxX: this.width - 76, minY, maxY: this.height - 28 };
    }

    _getDepthScale(y) {
      const { minY, maxY } = this._getFloorBounds();
      const t = Math.max(0, Math.min(1, (y - minY) / Math.max(1, maxY - minY)));
      return 0.64 + t * 0.50;
    }

    _getCoords(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) * this.width) / rect.width,
        y: ((e.clientY - rect.top) * this.height) / rect.height
      };
    }

    _bindEvents() {
      this.canvas.addEventListener('pointerdown', (e) => {
        const { x, y } = this._getCoords(e);
        const theme = this._getTheme();

        // 1. Click wall video screen to switch live pet video!
        if (this.state.myRoom.showVideoWall && theme.wallScreen) {
          const s = theme.wallScreen;
          const sx = s.x - s.w / 2 + this.camX * 0.6;
          const sy = s.y - s.h / 2;
          if (x >= sx && x <= sx + s.w && y >= sy && y <= sy + s.h) {
            const nextVid = this.cycleWallVideo();
            this.spawnSparkles(s.x, s.y, '🎬');
            if (this.callbacks.onVideoSwitch) this.callbacks.onVideoSwitch(nextVid);
            return;
          }
        }

        // 2. Check furniture/objects for drag-and-drop selection
        const placed = this.state.myRoom.placed;
        for (let i = placed.length - 1; i >= 0; i--) {
          if (Math.hypot(placed[i].x - x, placed[i].y - y) < 44) {
            this.draggingIdx = i;
            this.selectedIdx = i;
            this.canvas.style.cursor = 'grabbing';
            if (this.callbacks.onSelectChange) this.callbacks.onSelectChange(i);
            return;
          }
        }

        // 3. Deselect & call main pet to floor spot
        this.selectedIdx = -1;
        if (this.callbacks.onSelectChange) this.callbacks.onSelectChange(-1);
        const b = this._getFloorBounds();
        const mainActor = this.actors[0];
        if (mainActor) {
          mainActor.targetX = Math.max(b.minX, Math.min(b.maxX, x));
          mainActor.targetY = Math.max(b.minY, Math.min(b.maxY, y));
          mainActor.pose = null;
        }
      });

      this.canvas.addEventListener('pointermove', (e) => {
        const { x, y } = this._getCoords(e);
        this.targetCamX = ((x / this.width) - 0.5) * -28;

        if (this.draggingIdx === -1) return;
        const item = this.state.myRoom.placed[this.draggingIdx];
        if (!item) return;
        const b = this._getFloorBounds();
        item.x = Math.max(b.minX, Math.min(b.maxX, x));
        item.y = Math.max(b.minY - 12, Math.min(b.maxY - 8, y));
      });

      window.addEventListener('pointerup', () => {
        if (this.draggingIdx !== -1) {
          this.draggingIdx = -1;
          this.canvas.style.cursor = 'grab';
          if (this.callbacks.onLayoutChange) this.callbacks.onLayoutChange();
        }
      });
    }

    _update() {
      this.camX += (this.targetCamX - this.camX) * 0.05;
      const b = this._getFloorBounds();
      const placed = this.state.myRoom.placed;

      for (const actor of this.actors) {
        // Keep actor pet synced with latest avatar changes
        if (actor.isPlayer) actor.pet = this.state.avatar;

        const dx = actor.targetX - actor.x;
        const dy = actor.targetY - actor.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 4) {
          const speed = actor.isPlayer ? 2.1 : 1.55;
          actor.x += (dx / dist) * speed;
          actor.y += (dy / dist) * speed;
          if (Math.abs(dx) > 0.8) actor.facing = dx > 0 ? 1 : -1;
          actor.walkPhase += 0.21;
          actor.isMoving = true;
        } else {
          actor.isMoving = false;
          actor.aiTimer -= 1;

          if (actor.aiTimer <= 0) {
            if (placed.length > 0 && Math.random() < 0.78) {
              const targetObj = placed[Math.floor(Math.random() * placed.length)];
              const meta = this._getAllItemMeta(targetObj.itemId);
              actor.targetX = Math.max(b.minX, Math.min(b.maxX, targetObj.x + (Math.random() > 0.5 ? 28 : -28)));
              actor.targetY = Math.max(b.minY, Math.min(b.maxY, targetObj.y + 10));
              if (meta) {
                setTimeout(() => {
                  if (meta.actionType === 'nap') actor.pose = 'sleep';
                  else if (meta.actionType === 'play') actor.pose = 'happy';
                  else actor.pose = 'tilt';
                  actor.bubble = { text: meta.actionText, timer: 195 };
                }, 950);
              }
            } else {
              actor.pose = null;
              actor.targetX = b.minX + 30 + Math.random() * (b.maxX - b.minX - 60);
              actor.targetY = b.minY + 15 + Math.random() * (b.maxY - b.minY - 30);
            }
            actor.aiTimer = 170 + Math.random() * 160;
          }
        }

        if (actor.bubble) {
          actor.bubble.timer -= 1;
          if (actor.bubble.timer <= 0) actor.bubble = null;
        }
      }

      for (let i = this.sparkles.length - 1; i >= 0; i--) {
        const sp = this.sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.life -= 1;
        if (sp.life <= 0) this.sparkles.splice(i, 1);
      }
    }

    _drawArchitecturalSpace(ctx) {
      const theme = this._getTheme();
      const bgImg = getCachedImage(theme.bgUrl);
      const w = this.width;
      const h = this.height;
      const warmth = this.state.myRoom.warmth ?? theme.defaultWarmth ?? 12;

      if (bgImg) {
        const iw = bgImg.naturalWidth || bgImg.width;
        const ih = bgImg.naturalHeight || bgImg.height;
        const scale = Math.max((w * 1.09) / iw, (h * 1.09) / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2 + this.camX;
        const dy = (h - dh) / 2;

        ctx.save();
        if (warmth > 0) {
          ctx.filter = `sepia(${(warmth / 140).toFixed(2)}) saturate(${(1 + warmth / 120).toFixed(2)})`;
        }
        ctx.drawImage(bgImg, dx, dy, dw, dh);
        ctx.filter = 'none';
        ctx.restore();
      } else {
        ctx.fillStyle = '#EFE9E1';
        ctx.fillRect(0, 0, w, h);
      }

      // Architectural Track Spotlights glow cones
      if (this.state.myRoom.spotlights) {
        ctx.save();
        const spots = [w * 0.25, w * 0.5, w * 0.76];
        for (const sx of spots) {
          const g = ctx.createRadialGradient(sx + this.camX * 0.5, 40, 10, sx + this.camX * 0.5, 220, 220);
          g.addColorStop(0, 'rgba(255, 248, 224, 0.24)');
          g.addColorStop(1, 'rgba(255, 248, 224, 0)');
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, w, h * 0.7);
        }
        ctx.restore();
      }

      // Spatial Gallery Photo Frames on the wall
      const photos = this.state.myRoom.galleryPhotos || [PEXELS_PHOTOS.dogGolden, PEXELS_PHOTOS.catCafe];
      (theme.frames || []).forEach((fr, idx) => {
        const fx = fr.x - fr.w / 2 + this.camX * 0.6;
        const fy = fr.y - fr.h / 2;
        const pUrl = photos[idx % photos.length];
        const pImg = getCachedImage(pUrl);

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.28)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 6;
        ctx.fillStyle = '#1E1D1B';
        roundRect(ctx, fx - 5, fy - 5, fr.w + 10, fr.h + 10, 4);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = '#F7F5F0';
        ctx.fillRect(fx, fy, fr.w, fr.h);

        if (pImg) {
          drawCoverRect(ctx, pImg, fx + 5, fy + 5, fr.w - 10, fr.h - 10);
        }
        ctx.restore();
      });

      // Spatial Wall-Mounted Playable Live Pet Video Display!
      if (this.state.myRoom.showVideoWall && theme.wallScreen) {
        const s = theme.wallScreen;
        const sx = s.x - s.w / 2 + this.camX * 0.6;
        const sy = s.y - s.h / 2;
        const curVid = LIVE_VIDEOS[this.state.myRoom.videoIndex || 0] || LIVE_VIDEOS[0];
        const posterImg = getCachedImage(curVid.posterUrl);

        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.36)';
        ctx.shadowBlur = 22;
        ctx.shadowOffsetY = 8;
        ctx.fillStyle = '#141416';
        roundRect(ctx, sx - 6, sy - 6, s.w + 12, s.h + 12, 8);
        ctx.fill();
        ctx.shadowColor = 'transparent';

        if (this.wallVideo.readyState >= 2) {
          ctx.save();
          roundRect(ctx, sx, sy, s.w, s.h, 4);
          ctx.clip();
          ctx.drawImage(this.wallVideo, sx, sy, s.w, s.h);
          ctx.restore();
        } else if (posterImg) {
          drawCoverRect(ctx, posterImg, sx, sy, s.w, s.h);
        }

        // Subtle glass bezel highlight & LIVE pill
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        roundRect(ctx, sx, sy, s.w, s.h, 4);
        ctx.stroke();

        ctx.fillStyle = 'rgba(18, 18, 22, 0.72)';
        roundRect(ctx, sx + 7, sy + 7, 74, 18, 9);
        ctx.fill();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '700 9.5px Pretendard, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText('▶ 클릭·전환', sx + 14, sy + 16.5);
        ctx.restore();
      }
    }

    _drawPlacedObject(ctx, placedItem, idx) {
      const meta = this._getAllItemMeta(placedItem.itemId);
      if (!meta) return;
      const ds = this._getDepthScale(placedItem.y) * (placedItem.scale || 1);
      const isSelected = idx === this.selectedIdx;
      const isDragging = idx === this.draggingIdx;
      const cardW = 74 * ds;
      const cardH = 54 * ds;

      ctx.save();
      ctx.translate(placedItem.x, placedItem.y);

      // Soft architectural floor shadow
      const shGrad = ctx.createRadialGradient(0, 6 * ds, 4, 0, 6 * ds, cardW * 0.6);
      shGrad.addColorStop(0, 'rgba(15, 14, 12, 0.34)');
      shGrad.addColorStop(1, 'rgba(15, 14, 12, 0)');
      ctx.fillStyle = shGrad;
      ctx.beginPath();
      ctx.ellipse(0, 6 * ds, cardW * 0.6, 13 * ds, 0, 0, Math.PI * 2);
      ctx.fill();

      // Frosted architectural object plinth / photo-backed preview card
      const photoImg = meta.photoUrl ? getCachedImage(meta.photoUrl) : null;
      ctx.fillStyle = isSelected ? 'rgba(255, 255, 255, 0.96)' : 'rgba(255, 255, 255, 0.88)';
      ctx.strokeStyle = isDragging || isSelected ? '#FF7A59' : 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = isSelected ? 2.8 : 1.8;
      roundRect(ctx, -cardW / 2, -cardH, cardW, cardH, 14 * ds);
      ctx.fill();

      if (photoImg) {
        ctx.save();
        roundRect(ctx, -cardW / 2 + 3, -cardH + 3, cardW - 6, cardH - 6, 11 * ds);
        ctx.clip();
        drawCoverRect(ctx, photoImg, -cardW / 2 + 3, -cardH + 3, cardW - 6, cardH - 6);
        ctx.restore();
      } else {
        ctx.font = `${Math.round(28 * ds)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(meta.emoji || '✨', 0, -cardH * 0.5);
      }

      // Corner emoji badge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.beginPath();
      ctx.arc(cardW / 2 - 4, -cardH + 4, 12 * ds, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = `${Math.round(13 * ds)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(meta.emoji || '✨', cardW / 2 - 4, -cardH + 5);

      roundRect(ctx, -cardW / 2, -cardH, cardW, cardH, 14 * ds);
      ctx.stroke();

      // Clean floating label
      ctx.font = '700 10.5px Pretendard, sans-serif';
      const tw = ctx.measureText(meta.name).width + 14;
      ctx.fillStyle = isSelected ? 'rgba(255, 122, 89, 0.95)' : 'rgba(20, 18, 16, 0.72)';
      roundRect(ctx, -tw / 2, 7 * ds, tw, 19, 9.5);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(meta.name, 0, 7 * ds + 9.8);
      ctx.restore();
    }

    _render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      this._drawArchitecturalSpace(ctx);

      const placed = this.state.myRoom.placed;
      const renderables = [
        ...placed.map((p, idx) => ({ type: 'item', y: p.y, data: p, idx })),
        ...this.actors.map((a) => ({ type: 'pet', y: a.y + 4, actor: a }))
      ].sort((a, b) => a.y - b.y);

      const bubbles = [];
      const isAtrium = this.state.myRoom.themeId === 'atrium';

      for (const r of renderables) {
        if (r.type === 'item') {
          this._drawPlacedObject(ctx, r.data, r.idx);
        } else {
          const a = r.actor;
          const ds = this._getDepthScale(a.y);
          const anchors = drawPetCharacter(ctx, a.pet, {
            x: a.x,
            y: a.y,
            scale: ds,
            walkPhase: a.walkPhase,
            isMoving: a.isMoving,
            facing: a.facing,
            isPlayer: a.isPlayer,
            showName: true,
            timeOfDay: isAtrium ? 'sunset' : 'day',
            pose: a.pose
          });
          if (a.bubble) {
            bubbles.push({ x: a.x, topY: anchors.topY, text: a.bubble.text });
          }
        }
      }

      // Sparkle spawn FX
      for (const sp of this.sparkles) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, sp.life / 70);
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText(sp.emoji, sp.x, sp.y);
        ctx.restore();
      }

      // Speech bubbles
      for (const b of bubbles) {
        ctx.save();
        ctx.font = '600 12px Pretendard, sans-serif';
        const tw = Math.min(230, ctx.measureText(b.text).width + 22);
        const bx = Math.max(12, Math.min(this.width - tw - 12, b.x - tw / 2));
        const by = Math.max(48, b.topY - 32);
        ctx.shadowColor = 'rgba(0,0,0,0.18)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = 'rgba(255,255,255,0.96)';
        roundRect(ctx, bx, by, tw, 28, 13);
        ctx.fill();
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = '#22201D';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(b.text, bx + tw / 2, by + 14.5, tw - 12);
        ctx.restore();
      }
    }

    _loop() {
      this._update();
      this._render();
      requestAnimationFrame(this._loop);
    }
  }

  return { MyRoomEngine };
})();
