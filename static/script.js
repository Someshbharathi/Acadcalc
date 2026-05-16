/**
 * AcadCalc — landing page interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const navLinks = document.querySelectorAll(".nav__link");
  const sectionIds = ["home", "calculator", "features", "about"];

  // Match sticky nav height from CSS
  const navHeight =
    parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"), 10) || 72;
  const scrollOffset = navHeight + 12;

  function setActiveNav(sectionId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("nav__link--active", href === `#${sectionId}`);
    });
  }

  function scrollToTarget(target) {
    const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  // Highlight nav link for the section currently in view
  function updateActiveOnScroll() {
    const scrollPos = window.scrollY + scrollOffset + 80;
    let current = "home";

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollPos) {
        current = id;
      }
    }

    setActiveNav(current);
  }

  // Smooth scroll for all in-page links (navbar, buttons, etc.)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;

      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      scrollToTarget(target);

      // If the hash is a tracked section, update nav immediately
      const id = hash.slice(1);
      if (sectionIds.includes(id)) {
        setActiveNav(id);
      }
    });
  });

  window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
  updateActiveOnScroll();

  // Mobile navigation
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  const navInner = document.querySelector(".nav__inner");

  if (toggle && menu && navInner) {
    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("is-open");
      navInner.classList.toggle("nav--open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        navInner.classList.remove("nav--open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }
});
