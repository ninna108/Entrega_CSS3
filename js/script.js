/* main.js
   Header scroll, hamburger, submenu mobile toggle, modal, toast, form validation, smooth scroll
   Compatível com o CSS fornecido.
*/

(() => {
  // ---- DOM ----
  const siteHeader = document.getElementById('siteHeader');
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const campanhasItem = document.getElementById('campanhasItem');
  const submenu = campanhasItem?.querySelector('.submenu');

  const openModalBtn = document.getElementById('openModal');
  const modal = document.getElementById('modal');
  const closeModalBtn = document.getElementById('closeModal');

  const toastBtn = document.getElementById('toastBtn');
  const toast = document.getElementById('toast');

  const form = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  // ---- helpers ----
  const isMobileWidth = () => window.innerWidth <= 768;

  // debounce helper
  const debounce = (fn, wait = 50) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  // ---- Header scroll (debounced) ----
  const handleScroll = debounce(() => {
    if (!siteHeader) return;
    siteHeader.classList.toggle('scrolled', window.scrollY > 50);
  }, 40);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Hamburger toggle ----
  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('active');

      // Ensure submenu hidden when opening mobile nav
      if (!expanded && submenu) submenu.style.display = 'none';
    });

    // Close mobile nav when clicking any anchor (improves UX)
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        if (isMobileWidth() && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          // hide submenu too
          if (submenu) submenu.style.display = 'none';
        }
      });
    });
  }

  // ---- Submenu: hover desktop (CSS) + click toggle mobile ----
  if (campanhasItem && submenu) {
    campanhasItem.addEventListener('click', (e) => {
      // only handle mobile behavior
      if (!isMobileWidth()) return;

      // If the click target is the parent link, toggle submenu instead of navigating
      const parentLink = campanhasItem.querySelector('a');
      if (parentLink && (e.target === parentLink || parentLink.contains(e.target))) {
        e.preventDefault();
        const shown = window.getComputedStyle(submenu).display !== 'none';
        submenu.style.display = shown ? 'none' : 'flex';
      }
    });

    // click outside closes mobile submenu
    document.addEventListener('click', (e) => {
      if (!isMobileWidth()) return;
      if (!campanhasItem.contains(e.target) && submenu) submenu.style.display = 'none';
    });

    // on resize, ensure submenu state resets
    window.addEventListener('resize', debounce(() => {
      if (!isMobileWidth() && submenu) {
        submenu.style.display = ''; // allow CSS hover to handle it
      }
    }, 120));
  }

  // ---- Modal logic ----
  function openModal() {
    if (!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (openModalBtn && modal && closeModalBtn) {
    openModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // ---- Toast ----
  function showToast(message = '', duration = 3200) {
    if (!toast) return;
    // reset
    toast.classList.remove('show');
    toast.style.opacity = '0';
    toast.textContent = message;
    // small delay to allow CSS transitions
    requestAnimationFrame(() => {
      toast.classList.add('show');
      toast.style.opacity = '1';
    });
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.classList.remove('show'), 300);
    }, duration);
  }
  toastBtn?.addEventListener('click', () => showToast('🔔 Você será notificado sobre novos episódios!', 3500));

  // ---- Form validation & fake submit ----
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = Array.from(form.querySelectorAll('input, textarea'));
      fields.forEach(field => {
        const msgEl = form.querySelector(`.invalid-msg[data-for="${field.id}"]`);
        if (msgEl) msgEl.textContent = '';
        field.classList.remove('invalid');

        if (!field.checkValidity()) {
          valid = false;
          field.classList.add('invalid');
          if (msgEl) msgEl.textContent = 'Campo inválido ou incompleto.';
        }
      });

      if (valid) {
        showToast('✅ Mensagem enviada com sucesso!', 2500);
        if (formFeedback) {
          formFeedback.textContent = 'Mensagem enviada — obrigado!';
          formFeedback.classList.remove('error');
          formFeedback.classList.add('success');
        }
        form.reset();
      } else {
        if (formFeedback) {
          formFeedback.textContent = '⚠️ Verifique os campos destacados.';
          formFeedback.classList.remove('success');
          formFeedback.classList.add('error');
        }
      }
    });
  }

  // ---- Smooth scroll for in-page links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        // close mobile nav if open
        if (mainNav?.classList.contains('active')) {
          mainNav.classList.remove('active');
          hamburger?.setAttribute('aria-expanded', 'false');
        }
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Accessibility: ESC closes modal/menu and submenu ----
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal?.classList.contains('active')) closeModal();
      if (mainNav?.classList.contains('active')) {
        mainNav.classList.remove('active');
        hamburger?.setAttribute('aria-expanded', 'false');
      }
      if (submenu) submenu.style.display = 'none';
    }
  });

  // Optional: expose showToast globally if you want to call from HTML
  window.showToast = showToast;
})();
