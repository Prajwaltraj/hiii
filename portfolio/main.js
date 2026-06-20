/* ════════════════════════════════════════════
   WARRIOR PORTFOLIO — MAIN JAVASCRIPT
   Three.js 3D scene + all interactions
   ════════════════════════════════════════════ */

'use strict';

/* ─── THREE.JS 3D BACKGROUND ──────────────── */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 80);

  /* ── Particle field ── */
  const PARTICLE_COUNT = 1800;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);

  const palette = [
    new THREE.Color(0xc9a84c), // gold
    new THREE.Color(0xe8c87a), // gold-light
    new THREE.Color(0xe8622a), // ember
    new THREE.Color(0x8a6d2f), // gold-dark
    new THREE.Color(0xfff5d6), // warm-white
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const spread = 200;
    positions[i * 3]     = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.55,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  /* ── Floating rune rings ── */
  function makeRing(radius, tubeRadius, color, x, y, z) {
    const g = new THREE.TorusGeometry(radius, tubeRadius, 6, 64);
    const m = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.2,
      wireframe: false,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
  }

  const ring1 = makeRing(28, 0.08, 0xc9a84c,  0,  0, -40);
  const ring2 = makeRing(18, 0.06, 0xe8622a,  30, -10, -20);
  const ring3 = makeRing(12, 0.05, 0xc9a84c, -20,  15, -15);

  /* ── Mouse / gyro parallax ── */
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  /* ── Scroll parallax ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  /* ── Animate ── */
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    // Ease mouse
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    particles.rotation.y = t * 0.06 + targetX * 0.4;
    particles.rotation.x = targetY * 0.3 + scrollY * 0.0003;

    ring1.rotation.x = t * 0.18;
    ring1.rotation.y = t * 0.10;

    ring2.rotation.x = -t * 0.14;
    ring2.rotation.z = t * 0.09;

    ring3.rotation.y = t * 0.22;
    ring3.rotation.z = -t * 0.12;

    camera.position.y = -scrollY * 0.008;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ─── CURSOR GLOW ─────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let cx = 0, cy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

  function animateCursor() {
    cx += (tx - cx) * 0.12;
    cy += (ty - cy) * 0.12;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', () => {
    glow.style.transform = 'translate(-50%, -50%) scale(1.8)';
    glow.style.opacity = '1';
  });
  document.addEventListener('mouseup', () => {
    glow.style.transform = 'translate(-50%, -50%) scale(1)';
    glow.style.opacity = '0.7';
  });
})();

/* ─── NAVBAR SCROLL ───────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section[id]');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── MOBILE MENU TOGGLE ──────────────────── */
(function initMobileMenu() {
  const btn   = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    const spans = btn.querySelectorAll('span');
    if (links.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ─── SCROLL-REVEAL ANIMATIONS ────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Add classes and observe
  document.querySelectorAll('.section-title, .section-sub, .stat-card, .skill-category, .project-card, .contact-card').forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.timeline-item').forEach((el) => {
    observer.observe(el);
  });

  document.querySelectorAll('.about-portrait').forEach(el => {
    el.classList.add('slide-left');
    observer.observe(el);
  });

  document.querySelectorAll('.about-story').forEach(el => {
    el.classList.add('slide-right');
    observer.observe(el);
  });
})();

/* ─── SKILL BAR ANIMATION ─────────────────── */
(function initSkillBars() {
  const skillFills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width') || '0';
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(el => observer.observe(el));
})();

/* ─── ANIMATED STAT COUNTERS ──────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  function animateCounter(el) {
    const raw = el.getAttribute('data-target');
    const target = parseInt(raw, 10);
    if (isNaN(target)) {
      el.textContent = raw; // keep placeholder text
      return;
    }
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + (target >= 10 ? '+' : '');
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ─── PROJECT FILTER TABS ─────────────────── */
(function initFilter() {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.project-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'heroFadeIn 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ─── CONTACT FORM ────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.textContent = '⌛ Dispatching…';
    submitBtn.disabled = true;

    // Simulate async send (replace with real fetch/EmailJS/Formspree)
    await new Promise(r => setTimeout(r, 1400));

    form.reset();
    if (success) { success.style.display = 'block'; }
    submitBtn.innerHTML = '<span>⚔ Send the War Signal</span>';
    submitBtn.disabled = false;

    setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
  });
})();

/* ─── FOOTER YEAR ─────────────────────────── */
(function setYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ─── SMOOTH SCROLL (fallback for older Safari) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── CURSOR EFFECT ON INTERACTIVE ELEMENTS ── */
document.querySelectorAll('a, button, .project-card, .stat-card, .skill-category').forEach(el => {
  const glow = document.getElementById('cursorGlow');
  el.addEventListener('mouseenter', () => {
    if (glow) {
      glow.style.width  = '50px';
      glow.style.height = '50px';
      glow.style.background = 'radial-gradient(circle, rgba(232,98,42,0.7) 0%, transparent 70%)';
    }
  });
  el.addEventListener('mouseleave', () => {
    if (glow) {
      glow.style.width  = '28px';
      glow.style.height = '28px';
      glow.style.background = 'radial-gradient(circle, rgba(201,168,76,0.6) 0%, transparent 70%)';
    }
  });
});

/* ─── PARALLAX TILT on Project Cards ─────── */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease';
  });
});

/* ─── LOADING SCREEN ──────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.getElementById('loaderBar');
  if (!loader || !bar) return;

  // ── Fill bar from 0→100 over ~1400ms then hide ──
  let pct = 0;
  const interval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) {
      pct = 100;
      clearInterval(interval);
      bar.style.width = '100%';
      // Short pause, then fade out
      setTimeout(() => {
        loader.classList.add('hidden');
        startHeroTyping();
      }, 300);
    } else {
      bar.style.width = pct + '%';
    }
  }, 80);
})();

/* ─── HERO TYPEWRITER EFFECT ─────────────── */
function startHeroTyping() {
  const nameEl     = document.getElementById('heroTyping');
  const subtitleEl = document.getElementById('heroSubTyping');
  const cursor     = document.querySelector('.typing-cursor');

  const heroName     = 'Prajwal T Raj';
  const heroSubtitle = 'Full Stack Developer & Data Science Enthusiast';

  if (!nameEl) return;

  let i = 0;
  function typeName() {
    if (i < heroName.length) {
      nameEl.textContent += heroName[i];
      i++;
      setTimeout(typeName, 70 + Math.random() * 40);
    } else {
      // Hide cursor after name, start subtitle
      if (cursor) cursor.style.display = 'none';
      setTimeout(() => typeSubtitle(), 300);
    }
  }

  let j = 0;
  function typeSubtitle() {
    if (!subtitleEl) return;
    if (j < heroSubtitle.length) {
      subtitleEl.textContent += heroSubtitle[j];
      j++;
      setTimeout(typeSubtitle, 32 + Math.random() * 20);
    }
  }

  typeName();
}
