window.PawVerseWorld = (() => {
  const { ZONES, NPCS } = window.PAWVERSE_DATA;

  // Image cache for Pexels pet portraits & zone backdrops
  const imageCache = new Map();
  function getCachedImage(url) {
    if (!url) return null;
    if (imageCache.has(url)) {
      const entry = imageCache.get(url);
      return entry.loaded ? entry.img : null;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
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

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function shadeColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, Math.max(0, (num >> 16) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0x0000ff) + percent));
    return `rgb(${r}, ${g}, ${b})`;
  }

  function drawCoverCircleImage(ctx, img, cx, cy, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const size = radius * 2;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const imgRatio = iw / ih;
    let drawW = size;
    let drawH = size;
    if (imgRatio > 1) {
      drawW = size * imgRatio;
    } else {
      drawH = size / imgRatio;
    }
    ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    ctx.restore();
  }

  function drawAccessoryOverlay(ctx, accessory, topY, neckY, eyeShift, facing) {
    if (accessory === 'scarf') {
      ctx.fillStyle = '#FF5E57';
      roundRect(ctx, -15, neckY, 30, 7, 4);
      ctx.fill();
      roundRect(ctx, facing * 5, neckY + 3, 7, 11, 3);
      ctx.fill();
    } else if (accessory === 'sunglasses') {
      ctx.fillStyle = '#1E1E24';
      roundRect(ctx, -12 + eyeShift, topY + 10, 10, 7, 2.5);
      ctx.fill();
      roundRect(ctx, 2 + eyeShift, topY + 10, 10, 7, 2.5);
      ctx.fill();
      ctx.fillRect(-2 + eyeShift, topY + 12, 4, 2);
    } else if (accessory === 'crown') {
      ctx.fillStyle = '#FFC93C';
      ctx.strokeStyle = '#B87B00';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-10, topY + 2);
      ctx.lineTo(-11, topY - 9);
      ctx.lineTo(-4, topY - 4);
      ctx.lineTo(0, topY - 13);
      ctx.lineTo(4, topY - 4);
      ctx.lineTo(11, topY - 9);
      ctx.lineTo(10, topY + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (accessory === 'sprout') {
      ctx.strokeStyle = '#34B37E';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(0, topY + 1);
      ctx.quadraticCurveTo(1, topY - 8, 0, topY - 12);
      ctx.stroke();
      ctx.fillStyle = '#48C78E';
      ctx.beginPath();
      ctx.ellipse(-5.5, topY - 10, 6, 3.2, -0.4, 0, Math.PI * 2);
      ctx.ellipse(5.5, topY - 10, 6, 3.2, 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (accessory === 'ribbon') {
      ctx.fillStyle = '#FF8FB1';
      ctx.beginPath();
      ctx.ellipse(-7, topY - 1, 6.5, 4.2, -0.3, 0, Math.PI * 2);
      ctx.ellipse(7, topY - 1, 6.5, 4.2, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FF5C8D';
      ctx.beginPath();
      ctx.arc(0, topY - 1, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPetCharacter(ctx, pet, opts = {}) {
    const {
      x = 0,
      y = 0,
      scale = 1,
      bob = 0,
      jump = 0,
      facing = 1,
      isPlayer = false,
      showName = true,
      mode = 'photo'
    } = opts;

    const fur = pet.color || '#F6E7CB';
    const darker = shadeColor(fur, -26);
    const drawY = y - Math.abs(bob) * 5 - jump;

    // Ground shadow + player halo
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = 'rgba(34, 32, 29, 0.18)';
    ctx.beginPath();
    ctx.ellipse(0, 16 * scale, 24 * scale * (1 - jump * 0.008), 8.5 * scale, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isPlayer) {
      ctx.strokeStyle = 'rgba(255, 122, 89, 0.85)';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(0, 16 * scale, 30 * scale, 11.5 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    const photoImg = mode === 'photo' ? getCachedImage(pet.photoUrl) : null;

    if (mode === 'photo' && photoImg) {
      ctx.save();
      ctx.translate(x, drawY);
      ctx.scale(scale, scale);

      const radius = 24;
      const cy = -10;

      // Outer fur/theme ring + crisp white border
      ctx.fillStyle = isPlayer ? '#FF7A59' : fur;
      ctx.beginPath();
      ctx.arc(0, cy, radius + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(0, cy, radius + 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Real Pexels Pet Portrait
      drawCoverCircleImage(ctx, photoImg, 0, cy, radius);

      // Little walking paws underneath portrait
      const pawOffset = Math.sin(bob * Math.PI) * 3;
      ctx.fillStyle = darker;
      ctx.strokeStyle = '#3B332B';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-9, 14 + pawOffset * 0.4, 4.5, 0, Math.PI * 2);
      ctx.arc(9, 14 - pawOffset * 0.4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Accessory on portrait
      drawAccessoryOverlay(ctx, pet.accessory, cy - radius, cy + radius - 6, facing * 2, facing);

      ctx.restore();
    } else {
      // Illustrated vector fallback / mode
      ctx.save();
      ctx.translate(x, drawY);
      ctx.scale(scale, scale);

      // Tail
      ctx.save();
      ctx.translate(-facing * 17, 2);
      ctx.rotate(Math.sin(performance.now() * 0.01) * 0.28);
      ctx.fillStyle = darker;
      ctx.beginPath();
      if (pet.species === 'rabbit') {
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
      } else if (pet.species === 'cat') {
        ctx.ellipse(-facing * 6, -6, 10, 4, -facing * 0.6, 0, Math.PI * 2);
      } else {
        ctx.ellipse(-facing * 4, -2, 8, 4.5, -facing * 0.4, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();

      // Body
      ctx.fillStyle = fur;
      ctx.strokeStyle = '#3B332B';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, 3, 18, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Paws
      const pawOffset = Math.sin(bob * Math.PI) * 3;
      ctx.fillStyle = darker;
      ctx.beginPath();
      ctx.arc(-8, 13 + pawOffset * 0.4, 4.5, 0, Math.PI * 2);
      ctx.arc(8, 13 - pawOffset * 0.4, 4.5, 0, Math.PI * 2);
      ctx.fill();

      if (pet.accessory === 'scarf') {
        drawAccessoryOverlay(ctx, 'scarf', -30, -7, facing * 2, facing);
      }

      // Ears
      ctx.fillStyle = darker;
      ctx.strokeStyle = '#3B332B';
      ctx.lineWidth = 2;
      if (pet.species === 'dog') {
        ctx.beginPath();
        ctx.ellipse(-15, -16, 6, 11, 0.35, 0, Math.PI * 2);
        ctx.ellipse(15, -16, 6, 11, -0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (pet.species === 'cat') {
        ctx.beginPath();
        ctx.moveTo(-15, -20);
        ctx.lineTo(-10, -34);
        ctx.lineTo(-2, -24);
        ctx.closePath();
        ctx.moveTo(15, -20);
        ctx.lineTo(10, -34);
        ctx.lineTo(2, -24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (pet.species === 'rabbit') {
        ctx.fillStyle = fur;
        ctx.beginPath();
        ctx.ellipse(-8, -36, 5.5, 14, -0.1, 0, Math.PI * 2);
        ctx.ellipse(8, -36, 5.5, 14, 0.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#F7B7C4';
        ctx.beginPath();
        ctx.ellipse(-8, -36, 2.5, 9, -0.1, 0, Math.PI * 2);
        ctx.ellipse(8, -36, 2.5, 9, 0.1, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(-13, -27, 6, 0, Math.PI * 2);
        ctx.arc(13, -27, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Head
      ctx.fillStyle = fur;
      ctx.strokeStyle = '#3B332B';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(0, -16, 18, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cheeks
      ctx.fillStyle = 'rgba(255, 138, 128, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-10, -12, 3.8, 2.4, 0, 0, Math.PI * 2);
      ctx.ellipse(10, -12, 3.8, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      const eyeShift = facing * 2;
      ctx.fillStyle = '#2B241E';
      ctx.beginPath();
      ctx.arc(-6 + eyeShift, -17, 2.6, 0, Math.PI * 2);
      ctx.arc(6 + eyeShift, -17, 2.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(-6.8 + eyeShift, -18, 0.9, 0, Math.PI * 2);
      ctx.arc(5.2 + eyeShift, -18, 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Nose & Smile
      ctx.fillStyle = '#3B332B';
      ctx.beginPath();
      ctx.ellipse(eyeShift, -13, 2.6, 1.9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#3B332B';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(-2.5 + eyeShift, -11, 2.5, 0, Math.PI * 0.85);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(2.5 + eyeShift, -11, 2.5, Math.PI * 0.15, Math.PI);
      ctx.stroke();

      if (pet.accessory !== 'scarf') {
        drawAccessoryOverlay(ctx, pet.accessory, -31, -7, eyeShift, facing);
      }

      ctx.restore();
    }

    // Nameplate
    if (showName && pet.name) {
      ctx.save();
      ctx.font = '700 12px Pretendard, sans-serif';
      const label = isPlayer ? `★ ${pet.name}` : pet.name;
      const tw = ctx.measureText(label).width;
      const px = 9;
      const bw = tw + px * 2;
      const bh = 22;
      const bx = x - bw / 2;
      const by = y + 22 * scale;

      ctx.fillStyle = isPlayer ? 'rgba(255, 122, 89, 0.96)' : 'rgba(255, 255, 255, 0.94)';
      roundRect(ctx, bx, by, bw, bh, 11);
      ctx.fill();

      ctx.fillStyle = isPlayer ? '#FFFFFF' : '#2D2926';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, by + bh / 2 + 0.5);
      ctx.restore();
    }
  }

  class WorldEngine {
    constructor(canvas, initialState) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;

      this.zone = ZONES.find((z) => z.id === initialState.zoneId) || ZONES[0];
      this.timeOfDay = initialState.timeOfDay || 'day';
      this.avatarMode = initialState.avatarMode || 'photo';

      this.player = {
        ...initialState.avatar,
        x: 430,
        y: 345,
        targetX: 430,
        targetY: 345,
        facing: 1,
        walkPhase: 0,
        jumpVel: 0,
        jumpY: 0,
        bubble: null
      };

      this.npcs = NPCS.map((n) => ({
        ...n,
        targetX: n.x,
        targetY: n.y,
        facing: 1,
        walkPhase: 0,
        waitTimer: 60 + Math.random() * 140,
        bubble: null,
        talkCooldown: 120 + Math.random() * 200
      }));

      // Preload all Pexels images
      getCachedImage(this.player.photoUrl);
      this.npcs.forEach((n) => getCachedImage(n.photoUrl));
      ZONES.forEach((z) => getCachedImage(z.coverPhoto));

      this.particles = [];
      this.fireflies = Array.from({ length: 24 }, () => ({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        phase: Math.random() * Math.PI * 2,
        speed: 0.015 + Math.random() * 0.02
      }));

      this.clickRipple = null;
      this.keys = new Set();

      this._bindEvents();
      this._loop = this._loop.bind(this);
      requestAnimationFrame(this._loop);
    }

    _bindEvents() {
      this.canvas.addEventListener('click', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.width / rect.width;
        const scaleY = this.height / rect.height;
        const tx = Math.max(46, Math.min(this.width - 46, (e.clientX - rect.left) * scaleX));
        const ty = Math.max(90, Math.min(this.height - 50, (e.clientY - rect.top) * scaleY));
        this.player.targetX = tx;
        this.player.targetY = ty;
        this.clickRipple = { x: tx, y: ty, radius: 4, alpha: 0.9 };
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
      getCachedImage(next.coverPhoto);
      this.triggerEmote('✨', `${next.name} 도착!`);
    }

    setTimeOfDay(time) {
      this.timeOfDay = time;
    }

    setAvatarMode(mode) {
      this.avatarMode = mode;
    }

    updatePlayerAvatar(avatar) {
      Object.assign(this.player, avatar);
      getCachedImage(avatar.photoUrl);
    }

    centerPlayer() {
      this.player.targetX = 430;
      this.player.targetY = 345;
      this.triggerEmote('🐾', '여기 있어!');
    }

    say(text) {
      this.player.bubble = { text, timer: 240 };
    }

    triggerEmote(emoji, text) {
      if (text) this.say(text);
      if (emoji === '⚡') {
        this.player.jumpVel = 7.8;
      }
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          emoji,
          x: this.player.x + (Math.random() - 0.5) * 38,
          y: this.player.y - 32,
          vy: -0.9 - Math.random() * 0.9,
          vx: (Math.random() - 0.5) * 0.8,
          alpha: 1,
          life: 65 + Math.random() * 25
        });
      }
    }

    waveToNpc(npcId) {
      const npc = this.npcs.find((n) => n.id === npcId);
      if (!npc) return;
      this.player.targetX = Math.max(60, Math.min(this.width - 60, npc.x - 58));
      this.player.targetY = Math.max(95, Math.min(this.height - 55, npc.y + 12));
      this.triggerEmote('👋', `${npc.name}야 안녕!`);
      setTimeout(() => {
        npc.bubble = { text: `${this.player.name}! 반가워 🐾`, timer: 200 };
      }, 450);
    }

    _update() {
      const speed = 3.2;
      let kx = 0;
      let ky = 0;
      if (this.keys.has('w') || this.keys.has('arrowup')) ky -= 1;
      if (this.keys.has('s') || this.keys.has('arrowdown')) ky += 1;
      if (this.keys.has('a') || this.keys.has('arrowleft')) kx -= 1;
      if (this.keys.has('d') || this.keys.has('arrowright')) kx += 1;

      if (kx !== 0 || ky !== 0) {
        const len = Math.hypot(kx, ky);
        this.player.x = Math.max(46, Math.min(this.width - 46, this.player.x + (kx / len) * speed));
        this.player.y = Math.max(90, Math.min(this.height - 50, this.player.y + (ky / len) * speed));
        this.player.targetX = this.player.x;
        this.player.targetY = this.player.y;
        if (kx !== 0) this.player.facing = kx > 0 ? 1 : -1;
        this.player.walkPhase += 0.22;
      } else {
        const dx = this.player.targetX - this.player.x;
        const dy = this.player.targetY - this.player.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 3) {
          this.player.x += (dx / dist) * speed;
          this.player.y += (dy / dist) * speed;
          if (Math.abs(dx) > 1) this.player.facing = dx > 0 ? 1 : -1;
          this.player.walkPhase += 0.2;
        } else {
          this.player.walkPhase *= 0.85;
        }
      }

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

      for (const npc of this.npcs) {
        const dx = npc.targetX - npc.x;
        const dy = npc.targetY - npc.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 3) {
          npc.x += (dx / dist) * 1.25;
          npc.y += (dy / dist) * 1.25;
          if (Math.abs(dx) > 0.5) npc.facing = dx > 0 ? 1 : -1;
          npc.walkPhase += 0.13;
        } else {
          npc.walkPhase *= 0.85;
          npc.waitTimer -= 1;
          if (npc.waitTimer <= 0) {
            npc.targetX = 95 + Math.random() * (this.width - 190);
            npc.targetY = 125 + Math.random() * (this.height - 195);
            npc.waitTimer = 110 + Math.random() * 190;
          }
        }

        if (npc.bubble) {
          npc.bubble.timer -= 1;
          if (npc.bubble.timer <= 0) npc.bubble = null;
        } else {
          npc.talkCooldown -= 1;
          if (npc.talkCooldown <= 0) {
            const line = npc.lines[Math.floor(Math.random() * npc.lines.length)];
            npc.bubble = { text: line, timer: 190 };
            npc.talkCooldown = 340 + Math.random() * 340;
          }
        }
      }

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.alpha = Math.max(0, p.life / 70);
        if (p.life <= 0) this.particles.splice(i, 1);
      }

      if (this.clickRipple) {
        this.clickRipple.radius += 1.6;
        this.clickRipple.alpha -= 0.04;
        if (this.clickRipple.alpha <= 0) this.clickRipple = null;
      }
    }

    _drawEnvironment(ctx) {
      const { width: w, height: h, zone } = this;

      // Ground base
      ctx.fillStyle = zone.ground;
      ctx.fillRect(0, 0, w, h);

      // Subtle atmospheric real Pexels zone backdrop blend
      const bgImg = getCachedImage(zone.coverPhoto);
      if (bgImg) {
        ctx.save();
        ctx.globalAlpha = 0.22;
        const iw = bgImg.naturalWidth || bgImg.width;
        const ih = bgImg.naturalHeight || bgImg.height;
        const scale = Math.max(w / iw, h / ih);
        const dw = iw * scale;
        const dh = ih * scale;
        ctx.drawImage(bgImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
        ctx.restore();
      }

      // Cross paths
      ctx.fillStyle = 'rgba(248, 240, 224, 0.86)';
      roundRect(ctx, w / 2 - 48, 0, 96, h, 0);
      ctx.fill();
      roundRect(ctx, 0, h / 2 - 42, w, 84, 0);
      ctx.fill();

      // Central plaza circle
      ctx.fillStyle = 'rgba(255, 250, 240, 0.9)';
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 118, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Central photo medallion / landmark
      if (bgImg && this.avatarMode === 'photo') {
        ctx.save();
        drawCoverCircleImage(ctx, bgImg, w / 2, h / 2, 54);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 54, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        this._drawLandmark(ctx, w / 2, h / 2, zone.landmark);
      }

      // Decorative trees
      const trees = [
        [95, 95],
        [155, 78],
        [760, 90],
        [710, 125],
        [95, 435],
        [760, 435]
      ];
      for (const [tx, ty] of trees) {
        this._drawTree(ctx, tx, ty, zone.accent);
      }

      this._drawBench(ctx, 290, 145);
      this._drawBench(ctx, 570, 145);

      if (this.clickRipple) {
        ctx.save();
        ctx.strokeStyle = `rgba(255, 122, 89, ${this.clickRipple.alpha})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(
          this.clickRipple.x,
          this.clickRipple.y,
          this.clickRipple.radius,
          this.clickRipple.radius * 0.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    _drawLandmark(ctx, cx, cy, type) {
      const t = performance.now() * 0.003;
      ctx.save();
      if (type === 'fountain') {
        ctx.fillStyle = '#D7CFC3';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, 54, 34, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7FD3F4';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 44, 26, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 2, 16 + Math.sin(t) * 6, 9 + Math.sin(t) * 3, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'cafe') {
        ctx.fillStyle = '#F7EFE4';
        ctx.beginPath();
        ctx.arc(cx, cy, 42, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FF7A59';
        ctx.beginPath();
        ctx.arc(cx, cy - 16, 36, Math.PI, 0);
        ctx.fill();
        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.fillText('☕', cx, cy + 8);
      } else if (type === 'rainbow') {
        const colors = ['#FF7A7A', '#FFB86B', '#FFE57F', '#7EE0A3', '#8CC8FF', '#B79BFF'];
        colors.forEach((col, idx) => {
          ctx.strokeStyle = col;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(cx, cy + 16, 56 - idx * 5, Math.PI, 0);
          ctx.stroke();
        });
      } else if (type === 'arena') {
        ctx.strokeStyle = '#FF9F43';
        ctx.lineWidth = 6;
        roundRect(ctx, cx - 44, cy - 22, 88, 44, 14);
        ctx.stroke();
        ctx.font = '28px serif';
        ctx.textAlign = 'center';
        ctx.fillText('🏆', cx, cy + 10);
      }
      ctx.restore();
    }

    _drawTree(ctx, x, y, foliageColor) {
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.beginPath();
      ctx.ellipse(x, y + 20, 24, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#8C5E3C';
      roundRect(ctx, x - 6, y - 4, 12, 24, 4);
      ctx.fill();

      ctx.fillStyle = foliageColor;
      ctx.beginPath();
      ctx.arc(x, y - 16, 23, 0, Math.PI * 2);
      ctx.arc(x - 14, y - 6, 15, 0, Math.PI * 2);
      ctx.arc(x + 14, y - 6, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    _drawBench(ctx, x, y) {
      ctx.save();
      ctx.fillStyle = '#B87B4B';
      roundRect(ctx, x - 26, y - 8, 52, 12, 4);
      ctx.fill();
      ctx.fillStyle = '#8C5931';
      ctx.fillRect(x - 20, y + 4, 5, 8);
      ctx.fillRect(x + 15, y + 4, 5, 8);
      ctx.restore();
    }

    _drawSpeechBubble(ctx, x, y, text) {
      ctx.save();
      ctx.font = '600 12px Pretendard, sans-serif';
      const padX = 10;
      const w = Math.min(220, ctx.measureText(text).width + padX * 2);
      const h = 28;
      const bx = Math.max(12, Math.min(this.width - w - 12, x - w / 2));
      const by = Math.max(12, y - 86);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = 'rgba(34, 32, 29, 0.16)';
      ctx.lineWidth = 1.5;
      roundRect(ctx, bx, by, w, h, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#22201D';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, bx + w / 2, by + h / 2 + 0.5, w - 12);
      ctx.restore();
    }

    _drawTimeOverlay(ctx) {
      if (this.timeOfDay === 'sunset') {
        ctx.fillStyle = 'rgba(255, 130, 72, 0.22)';
        ctx.fillRect(0, 0, this.width, this.height);
      } else if (this.timeOfDay === 'night') {
        ctx.fillStyle = 'rgba(22, 28, 58, 0.44)';
        ctx.fillRect(0, 0, this.width, this.height);

        for (const f of this.fireflies) {
          f.phase += f.speed;
          const glow = 0.45 + 0.55 * Math.sin(f.phase);
          ctx.fillStyle = `rgba(255, 236, 148, ${glow})`;
          ctx.beginPath();
          ctx.arc(f.x + Math.sin(f.phase) * 8, f.y + Math.cos(f.phase) * 6, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    _render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      this._drawEnvironment(ctx);

      const actors = [
        ...this.npcs.map((n) => ({ ...n, isPlayer: false })),
        { ...this.player, isPlayer: true }
      ].sort((a, b) => a.y - b.y);

      for (const actor of actors) {
        drawPetCharacter(ctx, actor, {
          x: actor.x,
          y: actor.y,
          scale: actor.isPlayer ? 1.08 : 1,
          bob: Math.sin(actor.walkPhase),
          jump: actor.jumpY || 0,
          facing: actor.facing,
          isPlayer: actor.isPlayer,
          showName: true,
          mode: this.avatarMode
        });
      }

      for (const actor of actors) {
        if (actor.bubble) {
          this._drawSpeechBubble(ctx, actor.x, actor.y - (actor.jumpY || 0), actor.bubble.text);
        }
      }

      for (const p of this.particles) {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText(p.emoji, p.x, p.y);
        ctx.restore();
      }

      this._drawTimeOverlay(ctx);
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
