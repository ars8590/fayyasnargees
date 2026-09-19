/* ==========================================================
   LUXURY NIKKAH INVITATION — JAVASCRIPT INTERACTIONS
   Fayyas & Nargees | 27 September 2026 (10:15 AM)
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- HERO & VIDEO EXPERIENCE ---
  const heroSection = document.getElementById('heroSection');
  const video = document.getElementById('curtainVideo');
  const playOverlay = document.getElementById('playOverlay');
  const openBtn = document.getElementById('openInvitationBtn');

  // --- MUSIC ---
  const music = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicIcon = document.getElementById('musicIcon');

  let isPlaying = false;
  let shouldResumeOnVisible = false;
  let isExperienceStarted = false;
  let isHeroFinished = false;

  // Speaker icons SVG
  const iconSoundOn = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    </svg>`;
  const iconSoundMuted = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
      <line x1="23" y1="9" x2="17" y2="15"></line>
      <line x1="17" y1="9" x2="23" y2="15"></line>
    </svg>`;

  function updateMusicButton() {
    if (musicIcon) {
      musicIcon.innerHTML = isPlaying ? iconSoundOn : iconSoundMuted;
    }
  }

  function pauseMusicForVisibility() {
    if (music && isPlaying && !music.paused) {
      music.pause();
      isPlaying = false;
      shouldResumeOnVisible = true;
      updateMusicButton();
    }
  }

  function resumeMusicForVisibility() {
    if (!music || !shouldResumeOnVisible) return;
    music.play()
      .then(() => {
        isPlaying = true;
        shouldResumeOnVisible = false;
        updateMusicButton();
      })
      .catch((err) => {
        console.log('Resume audio failed:', err);
        shouldResumeOnVisible = false;
      });
  }

  // Prevent background scroll before envelope is opened
  document.body.style.overflow = 'hidden';

  function finishHeroExperience() {
    if (isHeroFinished) return;
    isHeroFinished = true;

    if (heroSection) {
      heroSection.classList.add('hide');
      setTimeout(() => {
        heroSection.style.display = 'none';
        document.body.style.overflow = 'auto';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 600);
    }
  }

  function startInvitationExperience(e) {
    if (e) {
      e.stopPropagation();
      if (e.type === 'touchend') e.preventDefault();
    }

    if (isHeroFinished) return;

    // Second tap during video skips directly to invitation
    if (isExperienceStarted) {
      finishHeroExperience();
      return;
    }

    isExperienceStarted = true;

    // Hide cover overlay to reveal curtain video underneath
    if (playOverlay) {
      playOverlay.style.opacity = '0';
      playOverlay.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        playOverlay.style.display = 'none';
      }, 400);
    }

    // Play curtain video
    if (video) {
      video.muted = true;
      video.currentTime = 0;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log('Curtain video error, proceeding:', err);
          finishHeroExperience();
        });
      }
    } else {
      finishHeroExperience();
    }

    // Start background music
    if (music) {
      music.volume = 0.35;
      music.play()
        .then(() => {
          isPlaying = true;
          updateMusicButton();
        })
        .catch((err) => {
          console.log('Audio autoplay prevented, user can toggle manually:', err);
        });
    }
  }

  // Listeners for Opening CTA
  if (openBtn) {
    openBtn.addEventListener('click', startInvitationExperience);
    openBtn.addEventListener('touchend', startInvitationExperience);
  }

  if (playOverlay) {
    playOverlay.addEventListener('click', startInvitationExperience);
  }

  if (heroSection) {
    heroSection.addEventListener('click', () => {
      if (isExperienceStarted && !isHeroFinished) finishHeroExperience();
    });
  }

  if (video) {
    video.addEventListener('ended', finishHeroExperience);
    video.addEventListener('error', finishHeroExperience);
  }

  // Music toggle listener
  if (musicToggle) {
    musicToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        music.pause();
        isPlaying = false;
        shouldResumeOnVisible = false;
        updateMusicButton();
      } else {
        music.play()
          .then(() => {
            isPlaying = true;
            shouldResumeOnVisible = false;
            updateMusicButton();
          })
          .catch((err) => console.log('Music play error:', err));
      }
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseMusicForVisibility();
    else resumeMusicForVisibility();
  });
  window.addEventListener('blur', pauseMusicForVisibility);
  window.addEventListener('focus', resumeMusicForVisibility);


  // ==========================================================
  // 2. SCRATCH-TO-REVEAL INTERACTION (NO TIME PILL)
  // ==========================================================
  const canvas = document.getElementById('scratchCanvas');
  const revealedCard = document.getElementById('revealedDateCard');
  const statusBar = document.getElementById('revealStatusBar');
  const resetBtn = document.getElementById('resetScratchBtn');

  let isScratching = false;
  let isDateRevealed = false;
  let lastX = 0;
  let lastY = 0;

  function initScratchCard() {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    function drawMetallicFoil() {
      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, w, h);

      // Antique Gold metallic gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#c5a059');
      grad.addColorStop(0.2, '#fcf5d8');
      grad.addColorStop(0.4, '#b08850');
      grad.addColorStop(0.65, '#fcf5d8');
      grad.addColorStop(0.85, '#9e7317');
      grad.addColorStop(1, '#c5a059');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fine diagonal foil sheen lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.lineWidth = 1;
      for (let i = -w; i < w * 2; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }

      // Elegant inner border line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(6, 6, w - 12, h - 12);

      // Center instruction on the foil
      ctx.font = '600 10px "Inter", sans-serif';
      ctx.fillStyle = '#4a0e17';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '3px';
      ctx.fillText('SCRATCH TO DISCOVER', w / 2, h / 2);

      ctx.restore();
    }

    drawMetallicFoil();
    isDateRevealed = false;
    canvas.style.display = 'block';
    canvas.style.opacity = '1';
    canvas.style.transform = 'scale(1)';
    if (statusBar) statusBar.classList.remove('visible');

    function getCoords(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * (canvas.width / rect.width),
        y: (clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function eraseFoil(x, y, prevX, prevY) {
      ctx.globalCompositeOperation = 'destination-out';
      const dx = x - prevX;
      const dy = y - prevY;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / 3));

      for (let i = 0; i <= steps; i++) {
        const curX = prevX + (dx * i) / steps;
        const curY = prevY + (dy * i) / steps;

        ctx.beginPath();
        ctx.arc(curX, curY, 18, 0, Math.PI * 2);
        ctx.fill();

        // Organic edge specks
        for (let j = 0; j < 2; j++) {
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * 5 + 3;
          const offset = Math.random() * 14;
          ctx.beginPath();
          ctx.arc(curX + Math.cos(angle) * offset, curY + Math.sin(angle) * offset, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function handleStart(e) {
      if (isDateRevealed) return;
      isScratching = true;
      const pos = getCoords(e);
      lastX = pos.x;
      lastY = pos.y;
      eraseFoil(pos.x, pos.y, pos.x, pos.y);
      checkRevealed();
    }

    function handleMove(e) {
      if (!isScratching || isDateRevealed) return;
      const pos = getCoords(e);
      eraseFoil(pos.x, pos.y, lastX, lastY);
      lastX = pos.x;
      lastY = pos.y;
      checkRevealed();
    }

    function handleEnd() {
      isScratching = false;
    }

    function checkRevealed() {
      if (isDateRevealed) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let clearPixels = 0;
      for (let i = 3; i < data.length; i += 32) {
        if (data[i] === 0) clearPixels++;
      }
      const percent = (clearPixels / (data.length / 32)) * 100;

      if (percent > 35) {
        isDateRevealed = true;
        canvas.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        canvas.style.opacity = '0';
        canvas.style.transform = 'scale(1.03)';

        setTimeout(() => {
          canvas.style.display = 'none';
        }, 600);

        // Shimmer and subtle celebration on revealed card
        if (revealedCard) {
          revealedCard.classList.add('card-revealed-glow');
        }

        if (statusBar) {
          statusBar.classList.add('visible');
        }

        // Trigger realistic party poppers
        triggerCelebrationPopper();
      }
    }

    canvas.onmousedown = handleStart;
    canvas.onmousemove = handleMove;
    window.onmouseup = handleEnd;

    canvas.ontouchstart = (e) => { handleStart(e); };
    canvas.ontouchmove = (e) => { handleMove(e); };
    window.ontouchend = handleEnd;

    if (resetBtn) {
      resetBtn.onclick = (e) => {
        e.stopPropagation();
        initScratchCard();
      };
    }
  }

  initScratchCard();


  // ==========================================================
  // CELEBRATION POPPER (DUAL CANNON FOIL CONFETTI)
  // ==========================================================
  function triggerCelebrationPopper() {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.inset = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '99999';
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    const colors = [
      '#7a1d18', '#36050b', '#b08850', '#c5a059',
      '#fcf5d8', '#ffffff', '#e5ba48', '#d4af37'
    ];

    function createWave(isLeft, count, delay) {
      setTimeout(() => {
        const originX = isLeft ? window.innerWidth * 0.08 : window.innerWidth * 0.92;
        const originY = window.innerHeight * 0.92;

        for (let i = 0; i < count; i++) {
          const particle = document.createElement('div');
          const color = colors[Math.floor(Math.random() * colors.length)];
          const shapeType = Math.random();

          particle.style.position = 'absolute';
          particle.style.willChange = 'transform, opacity';

          if (shapeType > 0.82) {
            particle.textContent = '✨';
            particle.style.fontSize = (Math.random() * 12 + 10) + 'px';
            particle.style.lineHeight = '1';
          } else if (shapeType > 0.55) {
            particle.style.width = (Math.random() * 4 + 3) + 'px';
            particle.style.height = (Math.random() * 22 + 12) + 'px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = '2px';
            particle.style.boxShadow = '0 1px 3px rgba(0,0,0,0.15)';
          } else {
            const size = Math.random() * 8 + 5;
            particle.style.width = size + 'px';
            particle.style.height = (Math.random() > 0.4 ? size : size * 1.4) + 'px';
            particle.style.backgroundColor = color;
            particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '1px';
            particle.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
          }

          particle.style.left = originX + 'px';
          particle.style.top = originY + 'px';

          const minAngle = isLeft ? -Math.PI * 0.42 : -Math.PI * 0.85;
          const maxAngle = isLeft ? -Math.PI * 0.15 : -Math.PI * 0.58;
          const angle = minAngle + Math.random() * (maxAngle - minAngle);

          const speed = Math.random() * 500 + 500;
          let vx = Math.cos(angle) * speed;
          let vy = Math.sin(angle) * speed;

          let posX = originX;
          let posY = originY;
          let opacity = 1;
          let rotX = Math.random() * 360;
          let rotY = Math.random() * 360;
          let rotZ = Math.random() * 360;
          let rotSpeedX = (Math.random() - 0.5) * 20;
          let rotSpeedY = (Math.random() - 0.5) * 20;
          let rotSpeedZ = (Math.random() - 0.5) * 10;
          const wobblePhase = Math.random() * Math.PI * 2;
          const wobbleFreq = Math.random() * 8 + 6;

          let startTime = null;

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = (timestamp - startTime) / 1000;

            if (elapsed > 3.2) {
              particle.remove();
              return;
            }

            const dt = 0.016;
            vx *= 0.975;
            vy = (vy + 600 * dt) * 0.975;

            const flutter = Math.sin(elapsed * wobbleFreq + wobblePhase) * 2;
            posX += (vx + flutter) * dt;
            posY += vy * dt;

            rotX += rotSpeedX;
            rotY += rotSpeedY;
            rotZ += rotSpeedZ;

            opacity = Math.max(0, 1 - Math.pow(elapsed / 3.0, 2.5));

            particle.style.transform = `translate3d(${posX - originX}px, ${posY - originY}px, 0) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg)`;
            particle.style.opacity = opacity;

            requestAnimationFrame(animate);
          }

          container.appendChild(particle);
          requestAnimationFrame(animate);
        }
      }, delay);
    }

    createWave(true, 40, 0);
    createWave(false, 40, 0);
    createWave(true, 25, 90);
    createWave(false, 25, 90);

    setTimeout(() => {
      container.remove();
    }, 3600);
  }


  // ==========================================================
  // 3. COUNTDOWN TO NIKKAH (27 SEPTEMBER 2026, 10:15 AM)
  // ==========================================================
  function initCountdown() {
    const targetDate = new Date('2026-09-27T10:15:00+05:30').getTime();

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

    function update() {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minsEl.textContent = '00';
        secsEl.textContent = '00';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      daysEl.textContent = String(days).padStart(2, '0');
      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  initCountdown();


  // ==========================================================
  // 4. WHATSAPP RSVP INTERACTION (NUMBER: 9633190113)
  // ==========================================================
  function initRSVP() {
    const acceptBtn = document.getElementById('rsvpAcceptBtn');
    const declineBtn = document.getElementById('rsvpDeclineBtn');
    const feedback = document.getElementById('rsvpFeedback');
    const phone = '919633190113';

    if (!acceptBtn || !declineBtn || !feedback) return;

    acceptBtn.addEventListener('click', () => {
      triggerCelebrationPopper();
      feedback.style.opacity = '0';
      feedback.style.color = 'var(--color-burgundy-accent)';

      setTimeout(() => {
        feedback.textContent = 'Joyfully accepted! Connecting to WhatsApp...';
        feedback.style.opacity = '1';
      }, 150);

      const msg = encodeURIComponent('Salam! I joyfully accept the invitation for the Nikkah of Fayyas & Nargees on 27 Sept 2026.');
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      }, 700);
    });

    declineBtn.addEventListener('click', () => {
      feedback.style.opacity = '0';
      feedback.style.color = 'var(--color-text-muted)';

      setTimeout(() => {
        feedback.textContent = 'Warm blessings noted. Connecting to WhatsApp...';
        feedback.style.opacity = '1';
      }, 150);

      const msg = encodeURIComponent('Salam! I regretfully decline the invitation for the Nikkah of Fayyas & Nargees, sending my warmest blessings and du\'as.');
      setTimeout(() => {
        window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
      }, 700);
    });
  }

  initRSVP();

});
