// main.js

document.addEventListener('DOMContentLoaded', () => {
  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  hamburger.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open');
  });

  // Mobile submenu toggle
  document.querySelectorAll('.has-submenu > a').forEach(link => {
    link.addEventListener('click', (e) => {
      // only on small screens open submenu inline
      if (window.innerWidth <= 720) {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('open');
        const expanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', String(!expanded));
      }
    });
  });

  // Modal
  const modal = document.getElementById('modal');
  const openModalBtn = document.getElementById('openModal');
  const closeModalBtn = document.getElementById('closeModal');

  if (openModalBtn) openModalBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });
  // close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Toast
  const toast = document.getElementById('toast');
  const toastBtn = document.getElementById('toastBtn');
  function showToast(message, timeout = 3000) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, timeout);
  }
  if (toastBtn) toastBtn.addEventListener('click', () => {
    showToast('Você será notificado quando sair o próximo episódio!');
  });

  // Form validation (visual only)
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements['name'];
      const email = form.elements['email'];
      const message = form.elements['message'];
      let valid = true;

      // reset visuals
      [name, email, message].forEach(el => {
        el.classList.remove('invalid');
        const msgEl = document.querySelector(`.invalid-msg[data-for="${el.id}"]`);
        if (msgEl) msgEl.textContent = '';
      });

      if (!name.value || name.value.trim().length < 2) {
        valid = false;
        name.classList.add('invalid');
        document.querySelector('.invalid-msg[data-for="name"]').textContent = 'Informe um nome válido (mín. 2 caracteres)';
      }
      if (!email.value || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value)) {
        valid = false;
        email.classList.add('invalid');
        document.querySelector('.invalid-msg[data-for="email"]').textContent = 'Informe um email válido';
      }
      if (!message.value || message.value.trim().length < 10) {
        valid = false;
        message.classList.add('invalid');
        document.querySelector('.invalid-msg[data-for="message"]').textContent = 'Mensagem muito curta (mín. 10 caracteres)';
      }

      const feedback = document.getElementById('formFeedback');
      if (!valid) {
        feedback.textContent = 'Corrija os erros no formulário.';
        feedback.style.color = 'var(--color-danger)';
        return;
      }

      // Simula envio
      feedback.textContent = 'Enviando...';
      feedback.style.color = 'var(--color-neutral-900)';
      setTimeout(() => {
        feedback.textContent = 'Mensagem enviada com sucesso! Obrigado.';
        feedback.style.color = 'var(--color-success)';
        form.reset();
      }, 900);
    });
  }

  // Accessibility: close nav with escape and close modal with esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // close modal if open
      if (modal.getAttribute('aria-hidden') === 'false') {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      // close mobile nav
      if (mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }
  });
});
