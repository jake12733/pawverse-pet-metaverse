window.PawVerseWorld = (() => {
  const { ZONES, NPCS, PET_SPRITES } = window.PAWVERSE_DATA;

  const imageCache = new Map();
  function getCachedImage(url) {
    if (!url) return null;
    if (imageCache.has(url)) {
      const entry = imageCache.get(url);
      return entry.loaded ? entry.img : null;
    }
    const img = new Image();
    if (/^https?:\/\//i.test(url)) {
      img.crossOrigin = 'anonymous';
    }
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
      // Little jewel
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

  /**
   * Draws a photorealistic full-body pet sprite with soft ground contact shadow,
   * natural trotting bounce/rocking, breathing idle motion, and anatomy-anchored accessories.
   */
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
      timeOfDay = 'day'
    } = opts;

    const spec = getSpriteSpec(pet);
    const img = getCachedImage(spec.spriteUrl);

    const targetH = spec.baseHeight * scale;
    const aspect = img && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1.32;
    const targetW = targetH * aspect;

    // Lifelike gait: trot bounce + gentle stride tilt + subtle breathing when idle
    const now = performance.now() * 0.001;
    const strideSin = Math.sin(walkPhase);
    const trotLift = isMoving ? Math.abs(strideSin) * 7.5 * scale : 0;
    const strideTilt = isMoving ? strideSin * 0.048 * facing : Math.sin(now * 2.2) * 0.008;
    const breathScaleY = isMoving ? 1 + Math.abs(strideSin) * 0.025 : 1 + Math.sin(now * 2.6) * 0.014;
    const breathScaleX = isMoving ? 1 - Math.abs(strideSin) * 0.018 : 1 - Math.sin(now * 2.6) * 0.008;

    const elevation = trotLift + jump;

    // 1. Realistic multi-layer feathered ground contact shadow
    ctx.save();
    ctx.translate(x, y);
    const shadowScale = Math.max(0.55, 1 - elevation * 0.006);
    const shadowRx = targetW * 0.42 * shadowScale;
    const shadowRy = Math.max(6, targetH * 0.11 * shadowScale);

    // Wide ambient shadow
    const grad = ctx.createRadialGradient(0, 0, shadowRx * 0.1, 0, 0, shadowRx);
    const baseOpacity = timeOfDay === 'night' ? 0.52 : 0.36;
    grad.addColorStop(0, `rgba(14, 18, 12, ${baseOpacity * shadowScale})`);
    grad.addColorStop(0.6, `rgba(14, 18, 12, ${baseOpacity * 0.45 * shadowScale})`);
    grad.addColorStop(1, 'rgba(14, 18, 12, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, shadowRx, shadowRy, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle sunlit selection ring only for player (very refined, not loud)
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

    // 2. Photorealistic Full-Body Pet Sprite
    ctx.save();
    ctx.translate(x, y - elevation);
    ctx.rotate(strideTilt);
    ctx.scale(facing * breathScaleX, breathScaleY);

    if (img) {
      // Subtle atmospheric color integration for sunset / night lighting
      if (timeOfDay === 'sunset') {
        ctx.filter = 'sepia(0.18) saturate(1.16) brightness(0.98)';
      } else if (timeOfDay === 'night') {
        ctx.filter = 'brightness(0.84) contrast(1.06) saturate(0.88)';
      }
      ctx.drawImage(img, -targetW / 2, -targetH + 4 * scale, targetW, targetH);
      ctx.filter = 'none';

      // Anatomy-anchored accessory overlay
      drawAccessoryOnSprite(ctx, pet.accessory, targetW, targetH, spec);
    } else {
      // Tiny loading silhouette before PNG resolves
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.beginPath();
      ctx.ellipse(0, -targetH * 0.4, targetW * 0.3, targetH * 0.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Return neck world position for realistic walking leash attachment
    const neckWorldX = x + facing * (spec.neckAnchor.x * targetW * breathScaleX);
    const neckWorldY = y - elevation + (spec.neckAnchor.y * targetH * breathScaleY);

    // 3. Refined Apple-style frosted glass nameplate
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
      topY: y - elevation - targetH
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
      this._lastRewardMilestone = Math.floor(this.walkMeters / 100);

      // Camera smooth parallax offset
      this.camX = 0;
      this.camY = 0;

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
        stepTimer: 0
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
        talkCooldown: 140 + Math.random() * 220
      }));

      // Interactive Tennis Ball (Fetch mini-interaction!)
      this.ball = null;

      // Ambient particles (sunlit bokeh motes, footsteps, emotes, fireflies)
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

      // Preload all park scenes and transparent full-body pet PNGs
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
      // Realistic perspective depth: 0.56 at far park horizon -> 1.15 in foreground
      return 0.56 + t * 0.59;
    }

    _bindEvents() {
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const bounds = this._getWalkBounds();
        const rawX = (e.clientX - rect.left) * scaleX;
        const rawY = (e.clientY - rect.top) * scaleY;

        const tx = Math.max(bounds.minX, Math.min(bounds.maxX, rawX));
        const ty = Math.max(bounds.minY, Math.min(bounds.maxY, rawY));
        this.player.targetX = tx;
        this.player.targetY = ty;
        this.clickMarker = { x: tx, y: ty, radius: 4, alpha: 0.9 };
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

    setZone(zoneId) {
      const next = ZONES.find((z) => z.id === zoneId);
      if (!next) return;
      this.zone = next;
      getCachedImage(next.walkPhoto);
      const b = this._getWalkBounds();
      this.player.y = Math.max(b.minY + 40, Math.min(b.maxY - 20, this.player.y));
      this.player.targetY = this.player.y;
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
        state: 'flying', // flying -> landed -> fetched
        z: 0
      };
      this.say('공이다!! 잡아올게 🎾');
    }

    say(text) {
      this.player.bubble = { text, timer: 220 };
    }

    triggerEmote(emoji, text) {
      if (text) this.say(text);
      if (emoji === '⚡') {
        this.player.jumpVel = 8.4;
      }
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          emoji,
          x: this.player.x + (Math.random() - 0.5) * 44,
          y: this.player.y - 68,
          vy: -0.95 - Math.random() * 0.85,
          vx: (Math.random() - 0.5) * 0.9,
          alpha: 1,
          life: 65 + Math.random() * 25
        });
      }
    }

    waveToNpc(npcId) {
      const npc = this.npcs.find((n) => n.id === npcId);
      if (!npc) return;
      const b = this._getWalkBounds();
      this.player.targetX = Math.max(b.minX, Math.min(b.maxX, npc.x - 85));
      this.player.targetY = Math.max(b.minY, Math.min(b.maxY, npc.y + 8));
      this.triggerEmote('👋', `${npc.name}야 같이 걷자!`);
      setTimeout(() => {
        npc.bubble = { text: `${this.player.name}! 반가워 🐾`, timer: 200 };
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

      // Update ball fetch physics
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
          if (distToBall < 32) {
            this.ball = null;
            this.player.jumpVel = 7.2;
            this.triggerEmote('🎾', '잡았다!! 신나 🐾');
            if (this.callbacks.onFetchBall) this.callbacks.onFetchBall();
          }
        }
      }

      // Keyboard movement
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
        }
        if (this.callbacks.onWalkProgress) {
          const milestone = Math.floor(this.walkMeters / 100);
          const reward = milestone > this._lastRewardMilestone;
          if (reward) this._lastRewardMilestone = milestone;
          this.callbacks.onWalkProgress(this.walkMeters, reward);
        }
      }

      // Smooth 2.5D camera parallax following player subtly
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

      // NPCs strolling naturally along the park ground plane
      for (const npc of this.npcs) {
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

      // Update footsteps & emote particles
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
        // 1.12x overscan for silky 2.5D parallax panning
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

      // Soft bottom atmospheric depth gradient for crisp foreground grounding
      const bottomFade = ctx.createLinearGradient(0, h * 0.75, 0, h);
      bottomFade.addColorStop(0, 'rgba(0,0,0,0)');
      bottomFade.addColorStop(1, 'rgba(18, 22, 16, 0.24)');
      ctx.fillStyle = bottomFade;
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      // Click-to-walk perspective ground ripple
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

    _drawLeash(ctx, neckX, neckY) {
      if (!this.leashEnabled) return;
      // Owner's POV hand holding the leash softly from foreground bottom-left
      const handX = this.width * 0.14 + this.camX * 0.4;
      const handY = this.height + 24;
      const dist = Math.hypot(neckX - handX, neckY - handY);
      const slack = Math.max(18, 125 - dist * 0.16);
      const ctrlX = (handX + neckX) * 0.5;
      const ctrlY = Math.max(handY - 40, (handY + neckY) * 0.5 + slack);

      ctx.save();
      // Subtle leash shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(handX, handY + 4);
      ctx.quadraticCurveTo(ctrlX, ctrlY + 6, neckX, neckY + 3);
      ctx.stroke();

      // Woven warm tan/coral walking leash
      const grad = ctx.createLinearGradient(handX, handY, neckX, neckY);
      grad.addColorStop(0, '#C96F4B');
      grad.addColorStop(0.5, '#E48962');
      grad.addColorStop(1, '#D65145');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, neckX, neckY);
      ctx.stroke();

      // Metallic collar clasp at pet's neck
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
      // Ball ground shadow
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.beginPath();
      ctx.ellipse(this.ball.x, this.ball.y, r * 1.1, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tennis ball body
      const by = this.ball.y - this.ball.z - r;
      const g = ctx.createRadialGradient(this.ball.x - r * 0.3, by - r * 0.3, r * 0.1, this.ball.x, by, r);
      g.addColorStop(0, '#E9FF70');
      g.addColorStop(1, '#99CC19');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.ball.x, by, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(this.ball.x, by, r * 0.65, -0.8, 0.8);
      ctx.stroke();
      ctx.restore();
    }

    _drawAtmosphere(ctx) {
      const { width: w, height: h } = this;

      if (this.timeOfDay === 'day') {
        // Volumetric diagonal sunbeams from top-left
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

        // Drifting golden sunlit bokeh motes
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
        // Soft warm moonlight halo around player so they stay cozy and clear
        const halo = ctx.createRadialGradient(this.player.x, this.player.y - 40, 15, this.player.x, this.player.y - 40, 175);
        halo.addColorStop(0, 'rgba(255, 236, 180, 0.16)');
        halo.addColorStop(1, 'rgba(10, 16, 38, 0)');
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, w, h);

        // Glowing fireflies
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
      const w = Math.min(220, ctx.measureText(text).width + padX * 2);
      const h = 30;
      const bx = Math.max(12, Math.min(this.width - w - 12, x - w / 2));
      const by = Math.max(54, topY - 34);

      ctx.shadowColor = 'rgba(0, 0, 0, 0.16)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
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

      // 1. Full-bleed scenic Pexels park photo with 2.5D parallax
      this._drawScenicBackground(ctx);

      // 2. Soft ground footstep dust puffs
      for (const f of this.footsteps) {
        ctx.save();
        ctx.fillStyle = `rgba(255, 248, 232, ${f.alpha})`;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Depth-sort all pets by Y ground plane (back-to-front perspective!)
      const actors = [
        ...this.npcs.map((n) => ({ ...n, isPlayer: false })),
        { ...this.player, isPlayer: true }
      ].sort((a, b) => a.y - b.y);

      const bubblesToDraw = [];

      for (const actor of actors) {
        const depthScale = this._getDepthScale(actor.y);
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
          timeOfDay: this.timeOfDay
        });

        // Draw realistic leash attached to player's neck right after player renders
        if (actor.isPlayer) {
          this._drawLeash(ctx, anchors.neckX, anchors.neckY);
        }

        if (actor.bubble) {
          bubblesToDraw.push({ x: actor.x, topY: anchors.topY, text: actor.bubble.text });
        }
      }

      // 4. Fetch tennis ball
      this._drawBall(ctx);

      // 5. Atmospheric sunbeams / sunset glow / fireflies
      this._drawAtmosphere(ctx);

      // 6. Floating emote particles
      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      }

      // 7. Crisp speech bubbles on top
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
