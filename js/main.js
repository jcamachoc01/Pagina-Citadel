const ICONS = {
  bolt: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm16 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 9v3m0 0-6 4m6-4 6 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-1-2-1-2 1 0 4 2 4 6a6 6 0 0 1-12 0c0-5 3-7 3-7s-1 3 1 3c1 0 1-1 1-1 0-2-1-4 1-7z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.2" fill="#14356e"/></svg>',
  server: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v6H4V4zm0 10h16v6H4v-6z"/><circle cx="7" cy="7" r="0.8" fill="#14356e"/><circle cx="7" cy="17" r="0.8" fill="#14356e"/></svg>',
};

async function loadContent() {
  try {
    const res = await fetch("content/site.json");
    if (!res.ok) throw new Error(`No se pudo cargar el contenido (${res.status})`);
    const data = await res.json();
    renderContent(data);
  } catch (error) {
    console.error(error);
    document.getElementById("services-grid").innerHTML = '<p class="content-error">No fue posible cargar los servicios. Por favor, recarga la página.</p>';
  }
}

function whatsappUrl(number, text) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

function renderServiceCard(service) {
  const article = document.createElement("article");
  article.className = "service-card reveal-service";

  const media = document.createElement("div");
  media.className = "service-media";

  const image = document.createElement("img");
  image.src = service.image;
  image.alt = service.image_alt || service.title;
  image.loading = "lazy";
  image.decoding = "async";
  image.width = 720;
  image.height = 440;
  image.addEventListener("error", () => {
    media.classList.add("image-unavailable");
    image.remove();
  }, { once: true });

  const iconWrap = document.createElement("div");
  iconWrap.className = "service-icon";
  iconWrap.innerHTML = ICONS[service.icon] || ""; // fixed set of trusted icons, not user data

  media.append(image, iconWrap);

  const body = document.createElement("div");
  body.className = "service-body";

  const title = document.createElement("h3");
  title.textContent = service.title;

  const desc = document.createElement("p");
  desc.textContent = service.description;

  body.append(title, desc);
  article.append(media, body);
  return article;
}

function revealServices() {
  const cards = document.querySelectorAll(".reveal-service");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    cards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  cards.forEach((card, index) => {
    card.style.setProperty("--reveal-delay", `${(index % 3) * 90}ms`);
    observer.observe(card);
  });
}

function renderContent(data) {
  document.getElementById("hero-title").textContent = data.hero.title;
  document.getElementById("hero-subtitle").textContent = data.hero.subtitle;
  document.getElementById("about-title").textContent = data.about.title;
  document.getElementById("about-text").textContent = data.about.text;
  document.getElementById("mission-text").textContent = data.mission;
  document.getElementById("vision-text").textContent = data.vision;

  const grid = document.getElementById("services-grid");
  grid.replaceChildren(...data.services.map(renderServiceCard));
  revealServices();

  const c = data.contact;
  document.getElementById("contact-address").textContent = c.address;
  const emailLink = document.getElementById("contact-email");
  emailLink.textContent = c.email;
  emailLink.href = `mailto:${c.email}`;
  const phoneLink = document.getElementById("contact-phone");
  phoneLink.textContent = c.phone_display;
  phoneLink.href = `tel:+${c.whatsapp_number}`;
  document.getElementById("contact-name").textContent = c.contact_name;
  document.getElementById("contact-role").textContent = c.contact_role;

  const waText = `Hola CIDATEL, quisiera cotizar un proyecto.`;
  const waUrl = whatsappUrl(c.whatsapp_number, waText);
  document.getElementById("hero-whatsapp").href = waUrl;
  document.getElementById("contact-whatsapp-btn").href = waUrl;
  document.getElementById("whatsapp-float").href = waUrl;

  document.getElementById("footer-nit").textContent = data.company.nit;
}

document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen);
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

loadContent();
