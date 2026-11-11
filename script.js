/* =========================================================
   GARAGE MILLE — Scripts (vanilla JS, aucune dépendance)
   ========================================================= */

/* ---- Réglages rapides ---- */
const CONFIG = {
  phoneDisplay: "03 22 29 40 71",
  // Numéro WhatsApp au format international SANS + ni espaces (ex. "33612345678").
  // Laisser vide pour masquer le bouton WhatsApp de la barre mobile.
  whatsapp: "",
  whatsappMessage: "Bonjour, je souhaite des informations auprès du Garage Mille.",
  // Horaires : jour (0 = dimanche … 6 = samedi) → plages [ouverture, fermeture] en heures décimales
  hours: {
    1: [[8, 12], [14, 18]],
    2: [[8, 12], [14, 18]],
    3: [[8, 12], [14, 18]],
    4: [[8, 12], [14, 18]],
    5: [[8, 12], [14, 18]],
    6: [[8, 12]],
  },
};

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Images : si la photo JPG est absente, on affiche le visuel de remplacement ---- */
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    const useFallback = () => { if (img.dataset.fallback && !img.src.endsWith(img.dataset.fallback)) img.src = img.dataset.fallback; };
    if (img.complete && img.naturalWidth === 0) useFallback();
    else img.addEventListener("error", useFallback, { once: true });
  });

  /* ---- Menu burger ---- */
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const setMenu = (open) => {
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
  };
  burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---- Ombre de l'en-tête au défilement ---- */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Statut « ouvert / fermé » (avec pause de midi) + jour en surbrillance ---- */
  const now = new Date();
  const day = now.getDay();
  const h = now.getHours() + now.getMinutes() / 60;
  const fmt = (x) => { const m = Math.round((x % 1) * 60); return `${Math.floor(x)}h${m ? String(m).padStart(2, "0") : ""}`; };
  const names = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const status = document.getElementById("status");
  const slots = CONFIG.hours[day] || [];
  const current = slots.find(([o, c]) => h >= o && h < c);
  if (current) {
    status.textContent = `Ouvert maintenant · jusqu’à ${fmt(current[1])}`;
    status.classList.add("is-open");
  } else {
    const laterToday = slots.find(([o]) => h < o);
    let text;
    if (laterToday) {
      text = `Fermé · ouvre aujourd’hui à ${fmt(laterToday[0])}`;
    } else {
      let next = 1;
      while (!CONFIG.hours[(day + next) % 7] && next < 7) next++;
      const nextDay = (day + next) % 7;
      const when = next === 1 ? "demain" : names[nextDay];
      text = `Fermé · ouvre ${when} à ${fmt(CONFIG.hours[nextDay][0][0])}`;
    }
    status.textContent = text;
    status.classList.add("is-closed");
  }
  const row = document.querySelector(`.hours tr[data-day="${day}"]`);
  if (row) row.classList.add("is-today");

  /* ---- WhatsApp ---- */
  const wa = document.getElementById("wa-btn");
  if (CONFIG.whatsapp) {
    wa.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;
    wa.hidden = false;
  }

  /* ---- Boutons « rendez-vous / je cherche un véhicule » → pré-remplit l'objet du formulaire ---- */
  const objet = document.getElementById("f-type");
  document.querySelectorAll("[data-objet]").forEach((link) => {
    link.addEventListener("click", () => {
      const opt = [...objet.options].find((o) => o.text === link.dataset.objet);
      if (opt) objet.value = opt.value;
    });
  });

  /* ---- Lien actif dans la navigation ---- */
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

  /* ---- Apparition douce au défilement ---- */
  const revealEls = document.querySelectorAll(".section__head, .car, .brands, .vehicles__cta, .service, .about__media, .about__text, .review, .contact__grid > *, .contact__map");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }

  /* ---- Formulaire Web3Forms ---- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const dateInput = document.getElementById("f-date");
  dateInput.min = now.toISOString().slice(0, 10);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const key = form.querySelector('[name="access_key"]').value;
    if (!key || key === "VOTRE_CLE_WEB3FORMS") {
      formStatus.textContent = `Formulaire pas encore configuré : appelez-nous au ${CONFIG.phoneDisplay}.`;
      formStatus.className = "form__status is-error";
      return;
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    formStatus.textContent = "Envoi en cours…";
    formStatus.className = "form__status";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      form.reset();
      formStatus.textContent = "Merci ! Votre demande a bien été envoyée, nous vous rappelons rapidement.";
      formStatus.className = "form__status is-ok";
    } catch {
      formStatus.textContent = `Oups, l’envoi a échoué. Réessayez ou appelez-nous au ${CONFIG.phoneDisplay}.`;
      formStatus.className = "form__status is-error";
    } finally {
      btn.disabled = false;
    }
  });

  /* ---- Année du pied de page ---- */
  document.getElementById("year").textContent = now.getFullYear();
});
