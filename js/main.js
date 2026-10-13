// ============================================
// JARDINES CORONEL SPA — Main JS
// Lógica general: nav, scroll, formulario,
// modal de servicios, reseñas localStorage
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR: cambia estilo al hacer scroll =====
  const navbar = document.getElementById('navbar');
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ===== HAMBURGER MENU (móvil) =====
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('#nav-mobile .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== ACTIVE NAV LINK =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--color-green-light)' : '';
    });
  }, { passive: true });

  // ===== FORMULARIO DE CONTACTO =====
  const form     = document.getElementById('contact-form');
  const formWrap = document.getElementById('form-wrap');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.classList.add('btn-loading');
    const nombre = form.nombre.value.trim();
    await new Promise(r => setTimeout(r, 1800));
    submitBtn.classList.remove('btn-loading');
    formWrap.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3>¡Mensaje enviado!</h3>
        <p>Gracias <strong>${nombre}</strong>, nos pondremos en contacto contigo a la brevedad.</p>
      </div>`;
  });

  // ===== RIPPLE EN BOTONES =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle   = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius   = diameter / 2;
      const rect     = this.getBoundingClientRect();
      circle.classList.add('ripple-wave');
      circle.style.cssText = `width:${diameter}px;height:${diameter}px;left:${e.clientX - rect.left - radius}px;top:${e.clientY - rect.top - radius}px;`;
      this.classList.add('btn-ripple');
      this.querySelector('.ripple-wave')?.remove();
      this.appendChild(circle);
    });
  });

  // ===== CONTADOR ANIMADO =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.counted) return;
      entry.target.dataset.counted = 'true';
      const target   = parseInt(entry.target.getAttribute('data-counter'));
      const suffix   = entry.target.getAttribute('data-suffix') || '';
      const step     = target / (2000 / 16);
      let current    = 0;
      const timer    = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        entry.target.textContent = Math.floor(current) + suffix;
      }, 16);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(c => counterObserver.observe(c));

  // ============================================================
  // ===== SERVICE IMAGE MODAL =====
  // ============================================================

  // Crear modal en el DOM
  const serviceModal = document.createElement('div');
  serviceModal.id = 'service-modal';
  serviceModal.setAttribute('role', 'dialog');
  serviceModal.setAttribute('aria-modal', 'true');
  serviceModal.innerHTML = `
    <button id="service-modal-close" aria-label="Cerrar">×</button>
    <img id="service-modal-img" src="" alt="" />
    <div id="service-modal-title"></div>
  `;
  document.body.appendChild(serviceModal);

  const sModalImg   = serviceModal.querySelector('#service-modal-img');
  const sModalTitle = serviceModal.querySelector('#service-modal-title');
  const sModalClose = serviceModal.querySelector('#service-modal-close');

  const openServiceModal = (imgSrc, title) => {
    sModalImg.src = imgSrc;
    sModalImg.alt = title;
    sModalTitle.textContent = title;
    serviceModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeServiceModal = () => {
    serviceModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { sModalImg.src = ''; }, 300);
  };

  // Asignar eventos a los botones de ícono de servicio
  document.querySelectorAll('.service-icon-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const img   = btn.getAttribute('data-image');
      const title = btn.getAttribute('data-title');
      openServiceModal(img, title);
    });
  });

  sModalClose.addEventListener('click', closeServiceModal);
  serviceModal.addEventListener('click', (e) => {
    if (e.target === serviceModal) closeServiceModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal.classList.contains('open')) closeServiceModal();
  });

  // ============================================================
  // ===== SISTEMA DE RESEÑAS (localStorage) =====
  // ============================================================

  const REVIEWS_KEY     = 'jardines-coronel-reviews';
  const reviewForm      = document.getElementById('review-form');
  const reviewsDynamic  = document.getElementById('reviews-dynamic');
  const reviewsCountBadge = document.getElementById('reviews-count');
  let selectedStars     = 0;

  // --- Estrella interactiva ---
  const starBtns = document.querySelectorAll('.star-btn');
  starBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedStars = parseInt(btn.getAttribute('data-value'));
      starBtns.forEach(s => {
        s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= selectedStars);
      });
    });
    // Hover preview
    btn.addEventListener('mouseenter', () => {
      const val = parseInt(btn.getAttribute('data-value'));
      starBtns.forEach(s => {
        s.style.color = parseInt(s.getAttribute('data-value')) <= val ? '#F59E0B' : '';
      });
    });
    btn.addEventListener('mouseleave', () => {
      starBtns.forEach(s => { s.style.color = ''; });
    });
  });

  // --- Renderizar reseñas desde localStorage ---
  const renderReviews = () => {
    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');

    if (reviewsCountBadge) {
      reviewsCountBadge.textContent = reviews.length === 0 ? 'Sin reseñas aún' : `${reviews.length} reseña${reviews.length > 1 ? 's' : ''}`;
    }

    if (!reviewsDynamic) return;

    if (reviews.length === 0) {
      reviewsDynamic.innerHTML = `
        <div class="reviews-empty">
          <span class="reviews-empty-icon">🌱</span>
          <p>¡Sé el primero en dejar una reseña!</p>
        </div>`;
      return;
    }

    reviewsDynamic.innerHTML = reviews.map(r => {
      const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
      const stars    = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
      return `
        <div class="review-card">
          <div class="review-card-header">
            <div class="review-author-wrap">
              <div class="review-avatar">${initials}</div>
              <div>
                <div class="review-author-name">${escapeHTML(r.name)}</div>
                <div class="review-date">${r.date}</div>
              </div>
            </div>
            <div class="review-stars" aria-label="${r.stars} de 5 estrellas">${stars}</div>
          </div>
          <p class="review-text">"${escapeHTML(r.text)}"</p>
        </div>`;
    }).join('');
  };

  // --- Sanitizar HTML para evitar XSS ---
  const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // --- Enviar reseña ---
  reviewForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = reviewForm['review-name'].value.trim();
    const text = reviewForm['review-text'].value.trim();

    if (!name || !text) {
      alert('Por favor completa nombre y comentario.');
      return;
    }
    if (selectedStars === 0) {
      alert('Por favor selecciona una calificación de estrellas.');
      return;
    }

    const reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY) || '[]');
    const newReview = {
      name,
      text,
      stars: selectedStars,
      date: new Date().toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    reviews.unshift(newReview);
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews.slice(0, 15)));

    // Reset form
    reviewForm.reset();
    selectedStars = 0;
    starBtns.forEach(s => s.classList.remove('active'));

    renderReviews();

    // Scroll suave a las reseñas
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
    const top  = reviewsDynamic.getBoundingClientRect().top + window.scrollY - navH - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });

  // Cargar reseñas al iniciar
  renderReviews();

});
