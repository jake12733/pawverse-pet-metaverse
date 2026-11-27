window.PawVerseWorld = (() => {
  const { ZONES, NPCS, PET_SPRITES, getGrowthInfo } = window.PAWVERSE_DATA;

  const imageCache = new Map();
  function getCachedImage(url) {
    if (!url) return null;
    if (imageCache.has(url)) {
      const entry = imageCache.get(url);
      return entry.loaded ? entry.img : null;
    }
    const img = new Image();
    if (/^https?:\/\//i.test(url)) img.crossOrigin = 'anonymous';
    const entry = { img, loaded: false };
    img.onload = () => {
      entry.loaded = true;
    };
    img.onerror = () => {
      entry.loaded = false;
    };
    img.src = url;
    imageCache.set(url, entry);
    return null;
  }

  function getSpriteSpec(pet) {
    if (pet.spriteId && PET_SPRITES[pet.spriteId]) return PET_SPRITES[pet.spriteId];
    const bySpecies = Object.values(PET_SPRITES).find((s) => s.species === pet.species);
    return bySpecies || PET_SPRITES.dog_golden;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawAccessoryOnSprite(ctx, accessory, spriteW, spriteH, spec) {
    if (!accessory || accessory === 'none') return;

    const hx = spec.headAnchor.x * spriteW;
    const hy = spec.headAnchor.y * spriteH;
    const nx = spec.neckAnchor.x * spriteW;
    const ny = spec.neckAnchor.y * spriteH;
    const ex = spec.eyeAnchor.x * spriteW;
    const ey = spec.eyeAnchor.y * spriteH;

    ctx.save();
    if (accessory === 'crown') {
      ctx.translate(hx, hy + 4);
      ctx.rotate(0.08);
      ctx.fillStyle = '#FFD24C';
      ctx.strokeStyle = '#A86E00';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-12, 3);
      ctx.lineTo(-14, -10);
      ctx.lineTo(-5, -4);
      ctx.lineTo(0, -14);
      ctx.lineTo(5, -4);
      ctx.lineTo(14, -10);
      ctx.lineTo(12, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FF5E57';
      ctx.beginPath();
      ctx.arc(0, -2, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (accessory === 'sprout') {
      ctx.translate(hx, hy + 5);
      ctx.strokeStyle = '#2EA86F';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, 2);
      ctx.quadraticCurveTo(2, -9, 0, -14);
      ctx.stroke();
      ctx.fillStyle = '#53D492';
      ctx.beginPath();
      ctx.ellipse(-6, -12, 6.5, 3.3, -0.45, 0, Math.PI * 2);
      ctx.ellipse(6, -12, 6.5, 3.3, 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else if (accessory === 'ribbon') {
      ctx.translate(hx - 4, hy + 6);
      ctx.fillStyle = '#FF8FB1';
      ctx.strokeStyle = '#D94D7A';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(-7, 0, 7, 4.5, -0.3, 0, Math.PI * 2);
      ctx.ellipse(7, 0, 7, 4.5, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#FF5C8D';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (accessory === 'sunglasses') {
      ctx.translate(ex, ey);
      ctx.fillStyle = 'rgba(18, 18, 24, 0.92)';
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1.2;
      roundRect(ctx, -12, -4, 11, 7.5, 3);
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, 1, -4, 11, 7.5, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillRect(-10, -2.5, 4, 2);
      ctx.fillRect(3, -2.5, 4, 2);
    } else if (accessory === 'scarf') {
      ctx.translate(nx, ny);
      ctx.rotate(0.28);
      ctx.fillStyle = '#E6493E';
      ctx.strokeStyle = '#9E241C';
      ctx.lineWidth = 1.2;
      roundRect(ctx, -16, -4, 30, 8, 4);
      ctx.fill();
      ctx.stroke();
      roundRect(ctx, -13, 2, 8, 15, 3);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPetCharacter(ctx, pet, opts = {}) {
    const {
      x = 0,
      y = 0,
      scale = 1,
      walkPhase = 0,
      isMoving = false,
      jump = 0,
      facing = 1,
      isPlayer = false,
      showName = true,
      timeOfDay = 'day',
      pose = null // 'sit' | 'paw' | 'sleep' | 'happy' | 'belly' | 'tilt'
    } = opts;

    const spec = getSpriteSpec(pet);
    const img = getCachedImage(spec.spriteUrl);

    const targetH = spec.baseHeight * scale;
    const aspect = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.32;
    const targetW = targetH * aspect;

    const now = performance.now() * 0.001;
    const strideSin = Math.sin(walkPhase);
    let trotLift = isMoving ? Math.abs(strideSin) * 7.5 * scale : 0;
    let strideTilt = isMoving ? strideSin * 0.048 * facing : Math.sin(now * 2.2) * 0.008;
    let scaleXMod = isMoving ? 1 - Math.abs(strideSin) * 0.018 : 1 - Math.sin(now * 2.6) * 0.008;
    let scaleYMod = isMoving ? 1 + Math.abs(strideSin) * 0.025 : 1 + Math.sin(now * 2.6) * 0.014;

    // Expressive AI / Care / Training pose animations
    if (pose === 'sit') {
      scaleYMod *= 0.86;
      scaleXMod *= 1.06;
      strideTilt = -0.10 * facing;
    } else if (pose === 'paw') {
      strideTilt = -0.15 * facing;
      trotLift += 6 * scale;
    } else if (pose === 'sleep') {
      scaleYMod *= 0.78;
      scaleXMod *= 1.12;
      strideTilt = 0.04 * facing;
    } else if (pose === 'belly') {
      strideTilt = Math.sin(now * 14) * 0.14;
      trotLift += Math.abs(Math.sin(now * 8)) * 5 * scale;
    } else if (pose === 'tilt') {
      strideTilt = 0.14 * facing;
    } else if (pose === 'happy') {
      strideTilt = Math.sin(now * 16) * 0.09;
      trotLift += Math.abs(Math.sin(now * 10)) * 7 * scale;
    }

    const elevation = trotLift + jump;

    // 1. Feathered ground contact shadow
    ctx.save();
    ctx.translate(x, y);
    const shadowScale = Math.max(0.55, 1 - elevation * 0.006);
    const shadowRx = targetW * 0.42 * shadowScale;
    const shadowRy = Math.max(6, targetH * 0.11 * shadowScale);

    const grad = ctx.createRadialGradient(0, 0, shadowRx * 0.1, 0, 0, shadowRx);
    const baseOpacity = timeOfDay === 'night' ? 0.52 : 0.36;
    grad.addColorStop(0, `rgba(14, 18, 12, ${baseOpacity * shadowScale})`);
    grad.addColorStop(0.6, `rgba(14, 18, 12, ${baseOpacity * 0.45 * shadowScale})`);
    grad.addColorStop(1, 'rgba(14, 18, 12, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, shadowRx, shadowRy, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isPlayer) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.ellipse(0, 2, shadowRx * 1.05, shadowRy * 1.18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // 2. Full-body photorealistic pet sprite
    ctx.save();
    ctx.translate(x, y - elevation);
    ctx.rotate(strideTilt);
    ctx.scale(facing * scaleXMod, scaleYMod);

    if (img) {
      if (timeOfDay === 'sunset') {
        ctx.filter = 'sepia(0.18) saturate(1.16) brightness(0.98)';
      } else if (timeOfDay === 'night') {
        ctx.filter = 'brightness(0.84) contrast(1.06) saturate(0.88)';
      }
      ctx.drawImage(img, -targetW / 2, -targetH + 4 * scale, targetW, targetH);
      ctx.filter = 'none';
      drawAccessoryOnSprite(ctx, pet.accessory, targetW, targetH, spec);
    }
    ctx.restore();

    // Sleeping Zzz visual
    if (pose === 'sleep') {
      ctx.save();
      ctx.font = '700 16px Pretendard, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      const floatZ = Math.sin(now * 2.5) * 6;
      ctx.fillText('Zzz', x + 16, y - targetH * 0.85 + floatZ);
      ctx.restore();
    }

    const neckWorldX = x + facing * (spec.neckAnchor.x * targetW * scaleXMod);
    const neckWorldY = y - elevation + (spec.neckAnchor.y * targetH * scaleYMod);

    // 3. Glassmorphic nameplate
    if (showName && pet.name) {
      ctx.save();
      ctx.font = '700 11.5px Pretendard, sans-serif';
      const label = isPlayer ? `🐾 ${pet.name}` : pet.name;
      const tw = ctx.measureText(label).width;
      const px = 9;
      const bw = tw + px * 2;
      const bh = 21;
      const bx = x - bw / 2;
      const by = y + shadowRy + 5;

      ctx.fillStyle = isPlayer ? 'rgba(255, 112, 74, 0.9)' : 'rgba(22, 20, 18, 0.62)';
      roundRect(ctx, bx, by, bw, bh, 10.5);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, by + bh / 2 + 0.5);
      ctx.restore();
    }

    return {
      neckX: neckWorldX,
      neckY: neckWorldY,
      topY: y - elevation - targetH,
      box: {
        left: x - targetW * 0.45,
        right: x + targetW * 0.45,
        top: y - elevation - targetH,
        bottom: y - elevation,
        width: targetW,
        height: targetH
      }
    };
  }

  class WorldEngine {
    constructor(canvas, initialState, callbacks = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.callbacks = callbacks;

      this.zone = ZONES.find((z) => z.id === initialState.zoneId) || ZONES[0];
      this.timeOfDay = initialState.timeOfDay || 'day';
      this.leashEnabled = initialState.leashEnabled !== false;
      this.walkMeters = initialState.walkMeters || 0;
      this.growthScale = getGrowthInfo((initialState.growth && initialState.growth.exp) || 0).current.scaleMult;
      this._lastRewardMilestone = Math.floor(this.walkMeters / 100);

      this.camX = 0;
      this.camY = 0;
      this.pettingMode = false; // If true, dragging/clicking pet strokes them!
      this.isDragging = false;
      this.lastPetStrokeTs = 0;
      this.lastPlayerBox = null;

      this.player = {
        ...initialState.avatar,
        x: this.width * 0.48,
        y: this.height * 0.78,
        targetX: this.width * 0.48,
        targetY: this.height * 0.78,
        facing: 1,
        walkPhase: 0,
        isMoving: false,
        jumpVel: 0,
        jumpY: 0,
        bubble: null,
        stepTimer: 0,
        pose: null,
        poseTimer: 0
      };

      this.npcs = NPCS.map((n) => ({
        ...n,
        targetX: n.x,
        targetY: n.y,
        facing: Math.random() > 0.5 ? 1 : -1,
        walkPhase: Math.random() * 6,
        isMoving: false,
        waitTimer: 70 + Math.random() * 140,
        bubble: null,
        talkCooldown: 140 + Math.random() * 220,
        greetCooldown: 0
      }));

      // Interactive Walk Events: treasures, poop, tennis ball
      this.ball = null;
      this.treasures = [];
      this.poops = [];
      this._spawnTreasure();

      this.particles = [];
      this.footsteps = [];
      this.motes = Array.from({ length: 28 }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 1.8 + Math.random() * 3.2,
        vx: 0.12 + Math.random() * 0.22,
        vy: -0.08 + Math.random() * 0.16,
        phase: Math.random() * Math.PI * 2
      }));

      this.clickMarker = null;
      this.keys = new Set();

      ZONES.forEach((z) => getCachedImage(z.walkPhoto));
      Object.values(PET_SPRITES).forEach((s) => getCachedImage(s.spriteUrl));

      this._bindEvents();
      this._loop = this._loop.bind(this);
      requestAnimationFrame(this._loop);
    }

    _getWalkBounds() {
      const minY = Math.round(this.height * (this.zone.horizonRatio || 0.56));
      const maxY = this.height - 34;
      return { minX: 68, maxX: this.width - 68, minY, maxY };
    }

    _getDepthScale(y) {
      const { minY, maxY } = this._getWalkBounds();
      const t = Math.max(0, Math.min(1, (y - minY) / Math.max(1, maxY - minY)));
      return 0.56 + t * 0.59;
    }

    _spawnTreasure() {
      if (this.treasures.length >= 2) return;
      const b = this._getWalkBounds();
      const types = [
        { emoji: '🎁', label: '보물상자', coins: 45 },
        { emoji: '🦴', label: '숨겨진 간식', coins: 30 },
        { emoji: '🧸', label: '미니 장난감', coins: 35 }
      ];
      const pick = types[Math.floor(Math.random() * types.length)];
      this.treasures.push({
        id: Date.now() + Math.random(),
        ...pick,
        x: b.minX + 60 + Math.random() * (b.maxX - b.minX - 120),
        y: b.minY + 35 + Math.random() * (b.maxY - b.minY - 70),
        phase: Math.random() * 6
      });
    }

    spawnPoop() {
      if (this.poops.length >= 2) return;
      this.poops.push({
        id: Date.now() + Math.random(),
        x: Math.max(80, Math.min(this.width - 80, this.player.x - this.player.facing * 42)),
        y: Math.min(this.height - 38, this.player.y + 4)
      });
      this.say('응가했어요! 치워주세요 💩');
      if (this.callbacks.onPoopSpawn) this.callbacks.onPoopSpawn(this.poops.length);
    }

    cleanAllPoops() {
      if (!this.poops.length) return 0;
      const count = this.poops.length;
      for (const p of this.poops) {
        this._spawnEmojiBurst('✨', p.x, p.y - 10, 5);
      }
      this.poops = [];
      this.triggerEmote('🫧', '깨끗해졌다! 매너 산책 최고 ✨');
      return count;
    }

    _getCanvasCoords(e) {
      const rect = this.canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) * this.width) / rect.width,
        y: ((e.clientY - rect.top) * this.height) / rect.height
      };
    }

    _detectPetTouchZone(px, py) {
      const box = this.lastPlayerBox;
      if (!box) return null;
      if (px < box.left || px > box.right || py < box.top || py > box.bottom) return null;

      // Normalized relative to sprite facing direction
      const relY = (py - box.top) / Math.max(1, box.height); // 0 = top, 1 = bottom
      const relXFromCenter = ((px - this.player.x) * this.player.facing) / Math.max(1, box.width); // positive = head side

      if (relXFromCenter > 0.05 && relY < 0.45) return 'head';
      if (relXFromCenter > 0.0 && relY >= 0.45 && relY < 0.72) return 'chin';
      return 'belly';
    }

    _handlePetTouch(zone, px, py) {
      const now = performance.now();
      if (now - this.lastPetStrokeTs < 550) return;
      this.lastPetStrokeTs = now;

      if (zone === 'head') {
        this.setPose('happy', 110);
        this.say('머리 쓰다듬어 주니까 꼬리가 살랑살랑~ ❤️');
        this._spawnEmojiBurst('❤️', px, py - 10, 5);
      } else if (zone === 'chin') {
        this.setPose('tilt', 110);
        this.say('턱 긁어주는 거 최고야~ 갸우뚱 ✨');
        this._spawnEmojiBurst('✨', px, py - 10, 5);
      } else {
        this.setPose('belly', 120);
        this.say('배 간지러워~! 발라당 기분 좋아 🐾');
        this._spawnEmojiBurst('💕', px, py - 10, 6);
      }

      if (this.callbacks.onPetZoneTouch) {
        this.callbacks.onPetZoneTouch(zone);
      }
    }

    _bindEvents() {
      this.canvas.addEventListener('pointerdown', (e) => {
        this.isDragging = true;
        const { x, y } = this._getCanvasCoords(e);

        // 1. Check poop click to clean
        const poopIdx = this.poops.findIndex((p) => Math.hypot(p.x - x, p.y - y) < 34);
        if (poopIdx !== -1) {
          const [removed] = this.poops.splice(poopIdx, 1);
          this._spawnEmojiBurst('✨', removed.x, removed.y - 10, 6);
          this.triggerEmote('✨', '배변 치우기 완료! 매너 최고!');
          if (this.callbacks.onPoopCleaned) this.callbacks.onPoopCleaned(1);
          return;
        }

        // 2. Check direct touch on pet (head / chin / belly!)
        const touchZone = this._detectPetTouchZone(x, y);
        if (touchZone) {
          this._handlePetTouch(touchZone, x, y);
          return;
        }

        // 3. Otherwise walk to clicked park ground
        const bounds = this._getWalkBounds();
        const tx = Math.max(bounds.minX, Math.min(bounds.maxX, x));
        const ty = Math.max(bounds.minY, Math.min(bounds.maxY, y));
        this.player.targetX = tx;
        this.player.targetY = ty;
        this.player.pose = null;
        this.clickMarker = { x: tx, y: ty, radius: 4, alpha: 0.9 };
      });

      this.canvas.addEventListener('pointermove', (e) => {
        if (!this.isDragging) return;
        const { x, y } = this._getCanvasCoords(e);
        const touchZone = this._detectPetTouchZone(x, y);
        if (touchZone) {
          this._handlePetTouch(touchZone, x, y);
        }
      });

      window.addEventListener('pointerup', () => {
        this.isDragging = false;
      });

      this.canvas.addEventListener('dblclick', () => {
        this.triggerEmote('⚡', '폴짝!');
      });

      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
        const key = e.key.toLowerCase();
        if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
          this.keys.add(key);
        }
      });

      window.addEventListener('keyup', (e) => {
        this.keys.delete(e.key.toLowerCase());
      });
    }

    setPose(pose, durationFrames = 120) {
      this.player.pose = pose;
      this.player.poseTimer = durationFrames;
    }

    setGrowthScale(scaleMult) {
      this.growthScale = scaleMult || 1;
    }

    setZone(zoneId) {
      const next = ZONES.find((z) => z.id === zoneId);
      if (!next) return;
      this.zone = next;
      getCachedImage(next.walkPhoto);
      const b = this._getWalkBounds();
      this.player.y = Math.max(b.minY + 40, Math.min(b.maxY - 20, this.player.y));
      this.player.targetY = this.player.y;
      this.treasures = [];
      this._spawnTreasure();
      this.triggerEmote('✨', `${next.name} 산책 시작!`);
    }

    setTimeOfDay(time) {
      this.timeOfDay = time;
    }

    setLeashEnabled(enabled) {
      this.leashEnabled = enabled;
    }

    updatePlayerAvatar(avatar) {
      Object.assign(this.player, avatar);
      const spec = getSpriteSpec(avatar);
      getCachedImage(spec.spriteUrl);
    }

    centerPlayer() {
      const b = this._getWalkBounds();
      this.player.targetX = this.width * 0.5;
      this.player.targetY = b.minY + (b.maxY - b.minY) * 0.62;
      this.triggerEmote('🐾', '이리 와!');
    }

    throwBall() {
      const b = this._getWalkBounds();
      const targetX = this.player.x > this.width * 0.5
        ? b.minX + 70 + Math.random() * 240
        : this.width * 0.55 + Math.random() * 240;
      const targetY = b.minY + 25 + Math.random() * (b.maxY - b.minY - 60);

      this.ball = {
        x: this.width * 0.5,
        y: this.height - 15,
        startX: this.width * 0.5,
        startY: this.height - 15,
        targetX,
        targetY,
        t: 0,
        state: 'flying',
        z: 0
      };
      this.say('공이다!! 잡아올게 🎾');
    }

    performCareVisual(type) {
      if (type === 'feed') {
        this.setPose('happy', 110);
        this.triggerEmote('🍖', '냠냠! 너무 맛있어 🐾');
      } else if (type === 'brush') {
        this.setPose('tilt', 120);
        this.triggerEmote('✨', '빗질하니까 털이 반짝반짝!');
      } else if (type === 'bath') {
        this.setPose('happy', 130);
        this.triggerEmote('🫧', '보글보글 목욕 개운해!');
      } else if (type === 'nap') {
        this.setPose('sleep', 220);
        this.say('포근하게 한숨 잘게... Zzz');
      }
    }

    say(text) {
      this.player.bubble = { text, timer: 230 };
    }

    _spawnEmojiBurst(emoji, x, y, count = 6) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          emoji,
          x: x + (Math.random() - 0.5) * 46,
          y: y + (Math.random() - 0.5) * 20,
          vy: -0.95 - Math.random() * 0.85,
          vx: (Math.random() - 0.5) * 0.9,
          alpha: 1,
          life: 65 + Math.random() * 25
        });
      }
    }

    triggerEmote(emoji, text) {
      if (text) this.say(text);
      if (emoji === '⚡') this.player.jumpVel = 8.4;
      this._spawnEmojiBurst(emoji, this.player.x, this.player.y - 68, 6);
    }

    waveToNpc(npcId) {
      const npc = this.npcs.find((n) => n.id === npcId);
      if (!npc) return;
      const b = this._getWalkBounds();
      this.player.targetX = Math.max(b.minX, Math.min(b.maxX, npc.x - 75));
      this.player.targetY = Math.max(b.minY, Math.min(b.maxY, npc.y + 8));
      this.triggerEmote('👋', `${npc.name}야 같이 걷자!`);
      setTimeout(() => {
        npc.bubble = { text: `${this.player.name}! 코 인사 킁킁 🐾`, timer: 200 };
      }, 450);
    }

    _spawnFootstep(x, y, scale) {
      this.footsteps.push({
        x: x + (Math.random() - 0.5) * 14 * scale,
        y: y + (Math.random() - 0.5) * 4,
        r: (3 + Math.random() * 3) * scale,
        vy: -0.25 - Math.random() * 0.25,
        alpha: 0.45
      });
    }

    _update() {
      const bounds = this._getWalkBounds();
      const depthSpeed = 2.6 + (this._getDepthScale(this.player.y) - 0.56) * 2.1;

      if (this.player.poseTimer > 0) {
        this.player.poseTimer -= 1;
        if (this.player.poseTimer <= 0) this.player.pose = null;
      }

      // Ball fetch physics
      if (this.ball) {
        if (this.ball.state === 'flying') {
          this.ball.t += 0.032;
          const p = Math.min(1, this.ball.t);
          this.ball.x = this.ball.startX + (this.ball.targetX - this.ball.startX) * p;
          this.ball.y = this.ball.startY + (this.ball.targetY - this.ball.startY) * p;
          this.ball.z = Math.sin(p * Math.PI) * 120;
          if (p >= 1) {
            this.ball.state = 'landed';
            this.ball.z = 0;
            this.player.targetX = this.ball.targetX;
            this.player.targetY = this.ball.targetY;
          }
        } else if (this.ball.state === 'landed') {
          const distToBall = Math.hypot(this.ball.x - this.player.x, this.ball.y - this.player.y);
          if (distToBall < 34) {
            this.ball = null;
            this.player.jumpVel = 7.4;
            this.triggerEmote('🎾', '잡았다!! 신나 🐾');
            if (this.callbacks.onFetchBall) this.callbacks.onFetchBall();
          }
        }
      }

      // Movement
      let kx = 0;
      let ky = 0;
      if (this.keys.has('w') || this.keys.has('arrowup')) ky -= 1;
      if (this.keys.has('s') || this.keys.has('arrowdown')) ky += 1;
      if (this.keys.has('a') || this.keys.has('arrowleft')) kx -= 1;
      if (this.keys.has('d') || this.keys.has('arrowright')) kx += 1;

      let movedDist = 0;
      if (kx !== 0 || ky !== 0) {
        const len = Math.hypot(kx, ky);
        const nx = Math.max(bounds.minX, Math.min(bounds.maxX, this.player.x + (kx / len) * depthSpeed));
        const ny = Math.max(bounds.minY, Math.min(bounds.maxY, this.player.y + (ky / len) * (depthSpeed * 0.72)));
        movedDist = Math.hypot(nx - this.player.x, ny - this.player.y);
        this.player.x = nx;
        this.player.y = ny;
        this.player.targetX = nx;
        this.player.targetY = ny;
        if (kx !== 0) this.player.facing = kx > 0 ? 1 : -1;
        this.player.walkPhase += 0.24;
        this.player.isMoving = true;
        this.player.pose = null;
      } else {
        const dx = this.player.targetX - this.player.x;
        const dy = this.player.targetY - this.player.y;
        const dist = Math.hypot(dx, dy);
        const moveSpeed = this.ball && this.ball.state === 'landed' ? depthSpeed * 1.45 : depthSpeed;
        if (dist > 3.5) {
          const stepX = (dx / dist) * moveSpeed;
          const stepY = (dy / dist) * moveSpeed;
          this.player.x += stepX;
          this.player.y += stepY;
          movedDist = Math.hypot(stepX, stepY);
          if (Math.abs(dx) > 1.2) this.player.facing = dx > 0 ? 1 : -1;
          this.player.walkPhase += this.ball ? 0.30 : 0.23;
          this.player.isMoving = true;
          this.player.pose = null;
        } else {
          this.player.isMoving = false;
        }
      }

      if (movedDist > 0.5) {
        this.walkMeters += movedDist * 0.08;
        this.player.stepTimer += movedDist;
        if (this.player.stepTimer > 22) {
          this.player.stepTimer = 0;
          this._spawnFootstep(this.player.x, this.player.y, this._getDepthScale(this.player.y));
          // Occasional random poop during walks (~2.5% per step burst)
          if (this.poops.length === 0 && Math.random() < 0.028) {
            this.spawnPoop();
          }
        }
        if (this.callbacks.onWalkProgress) {
          const milestone = Math.floor(this.walkMeters / 100);
          const reward = milestone > this._lastRewardMilestone;
          if (reward) this._lastRewardMilestone = milestone;
          this.callbacks.onWalkProgress(this.walkMeters, reward);
        }
      }

      // Check Treasure pickups along the walk path!
      for (let i = this.treasures.length - 1; i >= 0; i--) {
        const tr = this.treasures[i];
        tr.phase += 0.07;
        if (Math.hypot(tr.x - this.player.x, tr.y - this.player.y) < 42) {
          this.treasures.splice(i, 1);
          this._spawnEmojiBurst(tr.emoji, tr.x, tr.y - 16, 7);
          this.say(`${tr.label} 발견! (+${tr.coins} P) 🎉`);
          if (this.callbacks.onTreasureFound) this.callbacks.onTreasureFound(tr);
          setTimeout(() => this._spawnTreasure(), 7000);
        }
      }

      // Camera parallax
      const desiredCamX = ((this.player.x / this.width) - 0.5) * -44;
      const desiredCamY = ((this.player.y / this.height) - 0.72) * -18;
      this.camX += (desiredCamX - this.camX) * 0.06;
      this.camY += (desiredCamY - this.camY) * 0.06;

      // Jump physics
      if (this.player.jumpY > 0 || this.player.jumpVel > 0) {
        this.player.jumpY += this.player.jumpVel;
        this.player.jumpVel -= 0.45;
        if (this.player.jumpY <= 0) {
          this.player.jumpY = 0;
          this.player.jumpVel = 0;
        }
      }

      if (this.player.bubble) {
        this.player.bubble.timer -= 1;
        if (this.player.bubble.timer <= 0) this.player.bubble = null;
      }

      // NPCs strolling + proximity sniff-greeting event!
      for (const npc of this.npcs) {
        if (npc.greetCooldown > 0) npc.greetCooldown -= 1;
        const distToPlayer = Math.hypot(npc.x - this.player.x, npc.y - this.player.y);
        if (distToPlayer < 66 && npc.greetCooldown <= 0) {
          npc.greetCooldown = 500;
          npc.bubble = { text: `킁킁~ ${this.player.name} 반가워! ❤️`, timer: 190 };
          this.say(`${npc.name}랑 냄새 인사했어요! 🐾`);
          this._spawnEmojiBurst('💕', (npc.x + this.player.x) / 2, this.player.y - 55, 5);
          if (this.callbacks.onNpcGreet) this.callbacks.onNpcGreet(npc);
        }

        const dx = npc.targetX - npc.x;
        const dy = npc.targetY - npc.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 3.5) {
          const nSpeed = 1.05 * this._getDepthScale(npc.y);
          npc.x += (dx / dist) * nSpeed;
          npc.y += (dy / dist) * nSpeed;
          if (Math.abs(dx) > 0.6) npc.facing = dx > 0 ? 1 : -1;
          npc.walkPhase += 0.16;
          npc.isMoving = true;
        } else {
          npc.isMoving = false;
          npc.waitTimer -= 1;
          if (npc.waitTimer <= 0) {
            npc.targetX = bounds.minX + 20 + Math.random() * (bounds.maxX - bounds.minX - 40);
            npc.targetY = bounds.minY + 12 + Math.random() * (bounds.maxY - bounds.minY - 30);
            npc.waitTimer = 120 + Math.random() * 200;
          }
        }

        if (npc.bubble) {
          npc.bubble.timer -= 1;
          if (npc.bubble.timer <= 0) npc.bubble = null;
        } else {
          npc.talkCooldown -= 1;
          if (npc.talkCooldown <= 0) {
            const line = npc.lines[Math.floor(Math.random() * npc.lines.length)];
            npc.bubble = { text: line, timer: 195 };
            npc.talkCooldown = 360 + Math.random() * 340;
          }
        }
      }

      for (let i = this.footsteps.length - 1; i >= 0; i--) {
        const f = this.footsteps[i];
        f.y += f.vy;
        f.r += 0.08;
        f.alpha -= 0.014;
        if (f.alpha <= 0) this.footsteps.splice(i, 1);
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / 70);
        if (p.life <= 0) this.particles.splice(i, 1);
      }

      for (const m of this.motes) {
        m.x += m.vx;
        m.y += m.vy;
        m.phase += 0.025;
        if (m.x > this.width + 10) m.x = -10;
        if (m.y < -10) m.y = this.height + 10;
        if (m.y > this.height + 10) m.y = -10;
      }

      if (this.clickMarker) {
        this.clickMarker.radius += 1.5;
        this.clickMarker.alpha -= 0.038;
        if (this.clickMarker.alpha <= 0) this.clickMarker = null;
      }
    }

    _drawScenicBackground(ctx) {
      const { width: w, height: h, zone } = this;
      const bgImg = getCachedImage(zone.walkPhoto);

      if (bgImg) {
        const iw = bgImg.naturalWidth || bgImg.width;
        const ih = bgImg.naturalHeight || bgImg.height;
        const scale = Math.max((w * 1.12) / iw, (h * 1.12) / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        const dx = (w - dw) / 2 + this.camX;
        const dy = (h - dh) / 2 + this.camY;

        ctx.save();
        if (this.timeOfDay === 'sunset') {
          ctx.filter = 'sepia(0.24) saturate(1.25) contrast(1.03) brightness(0.95)';
        } else if (this.timeOfDay === 'night') {
          ctx.filter = 'brightness(0.46) contrast(1.12) saturate(0.75) hue-rotate(185deg)';
        }
        ctx.drawImage(bgImg, dx, dy, dw, dh);
        ctx.filter = 'none';
        ctx.restore();
      } else {
        const sky = ctx.createLinearGradient(0, 0, 0, h);
        sky.addColorStop(0, '#A5D8FF');
        sky.addColorStop(0.55, '#D8F3DC');
        sky.addColorStop(1, '#74C69D');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);
      }

      const bottomFade = ctx.createLinearGradient(0, h * 0.75, 0, h);
      bottomFade.addColorStop(0, 'rgba(0,0,0,0)');
      bottomFade.addColorStop(1, 'rgba(18, 22, 16, 0.24)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      if (this.clickMarker) {
        const ds = this._getDepthScale(this.clickMarker.y);
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.clickMarker.alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(
          this.clickMarker.x,
          this.clickMarker.y,
          this.clickMarker.radius * ds,
          this.clickMarker.radius * 0.36 * ds,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    _drawWorldItems(ctx) {
      // Glowing hidden treasures on path
      for (const tr of this.treasures) {
        const ds = this._getDepthScale(tr.y);
        const bob = Math.sin(tr.phase) * 4;
        ctx.save();
        const g = ctx.createRadialGradient(tr.x, tr.y - 6, 2, tr.x, tr.y - 6, 28 * ds);
        g.addColorStop(0, 'rgba(255, 224, 110, 0.65)');
        g.addColorStop(1, 'rgba(255, 224, 110, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(tr.x, tr.y - 6, 28 * ds, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${Math.round(28 * ds)}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tr.emoji, tr.x, tr.y - 12 * ds + bob);
        ctx.restore();
      }

      // Click-to-clean poops
      for (const p of this.poops) {
        const ds = this._getDepthScale(p.y);
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath();
        ctx.ellipse(p.x, p.y + 4, 14 * ds, 5 * ds, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `${Math.round(24 * ds)}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText('💩', p.x, p.y);
        ctx.restore();
      }
    }

    _drawLeash(ctx, neckX, neckY) {
      if (!this.leashEnabled) return;
      const handX = this.width * 0.14 + this.camX * 0.4;
      const handY = this.height + 24;
      const dist = Math.hypot(neckX - handX, neckY - handY);
      const slack = Math.max(18, 125 - dist * 0.16);
      const ctrlX = (handX + neckX) * 0.5;
      const ctrlY = Math.max(handY - 40, (handY + neckY) * 0.5 + slack);

      ctx.save();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(handX, handY + 4);
      ctx.quadraticCurveTo(ctrlX, ctrlY + 6, neckX, neckY + 3);
      ctx.stroke();

      ctx.strokeStyle = this.player.color || '#E46A52';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, neckX, neckY);
      ctx.stroke();

      ctx.fillStyle = '#E5E7EB';
      ctx.strokeStyle = '#6B7280';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(neckX, neckY, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    _drawBall(ctx) {
      if (!this.ball) return;
      const ds = this._getDepthScale(this.ball.y);
      const r = 9 * ds;
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(this.ball.x, this.ball.y, r * 1.1, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      const by = this.ball.y - this.ball.z - r;
      const g = ctx.createRadialGradient(this.ball.x - r * 0.3, by - r * 0.3, r * 0.1, this.ball.x, by, r);
      g.addColorStop(0, '#E9FF70');
      g.addColorStop(1, '#99CC19');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.ball.x, by, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _drawAtmosphere(ctx) {
      const { width: w, height: h } = this;
      if (this.timeOfDay === 'day') {
        ctx.save();
        const beam = ctx.createLinearGradient(0, 0, w * 0.65, h * 0.75);
        beam.addColorStop(0, 'rgba(255, 250, 224, 0.22)');
        beam.addColorStop(0.5, 'rgba(255, 248, 212, 0.06)');
        beam.addColorStop(1, 'rgba(255, 248, 212, 0)');
        ctx.fillStyle = beam;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(w * 0.45, 0);
        ctx.lineTo(w * 0.85, h);
        ctx.lineTo(w * 0.18, h);
        ctx.closePath();
        ctx.fill();

        for (const m of this.motes) {
          const alpha = 0.18 + 0.22 * Math.sin(m.phase);
          ctx.fillStyle = `rgba(255, 251, 224, ${alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (this.timeOfDay === 'sunset') {
        ctx.save();
        const glow = ctx.createRadialGradient(w * 0.78, h * 0.22, 20, w * 0.78, h * 0.22, w * 0.75);
        glow.addColorStop(0, 'rgba(255, 190, 110, 0.36)');
        glow.addColorStop(0.45, 'rgba(255, 118, 72, 0.16)');
        glow.addColorStop(1, 'rgba(72, 34, 62, 0.12)');
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        for (const m of this.motes) {
          const alpha = 0.22 + 0.25 * Math.sin(m.phase);
          ctx.fillStyle = `rgba(255, 214, 150, ${alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 1.15, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (this.timeOfDay === 'night') {
        ctx.save();
        const halo = ctx.createRadialGradient(this.player.x, this.player.y - 40, 15, this.player.x, this.player.y - 40, 175);
        halo.addColorStop(0, 'rgba(255, 236, 180, 0.16)');
        halo.addColorStop(1, 'rgba(10, 16, 38, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, w, h);

        for (const m of this.motes) {
          const alpha = 0.35 + 0.65 * Math.abs(Math.sin(m.phase * 1.4));
          ctx.fillStyle = `rgba(255, 240, 145, ${alpha})`;
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.r * 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    _drawSpeechBubble(ctx, x, topY, text) {
      ctx.save();
      ctx.font = '600 12px Pretendard, sans-serif';
      const padX = 11;
      const w = Math.min(240, ctx.measureText(text).width + padX * 2);
      const h = 30;
      const bx = Math.max(12, Math.min(this.width - w - 12, x - w / 2));
      const by = Math.max(54, topY - 34);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      roundRect(ctx, bx, by, w, h, 14);
      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#22201D';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + w / 2, by + h / 2 + 0.5, w - 14);
      ctx.restore();
    }

    _render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this._drawScenicBackground(ctx);

      for (const f of this.footsteps) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 248, 232, ${f.alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      this._drawWorldItems(ctx);

      const actors = [
        ...this.npcs.map((n) => ({ ...n, isPlayer: false })),
        { ...this.player, isPlayer: true }
      ].sort((a, b) => a.y - b.y);

      const bubblesToDraw = [];

      for (const actor of actors) {
        const depthScale = this._getDepthScale(actor.y) * (actor.isPlayer ? this.growthScale : 1);
        const anchors = drawPetCharacter(ctx, actor, {
          x: actor.x,
          y: actor.y,
          scale: depthScale,
          walkPhase: actor.walkPhase,
          isMoving: actor.isMoving,
          jump: actor.jumpY || 0,
          facing: actor.facing,
          isPlayer: actor.isPlayer,
          showName: true,
          timeOfDay: this.timeOfDay,
          pose: actor.isPlayer ? actor.pose : null
        });

        if (actor.isPlayer) {
          this.lastPlayerBox = anchors.box;
          this._drawLeash(ctx, anchors.neckX, anchors.neckY);
        }

        if (actor.bubble) {
          bubblesToDraw.push({ x: actor.x, topY: anchors.topY, text: actor.bubble.text });
        }
      }

      this._drawBall(ctx);
      this._drawAtmosphere(ctx);

      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      }

      for (const b of bubblesToDraw) {
        this._drawSpeechBubble(ctx, b.x, b.topY, b.text);
      }
    }

    _loop() {
      this._update();
      this._render();
      requestAnimationFrame(this._loop);
    }
  }

  return {
    WorldEngine,
    drawPetCharacter,
    getCachedImage
  };
})();
