/* Main JS: header scroll, hamburger, submenu mobile toggle, modal, toast, form validation, smooth scroll */

// ---- DOM elements ----
const siteHeader = document.getElementById('siteHeader');
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('mainNav');
const campanhasItem = document.getElementById('campanhasItem');
const submenu = campanhasItem ? campanhasItem.querySelector('.submenu') : null;

const openModalBtn = document.getElementById('openModal');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');

const toastBtn = document.getElementById('toastBtn');
const toast = document.getElementById('toast');

const form = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

// ---- Header shrink on scroll ----
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) siteHeader.classList.add('scrolled');
  else siteHeader.classList.remove('scrolled');
});

// ---- Hamburger toggle (mobile) ----
hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  mainNav.classList.toggle('active');

  // When mainNav opens on mobile, ensure submenu collapsed
  if (!expanded && submenu) submenu.style.display = 'none';
});

// Close mobile nav when clicking a nav link (and collapse submenu)
mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', (e) => {
    // if link is an anchor to a section, close mobile nav
    if (window.innerWidth <= 768) {
      mainNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
});

// ---- Submenu behavior: desktop hover is pure CSS (keeps your request).
// For mobile/touch, toggle submenu on first tap on the parent item.
if (campanhasItem) {
  campanhasItem.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      // if click target is a link inside campaigns, allow default when selecting an option
      const isParentLink = e.target === campanhasItem.querySelector('a');
      if (isParentLink) {
        e.preventDefault();
        // toggle submenu
        const shown = window.getComputedStyle(submenu).display !== 'none';
        submenu.style.display = shown ? 'none' : 'flex';
      }
    }
  });

  // Close submenu if clicking outside (mobile)
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!campanhasItem.contains(e.target)) {
        if (submenu) submenu.style.display = 'none';
      }
    }
  });
}

// ---- Modal logic ----
if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}
function closeModal(){
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

// ---- Toast ----
function showToast(message, ms = 3200){
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  // remove previous timer if any
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, ms);
}
if (toastBtn) {
  toastBtn.addEventListener('click', () => showToast('🔔 Você será notificado sobre novos episódios!', 3500));
}

// ---- Form validation and fake submit ----
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
      const msg = form.querySelector(`.invalid-msg[data-for="${field.id}"]`);
      if (msg) msg.textContent = '';
      if (!field.checkValidity()) {
        valid = false;
        if (msg) msg.textContent = 'Campo inválido ou incompleto.';
        field.classList.add('invalid');
      } else {
        field.classList.remove('invalid');
      }
    });

    if (valid) {
      // simulate sending
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

// ---- Smooth anchor scroll for in-page links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e){
    const targetId = this.getAttribute('href');
    // allow links for submenu parent (when it's "#campanhas") to behave normally
    if (targetId === '#' || targetId === '') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      // close mobile nav for better UX
      if (mainNav.classList.contains('active')) {
        mainNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// ---- Accessibility: close modal with Esc ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal && modal.classList.contains('active')) closeModal();
    if (mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      hamburger.setAttribute('aria-expanded','false');
    }
    // close submenu on mobile
    if (submenu) submenu.style.display = 'none';
  }
});
