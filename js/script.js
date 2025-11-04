// === MENU HAMBÚRGUER ===
const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("mainNav");

hamburger.addEventListener("click", () => {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !expanded);
  nav.classList.toggle("active");
  document.body.classList.toggle("no-scroll", !expanded);
});

// Fecha o menu ao clicar em um link
nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    hamburger.setAttribute("aria-expanded", false);
    document.body.classList.remove("no-scroll");
  });
});

// === MODAL (TRAILER) ===
const modal = document.getElementById("modal");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");

openModalBtn.addEventListener("click", () => {
  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
});

closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
}

// === TOAST ===
const toast = document.getElementById("toast");
const toastBtn = document.getElementById("toastBtn");

toastBtn.addEventListener("click", () => {
  showToast("🔔 Você será notificado do próximo episódio!");
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// === VALIDAÇÃO DO FORMULÁRIO ===
const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("input, textarea").forEach((field) => {
    const msg = form.querySelector(`.invalid-msg[data-for="${field.id}"]`);
    msg.textContent = "";

    if (!field.checkValidity()) {
      msg.textContent = "Campo inválido ou incompleto.";
      valid = false;
    }
  });

  if (valid) {
    feedback.textContent = "✅ Mensagem enviada com sucesso!";
    feedback.className = "feedback success";
    form.reset();
  } else {
    feedback.textContent = "⚠️ Verifique os campos destacados.";
    feedback.className = "feedback error";
  }
});

// === ANIMAÇÕES SUAVES DE SCROLL ===
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach(link => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// === EFEITO HEADER AO ROLAR ===
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
});
