// ============================================
// JARDINES CORONEL SPA — Main JS
// Lógica general: nav, scroll, formulario
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== NAVBAR: cambia estilo al hacer scroll =====
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // ejecutar al cargar

  // ===== HAMBURGER MENU (móvil) =====
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Cerrar menú móvil al hacer clic en link
  document.querySelectorAll('#nav-mobile .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ===== SMOOTH SCROLL para enlaces ancla =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== ACTIVE NAV LINK según sección visible =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link[href^="#"]');

  const highlightNav = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.style.color = link.getAttribute('href') === `#${current}`
        ? 'var(--color-green-light)'
        : '';
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });

  // ===== FORMULARIO DE CONTACTO =====
  const form = document.getElementById('contact-form');
  const formWrap = document.getElementById('form-wrap');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('.btn-text');

    // Estado de carga
    submitBtn.classList.add('btn-loading');

    // Recopilar datos
    const data = {
      nombre:   form.nombre.value.trim(),
      email:    form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      servicio: form.servicio.value,
      mensaje:  form.mensaje.value.trim(),
    };

    // Simulación de envío (2s) — conectar con backend/Formspree real aquí
    await new Promise(r => setTimeout(r, 2000));

    // Mostrar éxito
    submitBtn.classList.remove('btn-loading');
    formWrap.innerHTML = `
      <div class="form-success">
        <div class="form-success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3>¡Mensaje enviado!</h3>
        <p>Gracias <strong>${data.nombre}</strong>, nos pondremos en contacto contigo a la brevedad.</p>
      </div>
    `;
  });

  // ===== RIPPLE EN BOTONES =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span');
      const diameter = Math.max(this.clientWidth, this.clientHeight);
      const radius   = diameter / 2;
      const rect     = this.getBoundingClientRect();

      circle.classList.add('ripple-wave');
      circle.style.cssText = `
        width: ${diameter}px;
        height: ${diameter}px;
        left: ${e.clientX - rect.left - radius}px;
        top:  ${e.clientY - rect.top  - radius}px;
      `;
      this.classList.add('btn-ripple');
      const existing = this.querySelector('.ripple-wave');
      if (existing) existing.remove();
      this.appendChild(circle);
    });
  });

  // ===== CONTADOR ANIMADO =====
  const counters = document.querySelectorAll('[data-counter]');

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute('data-counter'));
    const suffix   = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const step     = target / (duration / 16);
    let current    = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 16);
  };

  // Disparar contadores cuando son visibles
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

});
