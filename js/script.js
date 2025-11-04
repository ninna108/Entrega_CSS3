/* Main JS otimizado: header dinâmico, menu responsivo, submenu, modal, toast, formulário e rolagem suave */

// ---- DOM elements ----
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

// ---- Header shrink on scroll (com debounce para performance) ----
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 50);
  }, 50);
});

// ---- Hamburger toggle (mobile) ----
if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('active');

    if (!expanded && submenu) submenu.style.display = 'none';
  });

  // Fecha o menu ao clicar em qualquer link
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

// ---- Submenu (hover no desktop e clique no mobile) ----
if (campanhasItem && submenu) {
  campanhasItem.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      const isParent = e.target === campanhasItem.querySelector('a');
      if (isParent) {
        e.preventDefault();
        submenu.style.display =
          submenu.style.display === 'flex' ? 'none' : 'flex';
      }
    }
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !campanhasItem.contains(e.target)) {
      submenu.style.display = 'none';
    }
  });
}

// ---- Modal logic ----
if (openModalBtn && modal && closeModalBtn) {
  openModalBtn.addEventListener('click', () => openModal());
  closeModalBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function openModal() {
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// ---- Toast ----
function showToast(message, duration = 3200) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  toast.style.opacity = '1';

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.classList.remove('show'), 300);
  }, duration);
}

toastBtn?.addEventListener('click', () =>
  showToast('🔔 Você será notificado sobre novos episódios!', 3500)
);

// ---- Form validation ----
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('input, textarea').forEach((field) => {
      const msg = form.querySelector(`.invalid-msg[data-for="${field.id}"]`);
      msg && (msg.textContent = '');
      if (!field.checkValidity()) {
        valid = false;
        msg && (msg.textContent = 'Campo inválido ou incompleto.');
        field.classList.add('invalid');
      } else {
        field.classList.remove('invalid');
      }
    });

    if (valid) {
      showToast('✅ Mensagem enviada com sucesso!', 2500);
      formFeedback?.classList.remove('error');
      formFeedback?.classList.add('success');
      formFeedback.textContent = 'Mensagem enviada — obrigado!';
      form.reset();
    } else {
      formFeedback?.classList.remove('success');
      formFeedback?.classList.add('error');
      formFeedback.textContent = '⚠️ Verifique os campos destacados.';
    }
  });
}

// ---- Smooth scroll para links internos ----
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      mainNav?.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Acessibilidade: fechar modal/menu com ESC ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modal?.classList.contains('active')) closeModal();
    if (mainNav?.classList.contains('active')) {
      mainNav.classList.remove('active');
      hamburger?.setAttribute('aria-expanded', 'false');
    }
    submenu && (submenu.style.display = 'none');
  }
});
