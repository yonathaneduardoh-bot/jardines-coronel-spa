// ============================================
// JARDINES CORONEL SPA — Scroll Animations
// Efectos al hacer scroll (Intersection Observer)
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== SCROLL REVEAL (fade-up y fade-in) =====
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Una vez visible, dejar de observar para performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Observar todos los elementos con animación
  document.querySelectorAll('.fade-up, .fade-in').forEach(el => {
    revealObserver.observe(el);
  });

  // ===== PARALLAX SUTIL en el hero =====
  const heroBg = document.querySelector('.hero-bg');

  if (heroBg) {
    const handleParallax = () => {
      const scrollY = window.scrollY;
      // Mover el fondo más lento que el scroll para efecto profundidad
      heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.25}px)`;
    };

    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // ===== HOVER TILT en service cards =====
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const tiltX  = ((y - cy) / cy) * 5;
      const tiltY  = ((cx - x) / cx) * 5;

      card.style.transform = `
        translateY(-6px)
        perspective(800px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== HOVER TILT en team cards =====
  document.querySelectorAll('.team-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const tiltX = ((y - cy) / cy) * 4;
      const tiltY = ((cx - x) / cx) * 4;

      card.style.transform = `
        translateY(-6px)
        perspective(800px)
        rotateX(${tiltX}deg)
        rotateY(${tiltY}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ===== NAVBAR: cambio de color según sección =====
  // (complementa a main.js)

  // ===== GALERÍA: Lightbox simple =====
  const galleryCards = document.querySelectorAll('.gallery-card');

  // Crear overlay lightbox
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(13,33,55,0.95);
    z-index: 9999;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(12px);
    cursor: zoom-out;
    animation: fadeIn 0.25s ease;
  `;
  lightbox.innerHTML = `
    <img id="lightbox-img" style="
      max-width: 90vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
      animation: zoomIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
    "/>
    <button id="lightbox-close" style="
      position: absolute;
      top: 24px;
      right: 24px;
      background: rgba(255,255,255,0.12);
      border: none;
      color: white;
      font-size: 28px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
      backdrop-filter: blur(8px);
    ">×</button>
  `;
  document.body.appendChild(lightbox);

  // Añadir keyframes al head
  const style = document.createElement('style');
  style.textContent = `
    @keyframes zoomIn {
      from { transform: scale(0.85); opacity: 0; }
      to   { transform: scale(1);    opacity: 1; }
    }
  `;
  document.head.appendChild(style);

  const lbImg   = lightbox.querySelector('#lightbox-img');
  const lbClose = lightbox.querySelector('#lightbox-close');

  const openLightbox = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
    lbImg.src = '';
  };

  galleryCards.forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lbClose.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

});
